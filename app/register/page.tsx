'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { geocodeLocation } from '../../lib/geocoding'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    cityOrZip: '',
    contactType: 'email' as 'facebook' | 'phone' | 'email' | 'other',
    contactValue: '',
    aboutMe: '',
    consentToShare: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setMessage('Database not configured. Please contact the administrator.')
      setLoading(false)
      return
    }

    try {
      // Geocode the location
      const coordinates = await geocodeLocation(formData.cityOrZip)
      if (!coordinates) {
        setMessage('Could not find location. Please check your city or ZIP code.')
        setLoading(false)
        return
      }

      // Insert profile data
      const { error } = await supabase
        .from('profiles')
        .insert({
          full_name: formData.fullName,
          city_or_zip: formData.cityOrZip,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          contact_type: formData.contactType,
          contact_value: formData.contactValue,
          about_me: formData.aboutMe || null,
          consent_to_share: formData.consentToShare
        })

      if (error) {
        setMessage('Error registering. Please try again.')
        console.error('Registration error:', error)
      } else {
        setMessage('Registration successful! You can now be found by other community members.')
        setFormData({
          fullName: '',
          cityOrZip: '',
          contactType: 'email',
          contactValue: '',
          aboutMe: '',
          consentToShare: false
        })
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      console.error('Registration error:', error)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Join Our Community</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md space-y-4 sm:space-y-6 border dark:border-slate-700">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City or ZIP Code (Indiana) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Indianapolis or 46240"
            value={formData.cityOrZip}
            onChange={(e) => setFormData({ ...formData, cityOrZip: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Method *
          </label>
          <select
            value={formData.contactType}
            onChange={(e) => setFormData({ ...formData, contactType: e.target.value as any })}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="email">Email</option>
            <option value="phone">Phone Number</option>
            <option value="facebook">Facebook Profile</option>
            <option value="other">Other (specify below)</option>
          </select>

          <input
            type={formData.contactType === 'email' ? 'email' : 'text'}
            required
            placeholder={
              formData.contactType === 'email' ? 'your@email.com' :
                formData.contactType === 'phone' ? '(555) 123-4567' :
                  formData.contactType === 'facebook' ? 'https://facebook.com/yourprofile' :
                    'e.g., WhatsApp: +1-555-123-4567, Instagram: @username, etc.'
            }
            value={formData.contactValue}
            onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {formData.contactType === 'other' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Please specify the contact method and details (e.g., "WhatsApp: +1-555-123-4567",
              "Instagram: @username", "LinkedIn: linkedin.com/in/yourname", etc.)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            About Me (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Tell others about yourself, your interests, or how you can help newcomers..."
            value={formData.aboutMe}
            onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            required
            checked={formData.consentToShare}
            onChange={(e) => setFormData({ ...formData, consentToShare: e.target.checked })}
            className="mt-1 accent-blue-600"
          />
          <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-300">
            I consent to sharing my approximate location and contact information publicly on this platform
            to help connect with other Nepali community members in Indiana. *
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${message.includes('successful')
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}