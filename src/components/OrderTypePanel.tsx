import { X, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { DateTimeField, formatDateLabel, formatTimeLabel } from './DateTimeField';
import { GoogleMapEmbed } from './GoogleMapEmbed';

interface OrderTypePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'Pickup' | 'Delivery';
  currentScheduledTime: string;
  location: string;
  deliveryAddress?: { address: string; city: string; state: string; zip: string };
  onConfirm: (mode: 'Pickup' | 'Delivery', scheduledTime: string) => void;
  // Props for pickup map
  userCoords?: { lat: number; lng: number } | null;
  stores?: Array<{
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  }>;
  locationLoading?: boolean;
}

export function OrderTypePanel({
  isOpen,
  onClose,
  currentMode,
  currentScheduledTime,
  location,
  deliveryAddress,
  onConfirm,
  userCoords,
  stores,
  locationLoading,
}: OrderTypePanelProps) {
  const [selectedMode, setSelectedMode] = useState<'Pickup' | 'Delivery'>(currentMode);
  const [pickupType, setPickupType] = useState<'ASAP' | 'Scheduled'>(
    currentScheduledTime === 'ASAP' ? 'ASAP' : 'Scheduled'
  );
  const [deliveryType, setDeliveryType] = useState<'ASAP' | 'Scheduled'>('ASAP');
  
  // Calculate default time (current time + 30 minutes)
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    
    // Round up to next 15-minute interval
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    return now;
  };

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(getDefaultDateTime());

  // Handle datetime change from DateTimeField
  const handleDateTimeChange = (date: Date | null) => {
    if (date) {
      setSelectedDateObj(date);
    }
  };

  const handleConfirm = () => {
    let scheduledTime = 'ASAP';
    
    if (selectedMode === 'Pickup' && pickupType === 'Scheduled') {
      const dateLabel = formatDateLabel(selectedDateObj);
      const timeLabel = formatTimeLabel(
        `${selectedDateObj.getHours().toString().padStart(2, '0')}:${selectedDateObj.getMinutes().toString().padStart(2, '0')}`
      );
      scheduledTime = `${dateLabel} at ${timeLabel}`;
    }
    
    if (selectedMode === 'Delivery' && deliveryType === 'Scheduled') {
      const dateLabel = formatDateLabel(selectedDateObj);
      const timeLabel = formatTimeLabel(
        `${selectedDateObj.getHours().toString().padStart(2, '0')}:${selectedDateObj.getMinutes().toString().padStart(2, '0')}`
      );
      scheduledTime = `${dateLabel} at ${timeLabel}`;
    }
    
    onConfirm(selectedMode, scheduledTime);
    
    // Only close the panel if it's Pickup
    // For Delivery, let App.tsx handle the panel closing and opening delivery modal
    if (selectedMode === 'Pickup') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[120] transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[340px] bg-white shadow-2xl z-[121] flex flex-col animate-in slide-in-from-right duration-300 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Select Order Type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tabs - Pill Style */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setSelectedMode('Pickup')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                selectedMode === 'Pickup'
                  ? 'bg-[#A72020] text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Pickup
            </button>
            <button
              onClick={() => setSelectedMode('Delivery')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                selectedMode === 'Delivery'
                  ? 'bg-[#A72020] text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Delivery
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5">
          {selectedMode === 'Pickup' ? (
            <>
              {/* Pickup Location Map - UNIFIED Google Maps (same as Delivery) */}
              <GoogleMapEmbed
                mode="pickup"
                userCoords={userCoords ? {
                  lat: userCoords.lat,
                  lng: userCoords.lng
                } : null}
                stores={stores?.map(s => ({
                  id: s.id,
                  name: s.name,
                  lat: s.lat,
                  lng: s.lng,
                  address: `${s.address}, ${s.city}, ${s.state} ${s.zip}`
                }))}
                loading={locationLoading}
                height={280}
                showLocationList={true}
              />
              
              {/* ASAP/Scheduled Tabs */}
              <div className="flex border-b border-gray-200 mb-4 mt-4">
                <button
                  onClick={() => setPickupType('ASAP')}
                  className={`flex-1 py-3 text-sm font-semibold relative ${
                    pickupType === 'ASAP'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  ASAP
                  {pickupType === 'ASAP' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A72020]" />
                  )}
                </button>
                <button
                  onClick={() => setPickupType('Scheduled')}
                  className={`flex-1 py-3 text-sm font-semibold relative ${
                    pickupType === 'Scheduled'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  Scheduled
                  {pickupType === 'Scheduled' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A72020]" />
                  )}
                </button>
              </div>

              {/* ASAP Content */}
              {pickupType === 'ASAP' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">ASAP (25 min) after checkout</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pickup times are continuously updated based on restaurant availability. If a specific date or time shows as unavailable, that time slot is full and is not available for online, phone, or in-restaurant Delivery orders.
                  </p>
                </div>
              )}

              {/* Scheduled Content */}
              {pickupType === 'Scheduled' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Pickup Date and Time</h3>
                  
                  <DateTimeField
                    value={selectedDateObj}
                    onChange={handleDateTimeChange}
                  />

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pickup times are continuously updated based on restaurant availability. If a specific date or time shows as unavailable, that time slot is full and is not available for online, phone, or in-restaurant Delivery orders.
                  </p>
                </div>
              )}
            </>
          ) : (
            // Delivery Content
            <>
              {/* ASAP/Scheduled Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setDeliveryType('ASAP')}
                  className={`flex-1 py-3 text-sm font-semibold relative ${
                    deliveryType === 'ASAP'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  ASAP
                  {deliveryType === 'ASAP' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A72020]" />
                  )}
                </button>
                <button
                  onClick={() => setDeliveryType('Scheduled')}
                  className={`flex-1 py-3 text-sm font-semibold relative ${
                    deliveryType === 'Scheduled'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  Scheduled
                  {deliveryType === 'Scheduled' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A72020]" />
                  )}
                </button>
              </div>

              {/* ASAP Content */}
              {deliveryType === 'ASAP' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">ASAP (45-60 min) after checkout</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Delivery times are continuously updated based on restaurant availability and driver capacity. If a specific date or time shows as unavailable, that time slot is full.
                  </p>
                </div>
              )}

              {/* Scheduled Content */}
              {deliveryType === 'Scheduled' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Delivery Date and Time</h3>
                  
                  <DateTimeField
                    value={selectedDateObj}
                    onChange={handleDateTimeChange}
                  />

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Delivery times are continuously updated based on restaurant availability and driver capacity. If a specific date or time shows as unavailable, that time slot is full.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Confirm Button */}
        <div className="p-5 pt-4">
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#A72020] hover:bg-[#8B0000] text-white py-3 rounded-lg font-semibold"
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </>
  );
}