// PRO badge disabled - all features unlocked
export function ProBadge() {
  return null
}

interface ProFeatureProps {
  children: React.ReactNode
}

// All features unlocked - no restrictions
export function ProFeature({ children }: ProFeatureProps) {
  return <>{children}</>
}
