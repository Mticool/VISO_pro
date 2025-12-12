import { cn } from '../../lib/utils'

interface ProBadgeProps {
  className?: string
}

// PRO badge disabled - all features unlocked
export function ProBadge({ className }: ProBadgeProps) {
  return null
}

interface ProFeatureProps {
  children: React.ReactNode
}

// All features unlocked - no restrictions
export function ProFeature({ children }: ProFeatureProps) {
  return <>{children}</>
}
