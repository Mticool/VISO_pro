import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check, Zap, Image, Wand2, FileText, Infinity } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

const features = [
  { icon: Infinity, text: 'Безлимитные генерации' },
  { icon: Image, text: 'AI-картинки (Flux/Kie.ai)' },
  { icon: Wand2, text: 'Magic Rewrite' },
  { icon: FileText, text: 'Экспорт в PDF' },
  { icon: Sparkles, text: 'Без водяного знака' },
  { icon: Zap, text: 'Приоритетная поддержка' },
]

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, upgradeToPro, getRemainingGenerations } = useStore()
  const remaining = getRemainingGenerations()

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-md',
              'bg-[#0a0a0a]/95 backdrop-blur-2xl',
              'border border-violet-500/20',
              'rounded-3xl overflow-hidden',
              'shadow-2xl shadow-violet-500/10'
            )}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient Header */}
            <div className="relative h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Перейти на Pro
              </h2>
              <p className="text-zinc-400 text-center text-sm mb-6">
                {remaining === 0 
                  ? 'Вы исчерпали бесплатный лимит на сегодня'
                  : `Осталось ${remaining} бесплатных генераций`
                }
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-zinc-300 text-sm">{feature.text}</span>
                    <Check className="w-4 h-4 text-emerald-400 ml-auto" />
                  </motion.div>
                ))}
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">$9</span>
                  <span className="text-zinc-500">/месяц</span>
                </div>
                <p className="text-zinc-600 text-xs mt-1">или $79/год (экономия 27%)</p>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={upgradeToPro}
                className={cn(
                  'w-full py-4 rounded-xl',
                  'bg-gradient-to-r from-violet-600 to-indigo-600',
                  'hover:from-violet-500 hover:to-indigo-500',
                  'text-white font-semibold',
                  'transition-all duration-200',
                  'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]'
                )}
              >
                Активировать Pro
              </motion.button>

              <p className="text-zinc-600 text-[10px] text-center mt-3">
                Demo режим: нажмите для активации Pro бесплатно
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

