import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  priceRange?: string;
  image: string;
  category: string;
  subcategory?: string;
}

interface ProductCardProps {
  product: Product;
  // New props (preferred)
  onCardClick?: (product: Product) => void;  // ALWAYS opens detail view (NO popup)
  onAddClick?: (product: Product) => void;   // ONLY handler that can open popup
  // Legacy props (backward compatibility)
  onCustomize?: (product: Product) => void;
  onDirectOpen?: (product: Product) => void;
  locationInfo?: {
    address: string;
    city: string;
    zip: string;
  };
  onChangeLocation?: () => void;
  deliveryMode?: 'Pickup' | 'Delivery';
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
}

export function ProductCard({ 
  product, 
  onCardClick, 
  onAddClick,
  onCustomize,
  onDirectOpen,
  locationInfo, 
  onChangeLocation, 
  deliveryMode, 
  deliveryAddress 
}: ProductCardProps) {
  // REGLA FIJA:
  // - Click en tarjeta → SIEMPRE abre vista detallada (NO popup)
  // - Click en ADD → PUEDE abrir popup antes de ir a detalle
  
  // Card: abre detalle (NUNCA popup)
  const handleCardClick = onCardClick || onCustomize || (() => {});
  
  // ADD: único que puede abrir popup
  const handleAddButtonClick = onAddClick || onDirectOpen || (() => {});
  
  // Extract individual prices from priceRange
  const getPrices = () => {
    // For Wings appetizer (app18), show all 4 prices
    if (product.id === 'app18' && product.priceRange) {
      const prices = product.priceRange.split(' - ').map(p => p.trim());
      return prices;
    }
    
    // For Garlic Bread items (app1 and app2), show both size prices
    if ((product.id === 'app1' || product.id === 'app2') && product.priceRange) {
      const prices = product.priceRange.split(' - ').map(p => p.trim());
      return prices;
    }
    
    // For "by-the-slice", "brooklyn", "cheesesteaks", "appetizers", "salads", and "minucci-pizzas" categories, always show the single price
    if (product.category === 'by-the-slice' || 
        product.category === 'brooklyn-pizza' || 
        product.category === 'cheesesteaks' ||
        product.category === 'appetizers' ||
        product.category === 'salads' ||
        product.category === 'minucci-pizzas') {
      return [product.price];
    }
    
    // If priceRange exists, split it
    if (product.priceRange) {
      const prices = product.priceRange.split(' - ').map(p => p.trim());
      return prices;
    }
    
    // Fallback to single price if no priceRange
    return [product.price];
  };

  const prices = getPrices();

  // Handler for ADD button - stops propagation to prevent card click
  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddButtonClick(product);
  };

  return (
    <div className="w-full mx-auto">
      <div 
        className="group cursor-pointer flex flex-col"
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(product);
          }
        }}
      >
        {/* Image - Rectangular, horizontal, no rounded corners */}
        <div className="overflow-hidden w-full aspect-[3/2]">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ 
              imageRendering: 'crisp-edges',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
        </div>

        {/* Product Info - Clean, simple */}
        <div className="pt-2 sm:pt-3 flex flex-col">
          {/* Title */}
          <h3 className="text-[#404041] font-extrabold mb-1 text-[18px] sm:text-[21px] line-clamp-2" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>
            {(() => {
              if (product.id === 'cyo-white') return 'White Pizza';
              if (product.id === 'cyo-gf12') return 'Gluten Free Crust Pizza 12"';
              if (product.id === 'cyo-cauliflower') return 'Cauliflower Crust Pizza 10"';
              if (product.name.toLowerCase().includes('chicken tenders')) return 'Chicken Tenders W/FF';
              return product.name.replace(/\*/g, '').replace(/NEW/gi, '').trim();
            })()}
          </h3>
          
          {/* Price */}
          {prices.length > 0 && (
            <p className="text-[13px] sm:text-[15px] text-gray-700">
              {product.id === 'app6' 
                ? '$12.49 · $24.99 · $59.99 · $89.99 · $139.99'
                : product.id === 'app4'
                ? '$9.49 · $18.99 · $37.99 · $75.99'
                : product.id === 'app8'
                ? '$4.49 · $22.45 · $67.35 · $89.80 · $179.60'
                : product.category === 'catering-hoagies-wraps' ? '$0.00' : (prices.length > 1 ? prices.join(' · ') : prices[0])}
            </p>
          )}
          
          {/* ADD button - Hidden visually but kept for functionality */}
          <div className="hidden">
            <Button
              type="button"
              size="sm"
              onClick={handleAddClick}
              className="bg-[#A72020] hover:bg-[#8B1A1A] text-white"
            >
              ADD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}