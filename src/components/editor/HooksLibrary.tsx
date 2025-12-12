import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'
import { viralHooks, type HookCategory, type HookTemplate } from '../../lib/hooks-data'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { v4 as uuidv4 } from 'uuid'

export function HooksLibrary() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('learning')
  const { slides, activeSlideId, updateSlide } = useStore()
  
  const handleHookClick = (hook: HookTemplate) => {
    if (slides.length > 0 && activeSlideId) {
      // Update active slide title
      updateSlide(activeSlideId, { title: hook.text })
    } else {
      // Create new slide with this hook
      const newSlide = {
        id: uuidv4(),
        type: 'cover' as const,
        title: hook.text,
        content: 'Листай, чтобы узнать больше →',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop&q=80',
      }
      useStore.setState(state => ({
        slides: [newSlide, ...state.slides],
        activeSlideId: newSlide.id
      }))
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Viral Hooks
          </h2>
        </div>
        <p className="mt-1 text-[11px] text-zinc-600">
          Нажми, чтобы вставить в слайд
        </p>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {viralHooks.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isExpanded={expandedCategory === category.id}
            onToggle={() => setExpandedCategory(
              expandedCategory === category.id ? null : category.id
            )}
            onHookClick={handleHookClick}
          />
        ))}
      </div>
    </div>
  )
}

interface CategorySectionProps {
  category: HookCategory
  isExpanded: boolean
  onToggle: () => void
  onHookClick: (hook: HookTemplate) => void
}

function CategorySection({ category, isExpanded, onToggle, onHookClick }: CategorySectionProps) {
  return (
    <div className="border-b border-white/5">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'hover:bg-white/5 transition-colors',
          isExpanded && 'bg-white/5'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{category.emoji}</span>
          <span className="text-sm font-medium text-zinc-300">{category.name}</span>
          <span className="text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
            {category.hooks.length}
          </span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-zinc-500 transition-transform duration-200',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Hooks List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {category.hooks.map((hook) => (
                <motion.button
                  key={hook.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onHookClick(hook)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg',
                    'bg-white/5 hover:bg-violet-500/10',
                    'border border-transparent hover:border-violet-500/20',
                    'transition-all duration-200',
                    'group'
                  )}
                >
                  <p className="text-[13px] text-zinc-400 group-hover:text-zinc-300 leading-snug">
                    {hook.text.split(/(\[[^\]]+\])/).map((part, i) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        return (
                          <span key={i} className="text-violet-400 bg-violet-500/10 px-1 rounded">
                            {part}
                          </span>
                        )
                      }
                      return part
                    })}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

