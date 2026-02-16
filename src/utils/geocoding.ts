/**
 * Geocode a user's search query (address, ZIP, or city) to lat/lng coordinates
 * Using OpenStreetMap Nominatim API (free, no API key required)
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeQuery(
  query: string
): Promise<GeocodeResult | null> {
  if (!query || query.trim().length < 3) {
    return null;
  }

  try {
    // Append "New Jersey" to improve accuracy for local searches
    const searchQuery = `${query.trim()}, New Jersey, USA`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          format: 'json',
          q: searchQuery,
          limit: '1',
          // Required by Nominatim usage policy
          'accept-language': 'en',
        }),
      {
        headers: {
          // User-Agent required by Nominatim
          'User-Agent': 'PassariellosPizzeriaApp/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
