import type { VercelRequest, VercelResponse } from '@vercel/node';

const PLATFORM_PROMPTS: Record<string, string> = {
  instagram: `Создай виральную карусель из 5-7 слайдов для Instagram.
Первый слайд - обложка (type: "cover") с цепляющим заголовком.
Последний слайд - призыв к действию (type: "cta").
Остальные слайды - контент (type: "content").`,

  telegram: `Создай ОДНУ картинку-заголовок для Telegram поста.
Верни массив из 1 слайда (type: "cover").
Заголовок должен быть интригующим и побуждать открыть пост.
Caption должен быть полноценной статьёй с форматированием и эмодзи.`,

  youtube: `Создай ОДНУ кликбейтную обложку (Thumbnail) для YouTube видео.
Верни массив из 1 слайда (type: "cover").
Заголовок: 3-5 слов МАКСИМУМ, вызывающий эмоции, кликбейтный.
imagePrompt должен содержать: "hyper-realistic, emotional, youtube thumbnail style".
Caption - это описание видео с хештегами.`,

  tiktok: `Создай ОДНУ обложку для TikTok видео.
Верни массив из 1 слайда (type: "cover").
Заголовок должен цеплять внимание за 1 секунду.
Текст короткий и ударный.
Caption - короткое описание + хештеги.`,
};

const SYSTEM_PROMPT_BASE = `ВАЖНО: Ты — русскоязычный эксперт по SMM и контент-маркетингу. Весь генерируемый контент ДОЛЖЕН БЫТЬ СТРОГО НА РУССКОМ ЯЗЫКЕ.

Тон голоса: Пиши живо, без канцеляризмов, используй "ты". Избегай штампов вроде "раскрой потенциал".

Ты ОБЯЗАН вернуть ответ СТРОГО в формате JSON (без markdown блоков):
{
  "slides": [
    {
      "id": "1",
      "type": "cover",
      "title": "Заголовок на русском",
      "content": "Подзаголовок на русском",
      "imageKeyword": "english keywords for stock photo",
      "imagePrompt": "detailed english prompt for AI image generation"
    }
  ],
  "caption": "Полный текст поста для публикации. Для Instagram/TikTok включи хештеги. Для Telegram - полноценная статья."
}

ПРАВИЛА:
- imageKeyword — ключевые слова НА АНГЛИЙСКОМ для поиска фото
- imagePrompt — детальный промпт НА АНГЛИЙСКОМ для AI-генерации
- Заголовки: цепляющие, НА РУССКОМ
- Контент: до 15 слов, НА РУССКОМ
- Caption: готовый текст для публикации НА РУССКОМ`;

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
    const { topic, platform = 'instagram', researchContext } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY not found in environment');
      return res.status(500).json({ 
        error: 'API key not configured',
        debug: 'OPENROUTER_API_KEY is missing'
      });
    }

    const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.instagram;
    
    // Build system prompt with optional research context
    let systemPrompt = `${SYSTEM_PROMPT_BASE}\n\n${platformPrompt}`;
    
    if (researchContext) {
      systemPrompt += `\n\n📊 АКТУАЛЬНАЯ ИНФОРМАЦИЯ ИЗ ИНТЕРНЕТА (используй эти данные):\n${researchContext}\n\nИспользуй эту свежую информацию для создания актуального и информативного контента.`;
    }

    console.log(`🎨 Генерация для ${platform}: "${topic}"${researchContext ? ' (with research)' : ''}`);

    // Call OpenRouter API
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Тема: "${topic}"` }
        ],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || '';
    
    if (!responseText) {
      throw new Error('Empty response from OpenRouter');
    }

    // Clean and parse JSON safely
    let cleanedJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      // Fix unescaped newlines inside JSON strings
      cleanedJson = cleanedJson.replace(/"([^"]*?)"/g, (match, content) => {
        const fixed = content
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return `"${fixed}"`;
      });
      parsed = JSON.parse(cleanedJson);
    }
    const slides = parsed.slides || parsed;
    const caption = parsed.caption || '';

    const slidesWithIds = (Array.isArray(slides) ? slides : [slides]).map((slide: any, index: number) => ({
      id: `slide-${Date.now()}-${index}`,
      type: slide.type || 'content',
      title: slide.title,
      content: slide.content,
      imageKeyword: slide.imageKeyword,
      imagePrompt: slide.imagePrompt,
    }));

    console.log(`✅ Создано ${slidesWithIds.length} слайдов`);

    return res.status(200).json({ slides: slidesWithIds, caption });

  } catch (error: any) {
    console.error('❌ Ошибка API:', error);
    
    const errorMessage = error?.message || 'Unknown error';
    
    return res.status(200).json({ 
      slides: [{ 
        id: `s-${Date.now()}`, 
        type: 'cover', 
        title: 'Ошибка генерации', 
        content: errorMessage.substring(0, 100), 
        imageKeyword: 'abstract dark' 
      }],
      caption: '',
      fallback: true,
      error: errorMessage
    });
  }
}
