'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  SparklesIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UserIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  PlayCircleIcon,
  ChartBarIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateEvent } from '@/hooks/useEvents'

// Import all section components
import KeyBenefitsSection from '@/components/admin/sections/KeyBenefitsSection'
import CurriculumSection from '@/components/admin/sections/CurriculumSection'
import FacilitatorSection from '@/components/admin/sections/FacilitatorSection'
import VideoTestimonialSection from '@/components/admin/sections/VideoTestimonialSection'
import TextTestimonialsSection from '@/components/admin/sections/TextTestimonialsSection'
import FAQSection from '@/components/admin/sections/FAQSection'
import ProgramImpactSection from '@/components/admin/sections/ProgramImpactSection'
import UpcomingSessionsSection from '@/components/admin/sections/UpcomingSessionsSection'

// Import step components
import AIEnhancementStep from '@/components/admin/steps/AIEnhancementStep'
import ReviewStep from '@/components/admin/steps/ReviewStep'

// Form steps configuration
const FORM_STEPS = [
  { id: 1, title: 'Basic Details', description: 'Event information' },
  { id: 2, title: 'Configure Sections', description: 'Choose what to include' },
  { id: 3, title: 'Section Details', description: 'Fill enabled sections' },
  { id: 4, title: 'AI Enhancement', description: 'Let AI improve your event' },
  { id: 5, title: 'Review & Create', description: 'Final review' }
]

// Section configurations with user-friendly descriptions
const SECTION_CONFIGS = [
  {
    key: 'aboutSection',
    title: 'About Section',
    description: 'Detailed description of your event',
    icon: DocumentTextIcon,
    required: true,
    enabled: true
  },
  {
    key: 'benefitsSection',
    title: 'Key Benefits',
    description: 'What participants will achieve',
    icon: CheckIcon,
    required: false,
    enabled: true,
    mandatoryFields: ['keyBenefits'] // Mandatory if enabled
  },
  {
    key: 'curriculumSection',
    title: 'Program Curriculum',
    description: 'Week-by-week breakdown of your program',
    icon: BookOpenIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['curriculum'] // Mandatory if enabled
  },
  {
    key: 'facilitatorCard',
    title: 'Your Guide (Facilitator)',
    description: 'Information about the program leader',
    icon: UserIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['facilitator'] // Mandatory if enabled
  },
  {
    key: 'videoTestimonialSection',
    title: 'Video Testimonials',
    description: 'Success stories from participants',
    icon: PlayCircleIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['videoTestimonial'] // Mandatory if enabled
  },
  {
    key: 'textTestimonialsSection',
    title: 'What Participants Say',
    description: 'Written reviews and feedback',
    icon: ChatBubbleLeftRightIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['textTestimonials'] // Mandatory if enabled
  },
  {
    key: 'faqSection',
    title: 'FAQs',
    description: 'Frequently asked questions',
    icon: QuestionMarkCircleIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['faq'] // Mandatory if enabled
  },
  {
    key: 'statsCard',
    title: 'Program Impact',
    description: 'Statistics and success metrics',
    icon: ChartBarIcon,
    required: false,
    enabled: false,
    mandatoryFields: ['stats'] // Mandatory if enabled
  },
  {
    key: 'upcomingSessionCard',
    title: 'Upcoming Sessions',
    description: 'Free preview sessions or webinars',
    icon: CalendarDaysIcon,
    required: false,
    enabled: false
  }
]

// Categories with colors
const CATEGORIES = [
  { name: 'Flagship', color: 'from-blue-500 to-purple-600', bg: 'bg-blue-50', text: 'text-blue-700' },
  { name: 'Youth', color: 'from-green-500 to-blue-600', bg: 'bg-green-50', text: 'text-green-700' },
  { name: 'Corporate', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  { name: 'Leadership', color: 'from-orange-500 to-red-600', bg: 'bg-orange-50', text: 'text-orange-700' },
  { name: 'Retreat', color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', text: 'text-teal-700' },
  { name: 'Daily', color: 'from-yellow-500 to-orange-600', bg: 'bg-yellow-50', text: 'text-yellow-700' }
]

// Type definitions for better type safety
type SectionVisibility = {
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

type FormData = {
  // Basic Details
  title: string
  subtitle: string
  shortDescription: string
  detailedDescription: string
  category: string
  startDate: string
  endDate: string
  duration: string
  price: string
  originalPrice: string
  location: string
  timezone: string
  language: string[]
  level: string
  maxParticipants: string | number
  tags: string[]
  heroImage: string
  slug: string // Add slug field
  
  // Section visibility
  sectionVisibility: SectionVisibility
  
  // Section data
  keyBenefits: string[]
  curriculum: any[]
  facilitator: {
    name: string
    title: string
    bio: string
    image: string
    credentials: string[]
    experience: string
    studentsGuided: string
  }
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
  resources: any[]
  registrationUrl: string
  
  // AI Enhancement settings
  aiEnhancement: {
    enhanceDescriptions: boolean
    generateImages: boolean
    createTestimonials: boolean
    optimizeSEO: boolean
    generateFAQs: boolean
  }
}

// Utility function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Utility function to generate registration URL
const generateRegistrationUrl = (slug: string): string => {
  if (!slug) return ''
  return `https://localhost:3000/${slug}/register`
}

// Initial form data
const INITIAL_FORM_DATA: FormData = {
  // Basic Details
  title: '',
  subtitle: '',
  shortDescription: '',
  detailedDescription: '',
  category: '',
  startDate: '',
  endDate: '',
  duration: '',
  price: '',
  originalPrice: '',
  location: '',
  timezone: '',
  language: ['English'],
  level: '',
  maxParticipants: '',
  tags: [],
  heroImage: '',
  slug: '',
  
  // Section visibility
  sectionVisibility: {
    heroSection: true,
    aboutSection: true,
    benefitsSection: true,
    curriculumSection: false,
    facilitatorCard: false,
    videoTestimonialSection: false,
    textTestimonialsSection: false,
    faqSection: false,
    statsCard: false,
    upcomingSessionCard: false,
    registrationCard: true,
    relatedProgramsSection: true,
    countdownTimer: true
  },
  
  // Section data
  keyBenefits: [],
  curriculum: [],
  facilitator: {
    name: '',
    title: '',
    bio: '',
    image: '',
    credentials: [],
    experience: '',
    studentsGuided: ''
  },
  videoTestimonial: {
    title: '',
    description: '',
    videoUrl: '',
    videoPoster: 'https://images.unsplash.com/photo-1739611216842-05e54af86ec7?q=80&w=1718&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: ''
  },
  textTestimonials: [],
  faq: [],
  stats: {
    totalGraduates: 0,
    averageStressReduction: '',
    practiceRetention: '',
    recommendationRate: '',
    countriesRepresented: 0
  },
  upcomingSession: {
    date: '',
    time: '',
    title: '',
    description: '',
    registrationUrl: ''
  },
  resources: [],
  registrationUrl: '',
  
  // AI Enhancement settings
  aiEnhancement: {
    enhanceDescriptions: true,
    generateImages: true,
    createTestimonials: true,
    optimizeSEO: true,
    generateFAQs: true
  }
}

export default function CreateEventPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  // Use the enhanced create event hook
  const { saveAsDraft, loading, error, success, clearMessages } = useCreateEvent()

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        // Save to localStorage as draft
        localStorage.setItem('eventDraft', JSON.stringify(formData))
        console.log('Draft saved automatically to localStorage')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [formData, isDirty])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('eventDraft')
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        setFormData(parsedDraft)
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [])

  // Show notifications from hook
  useEffect(() => {
    if (success) {
      setNotification({ type: 'success', message: success })
      // Clear localStorage draft on successful save
      localStorage.removeItem('eventDraft')
      setIsDirty(false)
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/drafts')
      }, 2000)
    }
    if (error) {
      setNotification({ type: 'error', message: error })
    }
  }, [success, error, router])

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
        clearMessages()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification, clearMessages])

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
  }

  const updateSectionVisibility = (sectionKey: keyof SectionVisibility, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: enabled
      }
    }))
    setIsDirty(true)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Event title is required'
      if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required'
      if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required'
      if (!formData.category) newErrors.category = 'Category is required'
      if (!formData.startDate) newErrors.startDate = 'Start date is required'
      if (!formData.duration) newErrors.duration = 'Duration is required'
      if (!formData.price) newErrors.price = 'Price is required'
    }
    
    // Validate mandatory fields for enabled sections
    if (step === 3) {
      SECTION_CONFIGS.forEach(section => {
        const sectionKey = section.key as keyof SectionVisibility
        if (formData.sectionVisibility[sectionKey] && section.mandatoryFields) {
          section.mandatoryFields.forEach(fieldKey => {
            const fieldValue = (formData as any)[fieldKey]
            
            // Check if field is empty or has no valid data
            if (!fieldValue || 
                (Array.isArray(fieldValue) && fieldValue.length === 0) ||
                (typeof fieldValue === 'object' && Object.keys(fieldValue).length === 0) ||
                (typeof fieldValue === 'string' && !fieldValue.trim())) {
              newErrors[fieldKey] = `${section.title} is required when enabled`
            }
            
            // Special validation for specific field types
            if (fieldKey === 'keyBenefits' && Array.isArray(fieldValue)) {
              const validBenefits = fieldValue.filter(benefit => benefit && benefit.trim())
              if (validBenefits.length === 0) {
                newErrors[fieldKey] = 'At least one key benefit is required'
              }
            }
            
            if (fieldKey === 'curriculum' && Array.isArray(fieldValue)) {
              const validCurriculum = fieldValue.filter(week => 
                week && week.title && week.description && week.lessons && week.lessons.length > 0
              )
              if (validCurriculum.length === 0) {
                newErrors[fieldKey] = 'At least one curriculum week is required'
              }
            }
            
            if (fieldKey === 'facilitator' && typeof fieldValue === 'object') {
              if (!fieldValue.name || !fieldValue.title || !fieldValue.bio) {
                newErrors[fieldKey] = 'Facilitator name, title, and bio are required'
              }
            }
            
            if (fieldKey === 'videoTestimonial' && typeof fieldValue === 'object') {
              if (!fieldValue.title || !fieldValue.description || !fieldValue.videoUrl) {
                newErrors[fieldKey] = 'Video testimonial title, description, and video URL are required'
              }
            }
            
            if (fieldKey === 'textTestimonials' && Array.isArray(fieldValue)) {
              const validTestimonials = fieldValue.filter(testimonial => 
                testimonial && testimonial.text && testimonial.rating && testimonial.authorName
              )
              if (validTestimonials.length === 0) {
                newErrors[fieldKey] = 'At least one text testimonial is required'
              }
            }
            
            if (fieldKey === 'faq' && Array.isArray(fieldValue)) {
              const validFaqs = fieldValue.filter(faq => 
                faq && faq.question && faq.answer
              )
              if (validFaqs.length === 0) {
                newErrors[fieldKey] = 'At least one FAQ is required'
              }
            }
            
            if (fieldKey === 'stats' && typeof fieldValue === 'object') {
              const hasValidStats = fieldValue.totalGraduates > 0 || 
                                   fieldValue.averageStressReduction || 
                                   fieldValue.practiceRetention || 
                                   fieldValue.recommendationRate || 
                                   fieldValue.countriesRepresented > 0
              if (!hasValidStats) {
                newErrors[fieldKey] = 'At least one statistic is required for Program Impact'
              }
            }
          })
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Create event handler - saves as draft and triggers AI pipeline
  const handleCreateEvent = async () => {
    // Validate all required fields before creating
    if (!validateStep(1)) {
      setNotification({ type: 'error', message: 'Please fill in all required fields before creating the event' })
      setCurrentStep(1)
      return
    }
    
    // Validate mandatory section fields
    if (!validateStep(3)) {
      setNotification({ type: 'error', message: 'Please fill in all required fields for enabled sections' })
      setCurrentStep(3)
      return
    }

    try {
      // Save as draft - this will trigger the AI pipeline in the background
      await saveAsDraft(formData)
    } catch (err) {
      // Error is handled by the hook
      console.error('Create event failed:', err)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep formData={formData} updateFormData={updateFormData} errors={errors} />
      case 2:
        return <ConfigureSectionsStep formData={formData} updateSectionVisibility={updateSectionVisibility} />
      case 3:
        return <SectionDetailsStep formData={formData} updateFormData={updateFormData} errors={errors} />
      case 4:
        return <AIEnhancementStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && <CheckIcon className="w-5 h-5" />}
                {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
                {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-600">Build your event step by step with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Step {currentStep} of {FORM_STEPS.length}
              </div>
              {isDirty && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {FORM_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  currentStep > step.id 
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {FORM_STEPS[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {FORM_STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-ghost flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {currentStep < FORM_STEPS.length ? (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next Step</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateEvent}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 1: Basic Details
function BasicDetailsStep({ formData, updateFormData, errors }: {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}) {
  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      updateFormData({ tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateFormData({ tags: formData.tags.filter((tag: string) => tag !== tagToRemove) })
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title)
    const registrationUrl = generateRegistrationUrl(slug)
    
    updateFormData({ 
      title, 
      slug,
      registrationUrl,
      upcomingSession: {
        ...formData.upcomingSession,
        registrationUrl
      }
    })
  }

  // Handle manual slug change
  const handleSlugChange = (slug: string) => {
    const cleanSlug = generateSlug(slug)
    const registrationUrl = generateRegistrationUrl(cleanSlug)
    
    updateFormData({ 
      slug: cleanSlug,
      registrationUrl,
      upcomingSession: {
        ...formData.upcomingSession,
        registrationUrl
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Event Title & Description */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Mindful Leadership Mastery"
            className={`input-modern ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Slug *
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">https://localhost:3000/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="mindful-leadership-mastery"
              className="input-modern flex-1"
            />
            <span className="text-sm text-gray-500">/register</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            This creates your registration URL. Only lowercase letters, numbers, and hyphens allowed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration URL
          </label>
          <input
            type="url"
            value={formData.registrationUrl}
            readOnly
            className="input-modern bg-gray-50 text-gray-600"
          />
          <p className="text-sm text-gray-500 mt-1">
            This URL is automatically generated from your event slug.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => updateFormData({ subtitle: e.target.value })}
            placeholder="e.g., Transform Your Leadership Through Mindfulness"
            className="input-modern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => updateFormData({ shortDescription: e.target.value })}
            placeholder="Brief description that appears on event cards (1-2 sentences)"
            rows={3}
            className={`input-modern ${errors.shortDescription ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            value={formData.detailedDescription}
            onChange={(e) => updateFormData({ detailedDescription: e.target.value })}
            placeholder="Comprehensive description of your event, what participants will learn, the journey they'll experience, and the transformation they can expect. This will be used in the About section of your event page."
            rows={6}
            className={`input-modern ${errors.detailedDescription ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.detailedDescription && <p className="text-red-600 text-sm mt-1">{errors.detailedDescription}</p>}
          <p className="text-sm text-gray-500 mt-1">
            This detailed description will be used in the About section of your event page. AI can enhance this content to make it more engaging.
          </p>
        </div>
      </div>

      {/* Category & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              const category = CATEGORIES.find(c => c.name === e.target.value)
              updateFormData({
                category: e.target.value
              })
            }}
            className={`input-modern ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <select
            value={formData.level}
            onChange={(e) => updateFormData({ level: e.target.value })}
            className="input-modern"
          >
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
      </div>

      {/* Dates & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
            className={`input-modern ${errors.startDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
            className="input-modern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => updateFormData({ duration: e.target.value })}
            placeholder="e.g., 30 days, 2 weeks"
            className={`input-modern ${errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
        </div>
      </div>

      {/* Pricing & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => updateFormData({ price: e.target.value })}
              placeholder="e.g., $497, Free"
              className={`input-modern ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <input
              type="text"
              value={formData.originalPrice}
              onChange={(e) => updateFormData({ originalPrice: e.target.value })}
              placeholder="e.g., $797"
              className="input-modern"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location/Format
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., Online, Hybrid, New York"
            className="input-modern"
          />
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Participants
          </label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => updateFormData({ maxParticipants: parseInt(e.target.value) || '' })}
            placeholder="e.g., 100"
            className="input-modern"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <input
            type="text"
            value={formData.timezone}
            onChange={(e) => updateFormData({ timezone: e.target.value })}
            placeholder="e.g., EST, PST, UTC"
            className="input-modern"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag: string, index: number) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            className="input-modern flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Image URL
        </label>
        <input
          type="url"
          value={formData.heroImage}
          onChange={(e) => updateFormData({ heroImage: e.target.value })}
          placeholder="https://example.com/image.jpg (AI will generate if empty)"
          className="input-modern"
        />
        <p className="text-sm text-gray-500 mt-1">
          Leave empty to let AI generate a professional image for your event
        </p>
      </div>
    </div>
  )
}

// Step 2: Configure Sections
function ConfigureSectionsStep({ formData, updateSectionVisibility }: {
  formData: FormData
  updateSectionVisibility: (sectionKey: keyof SectionVisibility, enabled: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose What to Include in Your Event Page
        </h3>
        <p className="text-gray-600">
          Select the sections you want to include. You can always change these later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTION_CONFIGS.map((section) => {
          const Icon = section.icon
          const sectionKey = section.key as keyof SectionVisibility
          const isEnabled = formData.sectionVisibility[sectionKey]
          
          return (
            <div
              key={section.key}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isEnabled
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${section.required ? 'opacity-75' : ''}`}
              onClick={() => !section.required && updateSectionVisibility(sectionKey, !isEnabled)}
            >
              {section.required && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Required
                  </span>
                </div>
              )}
              
              {section.mandatoryFields && isEnabled && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Mandatory
                  </span>
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    {isEnabled && (
                      <CheckIcon className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {section.mandatoryFields && isEnabled && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ This section requires mandatory information to be filled
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">AI Enhancement</h4>
            <p className="text-sm text-blue-700">
              Don't worry about filling all the details now. Our AI will help enhance and complete 
              the sections you enable with professional content, images, and SEO optimization.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-900 mb-1">Mandatory Sections</h4>
            <p className="text-sm text-orange-700">
              Sections marked as "Mandatory" require you to provide basic information in the next step. 
              This ensures your event has complete and professional content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 3: Section Details - Now fully modular
function SectionDetailsStep({ formData, updateFormData, errors }: {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}) {
  // Get enabled sections that need to be filled
  const enabledSections = SECTION_CONFIGS.filter(section => {
    const sectionKey = section.key as keyof SectionVisibility
    return formData.sectionVisibility[sectionKey] && section.key !== 'aboutSection'
  })

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Fill in Details for Enabled Sections
        </h3>
        <p className="text-gray-600">
          Provide the required information for sections you've enabled. AI will enhance these later.
        </p>
      </div>

      {enabledSections.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Additional Sections Enabled</h3>
          <p className="text-gray-600">
            You can go back to step 2 to enable more sections, or continue to the next step.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Render sections using modular components */}
          {formData.sectionVisibility.benefitsSection && (
            <KeyBenefitsSection 
              keyBenefits={formData.keyBenefits}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.curriculumSection && (
            <CurriculumSection 
              curriculum={formData.curriculum}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.facilitatorCard && (
            <FacilitatorSection 
              facilitator={formData.facilitator}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.videoTestimonialSection && (
            <VideoTestimonialSection 
              videoTestimonial={formData.videoTestimonial}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.textTestimonialsSection && (
            <TextTestimonialsSection 
              textTestimonials={formData.textTestimonials}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.faqSection && (
            <FAQSection 
              faq={formData.faq}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.statsCard && (
            <ProgramImpactSection 
              stats={formData.stats}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {formData.sectionVisibility.upcomingSessionCard && (
            <UpcomingSessionsSection 
              upcomingSession={formData.upcomingSession}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Don't Worry About Perfection</h4>
            <p className="text-sm text-blue-700">
              Just provide the basic information for now. Our AI will enhance, expand, and optimize 
              all your content to make it professional and engaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}