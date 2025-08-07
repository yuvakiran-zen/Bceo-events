'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  SparklesIcon,
  TagIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useDraftEvents } from '@/hooks/useEvents'
import { Event } from '@/lib/api/events'

export default function DraftsPage() {
  const { drafts, loading, error, refetch, deleteDraft, publishDraft } = useDraftEvents()
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Toggle draft selection
  const toggleDraftSelection = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId)
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    )
  }

  // Select all drafts
  const selectAllDrafts = () => {
    if (selectedDrafts.length === drafts.length) {
      setSelectedDrafts([])
    } else {
      setSelectedDrafts(drafts.map(draft => draft._id))
    }
  }

  // Delete selected drafts
  const deleteSelectedDrafts = async () => {
    if (selectedDrafts.length === 0) return

    setIsDeleting(true)
    try {
      // Delete each selected draft
      for (const draftId of selectedDrafts) {
        await deleteDraft(draftId)
      }
      
      showNotification('success', `${selectedDrafts.length} draft(s) deleted successfully`)
      setSelectedDrafts([])
    } catch (error) {
      showNotification('error', 'Failed to delete some drafts')
    } finally {
      setIsDeleting(false)
    }
  }

  // Publish single draft
  const handlePublishDraft = async (draftId: string) => {
    setIsPublishing(draftId)
    try {
      await publishDraft(draftId)
      showNotification('success', 'Draft published successfully!')
    } catch (error) {
      showNotification('error', 'Failed to publish draft')
    } finally {
      setIsPublishing(null)
    }
  }

  // Delete single draft
  const handleDeleteDraft = async (draftId: string) => {
    try {
      await deleteDraft(draftId)
      showNotification('success', 'Draft deleted successfully')
    } catch (error) {
      showNotification('error', 'Failed to delete draft')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading drafts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Drafts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-lg shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && <CheckIcon className="w-5 h-5" />}
                {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Draft Events</h1>
                <p className="text-gray-600">Manage your unpublished events</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
              </span>
              <Link href="/admin/create" className="btn-primary">
                Create New Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {drafts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <DocumentDuplicateIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Draft Events
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any draft events yet. Create your first event to get started.
            </p>
            <Link href="/admin/create" className="btn-primary">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
            {/* Bulk actions */}
            {selectedDrafts.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedDrafts.length} draft{selectedDrafts.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedDrafts([])}
                      className="text-sm text-blue-700 hover:text-blue-900"
                    >
                      Clear selection
                    </button>
                    <button
                      onClick={deleteSelectedDrafts}
                      disabled={isDeleting}
                      className="btn-ghost text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Select all checkbox */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedDrafts.length === drafts.length && drafts.length > 0}
                  onChange={selectAllDrafts}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Select all drafts
                </label>
              </div>
              <div className="text-sm text-gray-500">
                Showing {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Drafts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map((draft) => (
                <DraftCard
                  key={draft._id}
                  draft={draft}
                  isSelected={selectedDrafts.includes(draft._id)}
                  onToggleSelect={() => toggleDraftSelection(draft._id)}
                  onPublish={() => handlePublishDraft(draft._id)}
                  onDelete={() => handleDeleteDraft(draft._id)}
                  isPublishing={isPublishing === draft._id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Draft Card Component
function DraftCard({ 
  draft, 
  isSelected, 
  onToggleSelect, 
  onPublish, 
  onDelete, 
  isPublishing 
}: {
  draft: Event
  isSelected: boolean
  onToggleSelect: () => void
  onPublish: () => void
  onDelete: () => void
  isPublishing: boolean
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                {draft.title || 'Untitled Event'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Last edited {getTimeAgo(draft.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          </div>
        </div>

        {/* Event Image */}
        <div className="relative h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {draft.heroImage ? (
            <Image
              src={draft.heroImage}
              alt={draft.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <SparklesIcon className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 ml-2">AI will generate</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          {draft.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {draft.shortDescription}
            </p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {draft.category && (
              <div className="flex items-center space-x-1">
                <TagIcon className="w-3 h-3" />
                <span>{draft.category}</span>
              </div>
            )}
            {draft.startDate && (
              <div className="flex items-center space-x-1">
                <CalendarDaysIcon className="w-3 h-3" />
                <span>{formatDate(draft.startDate)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {draft.location && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-3 h-3" />
                <span>{draft.location}</span>
              </div>
            )}
            {draft.price && (
              <div className="flex items-center space-x-1">
                <CurrencyDollarIcon className="w-3 h-3" />
                <span>{draft.price}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/create?draft=${draft._id}`}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <PencilIcon className="w-3 h-3" />
              <span>Edit</span>
            </Link>
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <TrashIcon className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="btn-primary text-xs px-3 py-1 disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                Publishing...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-3 h-3 mr-1" />
                Publish
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}