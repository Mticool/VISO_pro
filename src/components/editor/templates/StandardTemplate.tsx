import { RefObject, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { useStore } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { MagicRewriteMenu } from '../../ui/MagicRewriteMenu'
import { Watermark } from '../../ui/Watermark'
import { ProFeature } from '../../ui/ProBadge'

interface StandardTemplateProps {
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

export function StandardTemplate({
  slide,
  slideRef,
  dimensions,
  overlayOpacity,
  isRegenerating,
  onTitleChange,
  onContentChange,
  onRegenerateImage,
  onUploadImage,
  aspectRatio,
  fontFamily,
  textColor,
  accentColor,
  brandHandle,
  brandLogoUrl,
}: StandardTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  const { isPro } = useStore()
  const hasImage = !!slide.image
  const fontClass = fontClasses[fontFamily]
  const hasBranding = brandHandle || brandLogoUrl

  const overlayGradient = `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100 + 0.2}), rgba(0,0,0,${overlayOpacity / 200}), rgba(0,0,0,${overlayOpacity / 400}))`

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
              className="absolute inset-0 transition-opacity duration-300"
              style={{ background: overlayGradient }}
            />
            {isRegenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/50 via-gray-900 to-indigo-900/50 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 pb-16 flex flex-col justify-end">
        {/* Title with Magic Rewrite */}
        <div className="relative group">
          <textarea
            value={slide.title}
            onChange={onTitleChange}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Заголовок"
            rows={aspectRatio === 'story' ? 3 : 2}
            className={cn(
              'w-full bg-transparent resize-none font-bold leading-[1.1] tracking-tight outline-none border-none placeholder:opacity-30 selection:bg-violet-500/40',
              aspectRatio === 'story' ? 'text-[28px]' : 'text-[32px]',
              fontFamily === 'bebas' && 'tracking-wider',
              fontFamily === 'caveat' && 'text-[38px]'
            )}
            style={{ 
              color: textColor,
              textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)'
            }}
          />
          {/* Magic Button for Title - Pro Feature */}
          <div className={cn(
            'absolute -right-12 top-0 transition-opacity duration-200',
            focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} />
            </ProFeature>
          </div>
        </div>

        {/* Content with Magic Rewrite */}
        <div className="relative group mt-4">
          <textarea
            value={slide.content}
            onChange={onContentChange}
            onFocus={() => setFocusedField('content')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Добавьте текст..."
            rows={aspectRatio === 'story' ? 5 : 4}
            className={cn(
              'w-full bg-transparent resize-none leading-relaxed tracking-[-0.01em] outline-none border-none placeholder:opacity-30 selection:bg-violet-500/40',
              aspectRatio === 'story' ? 'text-base' : 'text-lg',
              fontFamily === 'caveat' && 'text-xl'
            )}
            style={{ 
              color: textColor,
              opacity: 0.9,
              textShadow: '0 1px 10px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4)'
            }}
          />
          {/* Magic Button for Content - Pro Feature */}
          <div className={cn(
            'absolute -right-12 top-0 transition-opacity duration-200',
            focusedField === 'content' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.content} onRewrite={handleContentRewrite} />
            </ProFeature>
          </div>
        </div>
      </div>

      {/* Branding Footer */}
      {hasBranding && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-80">
          {brandLogoUrl && (
            <img src={brandLogoUrl} alt="Logo" className="w-6 h-6 rounded-md object-cover" crossOrigin="anonymous" />
          )}
          {brandHandle && (
            <span className="text-sm font-medium" style={{ color: textColor, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
              @{brandHandle.replace('@', '')}
            </span>
          )}
        </div>
      )}

      {/* Watermark for Free Users */}
      <Watermark />

      {/* Accent Line */}
      <div className="absolute bottom-0 left-8 right-8 h-1 rounded-full opacity-60" style={{ backgroundColor: accentColor }} />

      {/* Badge */}
      {slide.type === 'cover' && (
        <div className="absolute top-6 left-6">
          <span 
            className="px-3 py-1.5 backdrop-blur-xl rounded-full text-xs font-medium border font-sans"
            style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40`, color: textColor }}
          >
            Обложка
          </span>
        </div>
      )}

      {/* Image Controls */}
      {hasImage && (
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onUploadImage}
            className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 transition-all duration-200 hover:bg-black/60 hover:text-white hover:border-white/20"
            title="Загрузить фото"
          >
            <UploadCloud className="w-4 h-4" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onRegenerateImage}
            disabled={isRegenerating}
            className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 transition-all duration-200 hover:bg-black/60 hover:text-white hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Новое фото"
          >
            <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
