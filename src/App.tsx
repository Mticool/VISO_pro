import { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import { Layout } from './components/layout/Layout'
import { MobileLayout } from './components/layout/MobileLayout'
import { LandingPage } from './components/layout/LandingPage'
import { SlideRail } from './components/editor/SlideRail'
import { Canvas } from './components/editor/Canvas'
import { MobileSlideRail } from './components/editor/MobileSlideRail'
import { MobileCanvas } from './components/editor/MobileCanvas'
import { MobileStylePanel } from './components/editor/MobileStylePanel'
import { MobileSettingsPanel } from './components/editor/MobileSettingsPanel'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

function App() {
  const { slides } = useStore()
  const hasSlides = slides.length > 0
  const isMobile = useIsMobile()

  return (
    <>
      {/* Premium Dark Background with Aurora */}
      <div className="premium-bg">
        <div className="aurora-orb" />
      </div>
      
      {/* Noise Texture */}
      <div className="bg-noise" />

      {/* Main App */}
      <div className="relative z-10 h-full">
        {hasSlides ? (
          isMobile ? (
            <MobileLayout
              slidesContent={<MobileSlideRail />}
              canvasContent={<MobileCanvas />}
              styleContent={<MobileStylePanel />}
              settingsContent={<MobileSettingsPanel />}
            />
          ) : (
            <Layout sidebar={<SlideRail />}>
              <Canvas />
            </Layout>
          )
        ) : (
          <LandingPage />
        )}
      </div>
    </>
  )
}

export default App
