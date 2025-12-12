import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Loader2, Crown, Zap, Image, Wand2, Infinity, Ban, ImageOff } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

// Comparison data
const freeFeatures = [
  { icon: Image, text: 'Стоковые фото (Unsplash)', included: true },
  { icon: Sparkles, text: 'Водяной знак VISO', included: true, negative: true },
  { icon: Ban, text: '3 генерации в день', included: true, negative: true },
  { icon: ImageOff, text: '5 слайдов максимум', included: true, negative: true },
]

const proFeatures = [
  { icon: Zap, text: 'AI-генерация картинок (Kie.ai)', included: true },
  { icon: Check, text: 'Без водяных знаков', included: true },
  { icon: Infinity, text: 'Безлимитные генерации', included: true },
  { icon: Wand2, text: 'Magic Rewrite (AI-редактор)', included: true },
  { icon: Crown, text: 'Приоритетная скорость', included: true },
]

export function PaywallModal() {
  const { showUpgradeModal, setShowUpgradeModal, upgradeToPro, getRemainingGenerations, isPro } = useStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const remaining = getRemainingGenerations()

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    upgradeToPro()
    setIsProcessing(false)
    setShowSuccess(true)
    
    // Show success state then close
    setTimeout(() => {
      setShowSuccess(false)
      setShowUpgradeModal(false)
    }, 2500)
  }

  if (isPro) return null

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => !isProcessing && setShowUpgradeModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

          {/* Confetti Effect on Success */}
          {showSuccess && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * window.innerWidth,
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720 - 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeOut'
                  }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: ['#FFD700', '#A855F7', '#3B82F6', '#10B981', '#EC4899'][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-2xl',
              'bg-[#080808]/98 backdrop-blur-3xl',
              'border border-amber-500/20',
              'rounded-3xl overflow-hidden',
              'shadow-[0_0_100px_rgba(251,191,36,0.1)]'
            )}
          >
            {/* Close Button */}
            {!isProcessing && (
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Success State */}
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center justify-center min-h-[400px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-6"
                >
                  <Crown className="w-10 h-10 text-black" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Добро пожаловать в PRO! 🎉</h2>
                <p className="text-zinc-400">Все премиум-функции активированы</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 text-center">
                  {/* Glow effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 blur-[100px] rounded-full" />
                  
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full border border-amber-500/30 mb-4">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-400">VISO PRO</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Раскройте полный потенциал VISO
                    </h1>
                    <p className="text-zinc-400">
                      {remaining === 0 
                        ? 'Лимит исчерпан. Перейдите на PRO для безлимита'
                        : `Осталось ${remaining} бесплатных генераций сегодня`
                      }
                    </p>
                  </motion.div>
                </div>

                {/* Comparison Table */}
                <div className="px-8 pb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Free Column */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <div className="text-center mb-4">
                        <span className="text-zinc-400 font-medium">Free</span>
                        <div className="text-2xl font-bold text-white mt-1">$0</div>
                      </div>
                      <div className="space-y-3">
                        {freeFeatures.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={cn(
                              'w-6 h-6 rounded-md flex items-center justify-center',
                              feature.negative ? 'bg-red-500/10' : 'bg-emerald-500/10'
                            )}>
                              <feature.icon className={cn(
                                'w-3.5 h-3.5',
                                feature.negative ? 'text-red-400' : 'text-emerald-400'
                              )} />
                            </div>
                            <span className={cn(
                              'text-sm',
                              feature.negative ? 'text-zinc-500' : 'text-zinc-300'
                            )}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Column */}
                    <div className="relative bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-2xl p-5 border border-amber-500/20">
                      {/* Popular badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-xs font-bold text-black">
                          ПОПУЛЯРНО
                        </span>
                      </div>
                      
                      <div className="text-center mb-4">
                        <span className="text-amber-400 font-medium">PRO</span>
                        <div className="flex items-baseline justify-center gap-1 mt-1">
                          <span className="text-2xl font-bold text-white">$19</span>
                          <span className="text-zinc-500 text-sm">/мес</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {proFeatures.map((feature, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                          >
                            <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center">
                              <feature.icon className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <span className="text-sm text-zinc-200">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="px-8 pb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className={cn(
                      'relative w-full py-4 rounded-2xl',
                      'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500',
                      'bg-[length:200%_100%]',
                      'text-black font-bold text-lg',
                      'transition-all duration-500',
                      'hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]',
                      'disabled:opacity-70 disabled:cursor-not-allowed',
                      'overflow-hidden',
                      'animate-shimmer'
                    )}
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-slide" />
                    
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Обработка платежа...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Crown className="w-5 h-5" />
                        Улучшить до PRO за $19
                      </span>
                    )}
                  </motion.button>

                  <p className="text-center text-zinc-600 text-xs mt-3">
                    💳 Безопасная оплата • Отмена в любой момент
                  </p>
                  <p className="text-center text-zinc-700 text-[10px] mt-1">
                    Demo: нажмите для бесплатной активации PRO
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

