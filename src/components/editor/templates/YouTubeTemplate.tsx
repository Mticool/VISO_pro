import { RefObject } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { Watermark } from '../../ui/Watermark'

interface YouTubeTemplateProps {
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

export function YouTubeTemplate({
  slide,
  slideRef,
  dimensions,
  overlayOpacity,
  isRegenerating,
  onTitleChange,
  onRegenerateImage,
  onUploadImage,
  textColor,
  accentColor,
  brandHandle,
  brandLogoUrl,
}: YouTubeTemplateProps) {
  const hasImage = !!slide.image
  const hasBranding = brandHandle || brandLogoUrl

  return (
    <div
      ref={slideRef}
      className="rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50"
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
                background: `linear-gradient(135deg, rgba(0,0,0,${overlayOpacity / 80}) 0%, rgba(0,0,0,${overlayOpacity / 150}) 50%, rgba(0,0,0,${overlayOpacity / 80}) 100%)`
              }}
            />
            {isRegenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/50 via-gray-900 to-yellow-900/30 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* YouTube Thumbnail Style Content */}
      <div className="absolute inset-0 p-6 flex items-center">
        <div className="w-2/3">
          <textarea
            value={slide.title}
            onChange={onTitleChange}
            placeholder="ЗАГОЛОВОК"
            rows={3}
            className={cn(
              'w-full bg-transparent resize-none font-bebas uppercase leading-none tracking-wide outline-none border-none placeholder:opacity-30 selection:bg-yellow-500/40',
              'text-[48px]'
            )}
            style={{ 
              color: textColor,
              textShadow: `
                3px 3px 0 ${accentColor},
                -2px -2px 0 #000,
                2px -2px 0 #000,
                -2px 2px 0 #000,
                0 4px 20px rgba(0,0,0,0.8)
              `,
              WebkitTextStroke: '1px rgba(0,0,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* Duration Badge */}
      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 rounded text-xs font-medium text-white">
        10:25
      </div>

      {/* Branding */}
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
          {brandHandle && (
            <span 
              className="text-sm font-bold px-2 py-1 bg-black/50 rounded backdrop-blur-sm"
              style={{ color: textColor }}
            >
              {brandHandle}
            </span>
          )}
        </div>
      )}

      {/* Watermark */}
      <Watermark />

      {/* Controls */}
      {hasImage && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            onClick={onUploadImage}
            className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:bg-black/60 hover:text-white transition-all"
          >
            <UploadCloud className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={onRegenerateImage}
            disabled={isRegenerating}
            className="p-2.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:bg-black/60 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
          </motion.button>
        </div>
      )}
    </div>
  )
}

