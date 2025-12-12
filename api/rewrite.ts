import Anthropic from '@anthropic-ai/sdk';
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

    const commandInstruction = REWRITE_COMMANDS[command] || REWRITE_COMMANDS.fix;

    const anthropic = new Anthropic({ 
      apiKey: process.env.ANTHROPIC_API_KEY 
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: `Перепиши текст. Отвечай ТОЛЬКО готовым текстом на русском, без пояснений.`,
      messages: [{ role: 'user', content: `Текст: "${text}"\n\nЗадача: ${commandInstruction}` }],
    });

    const result = message.content[0].type === 'text' ? message.content[0].text.trim() : text;

    return res.status(200).json({ result });

  } catch (error) {
    console.error('❌ Ошибка rewrite:', error);
    return res.status(500).json({ error: 'Failed to rewrite' });
  }
}

