'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  SparklesIcon,
  SwatchIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  ShareIcon,
  HeartIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  FireIcon,
  BoltIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayer from '@/components/ui/VideoPlayer'

// Mock event data (would come from API)
const mockEventData = {
  id: 1,
  title: 'Yogam - 40 Day Transformation',
  subtitle: 'Master breath mindfulness and daily habits for lasting inner peace',
  shortDescription: 'Transform your life through ancient yogic practices and modern mindfulness techniques.',
  fullDescription: `Join us for a comprehensive 40-day transformation journey that combines traditional yoga practices with modern wellness approaches. This program is designed to help you develop sustainable habits, increase mindfulness, and achieve personal growth.

What you'll experience:
• Daily guided meditation sessions
• Progressive yoga sequences
• Mindfulness workshops
• Community support and guidance
• Personal transformation tracking

Whether you're a beginner or experienced practitioner, this program adapts to your level and helps you progress at your own pace.`,
  startDate: '2024-02-15',
  endDate: '2024-03-25',
  duration: '40 days',
  facilitator: {
    name: 'Master Ravi Shankar',
    title: 'Founder & Chief Mindfulness Officer',
    bio: 'With over 15 years of experience in meditation and mindfulness teaching, Ravi has guided thousands of individuals on their spiritual journey.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    experience: '15+ years',
    studentsGuided: '10,000+'
  },
  heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=800&fit=crop',
  participants: 500,
  maxParticipants: 1000,
  rating: 4.9,
  reviews: 234,
  price: 'Free',
  originalPrice: '$297',
  location: 'Online + Global Community',
  level: 'All Levels',
  status: 'trending',
  featured: true,
  progress: 50,
  tags: ['Meditation', 'Mindfulness', 'Daily Practice', 'Transformation'],
  keyBenefits: [
    'Master advanced breath mindfulness techniques',
    'Develop unshakeable daily meditation habits',
    'Experience profound inner transformation',
    'Build emotional resilience and mental clarity',
    'Connect with global mindfulness community',
    'Access exclusive meditation resources library'
  ],
  videoTestimonial: {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=800&h=500&fit=crop',
    duration: '3:24'
  },
  textTestimonials: [
    { id: 1, text: 'This program completely transformed my relationship with stress and anxiety.', rating: 5 },
    { id: 2, text: 'For the first time ever, I have a meditation practice that I actually look forward to.', rating: 5 }
  ],
  curriculum: [
    {
      week: 'Week 1',
      title: 'Foundation & Awareness',
      description: 'Establish fundamental breath awareness and daily practice routine',
      lessons: ['Introduction to breath mindfulness', 'Setting up meditation space', 'Basic breathing techniques']
    },
    {
      week: 'Week 2-3',
      title: 'Deepening Practice',
      description: 'Expand techniques and develop sustained mindful awareness',
      lessons: ['Advanced breathing patterns', 'Walking meditation', 'Mindful eating practices']
    }
  ],
  faq: [
    {
      question: 'What makes this program different from other meditation courses?',
      answer: 'Our program combines ancient wisdom with modern neuroscience, offering personalized guidance and a supportive global community.'
    }
  ],
  stats: {
    totalGraduates: 2847,
    averageStressReduction: '68%',
    practiceRetention: '84%',
    countriesRepresented: 52
  }
}

// Theme configurations with exact same layout but different colors
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
    gradient: 'from-blue-50 to-cyan-50/20',
    heroGradient: 'from-blue-500 to-cyan-600'
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
    gradient: 'from-green-50 to-emerald-50/20',
    heroGradient: 'from-green-500 to-emerald-600'
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
    gradient: 'from-orange-50 to-yellow-50/20',
    heroGradient: 'from-orange-500 to-red-600'
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
    gradient: 'from-purple-50 to-pink-50/20',
    heroGradient: 'from-purple-500 to-pink-600'
  }
]

// Event page component with theme support
function EventPagePreview({ theme, event, isSelected, onSelect }: { 
  theme: any,
  event: any,
  isSelected: boolean,
  onSelect: () => void
}) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const daysUntilStart = Math.ceil((new Date(event.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className={`relative bg-gradient-to-br ${theme.gradient} rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
      isSelected ? 'border-gray-900 shadow-2xl scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Selection Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <button
          onClick={onSelect}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 pointer-events-auto ${
            isSelected 
              ? 'bg-gray-900 text-white scale-110' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-105'
          }`}
        >
          {isSelected ? <CheckIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
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

      {/* Scaled Event Page Content */}
      <div className="transform scale-[0.4] origin-top-left w-[250%] h-[250%] overflow-hidden">
        <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
          {/* Hero Section */}
          <section className="relative h-[60vh] overflow-hidden">
            <Image
              src={event.heroImage}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            
            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                {/* Badges */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${theme.badge}`}>
                    Flagship
                  </span>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${theme.heroGradient} text-white`}>
                    ✨ Featured
                  </div>
                  <div className="px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 flex items-center space-x-1">
                    <FireIcon className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-bold text-white mb-4">{event.title}</h1>
                <p className="text-xl text-gray-200 mb-6 max-w-3xl">{event.subtitle}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">{event.rating}</span>
                    <span className="text-sm">({event.reviews} reviews)</span>
                  </div>
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
                      {showFullDescription ? event.fullDescription : `${event.fullDescription.substring(0, 350)}...`}
                    </div>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className={`${theme.accent} font-medium mt-4 flex items-center space-x-1`}
                    >
                      <span>{showFullDescription ? 'Show Less' : 'Read More'}</span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </section>

                {/* Key Benefits */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Achieve</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.keyBenefits.map((benefit: string, index: number) => (
                      <div key={index} className={`flex items-start space-x-3 p-4 rounded-xl hover:${theme.primaryLight} transition-colors group`}>
                        <CheckCircleIcon className={`w-6 h-6 ${theme.accent} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Video Testimonial */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Impact Story</h2>
                    <p className="text-gray-600">See the transformation that awaits you</p>
                  </div>
                  
                  <div className="max-w-4xl mx-auto">
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={event.videoTestimonial.videoPoster}
                        alt="Video testimonial"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className={`p-4 rounded-full bg-gradient-to-r ${theme.primary} text-white`}>
                          <PlayCircleIcon className="w-12 h-12" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Text Testimonials */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What Participants Say</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.textTestimonials.map((testimonial: any) => (
                      <div key={testimonial.id} className={`bg-gray-50 rounded-xl p-6 hover:${theme.primaryLight} transition-colors`}>
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"{testimonial.text}"</p>
                      </div>
                    ))}
                  </div>
                </section>
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
                        <span className={`text-3xl font-bold ${theme.accent}`}>{event.price}</span>
                      </div>
                      <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        Starts in {daysUntilStart} days
                      </div>
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
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Registration</span>
                        <span>{event.progress}% Full</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${theme.primary} h-2 rounded-full`}
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r ${theme.primary} hover:opacity-90 transition-opacity`}>
                      {event.price === 'Free' ? 'Join Free Now' : 'Register Now'}
                    </button>
                  </div>

                  {/* Facilitator Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Guide</h3>
                    <div className="flex items-start space-x-4">
                      <Image
                        src={event.facilitator.image}
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

                  {/* Stats Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Program Impact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${theme.accent}`}>{event.stats.totalGraduates}</div>
                        <div className="text-xs text-gray-500">Graduates</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${theme.accent}`}>{event.stats.practiceRetention}</div>
                        <div className="text-xs text-gray-500">Still Practicing</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${theme.accent}`}>{event.stats.averageStressReduction}</div>
                        <div className="text-xs text-gray-500">Stress Reduced</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${theme.accent}`}>{event.stats.countriesRepresented}</div>
                        <div className="text-xs text-gray-500">Countries</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventPreviewPage() {
  const params = useParams()
  const eventId = params?.eventId as string
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id)
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // API call to publish the event with selected theme
      const response = await fetch(`/api/events/${eventId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: selectedTheme })
      })
      
      if (response.ok) {
        // Redirect to admin dashboard with success message
        window.location.href = '/admin?published=true'
      }
    } catch (error) {
      console.error('Publishing failed:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Preview & Publish</h1>
                <p className="text-gray-600">Choose your preferred theme and publish your event</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <SparklesIcon className="w-4 h-4 inline mr-1" />
                AI Generated • {themes.length} Themes
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
                    <span>Publish Selected Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection Info */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Click any theme to select
            </div>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-[600px] overflow-hidden"
            >
              <EventPagePreview
                theme={theme}
                event={mockEventData}
                isSelected={selectedTheme === theme.id}
                onSelect={() => setSelectedTheme(theme.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 Tip: You can change the theme later from the admin dashboard
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="btn-secondary"
              >
                Save as Draft
              </Link>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}