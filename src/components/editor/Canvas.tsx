import { useRef, useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Loader2, Check, Eye, Grid2X2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useStore, type AspectRatio } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { AspectRatioSelector } from '../ui/AspectRatioSelector'
import { TemplateSelector } from '../ui/TemplateSelector'
import { FontSelector } from '../ui/FontSelector'
import { FontSizeSelector } from '../ui/FontSizeSelector'
import { ColorSelector } from '../ui/ColorSelector'
import { BrandingPanel } from '../ui/BrandingPanel'
import { InstagramPreview } from '../ui/InstagramPreview'
import { StandardTemplate } from './templates/StandardTemplate'
import { NotesTemplate } from './templates/NotesTemplate'
import { ChatTemplate } from './templates/ChatTemplate'
import { YouTubeTemplate } from './templates/YouTubeTemplate'
import { TikTokTemplate } from './templates/TikTokTemplate'
import { TelegramTemplate } from './templates/TelegramTemplate'
import { CoversGenerator } from './CoversGenerator'

const aspectDimensions: Record<AspectRatio, { width: number; height: number }> = {
  portrait: { width: 480, height: 600 },
  square: { width: 540, height: 540 },
  story: { width: 405, height: 720 },
  landscape: { width: 640, height: 400 },
  youtube: { width: 640, height: 360 },
}

type ViewMode = 'editor' | 'covers'

// Convert external images to base64 for export using proxy
async function convertImagesToBase64(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img')
  
  const promises = Array.from(images).map(async (img) => {
    // Skip already converted or local images
    if (img.src.startsWith('data:') || img.src.startsWith('blob:') || !img.src) return
    
    const originalSrc = img.src
    
    try {
      // Use our proxy to bypass CORS
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalSrc)}`
      
      const response = await fetch(proxyUrl, { 
        cache: 'no-cache'
      })
      
      if (!response.ok) throw new Error(`Proxy failed: ${response.status}`)
      
      const blob = await response.blob()
      
      return new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            img.src = reader.result as string
          }
          resolve()
        }
        reader.onerror = () => resolve()
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.warn('Failed to convert image via proxy:', originalSrc, error)
    }
  })
  
  await Promise.all(promises)
}

// Hide UI elements before export
function prepareForExport(container: HTMLElement): (() => void) {
  const elementsToHide = container.querySelectorAll('.export-hide')
  const originalDisplay: string[] = []
  
  elementsToHide.forEach((el, i) => {
    const htmlEl = el as HTMLElement
    originalDisplay[i] = htmlEl.style.display
    htmlEl.style.display = 'none'
  })
  
  // Return restore function
  return () => {
    elementsToHide.forEach((el, i) => {
      const htmlEl = el as HTMLElement
      htmlEl.style.display = originalDisplay[i]
    })
  }
}

// ViewModeSwitcher component to avoid type narrowing issues
function ViewModeSwitcher({ 
  currentMode, 
  onModeChange 
}: { 
  currentMode: ViewMode
  onModeChange: (mode: ViewMode) => void 
}) {
  return (
    <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl">
      <button
        onClick={() => onModeChange('editor')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          currentMode === 'editor' 
            ? 'bg-white/10 text-white' 
            : 'text-zinc-500 hover:text-zinc-400'
        )}
      >
        Редактор
      </button>
      <button
        onClick={() => onModeChange('covers')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
          currentMode === 'covers' 
            ? 'bg-white/10 text-white' 
            : 'text-zinc-500 hover:text-zinc-400'
        )}
      >
        <Grid2X2 className="w-3.5 h-3.5" />
        <span>Обложки</span>
      </button>
    </div>
  )
}

export function Canvas() {
  const slideRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSafeZones, setShowSafeZones] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('editor')
  
  const { 
    slides, activeSlideId, updateSlide, regenerateSlideImage, regeneratingImageId, 
    aspectRatio, template, fontFamily, textColor, accentColor, overlayOpacity,
    brandHandle, brandLogoUrl, platform
  } = useStore()
  
  const activeSlide = slides.find(s => s.id === activeSlideId)
  const isRegenerating = regeneratingImageId === activeSlide?.id
  const dimensions = aspectDimensions[aspectRatio]
  
  const scale = useMemo(() => {
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 600
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 400 : 800
    const scaleH = dimensions.height > maxHeight ? maxHeight / dimensions.height : 1
    const scaleW = dimensions.width > maxWidth ? maxWidth / dimensions.width : 1
    return Math.min(scaleH, scaleW)
  }, [dimensions])

  const handleDownload = useCallback(async () => {
    if (!slideRef.current || isExporting) return
    setIsExporting(true)
    
    // Hide safe zones
    const safeZoneEl = slideRef.current.querySelector('.safe-zones-overlay') as HTMLElement
    if (safeZoneEl) safeZoneEl.style.display = 'none'
    
    // Hide UI controls (upload/refresh buttons)
    const restoreUI = prepareForExport(slideRef.current)
    
    try {
      // Convert external images to base64 to avoid CORS issues
      await convertImagesToBase64(slideRef.current)
      
      const dataUrl = await toPng(slideRef.current, {
        quality: 1, 
        pixelRatio: 3, 
        cacheBust: true,
        backgroundColor: template === 'notes' ? '#1C1C1E' : '#000',
      })
      const link = document.createElement('a')
      link.download = `viso-${platform}-${activeSlide?.id || 'export'}.png`
      link.href = dataUrl
      link.click()
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2000)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Не удалось сохранить. Попробуйте ещё раз.')
    } finally {
      // Restore hidden elements
      restoreUI()
      if (safeZoneEl) safeZoneEl.style.display = ''
      setIsExporting(false)
    }
  }, [activeSlide?.id, isExporting, template, platform])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeSlide) updateSlide(activeSlide.id, { title: e.target.value })
  }, [activeSlide, updateSlide])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeSlide) updateSlide(activeSlide.id, { content: e.target.value })
  }, [activeSlide, updateSlide])

  const handleRegenerateImage = useCallback(() => {
    if (activeSlide && !isRegenerating) regenerateSlideImage(activeSlide.id)
  }, [activeSlide, isRegenerating, regenerateSlideImage])

  const handleUploadClick = useCallback(() => fileInputRef.current?.click(), [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && activeSlide) {
      updateSlide(activeSlide.id, { image: URL.createObjectURL(file) })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [activeSlide, updateSlide])

  // Render covers mode
  if (viewMode === 'covers') {
    return (
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ViewModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />
          </div>
        </div>

        <CoversGenerator />
      </div>
    )
  }

  if (!activeSlide) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-zinc-500 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Загрузка...</span>
        </div>
      </div>
    )
  }

  const renderTemplate = () => {
    const commonProps = {
      slide: activeSlide,
      slideRef,
      dimensions,
      overlayOpacity,
      isRegenerating,
      onTitleChange: handleTitleChange,
      onContentChange: handleContentChange,
      onRegenerateImage: handleRegenerateImage,
      onUploadImage: handleUploadClick,
      aspectRatio,
      fontFamily,
      textColor,
      accentColor,
      brandHandle,
      brandLogoUrl,
    }

    if (platform === 'youtube') return <YouTubeTemplate {...commonProps} />
    if (platform === 'tiktok') return <TikTokTemplate {...commonProps} showSafeZones={showSafeZones} />
    if (platform === 'telegram') return <TelegramTemplate {...commonProps} />
    if (template === 'notes') return <NotesTemplate {...commonProps} />
    if (template === 'chat') return <ChatTemplate {...commonProps} />
    return <StandardTemplate {...commonProps} />
  }

  return (
    <div className="h-full flex flex-col">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* View Mode Switcher */}
          <div className="mr-2">
            <ViewModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />
          </div>

          {platform === 'instagram' && (
            <>
              <AspectRatioSelector />
              <TemplateSelector />
            </>
          )}
          <FontSelector />
          <FontSizeSelector />
          <ColorSelector />
          
          {platform === 'tiktok' && (
            <button
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                showSafeZones 
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-white/5 text-zinc-500 border border-white/5'
              )}
            >
              Safe Zones
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <BrandingPanel />
          
          {platform === 'instagram' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPreview(true)}
              className={cn(
                'p-2 rounded-xl',
                'bg-white/5 border border-white/5',
                'text-zinc-400 hover:text-white',
                'transition-all duration-200',
                'hover:bg-white/10 hover:border-white/10'
              )}
              title="Предпросмотр в ленте"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}
          
          <motion.button
            onClick={handleDownload}
            disabled={isExporting}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5',
              'bg-gradient-to-r from-indigo-600/80 to-violet-600/80',
              'hover:from-indigo-500 hover:to-violet-500',
              'border border-indigo-400/20',
              'rounded-xl',
              'text-xs font-medium text-white',
              'transition-all duration-200',
              'hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              exportSuccess && 'from-emerald-600 to-emerald-500 border-emerald-400/30'
            )}
          >
            <AnimatePresence mode="wait">
              {isExporting ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </motion.div>
              ) : exportSuccess ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Download className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
            <span>{exportSuccess ? 'Готово!' : 'Скачать'}</span>
          </motion.button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <motion.div
          key={`${activeSlide.id}-${aspectRatio}-${template}-${platform}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}
        >
          {renderTemplate()}
        </motion.div>
      </div>

      <InstagramPreview isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  )
}
