import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

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
}

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
- Caption: готовый текст для публикации НА РУССКОМ`

const REWRITE_COMMANDS: Record<string, string> = {
  shorten: 'Сократи текст, сохранив главную мысль.',
  funny: 'Добавь юмора и иронии.',
  formal: 'Перепиши в официальном деловом стиле.',
  clickbait: 'Сделай максимально кликбейтным.',
  fix: 'Исправь ошибки, улучши читаемость.',
}

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
- Стили должны сильно отличаться друг от друга`

// Helper function to call OpenRouter API
async function callOpenRouter(apiKey: string, systemPrompt: string, userMessage: string, maxTokens = 2048) {
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
        { role: 'user', content: userMessage }
      ],
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// Helper to safely parse JSON from AI response
function safeParseJSON(text: string) {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  
  // Try parsing as-is first
  try {
    return JSON.parse(cleaned)
  } catch {
    // If parsing fails, try to fix common issues
    // Fix unescaped newlines inside JSON strings (between quotes)
    cleaned = cleaned.replace(/"([^"]*?)"/g, (match, content) => {
      const fixed = content
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
      return `"${fixed}"`
    })
    
    return JSON.parse(cleaned)
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      {
        name: 'api-proxy',
        configureServer(server) {
          // ===== /api/research - Perplexity AI (Web Search) =====
          server.middlewares.use('/api/research', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { topic } = JSON.parse(body)

              if (!topic) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Topic is required' }))
                return
              }

              console.log(`🔍 Perplexity Research: "${topic}"`)

              const perplexityKey = env.PERPLEXITY_API_KEY

              if (!perplexityKey) {
                console.log('⚠️ No Perplexity API key, skipping research')
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ context: '', skipped: true }))
                return
              }

              const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${perplexityKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'sonar',
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
              })

              if (!response.ok) {
                throw new Error(`Perplexity API error: ${response.status}`)
              }

              const data = await response.json()
              const context = data.choices?.[0]?.message?.content || ''

              console.log(`✅ Research complete (${context.length} chars)`)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ context }))

            } catch (error) {
              console.error('❌ Research error:', error)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ context: '', error: true }))
            }
          })

          // ===== /api/generate - OpenRouter Claude =====
          server.middlewares.use('/api/generate', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { topic, platform = 'instagram', researchContext } = JSON.parse(body)

              if (!topic) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Topic is required' }))
                return
              }

              const apiKey = env.OPENROUTER_API_KEY
              if (!apiKey) {
                throw new Error('OPENROUTER_API_KEY not configured')
              }

              const platformPrompt = PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.instagram
              
              let systemPrompt = `${SYSTEM_PROMPT_BASE}\n\n${platformPrompt}`
              
              if (researchContext) {
                systemPrompt += `\n\n📊 АКТУАЛЬНАЯ ИНФОРМАЦИЯ ИЗ ИНТЕРНЕТА:\n${researchContext}`
              }

              console.log(`🎨 Генерация для ${platform}: "${topic}"${researchContext ? ' (with research)' : ''}`)

              const responseText = await callOpenRouter(apiKey, systemPrompt, `Тема: "${topic}"`)
              const parsed = safeParseJSON(responseText)
              const slides = parsed.slides || parsed
              const caption = parsed.caption || ''

              const slidesWithIds = (Array.isArray(slides) ? slides : [slides]).map((slide: any, index: number) => ({
                id: `slide-${Date.now()}-${index}`,
                type: slide.type || 'content',
                title: slide.title,
                content: slide.content,
                imageKeyword: slide.imageKeyword,
                imagePrompt: slide.imagePrompt,
              }))

              console.log(`✅ Создано ${slidesWithIds.length} слайдов`)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ slides: slidesWithIds, caption }))

            } catch (error: any) {
              console.error('❌ Ошибка API:', error)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ 
                slides: [{ id: `s-${Date.now()}`, type: 'cover', title: 'Ошибка генерации', content: error?.message?.substring(0, 100) || 'Попробуйте ещё раз', imageKeyword: 'abstract dark' }],
                caption: '',
                fallback: true,
                error: error?.message
              }))
            }
          })

          // ===== /api/generate-batch - Batch Cover Generation =====
          server.middlewares.use('/api/generate-batch', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { topic, platform = 'youtube', cleanMode = false } = JSON.parse(body)

              if (!topic) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Topic is required' }))
                return
              }

              const apiKey = env.OPENROUTER_API_KEY
              if (!apiKey) {
                throw new Error('OPENROUTER_API_KEY not configured')
              }

              console.log(`🎨 Пакетная генерация 4 вариантов: "${topic}"`)

              const systemPrompt = cleanMode 
                ? BATCH_SYSTEM_PROMPT.replace(/title.*РУССКИЙ\)/g, 'title: ""') 
                : BATCH_SYSTEM_PROMPT

              const userMessage = `Тема: "${topic}"\nПлатформа: ${platform}\n${cleanMode ? 'ВАЖНО: Оставь все title пустыми.' : ''}`

              const responseText = await callOpenRouter(apiKey, systemPrompt, userMessage)
              const parsed = safeParseJSON(responseText)
              const concepts = parsed.concepts || []

              console.log(`✅ Сгенерировано ${concepts.length} концепций`)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ concepts }))

            } catch (error) {
              console.error('❌ Ошибка пакетной генерации:', error)
              
              const fallbackConcepts = [
                { style: 'emotional', title: 'Эмоциональный вариант', imagePrompt: 'emotional portrait dramatic lighting' },
                { style: 'minimal', title: 'Минималистичный вариант', imagePrompt: 'minimalist clean background modern' },
                { style: '3d', title: '3D вариант', imagePrompt: '3d render vibrant colors abstract' },
                { style: 'mystery', title: 'Загадочный вариант', imagePrompt: 'mysterious dark moody atmosphere' },
              ]

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ concepts: fallbackConcepts, fallback: true }))
            }
          })

          // ===== /api/rewrite - Magic Rewrite =====
          server.middlewares.use('/api/rewrite', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { text, command } = JSON.parse(body)
              const commandInstruction = REWRITE_COMMANDS[command] || REWRITE_COMMANDS.fix

              const apiKey = env.OPENROUTER_API_KEY
              if (!apiKey) {
                throw new Error('OPENROUTER_API_KEY not configured')
              }

              const result = await callOpenRouter(
                apiKey,
                'Перепиши текст. Отвечай ТОЛЬКО готовым текстом на русском, без пояснений.',
                `Текст: "${text}"\n\nЗадача: ${commandInstruction}`,
                1024
              )

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ result: result.trim() }))
            } catch (error) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to rewrite' }))
            }
          })

          // ===== /api/generate-tags - Hashtags & SEO =====
          server.middlewares.use('/api/generate-tags', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.statusCode = 200
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }

            try {
              const { topic, slideContent } = JSON.parse(body)
              console.log(`🏷️ Генерация тегов для: "${topic}"`)

              const apiKey = env.OPENROUTER_API_KEY
              if (!apiKey) {
                throw new Error('OPENROUTER_API_KEY not configured')
              }

              const tagsPrompt = `Ты — эксперт по SMM и SEO. Проанализируй тему и сгенерируй:

1. 30 релевантных хештегов для Instagram/TikTok:
   - 10 популярных на английском
   - 10 нишевых на английском  
   - 10 на русском
   - Без символа #

2. SEO Alt Text для обложки (до 125 символов, русский)
3. Meta Description (до 160 символов, русский)

Верни СТРОГО JSON:
{
  "hashtags": {
    "popular_en": ["word1", "word2", ...],
    "niche_en": ["word1", "word2", ...],
    "russian": ["слово1", "слово2", ...]
  },
  "altText": "описание",
  "metaDescription": "мета описание"
}`

              const responseText = await callOpenRouter(
                apiKey,
                tagsPrompt,
                `Тема: "${topic}"${slideContent ? `\n\nКонтент: ${slideContent}` : ''}`,
                1024
              )

              const parsed = safeParseJSON(responseText)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(parsed))
            } catch (error) {
              console.error('❌ Ошибка генерации тегов:', error)
              res.statusCode = 200
              res.end(JSON.stringify({
                hashtags: {
                  popular_en: ['motivation', 'success', 'entrepreneur', 'business', 'growth', 'mindset', 'goals', 'inspiration', 'lifestyle', 'money'],
                  niche_en: ['entrepreneurlife', 'startupgrind', 'businesstips', 'growthhacking', 'hustlehard', 'buildyourbrand', 'digitalmarketing', 'contentcreator', 'solopreneur', 'sidehustle'],
                  russian: ['мотивация', 'бизнес', 'успех', 'саморазвитие', 'деньги', 'цели', 'предприниматель', 'инвестиции', 'финансы', 'карьера']
                },
                altText: 'Инфографика на тему бизнеса и саморазвития',
                metaDescription: 'Узнайте ключевые инсайты и практические советы.',
                fallback: true
              }))
            }
          })

          // ===== /api/images/stock - Unsplash =====
          server.middlewares.use('/api/images/stock', async (req, res) => {
            if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return }

            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`)
              const query = url.searchParams.get('query') || 'abstract dark'

              const unsplashUrl = new URL('https://api.unsplash.com/photos/random')
              unsplashUrl.searchParams.set('client_id', env.UNSPLASH_ACCESS_KEY)
              unsplashUrl.searchParams.set('query', query)
              unsplashUrl.searchParams.set('orientation', 'portrait')

              const response = await fetch(unsplashUrl.toString())
              const data = await response.json()
              const photo = Array.isArray(data) ? data[0] : data

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ url: photo?.urls?.regular, source: 'unsplash' }))
            } catch {
              res.statusCode = 200
              res.end(JSON.stringify({ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', fallback: true }))
            }
          })

          // ===== /api/images/ai - AI Generation =====
          server.middlewares.use('/api/images/ai', async (req, res) => {
            if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return }
            if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }

            let body = ''
            for await (const chunk of req) { body += chunk }

            try {
              const { prompt } = JSON.parse(body)
              const unsplashUrl = new URL('https://api.unsplash.com/photos/random')
              unsplashUrl.searchParams.set('client_id', env.UNSPLASH_ACCESS_KEY)
              unsplashUrl.searchParams.set('query', prompt?.split(' ').slice(0, 3).join(' ') || 'abstract')
              unsplashUrl.searchParams.set('orientation', 'portrait')

              const response = await fetch(unsplashUrl.toString())
              const data = await response.json()
              const photo = Array.isArray(data) ? data[0] : data

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ url: photo?.urls?.regular, source: 'ai' }))
            } catch {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'AI generation failed' }))
            }
          })

          // ===== /api/images - Legacy =====
          server.middlewares.use('/api/images', async (req, res) => {
            if (req.url?.startsWith('/stock') || req.url?.startsWith('/ai')) return

            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`)
              const query = url.searchParams.get('query') || 'abstract dark'

              const unsplashUrl = new URL('https://api.unsplash.com/photos/random')
              unsplashUrl.searchParams.set('client_id', env.UNSPLASH_ACCESS_KEY)
              unsplashUrl.searchParams.set('query', query)
              unsplashUrl.searchParams.set('orientation', 'portrait')

              const response = await fetch(unsplashUrl.toString())
              const data = await response.json()
              const photo = Array.isArray(data) ? data[0] : data

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ url: photo?.urls?.regular }))
            } catch {
              res.statusCode = 200
              res.end(JSON.stringify({ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }))
            }
          })

          // ===== /api/proxy-image - Image Proxy for Export =====
          server.middlewares.use('/api/proxy-image', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            
            if (req.method === 'OPTIONS') { 
              res.statusCode = 200
              res.end()
              return 
            }

            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`)
              const imageUrl = url.searchParams.get('url')

              if (!imageUrl) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'URL required' }))
                return
              }

              const response = await fetch(imageUrl)
              
              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`)
              }

              const contentType = response.headers.get('content-type') || 'image/jpeg'
              const buffer = await response.arrayBuffer()

              res.setHeader('Content-Type', contentType)
              res.setHeader('Cache-Control', 'public, max-age=31536000')
              res.statusCode = 200
              res.end(Buffer.from(buffer))
            } catch (error) {
              console.error('❌ Image proxy error:', error)
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Proxy failed' }))
            }
          })
        },
      },
    ],
  }
})
