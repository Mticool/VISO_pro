import { useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Layers, Type, Palette, Settings, Download, Sparkles, ChevronLeft } from 'lucide-react'
import { cn } from '../../lib/utils'
import { BottomSheet } from '../ui/BottomSheet'
import { useStore } from '../../store/useStore'

type ActiveSheet = 'slides' | 'text' | 'style' | 'settings' | null

interface MobileLayoutProps {
  slidesContent: ReactNode
  canvasContent: ReactNode
  styleContent: ReactNode
  settingsContent: ReactNode
}

export function MobileLayout({ slidesContent, canvasContent, styleContent, settingsContent }: MobileLayoutProps) {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null)
  const { slides, topic, resetSlides } = useStore()

  const navItems = [
    { id: 'slides' as const, icon: Layers, label: 'Слайды', badge: slides.length },
    { id: 'text' as const, icon: Type, label: 'Текст' },
    { id: 'style' as const, icon: Palette, label: 'Стиль' },
    { id: 'settings' as const, icon: Settings, label: 'Ещё' },
  ]

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Mobile Header */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {slides.length > 0 && (
            <button
              onClick={resetSlides}
              className="p-2 -ml-2 rounded-xl text-zinc-400 active:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">VISO</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl',
            'bg-gradient-to-r from-violet-600 to-indigo-600',
            'text-sm font-medium text-white',
            'active:opacity-80'
          )}
        >
          <Download className="w-4 h-4" />
          <span>Скачать</span>
        </motion.button>
      </header>

      {/* Topic Bar (if exists) */}
      {topic && (
        <div className="px-4 py-2 bg-black/20 border-b border-white/5">
          <p className="text-sm text-zinc-400 truncate">{topic}</p>
        </div>
      )}

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-auto">
        {canvasContent}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = activeSheet === item.id
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSheet(isActive ? null : item.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 min-w-[64px] rounded-xl transition-colors',
                  isActive 
                    ? 'text-violet-400' 
                    : 'text-zinc-500 active:text-zinc-300'
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Sheets */}
      <BottomSheet
        isOpen={activeSheet === 'slides'}
        onClose={() => setActiveSheet(null)}
        title="Слайды"
        height="half"
      >
        {slidesContent}
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'text'}
        onClose={() => setActiveSheet(null)}
        title="Текст поста"
        height="half"
      >
        <MobileCaptionEditor />
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'style'}
        onClose={() => setActiveSheet(null)}
        title="Стиль"
        height="half"
      >
        {styleContent}
      </BottomSheet>

      <BottomSheet
        isOpen={activeSheet === 'settings'}
        onClose={() => setActiveSheet(null)}
        title="Настройки"
        height="auto"
      >
        {settingsContent}
      </BottomSheet>
    </div>
  )
}

// Mobile Caption Editor
function MobileCaptionEditor() {
  const { generatedCaption, setGeneratedCaption } = useStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCaption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 space-y-4">
      <textarea
        value={generatedCaption}
        onChange={(e) => setGeneratedCaption(e.target.value)}
        placeholder="Текст будет сгенерирован вместе со слайдами..."
        className={cn(
          'w-full h-40 p-4 rounded-xl resize-none',
          'bg-black/40 border border-white/5',
          'text-sm text-zinc-300 leading-relaxed',
          'placeholder:text-zinc-600',
          'focus:outline-none focus:border-violet-500/30'
        )}
      />
      
      <button
        onClick={handleCopy}
        className={cn(
          'w-full py-3 rounded-xl font-medium transition-colors',
          copied 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-white/5 text-white border border-white/5 active:bg-white/10'
        )}
      >
        {copied ? 'Скопировано!' : 'Копировать текст'}
      </button>
      
      {generatedCaption && (
        <p className="text-xs text-zinc-600 text-center">
          {generatedCaption.length} символов
        </p>
      )}
    </div>
  )
}

