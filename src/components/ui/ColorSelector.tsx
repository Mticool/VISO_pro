import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, ChevronDown } from 'lucide-react'
import { useStore, colorPalettes } from '../../store/useStore'
import { cn } from '../../lib/utils'

export function ColorSelector() {
  const { textColor, accentColor, setTextColor, setAccentColor, applyPalette } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        <Palette className="w-3.5 h-3.5 text-zinc-500" />
        <div className="flex items-center gap-0.5">
          <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: textColor }} />
          <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: accentColor }} />
        </div>
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
              'absolute top-full right-0 mt-1 z-50',
              'w-[240px]',
              'bg-[#0a0a0a]/95 backdrop-blur-2xl',
              'border border-white/10',
              'rounded-xl shadow-2xl',
              'p-3'
            )}
          >
            {/* Palettes */}
            <div className="mb-3">
              <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2 block">
                Пресеты
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => applyPalette(palette)}
                    className={cn(
                      'aspect-square rounded-lg overflow-hidden',
                      'border border-white/10 hover:border-white/30',
                      'transition-all duration-200 hover:scale-105'
                    )}
                    title={palette.name}
                  >
                    <div className="h-full flex">
                      <div className="w-1/2 h-full" style={{ backgroundColor: palette.textColor }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: palette.accentColor }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-[10px] text-zinc-600 uppercase tracking-wider block">
                Свои цвета
              </label>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Текст</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-16 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-400 outline-none focus:border-white/20"
                  />
                  <label className="relative cursor-pointer">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-6 h-6 rounded border border-white/20 cursor-pointer hover:border-white/40 transition-colors" style={{ backgroundColor: textColor }} />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Акцент</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 px-1.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-400 outline-none focus:border-white/20"
                  />
                  <label className="relative cursor-pointer">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-6 h-6 rounded border border-white/20 cursor-pointer hover:border-white/40 transition-colors" style={{ backgroundColor: accentColor }} />
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
