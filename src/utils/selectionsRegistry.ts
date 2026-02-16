/**
 * Selection Registry System
 * Automatically captures ALL user selections across all product categories
 * and converts them into CartSelection[] format for display in the cart.
 * 
 * CRITICAL: Uses canonical lookup from product configuration to ensure
 * labels and group titles match exactly what users see in the UI.
 */

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
  | "no_topping"
  | "other";

/**
 * Represents an option configuration (e.g., a topping, side, instruction)
 */
export interface OptionConfig {
  id: string;
  name: string;
  label?: string;
  title?: string;
  price?: number;
  image?: string;
}

/**
 * Represents an option group (e.g., a banner section)
 */
export interface OptionGroup {
  id: string;
  title: string;
  type?: SelectionType;
  items?: OptionConfig[];
  options?: OptionConfig[];
}

/**
 * Metadata for a single selection option
 */
export interface SelectionMeta {
  id: string;
  label: string;       // visible option name, e.g. "Broccoli"
  groupId: string;     // e.g. "traditional_dinner_sides"
  groupTitle: string;  // visible banner text, e.g. "Add Sides (Required - Choose 2)"
  type?: SelectionType;
}

/**
 * Lookup structure for all options
 */
export interface SelectionLookup {
  byOptionId: Record<string, SelectionMeta>;
}

export type BeverageCategory =
  | "20oz"
  | "2_liter"
  | "water"
  | "juice"
  | "other";

export interface CartSelection {
  id: string;
  label: string;
  type: SelectionType;
  groupId?: string;
  groupTitle?: string;
  beverageCategory?: BeverageCategory;
  distribution?: 'left' | 'whole' | 'right';
  productId?: string;
  displayName?: string;
  name?: string;
}

export type RawSelectionShape =
  | { kind: "stringArray"; value: string[] | undefined }
  | { kind: "singleString"; value: string | null | undefined }
  | { kind: "stringRecord"; value: Record<string, string> | undefined }
  | { kind: "numberRecord"; value: Record<string, number> | undefined }
  | { kind: "booleanRecord"; value: Record<string, boolean> | undefined };

/**
 * Extracts IDs from various selection state formats
 */
export const extractIdsFromSource = (source: RawSelectionShape): string[] => {
  if (!source || source.value == null) return [];

  switch (source.kind) {
    case "stringArray":
      return Array.isArray(source.value)
        ? (source.value as string[]).filter(Boolean)
        : [];
    case "singleString":
      return source.value ? [source.value as string] : [];
    case "stringRecord":
      return Object.keys(source.value as Record<string, string>);
    case "numberRecord":
      return Object.keys(source.value as Record<string, number>).filter(
        key => (source.value as Record<string, number>)[key] > 0
      );
    case "booleanRecord":
      return Object.entries(source.value as Record<string, boolean>)
        .filter(([, selected]) => !!selected)
        .map(([id]) => id);
    default:
      return [];
  }
};

/**
 * Checks if a selection with given ID already exists
 */
export const hasSelectionWithId = (id: string, selections: CartSelection[]) =>
  selections.some((sel) => sel.id === id);

/**
 * Adds a selection if it doesn't already exist
 * CRITICAL: Only adds if we have a real label from getItemName
 * NEVER uses the ID as label
 */
export const addSelectionIfMissing = (
  selections: CartSelection[],
  id: string,
  getItemName: (id: string) => string,
  product: { id: string; name: string },
  opts: {
    fallbackType?: SelectionType;
    fallbackGroupId?: string;
    fallbackGroupTitle?: string;
    debugKey?: string;
    quantityLabel?: string;
  } = {}
) => {
  if (!id) return;
  if (hasSelectionWithId(id, selections)) return;

  let name = getItemName(id);
  
  // CRITICAL: If getItemName returns empty or equals the ID, try to humanize it
  // This prevents showing internal IDs in the cart
  if (!name || name === id || name === '') {
    console.warn(`[SelectionsRegistry] Missing label for ID: ${id} (${opts.debugKey})`, {
      productId: product.id,
      productName: product.name
    });
    
    // Fallback: humanize the ID (last resort)
    name = id.split(/[-_]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log(`[SelectionsRegistry] Using humanized fallback: "${name}" for ID: ${id}`);
  }

  const baseLabel = opts.quantityLabel ? `${name} ${opts.quantityLabel}` : name;

  selections.push({
    id,
    label: baseLabel,
    displayName: name,
    name: name,
    type: opts.fallbackType ?? "topping",
    groupId: opts.fallbackGroupId,
    groupTitle: opts.fallbackGroupTitle,
    productId: product.id,
  });
};

/**
 * Infers group title from the selection key name
 */
const inferGroupTitle = (key: string): string | undefined => {
  const keyLower = key.toLowerCase();
  
  if (keyLower.includes("sauce") && !keyLower.includes("substitute")) return "Sauce";
  if (keyLower.includes("dressing")) return "Dressing";
  if (keyLower.includes("side")) return "Sides";
  if (keyLower.includes("cheese")) return "Cheese";
  if (keyLower.includes("base")) return "Salad Base";
  if (keyLower.includes("toppings")) return "Toppings";
  if (keyLower.includes("platter")) return "Platter Options";
  if (keyLower.includes("specialinstructions") || keyLower.includes("instructions")) return "Special Instructions";
  if (keyLower.includes("dipping")) return "Pizza Dippings";
  if (keyLower.includes("type") && keyLower.includes("pasta")) return "Pasta Type";
  if (keyLower.includes("type") && keyLower.includes("wrap")) return "Wrap Type";
  if (keyLower.includes("type") && keyLower.includes("panini")) return "Panini Type";
  if (keyLower.includes("substitute")) return "Substitutions";
  if (keyLower.includes("quantity")) return "Quantity";
  if (keyLower.includes("toast")) return "Toast Option";
  if (keyLower.includes("soup")) return "Soup";
  if (keyLower.includes("addition")) return "Additions";
  if (keyLower.includes("extra")) return "Extras";
  
  return undefined;
};

/**
 * Master function to complete selections from all raw sources
 */
export const completeSelectionsFromRawSources = (
  selections: CartSelection[],
  rawSources: Record<string, RawSelectionShape>,
  getItemName: (id: string) => string,
  product: { id: string; name: string }
) => {
  console.log('[SelectionsRegistry] Starting auto-capture', {
    productId: product.id,
    productName: product.name,
    existingSelectionsCount: selections.length,
    totalRawSources: Object.keys(rawSources).length,
  });

  let addedCount = 0;

  Object.entries(rawSources).forEach(([key, source]) => {
    if (!source) return;

    const ids = extractIdsFromSource(source);
    if (!ids.length) return;

    const isQuantity = key.toLowerCase().includes("quantity") || key.toLowerCase().includes("size");
    const fallbackGroupTitle = inferGroupTitle(key);

    ids.forEach((id) => {
      const sizeBefore = selections.length;
      addSelectionIfMissing(selections, id, getItemName, product, {
        debugKey: key,
        fallbackType: isQuantity ? "required_option" : "topping",
        fallbackGroupTitle,
      });
      if (selections.length > sizeBefore) addedCount++;
    });
  });

  console.log('[SelectionsRegistry] Auto-capture complete', {
    productId: product.id,
    productName: product.name,
    addedCount,
    finalSelectionsCount: selections.length,
  });
};

/**
 * Builds a canonical lookup from option arrays used to render UI
 * This ensures labels and group titles match EXACTLY what users see
 * 
 * @param groups - Array of { id, title, items, type } objects representing UI banners
 * @returns Lookup object mapping optionId -> { label, groupId, groupTitle, type }
 */
export const buildSelectionLookup = (
  groups: Array<{
    id: string;
    title: string;
    items: OptionConfig[];
    type?: SelectionType;
  }>
): SelectionLookup => {
  const byOptionId: Record<string, SelectionMeta> = {};

  groups.forEach((group) => {
    const groupId = group.id;
    const groupTitle = group.title;
    const groupType = group.type;

    group.items.forEach((opt) => {
      if (!opt.id) return;
      
      // Use name, label, or title - whatever is available
      const label = opt.name || opt.label || opt.title || String(opt.id);
      
      byOptionId[opt.id] = {
        id: opt.id,
        label,
        groupId,
        groupTitle,
        type: groupType,
      };
    });
  });

  return { byOptionId };
};

/**
 * Registers options from a flat array into the lookup
 * Used for options that aren't part of a visual group/banner
 */
export const registerOptionsToLookup = (
  lookup: SelectionLookup,
  options: OptionConfig[],
  groupConfig: {
    groupId: string;
    groupTitle: string;
    type?: SelectionType;
  }
) => {
  options.forEach((opt) => {
    if (!opt.id) return;
    
    const label = opt.name || opt.label || opt.title || String(opt.id);
    
    lookup.byOptionId[opt.id] = {
      id: opt.id,
      label,
      groupId: groupConfig.groupId,
      groupTitle: groupConfig.groupTitle,
      type: groupConfig.type,
    };
  });
};