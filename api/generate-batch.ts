import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BATCH_SYSTEM_PROMPT = `Ты создаёшь 4 РАЗНЫЕ концепции обложек для одной темы.
Каждая концепция должна быть уникальной по стилю и подходу.

Верни СТРОГО JSON (без markdown):
{
  "concepts": [
    {
      "style": "emotional",
      "title": "Короткий цепляющий заголовок (3-5 слов, РУССКИЙ)",
      "imagePrompt": "emotional close-up portrait, dramatic lighting, human face with strong emotion, cinematic, 4k, professional photography"
    },
    {
      "style": "minimal",
      "title": "Минималистичный заголовок (РУССКИЙ)",
      "imagePrompt": "minimalist background, clean design, simple geometric shapes, lots of negative space, modern aesthetic, high contrast"
    },
    {
      "style": "3d",
      "title": "Яркий заголовок (РУССКИЙ)",
      "imagePrompt": "3d render, cinema4d, octane render, vibrant neon colors, abstract floating shapes, futuristic, glossy materials"
    },
    {
      "style": "mystery",
      "title": "Интригующий заголовок (РУССКИЙ)",
      "imagePrompt": "mysterious atmosphere, dark moody lighting, silhouette, dramatic shadows, fog, cinematic noir style"
    }
  ]
}

ПРАВИЛА:
- Заголовки: ТОЛЬКО на русском, короткие (3-5 слов), цепляющие
- imagePrompt: ТОЛЬКО на английском, детальные, разные для каждого стиля
- Каждая концепция должна быть УНИКАЛЬНОЙ
- Стили должны сильно отличаться друг от друга`;

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
    const { topic, platform = 'youtube', cleanMode = false } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`🎨 Пакетная генерация 4 вариантов: "${topic}"`);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = cleanMode 
      ? BATCH_SYSTEM_PROMPT.replace(/title.*РУССКИЙ\)/g, 'title: ""') 
      : BATCH_SYSTEM_PROMPT;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ 
        role: 'user', 
        content: `Тема: "${topic}"\nПлатформа: ${platform}\n${cleanMode ? 'ВАЖНО: Оставь все title пустыми - генерируем только фоны без текста.' : ''}`
      }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleanedJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedJson);
    const concepts = parsed.concepts || [];

    console.log(`✅ Сгенерировано ${concepts.length} концепций`);

    return res.status(200).json({ concepts });

  } catch (error) {
    console.error('❌ Ошибка пакетной генерации:', error);
    
    const fallbackConcepts = [
      { style: 'emotional', title: 'Эмоциональный вариант', imagePrompt: 'emotional portrait dramatic lighting' },
      { style: 'minimal', title: 'Минималистичный вариант', imagePrompt: 'minimalist clean background modern' },
      { style: '3d', title: '3D вариант', imagePrompt: '3d render vibrant colors abstract' },
      { style: 'mystery', title: 'Загадочный вариант', imagePrompt: 'mysterious dark moody atmosphere' },
    ];

    return res.status(200).json({ concepts: fallbackConcepts, fallback: true });
  }
}

