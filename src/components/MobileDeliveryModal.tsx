import { X, MapPin, Calendar, Clock, ShoppingBag, Truck, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGeocodeAddress } from '../hooks/useGeocodeAddress';
import { DeliveryMapIframe } from './DeliveryMapIframe';

interface MobileDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'Pickup' | 'Delivery';
  currentLocation: string;
  currentDate: string;
  currentTime: string;
  onConfirm: (mode: 'Pickup' | 'Delivery', location: string, date: string, time: string) => void;
  onDeliveryConfirm?: () => void;
  onDeliveryInfoSubmit?: (info: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    zipCode: string;
  }) => void;
  // Initial values for the delivery form
  initialDeliveryInfo?: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    zipCode: string;
  };
  // Optional callbacks to parent
  onDeliveryModeChange?: (mode: 'Pickup' | 'Delivery') => void;
  onLocationChange?: (location: string) => void;
  onScheduledDateChange?: (date: string) => void;
  onScheduledTimeChange?: (time: string) => void;
}

const locations = [
  'Moorestown',
  'Haddonfield',
  'Voorhees',
];

const dates = [
  'Today',
  'Tomorrow',
  'Monday, Dec 2',
  'Tuesday, Dec 3',
  'Wednesday, Dec 4',
];

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
  const minsStr = mins === 0 ? '00' : mins.toString();
  
  return `${hours}:${minsStr} ${ampm}`;
};

// Generate available time slots starting from now + 30 minutes
const generateTimeSlots = () => {
  const slots: string[] = [];
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  
  // Round up to next 15-minute interval
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  
  // Generate slots for the next 12 hours (48 slots of 15 minutes)
  for (let i = 0; i < 48; i++) {
    const timeSlot = new Date(now.getTime() + i * 15 * 60 * 1000);
    let hours = timeSlot.getHours();
    const mins = timeSlot.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minsStr = mins === 0 ? '00' : mins < 10 ? `0${mins}` : mins.toString();
    
    slots.push(`${hours}:${minsStr} ${ampm}`);
  }
  
  return slots;
};

export function MobileDeliveryModal({
  isOpen,
  onClose,
  currentMode,
  currentLocation,
  currentDate,
  currentTime,
  onConfirm,
  onDeliveryConfirm,
  onDeliveryInfoSubmit,
  initialDeliveryInfo,
  onDeliveryModeChange,
  onLocationChange,
  onScheduledDateChange,
  onScheduledTimeChange
}: MobileDeliveryModalProps) {
  // Get current date info
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.toLocaleString('en-US', { month: 'long' });
  const todayFormatted = `Today, ${today.toLocaleString('en-US', { month: 'short' })} ${todayDay}`;

  const [selectedMode, setSelectedMode] = useState<'Pickup' | 'Delivery'>(currentMode);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [selectedDate, setSelectedDate] = useState(todayFormatted); // Use today's date
  const [selectedTime, setSelectedTime] = useState(getDefaultTime());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(todayMonth); // Use current month
  const [selectedDay, setSelectedDay] = useState(todayDay); // Use today's day
  
  // Delivery form state
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [fullName, setFullName] = useState(initialDeliveryInfo?.fullName || '');
  const [phone, setPhone] = useState(initialDeliveryInfo?.phone || '');
  const [email, setEmail] = useState(initialDeliveryInfo?.email || '');
  const [address, setAddress] = useState(initialDeliveryInfo?.address || '');
  const [zipCode, setZipCode] = useState(initialDeliveryInfo?.zipCode || '');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Geocoding hook para mostrar el mapa de la dirección
  const { coords, loading: geocodeLoading, error: geocodeError } = useGeocodeAddress(address, zipCode);

  // Sync state when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedMode(currentMode);
      setSelectedLocation(currentLocation);
      // Recalculate date and time dynamically when modal opens
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleString('en-US', { month: 'short' });
      setSelectedDate(`Today, ${month} ${day}`);
      setSelectedTime(getDefaultTime());
      setCurrentMonth(now.toLocaleString('en-US', { month: 'long' }));
      setSelectedDay(day);
      
      // Update form fields if initialDeliveryInfo is provided
      if (initialDeliveryInfo) {
        setFullName(initialDeliveryInfo.fullName);
        setPhone(initialDeliveryInfo.phone);
        setEmail(initialDeliveryInfo.email);
        setAddress(initialDeliveryInfo.address);
        setZipCode(initialDeliveryInfo.zipCode);
      }
    }
  }, [isOpen, currentMode, currentLocation, initialDeliveryInfo]);

  // ✅ FIX: Auto-mostrar formulario de delivery cuando el modal abre en modo Delivery
  useEffect(() => {
    if (isOpen && (currentMode === 'Delivery' || selectedMode === 'Delivery')) {
      setShowDeliveryForm(true);
    } else {
      // Reset form cuando cambia a Pickup
      setShowDeliveryForm(false);
    }
  }, [isOpen, currentMode, selectedMode]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedMode === 'Delivery') {
      // Si es delivery y no hemos mostrado el formulario, mostrarlo
      if (!showDeliveryForm) {
        setShowDeliveryForm(true);
        return;
      }
    }
    
    // Para Pickup o después de completar el formulario de Delivery
    if (selectedMode === 'Delivery' && onDeliveryConfirm) {
      onConfirm(selectedMode, selectedLocation, selectedDate, selectedTime);
      onClose();
      setTimeout(() => {
        onDeliveryConfirm();
      }, 100);
    } else {
      onConfirm(selectedMode, selectedLocation, selectedDate, selectedTime);
      onClose();
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!address.trim()) {
      errors.address = 'Delivery address is required';
    }
    
    if (!zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,8}$/.test(zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code (5-8 digits)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeliveryFormSubmit = () => {
    console.log('Form submitted with:', { fullName, phone, email, address, zipCode });
    
    if (validateForm()) {
      console.log('Form is valid, proceeding...');
      
      if (onDeliveryInfoSubmit) {
        onDeliveryInfoSubmit({
          fullName,
          phone,
          email,
          address,
          zipCode
        });
      }
      // Confirmar y cerrar el modal directamente
      onConfirm(selectedMode, selectedLocation, selectedDate, selectedTime);
      onClose();
      if (onDeliveryConfirm) {
        setTimeout(() => {
          onDeliveryConfirm();
        }, 100);
      }
    } else {
      console.log('Form validation failed');
    }
  };

  const handleDeliveryContinue = () => {
    setShowDeliveryForm(true);
  };

  const handleCalendarConfirm = () => {
    setSelectedDate(`${currentMonth} ${selectedDay}`);
    setIsCalendarOpen(false);
  };

  // Generate calendar days dynamically based on current month
  const getMonthInfo = (monthName: string) => {
    const year = today.getFullYear();
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    return {
      daysInMonth: lastDay.getDate(),
      firstDayOfWeek: firstDay.getDay(), // 0 = Sunday, 6 = Saturday
    };
  };

  const monthInfo = getMonthInfo(currentMonth);
  const weeks = [];
  let days: (number | null)[] = [];
  
  // Add empty slots for days before month starts
  for (let i = 0; i < monthInfo.firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= monthInfo.daysInMonth; day++) {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }
  
  // Add remaining days to last week
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(null);
    }
    weeks.push(days);
  }

  return (
    <div 
      data-testid="mobile-delivery-modal"
      className="fixed inset-0 z-[200]"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl md:relative md:bottom-auto md:inset-x-auto md:mx-auto md:top-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl">
        {/* Header with Pickup/Delivery Tabs */}
        <div className="sticky top-0 bg-white border-b">
          <div className="relative flex items-center justify-center px-4 py-3">
            {/* Tabs - Centered */}
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setSelectedMode('Pickup');
                  setShowDeliveryForm(false);
                  setFormErrors({});
                  if (onDeliveryModeChange) {
                    onDeliveryModeChange('Pickup');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedMode === 'Pickup'
                    ? 'bg-[#A72020]/10 text-[#A72020]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Pickup</span>
              </button>
              <button
                onClick={() => {
                  setSelectedMode('Delivery');
                  setShowDeliveryForm(false);
                  setFormErrors({});
                  if (onDeliveryModeChange) {
                    onDeliveryModeChange('Delivery');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedMode === 'Delivery'
                    ? 'bg-[#A72020]/10 text-[#A72020]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="font-medium">Delivery</span>
              </button>
            </div>
            
            {/* Close Button - Absolute positioned */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">

          {selectedMode === 'Delivery' ? (
            /* Delivery Content */
            <>
              {!showDeliveryForm ? (
                /* Step 1: Confirmation Message */
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Change to Delivery?
                    </h2>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Changing to Delivery may update your order date and time</span>
                      </li>
                    </ul>
                  </div>

                  {/* Confirm Button for Delivery */}
                  <button
                    onClick={handleConfirm}
                    className="w-full py-4 bg-[#A72020] text-white font-semibold rounded-lg hover:bg-[#8b1919] transition-colors"
                  >
                    CONFIRM
                  </button>
                </>
              ) : (
                /* Step 2: Delivery Information Form */
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Delivery Information
                    </h2>
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.fullName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#A72020]/20 focus:border-[#A72020]'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 555-5555"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.phone
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#A72020]/20 focus:border-[#A72020]'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.email
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#A72020]/20 focus:border-[#A72020]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main Street"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.address
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#A72020]/20 focus:border-[#A72020]'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                      )}
                    </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={zipCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 8) {
                            setZipCode(value);
                          }
                        }}
                        placeholder="12345"
                        maxLength={8}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.zipCode
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#A72020]/20 focus:border-[#A72020]'
                        }`}
                      />
                      {formErrors.zipCode && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.zipCode}</p>
                      )}
                    </div>

                    {/* Map Preview - Shown when address + zip are filled */}
                    <DeliveryMapIframe
                      coords={coords}
                      loading={geocodeLoading}
                      error={geocodeError}
                      query={`${address}, ${zipCode}`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleDeliveryFormSubmit}
                    className="w-full py-4 bg-[#A72020] text-white font-semibold rounded-lg hover:bg-[#8b1919] transition-colors"
                  >
                    CONFIRM
                  </button>
                </>
              )}
            </>
          ) : (
            /* Pickup Content */
            <>
              {/* Location Selector */}
              <div>
                <label className="block font-semibold text-gray-900 mb-2">
                  Ordering from
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A72020]" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      if (onLocationChange) {
                        onLocationChange(e.target.value);
                      }
                    }}
                    className="w-full py-3 pl-12 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-[#A72020] focus:outline-none transition-colors appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

          {/* Date and Time Selectors */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              {selectedMode} Date and Time
            </label>
            <div className="space-y-3">
              {/* Date Button with Calendar Popup */}
              <div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A72020]" />
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full py-3 pl-12 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-[#A72020] focus:outline-none transition-colors text-left"
                  >
                    {selectedDate}
                  </button>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Calendar Dropdown */}
                {isCalendarOpen && (
                  <div className="mt-2 border border-gray-300 rounded-lg bg-white p-4 shadow-lg">
                    {/* Month Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{currentMonth}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          // Toggle between November and December
                          setCurrentMonth(currentMonth === 'November' ? 'December' : 'November');
                        }}
                        className="flex items-center gap-1 text-sm text-[#A72020] hover:text-[#8b1919]"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs text-gray-600 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="space-y-1">
                      {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-1">
                          {week.map((day, dayIndex) => (
                            <button
                              key={dayIndex}
                              type="button"
                              onClick={() => day && setSelectedDay(day)}
                              disabled={!day}
                              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                                day === selectedDay
                                  ? 'bg-[#A72020] text-white font-semibold'
                                  : day
                                  ? 'hover:bg-gray-100 text-gray-900'
                                  : 'text-transparent cursor-default'
                              }`}
                            >
                              {day || ''}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Confirm Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCalendarConfirm();
                        if (onScheduledDateChange) {
                          onScheduledDateChange(`${currentMonth} ${selectedDay}`);
                        }
                      }}
                      className="w-full mt-4 py-2 bg-[#A72020] text-white font-semibold rounded-lg hover:bg-[#8b1919] transition-colors text-sm"
                    >
                      CONFIRM
                    </button>
                  </div>
                )}
              </div>

              {/* Time Button with Dropdown */}
              <div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A72020]" />
                  <button
                    type="button"
                    onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    className="w-full py-3 pl-12 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-[#A72020] focus:outline-none transition-colors text-left"
                  >
                    {selectedTime}
                  </button>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Time Picker Dropdown */}
                {isTimePickerOpen && (
                  <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-lg max-h-64 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {generateTimeSlots().map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            setIsTimePickerOpen(false);
                            if (onScheduledTimeChange) {
                              onScheduledTimeChange(time);
                            }
                          }}
                          className={`w-full py-3 text-center rounded-lg transition-colors ${
                            selectedTime === time
                              ? 'bg-gray-200 text-gray-900 font-medium'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[#A72020] text-white font-semibold rounded-lg hover:bg-[#8b1919] transition-colors"
              >
                CONFIRM
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}