import { useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useStore, type AspectRatio } from '../../store/useStore'
import { cn } from '../../lib/utils'

const aspectDimensions: Record<AspectRatio, { width: number; height: number }> = {
  portrait: { width: 320, height: 400 },
  square: { width: 320, height: 320 },
  story: { width: 270, height: 480 },
  landscape: { width: 400, height: 250 },
  youtube: { width: 400, height: 225 },
}

// Convert external images to base64 for export
async function convertImagesToBase64(container: HTMLElement) {
  const images = container.querySelectorAll('img')
  const promises = Array.from(images).map(async (img) => {
    if (img.src.startsWith('data:') || img.src.startsWith('blob:')) return
    
    try {
      const response = await fetch(img.src, { mode: 'cors' })
      const blob = await response.blob()
      const reader = new FileReader()
      
      return new Promise<void>((resolve) => {
        reader.onloadend = () => {
          img.src = reader.result as string
          resolve()
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.warn('Failed to convert image:', img.src)
    }
  })
  
  await Promise.all(promises)
}

export function MobileCanvas() {
  const slideRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  
  const { 
    slides, activeSlideId, setActiveSlide, updateSlide, 
    regenerateSlideImage, regeneratingImageId,
    aspectRatio, fontFamily, textColor, overlayOpacity,
    brandHandle, brandLogoUrl
  } = useStore()
  
  const activeSlide = slides.find(s => s.id === activeSlideId)
  const activeIndex = slides.findIndex(s => s.id === activeSlideId)
  const isRegenerating = regeneratingImageId === activeSlide?.id
  const dimensions = aspectDimensions[aspectRatio]

  const handleDownload = useCallback(async () => {
    if (!slideRef.current || isExporting) return
    setIsExporting(true)
    
    try {
      // Convert external images to base64 to avoid CORS issues
      await convertImagesToBase64(slideRef.current)
      
      const dataUrl = await toPng(slideRef.current, {
        quality: 1, 
        pixelRatio: 3, 
        cacheBust: true,
        backgroundColor: '#000',
      })
      const link = document.createElement('a')
      link.download = `viso-slide-${activeSlide?.id || 'export'}.png`
      link.href = dataUrl
      link.click()
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [activeSlide?.id, isExporting])

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      setActiveSlide(slides[activeIndex - 1].id)
    }
  }

  const goToNextSlide = () => {
    if (activeIndex < slides.length - 1) {
      setActiveSlide(slides[activeIndex + 1].id)
    }
  }

  if (!activeSlide) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {/* Slide Navigation */}
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={goToPrevSlide}
          disabled={activeIndex === 0}
          className={cn(
            'p-3 rounded-xl',
            activeIndex === 0 ? 'text-zinc-700' : 'text-zinc-400 active:bg-white/10'
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(slides[i].id)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === activeIndex ? 'bg-violet-500 w-6' : 'bg-zinc-700'
              )}
            />
          ))}
        </div>
        
        <button
          onClick={goToNextSlide}
          disabled={activeIndex === slides.length - 1}
          className={cn(
            'p-3 rounded-xl',
            activeIndex === slides.length - 1 ? 'text-zinc-700' : 'text-zinc-400 active:bg-white/10'
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide */}
      <div
        ref={slideRef}
        className="rounded-2xl overflow-hidden relative shadow-2xl"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          {activeSlide.image ? (
            <>
              <img
                src={activeSlide.image}
                alt=""
                className={cn('w-full h-full object-cover', isRegenerating && 'opacity-50')}
                crossOrigin="anonymous"
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity / 100 + 0.2}), rgba(0,0,0,${overlayOpacity / 200}), rgba(0,0,0,${overlayOpacity / 400}))`
                }}
              />
              {isRegenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-900/50 via-gray-900 to-indigo-900/50" />
          )}
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <textarea
            value={activeSlide.title}
            onChange={(e) => updateSlide(activeSlide.id, { title: e.target.value })}
            placeholder="Заголовок"
            rows={2}
            className={cn(
              'w-full bg-transparent resize-none font-bold text-2xl leading-tight tracking-tight outline-none border-none placeholder:opacity-30',
              `font-${fontFamily}`
            )}
            style={{ 
              color: textColor,
              textShadow: '0 2px 20px rgba(0,0,0,0.8)'
            }}
          />
          
          <textarea
            value={activeSlide.content}
            onChange={(e) => updateSlide(activeSlide.id, { content: e.target.value })}
            placeholder="Добавьте текст..."
            rows={3}
            className={cn(
              'w-full bg-transparent resize-none text-sm leading-relaxed outline-none border-none placeholder:opacity-30 mt-2',
              `font-${fontFamily}`
            )}
            style={{ 
              color: textColor,
              opacity: 0.9,
              textShadow: '0 1px 10px rgba(0,0,0,0.6)'
            }}
          />
        </div>

        {/* Branding */}
        {(brandHandle || brandLogoUrl) && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 opacity-70">
            {brandLogoUrl && (
              <img src={brandLogoUrl} alt="Logo" className="w-5 h-5 rounded object-cover" />
            )}
            {brandHandle && (
              <span className="text-xs font-medium" style={{ color: textColor }}>
                @{brandHandle.replace('@', '')}
              </span>
            )}
          </div>
        )}

        {/* Refresh Button */}
        {activeSlide.image && (
          <button
            onClick={() => regenerateSlideImage(activeSlide.id)}
            disabled={isRegenerating}
            className="absolute top-3 right-3 p-2.5 rounded-xl bg-black/40 backdrop-blur text-white/70 active:bg-black/60"
          >
            <RefreshCw className={cn('w-4 h-4', isRegenerating && 'animate-spin')} />
          </button>
        )}
      </div>

      {/* Export Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        disabled={isExporting}
        className={cn(
          'flex items-center gap-2 px-6 py-3 mt-6 rounded-xl',
          'bg-gradient-to-r from-violet-600 to-indigo-600',
          'text-white font-medium',
          'disabled:opacity-50',
          exportSuccess && 'from-emerald-600 to-emerald-500'
        )}
      >
        {isExporting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : exportSuccess ? (
          <Check className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span>{exportSuccess ? 'Сохранено!' : 'Скачать PNG'}</span>
      </motion.button>

      {/* Slide Counter */}
      <p className="mt-3 text-xs text-zinc-600">
        {activeIndex + 1} из {slides.length}
      </p>
    </div>
  )
}

