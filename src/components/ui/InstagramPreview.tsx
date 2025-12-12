import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Grid3X3, PlaySquare, User } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

interface InstagramPreviewProps {
  isOpen: boolean
  onClose: () => void
}

// Placeholder images for grid
const placeholderImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=400&fit=crop&q=80',
]

export function InstagramPreview({ isOpen, onClose }: InstagramPreviewProps) {
  const { slides, brandHandle, brandLogoUrl } = useStore()
  const coverSlide = slides[0]
  const username = brandHandle ? brandHandle.replace('@', '') : 'visomaker'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[375px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Instagram Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="w-6" />
              <span className="text-sm font-semibold text-white">Instagram</span>
              <div className="w-6" />
            </div>

            {/* Profile Section */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[3px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    {brandLogoUrl ? (
                      <img src={brandLogoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-zinc-500" />
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 flex items-center justify-around pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{slides.length}</div>
                    <div className="text-xs text-zinc-500">постов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">12.5K</div>
                    <div className="text-xs text-zinc-500">подписчиков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">342</div>
                    <div className="text-xs text-zinc-500">подписки</div>
                  </div>
                </div>
              </div>

              {/* Username & Bio */}
              <div className="mt-3">
                <h3 className="font-semibold text-white">{username}</h3>
                <p className="text-sm text-zinc-400 mt-1">Создаю виральный контент ✨</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-indigo-500 rounded-lg text-sm font-semibold text-white">
                  Подписаться
                </button>
                <button className="flex-1 py-2 bg-white/10 rounded-lg text-sm font-semibold text-white">
                  Сообщение
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-white/10">
              <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-white">
                <Grid3X3 className="w-5 h-5 text-white" />
              </button>
              <button className="flex-1 py-3 flex items-center justify-center">
                <PlaySquare className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-[2px]">
              {/* First cell - Cover Slide */}
              <div className="relative aspect-square bg-zinc-900 group cursor-pointer">
                {coverSlide?.image ? (
                  <>
                    <img 
                      src={coverSlide.image} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 p-2 flex flex-col justify-end">
                      <p className="text-[8px] font-bold text-white leading-tight line-clamp-3">
                        {coverSlide.title}
                      </p>
                    </div>
                    {/* Carousel indicator */}
                    <div className="absolute top-1 right-1">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                    Нет слайдов
                  </div>
                )}
              </div>

              {/* Placeholder cells */}
              {placeholderImages.map((img, i) => (
                <div key={i} className="aspect-square bg-zinc-900">
                  <img src={img} alt="" className="w-full h-full object-cover opacity-60" />
                </div>
              ))}
            </div>

            {/* Bottom hint */}
            <div className="p-3 text-center border-t border-white/5">
              <p className="text-[10px] text-zinc-500">
                Так будет выглядеть обложка в ленте
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

