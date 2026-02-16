import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export const QuantityStepper = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99
}: QuantityStepperProps) => {
  return (
    <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (quantity > min) onDecrement();
        }}
        disabled={quantity <= min}
        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
          quantity <= min 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#A72020] text-white hover:bg-[#8B1B1B]'
        }`}
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="font-bold text-sm min-w-[1rem] text-center text-gray-900">{quantity}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (quantity < max) onIncrement();
        }}
        disabled={quantity >= max}
        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
          quantity >= max
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#A72020] text-white hover:bg-[#8B1B1B]'
        }`}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
