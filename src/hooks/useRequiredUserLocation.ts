import { useState, useEffect, useCallback } from 'react';

export interface UserCoords {
  lat: number;
  lng: number;
}

export type LocationSource = 'geolocation' | 'ip' | null;

export interface UseRequiredUserLocationReturn {
  coords: UserCoords | null;
  source: LocationSource;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
  retryGeolocation: () => void;
  reset: () => void;
}

interface IpApiResponse {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country_name?: string;
}

/**
 * REQUIRED USER LOCATION HOOK
 * 
 * Business Logic:
 * 1. Automatically attempts browser geolocation on mount
 * 2. Falls back to IP geolocation if permission denied or unavailable
 * 3. Blocks app functionality until valid coordinates are obtained
 * 
 * Flow:
 * - Try navigator.geolocation.getCurrentPosition()
 * - If success → save coords, source = "geolocation"
 * - If error/denied → automatic fallback to IP geolocation
 * - If IP success → save coords, source = "ip"
 * - If both fail → error = "Location required", permissionDenied = true
 */
export function useRequiredUserLocation(autoRequest = true): UseRequiredUserLocationReturn {
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [source, setSource] = useState<LocationSource>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  /**
   * Attempt to get location via IP geolocation (fallback)
   * Using ipapi.co - free, no API key required, 30k requests/month
   */
  const getLocationFromIP = useCallback(async () => {
    console.log('🌐 Attempting IP geolocation fallback...');
    
    try {
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('IP geolocation service unavailable');
      }

      const data: IpApiResponse = await response.json();

      if (data.latitude && data.longitude) {
        console.log('✅ IP geolocation successful:', { lat: data.latitude, lng: data.longitude });
        setCoords({ lat: data.latitude, lng: data.longitude });
        setSource('ip');
        setLoading(false);
        setError(null);
        setPermissionDenied(false);
        return true;
      } else {
        throw new Error('Invalid IP geolocation response');
      }
    } catch (err) {
      console.error('❌ IP geolocation failed:', err);
      setLoading(false);
      setError('Unable to determine your location. Please check your internet connection and try again.');
      setPermissionDenied(true);
      return false;
    }
  }, []);

  /**
   * Attempt to get location via browser geolocation API
   */
  const requestGeolocation = useCallback(() => {
    console.log('📍 Requesting browser geolocation...');

    // Iframe check (Figma preview) to avoid permissions policy errors
    const isInIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    if (isInIframe()) {
      console.log('[Geo] Iframe detected → skipping browser geolocation, using IP fallback');
      getLocationFromIP();
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported, falling back to IP...');
      getLocationFromIP();
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Browser geolocation successful:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSource('geolocation');
        setLoading(false);
        setError(null);
        setPermissionDenied(false);
      },
      (err) => {
        console.log('❌ Browser geolocation error:', err.code, err.message);

        // Check if permission was denied
        if (err.code === err.PERMISSION_DENIED) {
          console.log('🔄 Permission denied, falling back to IP geolocation...');
          setPermissionDenied(true);
          // Automatically fallback to IP geolocation
          getLocationFromIP();
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          console.log('🔄 Position unavailable, falling back to IP geolocation...');
          getLocationFromIP();
        } else if (err.code === err.TIMEOUT) {
          console.log('🔄 Geolocation timeout, falling back to IP geolocation...');
          getLocationFromIP();
        } else {
          console.log('🔄 Unknown error, falling back to IP geolocation...');
          getLocationFromIP();
        }
      },
      options
    );
  }, [getLocationFromIP]);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setCoords(null);
    setSource(null);
    setLoading(false);
    setError(null);
    setPermissionDenied(false);
  }, []);

  /**
   * Retry geolocation (useful for UI retry button)
   */
  const retryGeolocation = useCallback(() => {
    reset();
    requestGeolocation();
  }, [reset, requestGeolocation]);

  /**
   * Auto-request location on mount if enabled
   */
  useEffect(() => {
    if (autoRequest && !coords && !loading) {
      requestGeolocation();
    }
  }, [autoRequest]); // Only run on mount

  return {
    coords,
    source,
    loading,
    error,
    permissionDenied,
    retryGeolocation,
    reset,
  };
}
