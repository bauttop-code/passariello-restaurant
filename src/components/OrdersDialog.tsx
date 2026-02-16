import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Package, Clock, MapPin, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useDialogFix } from '../hooks/useDialogFix';

interface Order {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'preparing';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryMode: 'Pickup' | 'Delivery';
  location?: string;
}

interface OrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrdersDialog({ open, onOpenChange }: OrdersDialogProps) {
  useDialogFix(open);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (open) {
      loadOrders();
    }
  }, [open]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch orders from backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4c0cb245/orders?userId=${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        // If no orders endpoint exists yet, show demo data
        setOrders(getDemoOrders());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      // Show demo data on error
      setOrders(getDemoOrders());
    } finally {
      setLoading(false);
    }
  };

  // Demo orders for demonstration
  const getDemoOrders = (): Order[] => [
    {
      id: 'ORD-001',
      date: '2025-11-10',
      status: 'completed',
      total: 45.99,
      items: [
        { name: 'Large Pepperoni Pizza', quantity: 1, price: 18.99 },
        { name: 'Chicken Parm Sub', quantity: 1, price: 12.00 },
        { name: 'Caesar Salad', quantity: 1, price: 8.00 },
        { name: 'Garlic Knots (6)', quantity: 1, price: 7.00 },
      ],
      deliveryMode: 'Delivery',
      location: '119 Kings Hwy E, Haddonfield, NJ 08033',
    },
    {
      id: 'ORD-002',
      date: '2025-11-05',
      status: 'completed',
      total: 32.50,
      items: [
        { name: 'Medium Margherita Pizza', quantity: 1, price: 15.50 },
        { name: 'Buffalo Wings (10)', quantity: 1, price: 12.00 },
        { name: 'Mozzarella Sticks', quantity: 1, price: 5.00 },
      ],
      deliveryMode: 'Pickup',
      location: 'Haddonfield, NJ',
    },
    {
      id: 'ORD-003',
      date: '2025-10-28',
      status: 'completed',
      total: 28.00,
      items: [
        { name: 'Spaghetti Bolognese', quantity: 1, price: 14.00 },
        { name: 'Fettuccine Alfredo', quantity: 1, price: 14.00 },
      ],
      deliveryMode: 'Pickup',
      location: 'Haddonfield, NJ',
    },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (selectedOrder) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 p-0"
              >
                ←
              </Button>
              <div>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>Order #{selectedOrder.id}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(selectedOrder.date)}</p>
              </div>
              <Badge className={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Badge>
            </div>

            {/* Delivery Info */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A72020] mt-0.5" />
                <div>
                  <p className="font-medium">{selectedOrder.deliveryMode}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.location}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-medium">Order Items</h3>
              </div>
              <div className="divide-y">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#A72020] hover:bg-[#8B1818]">
                Reorder
              </Button>
              <Button variant="outline" className="flex-1">
                Get Help
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">My Orders</DialogTitle>
          <DialogDescription>
            View your order history and track current orders
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#A72020] mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">No orders yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start ordering your favorite Italian dishes!
            </p>
            <Button 
              className="bg-[#A72020] hover:bg-[#8B1818]"
              onClick={() => onOpenChange(false)}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:border-[#A72020] transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Package className="w-4 h-4" />
                  <span>{order.items.length} items</span>
                  <span>•</span>
                  <span>{order.deliveryMode}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}