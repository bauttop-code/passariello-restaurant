export interface Topping {
  id: string;
  name: string;
  price?: number;
  largPrice?: number; // Price for large size
  image?: string;
  included?: boolean;
  removableIngredients?: { id: string; name: string; }[];
}

export type SelectionType =
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
  | "other";

export type BeverageCategory =
  | "20oz"
  | "2_liter"
  | "water"
  | "juice"
  | "other";

export interface CartSelection {
  id: string;               // internal id/code (for logic and pricing)
  label: string;            // human-readable text (for UI display)
  type: SelectionType;      // what kind of selection this is
  groupId?: string;         // for toppings / grouped options
  groupTitle?: string;      // e.g. "Meats", "Cheeses", "Veggies"
  beverageCategory?: BeverageCategory; // if type === "beverage"
  distribution?: 'left' | 'whole' | 'right'; // for pizza topping distribution
}

// LEGACY: Keep for backward compatibility during transition
export interface CartItemCustomization {
  category: string;
  items: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[]; // LEGACY - will be deprecated
  selections?: CartSelection[]; // NEW STRUCTURED MODEL
  category?: string;
}

export interface ToppingSection {
  toppings: Topping[] | readonly Topping[];
  sectionTitle: string;
  groupId: string;
}
