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
    const { prompt } = req.body;
    
    // For now, we use Unsplash as a fallback for AI images
    // In production, this would connect to Kie.ai, Replicate, or similar
    const query = prompt?.split(' ').slice(0, 3).join(' ') || 'abstract';
    
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!unsplashKey) {
      return res.status(200).json({ 
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 
        fallback: true,
        source: 'ai'
      });
    }

    const unsplashUrl = new URL('https://api.unsplash.com/photos/random');
    unsplashUrl.searchParams.set('client_id', unsplashKey);
    unsplashUrl.searchParams.set('query', query);
    unsplashUrl.searchParams.set('orientation', 'portrait');

    const response = await fetch(unsplashUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Image API error: ${response.status}`);
    }

    const data = await response.json();
    const photo = Array.isArray(data) ? data[0] : data;

    return res.status(200).json({ 
      url: photo?.urls?.regular,
      source: 'ai'
    });

  } catch (error) {
    console.error('❌ AI image error:', error);
    return res.status(500).json({ error: 'AI image generation failed' });
  }
}

