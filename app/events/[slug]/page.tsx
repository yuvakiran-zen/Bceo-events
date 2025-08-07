'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  HeartIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Event } from '../../../lib/api'
import RegistrationModal from '../../../components/ui/RegistrationModal'
import VideoPlayer from '../../../components/ui/VideoPlayer'

interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<CountdownState>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiService.getEvent(slug)
        
        if (response.success) {
          setEvent(response.data)
          
          // Set related events if available
          if (response.relatedEvents && response.relatedEvents.length > 0) {
            setRelatedEvents(response.relatedEvents)
          }
        } else {
          setError(response.error || 'Event not found')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [slug])

  // Countdown timer
  useEffect(() => {
    if (!event?.startDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const eventDate = new Date(event.startDate).getTime()
      const distance = eventDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [event?.startDate])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const handleRegistration = (url: string | undefined, eventTitle: string, isModal: boolean = false) => {
    if (isModal) {
      setShowRegistrationModal(true)
      return
    }
    
    if (!url || url === '#') {
      // Show registration modal as fallback
      setShowRegistrationModal(true)
      return
    }
    
    // Open registration URL in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link href="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Hero Section */}
      {event.sectionVisibility?.heroSection !== false && (
        <section className="relative h-[60vh] overflow-hidden">
          <Image
            src={event.heroImage || '/placeholder-image.jpg'}
            alt={event.title || 'Event'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Navigation */}
          <div className="absolute top-6 left-6 z-20">
            <Link 
              href="/events" 
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 z-20 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-white" />
              )}
            </button>
            <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
              <ShareIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`badge ${event.categoryBg || 'bg-blue-500'} ${event.categoryText || 'text-white'} font-medium`}>
                  {event.category || 'General'}
                </span>
                {event.featured && (
                  <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium">
                    ✨ Featured
                  </span>
                )}
                <div className="flex items-center space-x-1 text-white/90">
                  <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">{event.rating || 0}</span>
                  <span className="text-sm">({event.reviews || 0} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3">
                {event.title || 'Untitled Event'}
              </h1>
              
              {event.subtitle && (
                <p className="text-xl text-white/90 mb-4">{event.subtitle}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-5 h-5" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{event.duration || 'TBD'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5" />
                  <span>{event.participants || 0}+ joined</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{event.location || 'Online'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto section-padding py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {event.sectionVisibility?.aboutSection !== false && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">About This Program</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {showFullDescription ? (event.detailedDescription || event.shortDescription) : (event.shortDescription || 'No description available.')}
                  </p>
                  {event.detailedDescription && event.detailedDescription !== event.shortDescription && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                    >
                      <span>{showFullDescription ? 'Show Less' : 'Read More'}</span>
                      {showFullDescription ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Key Benefits */}
            {event.sectionVisibility?.benefitsSection !== false && event.keyBenefits?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Key Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.keyBenefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video Testimonial */}
            {event.sectionVisibility?.videoTestimonialSection !== false && event.videoTestimonial && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">{event.videoTestimonial.title}</h2>
                <p className="text-gray-600 mb-6">{event.videoTestimonial.description}</p>
                <VideoPlayer
                  videoUrl={event.videoTestimonial.videoUrl}
                  posterUrl={event.videoTestimonial.videoPoster}
                  title={event.videoTestimonial.title}
                  duration={event.videoTestimonial.duration}
                  className="aspect-video rounded-xl overflow-hidden"
                  controls={true}
                />
              </motion.div>
            )}

            {/* Text Testimonials */}
            {event.sectionVisibility?.textTestimonialsSection !== false && event.textTestimonials?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">What Participants Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.textTestimonials.map((testimonial, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < (testimonial.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                      {testimonial.authorName && (
                        <div className="flex items-center space-x-3">
                          {testimonial.authorImage && (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={testimonial.authorImage}
                                alt={testimonial.authorName}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{testimonial.authorName}</div>
                            {testimonial.authorLocation && (
                              <div className="text-sm text-gray-500">{testimonial.authorLocation}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Curriculum */}
            {event.sectionVisibility?.curriculumSection !== false && event.curriculum?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Program Curriculum</h2>
                <div className="space-y-6">
                  {event.curriculum.map((week, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{week.week}</h3>
                          <h4 className="text-primary-600 font-medium">{week.title}</h4>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{week.description}</p>
                      <div className="space-y-2">
                        {(week.lessons || []).map((lesson: string, lessonIndex: number) => (
                          <div key={lessonIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQ */}
            {event.sectionVisibility?.faqSection !== false && event.faq?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {event.faq.map((faq, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-gray-600">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            {event.sectionVisibility?.registrationCard !== false && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sticky top-6"
              >
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{event.price || 'Free'}</div>
                  {event.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">{event.originalPrice}</div>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{event.duration || 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{(event.language || []).join(', ') || 'English'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium">{event.level || 'All Levels'}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{event.participants || 0} enrolled</span>
                    <span>{event.progress || 0}% full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${event.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleRegistration(event.registrationUrl, event.title || 'this event', true)}
                  className="btn-primary w-full mb-4 flex items-center justify-center space-x-2 group hover:shadow-lg transition-all duration-200"
                >
                  <span>{event.price === 'Free' ? 'Join Free' : 'Register Now'}</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  30-day money-back guarantee
                </p>
              </motion.div>
            )}

            {/* Countdown Timer */}
            {event.sectionVisibility?.countdownTimer !== false && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Starts In</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">{countdown.days}</div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">{countdown.hours}</div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">{countdown.minutes}</div>
                    <div className="text-xs text-gray-500">Min</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-primary-600">{countdown.seconds}</div>
                    <div className="text-xs text-gray-500">Sec</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Facilitator Card */}
            {event.sectionVisibility?.facilitatorCard !== false && event.facilitator && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Facilitator</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={event.facilitator.image || '/placeholder-avatar.jpg'}
                      alt={event.facilitator.name || 'Facilitator'}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.facilitator.name || 'TBD'}</h4>
                    <p className="text-sm text-primary-600 mb-2">{event.facilitator.title || ''}</p>
                    <p className="text-sm text-gray-600 mb-3">{event.facilitator.bio || ''}</p>
                    {event.facilitator.credentials?.length > 0 && (
                      <div className="space-y-1">
                        {event.facilitator.credentials.map((credential: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                            <AcademicCapIcon className="w-3 h-3" />
                            <span>{credential}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Card */}
            {event.sectionVisibility?.statsCard !== false && event.stats && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Impact</h3>
                <div className="space-y-4">
                  {event.stats.totalGraduates && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Graduates</span>
                      <span className="font-semibold">{event.stats.totalGraduates}</span>
                    </div>
                  )}
                  {event.stats.averageStressReduction && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Stress Reduction</span>
                      <span className="font-semibold">{event.stats.averageStressReduction}</span>
                    </div>
                  )}
                  {event.stats.practiceRetention && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Practice Retention</span>
                      <span className="font-semibold">{event.stats.practiceRetention}</span>
                    </div>
                  )}
                  {event.stats.recommendationRate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recommendation Rate</span>
                      <span className="font-semibold">{event.stats.recommendationRate}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Upcoming Session Card */}
            {event.sectionVisibility?.upcomingSessionCard !== false && event.upcomingSession && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Upcoming Free Session
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{event.upcomingSession.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{event.upcomingSession.time}</span>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 mt-3">
                    <h4 className="font-medium text-gray-900 mb-1">{event.upcomingSession.title}</h4>
                    <p className="text-sm text-gray-600">{event.upcomingSession.description}</p>
                  </div>
                  <button
                    onClick={() => handleRegistration(event.upcomingSession?.registrationUrl, event.upcomingSession?.title || 'free session', true)}
                    className="btn-primary w-full text-sm flex items-center justify-center space-x-2 group hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  >
                    <span>Register for Free Session</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Resources */}
            {event.resources?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                <div className="space-y-3">
                  {event.resources.map((resource, index: number) => (
                    <a
                      key={index}
                      href={resource.downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-primary-700">{resource.title}</div>
                        <div className="text-sm text-gray-600">{resource.description}</div>
                        {resource.size && (
                          <div className="text-xs text-gray-500">{resource.type} • {resource.size}</div>
                        )}
                      </div>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Programs */}
        {event.sectionVisibility?.relatedProgramsSection !== false && relatedEvents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">Related Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.slice(0, 3).map((relatedEvent: Event) => (
                <Link key={relatedEvent._id} href={`/events/${relatedEvent.slug}`} className="card group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedEvent.heroImage || '/placeholder-image.jpg'}
                      alt={relatedEvent.title || 'Event'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`badge ${relatedEvent.categoryBg || 'bg-blue-50'} ${relatedEvent.categoryText || 'text-blue-700'}`}>
                        {relatedEvent.category || 'General'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{relatedEvent.rating || 0}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {relatedEvent.title || 'Untitled Event'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{relatedEvent.shortDescription || ''}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(relatedEvent.startDate)}</span>
                      <span className="font-medium text-primary-600">{relatedEvent.price || 'Free'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Registration Modal */}
      {event && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          event={event}
        />
      )}
    </div>
  )
}