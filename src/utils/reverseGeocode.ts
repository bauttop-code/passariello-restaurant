interface ReverseGeocodeResult {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

interface NominatimAddress {
  road?: string;
  house_number?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/**
 * Convert latitude/longitude coordinates to a physical address using OpenStreetMap Nominatim API
 * @param lat Latitude
 * @param lng Longitude
 * @returns Parsed address components
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Passariellospizzeria/1.0', // Nominatim requires a User-Agent
      },
    });

    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status);
      return null;
    }

    const data: NominatimResponse = await response.json();

    if (!data.address) {
      console.error('No address data in response');
      return null;
    }

    const addr = data.address;

    // Construct street address
    const houseNumber = addr.house_number || '';
    const road = addr.road || '';
    const streetAddress = [houseNumber, road].filter(Boolean).join(' ').trim();

    // Get city (can be in different fields)
    const city = addr.city || addr.town || addr.village || '';

    // Get state
    const state = addr.state || '';

    // Get ZIP code
    const zipCode = addr.postcode || '';

    return {
      address: streetAddress,
      city,
      state,
      zipCode,
      fullAddress: data.display_name || '',
    };
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return null;
  }
}
