# 📖 PICKUP Eligibility - Usage Examples

## 🎯 Quick Start

### Example 1: Basic Pickup Eligibility Check

```typescript
import { getPickupEligibility } from './utils/pickupEligibility';

const userCoords = { lat: 39.8914, lng: -75.0368 }; // Haddonfield
const stores = [
  { id: '1', name: 'Haddonfield', lat: 39.8914, lng: -75.0368, address: '119 Kings Hwy E' },
  { id: '2', name: 'Moorestown', lat: 39.9688, lng: -74.9488, address: '13 W Main St' },
  { id: '3', name: 'Voorhees', lat: 39.8431, lng: -74.9560, address: '111 Laurel Oak Rd' },
];

const result = getPickupEligibility(userCoords, stores);

console.log(result.canPickup);       // true
console.log(result.pickupStores);    // [{ name: "Haddonfield", distance: 0, ...}, ...]
console.log(result.nearestStore);    // { name: "Haddonfield", distance: 0, ... }
```

---

### Example 2: User Outside 50 Miles

```typescript
const userInNYC = { lat: 40.7128, lng: -74.0060 }; // New York City
const result = getPickupEligibility(userInNYC, stores);

console.log(result.canPickup);       // false
console.log(result.pickupStores);    // [] (empty array)
console.log(result.nearestStore);    // { name: "Voorhees", distance: 63.2, ... }

// Show error to user
if (!result.canPickup) {
  alert(`Sorry, no pickup locations within 50 miles. 
         Nearest is ${result.nearestStore.name} 
         at ${result.nearestStore.distance.toFixed(1)} miles.`);
}
```

---

### Example 3: Integrate with React Component

```typescript
import { useRequiredUserLocation } from './hooks/useRequiredUserLocation';
import { getPickupEligibility } from './utils/pickupEligibility';

function PickupSelector() {
  const { coords, loading, error } = useRequiredUserLocation(true);
  
  const stores = [
    { id: '1', name: 'Haddonfield', lat: 39.8914, lng: -75.0368, address: '...' },
    { id: '2', name: 'Moorestown', lat: 39.9688, lng: -74.9488, address: '...' },
    { id: '3', name: 'Voorhees', lat: 39.8431, lng: -74.9560, address: '...' },
  ];

  const pickupEligibility = coords 
    ? getPickupEligibility(coords, stores)
    : { canPickup: false, pickupStores: [], nearestStore: null };

  if (loading) return <div>Loading location...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {!pickupEligibility.canPickup ? (
        <div className="error-banner">
          <h3>No pickup locations available near your location.</h3>
          <p>
            The nearest location is {pickupEligibility.nearestStore?.name} 
            at {pickupEligibility.nearestStore?.distance.toFixed(1)} miles away.
          </p>
          <p>We only serve customers within 50 miles.</p>
        </div>
      ) : (
        <div>
          <h2>Available Pickup Locations</h2>
          <ul>
            {pickupEligibility.pickupStores.map(store => (
              <li key={store.id}>
                {store.name} - {store.distance.toFixed(1)} miles away
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### Example 4: Block UI Elements

```typescript
function PickupForm() {
  const pickupEligibility = getPickupEligibility(userCoords, stores);
  
  const handleSelectStore = (store) => {
    if (!pickupEligibility.canPickup) {
      alert('Pickup not available in your area.');
      return;
    }
    // Proceed with selection...
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search stores"
        disabled={!pickupEligibility.canPickup}
      />
      
      {stores.map(store => (
        <button 
          key={store.id}
          onClick={() => handleSelectStore(store)}
          disabled={!pickupEligibility.canPickup}
        >
          Select {store.name}
        </button>
      ))}
    </div>
  );
}
```

---

### Example 5: Auto-Select Nearest Pickup Location

```typescript
import { useEffect, useState } from 'react';

function AutoSelectPickup() {
  const { coords } = useRequiredUserLocation(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    if (coords) {
      const eligibility = getPickupEligibility(coords, stores);
      
      if (eligibility.canPickup && eligibility.pickupStores.length > 0) {
        // Auto-select nearest store
        const nearest = eligibility.pickupStores[0];
        setSelectedStore(nearest);
        console.log(`Auto-selected nearest store: ${nearest.name}`);
      }
    }
  }, [coords]);

  return (
    <div>
      {selectedStore ? (
        <p>Selected pickup location: {selectedStore.name}</p>
      ) : (
        <p>No pickup location available</p>
      )}
    </div>
  );
}
```

---

### Example 6: Show Stores Sorted by Distance

```typescript
function StoreList() {
  const { coords } = useRequiredUserLocation(true);
  const eligibility = coords ? getPickupEligibility(coords, stores) : null;

  if (!eligibility) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pickup Locations (sorted by distance)</h2>
      
      {eligibility.canPickup ? (
        <ul>
          {eligibility.pickupStores.map(store => (
            <li key={store.id}>
              <strong>{store.name}</strong>
              <br />
              {store.address}
              <br />
              <span className="distance">
                {store.distance.toFixed(1)} miles away
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-stores">
          <p>No stores within 50 miles.</p>
          {eligibility.nearestStore && (
            <p>
              Nearest: {eligibility.nearestStore.name} 
              ({eligibility.nearestStore.distance.toFixed(1)} mi)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### Example 7: Conditional Warning for IP Geolocation

```typescript
function LocationInfo() {
  const { coords, source } = useRequiredUserLocation(true);
  const eligibility = coords ? getPickupEligibility(coords, stores) : null;

  return (
    <div>
      {source === 'ip' && (
        <div className="warning">
          ⚠️ Your location is approximate (based on IP address).
          For best results, please enable GPS access.
        </div>
      )}

      {eligibility && !eligibility.canPickup && (
        <div className="error">
          No pickup locations within 50 miles.
        </div>
      )}
    </div>
  );
}
```

---

### Example 8: Validation Before Checkout

```typescript
function canProceedToCheckout(
  deliveryMode: 'Pickup' | 'Delivery',
  userCoords: { lat: number; lng: number } | null,
  stores: Store[]
): { allowed: boolean; reason?: string } {
  
  if (!userCoords) {
    return { 
      allowed: false, 
      reason: 'Location required for pickup' 
    };
  }

  if (deliveryMode === 'Pickup') {
    const eligibility = getPickupEligibility(userCoords, stores);
    
    if (!eligibility.canPickup) {
      const distance = eligibility.nearestStore?.distance.toFixed(1) || '?';
      return { 
        allowed: false, 
        reason: `No pickup available. Nearest store is ${distance} miles away (max 50 miles).` 
      };
    }
  }

  return { allowed: true };
}

// Usage
const validation = canProceedToCheckout('Pickup', userCoords, stores);
if (!validation.allowed) {
  alert(validation.reason);
  return;
}
// Proceed...
```

---

### Example 9: Filter Stores by Custom Radius

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

// Get stores within 25 miles
const nearbyStores = getStoresWithinRadius(userCoords, stores, 25);
console.log(`Found ${nearbyStores.length} stores within 25 miles`);

// Get stores within 10 miles
const veryNearbyStores = getStoresWithinRadius(userCoords, stores, 10);
```

---

### Example 10: Display Distance in UI

```typescript
function StoreCard({ store, userCoords }) {
  const distance = distanceMiles(userCoords, { lat: store.lat, lng: store.lng });
  const isWithinRadius = distance <= 50;

  return (
    <div className={`store-card ${isWithinRadius ? 'available' : 'unavailable'}`}>
      <h3>{store.name}</h3>
      <p>{store.address}</p>
      <p className="distance">
        {distance.toFixed(1)} miles away
        {!isWithinRadius && ' (Outside service area)'}
      </p>
      <button disabled={!isWithinRadius}>
        {isWithinRadius ? 'Select' : 'Not Available'}
      </button>
    </div>
  );
}
```

---

## 🔧 TypeScript Types

```typescript
// Store with location
type PickupStore = {
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
type PickupStoreWithDistance = PickupStore & {
  distance: number; // in miles
};

// Pickup eligibility result
type PickupEligibility = {
  canPickup: boolean;                      // true if at least one store within 50 miles
  pickupStores: PickupStoreWithDistance[]; // stores within 50 miles, sorted by distance
  nearestStore: PickupStoreWithDistance | null; // closest store (any distance)
};
```

---

## 🎨 UI Component Examples

### Error Banner Component

```typescript
function PickupErrorBanner({ 
  nearestStore 
}: { 
  nearestStore: PickupStoreWithDistance | null 
}) {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-900">
            No pickup locations available near your location.
          </h3>
          <p className="text-red-800 text-sm">
            {nearestStore 
              ? `The nearest pickup location is ${nearestStore.distance.toFixed(1)} miles away (${nearestStore.name}). We only serve customers within 50 miles.`
              : 'You are more than 50 miles from all our locations.'}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### Success Message Component

```typescript
function PickupAvailableBanner({ 
  pickupStores 
}: { 
  pickupStores: PickupStoreWithDistance[] 
}) {
  const nearest = pickupStores[0];
  
  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-3">
      <p className="text-green-900 text-sm">
        ✅ Pickup available at {pickupStores.length} location{pickupStores.length > 1 ? 's' : ''}! 
        Nearest is <strong>{nearest.name}</strong> ({nearest.distance.toFixed(1)} miles away)
      </p>
    </div>
  );
}
```

---

### Store List Component

```typescript
function PickupStoreList({ 
  pickupStores, 
  onSelectStore 
}: { 
  pickupStores: PickupStoreWithDistance[];
  onSelectStore: (store: PickupStore) => void;
}) {
  return (
    <div className="space-y-3">
      {pickupStores.map((store, index) => (
        <div key={store.id} className="border rounded-lg p-4 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 flex-1">
              <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{store.name}</h3>
                <p className="text-gray-600 text-sm">{store.address}</p>
                <p className="text-red-600 text-sm font-semibold mt-1">
                  {store.distance.toFixed(1)} miles away
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onSelectStore(store)}
            className="w-full mt-3 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            SELECT THIS LOCATION
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 Testing Helpers

### Mock User Location for Tests

```typescript
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
mockUserLocation(39.8914, -75.0368); // Haddonfield
mockUserLocation(40.7128, -74.0060); // NYC (outside 50mi)
```

---

### Test Scenarios

```typescript
const testStores = [
  { id: '1', name: 'Haddonfield', lat: 39.8914, lng: -75.0368, address: '...' },
  { id: '2', name: 'Moorestown', lat: 39.9688, lng: -74.9488, address: '...' },
  { id: '3', name: 'Voorhees', lat: 39.8431, lng: -74.9560, address: '...' },
];

// Test 1: User AT the store (should work)
const userAtStore = { lat: 39.8914, lng: -75.0368 };
const result1 = getPickupEligibility(userAtStore, testStores);
console.assert(result1.canPickup === true, 'Should allow pickup at store');
console.assert(result1.pickupStores.length === 3, 'Should have all 3 stores');

// Test 2: User in NYC (should fail)
const userInNYC = { lat: 40.7128, lng: -74.0060 };
const result2 = getPickupEligibility(userInNYC, testStores);
console.assert(result2.canPickup === false, 'Should NOT allow pickup in NYC');
console.assert(result2.pickupStores.length === 0, 'Should have no stores');
console.assert(result2.nearestStore !== null, 'Should still have nearest store');

// Test 3: User exactly 50 miles away (should work)
const userAt50Mi = { lat: 39.1660, lng: -75.0368 }; // ~50mi south
const result3 = getPickupEligibility(userAt50Mi, testStores);
console.assert(result3.canPickup === true, 'Should allow pickup at exactly 50mi');
```

---

## 📚 Common Patterns

### Pattern 1: Conditional Rendering

```typescript
{pickupEligibility.canPickup ? (
  <PickupStoreList stores={pickupEligibility.pickupStores} />
) : (
  <PickupErrorBanner nearestStore={pickupEligibility.nearestStore} />
)}
```

---

### Pattern 2: Disabled State

```typescript
const canContinue = pickupEligibility.canPickup;

<button disabled={!canContinue}>
  {canContinue ? 'Continue' : 'Pickup Not Available'}
</button>
```

---

### Pattern 3: Loading State

```typescript
const { coords, loading } = useRequiredUserLocation(true);
const eligibility = coords ? getPickupEligibility(coords, stores) : null;

if (loading) {
  return <LoadingSpinner message="Finding pickup locations..." />;
}

if (!eligibility) {
  return <div>Unable to determine pickup availability</div>;
}
```

---

### Pattern 4: Error Handling

```typescript
try {
  const eligibility = getPickupEligibility(userCoords, stores);
  if (!eligibility.canPickup) {
    console.error('Pickup not available:', eligibility.nearestStore);
  }
} catch (error) {
  console.error('Error calculating pickup eligibility:', error);
  // Fallback behavior
}
```

---

## 🔗 Integration with Existing Systems

### With Delivery System

```typescript
const deliveryEligibility = getDeliveryEligibility(userCoords, stores); // 5 miles
const pickupEligibility = getPickupEligibility(userCoords, stores);     // 50 miles

if (deliveryMode === 'Delivery' && !deliveryEligibility.isDeliverable) {
  // Suggest pickup as alternative
  if (pickupEligibility.canPickup) {
    alert('Delivery not available, but pickup is! Switch to pickup?');
  }
}
```

---

### With Cart/Checkout

```typescript
function Checkout({ deliveryMode, userCoords, stores }) {
  const pickupEligibility = getPickupEligibility(userCoords, stores);
  
  const canCheckout = deliveryMode === 'Pickup' 
    ? pickupEligibility.canPickup 
    : true; // Different validation for delivery

  return (
    <button 
      onClick={handleCheckout}
      disabled={!canCheckout}
    >
      {canCheckout ? 'Place Order' : 'Service Not Available'}
    </button>
  );
}
```

---

**For complete implementation details, see:**
- `/PICKUP_RADIUS_IMPLEMENTATION.md` - Full documentation
- `/PICKUP_TESTING_CHECKLIST.md` - Testing scenarios
- `/utils/pickupEligibility.ts` - Source code
