import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

// Import MapLibre CSS from CDN via link tag
if (typeof document !== 'undefined' && !document.querySelector('link[href*="maplibre-gl.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
  document.head.appendChild(link);
}

// MapTiler API Configuration
const MAPTILER_API_KEY = 'ckDadDcJhKQSamXPxDTe';

interface SimpleMapTilerMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string | number;
  className?: string;
}

/**
 * Simple MapTiler Map Component
 * 
 * Displays a single location on a MapTiler-powered map with a marker
 */
export function SimpleMapTilerMap({
  lat,
  lng,
  zoom = 15,
  height = '100%',
  className = '',
}: SimpleMapTilerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      setIsLoading(false);
      return;
    }

    // Guard against SSR / environments without DOM
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('[SimpleMapTilerMap] Skipping initialization: window/document not available');
      setIsLoading(false);
      return;
    }

    // Set a timeout to detect if map never loads (e.g., CSP blocking tiles)
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading && !error) {
        console.error('[SimpleMapTilerMap] Map load timeout - tiles may be blocked by CSP/network');
        setError('Map preview unavailable in this environment');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    try {
      console.log('[SimpleMapTilerMap] Initializing map at', lat, lng);

      // Initialize MapLibre GL map with simple inline raster style (no sprites!)
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`
              ],
              tileSize: 256,
              attribution: '© MapTiler © OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [lng, lat],
        zoom: zoom,
      });

      mapRef.current = map;

      // Error handling
      map.on('error', (e) => {
        console.error('[SimpleMapTilerMap] Map error:', e.error?.message || e.type || 'Unknown error');
        setError('Map failed to load');
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      });

      map.on('load', () => {
        console.log('[SimpleMapTilerMap] Map loaded successfully');
        setIsLoading(false);
        
        // Clear timeout on successful load
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        
        // Add marker
        console.log('[SimpleMapMarker] lat:', lat, 'lng:', lng);
        
        const marker = new maplibregl.Marker({ color: '#A72020' })
          .setLngLat([lng, lat])
          .addTo(map);

        markerRef.current = marker;
      });
    } catch (err) {
      console.error('[SimpleMapTilerMap] Failed to initialize:', err);
      setError('Map initialization failed');
      setIsLoading(false);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, zoom]);

  // Fallback UI
  if (error) {
    return (
      <div 
        className={className}
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      >
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-300">
          <div className="text-center px-4 py-6">
            <div className="text-gray-400 mb-2">
              <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Map preview unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
    >
      {isLoading && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A72020] mx-auto mb-2"></div>
            <p className="text-gray-600 text-xs">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}