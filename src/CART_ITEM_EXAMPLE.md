# CartItem JSON Example - Before vs After Fix

## Example Product: Create Your Own Cheesesteak

**User Selections:**
- Toast Option: "Toast Roll"
- Cheese: "American"  
- Toppings: "Mushrooms", "Onions"

---

## BEFORE FIX (Bug)

```json
{
  "id": "cart-item-1",
  "productId": "cs1",
  "name": "Create Your Own Cheesesteak",
  "price": 12.50,
  "quantity": 1,
  "image": "...",
  "category": "cheesesteaks",
  
  "customizations": [
    {
      "category": "Toast Option",
      "items": ["Toast Roll"]
    },
    {
      "category": "Cheese",
      "items": ["American"]
    },
    {
      "category": "Toppings",
      "items": ["Mushrooms", "Onions"]
    }
  ],
  
  "selections": [
    // ❌ BUG: toastRoll and selectedCheese were NOT added here!
    // Only toppings were added:
    {
      "id": "st2",
      "label": "Mushrooms",
      "type": "topping",
      "groupId": "cheesesteak_toppings",
      "groupTitle": "Choose Your Toppings"
    },
    {
      "id": "st13",
      "label": "Onions",
      "type": "topping",
      "groupId": "cheesesteak_toppings",
      "groupTitle": "Choose Your Toppings"
    }
  ]
}
```

### Cart Rendering (Before):

The cart rendering code filtered by `type === 'topping'` and found st2 and st13, but their IDs were being displayed instead of grouping properly:

```
Product: Create Your Own Cheesesteak
Price: $12.50

Choose Your Toppings: st2, st13, st10  ❌
```

---

## AFTER FIX ✅

```json
{
  "id": "cart-item-1",
  "productId": "cs1",
  "name": "Create Your Own Cheesesteak",
  "price": 12.50,
  "quantity": 1,
  "image": "...",
  "category": "cheesesteaks",
  
  "customizations": [
    {
      "category": "Toast Option",
      "items": ["Toast Roll"]
    },
    {
      "category": "Cheese",
      "items": ["American"]
    },
    {
      "category": "Toppings",
      "items": ["Mushrooms", "Onions"]
    }
  ],
  
  "selections": [
    // ✅ FIXED: Toast Option is now in selections
    {
      "id": "toast",
      "label": "Toast Roll",
      "type": "required_option",
      "groupId": "toast_option",
      "groupTitle": "Toast Option (Required)"
    },
    // ✅ FIXED: Cheese is now in selections
    {
      "id": "cheese1",
      "label": "American",
      "type": "required_option",
      "groupId": "cheese_required",
      "groupTitle": "Cheese (Required)"
    },
    // Toppings (already working)
    {
      "id": "st2",
      "label": "Mushrooms",
      "type": "topping",
      "groupId": "cheesesteak_toppings",
      "groupTitle": "Choose Your Toppings"
    },
    {
      "id": "st13",
      "label": "Onions",
      "type": "topping",
      "groupId": "cheesesteak_toppings",
      "groupTitle": "Choose Your Toppings"
    }
  ]
}
```

### Cart Rendering (After) ✅:

The cart rendering code now:
1. Filters `type === 'required_option'` and groups by `groupTitle`
2. Filters `type === 'topping'` and groups by `groupTitle`
3. Displays each group with its proper title and labels

```
Product: Create Your Own Cheesesteak
Price: $12.50

Toast Option (Required): Toast Roll
Cheese (Required): American

Toppings:
  Choose Your Toppings: Mushrooms, Onions
```

---

## Example 2: Hot Hoagie with Cheese

**Product:** Chicken Parm Sandwich  
**Selections:** Cheese: "Provolone", Extra: "Lite Mayo"

### AFTER FIX ✅

```json
{
  "id": "cart-item-2",
  "productId": "hh3",
  "name": "Chicken Parm Sandwich",
  "price": 10.99,
  "quantity": 1,
  
  "selections": [
    {
      "id": "hh-cheese5",
      "label": "Provolone",
      "type": "required_option",
      "groupId": "hot_hoagie_cheese_required",
      "groupTitle": "Cheese (Required)"
    },
    {
      "id": "hh-lite1",
      "label": "Lite Mayo",
      "type": "topping",
      "groupId": "hot_hoagie_lite",
      "groupTitle": "Lite Toppings"
    }
  ]
}
```

### Renders As:

```
Chicken Parm Sandwich
$10.99

Cheese (Required): Provolone
Toppings:
  Lite Toppings: Lite Mayo
```

---

## Example 3: Panini

**Product:** Grilled Chicken Panini  
**Selections:** Type: "White Panini", Cheese: "Provolone", Lite: "Lite Mayo"

### AFTER FIX ✅

```json
{
  "id": "cart-item-3",
  "productId": "pan2",
  "name": "Grilled Chicken Panini",
  "price": 11.50,
  "quantity": 1,
  
  "selections": [
    {
      "id": "panini-white",
      "label": "White Panini",
      "type": "required_option",
      "groupId": "panini_type_required",
      "groupTitle": "Choose Your Panini Type (Required)"
    },
    {
      "id": "panini-extra-cheese1",
      "label": "Provolone",
      "type": "topping",
      "groupId": "panini_extra_cheese",
      "groupTitle": "Extra Cheese"
    },
    {
      "id": "panini-lite1",
      "label": "Lite Mayo",
      "type": "topping",
      "groupId": "panini_lite",
      "groupTitle": "Lite Toppings"
    }
  ]
}
```

### Renders As:

```
Grilled Chicken Panini
$11.50

Choose Your Panini Type (Required): White Panini
Toppings:
  Extra Cheese: Provolone
  Lite Toppings: Lite Mayo
```

---

## Example 4: Salad with Multiple Required Options

**Product:** Create Your Own Salad  
**Selections:**
- Base: "Romaine Lettuce"
- Dressing: "Italian"
- Toppings: "Tomatoes", "Cucumbers", "Onions"

### AFTER FIX ✅

```json
{
  "id": "cart-item-4",
  "productId": "salad1",
  "name": "Create Your Own Salad",
  "price": 9.99,
  "quantity": 1,
  
  "selections": [
    {
      "id": "base1",
      "label": "Romaine Lettuce",
      "type": "required_option",
      "groupId": "salad_base_required",
      "groupTitle": "Choose Your Base (Required)"
    },
    {
      "id": "dressing2",
      "label": "Italian",
      "type": "required_option",
      "groupId": "salad_dressing_required",
      "groupTitle": "Choose Your Dressing (Required)"
    },
    {
      "id": "topping1",
      "label": "Tomatoes",
      "type": "topping",
      "groupId": "salad_toppings",
      "groupTitle": "Choose Your Toppings"
    },
    {
      "id": "topping2",
      "label": "Cucumbers",
      "type": "topping",
      "groupId": "salad_toppings",
      "groupTitle": "Choose Your Toppings"
    },
    {
      "id": "topping3",
      "label": "Onions",
      "type": "topping",
      "groupId": "salad_toppings",
      "groupTitle": "Choose Your Toppings"
    }
  ]
}
```

### Renders As:

```
Create Your Own Salad
$9.99

Choose Your Base (Required): Romaine Lettuce
Choose Your Dressing (Required): Italian
Choose Your Toppings: Tomatoes, Cucumbers, Onions
```

---

## Key Differences

### BEFORE (Bug):
- ❌ Required options NOT in `selections` array
- ❌ Only `customizations` had the data
- ❌ Cart rendering showed raw IDs or generic labels
- ❌ No group titles for required options

### AFTER (Fixed):
- ✅ Required options IN `selections` array with `type: 'required_option'`
- ✅ Each has proper `groupTitle` (e.g., "Toast Option (Required)")
- ✅ Each has human-readable `label` (e.g., "Toast Roll")
- ✅ Cart rendering groups by `groupTitle` and displays labels
- ✅ No raw IDs visible to users

---

## Data Model

```typescript
interface CartSelection {
  id: string;               // Internal ID for logic/pricing
  label: string;            // Human-readable text for display
  type: SelectionType;      // Type of selection
  groupId?: string;         // Group identifier
  groupTitle?: string;      // Display title for the group
  beverageCategory?: string;
  distribution?: 'left' | 'whole' | 'right';
}

type SelectionType =
  | "topping"
  | "extra_topping"
  | "required_option"  // ← NEW TYPE ADDED
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
```

---

## Rendering Logic

```typescript
// In CartSidebar.tsx

// 1. Render required options FIRST
const requiredOptions = item.selections.filter(s => s.type === 'required_option');
// Group by groupTitle and display

// 2. Render toppings
const toppings = item.selections.filter(s => s.type === 'topping' || s.type === 'extra_topping');
// Group by groupTitle and display

// 3. Render other types (sides, desserts, beverages, etc.)
const otherSelections = item.selections.filter(s => s.type === 'side' || s.type === 'dessert' || ...);
// Display by type
```

This ensures:
- Required options appear first with their proper group titles
- Toppings are grouped properly
- Everything displays with human-readable labels
- No raw IDs are shown
