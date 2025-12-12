import { motion } from 'framer-motion'
import { Image, FileText, MessageSquare } from 'lucide-react'
import { useStore, type Template } from '../../store/useStore'
import { cn } from '../../lib/utils'

const templateOptions: { value: Template; label: string; icon: typeof Image }[] = [
  { value: 'standard', label: 'Стандарт', icon: Image },
  { value: 'notes', label: 'Заметки', icon: FileText },
  { value: 'chat', label: 'Чат', icon: MessageSquare },
]

export function TemplateSelector() {
  const { template, setTemplate } = useStore()

  return (
    <div className="relative flex items-center gap-0.5 p-1 bg-black/40 backdrop-blur-xl rounded-xl border border-white/5">
      {templateOptions.map((option) => {
        const isActive = template === option.value
        const Icon = option.icon
        
        return (
          <button
            key={option.value}
            onClick={() => setTemplate(option.value)}
            className={cn(
              'relative px-2.5 py-1.5 rounded-lg text-xs font-medium',
              'transition-colors duration-200',
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="templateIndicator"
                className="absolute inset-0 bg-white/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Icon className="w-3.5 h-3.5" />
              <span>{option.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
