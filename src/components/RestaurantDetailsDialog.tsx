import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { X, MapPin, Phone, Clock, Navigation, ChevronRight, CreditCard, Users, Utensils } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SimpleMapTilerMap } from './SimpleMapTilerMap';

interface RestaurantDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMenu?: () => void;
  locationData: {
    name: string;
    address: string;
    phone: string;
    coordinates: { lat: number; lng: number };
  };
  location: string;
}

const AMENITIES = [
  { icon: Navigation, label: 'Free WiFi' },
  { icon: CreditCard, label: 'Credit Cards' },
  { icon: Users, label: 'Family Friendly' },
  { icon: Utensils, label: 'Dine-in' }
];

const LOCATION_AMENITIES: Record<string, Array<{ title: string; description: string; isNew?: boolean }>> = {
  'Moorestown': [
    {
      title: 'Patio seating available',
      description: 'Come enjoy our outdoor deck seating.'
    },
    {
      title: 'Car-side Pickup Available',
      description: 'This location offers car-side pickup to make your experience more convenient.'
    },
    {
      title: 'Online Ordering Available',
      description: 'Place your order online at this location. Pick up or Delivery. Enjoy!'
    }
  ],
  'Haddonfield': [
    {
      title: 'Car-side Pickup Available',
      description: 'This location offers car-side pickup to make your experience more convenient.'
    },
    {
      title: 'Online Ordering Available',
      description: 'Place your order online at this location. Pick up or Delivery. Enjoy!'
    }
  ],
  'Voorhees': [
    {
      title: 'Car-side Pickup Available',
      description: 'This location offers car-side pickup to make your experience more convenient.'
    },
    {
      title: 'Online Ordering Available',
      description: 'Place your order online at this location. Pick up or Delivery. Enjoy!'
    }
  ]
};

const LOCATION_HOURS: Record<string, Record<string, string>> = {
  'Moorestown': {
    monday: '9:00 AM - 10:00 PM',
    tuesday: '9:00 AM - 10:00 PM',
    wednesday: '9:00 AM - 10:00 PM',
    thursday: '9:00 AM - 10:00 PM',
    friday: '9:00 AM - 11:00 PM',
    saturday: '9:00 AM - 11:00 PM',
    sunday: '9:00 AM - 10:00 PM'
  },
  'Haddonfield': {
    monday: '9:00 AM - 9:00 PM',
    tuesday: '9:00 AM - 9:00 PM',
    wednesday: '9:00 AM - 9:00 PM',
    thursday: '9:00 AM - 9:00 PM',
    friday: '9:00 AM - 10:00 PM',
    saturday: '9:00 AM - 10:00 PM',
    sunday: '9:00 AM - 9:00 PM'
  },
  'Voorhees': {
    monday: '9:00 AM - 10:00 PM',
    tuesday: '9:00 AM - 10:00 PM',
    wednesday: '9:00 AM - 10:00 PM',
    thursday: '9:00 AM - 10:00 PM',
    friday: '9:00 AM - 10:00 PM',
    saturday: '9:00 AM - 10:00 PM',
    sunday: '9:00 AM - 10:00 PM'
  }
};

export function RestaurantDetailsDialog({
  isOpen,
  onClose,
  onNavigateToMenu,
  locationData,
  location
}: RestaurantDetailsDialogProps) {
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();
  const hours = LOCATION_HOURS[location] || LOCATION_HOURS['Moorestown'];

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[105] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Content - Full Screen on Mobile */}
        <DialogPrimitive.Content className="fixed inset-0 z-[110] bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 flex flex-col">
          
          {/* Accessibility */}
          <DialogPrimitive.Title className="sr-only">
            Restaurant Details
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Detailed information about the restaurant including hours, amenities, and contact details
          </DialogPrimitive.Description>

          {/* Header with Back Button */}
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="flex-1">Restaurant Details</h1>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Map Section */}
            <div className="relative w-full h-52 bg-gray-200">
              <SimpleMapTilerMap
                lat={locationData.coordinates.lat}
                lng={locationData.coordinates.lng}
                zoom={15}
                height={208}
              />
              {/* Map Pin Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                  <path
                    d="M20 0C8.95 0 0 8.95 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 8.95 31.05 0 20 0Z"
                    fill="#A72020"
                  />
                  <circle cx="20" cy="20" r="8" fill="white" />
                </svg>
              </div>
            </div>

            {/* Restaurant Image - Overlapping Map */}
            <div className="relative -mt-16 flex justify-center px-6 mb-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
                <ImageWithFallback
                  src={
                    location === 'Voorhees' 
                      ? "https://drive.google.com/thumbnail?id=1vxeETY1yeVa1OCz2MZdrFowIORXCuFOK&sz=w1000"
                      : location === 'Moorestown'
                      ? "https://drive.google.com/thumbnail?id=1NfEA-XKD79UPLhU9ZwChZxVYZhJTkSTG&sz=w1000"
                      : location === 'Haddonfield'
                      ? "https://drive.google.com/thumbnail?id=1VV5ZUwo791pmbQAHHlcq3kuAK4P4abr_&sz=w1000"
                      : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop"
                  }
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Restaurant Name & Address - Centered */}
            <div className="text-center px-6 mb-6">
              <h2 className="text-2xl text-[#753221] mb-3">{locationData.name}</h2>
              <p className="text-[#A72020] mb-1">
                {locationData.address.split(',')[0]}
              </p>
              <p className="text-[#A72020]">
                {locationData.address.split(',').slice(1).join(',').trim()}
              </p>
            </div>

            {/* Action Buttons - Phone and Share */}
            <div className="flex items-center justify-center gap-6 px-6 mb-6">
              <button
                onClick={() => window.open(`tel:${locationData.phone}`)}
                className="flex items-center gap-2 text-gray-700 hover:text-[#753221] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#753221]" />
                <span>{locationData.phone}</span>
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: locationData.name,
                      text: `Check out ${locationData.name}`,
                      url: window.location.href,
                    }).catch((err) => {
                      // Ignore errors (user cancelled or permission denied)
                      console.log('Share cancelled or failed:', err);
                    });
                  }
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-[#753221] transition-colors"
              >
                <svg className="w-5 h-5 text-[#753221]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Hours Info */}
            <div className="flex items-center justify-center gap-2 px-6 pb-6 border-b border-gray-200">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Open today {hours[currentDay]}</span>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Get Directions Button */}
              <Button
                onClick={() => {
                  const encodedAddress = encodeURIComponent(locationData.address);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
                }}
                className="w-full bg-[#A72020] hover:bg-[#8b1919] text-white py-6"
              >
                GET DIRECTIONS
              </Button>

              {/* Hours Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#753221]" />
                  <h3 className="text-lg">Hours</h3>
                </div>
                <div className="space-y-2 ml-7">
                  {Object.entries(hours).map(([day, hours]) => (
                    <div 
                      key={day} 
                      className={`flex justify-between ${
                        day === currentDay ? 'text-[#753221]' : 'text-gray-700'
                      }`}
                    >
                      <span className="capitalize">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <h3 className="text-lg mb-3">Amenities</h3>
                <div className="space-y-4">
                  {LOCATION_AMENITIES[location]?.map(({ title, description }) => (
                    <div key={title} className="space-y-1">
                      <span className="text-gray-900">{title}</span>
                      <p className="text-gray-600 text-sm">{description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white transition-colors py-6"
                    onClick={onNavigateToMenu}
                  >
                    ORDER NOW
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white transition-colors py-6"
                    onClick={onNavigateToMenu}
                  >
                    VIEW MENU
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white transition-colors py-6"
                  onClick={() => {
                    window.open('https://www.passariellos.com/careers', '_blank');
                  }}
                >
                  CAREERS
                </Button>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">About Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  Passariello's Pizzeria is a family-owned Italian-American restaurant specializing in pizza, pasta, sandwiches, and catering services. We pride ourselves on using fresh ingredients and traditional recipes to bring you the best dining experience.
                </p>
              </div>

              {/* Additional Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white transition-colors py-6"
                  onClick={() => window.open(`tel:${locationData.phone}`)}
                >
                  CALL RESTAURANT
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}