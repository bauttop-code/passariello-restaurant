import { Gift, Truck, Clock } from 'lucide-react';

export function PromoBanner() {
  const promoItems = (
    <>
      <div className="flex items-center gap-2 mx-12 md:mx-20">
        <Gift className="w-5 h-5" />
        <span className="text-sm md:text-base whitespace-nowrap">
          <span className="font-semibold">10% OFF</span> on orders over $50
        </span>
      </div>
      <div className="flex items-center gap-2 mx-12 md:mx-20">
        <Truck className="w-5 h-5" />
        <span className="text-sm md:text-base whitespace-nowrap">
          <span className="font-semibold">FREE DELIVERY</span> on orders over $30
        </span>
      </div>
      <div className="flex items-center gap-2 mx-12 md:mx-20">
        <Clock className="w-5 h-5" />
        <span className="text-sm md:text-base whitespace-nowrap">
          <span className="font-semibold">OPEN NOW</span> - Order ahead!
        </span>
      </div>
    </>
  );

  return (
    <div className="bg-gradient-to-r from-[#753221] to-[#5a2619] text-white">
      <div className="overflow-hidden py-3">
        <div className="flex items-center">
          <div className="flex items-center animate-marquee">
            {promoItems}
            {promoItems}
          </div>
          <div className="flex items-center animate-marquee">
            {promoItems}
            {promoItems}
          </div>
        </div>
      </div>
    </div>
  );
}