import { MapPin, Phone, Clock, Star, ChevronLeft, ExternalLink, Navigation, Utensils, Car, Home, Briefcase, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Header } from './Header';
import { Footer } from './Footer';
import { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { LocationPhotoThumb } from './LocationPhotoThumb';

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
  hours: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  reviewCount?: number;
}

interface LocationDetailViewProps {
  location: Location;
  onClose: () => void;
  mode: 'regular' | 'ordernow' | 'catering';
  onModeChange: (mode: 'regular' | 'ordernow' | 'catering') => void;
  cartItemsCount?: number;
  deliveryMode: 'Pickup' | 'Delivery';
  onDeliveryModeChange: (mode: 'Pickup' | 'Delivery') => void;
  onLocationClick?: () => void;
  onOrderNowClick?: () => void;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
}

const LOCATION_DETAILS = {
  '1': {
    phone: '(856) 616-1010',
    rating: 4.5,
    reviewCount: 1243,
    imageUrl: 'https://drive.google.com/thumbnail?id=1VV5ZUwo791pmbQAHHlcq3kuAK4P4abr_&sz=w1000',
    detailedHours: [
      { day: 'Monday', hours: '9:00 AM - 9:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 9:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 9:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 9:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 9:00 PM' },
    ],
    amenities: [
      { icon: Utensils, label: 'Dine-in', available: true },
      { icon: Car, label: 'Car-side Pickup', available: true },
      { icon: Home, label: 'Online Ordering', available: true },
      { icon: Truck, label: 'Delivery', available: true },
    ],
  },
  '2': {
    phone: '(856) 840-0998',
    rating: 4.6,
    reviewCount: 982,
    imageUrl: 'https://drive.google.com/thumbnail?id=1NfEA-XKD79UPLhU9ZwChZxVYZhJTkSTG&sz=w1000',
    detailedHours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 11:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 11:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ],
    amenities: [
      { icon: Utensils, label: 'Dine-in', available: true },
      { icon: Car, label: 'Car-side Pickup', available: true },
      { icon: Home, label: 'Online Ordering', available: true },
      { icon: Briefcase, label: 'Patio Seating', available: true },
      { icon: Truck, label: 'Delivery', available: true },
    ],
  },
  '3': {
    phone: '(856) 784-7272',
    rating: 4.7,
    reviewCount: 1567,
    imageUrl: 'https://drive.google.com/thumbnail?id=1vxeETY1yeVa1OCz2MZdrFowIORXCuFOK&sz=w1000',
    detailedHours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ],
    amenities: [
      { icon: Utensils, label: 'Dine-in', available: true },
      { icon: Car, label: 'Car-side Pickup', available: true },
      { icon: Home, label: 'Online Ordering', available: true },
    ],
  },
};

export function LocationDetailView({
  location,
  onClose,
  mode,
  onModeChange,
  cartItemsCount = 0,
  deliveryMode,
  onDeliveryModeChange,
  onLocationClick,
  onOrderNowClick,
  deliveryAddress,
}: LocationDetailViewProps) {
  const details = LOCATION_DETAILS[location.id as keyof typeof LOCATION_DETAILS];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current day of week for default selected day
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
  
  // Find hours for selected day
  const selectedDayHours = details?.detailedHours?.find(h => h.day === selectedDay);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Guard against SSR / environments without DOM
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('[LocationDetailView] Skipping map initialization: window/document not available');
      return;
    }

    // Reset error state on retry
    setMapError(false);

    // Set a timeout to detect if map never loads (e.g., CSP blocking tiles)
    loadTimeoutRef.current = setTimeout(() => {
      if (!mapError && mapRef.current && !mapRef.current.loaded()) {
        console.error('[LocationDetailView] Map load timeout - tiles may be blocked by CSP/network');
        setMapError(true);
      }
    }, 10000); // 10 second timeout

    try {
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
        center: [location.lng, location.lat],
        zoom: 15,
      });

      // Error handling
      map.on('error', (e) => {
        console.error('[LocationDetailView] Map error:', e.error?.message || e.type || 'Unknown error');
        setMapError(true);
      });

      map.on('load', () => {
        console.log('[LocationDetailView] Map loaded');
        
        // Clear timeout on successful load
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        
        // Add a marker to the map
        console.log('[LocationDetailMarker]', location.id, location.name, 'lat:', location.lat, 'lng:', location.lng);
        
        const marker = new maplibregl.Marker({ color: '#A72020' })
          .setLngLat([location.lng, location.lat])
          .addTo(map);
        
        markerRef.current = marker;
      });

      mapRef.current = map;
    } catch (e) {
      console.error('[LocationDetailView] Map initialization failed:', e);
      setMapError(true);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }

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
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        mode={mode}
        onModeChange={onModeChange}
        cartItemsCount={cartItemsCount}
        onLogoClick={onClose}
        currentLocation={location.name}
        deliveryMode={deliveryMode}
        onDeliveryModeChange={onDeliveryModeChange}
        onLocationClick={onLocationClick}
        deliveryAddress={deliveryAddress}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full">
          {/* TOP ROW: Map + Restaurant Header */}
          <div className="grid lg:grid-cols-[58%_42%] min-h-[450px]">
            {/* LEFT: Map */}
            <div className="relative h-[400px] lg:h-[450px]">
              {mapError ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center px-4">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Map preview unavailable</p>
                  </div>
                </div>
              ) : (
                <div ref={mapContainerRef} className="w-full h-full" />
              )}
            </div>

            {/* RIGHT: Restaurant Header Card */}
            <div className="bg-white p-4 md:p-8 lg:p-10 flex flex-col lg:border-l border-gray-200">
              {/* Restaurant info with thumbnail */}
              <div className="flex items-start gap-4 mb-6">
                <LocationPhotoThumb
                  src={details?.imageUrl}
                  alt={location.name}
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl lg:text-4xl mb-2">{location.name}</h1>
                  <button
                    className="flex items-center gap-2 text-[#A72020] hover:text-[#8B1A1A] transition-colors text-sm font-medium"
                  >
                    <Star className="w-4 h-4" />
                    Add to Favorites
                  </button>
                </div>
              </div>

              {/* Address (clickable) */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A72020] hover:underline mb-1 flex items-start gap-2 group"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div>{location.address}</div>
                  <div>{location.city}, {location.state} {location.zip}</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${details?.phone}`}
                className="text-[#A72020] hover:underline mb-3 flex items-center gap-2 mt-3"
              >
                <Phone className="w-5 h-5" />
                {details?.phone}
              </a>

              {/* Hours */}
              <div className="flex items-center gap-2 text-gray-700 mb-6">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>{location.hours}</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Description/Amenities/Hours + CTAs */}
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8 lg:py-10">
              <div className="grid lg:grid-cols-[4fr_3fr_3fr] gap-8 lg:gap-12">
                {/* COLUMN 1: Description + Amenities */}
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      If you're looking for a delicious Italian meal and a great family atmosphere, look no further than Passariello's located at {location.city}, New Jersey. We are conveniently located near {location.city} area. To start dining on classic Italian recipes, visit our Italian restaurant at {location.address} today!
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="pt-8 border-t border-gray-200">
                    <h2 className="text-2xl mb-5">Amenities</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Patio seating available
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Come enjoy our outdoor deck seating
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Car-side Pickup Available
                        </h3>
                        <p className="text-gray-600 text-sm">
                          This location offers car-side pickup to make your To Go experience more convenient
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Online Ordering Available
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Place your To Go order online at this location. Pick up. Enjoy!
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          Delivery
                        </h3>
                        <p className="text-gray-600 text-sm">
                          This location offers food delivery option
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Hours */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl">Hours</h2>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="text-[#A72020]">◆</span> Special hours apply
                    </span>
                  </div>

                  {/* Day selector */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-sm font-medium text-gray-700">Today</span>
                    <div className="flex gap-1">
                      {['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'].map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedDay === day
                              ? 'bg-[#A72020] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hours table */}
                  <div className="border-t border-gray-200">
                    {/* Main hours */}
                    <div className="flex justify-between py-3.5 border-b border-gray-200">
                      <span className="font-semibold text-gray-900">{selectedDay}</span>
                      <span className="text-gray-700">{selectedDayHours?.hours || '11:00 AM – 10:00 PM'}</span>
                    </div>

                    {/* Service-specific hours */}
                    <div className="divide-y divide-gray-100">
                      <div className="flex justify-between py-3">
                        <span className="text-gray-700">Catering Pickup</span>
                        <span className="text-gray-600">10:00 AM – 9:40 PM</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-gray-700">Catering Delivery</span>
                        <span className="text-gray-600">10:00 AM – 9:00 PM</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-gray-700">Online Ordering</span>
                        <span className="text-gray-600">10:00 AM – 9:40 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: CTAs */}
                <div className="space-y-4">
                  <Button
                    onClick={onClose}
                    className="w-full bg-[#A72020] hover:bg-[#8B1A1A] text-white py-6 text-base font-semibold"
                  >
                    ORDER NOW
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white py-6 text-base font-semibold transition-colors"
                  >
                    VIEW MENU
                  </Button>
                  <Button
                    onClick={() => window.open('https://www.passariellos.com/careers', '_blank')}
                    variant="outline"
                    className="w-full border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white py-6 text-base font-semibold transition-colors"
                  >
                    APPLY NOW
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Top */}
          <div className="flex justify-end px-8 py-6 border-t border-gray-200 bg-white">
            <button
              onClick={scrollToTop}
              className="text-[#A72020] hover:text-[#8B1A1A] flex items-center gap-1 text-sm font-medium"
            >
              Back to Top
              <ChevronLeft className="w-4 h-4 rotate-90" />
            </button>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}