import { RefObject, useState } from 'react'
import type { Slide } from '../../../types'
import type { FontFamily } from '../../../store/useStore'
import { useStore } from '../../../store/useStore'
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

export function NotesTemplate({
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
}: NotesTemplateProps) {
  const [focusedField, setFocusedField] = useState<'title' | 'content' | null>(null)
  
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const fontClass = fontClasses[fontFamily]
  const hasBranding = brandHandle || brandLogoUrl

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
      {/* Paper Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: '#1C1C1E',
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.03) 31px, rgba(255,255,255,0.03) 32px)`,
        }}
      />

      {/* Accent line */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}80, ${accentColor}40)` }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-8 pl-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {hasBranding ? (
            <div className="flex items-center gap-2 opacity-70">
              {brandLogoUrl && <img src={brandLogoUrl} alt="Logo" className="w-5 h-5 rounded object-cover" />}
              {brandHandle && (
                <span className="text-xs font-medium font-sans" style={{ color: `${textColor}80` }}>
                  @{brandHandle.replace('@', '')}
                </span>
              )}
            </div>
          ) : <div />}
          <span className="text-[11px] font-medium font-sans" style={{ color: `${textColor}50` }}>
            {currentDate}
          </span>
        </div>

        {/* Title */}
        <div className="relative group">
          <textarea
            value={slide.title}
            onChange={onTitleChange}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Заголовок"
            rows={2}
            className={cn(
              'w-full bg-transparent resize-none font-bold leading-tight tracking-tight outline-none border-none placeholder:opacity-20 selection:bg-yellow-500/30',
              aspectRatio === 'story' ? 'text-[26px]' : 'text-[28px]',
              fontFamily === 'caveat' && 'text-[34px]'
            )}
            style={{ color: textColor }}
          />
          <div className={cn(
            'absolute -right-12 top-0 transition-opacity duration-200',
            focusedField === 'title' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.title} onRewrite={handleTitleRewrite} />
            </ProFeature>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px my-4" style={{ backgroundColor: `${textColor}15` }} />

        {/* Content */}
        <div className="relative group flex-1">
          <textarea
            value={slide.content}
            onChange={onContentChange}
            onFocus={() => setFocusedField('content')}
            onBlur={() => setTimeout(() => setFocusedField(null), 200)}
            placeholder="Начните писать..."
            className={cn(
              'w-full h-full bg-transparent resize-none leading-[1.8] outline-none border-none placeholder:opacity-20 selection:bg-yellow-500/30',
              aspectRatio === 'story' ? 'text-[15px]' : 'text-[17px]',
              fontFamily === 'caveat' && 'text-xl'
            )}
            style={{ color: `${textColor}CC` }}
          />
          <div className={cn(
            'absolute -right-12 top-0 transition-opacity duration-200',
            focusedField === 'content' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <ProFeature>
              <MagicRewriteMenu text={slide.content} onRewrite={handleContentRewrite} />
            </ProFeature>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 font-sans" style={{ color: `${textColor}40` }}>
          <div className="w-4 h-4 rounded border" style={{ borderColor: `${textColor}40` }} />
          <span className="text-sm">Добавить пункт...</span>
        </div>
      </div>

      {/* Watermark for Free Users */}
      <Watermark />

      {/* Folder */}
      <div className="absolute bottom-6 left-6">
        <span className="text-xs font-sans" style={{ color: `${textColor}40` }}>📁 Заметки</span>
      </div>
    </div>
  )
}
