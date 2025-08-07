'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { Event, apiService, RegistrationFormData } from '../../lib/api'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event
}

interface FormData {
  fullName: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  batch: string
  language: string
  receiveInfo: boolean
  agreeTerms: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  country?: string
  state?: string
  general?: string
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Austria', 'Belgium', 'Ireland',
  'New Zealand', 'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico', 'Argentina',
  'Chile', 'Colombia', 'Peru', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Other'
]

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Arabic', 'Other'
]

const batches = [
  { value: 'batch1', label: 'Batch 1' },
  { value: 'batch2', label: 'Batch 2' },
  { value: 'batch3', label: 'Batch 3' },
  { value: 'batch4', label: 'Batch 4' }
]

export default function RegistrationModal({ isOpen, onClose, event }: RegistrationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    batch: '',
    language: 'English',
    receiveInfo: true,
    agreeTerms: true
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        batch: '',
        language: 'English',
        receiveInfo: true,
        agreeTerms: true
      })
      setErrors({})
      setSubmitSuccess(false)
      setConfirmationCode('')
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!formData.agreeTerms) {
      setErrors({ general: 'Please agree to the terms and conditions to continue.' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Prepare registration data
      const registrationData: RegistrationFormData = {
        eventId: event._id,
        eventTitle: event.title,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        country: formData.country,
        state: formData.state.trim(),
        city: formData.city.trim() || undefined,
        batch: formData.batch || undefined,
        language: formData.language,
        receiveInfo: formData.receiveInfo,
        agreeTerms: formData.agreeTerms
      }
      
      // Submit registration
      const response = await apiService.createRegistration(registrationData)
      
      if (response.success) {
        setSubmitSuccess(true)
        setConfirmationCode(response.data.registration.confirmationCode)
        
        // Close modal after success message
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        // Handle API errors
        if (response.error?.includes('already registered')) {
          setErrors({ general: 'You are already registered for this event. Please check your email for confirmation details.' })
        } else {
          setErrors({ general: response.error || 'Registration failed. Please try again.' })
        }
      }
      
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ 
        general: error instanceof Error ? error.message : 'Registration failed. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  Register for {event.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below to secure your spot
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-green-50 border-b border-green-200"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Registration Successful!</h3>
                    <p className="text-sm text-green-700">
                      Thank you for registering. Your confirmation code is: <strong>{confirmationCode}</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You'll receive a confirmation email shortly with all the details.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-b border-red-200"
              >
                <div className="flex items-center space-x-3">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Personal Information
                </h3>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`input-modern w-full ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`input-modern w-full pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`input-modern w-full pl-10 ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Location Information
                </h3>
                
                {/* Country & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`input-modern w-full pl-10 ${errors.country ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select your country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BuildingOffice2Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`input-modern w-full pl-10 ${errors.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your state/province"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="input-modern w-full"
                    placeholder="Enter your city"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Program Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Program Preferences
                </h3>
                
                {/* Batch & Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Your Batch
                    </label>
                    <select
                      value={formData.batch}
                      onChange={(e) => handleInputChange('batch', e.target.value)}
                      className="input-modern w-full"
                      disabled={isSubmitting}
                    >
                      <option value="">Select a batch</option>
                      {batches.map(batch => (
                        <option key={batch.value} value={batch.value}>{batch.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="input-modern w-full"
                      disabled={isSubmitting}
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="receiveInfo"
                    checked={formData.receiveInfo}
                    onChange={(e) => handleInputChange('receiveInfo', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="receiveInfo" className="text-sm text-gray-700">
                    I'm interested in receiving information about future events, workshops, and other services that we offer
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-primary-600 hover:text-primary-700 underline">terms & conditions</a> <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="btn-ghost disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Registered!</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}