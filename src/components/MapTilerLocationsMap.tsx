import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

// Import MapLibre CSS from CDN via link tag
if (typeof document !== 'undefined' && !document.querySelector('link[href*="maplibre-gl.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
  document.head.appendChild(link);
}

import { MapPin } from 'lucide-react';

// MapTiler API Configuration
const MAPTILER_API_KEY = 'ckDadDcJhKQSamXPxDTe';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

interface MapTilerLocationsMapProps {
  /**
   * User coordinates (optional - shown as "You are here")
   */
  userCoords?: { lat: number; lng: number } | null;
  
  /**
   * Store locations to display
   */
  stores: Store[];
  
  /**
   * Mode: pickup (show user + stores) or delivery (show only user)
   */
  mode: 'pickup' | 'delivery';
  
  /**
   * Map height
   */
  height?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Selected store (for centering map)
   */
  selectedStoreId?: string;
}

/**
 * MapTiler-based Locations Map Component
 * 
 * Replacement for GoogleLocationsMap using MapLibre GL JS + MapTiler tiles
 * 
 * Features:
 * - Shows user location with blue marker (if available)
 * - Shows store locations with red numbered markers
 * - PICKUP mode: Shows user + all stores with optimal view
 * - DELIVERY mode: Centers on user location
 * - Interactive markers with popups
 * - Click on location badges to focus map
 */
export function MapTilerLocationsMap({
  userCoords,
  stores,
  mode,
  height = 400,
  className = '',
  selectedStoreId,
}: MapTilerLocationsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const storeMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // FOCUS MODE STATE: Track which location is active
  // null = show all, 'you' = focus on user, store.id = focus on store
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  
  // Get active store object
  const activeStore = activeLocationId && activeLocationId !== 'you' 
    ? stores.find(s => s.id === activeLocationId) 
    : null;

  useEffect(() => {
    if (!mapContainerRef.current) {
      setIsLoading(false);
      return;
    }

    // Guard against SSR / environments without DOM
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('[MapTilerLocationsMap] Skipping initialization: window/document not available');
      setIsLoading(false);
      return;
    }

    // Set a timeout to detect if map never loads (e.g., CSP blocking tiles)
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading && !error) {
        console.error('[MapTilerLocationsMap] Map load timeout - tiles may be blocked by CSP/network');
        setError('Map preview unavailable in this environment');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    try {
      console.log('[MapTilerLocationsMap] Initializing map...');

      // Initialize MapLibre GL map with simple inline style (no sprites!)
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
        center: [-75.03314038686908, 39.89792706143064], // Default: Haddonfield, NJ [lng, lat]
        zoom: 10,
        attributionControl: true,
      });

      mapRef.current = map;

      map.on('error', (e) => {
        console.error('[MapTilerLocationsMap] Map error:', e.error?.message || e.type || 'Unknown error');
        setError('Map failed to load');
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      });

      map.on('load', () => {
        console.log('[MapTilerLocationsMap] Map loaded successfully');
        
        // Clear timeout on successful load
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        
        const bounds = new maplibregl.LngLatBounds();
        let hasAnyMarkers = false;

        // Clear existing markers
        userMarkerRef.current?.remove();
        userMarkerRef.current = null;
        storeMarkersRef.current.forEach(m => m.remove());
        storeMarkersRef.current = [];

        // Add user marker (blue pin) if coordinates available
        if (userCoords && mode === 'pickup') {
          const userEl = document.createElement('div');
          userEl.style.width = '40px';
          userEl.style.height = '50px';
          userEl.style.cursor = 'pointer';
          
          userEl.innerHTML = `
            <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              <path
                d="M20 0C8.95 0 0 8.95 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.95 31.05 0 20 0Z"
                fill="#3B82F6"
              />
              <circle cx="20" cy="18" r="6" fill="white" />
            </svg>
          `;

          const userPopup = new maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
          }).setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3B82F6;">
                📍 Your Location
              </h3>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                We'll help you find the nearest store
              </p>
            </div>
          `);

          const userMarker = new maplibregl.Marker({
            element: userEl,
            anchor: 'bottom',
          })
            .setLngLat([userCoords.lng, userCoords.lat])
            .setPopup(userPopup)
            .addTo(map);

          userMarkerRef.current = userMarker;
          bounds.extend([userCoords.lng, userCoords.lat]);
          hasAnyMarkers = true;

          userEl.addEventListener('click', () => {
            userMarker.togglePopup();
          });
        }

        // Add store markers (red numbered pins) in pickup mode
        if (mode === 'pickup' && stores.length > 0) {
          stores.forEach((store, index) => {
            const el = document.createElement('div');
            el.className = 'store-marker';
            el.style.width = '40px';
            el.style.height = '50px';
            el.style.cursor = 'pointer';
            
            el.innerHTML = `
              <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                <path
                  d="M20 0C8.95 0 0 8.95 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.95 31.05 0 20 0Z"
                  fill="#A72020"
                />
                <circle cx="20" cy="20" r="8" fill="white" />
                <text
                  x="20"
                  y="25"
                  text-anchor="middle"
                  fill="#A72020"
                  font-size="12"
                  font-weight="bold"
                >
                  ${index + 1}
                </text>
              </svg>
            `;

            const popupContent = `
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 24px; height: 24px; background: #A72020; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">
                    ${index + 1}
                  </div>
                  <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #A72020;">
                    ${store.name}
                  </h3>
                </div>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #4B5563; line-height: 1.4;">
                  ${store.address}<br>
                  ${store.city}, ${store.state} ${store.zip}
                </p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.address}, ${store.city}, ${store.state} ${store.zip}`)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="display: inline-block; padding: 8px 16px; background: #A72020; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; transition: background 0.2s;"
                >
                  Get Directions →
                </a>
              </div>
            `;

            const popup = new maplibregl.Popup({
              offset: 25,
              closeButton: true,
              closeOnClick: false,
              maxWidth: '320px',
            }).setHTML(popupContent);

            console.log('[StoreMarker]', store.id, store.name, 'lat:', store.lat, 'lng:', store.lng);
            
            const marker = new maplibregl.Marker({
              element: el,
              anchor: 'bottom',
            })
              .setLngLat([store.lng, store.lat])
              .setPopup(popup)
              .addTo(map);

            storeMarkersRef.current.push(marker);
            bounds.extend([store.lng, store.lat]);
            hasAnyMarkers = true;

            el.addEventListener('click', () => {
              marker.togglePopup();
            });
          });
        }

        // Delivery mode: Only show user location
        if (mode === 'delivery' && userCoords) {
          const userEl = document.createElement('div');
          userEl.style.width = '40px';
          userEl.style.height = '50px';
          userEl.style.cursor = 'pointer';
          
          userEl.innerHTML = `
            <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              <path
                d="M20 0C8.95 0 0 8.95 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.95 31.05 0 20 0Z"
                fill="#A72020"
              />
              <circle cx="20" cy="18" r="6" fill="white" />
            </svg>
          `;

          const userPopup = new maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
          }).setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #A72020;">
                📍 Delivery Address
              </h3>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                Your order will be delivered here
              </p>
            </div>
          `);

          const userMarker = new maplibregl.Marker({
            element: userEl,
            anchor: 'bottom',
          })
            .setLngLat([userCoords.lng, userCoords.lat])
            .setPopup(userPopup)
            .addTo(map);

          userMarkerRef.current = userMarker;
          
          userEl.addEventListener('click', () => {
            userMarker.togglePopup();
          });
        }

        // Handle focus mode
        if (activeLocationId) {
          if (activeLocationId === 'you' && userCoords) {
            // Focus on user location
            map.flyTo({
              center: [userCoords.lng, userCoords.lat],
              zoom: 16,
              duration: 1000,
            });
            userMarkerRef.current?.togglePopup();
          } else if (activeStore) {
            // Focus on specific store
            map.flyTo({
              center: [activeStore.lng, activeStore.lat],
              zoom: 16,
              duration: 1000,
            });
            const storeIndex = stores.findIndex(s => s.id === activeStore.id);
            if (storeIndex >= 0 && storeMarkersRef.current[storeIndex]) {
              storeMarkersRef.current[storeIndex].togglePopup();
            }
          }
        } else if (hasAnyMarkers) {
          // Fit map to show all markers
          console.log('[StoreBounds] stores included:', stores.length);
          map.fitBounds(bounds, {
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 15,
            duration: 0,
          });
        } else if (userCoords) {
          // Just center on user
          map.setCenter([userCoords.lng, userCoords.lat]);
          map.setZoom(15);
        }

        setIsLoading(false);
      });

      // Cleanup
      return () => {
        userMarkerRef.current?.remove();
        userMarkerRef.current = null;
        storeMarkersRef.current.forEach(m => m.remove());
        storeMarkersRef.current = [];
        map.remove();
        mapRef.current = null;
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      };
    } catch (e) {
      console.error('[MapTilerLocationsMap] Initialization error:', e);
      setError('Map failed to initialize');
      setIsLoading(false);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }
  }, [userCoords, stores, mode, activeLocationId, activeStore, selectedStoreId]);

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px`, width: '100%' }}>
      {/* Error Fallback */}
      {error && (
        <div style={{ height: `${height}px`, width: '100%' }} className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
          <div className="text-center px-6 py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">Map preview unavailable</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Map UI */}
      {!error && (
        <>
          {/* Map Container */}
          <div 
            ref={mapContainerRef} 
            style={{ 
              height: `${height}px`, 
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="rounded-lg shadow-md"
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#A72020] mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* MapTiler & OSM Attribution */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            © <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap contributors</a>
          </div>

          <style>{`
            /* Force MapLibre canvas to be visible */
            .maplibregl-map {
              width: 100% !important;
              height: 100% !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
            }
            .maplibregl-canvas-container {
              width: 100% !important;
              height: 100% !important;
            }
            .maplibregl-canvas {
              width: 100% !important;
              height: 100% !important;
              display: block !important;
            }
            .maplibregl-popup-content {
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              padding: 12px;
            }
            .maplibregl-popup-close-button {
              font-size: 20px;
              padding: 4px 8px;
              color: #6B7280;
            }
            .maplibregl-popup-close-button:hover {
              background: #F3F4F6;
              color: #A72020;
            }
            .store-marker {
              transition: transform 0.2s;
            }
            .store-marker:hover {
              transform: scale(1.1);
            }
            .maplibregl-ctrl-attrib {
              font-size: 10px;
            }
          `}</style>
        </>
      )}
    </div>
  );
}