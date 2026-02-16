import { MapPin, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { 
  buildPickupGoogleMapSrc, 
  buildDeliveryGoogleMapSrc, 
  buildDefaultNJMapSrc,
  type MapCoords,
  type StoreLocation 
} from '../utils/googleMaps';

interface GoogleMapEmbedProps {
  /**
   * Mode: pickup or delivery
   */
  mode: 'pickup' | 'delivery';
  
  /**
   * User coordinates
   */
  userCoords?: MapCoords | null;
  
  /**
   * Store locations (for pickup mode)
   */
  stores?: StoreLocation[];
  
  /**
   * Display name for delivery address
   */
  displayName?: string;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Height in pixels
   */
  height?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Show location list (for pickup)
   */
  showLocationList?: boolean;
}

/**
 * UNIFIED GOOGLE MAPS COMPONENT
 * Used by both Delivery and Pickup flows
 * 
 * - Delivery: Shows single user location with marker
 * - Pickup: Shows user + 3 store locations in viewport
 */
export function GoogleMapEmbed({
  mode,
  userCoords,
  stores = [],
  displayName,
  loading = false,
  height = 280,
  className = '',
  showLocationList = false
}: GoogleMapEmbedProps) {
  
  // Generate map URL based on mode
  const mapUrl = useMemo(() => {
    if (mode === 'delivery') {
      if (!userCoords) {
        return buildDefaultNJMapSrc();
      }
      return buildDeliveryGoogleMapSrc(userCoords, displayName);
    } else {
      // Pickup mode
      if (!userCoords) {
        return buildDefaultNJMapSrc();
      }
      return buildPickupGoogleMapSrc(userCoords, stores);
    }
  }, [mode, userCoords, stores, displayName]);
  
  // Display label
  const label = useMemo(() => {
    if (mode === 'delivery') {
      return displayName || (userCoords ? 'Your delivery location' : 'New Jersey - Enter address for exact location');
    } else {
      return userCoords ? 'You are here' : 'Determining your location...';
    }
  }, [mode, userCoords, displayName]);
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="w-full border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#A72020] animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {mode === 'delivery' ? 'Searching address...' : 'Determining your location...'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    null
  );
}