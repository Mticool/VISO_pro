import { motion } from 'framer-motion'
import { Globe, Zap, Loader2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

interface WebSearchToggleProps {
  compact?: boolean
}

export function WebSearchToggle({ compact = false }: WebSearchToggleProps) {
  const { useWebSearch, setUseWebSearch, isResearching } = useStore()

  if (compact) {
    return (
      <button
        onClick={() => setUseWebSearch(!useWebSearch)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all',
          useWebSearch
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-white/5 text-zinc-500 border border-white/5 hover:text-zinc-400'
        )}
        title="Поиск в интернете"
      >
        {isResearching ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Globe className="w-3.5 h-3.5" />
        )}
        {useWebSearch && (
          <span className="text-[10px] font-medium">Online</span>
        )}
      </button>
    )
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl transition-all',
      useWebSearch
        ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20'
        : 'bg-white/5 border border-white/5'
    )}>
      {/* Toggle */}
      <button
        onClick={() => setUseWebSearch(!useWebSearch)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-all duration-300',
          useWebSearch 
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
            : 'bg-white/10'
        )}
      >
        <motion.div
          animate={{ x: useWebSearch ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          {isResearching && (
            <Loader2 className="w-2.5 h-2.5 text-emerald-500 animate-spin" />
          )}
        </motion.div>
      </button>

      {/* Label */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Globe className={cn(
            'w-4 h-4 transition-colors',
            useWebSearch ? 'text-emerald-400' : 'text-zinc-500'
          )} />
          <span className={cn(
            'text-sm font-medium transition-colors',
            useWebSearch ? 'text-white' : 'text-zinc-400'
          )}>
            Web Search
          </span>
          {useWebSearch && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            >
              ONLINE
            </motion.span>
          )}
        </div>
        <p className="text-[10px] text-zinc-600 mt-0.5">
          {useWebSearch 
            ? 'Поиск актуальной информации через Perplexity AI' 
            : 'Использовать только базовые знания AI'
          }
        </p>
      </div>

      {/* Status Icon */}
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
        useWebSearch 
          ? 'bg-emerald-500/20' 
          : 'bg-white/5'
      )}>
        {isResearching ? (
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        ) : useWebSearch ? (
          <Zap className="w-4 h-4 text-emerald-400" />
        ) : (
          <Globe className="w-4 h-4 text-zinc-600" />
        )}
      </div>
    </div>
  )
}

