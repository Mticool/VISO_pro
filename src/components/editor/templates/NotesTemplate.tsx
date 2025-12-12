import { RefObject, useState } from 'react'
import { ChevronLeft, Share2 } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { MagicRewriteMenu } from '../../ui/MagicRewriteMenu'
import { Watermark } from '../../ui/Watermark'
import { ProFeature } from '../../ui/ProBadge'

interface NotesTemplateProps {
  slide: Slide
  slideRef: RefObject<HTMLDivElement>
  dimensions: { width: number; height: number }
  onTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  aspectRatio: string
  fontFamily: FontFamily
  textColor: string
  accentColor: string
  brandHandle: string
  brandLogoUrl: string | null
}

export function NotesTemplate({
  slide,
  slideRef,
  dimensions,
  onTitleChange,
  onContentChange,
  aspectRatio,
}: NotesTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  
  // iOS style date format
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handleTitleRewrite = (newText: string) => {
    onTitleChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const handleContentRewrite = (newText: string) => {
    onContentChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div
      ref={slideRef}
      className="rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50"
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* iOS Notes Background - Dark Mode */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#1C1C1E',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* iOS Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button className="flex items-center gap-1 text-[#FFD60A] text-[17px] font-normal">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            <span>Notes</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="text-[#FFD60A]">
              <Share2 className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Date Header */}
        <div className="text-center py-3">
          <span className="text-[13px] text-[#8E8E93]">
            {dateStr} at {timeStr}
          </span>
        </div>

        {/* Note Content Area */}
        <div className="flex-1 px-5 overflow-hidden">
          {/* Title */}
          <div className="relative group">
            <textarea
              value={slide.title}
              onChange={onTitleChange}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              placeholder="Title"
              rows={aspectRatio === 'story' ? 3 : 2}
              className={cn(
                'w-full bg-transparent resize-none font-bold leading-[1.2] tracking-tight outline-none border-none placeholder:text-[#8E8E93] text-white',
                aspectRatio === 'story' ? 'text-[26px]' : 'text-[28px]'
              )}
            />
            <div className={cn(
              'absolute -right-10 top-0 transition-opacity duration-200',
              focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
              <ProFeature>
                <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} />
              </ProFeature>
            </div>
          </div>

          {/* Body Content */}
          <div className="relative group mt-2 flex-1">
            <textarea
              value={slide.content}
              onChange={onContentChange}
              onFocus={() => setFocusedField('content')}
              onBlur={() => setTimeout(() => setFocusedField(null), 200)}
              placeholder="Start typing..."
              className={cn(
                'w-full h-full bg-transparent resize-none leading-[1.6] outline-none border-none placeholder:text-[#8E8E93] text-[#EBEBF5] opacity-90',
                aspectRatio === 'story' ? 'text-[16px]' : 'text-[17px]'
              )}
              style={{ minHeight: '200px' }}
            />
            <div className={cn(
              'absolute -right-10 top-0 transition-opacity duration-200',
              focusedField === 'content' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
              <ProFeature>
                <MagicRewriteMenu text={slide.content} onRewrite={handleContentRewrite} />
              </ProFeature>
            </div>
          </div>
        </div>

        {/* iOS Keyboard Toolbar (fake) */}
        <div className="border-t border-white/10 bg-[#2C2C2E] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-[#FFD60A] text-sm font-medium">Aa</button>
            <button className="text-[#8E8E93]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#8E8E93]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            <button className="text-[#FFD60A]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <Watermark />
    </div>
  )
}
