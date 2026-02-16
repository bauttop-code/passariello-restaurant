import { distanceMiles } from './distanceMiles';

const DELIVERY_RADIUS_MILES = 5;

export type Store = { 
  id: string; 
  name: string; 
  lat: number; 
  lng: number; 
  address: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type StoreWithDistance = Store & { distance: number };

export interface DeliveryEligibility {
  availableStores: StoreWithDistance[];
  nearestStore: StoreWithDistance | null;
  isDeliverable: boolean;
}

/**
 * Calculate delivery eligibility based on user location and store locations
 * 
 * @param user - User coordinates { lat, lng }
 * @param stores - Array of store locations with coordinates
 * @returns Object with availableStores (within 5 miles), nearestStore, and isDeliverable flag
 */
export function getDeliveryEligibility(
  user: { lat: number; lng: number }, 
  stores: Store[]
): DeliveryEligibility {
  const withDistance = stores.map(s => ({
    ...s,
    distance: distanceMiles(user, { lat: s.lat, lng: s.lng })
  }));

  const available = withDistance
    .filter(s => s.distance <= DELIVERY_RADIUS_MILES)
    .sort((a, b) => a.distance - b.distance);

  return {
    availableStores: available,
    nearestStore: withDistance.sort((a, b) => a.distance - b.distance)[0] ?? null,
    isDeliverable: available.length > 0
  };
}

export { DELIVERY_RADIUS_MILES };
