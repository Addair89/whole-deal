// utils/geocodingService.js
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Simple cache implementation
const geocodeCache = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeAddress(street, city, state) {
  try {
    // Create cache key from address components
    const cacheKey = `${street}|${city}|${state}`.toLowerCase();

    // Check cache first
    const cachedResult = geocodeCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.coordinates;
    }

    // Format the address for the API
    const address = `${street}, ${city}, ${state}`;

    // Add delay to respect rate limits (1 request per second is safe)
    await delay(1000);

    const response = await fetch(
      `${NOMINATIM_ENDPOINT}?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("No results found for address");
    }

    const coordinates = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };

    // Cache the result
    geocodeCache.set(cacheKey, {
      coordinates,
      timestamp: Date.now(),
    });

    return coordinates;
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

export default { geocodeAddress };
