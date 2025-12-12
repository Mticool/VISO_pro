import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

config(); // Load .env

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Ты — VISO, эксперт по виральному контенту в Instagram и LinkedIn.
Твоя задача — превратить тему пользователя в структуру идеальной "карусели" из 5-7 слайдов.
Стиль: Краткий, емкий, без "воды", пробивные заголовки.

Ты ОБЯЗАН вернуть ответ СТРОГО в формате JSON (без markdown блоков, просто чистый JSON).
Структура JSON:
[
  {
    "id": "1",
    "type": "cover",
    "title": "Цепляющий Заголовок (Hook)",
    "content": "Подзаголовок, объясняющий ценность",
    "imageKeyword": "abstract gradient purple blue"
  },
  {
    "id": "2",
    "type": "content", 
    "title": "Главная мысль 1",
    "content": "Короткое пояснение (до 15 слов)",
    "imageKeyword": "minimalist dark background"
  },
  ...
  {
    "id": "last",
    "type": "cta",
    "title": "Призыв к действию",
    "content": "Save & Share!",
    "imageKeyword": "dark elegant finish"
  }
]

ВАЖНО:
- Всегда создавай 5-7 слайдов
- Первый слайд type: "cover", последний type: "cta", остальные type: "content"
- imageKeyword — ключевые слова на английском для поиска фона (абстрактные, атмосферные)
- Заголовки должны быть цепляющими и короткими (до 7 слов)
- Контент — максимально лаконичный (до 15 слов)
- Пиши на русском, кроме imageKeyword`;

// Curated high-quality Unsplash image IDs
function getImageUrl(keyword) {
  const imageMap = {
    gradient: '1618005182384-a83a8bd57fbe',
    purple: '1557682250-33bd709cbe85',
    blue: '1614851099511-773084f6911d',
    abstract: '1579546929518-9e396f3cc809',
    dark: '1558591710-4b4a1ae0f04d',
    minimal: '1507003211169-0a1dd7228f2d',
    elegant: '1519681393784-d120267933ba',
    finish: '1478760329108-5c3ed9d495a0',
    productivity: '1484480974693-6ca0a78fb36b',
    tech: '1518770660439-4636190af475',
    business: '1460925895917-afdab827c52f',
    creative: '1561070791-2526d30994b5',
    success: '1533227268428-f9ed0900fb3b',
    growth: '1502945015378-0e284ca1a5be',
    motivation: '1504805572947-34fad45aed96',
  };

  const keywordLower = (keyword || '').toLowerCase();
  
  for (const [key, id] of Object.entries(imageMap)) {
    if (keywordLower.includes(key)) {
      return `https://images.unsplash.com/photo-${id}?w=800&h=1000&fit=crop&q=80`;
    }
  }
  
  const defaults = [
    '1618005182384-a83a8bd57fbe',
    '1557682250-33bd709cbe85',
    '1579546929518-9e396f3cc809',
    '1558591710-4b4a1ae0f04d',
    '1614851099511-773084f6911d',
  ];
  
  const randomId = defaults[Math.floor(Math.random() * defaults.length)];
  return `https://images.unsplash.com/photo-${randomId}?w=800&h=1000&fit=crop&q=80`;
}

function getFallbackSlides(topic) {
  return [
    {
      id: `slide-${Date.now()}-0`,
      type: 'cover',
      title: topic,
      content: 'Swipe to discover →',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop&q=80',
    },
    {
      id: `slide-${Date.now()}-1`,
      type: 'content',
      title: 'Key Insight #1',
      content: 'Your first powerful insight goes here.',
      image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=1000&fit=crop&q=80',
    },
    {
      id: `slide-${Date.now()}-2`,
      type: 'content',
      title: 'Key Insight #2',
      content: 'Another valuable point for your audience.',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1000&fit=crop&q=80',
    },
    {
      id: `slide-${Date.now()}-3`,
      type: 'content',
      title: 'Key Insight #3',
      content: 'The third insight that completes your story.',
      image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=1000&fit=crop&q=80',
    },
    {
      id: `slide-${Date.now()}-4`,
      type: 'content',
      title: 'Save & Share',
      content: 'Found this useful? Save it for later!',
      image: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800&h=1000&fit=crop&q=80',
    },
  ];
}

app.post('/api/generate', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`Generating slides for topic: "${topic}"`);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Создай виральную карусель на тему: "${topic}"`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    console.log('Claude response:', responseText);

    // Clean up potential markdown formatting
    const cleanedJson = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const slides = JSON.parse(cleanedJson);

    // Add image URLs based on keywords
    const slidesWithImages = slides.map((slide, index) => ({
      ...slide,
      id: `slide-${Date.now()}-${index}`,
      type: slide.type === 'cta' ? 'content' : slide.type,
      image: getImageUrl(slide.imageKeyword),
    }));

    console.log(`Generated ${slidesWithImages.length} slides`);

    return res.json({ slides: slidesWithImages });
  } catch (error) {
    console.error('API Error:', error);
    
    const fallbackSlides = getFallbackSlides(req.body?.topic || 'Untitled');
    return res.json({ slides: fallbackSlides, fallback: true });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
  console.log(`   POST /api/generate - Generate carousel slides`);
});

