import { UtensilsCrossed, Users, RotateCcw, ShoppingBag, Truck, Mail, Gift, Settings, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MobileMoreScreenProps {
  user?: { name: string; email: string } | null;
  isLoadingAuth?: boolean;
  onSignInClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  onMenuOrderClick: () => void;
  onJoinWaitlistClick: () => void;
  onReorderClick: () => void;
  onTogoDeliveryClick: () => void;
  onCateringClick: () => void;
  onJoinClubClick: () => void;
  onGiftCardsClick: () => void;
  onSettingsClick: () => void;
}

export function MobileMoreScreen({
  user,
  isLoadingAuth = false,
  onSignInClick,
  onRegisterClick,
  onLogout,
  onMenuOrderClick,
  onJoinWaitlistClick,
  onReorderClick,
  onTogoDeliveryClick,
  onCateringClick,
  onJoinClubClick,
  onGiftCardsClick,
  onSettingsClick,
}: MobileMoreScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Logo */}
      <div className="bg-[#A72020] py-8 px-4">
        <div className="flex items-center justify-center">
          <ImageWithFallback             src="https://drive.google.com/thumbnail?id=1C18ip1lY4KYgvuNCAcrcbP9ONZ2xeLkD&sz=w1000"
            alt="Passariello's"
            className="h-16 object-contain mx-auto"
          />
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 pt-6">
        {/* Main Menu Section */}
        <div className="px-4">
          <button
            onClick={onMenuOrderClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <UtensilsCrossed className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Menu & Order</span>
          </button>



          <button
            onClick={onReorderClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Reorder</span>
          </button>

          <button
            onClick={onTogoDeliveryClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Delivery</span>
          </button>

          <button
            onClick={onCateringClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Truck className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Catering Delivery</span>
          </button>
        </div>

        {/* Secondary Menu Section */}
        <div className="px-4 mt-6">
          <button
            onClick={onJoinClubClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Join eClub</span>
          </button>

          <button
            onClick={onGiftCardsClick}
            className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <Gift className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Gift Cards</span>
          </button>

          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-600" />
            <span className="text-gray-900 text-lg">Settings</span>
          </button>
        </div>

        {/* User Section */}
        {user ? (
          <div className="px-4 mt-8 pb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-[#A72020]" />
                <span className="text-gray-900">{user.name}</span>
              </div>
              <p className="text-sm text-gray-600 ml-8">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-3 px-6 bg-white border-2 border-[#A72020] text-[#A72020] rounded-full hover:bg-[#A72020] hover:text-white transition-colors"
            >
              LOG OUT
            </button>
          </div>
        ) : (
          <div className="px-4 mt-8 pb-6">
            <p className="text-center text-gray-500 text-xs mb-6 whitespace-nowrap">
              Enjoy features like Reorder and Adding Favorite Locations
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onRegisterClick}
                disabled={isLoadingAuth}
                className="flex-1 py-2.5 px-4 bg-white border-2 border-[#A72020] text-[#A72020] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
              >
                CREATE ACCOUNT
              </button>
              
              <button
                onClick={onSignInClick}
                disabled={isLoadingAuth}
                className="flex-1 py-2.5 px-4 bg-[#A72020] text-white rounded-full hover:bg-[#8a1919] transition-colors disabled:opacity-50 text-sm"
              >
                LOG IN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
