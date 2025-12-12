import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2, Globe, Zap, Clock, Target, TrendingUp } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { WebSearchToggle } from '../ui/WebSearchToggle'

export function LandingPage() {
  const [inputValue, setInputValue] = useState('')
  const { generateSlides, isGenerating, isResearching, useWebSearch } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isGenerating) return
    await generateSlides(inputValue.trim())
  }

  const placeholders = [
    '5 ошибок начинающего предпринимателя...',
    'Как увеличить продажи в 2 раза...',
    'Тренды маркетинга 2025...',
    'Секреты личного бренда...',
  ]

  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-3xl mx-auto text-center">
          
          {/* What */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI-генератор контента</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Карусели за 30 секунд
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 mb-2">
              вместо 3 часов работы дизайнера
            </p>
          </motion.div>

          {/* Why / Problem */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-zinc-500 mb-10 max-w-xl mx-auto"
          >
            Введите тему — получите готовую карусель с текстом, картинками и хештегами.
            <span className="text-white"> Для Instagram, Telegram, YouTube и TikTok.</span>
          </motion.p>

          {/* Web Search Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mb-4"
          >
            <WebSearchToggle />
          </motion.div>

          {/* CTA - Input Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="relative max-w-xl mx-auto"
          >
            <div className={cn(
              'relative rounded-2xl overflow-hidden',
              'bg-white/10 backdrop-blur-xl',
              'border border-white/20',
              'transition-all duration-300',
              'focus-within:border-white/40 focus-within:bg-white/15'
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
                  'px-5 py-4 pr-36',
                  useWebSearch ? 'pt-12' : '',
                  'text-base md:text-lg text-white placeholder:text-zinc-500',
                  'outline-none border-none',
                  'disabled:opacity-50'
                )}
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isGenerating || !inputValue.trim()}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                    'bg-white text-black font-semibold text-sm',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'hover:bg-zinc-100',
                    'transition-all duration-200'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isResearching ? (
                      <motion.div key="research" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Globe className="w-4 h-4 animate-pulse" />
                        <span>Ищу...</span>
                      </motion.div>
                    ) : isGenerating ? (
                      <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Создаю...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <span>Создать</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Quick Examples */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-zinc-600">Попробуйте:</span>
            {['Продуктивность', 'Нейросети', 'Бизнес-идеи'].map((hint) => (
              <button
                key={hint}
                onClick={() => setInputValue(hint)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                {hint}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Who is it for */}
      <div className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-4"
          >
            Для кого это?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-center mb-12 max-w-lg mx-auto"
          >
            Для всех, кто устал тратить часы на создание контента
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'SMM-менеджеры',
                desc: 'Делайте 10 каруселей вместо одной за то же время',
                icon: TrendingUp,
              },
              {
                title: 'Предприниматели',
                desc: 'Продвигайте бизнес без найма дизайнера',
                icon: Target,
              },
              {
                title: 'Блогеры',
                desc: 'Публикуйте каждый день без выгорания',
                icon: Zap,
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <Icon className="w-8 h-8 text-violet-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
          >
            Как это работает?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Введите тему', desc: 'Напишите о чём хотите рассказать' },
              { step: '2', title: 'AI создаёт контент', desc: 'Тексты, картинки, хештеги — всё автоматически' },
              { step: '3', title: 'Редактируйте и скачивайте', desc: 'Подправьте если нужно и публикуйте' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-violet-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Clock className="w-10 h-10 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Первая карусель — бесплатно
            </h2>
            <p className="text-zinc-500 mb-6">
              Попробуйте прямо сейчас. Без регистрации, без карты.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-100 transition-all"
            >
              Попробовать бесплатно
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-4 border-t border-white/5 text-center">
        <p className="text-xs text-zinc-600">
          VISO © 2025 · AI-генератор контента для социальных сетей
        </p>
      </div>
    </div>
  )
}
