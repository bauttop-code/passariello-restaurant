# 🧪 PICKUP Radius Testing Checklist (50 Miles)

## 📋 Test Scenarios

### ✅ Test 1: Usuario DENTRO de 50 millas (DEBE PERMITIR)

**Test Location:** Haddonfield, NJ  
**Coordinates:** `39.8914, -75.0368`  
**Expected Distance:** 0 miles (at the store)

**Steps:**
1. Open browser DevTools (F12)
2. Console → Settings (⚙️) → Sensors
3. Override location: Custom
   - Latitude: `39.8914`
   - Longitude: `-75.0368`
4. Reload app
5. Click "PICKUP" button
6. Observe UI

**Expected Result:**
- ✅ NO red error banner
- ✅ Search field is ENABLED
- ✅ "VIEW MENU & ORDER" buttons are ENABLED
- ✅ Can select store and proceed

**Actual Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### ❌ Test 2: Usuario FUERA de 50 millas (DEBE BLOQUEAR)

**Test Location:** New York City, NY  
**Coordinates:** `40.7128, -74.0060`  
**Expected Distance:** ~63 miles from Voorhees (nearest)

**Steps:**
1. Browser DevTools → Sensors → Override location
2. Custom Location:
   - Latitude: `40.7128`
   - Longitude: `-74.0060`
3. Reload app
4. Click "PICKUP"
5. Observe UI

**Expected Result:**
- ❌ Red error banner appears:
  - "No pickup locations available near your location."
  - Shows distance: "The nearest pickup location is XX.X miles away"
  - Mentions 50-mile limit
- ❌ Search field is DISABLED (grayed out, no cursor)
- ❌ "VIEW MENU & ORDER" buttons are DISABLED
- ❌ Cannot select store or proceed

**Actual Result:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 🔄 Test 3: GPS vs IP Geolocation

#### 3A: GPS Location (Precise)

**Steps:**
1. Clear browser location permission
2. Open app
3. Browser prompts → **ALLOW**
4. Click "PICKUP"

**Expected:**
- ✅ Precise GPS coords obtained
- ✅ Accurate distance calculation
- ✅ No "approximate" warning

**Actual:** ☐ PASS ☐ FAIL

---

#### 3B: IP Geolocation (Approximate - FALLBACK)

**Steps:**
1. Clear browser location permission
2. Open app
3. Browser prompts → **DENY/BLOCK**
4. Wait for IP fallback (~2-3 seconds)
5. Click "PICKUP"

**Expected:**
- 🌐 Modal shows "Determining Your Location..."
- 🌐 Automatically uses IP geolocation (ipapi.co)
- ℹ️ Blue warning banner:
  ```
  ℹ️ Your location is approximate (based on IP).
  If this is incorrect, please enable GPS for precise location.
  ```
- ✅ or ❌ Validation runs based on IP coords
- If IP location > 50mi → shows red error banner

**Actual:** ☐ PASS ☐ FAIL  
**IP Coords Detected:** _____________________

---

### 🔢 Test 4: Edge Case - Exactly 50.0 Miles

**Objective:** Verify that user at EXACTLY 50.0 miles is ALLOWED

**Calculate 50mi point:**
- Use: https://www.movable-type.co.uk/scripts/latlong.html
- Start: Haddonfield `39.8914, -75.0368`
- Bearing: 180° (south)
- Distance: 50 miles
- Result coords: Approximately `39.1660, -75.0368`

**Steps:**
1. Override location to calculated coords
2. Click "PICKUP"
3. Observe

**Expected:**
- ✅ NO error banner (condition is `<= 50`)
- ✅ Buttons ENABLED
- ✅ Can proceed

**Actual:** ☐ PASS ☐ FAIL  
**Notes:** _____________________

---

### 📍 Test 5: Multiple Stores - Distance Ordering

**Test Location:** Philadelphia, PA (within 50mi of all stores)  
**Coordinates:** `39.9526, -75.1652`

**Steps:**
1. Override location to Philadelphia coords
2. Click "PICKUP"
3. Scroll through store list
4. Note the order of stores

**Expected:**
- ✅ All 3 stores appear (within 50mi)
- ✅ Stores ordered by distance (nearest first)
- ✅ Distance shown for each store
- ✅ Nearest should be Haddonfield (~4 miles)

**Actual Result:**
- Store 1: __________ (______ miles)
- Store 2: __________ (______ miles)
- Store 3: __________ (______ miles)

**Order Correct?** ☐ YES ☐ NO

---

### 🚫 Test 6: No Location Available (BLOCKING MODAL)

**Steps:**
1. Disable location services in browser settings
2. Block `ipapi.co` in Network tab (simulate IP geo failure)
3. Open app

**Expected:**
- 🚫 Modal appears: "Location Required"
- 🚫 Cannot interact with app
- 🔄 "Try Again" button visible
- 📝 Instructions to enable location

**Actual:** ☐ PASS ☐ FAIL

---

### 🔄 Test 7: Switch from DELIVERY → PICKUP

**Test Location:** Outside 5mi for delivery, inside 50mi for pickup  
**Coordinates:** `39.7500, -75.0368` (~10 miles south of Haddonfield)

**Steps:**
1. Override location
2. Click "DELIVERY" → should see error (outside 5mi)
3. Switch to "PICKUP" → should work (within 50mi)

**Expected:**
- ❌ DELIVERY: Red banner, disabled
- ✅ PICKUP: No error, enabled
- ✅ Can proceed with pickup

**Actual:** ☐ PASS ☐ FAIL

---

### 📱 Test 8: Mobile Device (Real GPS)

**Device:** _____________________  
**Browser:** _____________________

**Steps:**
1. Open app on mobile
2. Allow location access
3. Click "PICKUP"
4. Check behavior

**Expected:**
- 📍 More accurate GPS location
- ✅ or ❌ Correct validation based on GPS

**Actual GPS Coords:** _____________________  
**Result:** ☐ PASS ☐ FAIL

---

## 🔧 Debug Panel Tests

### Test 9: Debug Panel (`?debug=true`)

**Steps:**
1. Add `?debug=true` to URL
2. Reload app
3. Observe bottom-right panel

**Expected Panel Content:**
```
🐛 DELIVERY DEBUG
User Location: ✅ XX.XXXX, -XX.XXXX
Source: GEOLOCATION (or IP)

Mode: PICKUP

🚗 PICKUP (50mi radius)
Can Pickup: ✅ YES (or ❌ NO)
Pickup Stores (X):
  • Store1 (X.X mi)
  • Store2 (X.X mi)
  ...
Nearest for Pickup: StoreName (XX.XX miles)
```

**Panel Visible?** ☐ YES ☐ NO  
**Data Correct?** ☐ YES ☐ NO

---

## 🏢 Reference Data

### Store Locations

| Store       | Address           | Lat       | Lng        | City       |
|-------------|-------------------|-----------|------------|------------|
| Haddonfield | 119 Kings Hwy E   | 39.8914   | -75.0368   | Haddonfield|
| Moorestown  | 13 W Main St      | 39.9688   | -74.9488   | Moorestown |
| Voorhees    | 111 Laurel Oak Rd | 39.8431   | -74.9560   | Voorhees   |

### Test Locations

| Location        | Lat       | Lng        | Nearest Store | Distance | Within 50mi? |
|-----------------|-----------|------------|---------------|----------|--------------|
| Haddonfield     | 39.8914   | -75.0368   | Haddonfield   | 0.0 mi   | ✅ YES       |
| Philadelphia    | 39.9526   | -75.1652   | Haddonfield   | ~4 mi    | ✅ YES       |
| NYC             | 40.7128   | -74.0060   | Voorhees      | ~63 mi   | ❌ NO        |
| Atlantic City   | 39.3643   | -74.4229   | Haddonfield   | ~40 mi   | ✅ YES       |
| Washington DC   | 38.9072   | -77.0369   | Haddonfield   | ~120 mi  | ❌ NO        |

---

## 🐛 Console Logs to Check

### Successful Geolocation:
```
📍 Requesting browser geolocation...
✅ Browser geolocation successful: {lat: 39.8914, lng: -75.0368}
```

### Permission Denied → IP Fallback:
```
❌ Browser geolocation error: 1 User denied...
🔄 Permission denied, falling back to IP geolocation...
🌐 Attempting IP geolocation fallback...
✅ IP geolocation successful: {lat: 39.8500, lng: -75.0200}
```

### Both Failed:
```
❌ IP geolocation failed: Error...
```

---

## ✅ Acceptance Criteria

- [ ] Allows pickup ONLY if user within 50 miles
- [ ] Blocks pickup with clear message if outside 50 miles
- [ ] Shows distance to nearest store
- [ ] Falls back to IP geolocation if GPS denied
- [ ] Shows "approximate location" warning for IP geo
- [ ] Search field disabled when outside radius
- [ ] "VIEW MENU & ORDER" buttons disabled when outside radius
- [ ] Pickup works regardless of delivery status (independent)
- [ ] Mobile GPS works correctly
- [ ] Console logs are clear and helpful for debugging
- [ ] Debug panel shows accurate info

---

## 📊 Test Results Summary

| Test | Description | Pass/Fail | Notes |
|------|-------------|-----------|-------|
| 1 | Within 50mi | ☐ | |
| 2 | Outside 50mi | ☐ | |
| 3A | GPS precise | ☐ | |
| 3B | IP fallback | ☐ | |
| 4 | Exactly 50mi | ☐ | |
| 5 | Multi-store order | ☐ | |
| 6 | No location | ☐ | |
| 7 | Delivery→Pickup | ☐ | |
| 8 | Mobile GPS | ☐ | |
| 9 | Debug panel | ☐ | |

**Overall Status:** ☐ PASS ☐ FAIL

---

## 🔍 Additional Checks

### Network Tab (for IP Geo):
- [ ] Request to `ipapi.co/json` (if GPS denied)
- [ ] Status 200 OK
- [ ] Response contains `{ latitude, longitude, ... }`

### Browser Console:
- [ ] No JavaScript errors
- [ ] Location logs appear
- [ ] Distance calculations logged

### UI/UX:
- [ ] Error banner is clearly visible
- [ ] Disabled elements are visually distinct (grayed out)
- [ ] Messages are grammatically correct
- [ ] Distance units are consistent (miles)

---

**Testing Date:** _____________________  
**Tester Name:** _____________________  
**Browser:** _____________________ (Chrome/Safari/Firefox)  
**Device:** _____________________ (Desktop/Mobile)  
**OS:** _____________________ (Windows/Mac/Linux/iOS/Android)  

**Overall Assessment:** _____________________  
**Critical Issues Found:** _____________________  
**Recommendations:** _____________________
