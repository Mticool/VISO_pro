import { motion } from 'framer-motion'
import { useStore, colorPalettes, platformConfig, type Platform } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { Instagram, Send, Youtube, Video, Check } from 'lucide-react'

const platformIcons: Record<Platform, typeof Instagram> = {
  instagram: Instagram,
  telegram: Send,
  youtube: Youtube,
  tiktok: Video,
}

const fonts = [
  { id: 'sans', name: 'iPhone' },
  { id: 'montserrat', name: 'Modern' },
  { id: 'oswald', name: 'Bold' },
  { id: 'playfair', name: 'Elegant' },
  { id: 'bebas', name: 'YouTube' },
  { id: 'caveat', name: 'Hand' },
]

export function MobileStylePanel() {
  const { 
    platform, setPlatform,
    fontFamily, setFontFamily,
    textColor, setTextColor,
    accentColor, setAccentColor,
    applyPalette,
  } = useStore()

  return (
    <div className="p-4 space-y-6">
      {/* Platform Selector */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Платформа</h4>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(platformConfig) as Platform[]).map((p) => {
            const Icon = platformIcons[p]
            const config = platformConfig[p]
            const isActive = platform === p
            
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                  isActive 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/5 border border-white/5 active:bg-white/10'
                )}
                style={isActive ? { borderColor: `${config.color}50` } : undefined}
              >
                <Icon 
                  className="w-6 h-6" 
                  style={{ color: isActive ? config.color : '#71717a' }}
                />
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-white' : 'text-zinc-500'
                )}>
                  {config.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Font Selector */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Шрифт</h4>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map((font) => {
            const isActive = fontFamily === font.id
            
            return (
              <button
                key={font.id}
                onClick={() => setFontFamily(font.id as any)}
                className={cn(
                  'py-3 px-4 rounded-xl text-sm font-medium transition-all',
                  isActive 
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                    : 'bg-white/5 text-zinc-400 border border-white/5 active:bg-white/10'
                )}
              >
                {font.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Color Palettes */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Цветовая тема</h4>
        <div className="grid grid-cols-4 gap-2">
          {colorPalettes.map((palette) => {
            const isActive = textColor === palette.textColor && accentColor === palette.accentColor
            
            return (
              <button
                key={palette.id}
                onClick={() => applyPalette(palette)}
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  isActive ? 'border-white' : 'border-transparent'
                )}
              >
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full" style={{ backgroundColor: palette.textColor }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: palette.accentColor }} />
                </div>
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Custom Colors */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Свой цвет</h4>
        <div className="flex gap-3">
          <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <div>
              <span className="text-xs text-zinc-500">Текст</span>
              <p className="text-sm text-white font-mono">{textColor}</p>
            </div>
          </label>
          
          <label className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <div>
              <span className="text-xs text-zinc-500">Акцент</span>
              <p className="text-sm text-white font-mono">{accentColor}</p>
            </div>
          </label>
        </div>
      </section>
    </div>
  )
}

