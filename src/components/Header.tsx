import { MapPin, User, ShoppingCart, Mail, ChevronRight, Search, ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import { motion } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import logo from 'figma:asset/b4555029177debc2d76f87272ada6b2492302600.png';
import { CartSidebar } from './CartSidebar';
import { UserMenu } from './UserMenu';
import { SearchModal } from './SearchModal';
import { OrderTypePanel } from './OrderTypePanel';

interface CartItemCustomization {
  category: string;
  items: string[];
}

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

interface CartSelection {
  id: string;
  label: string;
  type: SelectionType;
  groupId?: string;
  groupTitle?: string;
  distribution?: 'left' | 'whole' | 'right';
  beverageCategory?: string;
}

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[];
  selections?: CartSelection[];
  category?: string;
}

interface Category {
  id: string;
  name: string;
}

interface HeaderProps {
  mode: 'regular' | 'guest-favorites' | 'catering';
  onModeChange: (mode: 'regular' | 'guest-favorites' | 'catering') => void;
  cartItemsCount?: number;
  cartItems?: CartItem[];
  onLogoClick?: () => void;
  onLocationClick?: () => void;
  onLocationDetailClick?: () => void;
  onOrderTypeClick?: () => void;
  currentLocation?: string;
  onEditCartItem?: (itemId: string) => void;
  onDuplicateCartItem?: (itemId: string) => void;
  onRemoveCartItem?: (itemId: string) => void;
  deliveryMode: 'Pickup' | 'Delivery';
  onDeliveryModeChange: (mode: 'Pickup' | 'Delivery') => void;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  scheduledTime?: string;
  onScheduleChange?: (date: Date | undefined) => void;
  openCart?: boolean;
  onCartOpenChange?: (open: boolean) => void;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  allProducts?: any[];
  onAddToCart?: (product: any, quantity: number) => void;
  onCheckout?: () => void;
  openMobileMenu?: boolean;
  onMobileMenuOpenChange?: (open: boolean) => void;
  user?: { name: string; email: string } | null;
  isLoadingAuth?: boolean;
  onSignInClick?: () => void;
  onLogout?: () => void;
  onProductClick?: (product: any) => void;
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
  { id: 'appetizers', name: 'Appetizers/Wings/Tenders/Mozzarella Sticks' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'traditional-dinners', name: 'Traditional Dinners' },
  { id: 'create-pasta', name: 'Create Your Own Pasta' },
  { id: 'pasta', name: 'Pasta / Baked Pasta / Gnocchi' },
  { id: 'sides', name: 'Sides' },
  { id: 'seafood', name: 'Seafood' },
  { id: 'create-salad', name: 'Create Your Own Salad' },
  { id: 'salads-soups', name: 'Specialty Salad & Soup' },
  { id: 'kids', name: "KID'S MENU" },
  { id: 'desserts', name: 'DESSERT / PIZZELLE / GELATI' },
  { id: 'beverages', name: 'Beverage' },
  { id: 'catering', name: 'Catering' },
];

const cateringCategories: Category[] = [
  { id: 'catering-appetizers', name: 'Catering Appetizers' },
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

export function Header({ mode, onModeChange, cartItemsCount = 0, cartItems = [], onLogoClick, onLocationClick, onLocationDetailClick, onOrderTypeClick, currentLocation = 'Haddonfield', onEditCartItem, onDuplicateCartItem, onRemoveCartItem, deliveryMode, onDeliveryModeChange, deliveryAddress, scheduledTime = 'ASAP', onScheduleChange, openCart = false, onCartOpenChange, activeCategory = 'pizzas', onCategoryChange = () => {}, searchQuery = '', onSearchChange = () => {}, allProducts = [], onAddToCart = () => {}, onCheckout = () => {}, openMobileMenu = false, onMobileMenuOpenChange = () => {}, user, isLoadingAuth, onSignInClick, onLogout, onProductClick, ...props }: HeaderProps & React.HTMLAttributes<HTMLDivElement>) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOrderTypePanelOpen, setIsOrderTypePanelOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const categoryButtonsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // ORDER NOW uses the same categories as regular menu
  // For regular mode, combine regular categories (minus 'catering') with catering categories
  const categories = mode === 'catering' 
    ? cateringCategories 
    : mode === 'regular' 
      ? [...regularCategories.filter(c => c.id !== 'catering'), ...cateringCategories]
      : regularCategories;
  
  // Allow external control of cart open state
  React.useEffect(() => {
    if (openCart) {
      setIsCartOpen(true);
      onCartOpenChange?.(true);
    }
  }, [openCart, onCartOpenChange]);

  // Allow external control of mobile menu state
  React.useEffect(() => {
    console.log('Header - openMobileMenu changed:', openMobileMenu);
    setIsMobileMenuOpen(openMobileMenu);
  }, [openMobileMenu]);

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
      
      // Instant scroll to the target position
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'instant'
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

  const toggleDeliveryMode = () => {
    onDeliveryModeChange(deliveryMode === 'Pickup' ? 'Delivery' : 'Pickup');
  };

  const handleEditItem = (itemId: string) => {
    setIsCartOpen(false);
    onCartOpenChange?.(false);
    onEditCartItem?.(itemId);
  };

  const handleLocationClickFromCart = () => {
    setIsCartOpen(false);
    onCartOpenChange?.(false);
    onLocationClick?.();
  };

  const handleCartOpenChange = (open: boolean) => {
    setIsCartOpen(open);
    onCartOpenChange?.(open);
  };

  const handleScroll = () => {
    const scrollContainer = navScrollRef.current;
    if (scrollContainer) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainer;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const { style, ...rest } = props;
  return (
    <div {...rest} style={{ display: "contents", ...(style ?? {}) }}>
      <header id="app-sticky-header" className="sticky top-0 z-[100] bg-white shadow-md hidden md:block">
      {/* Top Bar */}
      <div className="hidden bg-[#753221] text-white py-2 px-4">
        <div className="flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={toggleDeliveryMode}
            className="flex items-center gap-2 hover:bg-[#eff1da] transition-all cursor-pointer px-2 py-1 rounded"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {deliveryMode === 'Pickup' 
                ? `${deliveryMode} | ${currentLocation}, NJ` 
                : deliveryAddress 
                  ? `${deliveryMode} | ${deliveryAddress.address}, ${deliveryAddress.zip}`
                  : deliveryMode
              }
            </span>
          </button>
          
          {/* eClub Button - Center */}
          <a
            href="https://www.passariellos.com/passarielloseclub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1 bg-white text-[#753221] rounded-full hover:bg-[#eff1da] transition-all shadow-md"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">Join Passariello's eClub</span>
          </a>
          
          <div className="text-sm">Call: (856) 428-8400</div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile: Logo + Hamburger */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button 
              onClick={onLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <img 
                src={logo} 
                alt="Passariello's Pizzeria - Italian Kitchen" 
                className="h-10 w-auto"
              />
            </button>
            
            <div className="flex items-center gap-2">
              {/* Cart Icon for Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => handleCartOpenChange(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#A72020]">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
              
              {/* Hamburger Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Desktop: Logo + Actions */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Left Side: Logo */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Logo */}
              <button 
                onClick={onLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <img 
                  src={logo} 
                  alt="Passariello's Pizzeria - Italian Kitchen" 
                  className="h-11 w-auto"
                />
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Two separate buttons stacked vertically for Pickup mode */}
              {deliveryMode === 'Pickup' ? (
                <div className="flex flex-col gap-0">
                  <Button 
                    variant="ghost" 
                    className="relative flex items-center gap-2 hover:bg-[#A72020]/10 h-auto py-1"
                    onClick={onLocationDetailClick}
                  >
                    <MapPin className="w-5 h-5 text-[#A72020] flex-shrink-0" />
                    <span className="text-[#A72020] font-medium">
                      {currentLocation}, NJ
                    </span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-500 font-medium hover:bg-gray-100 h-auto py-1"
                    onClick={onLocationClick}
                  >
                    Change location
                  </Button>
                </div>
              ) : (
                /* Single button for Delivery mode */
                <Button 
                  variant="ghost" 
                  className="relative flex items-center gap-2"
                  onClick={onLocationClick}
                >
                  <MapPin className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[#A72020]">
                      {deliveryAddress 
                        ? `Delivery | ${deliveryAddress.zip}`
                        : 'Set delivery address'
                      }
                    </div>
                    <div className="text-xs text-gray-500">Change location</div>
                  </div>
                </Button>
              )}
              {isLoadingAuth ? (
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-5 h-5 text-gray-400 animate-pulse" />
                </Button>
              ) : user ? (
                <UserMenu 
                  userName={user.name} 
                  userEmail={user.email} 
                  onLogout={onLogout} 
                />
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={onSignInClick}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => handleCartOpenChange(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#A72020]">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[115]"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onMobileMenuOpenChange?.(false);
          }}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[120] overflow-y-auto"
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
      >
        <div className="p-6 space-y-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onMobileMenuOpenChange?.(false);
              }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Menu Type</h3>
            <button
              onClick={() => {
                onModeChange('regular');
                setIsMobileMenuOpen(false);
                onMobileMenuOpenChange?.(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'regular'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              MENU
            </button>
            <button
              onClick={() => {
                onModeChange('ordernow');
                setIsMobileMenuOpen(false);
                onMobileMenuOpenChange?.(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'ordernow'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ORDER NOW
            </button>
            <button
              onClick={() => {
                onModeChange('catering');
                setIsMobileMenuOpen(false);
                onMobileMenuOpenChange?.(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                mode === 'catering'
                  ? 'bg-[#A72020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CATERING
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Delivery</h3>
            <button
              onClick={() => {
                onLocationClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <MapPin className="w-5 h-5 text-[#A72020]" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {deliveryMode === 'Pickup' 
                    ? `Pickup | ${currentLocation}, NJ` 
                    : deliveryAddress 
                      ? `Delivery | ${deliveryAddress.zip}`
                      : 'Set delivery address'
                  }
                </div>
                <div className="text-xs text-gray-500">Tap to change</div>
              </div>
            </button>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Account</h3>
            {isLoadingAuth ? (
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400 animate-pulse" />
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-[#A72020]/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#A72020]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onSignInClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                <User className="w-5 h-5 text-[#A72020]" />
                <span className="text-sm font-medium text-gray-900">Sign In / Sign Up</span>
              </button>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3 pt-6 border-t">
            <a
              href="tel:+18564288400"
              className="flex items-center gap-3 text-gray-700 hover:text-[#A72020] transition-colors"
            >
              <span className="text-sm">📞 Call: (856) 428-8400</span>
            </a>
            <a
              href="https://www.passariellos.com/passarielloseclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-[#A72020] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">Join Passariello's eClub</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Mode Switcher + Order Info Bar - Always visible */}
      <div className="border-t">
        <div className="w-full py-3 bg-[#f8f8f8] border-b">
          <div className="flex items-center justify-between px-4 lg:px-8">
            {/* Left: Mode Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => onModeChange('regular')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === 'regular'
                    ? 'bg-[#8B734B] text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                MENU
              </button>
              <button
                onClick={() => onModeChange('guest-favorites')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === 'guest-favorites'
                    ? 'bg-[#8B734B] text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                GUEST FAVORITES
              </button>
              <button
                onClick={() => onModeChange('catering')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === 'catering'
                    ? 'bg-[#8B734B] text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
              >
                REORDER
              </button>
            </div>

            {/* Right: Order Info */}
            <div className="flex items-center gap-6 text-sm">
              {deliveryMode === 'Pickup' ? (
                <>
                  <button 
                    onClick={onLocationClick}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">
                      Ordering From: <span className="font-medium text-[#A72020] underline">{currentLocation}</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => setIsOrderTypePanelOpen(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-gray-700">
                      Order Type: <span className="font-medium text-[#A72020] underline">Pickup</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => setIsOrderTypePanelOpen(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[#A72020] font-medium underline">
                      {scheduledTime || 'ASAP'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsOrderTypePanelOpen(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#A72020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-[#A72020] font-medium underline">Delivery</span>
                  </button>
                  {deliveryAddress && (
                    <button 
                      onClick={onLocationClick}
                      className="text-[#A72020] font-medium underline hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      {deliveryAddress.address}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Only show for regular and catering modes */}
      {mode !== 'guest-favorites' && (
      <div className="relative">
        <div className="w-full py-2 lg:py-2.5 xl:py-3 bg-white">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => {
                const scrollContainer = navScrollRef.current;
                if (scrollContainer) {
                  // Find current active category index
                  const currentIndex = categories.findIndex(c => c.id === activeCategory);
                  
                  // Go to previous category if exists
                  if (currentIndex > 0) {
                    const previousCategory = categories[currentIndex - 1];
                    onCategoryChange(previousCategory.id);
                  }
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#F5F3EB]/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          
          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => {
                const scrollContainer = navScrollRef.current;
                if (scrollContainer) {
                  // Find current active category index
                  const currentIndex = categories.findIndex(c => c.id === activeCategory);
                  
                  // Go to next category if exists
                  if (currentIndex < categories.length - 1) {
                    const nextCategory = categories[currentIndex + 1];
                    onCategoryChange(nextCategory.id);
                  }
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#F5F3EB]/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}

          <div className="flex items-center px-4 lg:px-8">
            {/* Fixed Search Button */}
            <div className="flex items-center gap-1 bg-[#F5F3EB]/50 rounded-lg transition-all duration-300 hover:bg-[#F5F3EB]/70 hover:shadow-sm flex-shrink-0 mr-1 lg:mr-1.5 xl:mr-2">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center gap-1 px-3 lg:px-4 xl:px-5 py-2.5 lg:py-3 xl:py-3.5 text-gray-700 transition-all whitespace-nowrap"
              >
                <Search className="w-4 h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setIsSearchExpanded(true);
                  }
                }}
                className={`bg-transparent border-none outline-none text-sm lg:text-base transition-all duration-300 ${
                  isSearchExpanded ? 'w-24 lg:w-32 xl:w-40' : 'w-0'
                }`}
              />
              {isSearchExpanded && (
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      // Search is executed automatically via onChange
                      console.log('Searching for:', searchQuery);
                    }
                  }}
                  className="flex items-center px-3 lg:px-4 xl:px-5 py-2.5 lg:py-3 xl:py-3.5 text-gray-700 transition-all hover:text-[#753221]"
                >
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Categories */}
            <div ref={navScrollRef} className="overflow-x-auto scrollbar-hide flex-1">
              <nav className="flex items-center min-w-max">
                {categories.map((category, index) => (
                  <div key={category.id} style={{ display: 'contents' }}>
                    <button
                      ref={(el) => (categoryButtonsRef.current[category.id] = el)}
                      onClick={() => {
                        // If clicking on "Catering" button, switch to catering mode
                        if (category.id === 'catering' && onModeChange) {
                          onModeChange('catering');
                        } else {
                          onCategoryChange(category.id);
                        }
                      }}
                      className={`px-3 lg:px-4 py-2.5 lg:py-3 transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                        activeCategory === category.id
                          ? 'text-[#8B734B] border-b-2 border-[#184722]'
                          : 'text-gray-800 hover:text-[#8B734B] border-b-2 border-transparent'
                      }`}
                    >
                      <span className={`text-sm pointer-events-none ${activeCategory === category.id ? 'font-bold' : 'font-medium'}`}>
                        {category.id === 'kids' ? "Kid's Menu" : category.id === 'desserts' ? 'Dessert / Pizzelle / Gelati' : category.name}
                      </span>
                    </button>
                    {index < categories.length - 1 && (
                      <div className="w-px h-5 bg-[#E8E5DC] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => handleCartOpenChange(false)}
        deliveryMode={deliveryMode}
        location={currentLocation}
        deliveryAddress={deliveryAddress}
        scheduledTime={scheduledTime}
        onEditItem={handleEditItem}
        onDuplicateItem={onDuplicateCartItem}
        onRemoveItem={onRemoveCartItem}
        onLocationClick={handleLocationClickFromCart}
        onOrderTypeClick={onOrderTypeClick}
        onScheduleChange={onScheduleChange}
        items={cartItems}
        allProducts={allProducts}
        onAddToCart={onAddToCart}
        onCheckout={onCheckout}
        onProductClick={onProductClick}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onCategorySelect={onCategoryChange}
        onProductSelect={(product) => {
          // Navigate to product's category
          if (product.category) {
            onCategoryChange?.(product.category);
          }
          // Call onProductClick if provided
          if (onProductClick) {
            onProductClick(product);
          }
        }}
        mode={mode}
        allProducts={allProducts}
      />

      {/* Order Type Panel */}
      <OrderTypePanel
        isOpen={isOrderTypePanelOpen}
        onClose={() => setIsOrderTypePanelOpen(false)}
        currentMode={deliveryMode}
        currentScheduledTime={scheduledTime || 'ASAP'}
        location={currentLocation}
        deliveryAddress={deliveryAddress ? {
          address: deliveryAddress.address,
          city: 'Haddonfield',
          state: 'NJ',
          zip: deliveryAddress.zip
        } : undefined}
        onConfirm={(mode, time) => {
          onDeliveryModeChange(mode);
          // Parse the time string back to a Date if needed
          if (time !== 'ASAP' && onScheduleChange) {
            // For now, just pass the string directly
            // The parent component will handle the conversion
          }
          setIsOrderTypePanelOpen(false);
        }}
        userCoords={null}
        stores={[]}
        locationLoading={false}
      />
    </header>
    </div>
  );
}