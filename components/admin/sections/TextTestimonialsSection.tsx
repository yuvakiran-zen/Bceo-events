'use client'

import { PlusIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface TextTestimonialsSectionProps {
  textTestimonials: any[]
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function TextTestimonialsSection({ textTestimonials, updateFormData, errors }: TextTestimonialsSectionProps) {
  const addTextTestimonial = () => {
    const newTestimonial = {
      text: '',
      authorName: '',
      authorTitle: '',
      authorImage: '',
      rating: 5,
      location: ''
    }
    updateFormData({ textTestimonials: [...textTestimonials, newTestimonial] })
  }

  const updateTextTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...textTestimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    updateFormData({ textTestimonials: newTestimonials })
  }

  const removeTextTestimonial = (index: number) => {
    const newTestimonials = textTestimonials.filter((_: any, i: number) => i !== index)
    updateFormData({ textTestimonials: newTestimonials })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">What Participants Say</h4>
          <p className="text-sm text-gray-600">Written testimonials and reviews</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-6">
        {textTestimonials.map((testimonial: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Testimonial {index + 1}</h5>
              <button
                onClick={() => removeTextTestimonial(index)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Text *
                </label>
                <textarea
                  value={testimonial.text}
                  onChange={(e) => updateTextTestimonial(index, 'text', e.target.value)}
                  placeholder="The participant's testimonial text..."
                  rows={3}
                  className="input-modern"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    value={testimonial.authorName}
                    onChange={(e) => updateTextTestimonial(index, 'authorName', e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    className="input-modern"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author Title
                  </label>
                  <input
                    type="text"
                    value={testimonial.authorTitle}
                    onChange={(e) => updateTextTestimonial(index, 'authorTitle', e.target.value)}
                    placeholder="e.g., CEO, Tech Company"
                    className="input-modern"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <select
                    value={testimonial.rating}
                    onChange={(e) => updateTextTestimonial(index, 'rating', parseInt(e.target.value))}
                    className="input-modern"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={testimonial.location}
                    onChange={(e) => updateTextTestimonial(index, 'location', e.target.value)}
                    placeholder="e.g., New York, USA"
                    className="input-modern"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Image URL
                </label>
                <input
                  type="url"
                  value={testimonial.authorImage}
                  onChange={(e) => updateTextTestimonial(index, 'authorImage', e.target.value)}
                  placeholder="https://example.com/author.jpg"
                  className="input-modern"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addTextTestimonial}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Another Testimonial</span>
        </button>
        
        {errors.textTestimonials && (
          <p className="text-red-600 text-sm">{errors.textTestimonials}</p>
        )}
      </div>
    </div>
  )
}