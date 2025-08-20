import { useState, useEffect } from 'react'

interface Event {
  id: string
  _id?: string
  title: string
  subtitle: string
  shortDescription: string
  detailedDescription: string
  slug: string
  category: string
  startDate: string
  endDate: string
  duration: string
  price: string
  originalPrice: string
  location: string
  level: string
  maxParticipants: number
  tags: string[]
  heroImage: string
  thumbnail: string
  status: 'draft' | 'published' | 'generating'
  participants: number
  createdAt: string
  lastModified: string
  updatedAt?: string
  facilitator: {
    name: string
    title: string
    bio: string
    image: string
    experience: string
    studentsGuided: string
    credentials: string[]
  }
  keyBenefits: string[]
  curriculum: any[]
  videoTestimonial: {
    title: string
    description: string
    videoUrl: string
    videoPoster: string
    duration: string
  }
  textTestimonials: any[]
  faq: any[]
  stats: {
    totalGraduates: number
    averageStressReduction: string
    practiceRetention: string
    recommendationRate: string
    countriesRepresented: number
  }
  upcomingSession: {
    date: string
    time: string
    title: string
    description: string
    registrationUrl: string
  }
  registrationUrl: string
  rating?: number
  reviews?: number
  featured?: boolean
  progress?: number
  categoryColor?: string
  categoryBg?: string
  categoryText?: string
  sectionVisibility?: {
    heroSection: boolean
    aboutSection: boolean
    benefitsSection: boolean
    curriculumSection: boolean
    facilitatorCard: boolean
    videoTestimonialSection: boolean
    textTestimonialsSection: boolean
    faqSection: boolean
    statsCard: boolean
    upcomingSessionCard: boolean
    registrationCard: boolean
    relatedProgramsSection: boolean
    countdownTimer: boolean
  }
  aiEnhancement?: {
    enhanceDescriptions: boolean
    generateImages: boolean
    createTestimonials: boolean
    optimizeSEO: boolean
    generateFAQs: boolean
  }
}

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  success: string | null
  fetchEvents: () => Promise<void>
  deleteEvent: (event: Event) => Promise<void>
  publishEvent: (id: string, themeId?: string) => Promise<void>
  saveAsDraft: (eventData: any) => Promise<void>
  clearMessages: () => void
}

// Get the Express server URL from environment or default to AWS App Runner
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ymeu3ythmr.ap-south-1.awsapprunner.com'

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Fetching events from Express server...')
      
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Response data:', data)
      
      // Handle different response formats from your Express server
      if (data.success !== false) {
        const eventsData = data.events || data.data || data || []
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        console.log('✅ Events loaded successfully:', eventsData.length)
      } else {
        throw new Error(data.message || data.error || 'Failed to fetch events')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events'
      console.error('❌ Fetch events error:', errorMessage)
      setError(errorMessage)
      setEvents([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (event: Event) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🗑️ Deleting event:', event.id)
      
      const response = await fetch(`${API_BASE_URL}/api/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats from your Express server
      if (data.success !== false) {
        setEvents(prev => prev.filter(e => e.id !== event.id))
        setSuccess(data.message || 'Event deleted successfully')
        console.log('✅ Event deleted successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to delete event')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      console.error('❌ Delete event error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const publishEvent = async (id: string, themeId?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📤 Publishing event:', id, 'with theme:', themeId)
      
      const response = await fetch(`${API_BASE_URL}/api/events/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats from your Express server
      if (data.success !== false) {
        setEvents(prev => prev.map(event => 
          event.id === id 
            ? { ...event, status: 'published' as const, lastModified: new Date().toISOString() } 
            : event
        ))
        setSuccess(data.message || 'Event published successfully')
        console.log('✅ Event published successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to publish event')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish event'
      console.error('❌ Publish event error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const saveAsDraft = async (eventData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('💾 Saving event as draft:', eventData.title)
      
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          status: 'published'
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats from your Express server
      if (data.success !== false) {
        const newEvent = data.event || data.data || data
        if (newEvent) {
          setEvents(prev => [newEvent, ...prev])
        }
        setSuccess(data.message || 'Event saved as draft successfully! You can now preview and publish it from the admin dashboard.')
        console.log('✅ Event saved as draft successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to save event')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save event'
      console.error('❌ Save event error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fetch events on mount
  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    success,
    fetchEvents,
    deleteEvent,
    publishEvent,
    saveAsDraft,
    clearMessages
  }
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const saveAsDraft = async (eventData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('💾 Creating new event:', eventData.title)
      
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          status: 'published'
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats from your Express server
      if (data.success !== false) {
        setSuccess(data.message || 'Event saved as draft successfully! You can now preview and publish it from the admin dashboard.')
        console.log('✅ Event created successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to save event')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save event'
      console.error('❌ Create event error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    saveAsDraft,
    clearMessages
  }
}

export function useDraftEvents() {
  const [drafts, setDrafts] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDrafts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📄 Fetching draft events...')
      
      const response = await fetch(`${API_BASE_URL}/api/events?status=draft`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success !== false) {
        setDrafts(data.events || data || [])
        console.log('✅ Draft events fetched successfully:', data.events?.length || data?.length || 0, 'drafts')
      } else {
        throw new Error(data.message || data.error || 'Failed to fetch draft events')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch draft events'
      console.error('❌ Fetch drafts error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteDraft = async (draftId: string) => {
    try {
      console.log('🗑️ Deleting draft:', draftId)
      
      const response = await fetch(`${API_BASE_URL}/api/events/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success !== false) {
        // Remove the deleted draft from the local state
        setDrafts(prev => prev.filter(draft => (draft._id || draft.id) !== draftId))
        console.log('✅ Draft deleted successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to delete draft')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete draft'
      console.error('❌ Delete draft error:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  const publishDraft = async (draftId: string) => {
    try {
      console.log('📤 Publishing draft:', draftId)
      
      const response = await fetch(`${API_BASE_URL}/api/events/${draftId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success !== false) {
        // Remove the published draft from the local state
        setDrafts(prev => prev.filter(draft => (draft._id || draft.id) !== draftId))
        console.log('✅ Draft published successfully')
      } else {
        throw new Error(data.message || data.error || 'Failed to publish draft')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish draft'
      console.error('❌ Publish draft error:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  const refetch = () => {
    fetchDrafts()
  }

  useEffect(() => {
    fetchDrafts()
  }, [])

  return {
    drafts,
    loading,
    error,
    refetch,
    deleteDraft,
    publishDraft
  }
}

// Export the Event type for use in other components
export type { Event }