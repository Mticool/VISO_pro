import { RefObject, useState, useMemo } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily, AspectRatio } from '../../../store/useStore'
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
  aspectRatio: AspectRatio
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

// Smart resize configuration
const getLayoutConfig = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case 'story': // 9:16 vertical
      return {
        contentPosition: 'top', // Move content up
        contentPaddingTop: '15%',
        contentPaddingBottom: '25%',
        titleSize: 'text-[32px]',
        titleScale: 1.1,
        contentSize: 'text-lg',
        titleRows: 3,
        contentRows: 4,
        textAlign: 'center' as const,
        justify: 'start' as const,
        paddingX: 'px-6',
      }
    case 'square': // 1:1
      return {
        contentPosition: 'center',
        contentPaddingTop: '0',
        contentPaddingBottom: '0',
        titleSize: 'text-[30px]',
        titleScale: 1,
        contentSize: 'text-base',
        titleRows: 2,
        contentRows: 3,
        textAlign: 'center' as const,
        justify: 'center' as const,
        paddingX: 'px-6',
      }
    case 'youtube': // 16:9 horizontal
    case 'landscape':
      return {
        contentPosition: 'left',
        contentPaddingTop: '0',
        contentPaddingBottom: '0',
        titleSize: 'text-[36px]',
        titleScale: 1,
        contentSize: 'text-base',
        titleRows: 2,
        contentRows: 2,
        textAlign: 'left' as const,
        justify: 'center' as const,
        paddingX: 'px-8',
        maxWidth: '55%',
      }
    case 'portrait': // 4:5
    default:
      return {
        contentPosition: 'bottom',
        contentPaddingTop: '0',
        contentPaddingBottom: '0',
        titleSize: 'text-[32px]',
        titleScale: 1,
        contentSize: 'text-lg',
        titleRows: 2,
        contentRows: 4,
        textAlign: 'left' as const,
        justify: 'end' as const,
        paddingX: 'px-8',
      }
  }
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
  const hasImage = !!slide.image
  const fontClass = fontClasses[fontFamily]
  const hasBranding = brandHandle || brandLogoUrl
  
  // Get smart layout config
  const layout = useMemo(() => getLayoutConfig(aspectRatio), [aspectRatio])

  const overlayGradient = useMemo(() => {
    if (aspectRatio === 'youtube' || aspectRatio === 'landscape') {
      // Gradient from left for horizontal layouts
      return `linear-gradient(to right, rgba(0,0,0,${overlayOpacity / 100 + 0.4}) 0%, rgba(0,0,0,${overlayOpacity / 100 + 0.2}) 50%, rgba(0,0,0,0.1) 100%)`
    }
    if (aspectRatio === 'story') {
      // Gradient from top and bottom for stories
      return `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity / 100 + 0.3}) 0%, rgba(0,0,0,${overlayOpacity / 200}) 40%, rgba(0,0,0,${overlayOpacity / 200}) 60%, rgba(0,0,0,${overlayOpacity / 100 + 0.4}) 100%)`
    }
    // Default bottom gradient
    return `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100 + 0.2}), rgba(0,0,0,${overlayOpacity / 200}), rgba(0,0,0,${overlayOpacity / 400}))`
  }, [aspectRatio, overlayOpacity])

  const handleTitleRewrite = (newText: string) => {
    onTitleChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const handleContentRewrite = (newText: string) => {
    onContentChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <LayoutGroup>
      <motion.div
        ref={slideRef}
        layout
        className={cn('rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50', fontClass)}
        style={{ width: dimensions.width, height: dimensions.height }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background */}
        <motion.div className="absolute inset-0" layout>
          {hasImage ? (
            <>
              <motion.img
                layout
                src={slide.image}
                alt=""
                className={cn('w-full h-full object-cover', isRegenerating && 'opacity-50')}
                crossOrigin="anonymous"
                style={{
                  // Shift image for YouTube/landscape to show face on right
                  objectPosition: (aspectRatio === 'youtube' || aspectRatio === 'landscape') ? 'right center' : 'center',
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.div 
                layout
                className="absolute inset-0 transition-opacity duration-500"
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
        </motion.div>

        {/* Content Container - Smart Positioning */}
        <motion.div 
          layout
          className={cn(
            'absolute inset-0 flex flex-col',
            layout.paddingX,
            layout.justify === 'center' && 'justify-center',
            layout.justify === 'end' && 'justify-end pb-16',
            layout.justify === 'start' && 'justify-start'
          )}
          style={{
            paddingTop: layout.contentPaddingTop,
            paddingBottom: layout.contentPaddingBottom,
            maxWidth: layout.maxWidth || '100%',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Title with Magic Rewrite */}
          <motion.div 
            layout
            className="relative group"
            transition={{ duration: 0.4 }}
          >
            <motion.textarea
              layout
              value={slide.title}
              onChange={onTitleChange}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              placeholder="Заголовок"
              rows={layout.titleRows}
              className={cn(
                'w-full bg-transparent resize-none font-bold leading-[1.1] tracking-tight outline-none border-none placeholder:opacity-30 selection:bg-violet-500/40',
                layout.titleSize,
                fontFamily === 'bebas' && 'tracking-wider',
                fontFamily === 'caveat' && 'text-[38px]',
                layout.textAlign === 'center' && 'text-center',
                layout.textAlign === 'left' && 'text-left',
              )}
              style={{ 
                color: textColor,
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)',
                transform: `scale(${layout.titleScale})`,
                transformOrigin: layout.textAlign === 'center' ? 'center top' : 'left top',
              }}
            />
            {/* Magic Button for Title */}
            <div className={cn(
              'absolute -right-12 top-0 transition-opacity duration-200',
              focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
              <ProFeature>
                <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} />
              </ProFeature>
            </div>
          </motion.div>

          {/* Content with Magic Rewrite */}
          <motion.div 
            layout
            className="relative group mt-4"
            transition={{ duration: 0.4 }}
          >
            <motion.textarea
              layout
              value={slide.content}
              onChange={onContentChange}
              onFocus={() => setFocusedField('content')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              placeholder="Добавьте текст..."
              rows={layout.contentRows}
              className={cn(
                'w-full bg-transparent resize-none leading-relaxed tracking-[-0.01em] outline-none border-none placeholder:opacity-30 selection:bg-violet-500/40',
                layout.contentSize,
                fontFamily === 'caveat' && 'text-xl',
                layout.textAlign === 'center' && 'text-center',
                layout.textAlign === 'left' && 'text-left',
              )}
              style={{ 
                color: textColor,
                opacity: 0.9,
                textShadow: '0 1px 10px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4)'
              }}
            />
            {/* Magic Button for Content */}
            <div className={cn(
              'absolute -right-12 top-0 transition-opacity duration-200',
              focusedField === 'content' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
              <ProFeature>
                <MagicRewriteMenu text={slide.content} onRewrite={handleContentRewrite} />
              </ProFeature>
            </div>
          </motion.div>
        </motion.div>

        {/* Branding Footer */}
        {hasBranding && (
          <motion.div 
            layout
            className={cn(
              'absolute left-0 right-0 flex items-center gap-2 opacity-80',
              aspectRatio === 'story' ? 'bottom-[20%] justify-center' : 'bottom-4 justify-center'
            )}
            transition={{ duration: 0.4 }}
          >
            {brandLogoUrl && (
              <img src={brandLogoUrl} alt="Logo" className="w-6 h-6 rounded-md object-cover" crossOrigin="anonymous" />
            )}
            {brandHandle && (
              <span className="text-sm font-medium" style={{ color: textColor, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                @{brandHandle.replace('@', '')}
              </span>
            )}
          </motion.div>
        )}

        {/* Watermark for Free Users */}
        <Watermark />

        {/* Accent Line - Position adapts */}
        <motion.div 
          layout
          className={cn(
            'absolute h-1 rounded-full opacity-60',
            aspectRatio === 'story' ? 'bottom-[18%] left-1/4 right-1/4' : 'bottom-0 left-8 right-8'
          )}
          style={{ backgroundColor: accentColor }} 
          transition={{ duration: 0.4 }}
        />

        {/* Badge */}
        {slide.type === 'cover' && (
          <motion.div 
            layout
            className={cn(
              'absolute',
              aspectRatio === 'story' ? 'top-[12%] left-1/2 -translate-x-1/2' : 'top-6 left-6'
            )}
            transition={{ duration: 0.4 }}
          >
            <span 
              className="px-3 py-1.5 backdrop-blur-xl rounded-full text-xs font-medium border font-sans"
              style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40`, color: textColor }}
            >
              Обложка
            </span>
          </motion.div>
        )}

        {/* Image Controls - Hidden during export */}
        {hasImage && (
          <motion.div 
            layout
            className="absolute top-6 right-6 flex items-center gap-2 export-hide"
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </motion.div>
    </LayoutGroup>
  )
}
