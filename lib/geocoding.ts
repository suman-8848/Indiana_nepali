// Generate deterministic pseudorandom offset based on user ID
function generateDeterministicOffset(userId: string, baseLat: number, baseLng: number) {
  // Create a simple hash from userId for deterministic randomness
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use hash to generate consistent offset within ~500m radius
  const seed = Math.abs(hash)
  const angle = (seed % 360) * (Math.PI / 180) // Random angle
  const distance = ((seed % 1000) / 1000) * 0.005 // Random distance up to ~500m
  
  // Calculate offset in lat/lng
  const latOffset = Math.cos(angle) * distance
  const lngOffset = Math.sin(angle) * distance
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  }
}

export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using Nominatim (OpenStreetMap's geocoding service) - free and no API key required
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Indiana, USA')}&limit=1&addressdetails=1`
    )
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      
      // Round to 3 decimal places for privacy (~100m resolution)
      return {
        lat: Math.round(lat * 1000) / 1000,
        lng: Math.round(lng * 1000) / 1000
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export async function geocodeLocationWithOffset(location: string, userId: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const baseCoords = await geocodeLocation(location)
    if (!baseCoords) return null
    
    // Apply deterministic offset based on user ID
    const offsetCoords = generateDeterministicOffset(userId, baseCoords.lat, baseCoords.lng)
    
    // Round to 4 decimal places for final storage (~10m resolution)
    return {
      lat: Math.round(offsetCoords.lat * 10000) / 10000,
      lng: Math.round(offsetCoords.lng * 10000) / 10000
    }
  } catch (error) {
    console.error('Geocoding with offset error:', error)
    return null
  }
}