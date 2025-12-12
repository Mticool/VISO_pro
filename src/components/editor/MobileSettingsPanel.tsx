import { useRef } from 'react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import { AtSign, Image, Upload, Trash2 } from 'lucide-react'
import { WebSearchToggle } from '../ui/WebSearchToggle'

export function MobileSettingsPanel() {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const { 
    brandHandle, setBrandHandle,
    brandLogoUrl, setBrandLogoUrl,
    resetSlides,
  } = useStore()

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBrandLogoUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="p-4 space-y-6">
      <input 
        ref={logoInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleLogoUpload} 
        className="hidden" 
      />

      {/* Web Search */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Поиск в интернете</h4>
        <WebSearchToggle />
      </section>

      {/* Branding */}
      <section>
        <h4 className="text-xs text-zinc-500 font-medium mb-3">Брендинг</h4>
        
        <div className="space-y-3">
          {/* Handle Input */}
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={brandHandle}
              onChange={(e) => setBrandHandle(e.target.value)}
              placeholder="username"
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-xl',
                'bg-white/5 border border-white/5',
                'text-white placeholder:text-zinc-600',
                'focus:outline-none focus:border-violet-500/30'
              )}
            />
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-3">
            {brandLogoUrl ? (
              <div className="relative">
                <img 
                  src={brandLogoUrl} 
                  alt="Logo" 
                  className="w-16 h-16 rounded-xl object-cover border border-white/10"
                />
                <button
                  onClick={() => setBrandLogoUrl(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Image className="w-6 h-6 text-zinc-600" />
              </div>
            )}
            
            <button
              onClick={() => logoInputRef.current?.click()}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl',
                'bg-white/5 border border-white/5',
                'text-sm text-zinc-400',
                'active:bg-white/10'
              )}
            >
              <Upload className="w-5 h-5" />
              <span>Загрузить лого</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reset */}
      <section>
        <button
          onClick={resetSlides}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4 rounded-xl',
            'bg-red-500/10 border border-red-500/20',
            'text-red-400',
            'active:bg-red-500/20'
          )}
        >
          <Trash2 className="w-5 h-5" />
          <span>Начать заново</span>
        </button>
      </section>
    </div>
  )
}

