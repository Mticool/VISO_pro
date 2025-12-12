import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Loader2, Download, Play, Pause, Zap, Move, ZoomIn, Flame, Tv } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'
import { ProFeature, ProBadge } from '../ui/ProBadge'

type MotionEffect = 'zoom-in' | 'pan' | 'fire' | 'glitch'

interface MotionEffectOption {
  id: MotionEffect
  name: string
  icon: typeof ZoomIn
  description: string
}

const motionEffects: MotionEffectOption[] = [
  { id: 'zoom-in', name: 'Zoom In', icon: ZoomIn, description: 'Плавное приближение' },
  { id: 'pan', name: 'Pan', icon: Move, description: 'Панорамирование' },
  { id: 'fire', name: 'Fire', icon: Flame, description: 'Эффект огня' },
  { id: 'glitch', name: 'Glitch', icon: Tv, description: 'Глитч-эффект' },
]

// Mock video URLs for demo
const mockVideos: Record<MotionEffect, string> = {
  'zoom-in': 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-neon-lights-1240-large.mp4',
  'pan': 'https://assets.mixkit.co/videos/preview/mixkit-glowing-neon-lights-1174-large.mp4',
  'fire': 'https://assets.mixkit.co/videos/preview/mixkit-fire-and-sparks-1546-large.mp4',
  'glitch': 'https://assets.mixkit.co/videos/preview/mixkit-computer-code-on-screen-1172-large.mp4',
}

interface MotionPanelProps {
  slideId: string
  slideImage?: string
}

export function MotionPanel({ slideId, slideImage }: MotionPanelProps) {
  const { isPro, setShowUpgradeModal } = useStore()
  const [selectedEffect, setSelectedEffect] = useState<MotionEffect>('zoom-in')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const handleGenerateVideo = async () => {
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }

    setIsGenerating(true)
    
    try {
      // Call API (mock for now)
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: slideImage,
          effect: selectedEffect,
        }),
      })
      
      const data = await response.json()
      setGeneratedVideoUrl(data.videoUrl || mockVideos[selectedEffect])
    } catch (error) {
      console.error('Video generation error:', error)
      // Use mock video on error
      setGeneratedVideoUrl(mockVideos[selectedEffect])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedVideoUrl) {
      const link = document.createElement('a')
      link.href = generatedVideoUrl
      link.download = `viso-motion-${slideId}.mp4`
      link.click()
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-medium text-white">Motion</h3>
        </div>
        <ProBadge />
      </div>

      {/* Effect Selector */}
      <div className="grid grid-cols-2 gap-2">
        {motionEffects.map((effect) => {
          const Icon = effect.icon
          const isSelected = selectedEffect === effect.id
          
          return (
            <motion.button
              key={effect.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEffect(effect.id)}
              className={cn(
                'p-3 rounded-xl border transition-all',
                'flex flex-col items-center gap-1.5',
                isSelected
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{effect.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Preview / Result */}
      <div className="relative aspect-[9/16] bg-black/40 rounded-xl overflow-hidden border border-white/5">
        {generatedVideoUrl ? (
          <>
            <video
              src={generatedVideoUrl}
              className="w-full h-full object-cover"
              autoPlay={isPlaying}
              loop
              muted
              playsInline
            />
            {/* Play/Pause overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white/80" />
              ) : (
                <Play className="w-12 h-12 text-white/80" />
              )}
            </button>
          </>
        ) : slideImage ? (
          <>
            <img src={slideImage} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Нажми "Оживить"</p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-zinc-600">Выбери слайд</p>
          </div>
        )}
        
        {/* Generating Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-3" />
              <p className="text-sm text-white font-medium">Генерация видео...</p>
              <p className="text-xs text-zinc-400 mt-1">~5 секунд</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <ProFeature>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateVideo}
            disabled={isGenerating || !slideImage}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl',
              'bg-gradient-to-r from-violet-600 to-indigo-600',
              'text-sm font-medium text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
              'transition-all'
            )}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Оживить</span>
          </motion.button>
        </ProFeature>

        {generatedVideoUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className={cn(
              'px-4 py-2.5 rounded-xl',
              'bg-emerald-500/20 border border-emerald-500/30',
              'text-emerald-400',
              'hover:bg-emerald-500/30',
              'transition-all'
            )}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Info */}
      <p className="text-[10px] text-zinc-600 text-center">
        Превращает обложку в 4-секундное видео для Reels/TikTok
      </p>
    </div>
  )
}

