/**
 * Fetch with timeout to prevent hanging
 * 
 * FIXED: Each request gets its own AbortController to avoid "signal is aborted without reason"
 */
async function fetchWithTimeout(url: string, timeout = 3000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Suppress abort errors - they're expected behavior for timeouts
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Method 1: BigDataCloud API (client-side, CORS-friendly)
 */
async function reverseGeocodeWithBigDataCloud(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResult | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    
    console.log('🌍 Trying BigDataCloud...');
    
    const response = await fetchWithTimeout(url, 3000);

    if (!response.ok) {
      console.warn('BigDataCloud returned:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data || !data.locality) {
      console.warn('BigDataCloud: incomplete data');
      return null;
    }

    const result = {
      address: data.locality || '',
      city: data.city || data.locality || '',
      state: (data.principalSubdivision || '').replace(' State', ''),
      zip: data.postcode || '',
      country: data.countryName || 'USA',
      formatted: `${data.locality}, ${data.principalSubdivision}`,
      source: 'BigDataCloud'
    };

    console.log('✅ BigDataCloud success');
    return result;

  } catch (error) {
    console.warn('BigDataCloud failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Method 2: OpenCage API (free tier, very reliable)
 * Note: Using free API key for demo - replace with your own for production
 */
async function reverseGeocodeWithOpenCage(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResult | null> {
  try {
    // Using a demo key - you should replace this with your own from opencagedata.com
    const apiKey = 'pk.0f147952a41c555c5b325aae26767703';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&no_annotations=1&language=en`;
    
    console.log('🌍 Trying OpenCage...');
    
    const response = await fetchWithTimeout(url, 3000);

    if (!response.ok) {
      console.warn('OpenCage returned:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn('OpenCage: no results');
      return null;
    }

    const components = data.results[0].components;
    const formatted = data.results[0].formatted;

    const result = {
      address: components.road || components.suburb || components.neighbourhood || '',
      city: components.city || components.town || components.village || '',
      state: components.state || '',
      zip: components.postcode || '',
      country: components.country || 'USA',
      formatted: formatted || '',
      source: 'OpenCage'
    };

    console.log('✅ OpenCage success');
    return result;

  } catch (error) {
    console.warn('OpenCage failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Method 3: Generate smart approximate address based on coordinates
 * More detailed than before - uses known store locations
 */
function generateApproximateAddress(
  lat: number,
  lng: number
): ReverseGeocodingResult {
  console.log('⚠️ Using approximate location based on coordinates');

  // Store locations for reference
  const stores = [
    { name: 'Haddonfield', lat: 39.89792706143064, lng: -75.03314038686908, city: 'Haddonfield', state: 'NJ', zip: '08033' },
    { name: 'Moorestown', lat: 39.96395827445834, lng: -74.94753350369767, city: 'Moorestown', state: 'NJ', zip: '08057' },
    { name: 'Voorhees', lat: 39.84678444777853, lng: -74.98846601755474, city: 'Voorhees', state: 'NJ', zip: '08043' },
  ];

  // Find nearest store to get approximate city
  let nearestStore = stores[0];
  let minDistance = Infinity;

  for (const store of stores) {
    const distance = Math.sqrt(
      Math.pow(lat - store.lat, 2) + Math.pow(lng - store.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = store;
    }
  }

  // If very close to a store (< 0.05 degrees ~3 miles), use that city
  let city = 'South Jersey area';
  let state = 'New Jersey';
  let zip = '';

  if (minDistance < 0.05) {
    city = nearestStore.city;
    state = 'NJ';
    // Don't pre-fill ZIP for approximate
  }
  // Philadelphia area
  else if (lat >= 39.9 && lat <= 40.0 && lng >= -75.3 && lng <= -75.0) {
    city = 'Philadelphia area';
    state = 'Pennsylvania';
  }
  // South Jersey general area
  else if (lat >= 39.7 && lat <= 40.1 && lng >= -75.2 && lng <= -74.7) {
    city = 'South Jersey area';
    state = 'New Jersey';
  }

  return {
    address: '',
    city,
    state,
    zip,
    country: 'USA',
    formatted: `${city}, ${state}`,
    source: 'Approximate'
  };
}

/**
 * MAIN FUNCTION: Reverse geocode with fast failover
 * 
 * Strategy:
 * - Try all services in parallel (fastest wins)
 * - If all fail within 5 seconds, use approximate
 * - Never hangs, always returns a result
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Address components (never null - uses fallback)
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResult> {
  console.log(`📍 Reverse geocoding: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);

  // Validate coordinates
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.error('❌ Invalid coordinates');
    return generateApproximateAddress(39.8914, -75.0368); // Default to Haddonfield area
  }

  // Validate coordinates are in reasonable range
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.error('❌ Coordinates out of range');
    return generateApproximateAddress(39.8914, -75.0368);
  }

  try {
    // Try services in parallel (race condition - first to succeed wins)
    const result = await Promise.race([
      reverseGeocodeWithBigDataCloud(lat, lng),
      reverseGeocodeWithOpenCage(lat, lng),
      // Timeout after 5 seconds
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
    ]);

    // If we got a result, return it
    if (result) {
      return result;
    }

    // All services failed or timed out
    console.warn('⏱️ All services timed out or failed, using approximate');
    return generateApproximateAddress(lat, lng);

  } catch (error) {
    console.error('❌ Unexpected error in reverse geocoding:', error);
    return generateApproximateAddress(lat, lng);
  }
}

/**
 * Format address for display
 */
export function formatAddress(result: ReverseGeocodingResult): string {
  const parts = [
    result.address,
    result.city,
    result.state,
    result.zip
  ].filter(Boolean);
  
  return parts.join(', ');
}