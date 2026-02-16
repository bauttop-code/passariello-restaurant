import { useState, useEffect, useRef } from 'react';
import { resolvePickupAndDelivery, type LocationResolution } from '../utils/resolvePickupAndDelivery';
import { type PickupStore } from '../utils/pickupEligibility';

interface UseAutoLocationResolutionResult {
  resolution: LocationResolution | null;
  loading: boolean;
  error: string | null;
}

/**
 * Helper: Calculate distance in miles between two coordinates (Haversine formula)
 */
function getDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Hook: Automatically resolve pickup and delivery when user coords are available
 * 
 * This hook:
 * 1. Waits for userCoords to be available
 * 2. GUARD: Checks if user is extremely far away (> 100 miles) and skips resolution
 * 3. Calls resolvePickupAndDelivery() automatically
 * 4. Returns resolution with loading state
 * 
 * @param userCoords - User coordinates from GPS/IP
 * @param stores - Array of store locations
 * @returns { resolution, loading, error }
 */
export function useAutoLocationResolution(
  userCoords: { lat: number; lng: number } | null,
  stores: PickupStore[]
): UseAutoLocationResolutionResult {
  const [resolution, setResolution] = useState<LocationResolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // CRITICAL: Track if we've already resolved for these coords
  const hasResolvedRef = useRef(false);
  const lastCoordsRef = useRef<string | null>(null);
  // Rate limiting: Track last resolution time
  const lastResolveTimeRef = useRef<number>(0);

  useEffect(() => {
    // Reset if no coords
    if (!userCoords) {
      setResolution(null);
      setLoading(false);
      setError(null);
      hasResolvedRef.current = false;
      lastCoordsRef.current = null;
      return;
    }

    // Create unique key for these coordinates
    const coordsKey = `${userCoords.lat.toFixed(4)},${userCoords.lng.toFixed(4)}`;
    
    // GUARD: Only resolve ONCE per unique coordinates
    if (hasResolvedRef.current && lastCoordsRef.current === coordsKey) {
      console.log('⏭️ Skipping auto-resolution (already resolved for these coords)');
      return;
    }

    // RATE LIMITING: Prevent excessive reverse geocoding calls
    const now = Date.now();
    const timeSinceLastResolve = now - lastResolveTimeRef.current;
    if (timeSinceLastResolve < 3000) { // 3 seconds minimum between calls
      console.log('⏱️ Rate limit: Skipping auto-resolution (too soon since last call)');
      return;
    }

    // GUARD: Check if user is extremely far away (>100 miles from ALL stores)
    // If so, skip resolution entirely to avoid unnecessary reverse geocoding
    const distances = stores.map(store => 
      getDistanceMiles(userCoords.lat, userCoords.lng, store.lat, store.lng)
    );
    const nearestDistance = Math.min(...distances);

    if (nearestDistance > 100) {
      console.log(`⛔ User is ${nearestDistance.toFixed(1)} miles away - skipping auto-resolution (out of service area)`);
      
      // Set a "not available" resolution without calling reverse geocoding
      setResolution({
        pickup: {
          canPickup: false,
          pickupStores: [],
          nearestStore: stores[0] 
            ? { ...stores[0], distance: nearestDistance }
            : null,
          autoAssignedStore: null
        },
        delivery: {
          canDeliver: false,
          availableStores: [],
          nearestStore: stores[0]
            ? { ...stores[0], distance: nearestDistance }
            : null,
          prefilledAddress: {
            address: '',
            city: 'Not available',
            state: 'Not available',
            zip: '',
            country: 'USA',
            formatted: 'Service not available in your area',
            source: 'None (out of range)'
          }
        },
        userCoords
      });
      
      setLoading(false);
      hasResolvedRef.current = true;
      lastCoordsRef.current = coordsKey;
      lastResolveTimeRef.current = now;
      return;
    }

    // Auto-resolve location
    const resolve = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('🎯 Auto-resolving pickup and delivery for coords:', userCoords);
        
        const result = await resolvePickupAndDelivery(userCoords, stores);
        
        console.log('✅ Location resolved:', {
          pickup: result.pickup.canPickup 
            ? `✓ ${result.pickup.autoAssignedStore?.name}` 
            : '✗ Not available',
          delivery: result.delivery.canDeliver 
            ? `✓ ${result.delivery.prefilledAddress?.city}` 
            : '✗ Not available',
        });

        setResolution(result);
        setLoading(false);
        
        // Mark as resolved
        hasResolvedRef.current = true;
        lastCoordsRef.current = coordsKey;
        lastResolveTimeRef.current = Date.now();
      } catch (err) {
        console.error('❌ Location resolution error:', err);
        setError(err instanceof Error ? err.message : 'Failed to resolve location');
        setLoading(false);
        
        // Even on error, mark as resolved to prevent loops
        hasResolvedRef.current = true;
        lastCoordsRef.current = coordsKey;
        lastResolveTimeRef.current = Date.now();
      }
    };

    resolve();
  }, [userCoords?.lat, userCoords?.lng, stores.length]); // Only depend on primitive values

  return { resolution, loading, error };
}