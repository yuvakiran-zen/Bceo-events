'use client'

import { PlusIcon, TrashIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

interface FAQSectionProps {
  faq: any[]
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function FAQSection({ faq, updateFormData, errors }: FAQSectionProps) {
  const addFAQ = () => {
    const newFAQ = {
      question: '',
      answer: ''
    }
    updateFormData({ faq: [...faq, newFAQ] })
  }

  const updateFAQ = (index: number, field: string, value: string) => {
    const newFAQs = [...faq]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    updateFormData({ faq: newFAQs })
  }

  const removeFAQ = (index: number) => {
    const newFAQs = faq.filter((_: any, i: number) => i !== index)
    updateFormData({ faq: newFAQs })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <QuestionMarkCircleIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h4>
          <p className="text-sm text-gray-600">Common questions and answers about your event</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-4">
        {faq.map((faqItem: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">FAQ {index + 1}</h5>
              <button
                onClick={() => removeFAQ(index)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  value={faqItem.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  placeholder="e.g., What is included in the program?"
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer *
                </label>
                <textarea
                  value={faqItem.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  placeholder="Detailed answer to the question..."
                  rows={3}
                  className="input-modern"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addFAQ}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Another FAQ</span>
        </button>
        
        {errors.faq && (
          <p className="text-red-600 text-sm">{errors.faq}</p>
        )}
      </div>
    </div>
  )
}