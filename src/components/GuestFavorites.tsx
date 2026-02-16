import { Product } from './ProductCard';

interface GuestFavoritesProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function GuestFavorites({ products, onAddToCart, onProductClick }: GuestFavoritesProps) {
  return (
    <div className="px-3 py-5 md:px-6 lg:px-8 max-w-[1400px] mx-auto min-h-screen bg-white">
      {/* Header Text */}
      <div className="text-center mb-5 md:mb-8 px-4">
        <p className="text-gray-600 text-sm md:text-base">
          These are some of our guest favorites that we think you might enjoy.
        </p>
      </div>

      {/* Products Grid - 2 columns on mobile, 3+ on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {products.map((product) => (
          <div 
            key={product.id}
            className="group cursor-pointer"
            onClick={() => onProductClick(product)}
          >
            {/* Product Image */}
            <div className="aspect-square w-full overflow-hidden mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Product Info */}
            <div>
              <h3 className="text-[#404041] font-extrabold mb-1 text-[18px] sm:text-[21px] line-clamp-2" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>
                {product.name}
              </h3>
              
              <p className="text-[13px] sm:text-[15px] text-gray-700">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No guest favorites available at this time.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for recommendations!</p>
        </div>
      )}
    </div>
  );
}