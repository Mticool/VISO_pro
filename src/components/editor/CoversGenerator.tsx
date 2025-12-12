import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Download, Expand, Sparkles, Grid2X2, ImageOff, RefreshCw, Edit3, Package } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'
import { ProFeature, ProBadge } from '../ui/ProBadge'
import { v4 as uuidv4 } from 'uuid'

interface CoverConcept {
  id: string
  style: 'emotional' | 'minimal' | '3d' | 'mystery'
  styleName: string
  styleIcon: string
  styleDescription: string
  title: string
  imageUrl: string | null
  imagePrompt: string
  isGenerating: boolean
}

const conceptStyles: Omit<CoverConcept, 'id' | 'title' | 'imageUrl' | 'imagePrompt' | 'isGenerating'>[] = [
  { style: 'emotional', styleName: 'Эмоциональный', styleIcon: '😱', styleDescription: 'Крупный план, шок, эмоции' },
  { style: 'minimal', styleName: 'Минимализм', styleIcon: '✨', styleDescription: 'Чистый фон, огромный текст' },
  { style: '3d', styleName: '3D / CGI', styleIcon: '🎨', styleDescription: 'Яркая графика, Blender стиль' },
  { style: 'mystery', styleName: 'Загадка', styleIcon: '🔮', styleDescription: 'Интрига, тёмный образ' },
]

const initialCovers: CoverConcept[] = conceptStyles.map((style, i) => ({
  ...style,
  id: String(i + 1),
  title: '',
  imageUrl: null,
  imagePrompt: '',
  isGenerating: false,
}))

interface CoversGeneratorProps {
  onSelectCover?: (cover: CoverConcept) => void
}

export function CoversGenerator({ onSelectCover }: CoversGeneratorProps) {
  const { topic, isPro, setShowUpgradeModal, platform } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [cleanMode, setCleanMode] = useState(false)
  const [covers, setCovers] = useState<CoverConcept[]>(initialCovers)
  const [expandedCover, setExpandedCover] = useState<string | null>(null)

  // Generate all 4 covers in parallel
  const handleGenerateAll = useCallback(async () => {
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }

    if (!topic) {
      alert('Сначала введите тему на главной странице')
      return
    }

    setIsGenerating(true)
    
    // Set all covers to generating state
    setCovers(prev => prev.map(c => ({ ...c, isGenerating: true, imageUrl: null })))

    try {
      // Step 1: Get concepts from Claude
      const response = await fetch('/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, cleanMode }),
      })

      const data = await response.json()
      const concepts = data.concepts || []

      // Step 2: Generate images in parallel
      const imagePromises = concepts.map(async (concept: any, index: number) => {
        const styleConfig = conceptStyles[index] || conceptStyles[0]
        
        try {
          // Build URL with query and fetch image
          const query = concept.imagePrompt?.split(' ').slice(0, 5).join(' ') || styleConfig.styleDescription
          const imgUrl = `/api/images/stock?query=${encodeURIComponent(query)}&t=${Date.now() + index}`
          
          const response = await fetch(imgUrl)
          const imgData = await response.json()

          return {
            ...styleConfig,
            id: uuidv4(),
            title: cleanMode ? '' : (concept.title || `Вариант ${index + 1}`),
            imageUrl: imgData.url || `https://picsum.photos/seed/${Date.now() + index}/400/500`,
            imagePrompt: concept.imagePrompt || '',
            isGenerating: false,
          }
        } catch (error) {
          console.error(`Error generating cover ${index}:`, error)
          return {
            ...styleConfig,
            id: uuidv4(),
            title: cleanMode ? '' : `Вариант ${index + 1}`,
            imageUrl: `https://picsum.photos/seed/${Date.now() + index}/400/500`,
            imagePrompt: '',
            isGenerating: false,
          }
        }
      })

      // Wait for all images
      const generatedCovers = await Promise.all(imagePromises)
      setCovers(generatedCovers as CoverConcept[])

    } catch (error) {
      console.error('Batch generation error:', error)
      
      // Fallback: generate mock covers
      const mockCovers = conceptStyles.map((style, i) => ({
        ...style,
        id: uuidv4(),
        title: cleanMode ? '' : `Вариант ${style.styleName}`,
        imageUrl: `https://picsum.photos/seed/${Date.now() + i}/400/500`,
        imagePrompt: '',
        isGenerating: false,
      }))
      setCovers(mockCovers)
    } finally {
      setIsGenerating(false)
    }
  }, [topic, platform, cleanMode, isPro, setShowUpgradeModal])

  // Regenerate single cover
  const handleRegenerateSingle = useCallback(async (coverId: string) => {
    const coverIndex = covers.findIndex(c => c.id === coverId)
    if (coverIndex === -1) return

    setCovers(prev => prev.map(c => 
      c.id === coverId ? { ...c, isGenerating: true } : c
    ))

    try {
      const cover = covers[coverIndex]
      const query = cover.imagePrompt || cover.styleDescription
      const imgUrl = `/api/images/stock?query=${encodeURIComponent(query)}&t=${Date.now()}`
      
      const response = await fetch(imgUrl)
      const data = await response.json()

      setCovers(prev => prev.map(c => 
        c.id === coverId 
          ? { ...c, imageUrl: data.url || `https://picsum.photos/seed/${Date.now()}/400/500`, isGenerating: false }
          : c
      ))
    } catch (error) {
      setCovers(prev => prev.map(c => 
        c.id === coverId 
          ? { ...c, imageUrl: `https://picsum.photos/seed/${Date.now()}/400/500`, isGenerating: false }
          : c
      ))
    }
  }, [covers])

  // Download single cover
  const handleDownloadSingle = useCallback((cover: CoverConcept) => {
    if (cover.imageUrl) {
      const link = document.createElement('a')
      link.href = cover.imageUrl
      link.download = `viso-cover-${cover.style}-${cover.id}.png`
      link.target = '_blank'
      link.click()
    }
  }, [])

  // Download all covers
  const handleDownloadAll = useCallback(() => {
    covers.forEach((cover, i) => {
      if (cover.imageUrl) {
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = cover.imageUrl!
          link.download = `viso-cover-${cover.style}-${i + 1}.png`
          link.target = '_blank'
          link.click()
        }, i * 300) // Stagger downloads
      }
    })
  }, [covers])

  // Edit cover in main editor
  const handleEditCover = useCallback((cover: CoverConcept) => {
    if (onSelectCover) {
      onSelectCover(cover)
    }
  }, [onSelectCover])

  const hasGeneratedCovers = covers.some(c => c.imageUrl)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
            <Grid2X2 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Пакетная генерация
              <ProBadge />
            </h2>
            <p className="text-xs text-zinc-500">4 варианта для A/B тестирования</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5 flex-wrap">
        {/* Clean Mode Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <button
            onClick={() => setCleanMode(!cleanMode)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-all duration-300',
              cleanMode 
                ? 'bg-gradient-to-r from-violet-500 to-pink-500' 
                : 'bg-white/10 group-hover:bg-white/15'
            )}
          >
            <motion.div
              animate={{ x: cleanMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
            />
          </button>
          <div>
            <span className="text-sm text-zinc-300">Заставки</span>
            <span className="text-[10px] text-zinc-600 block">Без текста</span>
          </div>
        </label>

        <div className="flex-1" />

        {/* Generate Button */}
        <ProFeature>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl',
              'bg-gradient-to-r from-violet-600 to-pink-600',
              'text-sm font-semibold text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
              'transition-all duration-300'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Генерация...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Сгенерировать 4 варианта</span>
              </>
            )}
          </motion.button>
        </ProFeature>

        {/* Download All */}
        {hasGeneratedCovers && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadAll}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl',
              'bg-emerald-500/20 border border-emerald-500/30',
              'text-sm font-medium text-emerald-400',
              'hover:bg-emerald-500/30',
              'transition-all'
            )}
          >
            <Package className="w-4 h-4" />
            <span>Скачать все</span>
          </motion.button>
        )}
      </div>

      {/* Grid 2x2 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4 h-full min-h-[500px]">
          {covers.map((cover, index) => (
            <CoverCard
              key={cover.id}
              cover={cover}
              index={index}
              cleanMode={cleanMode}
              isExpanded={expandedCover === cover.id}
              onExpand={() => setExpandedCover(expandedCover === cover.id ? null : cover.id)}
              onRegenerate={() => handleRegenerateSingle(cover.id)}
              onDownload={() => handleDownloadSingle(cover)}
              onEdit={() => handleEditCover(cover)}
            />
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] text-zinc-600 text-center">
          💡 Совет: Загрузите все 4 варианта и проведите A/B тест на вашей аудитории
        </p>
      </div>
    </div>
  )
}

interface CoverCardProps {
  cover: CoverConcept
  index: number
  cleanMode: boolean
  isExpanded: boolean
  onExpand: () => void
  onRegenerate: () => void
  onDownload: () => void
  onEdit: () => void
}

function CoverCard({ 
  cover, 
  index, 
  cleanMode, 
  isExpanded, 
  onExpand, 
  onRegenerate, 
  onDownload,
  onEdit 
}: CoverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-[#0a0a0a] border border-white/5',
        'group cursor-pointer',
        'hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]',
        'transition-all duration-300',
        isExpanded && 'ring-2 ring-violet-500 ring-offset-2 ring-offset-black'
      )}
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative">
        {cover.imageUrl ? (
          <>
            <img 
              src={cover.imageUrl} 
              alt={cover.styleName}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-pink-900/20">
            {cover.isGenerating ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-2" />
                <span className="text-xs text-zinc-500">Генерация...</span>
              </div>
            ) : (
              <div className="text-center">
                <ImageOff className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <span className="text-xs text-zinc-600">Нажмите "Сгенерировать"</span>
              </div>
            )}
          </div>
        )}
        
        {/* Generating Overlay */}
        <AnimatePresence>
          {cover.isGenerating && cover.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            >
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
        {/* Top - Style Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 pointer-events-auto">
            <span className="text-base">{cover.styleIcon}</span>
            <div>
              <span className="text-xs font-semibold text-white block">{cover.styleName}</span>
              <span className="text-[9px] text-zinc-400">{cover.styleDescription}</span>
            </div>
          </div>
          
          {/* Regenerate button */}
          {cover.imageUrl && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onRegenerate(); }}
              className={cn(
                'p-2.5 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10',
                'opacity-0 group-hover:opacity-100 transition-all duration-200',
                'text-white/70 hover:text-white pointer-events-auto',
                cover.isGenerating && 'opacity-100'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', cover.isGenerating && 'animate-spin')} />
            </motion.button>
          )}
        </div>

        {/* Bottom - Title & Actions */}
        <div className="pointer-events-auto">
          {/* Title */}
          {!cleanMode && cover.title && (
            <h3 
              className="text-xl font-bold text-white leading-tight mb-3 line-clamp-2"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            >
              {cover.title}
            </h3>
          )}
          
          {/* Action Buttons */}
          {cover.imageUrl && (
            <div className={cn(
              'flex items-center gap-2',
              'opacity-0 group-hover:opacity-100 transition-all duration-200',
              'transform translate-y-2 group-hover:translate-y-0'
            )}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl',
                  'bg-violet-500/30 backdrop-blur-sm border border-violet-500/30',
                  'text-xs font-medium text-white',
                  'hover:bg-violet-500/40 transition-colors'
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Редактировать</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onExpand(); }}
                className={cn(
                  'p-2.5 rounded-xl',
                  'bg-white/10 backdrop-blur-sm border border-white/10',
                  'text-white/70 hover:text-white',
                  'hover:bg-white/20 transition-colors'
                )}
              >
                <Expand className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
                className={cn(
                  'p-2.5 rounded-xl',
                  'bg-emerald-500/30 backdrop-blur-sm border border-emerald-500/30',
                  'text-emerald-300',
                  'hover:bg-emerald-500/40 transition-colors'
                )}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Index Badge */}
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{index + 1}</span>
      </div>
    </motion.div>
  )
}
