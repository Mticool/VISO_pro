import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LayoutProps {
  sidebar?: ReactNode
  children: ReactNode
  className?: string
}

export function Layout({ sidebar, children, className }: LayoutProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">VISO</span>
        </div>

        {/* Right side - empty for now */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">AI Carousel Maker</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'w-full max-w-[1400px] h-full max-h-[800px]',
            'bg-[#0A0A0A]/60 backdrop-blur-2xl',
            'border border-white/5',
            'rounded-2xl overflow-hidden',
            className
          )}
        >
          <div className="h-full flex">
            {/* Sidebar */}
            {sidebar && (
              <motion.aside
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-[260px] h-full border-r border-white/5 flex-shrink-0 bg-black/20"
              >
                {sidebar}
              </motion.aside>
            )}
            
            {/* Main Content */}
            <main className="flex-1 h-full overflow-hidden bg-black/10">
              {children}
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
