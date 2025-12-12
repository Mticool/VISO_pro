import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Minus, Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

export function FontSizeSelector() {
  const { fontSize, setFontSize } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDecrease = () => setFontSize(fontSize - 2)
  const handleIncrease = () => setFontSize(fontSize + 2)

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          isOpen 
            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
            : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
        )}
      >
        <Type className="w-3.5 h-3.5" />
        <span>{fontSize}px</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-56 p-4 rounded-xl',
              'bg-[#1a1a1a]/95 backdrop-blur-xl',
              'border border-white/10',
              'shadow-xl shadow-black/50'
            )}
          >
            <h4 className="text-xs font-medium text-zinc-400 mb-3">Размер текста</h4>

            {/* Size Controls */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleDecrease}
                disabled={fontSize <= 12}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-white">{fontSize}</span>
                <span className="text-xs text-zinc-500 ml-1">px</span>
              </div>
              
              <button
                onClick={handleIncrease}
                disabled={fontSize >= 64}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min={12}
                max={64}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-violet-500
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-600">12</span>
                <span className="text-[10px] text-zinc-600">64</span>
              </div>
            </div>

            {/* Presets */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex gap-2">
                {[14, 18, 24, 32, 48].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
                      fontSize === size
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

