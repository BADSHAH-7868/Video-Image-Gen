// /api/video.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    // Prepare parameters for the external API
    const params = new URLSearchParams({
      prompt: req.body.prompt || '',
      type: req.body.type || 'text',
      imageUrl: req.body.imageUrl || '',
      isPremium: req.body.isPremium === 'true' ? 'true' : 'false',
    });

    // Send request to your real AI API
    const response = await fetch('https://omegatech-api.dixonomega.tech/api/ai/Txt2video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    // Forward the API response back to the frontend
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('Video API Error:', err);
    res.status(500).json({
      error: 'Video generation failed. Please try again later.',
      details: err.message,
    });
  }
}
