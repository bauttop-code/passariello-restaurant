import { MapPin, ShoppingCart, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useEffect, useState } from 'react';
import { MobileDeliveryModal } from './MobileDeliveryModal';
import { MobileSearchMenu } from './MobileSearchMenu';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  category: string;
  image?: string;
}

interface MobileHeaderProps {
  deliveryMode: 'Pickup' | 'Delivery';
  currentLocation?: string;
  scheduledTime?: string;
  cartItemsCount?: number;
  onLocationClick?: () => void;
  onCartClick?: () => void;
  mode: 'regular' | 'guest-favorites' | 'catering' | 'reorder';
  onModeChange: (mode: 'regular' | 'guest-favorites' | 'catering' | 'reorder') => void;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  onReorderClick?: () => void;
  allProducts?: Product[];
  onProductClick?: (product: Product) => void;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  // Callbacks for delivery modal changes
  onDeliveryModeChange?: (mode: 'Pickup' | 'Delivery') => void;
  onLocationChange?: (location: string) => void;
  onScheduledDateChange?: (date: string) => void;
  onScheduledTimeChange?: (time: string) => void;
  onDeliveryInfoSubmit?: (info: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    zipCode: string;
  }) => void;
}

const regularCategories: Category[] = [
  { id: 'pizzas', name: 'Pizza' },
  { id: 'specialty-pizza', name: 'Specialty Pizza' },
  { id: 'brooklyn-pizza', name: 'Brooklyn Style Pizza' },
  { id: 'stromboli-calzone', name: 'Stromboli/Calzone & Turnover' },
  { id: 'by-the-slice', name: 'By The Slice' },
  { id: 'cheesesteaks', name: 'Cheesesteaks' },
  { id: 'hot-hoagies', name: 'Hot Hoagies' },
  { id: 'cold-hoagies', name: 'Cold Hoagies' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'brioche', name: 'Brioche' },
  { id: 'paninis', name: 'Panini' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'wings', name: 'Wings' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'traditional-dinners', name: 'Traditional Dinners' },
  { id: 'create-pasta', name: 'Create Your Own Pasta' },
  { id: 'pasta', name: 'Pasta / Baked Pasta / Gnocchi' },
  { id: 'sides', name: 'Sides' },
  { id: 'seafood', name: 'Seafood' },
  { id: 'create-salad', name: 'Create Your Own Salad' },
  { id: 'salads-soups', name: 'Specialty Salad & Soup' },
  { id: 'kids', name: "KID'S MENU" },
  { id: 'desserts', name: 'Dessert' },
  { id: 'beverages', name: 'Beverage' },
];

const cateringCategories: Category[] = [
  { id: 'catering-entrees', name: 'Entrees' },
  { id: 'catering-pasta', name: 'Pasta & Baked Pasta' },
  { id: 'catering-seafood-pasta', name: 'Seafood Pasta' },
  { id: 'catering-sides', name: 'Catering Sides' },
  { id: 'catering-salad-soups', name: 'Salad/Soups' },
  { id: 'catering-hoagies-wraps', name: 'Hoagies/Wraps Platters' },
  { id: 'catering-whole-cakes', name: 'Whole Cakes' },
  { id: 'catering-party-trays', name: 'Party Trays' },
  { id: 'catering-desserts', name: 'Desserts' },
  { id: 'catering-beverages', name: 'Beverages' },
];

export function MobileHeader({ 
  deliveryMode, 
  currentLocation = 'Cherry Hill', 
  scheduledTime = 'Today, 11:25 AM',
  cartItemsCount = 0,
  onLocationClick,
  onCartClick,
  mode,
  onModeChange,
  activeCategory = 'pizzas',
  onCategoryChange = () => {},
  onReorderClick,
  allProducts = [],
  onProductClick = () => {},
  deliveryAddress,
  onDeliveryModeChange,
  onLocationChange,
  onScheduledDateChange,
  onScheduledTimeChange,
  onDeliveryInfoSubmit
}: MobileHeaderProps) {
  const navScrollRef = useRef<HTMLDivElement>(null);
  const categoryButtonsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentDeliveryMode, setCurrentDeliveryMode] = useState<'Pickup' | 'Delivery'>(deliveryMode);
  const [currentLoc, setCurrentLoc] = useState(currentLocation);
  const [currentScheduledDate, setCurrentScheduledDate] = useState('Today');
  const [currentScheduledTime, setCurrentScheduledTime] = useState('11:25 AM');

  const categories = mode === 'catering' ? cateringCategories : regularCategories;

  // Sync delivery mode when prop changes
  useEffect(() => {
    setCurrentDeliveryMode(deliveryMode);
  }, [deliveryMode]);

  // Sync location when prop changes
  useEffect(() => {
    setCurrentLoc(currentLocation);
  }, [currentLocation]);

  // Auto-scroll to active category
  useEffect(() => {
    const scrollContainer = navScrollRef.current;
    const activeButton = categoryButtonsRef.current[activeCategory];
    
    if (scrollContainer && activeButton) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const scrollLeft = scrollContainer.scrollLeft;
      
      // Calculate the position to scroll to center the button
      const buttonLeft = buttonRect.left - containerRect.left + scrollLeft;
      const buttonCenter = buttonLeft + buttonRect.width / 2;
      const containerCenter = containerRect.width / 2;
      const targetScroll = buttonCenter - containerCenter;
      
      // Smooth scroll to the target position
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  // Check scroll position to show/hide arrows
  useEffect(() => {
    const scrollContainer = navScrollRef.current;
    if (!scrollContainer) return;

    const checkScroll = () => {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainer;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    checkScroll();
    scrollContainer.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

  return (
    <>
    <div className="sticky top-0 z-50 bg-white shadow-sm md:hidden">
      {/* Top Section - Pickup Info & Cart */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        {/* Left: Pickup Location & Time */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded px-3 py-2 flex-1"
        >
          <MapPin className="w-5 h-5 text-[#a72020] flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-900">
              <span className="font-semibold">{currentDeliveryMode}:</span> {currentScheduledDate}, {currentScheduledTime}
            </span>
            <span className="text-sm text-gray-900">
              {currentDeliveryMode === 'Delivery' && deliveryAddress
                ? `${deliveryAddress.address}, ${deliveryAddress.zip}`
                : currentLoc
              }
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
        </button>

        {/* Right: Cart Icon */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-10 w-10 hover:bg-gray-100 flex-shrink-0 ml-2"
          onClick={onCartClick}
        >
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#a72020] text-white text-[10px]">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Tab Navigation - MENU | GUEST FAVORITES | REORDER */}
      <div className="flex items-center border-b bg-white">
        <button
          onClick={() => onModeChange('regular')}
          className={`flex-1 py-3 text-sm font-semibold uppercase transition-all border-b-[3px] ${
            mode === 'regular'
              ? 'text-[#a72020] border-[#a72020]'
              : 'text-gray-600 border-transparent'
          }`}
        >
          MENU
        </button>
        <button
          onClick={() => onModeChange('guest-favorites')}
          className={`flex-1 py-3 text-sm font-semibold uppercase transition-all border-b-[3px] ${
            mode === 'guest-favorites'
              ? 'text-[#a72020] border-[#a72020]'
              : 'text-gray-600 border-transparent'
          }`}
        >
          GUEST FAVORITES
        </button>
        <button
          onClick={() => onModeChange('reorder')}
          className={`flex-1 py-3 text-sm font-semibold uppercase transition-all border-b-[3px] ${
            mode === 'reorder'
              ? 'text-[#a72020] border-[#a72020]'
              : 'text-gray-600 border-transparent'
          }`}
        >
          REORDER
        </button>
      </div>

      {/* Category Navigation with Horizontal Scroll - Only show for regular and catering modes */}
      {mode !== 'guest-favorites' && (
      <div className="relative border-b bg-white overflow-hidden">
        {/* Scrollable Categories with Search Icon */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Search Icon - Clickable */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Scrollable Categories Container */}
          <div className="flex-1 relative overflow-hidden">
            {/* Scrollable Categories */}
            <div 
              ref={navScrollRef}
              className="overflow-x-auto scrollbar-hide -mr-4 pr-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <nav className="flex gap-6" style={{ width: 'max-content' }}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    ref={(el) => (categoryButtonsRef.current[category.id] = el)}
                    onClick={() => onCategoryChange && onCategoryChange(category.id)}
                    className={`text-sm font-semibold whitespace-nowrap uppercase transition-all pb-1 border-b-2 ${
                      activeCategory === category.id
                        ? 'text-[#a72020] border-[#a72020]'
                        : 'text-gray-600 border-transparent'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>

    {/* Mobile Delivery Modal - Outside sticky container to avoid z-index issues */}
    <MobileDeliveryModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      currentMode={currentDeliveryMode}
      currentLocation={currentLoc}
      currentDate={currentScheduledDate}
      currentTime={currentScheduledTime}
      onConfirm={(mode, location, date, time) => {
        setCurrentDeliveryMode(mode);
        setCurrentLoc(location);
        setCurrentScheduledDate(date);
        setCurrentScheduledTime(time);
      }}
      onDeliveryConfirm={() => {
        if (onLocationClick) {
          onLocationClick();
        }
      }}
      onDeliveryModeChange={onDeliveryModeChange}
      onLocationChange={onLocationChange}
      onScheduledDateChange={onScheduledDateChange}
      onScheduledTimeChange={onScheduledTimeChange}
      onDeliveryInfoSubmit={onDeliveryInfoSubmit}
    />



    {/* Mobile Search Menu */}
    <MobileSearchMenu
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      allProducts={allProducts}
      onCategorySelect={(categoryId) => {
        if (onCategoryChange) {
          onCategoryChange(categoryId);
        }
      }}
      onProductClick={onProductClick}
      categories={categories}
    />
    </>
  );
}