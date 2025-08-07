'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShareIcon,
  HeartIcon,
  UserIcon,
  CheckIcon,
  SwatchIcon,
  StarIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvents } from '@/hooks/useEvents'

// Theme configurations for draft events
const themes = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calm and professional with blue tones',
    primary: 'from-blue-500 to-blue-600',
    primarySolid: 'bg-blue-600',
    primaryLight: 'bg-blue-50',
    primaryText: 'text-blue-700',
    accent: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-50 to-cyan-50/20'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural and harmonious with green tones',
    primary: 'from-green-500 to-green-600',
    primarySolid: 'bg-green-600',
    primaryLight: 'bg-green-50',
    primaryText: 'text-green-700',
    accent: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    gradient: 'from-green-50 to-emerald-50/20'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Energetic and warm with orange tones',
    primary: 'from-orange-500 to-orange-600',
    primarySolid: 'bg-orange-600',
    primaryLight: 'bg-orange-50',
    primaryText: 'text-orange-700',
    accent: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
    gradient: 'from-orange-50 to-yellow-50/20'
  },
  {
    id: 'purple-mystic',
    name: 'Purple Mystic',
    description: 'Spiritual and elegant with purple tones',
    primary: 'from-purple-500 to-purple-600',
    primarySolid: 'bg-purple-600',
    primaryLight: 'bg-purple-50',
    primaryText: 'text-purple-700',
    accent: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    gradient: 'from-purple-50 to-pink-50/20'
  }
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-700'
    case 'draft':
      return 'bg-gray-100 text-gray-700'
    case 'generating':
      return 'bg-yellow-100 text-yellow-700 animate-pulse'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'generating':
      return 'AI Generating...'
    default:
      return status
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Single Event Preview Component
function SingleEventPreview({ event, theme = null }: { event: any, theme?: any }) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const daysUntilStart = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getStatusBadge = () => {
    if (event.status === 'trending') {
      return (
        <div className="px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 flex items-center space-x-1">
          <FireIcon className="w-4 h-4" />
          <span>Trending</span>
        </div>
      )
    }
    if (daysUntilStart > 0 && daysUntilStart < 7) {
      return (
        <div className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 flex items-center space-x-1 animate-pulse">
          <BoltIcon className="w-4 h-4" />
          <span>Starting Soon</span>
        </div>
      )
    }
    return null
  }

  // Apply theme colors if provided
  const themeStyles = theme ? {
    primary: theme.primary,
    accent: theme.accent,
    badge: theme.badge,
    gradient: theme.gradient,
    primarySolid: theme.primarySolid
  } : {
    primary: 'from-blue-500 to-blue-600',
    accent: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    gradient: 'from-gray-50 to-blue-50/20',
    primarySolid: 'bg-blue-600'
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyles.gradient}`}>
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={event.heroImage || event.thumbnail}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex space-x-3">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            {isFavorited ? (
              <HeartSolidIcon className="w-5 h-5 text-red-400" />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </button>
          <button className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-200">
            <ShareIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Badges */}
            <div className="flex items-center space-x-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${event.categoryBg} ${event.categoryText}`}>
                {event.category}
              </span>
              {event.featured && (
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  ✨ Featured
                </div>
              )}
              {getStatusBadge()}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-gray-200 mb-6 max-w-3xl">
              {event.subtitle}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              {event.rating && (
                <div className="flex items-center space-x-2">
                  <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{event.rating}</span>
                  <span className="text-sm">({event.reviews} reviews)</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-5 h-5" />
                <span>{event.participants}+ joined</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5" />
                <span>{event.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span className="font-semibold">{event.price}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Program Overview */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Program</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <div className="whitespace-pre-line">
                  {showFullDescription ? event.detailedDescription : `${event.detailedDescription?.substring(0, 350) || event.shortDescription}...`}
                </div>
                {event.detailedDescription && event.detailedDescription.length > 350 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className={`${themeStyles.accent} font-medium mt-4 flex items-center space-x-1`}
                  >
                    <span>{showFullDescription ? 'Show Less' : 'Read More'}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </section>

            {/* Key Benefits */}
            {event.keyBenefits && event.keyBenefits.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Achieve</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.keyBenefits.map((benefit: string, index: number) => (
                    <div key={index} className={`flex items-start space-x-3 p-4 rounded-xl hover:${theme?.primaryLight || 'bg-blue-50'} transition-colors group`}>
                      <CheckCircleIcon className={`w-6 h-6 ${themeStyles.accent} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Video Testimonial */}
            {event.videoTestimonial && event.videoTestimonial.title && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.videoTestimonial.title}</h2>
                  <p className="text-gray-600">{event.videoTestimonial.description}</p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={event.videoTestimonial.videoPoster || event.thumbnail}
                      alt="Video testimonial"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${themeStyles.primary} text-white`}>
                        <PlayCircleIcon className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Text Testimonials */}
            {event.textTestimonials && event.textTestimonials.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What Participants Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.textTestimonials.map((testimonial: any) => (
                    <div key={testimonial.id} className={`bg-gray-50 rounded-xl p-6 hover:${theme?.primaryLight || 'bg-blue-50'} transition-colors`}>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                      {testimonial.authorName && (
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">{testimonial.authorName}</div>
                          {testimonial.authorTitle && <div>{testimonial.authorTitle}</div>}
                          {testimonial.location && <div>{testimonial.location}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Registration Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {event.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">{event.originalPrice}</span>
                    )}
                    <span className={`text-3xl font-bold ${themeStyles.accent}`}>{event.price}</span>
                  </div>
                  {daysUntilStart > 0 && (
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      Starts in {daysUntilStart} days
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Start Date</div>
                      <div className="text-gray-600">{formatDate(event.startDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-gray-600">{event.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Format</div>
                      <div className="text-gray-600">{event.location}</div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {event.progress !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Registration</span>
                      <span>{event.progress}% Full</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${themeStyles.primary} h-2 rounded-full`}
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button className={`w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r ${themeStyles.primary} hover:opacity-90 transition-opacity`}>
                  {event.price === 'Free' ? 'Join Free Now' : 'Register Now'}
                </button>
              </div>

              {/* Facilitator Card */}
              {event.facilitator && event.facilitator.name && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Guide</h3>
                  <div className="flex items-start space-x-4">
                    <Image
                      src={event.facilitator.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'}
                      alt={event.facilitator.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.facilitator.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.facilitator.title}</p>
                      <p className="text-sm text-gray-600">{event.facilitator.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Card */}
              {event.stats && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Program Impact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {event.stats.totalGraduates > 0 && (
                      <div className="text-center">
                        <div className={`text-xl font-bold ${themeStyles.accent}`}>{event.stats.totalGraduates}</div>
                        <div className="text-xs text-gray-500">Graduates</div>
                      </div>
                    )}
                    {event.stats.practiceRetention && (
                      <div className="text-center">
                        <div className={`text-xl font-bold ${themeStyles.accent}`}>{event.stats.practiceRetention}</div>
                        <div className="text-xs text-gray-500">Still Practicing</div>
                      </div>
                    )}
                    {event.stats.averageStressReduction && (
                      <div className="text-center">
                        <div className={`text-xl font-bold ${themeStyles.accent}`}>{event.stats.averageStressReduction}</div>
                        <div className="text-xs text-gray-500">Stress Reduced</div>
                      </div>
                    )}
                    {event.stats.countriesRepresented > 0 && (
                      <div className="text-center">
                        <div className={`text-xl font-bold ${themeStyles.accent}`}>{event.stats.countriesRepresented}</div>
                        <div className="text-xs text-gray-500">Countries</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Multi-Theme Preview Component for Draft Events
function MultiThemePreview({ event, onPublish }: { event: any, onPublish: (themeId: string) => void }) {
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id)
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await onPublish(selectedTheme)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SwatchIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">
                Selected: {themes.find(t => t.id === selectedTheme)?.name}
              </h3>
              <p className="text-sm text-blue-700">
                {themes.find(t => t.id === selectedTheme)?.description}
              </p>
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>Publish This Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme Previews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {themes.map((theme, index) => (
          <div key={theme.id} className="relative">
            <div 
              className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                selectedTheme === theme.id ? 'border-gray-900 shadow-2xl scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              {/* Selection Indicator */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`p-3 rounded-full transition-all duration-200 ${
                  selectedTheme === theme.id 
                    ? 'bg-gray-900 text-white scale-110' 
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-105'
                }`}>
                  {selectedTheme === theme.id ? <CheckIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </div>
              </div>

              {/* Theme Header */}
              <div className={`${theme.primarySolid} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-sm opacity-90">{theme.description}</p>
                  </div>
                  <SwatchIcon className="w-6 h-6" />
                </div>
              </div>

              {/* Scaled Preview */}
              <div className="transform scale-[0.3] origin-top-left w-[333%] h-[300px] overflow-hidden">
                <SingleEventPreview event={event} theme={theme} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Event Preview Modal Component
function EventPreviewModal({ event, isOpen, onClose, onPublish }: { 
  event: any, 
  isOpen: boolean, 
  onClose: () => void,
  onPublish: (id: string, themeId: string) => void
}) {
  if (!event) return null

  const handlePublish = async (themeId: string) => {
    try {
      await onPublish(event.id, themeId)
      onClose()
    } catch (error) {
      console.error('Publishing failed:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {event.status === 'draft' ? 'Preview & Publish Event' : 'Event Preview'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {event.status === 'draft' 
                      ? 'Select your preferred theme and publish your event'
                      : 'How this event appears to users'
                    }
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {event.status === 'draft' ? (
                  <div className="p-6">
                    <MultiThemePreview event={event} onPublish={handlePublish} />
                  </div>
                ) : (
                  <SingleEventPreview event={event} />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ event, isOpen, onClose, onConfirm, loading }: {
  event: any,
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  loading: boolean
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>"{event?.title}"</strong>? This will permanently remove the event and all associated data.
              </p>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Event</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function AdminDashboard() {
  const { events, loading, error, success, fetchEvents, deleteEvent, publishEvent, clearMessages } = useEvents()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [deleteEventData, setDeleteEventData] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  // Show notifications
  useEffect(() => {
    if (success) {
      setNotification({ type: 'success', message: success })
    }
    if (error) {
      setNotification({ type: 'error', message: error })
    }
  }, [success, error])

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

  const handlePreview = (event: any) => {
    setSelectedEvent(event)
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
    setSelectedEvent(null)
  }

  const handleDeleteClick = (event: any) => {
    setDeleteEventData(event)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteEventData) {
      await deleteEvent(deleteEventData)
      setShowDeleteModal(false)
      setDeleteEventData(null)
    }
  }

  const handlePublish = async (eventId: string, themeId: string) => {
    await publishEvent(eventId, themeId)
  }

  // Filter events based on status
  const filteredEvents = events.filter(event => {
    if (statusFilter === 'all') return true
    return event.status === statusFilter
  })

  // Calculate stats
  const stats = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      change: `${events.filter(e => e.status === 'published').length} published`,
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Total Participants',
      value: events.reduce((sum, event) => sum + (event.participants || 0), 0).toLocaleString(),
      change: `${events.filter(e => e.status === 'draft').length} drafts`,
      icon: UsersIcon,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Active Programs',
      value: events.filter(e => e.status === 'published').length.toString(),
      change: `${events.filter(e => e.status === 'generating').length} generating`,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Draft Events',
      value: events.filter(e => e.status === 'draft').length.toString(),
      change: 'Ready to publish',
      icon: DocumentTextIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ]

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
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Admin Dashboard</h1>
              <p className="text-gray-600">Manage your events and create new programs with AI</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/create"
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create New Event</span>
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <SparklesIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Event Generator</h3>
            <p className="text-blue-100 mb-4 text-sm">Create stunning event pages with AI in minutes</p>
            <Link href="/admin/create" className="btn-secondary text-blue-600 hover:scale-105 transition-transform">
              Try AI Generator
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <DocumentTextIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Template Library</h3>
            <p className="text-green-100 mb-4 text-sm">Browse pre-made event templates</p>
            <button className="btn-secondary text-green-600 hover:scale-105 transition-transform">
              Browse Templates
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <ChartBarIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-purple-100 mb-4 text-sm">Track event performance and engagement</p>
            <button className="btn-secondary text-purple-600 hover:scale-105 transition-transform">
              View Analytics
            </button>
          </motion.div>
        </div>

        {/* Events Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
              <div className="flex items-center space-x-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="generating">Generating</option>
                </select>
                <button
                  onClick={fetchEvents}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  title="Refresh"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No events yet' : `No ${statusFilter} events`}
              </h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all' 
                  ? 'Create your first event to get started'
                  : `No events with ${statusFilter} status found`
                }
              </p>
              <Link href="/admin/create" className="btn-primary">
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-20 flex-shrink-0">
                            <Image
                              src={event.thumbnail || event.heroImage}
                              alt={event.title}
                              width={80}
                              height={48}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created {new Date(event.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.participants || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.lastModified).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handlePreview(event)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title={event.status === 'draft' ? 'Preview & Publish' : 'Preview Event'}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(event)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Event Preview Modal */}
      <EventPreviewModal 
        event={selectedEvent}
        isOpen={showPreview}
        onClose={closePreview}
        onPublish={handlePublish}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        event={deleteEventData}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  )
}