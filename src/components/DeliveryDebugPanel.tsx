import { type DeliveryEligibility } from '../utils/deliveryEligibility';
import { type PickupEligibility } from '../utils/pickupEligibility';

interface DeliveryDebugPanelProps {
  userCoords: { lat: number; lng: number } | null;
  locationSource: 'geolocation' | 'ip' | null;
  deliveryEligibility: DeliveryEligibility;
  pickupEligibility: PickupEligibility;
  deliveryMode: 'Pickup' | 'Delivery';
}

/**
 * DEBUG COMPONENT - Shows delivery + pickup eligibility info
 * Remove this in production or add ?debug=true query param to show
 */
export function DeliveryDebugPanel({
  userCoords,
  locationSource,
  deliveryEligibility,
  pickupEligibility,
  deliveryMode,
}: DeliveryDebugPanelProps) {
  // Only show if ?debug=true in URL
  const showDebug = new URLSearchParams(window.location.search).get('debug') === 'true';
  
  if (!showDebug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-2xl max-w-sm text-xs font-mono z-[9999]">
      <h3 className="font-extrabold text-sm mb-2 text-yellow-400">🐛 DELIVERY DEBUG</h3>
      
      {/* User Coords */}
      <div className="mb-2">
        <div className="text-gray-400">User Location:</div>
        {userCoords ? (
          <div className="text-green-400">
            ✅ {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
          </div>
        ) : (
          <div className="text-red-400">❌ No coords</div>
        )}
        {locationSource && (
          <div className="text-blue-300">Source: {locationSource.toUpperCase()}</div>
        )}
      </div>

      {/* Delivery Mode */}
      <div className="mb-2">
        <div className="text-gray-400">Mode:</div>
        <div className={deliveryMode === 'Delivery' ? 'text-orange-400' : 'text-blue-400'}>
          {deliveryMode.toUpperCase()}
        </div>
      </div>

      {/* Eligibility */}
      <div className="mb-2">
        <div className="text-gray-400">Deliverable:</div>
        <div className={deliveryEligibility.isDeliverable ? 'text-green-400' : 'text-red-400'}>
          {deliveryEligibility.isDeliverable ? '✅ YES' : '❌ NO'}
        </div>
      </div>

      {/* Available Stores */}
      <div className="mb-2">
        <div className="text-gray-400">Available Stores ({deliveryEligibility.availableStores.length}):</div>
        {deliveryEligibility.availableStores.length > 0 ? (
          <div className="text-green-300">
            {deliveryEligibility.availableStores.map(s => (
              <div key={s.id}>• {s.name} ({s.distance.toFixed(1)} mi)</div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">None within 5 miles</div>
        )}
      </div>

      {/* Nearest Store */}
      {deliveryEligibility.nearestStore && (
        <div className="mb-2">
          <div className="text-gray-400">Nearest Store:</div>
          <div className="text-yellow-300">
            {deliveryEligibility.nearestStore.name}
          </div>
          <div className={deliveryEligibility.nearestStore.distance <= 5 ? 'text-green-400' : 'text-red-400'}>
            {deliveryEligibility.nearestStore.distance.toFixed(2)} miles
            {deliveryEligibility.nearestStore.distance > 5 && ' (OUTSIDE RADIUS)'}
          </div>
        </div>
      )}

      {/* PICKUP ELIGIBILITY (50 miles radius) */}
      <div className="mb-2 pt-2 border-t border-gray-700">
        <div className="text-purple-400 font-bold mb-1">🚗 PICKUP (50mi radius)</div>
        <div className="text-gray-400">Can Pickup:</div>
        <div className={pickupEligibility.canPickup ? 'text-green-400' : 'text-red-400'}>
          {pickupEligibility.canPickup ? '✅ YES' : '❌ NO'}
        </div>
      </div>

      {/* Pickup Stores */}
      <div className="mb-2">
        <div className="text-gray-400">Pickup Stores ({pickupEligibility.pickupStores.length}):</div>
        {pickupEligibility.pickupStores.length > 0 ? (
          <div className="text-green-300">
            {pickupEligibility.pickupStores.map(s => (
              <div key={s.id}>• {s.name} ({s.distance.toFixed(1)} mi)</div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">None within 50 miles</div>
        )}
      </div>

      {/* Pickup Nearest Store */}
      {pickupEligibility.nearestStore && (
        <div className="mb-2">
          <div className="text-gray-400">Nearest for Pickup:</div>
          <div className="text-yellow-300">
            {pickupEligibility.nearestStore.name}
          </div>
          <div className={pickupEligibility.nearestStore.distance <= 50 ? 'text-green-400' : 'text-red-400'}>
            {pickupEligibility.nearestStore.distance.toFixed(2)} miles
            {pickupEligibility.nearestStore.distance > 50 && ' (OUTSIDE 50mi)'}
          </div>
        </div>
      )}

      <div className="text-gray-500 text-[10px] mt-2 pt-2 border-t border-gray-700">
        Add ?debug=true to URL to show this panel
      </div>
    </div>
  );
}
