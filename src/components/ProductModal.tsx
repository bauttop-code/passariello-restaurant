import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Product } from './ProductCard';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription className={product.description ? "" : "sr-only"}>
            {product.description || "Customize your order"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Size Options</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button className="px-4 py-2 border-2 border-[#753221] bg-[#753221] text-white rounded-lg">
                    Small
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#753221]">
                    Medium
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#753221]">
                    Large
                  </button>
                </div>
              </div>

              {product.hasToppings && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Toppings</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {['Pepperoni', 'Sausage', 'Mushrooms', 'Onions', 'Peppers', 'Olives', 'Extra Cheese', 'Bacon'].map((topping) => (
                      <label key={topping} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{topping}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Special Instructions</h3>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  placeholder="Any special requests?"
                />
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#A72020] hover:bg-[#8B1A1A] text-white py-6"
                size="lg"
              >
                Add to Cart • {product.priceRange || product.price}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}