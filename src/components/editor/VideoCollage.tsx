import { useState, useRef } from 'react'
import { Upload, Play, X, Grid2X2, Rows, Columns, Type } from 'lucide-react'
import { cn } from '../../lib/utils'

type LayoutType = '2-vertical' | '2-horizontal' | '3-grid' | '4-grid'

interface VideoSlot {
  id: string
  videoUrl: string | null
  file: File | null
}

interface LayoutOption {
  id: LayoutType
  name: string
  icon: typeof Grid2X2
  slots: number
  gridClass: string
}

const layouts: LayoutOption[] = [
  { id: '2-vertical', name: '2 видео', icon: Columns, slots: 2, gridClass: 'grid-cols-2' },
  { id: '2-horizontal', name: '2 в ряд', icon: Rows, slots: 2, gridClass: 'grid-rows-2' },
  { id: '3-grid', name: '3 видео', icon: Grid2X2, slots: 3, gridClass: 'grid-cols-2 grid-rows-2' },
  { id: '4-grid', name: '4 видео', icon: Grid2X2, slots: 4, gridClass: 'grid-cols-2 grid-rows-2' },
]

export function VideoCollage() {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('2-vertical')
  const [videos, setVideos] = useState<VideoSlot[]>([
    { id: '1', videoUrl: null, file: null },
    { id: '2', videoUrl: null, file: null },
    { id: '3', videoUrl: null, file: null },
    { id: '4', videoUrl: null, file: null },
  ])
  const [overlayText, setOverlayText] = useState('')
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentLayout = layouts.find(l => l.id === selectedLayout)!

  const handleVideoUpload = (slotIndex: number, file: File) => {
    const videoUrl = URL.createObjectURL(file)
    setVideos(prev => prev.map((v, i) => 
      i === slotIndex ? { ...v, videoUrl, file } : v
    ))
  }

  const handleRemoveVideo = (slotIndex: number) => {
    setVideos(prev => prev.map((v, i) => 
      i === slotIndex ? { ...v, videoUrl: null, file: null } : v
    ))
  }

  const visibleSlots = videos.slice(0, currentLayout.slots)

  return (
    <div className="h-full flex flex-col">
      {/* Layout Selector */}
      <div className="p-4 border-b border-white/5">
        <h3 className="text-xs font-medium text-zinc-400 mb-3">Лейаут сетки</h3>
        <div className="grid grid-cols-4 gap-2">
          {layouts.map(layout => {
            const Icon = layout.icon
            return (
              <button
                key={layout.id}
                onClick={() => setSelectedLayout(layout.id)}
                className={cn(
                  'p-2 rounded-lg border text-center transition-all',
                  selectedLayout === layout.id
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[10px]">{layout.slots}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Video Grid Preview */}
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-xs font-medium text-zinc-400 mb-3">Видео</h3>
        
        <div 
          className={cn(
            'grid gap-2 aspect-square max-w-[250px] mx-auto',
            selectedLayout === '2-vertical' && 'grid-cols-2',
            selectedLayout === '2-horizontal' && 'grid-rows-2',
            selectedLayout === '3-grid' && 'grid-cols-2 grid-rows-2',
            selectedLayout === '4-grid' && 'grid-cols-2 grid-rows-2'
          )}
        >
          {visibleSlots.map((slot, index) => (
            <div
              key={slot.id}
              className={cn(
                'relative rounded-lg overflow-hidden bg-black/40 border border-white/10',
                selectedLayout === '3-grid' && index === 0 && 'row-span-2'
              )}
            >
              {slot.videoUrl ? (
                <>
                  <video
                    src={slot.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 p-1 rounded bg-black/60">
                    <Play className="w-3 h-3 text-white/70" />
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                  <span className="text-[10px] text-zinc-500">Видео {index + 1}</span>
                  <input
                    ref={el => fileInputRefs.current[index] = el}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleVideoUpload(index, file)
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Overlay Text */}
        <div className="mt-4">
          <h3 className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            Текст поверх
          </h3>
          <textarea
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="Заголовок для коллажа..."
            className="w-full h-20 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-white/5">
        <p className="text-[11px] text-zinc-500 text-center">
          Загрузите видео (mp4) для создания динамичного коллажа
        </p>
      </div>
    </div>
  )
}

