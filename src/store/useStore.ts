import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Slide } from '../types'

export type Platform = 'instagram' | 'telegram' | 'youtube' | 'tiktok'
export type AspectRatio = 'portrait' | 'square' | 'story' | 'landscape' | 'youtube'
export type Template = 'standard' | 'notes' | 'chat'
export type FontFamily = 'sans' | 'montserrat' | 'oswald' | 'playfair' | 'merriweather' | 'bebas' | 'open' | 'space' | 'caveat' | 'syne' | 'mono'

export interface ColorPalette {
  id: string
  name: string
  textColor: string
  accentColor: string
}

export const colorPalettes: ColorPalette[] = [
  { id: 'classic', name: 'Classic Dark', textColor: '#FFFFFF', accentColor: '#3B82F6' },
  { id: 'luxury', name: 'Luxury Gold', textColor: '#FCD34D', accentColor: '#1F2937' },
  { id: 'minimal', name: 'Minimalist', textColor: '#F9FAFB', accentColor: '#6B7280' },
  { id: 'cyber', name: 'Cyber', textColor: '#22D3EE', accentColor: '#A855F7' },
  { id: 'sunset', name: 'Sunset', textColor: '#FEF3C7', accentColor: '#F97316' },
  { id: 'forest', name: 'Forest', textColor: '#D1FAE5', accentColor: '#10B981' },
  { id: 'rose', name: 'Rosé', textColor: '#FCE7F3', accentColor: '#EC4899' },
  { id: 'mono', name: 'Monochrome', textColor: '#E5E7EB', accentColor: '#374151' },
]

export const platformConfig: Record<Platform, { aspectRatio: AspectRatio; color: string; name: string }> = {
  instagram: { aspectRatio: 'portrait', color: '#E4405F', name: 'Instagram' },
  telegram: { aspectRatio: 'landscape', color: '#0088CC', name: 'Telegram' },
  youtube: { aspectRatio: 'youtube', color: '#FF0000', name: 'YouTube' },
  tiktok: { aspectRatio: 'story', color: '#000000', name: 'TikTok' },
}

interface StoreState {
  slides: Slide[]
  activeSlideId: string | null
  isGenerating: boolean
  topic: string
  error: string | null
  regeneratingImageId: string | null
  generatedCaption: string
  platform: Platform
  aspectRatio: AspectRatio
  template: Template
  fontFamily: FontFamily
  textColor: string
  accentColor: string
  overlayOpacity: number
  brandHandle: string
  brandLogoUrl: string | null
  
  // Web Search (Perplexity)
  useWebSearch: boolean
  isResearching: boolean
  researchContext: string | null
  
  // Pro Features (all users have Pro access for now)
  isPro: boolean
  dailyGenerations: number
  showUpgradeModal: boolean
  
  // Actions
  generateSlides: (topic: string) => Promise<void>
  updateSlide: (id: string, updates: Partial<Slide>) => void
  setActiveSlide: (id: string) => void
  setTopic: (topic: string) => void
  resetSlides: () => void
  clearError: () => void
  regenerateSlideImage: (slideId: string) => Promise<void>
  setPlatform: (platform: Platform) => void
  setAspectRatio: (ratio: AspectRatio) => void
  setTemplate: (template: Template) => void
  setFontFamily: (font: FontFamily) => void
  setTextColor: (color: string) => void
  setAccentColor: (color: string) => void
  setOverlayOpacity: (opacity: number) => void
  applyPalette: (palette: ColorPalette) => void
  setBrandHandle: (handle: string) => void
  setBrandLogoUrl: (url: string | null) => void
  addSlide: () => void
  deleteSlide: (id: string) => void
  duplicateSlide: (id: string) => void
  reorderSlides: (newOrder: Slide[]) => void
  setGeneratedCaption: (caption: string) => void
  setUseWebSearch: (use: boolean) => void
  
  // Pro Actions
  setShowUpgradeModal: (show: boolean) => void
  upgradeToPro: () => void
  getRemainingGenerations: () => number
}

async function fetchStockImage(query: string): Promise<string> {
  try {
    const response = await fetch(`/api/images/stock?query=${encodeURIComponent(query)}&t=${Date.now()}`)
    if (!response.ok) throw new Error('Failed to fetch image')
    const data = await response.json()
    return data.url
  } catch (error) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop&q=80'
  }
}

async function researchTopic(topic: string): Promise<string> {
  try {
    const response = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    })
    if (!response.ok) throw new Error('Research failed')
    const data = await response.json()
    return data.context || ''
  } catch (error) {
    console.error('Research error:', error)
    return ''
  }
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      slides: [],
      activeSlideId: null,
      isGenerating: false,
      topic: '',
      error: null,
      regeneratingImageId: null,
      generatedCaption: '',
      platform: 'instagram',
      aspectRatio: 'portrait',
      template: 'standard',
      fontFamily: 'sans',
      textColor: '#FFFFFF',
      accentColor: '#3B82F6',
      overlayOpacity: 50,
      brandHandle: '',
      brandLogoUrl: null,
      useWebSearch: false,
      isResearching: false,
      researchContext: null,
      
      // Pro Features - everyone has Pro access
      isPro: true,
      dailyGenerations: 0,
      showUpgradeModal: false,

      generateSlides: async (topic: string) => {
        const { platform, useWebSearch } = get()
        
        set({ isGenerating: true, topic, error: null, researchContext: null })
        
        try {
          let researchContext = ''
          
          // Step 1: Research with Perplexity if enabled
          if (useWebSearch) {
            set({ isResearching: true })
            console.log('🔍 Researching topic with Perplexity...')
            researchContext = await researchTopic(topic)
            set({ isResearching: false, researchContext })
            console.log('✅ Research complete')
          }
          
          // Step 2: Generate slides with Claude
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              topic, 
              platform,
              researchContext: researchContext || undefined,
            }),
          })
          
          if (!response.ok) throw new Error('Failed to generate content')
          
          const { slides: generatedSlides, caption } = await response.json()
          
          // Step 3: Fetch images
          const slidesWithImages = await Promise.all(
            generatedSlides.map(async (slide: any) => {
              const imageUrl = await fetchStockImage(slide.imageKeyword || 'abstract dark')
              return { ...slide, image: imageUrl }
            })
          )
          
          set({ 
            slides: slidesWithImages, 
            activeSlideId: slidesWithImages[0]?.id || null,
            isGenerating: false,
            generatedCaption: caption || '',
          })
        } catch (error) {
          console.error('Failed to generate slides:', error)
          set({ 
            isGenerating: false,
            isResearching: false,
            error: error instanceof Error ? error.message : 'Failed to generate slides'
          })
        }
      },

      updateSlide: (id, updates) => {
        const { slides } = get()
        set({ slides: slides.map(s => s.id === id ? { ...s, ...updates } : s) })
      },

      setActiveSlide: (id) => set({ activeSlideId: id }),
      setTopic: (topic) => set({ topic }),
      resetSlides: () => set({ slides: [], activeSlideId: null, topic: '', error: null, generatedCaption: '', researchContext: null }),
      clearError: () => set({ error: null }),

      regenerateSlideImage: async (slideId) => {
        const { slides } = get()
        const slide = slides.find(s => s.id === slideId) as any
        if (!slide) return
        
        set({ regeneratingImageId: slideId })
        
        try {
          const newImageUrl = await fetchStockImage(slide.imageKeyword || 'abstract dark gradient')
          
          set({ 
            slides: slides.map(s => s.id === slideId ? { ...s, image: newImageUrl } : s),
            regeneratingImageId: null 
          })
        } catch (error) {
          set({ regeneratingImageId: null })
        }
      },

      setPlatform: (platform) => {
        const config = platformConfig[platform]
        set({ 
          platform, 
          aspectRatio: config.aspectRatio,
          fontFamily: platform === 'youtube' ? 'bebas' : get().fontFamily,
        })
      },

      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setTemplate: (template) => set({ template }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setTextColor: (color) => set({ textColor: color }),
      setAccentColor: (color) => set({ accentColor: color }),
      setOverlayOpacity: (opacity) => set({ overlayOpacity: Math.min(100, Math.max(0, opacity)) }),
      applyPalette: (palette) => set({ textColor: palette.textColor, accentColor: palette.accentColor }),
      setBrandHandle: (handle) => set({ brandHandle: handle }),
      setBrandLogoUrl: (url) => set({ brandLogoUrl: url }),
      setGeneratedCaption: (caption) => set({ generatedCaption: caption }),
      setUseWebSearch: (use) => set({ useWebSearch: use }),

      addSlide: () => {
        const { slides } = get()
        
        const newSlide: Slide = {
          id: uuidv4(),
          type: 'content',
          title: 'Новый слайд',
          content: 'Добавьте текст...',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop&q=80',
        }
        set({ slides: [...slides, newSlide], activeSlideId: newSlide.id })
      },

      deleteSlide: (id) => {
        const { slides, activeSlideId } = get()
        if (slides.length <= 1) return
        
        const index = slides.findIndex(s => s.id === id)
        const newSlides = slides.filter(s => s.id !== id)
        
        let newActiveId = activeSlideId
        if (activeSlideId === id) {
          newActiveId = newSlides[Math.min(index, newSlides.length - 1)]?.id || null
        }
        
        set({ slides: newSlides, activeSlideId: newActiveId })
      },

      duplicateSlide: (id) => {
        const { slides } = get()
        
        const slideIndex = slides.findIndex(s => s.id === id)
        const slideToDuplicate = slides[slideIndex]
        if (!slideToDuplicate) return
        
        const newSlide: Slide = {
          ...slideToDuplicate,
          id: uuidv4(),
          title: `${slideToDuplicate.title} (копия)`,
        }
        
        const newSlides = [
          ...slides.slice(0, slideIndex + 1),
          newSlide,
          ...slides.slice(slideIndex + 1)
        ]
        
        set({ slides: newSlides, activeSlideId: newSlide.id })
      },

      reorderSlides: (newOrder) => set({ slides: newOrder }),
      
      // Pro Actions
      setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),
      upgradeToPro: () => set({ isPro: true, dailyGenerations: 0 }),
      getRemainingGenerations: () => {
        const { isPro, dailyGenerations } = get()
        if (isPro) return Infinity
        return Math.max(0, 3 - dailyGenerations)
      },
    }),
    {
      name: 'viso-storage',
      partialize: (state) => ({
        brandHandle: state.brandHandle,
        fontFamily: state.fontFamily,
        textColor: state.textColor,
        accentColor: state.accentColor,
        platform: state.platform,
        useWebSearch: state.useWebSearch,
      }),
    }
  )
)
