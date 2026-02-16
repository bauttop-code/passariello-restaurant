import { Home, UtensilsCrossed, MapPin, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface MobileBottomNavProps {
  activeTab?: 'home' | 'menu' | 'locations' | 'more';
  onTabChange?: (tab: 'home' | 'menu' | 'locations' | 'more') => void;
  onMoreClick?: () => void;
}

export function MobileBottomNav({ activeTab = 'menu', onTabChange, onMoreClick }: MobileBottomNavProps) {
  console.log('MobileBottomNav rendered with:', { activeTab, hasOnMoreClick: !!onMoreClick });
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[100] safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {/* Home */}
        <button
          onClick={() => onTabChange?.('home')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
            activeTab === 'home' ? 'text-[#A72020]' : 'text-gray-600'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        {/* Menu & Order */}
        <button
          onClick={() => onTabChange?.('menu')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
            activeTab === 'menu' ? 'text-[#A72020]' : 'text-gray-600'
          }`}
        >
          <UtensilsCrossed className="w-6 h-6" />
          <span className="text-xs">Menu & Order</span>
        </button>

        {/* Locations */}
        <button
          onClick={() => onTabChange?.('locations')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
            activeTab === 'locations' ? 'text-[#A72020]' : 'text-gray-600'
          }`}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-xs">Locations</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('More button clicked');
            onTabChange?.('more');
            onMoreClick?.();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('More button touched');
            onTabChange?.('more');
            onMoreClick?.();
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors relative ${
            activeTab === 'more' ? 'text-[#A72020]' : 'text-gray-600'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'rgba(167, 32, 32, 0.3)',
            minHeight: '64px',
            minWidth: '64px',
            padding: '8px',
            cursor: 'pointer',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}