import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Local Dev Plugin to handle the token securely
const geminiTokenPlugin = (env: Record<string, string>) => ({
  name: 'gemini-token',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      // Intercept /api/token exactly, ignoring the other /api proxy
      if (req.url === '/api/token' && req.method === 'GET') {
        const rawApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
        if (!rawApiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Missing API Key" }));
          return;
        }
        const apiKey = rawApiKey.replace(/['"]/g, '').trim();
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateEphemeralToken?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              config: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } }
            })
          });
          const text = await response.text();
          if (!response.ok) {
            console.error("Gemini API Error:", response.status, text);
            throw new Error(`Gemini API Error ${response.status}: ${text || 'Empty response'}`);
          }
          const data = JSON.parse(text || '{}');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (e: any) {
          console.error('Local Token Error:', e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "::",
    port: 8080,
    allowedHosts: ["vcniti-productai.onrender.com"], // 👈 add your host here
    proxy: {
      // Ignore /api/token so the middleware handles it, proxy everything else
      "^/api/(?!token).*": {
        target: "https://productor-predictor-ai-backend.vercel.app",
        changeOrigin: true,
      },
    },
  },
    plugins: [
      geminiTokenPlugin(env),
      react(), 
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});