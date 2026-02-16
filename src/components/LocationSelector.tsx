import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Search, CheckCircle, Loader2, AlertCircle, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Header } from './Header';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapTilerLocationsMap } from './MapTilerLocationsMap';
import { SimpleMapTilerMap } from './SimpleMapTilerMap';
import { usePickupLocationSearch } from '../hooks/usePickupLocationSearch';
import { formatDistance } from '../utils/distance';
import { useUserGeolocation } from '../hooks/useUserGeolocation';
import { reverseGeocode } from '../utils/reverseGeocode';
import { getDistanceMiles, findClosestLocation, getLocationsWithinRadius } from '../utils/getDistanceMiles';
import { type DeliveryEligibility } from '../utils/deliveryEligibility';
import { type PickupEligibility } from '../utils/pickupEligibility';
import { type LocationResolution } from '../utils/resolvePickupAndDelivery';

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
}

interface LocationSelectorProps {
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  currentLocation?: string;
  mode: 'regular' | 'ordernow' | 'catering';
  onModeChange: (mode: 'regular' | 'ordernow' | 'catering') => void;
  cartItemsCount?: number;
  deliveryMode: 'Pickup' | 'Delivery';
  onDeliveryModeChange: (mode: 'Pickup' | 'Delivery') => void;
  onConfirmDelivery: (address: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  }) => void;
  deliveryAddress: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  fromLanding?: boolean;
  userCoords?: { lat: number; lng: number } | null;
  locationSource?: 'geolocation' | 'ip' | null;
  deliveryEligibility?: DeliveryEligibility;
  pickupEligibility?: PickupEligibility;
  locationResolution?: LocationResolution | null;
  resolutionLoading?: boolean;
}

const locations: Location[] = [
  {
    id: '2',
    name: 'Moorestown',
    address: '13 W Main St',
    city: 'Moorestown',
    state: 'NJ',
    zip: '08057',
    hours: 'Open today 11:00 AM to 10:00 PM',
    lat: 39.96395827445834,
    lng: -74.94753350369767,
  },
  {
    id: '3',
    name: 'Voorhees',
    address: '111 Laurel Oak Rd',
    city: 'Voorhees',
    state: 'NJ',
    zip: '08043',
    hours: 'Open today 11:00 AM to 10:00 PM',
    lat: 39.84678444777853,
    lng: -74.98846601755474,
  },
  {
    id: '1',
    name: 'Haddonfield',
    address: '119 Kings Hwy E',
    city: 'Haddonfield',
    state: 'NJ',
    zip: '08033',
    hours: 'Open today 11:00 AM to 10:00 PM',
    lat: 39.89792706143064,
    lng: -75.03314038686908,
  },
];

export function LocationSelector({ 
  onClose, 
  onSelectLocation, 
  currentLocation = 'Haddonfield',
  mode,
  onModeChange,
  cartItemsCount = 0,
  deliveryMode,
  onDeliveryModeChange,
  onConfirmDelivery,
  deliveryAddress,
  fromLanding = false,
  userCoords = null,
  locationSource = null,
  deliveryEligibility,
  pickupEligibility,
  locationResolution = null,
  resolutionLoading = false
}: LocationSelectorProps) {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorites' | 'recent'>('nearby');
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage on mount
    const stored = localStorage.getItem('passariellos-favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [deliveryFormData, setDeliveryFormData] = useState({
    name: deliveryAddress?.name || '',
    phone: deliveryAddress?.phone || '',
    email: deliveryAddress?.email || '',
    address: deliveryAddress?.address || '',
    zip: deliveryAddress?.zip || ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    zip: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    zip: false
  });

  // Geolocation hook for delivery
  const { coords, loading: geoLoading, error: geoError, requestLocation, clearLocation } = useUserGeolocation();
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // REAL-TIME MAP: Track last coords to trigger map updates
  const lastCoordsKeyRef = useRef<string | null>(null);
  const [deliveryMapSrc, setDeliveryMapSrc] = useState<string>('');
  const [lastMapUpdate, setLastMapUpdate] = useState<Date | null>(null);
  
  // USER EDIT TRACKING: Prevent auto-fill from overwriting manual edits
  const [hasUserEditedAddress, setHasUserEditedAddress] = useState(false);
  const [hasUserEditedZip, setHasUserEditedZip] = useState(false);

  // CONFIRMATION SCREEN STATE
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [closestStore, setClosestStore] = useState<Location | null>(null);

  // REAL-TIME MAP UPDATE: Track when user coordinates change
  useEffect(() => {
    const activeCoords = coords || userCoords;
    if (activeCoords && deliveryMode === 'Delivery') {
      const coordsKey = `${activeCoords.lat?.toFixed(4) || activeCoords.latitude?.toFixed(4)},${activeCoords.lng?.toFixed(4) || activeCoords.longitude?.toFixed(4)}`;
      
      // Only update if coordinates actually changed
      if (coordsKey !== lastCoordsKeyRef.current) {
        console.log('🗺️ Map updating to new coordinates:', coordsKey);
        lastCoordsKeyRef.current = coordsKey;
        setLastMapUpdate(new Date());
      }
    }
  }, [coords, userCoords, deliveryMode]);

  // AUTO-PREFILL delivery form when locationResolution is ready
  useEffect(() => {
    if (
      deliveryMode === 'Delivery' && 
      locationResolution?.delivery.prefilledAddress &&
      !deliveryFormData.address // Only prefill if empty
    ) {
      const addr = locationResolution.delivery.prefilledAddress;
      console.log('📍 Auto-prefilling delivery address:', addr);
      
      setDeliveryFormData(prev => ({
        ...prev,
        address: addr.address || '',
        zip: addr.zip || '',
        // Note: city/state not in form, but available in resolution
      }));
    }
  }, [locationResolution, deliveryMode]);

  // Handle geolocation success - auto-fill address fields
  const handleUseCurrentLocation = async () => {
    console.log('🟢 Button clicked - handleUseCurrentLocation');
    requestLocation();
  };

  // Effect to handle reverse geocoding when coords are available
  useEffect(() => {
    if (coords && !isReverseGeocoding) {
      setIsReverseGeocoding(true);
      
      reverseGeocode(coords.latitude, coords.longitude)
        .then((result) => {
          if (result) {
            // Auto-fill address fields
            setDeliveryFormData(prev => ({
              ...prev,
              address: result.address || prev.address,
              zip: result.zipCode || prev.zip,
            }));

            // Clear any previous errors for these fields
            setFormErrors(prev => ({
              ...prev,
              address: '',
              zip: '',
            }));
          }
          setIsReverseGeocoding(false);
        })
        .catch((err) => {
          console.error('Reverse geocoding failed:', err);
          setIsReverseGeocoding(false);
        });
    }
  }, [coords, isReverseGeocoding]);

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) return 'Phone number is required';
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return 'Phone number must have at least 10 digits';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validateAddress = (value: string) => {
    if (!value.trim()) return 'Delivery address is required';
    if (value.trim().length < 5) return 'Please enter a complete address';
    return '';
  };

  const validateZip = (value: string) => {
    if (!value.trim()) return 'ZIP code is required';
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(value.trim())) return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    return '';
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return validateName(value);
      case 'phone':
        return validatePhone(value);
      case 'email':
        return validateEmail(value);
      case 'address':
        return validateAddress(value);
      case 'zip':
        return validateZip(value);
      default:
        return '';
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, deliveryFormData[field]);
    setFormErrors({ ...formErrors, [field]: error });
  };

  const handleInputChange = (field: keyof typeof deliveryFormData, value: string) => {
    setDeliveryFormData({ ...deliveryFormData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setFormErrors({ ...formErrors, [field]: error });
    }
  };

  const isFormValid = () => {
    const nameError = validateName(deliveryFormData.name);
    const phoneError = validatePhone(deliveryFormData.phone);
    const emailError = validateEmail(deliveryFormData.email);
    const addressError = validateAddress(deliveryFormData.address);
    const zipError = validateZip(deliveryFormData.zip);
    
    return !nameError && !phoneError && !emailError && !addressError && !zipError;
  };

  const handleConfirmDelivery = async () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true,
      email: true,
      address: true,
      zip: true
    });

    // Validate all fields
    const errors = {
      name: validateName(deliveryFormData.name),
      phone: validatePhone(deliveryFormData.phone),
      email: validateEmail(deliveryFormData.email),
      address: validateAddress(deliveryFormData.address),
      zip: validateZip(deliveryFormData.zip)
    };

    setFormErrors(errors);

    // Only proceed if form is valid
    if (!errors.name && !errors.phone && !errors.email && !errors.address && !errors.zip) {
      // Calculate closest store to delivery address
      const activeCoords = coords || userCoords;
      if (activeCoords) {
        const closest = findClosestLocation(
          activeCoords.lat || activeCoords.latitude,
          activeCoords.lng || activeCoords.longitude,
          locations
        );
        setClosestStore(closest);
      }
      
      // Show confirmation screen instead of closing immediately
      setShowConfirmation(true);
    }
  };

  // Handle "PICKUP INSTEAD" button
  const handlePickupInstead = () => {
    setShowConfirmation(false);
    onDeliveryModeChange('Pickup');
  };

  // Handle "CONTINUE" button
  const handleContinue = () => {
    // Confirm delivery and close
    onConfirmDelivery(deliveryFormData);
    setShowConfirmation(false);
  };

  // Smart location search (geocoding + distance filtering)
  const { 
    filteredLocations: smartFilteredLocations, 
    state: searchState, 
    errorMessage: searchError 
  } = usePickupLocationSearch(searchValue, locations, 600);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('passariellos-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite function
  const toggleFavorite = (locationId: string) => {
    setFavorites(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  // Get favorite locations
  const favoriteLocations = locations.filter(loc => favorites.includes(loc.id));

  // Fallback to simple text filtering when search is idle
  const simpleFilteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      loc.zip.includes(searchValue) ||
      loc.city.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Determine which locations to display
  const displayLocations = searchState === 'idle' 
    ? simpleFilteredLocations 
    : smartFilteredLocations;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Header Component */}
      <Header 
        mode={mode}
        onModeChange={onModeChange}
        cartItemsCount={cartItemsCount}
        onLogoClick={onClose}
        currentLocation={currentLocation}
        deliveryMode={deliveryMode}
        onDeliveryModeChange={onDeliveryModeChange}
      />

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${deliveryMode === 'Delivery' ? 'max-w-7xl' : ''} mx-auto ${deliveryMode === 'Delivery' ? 'px-4 lg:px-8 py-6' : ''}`}>
          <div>
            {/* Content based on mode */}
            <div className={deliveryMode === 'Delivery' ? 'pb-6' : ''}>
              {deliveryMode === 'Pickup' ? (
                <>
                  {/* Full-Screen Two Column Layout: Locations List + Map */}
                  <div className="grid lg:grid-cols-[456px_1fr] gap-0 min-h-[calc(100vh-140px)]">
                    {/* Left Column - Locations List */}
                    <div className="bg-white border-r border-gray-200 overflow-y-auto px-6 py-8 relative z-10">
                      {/* Find a Restaurant Section */}
                      <div className="mb-6">
                        <div className="mb-6">
                          <h1 className="text-2xl mb-2 font-bold">Find a Restaurant</h1>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Search for a location so that we can get you a menu & pricing for that area.
                          </p>
                        </div>

                        {/* Loading State - Setting up location */}
                        {resolutionLoading && (
                          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3">
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                              <p className="text-blue-900 text-sm">
                                Finding nearest pickup location...
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PICKUP UNAVAILABLE - BLOCKING (50 miles radius) */}
                        {userCoords && pickupEligibility && !pickupEligibility.canPickup && (
                          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-red-900 text-sm">
                                  No pickup locations available near your location.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Search Bar */}
                        <div className="relative mb-6">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="text"
                            placeholder={
                              locationResolution?.pickup.prefilledAddress?.address 
                                ? `${locationResolution.pickup.prefilledAddress.address}${locationResolution.pickup.prefilledAddress.zip ? ', ' + locationResolution.pickup.prefilledAddress.zip : ''}`
                                : "Enter ZIP code or city"
                            }
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            disabled={pickupEligibility && !pickupEligibility.canPickup}
                            className="pl-12 pr-10 py-3 disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 rounded-lg"
                          />
                          {searchValue && (
                            <button
                              onClick={() => setSearchValue('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-3 mb-6">
                          <button
                            onClick={() => setActiveTab('nearby')}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                              activeTab === 'nearby'
                                ? 'bg-[#A72020] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Nearby
                          </button>
                          <button
                            onClick={() => setActiveTab('favorites')}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                              activeTab === 'favorites'
                                ? 'bg-[#A72020] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Favorites
                          </button>
                          <button
                            onClick={() => setActiveTab('recent')}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                              activeTab === 'recent'
                                ? 'bg-[#A72020] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Recent
                          </button>
                        </div>
                      </div>

                      {/* Locations List */}
                      <div className="space-y-4">
                        {/* Favorites - Show locations or empty state */}
                        {activeTab === 'favorites' && (
                          <>
                            {favoriteLocations.length > 0 ? (
                              <>
                                {favoriteLocations.map((location, index) => (
                                  <div
                                    key={location.id}
                                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                                  >
                                    {/* Top Row: Badge + Info + Star */}
                                    <div className="flex items-start gap-3 mb-4">
                                      {/* Number Badge */}
                                      <div className="w-7 h-7 rounded-full bg-[#A72020] text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                        {index + 1}
                                      </div>
                                      
                                      {/* Location Info */}
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base text-gray-900 mb-1">{location.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{location.address}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                          {location.city}, {location.state} {location.zip}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">{location.hours}</p>
                                      </div>

                                      {/* Favorite Star - Always filled for favorites */}
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(location.id);
                                        }}
                                        className="text-[#A72020] flex-shrink-0 transition-colors hover:text-[#8B1A1A]"
                                      >
                                        <Star 
                                          className="w-6 h-6" 
                                          fill="currentColor"
                                        />
                                      </button>
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                      <Button
                                        onClick={() => onSelectLocation(location)}
                                        disabled={pickupEligibility && !pickupEligibility.canPickup}
                                        className="w-full bg-[#A72020] hover:bg-[#8a1a1a] text-white text-sm py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                      >
                                        VIEW MENU & ORDER
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="relative mb-6">
                                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="mb-2">
                                    {/* Map Pin */}
                                    <path
                                      d="M50 10C36.75 10 26 20.75 26 34C26 50.5 50 74 50 74C50 74 74 50.5 74 34C74 20.75 63.25 10 50 10Z"
                                      fill="#6B7280"
                                      stroke="#4B5563"
                                      strokeWidth="2"
                                    />
                                    {/* Star inside pin */}
                                    <path
                                      d="M50 24L52.5 31.5H60.5L54 36.5L56.5 44L50 39L43.5 44L46 36.5L39.5 31.5H47.5L50 24Z"
                                      fill="#A72020"
                                    />
                                    {/* Map base */}
                                    <path
                                      d="M30 75L50 85L70 75L70 90L50 100L30 90L30 75Z"
                                      fill="#6B7280"
                                      stroke="#4B5563"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                                
                                <p className="text-gray-600 mb-4 max-w-sm">
                                  No favorite locations yet. Click the star icon on any location to add it to your favorites.
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Recent - Empty State */}
                        {activeTab === 'recent' && (
                          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg font-medium mb-2">No recent locations</p>
                            <p className="text-gray-500 text-sm">
                              Your recently visited locations will appear here
                            </p>
                          </div>
                        )}

                        {/* Nearby Tab - Show locations */}
                        {activeTab === 'nearby' && (
                          <>
                            {/* Loading State */}
                            {searchState === 'loading' && (
                              <div className="text-center py-8 text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                                Searching nearby pickup locations...
                              </div>
                            )}

                            {/* Error State */}
                            {searchState === 'error' && (
                              <div className="text-center py-8 text-gray-500">
                                <p className="text-red-500">{searchError || 'Unable to find location'}</p>
                                <p className="text-sm mt-2">Try a different search term</p>
                              </div>
                            )}

                            {/* Empty State (no locations within 5 miles) */}
                            {searchState === 'empty' && (
                              <div className="text-center py-8 text-gray-500">
                                <p className="font-semibold text-gray-700 mb-1">No pickup locations within 5 miles</p>
                                <p className="text-sm">Try searching a different area or ZIP code</p>
                              </div>
                            )}

                            {/* Success State - Display Locations */}
                            {(searchState === 'idle' || searchState === 'success') && displayLocations.map((location, index) => {
                              // Check if location has distance property (from smart search)
                              const hasDistance = 'distance' in location;
                              
                              return (
                                <div
                                  key={location.id}
                                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                                >
                                  {/* Top Row: Badge + Info + Star */}
                                  <div className="flex items-start gap-3 mb-4">
                                    {/* Number Badge */}
                                    <div className="w-7 h-7 rounded-full bg-[#A72020] text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                      {index + 1}
                                    </div>
                                    
                                    {/* Location Info */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-base text-gray-900 mb-1">{location.name}</h3>
                                      <p className="text-gray-600 text-sm leading-relaxed">{location.address}</p>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        {location.city}, {location.state} {location.zip}
                                      </p>
                                      <p className="text-gray-500 text-sm mt-1">{location.hours}</p>
                                    </div>

                                    {/* Favorite Star */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(location.id);
                                      }}
                                      className={`flex-shrink-0 transition-colors ${
                                        favorites.includes(location.id)
                                          ? 'text-[#A72020]'
                                          : 'text-gray-300 hover:text-[#A72020]'
                                      }`}
                                    >
                                      <Star 
                                        className="w-6 h-6" 
                                        fill={favorites.includes(location.id) ? 'currentColor' : 'none'}
                                      />
                                    </button>
                                  </div>

                                  {/* Action Button */}
                                  <div>
                                    <Button
                                      onClick={() => onSelectLocation(location)}
                                      disabled={pickupEligibility && !pickupEligibility.canPickup}
                                      className="w-full bg-[#A72020] hover:bg-[#8a1a1a] text-white text-sm py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                      VIEW MENU & ORDER
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* No Results for Simple Search */}
                            {searchState === 'idle' && displayLocations.length === 0 && searchValue.trim() !== '' && (
                              <div className="text-center py-8 text-gray-500">
                                No locations found. Try a different search term.
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Map (Desktop Only) */}
                    <div className="hidden lg:block bg-gray-100 relative">
                      <div className="h-full w-full">
                        <MapTilerLocationsMap 
                          userCoords={userCoords}
                          stores={displayLocations}
                          mode="pickup"
                          height={600}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Delivery Form Section */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <h1 className="text-2xl lg:text-3xl mb-2">Delivery Information</h1>
                      <p className="text-gray-600 text-sm lg:text-base">
                        Please provide your contact information and delivery address.
                      </p>
                    </div>

                    {/* Loading State - Setting up location */}
                    {resolutionLoading && (
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <p className="text-blue-900">
                            Setting up your location...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Two Column Layout: Form + Map */}
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Delivery Form - Left Column */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={deliveryFormData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            className={`py-5 lg:py-6 mt-1 ${touched.name && formErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {touched.name && formErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={deliveryFormData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            className={`py-5 lg:py-6 mt-1 ${touched.phone && formErrors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {touched.phone && formErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={deliveryFormData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            className={`py-5 lg:py-6 mt-1 ${touched.email && formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {touched.email && formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="address">Delivery Address <span className="text-red-500">*</span></Label>
                          <Input
                            id="address"
                            type="text"
                            placeholder="123 Main Street, Apt 4B"
                            value={deliveryFormData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            onBlur={() => handleBlur('address')}
                            className={`py-5 lg:py-6 mt-1 ${touched.address && formErrors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {locationResolution?.delivery.prefilledAddress && deliveryFormData.address && (
                            <p className={`text-sm mt-1 flex items-center gap-1 ${
                              locationResolution.delivery.prefilledAddress.source === 'Approximate' 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                            }`}>
                              <span>
                                {locationResolution.delivery.prefilledAddress.source === 'Approximate' ? '⚠️' : '✓'}
                              </span>
                              {locationResolution.delivery.prefilledAddress.source === 'Approximate' 
                                ? 'Approximate location - please verify your address'
                                : 'Auto-detected from your location'}
                            </p>
                          )}
                          {touched.address && formErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="zip">ZIP Code <span className="text-red-500">*</span></Label>
                          <Input
                            id="zip"
                            type="text"
                            placeholder="12345"
                            value={deliveryFormData.zip}
                            onChange={(e) => handleInputChange('zip', e.target.value)}
                            onBlur={() => handleBlur('zip')}
                            className={`py-5 lg:py-6 mt-1 ${touched.zip && formErrors.zip ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                          {touched.zip && formErrors.zip && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>
                          )}
                        </div>

                        {/* Use Current Location Button */}
                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white py-5 lg:py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={handleUseCurrentLocation}
                            disabled={geoLoading || isReverseGeocoding}
                          >
                            {geoLoading || isReverseGeocoding ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {isReverseGeocoding ? 'Getting address...' : 'Getting location...'}                              
                              </>
                            ) : (
                              <>
                                <MapPin className="w-5 h-5 mr-2" />
                                Use my current location
                              </>
                            )}
                          </Button>
                          {geoError && (
                            <p className="text-amber-600 text-sm mt-2 text-center">{geoError}</p>
                          )}
                          {coords && !geoError && (
                            <p className="text-green-600 text-sm mt-2 text-center flex items-center justify-center">
                              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                              Location detected successfully
                            </p>
                          )}
                        </div>

                        {/* Delivery Unavailable Warning - BLOCKING */}
                        {deliveryMode === 'Delivery' && userCoords && deliveryEligibility && !deliveryEligibility.isDeliverable && (
                          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h3 className="font-semibold text-red-900 mb-1">
                                  No stores available for delivery in your area.
                                </h3>
                                <p className="text-red-800 text-sm">
                                  {deliveryEligibility.nearestStore 
                                    ? `You are ${deliveryEligibility.nearestStore.distance.toFixed(1)} miles away from the nearest store (${deliveryEligibility.nearestStore.name}). We only deliver within 5 miles.`
                                    : 'You are more than 5 miles away from all our locations.'}
                                </p>
                                <p className="text-red-700 text-sm mt-2">
                                  💡 Try <strong>Pickup</strong> instead or contact the nearest store directly.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Location Source Warning (IP approximate) */}
                        {locationSource === 'ip' && deliveryMode === 'Delivery' && (
                          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mt-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <p className="text-blue-900 text-sm">
                                <strong>Location is approximate.</strong> Please verify your delivery address is correct to ensure accurate delivery availability.
                              </p>
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full bg-[#A72020] hover:bg-[#8b1919] text-white py-6 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleConfirmDelivery}
                          disabled={!isFormValid() || (deliveryMode === 'Delivery' && deliveryEligibility && !deliveryEligibility.isDeliverable)}
                        >
                          CONFIRM DELIVERY
                        </Button>
                      </div>

                      {/* Map Image - Right Column */}
                      <div className="hidden lg:block">
                        <div className="sticky top-6 rounded-lg overflow-hidden border border-gray-200 shadow-md h-[600px] relative">
                          {/* SimpleMapTilerMap - MapLibre Raster */}
                          {(coords || userCoords) ? (
                            <SimpleMapTilerMap
                              lat={coords ? coords.latitude : userCoords!.lat}
                              lng={coords ? coords.longitude : userCoords!.lng}
                              zoom={15}
                              height={600}
                            />
                          ) : (
                            <SimpleMapTilerMap
                              lat={39.8914}
                              lng={-75.0368}
                              zoom={10}
                              height={600}
                            />
                          )}
                          
                          {/* Live Location Update Indicator */}
                          {(coords || userCoords) && lastMapUpdate && (
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-md px-2.5 py-1.5 shadow-sm border border-gray-200 z-[1001]">
                              <p className="text-xs text-gray-700 flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>
                                  Live location • Updated {lastMapUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Screen */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          {/* Two Column Layout */}
          <div className="flex-1 grid md:grid-cols-2">
            {/* LEFT SIDE - Great news! with background */}
            <div 
              className="relative bg-cover bg-center p-12 flex flex-col justify-center items-center text-gray-900"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://drive.google.com/thumbnail?id=1VV5ZUwo791pmbQAHHlcq3kuAK4P4abr_&sz=w1000')`
              }}
            >
              <div className="max-w-md w-full text-center">
                <h1 className="text-4xl mb-4">Great news!</h1>
                <p className="text-lg mb-2">We deliver to you in</p>
                <p className="text-5xl mb-4">50–65 Minutes</p>
                <p className="text-gray-600 text-sm">
                  Estimated time includes food preparation and delivery. Actual time may vary.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Delivery Details Card */}
            <div className="bg-gray-50 p-12 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                {/* Close button */}
                <div className="flex justify-end mb-4">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmation(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl mb-6">Delivery Details</h2>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-600 mb-2">Delivery Address</h3>
                    <p className="text-gray-900">{deliveryFormData.name}</p>
                    <p className="text-gray-900">{deliveryFormData.address}</p>
                    <p className="text-gray-900">{deliveryFormData.zip}</p>
                    <p className="text-gray-900 mt-1">{deliveryFormData.phone}</p>
                    <p className="text-gray-900">{deliveryFormData.email}</p>
                  </div>

                  {/* Delivery From */}
                  {closestStore && (
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-2">Delivery From</h3>
                      <p className="font-semibold text-gray-900">{closestStore.name}</p>
                      <p className="text-gray-900">{closestStore.address}</p>
                      <p className="text-gray-900">
                        {closestStore.city}, {closestStore.state} {closestStore.zip}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handlePickupInstead}
                      variant="outline"
                      className="w-full border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white py-3"
                    >
                      PICKUP INSTEAD
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="w-full bg-[#A72020] hover:bg-[#8b1919] text-white py-3"
                    >
                      CONTINUE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}