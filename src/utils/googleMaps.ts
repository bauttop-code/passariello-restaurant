/**
 * Google Maps Embed Utilities
 * Builds Google Maps embed URLs for pickup and delivery modes
 */

export interface MapCoords {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

/**
 * Build Google Maps embed URL for delivery mode
 * Shows user location with a marker
 */
export function buildDeliveryGoogleMapSrc(
  userCoords: MapCoords,
  displayName?: string
): string {
  const lat = userCoords.lat || userCoords.latitude || 0;
  const lng = userCoords.lng || userCoords.longitude || 0;
  
  // Use Google Maps Embed API with marker
  const label = encodeURIComponent(displayName || 'Delivery Location');
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=15&maptype=roadmap`;
}

/**
 * Build Google Maps embed URL for pickup mode
 * Shows user location + nearby stores
 */
export function buildPickupGoogleMapSrc(
  userCoords: MapCoords,
  stores: StoreLocation[]
): string {
  const lat = userCoords.lat || userCoords.latitude || 0;
  const lng = userCoords.lng || userCoords.longitude || 0;
  
  // For now, just center on user location
  // In the future, we could add markers for stores
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=12&maptype=roadmap`;
}

/**
 * Build default Google Maps embed URL for New Jersey area
 * Used when no coordinates are available
 */
export function buildDefaultNJMapSrc(): string {
  // Center on New Jersey (roughly Haddonfield area)
  const lat = 39.8914;
  const lng = -75.0368;
  
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=10&maptype=roadmap`;
}
