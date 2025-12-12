import type { VercelRequest, VercelResponse } from '@vercel/node';

const SYSTEM_PROMPT = `Ты — эксперт по SMM и SEO-оптимизации контента.

Проанализируй тему и контент, затем сгенерируй:

1. **30 релевантных хештегов** для Instagram/TikTok:
   - 10 популярных (100k+ постов) на английском
   - 10 нишевых (10k-100k постов) на английском  
   - 10 на русском (микс популярных и нишевых)
   - Без символа #, просто слова

2. **SEO-описание (Alt Text)** для обложки:
   - Описание картинки для слабовидящих
   - До 125 символов
   - На русском

3. **Meta Description**:
   - Для поисковиков
   - До 160 символов
   - На русском

Верни СТРОГО JSON (без markdown блоков):
{
  "hashtags": {
    "popular_en": ["motivation", "success", ...],
    "niche_en": ["entrepreneurmindset", "startuplife", ...],
    "russian": ["мотивация", "бизнес", ...]
  },
  "altText": "Описание изображения для SEO",
  "metaDescription": "Мета-описание для поисковиков"
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { topic, slideContent } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log(`🏷️ Генерация тегов для: "${topic}"`);

    const contentSummary = slideContent 
      ? `\n\nКонтент слайдов:\n${slideContent}`
      : '';

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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Тема: "${topic}"${contentSummary}` }
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || '';
    let cleanedJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      cleanedJson = cleanedJson.replace(/"([^"]*?)"/g, (match, content) => {
        const fixed = content.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        return `"${fixed}"`;
      });
      parsed = JSON.parse(cleanedJson);
    }

    console.log(`✅ Сгенерировано тегов: ${
      (parsed.hashtags?.popular_en?.length || 0) + 
      (parsed.hashtags?.niche_en?.length || 0) + 
      (parsed.hashtags?.russian?.length || 0)
    }`);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error('❌ Ошибка генерации тегов:', error);
    
    // Fallback tags
    return res.status(200).json({
      hashtags: {
        popular_en: ['motivation', 'success', 'entrepreneur', 'business', 'growth', 'mindset', 'goals', 'inspiration', 'lifestyle', 'money'],
        niche_en: ['entrepreneurlife', 'startupgrind', 'businesstips', 'growthhacking', 'hustlehard', 'buildyourbrand', 'digitalmarketing', 'contentcreator', 'solopreneur', 'sidehustle'],
        russian: ['мотивация', 'бизнес', 'успех', 'саморазвитие', 'деньги', 'цели', 'предприниматель', 'инвестиции', 'финансы', 'карьера']
      },
      altText: 'Инфографика на тему бизнеса и саморазвития',
      metaDescription: 'Узнайте ключевые инсайты и практические советы для достижения успеха.',
      fallback: true
    });
  }
}
