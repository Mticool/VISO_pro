import { RefObject, useState } from 'react'
import { Send } from 'lucide-react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { cn } from '../../../lib/utils'
import { MagicRewriteMenu } from '../../ui/MagicRewriteMenu'
import { Watermark } from '../../ui/Watermark'
import { ProFeature } from '../../ui/ProBadge'

interface ChatTemplateProps {
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

export function ChatTemplate({
  slide,
  slideRef,
  dimensions,
  onTitleChange,
  onContentChange,
  aspectRatio,
}: ChatTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)

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
        fontFamily: '"Söhne", "Inter", -apple-system, sans-serif',
      }}
    >
      {/* ChatGPT Dark Background */}
      <div className="absolute inset-0 bg-[#343541]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-white/10">
          <span className="text-white/90 font-medium text-sm">ChatGPT</span>
          <span className="text-white/40 text-xs">4o</span>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          {/* User Message */}
          <div className="bg-[#343541] px-4 py-5">
            <div className="max-w-[600px] mx-auto flex gap-4">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">Я</span>
              </div>
              
              {/* User Message Content */}
              <div className="flex-1 relative group">
                <div className="text-white/90 font-medium text-[13px] mb-1">You</div>
                <textarea
                  value={slide.title}
                  onChange={onTitleChange}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                  placeholder="Your question..."
                  rows={aspectRatio === 'story' ? 3 : 2}
                  className={cn(
                    'w-full bg-transparent resize-none leading-[1.6] outline-none border-none placeholder:text-white/30 text-white/90',
                    aspectRatio === 'story' ? 'text-[15px]' : 'text-[16px]'
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
            </div>
          </div>

          {/* AI Response */}
          <div className="bg-[#444654] px-4 py-5">
            <div className="max-w-[600px] mx-auto flex gap-4">
              {/* ChatGPT Logo */}
              <div className="w-8 h-8 rounded-full bg-[#10A37F] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
              </div>
              
              {/* AI Response Content */}
              <div className="flex-1 relative group">
                <div className="text-white/90 font-medium text-[13px] mb-1">ChatGPT</div>
                <textarea
                  value={slide.content}
                  onChange={onContentChange}
                  onFocus={() => setFocusedField('content')}
                  onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                  placeholder="AI response..."
                  rows={aspectRatio === 'story' ? 10 : 7}
                  className={cn(
                    'w-full bg-transparent resize-none leading-[1.7] outline-none border-none placeholder:text-white/30 text-white/90',
                    aspectRatio === 'story' ? 'text-[15px]' : 'text-[16px]'
                  )}
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
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#343541]">
          <div className="max-w-[600px] mx-auto">
            <div className="flex items-center gap-3 bg-[#40414F] rounded-xl px-4 py-3 border border-white/10">
              <span className="text-white/40 text-sm flex-1">Send a message...</span>
              <button className="p-1.5 rounded-lg bg-white/10 text-white/40 hover:text-white/60 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[11px] text-white/30 mt-2">
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <Watermark />
    </div>
  )
}
