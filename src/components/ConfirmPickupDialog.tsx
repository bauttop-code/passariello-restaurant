import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, X, Clock, ChevronRight, Calendar } from 'lucide-react';
import { DateTimeField } from './DateTimeField';
import { MapTilerLocationsMap } from './MapTilerLocationsMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface ConfirmPickupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  location?: string;
  address?: string;
  city?: string;
  zip?: string;
  onChangeLocation?: () => void;
  deliveryMode?: 'Pickup' | 'Delivery';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  // NEW: Props for pickup map with multiple locations
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
}

// Helper function to calculate current time + 30 minutes, rounded to next 15-min interval
const getDefaultTime = () => {
  const now = new Date();
  // Add 30 minutes
  now.setMinutes(now.getMinutes() + 30);
  
  // Round up to next 15-minute interval
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  
  // Format to AM/PM
  let hours = now.getHours();
  const mins = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minsStr = mins === 0 ? '00' : mins.toString().padStart(2, '0');
  
  return `${hours}:${minsStr} ${ampm}`;
};

// Get formatted today's date
const getTodayFormatted = () => {
  const today = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `Today, ${monthNames[today.getMonth()]} ${today.getDate()}`;
};

export function ConfirmPickupDialog({
  isOpen,
  onClose,
  onConfirm,
  location = 'Haddonfield',
  address = '119 Kings Hwy E',
  city = 'Haddonfield',
  zip = '08033',
  onChangeLocation,
  deliveryMode = 'Pickup',
  deliveryAddress,
  deliveryCity,
  deliveryZip,
  // NEW: Props for pickup map with multiple locations
  userCoords,
  stores,
}: ConfirmPickupDialogProps) {
  const [pickupType, setPickupType] = useState<'asap' | 'scheduled'>('asap');
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  const [selectedTime, setSelectedTime] = useState(getDefaultTime());

  // Generate date options (today + next 7 days)
  const generateDateOptions = () => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayPrefix = i === 0 ? 'Today, ' : i === 1 ? 'Tomorrow, ' : '';
      const formattedDate = `${dayPrefix}${monthNames[date.getMonth()]} ${date.getDate()}`;
      
      dates.push(formattedDate);
    }
    
    return dates;
  };

  // Generate time slots (every 15 minutes from 11:00 AM to 10:00 PM)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 22 && minute > 0) break;
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const dateOptions = generateDateOptions();
  const timeSlots = generateTimeSlots();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirm Pickup Details</DialogTitle>
          <DialogDescription>
            Select your pickup location and time for your order
          </DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {deliveryMode === 'Delivery' ? 'Confirm Delivery Details' : 'Confirm Pickup Details'}
          </h2>
          <button
            onClick={onClose}
            className="hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map */}
        <div className="w-full h-48 bg-gray-200 relative">
          {deliveryMode === 'Pickup' && userCoords && stores && stores.length > 0 ? (
            <MapTilerLocationsMap
              userCoords={userCoords}
              stores={stores}
              mode="pickup"
              height={192}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Store Locations List (Pickup only) */}
        {/* REMOVED: ALL PICKUP LOCATIONS section as per user request */}

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Pickup From / Delivery To Section */}
          <div>
            <div className="text-xs tracking-wider text-gray-600 mb-3 font-semibold">
              {deliveryMode === 'Delivery' ? 'DELIVERY TO' : 'PICKUP FROM'}
            </div>
            <div className="flex items-start justify-between">
              <div>
                {deliveryMode === 'Delivery' ? (
                  // Show delivery address
                  <>
                    <div className="font-bold text-gray-900 text-lg mb-1">Your Address</div>
                    <div className="text-gray-600 text-sm">{deliveryAddress || 'No address set'}</div>
                    <div className="text-gray-600 text-sm">{deliveryCity ? `${deliveryCity}, NJ ${deliveryZip}` : ''}</div>
                  </>
                ) : (
                  // Show pickup location (restaurant)
                  <>
                    <div className="font-bold text-gray-900 text-lg mb-1">{location}</div>
                    <div className="text-gray-600 text-sm">{address}</div>
                    <div className="text-gray-600 text-sm">{city}, NJ {zip}</div>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                className="border-[#A72020] text-[#A72020] hover:bg-[#A72020] hover:text-white transition-colors px-6"
                onClick={onChangeLocation}
              >
                CHANGE LOCATION
              </Button>
            </div>
          </div>

          {/* Pickup Date and Time Section */}
          <div>
            <div className="text-xs tracking-wider text-gray-600 mb-3 font-semibold">
              {deliveryMode === 'Delivery' ? 'DELIVERY DATE AND TIME' : 'PICKUP DATE AND TIME'}
            </div>

            <Tabs value={pickupType} onValueChange={(v) => setPickupType(v as 'asap' | 'scheduled')} className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-12 bg-transparent p-0 border-b rounded-none">
                <TabsTrigger
                  value="asap"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#A72020] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#A72020] text-gray-600 font-semibold"
                >
                  ASAP
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#A72020] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#A72020] text-gray-600 font-semibold"
                >
                  Scheduled
                </TabsTrigger>
              </TabsList>

              <TabsContent value="asap" className="mt-4">
                <div className="flex items-center gap-3 py-3">
                  <Clock className="w-5 h-5 text-[#A72020]" />
                  <span className="text-gray-700">ASAP (25 min) after checkout</span>
                </div>
              </TabsContent>

              <TabsContent value="scheduled" className="mt-4 space-y-3">
                {/* Date Selector */}
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-full h-12 border-gray-300">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#A72020]" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    {dateOptions.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Time Selector */}
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full h-12 border-gray-300">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#A72020]" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] z-[200]">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>
          </div>

          {/* Confirm Button */}
          <Button
            className="w-full h-12 bg-[#A72020] hover:bg-[#8B1A1A] text-white font-semibold text-base"
            onClick={onConfirm}
          >
            CONFIRM AND CONTINUE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}