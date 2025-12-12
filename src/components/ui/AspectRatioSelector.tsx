import { motion } from 'framer-motion'
import { useStore, type AspectRatio } from '../../store/useStore'
import { cn } from '../../lib/utils'

const ratioOptions: { value: AspectRatio; label: string; icon: string }[] = [
  { value: 'portrait', label: 'Пост', icon: '4:5' },
  { value: 'square', label: 'Квадрат', icon: '1:1' },
  { value: 'story', label: 'История', icon: '9:16' },
]

export function AspectRatioSelector() {
  const { aspectRatio, setAspectRatio } = useStore()

  return (
    <div className="relative flex items-center gap-0.5 p-1 bg-black/40 backdrop-blur-xl rounded-xl border border-white/5">
      {ratioOptions.map((option) => {
        const isActive = aspectRatio === option.value
        
        return (
          <button
            key={option.value}
            onClick={() => setAspectRatio(option.value)}
            className={cn(
              'relative px-2.5 py-1.5 rounded-lg text-xs font-medium',
              'transition-colors duration-200',
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="aspectRatioIndicator"
                className="absolute inset-0 bg-white/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <span className="text-[9px] font-mono text-zinc-600">{option.icon}</span>
              <span>{option.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
