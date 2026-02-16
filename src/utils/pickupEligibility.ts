import { distanceMiles } from './distanceMiles';

const PICKUP_RADIUS_MILES = 50;

export type PickupStore = { 
  id: string; 
  name: string; 
  lat: number; 
  lng: number; 
  address: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type PickupStoreWithDistance = PickupStore & { distance: number };

export interface PickupEligibility {
  canPickup: boolean;
  pickupStores: PickupStoreWithDistance[];
  nearestStore: PickupStoreWithDistance | null;
}

/**
 * BUSINESS RULE: User can ONLY select PICKUP if at least ONE store is within 50 miles.
 * 
 * @param user - User coordinates { lat, lng }
 * @param stores - Array of store locations with coordinates
 * @returns Object with canPickup flag, pickupStores (within 50 miles), and nearestStore
 */
export function getPickupEligibility(
  user: { lat: number; lng: number }, 
  stores: PickupStore[]
): PickupEligibility {
  // Calculate distance to each store
  const withDistance = stores.map(s => ({
    ...s,
    distance: distanceMiles(user, { lat: s.lat, lng: s.lng })
  }));

  // Filter stores within 50 miles radius and sort by distance
  const pickupStores = withDistance
    .filter(s => s.distance <= PICKUP_RADIUS_MILES)
    .sort((a, b) => a.distance - b.distance);

  // Find nearest store (regardless of distance)
  const nearestStore = withDistance.sort((a, b) => a.distance - b.distance)[0] ?? null;

  return {
    canPickup: pickupStores.length > 0,
    pickupStores,
    nearestStore,
  };
}

export { PICKUP_RADIUS_MILES };
