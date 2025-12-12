import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

export function TopicInput() {
  const [inputValue, setInputValue] = useState('')
  const { generateSlides, isGenerating, setTopic } = useStore()

  const handleGenerate = async () => {
    if (!inputValue.trim() || isGenerating) return
    setTopic(inputValue)
    await generateSlides(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            VISO
          </h1>
          <p className="mt-2 text-white/40 text-sm tracking-widest uppercase">
            AI Carousel Creator
          </p>
        </motion.div>

        {/* Input Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'relative rounded-2xl overflow-hidden',
            'bg-white/5 backdrop-blur-xl',
            'border border-white/10',
            'transition-all duration-300',
            'focus-within:border-purple-500/30 focus-within:bg-white/[0.07]',
            'focus-within:shadow-lg focus-within:shadow-purple-500/10'
          )}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to create today?"
            disabled={isGenerating}
            className={cn(
              'w-full px-8 py-6',
              'bg-transparent',
              'text-xl text-white placeholder:text-white/30',
              'outline-none border-none',
              'font-light tracking-wide',
              'disabled:opacity-50'
            )}
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <button
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isGenerating}
            className={cn(
              'group relative inline-flex items-center gap-3 px-8 py-4',
              'bg-gradient-to-r from-purple-600 to-purple-500',
              'rounded-xl font-medium text-white',
              'transition-all duration-300',
              'hover:from-purple-500 hover:to-purple-400',
              'hover:shadow-lg hover:shadow-purple-500/25',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'disabled:hover:shadow-none'
            )}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating magic...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Generate Magic</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-white/25 text-sm"
        >
          Try: "10 productivity tips" or "Design principles"
        </motion.p>
      </motion.div>
    </div>
  )
}

