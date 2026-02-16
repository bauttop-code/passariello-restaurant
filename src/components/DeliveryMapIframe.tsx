import { GoogleMapEmbed } from './GoogleMapEmbed';
import type { MapCoords } from '../utils/googleMaps';

interface DeliveryMapIframeProps {
  coords: { lat: number; lon: number; displayName?: string } | null;
  loading: boolean;
  error: string | null;
  query: string;
}

/**
 * WRAPPER for GoogleMapEmbed - maintains backward compatibility
 * Used in Delivery flow
 */
export function DeliveryMapIframe({
  coords,
  loading,
  error,
  query
}: DeliveryMapIframeProps) {
  
  // Convert coords to MapCoords format
  const mapCoords: MapCoords | null = coords ? {
    lat: coords.lat,
    lng: coords.lon
  } : null;
  
  return (
    <GoogleMapEmbed
      mode="delivery"
      userCoords={mapCoords}
      displayName={coords?.displayName}
      loading={loading}
      height={280}
      showLocationList={false}
    />
  );
}
