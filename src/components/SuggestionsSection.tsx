import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Product } from './ProductCard';

interface SuggestionItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface SuggestionsSectionProps {
  onSelectProduct?: (product: Product) => void;
}

const desserts: SuggestionItem[] = [
  {
    id: 'd1',
    name: 'Chocolate Molten Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1M-6K4D_oD3g5Eq4PkR0E2aJEN_mSNRMA&sz=w1000',
  },
  {
    id: 'd2',
    name: 'Cookie Lava',
    description: 'Gooey chocolate chip cookie with molten center',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1oqXRQ5rDP2fivh3aQ_cfqpUTSaTieTXx&sz=w1000',
  },
  {
    id: 'd3',
    name: 'Dark Side of the Moon',
    description: 'Rich dark chocolate cake',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1cmpMOyZSS2XtPCNCzEPqXLikpWvTSNL3&sz=w1000',
  },
  {
    id: 'd4',
    name: 'Tiramisu',
    description: 'Classic Italian coffee-flavored dessert',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1XbNi8dJGuogG7qOG0Nm3xL6STeHpoNib&sz=w1000',
  },
  {
    id: 'd5',
    name: 'New York Cheesecake',
    description: 'Rich and creamy classic cheesecake',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1KWdGeUtxNNx9PM02MGy8wBEZQYRjZZlL&sz=w1000',
  },
  {
    id: 'd6',
    name: "Reese's Peanut Butter Pie",
    description: 'Creamy peanut butter pie with chocolate',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1sKk80VLKPOX8wOZ2EGGKpw8539xemTug&sz=w1000',
  },
  {
    id: 'd7',
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1N06OqTGyNLg5yMGJ04Kn5dPEIRZDEZdg&sz=w1000',
  },
  {
    id: 'd8',
    name: 'Peanut Butter Bomb',
    description: 'Ultimate peanut butter dessert experience',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1McuANMiSmm18pgKKVokhlds5guzn3gV6&sz=w1000',
  },
  {
    id: 'd9',
    name: 'Limoncello Mascarpone',
    description: 'Light lemon mascarpone dessert',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1v_NcMuPkcnrTXyBJX2_hZI5Jqm6NJBUN&sz=w1000',
  },
  {
    id: 'd10',
    name: 'Chocolate Overload Cake',
    description: 'Decadent chocolate layer cake',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1-osIjijJl0auXYkiypXd4vOnz_XbUja5&sz=w1000',
  },
  {
    id: 'd11',
    name: 'Chocolate Pudding Brownie Cup',
    description: 'Brownie with chocolate pudding',
    price: '$6.49',
    image: 'https://drive.google.com/thumbnail?id=1CmxoI_yZNkbQlwFnj1ugZadKIiooSSPy&sz=w1000',
  },
  {
    id: 'd12',
    name: 'Chocolate Shell Cannoli',
    description: 'Chocolate shell filled with sweet ricotta',
    price: '$5.49',
    image: 'https://drive.google.com/thumbnail?id=1jNO4jodVWqx0sFIKK_OSSmWCaCbYVhmV&sz=w1000',
  },
  {
    id: 'd13',
    name: 'Plain Shell Cannoli',
    description: 'Traditional cannoli with sweet ricotta filling',
    price: '$4.99',
    image: 'https://drive.google.com/thumbnail?id=1q1W4fx3rdo48cZ66b-sZlV20kXXZMHkM&sz=w1000',
  },
  {
    id: 'd14',
    name: 'Triple Chocolate Chip Cookie',
    description: 'Decadent cookie with triple chocolate',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1KXgNjjUtdVMJxI58bevEkDfXH_a5sGDi&sz=w1000',
  },
  {
    id: 'd15',
    name: 'M&M Cookie',
    description: 'Classic cookie loaded with M&M candies',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1sMJwxgMlZM2yLfS86SDw3QRHeFjy5Xex&sz=w1000',
  },
  {
    id: 'd16',
    name: 'Oatmeal Cookie',
    description: 'Homemade oatmeal cookie with raisins',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=152EJJEqMd2bvXmfeTNdl906A1P_hWcZ1&sz=w1000',
  },
];

export function SuggestionsSection({ onSelectProduct }: SuggestionsSectionProps) {
  const handleDessertClick = (dessert: SuggestionItem) => {
    if (onSelectProduct) {
      // Convert SuggestionItem to Product format
      const product: Product = {
        id: dessert.id,
        name: dessert.name,
        description: dessert.description,
        price: dessert.price,
        image: dessert.image,
        category: 'desserts',
      };
      onSelectProduct(product);
    }
  };

  return (
    <div className="bg-white py-12 border-t">
      <div className="px-4 lg:px-8 max-w-[1800px] mx-auto">
        <div className="bg-[#8B0000] text-white px-6 py-4 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl mb-2">Would You Like To Add a Dessert?</h2>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {desserts.map((dessert) => (
            <div 
              key={dessert.id} 
              className="group cursor-pointer bg-[#fafafa] rounded-lg overflow-hidden flex flex-col h-full"
              onClick={() => handleDessertClick(dessert)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={dessert.image}
                  alt={dessert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[#404041] font-extrabold mb-1.5" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>{dessert.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{dessert.price}</p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="text-black"></div>
                  <Button
                    size="sm"
                    className="bg-[#A72020] hover:bg-[#8B1A1A] text-white px-8 h-[38.4px] translate-y-[-3px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDessertClick(dessert);
                    }}
                  >
                    ADD
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}