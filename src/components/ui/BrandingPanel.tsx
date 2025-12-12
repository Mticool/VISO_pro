import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Upload, AtSign, Image, Sparkles, X, Camera, Lock, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

export function BrandingPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarEnabled, setAvatarEnabled] = useState(false)
  const [userSelfie, setUserSelfie] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)
  
  const { brandHandle, setBrandHandle, brandLogoUrl, setBrandLogoUrl } = useStore()

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBrandLogoUrl(URL.createObjectURL(file))
    }
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserSelfie(URL.createObjectURL(file))
    }
  }

  const handleAvatarToggle = () => {
    if (!avatarEnabled) {
      setShowAvatarModal(true)
    } else {
      setAvatarEnabled(false)
    }
  }

  return (
    <>
      <input 
        ref={logoInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleLogoUpload} 
        className="hidden" 
      />
      <input 
        ref={selfieInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleSelfieUpload} 
        className="hidden" 
      />
      
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'p-2 rounded-xl',
          'bg-white/5 border border-white/5',
          'text-zinc-400 hover:text-white',
          'transition-all duration-200',
          'hover:bg-white/10 hover:border-white/10'
        )}
        title="Брендинг"
      >
        <User className="w-4 h-4" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel Content */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-50',
                'w-80 p-4 rounded-2xl',
                'bg-[#0a0a0a]/95 backdrop-blur-2xl',
                'border border-white/10',
                'shadow-2xl shadow-black/50'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Брендинг</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Handle Input */}
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Никнейм / Автор</label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={brandHandle}
                      onChange={(e) => setBrandHandle(e.target.value)}
                      placeholder="username"
                      className={cn(
                        'w-full pl-9 pr-3 py-2.5 rounded-xl',
                        'bg-white/5 border border-white/5',
                        'text-sm text-white placeholder:text-zinc-600',
                        'focus:outline-none focus:border-violet-500/30',
                        'transition-colors'
                      )}
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block">Логотип</label>
                  <div className="flex items-center gap-3">
                    {brandLogoUrl ? (
                      <div className="relative">
                        <img 
                          src={brandLogoUrl} 
                          alt="Logo" 
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                        <button
                          onClick={() => setBrandLogoUrl(null)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <Image className="w-5 h-5 text-zinc-600" />
                      </div>
                    )}
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl',
                        'bg-white/5 border border-white/5',
                        'text-xs text-zinc-400 hover:text-white',
                        'hover:bg-white/10 hover:border-white/10',
                        'transition-all'
                      )}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Загрузить</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* AI Avatar Section - KILLER FEATURE */}
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-50" />
                  
                  <div className="relative p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/5 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">AI Персонаж</h4>
                        <span className="text-[10px] text-violet-400 font-medium">BETA</span>
                      </div>
                    </div>

                    {/* Selfie Upload */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        {userSelfie ? (
                          <img 
                            src={userSelfie} 
                            alt="Selfie" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-violet-500/50"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-violet-500/10 border-2 border-dashed border-violet-500/30 flex items-center justify-center">
                            <Camera className="w-5 h-5 text-violet-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => selfieInputRef.current?.click()}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl',
                          'bg-violet-500/20 border border-violet-500/30',
                          'text-xs text-violet-300 hover:text-white',
                          'hover:bg-violet-500/30',
                          'transition-all'
                        )}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить селфи</span>
                      </button>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Использовать в генерации</span>
                      <button
                        onClick={handleAvatarToggle}
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-colors',
                          avatarEnabled 
                            ? 'bg-violet-500' 
                            : 'bg-white/10'
                        )}
                      >
                        <motion.div
                          animate={{ x: avatarEnabled ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Avatar Coming Soon Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'relative w-full max-w-md p-6 rounded-3xl',
                'bg-gradient-to-br from-violet-900/50 via-[#0a0a0a] to-pink-900/30',
                'border border-violet-500/30',
                'shadow-2xl'
              )}
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/30 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-[100px]" />

              <div className="relative text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Face Swap скоро!
                </h2>
                
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Уже скоро вы сможете генерировать обложки 
                  <span className="text-violet-400 font-medium"> со своим лицом </span>
                  в любом стиле — от фотореализма до аниме.
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['Реализм', '3D Render', 'Anime'].map((style) => (
                    <div 
                      key={style}
                      className="p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-zinc-500" />
                      </div>
                      <span className="text-[10px] text-zinc-500">{style}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAvatarModal(false)}
                  className={cn(
                    'w-full py-3 rounded-xl',
                    'bg-gradient-to-r from-violet-600 to-pink-600',
                    'text-white font-medium',
                    'hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
                    'transition-all'
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Уведомить о запуске
                  </span>
                </motion.button>

                <p className="text-[10px] text-zinc-600 mt-3">
                  Мы сообщим вам, когда функция будет доступна
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
