# 📖 Usage Examples - Delivery Radius System

## 🎯 Quick Start

### 1. Check if user can receive delivery

```typescript
import { getDeliveryEligibility } from './utils/deliveryEligibility';

const userCoords = { lat: 39.8914, lng: -75.0368 }; // User location
const stores = [
  { id: '1', name: 'Haddonfield', lat: 39.8914, lng: -75.0368, address: '...' },
  { id: '2', name: 'Moorestown', lat: 39.9688, lng: -74.9488, address: '...' },
  { id: '3', name: 'Voorhees', lat: 39.8431, lng: -74.9560, address: '...' },
];

const result = getDeliveryEligibility(userCoords, stores);

console.log(result.isDeliverable); // true or false
console.log(result.availableStores); // stores within 5 miles
console.log(result.nearestStore); // closest store (even if > 5mi)
```

---

### 2. Calculate distance between two points

```typescript
import { distanceMiles } from './utils/distanceMiles';

const pointA = { lat: 39.8914, lng: -75.0368 }; // Haddonfield
const pointB = { lat: 39.9688, lng: -74.9488 }; // Moorestown

const distance = distanceMiles(pointA, pointB);
console.log(`Distance: ${distance.toFixed(2)} miles`); // Distance: 5.47 miles
```

---

### 3. Get user location (GPS or IP fallback)

```typescript
import { useRequiredUserLocation } from './hooks/useRequiredUserLocation';

function MyComponent() {
  const {
    coords,           // { lat: number, lng: number } | null
    source,           // 'geolocation' | 'ip' | null
    loading,          // boolean
    error,            // string | null
    permissionDenied, // boolean
    retryGeolocation, // () => void
    reset,            // () => void
  } = useRequiredUserLocation(true); // auto-request on mount

  if (loading) return <div>Getting your location...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!coords) return <div>No location available</div>;

  return (
    <div>
      <p>Your location: {coords.lat}, {coords.lng}</p>
      <p>Source: {source}</p>
      {source === 'ip' && <p>⚠️ Location is approximate</p>}
    </div>
  );
}
```

---

### 4. Block delivery if outside radius

```typescript
function DeliveryForm() {
  const { coords } = useRequiredUserLocation(true);
  const deliveryEligibility = coords 
    ? getDeliveryEligibility(coords, stores)
    : { isDeliverable: false, availableStores: [], nearestStore: null };

  const handleSubmit = () => {
    if (!deliveryEligibility.isDeliverable) {
      alert('Sorry, delivery is not available in your area.');
      return;
    }
    // Proceed with delivery...
  };

  return (
    <div>
      {!deliveryEligibility.isDeliverable && coords && (
        <div className="error-banner">
          <p>No stores available for delivery in your area.</p>
          <p>
            You are {deliveryEligibility.nearestStore?.distance.toFixed(1)} miles 
            from the nearest store. We only deliver within 5 miles.
          </p>
        </div>
      )}
      <button 
        onClick={handleSubmit}
        disabled={!deliveryEligibility.isDeliverable}
      >
        Confirm Delivery
      </button>
    </div>
  );
}
```

---

### 5. Show available stores sorted by distance

```typescript
function StoreList() {
  const { coords } = useRequiredUserLocation(true);
  const eligibility = coords 
    ? getDeliveryEligibility(coords, stores)
    : null;

  if (!eligibility) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available for Delivery</h2>
      {eligibility.availableStores.length > 0 ? (
        <ul>
          {eligibility.availableStores.map(store => (
            <li key={store.id}>
              {store.name} - {store.distance.toFixed(1)} miles away
            </li>
          ))}
        </ul>
      ) : (
        <p>No stores within 5 miles</p>
      )}
      
      {eligibility.nearestStore && (
        <p>
          Nearest store: {eligibility.nearestStore.name} 
          ({eligibility.nearestStore.distance.toFixed(1)} mi)
        </p>
      )}
    </div>
  );
}
```

---

### 6. Auto-select nearest pickup location

```typescript
function AutoSelectPickup() {
  const { coords } = useRequiredUserLocation(true);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  useEffect(() => {
    if (coords) {
      const eligibility = getDeliveryEligibility(coords, stores);
      if (eligibility.nearestStore) {
        setSelectedStore(eligibility.nearestStore.id);
        console.log(`Auto-selected: ${eligibility.nearestStore.name}`);
      }
    }
  }, [coords]);

  return (
    <div>
      <p>Selected pickup location: {selectedStore || 'None'}</p>
    </div>
  );
}
```

---

### 7. Conditional UI based on location source

```typescript
function LocationInfo() {
  const { coords, source } = useRequiredUserLocation(true);

  if (!coords) return null;

  return (
    <div>
      {source === 'geolocation' && (
        <div className="success">
          ✅ Using precise GPS location
        </div>
      )}
      
      {source === 'ip' && (
        <div className="warning">
          ⚠️ Using approximate location based on IP address.
          For best results, please allow GPS access.
        </div>
      )}
    </div>
  );
}
```

---

### 8. Retry location after permission denied

```typescript
function LocationRetry() {
  const {
    coords,
    permissionDenied,
    retryGeolocation,
  } = useRequiredUserLocation(true);

  if (coords) {
    return <div>Location obtained ✅</div>;
  }

  if (permissionDenied) {
    return (
      <div>
        <p>Location permission was denied.</p>
        <p>Please enable location services in your browser:</p>
        <ol>
          <li>Click the lock icon 🔒 in the address bar</li>
          <li>Allow location access</li>
          <li>Click "Try Again" below</li>
        </ol>
        <button onClick={retryGeolocation}>Try Again</button>
      </div>
    );
  }

  return <div>Requesting location...</div>;
}
```

---

### 9. Filter stores within custom radius

```typescript
import { distanceMiles } from './utils/distanceMiles';

function getStoresWithinRadius(
  userCoords: { lat: number; lng: number },
  stores: Store[],
  radiusMiles: number
) {
  return stores
    .map(store => ({
      ...store,
      distance: distanceMiles(userCoords, { lat: store.lat, lng: store.lng })
    }))
    .filter(store => store.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

// Usage
const nearbyStores = getStoresWithinRadius(userCoords, stores, 10); // 10 miles
console.log(`Found ${nearbyStores.length} stores within 10 miles`);
```

---

### 10. Validation function for checkout

```typescript
function canProceedToCheckout(
  deliveryMode: 'Pickup' | 'Delivery',
  userCoords: { lat: number; lng: number } | null,
  stores: Store[]
): { allowed: boolean; reason?: string } {
  // Pickup always allowed
  if (deliveryMode === 'Pickup') {
    return { allowed: true };
  }

  // Delivery requires coordinates
  if (!userCoords) {
    return { 
      allowed: false, 
      reason: 'Location required for delivery' 
    };
  }

  // Check if within delivery radius
  const eligibility = getDeliveryEligibility(userCoords, stores);
  
  if (!eligibility.isDeliverable) {
    const distance = eligibility.nearestStore?.distance.toFixed(1) || '?';
    return { 
      allowed: false, 
      reason: `No delivery available. Nearest store is ${distance} miles away (max 5 miles).` 
    };
  }

  return { allowed: true };
}

// Usage in checkout
const validation = canProceedToCheckout(deliveryMode, userCoords, stores);
if (!validation.allowed) {
  alert(validation.reason);
  return;
}
// Proceed with checkout...
```

---

## 🔧 TypeScript Types

```typescript
// User coordinates
type UserCoords = {
  lat: number;
  lng: number;
};

// Store with location
type Store = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
};

// Store with calculated distance
type StoreWithDistance = Store & {
  distance: number; // in miles
};

// Delivery eligibility result
type DeliveryEligibility = {
  availableStores: StoreWithDistance[]; // stores within 5 miles
  nearestStore: StoreWithDistance | null; // closest store (any distance)
  isDeliverable: boolean; // true if at least one store within 5 miles
};

// Location source
type LocationSource = 'geolocation' | 'ip' | null;
```

---

## 🎨 UI Patterns

### Error Banner Component

```typescript
function DeliveryErrorBanner({ 
  nearestStore 
}: { 
  nearestStore: StoreWithDistance | null 
}) {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-900">
            No stores available for delivery in your area.
          </h3>
          <p className="text-red-800 text-sm">
            {nearestStore 
              ? `You are ${nearestStore.distance.toFixed(1)} miles from ${nearestStore.name}. We only deliver within 5 miles.`
              : 'You are more than 5 miles from all our locations.'}
          </p>
          <p className="text-red-700 text-sm mt-2">
            💡 Try <strong>Pickup</strong> instead.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Success Message Component

```typescript
function DeliverySuccessBanner({ 
  availableStores 
}: { 
  availableStores: StoreWithDistance[] 
}) {
  const nearest = availableStores[0];
  
  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-3">
      <p className="text-green-900 text-sm">
        ✅ Delivery available! Your order will come from{' '}
        <strong>{nearest.name}</strong>{' '}
        ({nearest.distance.toFixed(1)} miles away)
      </p>
    </div>
  );
}
```

---

## 🧪 Testing Helpers

### Mock User Location

```typescript
// For testing - override geolocation
function mockUserLocation(lat: number, lng: number) {
  const mockGeolocation = {
    getCurrentPosition: (success: PositionCallback) => {
      success({
        coords: {
          latitude: lat,
          longitude: lng,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    },
    watchPosition: () => 0,
    clearWatch: () => {},
  };
  
  Object.defineProperty(navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });
}

// Usage in tests
mockUserLocation(39.8914, -75.0368); // Haddonfield coords
```

### Test Scenarios

```typescript
// Test data
const testStores: Store[] = [
  { id: '1', name: 'Haddonfield', lat: 39.8914, lng: -75.0368, address: '...' },
  { id: '2', name: 'Moorestown', lat: 39.9688, lng: -74.9488, address: '...' },
  { id: '3', name: 'Voorhees', lat: 39.8431, lng: -74.9560, address: '...' },
];

// Scenario 1: User IN Haddonfield (should be deliverable)
const userInHaddonfield = { lat: 39.8914, lng: -75.0368 };
const result1 = getDeliveryEligibility(userInHaddonfield, testStores);
console.assert(result1.isDeliverable === true, 'Should be deliverable in Haddonfield');

// Scenario 2: User in NYC (outside 5 miles - should NOT be deliverable)
const userInNYC = { lat: 40.7128, lng: -74.0060 };
const result2 = getDeliveryEligibility(userInNYC, testStores);
console.assert(result2.isDeliverable === false, 'Should NOT be deliverable in NYC');
console.assert(result2.nearestStore !== null, 'Should still have nearest store');

// Scenario 3: Edge case - exactly 5 miles away
const userAt5Miles = { lat: 39.8214, lng: -75.0368 }; // ~5 miles south
const result3 = getDeliveryEligibility(userAt5Miles, testStores);
// Should be deliverable (within or equal to 5 miles)
```

---

## 📚 Common Patterns

### Pattern 1: Loading State

```typescript
const { coords, loading } = useRequiredUserLocation(true);

if (loading) {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="animate-spin" />
      <span>Determining your location...</span>
    </div>
  );
}
```

### Pattern 2: Error State

```typescript
const { error, retryGeolocation } = useRequiredUserLocation(true);

if (error) {
  return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={retryGeolocation}>Try Again</button>
    </div>
  );
}
```

### Pattern 3: Conditional Rendering

```typescript
const deliveryAllowed = deliveryMode === 'Delivery' 
  ? deliveryEligibility.isDeliverable 
  : true; // Pickup always allowed

return (
  <>
    {!deliveryAllowed && <DeliveryErrorBanner />}
    <Button disabled={!deliveryAllowed}>
      {deliveryMode === 'Delivery' ? 'Confirm Delivery' : 'Confirm Pickup'}
    </Button>
  </>
);
```

---

**Need more examples?** Check the actual implementation in:
- `/App.tsx` (integration example)
- `/components/LocationSelector.tsx` (full UI example)
- `/DELIVERY_RADIUS_TESTING.md` (test scenarios)
