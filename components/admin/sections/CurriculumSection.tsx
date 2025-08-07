'use client'

import { PlusIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline'

interface CurriculumSectionProps {
  curriculum: any[]
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

export default function CurriculumSection({ curriculum, updateFormData, errors }: CurriculumSectionProps) {
  const addCurriculumWeek = () => {
    const newWeek = {
      week: curriculum.length + 1,
      title: '',
      description: '',
      lessons: []
    }
    updateFormData({ curriculum: [...curriculum, newWeek] })
  }

  const updateCurriculumWeek = (index: number, field: string, value: any) => {
    const newCurriculum = [...curriculum]
    newCurriculum[index] = { ...newCurriculum[index], [field]: value }
    updateFormData({ curriculum: newCurriculum })
  }

  const removeCurriculumWeek = (index: number) => {
    const newCurriculum = curriculum.filter((_: any, i: number) => i !== index)
    // Renumber weeks
    const renumberedCurriculum = newCurriculum.map((week: any, i: number) => ({
      ...week,
      week: i + 1
    }))
    updateFormData({ curriculum: renumberedCurriculum })
  }

  const addLesson = (weekIndex: number) => {
    const newCurriculum = [...curriculum]
    if (!newCurriculum[weekIndex].lessons) {
      newCurriculum[weekIndex].lessons = []
    }
    newCurriculum[weekIndex].lessons.push('')
    updateFormData({ curriculum: newCurriculum })
  }

  const updateLesson = (weekIndex: number, lessonIndex: number, value: string) => {
    const newCurriculum = [...curriculum]
    newCurriculum[weekIndex].lessons[lessonIndex] = value
    updateFormData({ curriculum: newCurriculum })
  }

  const removeLesson = (weekIndex: number, lessonIndex: number) => {
    const newCurriculum = [...curriculum]
    newCurriculum[weekIndex].lessons = newCurriculum[weekIndex].lessons.filter((_: any, i: number) => i !== lessonIndex)
    updateFormData({ curriculum: newCurriculum })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <BookOpenIcon className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Program Curriculum</h4>
          <p className="text-sm text-gray-600">Week-by-week breakdown of your program content</p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-auto">
          Required
        </span>
      </div>

      <div className="space-y-6">
        {curriculum.map((week: any, weekIndex: number) => (
          <div key={weekIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Week {week.week}</h5>
              <button
                onClick={() => removeCurriculumWeek(weekIndex)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Title *
                </label>
                <input
                  type="text"
                  value={week.title}
                  onChange={(e) => updateCurriculumWeek(weekIndex, 'title', e.target.value)}
                  placeholder="e.g., Foundation of Mindful Leadership"
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Description *
                </label>
                <textarea
                  value={week.description}
                  onChange={(e) => updateCurriculumWeek(weekIndex, 'description', e.target.value)}
                  placeholder="Brief description of what participants will learn this week"
                  rows={2}
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lessons *
                </label>
                <div className="space-y-2">
                  {week.lessons?.map((lesson: string, lessonIndex: number) => (
                    <div key={lessonIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={lesson}
                        onChange={(e) => updateLesson(weekIndex, lessonIndex, e.target.value)}
                        placeholder={`Lesson ${lessonIndex + 1} (e.g., Understanding emotional triggers)`}
                        className="input-modern flex-1"
                      />
                      <button
                        onClick={() => removeLesson(weekIndex, lessonIndex)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLesson(weekIndex)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <PlusIcon className="w-3 h-3" />
                    <span>Add Lesson</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addCurriculumWeek}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Another Week</span>
        </button>
        
        {errors.curriculum && (
          <p className="text-red-600 text-sm">{errors.curriculum}</p>
        )}
      </div>
    </div>
  )
}