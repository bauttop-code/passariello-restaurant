import { X, Edit, Trash2, Copy, Calendar, MapPin, Clock, Plus, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from './ui/dialog';

import { buildCartDisplayTitle, buildCartDisplayLines } from '../utils/cart-display';

type SelectionType =
  | "topping"
  | "extra_topping"
  | "required_option"
  | "special_instruction"
  | "side"
  | "beverage"
  | "dessert"
  | "size"
  | "cheese"
  | "sauce"
  | "pasta_type"
  | "wrap_type"
  | "salad_base"
  | "dressing"
  | "no_topping"
  | "other";

type BeverageCategory =
  | "20oz"
  | "2_liter"
  | "water"
  | "juice"
  | "other";

interface CartSelection {
  id: string;
  label: string;
  type: SelectionType;
  groupId?: string;
  groupTitle?: string;
  beverageCategory?: BeverageCategory;
  distribution?: 'left' | 'whole' | 'right';
  removedIngredients?: string[];
}

interface CartItemCustomization {
  category: string;
  items: string[];
}

interface CartItem {
  id: string;
  productId: string; // Original product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[];
  selections?: CartSelection[]; // NEW STRUCTURED MODEL
  category?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  priceRange?: string;
  image?: string;
  category?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  deliveryMode?: 'Pickup' | 'Delivery';
  location?: string;
  scheduledTime?: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  onEditItem?: (itemId: string) => void;
  onDuplicateItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onLocationClick?: () => void;
  onOrderTypeClick?: () => void;
  onScheduleChange?: (date: Date | undefined) => void;
  allProducts?: Product[];
  onAddToCart?: (product: Product, quantity: number) => void;
  onCheckout?: () => void;
  onProductClick?: (product: Product) => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  items = [],
  deliveryMode = 'Pickup',
  location = 'Haddonfield',
  scheduledTime = 'ASAP',
  deliveryAddress,
  onEditItem,
  onDuplicateItem,
  onRemoveItem,
  onLocationClick,
  onOrderTypeClick,
  onScheduleChange,
  allProducts,
  onAddToCart,
  onCheckout,
  onProductClick,
}: CartSidebarProps) {
  const debugCartEnabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugCart') === '1';
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('12:00 PM');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [breadsticksSectionOpen, setBreadsticksSectionOpen] = useState(true);
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Use a fixed session key that doesn't change when items are added/removed
  const RECS_SESSION_KEY = 'passariellos-checkout-recs-shown';
  
  // Check if recommendations were already shown for this checkout session
  const getRecommendationsShown = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(RECS_SESSION_KEY) === 'true';
  };
  
  const setRecommendationsShownPersistent = (shown: boolean) => {
    if (typeof window === 'undefined') return;
    if (shown) {
      sessionStorage.setItem(RECS_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(RECS_SESSION_KEY);
    }
  };
  
  // Check if cart has desserts or beverages - MUST BE DECLARED FIRST
  const hasDesserts = items.some(item => item.category?.toLowerCase() === 'desserts');
  const hasBeverages = items.some(item => item.category?.toLowerCase() === 'beverages');
  const hasSides = items.some(item => item.category?.toLowerCase() === 'sides');

  // Intelligent recommendation algorithm
  const getSmartRecommendations = () => {
    if (!allProducts || allProducts.length === 0) return [];
    
    const recs: Product[] = [];
    
    // Analyze cart contents to understand what user ordered
    const hasPizza = items.some(item => 
      item.category?.includes('pizza') || item.name.toLowerCase().includes('pizza')
    );
    const hasPasta = items.some(item => 
      item.category?.includes('pasta') || item.name.toLowerCase().includes('pasta')
    );
    const hasSandwich = items.some(item => 
      item.category?.includes('hoagie') || item.category?.includes('cheesesteak') || 
      item.category?.includes('burger') || item.category?.includes('panini')
    );
    
    // Get all desserts and beverages from menu
    const desserts = allProducts.filter(p => p.category?.toLowerCase() === 'desserts');
    const beverages = allProducts.filter(p => p.category?.toLowerCase() === 'beverages');
    const sides = allProducts.filter(p => p.category?.toLowerCase() === 'sides');
    
    // Priority desserts (most popular)
    const priorityDesserts = ['d4', 'd5', 'd1']; // Tiramisu, Cheesecake, Chocolate Lava
    
    // Add desserts if missing (1-2 items)
    if (!hasDesserts && desserts.length > 0) {
      // Try to get priority desserts first
      const selectedDesserts = priorityDesserts
        .map(id => desserts.find(d => d.id === id))
        .filter((d): d is Product => d !== undefined)
        .slice(0, 2);
      
      // If not enough, add more popular ones
      if (selectedDesserts.length < 2) {
        desserts.slice(0, 2 - selectedDesserts.length).forEach(d => {
          if (!selectedDesserts.find(sd => sd.id === d.id)) {
            selectedDesserts.push(d);
          }
        });
      }
      
      recs.push(...selectedDesserts);
    }
    
    // Add beverages if missing (1 item)
    if (!hasBeverages && beverages.length > 0) {
      let beverage: Product | undefined;
      
      // Intelligent beverage recommendation based on food type
      if (hasPizza) {
        // Pizza pairs well with soda
        beverage = beverages.find(b => b.id === '25' || b.name.toLowerCase().includes('soda'));
      } else if (hasPasta) {
        // Pasta pairs well with water or lemonade
        beverage = beverages.find(b => b.id === 'b2' || b.id === 'b3');
      } else if (hasSandwich) {
        // Sandwiches pair well with soda or lemonade
        beverage = beverages.find(b => b.id === '25' || b.id === 'b3');
      }
      
      // Fallback to most popular beverage
      if (!beverage) {
        beverage = beverages.find(b => b.id === '25') || beverages[0];
      }
      
      if (beverage) {
        recs.push(beverage);
      }
    }
    
    // Add sides if missing and user has main course (1 item)
    if (!hasSides && (hasPizza || hasPasta || hasSandwich) && sides.length > 0 && recs.length < 3) {
      recs.push(sides[0]);
    }
    
    return recs.slice(0, 3); // Max 3 items
  };

  const recommendations = getSmartRecommendations();

  // Handle checkout click
  const handleCheckout = () => {
    if (debugCartEnabled) {
      console.log('🛒 Checkout clicked');
      console.log('📊 Recommendations:', recommendations);
      console.log('📦 AllProducts:', allProducts?.length || 0);
      console.log('🍕 Cart items:', items);
      console.log('🔄 Recommendations shown before?', getRecommendationsShown());
    }
    
    // Show recommendations if they haven't been shown in current cart session
    if (!getRecommendationsShown() && recommendations.length > 0) {
      if (debugCartEnabled) console.log('✅ Showing recommendations dialog');
      setShowRecommendations(true);
      setRecommendationsShownPersistent(true);
    } else {
      if (debugCartEnabled) console.log('❌ No recommendations or already shown, proceeding to checkout');
      // Proceed to actual checkout
      onCheckout?.();
    }
  };

  const handleContinueToCheckout = () => {
    setShowRecommendations(false);
    setIsCustomizing(false); // Reset customizing flag
    // Proceed to actual checkout
    onCheckout?.();
  };

  // Reset recommendations ONLY when cart is emptied
  // Do NOT reset when cart closes - user might be in the middle of checkout flow
  useEffect(() => {
    if (items.length === 0) {
      setRecommendationsShownPersistent(false);
      setShowRecommendations(false);
      setIsCustomizing(false);
    }
  }, [items.length]);

  // Generate time slots (every 15 minutes from 11:00 AM to 10:00 PM)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Stop at 10:00 PM (don't include 10:15, 10:30, 10:45)
        if (hour === 22 && minute > 0) break;
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Calculate default date and time (30 minutes from now, rounded to next 15-min slot)
  const getDefaultDateTime = () => {
    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
    
    // Round up to the next 15-minute interval
    const minutes = thirtyMinutesLater.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    
    if (roundedMinutes >= 60) {
      thirtyMinutesLater.setHours(thirtyMinutesLater.getHours() + 1);
      thirtyMinutesLater.setMinutes(0);
    } else {
      thirtyMinutesLater.setMinutes(roundedMinutes);
    }
    
    const hour = thirtyMinutesLater.getHours();
    const minute = thirtyMinutesLater.getMinutes();
    
    // Check if the time is within business hours (11 AM - 10 PM)
    let defaultDate = new Date(thirtyMinutesLater);
    let defaultHour = hour;
    let defaultMinute = minute;
    
    // If it's before 11 AM, set to 11:00 AM today
    if (hour < 11) {
      defaultHour = 11;
      defaultMinute = 0;
    }
    // If it's after 10 PM, set to 11:00 AM tomorrow
    else if (hour >= 22) {
      defaultDate = new Date(defaultDate.getTime() + 24 * 60 * 60 * 1000);
      defaultHour = 11;
      defaultMinute = 0;
    }
    
    defaultDate.setHours(defaultHour, defaultMinute, 0, 0);
    
    // Format time string
    const period = defaultHour >= 12 ? 'PM' : 'AM';
    const displayHour = defaultHour > 12 ? defaultHour - 12 : (defaultHour === 0 ? 12 : defaultHour);
    const timeString = `${displayHour}:${defaultMinute.toString().padStart(2, '0')} ${period}`;
    
    return { date: defaultDate, time: timeString };
  };

  // Initialize with default date and time when cart opens
  useEffect(() => {
    if (isOpen && scheduledTime === 'ASAP' && !selectedDate) {
      const { date, time } = getDefaultDateTime();
      setSelectedDate(date);
      setSelectedTime(time);
      // Notify parent component of the initial scheduled time
      if (onScheduleChange) {
        onScheduleChange(date);
      }
    }
  }, [isOpen, scheduledTime, selectedDate]); // Run when cart opens or scheduled time changes

  // Set defaults when opening the calendar
  const handleCalendarOpenChange = (open: boolean) => {
    if (open && !selectedDate) {
      const { date, time } = getDefaultDateTime();
      setSelectedDate(date);
      setSelectedTime(time);
    }
    setIsCalendarOpen(open);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleConfirmSchedule = () => {
    if (selectedDate) {
      // Combine date and time
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) adjustedHours += 12;
      if (period === 'AM' && hours === 12) adjustedHours = 0;
      
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(adjustedHours, minutes, 0, 0);
      
      onScheduleChange?.(scheduledDateTime);
    }
    setIsCalendarOpen(false);
  };

  const handleClearSchedule = () => {
    setSelectedDate(undefined);
    setSelectedTime('12:00 PM');
    onScheduleChange?.(undefined);
    setIsCalendarOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" showClose={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              Review and manage items in your cart
            </SheetDescription>
          </SheetHeader>

        {/* Header with Pickup Info */}
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full -ml-2 flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={onOrderTypeClick}
              className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-[#A72020] flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>

              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                  {deliveryMode}: {scheduledTime}
                </p>
                <p className="text-sm text-gray-600 leading-tight truncate">
                  {deliveryMode === 'Pickup' ? `${location}, NJ` : deliveryAddress?.address || `${location}, NJ`}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                if (debugCartEnabled) {
                  console.log('[DEBUG] CartSidebar → render item', {
                    id: item.id,
                    productId: item.productId, // Log original product ID
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    quantity: item.quantity,
                    selectionsCount: item.selections?.length ?? 0,
                    selections: item.selections,
                    customizations: item.customizations,
                  });
                }
                
                return (
                <div key={item.id} className="pb-4 border-b border-gray-200">
                  <div className="flex gap-3 mb-3">
                    {/* Item Image - Larger */}
                    <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYyMzcyNDU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Pizza"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-[#404041]" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>
                            {buildCartDisplayTitle(item as any)}
                          </h3>
                        </div>
                        <span className="font-semibold text-[#A72020] whitespace-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Unified Structured Display */}
                      <div className="mt-2 space-y-1 text-[11px] leading-snug text-gray-700">
                        {(() => {
                          // Debugging logic for Wings Order
                          const isWings = (
                            (item.category === 'wings') ||
                            (item.productId && (['w1', 'app18'].includes(item.productId) || item.productId.startsWith('wing'))) ||
                            (item.name && item.name.toLowerCase().includes('wings'))
                          );

                          let lines: string[] = [];
                          
                          if (isWings) {
                             // Force strictly buildWingsDisplayLines logic
                             // We re-import or rely on buildCartDisplayLines to delegate, 
                             // but to be safe and debuggable, we tap into the result.
                             lines = buildCartDisplayLines(item as any);
                             
                             if (debugCartEnabled) {
                               console.log(`[WINGS UI] Lines for ${item.name}:`, lines);
                             }
                          } else {
                             lines = buildCartDisplayLines(item as any);
                          }

                          return lines.map((line, idx) => (
                            // Filter out "Ranch" for Mozzarella Sticks display
                            (item.name?.toLowerCase().includes('mozzarella') && line.toLowerCase().includes('ranch')) ? null : (
                            <div key={idx} className="text-gray-700">
                              {line}
                            </div>
                            )
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Text only, no button borders */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setItemToRemove(item.id)}
                      className="text-sm text-[#A72020] font-semibold hover:text-[#8b1919] uppercase"
                    >
                      REMOVE
                    </button>
                    <button
                      onClick={() => onEditItem?.(item.id)}
                      className="text-sm text-[#A72020] font-semibold hover:text-[#8b1919] uppercase"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => onDuplicateItem?.(item.id)}
                      className="text-sm text-[#A72020] font-semibold hover:text-[#8b1919] uppercase"
                    >
                      DUPLICATE
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-white">
            {/* Breadsticks Promo - REMOVED */}

            {/* Order Summary */}
            <div className="px-6 py-4 space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Sub Total</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {/* Add More Items Button */}
              <button
                onClick={onClose}
                className="w-full py-3 text-[#A72020] font-semibold border-2 border-[#A72020] rounded-lg hover:bg-[#A72020]/5 transition-colors uppercase"
              >
                ADD MORE ITEMS
              </button>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#A72020] text-white font-semibold rounded-lg hover:bg-[#8b1919] transition-colors flex items-center justify-center gap-3"
              >
                <span className="uppercase">Checkout</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">${subtotal.toFixed(2)}</span>
                  <span className="text-sm opacity-90">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                </div>
              </button>


            </div>
          </div>
        )}

        {/* Remove Item Confirmation Dialog */}
        <Dialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Remove item?</DialogTitle>
              <DialogDescription className="text-center">
                Are you sure you want to remove this item from your cart?
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setItemToRemove(null)}
              >
                CANCEL
              </Button>
              <Button
                className="flex-1 bg-[#A72020] hover:bg-[#8b1919] text-white"
                onClick={() => {
                  if (itemToRemove) {
                    onRemoveItem?.(itemToRemove);
                    setItemToRemove(null);
                  }
                }}
              >
                REMOVE
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>

    {/* Recommendations Dialog - Outside Sheet with higher z-index */}
    <Dialog open={showRecommendations} onOpenChange={(open) => {
      setShowRecommendations(open);
      // If closing the dialog and user is NOT customizing, proceed to checkout
      if (!open && !isCustomizing) {
        onCheckout?.();
      }
      // DON'T reset anything here - let useEffect handle it
    }}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none max-sm:h-full max-sm:max-w-full max-sm:flex max-sm:items-center max-sm:justify-center">
        <div className="p-8 sm:p-8 max-sm:p-4 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:min-h-0">
          <DialogHeader className="mb-6 max-sm:mb-4">
            <DialogTitle className="text-3xl text-center text-white max-sm:text-2xl">Would you like to add...</DialogTitle>
            <DialogDescription className="sr-only">
              Recommended items to complete your order
            </DialogDescription>
          </DialogHeader>
          
          {/* Product Cards Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8 max-sm:grid-cols-1 max-sm:overflow-x-auto max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-3 max-sm:mb-3 max-sm:pl-[calc((100vw-196px)/2)] max-sm:pr-[calc((100vw-196px)/2)] max-sm:[&::-webkit-scrollbar]:hidden max-sm:[-ms-overflow-style:none] max-sm:[scrollbar-width:none]">
            {recommendations.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col max-sm:min-w-[196px] max-sm:snap-center max-sm:border-0 max-sm:shadow-lg max-sm:rounded-2xl">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 max-sm:w-full max-sm:h-40 max-sm:rounded-t-2xl max-sm:overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col max-sm:p-4 max-sm:bg-white">
                  <h4 className="font-semibold text-gray-900 mb-2 max-sm:text-base max-sm:mb-2 max-sm:line-clamp-2">{item.name}</h4>
                  <p className="text-gray-700 font-semibold mb-4 max-sm:text-sm max-sm:mb-4">
                    <span className="max-sm:inline sm:hidden">Starting at </span>
                    ${typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')).toFixed(2) : item.price.toFixed(2)}
                  </p>
                  
                  {/* Add Button */}
                  <Button 
                    className="w-full mt-auto bg-[#A72020] hover:bg-[#8b1919] text-white max-sm:bg-[#a72020] max-sm:hover:bg-[#8b1919] max-sm:py-3 max-sm:text-sm max-sm:rounded-lg"
                    onClick={() => {
                      const product = allProducts?.find(p => p.id === item.id);
                      if (product) {
                        // Mark that user is customizing (not closing to checkout)
                        setIsCustomizing(true);
                        // Close recommendations dialog
                        setShowRecommendations(false);
                        // Close cart sidebar
                        onClose();
                        // Open product detail view
                        if (onProductClick) {
                          onProductClick(product);
                        }
                      }
                    }}
                  >
                    <span className="sm:inline max-sm:hidden">ADD</span>
                    <span className="hidden max-sm:inline">ADD & CUSTOMIZE</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots - Mobile Only */}
          <div className="hidden max-sm:flex justify-center gap-2 mb-6">
            {recommendations.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-600"
              />
            ))}
          </div>

          {/* No Thanks Link */}
          <div className="text-center">
            <button 
              onClick={handleContinueToCheckout}
              className="text-white underline hover:text-gray-300 transition-colors max-sm:text-sm"
            >
              No Thanks, Go To Checkout
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}
