# Toppings Fix - Testing Guide

## Quick Test Steps

### 1. Open Browser Console
Before testing, open your browser's Developer Console (F12) to view debug logs.

### 2. Test Product: **Italian Hoagie** (Cold Hoagie)

**This was a FAILING product** - toppings were not appearing in cart.

**Steps:**
1. Navigate to "Cold Hoagies" → Select "Italian Hoagie"
2. Select these toppings:
   - **Add Toppings**: Select "Lettuce", "Tomatoes", "Onions"
   - **Extra Toppings**: Select "Extra Cheese", "Pickles"
   - **Lite Toppings**: Select "Lite Mayo"
   - **Side Toppings**: Select "Hot Peppers (Side)"
3. Click "ADD TO CART"
4. Check console for two log entries:
   - `🔍 DEBUG TOPPINGS - Phase 1: UI Selections`
   - `✅ DEBUG TOPPINGS - Phase 2: CartItem.selections`

**Expected Results:**

**Phase 1 Log** should show:
```javascript
{
  productName: "Italian Hoagie",
  rawUiSelections: {
    selectedColdHoagieToppings: ["ch1", "ch2", "ch3"], // Lettuce, Tomatoes, Onions
    selectedColdHoagieExtras: ["che1", "che2"],         // Extra Cheese, Pickles
    selectedColdHoagieLite: ["chl1"],                   // Lite Mayo
    selectedColdHoagieSides: ["chs1"]                   // Hot Peppers (Side)
  }
}
```

**Phase 2 Log** should show:
```javascript
{
  totalSelectionsCount: 7, // (3 add + 2 extra + 1 lite + 1 side)
  groupedSelections: {
    "Add Toppings": ["Lettuce", "Tomatoes", "Onions"],
    "Extra Toppings": ["Extra Cheese", "Pickles"],
    "Lite Toppings": ["Lite Mayo"],
    "Side Toppings": ["Hot Peppers (Side)"]
  }
}
```

**Cart Summary** should display ALL 7 toppings grouped by category.

---

### 3. Test Product: **Cheeseburger** (Burger)

**This was a FAILING product** - burger toppings were not appearing.

**Steps:**
1. Navigate to "Burgers" → Select "Cheeseburger"
2. Select cheese (required)
3. Select these toppings:
   - **Add Toppings**: Select "Lettuce", "Tomatoes"
   - **Extra Toppings**: Select "Extra Pickles"
   - **Lite Toppings**: Select "Lite Mayo"
   - **Side Toppings**: Select "Ketchup (Side)"
4. Click "ADD TO CART"

**Expected Results:**

Phase 2 log should show ALL burger topping selections in `selections` array.

Cart summary should display all burger toppings.

---

### 4. Test Product: **Buffalo Chicken Wrap** (Wrap)

**This was a FAILING product** - wrap toppings were not appearing.

**Steps:**
1. Navigate to "Wraps" → Select "Buffalo Chicken Wrap"
2. Select wrap type and cheese (required)
3. Select these toppings:
   - **Add Toppings**: Select "Lettuce", "Tomatoes"
   - **Lite Toppings**: Select "Lite Ranch"
   - **No Toppings**: Select "No Onions"
4. Click "ADD TO CART"

**Expected Results:**

All wrap topping selections should appear in Phase 2 log and cart summary.

---

### 5. Test Product: **Create Your Own Kids Pasta** (Kids Pasta)

**This was a FAILING product** - pasta toppings were not appearing.

**Steps:**
1. Navigate to "Kids Menu" → Select "Create Your Own Kids Pasta"
2. Select pasta type (required): "Penne"
3. Select sauce (required): "Marinara"
4. Select these toppings:
   - **Add Toppings**: Select "Meatballs", "Sausage"
5. Click "ADD TO CART"

**Expected Results:**

Kids pasta toppings should appear in Phase 2 log and cart summary.

---

### 6. Test Product: **Chicken Panini** (Panini)

**Steps:**
1. Navigate to "Paninis" → Select a panini
2. Select panini type (required)
3. Select these toppings:
   - **Lite Toppings**: Select any
   - **No Toppings**: Select any
   - **Side Toppings**: Select any
4. Click "ADD TO CART"

**Expected Results:**

All panini topping selections should appear in cart.

---

## Verification Checklist

For EACH product tested:

- [ ] **Phase 1 log** shows populated arrays for selected toppings
- [ ] **Phase 2 log** shows ALL toppings in `selections` array
- [ ] **Phase 2 log** `totalSelectionsCount` matches number of selections made
- [ ] **Cart summary** displays ALL selected toppings
- [ ] **Cart summary** groups toppings by category correctly
- [ ] **No toppings are missing** from cart
- [ ] **No toppings appear duplicated** in cart

---

## Invariant Test (CRITICAL)

**For ANY product with toppings:**

```
COUNT(UI selections) === COUNT(Phase 2 selections) === COUNT(Cart summary items)
```

If this equation is false for ANY product, there is still a bug.

---

## Common Issues to Watch For

### ❌ Bad: Toppings in Phase 1 but NOT in Phase 2
This means the mapping from UI → selections is broken.

### ❌ Bad: Toppings in Phase 2 but NOT in cart summary
This means the cart rendering is filtering out valid selections.

### ✅ Good: Toppings in Phase 1, Phase 2, AND cart summary
This means the full pipeline is working correctly.

---

## After Testing

Once all tests pass:

1. **Remove debug logs** (or comment them out):
   - Lines with `console.log('🔍 DEBUG TOPPINGS`
   - Lines with `console.log('✅ DEBUG TOPPINGS`

2. **Delete this file** and `/TOPPINGS_DEBUG_SUMMARY.md`

3. **Commit changes** with message:
   ```
   Fix: Add missing topping groups to selections array
   
   - Fixed 15+ topping arrays not being added to selections
   - Added comprehensive getToppingGroupInfo mapping
   - All toppings now appear in cart and order summary
   ```

---

## Troubleshooting

### If toppings are still missing:

1. Check the console logs - which phase is failing?
2. Check `getToppingGroupInfo` - does it include the topping array?
3. Check the add-to-cart button onClick handler - is the topping array being iterated?
4. Check that the topping IDs in the UI match the IDs in the data files

### If you see "Other Toppings" in groupTitle:

This means `getToppingGroupInfo` didn't find a match. Add the missing topping array to the function.
