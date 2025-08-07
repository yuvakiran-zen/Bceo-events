'use client'

import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline'

interface KeyBenefitsSectionProps {
  keyBenefits: string[]
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function KeyBenefitsSection({ keyBenefits, updateFormData, errors }: KeyBenefitsSectionProps) {
  const addKeyBenefit = () => {
    const newBenefits = [...keyBenefits, '']
    updateFormData({ keyBenefits: newBenefits })
  }

  const updateKeyBenefit = (index: number, value: string) => {
    const newBenefits = [...keyBenefits]
    newBenefits[index] = value
    updateFormData({ keyBenefits: newBenefits })
  }

  const removeKeyBenefit = (index: number) => {
    const newBenefits = keyBenefits.filter((_: any, i: number) => i !== index)
    updateFormData({ keyBenefits: newBenefits })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CheckIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Key Benefits</h4>
          <p className="text-sm text-gray-600">What will participants achieve from this event?</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-4">
        {keyBenefits.map((benefit: string, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateKeyBenefit(index, e.target.value)}
                placeholder={`Benefit ${index + 1} (e.g., Develop emotional intelligence)`}
                className="input-modern"
              />
            </div>
            <button
              onClick={() => removeKeyBenefit(index)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <button
          onClick={addKeyBenefit}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Another Benefit</span>
        </button>
        
        {errors.keyBenefits && (
          <p className="text-red-600 text-sm">{errors.keyBenefits}</p>
        )}
      </div>
    </div>
  )
}