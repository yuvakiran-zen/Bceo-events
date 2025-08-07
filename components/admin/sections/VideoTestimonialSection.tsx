'use client'

import { PlayCircleIcon } from '@heroicons/react/24/outline'

interface VideoTestimonialSectionProps {
  videoTestimonial: {
    title: string
    description: string
    videoUrl: string
    videoPoster: string
    duration: string
  }
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function VideoTestimonialSection({ videoTestimonial, updateFormData, errors }: VideoTestimonialSectionProps) {
  const updateVideoTestimonial = (field: string, value: string) => {
    updateFormData({
      videoTestimonial: {
        ...videoTestimonial,
        [field]: value
      }
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <PlayCircleIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Video Testimonial</h4>
          <p className="text-sm text-gray-600">Featured video testimonial from a participant</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Title *
          </label>
          <input
            type="text"
            value={videoTestimonial.title}
            onChange={(e) => updateVideoTestimonial('title', e.target.value)}
            placeholder="e.g., Sarah's Transformation Story"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Description *
          </label>
          <textarea
            value={videoTestimonial.description}
            onChange={(e) => updateVideoTestimonial('description', e.target.value)}
            placeholder="Brief description of the testimonial content"
            rows={3}
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL *
          </label>
          <input
            type="url"
            value={videoTestimonial.videoUrl}
            onChange={(e) => updateVideoTestimonial('videoUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            className="input-modern"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Poster Image
            </label>
            <input
              type="url"
              value={videoTestimonial.videoPoster}
              onChange={(e) => updateVideoTestimonial('videoPoster', e.target.value)}
              placeholder="https://example.com/poster.jpg"
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={videoTestimonial.duration}
              onChange={(e) => updateVideoTestimonial('duration', e.target.value)}
              placeholder="e.g., 2:30"
              className="input-modern"
            />
          </div>
        </div>
        
        {errors.videoTestimonial && (
          <p className="text-red-600 text-sm">{errors.videoTestimonial}</p>
        )}
      </div>
    </div>
  )
}