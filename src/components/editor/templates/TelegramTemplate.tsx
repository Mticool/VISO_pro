import { RefObject, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, UploadCloud, Eye, MessageCircle, Forward } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { Watermark } from '../../ui/Watermark'
import { MagicRewriteMenu } from '../../ui/MagicRewriteMenu'
import { ProFeature } from '../../ui/ProBadge'

interface TelegramTemplateProps {
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

export function TelegramTemplate({
  slide,
  slideRef,
  dimensions,
  overlayOpacity,
  isRegenerating,
  onTitleChange,
  onContentChange,
  onRegenerateImage,
  onUploadImage,
  fontFamily,
  textColor,
  accentColor,
  brandHandle,
  brandLogoUrl,
}: TelegramTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  const hasImage = !!slide.image
  const fontClass = fontClasses[fontFamily]
  const hasBranding = brandHandle || brandLogoUrl

  const handleTitleRewrite = (newText: string) => {
    onTitleChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const handleContentRewrite = (newText: string) => {
    onContentChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
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
                background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity / 200}) 0%, rgba(0,0,0,${overlayOpacity / 80}) 100%)`
              }}
            />
            {isRegenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-gray-900 to-cyan-900/30 animate-pulse" />
        )}
      </div>

      {/* Magazine Style Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {/* Channel Branding */}
        {hasBranding && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {brandLogoUrl && (
              <img 
                src={brandLogoUrl} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20" 
                crossOrigin="anonymous" 
              />
            )}
            <div>
              <span className="text-sm font-bold text-white block">
                {brandHandle || 'Channel'}
              </span>
              <span className="text-[10px] text-white/60">
                Telegram Channel
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="relative group">
          <textarea
            value={slide.title}
            onChange={onTitleChange}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Заголовок"
            rows={2}
            className={cn(
              'w-full bg-transparent resize-none font-bold leading-tight tracking-tight outline-none border-none placeholder:opacity-30',
              'text-[32px]'
            )}
            style={{ 
              color: textColor,
              textShadow: '0 2px 20px rgba(0,0,0,0.8)'
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

        {/* Subtitle */}
        <div className="relative group mt-2">
          <textarea
            value={slide.content}
            onChange={onContentChange}
            onFocus={() => setFocusedField('content')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Подзаголовок..."
            rows={2}
            className={cn(
              'w-full bg-transparent resize-none leading-relaxed outline-none border-none placeholder:opacity-30',
              'text-lg'
            )}
            style={{ 
              color: textColor,
              opacity: 0.85,
              textShadow: '0 1px 10px rgba(0,0,0,0.6)'
            }}
          />
          <div className={cn(
            'absolute -right-10 top-0 transition-opacity duration-200',
            focusedField === 'content' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.content} onRewrite={handleContentRewrite} />
            </ProFeature>
          </div>
        </div>

        {/* Telegram Stats Bar */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-white/50" />
            <span className="text-xs text-white/50">12.5K</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-white/50" />
            <span className="text-xs text-white/50">234</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Forward className="w-4 h-4 text-white/50" />
            <span className="text-xs text-white/50">89</span>
          </div>
        </div>
      </div>

      {/* Telegram Style Badge */}
      <div className="absolute top-4 right-4">
        <div 
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: accentColor,
            color: '#fff'
          }}
        >
          Читать →
        </div>
      </div>

      {/* Watermark */}
      <Watermark />

      {/* Controls - Hidden during export */}
      {hasImage && (
        <div className="absolute top-14 right-4 flex items-center gap-2 export-hide">
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

