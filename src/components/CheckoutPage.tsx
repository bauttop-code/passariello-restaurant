import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Lock, CreditCard, Info, X, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { buildCartDisplayTitle } from '../utils/cart-display';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Payment methods supported by the application
 * - 'card': Credit/Debit Card (internal processing)
 * - 'cash': Cash on delivery/pickup (internal processing)
 * - 'paypal': PayPal (external redirect)
 * - 'gpay': Google Pay (external redirect)
 * - 'applepay': Apple Pay (external redirect)
 * - 'venmo': Venmo (external redirect)
 */
type PaymentMethod = 'card' | 'cash' | 'paypal' | 'gpay' | 'applepay' | 'venmo';

/**
 * Response from the payment checkout session creation
 */
interface CheckoutSessionResponse {
  redirectUrl: string;
  sessionId: string;
}

/**
 * Request payload for creating a checkout session
 */
interface CreateCheckoutSessionRequest {
  method: PaymentMethod;
  amount: number;
  currency: string;
  orderDraft: {
    items: CartItem[];
    subtotal: number;
    taxes: number;
    gratuity: number;
    total: number;
    deliveryMode: 'Pickup' | 'Delivery';
    location: string;
    scheduledTime: string;
    deliveryAddress?: any;
    specialInstructions?: string;
    contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

const LOCATION_ADDRESSES = {
  'Haddonfield': '119 Kings Highway East, Haddonfield, NJ 08033',
  'Moorestown': '13 West Main Street, Moorestown, NJ 08057',
  'Voorhees': '111 Laurel Oak Road, Voorhees, NJ 08043',
};

// ============================================================================
// PAYMENT INTEGRATION - BACKEND STUB
// ============================================================================

/**
 * Creates a checkout session with the payment provider (PayPal, Google Pay, Apple Pay)
 * 
 * TODO: Implement backend integration
 * 
 * Backend Contract:
 * - Endpoint: POST /api/payments/checkout
 * - Request body: CreateCheckoutSessionRequest
 * - Response: CheckoutSessionResponse
 * 
 * Return URLs (to be included in redirectUrl):
 * - Success: /payment/success?session_id={sessionId}
 * - Cancel: /payment/cancel?session_id={sessionId}
 * 
 * Payment Provider Implementations:
 * - PayPal: Use PayPal Orders API v2 to create order, return approve URL
 * - Google Pay / Apple Pay: Use Stripe Checkout or similar that supports wallet payments
 *   The checkout page will auto-detect available wallets based on device/browser
 * 
 * Security Notes:
 * - Validate order data on backend (don't trust amounts from frontend)
 * - Store order draft in database with pending status
 * - Use webhook to confirm payment completion and update order status
 */
async function createCheckoutSession(
  request: CreateCheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  // TODO: Replace this stub with actual backend API call
  console.log('📝 createCheckoutSession called with:', request);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, return a mock response
  // In production, this should call your backend API:
  // const response = await fetch('/api/payments/checkout', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request),
  // });
  // return await response.json();
  
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Mock redirect URLs (in production, these would come from your payment provider)
  const mockRedirectUrls: Record<PaymentMethod, string> = {
    paypal: `https://www.sandbox.paypal.com/checkoutnow?token=${sessionId}`,
    gpay: `https://checkout.stripe.com/pay/${sessionId}`,
    applepay: `https://checkout.stripe.com/pay/${sessionId}`,
    card: '', // Not used for redirect
    cash: '', // Not used for redirect
  };
  
  console.log('✅ Mock checkout session created:', {
    sessionId,
    method: request.method,
    amount: request.amount,
    redirectUrl: mockRedirectUrls[request.method],
  });
  
  return {
    sessionId,
    redirectUrl: mockRedirectUrls[request.method] || '#',
  };
}

interface CartItemCustomization {
  category: string;
  items: string[];
}

type SelectionType =
  | "topping"
  | "extra_topping"
  | "required_option"
  | "special_instruction"
  | "side"
  | "beverage"
  | "dessert"
  | "size"
  | "cheese"
  | "sauce"
  | "pasta_type"
  | "wrap_type"
  | "salad_base"
  | "dressing"
  | "no_topping"
  | "other";

interface CartSelection {
  id: string;
  label: string;
  type: SelectionType;
  groupId?: string;
  groupTitle?: string;
  distribution?: 'left' | 'whole' | 'right';
  beverageCategory?: string;
}

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[];
  selections?: CartSelection[]; // NEW STRUCTURED MODEL
  category?: string;
}

interface CheckoutPageProps {
  items: CartItem[];
  deliveryMode: 'Pickup' | 'Delivery';
  location: string;
  scheduledTime: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null;
  onBack: () => void;
  onEditLocation?: () => void;
  onEditSchedule?: () => void;
  onSignInClick?: () => void;
}

export function CheckoutPage({
  items,
  deliveryMode,
  location,
  scheduledTime,
  deliveryAddress,
  onBack,
  onEditLocation,
  onEditSchedule,
  onSignInClick,
}: CheckoutPageProps) {
  const [includeSilverware, setIncludeSilverware] = useState<'no' | 'yes'>('no');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [someoneElsePickup, setSomeoneElsePickup] = useState<'no' | 'yes'>('no');
  const [someoneElseName, setSomeoneElseName] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'carside' | 'walkin'>('carside');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [firstNameCard, setFirstNameCard] = useState('');
  const [lastNameCard, setLastNameCard] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [addGratuity, setAddGratuity] = useState(true);
  const [gratuityPercent, setGratuityPercent] = useState(15);
  const [customGratuity, setCustomGratuity] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [showGiftCardField, setShowGiftCardField] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [showCouponField, setShowCouponField] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.06625; // NJ tax rate
  const taxes = subtotal * taxRate;
  const gratuity = customGratuity ? parseFloat(customGratuity) : (addGratuity ? (subtotal * gratuityPercent) / 100 : 0);
  const total = subtotal + taxes + gratuity;

  // Pre-fill contact details from delivery address
  useEffect(() => {
    if (deliveryAddress && deliveryMode === 'Delivery') {
      // Split the full name into first and last name
      const nameParts = deliveryAddress.name.trim().split(' ');
      const firstNameFromAddress = nameParts[0] || '';
      const lastNameFromAddress = nameParts.slice(1).join(' ') || '';
      
      setFirstName(firstNameFromAddress);
      setLastName(lastNameFromAddress);
      setEmail(deliveryAddress.email);
      setMobilePhone(deliveryAddress.phone);
    }
  }, [deliveryAddress, deliveryMode]);

  const handlePlaceOrder = () => {
    console.log('Placing order...', {
      items,
      subtotal,
      taxes,
      gratuity,
      total,
      deliveryMode,
      location,
      scheduledTime,
      includeSilverware,
      specialInstructions,
      someoneElsePickup,
      someoneElseName,
      pickupMethod,
      vehicleType,
      vehicleColor,
      mobilePhone,
      paymentMethod,
      firstName,
      lastName,
      email,
    });
    // TODO: Implement actual order placement for Card/Cash
    alert('Order placed successfully! (Card/Cash flow)');
  };

  /**
   * Handles redirect-based payment methods (PayPal, Google Pay, Apple Pay)
   * This function will:
   * 1. Validate order preconditions (cart not empty, required fields filled)
   * 2. Create a checkout session on the backend
   * 3. Redirect user to the external payment provider
   */
  const handleRedirectPayment = async () => {
    try {
      // Basic validation
      if (items.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      if (!firstName || !lastName || !email) {
        alert('Please fill in all required contact details');
        return;
      }

      // Delivery-specific validations
      if (deliveryMode === 'Delivery' && !deliveryAddress) {
        alert('Please provide a delivery address');
        return;
      }

      // Pickup-specific validations
      if (deliveryMode === 'Pickup') {
        if (!vehicleType || !vehicleColor || !mobilePhone) {
          alert('Please fill in all required pickup details');
          return;
        }
      }

      console.log('Creating checkout session for payment method:', paymentMethod);

      // Show loading state (you can add a loading state variable)
      const request: CreateCheckoutSessionRequest = {
        method: paymentMethod,
        amount: total,
        currency: 'USD',
        orderDraft: {
          items,
          subtotal,
          taxes,
          gratuity,
          total,
          deliveryMode,
          location,
          scheduledTime,
          deliveryAddress: deliveryAddress || undefined,
          specialInstructions,
          contactInfo: {
            firstName,
            lastName,
            email,
            phone: mobilePhone,
          },
        },
      };

      // Call the backend to create a checkout session
      const response = await createCheckoutSession(request);

      console.log('Checkout session created:', response);

      // Redirect to the payment provider
      window.location.assign(response.redirectUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Determine button text and handler based on payment method
   */
  const getPaymentButtonConfig = () => {
    switch (paymentMethod) {
      case 'paypal':
        return {
          text: 'PayPal',
          handler: handleRedirectPayment,
          logo: (
            <ImageWithFallback               src="https://drive.google.com/thumbnail?id=1Ono2XZkIYYH1s7P4epA0g_8uJBRXcTBB&sz=w400" 
              alt="PayPal" 
              className="h-6 object-contain"
            />
          ),
        };
      case 'gpay':
        return {
          text: 'Google Pay',
          handler: handleRedirectPayment,
          logo: (
            <ImageWithFallback               src="https://drive.google.com/thumbnail?id=1iEUVPYOoRzg_5pd1ygVME-7FB9se76pv&sz=w400" 
              alt="Google Pay" 
              className="h-6 object-contain"
            />
          ),
        };
      case 'applepay':
        return {
          text: 'Apple Pay',
          handler: handleRedirectPayment,
          logo: (
            <ImageWithFallback               src="https://drive.google.com/thumbnail?id=1xNT9TgoWItLkBMAzIgSsDNYe_BZw77kh&sz=w400" 
              alt="Apple Pay" 
              className="h-6 object-contain"
            />
          ),
        };
      case 'venmo':
        return {
          text: 'Venmo',
          handler: handleRedirectPayment,
          logo: (
            <ImageWithFallback               src="https://drive.google.com/thumbnail?id=15RBrddWrWTOQdYkag7r0pu8wug38jqko&sz=w400" 
              alt="Venmo" 
              className="h-6 object-contain"
            />
          ),
        };
      case 'card':
      case 'cash':
      default:
        return {
          text: 'Place Order',
          handler: handlePlaceOrder,
          logo: null,
        };
    }
  };

  const paymentButtonConfig = getPaymentButtonConfig();

  return (
    <div className="min-h-screen bg-gray-50 relative z-[105]">
      {/* Order Details Drawer */}
      {showOrderDetails && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-[200]"
            onClick={() => setShowOrderDetails(false)}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[201] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Order Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowOrderDetails(false)}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items List */}
            <div className="p-6 space-y-6">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-extrabold text-lg text-[#404041]" style={{ fontFamily: "'Ancizar Sans', sans-serif" }}>{item.name}</h3>
                          <div className="inline-block px-2 py-0.5 mt-1 rounded" style={{ backgroundColor: 'rgba(139, 0, 0, 0.3)' }}>
                            <span className="text-sm font-medium text-gray-900">Quantity: {item.quantity}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#A72020] border-[#A72020] hover:bg-[#A72020] hover:text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      
                      <p className="font-semibold text-lg text-[#A72020]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Customizations */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {item.customizations.map((customization, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium text-sm text-gray-700 mb-1">
                                {customization.category}
                              </p>
                              <ul className="text-sm text-gray-600 space-y-0.5">
                                {customization.items.map((custItem, custIdx) => (
                                  <li key={custIdx} className="pl-2">• {custItem}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Separator between items */}
                  {index < items.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>

            {/* Footer with Subtotal */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-xl">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header with Location and Schedule Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900"
              onClick={onBack}
            >
              ← Back to Cart
            </Button>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#753221] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{deliveryMode} Date and Time</h3>
                <p className="text-sm text-gray-600">{scheduledTime}</p>
              </div>
              <Button 
                variant="link" 
                className="text-[#A72020] hover:text-[#8B1A1A] p-0 h-auto"
                onClick={onEditSchedule}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Secure Checkout Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-2xl font-semibold">Secure Checkout</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Have an Account?</p>
                  <Button 
                    variant="link" 
                    className="text-[#A72020] hover:text-[#8B1A1A] p-0 h-auto"
                    onClick={onSignInClick}
                  >
                    Log in
                  </Button>
                  <span className="text-sm text-gray-600"> for faster checkout experience</span>
                </div>
              </div>

              {/* Order Instructions */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Order Instructions</h3>
                  <p className="text-sm text-gray-500 text-right mb-2">*Required fields</p>

                  {/* Silverware */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="mb-3">
                      <span className="font-medium">Include Silverware?</span>
                      <span className="text-sm text-gray-600"> (Forks, Knives, Spoons and Napkins)</span>
                    </p>
                    <RadioGroup value={includeSilverware} onValueChange={(value: any) => setIncludeSilverware(value)}>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="silverware-no" />
                          <Label htmlFor="silverware-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="silverware-yes" />
                          <Label htmlFor="silverware-yes">Yes</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Special Instructions */}
                  <div className="mb-4">
                    <Label htmlFor="special-instructions" className="mb-2 block">Special Instructions</Label>
                    <Textarea
                      id="special-instructions"
                      placeholder="Add any special instructions for this order"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Someone Else Picking Up */}
                  <div>
                    <p className="mb-3 font-medium">Is someone else picking up the order?</p>
                    <RadioGroup value={someoneElsePickup} onValueChange={(value: any) => setSomeoneElsePickup(value)}>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="someone-no" />
                          <Label htmlFor="someone-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="someone-yes" />
                          <Label htmlFor="someone-yes">Yes</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Someone Else Name */}
                  {someoneElsePickup === 'yes' && (
                    <div className="mb-4">
                      <Label htmlFor="someone-else-name" className="mb-2 block">Name of Person Picking Up <span className="text-red-500">*</span></Label>
                      <Input
                        id="someone-else-name"
                        type="text"
                        value={someoneElseName}
                        onChange={(e) => setSomeoneElseName(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pickup Method */}
                {deliveryMode === 'Pickup' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Pickup Method</h3>
                    
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full border-2 border-[#A72020] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#A72020]" />
                        </div>
                        <svg className="w-16 h-8" viewBox="0 0 64 32" fill="none">
                          <path d="M8 16C8 10.4772 12.4772 6 18 6H48C53.5228 6 58 10.4772 58 16C58 21.5228 53.5228 26 48 26H18C12.4772 26 8 21.5228 8 16Z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="18" cy="16" r="4" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="48" cy="16" r="4" stroke="currentColor" strokeWidth="2"/>
                          <path d="M22 16H44" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-lg font-semibold">Carside</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        Please park in designated Carside Pickup spot. Help us identify your vehicle:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="vehicle-type" className="mb-2 block">
                            Vehicle Type <span className="text-red-500">*</span>
                          </Label>
                          <Select value={vehicleType} onValueChange={setVehicleType}>
                            <SelectTrigger id="vehicle-type">
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                            <SelectContent className="z-[300]">
                              <SelectItem value="sedan">Car</SelectItem>
                              <SelectItem value="suv">SUV</SelectItem>
                              <SelectItem value="truck">Truck</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="vehicle-color" className="mb-2 block">
                            Select Color <span className="text-red-500">*</span>
                          </Label>
                          <Select value={vehicleColor} onValueChange={setVehicleColor}>
                            <SelectTrigger id="vehicle-color">
                              <SelectValue placeholder="Select vehicle color" />
                            </SelectTrigger>
                            <SelectContent className="z-[300]">
                              <SelectItem value="white">White</SelectItem>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="silver">Silver</SelectItem>
                              <SelectItem value="gray">Gray</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="brown">Brown</SelectItem>
                              <SelectItem value="beige">Beige</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="gold">Gold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="mobile-phone" className="mb-2 block">
                            Mobile Phone <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="mobile-phone"
                            type="tel"
                            placeholder="(555) 555-5555"
                            value={mobilePhone}
                            onChange={(e) => setMobilePhone(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Please enter the mobile phone number of the person picking up the order. We will text you a link shortly before your pick-up time to check-in when you arrive.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Payments */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Payments</h3>

                  {/* Gift Card Button */}
                  <Button 
                    variant="outline" 
                    className="mb-6 w-full sm:w-auto"
                    onClick={() => setShowGiftCardField(!showGiftCardField)}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 12h18M7 8V6a2 2 0 012-2h0a2 2 0 012 2v2M13 8V6a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Pay with Gift Card
                  </Button>

                  {/* Gift Card Field */}
                  {showGiftCardField && (
                    <div className="border-2 border-gray-300 rounded-lg p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Secure Gift Card Payment</h4>
                          <p className="text-sm text-gray-600">Secured by 256 bit SSL encryption</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <Label htmlFor="gift-card-code" className="mb-2 block">
                            Gift Card Code <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="gift-card-code"
                            type="text"
                            placeholder="Enter gift card code"
                            value={giftCardCode}
                            onChange={(e) => setGiftCardCode(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Other Payment Methods</h4>

                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Credit/Debit Card */}
                        <div 
                          onClick={() => setPaymentMethod('card')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'card' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="card" id="payment-card" className="flex-shrink-0" />
                            <Label htmlFor="payment-card" className="cursor-pointer font-medium flex items-center gap-2">
                              <CreditCard className="w-5 h-5 flex-shrink-0" />
                              <span>Credit/Debit Card</span>
                            </Label>
                          </div>
                        </div>

                        {/* Cash */}
                        <div 
                          onClick={() => setPaymentMethod('cash')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'cash' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="cash" id="payment-cash" className="flex-shrink-0" />
                            <Label htmlFor="payment-cash" className="cursor-pointer font-medium flex items-center gap-2">
                              <span className="text-xl leading-none flex-shrink-0">💵</span>
                              <span>Cash</span>
                            </Label>
                          </div>
                        </div>

                        {/* PayPal */}
                        <div 
                          onClick={() => setPaymentMethod('paypal')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'paypal' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="paypal" id="payment-paypal" className="flex-shrink-0" />
                            <Label htmlFor="payment-paypal" className="cursor-pointer font-medium flex items-center gap-2">
                              <ImageWithFallback                                 src="https://drive.google.com/thumbnail?id=1Ono2XZkIYYH1s7P4epA0g_8uJBRXcTBB&sz=w400" 
                                alt="PayPal" 
                                className="w-6 h-6 object-contain flex-shrink-0"
                              />
                              <span>PayPal</span>
                            </Label>
                          </div>
                        </div>

                        {/* Google Pay */}
                        <div 
                          onClick={() => setPaymentMethod('gpay')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'gpay' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="gpay" id="payment-gpay" className="flex-shrink-0" />
                            <Label htmlFor="payment-gpay" className="cursor-pointer font-medium flex items-center gap-2">
                              <ImageWithFallback                                 src="https://drive.google.com/thumbnail?id=1iEUVPYOoRzg_5pd1ygVME-7FB9se76pv&sz=w400" 
                                alt="Google Pay" 
                                className="h-4 object-contain flex-shrink-0"
                              />
                              <span>Google Pay</span>
                            </Label>
                          </div>
                        </div>

                        {/* Apple Pay */}
                        <div 
                          onClick={() => setPaymentMethod('applepay')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'applepay' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="applepay" id="payment-applepay" className="flex-shrink-0" />
                            <Label htmlFor="payment-applepay" className="cursor-pointer font-medium flex items-center gap-2">
                              <ImageWithFallback                                 src="https://drive.google.com/thumbnail?id=14q2IkPdp9dE87_8w8hO9GfEwiB5NnRub&sz=w400" 
                                alt="Apple Pay" 
                                className="h-5 object-contain flex-shrink-0"
                              />
                              <span>Apple Pay</span>
                            </Label>
                          </div>
                        </div>

                        {/* Venmo */}
                        <div 
                          onClick={() => setPaymentMethod('venmo')}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'venmo' ? 'border-[#A72020] bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-start space-x-3">
                            <RadioGroupItem value="venmo" id="payment-venmo" className="flex-shrink-0" />
                            <Label htmlFor="payment-venmo" className="cursor-pointer font-medium flex items-center gap-2">
                              <ImageWithFallback                                 src="https://drive.google.com/thumbnail?id=15RBrddWrWTOQdYkag7r0pu8wug38jqko&sz=w400" 
                                alt="Venmo" 
                                className="w-5 h-5 object-contain flex-shrink-0"
                              />
                              <span>Venmo</span>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* PayPal Info Message */}
                    {paymentMethod === 'paypal' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700">
                              We will be using your PayPal account information to contact you for your order. You'll be redirected to PayPal to complete your payment securely.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Google Pay Info Message */}
                    {paymentMethod === 'gpay' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700">
                              You'll be redirected to complete payment securely with Google Pay.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Apple Pay Info Message */}
                    {paymentMethod === 'applepay' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700">
                              You'll be redirected to complete payment securely with Apple Pay.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Venmo Info Message */}
                    {paymentMethod === 'venmo' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700">
                              You'll be redirected to complete payment securely with Venmo.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Credit Card Form */}
                    {paymentMethod === 'card' && (
                      <div className="border-2 border-gray-300 rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Lock className="w-5 h-5 text-green-600" />
                          <div>
                            <h4 className="font-semibold">Secure Credit Card Payment</h4>
                            <p className="text-sm text-gray-600">Secured by 256 bit SSL encryption</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1">
                            <Label htmlFor="card-number" className="mb-2 block">
                              Card Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id="card-number"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="expiry" className="mb-2 block">
                              MM/YY <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="expiry"
                              type="text"
                              placeholder="12/25"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="cvv" className="mb-2 flex items-center gap-2">
                              CVV <span className="text-red-500">*</span>
                              <Info className="w-4 h-4 text-gray-400" />
                            </Label>
                            <Input
                              id="cvv"
                              type="text"
                              placeholder="123"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first-name-card" className="mb-2 block">
                              First Name on Card <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="first-name-card"
                              type="text"
                              value={firstNameCard}
                              onChange={(e) => setFirstNameCard(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="last-name-card" className="mb-2 block">
                              Last Name on Card <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="last-name-card"
                              type="text"
                              value={lastNameCard}
                              onChange={(e) => setLastNameCard(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billing-zip" className="mb-2 block">
                            Billing Zip Code <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="billing-zip"
                            type="text"
                            placeholder="12345"
                            value={billingZip}
                            onChange={(e) => setBillingZip(e.target.value)}
                            className="max-w-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contact Details */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-lg">Contact Details</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name" className="mb-2 block">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="last-name" className="mb-2 block">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2 block">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm leading-relaxed cursor-pointer">
                        Yes, send me special offers and news about Passariello's. By subscribing, I affirm I am 21 or older.
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Order</h3>
              </div>

              {/* Items Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{items.length} items in cart</span>
                </div>
                <Button 
                  variant="link" 
                  className="text-[#A72020] hover:text-[#8B1A1A] p-0 h-auto"
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                >
                  Details
                </Button>
              </div>

              {/* Order Items (Collapsible) */}
              {showOrderDetails && (
                <div className="mb-4 space-y-3 border-t pt-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0">
                        {item.image && (
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{buildCartDisplayTitle(item as any)}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {/* Taxes */}
              <div className="flex justify-between mb-4">
                <span>Taxes</span>
                <span className="font-medium">${taxes.toFixed(2)}</span>
              </div>

              {/* Coupon Code */}
              <Button 
                variant="link" 
                className="text-[#A72020] hover:text-[#8B1A1A] p-0 h-auto mb-4"
                onClick={() => setShowCouponField(!showCouponField)}
              >
                Have a Coupon Code?
              </Button>

              {showCouponField && (
                <div className="border-2 border-gray-300 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Apply Coupon Code</h4>
                      <p className="text-sm text-gray-600">Enter your coupon code to receive a discount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <Label htmlFor="coupon-code" className="mb-2 block">
                        Coupon Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="coupon-code"
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Add Gratuity */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                {/* Header - Add Gratuity checkbox + total amount */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gratuity"
                      checked={addGratuity}
                      onCheckedChange={(checked) => setAddGratuity(checked as boolean)}
                    />
                    <Label htmlFor="gratuity" className="font-medium cursor-pointer">
                      Add Gratuity
                    </Label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-semibold">${gratuity.toFixed(2)}</span>
                </div>

                {addGratuity && (
                  <div className="space-y-4">
                    {/* Description text */}
                    <p className="text-xs text-gray-600">
                      Would you like to leave a gratuity for the To Go service team?
                    </p>

                    {/* Gratuity slider section */}
                    <div className="space-y-2.5">
                      {/* Percentage labels row - aligned with slider track */}
                      <div className="flex justify-between items-center text-sm">
                        {[0, 5, 10, 15, 20, 25].map((percent) => (
                          <button
                            key={percent}
                            type="button"
                            onClick={() => {
                              setCustomGratuity('');
                              setGratuityPercent(percent);
                            }}
                            className={`transition-all select-none cursor-pointer min-w-[32px] text-center ${
                              !customGratuity && gratuityPercent === percent
                                ? 'font-bold text-[#A72020] scale-110'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {percent}%
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCustomGratuity('40')}
                          className={`transition-all select-none cursor-pointer min-w-[48px] text-center ${
                            customGratuity
                              ? 'font-bold text-[#A72020] scale-110'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Custom
                        </button>
                      </div>
                      
                      {/* Slider track */}
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="5"
                        value={customGratuity ? 30 : gratuityPercent}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val === 30) {
                            setCustomGratuity('40');
                          } else {
                            setCustomGratuity('');
                            setGratuityPercent(val);
                          }
                        }}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #A72020 0%, #A72020 ${((customGratuity ? 30 : gratuityPercent) / 30) * 100}%, #d1d5db ${((customGratuity ? 30 : gratuityPercent) / 30) * 100}%, #d1d5db 100%)`
                        }}
                      />
                      
                      {/* Selected value display - custom input or percentage summary */}
                      {customGratuity ? (
                        <div className="space-y-2 pt-1">
                          <Label htmlFor="customGratuity" className="text-sm">Custom Gratuity (%)</Label>
                          <Input
                            id="customGratuity"
                            type="number"
                            min="0"
                            max="100"
                            value={customGratuity}
                            onChange={(e) => setCustomGratuity(e.target.value)}
                            className="text-center font-semibold border-[#A72020] focus:ring-[#A72020]"
                            placeholder="Enter percentage"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-2xl font-bold text-[#A72020]">
                            {gratuityPercent}%
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-lg font-semibold text-[#A72020]">
                            ${gratuity.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-semibold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <Button
                className={`w-full text-white py-6 text-lg flex items-center justify-center gap-3 ${
                  paymentMethod === 'paypal' || paymentMethod === 'gpay' || paymentMethod === 'applepay' || paymentMethod === 'venmo'
                    ? 'bg-black hover:bg-gray-800'
                    : 'bg-[#A72020] hover:bg-[#8B1A1A]'
                }`}
                size="lg"
                onClick={paymentButtonConfig.handler}
              >
                {paymentButtonConfig.logo ? (
                  <>
                    <span>Pay with</span>
                    {paymentButtonConfig.logo}
                  </>
                ) : (
                  paymentButtonConfig.text
                )}
              </Button>

              {/* Back to Cart */}
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={onBack}
              >
                Back to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}