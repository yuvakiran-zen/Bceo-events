'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  SparklesIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  HeartIcon,
  ChevronRightIcon,
  FireIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

// Modern Gen Z optimized data structure
const featuredPrograms = [
  {
    id: 1,
    title: 'Yogam',
    subtitle: '40-Day Transformation',
    description: 'Master mindfulness through daily practice',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    category: 'Flagship',
    duration: '40d',
    participants: '500+',
    rating: 4.9,
    color: 'from-blue-500 to-purple-600',
    matchScore: 95,
    status: 'trending'
  },
  {
    id: 2,
    title: 'LifeZest',
    subtitle: 'Youth Energy Program',
    description: 'Build resilience & unlock your potential',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    category: 'Youth',
    duration: '21d',
    participants: '350+',
    rating: 4.8,
    color: 'from-green-500 to-teal-600',
    matchScore: 88,
    status: 'new'
  },
  {
    id: 3,
    title: 'Thrive',
    subtitle: 'Corporate Mindfulness',
    description: 'Transform workplace culture',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
    category: 'Corporate',
    duration: '30d',
    participants: '200+',
    rating: 4.7,
    color: 'from-orange-500 to-red-600',
    matchScore: 92,
    status: 'hot'
  }
]

const quickActions = [
  {
    id: 1,
    title: '5min Meditation',
    subtitle: 'Quick reset',
    icon: PlayIcon,
    color: 'bg-blue-100 text-blue-600',
    action: '/quick-meditation'
  },
  {
    id: 2,
    title: 'Daily Check-in',
    subtitle: 'How are you?',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-600',
    action: '/checkin'
  },
  {
    id: 3,
    title: 'Browse Events',
    subtitle: 'See all',
    icon: CalendarDaysIcon,
    color: 'bg-purple-100 text-purple-600',
    action: '/events'
  }
]

const trendingNow = [
  {
    id: 4,
    title: 'Morning Ritual',
    participants: '1.2k',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    title: 'Stress-Free Zone',
    participants: '890',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    title: 'Focus Session',
    participants: '756',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
  }
]

export default function ForYouPage() {
  const [favoritePrograms, setFavoritePrograms] = useState<number[]>([])
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const toggleFavorite = (programId: number) => {
    setFavoritePrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'trending':
        return <div className="badge bg-blue-100 text-blue-700">🔥 Trending</div>
      case 'new':
        return <div className="badge bg-green-100 text-green-700">✨ New</div>
      case 'hot':
        return <div className="badge bg-red-100 text-red-700">🚀 Hot</div>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section - Compact & Modern */}
      <section className="section-padding py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              {greeting} 👋
            </h1>
            <p className="text-gray-600 text-base">
              Your personalized mindfulness journey awaits
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 hover:scale-105 cursor-pointer"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.subtitle}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto section-padding pb-8">
        {/* Recommended For You */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900">Recommended</h2>
              <p className="text-sm text-gray-500">Based on your journey</p>
            </div>
            <Link href="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group cursor-pointer relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  {getStatusBadge(program.status)}
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(program.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
                >
                  {favoritePrograms.includes(program.id) ? (
                    <HeartSolidIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-20`}></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-primary">
                      {program.category}
                    </span>
                    <div className="badge-success">
                      {program.matchScore}% match
                    </div>
                  </div>

                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-1">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{program.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {program.duration}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-3 h-3 mr-1" />
                        {program.participants}
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        {program.rating}
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={`/events/${program.title.toLowerCase()}`}
                    className="btn-primary w-full text-center block"
                  >
                    Join Program
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending This Week */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center">
              <FireIcon className="w-5 h-5 text-orange-500 mr-2" />
              Trending
            </h2>
            <Link href="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              See All <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trendingNow.map((item) => (
              <div key={item.id} className="card group cursor-pointer overflow-hidden">
                <div className="relative h-24 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.participants} joined
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}