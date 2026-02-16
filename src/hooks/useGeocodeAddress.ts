import { useState, useEffect } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

interface GeocodedLocation {
  lat: number;
  lon: number;
  displayName: string;
}

interface UseGeocodeAddressResult {
  coords: GeocodedLocation | null;
  loading: boolean;
  error: string | null;
}

/**
 * Construye la query de búsqueda a partir de los campos del formulario
 */
function buildAddressQuery(address: string, zipCode: string, city?: string): string {
  const parts = [address.trim()];
  
  if (city && city.trim()) {
    parts.push(city.trim());
  } else {
    // Default to New Jersey si no hay ciudad
    parts.push('NJ');
  }
  
  if (zipCode.trim()) {
    parts.push(zipCode.trim());
  }
  
  parts.push('USA');
  
  return parts.join(', ');
}

/**
 * Hace geocoding usando la API de Nominatim (OpenStreetMap)
 */
async function geocodeAddress(query: string): Promise<GeocodedLocation | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        // Nominatim requiere un User-Agent identificable
        'User-Agent': 'PassariellosPizzeria/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      displayName: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Hook que hace geocoding de una dirección con debounce
 * @param address - Dirección de calle
 * @param zipCode - Código postal
 * @param city - Ciudad (opcional)
 * @returns Coordenadas, estado de loading y error
 */
export function useGeocodeAddress(
  address: string,
  zipCode: string,
  city?: string
): UseGeocodeAddressResult {
  const [coords, setCoords] = useState<GeocodedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Build query from inputs
  const query = buildAddressQuery(address, zipCode, city);
  
  // Debounce la query para evitar requests excesivos
  const debouncedQuery = useDebouncedValue(query, 600);
  
  useEffect(() => {
    // Reset si la query está vacía o muy corta
    if (!debouncedQuery || debouncedQuery.length < 10) {
      setCoords(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    // Hacer geocoding
    let cancelled = false;
    
    const performGeocode = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await geocodeAddress(debouncedQuery);
        
        if (!cancelled) {
          if (result) {
            setCoords(result);
            setError(null);
          } else {
            setCoords(null);
            setError('Address not found');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setCoords(null);
          setError(err instanceof Error ? err.message : 'Geocoding failed');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    performGeocode();
    
    // Cleanup para cancelar la request si el componente se desmonta o la query cambia
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);
  
  return { coords, loading, error };
}
