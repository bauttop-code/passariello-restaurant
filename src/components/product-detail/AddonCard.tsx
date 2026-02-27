import React from 'react';
import { Check } from 'lucide-react';
import { QuantityStepper } from './QuantityStepper';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AddonCardProps {
  item: { id: string; name: string; price: string | number; image?: string };
  quantity: number;
  isActive: boolean;
  onSelect: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  showQuantityControls?: boolean;
}

export const AddonCard = ({
  item,
  quantity,
  isActive,
  onSelect,
  onIncrement,
  onDecrement,
  showQuantityControls = true
}: AddonCardProps) => {
  const isSelected = quantity > 0;
  // Format price if it's a number
  const priceDisplay = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price;

  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center gap-3 h-28 rounded-lg overflow-hidden border cursor-pointer transition-colors ${
        isSelected ? 'border-[#A72020] bg-[#F6F6F6]' : 'border-gray-200 bg-[#F6F6F6] hover:border-[#A72020]'
      }`}
    >
      {/* Check circle */}
      <div className="absolute top-2 right-2 z-10">
        {quantity > 0 ? (
          <div className="w-6 h-6 rounded-full border-2 border-[#A72020] bg-[#A72020] flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
        )}
      </div>
      
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 ml-2">
        <ImageWithFallback           src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-md" 
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center gap-1 pr-2">
        <p className="font-semibold text-sm leading-tight line-clamp-2">{item.name}</p>
        <p className="text-xs text-gray-600">{priceDisplay}</p>
        
        {/* Controls - Visible if Active AND Selected (qty > 0) */}
        {showQuantityControls && isActive && quantity > 0 && (
          <QuantityStepper 
            quantity={quantity} 
            onIncrement={onIncrement || (() => {})} 
            onDecrement={onDecrement || (() => {})}
            min={0}
          />
        )}
      </div>
    </div>
  );
};
