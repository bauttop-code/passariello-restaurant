import { ChevronRight, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  mode: 'regular' | 'ordernow' | 'catering';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  itemCount?: number;
  onModeChange?: (mode: 'regular' | 'ordernow' | 'catering') => void;
}

const regularCategories: Category[] = [
  { id: 'pizzas', name: 'Pizza' },
  { id: 'stromboli-calzone', name: 'Stromboli & Calzone' },
  { id: 'cheesesteaks', name: 'Cheesesteaks' },
  { id: 'wings', name: 'Wings' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'brioche', name: 'Brioche' },
  { id: 'paninis', name: 'Panini' },
  { id: 'hot-hoagies', name: 'Hot Hoagies' },
  { id: 'cold-hoagies', name: 'Cold Hoagies' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'salads-soups', name: 'Salad/Soup' },
  { id: 'kids', name: "KID'S MENU" },
  { id: 'beverages', name: 'Beverage' },
  { id: 'desserts', name: 'Dessert' },
  { id: 'catering', name: 'Catering' },
];

const cateringCategories: Category[] = [
  { id: 'catering-appetizers', name: 'Appetizers' },
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

export function CategoryNav({ activeCategory, onCategoryChange, mode, isCollapsed, onToggleCollapse, searchQuery = '', onSearchChange, itemCount = 0, onModeChange }: CategoryNavProps) {
  // Combine regular and catering categories for regular mode
  const categories = mode === 'catering' 
    ? cateringCategories 
    : mode === 'regular' 
      ? [...regularCategories.filter(c => c.id !== 'catering'), ...cateringCategories]
      : regularCategories;
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="bg-white border-b fixed top-[88px] w-full z-50">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 pb-2 md:pb-3">
        {/* Category Navigation - Horizontal Scrollable */}
        <div className="relative flex justify-center">
          <nav className="flex gap-1 pb-2 justify-between w-full">
            {/* Search Icon Button with Expandable Input */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm flex-shrink-0 min-w-[40px] max-w-[120px]">
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="flex items-center gap-1 px-2 py-1.5 text-gray-700 transition-all whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
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
                className={`bg-transparent border-none outline-none text-xs transition-all duration-300 ${
                  isSearchExpanded ? 'w-24' : 'w-0'
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
                  className="flex items-center px-2 py-1.5 text-gray-700 transition-all hover:text-[#753221]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  // If clicking on "Catering" button, switch to catering mode
                  if (category.id === 'catering' && onModeChange) {
                    onModeChange('catering');
                  } else {
                    onCategoryChange(category.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex-grow max-w-[120px] min-w-[60px] flex items-center justify-center ${
                  activeCategory === category.id
                    ? 'border-2 border-[#753221] text-[#753221] shadow-[0_0_8px_rgba(117,50,33,0.3)] bg-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm bg-gray-50'
                }`}
              >
                <span className="text-[10px] text-center">{category.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}