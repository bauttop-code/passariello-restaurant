import { MapPin, ShoppingBag, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { LocationInfoDialog } from './LocationInfoDialog';
import { useState } from 'react';

interface MobileHomeScreenProps {
  currentLocation: string;
  onLocationClick: () => void;
  onOrderNow: () => void;
  onJoinWaitlist: () => void;
  onOpenDeliveryModal: () => void;
  onNavigateToMenu?: () => void;
  onSignInClick?: () => void;
  onCartClick?: () => void;
}

export function MobileHomeScreen({
  currentLocation,
  onLocationClick,
  onOrderNow,
  onJoinWaitlist,
  onOpenDeliveryModal,
  onNavigateToMenu,
  onSignInClick,
  onCartClick
}: MobileHomeScreenProps) {
  const [isLocationInfoDialogOpen, setIsLocationInfoDialogOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-white z-[90] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#A72020] text-white flex-shrink-0">
        <div className="flex flex-col items-center cursor-pointer" onClick={onSignInClick}>
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Login</span>
        </div>
        <div className="flex flex-col items-center">
          <ImageWithFallback             src="https://drive.google.com/thumbnail?id=1C18ip1lY4KYgvuNCAcrcbP9ONZ2xeLkD&sz=w1000"
            alt="Passariello's Logo"
            className="h-10 object-contain"
          />
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={onCartClick}>
          <ShoppingBag className="w-6 h-6 mb-1" />
          <span className="text-xs">Cart</span>
        </div>
      </div>

      {/* Hero Image - Full Screen */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background Image */}
        <ImageWithFallback           src="https://images.unsplash.com/photo-1730983735521-3067910bd4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwZm9vZCUyMHBpenphJTIwcGFzdGF8ZW58MXx8fHwxNzY0NDMxNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Italian Food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* SVG Gradient Overlays */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="topGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A72020" stopOpacity="1" />
              <stop offset="50%" stopColor="#A72020" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#A72020" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bottomGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="40%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Top gradient - brown matching header */}
          <rect x="0" y="0" width="100%" height="30%" fill="url(#topGradient)" />
          
          {/* Bottom gradient - white */}
          <rect x="0" y="50%" width="100%" height="50%" fill="url(#bottomGradient)" />
        </svg>
        
        {/* Location Button - Floating over image */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-10">
          <button
            onClick={() => setIsLocationInfoDialogOpen(true)}
            className="w-full py-3 px-5 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">{currentLocation}</span>
            </div>
            <div className="text-gray-400 text-xl">›</div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 space-y-3 bg-white flex-shrink-0 pb-24">
        <Button
          onClick={onOrderNow}
          className="w-full py-4 bg-[#A72020] text-white rounded-lg shadow-lg tracking-wide"
        >
          ORDER NOW
        </Button>
        
        <Button
          onClick={() => window.open('https://www.passariellos.com/passarielloseclub', '_blank')}
          className="w-full py-4 bg-white border-2 border-[#A72020] text-[#A72020] rounded-lg tracking-wide hover:bg-[#A72020] hover:text-white transition-colors"
        >
          JOIN eCLUB
        </Button>
      </div>

      {/* Location Info Dialog */}
      <LocationInfoDialog
        isOpen={isLocationInfoDialogOpen}
        onClose={() => setIsLocationInfoDialogOpen(false)}
        onChangeLocation={onOpenDeliveryModal}
        onNavigateToMenu={onNavigateToMenu}
        location={currentLocation}
      />
    </div>
  );
}