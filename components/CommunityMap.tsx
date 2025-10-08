'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { supabase, Profile } from '../lib/supabase'
import { geocodeLocation } from '../lib/geocoding'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Custom hook to create beautiful Leaflet icons
const useLeafletIcons = () => {
  const [icons, setIcons] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Beautiful user location icon
      const userIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="4"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
            <circle cx="16" cy="16" r="3" fill="#1E40AF"/>
          </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })

      // Beautiful community member icon
      const communityIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2C11.373 2 6 7.373 6 14c0 10.5 12 22 12 22s12-11.5 12-22c0-6.627-5.373-12-12-12z" fill="#DC2626" stroke="white" stroke-width="2"/>
            <circle cx="18" cy="14" r="6" fill="white"/>
            <path d="M18 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#DC2626"/>
          </svg>
        `),
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
      })

      setIcons({ userIcon, communityIcon })
    }
  }, [])

  return icons
}

// Helper function to create offset positions for markers at same location
const createOffsetPosition = (lat: number, lng: number, index: number, total: number): [number, number] => {
  if (total === 1) return [lat, lng]

  // Create a small circle of positions around the original point
  const radius = 0.001 // Very small offset in degrees
  const angle = (2 * Math.PI * index) / total
  const offsetLat = lat + radius * Math.cos(angle)
  const offsetLng = lng + radius * Math.sin(angle)

  return [offsetLat, offsetLng]
}

export default function CommunityMap() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [searchRadius, setSearchRadius] = useState(50)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationInput, setLocationInput] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const icons = useLeafletIcons()

  const fetchProfiles = useCallback(async () => {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.log('Supabase not configured, skipping profile fetch')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('consent_to_share', true)

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        console.log('Fetched profiles:', data?.length || 0)
        setProfiles(data || [])
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredProfiles = userLocation
    ? profiles.filter(profile => {
      if (!profile.latitude || !profile.longitude) return false
      const distance = calculateDistance(userLocation.lat, userLocation.lng, profile.latitude, profile.longitude)
      return distance <= searchRadius
    })
    : profiles.filter(profile => profile.latitude && profile.longitude)

  // Group profiles by location and create offset positions
  const profilesWithPositions = filteredProfiles.reduce((acc, profile) => {
    const key = `${profile.latitude},${profile.longitude}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(profile)
    return acc
  }, {} as Record<string, Profile[]>)

  // Create markers with offset positions for same locations
  const markersToRender = Object.values(profilesWithPositions).flatMap(profileGroup =>
    profileGroup.map((profile, index) => ({
      ...profile,
      position: createOffsetPosition(profile.latitude, profile.longitude, index, profileGroup.length)
    }))
  )

  console.log(`Rendering ${markersToRender.length} markers from ${filteredProfiles.length} profiles`)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Could not get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) {
      alert('Please enter a location')
      return
    }

    setLocationLoading(true)
    try {
      const coordinates = await geocodeLocation(locationInput)
      if (coordinates) {
        const newLocation = {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
        setUserLocation(newLocation)
      } else {
        alert('Could not find location. Please try a different address or city name.')
      }
    } catch (error) {
      console.error('Location search error:', error)
      alert('Error searching for location. Please try again.')
    } finally {
      setLocationLoading(false)
    }
  }

  const formatContact = (profile: Profile) => {
    switch (profile.contact_type) {
      case 'email':
        return `Email: ${profile.contact_value}`
      case 'phone':
        return `Phone: ${profile.contact_value}`
      case 'facebook':
        return `Facebook: ${profile.contact_value}`
      case 'other':
        return `${profile.contact_value}`
      default:
        return profile.contact_value
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading community members...</p>
        </div>
      </div>
    )
  }

  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [39.7684, -86.1581]
  const zoom = userLocation ? 10 : 7

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🗺️ Community Map
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover and connect with Nepali community members across Indiana. Set your location to find nearby members.
        </p>
      </div>

      {/* Controls Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-600">
        <div className="space-y-4">
          {/* Location Input Section */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-shrink-0">
              <button
                onClick={handleGetLocation}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 w-full lg:w-auto"
              >
                <span className="text-lg">📍</span>
                <span>Use My Location</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <div className="hidden lg:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">or</span>
              <div className="flex gap-3 flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter city or ZIP code..."
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="w-full border-2 border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
                <button
                  onClick={handleLocationSearch}
                  disabled={locationLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter and Info Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-blue-200 dark:border-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {userLocation && (
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">📏 Radius:</label>
                  <select
                    value={searchRadius}
                    onChange={(e) => {
                      const newRadius = Number(e.target.value)
                      setSearchRadius(newRadius)
                    }}
                    className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  >
                    <option value={10}>10 miles</option>
                    <option value={25}>25 miles</option>
                    <option value={50}>50 miles</option>
                    <option value={100}>100 miles</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
                <span className="text-lg">👥</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userLocation
                    ? `${filteredProfiles.length} members within ${searchRadius} miles`
                    : `${filteredProfiles.length} total members with locations`
                  }
                </span>
              </div>
            </div>

            {userLocation && (
              <button
                onClick={() => setUserLocation(null)}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline transition-colors duration-200 flex items-center gap-1"
              >
                <span>❌</span>
                <span>Clear Location</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[500px] sm:h-[600px] md:h-[700px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            boxZoom={true}
            keyboard={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {userLocation && icons && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.userIcon}>
                <Popup>
                  <div className="text-center p-2">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-bold text-lg text-blue-600">Your Location</h3>
                    <p className="text-sm text-gray-600 mt-1">You are here!</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Community member markers */}
            {icons && markersToRender.map((profile) => (
              <Marker
                key={`${profile.id}-${profile.position[0]}-${profile.position[1]}`}
                position={profile.position}
                icon={icons.communityIcon}
              >
                <Popup>
                  <div className="p-4 max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {profile.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 mb-1">{profile.full_name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="text-red-500">📍</span>
                          <span>{profile.city_or_zip}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                        <span className="text-green-600">📞</span>
                        <span className="font-medium">{formatContact(profile)}</span>
                      </div>
                    </div>

                    {profile.about_me && (
                      <div className="border-t pt-3">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 text-sm">💬</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">About:</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{profile.about_me}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {!userLocation && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-indigo-900/60 backdrop-blur-sm flex items-center justify-center z-10 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-2 border-blue-100 dark:border-slate-600 transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4 animate-bounce">🗺️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Discover Your Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Set your location to find and connect with Nepali community members near you in Indiana.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleGetLocation}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">📍</span>
                  <span>Use My Current Location</span>
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  <span>or use the search above</span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}