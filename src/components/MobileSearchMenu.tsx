import { ArrowLeft, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  category: string;
  image?: string;
}

interface MobileSearchMenuProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onCategorySelect: (categoryId: string) => void;
  onProductClick: (product: Product) => void;
  categories: Array<{ id: string; name: string }>;
}

const SUGGESTED_SEARCHES = [
  'Chicken',
  'Shrimp',
  'Salad',
  'Soup',
  'Alfredo',
  'Spaghetti',
];

export function MobileSearchMenu({
  isOpen,
  onClose,
  allProducts,
  onCategorySelect,
  onProductClick,
  categories,
}: MobileSearchMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = allProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });

    setSearchResults(results);
  }, [searchQuery, allProducts]);

  const handleSuggestedSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onClose();
  };

  const handleProductClick = (product: Product) => {
    onProductClick(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0 hover:bg-gray-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search the Menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 h-12 text-base bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A72020] focus:border-transparent"
            autoFocus
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Show search results if there's a query */}
        {searchQuery.trim().length > 0 ? (
          <div className="px-4 py-6">
            <h2 className="font-semibold mb-4">
              Search Results ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-extrabold text-[#404041]" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <p className="text-sm text-[#A72020] font-semibold mt-2">
                      {typeof product.price === 'number'
                        ? `$${product.price.toFixed(2)}`
                        : product.price}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Suggested Searches */}
            <div className="px-4 py-6 border-b">
              <h2 className="font-semibold mb-4 text-gray-900">Suggested Searches</h2>
              <div className="flex flex-wrap gap-2.5">
                {SUGGESTED_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestedSearch(term)}
                    className="px-6 py-2.5 border border-gray-400 rounded-full text-gray-700 font-normal hover:border-[#a72020] hover:bg-[#a72020] hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Categories */}
            <div className="px-4 py-6">
              <h2 className="font-semibold mb-4 text-gray-900">Menu Categories</h2>
              <div className="space-y-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className="w-full text-left px-0 py-4 text-gray-600 font-normal uppercase hover:text-gray-900 transition-colors border-b border-gray-200 last:border-b-0"
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