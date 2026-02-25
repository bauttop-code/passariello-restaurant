import { useEffect, useState } from 'react';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MobileReorderScreenProps {
  user?: { name: string; email: string } | null;
  isLoadingAuth?: boolean;
  onSignInClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

interface ReorderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReorderOrder {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'preparing';
  total: number;
  items: ReorderItem[];
  deliveryMode: 'Pickup' | 'Delivery';
  location?: string;
}

export function MobileReorderScreen({
  user,
  isLoadingAuth = false,
  onSignInClick,
  onRegisterClick,
  onLogout,
}: MobileReorderScreenProps) {
  const [orders, setOrders] = useState<ReorderOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const supabase = getSupabaseClient();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDemoOrders = (): ReorderOrder[] => [
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
  ];

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      setLoadingOrders(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setOrders([]);
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4c0cb245/orders?userId=${authUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setOrders(getDemoOrders());
        }
      } catch (error) {
        console.error('Error loading reorder history:', error);
        setOrders(getDemoOrders());
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user, supabase]);

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      {user ? (
        <div className="px-4 pt-8">
          <div className="text-left mb-8">
            <h2 className="text-2xl text-gray-900 font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-600">Your latest orders are ready to reorder</p>
          </div>

          {loadingOrders ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#A72020] mb-3" />
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No orders yet</p>
              <p className="text-sm text-gray-400 mt-2">Start ordering to see your history</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{formatDate(order.date)} • {order.deliveryMode}</p>
                  {order.location ? <p className="text-xs text-gray-400 mb-3">{order.location}</p> : null}

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={`${order.id}-${idx}`} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <Package className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <p className="text-sm text-gray-700 break-words">{item.quantity}x {item.name}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 flex-shrink-0">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full py-3 px-6 bg-white border-2 border-[#A72020] text-[#A72020] rounded-md hover:bg-[#A72020] hover:text-white transition-colors"
          >
            LOG OUT
          </button>
        </div>
      ) : (
        <div className="px-4 pt-12">
          <div className="text-left mb-8">
            <h2 className="text-2xl text-gray-900 font-bold mb-3">Quickly reorder items from your previous orders!</h2>
            <p className="text-gray-600">Please log in to access reorder and view your latest order history.</p>
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto mt-12">
            <button
              onClick={onSignInClick}
              disabled={isLoadingAuth}
              className="w-full py-3.5 px-6 bg-[#A72020] text-white rounded-md hover:bg-[#8a1919] transition-colors disabled:opacity-50 uppercase"
            >
              LOG IN
            </button>
            
            <button
              onClick={onRegisterClick}
              disabled={isLoadingAuth}
              className="w-full py-3.5 px-6 bg-white border-2 border-[#A72020] text-[#A72020] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 uppercase"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
