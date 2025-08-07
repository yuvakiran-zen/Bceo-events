'use client'

import { PlusIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'

interface FacilitatorSectionProps {
  facilitator: {
    name: string
    title: string
    bio: string
    image: string
    credentials: string[]
    experience: string
    studentsGuided: string
  }
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function FacilitatorSection({ facilitator, updateFormData, errors }: FacilitatorSectionProps) {
  const updateFacilitator = (field: string, value: string | string[]) => {
    updateFormData({
      facilitator: {
        ...facilitator,
        [field]: value
      }
    })
  }

  const addCredential = () => {
    const newCredentials = [...facilitator.credentials, '']
    updateFacilitator('credentials', newCredentials)
  }

  const updateCredential = (index: number, value: string) => {
    const newCredentials = [...facilitator.credentials]
    newCredentials[index] = value
    updateFacilitator('credentials', newCredentials)
  }

  const removeCredential = (index: number) => {
    const newCredentials = facilitator.credentials.filter((_: any, i: number) => i !== index)
    updateFacilitator('credentials', newCredentials)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <UserIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Your Guide (Facilitator)</h4>
          <p className="text-sm text-gray-600">Information about the program leader</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facilitator Name *
            </label>
            <input
              type="text"
              value={facilitator.name}
              onChange={(e) => updateFacilitator('name', e.target.value)}
              placeholder="e.g., Dr. Sarah Johnson"
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title/Position *
            </label>
            <input
              type="text"
              value={facilitator.title}
              onChange={(e) => updateFacilitator('title', e.target.value)}
              placeholder="e.g., Mindfulness Expert & Leadership Coach"
              className="input-modern"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio/Description *
          </label>
          <textarea
            value={facilitator.bio}
            onChange={(e) => updateFacilitator('bio', e.target.value)}
            placeholder="Brief bio highlighting expertise, experience, and qualifications..."
            rows={4}
            className="input-modern"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="text"
              value={facilitator.experience}
              onChange={(e) => updateFacilitator('experience', e.target.value)}
              placeholder="e.g., 15+ years"
              className="input-modern"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Students Guided
            </label>
            <input
              type="text"
              value={facilitator.studentsGuided}
              onChange={(e) => updateFacilitator('studentsGuided', e.target.value)}
              placeholder="e.g., 10,000+"
              className="input-modern"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image URL
          </label>
          <input
            type="url"
            value={facilitator.image}
            onChange={(e) => updateFacilitator('image', e.target.value)}
            placeholder="https://example.com/facilitator.jpg"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credentials & Certifications
          </label>
          <div className="space-y-2">
            {facilitator.credentials.map((credential: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => updateCredential(index, e.target.value)}
                  placeholder={`Credential ${index + 1} (e.g., Certified Mindfulness Teacher)`}
                  className="input-modern flex-1"
                />
                <button
                  onClick={() => removeCredential(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={addCredential}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Add Credential</span>
            </button>
          </div>
        </div>
        
        {errors.facilitator && (
          <p className="text-red-600 text-sm">{errors.facilitator}</p>
        )}
      </div>
    </div>
  )
}