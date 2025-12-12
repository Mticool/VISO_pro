import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle both GET (query params) and POST (body)
    let query = 'abstract dark';
    let prompt = '';
    let mode = 'stock'; // 'stock' or 'ai'

    if (req.method === 'GET') {
      query = (req.query.query as string) || query;
    } else if (req.method === 'POST') {
      prompt = req.body?.prompt || '';
      mode = req.body?.mode || 'stock';
      query = prompt?.split(' ').slice(0, 3).join(' ') || query;
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!unsplashKey) {
      // Fallback to curated images
      return res.status(200).json({ 
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 
        fallback: true,
        source: mode
      });
    }

    const unsplashUrl = new URL('https://api.unsplash.com/photos/random');
    unsplashUrl.searchParams.set('client_id', unsplashKey);
    unsplashUrl.searchParams.set('query', query);
    unsplashUrl.searchParams.set('orientation', 'portrait');

    const response = await fetch(unsplashUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    const photo = Array.isArray(data) ? data[0] : data;

    return res.status(200).json({ 
      url: photo?.urls?.regular,
      source: mode
    });

  } catch (error) {
    console.error('❌ Image fetch error:', error);
    return res.status(200).json({ 
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 
      fallback: true 
    });
  }
}

