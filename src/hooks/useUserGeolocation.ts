import { useState, useCallback } from 'react';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

interface UseUserGeolocationReturn {
  coords: GeolocationCoords | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

export function useUserGeolocation(): UseUserGeolocationReturn {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    console.log('🔵 requestLocation called');
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      setError('Geolocation is not supported by your browser');
      return;
    }

    console.log('✅ Geolocation is supported, requesting permission...');
    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 300000, // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Position obtained:', position.coords);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.log('❌ Geolocation error:', err);
        setLoading(false);
        
        // Handle different error types
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enter your address manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please enter your address manually.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again or enter your address manually.');
            break;
          default:
            setError('An unknown error occurred. Please enter your address manually.');
        }
      },
      options
    );
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    coords,
    loading,
    error,
    requestLocation,
    clearLocation,
  };
}