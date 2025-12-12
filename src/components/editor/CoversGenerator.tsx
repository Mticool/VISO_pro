import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Download, Sparkles, RefreshCw, Edit3, ImageIcon, Wand2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'

type CoverFormat = '16:9' | '9:16'

const formatDimensions: Record<CoverFormat, { width: number; height: number; name: string }> = {
  '16:9': { width: 640, height: 360, name: 'YouTube / Landscape' },
  '9:16': { width: 360, height: 640, name: 'Shorts / Reels' },
}

export function CoversGenerator() {
  const coverRef = useRef<HTMLDivElement>(null)
  const { topic, textColor } = useStore()
  
  const [format, setFormat] = useState<CoverFormat>('16:9')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [coverTitle, setCoverTitle] = useState('')
  const [coverSubtitle, setCoverSubtitle] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePrompt, setImagePrompt] = useState('')
  const [showPromptEditor, setShowPromptEditor] = useState(false)

  const dimensions = formatDimensions[format]

  // Generate cover concept
  const handleGenerate = useCallback(async () => {
    if (!topic) {
      alert('Сначала введите тему на главной странице')
      return
    }

    setIsGenerating(true)
    setImageUrl(null)

    try {
      // Get concept from Claude
      const response = await fetch('/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          platform: format === '16:9' ? 'youtube' : 'tiktok',
          cleanMode: false 
        }),
      })

      const data = await response.json()
      const concept = data.concepts?.[0]

      if (concept) {
        setCoverTitle(concept.title || topic)
        setImagePrompt(concept.imagePrompt || '')
      }

      // Generate image
      if (concept?.imagePrompt) {
        const imgResponse = await fetch(`/api/images/stock?query=${encodeURIComponent(concept.imagePrompt.split(' ').slice(0, 3).join(' '))}`)
        const imgData = await imgResponse.json()
        if (imgData.url) {
          setImageUrl(imgData.url)
        }
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [topic, format])

  // Regenerate image with custom prompt
  const handleRegenerateImage = useCallback(async () => {
    if (!imagePrompt) return
    
    setIsGenerating(true)
    try {
      const imgResponse = await fetch(`/api/images/stock?query=${encodeURIComponent(imagePrompt.split(' ').slice(0, 5).join(' '))}`)
      const imgData = await imgResponse.json()
      if (imgData.url) {
        setImageUrl(imgData.url)
      }
    } catch (error) {
      console.error('Image regeneration failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [imagePrompt])

  // Export cover
  const handleDownload = useCallback(async () => {
    if (!coverRef.current) return
    setIsExporting(true)
    
    try {
      const dataUrl = await toPng(coverRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#000',
      })
      const link = document.createElement('a')
      link.download = `viso-cover-${format}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [format])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white">Обложка</h2>
          
          {/* Format Selector */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg">
            {(Object.keys(formatDimensions) as CoverFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                  format === f
                    ? 'bg-violet-500 text-white'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || !topic}
          className={cn(
            'w-full py-2.5 rounded-xl font-medium text-sm',
            'bg-gradient-to-r from-violet-600 to-indigo-600',
            'hover:from-violet-500 hover:to-indigo-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Сгенерировать обложку
            </>
          )}
        </motion.button>
      </div>

      {/* Cover Preview */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div
          ref={coverRef}
          className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
            backgroundColor: '#000'
          }}
        >
          {/* Background Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-gray-900 to-indigo-900/50 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-white/20" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content */}
          <div className={cn(
            'absolute inset-0 flex flex-col p-6',
            format === '16:9' ? 'justify-center' : 'justify-end pb-20'
          )}>
            <textarea
              value={coverTitle}
              onChange={(e) => setCoverTitle(e.target.value)}
              placeholder="Заголовок обложки..."
              className={cn(
                'bg-transparent resize-none font-bold leading-tight outline-none',
                format === '16:9' ? 'text-4xl' : 'text-3xl'
              )}
              style={{ 
                color: textColor,
                textShadow: '0 2px 20px rgba(0,0,0,0.8)'
              }}
              rows={format === '16:9' ? 2 : 3}
            />
            
            <textarea
              value={coverSubtitle}
              onChange={(e) => setCoverSubtitle(e.target.value)}
              placeholder="Подзаголовок..."
              className="bg-transparent resize-none text-lg leading-relaxed outline-none mt-2 opacity-80"
              style={{ 
                color: textColor,
                textShadow: '0 1px 10px rgba(0,0,0,0.6)'
              }}
              rows={1}
            />
          </div>

          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Prompt Editor */}
      {showPromptEditor && (
        <div className="p-4 border-t border-white/5">
          <h3 className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5" />
            AI Промпт (английский)
          </h3>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image in English..."
            className="w-full h-20 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/50"
          />
          <button
            onClick={handleRegenerateImage}
            disabled={isGenerating || !imagePrompt}
            className="mt-2 w-full py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-400 text-sm font-medium hover:bg-violet-500/30 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Генерация...
              </span>
            ) : (
              '🎨 Сгенерировать арт'
            )}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-white/5 flex items-center gap-2">
        <button
          onClick={() => setShowPromptEditor(!showPromptEditor)}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
            showPromptEditor
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
          )}
        >
          <Edit3 className="w-4 h-4" />
          Промпт
        </button>
        
        <button
          onClick={handleRegenerateImage}
          disabled={isGenerating || !imagePrompt}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('w-4 h-4', isGenerating && 'animate-spin')} />
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isExporting || !coverTitle}
          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Скачать
        </button>
      </div>
    </div>
  )
}
