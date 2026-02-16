import { useState, useEffect } from 'react';
import { geocodeQuery } from '../utils/geocoding';
import { getDistanceMiles } from '../utils/distance';
import { useDebouncedValue } from './useDebouncedValue';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface LocationWithDistance extends Location {
  distance: number;
}

export type SearchState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface UsePickupLocationSearchResult {
  filteredLocations: LocationWithDistance[];
  state: SearchState;
  errorMessage: string | null;
}

const MAX_DISTANCE_MILES = 5;

/**
 * Hook for searching pickup locations within a 5-mile radius
 * @param query - User's search query (ZIP, city, or address)
 * @param locations - Array of available pickup locations
 * @param debounceMs - Debounce delay in milliseconds (default: 600)
 */
export function usePickupLocationSearch(
  query: string,
  locations: Location[],
  debounceMs: number = 600
): UsePickupLocationSearchResult {
  const [filteredLocations, setFilteredLocations] = useState<LocationWithDistance[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debounce the search query
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  useEffect(() => {
    // Reset state if query is empty
    if (!debouncedQuery || debouncedQuery.trim().length < 3) {
      setState('idle');
      setFilteredLocations([]);
      setErrorMessage(null);
      return;
    }

    // Start searching
    setState('loading');
    setErrorMessage(null);

    // Geocode the user's query
    geocodeQuery(debouncedQuery)
      .then((result) => {
        if (!result) {
          setState('error');
          setErrorMessage('Unable to find location. Please try a different search term.');
          setFilteredLocations([]);
          return;
        }

        const { lat: userLat, lng: userLng } = result;

        // Calculate distances and filter by MAX_DISTANCE_MILES
        const locationsWithDistance: LocationWithDistance[] = locations
          .map((location) => ({
            ...location,
            distance: getDistanceMiles(userLat, userLng, location.lat, location.lng),
          }))
          .filter((location) => location.distance <= MAX_DISTANCE_MILES)
          .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)

        if (locationsWithDistance.length === 0) {
          setState('empty');
          setFilteredLocations([]);
        } else {
          setState('success');
          setFilteredLocations(locationsWithDistance);
        }
      })
      .catch((error) => {
        console.error('Location search error:', error);
        setState('error');
        setErrorMessage('An error occurred while searching. Please try again.');
        setFilteredLocations([]);
      });
  }, [debouncedQuery, locations]);

  return {
    filteredLocations,
    state,
    errorMessage,
  };
}
