import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import type { Slide } from '../../types'

export function MobileSlideRail() {
  const { 
    slides, 
    activeSlideId, 
    setActiveSlide, 
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides
  } = useStore()

  return (
    <div className="h-full flex flex-col">
      {/* Slides List */}
      <Reorder.Group
        axis="y"
        values={slides}
        onReorder={reorderSlides}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {slides.map((slide, index) => (
            <MobileSlideItem
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

      {/* Add Slide Button */}
      <div className="p-4 border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={addSlide}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4',
            'bg-white/5 active:bg-white/10',
            'border border-white/5 border-dashed',
            'rounded-xl',
            'text-sm text-zinc-400'
          )}
        >
          <Plus className="w-5 h-5" />
          <span>Новый слайд</span>
        </motion.button>
      </div>
    </div>
  )
}

interface MobileSlideItemProps {
  slide: Slide
  index: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  canDelete: boolean
}

function MobileSlideItem({ slide, index, isActive, onSelect, onDelete, onDuplicate, canDelete }: MobileSlideItemProps) {
  return (
    <Reorder.Item
      value={slide}
      id={slide.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 50 }}
    >
      <motion.div
        onClick={onSelect}
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl',
          'bg-white/5 border',
          isActive ? 'border-violet-500/50' : 'border-white/5 active:border-white/10'
        )}
      >
        {/* Drag Handle */}
        <div className="p-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-zinc-600" />
        </div>

        {/* Thumbnail */}
        <div className="w-14 h-[70px] rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
          {slide.image ? (
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-indigo-900/30" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-zinc-600 font-medium">Слайд {index + 1}</span>
          <h3 className="text-sm font-medium text-white truncate">{slide.title}</h3>
          <p className="text-xs text-zinc-500 truncate">{slide.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-2.5 rounded-lg bg-white/5 text-zinc-400 active:bg-white/10"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2.5 rounded-lg bg-white/5 text-zinc-400 active:bg-red-500/20 active:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

