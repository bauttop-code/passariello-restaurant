/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in miles
 */
export function getDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the closest location from a list of locations
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param locations Array of locations with lat/lng
 * @returns Closest location with distance, or null if none
 */
export function findClosestLocation<T extends { lat: number; lng: number }>(
  userLat: number,
  userLng: number,
  locations: T[]
): (T & { distance: number }) | null {
  if (locations.length === 0) return null;

  let closestLocation: (T & { distance: number }) | null = null;
  let minDistance = Infinity;

  for (const location of locations) {
    const distance = getDistanceMiles(userLat, userLng, location.lat, location.lng);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = { ...location, distance };
    }
  }

  return closestLocation;
}

/**
 * Filter locations within a specific radius
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param locations Array of locations with lat/lng
 * @param radiusMiles Maximum radius in miles
 * @returns Locations within radius, sorted by distance
 */
export function getLocationsWithinRadius<T extends { lat: number; lng: number }>(
  userLat: number,
  userLng: number,
  locations: T[],
  radiusMiles: number
): (T & { distance: number })[] {
  const locationsWithDistance = locations.map(location => ({
    ...location,
    distance: getDistanceMiles(userLat, userLng, location.lat, location.lng)
  }));

  return locationsWithDistance
    .filter(loc => loc.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}
