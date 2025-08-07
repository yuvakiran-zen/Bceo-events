'use client'

import { useState } from 'react'
import { 
  SparklesIcon, 
  PhotoIcon, 
  ChatBubbleLeftRightIcon, 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface AIEnhancementStepProps {
  formData: {
    aiEnhancement: {
      enhanceDescriptions: boolean
      generateImages: boolean
      createTestimonials: boolean
      optimizeSEO: boolean
      generateFAQs: boolean
    }
  }
  updateFormData: (updates: any) => void
}

const AI_ENHANCEMENT_OPTIONS = [
  {
    key: 'enhanceDescriptions',
    title: 'Enhance Descriptions',
    description: 'AI will improve and expand your event descriptions to be more engaging and professional',
    icon: DocumentTextIcon,
    color: 'blue',
    benefits: [
      'Professional tone and language',
      'Compelling call-to-action phrases',
      'Better structure and flow',
      'Industry-specific terminology'
    ]
  },
  {
    key: 'generateImages',
    title: 'Generate Images',
    description: 'Create professional hero images and section graphics using AI image generation',
    icon: PhotoIcon,
    color: 'purple',
    benefits: [
      'Custom hero images',
      'Section-specific graphics',
      'Brand-consistent visuals',
      'High-quality professional look'
    ]
  },
  {
    key: 'createTestimonials',
    title: 'Create Sample Testimonials',
    description: 'Generate realistic testimonials based on your event type and benefits',
    icon: ChatBubbleLeftRightIcon,
    color: 'green',
    benefits: [
      'Realistic participant feedback',
      'Diverse testimonial styles',
      'Credible author profiles',
      'Industry-appropriate language'
    ]
  },
  {
    key: 'optimizeSEO',
    title: 'SEO Optimization',
    description: 'Optimize your content for search engines to improve discoverability',
    icon: MagnifyingGlassIcon,
    color: 'orange',
    benefits: [
      'Keyword optimization',
      'Meta descriptions',
      'Search-friendly titles',
      'Better online visibility'
    ]
  },
  {
    key: 'generateFAQs',
    title: 'Generate FAQs',
    description: 'Create comprehensive frequently asked questions based on your event details',
    icon: QuestionMarkCircleIcon,
    color: 'teal',
    benefits: [
      'Common participant questions',
      'Detailed helpful answers',
      'Reduced support inquiries',
      'Better user experience'
    ]
  }
]

const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    text: 'text-purple-700',
    button: 'bg-purple-500 hover:bg-purple-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    text: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-100 text-orange-600',
    text: 'text-orange-700',
    button: 'bg-orange-500 hover:bg-orange-600'
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'bg-teal-100 text-teal-600',
    text: 'text-teal-700',
    button: 'bg-teal-500 hover:bg-teal-600'
  }
}

export default function AIEnhancementStep({ formData, updateFormData }: AIEnhancementStepProps) {
  const [selectedOptions, setSelectedOptions] = useState(formData.aiEnhancement)

  const toggleOption = (optionKey: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionKey]: !selectedOptions[optionKey as keyof typeof selectedOptions]
    }
    setSelectedOptions(newOptions)
    updateFormData({ aiEnhancement: newOptions })
  }

  const selectAll = () => {
    const allSelected = {
      enhanceDescriptions: true,
      generateImages: true,
      createTestimonials: true,
      optimizeSEO: true,
      generateFAQs: true
    }
    setSelectedOptions(allSelected)
    updateFormData({ aiEnhancement: allSelected })
  }

  const deselectAll = () => {
    const allDeselected = {
      enhanceDescriptions: false,
      generateImages: false,
      createTestimonials: false,
      optimizeSEO: false,
      generateFAQs: false
    }
    setSelectedOptions(allDeselected)
    updateFormData({ aiEnhancement: allDeselected })
  }

  const selectedCount = Object.values(selectedOptions).filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          AI Enhancement Options
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like AI to enhance your event. These improvements will be applied 
          automatically after you create your event.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} of {AI_ENHANCEMENT_OPTIONS.length} options selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={deselectAll}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Enhancement Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AI_ENHANCEMENT_OPTIONS.map((option) => {
          const Icon = option.icon
          const colors = COLOR_CLASSES[option.color as keyof typeof COLOR_CLASSES]
          const isSelected = selectedOptions[option.key as keyof typeof selectedOptions]
          
          return (
            <div
              key={option.key}
              className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${colors.border} ${colors.bg}`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => toggleOption(option.key)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 ${colors.button} rounded-full flex items-center justify-center`}>
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${colors.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Benefits:</h5>
                  <ul className="space-y-1">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.button}`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">How AI Enhancement Works</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                After you create your event, our AI will process your content in the background. 
                You'll receive an email notification when the enhancements are complete.
              </p>
              <p>
                <strong>Processing time:</strong> Usually 2-5 minutes depending on selected options.
              </p>
              <p>
                <strong>Review process:</strong> You can review and approve all AI-generated content before it goes live.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {selectedCount === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <SparklesIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Recommendation</h4>
              <p className="text-sm text-yellow-700">
                We recommend selecting at least "Enhance Descriptions" and "SEO Optimization" 
                to make your event more professional and discoverable.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}