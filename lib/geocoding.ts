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
      
      // Round to 2 decimal places for privacy
      return {
        lat: Math.round(lat * 100) / 100,
        lng: Math.round(lng * 100) / 100
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}