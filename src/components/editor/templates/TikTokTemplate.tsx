import { RefObject, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, UploadCloud, Heart, MessageCircle, Share2, Music2, Plus } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { Watermark } from '../../ui/Watermark'
import { MagicRewriteMenu } from '../../ui/MagicRewriteMenu'
import { ProFeature } from '../../ui/ProBadge'

interface TikTokTemplateProps {
  slide: Slide
  slideRef: RefObject<HTMLDivElement>
  dimensions: { width: number; height: number }
  overlayOpacity: number
  isRegenerating: boolean
  onTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onRegenerateImage: () => void
  onUploadImage: () => void
  aspectRatio: string
  fontFamily: FontFamily
  textColor: string
  accentColor: string
  brandHandle: string
  brandLogoUrl: string | null
  showSafeZones: boolean
}

const fontClasses: Record<FontFamily, string> = {
  sans: 'font-sans',
  montserrat: 'font-montserrat',
  oswald: 'font-oswald',
  playfair: 'font-playfair',
  merriweather: 'font-merriweather',
  bebas: 'font-bebas',
  open: 'font-open',
  space: 'font-space',
  caveat: 'font-caveat',
  syne: 'font-syne',
  mono: 'font-mono',
}

export function TikTokTemplate({
  slide,
  slideRef,
  dimensions,
  overlayOpacity,
  isRegenerating,
  onTitleChange,
  onRegenerateImage,
  onUploadImage,
  fontFamily,
  textColor,
  brandHandle,
  brandLogoUrl,
  showSafeZones,
}: TikTokTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  const hasImage = !!slide.image
  const fontClass = fontClasses[fontFamily]

  const handleTitleRewrite = (newText: string) => {
    onTitleChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div
      ref={slideRef}
      className={cn('rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50', fontClass)}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {hasImage ? (
          <>
            <img
              src={slide.image}
              alt=""
              className={cn('w-full h-full object-cover', isRegenerating && 'opacity-50')}
              crossOrigin="anonymous"
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity / 300}) 0%, rgba(0,0,0,${overlayOpacity / 100}) 100%)`
              }}
            />
            {isRegenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black animate-pulse" />
        )}
      </div>

      {/* Safe Zones Overlay - Won't be exported */}
      {showSafeZones && (
        <div className="safe-zones-overlay absolute inset-0 pointer-events-none z-30">
          {/* Top safe zone (status bar) */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-red-500/10 border-b border-red-500/30">
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-red-400/60">
              Зона статус-бара
            </span>
          </div>
          
          {/* Right safe zone (buttons) */}
          <div className="absolute top-20 right-0 w-16 bottom-32 bg-red-500/10 border-l border-red-500/30">
            <span className="absolute top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-red-400/60 whitespace-nowrap">
              Кнопки
            </span>
          </div>
          
          {/* Bottom safe zone (description) */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-red-500/10 border-t border-red-500/30">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-red-400/60">
              Зона описания
            </span>
          </div>
        </div>
      )}

      {/* Content - Centered in safe area */}
      <div className="absolute inset-0 pt-16 pb-32 pr-20 pl-6 flex flex-col items-center justify-center">
        <div className="relative group w-full">
          <textarea
            value={slide.title}
            onChange={onTitleChange}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Заголовок"
            rows={3}
            className={cn(
              'w-full bg-transparent resize-none font-bold text-center leading-tight tracking-tight outline-none border-none placeholder:opacity-30',
              'text-[28px]'
            )}
            style={{ 
              color: textColor,
              textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)'
            }}
          />
          <div className={cn(
            'absolute -right-10 top-0 transition-opacity duration-200',
            focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} />
            </ProFeature>
          </div>
        </div>
      </div>

      {/* TikTok UI Mockup */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4">
        {/* Profile */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white overflow-hidden">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-violet-500" />
            )}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        
        {/* Like */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] text-white mt-1">123K</span>
        </div>
        
        {/* Comment */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] text-white mt-1">1.2K</span>
        </div>
        
        {/* Share */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white mt-1">Share</span>
        </div>
        
        {/* Music */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 animate-spin-slow overflow-hidden">
          <Music2 className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-white">
            @{brandHandle || 'username'}
          </span>
        </div>
        <p className="text-xs text-white/80 line-clamp-2">
          {slide.content || 'Описание видео...'}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Music2 className="w-3 h-3 text-white/60" />
          <span className="text-[10px] text-white/60">Original Sound</span>
        </div>
      </div>

      {/* Watermark */}
      <Watermark />

      {/* Controls - Hidden during export */}
      {hasImage && (
        <div className="absolute top-16 left-4 flex items-center gap-2 export-hide">
          <motion.button
            onClick={onUploadImage}
            className="p-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:bg-black/60 hover:text-white transition-all"
          >
            <UploadCloud className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={onRegenerateImage}
            disabled={isRegenerating}
            className="p-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:bg-black/60 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
          </motion.button>
        </div>
      )}
    </div>
  )
}

