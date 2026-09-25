// Minimal TTL Cache implementation
const cache: Record<string, { value: any; expiry: number }> = {};
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function fetchLiveWeatherData(district: string) {
  if (!district || district === 'All') return null;

  // Simple in-memory cache check
  if (cache[district] && cache[district].expiry > Date.now()) {
    return cache[district].value;
  }

  try {
    // Open-Meteo is a completely open, unauthenticated API (no API keys required).
    // We use a geocoding endpoint to get coordinates for the district first.
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    
    if (!geoRes.ok) throw new Error('Geocoding API failed');
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    const { latitude, longitude } = geoData.results[0];

    // Fetch current weather using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) throw new Error('Weather API failed');
    const weatherData = await weatherRes.json();
    
    const result = weatherData.current;
    
    // Save to cache
    cache[district] = {
      value: result,
      expiry: Date.now() + CACHE_TTL_MS
    };

    return result;
  } catch (error) {
    console.error('Error fetching live weather data:', error);
    // Graceful fallback (null) so UI handles it without crashing
    return null;
  }
}
