import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, effect } = req.body;
    
    console.log(`🎬 Генерация видео: эффект "${effect}"`);

    // Simulate video generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock video URLs for different effects
    const mockVideos: Record<string, string> = {
      'zoom-in': 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-neon-lights-1240-large.mp4',
      'pan': 'https://assets.mixkit.co/videos/preview/mixkit-glowing-neon-lights-1174-large.mp4',
      'fire': 'https://assets.mixkit.co/videos/preview/mixkit-fire-and-sparks-1546-large.mp4',
      'glitch': 'https://assets.mixkit.co/videos/preview/mixkit-computer-code-on-screen-1172-large.mp4',
    };

    return res.status(200).json({ 
      videoUrl: mockVideos[effect] || mockVideos['zoom-in'], 
      duration: 4, 
      effect 
    });

  } catch (error) {
    console.error('❌ Video generation error:', error);
    return res.status(500).json({ error: 'Video generation failed' });
  }
}

