import type { VercelRequest, VercelResponse } from '@vercel/node';

const REWRITE_COMMANDS: Record<string, string> = {
  shorten: 'Сократи текст, сохранив главную мысль.',
  funny: 'Добавь юмора и иронии.',
  formal: 'Перепиши в официальном деловом стиле.',
  clickbait: 'Сделай максимально кликбейтным.',
  fix: 'Исправь ошибки, улучши читаемость.',
};

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
    const { text, command } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const commandInstruction = REWRITE_COMMANDS[command] || REWRITE_COMMANDS.fix;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://viso-pro.vercel.app',
        'X-Title': 'VISO App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { 
            role: 'system', 
            content: 'Перепиши текст. Отвечай ТОЛЬКО готовым текстом на русском, без пояснений.' 
          },
          { 
            role: 'user', 
            content: `Текст: "${text}"\n\nЗадача: ${commandInstruction}` 
          }
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() || text;

    return res.status(200).json({ result });

  } catch (error) {
    console.error('❌ Ошибка rewrite:', error);
    return res.status(500).json({ error: 'Failed to rewrite' });
  }
}
