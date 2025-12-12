import { RefObject, useState } from 'react'
import { Sparkles } from 'lucide-react'
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

const fontClasses: Record<FontFamily, string> = {
  sans: 'font-sans',
  montserrat: 'font-montserrat',
  oswald: 'font-oswald',
  playfair: 'font-playfair',
  merriweather: 'font-merriweather',
  bebas: 'font-bebas',
  open: 'font-open',
  space: 'font-space',
  caveat: 'font-caveat',
  syne: 'font-syne',
  mono: 'font-mono',
}

export function ChatTemplate({
  slide,
  slideRef,
  dimensions,
  onTitleChange,
  onContentChange,
  aspectRatio,
  fontFamily,
  textColor,
  accentColor,
  brandHandle,
  brandLogoUrl,
}: ChatTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  const fontClass = fontClasses[fontFamily]
  const hasBranding = brandHandle || brandLogoUrl
  const displayName = brandHandle ? brandHandle.replace('@', '') : 'VISO AI'

  const handleTitleRewrite = (newText: string) => {
    onTitleChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const handleContentRewrite = (newText: string) => {
    onContentChange({ target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <div
      ref={slideRef}
      className={cn('rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50', fontClass)}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Dark Background */}
      <div className="absolute inset-0 bg-[#212121]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b border-white/10 font-sans">
          {brandLogoUrl ? (
            <img src={brandLogoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <span style={{ color: textColor }} className="font-medium text-sm">{displayName}</span>
          <span style={{ color: `${textColor}60` }} className="text-xs">• AI</span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-[85%] flex flex-col items-end">
              <div className="relative group">
                <div className="rounded-2xl rounded-br-md px-4 py-3" style={{ backgroundColor: accentColor }}>
                  <textarea
                    value={slide.title}
                    onChange={onTitleChange}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    placeholder="Ваш вопрос..."
                    rows={aspectRatio === 'story' ? 3 : 2}
                    className={cn(
                      'w-full bg-transparent resize-none leading-relaxed outline-none border-none placeholder:text-white/30 selection:bg-white/30',
                      aspectRatio === 'story' ? 'text-[14px]' : 'text-[15px]',
                      fontFamily === 'caveat' && 'text-lg'
                    )}
                    style={{ color: '#FFFFFF' }}
                  />
                </div>
                <div className={cn(
                  'absolute -left-12 top-2 transition-opacity duration-200',
                  focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}>
                  <ProFeature>
                    <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} position="bottom" />
                  </ProFeature>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-sans"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, color: '#FFFFFF' }}
                >
                  Я
                </div>
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="max-w-[90%] flex flex-col items-start">
              <div className="flex items-start gap-2 relative group">
                {brandLogoUrl ? (
                  <img src={brandLogoUrl} alt="Logo" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1" />
                ) : (
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="bg-transparent">
                  <textarea
                    value={slide.content}
                    onChange={onContentChange}
                    onFocus={() => setFocusedField('content')}
                    onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                    placeholder="Ответ AI..."
                    rows={aspectRatio === 'story' ? 8 : 6}
                    className={cn(
                      'w-full bg-transparent resize-none leading-[1.7] outline-none border-none placeholder:opacity-30 selection:bg-emerald-500/30',
                      aspectRatio === 'story' ? 'text-[14px]' : 'text-[15px]',
                      fontFamily === 'caveat' && 'text-lg'
                    )}
                    style={{ color: `${textColor}E6` }}
                  />
                </div>
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
        <div className="p-4 border-t border-white/10 font-sans relative">
          {/* Watermark */}
          <Watermark />
          
          <div className="flex items-center gap-2 bg-[#2F2F2F] rounded-xl px-4 py-3">
            <span style={{ color: `${textColor}40` }} className="text-sm flex-1">
              Сообщение {hasBranding ? displayName : 'VISO'}...
            </span>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}30` }}
            >
              <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
