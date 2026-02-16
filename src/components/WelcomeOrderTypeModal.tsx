import { X, ShoppingBag, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect } from 'react';

interface WelcomeOrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPickup: () => void;
  onSelectDelivery: () => void;
}

export function WelcomeOrderTypeModal({ 
  isOpen, 
  onClose, 
  onSelectPickup, 
  onSelectDelivery 
}: WelcomeOrderTypeModalProps) {
  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-[500px] w-full mx-4 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#A72020] mb-2">
            Choose your Order Type
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Enjoy convenient Curbside <span className="font-semibold">PICKUP</span> or <span className="font-semibold">DELIVERY</span> straight to your door
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Pickup Option */}
          <button
            onClick={() => {
              onClose();
              onSelectPickup();
            }}
            className="group flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-gray-300 rounded-lg hover:border-[#A72020] hover:bg-[#FFF5F5] transition-all"
          >
            <div className="bg-[#FFF5F5] p-3 sm:p-4 rounded-full mb-3 group-hover:bg-[#A72020] transition-colors">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#A72020] group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#A72020] transition-colors flex items-center gap-1">
              Pickup
              <span className="text-[#A72020]">→</span>
            </span>
          </button>

          {/* Delivery Option */}
          <button
            onClick={() => {
              onSelectDelivery(); // ✅ PRIMERO ejecutar la acción
              onClose();           // ✅ DESPUÉS cerrar el modal
            }}
            className="group flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-gray-300 rounded-lg hover:border-[#A72020] hover:bg-[#FFF5F5] transition-all"
          >
            <div className="bg-[#FFF5F5] p-3 sm:p-4 rounded-full mb-3 group-hover:bg-[#A72020] transition-colors">
              <Home className="w-8 h-8 sm:w-10 sm:h-10 text-[#A72020] group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#A72020] transition-colors flex items-center gap-1">
              Delivery
              <span className="text-[#A72020]">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}