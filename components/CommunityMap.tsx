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
    return <div className="text-center py-8">Loading community members...</div>
  }

  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [39.7684, -86.1581]
  const zoom = userLocation ? 10 : 7

  return (
    <div>
      <div className="mb-4 sm:mb-6 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg shadow-md border dark:border-slate-700">
        <div className="space-y-3 sm:space-y-4">
          {/* Location Input Section */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleGetLocation}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto transition-colors"
            >
              📍 Use My Location
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">or</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter city or ZIP code"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                  className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-sm flex-1 sm:w-48 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={handleLocationSearch}
                  disabled={locationLoading}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap transition-colors"
                >
                  {locationLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Filter and Info Section */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
            {userLocation && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Radius:</label>
                <select
                  value={searchRadius}
                  onChange={(e) => {
                    const newRadius = Number(e.target.value)
                    setSearchRadius(newRadius)
                  }}
                  className="border border-gray-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                  <option value={100}>100 miles</option>
                </select>
              </div>
            )}

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
              {userLocation
                ? `Showing ${filteredProfiles.length} members within ${searchRadius} miles`
                : `${filteredProfiles.length} total members with locations`
              }
            </div>

            {userLocation && (
              <button
                onClick={() => setUserLocation(null)}
                className="text-sm text-red-600 hover:text-red-800 underline text-center sm:text-left"
              >
                Clear Location
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-md relative">
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
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Community member markers */}
            {markersToRender.map((profile) => (
              <Marker
                key={`${profile.id}-${profile.position[0]}-${profile.position[1]}`}
                position={profile.position}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-semibold text-lg mb-2">{profile.full_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">📍 {profile.city_or_zip}</p>
                    <p className="text-sm mb-2">📞 {formatContact(profile)}</p>
                    {profile.about_me && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>About:</strong> {profile.about_me}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {!userLocation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-sm sm:max-w-md w-full border dark:border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Find Nearby Community Members</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                Set your location to discover Nepali community members near you in Indiana.
              </p>
              <div className="space-y-2">
                <button
                  onClick={handleGetLocation}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base transition-colors"
                >
                  📍 Use My Current Location
                </button>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">or enter a city/ZIP code above</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}