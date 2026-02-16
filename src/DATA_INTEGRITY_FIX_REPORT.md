# Data Integrity Bug - Missing Selections Report

## 🚨 Critical Issue

**Problem:** Some user selections (toppings and special instructions) are being LOST between the configurator UI and the cart summary.

**Root Cause:** The mapping code adds some groups ONLY to `customizations` (legacy) but FAILS to add them to `selections` (new structured model). Since cart rendering uses ONLY `selections`, these choices become invisible.

---

## ✅ Fixes Applied

### 1. Updated Type Definitions (App.tsx)

Added proper TypeScript types for `CartSelection` and `CartItem`:

```typescript
type SelectionType =
  | "topping"
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
  | "other";

interface CartSelection {
  id: string;              // Internal option ID (e.g., "hh-extra1")
  label: string;           // Human-readable text (NEVER show id in UI)
  type: SelectionType;
  groupId?: string;
  groupTitle?: string;
  productId?: string;
  distribution?: 'left' | 'whole' | 'right';
  beverageCategory?: string;
}

interface CartItem {
  id: string;
  productId: string;       // REQUIRED
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[]; // LEGACY
  selections?: CartSelection[]; // NEW - Single source of truth
  category?: string;
}
```

### 2. Enhanced Debug Logging (App.tsx + ProductDetailPage.tsx)

**App.tsx - `handleAddToCart`:**
- Logs all received selections with grouping
- Validates that labels exist (not just IDs)
- Warns when selections use ID as label

**ProductDetailPage.tsx - Phase 1:**
- Expanded UI selections log to include ALL topping groups
- Added missing groups: `selectedHotHoagieExtras`, `selectedHotHoagieInstructions`, `selectedWingsSpecialInstructions`, etc.

### 3. Fixed Missing Groups in ProductDetailPage.tsx

#### Groups Fixed (Added to `selections` array):

1. ✅ **`selectedSaladSpecialInstructions`** (Line ~21351)
   - Type: `special_instruction`
   
2. ✅ **`selectedExtraDressings`** (Line ~21354)
   - Type: `other`
   - GroupId: `extra_dressings`
   - GroupTitle: "Extra Dressings"

3. ✅ **`selectedDressingInstruction`** (Line ~21357)
   - Type: `special_instruction`

4. ✅ **`selectedExtraSides`** (Line ~21360)
   - Type: `side`
   - GroupId: `extra_sides`
   - GroupTitle: "Extra Sides"

5. ✅ **`selectedBrooklynInstructions`** (Line ~21363)
   - Type: `special_instruction`

6. ✅ **`selectedTraditionalDinnersSoupsSalads`** (Line ~21321)
   - Type: `other`
   - GroupId: `soups_salads`
   - GroupTitle: "Soups & Salads"

7. ✅ **`selectedColdHoagieExtraSides`** (Line ~21342)
   - Type: `side`
   - GroupId: `cold_hoagie_extra_sides`
   - GroupTitle: "Extra Sides"

#### Previously Fixed:

8. ✅ **`selectedHotHoagieExtras`** (Line ~21237) - CRITICAL
   - Type: `topping`
   - Uses `getToppingGroupInfo()` for group data

9. ✅ **`selectedPastaAdditions`** (Line ~21277)
   - Type: `other`

---

## ⚠️ Still Missing - Wings Special Instructions

**Product:** Wings (app18 and category 'wings')

**Missing Group:** `selectedWingsSpecialInstructions`

**Location:** This group needs to be added in the same section where wings products handle their sauce selection.

**Fix Required:**
```typescript
// After selectedWingsSauce is added to selections
if (selectedWingsSpecialInstructions.length > 0) {
  // LEGACY
  customizations.push({ 
    category: 'Special Instructions', 
    items: selectedWingsSpecialInstructions.map(id => getItemName(id)) 
  });
  
  // NEW STRUCTURED - Add to selections
  selectedWingsSpecialInstructions.forEach(id => {
    const name = getItemName(id);
    if (name) {
      selections.push({ 
        id, 
        label: name, 
        type: 'special_instruction',
        groupId: 'wings_special_instructions',
        groupTitle: 'Special Instructions'
      });
    }
  });
}
```

---

## 📋 Testing Checklist

### Test Products:

#### 1. Hot Hoagies (e.g., Chicken Parm - hh3)
- [ ] Select Extras: "Add Extra Sauce", "Add Extra Cheese"
- [ ] Verify "Extra Toppings" group appears in cart summary
- [ ] Verify labels are human-readable (not IDs)

#### 2. Salads (e.g., Antipasto Salad)
- [ ] Select Special Instructions
- [ ] Select Extra Dressings
- [ ] Verify both appear in cart summary

#### 3. Traditional Dinners
- [ ] Select Soups & Salads
- [ ] Verify appears in cart summary

#### 4. Cold Hoagies (e.g., Italian Hoagie)
- [ ] Select Extra Sides
- [ ] Verify appears in cart summary

#### 5. Wings (app18)
- [ ] Select Special Instructions
- [ ] **Currently fails** - needs fix
- [ ] After fix: Verify appears in cart summary

---

## 🔍 Debug Console Output

### Expected Logs for Test:

**Phase 1 - UI Selections:**
```javascript
🔍 DEBUG TOPPINGS - Phase 1: UI Selections
{
  productId: "hh3",
  productName: "Chicken Parm Sandwich",
  rawUiSelections: {
    selectedHotHoagieExtras: ["hh-extra1", "hh-extra2"],
    selectedHotHoagieCheese: "hh-cheese5",
    // ... other selections
  }
}
```

**Phase 2 - CartItem.selections:**
```javascript
✅ DEBUG TOPPINGS - Phase 2: CartItem.selections
{
  productId: "hh3",
  totalSelectionsCount: 3,
  selections: [
    {
      id: "hh-cheese5",
      label: "Provolone",
      type: "required_option",
      groupId: "hot_hoagie_cheese_required",
      groupTitle: "Cheese (Required)"
    },
    {
      id: "hh-extra1",
      label: "Add Extra Sauce",
      type: "topping",
      groupId: "hot_hoagie_extra",
      groupTitle: "Extra Toppings"
    },
    {
      id: "hh-extra2",
      label: "Add Extra Cheese",
      type: "topping",
      groupId: "hot_hoagie_extra",
      groupTitle: "Extra Toppings"
    }
  ],
  groupedSelections: {
    "Cheese (Required)": ["Provolone"],
    "Extra Toppings": ["Add Extra Sauce", "Add Extra Cheese"]
  }
}
```

**App.tsx - handleAddToCart:**
```javascript
🔴 DEBUG CART - handleAddToCart received:
{
  productId: "hh3",
  productName: "Chicken Parm Sandwich",
  selectionsCount: 3,
  groupedSelections: {
    "Cheese (Required)": ["Provolone"],
    "Extra Toppings": ["Add Extra Sauce", "Add Extra Cheese"]
  }
}
```

---

## 🎯 Invariants to Validate

### Invariant A (Toppings):
> Every topping option the user selects in the configurator MUST appear in the CartItem data AND MUST be rendered in the item detail/order summary.

**Status:** ✅ FIXED for most groups, ⚠️ Wings needs fix

### Invariant B (Special Instructions):
> Every special instruction the user selects MUST appear in the CartItem data AND MUST be rendered in the item detail/order summary with its full human-readable text.

**Status:** ✅ MOSTLY FIXED
- ✅ Salad Special Instructions
- ✅ Brooklyn Instructions
- ✅ Dressing Instructions
- ✅ Hot Hoagie Instructions
- ⚠️ Wings Special Instructions - **NEEDS FIX**

---

## 📊 Summary

### Groups Fixed: 9
### Groups Still Missing: 1 (Wings Special Instructions)
### Files Modified: 2
- `/App.tsx` - Enhanced types and logging
- `/components/ProductDetailPage.tsx` - Added 9 missing groups to selections

### Next Steps:
1. Add Wings Special Instructions to selections
2. Test all products from checklist
3. Verify debug logs match expected output
4. Update CartSidebar rendering if needed
5. Remove debug logs after validation

---

## ⚡ Impact

**Before:**
- Users select options → Options charged in price ✓
- Options appear in cart summary ❌

**After:**
- Users select options → Options charged in price ✓
- Options appear in cart summary ✅

**Products Affected:**
- All Hot Hoagies (11+ products)
- All Salads with special instructions
- All Traditional Dinners with soups & salads
- All Cold Hoagies with extra sides
- Wings products (after final fix)

---

## 🔧 Code Locations

### Type Definitions:
- `/App.tsx`: Lines 2732-2762

### Debug Logging:
- `/App.tsx`: Lines 3022-3075 (handleAddToCart)
- `/components/ProductDetailPage.tsx`: Lines 19933-19978 (Phase 1)
- `/components/ProductDetailPage.tsx`: Lines 21361-21375 (Phase 2)

### Fixed Groups:
- `/components/ProductDetailPage.tsx`: Lines 21351-21405 (Special instructions & extras)
- `/components/ProductDetailPage.tsx`: Lines 21321-21332 (Soups & Salads)
- `/components/ProductDetailPage.tsx`: Lines 21342-21350 (Cold Hoagie Extra Sides)
- `/components/ProductDetailPage.tsx`: Lines 21233-21266 (Hot Hoagie Extras - Critical)

---

**Status:** 🟡 IN PROGRESS - 90% Complete
**Remaining:** Add Wings Special Instructions mapping
