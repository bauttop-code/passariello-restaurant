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

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

interface LocationsMapProps {
  locations: Location[];
  className?: string;
}

export function LocationsMap({ locations, className = '' }: LocationsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || locations.length === 0) {
      setIsLoading(false);
      return;
    }

    // Guard against SSR / environments without DOM
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('[LocationsMap] Skipping initialization: window/document not available');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[LocationsMap] Initializing map with MapTiler...');
      
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
        center: [0, 0], // Will be overridden by fitBounds
        zoom: 10,
      });

      mapRef.current = map;

      // Error handling
      map.on('error', (e) => {
        console.error('[LocationsMap] Map error:', e.error?.message || e.type || 'Unknown error');
        setError('Map failed to load. Please refresh the page.');
        setIsLoading(false);
      });

      map.on('load', () => {
        console.log('[LocationsMap] Map loaded successfully');
        setIsLoading(false);
        
        // Create markers for each location
        const bounds = new maplibregl.LngLatBounds();

        locations.forEach((location, index) => {
          // Create custom HTML marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '40px';
          el.style.height = '50px';
          el.style.cursor = 'pointer';
          
          // Create SVG pin
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

          // Create popup content
          const popupContent = `
            <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 24px; height: 24px; background: #A72020; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">
                  ${index + 1}
                </div>
                <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #A72020;">
                  ${location.name}
                </h3>
              </div>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #4B5563; line-height: 1.4;">
                ${location.address}<br>
                ${location.city}, ${location.state} ${location.zip}
              </p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip}`)}"
                target="_blank"
                rel="noopener noreferrer"
                style="display: inline-block; padding: 8px 16px; background: #A72020; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; transition: background 0.2s;"
              >
                Get Directions →
              </a>
            </div>
          `;

          // Create popup
          const popup = new maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '320px',
          }).setHTML(popupContent);

          // Create marker
          console.log('[LocationsMapMarker]', location.id, location.name, 'lat:', location.lat, 'lng:', location.lng);
          
          const marker = new maplibregl.Marker({
            element: el,
            anchor: 'bottom',
          })
            .setLngLat([location.lng, location.lat])
            .setPopup(popup)
            .addTo(map);

          markersRef.current.push(marker);

          // Add to bounds
          bounds.extend([location.lng, location.lat]);

          // Add click event to open popup
          el.addEventListener('click', () => {
            marker.togglePopup();
          });
        });

        // Fit map to show all markers with padding
        if (locations.length > 0) {
          console.log('[StoreBounds] stores included:', locations.length);
          map.fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
            maxZoom: 12,
            duration: 0, // No animation on initial load
          });
        }
      });
    } catch (err) {
      console.error('[LocationsMap] Failed to initialize map:', err);
      setError('Map initialization failed. Please try again.');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      // Remove all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  // Fallback UI for errors or loading
  if (error) {
    return (
      <div 
        className={className}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg border border-gray-300">
          <div className="text-center px-6 py-8">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">Map preview unavailable</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
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
        .custom-marker {
          transition: transform 0.2s;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        className={className}
        style={{ width: '100%', height: '400px' }}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A72020] mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      {/* Attribution */}
      <div className="text-xs text-gray-500 mt-1 text-center">
        © <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap contributors</a>
      </div>
    </>
  );
}