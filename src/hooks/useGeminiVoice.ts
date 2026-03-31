import { useState, useRef, useCallback, useEffect } from 'react';

const VCNITI_API_BASE = 'https://vcniti-website-backend-sever-from-s.vercel.app/api/shopify/ai-feed';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are the VCNITI Voice Shopping Assistant for construction materials in Bangalore, India.

ROLE: Help customers check product prices, availability, and place orders via voice.

BEHAVIOR:
- Respond in whatever language the customer speaks (Hindi, Kannada, Tamil, Telugu, English, etc.)
- Keep product names, prices (₹), and brand names in English regardless of language
- Be concise — voice responses should be short and clear (2-3 sentences max)
- Always mention the price and availability
- For ordering, direct them to vcniti.com or WhatsApp 9740059699
- New customers get free shipping with code VCNITIFIRST

WHEN A CUSTOMER ASKS ABOUT A PRODUCT:
1. Use the searchProducts function to find matching products
2. Tell them the product name, brand, price, and if it's in stock
3. Mention 2-4 hour delivery in Bangalore
4. Offer to help find more products

WHEN A CUSTOMER ASKS FOR RECOMMENDATIONS:
1. Ask what they need it for (which room, what surface, interior/exterior)
2. Search for relevant products
3. Suggest 2-3 options at different price points

IF PRODUCT NOT FOUND:
Say "I don't have that in my catalog right now. You can check vcniti.com or WhatsApp us at 9740059699 for the latest stock."

IMPORTANT:
- Only recommend products from VCNITI catalog
- Never make up prices — only use data from the searchProducts function
- Service area is Bangalore only
- Be warm and helpful, like a knowledgeable hardware store owner`;

const TOOL_DECLARATIONS = [
  {
    functionDeclarations: [
      {
        name: 'searchProducts',
        description: 'Search VCNITI product catalog by brand, category, or keyword. Always use at least one parameter.',
        parameters: {
          type: 'OBJECT',
          properties: {
            brand: {
              type: 'STRING',
              description: "Filter by brand name, e.g. 'havells', 'asian paints', 'ultratech', 'birla opus', 'polycab', 'supreme', 'bosch'"
            },
            category: {
              type: 'STRING',
              description: "Filter by category, e.g. 'cement', 'paints', 'plumbing', 'electricals', 'hardware', 'tools', 'enamel', 'waterproofing'"
            },
            search: {
              type: 'STRING',
              description: "Search by keyword in product name/description, e.g. 'ceiling fan', 'tile adhesive', 'LED bulb', 'CPVC pipe', 'wall putty'"
            }
          }
        }
      },
      {
        name: 'getOrderInfo',
        description: 'Get ordering and delivery information for VCNITI',
        parameters: {
          type: 'OBJECT',
          properties: {}
        }
      }
    ]
  }
];

export function useGeminiVoice() {
  const [status, setStatus] = useState<string>('Tap the mic to connect');
  const [statusType, setStatusType] = useState<'normal' | 'listening' | 'speaking' | 'error'>('normal');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role, text }]);
  }, []);

  const playAudio = useCallback((base64Data: string) => {
    try {
      const playbackCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const bytes = atob(base64Data);
      const buffer = new ArrayBuffer(bytes.length);
      const view = new Uint8Array(buffer);
      
      for (let i = 0; i < bytes.length; i++) {
        view[i] = bytes.charCodeAt(i);
      }

      const pcm16 = new Int16Array(buffer);
      const float32 = new Float32Array(pcm16.length);
      
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      const audioBuffer = playbackCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const sourceNode = playbackCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(playbackCtx.destination);
      sourceNode.start();
      
      setIsSpeaking(true);
      
      sourceNode.onended = () => {
        setIsSpeaking(false);
        playbackCtx.close();
      };
    } catch (err) {
      console.error('Audio playback error', err);
    }
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const callVcnitiApi = async (args: any) => {
    try {
      const params = new URLSearchParams();
      if (args.brand) params.set('brand', args.brand);
      if (args.category) params.set('category', args.category);
      if (args.search) params.set('search', args.search);

      const url = `${VCNITI_API_BASE}?${params.toString()}`;
      console.log('Calling VCNITI API:', url);

      const response = await fetch(url);
      const data = await response.json();

      const products = (data.products || []).slice(0, 8).map((p: any) => ({
        name: p.name,
        brand: p.brand,
        price: p.price?.amount,
        priceRange: p.price?.range,
        availability: p.availability,
        url: p.productPageUrl,
        delivery: p.delivery,
        variants: (p.variants || []).slice(0, 4).map((v: any) => ({
          name: v.name,
          price: v.price,
          inStock: v.inStock
        }))
      }));

      return {
        productCount: products.length,
        totalInCatalog: data._meta?.productCount || 0,
        products: products,
        note: products.length === 0 
          ? "No products found for this search. Suggest customer check vcniti.com or WhatsApp 9740059699."
          : `Found ${products.length} products. Use the exact productPageUrl when mentioning product links.`
      };

    } catch (error) {
      console.error('API call failed:', error);
      return {
        error: true,
        message: "Couldn't fetch product data right now. Direct customer to vcniti.com or WhatsApp 9740059699."
      };
    }
  };

  const handleToolCall = async (toolCall: any) => {
    const functionCalls = toolCall.functionCalls || [];
    const responses = [];

    for (const call of functionCalls) {
      let result;

      if (call.name === 'searchProducts') {
        result = await callVcnitiApi(call.args);
      } else if (call.name === 'getOrderInfo') {
        result = {
          delivery: "2-4 hours across all Bangalore areas",
          minimumOrder: "No minimum — 1 piece to full truckload",
          payment: "UPI, Cards, Cash on Delivery, Net Banking",
          orderChannels: [
            "Website: www.vcniti.com",
            "WhatsApp: 9740059699",
            "VCNITI App"
          ],
          newUserCoupon: "VCNITIFIRST — free shipping for new users",
          serviceArea: "All Bengaluru (70+ neighborhoods)"
        };
      }

      responses.push({
        id: call.id,
        name: call.name,
        response: result
      });
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        toolResponse: {
          functionResponses: responses
        }
      }));
    }
  };

  const startListening = async () => {
    try {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextCtor({ sampleRate: 16000 });
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true 
        } 
      });

      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        if (!isListening || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-32768, Math.min(32767, Math.floor(inputData[i] * 32768)));
        }

        const base64Audio = arrayBufferToBase64(pcm16.buffer);
        
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64Audio
            }]
          }
        }));
      };

      setIsListening(true);
      setStatus('Listening...');
      setStatusType('listening');

    } catch (error) {
      console.error('Microphone error:', error);
      setStatus('Microphone access denied');
      setStatusType('error');
    }
  };

  const stopListening = useCallback(() => {
    setIsListening(false);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('Tap to start talking');
    setStatusType('normal');
  }, []);

  const connectToGemini = async () => {
    try {
      setStatus('Connecting...');
      
      // 🚀 HITS LOCAL VITE MIDDLEWARE OR VERCEL SERVERLESS FUNCTION PERFECTLY
      const tokenRes = await fetch('/api/token');
      if (!tokenRes.ok) throw new Error('Failed to get token');
      
      const tokenData = await tokenRes.json();
      const token = tokenData.token;

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to Gemini Live API');
        
        const setupMsg = {
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Kore" 
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            tools: TOOL_DECLARATIONS
          }
        };
        
        wsRef.current?.send(JSON.stringify(setupMsg));
        setStatus('Ready — tap the mic to talk');
        setStatusType('normal');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.setupComplete) {
          console.log('Session ready');
          return;
        }

        if (data.toolCall) {
          handleToolCall(data.toolCall);
          return;
        }

        if (data.serverContent) {
          const parts = data.serverContent.modelTurn?.parts || [];
          
          for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType?.includes('audio')) {
              playAudio(part.inlineData.data);
              setStatus('Speaking...');
              setStatusType('speaking');
            }
            if (part.text) {
              addMessage('assistant', part.text);
            }
          }

          if (data.serverContent.turnComplete) {
            setStatus('Listening...');
            setStatusType('listening');
          }
        }

        if (data.serverContent?.inputTranscription?.text) {
          addMessage('user', data.serverContent.inputTranscription.text);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Connection error — please recreate');
        setStatusType('error');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        if (isListening) stopListening();
      };

    } catch (error) {
      console.error('Connection failed:', error);
      setStatus('Failed to connect — check API key setup');
      setStatusType('error');
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connectToGemini().then(() => {
        setTimeout(() => startListening(), 1000);
      });
      return;
    }

    startListening();
  };

  return {
    status,
    statusType,
    messages,
    isListening,
    isSpeaking,
    toggleVoice,
    stopListening
  };
}
