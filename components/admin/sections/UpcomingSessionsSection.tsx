'use client'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'

interface UpcomingSessionsSectionProps {
  upcomingSession: {
    date: string
    time: string
    title: string
    description: string
    registrationUrl: string
  }
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function UpcomingSessionsSection({ upcomingSession, updateFormData, errors }: UpcomingSessionsSectionProps) {
  const updateUpcomingSession = (field: string, value: string) => {
    updateFormData({
      upcomingSession: {
        ...upcomingSession,
        [field]: value
      }
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-teal-100 rounded-lg">
          <CalendarDaysIcon className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h4>
          <p className="text-sm text-gray-600">Free preview sessions or webinars</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Date
            </label>
            <input
              type="date"
              value={upcomingSession.date}
              onChange={(e) => updateUpcomingSession('date', e.target.value)}
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Time
            </label>
            <input
              type="time"
              value={upcomingSession.time}
              onChange={(e) => updateUpcomingSession('time', e.target.value)}
              className="input-modern"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Title
          </label>
          <input
            type="text"
            value={upcomingSession.title}
            onChange={(e) => updateUpcomingSession('title', e.target.value)}
            placeholder="e.g., Free Introduction to Mindful Leadership"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Description
          </label>
          <textarea
            value={upcomingSession.description}
            onChange={(e) => updateUpcomingSession('description', e.target.value)}
            placeholder="Brief description of what participants will experience in this session..."
            rows={3}
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration URL
          </label>
          <input
            type="url"
            value={upcomingSession.registrationUrl}
            onChange={(e) => updateUpcomingSession('registrationUrl', e.target.value)}
            placeholder="https://example.com/register"
            className="input-modern"
          />
        </div>
        
        {errors.upcomingSession && (
          <p className="text-red-600 text-sm">{errors.upcomingSession}</p>
        )}
      </div>
    </div>
  )
}