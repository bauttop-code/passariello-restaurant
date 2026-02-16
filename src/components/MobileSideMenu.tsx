import { MapPin, User, Mail, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface MobileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'regular' | 'guest-favorites' | 'catering';
  onModeChange: (mode: 'regular' | 'guest-favorites' | 'catering') => void;
  deliveryMode: 'Pickup' | 'Delivery';
  currentLocation?: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  onLocationClick?: () => void;
  user?: { name: string; email: string } | null;
  isLoadingAuth?: boolean;
  onSignInClick: () => void;
  onLogout: () => void;
}

export function MobileSideMenu({
  isOpen,
  onClose,
  mode,
  onModeChange,
  deliveryMode,
  currentLocation = 'Cherry Hill',
  deliveryAddress,
  onLocationClick,
  user,
  isLoadingAuth = false,
  onSignInClick,
  onLogout,
}: MobileSideMenuProps) {
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[115]"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[120] overflow-y-auto"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="p-6 space-y-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Menu Type</h3>
            <button
              onClick={() => {
                onModeChange('regular');
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'regular'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              MENU
            </button>
            <button
              onClick={() => {
                onModeChange('guest-favorites');
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'guest-favorites'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              GUEST FAVORITES
            </button>
            <button
              onClick={() => {
                onModeChange('catering');
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'catering'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CATERING
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Delivery</h3>
            <button
              onClick={() => {
                onLocationClick?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <MapPin className="w-5 h-5 text-[#A72020]" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {deliveryMode === 'Pickup' 
                    ? `Pickup | ${currentLocation}, NJ` 
                    : deliveryAddress 
                      ? `Delivery | ${deliveryAddress.zip}`
                      : 'Set delivery address'
                  }
                </div>
                <div className="text-xs text-gray-500">Tap to change</div>
              </div>
            </button>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Account</h3>
            {isLoadingAuth ? (
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400 animate-pulse" />
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-[#A72020]/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#A72020]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onSignInClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                <User className="w-5 h-5 text-[#A72020]" />
                <span className="text-sm font-medium text-gray-900">Sign In / Sign Up</span>
              </button>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3 pt-6 border-t">
            <a
              href="tel:+18564288400"
              className="flex items-center gap-3 text-gray-700 hover:text-[#A72020] transition-colors"
            >
              <span className="text-sm">📞 Call: (856) 428-8400</span>
            </a>
            <a
              href="https://www.passariellos.com/passarielloseclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-[#A72020] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">Join Passariello's eClub</span>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}