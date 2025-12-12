export interface Slide {
  id: string
  type: 'content' | 'cover'
  content: string
  title: string
  image?: string
}

export interface Project {
  id: string
  topic: string
  slides: Slide[]
}

