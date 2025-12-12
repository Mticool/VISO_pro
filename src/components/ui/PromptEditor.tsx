import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Loader2, Sparkles, ImageIcon, Zap, Diamond, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'

interface PromptEditorProps {
  imagePrompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: (prompt: string, isPro: boolean) => Promise<void>
  isGenerating: boolean
  className?: string
}

export function PromptEditor({
  imagePrompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  className
}: PromptEditorProps) {
  const { isPro } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleGenerate = async () => {
    if (!imagePrompt.trim()) return
    await onGenerate(imagePrompt, isPro)
  }

  return (
    <div className={cn('bg-black/40 rounded-xl border border-white/10 overflow-hidden', className)}>
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/20">
            <Wand2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-white block">Настройки фона</span>
            <span className="text-[11px] text-zinc-500">
              {imagePrompt ? 'Промпт задан' : 'Нажмите для редактирования'}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={cn(
            'w-4 h-4 text-zinc-500 transition-transform',
            isExpanded && 'rotate-180'
          )} 
        />
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/5"
          >
            <div className="p-4 space-y-3">
              {/* Prompt Input */}
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-2 block">
                  AI Промпт (английский)
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder="Describe the background image in English...&#10;e.g. 'minimalist dark gradient with geometric shapes'"
                  className="w-full h-24 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Model Indicator */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Модель:</span>
                <div className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full',
                  isPro 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-zinc-500/20 text-zinc-400'
                )}>
                  {isPro ? (
                    <>
                      <Diamond className="w-3 h-3" />
                      <span>Pro Quality</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>Basic</span>
                    </>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !imagePrompt.trim()}
                className={cn(
                  'w-full py-2.5 rounded-xl font-medium text-sm',
                  'bg-gradient-to-r from-violet-600 to-indigo-600',
                  'hover:from-violet-500 hover:to-indigo-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Сгенерировать арт
                  </>
                )}
              </motion.button>

              {/* Hint */}
              <p className="text-[10px] text-zinc-600 text-center">
                Отредактируйте промпт перед генерацией, чтобы получить нужный результат
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simplified version for toolbar
export function PromptEditorButton({
  onClick,
  hasPrompt
}: {
  onClick: () => void
  hasPrompt: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-xl transition-all',
        hasPrompt
          ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400'
          : 'bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10'
      )}
      title="Редактировать AI промпт"
    >
      <ImageIcon className="w-4 h-4" />
    </button>
  )
}

