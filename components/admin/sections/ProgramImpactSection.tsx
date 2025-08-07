'use client'

import { ChartBarIcon } from '@heroicons/react/24/outline'

interface ProgramImpactSectionProps {
  stats: {
    totalGraduates: number
    averageStressReduction: string
    practiceRetention: string
    recommendationRate: string
    countriesRepresented: number
  }
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function ProgramImpactSection({ stats, updateFormData, errors }: ProgramImpactSectionProps) {
  const updateStats = (field: string, value: any) => {
    updateFormData({
      stats: {
        ...stats,
        [field]: value
      }
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <ChartBarIcon className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Program Impact</h4>
          <p className="text-sm text-gray-600">Statistics and success metrics</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Graduates
          </label>
          <input
            type="number"
            value={stats.totalGraduates}
            onChange={(e) => updateStats('totalGraduates', parseInt(e.target.value) || 0)}
            placeholder="e.g., 1500"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Countries Represented
          </label>
          <input
            type="number"
            value={stats.countriesRepresented}
            onChange={(e) => updateStats('countriesRepresented', parseInt(e.target.value) || 0)}
            placeholder="e.g., 45"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average Stress Reduction
          </label>
          <input
            type="text"
            value={stats.averageStressReduction}
            onChange={(e) => updateStats('averageStressReduction', e.target.value)}
            placeholder="e.g., 65%"
            className="input-modern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Practice Retention Rate
          </label>
          <input
            type="text"
            value={stats.practiceRetention}
            onChange={(e) => updateStats('practiceRetention', e.target.value)}
            placeholder="e.g., 85%"
            className="input-modern"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recommendation Rate
          </label>
          <input
            type="text"
            value={stats.recommendationRate}
            onChange={(e) => updateStats('recommendationRate', e.target.value)}
            placeholder="e.g., 95%"
            className="input-modern"
          />
        </div>
      </div>
      
      {errors.stats && (
        <p className="text-red-600 text-sm mt-4">{errors.stats}</p>
      )}
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Fill in at least one statistic to showcase your program's impact. 
          Leave empty fields blank if you don't have specific data.
        </p>
      </div>
    </div>
  )
}