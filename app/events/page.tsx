'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { apiService, Event } from '../../lib/api'

interface StatusFilter {
  name: string
  value: string
  icon: string | null
}

interface Category {
  name: string
  value: string
  count: number
  color: string
}

const statusFilters: StatusFilter[] = [
  { name: 'All', value: '', icon: null },
  { name: 'Live', value: 'published', icon: '🔴' },
  { name: 'Trending', value: 'trending', icon: '🔥' },
  { name: 'Featured', value: 'featured', icon: '⭐' }
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🔄 Starting to fetch events...')
        
        if (currentPage === 1) {
          setLoading(true)
        } else {
          setLoadingMore(true)
        }
        setError(null)
        
        const queryParams: any = {
          page: currentPage,
          limit: 12
        }

        // Add filters
        if (selectedCategory) queryParams.category = selectedCategory
        if (searchTerm) queryParams.search = searchTerm
        if (selectedStatus === 'featured') queryParams.featured = true
        if (selectedStatus && selectedStatus !== 'featured') queryParams.status = selectedStatus
        
        console.log('📋 Query params:', queryParams)
        
        const response = await apiService.getEvents(queryParams)
        
        console.log('📊 API Response:', response)
        
        if (response.success) {
          const eventData = Array.isArray(response.data) ? response.data : []
          
          if (currentPage === 1) {
            setEvents(eventData)
          } else {
            setEvents(prev => [...prev, ...eventData])
          }
          
          setTotalEvents(response.total || eventData.length)
          setHasMore(response.pagination?.next ? true : false)
          
          // Extract unique categories from all events
          const allCategories = eventData.map((event: Event) => event.category).filter(Boolean)
          const uniqueCategories = Array.from(new Set(allCategories))
          
          const categoryData: Category[] = [
            { name: 'All', value: '', count: response.total || eventData.length, color: 'bg-gray-100 text-gray-700' },
            ...uniqueCategories.map((cat: string) => ({
              name: cat,
              value: cat,
              count: eventData.filter((event: Event) => event.category === cat).length,
              color: getCategoryColor(cat)
            }))
          ]
          setCategories(categoryData)
          
          console.log('✅ Events loaded successfully:', eventData.length)
        } else {
          console.error('❌ API returned error:', response.error)
          setError(response.error || 'Failed to fetch events')
        }
      } catch (err) {
        console.error('❌ Error fetching events:', err)
        setError('Failed to load events. Please try again.')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchEvents()
  }, [currentPage, selectedCategory, searchTerm, selectedStatus])

  // Reset pagination when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [selectedCategory, searchTerm, selectedStatus])

  // Filter and sort events locally for immediate response
  useEffect(() => {
    let filtered = [...(events || [])]

    // Apply local search filter for immediate feedback
    if (searchTerm) {
      filtered = filtered.filter((event: Event) => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.facilitator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort filtered events
    filtered.sort((a: Event, b: Event) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime()
        case 'date':
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime()
        case 'popularity':
          return (b.participants || 0) - (a.participants || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }, [events, searchTerm, sortBy])

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Flagship': 'bg-blue-100 text-blue-700',
      'Youth': 'bg-green-100 text-green-700',
      'Corporate': 'bg-orange-100 text-orange-700',
      'Leadership': 'bg-pink-100 text-pink-700',
      'Retreat': 'bg-purple-100 text-purple-700',
      'Daily': 'bg-yellow-100 text-yellow-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const getStatusBadge = (event: Event) => {
    const baseClasses = "badge flex items-center space-x-1 font-medium"
    
    if (event.featured) {
      return (
        <div className={`${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-500 text-white`}>
          <SparklesIcon className="w-3 h-3" />
          <span>Featured</span>
        </div>
      )
    }
    
    switch (event.status) {
      case 'published':
        return (
          <div className={`${baseClasses} bg-green-100 text-green-700`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </div>
        )
      case 'trending':
        return (
          <div className={`${baseClasses} bg-orange-100 text-orange-700`}>
            <ArrowTrendingUpIcon className="w-3 h-3" />
            <span>Trending</span>
          </div>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('')
    setCurrentPage(1)
  }

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Events</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Modern Hero Section */}
      <section className="section-padding py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Discover Programs ✨
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands transforming their lives through mindful practices
            </p>
          </motion.div>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalEvents}</div>
              <div className="text-sm text-gray-500">Programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{(events || []).reduce((sum: number, event: Event) => sum + (event.participants || 0), 0)}+</div>
              <div className="text-sm text-gray-500">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {events.length > 0 ? ((events || []).reduce((sum: number, event: Event) => sum + (event.rating || 0), 0) / events.length).toFixed(1) : '4.8'}
              </div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto section-padding pb-12">
        {/* Modern Search and Filter Bar */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern min-w-[120px]"
              >
                <option value="featured">Featured</option>
                <option value="date">By Date</option>
                <option value="popularity">Popular</option>
                <option value="rating">Top Rated</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost flex items-center ${showFilters ? 'bg-primary-50 text-primary-600' : ''}`}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategory || selectedStatus) && (
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(selectedCategory ? 1 : 0) + (selectedStatus ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {(categories || []).map((category: Category) => (
                        <button
                          key={category.value}
                          onClick={() => {
                            setSelectedCategory(category.value)
                          }}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category.value
                              ? 'bg-primary-600 text-white'
                              : category.color
                          }`}
                        >
                          {category.name} ({category.count})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map((status: StatusFilter) => (
                        <button
                          key={status.value}
                          onClick={() => setSelectedStatus(status.value)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            selectedStatus === status.value
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status.icon && <span>{status.icon}</span>}
                          <span>{status.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(selectedCategory || selectedStatus) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Clear filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredEvents.length}</span> programs found
          </p>
        </div>

        {/* Ultra-Modern Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredEvents || []).map((event: Event, index: number) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card group cursor-pointer relative overflow-hidden h-full flex flex-col"
            >
              {/* Status and Featured Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-col space-y-2">
                {getStatusBadge(event)}
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 z-20 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(event._id)
                  }}
                  className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
                >
                  {favorites.includes(event._id) ? (
                    <HeartSolidIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm">
                  <ShareIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <Link href={`/events/${event.slug}`} className="flex flex-col h-full">
                {/* Image with Gradient Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.heroImage || '/placeholder-image.jpg'}
                    alt={event.title || 'Event'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${event.categoryColor || 'from-blue-500 to-purple-600'} opacity-20`}></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-20"></div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-xs text-white/90 mb-1">
                      <span>{event.participants || 0} joined</span>
                      <span>{event.progress || 0}% full</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${event.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content - Flex grow to fill remaining space */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge ${event.categoryBg || 'bg-blue-50'} ${event.categoryText || 'text-blue-700'}`}>
                      {event.category || 'General'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{event.rating || 0}</span>
                      <span className="text-xs text-gray-500">({event.reviews || 0})</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-4 flex-1">
                    <h3 className="text-lg font-heading font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {event.title || 'Untitled Event'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{event.subtitle || ''}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.shortDescription || ''}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(event.tags || []).slice(0, 2).map((tag: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="w-3 h-3 mr-1" />
                        {formatDate(event.startDate)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {event.duration || 'TBD'}
                      </div>
                    </div>
                    <div className="font-medium text-primary-600">
                      {event.price || 'Free'}
                    </div>
                  </div>

                  {/* Facilitator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      by <span className="font-medium">{event.facilitator?.name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <UserGroupIcon className="w-3 h-3 mr-1" />
                      {event.participants || 0}+
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="btn-primary w-full mt-auto">
                    {event.price === 'Free' ? 'Join Free' : 'Learn More'}
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-primary px-8"
            >
              {loadingMore ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                'Load More Programs'
              )}
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-600 mb-6">Try different search terms or filters</p>
            <button
              onClick={resetFilters}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}