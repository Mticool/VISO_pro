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
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`🔍 Perplexity Research: "${topic}"`);

    const perplexityKey = process.env.PERPLEXITY_API_KEY;

    if (!perplexityKey) {
      console.log('⚠️ No Perplexity API key, skipping research');
      return res.status(200).json({ context: '', skipped: true });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Ты — исследователь. Найди самую свежую и актуальную информацию по теме. Верни краткую выжимку на русском языке: ключевые факты, статистику, тренды, новости. Формат: bullet points. Максимум 300 слов.'
          },
          {
            role: 'user',
            content: `Найди актуальную информацию по теме: "${topic}"`
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const context = data.choices?.[0]?.message?.content || '';

    console.log(`✅ Research complete (${context.length} chars)`);

    return res.status(200).json({ context });

  } catch (error) {
    console.error('❌ Research error:', error);
    return res.status(200).json({ context: '', error: true });
  }
}

