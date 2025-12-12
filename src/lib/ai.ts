import { v4 as uuidv4 } from 'uuid'
import type { Slide } from '../types'

interface RawSlide {
  id: string
  type: 'cover' | 'content' | 'cta'
  title: string
  content: string
  imageKeyword: string
}

// Fetch image from Unsplash via our proxy
async function fetchImage(query: string): Promise<string> {
  try {
    const response = await fetch(`/api/images?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to fetch image')
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Image fetch error:', error)
    // Fallback
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1000&fit=crop&q=80'
  }
}

export async function generateSlides(topic: string): Promise<Slide[]> {
  // Step 1: Get slides structure from Claude
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  const rawSlides: RawSlide[] = data.slides

  // Step 2: Fetch images for all slides in parallel
  const imagePromises = rawSlides.map(slide => 
    fetchImage(slide.imageKeyword || 'abstract dark gradient')
  )
  
  const images = await Promise.all(imagePromises)

  // Step 3: Combine slides with images
  const slides: Slide[] = rawSlides.map((slide, index) => ({
    id: slide.id || uuidv4(),
    type: slide.type === 'cta' ? 'content' : (slide.type || 'content'),
    title: slide.title || '',
    content: slide.content || '',
    image: images[index],
  }))

  return slides
}
