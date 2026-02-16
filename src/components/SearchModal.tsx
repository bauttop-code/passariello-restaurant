import { X, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (categoryId: string) => void;
  onProductSelect?: (product: any) => void;
  mode: 'regular' | 'ordernow' | 'catering';
  allProducts?: any[];
}

const regularCategories = [
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
  { id: 'pasta', name: 'Pasta / Baked Pasta' },
  { id: 'sides', name: 'Sides' },
  { id: 'seafood', name: 'Seafood' },
  { id: 'create-salad', name: 'Create Your Own Salad' },
  { id: 'salads-soups', name: 'Specialty Salad & Soup' },
  { id: 'kids', name: "KID'S MENU" },
  { id: 'desserts', name: 'Dessert' },
  { id: 'beverages', name: 'Beverage' },
];

const cateringCategories = [
  { id: 'catering-entrees', name: 'Entrees' },
  { id: 'catering-pasta', name: 'Pasta & Baked Pasta' },
  { id: 'catering-seafood-pasta', name: 'Seafood Pasta' },
  { id: 'catering-sides', name: 'Catering Sides' },
  { id: 'catering-salad-soups', name: 'Salad/Soups' },
  { id: 'catering-hoagies-wraps', name: 'Hoagies/Wraps Platters' },
  { id: 'catering-whole-cakes', name: 'Whole Cakes' },
  { id: 'catering-party-trays', name: 'Party Trays' },
  { id: 'catering-beverages', name: 'Beverages' },
];

const suggestedSearches = ['Chicken', 'Shrimp', 'Salad', 'Soup', 'Alfredo', 'Spaghetti'];

// Helper function to highlight matching text
function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="text-[#A72020] font-semibold">{part}</span>
    ) : (
      part
    )
  );
}

export function SearchModal({ isOpen, onClose, onCategorySelect, onProductSelect, mode, allProducts = [] }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = mode === 'catering' ? cateringCategories : regularCategories;

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    onClose();
  };

  const handleProductClick = (product: any) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
    onClose();
  };

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allProducts.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        ...(product.ingredients || [])
      ].join(' ').toLowerCase();
      
      return searchableText.includes(query);
    });
  }, [searchQuery, allProducts]);

  const showResults = searchQuery.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the Menu"
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-[#a6bba1] transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {showResults ? (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#a6bba1] hover:shadow-md transition-all text-left"
                >
                  {/* Product Image */}
                  {product.image && (
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-[#404041] mb-1" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>
                      {highlightText(product.name, searchQuery)}
                    </h3>
                    <p className="text-xs uppercase text-[#a6bba1] font-semibold mb-2">
                      {product.categoryName || product.category}
                    </p>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {highlightText(product.description, searchQuery)}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Suggested Searches */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Searches</h2>
              <div className="flex flex-wrap gap-3">
                {suggestedSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Categories */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="px-6 py-4 bg-white border-2 border-gray-200 hover:border-[#a6bba1] hover:bg-gray-50 rounded-lg text-left text-gray-900 transition-all"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}