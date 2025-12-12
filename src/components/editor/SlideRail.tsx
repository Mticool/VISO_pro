import { useState } from 'react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy, GripVertical, Layers, Lightbulb, FileText, Instagram, Send, Youtube, Video, Copy as CopyIcon, Check, Settings, Film } from 'lucide-react'
import { useStore, platformConfig, type Platform } from '../../store/useStore'
import { cn } from '../../lib/utils'
import type { Slide } from '../../types'
import { HooksLibrary } from './HooksLibrary'
import { MagicRewriteMenu } from '../ui/MagicRewriteMenu'
import { ProFeature } from '../ui/ProBadge'
import { StyleSelector, SlideCountSlider, visualStyles } from './StyleSelector'
import { MotionPanel } from './MotionPanel'

type TabType = 'slides' | 'ideas' | 'caption' | 'style' | 'motion'

const platformIcons: Record<Platform, typeof Instagram> = {
  instagram: Instagram,
  telegram: Send,
  youtube: Youtube,
  tiktok: Video,
}

export function SlideRail() {
  const [activeTab, setActiveTab] = useState<TabType>('slides')
  const [copied, setCopied] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('realism')
  const [slideCount, setSlideCount] = useState(5)
  
  const { 
    slides, 
    activeSlideId, 
    setActiveSlide, 
    topic,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
    platform,
    setPlatform,
    generatedCaption,
    setGeneratedCaption,
    isPro,
  } = useStore()

  const activeSlide = slides.find(s => s.id === activeSlideId)

  const handleCopyCaption = async () => {
    await navigator.clipboard.writeText(generatedCaption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCaptionRewrite = (newText: string) => {
    setGeneratedCaption(newText)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Platform Selector */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center justify-between gap-1 p-1 bg-black/40 rounded-xl">
          {(Object.keys(platformConfig) as Platform[]).map((p) => {
            const Icon = platformIcons[p]
            const config = platformConfig[p]
            const isActive = platform === p
            
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  'flex-1 flex items-center justify-center py-2 rounded-lg transition-all',
                  isActive 
                    ? 'bg-white/10' 
                    : 'text-zinc-500 hover:text-zinc-400'
                )}
                style={isActive ? { color: config.color } : undefined}
                title={config.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="p-3 pt-0 border-b border-white/5">
        <div className="flex items-center gap-0.5 p-1 bg-black/40 rounded-xl">
          {[
            { id: 'slides', icon: Layers, label: 'Слайды' },
            { id: 'caption', icon: FileText, label: 'Текст' },
            { id: 'style', icon: Settings, label: 'Стиль' },
            { id: 'motion', icon: Film, label: 'Motion' },
            { id: 'ideas', icon: Lightbulb, label: 'Идеи' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all',
                activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-500 hover:text-zinc-400'
              )}
            >
              <tab.icon className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'slides' ? (
        <>
          {topic && (
            <div className="px-4 py-2 border-b border-white/5">
              <p className="text-sm text-zinc-400 truncate">{topic}</p>
            </div>
          )}

          <Reorder.Group
            axis="y"
            values={slides}
            onReorder={reorderSlides}
            className="flex-1 overflow-y-auto p-3 space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {slides.map((slide, index) => (
                <SlideItem
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={slide.id === activeSlideId}
                  onSelect={() => setActiveSlide(slide.id)}
                  onDelete={() => deleteSlide(slide.id)}
                  onDuplicate={() => duplicateSlide(slide.id)}
                  canDelete={slides.length > 1}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <div className="p-3 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={addSlide}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5',
                'bg-white/5 hover:bg-white/10',
                'border border-white/5 border-dashed hover:border-white/10',
                'rounded-xl',
                'text-sm text-zinc-500 hover:text-zinc-400',
                'transition-all duration-200'
              )}
            >
              <Plus className="w-4 h-4" />
              <span>Новый слайд</span>
            </motion.button>
          </div>
        </>
      ) : activeTab === 'caption' ? (
        <CaptionTab 
          caption={generatedCaption}
          onCaptionChange={setGeneratedCaption}
          onCopy={handleCopyCaption}
          copied={copied}
          onRewrite={handleCaptionRewrite}
        />
      ) : activeTab === 'style' ? (
        <StyleTab
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          slideCount={slideCount}
          onSlideCountChange={setSlideCount}
          isPro={isPro}
        />
      ) : activeTab === 'motion' ? (
        <MotionPanel 
          slideId={activeSlide?.id || ''} 
          slideImage={activeSlide?.image}
        />
      ) : (
        <HooksLibrary />
      )}
    </div>
  )
}

interface StyleTabProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
  slideCount: number
  onSlideCountChange: (count: number) => void
  isPro: boolean
}

function StyleTab({ selectedStyle, onStyleChange, slideCount, onSlideCountChange, isPro }: StyleTabProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <StyleSelector 
        selectedStyle={selectedStyle} 
        onStyleChange={onStyleChange}
        isPro={isPro}
      />
      
      <SlideCountSlider
        value={slideCount}
        onChange={onSlideCountChange}
        min={3}
        max={10}
      />
      
      {/* Selected Style Info */}
      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
        <p className="text-[10px] text-zinc-500 mb-1">Выбранный стиль:</p>
        <p className="text-sm font-medium text-white">
          {visualStyles.find(s => s.id === selectedStyle)?.name}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {visualStyles.find(s => s.id === selectedStyle)?.description}
        </p>
      </div>
    </div>
  )
}

interface CaptionTabProps {
  caption: string
  onCaptionChange: (text: string) => void
  onCopy: () => void
  copied: boolean
  onRewrite: (text: string) => void
}

function CaptionTab({ caption, onCaptionChange, onCopy, copied, onRewrite }: CaptionTabProps) {
  const { platform } = useStore()
  
  return (
    <div className="flex-1 flex flex-col p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">
          {platform === 'telegram' ? 'Текст поста' : 
           platform === 'instagram' ? 'Описание + хештеги' :
           'Описание'}
        </span>
        <div className="flex items-center gap-1">
          <ProFeature>
            <MagicRewriteMenu text={caption} onRewrite={onRewrite} />
          </ProFeature>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopy}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              copied 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-white/5 text-zinc-400 hover:text-white'
            )}
            title="Копировать"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>
      
      <textarea
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Текст будет сгенерирован вместе со слайдами..."
        className={cn(
          'flex-1 w-full p-3 rounded-xl resize-none',
          'bg-black/40 border border-white/5',
          'text-sm text-zinc-300 leading-relaxed',
          'placeholder:text-zinc-600',
          'focus:outline-none focus:border-violet-500/30',
          'transition-colors'
        )}
      />
      
      {caption && (
        <p className="mt-2 text-[10px] text-zinc-600 text-center">
          {caption.length} символов
        </p>
      )}
    </div>
  )
}

interface SlideItemProps {
  slide: Slide
  index: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  canDelete: boolean
}

function SlideItem({ slide, index, isActive, onSelect, onDelete, onDuplicate, canDelete }: SlideItemProps) {
  return (
    <Reorder.Item
      value={slide}
      id={slide.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.03, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 50 }}
      className="relative group"
    >
      <motion.div
        onClick={onSelect}
        className={cn(
          'w-full aspect-[4/5] rounded-xl overflow-hidden',
          'relative cursor-pointer',
          'transition-all duration-200',
          'border',
          isActive ? 'border-indigo-500/50 glow-indigo' : 'border-white/5 hover:border-white/10'
        )}
      >
        <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-1 bg-black/70 backdrop-blur-sm rounded cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        <div className="absolute inset-0">
          {slide.image ? (
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-violet-900/30" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
          <span className="text-[10px] font-medium text-zinc-500 mb-0.5">{index + 1}</span>
          <h3 className="text-[11px] font-medium text-white line-clamp-2 leading-tight">{slide.title}</h3>
        </div>

        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-1.5 bg-black/70 backdrop-blur-sm rounded hover:bg-white/20 transition-colors"
            title="Дублировать"
          >
            <Copy className="w-3 h-3 text-zinc-400" />
          </motion.button>
          
          {canDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 bg-black/70 backdrop-blur-sm rounded hover:bg-red-500/40 transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-3 h-3 text-zinc-400" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </Reorder.Item>
  )
}
