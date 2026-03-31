// Vercel Serverless Function: /api/token.js
// This creates a secure, temporary token for the React frontend to use Gemini Live Audio

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server environment.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-live-preview:generateEphemeralToken?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            response_modalities: ["AUDIO"],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: { voice_name: "Kore" }
              }
            }
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return res.status(500).json({ error: 'Token generation failed' });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token });

  } catch (error) {
    console.error('Token fetch error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching token' });
  }
}
