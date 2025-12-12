import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface VisualStyle {
  id: string
  name: string
  description: string
  imagePromptPrefix: string
  previewUrl: string
  isPro?: boolean
}

export const visualStyles: VisualStyle[] = [
  {
    id: 'realism',
    name: 'Реализм',
    description: 'Фотореализм, бизнес',
    imagePromptPrefix: 'photorealistic, professional photography, 8k, high detail',
    previewUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=400&fit=crop&q=80',
  },
  {
    id: '3d-render',
    name: '3D Render',
    description: 'Blender, Cinema4D',
    imagePromptPrefix: '3d render, octane render, cinema4d, vibrant colors, smooth surfaces',
    previewUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop&q=80',
    isPro: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Неон, тёмный',
    imagePromptPrefix: 'cyberpunk style, neon lights, dark atmosphere, futuristic, rain',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop&q=80',
    isPro: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Чистота, вектор',
    imagePromptPrefix: 'minimalist, clean design, vector style, simple shapes, white space',
    previewUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=400&fit=crop&q=80',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Иллюстрация',
    imagePromptPrefix: 'anime style, illustration, vibrant colors, detailed, studio ghibli inspired',
    previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop&q=80',
    isPro: true,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Ретро, плёнка',
    imagePromptPrefix: 'vintage photography, film grain, retro colors, 70s aesthetic',
    previewUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop&q=80',
  },
]

interface StyleSelectorProps {
  selectedStyle: string
  onStyleChange: (styleId: string) => void
  isPro?: boolean
}

export function StyleSelector({ selectedStyle, onStyleChange, isPro = false }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Визуальный стиль
        </h3>
      </div>
      
      {/* Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {visualStyles.map((style) => {
          const isSelected = selectedStyle === style.id
          const isLocked = style.isPro && !isPro
          
          return (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isLocked && onStyleChange(style.id)}
              className={cn(
                'relative flex-shrink-0 w-24 rounded-xl overflow-hidden',
                'border-2 transition-all duration-300',
                isSelected 
                  ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                  : 'border-white/10 hover:border-white/20',
                isLocked && 'opacity-60 cursor-not-allowed'
              )}
            >
              {/* Preview Image */}
              <div className="aspect-[3/4] relative">
                <img 
                  src={style.previewUrl} 
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Selected Check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                
                {/* Pro Badge */}
                {style.isPro && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-amber-500/80 rounded text-[8px] font-bold text-black">
                    PRO
                  </div>
                )}
                
                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-[10px] font-medium text-white truncate">{style.name}</p>
                  <p className="text-[8px] text-white/60 truncate">{style.description}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Slider for slide count
interface SlideCountSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function SlideCountSlider({ value, onChange, min = 3, max = 10 }: SlideCountSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Количество слайдов
        </h3>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span className="text-sm font-bold text-white">{value}</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          {/* Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            initial={false}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-lg border-2 border-violet-500 pointer-events-none"
          initial={false}
          animate={{ left: `calc(${((value - min) / (max - min)) * 100}% - 10px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-zinc-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

