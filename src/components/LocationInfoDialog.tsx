import * as Dialog from '@radix-ui/react-dialog@1.1.6';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { X, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { SimpleMapTilerMap } from './SimpleMapTilerMap';
import { RestaurantDetailsDialog } from './RestaurantDetailsDialog';
import { useState } from 'react';

interface LocationInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeLocation: () => void;
  onNavigateToMenu?: () => void;
  location: string;
}

const LOCATIONS = {
  'Haddonfield': {
    name: "Passariello's Pizzeria",
    address: '119 Kings Hwy E, Haddonfield, NJ 08033',
    phone: '+1 (856) 616-1010',
    coordinates: { lat: 39.89792706143064, lng: -75.03314038686908 },
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop'
  },
  'Moorestown': {
    name: "Passariello's Pizzeria",
    address: '13 W Main St, Moorestown, NJ 08057',
    phone: '+1 (856) 840-0998',
    coordinates: { lat: 39.96395827445834, lng: -74.94753350369767 },
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop'
  },
  'Voorhees': {
    name: "Passariello's Pizzeria",
    address: '111 Laurel Oak Rd, Voorhees, NJ 08043',
    phone: '+1 (856) 784-7272',
    coordinates: { lat: 39.84678444777853, lng: -74.98846601755474 },
    mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop'
  }
};

export function LocationInfoDialog({
  isOpen,
  onClose,
  onChangeLocation,
  onNavigateToMenu,
  location
}: LocationInfoDialogProps) {
  const locationData = LOCATIONS[location as keyof typeof LOCATIONS] || LOCATIONS['Haddonfield'];
  const [restaurantDetailsOpen, setRestaurantDetailsOpen] = useState(false);

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(locationData.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleChangeLocation = () => {
    onClose();
    onChangeLocation();
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay with higher z-index */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[95] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Content - Bottom Sheet Style */}
        <DialogPrimitive.Content className="fixed bottom-0 left-0 right-0 z-[100] max-h-[85vh] bg-white rounded-t-3xl shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300">
          
          {/* Accessibility Title and Description */}
          <DialogPrimitive.Title className="sr-only">
            Location Information
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            View restaurant location details, address, phone number, and get directions
          </DialogPrimitive.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 z-10 w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full"
          >
            <X className="w-7 h-7 text-gray-600 stroke-[2.5]" />
          </button>

          <div className="flex flex-col overflow-y-auto max-h-[calc(85vh-3rem)]">
            {/* Map Section */}
            <div className="relative w-full h-52 bg-gray-200 mt-4">
              <SimpleMapTilerMap
                lat={locationData.coordinates.lat}
                lng={locationData.coordinates.lng}
                zoom={15}
                height={208}
              />
            </div>

            {/* Location Info Section */}
            <div className="flex-1 p-6 space-y-6">
              {/* Location Name & Address */}
              <div className="space-y-3">
                <h2 
                  className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-[#753221] transition-colors"
                  onClick={() => setRestaurantDetailsOpen(true)}
                >
                  {locationData.name}
                </h2>
                
                <div 
                  className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  onClick={() => setRestaurantDetailsOpen(true)}
                >
                  <MapPin className="w-5 h-5 text-[#753221] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{locationData.address}</p>
                </div>

                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  onClick={() => setRestaurantDetailsOpen(true)}
                >
                  <Phone className="w-5 h-5 text-[#753221] flex-shrink-0" />
                  <span className="text-gray-700">{locationData.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const encodedAddress = encodeURIComponent(locationData.address);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
                  }}
                  className="w-full bg-[#A72020] hover:bg-[#8b1919] text-white py-6 text-base font-medium"
                >
                  GET DIRECTIONS
                </Button>

                <Button
                  onClick={handleChangeLocation}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-900 py-6 text-base font-medium"
                >
                  CHANGE LOCATION
                </Button>

                <Button
                  onClick={() => setRestaurantDetailsOpen(true)}
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-900 py-6 text-base font-medium"
                >
                  VIEW RESTAURANT DETAILS
                </Button>

                {onNavigateToMenu && (
                  <Button
                    onClick={onNavigateToMenu}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-900 py-6 text-base font-medium"
                  >
                    VIEW MENU
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>

      <RestaurantDetailsDialog
        isOpen={restaurantDetailsOpen}
        onClose={() => setRestaurantDetailsOpen(false)}
        onNavigateToMenu={onNavigateToMenu}
        locationData={locationData}
        location={location}
      />
    </DialogPrimitive.Root>
  );
}