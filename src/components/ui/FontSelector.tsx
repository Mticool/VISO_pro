import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Type } from 'lucide-react'
import { useStore, type FontFamily } from '../../store/useStore'
import { cn } from '../../lib/utils'

const fontOptions: { value: FontFamily; label: string; preview: string }[] = [
  { value: 'sans', label: 'iPhone', preview: 'font-sans' },
  { value: 'montserrat', label: 'Современный', preview: 'font-montserrat' },
  { value: 'oswald', label: 'Громкий', preview: 'font-oswald' },
  { value: 'playfair', label: 'Элегантный', preview: 'font-playfair' },
  { value: 'merriweather', label: 'Журнальный', preview: 'font-merriweather' },
  { value: 'bebas', label: 'YouTube', preview: 'font-bebas' },
  { value: 'open', label: 'Чистый', preview: 'font-open' },
  { value: 'space', label: 'Тренд 2025', preview: 'font-space' },
  { value: 'caveat', label: 'Рукописный', preview: 'font-caveat' },
  { value: 'syne', label: 'Артхаус', preview: 'font-syne' },
  { value: 'mono', label: 'Код', preview: 'font-mono' },
]

export function FontSelector() {
  const { fontFamily, setFontFamily } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedFont = fontOptions.find(f => f.value === fontFamily) || fontOptions[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5',
          'bg-black/40 backdrop-blur-xl',
          'border border-white/5',
          'rounded-xl',
          'text-xs text-zinc-400',
          'transition-all duration-200',
          'hover:bg-white/5 hover:border-white/10',
          isOpen && 'bg-white/5 border-white/10'
        )}
      >
        <Type className="w-3.5 h-3.5 text-zinc-500" />
        <span className={cn('min-w-[70px] text-left', selectedFont.preview)}>
          {selectedFont.label}
        </span>
        <ChevronDown className={cn(
          'w-3.5 h-3.5 text-zinc-600 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-1 z-50',
              'w-[160px] max-h-[280px] overflow-y-auto',
              'bg-[#0a0a0a]/95 backdrop-blur-2xl',
              'border border-white/10',
              'rounded-xl shadow-2xl',
              'py-1'
            )}
          >
            {fontOptions.map((option) => {
              const isSelected = fontFamily === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => { setFontFamily(option.value); setIsOpen(false); }}
                  className={cn(
                    'w-full px-3 py-2 text-left',
                    'transition-colors duration-150',
                    isSelected 
                      ? 'bg-indigo-500/20 text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-300'
                  )}
                >
                  <span className={cn('text-sm', option.preview)}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
