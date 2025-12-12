import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2, Globe } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { WebSearchToggle } from '../ui/WebSearchToggle'

const floatingSlides = [
  { id: 1, rotation: -12, x: -280, y: -100, delay: 0 },
  { id: 2, rotation: 8, x: 260, y: -80, delay: 0.5 },
  { id: 3, rotation: -6, x: -320, y: 120, delay: 1 },
  { id: 4, rotation: 15, x: 300, y: 100, delay: 1.5 },
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
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      {/* Floating Mini-Slides */}
      {floatingSlides.map((slide) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: slide.delay, duration: 0.5 },
            scale: { delay: slide.delay, duration: 0.5 },
            y: { delay: slide.delay, duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${slide.x}px, ${slide.y}px) rotate(${slide.rotation}deg)`,
          }}
        >
          <div className="w-32 h-40 rounded-xl bg-gradient-to-br from-violet-900/30 to-indigo-900/30 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="h-2/3 bg-gradient-to-br from-violet-500/20 to-pink-500/20" />
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">AI-powered carousel maker</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
        >
          <span className="text-white">Искусство</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            визуального сторителлинга
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-zinc-400 mb-8 max-w-md mx-auto"
        >
          Создавайте виральные карусели и посты с помощью AI. 
          <span className="text-zinc-300"> Быстро. Профессионально. Красиво.</span>
        </motion.p>

        {/* Web Search Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="max-w-md mx-auto mb-4"
        >
          <WebSearchToggle />
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className={cn(
            'relative rounded-2xl overflow-hidden',
            'bg-[#0a0a0a]/80 backdrop-blur-2xl',
            'border border-white/10',
            'shadow-[0_0_60px_rgba(139,92,246,0.1)]',
            'transition-all duration-300',
            'focus-within:border-violet-500/30 focus-within:shadow-[0_0_80px_rgba(139,92,246,0.15)]'
          )}>
            {/* Web Search Indicator */}
            {useWebSearch && (
              <div className="absolute top-3 left-4 flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
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
                'px-6 py-5 pr-36',
                useWebSearch ? 'pt-10' : '',
                'text-lg text-white placeholder:text-zinc-600',
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
                  'flex items-center gap-2 px-5 py-3 rounded-xl',
                  'bg-gradient-to-r from-violet-600 to-pink-600',
                  'text-white font-semibold',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
                  'transition-all duration-300'
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
          {['Продуктивность', 'AI тренды', 'Личный бренд'].map((hint, i) => (
            <button
              key={hint}
              onClick={() => setInputValue(hint)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/10 transition-all"
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
          className="mt-8 text-xs text-zinc-600"
        >
          {useWebSearch ? (
            <span className="flex items-center justify-center gap-1">
              <Globe className="w-3 h-3 text-emerald-500" />
              Используется поиск в интернете для актуальных данных
            </span>
          ) : (
            '🚀 Бесплатно · 3 генерации в день'
          )}
        </motion.p>
      </motion.div>
    </div>
  )
}
