'use client'

import { 
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  PlayCircleIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface ReviewStepProps {
  formData: {
    title: string
    subtitle: string
    shortDescription: string
    category: string
    startDate: string
    endDate: string
    duration: string
    price: string
    originalPrice: string
    location: string
    level: string
    maxParticipants: string | number
    tags: string[]
    heroImage: string
    sectionVisibility: {
      benefitsSection: boolean
      curriculumSection: boolean
      facilitatorCard: boolean
      videoTestimonialSection: boolean
      textTestimonialsSection: boolean
      faqSection: boolean
      statsCard: boolean
      upcomingSessionCard: boolean
    }
    keyBenefits: string[]
    curriculum: any[]
    facilitator: {
      name: string
      title: string
      bio: string
    }
    videoTestimonial: {
      title: string
      videoUrl: string
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
    }
    aiEnhancement: {
      enhanceDescriptions: boolean
      generateImages: boolean
      createTestimonials: boolean
      optimizeSEO: boolean
      generateFAQs: boolean
    }
  }
}

const SECTION_ICONS = {
  benefitsSection: CheckIcon,
  curriculumSection: BookOpenIcon,
  facilitatorCard: UserIcon,
  videoTestimonialSection: PlayCircleIcon,
  textTestimonialsSection: ChatBubbleLeftRightIcon,
  faqSection: QuestionMarkCircleIcon,
  statsCard: ChartBarIcon,
  upcomingSessionCard: CalendarDaysIcon
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const enabledSections = Object.entries(formData.sectionVisibility)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key)

  const aiEnhancements = Object.entries(formData.aiEnhancement)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCompletionStatus = () => {
    const requiredFields = [
      formData.title,
      formData.shortDescription,
      formData.category,
      formData.startDate,
      formData.duration,
      formData.price
    ]
    
    const completedRequired = requiredFields.filter(field => field && field.toString().trim()).length
    const totalRequired = requiredFields.length
    
    return {
      completed: completedRequired,
      total: totalRequired,
      percentage: Math.round((completedRequired / totalRequired) * 100)
    }
  }

  const status = getCompletionStatus()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
            <EyeIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Event
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review all the details before creating your event. You can always edit these later.
        </p>
      </div>

      {/* Completion Status */}
      <div className={`rounded-xl border-2 p-6 ${
        status.percentage === 100 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          {status.percentage === 100 ? (
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          ) : (
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          )}
          <div className="flex-1">
            <h4 className={`font-medium ${
              status.percentage === 100 ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {status.percentage === 100 ? 'Ready to Create!' : 'Almost Ready'}
            </h4>
            <p className={`text-sm ${
              status.percentage === 100 ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {status.completed} of {status.total} required fields completed ({status.percentage}%)
            </p>
          </div>
          <div className={`text-2xl font-bold ${
            status.percentage === 100 ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {status.percentage}%
          </div>
        </div>
      </div>

      {/* Basic Event Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-gray-900 font-medium">{formData.title || 'Not specified'}</p>
            </div>
            
            {formData.subtitle && (
              <div>
                <label className="text-sm font-medium text-gray-500">Subtitle</label>
                <p className="text-gray-900">{formData.subtitle}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 text-sm">{formData.shortDescription || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-900">{formData.category || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">{formatDate(formData.startDate)}</p>
              </div>
            </div>
            
            {formData.endDate && (
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-gray-900">{formatDate(formData.endDate)}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">{formData.duration || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-gray-900">
                  {formData.price || 'Not specified'}
                  {formData.originalPrice && (
                    <span className="text-gray-500 line-through ml-2">{formData.originalPrice}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {formData.location && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.location}</span>
              </div>
            )}
            
            {formData.level && (
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.level}</span>
              </div>
            )}
            
            {formData.maxParticipants && (
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.maxParticipants} max</span>
              </div>
            )}
            
            {formData.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.tags.length} tags</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enabled Sections */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Enabled Sections ({enabledSections.length})
        </h4>
        
        {enabledSections.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No additional sections enabled</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {enabledSections.map((sectionKey) => {
              const Icon = SECTION_ICONS[sectionKey as keyof typeof SECTION_ICONS]
              const sectionName = sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
              
              return (
                <div key={sectionKey} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  {Icon && <Icon className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm text-blue-900 font-medium">{sectionName}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Content Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Summary</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {formData.sectionVisibility.benefitsSection && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formData.keyBenefits.length}</div>
              <div className="text-sm text-gray-600">Key Benefits</div>
            </div>
          )}
          
          {formData.sectionVisibility.curriculumSection && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formData.curriculum.length}</div>
              <div className="text-sm text-gray-600">Curriculum Weeks</div>
            </div>
          )}
          
          {formData.sectionVisibility.textTestimonialsSection && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{formData.textTestimonials.length}</div>
              <div className="text-sm text-gray-600">Testimonials</div>
            </div>
          )}
          
          {formData.sectionVisibility.faqSection && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formData.faq.length}</div>
              <div className="text-sm text-gray-600">FAQs</div>
            </div>
          )}
        </div>
      </div>

      {/* AI Enhancement Summary */}
      {aiEnhancements.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              AI Enhancements ({aiEnhancements.length})
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiEnhancements.map((enhancement) => {
              const enhancementNames = {
                enhanceDescriptions: 'Enhance Descriptions',
                generateImages: 'Generate Images',
                createTestimonials: 'Create Testimonials',
                optimizeSEO: 'SEO Optimization',
                generateFAQs: 'Generate FAQs'
              }
              
              return (
                <div key={enhancement} className="flex items-center space-x-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    {enhancementNames[enhancement as keyof typeof enhancementNames]}
                  </span>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> AI enhancements will be applied after your event is created. 
              You'll receive an email notification when they're ready for review.
            </p>
          </div>
        </div>
      )}

      {/* Final Check */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Before You Create</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Review all information</p>
              <p className="text-gray-600">Make sure all details are accurate and complete</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Event will be saved as draft</p>
              <p className="text-gray-600">You can edit and publish it later from the drafts section</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">AI processing will begin</p>
              <p className="text-gray-600">Selected AI enhancements will be applied automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}