const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ymeu3ythmr.ap-south-1.awsapprunner.com/api'

// Event interface matching the backend model
export interface Event {
  _id: string
  title: string
  subtitle: string
  slug: string
  shortDescription: string
  detailedDescription: string
  category: string
  categoryColor?: string
  categoryBg?: string
  categoryText?: string
  startDate: string
  endDate: string
  duration: string
  facilitator: {
    name: string
    title: string
    bio: string
    image: string
    credentials: string[]
    experience?: string
    studentsGuided?: string
  }
  heroImage: string
  galleryImages: string[]
  participants: number
  maxParticipants: number
  rating: number
  reviews: number
  price: string
  originalPrice?: string
  location: string
  timezone?: string
  language: string[]
  level: string
  status: string
  featured: boolean
  progress: number
  tags: string[]
  keyBenefits: string[]
  curriculum: {
    week: string
    title: string
    description: string
    lessons: string[]
  }[]
  videoTestimonial?: {
    title: string
    description: string
    videoUrl: string
    videoPoster: string
    duration?: string
  }
  textTestimonials: {
    text: string
    rating: number
    authorName?: string
    authorLocation?: string
    authorImage?: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
  stats?: {
    totalGraduates?: number
    averageStressReduction?: string
    practiceRetention?: string
    recommendationRate?: string
    countriesRepresented?: number
  }
  upcomingSession?: {
    date: string
    time: string
    title: string
    description: string
    registrationUrl: string
  }
  resources: {
    title: string
    description: string
    type: string
    size?: string
    downloadUrl: string
  }[]
  registrationUrl: string
  sectionVisibility: {
    heroSection: boolean
    aboutSection: boolean
    benefitsSection: boolean
    videoTestimonialSection: boolean
    textTestimonialsSection: boolean
    curriculumSection: boolean
    faqSection: boolean
    registrationCard: boolean
    facilitatorCard: boolean
    statsCard: boolean
    upcomingSessionCard: boolean
    relatedProgramsSection: boolean
    countdownTimer: boolean
  }
  relatedEvents: string[]
  createdAt: string
  updatedAt: string
}

// Registration interface
export interface Registration {
  _id: string
  eventId: string
  eventTitle: string
  fullName: string
  email: string
  phone: string
  country: string
  state: string
  city?: string
  batch?: string
  language: string
  receiveInfo: boolean
  agreeTerms: boolean
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  confirmationCode: string
  registeredAt: string
  confirmedAt?: string
  notes?: string
}

// Registration form data interface
export interface RegistrationFormData {
  eventId: string
  eventTitle?: string
  fullName: string
  email: string
  phone: string
  country: string
  state: string
  city?: string
  batch?: string
  language?: string
  receiveInfo?: boolean
  agreeTerms: boolean
  notes?: string
}

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface EventsApiResponse {
  success: boolean
  data: Event[] | {
    events: Event[]
    pagination: {
      current: number
      pages: number
      total: number
      limit: number
      next?: { page: number; limit: number }
      prev?: { page: number; limit: number }
    }
    filters?: {
      categories: string[]
    }
  }
  count?: number
  total?: number
  pagination?: {
    current: number
    pages: number
    total: number
    limit: number
    next?: { page: number; limit: number }
    prev?: { page: number; limit: number }
  }
  message?: string
  error?: string
}

interface EventDetailResponse extends ApiResponse<Event> {
  relatedEvents?: Event[]
}

interface RegistrationResponse extends ApiResponse<{
  registration: {
    id: string
    confirmationCode: string
    status: string
    eventTitle: string
    fullName: string
    email: string
    registeredAt: string
  }
}> {}

// Query parameters for events
interface EventsQuery {
  page?: number
  limit?: number
  category?: string
  search?: string
  featured?: boolean
  status?: string
  sortBy?: string
  sortOrder?: string
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`)
      
      const response = await fetch(url, config)
      
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ API Success:', data)
      return data
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Event methods
  async getEvents(query: EventsQuery = {}): Promise<EventsApiResponse> {
    try {
      const searchParams = new URLSearchParams()
      
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString())
        }
      })

      const queryString = searchParams.toString()
      const endpoint = `/events${queryString ? `?${queryString}` : ''}`
      
      console.log(`🔍 Fetching events with query:`, query)
      
      const response = await this.request<EventsApiResponse>(endpoint)
      
      console.log('📊 Raw API Response:', response)
      
      // Handle different response structures from backend
      if (response.success) {
        // If response.data is an object with events property
        if (response.data && typeof response.data === 'object' && 'events' in response.data) {
          return {
            success: true,
            data: response.data.events || [],
            total: response.data.pagination?.total || response.total || 0,
            pagination: response.data.pagination || response.pagination
          }
        }
        // If response.data is directly an array of events
        else if (Array.isArray(response.data)) {
          return {
            success: true,
            data: response.data,
            total: response.total || response.data.length,
            pagination: response.pagination
          }
        }
        // If response has events at root level
        else if (response.data) {
          return {
            success: true,
            data: response.data,
            total: response.total || 0,
            pagination: response.pagination
          }
        }
      }
      
      return response
    } catch (error) {
      console.error('❌ getEvents error:', error)
      return {
        success: false,
        data: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      }
    }
  }

  async getEvent(slug: string): Promise<EventDetailResponse> {
    try {
      const response = await this.request<EventDetailResponse>(`/events/${slug}`)
      console.log('📊 Event Detail Response:', response)
      return response
    } catch (error) {
      console.error('❌ getEvent error:', error)
      return {
        success: false,
        data: {} as Event,
        error: error instanceof Error ? error.message : 'Failed to fetch event'
      }
    }
  }

  async getFeaturedEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await this.request<{ success: boolean; data: Event[]; count: number }>('/events/featured')
      return {
        success: response.success,
        data: response.data || []
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch featured events'
      }
    }
  }

  async getTrendingEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await this.request<{ success: boolean; data: Event[]; count: number }>('/events/upcoming')
      return {
        success: response.success,
        data: response.data || []
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch trending events'
      }
    }
  }

  async createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    try {
      return await this.request<ApiResponse<Event>>('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      })
    } catch (error) {
      return {
        success: false,
        data: {} as Event,
        error: error instanceof Error ? error.message : 'Failed to create event'
      }
    }
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    try {
      return await this.request<ApiResponse<Event>>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      })
    } catch (error) {
      return {
        success: false,
        data: {} as Event,
        error: error instanceof Error ? error.message : 'Failed to update event'
      }
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<{}>> {
    try {
      return await this.request<ApiResponse<{}>>(`/events/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : 'Failed to delete event'
      }
    }
  }

  // Registration methods
  async createRegistration(registrationData: RegistrationFormData): Promise<RegistrationResponse> {
    try {
      return await this.request<RegistrationResponse>('/registrations', {
        method: 'POST',
        body: JSON.stringify(registrationData),
      })
    } catch (error) {
      return {
        success: false,
        data: {} as any,
        error: error instanceof Error ? error.message : 'Failed to create registration'
      }
    }
  }

  async getRegistration(id: string, confirmationCode?: string): Promise<ApiResponse<Registration>> {
    try {
      const queryString = confirmationCode ? `?confirmationCode=${confirmationCode}` : ''
      return await this.request<ApiResponse<Registration>>(`/registrations/${id}${queryString}`)
    } catch (error) {
      return {
        success: false,
        data: {} as Registration,
        error: error instanceof Error ? error.message : 'Failed to fetch registration'
      }
    }
  }

  async confirmRegistration(id: string, confirmationCode?: string): Promise<ApiResponse<any>> {
    try {
      const body = confirmationCode ? { confirmationCode } : {}
      return await this.request<ApiResponse<any>>(`/registrations/${id}/confirm`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : 'Failed to confirm registration'
      }
    }
  }

  async cancelRegistration(id: string, confirmationCode?: string): Promise<ApiResponse<any>> {
    try {
      const body = confirmationCode ? { confirmationCode } : {}
      return await this.request<ApiResponse<any>>(`/registrations/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : 'Failed to cancel registration'
      }
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`)
      return await response.json()
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : 'Health check failed'
      }
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export types for use in components
export type { 
  EventsQuery, 
  ApiResponse, 
  EventDetailResponse, 
  RegistrationResponse,
  EventsApiResponse
}