import { getPickupEligibility, type PickupStore } from './pickupEligibility';
import { getDeliveryEligibility } from './deliveryEligibility';
import { reverseGeocode, type ReverseGeocodingResult } from './reverseGeocoding';

export interface PickupResolution {
  canPickup: boolean;
  autoAssignedStore: PickupStore | null;
  availableStores: PickupStore[];
  nearestStore: PickupStore | null;
}

export interface DeliveryResolution {
  canDeliver: boolean;
  prefilledAddress: ReverseGeocodingResult; // Always has a value (uses fallback)
  availableStores: any[];
  nearestStore: any | null;
}

export interface LocationResolution {
  pickup: PickupResolution;
  delivery: DeliveryResolution;
  userCoords: { lat: number; lng: number };
}

/**
 * MAIN FUNCTION: Automatically resolve pickup and delivery based on user location
 * 
 * PICKUP: Auto-assigns nearest store within 50 miles
 * DELIVERY: Pre-fills address via reverse geocoding + validates 5 mile radius
 * 
 * @param userCoords - User's GPS/IP coordinates
 * @param stores - Array of store locations
 * @returns Complete resolution of pickup and delivery options
 */
export async function resolvePickupAndDelivery(
  userCoords: { lat: number; lng: number },
  stores: PickupStore[]
): Promise<LocationResolution> {
  
  // ========================================
  // A) PICKUP AUTO-ASSIGNMENT (50 miles)
  // ========================================
  
  const pickupEligibility = getPickupEligibility(userCoords, stores);
  
  const pickupResolution: PickupResolution = {
    canPickup: pickupEligibility.canPickup,
    autoAssignedStore: pickupEligibility.canPickup 
      ? pickupEligibility.pickupStores[0] // Auto-assign nearest
      : null,
    availableStores: pickupEligibility.pickupStores,
    nearestStore: pickupEligibility.nearestStore,
  };

  // ========================================
  // B) DELIVERY PRE-FILL + VALIDATION (5 miles)
  // ========================================
  
  const deliveryEligibility = getDeliveryEligibility(userCoords, stores);
  
  // CRITICAL FIX: Only reverse geocode if delivery is possible
  // This prevents unnecessary API calls when user is out of range
  let prefilledAddress: ReverseGeocodingResult;
  
  if (deliveryEligibility.isDeliverable) {
    // User is within 5 miles - get real address
    console.log('✅ User within delivery range - fetching address...');
    prefilledAddress = await reverseGeocode(userCoords.lat, userCoords.lng);
  } else {
    // User is out of range - use approximate (no API calls needed)
    console.log('⏭️ User outside delivery range - skipping reverse geocoding');
    prefilledAddress = {
      address: '',
      city: deliveryEligibility.nearestStore?.city || 'Not available',
      state: 'NJ',
      zip: '',
      country: 'USA',
      formatted: 'Delivery not available at this location',
      source: 'None (out of range)'
    };
  }

  const deliveryResolution: DeliveryResolution = {
    canDeliver: deliveryEligibility.isDeliverable,
    prefilledAddress,
    availableStores: deliveryEligibility.availableStores,
    nearestStore: deliveryEligibility.nearestStore,
  };

  // ========================================
  // RETURN COMPLETE RESOLUTION
  // ========================================
  
  return {
    pickup: pickupResolution,
    delivery: deliveryResolution,
    userCoords,
  };
}

/**
 * Helper: Get auto-assigned pickup location name
 */
export function getAutoAssignedPickupName(resolution: LocationResolution): string | null {
  return resolution.pickup.autoAssignedStore?.name || null;
}

/**
 * Helper: Check if user can use any service (pickup or delivery)
 */
export function canUseAnyService(resolution: LocationResolution): boolean {
  return resolution.pickup.canPickup || resolution.delivery.canDeliver;
}

/**
 * Helper: Get recommended service based on user location
 */
export function getRecommendedService(resolution: LocationResolution): 'Pickup' | 'Delivery' | null {
  // Prefer delivery if available (more convenient)
  if (resolution.delivery.canDeliver) return 'Delivery';
  
  // Fallback to pickup if available
  if (resolution.pickup.canPickup) return 'Pickup';
  
  // No service available
  return null;
}