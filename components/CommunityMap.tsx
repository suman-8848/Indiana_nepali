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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-emerald-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 p-12 rounded-3xl shadow-2xl text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full blur-xl opacity-50"></div>
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-violet-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                  🗺️
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Loading Community
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">Discovering amazing people near you...</p>
          </div>
        </div>
      </div>
    )
  }

  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [39.7684, -86.1581]
  const zoom = userLocation ? 10 : 7

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 space-y-8">
      {/* Floating Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-emerald-600/20 blur-3xl"></div>
        <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🗺️
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Community Map
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover and connect with <span className="font-semibold text-violet-600 dark:text-violet-400">Nepali community members</span> across Indiana.
            Set your location to find nearby members and build meaningful connections.
          </p>
        </div>
      </div>

      {/* Glassmorphism Controls Panel */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-emerald-500/30 blur-2xl"></div>
        <div className="relative backdrop-blur-2xl bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Location Input Section */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-shrink-0">
                <button
                  onClick={handleGetLocation}
                  className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 w-full lg:w-auto touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg sm:text-xl">📍</span>
                    </div>
                    <span className="text-sm sm:text-base">Use My Location</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="hidden lg:block w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    OR
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300"></div>
                    <input
                      type="text"
                      placeholder="Enter city or ZIP code..."
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                      className="relative w-full backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-medium text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 shadow-xl touch-manipulation"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl opacity-60">
                      🔍
                    </div>
                  </div>
                  <button
                    onClick={handleLocationSearch}
                    disabled={locationLoading}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 sm:gap-3 touch-manipulation"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2">
                      {locationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                          <span className="text-sm sm:text-base">Searching...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xs sm:text-sm">🎯</span>
                          </div>
                          <span className="text-sm sm:text-base">Search</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6 border-t border-white/20 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-4">
                {userLocation && (
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold">
                        📏
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="font-bold text-gray-800 dark:text-white">Radius:</label>
                        <select
                          value={searchRadius}
                          onChange={(e) => {
                            const newRadius = Number(e.target.value)
                            setSearchRadius(newRadius)
                          }}
                          className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-xl px-4 py-2 font-semibold text-gray-900 dark:text-white focus:border-orange-400/50 focus:ring-4 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 shadow-lg"
                        >
                          <option value={10}>10 miles</option>
                          <option value={25}>25 miles</option>
                          <option value={50}>50 miles</option>
                          <option value={100}>100 miles</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      👥
                    </div>
                    <div className="font-bold text-gray-800 dark:text-white">
                      <span className="text-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        {filteredProfiles.length}
                      </span>
                      <span className="ml-2">
                        {userLocation
                          ? `members within ${searchRadius} miles`
                          : 'total members with locations'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {userLocation && (
                <button
                  onClick={() => setUserLocation(null)}
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm">❌</span>
                    </div>
                    <span>Clear Location</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Map Container */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-emerald-500/40 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
        <div className="relative h-[600px] sm:h-[700px] md:h-[800px] w-full rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 dark:bg-black/10 border-2 border-white/20 dark:border-white/10">
          <style jsx global>{`
            .leaflet-container {
              touch-action: pan-x pan-y;
            }
            .leaflet-control-zoom {
              border: none !important;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
              border-radius: 12px !important;
              overflow: hidden;
            }
            .leaflet-control-zoom a {
              background: rgba(255,255,255,0.9) !important;
              backdrop-filter: blur(10px) !important;
              border: none !important;
              color: #374151 !important;
              font-size: 18px !important;
              font-weight: bold !important;
              width: 40px !important;
              height: 40px !important;
              line-height: 40px !important;
              transition: all 0.2s ease !important;
            }
            .leaflet-control-zoom a:hover {
              background: rgba(139, 92, 246, 0.9) !important;
              color: white !important;
              transform: scale(1.05);
            }
            .leaflet-popup-content-wrapper {
              background: transparent !important;
              border-radius: 16px !important;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
              padding: 0 !important;
              overflow: hidden;
            }
            .leaflet-popup-content {
              margin: 0 !important;
              padding: 0 !important;
              width: auto !important;
            }
            .leaflet-popup-close-button {
              background: rgba(239, 68, 68, 0.9) !important;
              color: white !important;
              border-radius: 50% !important;
              width: 32px !important;
              height: 32px !important;
              line-height: 30px !important;
              text-align: center !important;
              font-size: 16px !important;
              font-weight: bold !important;
              right: 8px !important;
              top: 8px !important;
              border: 2px solid white !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
              transition: all 0.2s ease !important;
            }
            .leaflet-popup-close-button:hover {
              background: rgba(220, 38, 38, 0.9) !important;
              transform: scale(1.1);
            }
            .leaflet-popup-tip {
              background: white !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }
            @media (max-width: 768px) {
              .leaflet-control-zoom {
                margin-right: 10px !important;
                margin-top: 10px !important;
              }
              .leaflet-popup-content-wrapper {
                max-width: 280px !important;
              }
            }
          `}</style>
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
              zoomControl={true}
              attributionControl={false}
              preferCanvas={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={18}
                minZoom={6}
                tileSize={256}
                zoomOffset={0}
                detectRetina={true}
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
                  eventHandlers={{
                    click: () => {
                      // Ensure popup opens on mobile tap
                    }
                  }}
                >
                  <Popup
                    closeButton={true}
                    autoClose={false}
                    closeOnEscapeKey={true}
                    closeOnClick={false}
                    maxWidth={320}
                    minWidth={280}
                    className="custom-popup"
                  >
                    <div className="p-0 max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
                      {/* Header with gradient background */}
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/30">
                            {profile.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1 text-white">{profile.full_name}</h3>
                            <div className="flex items-center gap-2 text-white/90">
                              <span className="text-lg">📍</span>
                              <span className="font-medium">{profile.city_or_zip}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-4">
                        {/* Contact Info */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                              <span className="text-lg">📞</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Contact</p>
                              <p className="text-sm text-gray-800 font-medium">{formatContact(profile)}</p>
                            </div>
                          </div>
                        </div>

                        {/* About Section */}
                        {profile.about_me && (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 mt-0.5">
                                <span className="text-lg">💬</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-700 mb-2">About</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{profile.about_me}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              // Handle contact action based on contact type
                              const contactValue = profile.contact_value;
                              if (profile.contact_type === 'email') {
                                window.open(`mailto:${contactValue}`, '_blank');
                              } else if (profile.contact_type === 'phone') {
                                window.open(`tel:${contactValue}`, '_blank');
                              } else if (profile.contact_type === 'facebook') {
                                window.open(contactValue.startsWith('http') ? contactValue : `https://facebook.com/${contactValue}`, '_blank');
                              }
                            }}
                            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <span className="text-lg">
                              {profile.contact_type === 'email' ? '✉️' :
                                profile.contact_type === 'phone' ? '📞' :
                                  profile.contact_type === 'facebook' ? '👥' : '💬'}
                            </span>
                            <span>
                              {profile.contact_type === 'email' ? 'Send Email' :
                                profile.contact_type === 'phone' ? 'Call Now' :
                                  profile.contact_type === 'facebook' ? 'View Profile' : 'Contact'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {!userLocation && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-900/60 to-indigo-900/80 backdrop-blur-2xl flex items-center justify-center z-10 p-6">
              <div className="relative group max-w-lg w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/50 via-cyan-500/50 to-emerald-500/50 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative backdrop-blur-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 p-10 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all duration-500">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative text-8xl animate-bounce">🗺️</div>
                  </div>
                  <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Discover Your Community
                  </h3>
                  <p className="text-xl text-white/80 mb-8 leading-relaxed">
                    Set your location to find and connect with <span className="font-bold text-cyan-300">Nepali community members</span> near you in Indiana.
                  </p>
                  <div className="space-y-6">
                    <button
                      onClick={handleGetLocation}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-violet-500/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-2xl">📍</span>
                        </div>
                        <span>Use My Current Location</span>
                      </div>
                    </button>
                    <div className="flex items-center gap-4 text-white/60">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      <span className="font-medium">or use the search above</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}