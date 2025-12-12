import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Scissors, Smile, Briefcase, Megaphone, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RewriteCommand {
  id: string
  label: string
  icon: typeof Scissors
  description: string
}

const commands: RewriteCommand[] = [
  { id: 'shorten', label: 'Сократить', icon: Scissors, description: 'Сделать текст лаконичнее' },
  { id: 'funny', label: 'Добавить юмора', icon: Smile, description: 'Сделать живее и забавнее' },
  { id: 'formal', label: 'Официально', icon: Briefcase, description: 'Деловой стиль' },
  { id: 'clickbait', label: 'Кликбейт', icon: Megaphone, description: 'Максимально цепляюще' },
  { id: 'fix', label: 'Исправить', icon: Sparkles, description: 'Грамматика и стиль' },
]

interface MagicRewriteMenuProps {
  text: string
  onRewrite: (newText: string) => void
  position?: 'top' | 'bottom'
}

export function MagicRewriteMenu({ text, onRewrite, position = 'top' }: MagicRewriteMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingCommand, setLoadingCommand] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRewrite = async (commandId: string) => {
    if (!text.trim() || isLoading) return

    setIsLoading(true)
    setLoadingCommand(commandId)

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, command: commandId }),
      })

      if (!response.ok) throw new Error('Rewrite failed')

      const data = await response.json()
      onRewrite(data.result)
      setIsOpen(false)
    } catch (error) {
      console.error('Rewrite error:', error)
    } finally {
      setIsLoading(false)
      setLoadingCommand(null)
    }
  }

  if (!text.trim()) return null

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-lg',
          'bg-gradient-to-r from-violet-600/20 to-indigo-600/20',
          'border border-violet-500/30',
          'text-violet-400',
          'transition-all duration-200',
          'hover:from-violet-600/30 hover:to-indigo-600/30',
          'hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',
          isOpen && 'from-violet-600/30 to-indigo-600/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
        )}
        title="Magic Rewrite"
      >
        <Wand2 className="w-4 h-4" />
      </motion.button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50',
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'right-0',
              'w-56',
              'bg-[#0a0a0a]/95 backdrop-blur-2xl',
              'border border-violet-500/20',
              'rounded-xl shadow-2xl shadow-violet-500/10',
              'overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-medium text-violet-300">Magic Rewrite</span>
              </div>
            </div>

            {/* Commands */}
            <div className="py-1">
              {commands.map((command) => {
                const Icon = command.icon
                const isCommandLoading = loadingCommand === command.id

                return (
                  <button
                    key={command.id}
                    onClick={() => handleRewrite(command.id)}
                    disabled={isLoading}
                    className={cn(
                      'w-full px-3 py-2.5 text-left',
                      'flex items-center gap-3',
                      'transition-all duration-150',
                      'hover:bg-violet-500/10',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isCommandLoading && 'bg-violet-500/10'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      'bg-white/5',
                      isCommandLoading && 'bg-violet-500/20'
                    )}>
                      {isCommandLoading ? (
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-zinc-300">{command.label}</div>
                      <div className="text-[10px] text-zinc-600 truncate">{command.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

