# 🧪 Delivery Radius Testing Checklist (5 Miles)

## 📋 Test Scenarios

### ✅ Scenario 1: User WITHIN 5 miles (SHOULD ALLOW)
**Steps:**
1. Open app in browser
2. Click "DELIVERY" button
3. Browser prompts for location → **ALLOW**
4. Fill delivery form
5. Click "CONFIRM DELIVERY"

**Expected Result:**
- ✅ No error banner shown
- ✅ "CONFIRM DELIVERY" button is enabled
- ✅ Can proceed to checkout

**Actual Result:** _____________________

---

### ❌ Scenario 2: User OUTSIDE 5 miles (SHOULD BLOCK)
**Steps:**
1. Open app in browser
2. Click "DELIVERY" button  
3. Browser prompts for location → **ALLOW**
4. Fill delivery form
5. Observe UI

**Expected Result:**
- ❌ Red error banner appears:
  - "No stores available for delivery in your area."
  - Shows distance: "You are X.X miles away from the nearest store"
  - Suggests Pickup
- ❌ "CONFIRM DELIVERY" button is DISABLED
- ❌ Cannot proceed to checkout

**Actual Result:** _____________________

---

### 🔒 Scenario 3: User DENIES location permission (FALLBACK TO IP)
**Steps:**
1. Open app in browser
2. Browser prompts for location → **BLOCK/DENY**
3. Click "DELIVERY" button
4. Observe modal

**Expected Result:**
- 🔄 Modal shows "Determining Your Location..."
- 🌐 Automatically falls back to IP geolocation (ipapi.co)
- ℹ️ Blue banner: "Location is approximate"
- ✅ or ❌ Delivery validation runs based on IP location
- If IP location is outside 5 miles → shows red error banner

**Actual Result:** _____________________

---

### 🚫 Scenario 4: No location at all (BLOCKING MODAL)
**Steps:**
1. Disable location services in browser
2. Block ipapi.co in network tab (simulate IP geo failure)
3. Open app

**Expected Result:**
- 🚫 Modal appears: "Location Required"
- 🚫 Cannot interact with app
- 🔄 "Try Again" button visible
- 📝 Instructions to enable location

**Actual Result:** _____________________

---

### 📍 Scenario 5: User changes from PICKUP → DELIVERY
**Steps:**
1. User is outside 5 miles
2. Select "PICKUP" → should work fine
3. Switch to "DELIVERY"

**Expected Result:**
- ✅ PICKUP mode: No restrictions, shows all locations
- ❌ DELIVERY mode: Red error banner appears, button disabled

**Actual Result:** _____________________

---

### 📱 Scenario 6: Mobile device (GPS)
**Steps:**
1. Open app on mobile device
2. Allow location access
3. Select DELIVERY
4. Test if within/outside 5 miles

**Expected Result:**
- 📍 More accurate GPS location
- ✅ or ❌ Correct validation based on GPS coords

**Actual Result:** _____________________

---

## 🏢 Store Locations (for reference)

| Store        | Address              | Coordinates              |
|--------------|----------------------|--------------------------|
| Haddonfield  | 119 Kings Hwy E      | 39.8914, -75.0368       |
| Moorestown   | 13 W Main St         | 39.9688, -74.9488       |
| Voorhees     | 111 Laurel Oak Rd    | 39.8431, -74.9560       |

**5-mile radius from each store:**
- Use https://www.freemaptools.com/radius-around-point.htm to visualize

---

## 🔧 Debug Console Logs

When testing, check browser console for:
```
🟢 Button clicked - handleUseCurrentLocation
📍 Requesting browser geolocation...
✅ Browser geolocation successful: {lat: X, lng: Y}
```

OR (if denied):
```
❌ Browser geolocation error: 1 User denied...
🔄 Permission denied, falling back to IP geolocation...
🌐 Attempting IP geolocation fallback...
✅ IP geolocation successful: {lat: X, lng: Y}
```

---

## ✅ Success Criteria

- [ ] Allows delivery ONLY if user is within 5 miles
- [ ] Blocks delivery with clear message if outside 5 miles
- [ ] Shows distance to nearest store
- [ ] Falls back to IP geolocation if GPS denied
- [ ] Shows "approximate location" warning for IP geo
- [ ] "CONFIRM DELIVERY" button disabled when outside radius
- [ ] PICKUP mode works regardless of distance
- [ ] Mobile GPS works correctly
- [ ] Console logs are clear and helpful for debugging

---

## 🐛 Common Issues

**Issue:** Button stays enabled even when outside 5 miles
→ Check: `deliveryEligibility.isDeliverable` is false

**Issue:** No error banner appears
→ Check: `userCoords` is not null and `deliveryMode === 'Delivery'`

**Issue:** IP geolocation not working
→ Check: Network tab for `ipapi.co/json` request (status 200?)

**Issue:** Modal never disappears
→ Check: `userCoords` is being set after geolocation success

---

## 📊 Test Results Summary

| Scenario | Pass/Fail | Notes |
|----------|-----------|-------|
| Within 5 mi | ⬜ | |
| Outside 5 mi | ⬜ | |
| Permission denied | ⬜ | |
| No location | ⬜ | |
| Pickup → Delivery | ⬜ | |
| Mobile GPS | ⬜ | |

---

**Testing Date:** _____________________
**Tester:** _____________________
**Browser:** _____________________ (Chrome/Safari/Firefox)
**Device:** _____________________ (Desktop/Mobile)
