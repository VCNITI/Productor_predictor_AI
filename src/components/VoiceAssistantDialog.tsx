import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Mic, Square, X } from 'lucide-react';
import { useGeminiVoice } from '../hooks/useGeminiVoice';

interface VoiceAssistantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoiceAssistantDialog({ isOpen, onOpenChange }: VoiceAssistantDialogProps) {
  const {
    status,
    statusType,
    messages,
    isListening,
    isSpeaking,
    toggleVoice,
    stopListening
  } = useGeminiVoice();

  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean up mic when closed
  useEffect(() => {
    if (!isOpen) {
      stopListening();
    }
  }, [isOpen, stopListening]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0D1117] border-[#30363D] text-[#F0F6FC] p-0 overflow-hidden hide-close">
        <DialogTitle className="sr-only">VCNITI Voice Assistant</DialogTitle>
        <DialogDescription className="sr-only">Speak into your microphone to search VCNITI products and prices.</DialogDescription>
        
        <div className="flex flex-col items-center justify-center p-6 w-full relative">
          
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-2xl font-bold tracking-wider text-[#4CAF50] mb-1 text-center">
            VCNITI
          </div>
          <div className="text-[13px] text-[#8B949E] mb-8 text-center px-4">
            Voice Assistant · Construction Materials · Bangalore
          </div>

          <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
            {/* Pulsing ring when active */}
            <div 
              className={`absolute inset-0 rounded-full border-2 transition-all duration-300 pointer-events-none
                ${isListening || isSpeaking 
                  ? 'border-[#4CAF50] shadow-[0_0_40px_rgba(76,175,80,0.3),0_0_80px_rgba(76,175,80,0.3)] animate-[pulse_1.5s_ease-in-out_infinite]' 
                  : 'border-[#30363D]'}`
              }
            />
            <button
              onClick={toggleVoice}
              className={`absolute inset-4 rounded-full flex items-center justify-center transition-all duration-300 z-10
                ${isListening 
                  ? 'bg-red-500/80 text-white' 
                  : 'bg-[#161B22] text-[#8B949E] hover:bg-[#1C2333]'}`
              }
              disabled={statusType === 'error'}
            >
              {isListening ? (
                <Square size={24} fill="currentColor" className="text-white" />
              ) : (
                <Mic size={48} className={isSpeaking ? 'text-white' : 'currentColor'} />
              )}
            </button>
          </div>

          {/* Visualizer bars */}
          <div className={`flex items-center justify-center gap-1 h-6 mb-4 transition-opacity duration-300 ${isSpeaking || isListening ? 'opacity-100' : 'opacity-0'}`}>
            {[8, 16, 24, 16, 8].map((height, i) => (
              <div 
                key={i} 
                className="w-1 bg-[#4CAF50] rounded-sm"
                style={{ 
                  height: `${height}px`, 
                  animation: (isSpeaking || isListening) ? `bounce 0.6s ease-in-out infinite (${i * 0.1}s)` : 'none' 
                }}
              />
            ))}
          </div>

          <div className={`text-[15px] font-medium mb-2 min-h-[24px] text-center
            ${statusType === 'listening' ? 'text-[#4CAF50]' : ''}
            ${statusType === 'speaking' ? 'text-[#42A5F5]' : ''}
            ${statusType === 'error' ? 'text-[#EF5350]' : ''}
          `}>
            {status}
          </div>
          <div className="text-[12px] text-[#8B949E] mb-6 text-center">
            Speak in English, Hindi, Kannada, Tamil, or Telugu
          </div>

          <div 
            ref={transcriptRef}
            className="w-full bg-[#161B22] border border-[#30363D] rounded-xl p-4 max-h-[200px] overflow-y-auto text-left mb-6"
          >
            {messages.length === 0 ? (
               <div className="text-[#8B949E] text-sm text-center py-4">
                 Tap the mic and ask about any product...
               </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-sm leading-relaxed border-b border-[#30363D]/50 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-xs opacity-70 block mb-1">
                       {msg.role === 'user' ? '🎤 You' : '🏗️ VCNITI'}
                    </span>
                    <span className={msg.role === 'user' ? 'text-[#4CAF50]' : 'text-white'}>
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center flex-wrap w-full">
            <a href="https://www.vcniti.com" target="_blank" rel="noreferrer" className="text-xs text-[#8B949E] px-3 py-1.5 border border-[#30363D] rounded-full hover:text-[#4CAF50] hover:border-[#4CAF50] transition-colors">
              🌐 vcniti.com
            </a>
            <a href="https://wa.me/919740059699" target="_blank" rel="noreferrer" className="text-xs text-[#8B949E] px-3 py-1.5 border border-[#30363D] rounded-full hover:text-[#4CAF50] hover:border-[#4CAF50] transition-colors">
              💬 WhatsApp
            </a>
            <a href="tel:+919740059699" className="text-xs text-[#8B949E] px-3 py-1.5 border border-[#30363D] rounded-full hover:text-[#4CAF50] hover:border-[#4CAF50] transition-colors">
              📞 Call Us
            </a>
          </div>

        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: scaleY(0.4); }
            50% { transform: scaleY(1); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
