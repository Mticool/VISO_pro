import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy endpoint to bypass CORS when loading images for canvas export
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const imageUrl = req.query.url as string;

    if (!imageUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL
    const url = new URL(imageUrl);
    const allowedHosts = ['images.unsplash.com', 'source.unsplash.com', 'plus.unsplash.com'];
    
    if (!allowedHosts.some(host => url.hostname.includes(host))) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    return res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    console.error('❌ Image proxy error:', error);
    return res.status(500).json({ error: 'Failed to proxy image' });
  }
}

