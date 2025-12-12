import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2, Globe, Brain, Palette, Search, Layers } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { WebSearchToggle } from '../ui/WebSearchToggle'

const floatingSlides = [
  { id: 1, rotation: -12, x: -320, y: -120, delay: 0 },
  { id: 2, rotation: 8, x: 300, y: -100, delay: 0.5 },
  { id: 3, rotation: -6, x: -360, y: 140, delay: 1 },
  { id: 4, rotation: 15, x: 340, y: 120, delay: 1.5 },
]

const features = [
  {
    icon: Brain,
    title: 'Смысловое ядро',
    description: 'Наш AI не просто пишет текст. Он анализирует тренды, выстраивает структуру сторителлинга и адаптирует тон под вашу аудиторию.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Palette,
    title: 'Уникальный Визуал',
    description: 'Забудьте про фотостоки. Система генерирует уникальные изображения кинематографического качества под контекст вашего слайда.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Search,
    title: 'Real-Time Анализ',
    description: 'Движок подключен к интернету в реальном времени. Создавайте контент на основе новостей, которые произошли 5 минут назад.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Layers,
    title: 'Экосистема Форматов',
    description: 'Один клик превращает идею в карусель для Instagram, пост для Telegram, обложку для YouTube или коллаж для Reels.',
    gradient: 'from-pink-500 to-rose-500',
  },
]

export function LandingPage() {
  const [inputValue, setInputValue] = useState('')
  const { generateSlides, isGenerating, isResearching, useWebSearch } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isGenerating) return
    await generateSlides(inputValue.trim())
  }

  const placeholders = [
    'Как привлечь первых клиентов в 2024...',
    'Тренды дизайна интерьеров...',
    '5 ошибок начинающего фрилансера...',
    'Нейросети для бизнеса...',
  ]

  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Aurora Effects - Only at edges */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Floating Mini-Slides */}
        {floatingSlides.map((slide) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { delay: slide.delay, duration: 0.5 },
              scale: { delay: slide.delay, duration: 0.5 },
              y: { delay: slide.delay, duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute pointer-events-none hidden lg:block"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(${slide.x}px, ${slide.y}px) rotate(${slide.rotation}deg)`,
            }}
          >
            <div className="w-28 h-36 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="h-2/3 bg-gradient-to-br from-white/5 to-white/10" />
              <div className="p-2 space-y-1.5">
                <div className="h-2 bg-white/20 rounded w-3/4" />
                <div className="h-1.5 bg-white/10 rounded w-full" />
                <div className="h-1.5 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-zinc-300">AI-powered carousel maker</span>
          </motion.div>

          {/* Title - Clean and readable */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight"
          >
            <span className="text-white">Искусство</span>
            <br />
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              визуального сторителлинга
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-zinc-400 mb-10 max-w-md mx-auto leading-relaxed"
          >
            Создавайте виральные карусели и посты с помощью AI. 
            <span className="text-white"> Быстро. Профессионально. Красиво.</span>
          </motion.p>

          {/* Web Search Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="max-w-md mx-auto mb-5"
          >
            <WebSearchToggle />
          </motion.div>

          {/* Input Form - More contrast */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className={cn(
              'relative rounded-2xl overflow-hidden',
              'bg-white/[0.07] backdrop-blur-xl',
              'border border-white/20',
              'shadow-[0_0_60px_rgba(0,0,0,0.5)]',
              'transition-all duration-300',
              'focus-within:border-white/30 focus-within:bg-white/10'
            )}>
              {/* Web Search Indicator */}
              {useWebSearch && (
                <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-md border border-emerald-500/30">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-300 font-medium">Online</span>
                </div>
              )}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  const interval = setInterval(() => {
                    setPlaceholderIndex(i => (i + 1) % placeholders.length)
                  }, 3000)
                  return () => clearInterval(interval)
                }}
                placeholder={placeholders[placeholderIndex]}
                disabled={isGenerating}
                className={cn(
                  'w-full bg-transparent',
                  'px-6 py-5 pr-40',
                  useWebSearch ? 'pt-12' : '',
                  'text-lg text-white placeholder:text-zinc-500',
                  'outline-none border-none',
                  'disabled:opacity-50'
                )}
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isGenerating || !inputValue.trim()}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-xl',
                    'bg-white text-black font-semibold',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'hover:bg-zinc-100',
                    'transition-all duration-200'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isResearching ? (
                      <motion.div
                        key="researching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4 animate-pulse" />
                        <span>Поиск...</span>
                      </motion.div>
                    ) : isGenerating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Создаю...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Создать</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-zinc-600">Попробуйте:</span>
            {['Продуктивность', 'AI тренды', 'Личный бренд'].map((hint) => (
              <button
                key={hint}
                onClick={() => setInputValue(hint)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                {hint}
              </button>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-xs text-zinc-500"
          >
            {useWebSearch ? (
              <span className="flex items-center justify-center gap-1.5">
                <Globe className="w-3 h-3 text-emerald-400" />
                Используется поиск в интернете для актуальных данных
              </span>
            ) : (
              '🚀 Бесплатно · Безлимит для Pro'
            )}
          </motion.p>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Технологии будущего
              <br />
              <span className="text-zinc-400">для вашего контента</span>
            </h2>
            <p className="text-zinc-500 max-w-md mx-auto">
              Не просто инструмент — интеллектуальная платформа для создания контента нового поколения
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'group relative p-6 rounded-2xl',
                    'bg-white/[0.03] backdrop-blur-md',
                    'border border-white/10',
                    'hover:border-white/20 hover:bg-white/[0.05]',
                    'transition-all duration-300'
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl mb-4 flex items-center justify-center',
                    'bg-gradient-to-br',
                    feature.gradient,
                    'opacity-80 group-hover:opacity-100 transition-opacity'
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Subtle glow on hover */}
                  <div className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    'bg-gradient-to-br pointer-events-none',
                    feature.gradient,
                    'blur-3xl -z-10'
                  )} style={{ opacity: 0.05 }} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
