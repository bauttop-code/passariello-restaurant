# 🧪 Auto-Location Testing Checklist

## 📋 Test Scenarios

### ✅ Test 1: Usuario DENTRO de 5 millas (Delivery + Pickup)

**Test Location:** Haddonfield, NJ (at the store)  
**Coordinates:** `39.8914, -75.0368`  
**Distance:** 0 miles from Haddonfield store

#### Steps:
1. Open browser DevTools (F12)
2. Console → Settings (⚙️) → Sensors → Override location
3. Custom Location:
   - Latitude: `39.8914`
   - Longitude: `-75.0368`
4. Reload app
5. Wait for location resolution (~2-3 seconds)
6. Click "PICKUP"
7. Observe UI
8. Click "DELIVERY"
9. Observe form

#### Expected Results - PICKUP:
- ✅ Loading banner: "Finding nearest pickup location..."
- ✅ Green banner appears:
  ```
  ✓ Nearest location selected
  Haddonfield (0.0 miles away) has been automatically 
  selected based on your location.
  ```
- ✅ `currentLocation` auto-set to "Haddonfield"
- ✅ NO red error banner
- ✅ Search field ENABLED
- ✅ Buttons ENABLED

#### Expected Results - DELIVERY:
- ✅ Loading banner: "Setting up your location..."
- ✅ Form pre-filled:
  - **address:** "119 Kings Hwy E" (or similar street address)
  - **zip:** "08033"
- ✅ Green message under address: "✓ Auto-detected from your location"
- ✅ NO red error banner
- ✅ "CONFIRM DELIVERY" button ENABLED

#### Debug Panel (`?debug=true`):
```
🎯 Auto-resolving pickup and delivery for coords: {lat: 39.8914, lng: -75.0368}
✅ Location resolved: {
  pickup: '✓ Haddonfield',
  delivery: '✓ Haddonfield'
}
📍 Auto-prefilling delivery address: {address: "...", zip: "08033"}
🎯 Auto-assigning pickup location: Haddonfield
```

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### ⚠️ Test 2: Usuario ENTRE 5-50 millas (Pickup OK, Delivery BLOCKED)

**Test Location:** Atlantic City, NJ  
**Coordinates:** `39.3643, -74.4229`  
**Distance:** ~40 miles from Haddonfield (nearest)

#### Steps:
1. Override location: `39.3643, -74.4229`
2. Reload app
3. Wait for resolution
4. Click "PICKUP"
5. Observe
6. Click "DELIVERY"
7. Observe

#### Expected Results - PICKUP:
- ✅ Green banner: "Nearest location selected: Haddonfield (40.X miles away)"
- ✅ Auto-assigned successfully
- ✅ Can proceed

#### Expected Results - DELIVERY:
- ❌ Red banner:
  ```
  ⚠️ No stores available for delivery in your area.
  You are 40.X miles away from the nearest store...
  ```
- ❌ "CONFIRM DELIVERY" button DISABLED
- ⚠️ Form still pre-filled (Atlantic City address)
  - address: "..." (some street in AC)
  - zip: "08401" or similar
- ⚠️ Green message still shows (but delivery blocked)

#### Behavior:
- ✅ User MUST switch to PICKUP to proceed
- ❌ Cannot complete order via DELIVERY

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### ❌ Test 3: Usuario FUERA de 50 millas (Ambos BLOCKED)

**Test Location:** New York City, NY  
**Coordinates:** `40.7128, -74.0060`  
**Distance:** ~63 miles from Voorhees (nearest)

#### Steps:
1. Override location: `40.7128, -74.0060`
2. Reload app
3. Wait for resolution
4. Click "PICKUP"
5. Observe
6. Click "DELIVERY"
7. Observe

#### Expected Results - PICKUP:
- ❌ Red banner:
  ```
  ⚠️ No pickup locations available near your location.
  The nearest pickup location is 63.2 miles away (Voorhees).
  We only serve customers within 50 miles.
  ```
- ❌ Search field DISABLED
- ❌ "VIEW MENU & ORDER" buttons DISABLED
- ❌ Cannot proceed

#### Expected Results - DELIVERY:
- ❌ Red banner:
  ```
  ⚠️ No stores available for delivery in your area.
  You are 63.X miles away from nearest store...
  ```
- ❌ "CONFIRM DELIVERY" button DISABLED
- ⚠️ Form still pre-filled (NYC address)
  - address: "..." (some street in NYC)
  - zip: "10001" or similar
- ❌ Cannot proceed

#### Behavior:
- ❌ User is COMPLETELY BLOCKED
- ❌ No way to place order
- 💡 Should show contact/expansion message

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🌐 Test 4: IP Geolocation (GPS Denied)

**Test Scenario:** User denies GPS permission → fallback to IP

#### Steps:
1. Clear browser location permission
2. Open app
3. Browser prompts for location → **DENY/BLOCK**
4. Wait ~2-3 seconds for IP fallback
5. Observe modal
6. Once IP location obtained, proceed

#### Expected Results:
- 🔄 Modal: "Determining Your Location..."
- 🌐 Automatic fallback to IP geolocation (ipapi.co)
- ✅ Coords obtained (approximate city/region)
- ℹ️ Blue warning: "Location is approximate (based on IP)"
- ✅ Auto-resolution runs with IP coords
- ⚠️ Pickup/delivery may be assigned based on approximate location

#### Possible Outcomes:
- If IP location is in South NJ → ✅ Pickup/Delivery work
- If IP location is outside area → ❌ Both blocked

#### Testing IP Accuracy:
- Check console for IP coords: `✅ IP geolocation successful: {lat, lng}`
- Compare to actual location
- Distance error typically: 5-20 miles

**IP Location Detected:** _____________________  
**Actual Location:** _____________________  
**Accuracy:** ☐ Good ☐ Fair ☐ Poor  

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🔄 Test 5: Reverse Geocoding Success

**Objective:** Verify address pre-filling works correctly

#### Test Location:** Philadelphia, PA  
**Coordinates:** `39.9526, -75.1652`

#### Steps:
1. Override location: `39.9526, -75.1652`
2. Reload app
3. Wait for resolution
4. Click "DELIVERY"
5. Inspect form fields

#### Expected Results:
- ✅ Nominatim API called:
  ```
  https://nominatim.openstreetmap.org/reverse
  ?format=json&lat=39.9526&lon=-75.1652
  ```
- ✅ Response status: 200 OK
- ✅ Form fields pre-filled:
  - **address:** Street address in Philadelphia
  - **zip:** "19XXX" (Philadelphia ZIP)
- ✅ Green message: "✓ Auto-detected from your location"

#### Network Tab Verification:
- Open Network tab (F12)
- Filter: "nominatim"
- See request to OpenStreetMap
- Status: 200
- Response contains address components

**Address Pre-filled:** _____________________  
**ZIP Pre-filled:** _____________________  
**Correct?** ☐ YES ☐ NO  

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### ⚠️ Test 6: Reverse Geocoding Failure (Network Error)

**Objective:** Verify graceful handling of geocoding failure

#### Steps:
1. Override location: `39.8914, -75.0368`
2. Open Network tab
3. Block requests to "nominatim.openstreetmap.org"
   - Right-click request → Block request URL
4. Reload app
5. Wait for resolution
6. Click "DELIVERY"

#### Expected Results:
- ⚠️ Console error: "Reverse geocoding failed" or "Failed to reverse geocode..."
- ⚠️ `prefilledAddress = null`
- ⚠️ Form fields EMPTY (not pre-filled)
- ✅ NO crash or error modal
- ✅ User can still fill form manually
- ✅ Delivery validation still works (based on coords, not address)

#### Behavior:
- ✅ Degraded experience, but functional
- ✅ User can proceed by entering address manually

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🎯 Test 7: Auto-Assignment Overriding

**Objective:** Verify user can change auto-assigned location

#### Steps:
1. Override location: `39.8914, -75.0368` (Haddonfield)
2. Wait for auto-assignment
3. Observe auto-assigned store: "Haddonfield"
4. Search for "Moorestown"
5. Click "VIEW MENU & ORDER" for Moorestown

#### Expected Results:
- ✅ Initially auto-assigned: Haddonfield
- ✅ Green banner shows Haddonfield
- ✅ User can search other locations
- ✅ User can manually select Moorestown
- ✅ Selection changes to Moorestown
- ✅ Auto-assignment is overridden

#### Behavior:
- ✅ Auto-assignment is a **default**, not a **restriction**
- ✅ User has full control to change

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🔄 Test 8: Mode Switching (Pickup ↔ Delivery)

**Objective:** Verify resolution persists across mode switches

#### Steps:
1. Override location: `39.8914, -75.0368`
2. Wait for resolution
3. Click "PICKUP" → observe auto-assignment
4. Switch to "DELIVERY" → observe pre-filled form
5. Switch back to "PICKUP" → verify still auto-assigned
6. Repeat several times

#### Expected Results:
- ✅ Resolution loads ONCE (not re-triggered)
- ✅ Pickup auto-assignment persists
- ✅ Delivery pre-fill persists
- ✅ No loading banner on switch (already resolved)
- ✅ Smooth transitions

#### Performance:
- ✅ No unnecessary API calls
- ✅ No re-geocoding on switch
- ✅ Fast mode switching

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 📱 Test 9: Mobile Device (Real GPS)

**Device:** _____________________  
**Browser:** _____________________  
**OS:** _____________________

#### Steps:
1. Open app on mobile device
2. Allow location access
3. Wait for GPS coords
4. Verify auto-resolution

#### Expected Results:
- 📍 High-precision GPS coords (±10m)
- ✅ Very accurate reverse geocoding
- ✅ Correct auto-assignment
- ✅ Accurate address pre-fill
- ✅ Responsive UI on mobile

#### GPS Accuracy Check:
- GPS coords: _____________________
- Actual location: _____________________
- Distance error: _____ meters

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🐛 Test 10: Debug Panel Verification

**Objective:** Verify debug panel shows correct data

#### Steps:
1. Add `?debug=true` to URL
2. Override location: `39.8914, -75.0368`
3. Reload app
4. Observe debug panel (bottom-right)
5. Click "PICKUP"
6. Click "DELIVERY"
7. Verify data accuracy

#### Expected Debug Panel Content:
```
🐛 DELIVERY DEBUG

User Location: ✅ 39.8914, -75.0368
Source: GEOLOCATION

Mode: PICKUP

🚗 PICKUP (50mi radius)
Can Pickup: ✅ YES
Auto-Assigned: Haddonfield (0.0 mi)
Pickup Stores (3):
  • Haddonfield (0.0 mi)
  • Voorhees (3.5 mi)
  • Moorestown (5.5 mi)

🚚 DELIVERY (5mi radius)
Can Deliver: ✅ YES
Pre-filled: 119 Kings Hwy E, Haddonfield, NJ 08033
```

#### Verification:
- [ ] User coords displayed correctly
- [ ] Source shown (geolocation/ip)
- [ ] Can Pickup flag correct
- [ ] Auto-assigned store shown
- [ ] Pickup stores list correct
- [ ] Can Deliver flag correct
- [ ] Pre-filled address shown

**Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

## 🔧 Debug Tools

### Console Logs to Check:

#### Successful Resolution:
```
🎯 Auto-resolving pickup and delivery for coords: {lat: 39.8914, lng: -75.0368}
✅ Location resolved: {
  pickup: '✓ Haddonfield',
  delivery: '✓ Haddonfield'
}
📍 Auto-prefilling delivery address: {address: "119 Kings Hwy E", zip: "08033"}
🎯 Auto-assigning pickup location: Haddonfield
```

#### Reverse Geocoding:
```
(No error) = Success
❌ Reverse geocoding failed: 404 = API error
❌ Failed to reverse geocode user location: Error... = Network error
```

---

## 📊 Test Results Summary

| Test | Scenario | Pass/Fail | Notes |
|------|----------|-----------|-------|
| 1 | Within 5mi | ☐ | |
| 2 | 5-50mi | ☐ | |
| 3 | Outside 50mi | ☐ | |
| 4 | IP geolocation | ☐ | |
| 5 | Reverse geocoding | ☐ | |
| 6 | Geocoding failure | ☐ | |
| 7 | Override assignment | ☐ | |
| 8 | Mode switching | ☐ | |
| 9 | Mobile GPS | ☐ | |
| 10 | Debug panel | ☐ | |

**Overall Status:** ☐ PASS ☐ FAIL

---

## ✅ Acceptance Criteria

- [ ] Pickup location auto-assigned based on nearest store
- [ ] Delivery form pre-filled with reverse geocoded address
- [ ] Loading states shown during resolution
- [ ] Success messages displayed when auto-assignment works
- [ ] Error messages shown when outside radius
- [ ] Graceful degradation if reverse geocoding fails
- [ ] User can override auto-assignment
- [ ] Mode switching preserves resolution
- [ ] Works with both GPS and IP geolocation
- [ ] Debug panel shows accurate data
- [ ] Console logs are clear and helpful
- [ ] No crashes or errors

---

## 🔍 Network Tab Checks

### Nominatim API Request:
- [ ] URL: `https://nominatim.openstreetmap.org/reverse`
- [ ] Method: GET
- [ ] Status: 200 OK
- [ ] Response time: < 2 seconds
- [ ] Response contains `address` object
- [ ] Headers include `User-Agent: PassariellosPizzeria/1.0`

### IP Geolocation Request (if GPS denied):
- [ ] URL: `https://ipapi.co/json/`
- [ ] Method: GET
- [ ] Status: 200 OK
- [ ] Response contains `latitude`, `longitude`

---

## 🐛 Common Issues

### Issue: Form not pre-filling
**Check:**
- Console for reverse geocoding errors
- Network tab for Nominatim request
- `locationResolution?.delivery.prefilledAddress` in React DevTools

**Solution:**
- Verify coords are valid
- Check network connection
- Verify Nominatim API is not blocked

---

### Issue: Pickup not auto-assigned
**Check:**
- Console for "Auto-assigning pickup location" log
- `locationResolution?.pickup.autoAssignedStore` in React DevTools
- Distance calculations in debug panel

**Solution:**
- Verify coords are valid
- Check if user is within 50mi of any store
- Verify stores array has correct coords

---

### Issue: Loading never completes
**Check:**
- Console for errors
- Network tab for pending requests
- `resolutionLoading` state in React DevTools

**Solution:**
- Check if async function is completing
- Verify no network errors
- Check if coords are null

---

**Testing Date:** _____________________  
**Tester Name:** _____________________  
**Browser:** _____________________ (Chrome/Safari/Firefox)  
**Device:** _____________________ (Desktop/Mobile)  
**OS:** _____________________ (Windows/Mac/Linux/iOS/Android)  

**Overall Assessment:** _____________________  
**Critical Issues Found:** _____________________  
**Recommendations:** _____________________
