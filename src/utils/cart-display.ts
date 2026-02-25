
// Types needed for display logic
export interface CartSelection {
  id: string;
  label: string;
  type: string;
  groupId?: string;
  groupTitle?: string;
  distribution?: 'left' | 'whole' | 'right';
  displayName?: string;
  name?: string;
  removedIngredients?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  productId?: string;
  selections?: CartSelection[];
  customizations?: any[]; // legacy strings or objects
}

// Check if item is Wings
const isWingsItem = (item: CartItem): boolean => {
  const category = (item.category || '').toLowerCase();
  const productId = (item.productId || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  // Hard exclusion: cheesesteaks can contain "Add Wings (10)" as an extra side.
  // They must never be routed to wings display/title logic.
  if (category.includes('cheesesteak') || productId.includes('chstk') || name.includes('cheesesteak')) {
    return false;
  }

  return (
    (item.category === 'wings') ||
    (productId === 'capp1') ||
    (item.productId && (['w1', 'app18'].includes(item.productId) || item.productId.startsWith('wing'))) ||
    (item.name && item.name.toLowerCase().includes('wings')) ||
    (item.selections && item.selections?.some(s =>
      (s.groupId && (s.groupId.includes('wings_sauce') || s.groupId.includes('wings_extra') || s.groupId.includes('wings_dipping')))
    )) || false
  );
};

const isChickenTendersItem = (item: CartItem): boolean => {
  const productId = (item.productId || item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  return (
    productId === 'app6' ||
    productId === 'wing3' ||
    productId === 'capp2' ||
    name.includes('chicken tenders') ||
    !!item.selections?.some((s) => String(s?.groupId || '').toLowerCase().includes('chicken_tenders'))
  );
};

const isMozzarellaSticksItem = (item: CartItem): boolean => {
  const productId = (item.productId || item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  return (
    productId === 'app4' ||
    productId === 'wing4' ||
    productId === 'capp3' ||
    name.includes('mozzarella sticks')
  );
};

const isAranciniItem = (item: CartItem): boolean => {
  const productId = (item.productId || item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  return (
    productId === 'app8' ||
    productId === 'capp4' ||
    name.includes('arancini rice ball')
  );
};

// Check if item is Appetizer (Sticks/Tenders/Arancini) for filtering artifacts
const isAppetizerWithArtifacts = (item: CartItem): boolean => {
  if (!item.name) return false;
  return (
    item.name.includes('Mozzarella Sticks') || 
    item.name.includes('Chicken Tenders') || 
    item.name.includes('Arancini Rice Ball')
  );
};

// --- QTY & SIZE HELPERS ---

const formatQtyPrefix = (qty: number): string => {
  return qty > 1 ? `${qty} ` : '';
};

const getItemSize = (item: CartItem): string | null => {
  // 1. Customizations
  if (item.customizations) {
      const sizeBlock = item.customizations.find(c => 
          c.category && (c.category === 'Size' || c.category === 'Tamaño')
      );
      if (sizeBlock && sizeBlock.items && sizeBlock.items.length > 0) {
          // Return raw string, let caller clean if needed
          return sizeBlock.items[0];
      }
  }
  // 2. Selections
  if (item.selections) {
      const sizeSel = item.selections.find(s => {
          // Explicit Size types
          if (s.type === 'size' || s.groupTitle === 'Size' || s.groupId === 'size_options') return true;
          
          // Required Options - Strict Keyword Check to avoid "Crust" or "Cook Level"
          if (s.type === 'required_option') {
             const label = (s.label || '').toLowerCase();
             const group = (s.groupTitle || '').toLowerCase();
             // Whitelist typical size words
             return /medium|large|jumbo|small|personal|giant|sheet|slice|10"|12"|14"|16"|18"/.test(label) ||
                    /\b\d+\s*(pcs?|pieces?)\b/.test(label) ||
                    /\bserves?\b/.test(label) ||
                    /size|tamaño/.test(group);
          }
          return false;
      });
      if (sizeSel) {
          return sizeSel.label;
      }
  }
  return null;
};

// --- WINGS NORMALIZATION ---

const normalizeWingsQuantityText = (text: string): string => {
  // Regex to detect "10 pcs", "10 pieces", "(10 pcs)", etc.
  const pcsMatch = text.match(/(?:Wings\s*)?\(?(\d+)\s*(?:pcs|pieces|pc)\)?/i);
  if (pcsMatch) {
    return `${pcsMatch[1]} Wings`;
  }
  return text;
};

// --- TITLE BUILDER ---

export const buildCartDisplayTitle = (item: CartItem): string => {
  let name = item.name || '';
  const itemQty = item.quantity ?? 1;

  // 1. Clean up "pcs" from name GLOBALLY
  // Remove (12 pcs), (16 pcs) etc.
  name = name.replace(/\s*\(\s*\d+\s*(?:pcs|pieces?)\s*\)\s*/gi, '');
  // Remove marketing prefixes like "*NEW*" from cart titles.
  name = name.replace(/^\s*\*?\s*new\s*\*?\s*/i, '');
  name = name.trim();

  // Custom cart naming for specific cheesesteaks
  if (/^create your own cheesesteak$/i.test(name)) {
    name = 'Plain Steak';
  } else if (/^create your own chicken cheesesteak$/i.test(name)) {
    name = 'Chicken Steak';
  }

  // Normalize specific pizza names to canonical cart title:
  // "Napoletana" and "White Pizza" should display as "Size Pizza".
  const categoryLower = (item.category || '').toLowerCase();
  const rawNameLower = (item.name || '').toLowerCase();
  if (categoryLower === 'pizzas' && (rawNameLower.includes('napoletana') || /\bwhite\b/.test(rawNameLower))) {
    name = 'Pizza';
  }

  // 2. Wings Logic
  if (isWingsItem(item)) {
    // If name is just "Wings", try to find a quantity selection to normalize
    // Or if name has numbers (e.g. "20 Wings"), use it.
    
    // Check if name already has the quantity (e.g. "20 Wings" or "Wings 20")
    // Note: "Wings" doesn't have number.
    const nameHasNumber = /\d+/.test(name);
    
    if (!nameHasNumber) {
        // Try to find quantity in selections
        const qtySel = item.selections?.find(s => 
            s.groupTitle === 'Quantity' || 
            s.label.toLowerCase().includes('wings')
        );

        if (qtySel && qtySel.label) {
            // Normalize "10 pcs" -> "10 Wings"
            const normalized = normalizeWingsQuantityText(qtySel.label);
            // If we found a number-based label, append it to name?
            // User wants "1 10 Wings".
            // If name is "Wings", we want "10 Wings".
            if (/\d+/.test(normalized)) {
                name = normalized;
            }
        } else {
            // Default to 10 Wings if no number found anywhere
            name = "10 Wings";
        }
    } else {
        // Name has number (e.g. "20 Wings"). Ensure no "pcs".
        // Already cleaned via global regex?
        // Check if "20 pcs" was in name without parens
        const pcsMatch = name.match(/(\d+)\s*(?:pcs|pieces?)/i);
        if (pcsMatch) {
            name = name.replace(/pcs|pieces?/i, 'Wings');
        }
    }
  }

  // 3. Arancini Logic (Explicit Quantity)
  if (item.name && item.name.includes('Arancini Rice Ball')) {
      // Find Quantity selection (e.g. "16 Arancini Rice Ball")
      const qtySel = item.selections?.find(s => s.groupTitle === 'Quantity');
      if (qtySel) {
          // Extract number from selection label
          const match = qtySel.label.match(/^(\d+)/);
          if (match) {
             const count = match[1];
             name = `${count} Arancini Rice Ball`;
          }
      }
  }

  // 4. Mozzarella Sticks Logic (Explicit Quantity)
  if (item.name && item.name.includes('Mozzarella Sticks')) {
      // Find Quantity selection (e.g. "6 Mozzarella Sticks")
      const qtySel = item.selections?.find(s => s.groupTitle === 'Quantity');
      if (qtySel) {
          // Extract number from selection label
          const match = qtySel.label.match(/^(\d+)/);
          if (match) {
             const count = match[1];
             name = `${count} Mozzarella Sticks`;
          }
      }
  }

  // 5. Chicken Tenders Logic (Explicit Quantity)
  if (isChickenTendersItem(item)) {
      // Find Quantity selection (e.g. "4 Chicken Tenders")
      const qtySel = item.selections?.find(s => s.groupTitle === 'Quantity');
      if (qtySel) {
          // Extract number from selection label
          const match = qtySel.label.match(/^(\d+)/);
          if (match) {
             const count = match[1];
             name = `${count} Chicken Tenders`;
          }
      }

      // Append W/FF suffix for display if not already present
      if (!name.toLowerCase().includes('w/ff')) {
          name = `${name} W/FF`;
      }
  }

  // 5.1 Burgers naming rule: always append W/FF in cart title
  if (categoryLower === 'burgers' && !name.toLowerCase().includes('w/ff')) {
    name = `${name} W/FF`;
  }

  // 6. Size Prefix (NEW)
  let size = getItemSize(item);

  // --- OPT-OUT LOGIC FOR TITLE SIZE ---
  const catLower = (item.category || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();
  const isMinucci = catLower === 'minucci-pizzas' || nameLower.includes('minucci');
  const isBrooklyn = catLower === 'brooklyn-pizza' || nameLower.includes('brooklyn');
  const isPanPizza = catLower === 'pizzas' && nameLower.includes('pan pizza');

  const THICK_CRUST_IDS = ['sp-4', 'sp-5', 'sp-6', 'sp-9', 'cyo-sicilian-pesto', 'sp-17'];
  const isSpecialtyThickOrPan = (catLower === 'specialty-pizza' || catLower === 'specialty') && 
      (item.productId && THICK_CRUST_IDS.includes(item.productId));

  const isNoSizePizza = isMinucci || isBrooklyn || isPanPizza || isSpecialtyThickOrPan;

  if (isNoSizePizza) {
      if (typeof window !== 'undefined' && window.location.search.includes('debugCart=1') && size) {
          console.log('[CART_TITLE_SIZE_FILTER]', { 
             productId: item.productId, 
             category: item.category, 
             isNoSizePizza, 
             rawSizeFound: size, 
             sizeLabelUsed: null
          });
      }
      size = null;
  }
  // ------------------------------------

  if (size) {
      const isCatering = catLower.startsWith('catering-');
      if (isCatering) {
          // Preserve catering size semantics like "10 PCS" / "20 PCS".
          size = size.replace(/\s*\([^)]*\)/g, '').trim();
      } else {
          // Clean up size for title: "Large (16")" -> "Large"
          size = size.replace(/\s*\([^)]*\)/g, '').replace(/\s+\d+["']?.*$/, '').trim();
      }
      
      // Prevent duplication if name already has size
      if (name.toLowerCase().includes(size.toLowerCase())) {
          size = null;
      }
      
      const cat = (item.category || '').toLowerCase();
      const isPizza = cat.includes('pizza') || cat.includes('stromboli');
      if (!isPizza && !size.match(/medium|large|jumbo/i)) {
          // If not explicit pizza size, we still use it if found, 
          // but usually getItemSize only returns Size for Pizzas/Strombolis/Salads.
      }
  }

  // 7. Final format
  const prefix = formatQtyPrefix(itemQty);
  const sizeStr = size ? `${size} ` : '';
  
  const title = `${prefix}${sizeStr}${name}`.trim();

  // DEBUG LOG (Temporary)
  const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
  if (debugCart) {
      console.log('[CART_TITLE_DEBUG]', { name, qty: itemQty, sizeLabel: size, title });
  }

  return title;
};

// --- WINGS DETERMINISTIC BUILDER ---

const getWingsCount = (item: CartItem, rawLines: { text: string }[]): number => {
    // A) Line match "X Wings"
    for (const line of rawLines) {
        const match = line.text.match(/\b(\d+)\b\s*wings?\b/i);
        if (match) return parseInt(match[1], 10);
    }
    
    // B) Name match "X Wings" or "X pcs"
    if (item.name) {
        const match = item.name.match(/\b(\d+)\b\s*(wings?|pcs?|pieces?)\b/i);
        if (match) return parseInt(match[1], 10);
    }

    // C) Line match "X pcs"
    for (const line of rawLines) {
        const match = line.text.match(/\b(\d+)\b\s*pcs?\b/i);
        if (match) return parseInt(match[1], 10);
    }

    // D) Fallback
    return 10;
};

const getIncludedSauceOz = (count: number): string => {
    if (count >= 50) return '16oz';
    if (count >= 30) return '8oz';
    if (count >= 20) return '4oz';
    return '2oz'; // 10 wings or fallback
};

const buildWingsDisplayLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    // Debug flag
    const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');

    // 1. Calculate Count & Size
    const wingsCount = getWingsCount(item, rawLines);
    const includedSize = getIncludedSauceOz(wingsCount);

    if (debugCart) {
        console.group(`Wings Debug: ${item.name} (${item.id})`);
        console.log('[WINGS COUNT]', { wingsCount, includedSize });
        console.log('Raw Lines Input:', rawLines.map(l => l.text));
    }

    // 2. Identify Included Flavor (Look for explicit selection or Default)
    // We look for a line marked as included to determine flavor (Ranch vs Bleu Cheese)
    // If found, we extract flavor and consume that line (so it doesn't duplicate).
    // If not found, we Default to "Ranch Sauce".
    let includedFlavor = "Ranch Sauce";
    let includedSelId: string | null = null;

    const explicitIncludedLine = rawLines.find(l => 
        l.originalSel?.type === 'included' || 
        l.originalSel?.groupId?.includes('included') || 
        l.originalSel?.groupTitle?.toLowerCase().includes('included') ||
        l.originalSel?.groupTitle?.toLowerCase().includes('comes with')
    );

    if (explicitIncludedLine) {
        let text = explicitIncludedLine.text;
        // Normalize flavor name
        if (/bleu|blue/i.test(text)) includedFlavor = "Bleu Cheese";
        else if (/ranch/i.test(text)) includedFlavor = "Ranch Sauce";
        
        includedSelId = explicitIncludedLine.originalSel?.id || null;
    }

    // Construct the Calculated Included Line
    const calculatedIncludedLine = `${includedFlavor} (${includedSize})`;

    // --- 3. CLASSIFIERS ---
    
    const normalizeExtraSauceLabel = (label: string): string => {
        // If already starts with "Extra ", just normalize casing of prefix
        if (/^extra\s+/i.test(label)) {
            return label.replace(/^extra\s+/i, 'Extra ');
        }
        // If not, prepend Extra
        return `Extra ${label}`;
    };

    const isSpecialInstruction = (text: string): boolean => {
        const lower = text.toLowerCase();
        return lower.includes('mixed in') || lower.includes('well done') || lower.includes('on the side') || 
               text.match(/^No\b/i) !== null;
    };

    const isDipping = (text: string): boolean => {
        const lower = text.toLowerCase();
        return lower.includes('bleu cheese') || lower.includes('blue cheese') || lower.includes('ranch');
    };

    const isExtraSauce = (text: string, sel?: CartSelection): boolean => {
        const lower = text.toLowerCase();
        // A) Category/Group Check
        if (sel?.groupId?.includes('wings_extra_sauce') || 
            sel?.groupTitle?.toLowerCase().includes('extra sauce')) {
            return true;
        }
        // B) Label prefix check
        if (lower.startsWith('extra ')) return true;
        
        // C) Size check (oz) AND Sauce (loose check for sauce-like items or explicit sauce)
        if (lower.includes('oz') && lower.includes('sauce')) return true;
        
        // D) Known Extra Sauce IDs (if available, but generic text check is robust enough for now)
        // Check for common sauces with oz that might not say sauce?
        if (lower.includes('oz') && (lower.includes('honey') || lower.includes('bbq') || lower.includes('mild') || lower.includes('hot'))) return true;
        // E) Bleu/Ranch with size should be treated as extra (included dip is handled separately).
        if (lower.includes('oz') && (lower.includes('bleu') || lower.includes('blue') || lower.includes('ranch'))) return true;

        return false;
    };

    const isChooseSauce = (text: string): boolean => {
        const lower = text.toLowerCase();
        const endsSauce = lower.endsWith('sauce') || lower === 'no sauce';
        if (!endsSauce) return false;
        
        if (lower.includes('mixed in')) return false;
        if (lower.includes('extra')) return false;
        if (lower.includes('oz')) return false;
        if (lower.includes('ranch')) return false;
        if (lower.includes('bleu')) return false;
        
        return true;
    };

    // --- 4. PIPELINE & BUCKETS ---

    let chooseSauce: any[] = [];
    let specialInstructions: any[] = [];
    let includedBucket: string[] = [calculatedIncludedLine]; // Always exactly this one line
    let extraSauce: any[] = [];
    let dippings: any[] = [];

    interface BucketItem { text: string; key: string; score: number; }
    
    const addToBucket = (bucket: BucketItem[], text: string) => {
        // Normalization for dedupe key
        let key = text.toLowerCase()
            .replace('extra ', '')
            .replace(/\s*\(\s*\d+\s*oz\s*\)/g, '')
            .replace(/\s*\d+\s*oz\s*/g, '')
            .trim();
        
        // Fix: "Bleu Cheese" and "Blue Cheese" same key
        key = key.replace('blue', 'bleu');

        // Score
        let score = 0;
        if (text.match(/\d+\s*oz/i)) score += 10;
        if (text.startsWith('Extra')) score += 5;
        score += text.length;

        const existingIdx = bucket.findIndex(b => b.key === key);
        if (existingIdx !== -1) {
            if (score > bucket[existingIdx].score) {
                 bucket[existingIdx] = { text, key, score };
            }
        } else {
            bucket.push({ text, key, score });
        }
    };

    // --- 5. ITERATION ---

    const ingestWingLine = (inputText: string, selInput?: CartSelection) => {
        const line = { text: inputText, originalSel: selInput } as { text: string; originalSel?: CartSelection };
        let text = line.text.trim();
        const sel = line.originalSel;

        // Skip the line if it was the source of the included sauce (to avoid dupe)
        if (includedSelId && sel?.id === includedSelId) return;
        
        // Global Filters
        if (!text) return;
        if (/^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(text)) return;
        if (/\b\d+\s*(pcs|pieces?)\b/i.test(text) && !/wings/i.test(text)) return;

        // Clean Text
        text = text.replace(/Blue Cheese/i, 'Bleu Cheese');
        
        // Filter out if it matches the calculated included line exactly (redundancy check)
        if (text === calculatedIncludedLine) return;

        // Classification Pipeline
        if (isSpecialInstruction(text)) {
            addToBucket(specialInstructions as any, text);
        }
        else if (isChooseSauce(text)) {
             addToBucket(chooseSauce as any, text);
        }
        else if (isExtraSauce(text, sel)) {
             // DETECTED EXTRA SAUCE -> NORMALIZE IT
             const original = text;
             text = normalizeExtraSauceLabel(text);
             
             if (debugCart) {
                 console.log('[EXTRA SAUCE DETECT]', { inputLabel: original, outputLabel: text });
             }
             addToBucket(extraSauce as any, text);
        }
        else if (isDipping(text)) {
             // Logic: If it's a dipping, check if it duplicates included flavor
             // But user says "Evita duplicados".
             // If we have "Included Ranch" and this line is "Ranch", it implies Extra Ranch.
             // If this line is "Bleu Cheese", it is distinct.
             
             // Ensure "Extra" prefix if it's not "Included" (which is handled in separate bucket)
             // and doesn't have size (oz).
             if (!text.includes('Extra') && !text.includes('oz') && !text.includes('Included')) {
                  text = `Extra ${text}`;
             }
             
             addToBucket(dippings as any, text);
        }
        else {
             // Fallback
             addToBucket(specialInstructions as any, text);
        }
    };

    rawLines.forEach(line => ingestWingLine(line.text, line.originalSel));
    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => ingestWingLine(String(raw || '')));
    });

    const getTexts = (b: any[]) => b.map(x => x.text);
    
    const finalChooseSauce = getTexts(chooseSauce);
    const finalSpecial = getTexts(specialInstructions);
    // Included is already a string array
    const finalExtraSauce = getTexts(extraSauce);
    const finalDippings = getTexts(dippings);

    // Logging
    if (debugCart) {
        console.log('[WINGS INCLUDED]', { oz: includedSize, line: calculatedIncludedLine });
        console.log('[WINGS BUCKETS]', { 
            chooseSauce: finalChooseSauce, 
            special: finalSpecial, 
            included: includedBucket, 
            extraSauce: finalExtraSauce, 
            dippings: finalDippings 
        });
    }

    const finalLines = [
        ...finalChooseSauce,
        ...finalSpecial,
        ...includedBucket,
        ...finalExtraSauce,
        ...finalDippings
    ];

    if (debugCart) {
        console.log('[WINGS FINAL]', finalLines);
        console.groupEnd();
    }

    return finalLines;
};

// --- TRADITIONAL DINNERS DETERMINISTIC BUILDER ---

const isTraditionalDinnerItem = (item: CartItem): boolean => {
  const category = (item.category || '').toLowerCase();
  const productId = (item.productId || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  const isFishDinner =
    category === 'seafood' && (productId === 'sf-11' || productId === 'sf-12' || name.includes('fish'));

  return (
    isFishDinner ||
    category.includes('traditional-dinner') ||
    category.includes('traditional-dinners') ||
    productId.includes('traditional') ||
    productId.startsWith('trad-') ||
    name.includes('traditional dinner')
  );
};

const buildTraditionalDinnersLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
    if (debugCart) {
      console.group(`[TRADITIONAL DINNER DEBUG] ${item.name}`);
      console.log('Item:', item);
      console.log('RawLines:', rawLines.map((l) => l.text));
    }

    const isArtifact = (value: string): boolean => {
      const v = String(value || '').trim().toLowerCase();
      return !v || /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(v);
    };

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const text = String(value || '').trim();
      const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: text, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const normalized = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });
    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });

    const addSides = bucketCount();
    const soupsSaladsBread = bucketText();
    const specialInstructions = bucketText();
    const desserts = bucketCount();
    const beverages = bucketCount();

    let extraBreadUnits = 0;

    const saladRemovedById: Record<'td-extra2' | 'td-extra3', string[]> = {
      'td-extra2': [],
      'td-extra3': [],
    };

    const addRemoved = (saladId: 'td-extra2' | 'td-extra3', value: string) => {
      const text = String(value || '').trim();
      if (!/^no\s+/i.test(text)) return;
      const name = text.replace(/^no\s+/i, '').replace(/\s+/g, ' ').trim();
      if (!name) return;
      if (!saladRemovedById[saladId].some((x) => normalized(x) === normalized(name))) {
        saladRemovedById[saladId].push(name);
      }
    };

    const parseRemovedFromSaladLabel = (text: string) => {
      const m = String(text || '').match(/\(([^)]*)\)/);
      if (!m) return [] as string[];
      return String(m[1] || '')
        .split(',')
        .map((x) => x.trim())
        .map((x) => x.replace(/^no\s+/i, '').trim())
        .filter(Boolean);
    };

    const classify = (type?: string, groupTitle?: string, groupId?: string, label?: string):
      'add' | 'soups' | 'special' | 'dessert' | 'beverage' | 'ignore' => {
      const t = normalized(type || '');
      const gt = normalized(groupTitle || '');
      const gid = normalized(groupId || '');
      const l = normalized(label || '');

      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert')) return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage')) return 'beverage';
      if (t === 'special_instruction' || gt.includes('special instruction') || gid.includes('special_instruction')) return 'special';
      if (
        gid.includes('traditional_dinners_soups_salads') ||
        gt.includes('side soups, salads, & extra bread') ||
        l.includes('extra bread') ||
        l.includes('soup of the day') ||
        l.includes('pasta e fagioli') ||
        l.includes('side garden salad') ||
        l.includes('side caesar salad')
      ) return 'soups';
      if (
        gid.includes('traditional_dinners_sides') ||
        gid.includes('traditional_dinner_sides') ||
        gt === 'add sides' ||
        gt.includes('add sides') ||
        (gt.includes('sides') && !gt.includes('soup') && !gt.includes('salad') && !gt.includes('bread'))
      ) return 'add';
      return 'ignore';
    };

    const pushCount = (
      bucket: { order: string[]; map: Map<string, { base: string; qty: number }> },
      value: string
    ) => {
      const parsed = parseTrailingQty(value);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      // Same item can appear in selections/customizations/rawLines simultaneously.
      // Keep the strongest representation instead of summing across sources.
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    const pushText = (
      bucket: { order: string[]; map: Map<string, string> },
      value: string,
      keyOverride?: string
    ) => {
      const text = String(value || '').trim();
      if (!text) return;
      const key = keyOverride || normalized(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      const prevScore = (/\(.*\)/.test(prev) ? 10 : 0) + prev.length;
      const nextScore = (/\(.*\)/.test(text) ? 10 : 0) + text.length;
      if (nextScore > prevScore) bucket.map.set(key, text);
    };

    const collectSaladRemovalSignals = (text: string, sel?: CartSelection) => {
      const gid = normalized(sel?.groupId || '');
      const label = String(text || '').trim();
      if (!label) return;
      if (gid === 'td-extra2' || gid.startsWith('td-extra2-no-')) addRemoved('td-extra2', label);
      if (gid === 'td-extra3' || gid.startsWith('td-extra3-no-')) addRemoved('td-extra3', label);
      if (/^side garden salad\b/i.test(label)) parseRemovedFromSaladLabel(label).forEach((x) => addRemoved('td-extra2', `No ${x}`));
      if (/^side caesar salad\b/i.test(label)) parseRemovedFromSaladLabel(label).forEach((x) => addRemoved('td-extra3', `No ${x}`));
      if (sel?.id === 'td-extra2' && Array.isArray(sel?.removedIngredients)) {
        sel.removedIngredients.forEach((x) => addRemoved('td-extra2', `No ${x}`));
      }
      if (sel?.id === 'td-extra3' && Array.isArray(sel?.removedIngredients)) {
        sel.removedIngredients.forEach((x) => addRemoved('td-extra3', `No ${x}`));
      }
    };

    rawLines.forEach((line) => collectSaladRemovalSignals(String(line.text || ''), line.originalSel));
    (item.selections || []).forEach((sel: any) => {
      const label = String(sel?.label || sel?.displayName || sel?.name || '').trim();
      collectSaladRemovalSignals(label, sel);
    });
    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => collectSaladRemovalSignals(String(raw || '').trim(), undefined));
    });

    const ensureSaladLabel = (value: string): string => {
      const text = String(value || '').trim();
      if (!text) return text;
      const lower = normalized(text);
      if (lower.startsWith('side garden salad')) {
        const removed = saladRemovedById['td-extra2'];
        if (removed.length > 0) return `Side Garden Salad (No ${removed.join(', No ')})`;
        return /^side garden salad\b/i.test(text) ? 'Side Garden Salad' : text;
      }
      if (lower.startsWith('side caesar salad')) {
        const removed = saladRemovedById['td-extra3'];
        if (removed.length > 0) return `Side Caesar Salad (No ${removed.join(', No ')})`;
        return /^side caesar salad\b/i.test(text) ? 'Side Caesar Salad' : text;
      }
      return text;
    };

    const ingest = (textRaw: string, meta?: { type?: string; groupTitle?: string; groupId?: string; id?: string }) => {
      const text = String(textRaw || '').trim();
      if (isArtifact(text)) return;
      if (/^no\s+/i.test(text)) {
        const gid = normalized(meta?.groupId || '');
        if (gid === 'td-extra2' || gid.startsWith('td-extra2-no-') || gid === 'td-extra3' || gid.startsWith('td-extra3-no-')) return;
      }

      const section = classify(meta?.type, meta?.groupTitle, meta?.groupId, text);
      if (section === 'ignore') return;

      if (section === 'soups') {
        if (/extra bread/i.test(text)) {
          const parsed = parseTrailingQty(text);
          // Extra Bread can surface in selections/customizations/rawLines simultaneously.
          // Keep the strongest quantity instead of summing duplicated sources.
          extraBreadUnits = Math.max(extraBreadUnits, Math.max(1, parsed.qty));
          return;
        }
        const saladLabel = ensureSaladLabel(text);
        const key =
          normalized(saladLabel).startsWith('side garden salad') ? 'side garden salad'
          : normalized(saladLabel).startsWith('side caesar salad') ? 'side caesar salad'
          : undefined;
        pushText(soupsSaladsBread, saladLabel, key);
        return;
      }

      if (section === 'add') {
        pushCount(addSides, text);
        return;
      }
      if (section === 'special') {
        pushText(specialInstructions, text);
        return;
      }
      if (section === 'dessert') {
        pushCount(desserts, text);
        return;
      }
      if (section === 'beverage') {
        pushCount(beverages, text);
      }
    };

    (item.selections || []).forEach((sel: any) => {
      ingest(String(sel?.label || sel?.displayName || sel?.name || ''), {
        type: sel?.type,
        groupTitle: sel?.groupTitle,
        groupId: sel?.groupId,
        id: sel?.id,
      });
    });

    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => {
        ingest(String(raw || ''), {
          groupTitle: c?.category,
          groupId: c?.groupId,
        });
      });
    });

    rawLines.forEach((line) => {
      ingest(String(line?.text || ''), {
        type: line?.originalSel?.type,
        groupTitle: line?.originalSel?.groupTitle,
        groupId: line?.originalSel?.groupId,
        id: line?.originalSel?.id,
      });
    });

    if (extraBreadUnits > 0) {
      pushText(soupsSaladsBread, `Extra Bread x${extraBreadUnits}`, 'extra bread');
    }

    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);

    const final = [
      ...toCountLines(addSides),
      ...toTextLines(soupsSaladsBread),
      ...toTextLines(specialInstructions),
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];

    if (debugCart) {
      console.log('[TRADITIONAL DINNER FINAL]', final);
      console.log('[TD_CART_DISPLAY_BUILD]', {
        customizations: item.customizations,
        sectionsBuilt: {
          addSides: toCountLines(addSides),
          soupsSaladsBread: toTextLines(soupsSaladsBread),
          specialInstructions: toTextLines(specialInstructions),
          desserts: toCountLines(desserts),
          beverages: toCountLines(beverages),
          extraBreadUnits,
          saladRemovedById,
        },
        finalLines: final,
      });
      console.groupEnd();
    }

    return final;
};

// --- CREATE YOUR OWN FRESH SALAD (STRICT DETERMINISTIC BUILDER) ---
const buildCreateSaladLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const normalized = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const text = String(value || '').trim();
      const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: text, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });

    const chooseBase = bucketText();
    const chooseDressing = bucketText();
    const chooseToppings = bucketText();
    const dressingInstructions = bucketText();
    const extraDressing = bucketText();
    const extraToppings = bucketText();
    const desserts = bucketCount();
    const beverages = bucketCount();

    const pushText = (
      bucket: { order: string[]; map: Map<string, string> },
      value: string
    ) => {
      const text = String(value || '').trim();
      if (!text) return;
      const key = normalized(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      const prevScore = (/\(.*\)/.test(prev) ? 10 : 0) + prev.length;
      const nextScore = (/\(.*\)/.test(text) ? 10 : 0) + text.length;
      if (nextScore > prevScore) bucket.map.set(key, text);
    };

    const pushCount = (
      bucket: { order: string[]; map: Map<string, { base: string; qty: number }> },
      value: string
    ) => {
      const parsed = parseTrailingQty(value);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      // Same item can arrive from selections + customizations + rawLines.
      // Keep the strongest single qty signal instead of summing duplicated sources.
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    const classify = (type?: string, groupTitle?: string, groupId?: string, category?: string, label?: string):
      'base' | 'dressing' | 'toppings' | 'dressing_instructions' | 'extra_dressing' | 'extra_toppings' | 'dessert' | 'beverage' | 'ignore' => {
      const t = normalized(type || '');
      const gt = normalized(groupTitle || '');
      const gid = normalized(groupId || '');
      const cat = normalized(category || '');
      const l = normalized(label || '');

      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat === 'dessert' || cat === 'desserts') return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat === 'beverage' || cat === 'beverages') return 'beverage';

      if (gid.includes('salad_base') || gt.includes('choose your base') || cat === 'salad base' || cat === 'choose your base') return 'base';

      if (gid.includes('salad_dressing_instructions') || gt.includes('dressing instructions') || cat === 'dressing instructions' || cat === 'dressing preference') return 'dressing_instructions';

      if (gid.includes('salad_extra_dressing') || gt.includes('extra dressing') || cat === 'extra dressing') return 'extra_dressing';

      if (gid.includes('salad_extra_toppings') || gt.includes('extra toppings') || cat === 'extra toppings') return 'extra_toppings';

      if (
        gid.includes('salad_toppings') ||
        gt.includes('choose your toppings') ||
        cat === 'salad toppings' ||
        cat === 'choose your toppings'
      ) return 'toppings';

      if (
        (gid.includes('salad_dressing') && !gid.includes('extra') && !gid.includes('instruction')) ||
        (gt.includes('choose your dressing') && !gt.includes('extra')) ||
        cat === 'dressing' ||
        cat === 'choose your dressing'
      ) return 'dressing';

      // Safety net for common dressing-instruction labels
      if (l === 'dressing mixed in' || l === 'dressing on side') return 'dressing_instructions';

      return 'ignore';
    };

    const ingest = (textRaw: string, meta?: { type?: string; groupTitle?: string; groupId?: string; category?: string }) => {
      const text = String(textRaw || '').trim();
      if (!text) return;
      const section = classify(meta?.type, meta?.groupTitle, meta?.groupId, meta?.category, text);
      if (section === 'ignore') return;
      if (section === 'base') return pushText(chooseBase, text);
      if (section === 'dressing') return pushText(chooseDressing, text);
      if (section === 'toppings') return pushText(chooseToppings, text);
      if (section === 'dressing_instructions') return pushText(dressingInstructions, text);
      if (section === 'extra_dressing') return pushText(extraDressing, text);
      if (section === 'extra_toppings') return pushText(extraToppings, text);
      if (section === 'dessert') return pushCount(desserts, text);
      if (section === 'beverage') return pushCount(beverages, text);
    };

    (item.selections || []).forEach((sel: any) => {
      ingest(String(sel?.label || ''), {
        type: sel?.type,
        groupTitle: sel?.groupTitle,
        groupId: sel?.groupId,
      });
    });

    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => {
        ingest(String(raw || ''), {
          category: c?.category,
          groupTitle: c?.category,
          groupId: c?.groupId,
        });
      });
    });

    rawLines.forEach((line) => {
      ingest(String(line?.text || ''), {
        type: line?.originalSel?.type,
        groupTitle: line?.originalSel?.groupTitle,
        groupId: line?.originalSel?.groupId,
      });
    });

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);
    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    return [
      ...toTextLines(chooseBase),
      ...toTextLines(chooseDressing),
      ...toTextLines(chooseToppings),
      ...toTextLines(dressingInstructions),
      ...toTextLines(extraDressing),
      ...toTextLines(extraToppings),
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];
};

// --- SPECIALTY FRESH SALAD (STRICT DETERMINISTIC BUILDER) ---
const buildSpecialtySaladLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const normalized = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const text = String(value || '').trim();
      const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: text, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });

    const chooseBase = bucketText();
    const chooseDressing = bucketText();
    const extraToppings = bucketText();
    const dressingPreference = bucketText();
    const extraDressing = bucketText();
    const noToppings = bucketText();
    const desserts = bucketCount();
    const beverages = bucketCount();

    const pushText = (
      bucket: { order: string[]; map: Map<string, string> },
      value: string
    ) => {
      const text = String(value || '').trim();
      if (!text) return;
      const key = normalized(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
      }
    };

    const pushCount = (
      bucket: { order: string[]; map: Map<string, { base: string; qty: number }> },
      value: string
    ) => {
      const parsed = parseTrailingQty(value);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    const classify = (
      type?: string,
      groupTitle?: string,
      groupId?: string,
      category?: string,
      label?: string
    ): 'base' | 'dressing' | 'extra_toppings' | 'dressing_preference' | 'extra_dressing' | 'no_toppings' | 'dessert' | 'beverage' | 'ignore' => {
      const t = normalized(type || '');
      const gt = normalized(groupTitle || '');
      const gid = normalized(groupId || '');
      const cat = normalized(category || '');
      const l = normalized(label || '');

      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat === 'dessert' || cat === 'desserts') return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat === 'beverage' || cat === 'beverages') return 'beverage';

      if (gid.includes('salad_base') || gt.includes('choose your base') || cat === 'salad base' || cat === 'choose your base') return 'base';

      if (
        (gid.includes('salad_dressing') && !gid.includes('extra') && !gid.includes('instruction')) ||
        (gt.includes('choose your dressing') && !gt.includes('extra')) ||
        cat === 'dressing' ||
        cat === 'choose your dressing'
      ) return 'dressing';

      if (
        gid.includes('salad_toppings') ||
        gid.includes('salad_extra_toppings') ||
        gt.includes('choose your toppings') ||
        gt.includes('extra toppings') ||
        cat === 'salad toppings' ||
        cat === 'choose your toppings' ||
        cat === 'extra toppings'
      ) return 'extra_toppings';

      if (
        gid.includes('salad_dressing_instructions') ||
        gt.includes('dressing preference') ||
        gt.includes('dressing instructions') ||
        cat === 'dressing preference' ||
        cat === 'dressing instructions' ||
        l === 'dressing mixed in' ||
        l === 'dressing on side'
      ) return 'dressing_preference';

      if (gid.includes('salad_extra_dressing') || gt.includes('extra dressing') || cat === 'extra dressing') return 'extra_dressing';

      if (t === 'no_topping' || gid.includes('no_toppings') || gt.includes('no toppings') || cat === 'no toppings') return 'no_toppings';

      return 'ignore';
    };

    const ingest = (textRaw: string, meta?: { type?: string; groupTitle?: string; groupId?: string; category?: string }) => {
      const text = String(textRaw || '').trim();
      if (!text) return;
      const section = classify(meta?.type, meta?.groupTitle, meta?.groupId, meta?.category, text);
      if (section === 'ignore') return;
      if (section === 'base') return pushText(chooseBase, text);
      if (section === 'dressing') return pushText(chooseDressing, text);
      if (section === 'extra_toppings') return pushText(extraToppings, text);
      if (section === 'dressing_preference') return pushText(dressingPreference, text);
      if (section === 'extra_dressing') return pushText(extraDressing, text);
      if (section === 'no_toppings') return pushText(noToppings, text);
      if (section === 'dessert') return pushCount(desserts, text);
      if (section === 'beverage') return pushCount(beverages, text);
    };

    (item.selections || []).forEach((sel: any) => {
      ingest(String(sel?.label || ''), {
        type: sel?.type,
        groupTitle: sel?.groupTitle,
        groupId: sel?.groupId,
      });
    });

    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => {
        ingest(String(raw || ''), {
          category: c?.category,
          groupTitle: c?.category,
          groupId: c?.groupId,
        });
      });
    });

    rawLines.forEach((line) => {
      ingest(String(line?.text || ''), {
        type: line?.originalSel?.type,
        groupTitle: line?.originalSel?.groupTitle,
        groupId: line?.originalSel?.groupId,
      });
    });

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);

    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    return [
      ...toTextLines(chooseBase),
      ...toTextLines(chooseDressing),
      ...toTextLines(extraToppings),
      ...toTextLines(dressingPreference),
      ...toTextLines(extraDressing),
      ...toTextLines(noToppings),
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];
};

// --- SOUPS (STRICT DETERMINISTIC BUILDER) ---
const buildSoupsLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const normalized = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const text = String(value || '').trim();
      const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: text, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });

    const substitute = bucketText();
    const specialInstructions = bucketText();
    const desserts = bucketCount();
    const beverages = bucketCount();

    const pushText = (bucket: { order: string[]; map: Map<string, string> }, value: string) => {
      const text = String(value || '').trim();
      if (!text) return;
      const key = normalized(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
      }
    };

    const pushCount = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }, value: string) => {
      const parsed = parseTrailingQty(value);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    const isSizeArtifact = (label: string): boolean => {
      const t = normalized(label);
      return t === '16oz' || t === '32oz' || t === 'medium' || t === 'large';
    };

    const classify = (
      type?: string,
      groupTitle?: string,
      groupId?: string,
      category?: string,
      id?: string,
      label?: string
    ): 'substitute' | 'special_instructions' | 'dessert' | 'beverage' | 'ignore' => {
      const t = normalized(type || '');
      const gt = normalized(groupTitle || '');
      const gid = normalized(groupId || '');
      const cat = normalized(category || '');
      const sid = normalized(id || '');
      const line = normalized(label || '');

      if (isSizeArtifact(line)) return 'ignore';

      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat === 'dessert' || cat === 'desserts') return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat === 'beverage' || cat === 'beverages') return 'beverage';

      if (
        gid.includes('substitute') ||
        gt.includes('substitute') ||
        cat === 'substitute' ||
        (sid.startsWith('pfs') && !sid.startsWith('pfsi'))
      ) return 'substitute';

      if (
        t === 'special_instruction' ||
        gid.includes('special_instruction') ||
        gid.includes('pasta_fagioli_instructions') ||
        gt.includes('special instruction') ||
        cat === 'special instructions' ||
        sid.startsWith('pfsi')
      ) return 'special_instructions';

      return 'ignore';
    };

    const ingest = (textRaw: string, meta?: { type?: string; groupTitle?: string; groupId?: string; category?: string; id?: string }) => {
      const text = String(textRaw || '').trim();
      if (!text) return;
      const section = classify(meta?.type, meta?.groupTitle, meta?.groupId, meta?.category, meta?.id, text);
      if (section === 'ignore') return;
      if (section === 'substitute') return pushText(substitute, text);
      if (section === 'special_instructions') return pushText(specialInstructions, text);
      if (section === 'dessert') return pushCount(desserts, text);
      if (section === 'beverage') return pushCount(beverages, text);
    };

    (item.selections || []).forEach((sel: any) => {
      ingest(String(sel?.label || ''), {
        type: sel?.type,
        groupTitle: sel?.groupTitle,
        groupId: sel?.groupId,
        id: sel?.id,
      });
    });

    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => {
        ingest(String(raw || ''), {
          category: c?.category,
          groupTitle: c?.category,
          groupId: c?.groupId,
        });
      });
    });

    rawLines.forEach((line) => {
      ingest(String(line?.text || ''), {
        type: line?.originalSel?.type,
        groupTitle: line?.originalSel?.groupTitle,
        groupId: line?.originalSel?.groupId,
        id: line?.originalSel?.id,
      });
    });

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);

    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    return [
      ...toTextLines(substitute),
      ...toTextLines(specialInstructions),
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];
};

// --- KIDS MENU (STRICT DETERMINISTIC BUILDER) ---
const buildKidsLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const normalized = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const text = String(value || '').trim();
      const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: text, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const isIdArtifact = (value: string): boolean => {
      const text = normalized(value);
      return /^(kpt|kps|kpat|kpsi|kbt|kpmsi|kpmt)\d+$/i.test(text);
    };

    const productId = normalized(item.productId || item.id || '');
    const itemName = normalized(item.name || '');
    const isKidsCreatePasta = productId === 'k1' || itemName.includes('create your own kids pasta');
    const isKidsBaked = ['k2', 'k3', 'k4'].includes(productId) || itemName.includes('baked ziti') || itemName.includes('cheese ravioli') || itemName.includes('cheese tortellini');
    const isKidsFingers = productId === 'k5' || itemName.includes('chicken fingers and french fries');
    const isKidsPastaMeatball = productId === 'k6' || itemName.includes('pasta and meatball');

    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });

    const choosePasta = bucketText();
    const chooseSauce = bucketText();
    const addToppings = bucketText();
    const specialInstructions = bucketText();
    const extraToppings = bucketText();
    const liteToppings = bucketText();
    const noToppings = bucketText();
    const desserts = bucketCount();
    const beverages = bucketCount();

    const pushText = (bucket: { order: string[]; map: Map<string, string> }, value: string) => {
      const text = String(value || '').trim();
      if (!text || isIdArtifact(text)) return;
      const key = normalized(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
      }
    };

    const pushCount = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }, value: string) => {
      const parsed = parseTrailingQty(value);
      if (!parsed.base || isIdArtifact(parsed.base)) return;
      const key = normalized(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    const classify = (
      type?: string,
      groupTitle?: string,
      groupId?: string,
      category?: string,
      id?: string,
      label?: string
    ):
      | 'choose_pasta'
      | 'choose_sauce'
      | 'add_toppings'
      | 'special_instructions'
      | 'extra_toppings'
      | 'lite_toppings'
      | 'no_toppings'
      | 'dessert'
      | 'beverage'
      | 'ignore' => {
      const t = normalized(type || '');
      const gt = normalized(groupTitle || '');
      const gid = normalized(groupId || '');
      const cat = normalized(category || '');
      const sid = normalized(id || '');
      const line = normalized(label || '');

      if (!line || isIdArtifact(line)) return 'ignore';
      if (line === 'american') return 'ignore';

      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat === 'dessert' || cat === 'desserts') return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat === 'beverage' || cat === 'beverages') return 'beverage';

      if (isKidsCreatePasta || isKidsPastaMeatball) {
        if (
          gid.includes('kids_pasta_type') ||
          t === 'pasta_type' ||
          gt.includes('pasta type') ||
          gt.includes('choose a pasta') ||
          cat === 'pasta type' ||
          cat === 'choose a pasta' ||
          sid.startsWith('kpt')
        ) return 'choose_pasta';

        if (
          gid.includes('kids_pasta_sauce') ||
          (t === 'sauce' && !gid.includes('extra')) ||
          gt === 'sauce' ||
          gt.includes('choose a sauce') ||
          cat === 'sauce' ||
          cat === 'choose a sauce' ||
          sid.startsWith('kps')
        ) return 'choose_sauce';

        if (
          gid.includes('kids_pasta_special_instructions') ||
          gid.includes('kids_pasta_meatball_special_instructions') ||
          t === 'special_instruction' ||
          gt.includes('special instruction') ||
          cat === 'special instructions'
        ) return 'special_instructions';

        if (
          gid.includes('kids_pasta_add') ||
          gid.includes('kids_meatball_add') ||
          gt.includes('add toppings') ||
          cat === 'add toppings' ||
          sid.startsWith('kpat') ||
          sid.startsWith('kpmt')
        ) return 'add_toppings';
      }

      if (isKidsBaked) {
        if (
          gid.includes('kids_baked_extra') ||
          t === 'extra_topping' ||
          gt.includes('extra toppings') ||
          cat === 'extra toppings' ||
          sid === 'kbt1' ||
          sid === 'kbt2'
        ) return 'extra_toppings';
        if (gid.includes('kids_baked_lite') || gt.includes('lite toppings') || cat === 'lite toppings' || sid === 'kbt3') return 'lite_toppings';
        if (gid.includes('kids_baked_no') || t === 'no_topping' || gt.includes('no toppings') || cat === 'no toppings' || sid === 'kbt5') return 'no_toppings';
      }

      return 'ignore';
    };

    const ingest = (textRaw: string, meta?: { type?: string; groupTitle?: string; groupId?: string; category?: string; id?: string }) => {
      const text = String(textRaw || '').trim();
      if (!text) return;
      const section = classify(meta?.type, meta?.groupTitle, meta?.groupId, meta?.category, meta?.id, text);
      if (section === 'ignore') return;
      if (section === 'choose_pasta') return pushText(choosePasta, text);
      if (section === 'choose_sauce') return pushText(chooseSauce, text);
      if (section === 'add_toppings') return pushText(addToppings, text);
      if (section === 'special_instructions') return pushText(specialInstructions, text);
      if (section === 'extra_toppings') return pushText(extraToppings, text);
      if (section === 'lite_toppings') return pushText(liteToppings, text);
      if (section === 'no_toppings') return pushText(noToppings, text);
      if (section === 'dessert') return pushCount(desserts, text);
      if (section === 'beverage') return pushCount(beverages, text);
    };

    (item.selections || []).forEach((sel: any) => {
      ingest(String(sel?.label || ''), {
        type: sel?.type,
        groupTitle: sel?.groupTitle,
        groupId: sel?.groupId,
        id: sel?.id,
      });
    });

    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => {
        ingest(String(raw || ''), {
          category: c?.category,
          groupTitle: c?.category,
          groupId: c?.groupId,
        });
      });
    });

    rawLines.forEach((line) => {
      ingest(String(line?.text || ''), {
        type: line?.originalSel?.type,
        groupTitle: line?.originalSel?.groupTitle,
        groupId: line?.originalSel?.groupId,
        id: line?.originalSel?.id,
      });
    });

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);

    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    if (isKidsCreatePasta) {
      return [
        ...toTextLines(choosePasta),
        ...toTextLines(chooseSauce),
        ...toTextLines(addToppings),
        ...toTextLines(specialInstructions),
        ...toCountLines(desserts),
        ...toCountLines(beverages),
      ];
    }

    if (isKidsBaked) {
      return [
        ...toTextLines(extraToppings),
        ...toTextLines(liteToppings),
        ...toTextLines(noToppings),
        ...toCountLines(desserts),
        ...toCountLines(beverages),
      ];
    }

    if (isKidsFingers) {
      return [
        ...toCountLines(desserts),
        ...toCountLines(beverages),
      ];
    }

    if (isKidsPastaMeatball) {
      return [
        ...toTextLines(choosePasta),
        ...toTextLines(specialInstructions),
        ...toTextLines(addToppings),
        ...toCountLines(desserts),
        ...toCountLines(beverages),
      ];
    }

    return [
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];
};

const buildChickenTendersDisplayLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const isQtyEcho = (text: string): boolean =>
      /^\d+\s+chicken\s+tenders\b/i.test(String(text || '').trim());

    const isArtifact = (text: string): boolean => {
      const t = String(text || '').trim().toLowerCase();
      return !t || /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(t) || isQtyEcho(t);
    };

    const normalize = (value: string): string =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const v = String(value || '').trim();
      const m = v.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!m) return { base: v, qty: 1 };
      return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
    };

    const normalizeLine = (input: string): string => {
      let text = String(input || '').trim();
      if (!text) return text;
      text = text.replace(/blue cheese/gi, 'Bleu Cheese').replace(/\s+/g, ' ').trim();
      if (/^extra\s+honey mustard sauce(?:\s*\(\d+oz\))?$/i.test(text)) {
        text = text.replace(/^extra\s+/i, '');
      }
      return text;
    };

    const getChickenTendersCount = (): number => {
      const fromName = String(item.name || '').match(/\b(\d+)\s+chicken\s+tenders\b/i);
      if (fromName) return parseInt(fromName[1], 10) || 4;
      const fromRaw = rawLines
        .map((x) => String(x?.text || '').trim())
        .map((t) => t.match(/\b(\d+)\s+chicken\s+tenders\b/i))
        .find(Boolean);
      if (fromRaw && fromRaw[1]) return parseInt(fromRaw[1], 10) || 4;
      const fromQtySelection = (item.selections || [])
        .map((s) => String(s?.label || '').trim())
        .map((t) => t.match(/\b(\d+)\s*(?:pcs|pieces?)\b/i) || t.match(/\b(\d+)\s+chicken\s+tenders\b/i))
        .find(Boolean);
      if (fromQtySelection && fromQtySelection[1]) return parseInt(fromQtySelection[1], 10) || 4;
      return 4;
    };

    const getIncludedHoneyMustardOz = (count: number): string => {
      if (count >= 64) return '32oz';
      if (count >= 32) return '16oz';
      if (count >= 16) return '8oz';
      if (count >= 8) return '4oz';
      return '2oz';
    };

    const isBaseSauceChoice = (value: string): boolean => {
      const v = normalize(value);
      return [
        'bbq sauce',
        'buffalo sauce',
        'crazy hot sauce',
        'garlic parmesan sauce',
        'hot sauce',
        'honey mustard sauce',
        'mild sauce',
        'mild honey sauce',
        'sting honey sauce',
        'no sauce',
      ].includes(v);
    };

    const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
    const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });
    const included = bucketText();
    const specialInstructions = bucketText();
    const extraSauces = bucketCount();
    const extraRanchBleu = bucketCount();
    const desserts = bucketCount();
    const beverages = bucketCount();

    const pushText = (bucket: { order: string[]; map: Map<string, string> }, value: string) => {
      const text = String(value || '').trim();
      if (!text) return;
      const key = normalize(parseTrailingQty(text).base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, text);
        bucket.order.push(key);
      }
    };

    const pushCount = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }, value: string) => {
      const parsed = parseTrailingQty(value);
      const key = normalize(parsed.base);
      if (!key) return;
      if (!bucket.map.has(key)) {
        bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
        bucket.order.push(key);
        return;
      }
      const prev = bucket.map.get(key)!;
      bucket.map.set(key, {
        base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
        qty: Math.max(prev.qty, parsed.qty),
      });
    };

    let substituteSauceChoice: string | null = null;
    let noSauceSelected = false;
    let noHoneyMustardSelected = false;

    const classify = (text: string, sel?: any, category?: string):
      'substitute' | 'special' | 'extra_sauce' | 'extra_ranch_bleu' | 'dessert' | 'beverage' | 'ignore' => {
      const t = normalize(sel?.type || '');
      const gt = normalize(sel?.groupTitle || '');
      const gid = normalize(sel?.groupId || '');
      const cat = normalize(category || '');
      const line = normalize(text);

      if (!line) return 'ignore';
      if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat.includes('dessert')) return 'dessert';
      if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat.includes('beverage')) return 'beverage';

      if (line.startsWith('no honey mustard')) return 'special';
      if (line === 'no sauce') return 'substitute';

      if (
        gid.includes('wings_sauce') ||
        gt.includes('substitute your sauce') ||
        (t === 'sauce' && isBaseSauceChoice(line))
      ) return 'substitute';

      if (
        t === 'special_instruction' ||
        gid.includes('special_instruction') ||
        gt.includes('special instruction') ||
        line.includes('mixed in') ||
        line.includes('on the side') ||
        line.startsWith('no ')
      ) return 'special';

      const hasRanchOrBleu = line.includes('ranch') || line.includes('bleu cheese') || line.includes('blue cheese');
      if (
        gid.includes('cheese_ranch') ||
        gt.includes('extra cheese/ranch') ||
        (hasRanchOrBleu && (line.startsWith('extra ') || line.includes('oz')))
      ) return 'extra_ranch_bleu';

      if (
        gid.includes('extra_sauce') ||
        gt.includes('extra sauce') ||
        line.startsWith('extra ') ||
        (line.includes('oz') && line.includes('sauce'))
      ) return 'extra_sauce';

      return 'ignore';
    };

    const ingest = (rawInput: string, selInput?: any, category?: string) => {
      const raw = String(rawInput || '').trim();
      if (isArtifact(raw)) return;
      let text = normalizeLine(raw);
      if (!text) return;

      const cls = classify(text, selInput, category);
      const lineNorm = normalize(text);

      if (cls === 'substitute') {
        if (lineNorm === 'no sauce') {
          noSauceSelected = true;
          return;
        }
        if (isBaseSauceChoice(lineNorm) && !substituteSauceChoice) {
          substituteSauceChoice = text;
        }
        return;
      }

      if (cls === 'special') {
        if (lineNorm.startsWith('no honey mustard')) noHoneyMustardSelected = true;
        pushText(specialInstructions, text);
        return;
      }

      if (cls === 'extra_ranch_bleu') {
        if (!/^extra\s+/i.test(text) && !/^no\b/i.test(lineNorm)) text = `Extra ${text}`;
        pushCount(extraRanchBleu, text);
        return;
      }

      if (cls === 'extra_sauce') {
        if (!/^extra\s+/i.test(text) && !/^no\b/i.test(lineNorm)) text = `Extra ${text}`;
        pushCount(extraSauces, text);
        return;
      }

      if (cls === 'dessert') {
        pushCount(desserts, text);
        return;
      }

      if (cls === 'beverage') {
        pushCount(beverages, text);
      }
    };

    rawLines.forEach((l) => ingest(String(l?.text || ''), l?.originalSel));
    (item.customizations || []).forEach((c: any) => {
      const items = Array.isArray(c?.items) ? c.items : [];
      items.forEach((raw: any) => ingest(String(raw || ''), undefined, String(c?.category || '')));
    });

    // Included / Substitute line (single source of truth)
    if (!noSauceSelected) {
      const count = getChickenTendersCount();
      const oz = getIncludedHoneyMustardOz(count);
      const base = substituteSauceChoice && !/^no sauce$/i.test(substituteSauceChoice)
        ? substituteSauceChoice.replace(/\s*\(\d+oz\)\s*/i, '').trim()
        : 'Honey Mustard Sauce';
      if (!(normalize(base) === 'honey mustard sauce' && noHoneyMustardSelected)) {
        pushText(included, `${base} (${oz})`);
      }
    }

    const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
      bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);
    const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
      bucket.order.map((k) => {
        const entry = bucket.map.get(k)!;
        return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
      });

    return [
      ...toTextLines(included),
      ...toTextLines(specialInstructions),
      ...toCountLines(extraSauces),
      ...toCountLines(extraRanchBleu),
      ...toCountLines(desserts),
      ...toCountLines(beverages),
    ];
}

const buildSauceBasedAppetizerLines = (
  item: CartItem,
  rawLines: { text: string; originalSel?: CartSelection }[],
  mode: 'mozzarella' | 'arancini'
): string[] => {
  const normalized = (value: string): string =>
    String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  const parseTrailingQty = (value: string): { base: string; qty: number } => {
    const text = String(value || '').trim();
    const m = text.match(/^(.*?)\s*x\s*(\d+)$/i);
    if (!m) return { base: text, qty: 1 };
    return { base: String(m[1] || '').trim(), qty: parseInt(m[2], 10) || 1 };
  };

  const bucketText = () => ({ order: [] as string[], map: new Map<string, string>() });
  const bucketCount = () => ({ order: [] as string[], map: new Map<string, { base: string; qty: number }>() });

  const included = bucketText();
  const extras = bucketCount();
  const special = bucketText();
  const desserts = bucketCount();
  const beverages = bucketCount();

  const pushText = (bucket: { order: string[]; map: Map<string, string> }, value: string) => {
    const text = String(value || '').trim();
    if (!text) return;
    const key = normalized(parseTrailingQty(text).base);
    if (!key) return;
    if (!bucket.map.has(key)) {
      bucket.map.set(key, text);
      bucket.order.push(key);
    }
  };

  const pushCount = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }, value: string) => {
    const parsed = parseTrailingQty(value);
    const key = normalized(parsed.base);
    if (!key) return;
    if (!bucket.map.has(key)) {
      bucket.map.set(key, { base: parsed.base, qty: parsed.qty });
      bucket.order.push(key);
      return;
    }
    const prev = bucket.map.get(key)!;
    bucket.map.set(key, {
      base: prev.base.length >= parsed.base.length ? prev.base : parsed.base,
      qty: Math.max(prev.qty, parsed.qty),
    });
  };

  const isQtyEcho = (label: string): boolean => {
    const l = normalized(label);
    if (mode === 'mozzarella') return /\b\d+\s+mozzarella sticks\b/.test(l) || /\b\d+\s*pcs?\b/.test(l);
    return /\b\d+\s+arancini(\s+rice\s+ball)?\b/.test(l) || /\b\d+\s*pcs?\b/.test(l) || l === '1pc';
  };

  const isArtifact = (label: string): boolean => {
    const l = normalized(label);
    return !l || isQtyEcho(l) || /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/.test(l);
  };

  const classify = (text: string, meta?: { type?: string; groupId?: string; groupTitle?: string; category?: string }):
    'included' | 'extra' | 'special' | 'dessert' | 'beverage' | 'ignore' => {
    const line = normalized(text);
    const type = normalized(meta?.type || '');
    const gid = normalized(meta?.groupId || '');
    const gt = normalized(meta?.groupTitle || '');
    const cat = normalized(meta?.category || '');

    if (isArtifact(line)) return 'ignore';
    if (type === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || cat.includes('dessert')) return 'dessert';
    if (type === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || cat.includes('beverage')) return 'beverage';
    if (gid.includes('included_sauce') || gt === 'included') return 'included';

    if (
      gid.includes('mozzarella_sticks_instructions') ||
      gid.includes('mozzarella_sticks_special_instructions') ||
      gid.includes('arancini_special_instructions') ||
      gt.includes('special instructions') ||
      line.startsWith('no ')
    ) return 'special';

    if (
      gid.includes('extra_sauce') ||
      gt.includes('extra sauce') ||
      line.startsWith('side of') ||
      line.startsWith('extra ')
    ) return 'extra';

    // Remaining sauce-like lines that are not qty echoes are treated as included.
    if (line.includes('sauce')) return 'included';
    return 'ignore';
  };

  const ingest = (rawText: string, meta?: { type?: string; groupId?: string; groupTitle?: string; category?: string }) => {
    let text = String(rawText || '').trim();
    if (!text || isArtifact(text)) return;
    text = text.replace(/blue cheese/gi, 'Bleu Cheese').replace(/\s+/g, ' ').trim();
    const cls = classify(text, meta);
    if (cls === 'ignore') return;
    if (cls === 'included') return pushText(included, text);
    if (cls === 'special') return pushText(special, text);
    if (cls === 'extra') {
      if (!/^extra\s+/i.test(text) && !/^side of/i.test(text) && !/^no\b/i.test(text)) {
        text = `Extra ${text}`;
      }
      return pushCount(extras, text);
    }
    if (cls === 'dessert') return pushCount(desserts, text);
    if (cls === 'beverage') return pushCount(beverages, text);
  };

  rawLines.forEach((line) => {
    ingest(String(line?.text || ''), {
      type: line?.originalSel?.type,
      groupId: line?.originalSel?.groupId,
      groupTitle: line?.originalSel?.groupTitle,
    });
  });

  (item.customizations || []).forEach((c: any) => {
    const items = Array.isArray(c?.items) ? c.items : [];
    items.forEach((raw: any) => ingest(String(raw || ''), { category: String(c?.category || ''), groupTitle: String(c?.category || ''), groupId: String(c?.groupId || '') }));
  });

  const hasNoSauce = special.order.some((k) => k.startsWith('no sauce') || k.startsWith('no pomodoro sauce'));
  if (hasNoSauce) {
    included.order = [];
    included.map.clear();
  }

  const getCountFromItem = (): number => {
    const countFromName = String(item.name || '').match(/\b(\d+)\b/);
    if (countFromName) return parseInt(countFromName[1], 10) || 0;
    const countFromSelection = (item.selections || [])
      .map((s) => String(s?.label || ''))
      .map((l) => l.match(/\b(\d+)\s*(?:pcs?|pieces?|arancini|mozzarella)\b/i))
      .find(Boolean);
    if (countFromSelection && countFromSelection[1]) return parseInt(countFromSelection[1], 10) || 0;
    return 0;
  };

  const getAranciniIncludedOz = (count: number): string => {
    const pid = String(item.productId || item.id || '').toLowerCase();
    if (pid === 'capp4') {
      if (count >= 50) return '32oz';
      if (count >= 30) return '16oz';
      if (count >= 20) return '8oz';
      return '4oz';
    }
    // app8 regular
    if (count >= 16) return '32oz';
    if (count >= 8) return '16oz';
    if (count >= 4) return '8oz';
    return '4oz';
  };

  const getMozzarellaIncludedOz = (count: number): string => {
    if (count >= 48) return '32oz';
    if (count >= 24) return '16oz';
    if (count >= 12) return '8oz';
    return '4oz';
  };

  // Included sauce must always be a single dynamic line (no xN duplication)
  // and never derived from repeated raw/customization entries.
  if (!hasNoSauce && (mode === 'arancini' || mode === 'mozzarella')) {
    const count = getCountFromItem();
    const oz = mode === 'arancini' ? getAranciniIncludedOz(count) : getMozzarellaIncludedOz(count);
    included.order = [];
    included.map.clear();
    pushText(included, `(${oz}) Pomodoro Sauce`);
  }

  const toTextLines = (bucket: { order: string[]; map: Map<string, string> }): string[] =>
    bucket.order.map((k) => bucket.map.get(k)!).filter(Boolean);

  const toCountLines = (bucket: { order: string[]; map: Map<string, { base: string; qty: number }> }): string[] =>
    bucket.order.map((k) => {
      const entry = bucket.map.get(k)!;
      return entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base;
    });

  return [
    ...toTextLines(included),
    ...toCountLines(extras),
    ...toTextLines(special),
    ...toCountLines(desserts),
    ...toCountLines(beverages),
  ];
};

const buildSeafoodAppetizersDisplayLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    // Placeholder
    return rawLines.map(l => l.text);
}

const buildCyoPizzaLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    return buildStructuredProfileDisplayLines(item, rawLines, itemQty, 'CYO_PIZZA');
}

const buildSpecialtyPizzaLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    return buildStructuredProfileDisplayLines(item, rawLines, itemQty, 'SPECIALTY_PIZZA');
}

const buildBrooklynPizzaLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    return buildStructuredProfileDisplayLines(item, rawLines, itemQty, 'BROOKLYN');
}

const buildByTheSliceLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
  const inputSelections = (item as any)?.selections ?? [];
  const inputCustomizations = (item as any)?.customizations ?? [];

  const additional = new Map<string, string>();
  const specialInstructions = new Map<string, string>();
  const desserts = new Map<string, string>();
  const beverages = new Map<string, string>();

  const parseTrailingQty = (value: string): { base: string; qty: number } => {
    const v = String(value || '').trim();
    const match = v.match(/^(.*?)\s*x\s*(\d+)$/i);
    if (!match) return { base: v, qty: 1 };
    return { base: String(match[1] || '').trim(), qty: parseInt(match[2], 10) || 1 };
  };

  const normalizedKey = (value: string): string => {
    const parsed = parseTrailingQty(value);
    return parsed.base.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  const pushUnique = (bucket: Map<string, string>, value: string) => {
    const v = String(value || '').trim();
    if (!v) return;
    const key = normalizedKey(v);
    const nextParsed = parseTrailingQty(v);
    const prev = bucket.get(key);
    if (!prev) {
      bucket.set(key, v);
      return;
    }
    const prevParsed = parseTrailingQty(prev);

    // Prefer explicit quantities > 1, otherwise keep plain label (without x1).
    if (nextParsed.qty > prevParsed.qty && nextParsed.qty > 1) {
      bucket.set(key, `${nextParsed.base} x${nextParsed.qty}`);
      return;
    }
    if (prevParsed.qty <= 1 && nextParsed.qty <= 1) {
      if (!/\sx\s*1$/i.test(v)) bucket.set(key, v);
    }
  };

  const isArtifact = (value: string) => {
    const v = String(value || '').trim().toLowerCase();
    return /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(v);
  };

  const sectionFromMeta = (type?: string, groupTitle?: string, groupId?: string): 'additional' | 'special' | 'dessert' | 'beverage' | null => {
    const t = String(type || '').toLowerCase();
    const gt = String(groupTitle || '').toLowerCase();
    const gid = String(groupId || '').toLowerCase();

    if (t === 'dessert' || gt.includes('dessert') || gid.includes('dessert')) return 'dessert';
    if (t === 'beverage' || gt.includes('beverage') || gid.includes('beverage')) return 'beverage';
    if (t === 'special_instruction' || gt.includes('special instruction') || gid.includes('special_instruction')) return 'special';
    if (t === 'topping' || t === 'extra_topping' || gt.includes('add toppings') || gt.includes('additional toppings') || gid.includes('add_toppings') || gid.includes('additional_toppings')) return 'additional';
    return null;
  };

  inputSelections.forEach((s: any) => {
    const text = String(s?.label || s?.text || s?.name || '').trim();
    if (!text || isArtifact(text)) return;
    const section = sectionFromMeta(s?.type, s?.groupTitle, s?.groupId);
    if (section === 'dessert') pushUnique(desserts, text);
    else if (section === 'beverage') pushUnique(beverages, text);
    else if (section === 'special') pushUnique(specialInstructions, text);
    else if (section === 'additional') pushUnique(additional, text);
  });

  inputCustomizations.forEach((c: any) => {
    const category = String(c?.category || c?.groupTitle || '').toLowerCase();
    const items = Array.isArray(c?.items) ? c.items : [];
    items.forEach((raw: any) => {
      const text = String(raw || '').trim();
      if (!text || isArtifact(text)) return;
      if (category.includes('dessert')) pushUnique(desserts, text);
      else if (category.includes('beverage')) pushUnique(beverages, text);
      else if (category.includes('special instruction')) pushUnique(specialInstructions, text);
      else if (category.includes('add toppings') || category.includes('additional toppings')) pushUnique(additional, text);
    });
  });

  rawLines.forEach((r) => {
    const text = String(r?.text || '').trim();
    if (!text || isArtifact(text)) return;
    const s = r?.originalSel as any;
    const section = sectionFromMeta(s?.type, s?.groupTitle, s?.groupId);
    if (section === 'dessert') pushUnique(desserts, text);
    else if (section === 'beverage') pushUnique(beverages, text);
    else if (section === 'special') pushUnique(specialInstructions, text);
    else if (section === 'additional') pushUnique(additional, text);
  });

  return [
    ...Array.from(additional.values()),
    ...Array.from(specialInstructions.values()),
    ...Array.from(desserts.values()),
    ...Array.from(beverages.values())
  ];
};

const buildHotHoagieLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
  const order = [
    'Toast Option',
    'Substitute Cheese',
    'On The Side Toppings',
    'Extra Toppings',
    'Special Instructions',
    'Would You Like To Add Extra Sides',
    'Dessert',
    'Beverages',
  ] as const;

  const buckets: Record<(typeof order)[number], string[]> = {
    'Toast Option': [],
    'Substitute Cheese': [],
    'On The Side Toppings': [],
    'Extra Toppings': [],
    'Special Instructions': [],
    'Would You Like To Add Extra Sides': [],
    'Dessert': [],
    'Beverages': [],
  };

  const withOnTheSidePrefix = (value: string) => {
    const text = String(value || '').trim();
    if (!text) return text;
    if (/^on the side\b/i.test(text)) return text;
    return `On The Side ${text}`;
  };

  const pushUnique = (section: (typeof order)[number], value: string) => {
    const raw = String(value || '').trim();
    const text = section === 'On The Side Toppings' ? withOnTheSidePrefix(raw) : raw;
    if (!text) return;
    if (!buckets[section].includes(text)) buckets[section].push(text);
  };

  const resolveSection = (groupTitle?: string, type?: string, groupId?: string, id?: string, label?: string): (typeof order)[number] | null => {
    const g = String(groupTitle || '').toLowerCase().trim();
    const t = String(type || '').toLowerCase().trim();
    const gid = String(groupId || '').toLowerCase().trim();
    const sid = String(id || '').toLowerCase().trim();
    const l = String(label || '').toLowerCase().trim();

    // ID-first mapping for resilience against noisy group titles.
    if (sid.startsWith('hh-cheese')) return 'Substitute Cheese';
    if (sid.startsWith('hh-extra')) return 'Extra Toppings';
    if (sid.startsWith('hh-si')) return 'Special Instructions';
    if (sid.startsWith('hh-side-')) return 'Would You Like To Add Extra Sides';
    if (sid.startsWith('ch-side-req')) return 'On The Side Toppings';
    if (sid.startsWith('gch-no') || sid.startsWith('spo-no') || sid.startsWith('cbd-no') || sid.startsWith('bgc-no')) return 'Special Instructions';

    if (g.includes('toast option') || gid.includes('toast_option')) return 'Toast Option';
    if (g.includes('substitute cheese') || gid.includes('hot_hoagie_cheese') || sid.startsWith('hh-cheese')) return 'Substitute Cheese';
    if (g.includes('on the side toppings') || gid.includes('grilled_chicken_side_toppings') || gid.includes('hot_hoagie_side_toppings')) return 'On The Side Toppings';
    if (g.includes('extra toppings') || g === 'extras' || gid.includes('hot_hoagie_extra') || (t === 'extra_topping' && !l.includes('side of extra chips'))) return 'Extra Toppings';
    if (g.includes('special instruction') || gid.includes('special_instruction') || t === 'special_instruction') return 'Special Instructions';
    if (g.includes('add extra sides') || g === 'sides' || g === 'extra sides' || gid.includes('extra_sides') || gid.includes('hot_hoagie_sides') || (t === 'side' && l.startsWith('wings')) || (t === 'side' && l.includes('french fries'))) return 'Would You Like To Add Extra Sides';
    if (g === 'dessert' || g === 'desserts' || t === 'dessert' || gid.includes('dessert')) return 'Dessert';
    if (g === 'beverage' || g === 'beverages' || t === 'beverage' || gid.includes('beverage')) return 'Beverages';

    // Final fallback: keep reportable items instead of dropping them.
    if (t === 'special_instruction') return 'Special Instructions';
    if (t === 'extra_topping') return 'Extra Toppings';
    if (t === 'side') return 'Would You Like To Add Extra Sides';
    if (t === 'dessert') return 'Dessert';
    if (t === 'beverage') return 'Beverages';
    return null;
  };

  (item.selections || []).forEach((sel: any) => {
    const section = resolveSection(sel.groupTitle, sel.type, sel.groupId, sel.id, sel.label || sel.displayName || sel.name);
    if (!section) return;
    pushUnique(section, String(sel.label || sel.displayName || sel.name || '').trim());
  });

  (item.customizations || []).forEach((c: any) => {
    const items = Array.isArray(c.items) ? c.items : [];
    items.forEach((v: any) => {
      const text = String(v || '').trim();
      if (!text) return;
      const section = resolveSection(c.category, undefined, c.groupId, c.id, text);
      if (!section) return;
      pushUnique(section, text);
    });
  });

  rawLines.forEach((line) => {
    const sel = line.originalSel as any;
    const text = String(line.text || '').trim();
    const section = resolveSection(sel?.groupTitle, sel?.type, sel?.groupId, sel?.id, text);
    if (!section) return;
    pushUnique(section, text);
  });

  // Consolidate duplicates coming from multiple sources (selections/customizations/rawLines).
  // Keep a single line per semantic item and prefer explicit qty form (xN) when present.
  const consolidateBySemanticKey = (lines: string[]): string[] => {
    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const v = String(value || '').trim();
      const match = v.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!match) return { base: v, qty: 1 };
      return { base: String(match[1] || '').trim(), qty: parseInt(match[2], 10) || 1 };
    };

    const normalized = (value: string) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

    const selected = new Map<string, { base: string; qty: number }>();
    const order: string[] = [];

    lines.forEach((line) => {
      const parsed = parseTrailingQty(line);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!selected.has(key)) {
        selected.set(key, parsed);
        order.push(key);
        return;
      }
      const prev = selected.get(key)!;
      // Prefer the highest explicit quantity representation.
      if (parsed.qty > prev.qty) selected.set(key, parsed);
    });

    return order
      .map((key) => selected.get(key)!)
      .map((entry) => (entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base));
  };

  (Object.keys(buckets) as (typeof order)[number][]).forEach((section) => {
    buckets[section] = consolidateBySemanticKey(buckets[section]);
  });

  // Cross-section dedupe guard:
  // if the same semantic item appears in Side Toppings and Extra Sides,
  // keep it only in Extra Sides.
  const toKey = (value: string) =>
    String(value || '')
      .replace(/\s*x\s*\d+$/i, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  const extraSideKeys = new Set(buckets['Would You Like To Add Extra Sides'].map(toKey));
  if (extraSideKeys.size > 0) {
    buckets['Side Toppings'] = buckets['Side Toppings'].filter((x) => !extraSideKeys.has(toKey(x)));
  }

  return order.flatMap((section) => buckets[section]);
};

const buildColdHoagieLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
  const order = [
    'Substitute Cheese',
    'On The Side Toppings',
    'Add Toppings',
    'Extra Toppings',
    'Lite Toppings',
    'No Toppings',
    'Side of Extra Chips',
    'Side Toppings',
    'Would You Like To Add Extra Sides',
    'Dessert',
    'Beverages',
  ] as const;

  const buckets: Record<(typeof order)[number], string[]> = {
    'Substitute Cheese': [],
    'On The Side Toppings': [],
    'Add Toppings': [],
    'Extra Toppings': [],
    'Lite Toppings': [],
    'No Toppings': [],
    'Side of Extra Chips': [],
    'Side Toppings': [],
    'Would You Like To Add Extra Sides': [],
    'Dessert': [],
    'Beverages': [],
  };

  const withOnTheSidePrefix = (value: string) => {
    const text = String(value || '').trim();
    if (!text) return text;
    if (/^on the side\b/i.test(text)) return text;
    return `On The Side ${text}`;
  };

  const withChipsSuffix = (value: string) => {
    const text = String(value || '').trim();
    if (!text) return text;
    if (/\bx\d+\b/i.test(text)) return text;
    return `${text} x6`;
  };

  const pushUnique = (section: (typeof order)[number], value: string) => {
    const raw = String(value || '').trim();
    if (!raw) return;
    let text = raw;
    if (section === 'On The Side Toppings') text = withOnTheSidePrefix(text);
    if (section === 'Side of Extra Chips') text = withChipsSuffix(text);
    if (!buckets[section].includes(text)) buckets[section].push(text);
  };

  const resolveSection = (groupTitle?: string, type?: string, groupId?: string, id?: string, label?: string): (typeof order)[number] | null => {
    const g = String(groupTitle || '').toLowerCase().trim();
    const t = String(type || '').toLowerCase().trim();
    const gid = String(groupId || '').toLowerCase().trim();
    const sid = String(id || '').toLowerCase().trim();
    const l = String(label || '').toLowerCase().trim();

    // ID-first mapping for resilience against inconsistent group metadata.
    if (sid.startsWith('ch-cheese')) return 'Substitute Cheese';
    if (sid.startsWith('ch-side-req')) return 'On The Side Toppings';
    if (sid.startsWith('ch-add')) return 'Add Toppings';
    if (sid.startsWith('ch-extra')) return 'Extra Toppings';
    if (sid.startsWith('ch-lite')) return 'Lite Toppings';
    if (sid.startsWith('ch-no')) return 'No Toppings';
    if (sid.startsWith('ch-side')) return 'Side Toppings';
    if (sid.startsWith('hh-side-')) return 'Would You Like To Add Extra Sides';

    const isExtraSideByLabel =
      l.startsWith('wings') ||
      l.includes('french fries') ||
      l.includes('add wings') ||
      l.includes('cheese ff') ||
      l.includes('passariello fries') ||
      l.includes('mozzarella sticks') ||
      l.includes('onion rings') ||
      l.includes('broccoli cheddar bites') ||
      l.includes('mac & cheese bites');
    const isSideToppingByLabel =
      l.startsWith('side ') ||
      l.includes('side mayo') ||
      l.includes('side ketchup');

    if (g.includes('substitute cheese') || gid.includes('cold_hoagie_cheese') || sid.startsWith('ch-cheese')) return 'Substitute Cheese';
    if (sid.startsWith('ch-side-req') || g.includes('on the side toppings') || gid.includes('cold_hoagie_side_toppings')) return 'On The Side Toppings';
    if (g.includes('add toppings') || gid.includes('cold_hoagie_add')) return 'Add Toppings';
    if (g.includes('extra toppings') || g === 'extras' || gid.includes('cold_hoagie_extra') || t === 'extra_topping') return 'Extra Toppings';
    if (g.includes('lite toppings') || g === 'lite' || gid.includes('cold_hoagie_lite')) return 'Lite Toppings';
    if (g.includes('no toppings') || gid.includes('cold_hoagie_no') || t === 'no_topping') return 'No Toppings';
    if (g.includes('side of extra chips') || gid.includes('side_of_extra_chips') || l.includes('side of extra chips')) return 'Side of Extra Chips';
    if (g.includes('add extra sides') || g === 'extra sides' || gid.includes('extra_sides') || gid.includes('cold_hoagie_extra_sides') || isExtraSideByLabel) return 'Would You Like To Add Extra Sides';
    if (g === 'side toppings' || gid === 'cold_hoagie_side' || sid.startsWith('ch-side') || (gid.includes('side_toppings') && !gid.includes('cold_hoagie_side_toppings'))) return 'Side Toppings';
    if (g === 'sides') return isExtraSideByLabel ? 'Would You Like To Add Extra Sides' : 'Side Toppings';
    if (g === 'dessert' || g === 'desserts' || t === 'dessert' || gid.includes('dessert')) return 'Dessert';
    if (g === 'beverage' || g === 'beverages' || t === 'beverage' || gid.includes('beverage')) return 'Beverages';

    // Final fallback: keep reportable items instead of dropping them.
    if (t === 'special_instruction') return null;
    if (t === 'extra_topping') return 'Extra Toppings';
    if (t === 'topping') return 'Add Toppings';
    if (t === 'side') return isExtraSideByLabel ? 'Would You Like To Add Extra Sides' : (isSideToppingByLabel ? 'Side Toppings' : null);
    if (t === 'no_topping') return 'No Toppings';
    if (t === 'dessert') return 'Dessert';
    if (t === 'beverage') return 'Beverages';
    return null;
  };

  (item.selections || []).forEach((sel: any) => {
    const section = resolveSection(sel.groupTitle, sel.type, sel.groupId, sel.id, sel.label || sel.displayName || sel.name);
    if (!section) return;
    pushUnique(section, String(sel.label || sel.displayName || sel.name || '').trim());
  });

  (item.customizations || []).forEach((c: any) => {
    const items = Array.isArray(c.items) ? c.items : [];
    items.forEach((v: any) => {
      const text = String(v || '').trim();
      if (!text) return;
      const section = resolveSection(c.category, undefined, c.groupId, c.id, text);
      if (!section) return;
      pushUnique(section, text);
    });
  });

  rawLines.forEach((line) => {
    const sel = line.originalSel as any;
    const text = String(line.text || '').trim();
    if (!text) return;
    const section = resolveSection(sel?.groupTitle, sel?.type, sel?.groupId, sel?.id, text);
    if (!section) return;
    pushUnique(section, text);
  });

  // Consolidate duplicates coming from multiple sources (selections/customizations/rawLines).
  // Keep a single semantic item per section and prefer explicit qty form (xN) when N > 1.
  const consolidateBySemanticKey = (lines: string[]): string[] => {
    const parseTrailingQty = (value: string): { base: string; qty: number } => {
      const v = String(value || '').trim();
      const match = v.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!match) return { base: v, qty: 1 };
      return { base: String(match[1] || '').trim(), qty: parseInt(match[2], 10) || 1 };
    };

    const normalized = (value: string) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

    const selected = new Map<string, { base: string; qty: number }>();
    const order: string[] = [];

    lines.forEach((line) => {
      const parsed = parseTrailingQty(line);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!selected.has(key)) {
        selected.set(key, parsed);
        order.push(key);
        return;
      }
      const prev = selected.get(key)!;
      if (parsed.qty > prev.qty) selected.set(key, parsed);
    });

    return order
      .map((key) => selected.get(key)!)
      .map((entry) => (entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base));
  };

  (Object.keys(buckets) as (typeof order)[number][]).forEach((section) => {
    buckets[section] = consolidateBySemanticKey(buckets[section]);
  });

  return order.flatMap((section) => buckets[section]);
};

const buildWrapLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
  const order = [
    'Choose Wrap',
    'Substitute Cheese',
    'Extra Toppings',
    'Extra Cheese',
    'Lite Toppings',
    'No Toppings',
    'Side of Extra Chips',
    'Side Toppings',
    'Dessert',
    'Beverages',
  ] as const;

  const buckets: Record<(typeof order)[number], string[]> = {
    'Choose Wrap': [],
    'Substitute Cheese': [],
    'Extra Toppings': [],
    'Extra Cheese': [],
    'Lite Toppings': [],
    'No Toppings': [],
    'Side of Extra Chips': [],
    'Side Toppings': [],
    'Dessert': [],
    'Beverages': [],
  };

  const WRAP_ALIAS_TO_NAME: Record<string, string> = {
    'wrap-extra1': 'Extra Cheese',
    'wrap-lite1': 'Lite Cheese',
    'wrap-lite2': 'Lite Salt',
    'wrap-lite3': 'Lite Black Pepper',
    'wrap-lite4': 'Lite Lettuce',
    'wrap-lite5': 'Lite Tomatoes',
    'wrap-lite6': 'Lite Oregano',
    'wrap-lite7': 'Lite Raw Onions',
    'wrap-lite8': 'Lite Spinach',
    'wrap-lite9': 'Lite Roasted Red Peppers',
    'wrap-lite10': 'Lite Lettuce',
    'wrap-lite11': 'Lite Tomatoes',
    'wrap-lite12': 'Lite Raw Onions',
    'wrap-lite13': 'Lite Oregano',
    'wrap-lite14': 'Lite Oil',
    'wrap-lite15': 'Lite Vinegar',
    'wrap-lite16': 'Lite Lettuce',
    'wrap-lite17': 'Lite Oregano',
    'wrap-lite18': 'Lite Tomatoes',
    'wrap-lite19': 'Lite Lettuce',
    'wrap-lite20': 'Lite Tomatoes',
    'wrap-lite21': 'Lite Oregano',
    'wrap-lite22': 'Lite Raw Onions',
    'wrap-lite23': 'Lite Grilled Eggplant',
    'wrap-lite24': 'Lite Grilled Zucchini',
    'wrap-lite25': 'Lite Roasted Red Peppers',
    'wrap-lite-ham': 'Lite Ham',
    'wrap-lite-capicola': 'Lite Capicola',
    'wrap-lite-salami': 'Lite Salami',
    'wrap-no2': 'No Potato Chips',
    'wrap-no3': 'No Salt',
    'wrap-no4': 'No Black Pepper',
    'wrap-no5': 'No Lettuce',
    'wrap-no6': 'No Tomatoes',
    'wrap-no7': 'No Oregano',
    'wrap-no8': 'No Raw Onions',
    'wrap-no9': 'No Spinach',
    'wrap-no10': 'No Roasted Red Peppers',
    'wrap-no11': 'No Lettuce',
    'wrap-no12': 'No Tomatoes',
    'wrap-no13': 'No Raw Onions',
    'wrap-no14': 'No Oregano',
    'wrap-no15': 'No Oil',
    'wrap-no16': 'No Vinegar',
    'wrap-no17': 'No Lettuce',
    'wrap-no18': 'No Oregano',
    'wrap-no19': 'No Tomatoes',
    'wrap-no20': 'No Lettuce',
    'wrap-no21': 'No Tomatoes',
    'wrap-no22': 'No Oregano',
    'wrap-no23': 'No Raw Onions',
    'wrap-no24': 'No Grilled Eggplant',
    'wrap-no25': 'No Grilled Zucchini',
    'wrap-no26': 'No Roasted Red Peppers',
    'wrap-no-ham': 'No Ham',
    'wrap-no-capicola': 'No Capicola',
    'wrap-no-salami': 'No Salami',
  };

  const resolveWrapAliasLabel = (value: string): string => {
    const text = String(value || '').trim();
    if (!text) return text;
    const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
    const keyFromSpaced = normalized.replace(/\s+/g, '-');
    if (WRAP_ALIAS_TO_NAME[keyFromSpaced]) return WRAP_ALIAS_TO_NAME[keyFromSpaced];

    const compact = normalized
      .replace(/^extra\s+/i, '')
      .replace(/^wrap[\s-]+/, 'wrap-')
      .replace(/^wrap[-\s]+(lite|no)[-\s]*/, 'wrap-$1')
      .replace(/^wrap[-\s]+(lite|no)([a-z0-9]+)/, 'wrap-$1$2')
      .trim();
    if (WRAP_ALIAS_TO_NAME[compact]) return WRAP_ALIAS_TO_NAME[compact];

    return text;
  };

  const withWrapChipsSuffix = (value: string) => {
    const text = String(value || '').trim();
    if (!text) return text;
    const noQty = text.replace(/\s*x\s*\d+\s*$/i, '').trim();
    return `${noQty} x6`;
  };

  const normalizeWrapLine = (section: (typeof order)[number], value: string) => {
    let text = resolveWrapAliasLabel(String(value || '').trim());
    if (!text) return text;
    if (section === 'Extra Cheese') {
      if (/^extra\s+wrap\s+extra\d+$/i.test(text) || /^wrap\s+extra\d+$/i.test(text)) {
        return 'Extra Cheese';
      }
      if (/^extra\s+extra cheese$/i.test(text)) return 'Extra Cheese';
    }
    if (section === 'Extra Toppings') {
      // Guard against leaked internal wrap-extra placeholder labels.
      if (/^extra\s+wrap\s+extra\d+$/i.test(text) || /^wrap\s+extra\d+$/i.test(text)) {
        return '';
      }
    }
    return text;
  };

  const pushUnique = (section: (typeof order)[number], value: string) => {
    let text = normalizeWrapLine(section, value);
    if (!text) return;
    if (section === 'Side of Extra Chips') text = withWrapChipsSuffix(text);
    if (!buckets[section].includes(text)) buckets[section].push(text);
  };

  const resolveSection = (groupTitle?: string, type?: string, groupId?: string, id?: string, label?: string): (typeof order)[number] | null => {
    const g = String(groupTitle || '').toLowerCase().trim();
    const t = String(type || '').toLowerCase().trim();
    const gid = String(groupId || '').toLowerCase().trim();
    const sid = String(id || '').toLowerCase().trim();
    const l = String(label || '').toLowerCase().trim();

    if (gid.includes('wrap_type') || sid.startsWith('wrap-type') || g.includes('choose your wrap') || g.includes('wrap type')) return 'Choose Wrap';
    if (gid.includes('wrap_cheese') || sid.startsWith('wrap-cheese') || g.includes('substitute cheese') || g === 'cheese') return 'Substitute Cheese';
    if (gid.includes('wrap_extra_cheese') || sid.startsWith('wrap-extra') || g.includes('extra cheese')) return 'Extra Cheese';
    if (l.startsWith('wrap lite') || l.startsWith('wrap-lite')) return 'Lite Toppings';
    if (l.startsWith('wrap no') || l.startsWith('wrap-no')) return 'No Toppings';
    if (gid.includes('wrap_add') || g.includes('add toppings') || g.includes('extra toppings') || g === 'extras') return 'Extra Toppings';
    if (gid.includes('wrap_lite') || g.includes('lite toppings') || g === 'lite') return 'Lite Toppings';
    if (gid.includes('wrap_no') || g.includes('no toppings') || t === 'no_topping') return 'No Toppings';
    if (gid.includes('wrap_side_of_chips') || gid.includes('side_of_extra_chips') || g.includes('side of extra chips') || l.includes('side of extra chips')) return 'Side of Extra Chips';
    if (gid.includes('wrap_side') || g === 'side toppings' || g.includes('side toppings')) return 'Side Toppings';
    if (g === 'dessert' || g === 'desserts' || t === 'dessert' || gid.includes('dessert')) return 'Dessert';
    if (g === 'beverage' || g === 'beverages' || t === 'beverage' || gid.includes('beverage')) return 'Beverages';

    if (t === 'extra_topping' || t === 'topping') return 'Extra Toppings';
    if (t === 'side') return 'Side Toppings';
    return null;
  };

  (item.selections || []).forEach((sel: any) => {
    const section = resolveSection(sel.groupTitle, sel.type, sel.groupId, sel.id, sel.label || sel.displayName || sel.name);
    if (!section) return;
    pushUnique(section, String(sel.label || sel.displayName || sel.name || '').trim());
  });

  (item.customizations || []).forEach((c: any) => {
    const items = Array.isArray(c.items) ? c.items : [];
    items.forEach((v: any) => {
      const text = String(v || '').trim();
      if (!text) return;
      const section = resolveSection(c.category, undefined, c.groupId, c.id, text);
      if (!section) return;
      pushUnique(section, text);
    });
  });

  rawLines.forEach((line) => {
    const sel = line.originalSel as any;
    const text = String(line.text || '').trim();
    if (!text) return;
    const section = resolveSection(sel?.groupTitle, sel?.type, sel?.groupId, sel?.id, text);
    if (!section) return;
    pushUnique(section, text);
  });

  const consolidateBySemanticKey = (lines: string[]): string[] => {
    const parseTrailingQty = (value: string): { base: string; qty: number; explicit: boolean } => {
      const v = String(value || '').trim();
      const match = v.match(/^(.*?)\s*x\s*(\d+)$/i);
      if (!match) return { base: v, qty: 1, explicit: false };
      return {
        base: String(match[1] || '').trim(),
        qty: parseInt(match[2], 10) || 1,
        explicit: true,
      };
    };

    const normalized = (value: string) =>
      String(value || '')
        .toLowerCase()
        .replace(/^extra\s+/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    const selected = new Map<string, { base: string; qty: number; explicit: boolean }>();
    const stableOrder: string[] = [];

    lines.forEach((line) => {
      const parsed = parseTrailingQty(line);
      const key = normalized(parsed.base);
      if (!key) return;
      if (!selected.has(key)) {
        selected.set(key, parsed);
        stableOrder.push(key);
        return;
      }
      const prev = selected.get(key)!;
      if (parsed.qty > prev.qty) {
        selected.set(key, parsed);
        return;
      }
      if (parsed.qty === prev.qty && parsed.qty === 1 && prev.explicit && !parsed.explicit) {
        selected.set(key, parsed);
      }
    });

    return stableOrder
      .map((key) => selected.get(key)!)
      .map((entry) => (entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base));
  };

  (Object.keys(buckets) as (typeof order)[number][]).forEach((section) => {
    buckets[section] = consolidateBySemanticKey(buckets[section]);
  });

  return order.flatMap((section) => buckets[section]);
};

// -----------------------------------------------------------------------------
// STROMBOLI / CALZONE & TURNOVER (stromboli-calzone) - CART REPORT
// -----------------------------------------------------------------------------

const STROMBOLI_DIPPING_RE = /(choose your dipping sauce|choose dipping|dipping)/i;
const STROMBOLI_ADDITIONAL_TOPPINGS_RE = /^additional toppings$/i;

const stromboliLabel = (x: any): string => String(x?.label ?? x?.text ?? x?.name ?? "").trim();

const stromboliIsNone = (s: string) => /^none$/i.test(s.trim()) || /^no\b/i.test(s.trim());
const stromboliIsArtifact = (s: string) => {
  const t = String(s || '').trim().toLowerCase();
  return /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(t);
};

const stromboliIsSize = (s: any) => {
  const t = (s?.text || s?.label || "").toLowerCase();
  const gt = (s?.groupTitle || "").toLowerCase();
  const typ = (s?.type || "").toLowerCase();
  return (
    typ === "size" ||
    typ === "required_option" ||
    gt.includes("size") ||
    /\d+"\s+/.test(t) || // "16" "
    t.includes("large (") || t.includes("medium (")
  );
};

const parseStromboliQty = (raw: string): { name: string; qty: number } => {
  let s = raw.trim();
  let qty = 1;

  // Pattern: "Extra (4) Bleu Cheese" or "(4) Bleu Cheese"
  const matchParen = s.match(/^(?:Extra\s*)?\((\d+)\)\s*(.*)$/i);
  if (matchParen) {
    qty = parseInt(matchParen[1], 10);
    s = matchParen[2].trim();
  } else {
    // Pattern: "Bleu Cheese x4"
    const matchX = s.match(/^(.*?)\s*x\s*(\d+)$/i);
    if (matchX) {
      qty = parseInt(matchX[2], 10);
      s = matchX[1].trim();
    } else {
      // Pattern: "4x Bleu Cheese" or "4 x Bleu Cheese"
      const matchLeadingX = s.match(/^(\d+)\s*x\s*(.*)$/i);
      if (matchLeadingX) {
        qty = parseInt(matchLeadingX[1], 10);
        s = matchLeadingX[2].trim();
      }
    }
  }

  // Normalize Name
  // Only strip "Extra " for dipping-style entries. Keep real topping names
  // like "Extra Cheese" intact.
  if (s.toLowerCase().startsWith("extra ")) {
    const candidate = s.substring(6).trim().toLowerCase();
    if (
      candidate === 'bleu cheese' ||
      candidate === 'blue cheese' ||
      candidate === 'buttermilk ranch' ||
      candidate === 'ranch'
    ) {
      s = s.substring(6).trim();
    }
  }

  return { name: s, qty };
};

const normalizeStromboliAdditionalName = (name: string): string => {
  const raw = String(name || '').trim();
  const lower = raw.toLowerCase();

  // Normalize aliases to canonical menu labels used in UI data.
  const canonicalByAlias: Record<string, string> = {
    'bc': 'Bleu Cheese',
    'side-bc': 'Bleu Cheese',
    'br': 'Buttermilk Ranch',
    'side-br': 'Buttermilk Ranch',
    'blue cheese': 'Bleu Cheese',
    'bleu cheese': 'Bleu Cheese',
    'buttermilk ranch': 'Buttermilk Ranch',
    'cup & char pepperoni': 'Cup n Char Pepperoni',
    'cup n char pepperoni': 'Cup n Char Pepperoni',
    'fresh mozz': 'Fresh Mozzarella',
    'fresh mozzarella': 'Fresh Mozzarella',
    'ricotta': 'Ricotta Cheese',
    'ricotta cheese': 'Ricotta Cheese',
    'grilled onion': 'Grilled Onions',
    'grilled onions': 'Grilled Onions',
    'hot cherry pepper': 'Sliced Hot Cherry Peppers',
    'hot cherry peppers': 'Sliced Hot Cherry Peppers',
    'sliced hot cherry peppers': 'Sliced Hot Cherry Peppers',
    'mix sweet peppers': 'Mix Sweet Peppers',
    'mixed sweet peppers': 'Mix Sweet Peppers',
    'mix grilled peppers': 'Mix Grilled Peppers',
    'mixed grilled peppers': 'Mix Grilled Peppers',
    'sundried tomatoes': 'Sundried Tomatoes',
    'sun dried tomatoes': 'Sundried Tomatoes',
    'chopped tomato': 'Chopped Tomato',
    'chopped tomatoes': 'Chopped Tomato',
  };

  if (canonicalByAlias[lower]) return canonicalByAlias[lower];

  return raw;
};

const canUseStromboliQtySuffix = (name: string): boolean => {
  const n = String(name || '').trim().toLowerCase();
  return n === 'bleu cheese' || n === 'buttermilk ranch';
};

const buildStromboliCalzoneLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
  const inputSelections = (item as any)?.selections ?? [];
  const inputCustomizations = (item as any)?.customizations ?? [];
  const isTurnoverCalzonePepperoniRoll = (() => {
    const name = String(item?.name || '').toLowerCase();
    const id = String(item?.id || '').toLowerCase();
    return (
      name.includes('turnover') ||
      name.includes('calzone') ||
      name.includes('pepperoni roll') ||
      id === 'calzone-1' ||
      id === 'calzone-2' ||
      id === 'stromboli-8'
    );
  })();
  const isDippingLike = (groupTitle?: string, groupId?: string, label?: string): boolean => {
    const gt = String(groupTitle || '').toLowerCase();
    const gid = String(groupId || '').toLowerCase();
    const lb = String(label || '').toLowerCase();
    return (
      STROMBOLI_DIPPING_RE.test(gt) ||
      gid.includes('dipping') ||
      gt.includes('choose dipping') ||
      (gt.includes('sauce') && (lb.includes('bleu') || lb.includes('blue cheese') || lb.includes('ranch')))
    );
  };
  const isExtraSauceLike = (groupTitle?: string, groupId?: string, label?: string): boolean => {
    const gt = String(groupTitle || '').toLowerCase();
    const gid = String(groupId || '').toLowerCase();
    const lb = String(label || '').toLowerCase();
    return (
      gt.includes('extra sauce') ||
      gid.includes('extra_sauce') ||
      lb === 'sauce inside' ||
      lb.startsWith('extra sauce')
    );
  };
  const isDessertLike = (type?: string, groupTitle?: string, groupId?: string, label?: string): boolean => {
    const t = String(type || '').toLowerCase();
    const gt = String(groupTitle || '').toLowerCase();
    const gid = String(groupId || '').toLowerCase();
    const lb = String(label || '').toLowerCase();
    return t === 'dessert' || gt.includes('dessert') || gid.includes('dessert') || lb.includes('dessert');
  };
  const isBeverageLike = (type?: string, groupTitle?: string, groupId?: string, label?: string): boolean => {
    const t = String(type || '').toLowerCase();
    const gt = String(groupTitle || '').toLowerCase();
    const gid = String(groupId || '').toLowerCase();
    const lb = String(label || '').toLowerCase();
    return t === 'beverage' || gt.includes('beverage') || gid.includes('beverage') || lb.includes('20oz') || lb.includes('2l') || lb.includes('soda');
  };
  const pushUnique = (arr: string[], value: string) => {
    const v = String(value || '').trim();
    if (!v) return;
    if (!arr.includes(v)) arr.push(v);
  };

  // --- 1. DIPPINGS ---
  // Source: Customizations + Selections + rawLines
  let dippingsLines: string[] = [];
  
  // Customizations
  inputCustomizations.forEach((c: any) => {
    const cat = String(c?.category || c?.groupTitle || '');
    if (!isDippingLike(cat, String(c?.groupId || ''), '')) return;
    const items = Array.isArray(c?.items) ? c.items : [];
    items.map(stromboliLabel).forEach((x: string) => {
      if (!x || stromboliIsNone(x) || stromboliIsArtifact(x)) return;
      pushUnique(dippingsLines, normalizeStromboliAdditionalName(x));
    });
  });
  inputSelections.forEach((s: any) => {
    const label = stromboliLabel(s);
    if (!label || stromboliIsNone(label) || stromboliIsArtifact(label)) return;
    if (!isDippingLike(s.groupTitle, s.groupId, label)) return;
    pushUnique(dippingsLines, normalizeStromboliAdditionalName(label));
  });
  rawLines.forEach((r) => {
    const label = stromboliLabel(r);
    const s = r.originalSel as any;
    if (!label || stromboliIsNone(label) || stromboliIsArtifact(label)) return;
    if (!isDippingLike(s?.groupTitle, s?.groupId, label)) return;
    pushUnique(dippingsLines, normalizeStromboliAdditionalName(label));
  });
  
  dippingsLines = Array.from(new Set(dippingsLines));

  // --- 1.5 EXTRA SAUCE ---
  // For Turnover / Calzone / Pepperoni Roll we must report as a dedicated section.
  let extraSauceLines: string[] = [];
  inputCustomizations.forEach((c: any) => {
    const cat = String(c?.category || c?.groupTitle || '');
    if (!isExtraSauceLike(cat, String(c?.groupId || ''), '')) return;
    const items = Array.isArray(c?.items) ? c.items : [];
    items.map(stromboliLabel).forEach((x: string) => {
      if (!x || stromboliIsNone(x) || stromboliIsArtifact(x)) return;
      pushUnique(extraSauceLines, normalizeStromboliAdditionalName(x));
    });
  });
  inputSelections.forEach((s: any) => {
    const label = stromboliLabel(s);
    if (!label || stromboliIsNone(label) || stromboliIsArtifact(label)) return;
    if (!isExtraSauceLike(s.groupTitle, s.groupId, label)) return;
    pushUnique(extraSauceLines, normalizeStromboliAdditionalName(label));
  });
  rawLines.forEach((r) => {
    const label = stromboliLabel(r);
    const s = r.originalSel as any;
    if (!label || stromboliIsNone(label) || stromboliIsArtifact(label)) return;
    if (!isExtraSauceLike(s?.groupTitle, s?.groupId, label)) return;
    pushUnique(extraSauceLines, normalizeStromboliAdditionalName(label));
  });
  extraSauceLines = Array.from(new Set(extraSauceLines));


  // --- 2. ADDITIONAL TOPPINGS ---
  // Source: Customizations (priority) -> Selections
  // Must handle "Extra (N)" logic
  
  let additionalRaw: string[] = [];

  // Customizations
  inputCustomizations.forEach((c: any) => {
    if (STROMBOLI_ADDITIONAL_TOPPINGS_RE.test(c.category || c.groupTitle || "") || (c.groupId || "").includes("additional_toppings")) {
      if (Array.isArray(c.items)) {
        additionalRaw.push(...c.items.map(stromboliLabel));
      }
    }
  });

  // Selections (merged, not just fallback, to catch things missing in cust like steppers)
  // Strictly Additional Toppings category
  inputSelections.forEach((s: any) => {
    const gt = s.groupTitle || "";
    const gid = s.groupId || "";
    // Exclude size
    if (stromboliIsSize(s)) return;
    // Exclude extra sauce (bucket 1.5)
    if (isExtraSauceLike(gt, gid, stromboliLabel(s))) return;
    // Exclude dipping (bucket 1)
    if (STROMBOLI_DIPPING_RE.test(gt) || gid.toLowerCase().includes("dipping")) return;

    if (STROMBOLI_ADDITIONAL_TOPPINGS_RE.test(gt) || gid.toLowerCase().includes("additional_toppings") || s.type === "extra_topping") {
      additionalRaw.push(stromboliLabel(s));
    }
  });
  rawLines.forEach((r) => {
    const s = r.originalSel as any;
    if (!s) return;
    const gt = String(s.groupTitle || "");
    const gid = String(s.groupId || "");
    if (isExtraSauceLike(gt, gid, r.text)) return;
    if (isDippingLike(gt, gid, r.text)) return;
    if (STROMBOLI_ADDITIONAL_TOPPINGS_RE.test(gt) || gid.toLowerCase().includes("additional_toppings") || s.type === "extra_topping") {
      additionalRaw.push(stromboliLabel(r));
    }
  });

  // Process Additional Toppings (Parse Qty, Consolidate)
  const toppingMap = new Map<string, { name: string; qty: number }>();
  
  additionalRaw.forEach(raw => {
    if (stromboliIsNone(raw) || stromboliIsArtifact(raw)) return;
    
    const parsed = parseStromboliQty(raw);
    const name = normalizeStromboliAdditionalName(parsed.name);
    const qty = parsed.qty;
    
    // Heuristic: if exact string match with a Dipping and qty is 1, ignore.
    if (qty === 1 && dippingsLines.includes(name)) {
        return;
    }

    const key = name.toLowerCase();
    
    if (toppingMap.has(key)) {
      toppingMap.get(key)!.qty += qty;
    } else {
      toppingMap.set(key, { name, qty });
    }
  });

  const additionalToppingsLines: string[] = [];
  toppingMap.forEach((val) => {
    if (val.qty > 1 && canUseStromboliQtySuffix(val.name)) {
      additionalToppingsLines.push(`${val.name} x${val.qty}`);
    } else {
      additionalToppingsLines.push(val.name);
    }
  });


  // --- 3. DESSERT ---
  let dessertLines: string[] = [];
  // Customizations
  inputCustomizations.forEach((c: any) => {
    if (/dessert/i.test(c.category || "")) {
      if (c.items) c.items.map(stromboliLabel).forEach((x: string) => {
        if (x && !stromboliIsArtifact(x)) pushUnique(dessertLines, x);
      });
    }
  });
  // Selections + rawLines fallback
  inputSelections.forEach((s: any) => {
    const label = stromboliLabel(s);
    if (!label || stromboliIsArtifact(label)) return;
    if (isDessertLike(s.type, s.groupTitle, s.groupId, label)) pushUnique(dessertLines, label);
  });
  rawLines.forEach((r) => {
    const s = r.originalSel as any;
    const label = stromboliLabel(r);
    if (!label || stromboliIsArtifact(label)) return;
    if (isDessertLike(s?.type, s?.groupTitle, s?.groupId, label)) pushUnique(dessertLines, label);
  });
  dessertLines = Array.from(new Set(dessertLines));


  // --- 4. BEVERAGE ---
  let beverageLines: string[] = [];
  // Customizations
  inputCustomizations.forEach((c: any) => {
    if (/beverage/i.test(c.category || "")) {
      if (c.items) c.items.map(stromboliLabel).forEach((x: string) => {
        if (x && !stromboliIsArtifact(x)) pushUnique(beverageLines, x);
      });
    }
  });
  // Selections + rawLines fallback
  inputSelections.forEach((s: any) => {
    const label = stromboliLabel(s);
    if (!label || stromboliIsArtifact(label)) return;
    if (isBeverageLike(s.type, s.groupTitle, s.groupId, label)) pushUnique(beverageLines, label);
  });
  rawLines.forEach((r) => {
    const s = r.originalSel as any;
    const label = stromboliLabel(r);
    if (!label || stromboliIsArtifact(label)) return;
    if (isBeverageLike(s?.type, s?.groupTitle, s?.groupId, label)) pushUnique(beverageLines, label);
  });
  beverageLines = Array.from(new Set(beverageLines));


  // --- FINAL ASSEMBLY ---
  const finalLines = isTurnoverCalzonePepperoniRoll
    ? [
        ...additionalToppingsLines,
        ...extraSauceLines,
        ...dessertLines,
        ...beverageLines
      ]
    : [
        ...dippingsLines,
        ...additionalToppingsLines,
        ...dessertLines,
        ...beverageLines
      ];

  console.log("[STROMBOLI_REPORT_DEBUG]", { 
    isTurnoverCalzonePepperoniRoll,
    inputSelections: inputSelections.map((s: any) => s.label), 
    inputCustomizations, 
    dippingsLines, 
    extraSauceLines,
    additionalToppingsLines, 
    dessertLines, 
    beverageLines, 
    finalLines 
  });

  return finalLines;
};

const buildCheesesteakLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
    const withOnTheSidePrefix = (value: string) => {
      const text = String(value || '').trim();
      if (!text) return text;
      if (/^on the side\b/i.test(text)) return text;
      return `On The Side ${text}`;
    };

    // Strict section order required by business rules.
    const strictOrder = [
      'Toast Option',
      'Cheese',
      'On The Side Toppings',
      'Toppings',
      'Extra Toppings',
      'Lite Toppings',
      'No Toppings',
      'Side Toppings',
      'Would You Like To Add Extra Sides',
      'Dessert',
      'Beverages',
    ] as const;

    const strictBuckets: Record<(typeof strictOrder)[number], string[]> = {
      'Toast Option': [],
      'Cheese': [],
      'On The Side Toppings': [],
      'Toppings': [],
      'Extra Toppings': [],
      'Lite Toppings': [],
      'No Toppings': [],
      'Side Toppings': [],
      'Would You Like To Add Extra Sides': [],
      'Dessert': [],
      'Beverages': [],
    };

    const pushUniqueStrict = (section: (typeof strictOrder)[number], value: string) => {
      const raw = (value || '').trim();
      const text = section === 'On The Side Toppings' ? withOnTheSidePrefix(raw) : raw;
      if (!text) return;
      if (!strictBuckets[section].includes(text)) strictBuckets[section].push(text);
    };

    const resolveStrictSection = (
      groupTitle?: string,
      type?: string,
      id?: string,
      groupId?: string,
      label?: string
    ): (typeof strictOrder)[number] | null => {
      const g = String(groupTitle || '').toLowerCase().trim();
      const t = String(type || '').toLowerCase().trim();
      const sid = String(id || '').toLowerCase().trim();
      const gid = String(groupId || '').toLowerCase().trim();
      const l = String(label || '').toLowerCase().trim();

      if (g.includes('toast option')) return 'Toast Option';
      if (g === 'cheese' || g.includes('cheese') || t === 'cheese') return 'Cheese';
      if (
        sid.startsWith('cs-side-req') ||
        gid.includes('cheesesteak_on_the_side_toppings') ||
        gid.includes('cheesesteak_side_toppings_required')
      ) return 'On The Side Toppings';
      if (g === 'on the side toppings' || g.includes('on the side toppings')) return 'On The Side Toppings';
      if (g === 'toppings' || g.includes('add toppings')) return 'Toppings';
      if (g === 'extra toppings' || g.includes('extra toppings') || (t === 'extra_topping' && g.includes('extra'))) return 'Extra Toppings';
      if (g === 'lite toppings' || g.includes('lite toppings')) return 'Lite Toppings';
      if (g === 'no toppings' || g.includes('no toppings') || t === 'no_topping') return 'No Toppings';
      if (g === 'side toppings' || g.includes('side toppings')) return 'Side Toppings';
      if (g === 'would you like to add extra sides' || g.includes('add extra sides')) return 'Would You Like To Add Extra Sides';
      if (g === 'dessert' || g === 'desserts' || t === 'dessert') return 'Dessert';
      if (g === 'beverage' || g === 'beverages' || t === 'beverage') return 'Beverages';
      return null;
    };

    // Priority: selections (already sanitized for cheesesteaks in ProductDetailPage).
    if (item.selections && item.selections.length > 0) {
      item.selections.forEach((sel: any) => {
        const section = resolveStrictSection(sel.groupTitle, sel.type, sel.id, sel.groupId, sel.label || sel.displayName || sel.name);
        if (!section) return;
        pushUniqueStrict(section, String(sel.label || sel.displayName || sel.name || '').trim());
      });
    }

    // Fallback: customizations if something is missing.
    if (item.customizations && item.customizations.length > 0) {
      item.customizations.forEach((c: any) => {
        const items = Array.isArray(c.items) ? c.items : [];
        items.forEach((v: any) => {
          const text = String(v || '').trim();
          if (!text) return;
          const section = resolveStrictSection(c.category, undefined, undefined, c.groupId, text);
          if (!section) return;
          pushUniqueStrict(section, text);
        });
      });
    }

    const strictLines = strictOrder.flatMap((section) => strictBuckets[section]);
    if (strictLines.length > 0) {
      if (debugCart) {
        console.log('[CHEESESTEAK_STRICT_ORDER_DEBUG]', { strictBuckets, strictLines });
      }
      return strictLines;
    }

    // Buckets with Strict Order
    const buckets = {
        TOAST: [] as string[],
        CHEESE: [] as string[],
        ON_THE_SIDE_TOPPINGS: [] as string[],
        TOPPINGS: [] as string[],
        EXTRA_TOPPINGS: [] as string[],
        LITE_TOPPINGS: [] as string[],
        NO_TOPPINGS: [] as string[],
        SIDE_TOPPINGS: [] as string[],
        EXTRA_SIDES: [] as string[],
        DESSERT: [] as string[],
        BEVERAGE: [] as string[]
    };

    // Helper: Clean ID-like strings
    const isIdLike = (txt: string) => /^[a-z0-9_]+$/.test(txt) && txt.includes('_');
    
    // Helper: Get Display Text
    const getDisplayText = (sel?: CartSelection, fallbackText?: string): string => {
        if (sel) {
             if (sel.label && !isIdLike(sel.label)) return sel.label;
             if (sel.displayName && !isIdLike(sel.displayName)) return sel.displayName;
             if (sel.name && !isIdLike(sel.name)) return sel.name;
        }
        return fallbackText || "";
    };

    // Candidate collection for Cheese logic
    const cheeseCandidates: { text: string, isRequired: boolean }[] = [];

    const resolveCheesesteakBucket = (cat: string, grp: string, typ: string, text: string, id?: string): keyof typeof buckets | 'CHEESE_CANDIDATE' | null => {
        const c = (cat || "").toLowerCase().trim();
        const g = (grp || "").toLowerCase().trim();
        const type = (typ || "").toLowerCase().trim();
        const t = (text || "").toLowerCase().trim();
        const sid = String(id || '').toLowerCase().trim();

        if (!t) return null;
        if (type === 'size' || c.includes('size') || g.includes('size')) return null;

        if (c.includes('toast option') || g.includes('toast_option') || g.includes('toast option')) return 'TOAST';
        if (type === 'cheese' || c === 'cheese' || g === 'cheese') return 'CHEESE_CANDIDATE';
        if (
          sid.startsWith('cs-side-req') ||
          g.includes('cheesesteak_on_the_side_toppings') ||
          g.includes('cheesesteak_side_toppings_required')
        ) return 'ON_THE_SIDE_TOPPINGS';
        if (c === 'on the side toppings' || g.includes('on the side toppings')) return 'ON_THE_SIDE_TOPPINGS';
        if (c === 'toppings' || g === 'toppings' || g === 'create_cheesesteak' || (type === 'topping' && !g.includes('lite') && !g.includes('no') && !g.includes('side') && !g.includes('extra'))) return 'TOPPINGS';
        if (c === 'extra toppings' || g === 'extra_toppings' || (type === 'extra_topping' && (g.includes('extra_toppings') || c.includes('extra toppings')))) return 'EXTRA_TOPPINGS';
        if (c === 'lite toppings' || g === 'lite_toppings') return 'LITE_TOPPINGS';
        if (c === 'no toppings' || g.includes('cheesesteak_no') || g.includes('_no') || type === 'no_topping' || t.startsWith('no ')) return 'NO_TOPPINGS';
        if (c === 'side toppings' || g.includes('side_toppings') || g === 'sides' || (type === 'side' && !c.includes('extra sides') && !g.includes('extra_sides'))) return 'SIDE_TOPPINGS';
        if (c === 'would you like to add extra sides' || g.includes('extra_sides')) return 'EXTRA_SIDES';
        if (c === 'dessert' || c === 'desserts' || type === 'dessert') return 'DESSERT';
        if (c === 'beverage' || c === 'beverages' || type === 'beverage') return 'BEVERAGE';

        return null;
    };

    // Helper: Add to Bucket
    const addToBucket = (rawText: string, cat: string, grp: string, typ: string, sel?: CartSelection, rawId?: string) => {
        const t = rawText.trim();
        if (!t) return;

        const resolved = resolveCheesesteakBucket(cat, grp, typ, t, rawId || sel?.id);
        if (!resolved) return;

        if (resolved === 'CHEESE_CANDIDATE') {
            const isRequired = sel?.type === 'required_option' || false;
            cheeseCandidates.push({ text: t, isRequired });
            return;
        }

        if (resolved === 'ON_THE_SIDE_TOPPINGS') {
            buckets[resolved].push(withOnTheSidePrefix(t));
            return;
        }
        buckets[resolved].push(t);
    };

    // PROCESS INPUTS
    
    // 1. Customizations (Source of Truth)
    if (item.customizations) {
        item.customizations.forEach(c => {
             const cat = String(c.category || c.groupTitle || "");
             const items = c.items || c.options || c.value || c.selections;
             
             if (Array.isArray(items)) {
                 items.forEach((val: any) => {
                     const txt = typeof val === 'string' ? val : (val.label || val.text || val.name || "");
                     addToBucket(txt, cat, String((c as any)?.groupId || ''), "", undefined);
                 });
             } else if (typeof c === 'string') {
                 addToBucket(c, "", "", "", undefined);
             } else if (typeof c === 'object' && c !== null) {
                 const txt = c.label || c.text || c.name || "";
                 addToBucket(txt, cat, String((c as any)?.groupId || ''), "", undefined, String((c as any)?.id || ''));
             }
        });
    }

    // 2. Selections (Fallback & Supplement)
    rawLines.forEach(line => {
        const sel = line.originalSel;
        const txt = getDisplayText(sel, line.text);
        if (!txt) return;
        if (isIdLike(txt)) return;
        
        // Skip if this exact text is already in any bucket (from Customizations)
        // Note: Cheese candidates are not in buckets yet, so they won't be skipped here, which is fine/good.
        const alreadyExists = Object.values(buckets).some(arr => arr.includes(txt));
        if (alreadyExists) return;

        addToBucket(txt, sel?.groupTitle || "", sel?.groupId || "", sel?.type || "", sel, sel?.id);
    });

    // POST-PROCESS CHEESE
    // Rule: "Elegir SOLO 1 queso final". Prioritize required.
    if (cheeseCandidates.length > 0) {
        // Find if there is a required one
        const required = cheeseCandidates.find(c => c.isRequired);
        if (required) {
            buckets.CHEESE.push(required.text);
        } else {
            // Pick the first unique one
            // Or prioritize known cheeses?
            // Just picking the first one is usually safe for "Single choice" logic.
            buckets.CHEESE.push(cheeseCandidates[0].text);
        }
    }

    // DEDUPE & CONSOLIDATE
    const unique = (arr: string[]) => Array.from(new Set(arr));
    
    // Consolidate function (add xN if duplicates found, except for buckets that shouldn't)
    const consolidate = (arr: string[], allowXN: boolean) => {
        if (!allowXN) return unique(arr);
        
        const counts: Record<string, number> = {};
        const order: string[] = [];
        
        arr.forEach(name => {
            if (!counts[name]) {
                counts[name] = 0;
                order.push(name);
            }
            counts[name]++;
        });
        
        return order.map(name => {
            const count = counts[name];
            return count > 1 ? `${name} x${count}` : name;
        });
    };

    // Apply consolidation
    buckets.TOAST = consolidate(buckets.TOAST, false); // Usually single
    buckets.CHEESE = unique(buckets.CHEESE); // STRICT unique, no xN
    buckets.ON_THE_SIDE_TOPPINGS = consolidate(buckets.ON_THE_SIDE_TOPPINGS, true);
    buckets.TOPPINGS = consolidate(buckets.TOPPINGS, true);
    buckets.EXTRA_TOPPINGS = consolidate(buckets.EXTRA_TOPPINGS, true);
    buckets.LITE_TOPPINGS = consolidate(buckets.LITE_TOPPINGS, false); // Lite usually single
    buckets.NO_TOPPINGS = consolidate(buckets.NO_TOPPINGS, false); // No usually single
    buckets.SIDE_TOPPINGS = consolidate(buckets.SIDE_TOPPINGS, true);
    buckets.EXTRA_SIDES = consolidate(buckets.EXTRA_SIDES, true);
    buckets.DESSERT = consolidate(buckets.DESSERT, true);
    buckets.BEVERAGE = consolidate(buckets.BEVERAGE, true);

    // Final Order
    const finalLines = [
        ...buckets.TOAST,
        ...buckets.CHEESE,
        ...buckets.ON_THE_SIDE_TOPPINGS,
        ...buckets.TOPPINGS,
        ...buckets.EXTRA_TOPPINGS,
        ...buckets.LITE_TOPPINGS,
        ...buckets.NO_TOPPINGS,
        ...buckets.SIDE_TOPPINGS,
        ...buckets.EXTRA_SIDES,
        ...buckets.DESSERT,
        ...buckets.BEVERAGE
    ];

    if (debugCart) {
        console.log('[CHEESESTEAK_REPORT_DEBUG]', {
            inputSelections: rawLines.map(l => l.text),
            inputCustomizations: item.customizations,
            buckets,
            finalLines
        });
    }

    return finalLines;
};

const isMinucciItem = (item: CartItem): boolean => {
    const cat = (item.category || '').toLowerCase();
    const pid = String(item.productId || item.id || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
    const isCyoMinucci = cat === 'pizzas' && pid === 'cyo-minucci';
    const isMinucci = !isCyoMinucci && (cat === 'minucci-pizzas' || pid.startsWith('minucci-') || (cat.includes('minucci') && name.includes('minucci')));
    if (debugCart && isMinucci) {
         console.log(`[MINUCCI DEBUG] Match found. cat=${cat} pid=${pid} name=${name}`);
    }
    return isMinucci;
};

const buildMinucciLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number): string[] => {
    const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
    
    // --- SIZE LINE FILTERING (Minucci) ---
    const initialLen = rawLines.length;
    rawLines = rawLines.filter(line => {
         const txt = line.text;
         if (/^(Small|Medium|Large|Jumbo|Personal)\b/i.test(txt)) return false;
         if (/\d+"\s+(Small|Medium|Large|Jumbo)/i.test(txt)) return false;
         if (txt.includes('16"') || txt.includes('14"') || txt.includes('12"')) return false;
         if (line.originalSel?.type === 'size') return false;
         return true;
    });
    if (debugCart && rawLines.length !== initialLen) {
         console.log('[CART_SIZE_LINE_FILTER] Minucci filtered:', { removed: initialLen - rawLines.length });
    }
    // -------------------------------------

    if (debugCart) {
        console.log('[MINUCCI DEBUG] item:', item.productId, item.name, item.category);
        console.log('[MINUCCI DEBUG] rawLines:', rawLines.map(l => ({
            text: l.text,
            type: l.originalSel?.type,
            groupId: l.originalSel?.groupId,
            groupTitle: l.originalSel?.groupTitle,
            label: l.originalSel?.label
        })));
        console.log('[MINUCCI DEBUG] customizations:', item.customizations?.map(c => ({category: c.category, items: c.items})));
    }

    type MinucciBucket = 'SPECIAL_INSTRUCTIONS' | 'NO_TOPPINGS' | 'DIPPINGS' | 'DESSERT' | 'BEVERAGES' | 'OTHER' | 'IGNORE';
    
    const buckets: Record<Exclude<MinucciBucket, 'IGNORE'>, string[]> = {
        'SPECIAL_INSTRUCTIONS': [],
        'NO_TOPPINGS': [],
        'DIPPINGS': [],
        'DESSERT': [],
        'BEVERAGES': [],
        'OTHER': []
    };

    const getMinucciBucket = (sel: CartSelection | undefined, text: string): MinucciBucket => {
        if (!sel) return 'OTHER';
        const type = (sel.type || '').toLowerCase();
        const groupTitle = (sel.groupTitle || '').toLowerCase();
        const lowerText = text.toLowerCase();

        // 1. Explicit ignore rules for Minucci:
        // report everything except Sauce/Size and known invalid artifact "American".
        if (lowerText === 'american') return 'IGNORE';
        if (type === 'required_option' || type === 'size' || groupTitle.includes('size')) return 'IGNORE';
        if ((groupTitle === 'sauce' || lowerText.includes('sauce')) &&
            !(groupTitle.includes('dipping') || lowerText.includes('ranch') || lowerText.includes('bleu cheese'))) {
            return 'IGNORE';
        }

        // 2. Bucket Matching
        if (type === 'special_instruction') return 'SPECIAL_INSTRUCTIONS';
        if (lowerText.includes('no toppings') || groupTitle.includes('no toppings')) return 'NO_TOPPINGS';
        if (type === 'dessert' || groupTitle.includes('dessert')) return 'DESSERT';
        if (type === 'beverage' || groupTitle.includes('beverage')) return 'BEVERAGES';
        if (groupTitle.includes('dippings') || lowerText.includes('ranch') || lowerText.includes('bleu cheese') || lowerText.includes('sauce')) {
             return 'DIPPINGS';
        }
        
        // Everything else is reportable for Minucci.
        return 'OTHER';
    };

    // Helper for consolidating items with quantities
    const consolidateItems = (lines: string[]): string[] => {
        const counts: Record<string, number> = {};
        const order: string[] = [];
        
        lines.forEach(l => {
             let base = l;
             let qty = 1;
             const match = l.match(/^(.*?)\s+x(\d+)\s*$/i);
             if (match) {
                 base = match[1].trim();
                 qty = parseInt(match[2], 10);
             } else {
                 base = l.trim();
             }
             if (!counts[base]) {
                 counts[base] = 0;
                 order.push(base);
             }
             counts[base] += qty;
        });
        
        return order.map(base => {
            const count = counts[base];
            return count > 1 ? `${base} x${count}` : base;
        });
    };

    // For non-dipping buckets, remove accidental xN and dedupe by label.
    const dedupeNoQty = (lines: string[]): string[] => {
        const seen = new Set<string>();
        const out: string[] = [];
        lines.forEach((raw) => {
            const clean = String(raw || '')
                .replace(/\s+x\d+\s*$/i, '')
                .replace(/\s+/g, ' ')
                .trim();
            if (!clean) return;
            const k = clean.toLowerCase();
            if (seen.has(k)) return;
            seen.add(k);
            out.push(clean);
        });
        return out;
    };

    // Extract from customizations with quantity logic
    const extractFromCustomizations = (categoryKeyword: string): string[] => {
        if (!item.customizations) return [];
        const block = item.customizations.find(c => c.category && c.category.toLowerCase().includes(categoryKeyword));
        if (block && block.items && Array.isArray(block.items)) {
             return consolidateItems(block.items);
        }
        return [];
    };

    const customizationDips = extractFromCustomizations('dipping');
    const customizationDesserts = extractFromCustomizations('dessert');
    const customizationBeverages = extractFromCustomizations('beverage');

    rawLines.forEach(line => {
        const bucket = getMinucciBucket(line.originalSel, line.text);
        if (bucket === 'IGNORE') return;
        
        // Skip if source of truth is customizations
        if (customizationDips.length > 0 && bucket === 'DIPPINGS') return;
        if (customizationDesserts.length > 0 && bucket === 'DESSERT') return;
        if (customizationBeverages.length > 0 && bucket === 'BEVERAGES') return;
        
        buckets[bucket].push(line.text);
    });

    if (customizationDips.length > 0) buckets['DIPPINGS'] = customizationDips;
    else buckets['DIPPINGS'] = consolidateItems(buckets['DIPPINGS']);

    if (customizationDesserts.length > 0) buckets['DESSERT'] = customizationDesserts;
    else buckets['DESSERT'] = consolidateItems(buckets['DESSERT']);

    if (customizationBeverages.length > 0) buckets['BEVERAGES'] = customizationBeverages;
    else buckets['BEVERAGES'] = consolidateItems(buckets['BEVERAGES']);

    buckets['SPECIAL_INSTRUCTIONS'] = dedupeNoQty(buckets['SPECIAL_INSTRUCTIONS']);
    buckets['NO_TOPPINGS'] = dedupeNoQty(buckets['NO_TOPPINGS']);
    buckets['OTHER'] = dedupeNoQty(buckets['OTHER']);

    if (debugCart) {
        console.log('[MINUCCI DEBUG] Buckets:', buckets);
    }

    // Minucci order + report all non-sauce selections.
    const finalOrder = [
        ...buckets['SPECIAL_INSTRUCTIONS'],
        ...buckets['NO_TOPPINGS'],
        ...buckets['OTHER'],
        ...buckets['DIPPINGS'],
        ...buckets['DESSERT'],
        ...buckets['BEVERAGES']
    ];
    
    // UI MARKER REMOVED per requirements
    // if (debugCart) {
    //     finalOrder.unshift('__MINUCCI_ORDER_ACTIVE__');
    // }

    return finalOrder;
};

const BUCKET_ORDER: Record<string, Bucket[]> = {
  'CYO_PIZZA': [
    'SAUCE', 'ADDITIONAL_TOPPINGS', 'SPECIALTY_1ST_HALF', 'SPECIALTY_2ND_HALF', 
    'SPECIAL_INSTRUCTIONS', 'DIPPINGS', 'DESSERT', 'BEVERAGES'
  ],
  'MINUCCI': [
    'SPECIAL_INSTRUCTIONS', 'NO_TOPPINGS', 'DIPPINGS', 'DESSERT', 'BEVERAGES'
  ],
  'SPECIALTY_PIZZA': [
    'SAUCE', 'ADDITIONAL_TOPPINGS', 'SPECIAL_INSTRUCTIONS', 'NO_TOPPINGS', 'DIPPINGS', 'DESSERT', 'BEVERAGES'
  ],
  'BROOKLYN': [
    'ADDITIONAL_TOPPINGS', 'SPECIAL_INSTRUCTIONS', 'NO_TOPPINGS', 'DIPPINGS', 'DESSERT', 'BEVERAGES'
  ],
  'STROMBOLI': [
    'CHOOSE_DIPPING_SAUCE', 'ADDITIONAL_TOPPINGS', 'DESSERT', 'BEVERAGES'
  ]
};

const isSeafoodAppetizer = (item: CartItem) => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    return (
      cat.includes('seafood-appetizer') ||
      (cat === 'appetizers' && (name.includes('calamari') || name.includes('mussels') || name.includes('shrimp')))
    );
};

type Bucket = 'SIZE' | 'SAUCE' | 'ADDITIONAL_TOPPINGS' | 'SPECIALTY_1ST_HALF' | 'SPECIALTY_2ND_HALF' | 'SPECIAL_INSTRUCTIONS' | 'NO_TOPPINGS' | 'DIPPINGS' | 'DESSERT' | 'BEVERAGES' | 'CHOOSE_DIPPING_SAUCE' | 'OTHER';
type CartProfile = 'CYO_PIZZA' | 'MINUCCI' | 'SPECIALTY_PIZZA' | 'BROOKLYN' | 'STROMBOLI';

const getCartProfile = (item: CartItem): CartProfile | null => {
    const cat = (item.category || '').toUpperCase();
    const pid = (item.productId || '').toUpperCase();
    if (cat.includes('CYO') || pid.startsWith('CYO')) return 'CYO_PIZZA';
    if (cat.includes('MINUCCI') || pid.includes('MINUCCI')) return 'MINUCCI';
    if (cat.includes('SPECIALTY') || cat === 'SPECIALTY-PIZZA') return 'SPECIALTY_PIZZA';
    if (cat.includes('BROOKLYN')) return 'BROOKLYN';
    if (cat.includes('STROMBOLI')) return 'STROMBOLI';
    return null;
};

const getSelectionBucket = (item: CartItem, sel: CartSelection): Bucket => {
    const group = (sel.groupTitle || '').toUpperCase();
    const groupId = (sel.groupId || '').toUpperCase();
    const type = (sel.type || '').toUpperCase();
    const label = (sel.label || '').toUpperCase();

    if (type === 'REQUIRED_OPTION') {
      if (group.includes('SIZE') || /\b(SMALL|MEDIUM|LARGE|JUMBO|PERSONAL)\b/.test(label) || /\d+\s*"/.test(label)) {
        return 'SIZE';
      }
      if (group.includes('CHOOSE DIPPING') || groupId.includes('DIPPING')) return 'CHOOSE_DIPPING_SAUCE';
      return 'OTHER';
    }

    if (group.includes('SIZE') || type === 'SIZE') return 'SIZE';

    if (group.includes('CHOOSE DIPPING') || groupId.includes('DIPPING')) return 'CHOOSE_DIPPING_SAUCE';
    if (group.includes('DIPPING') || groupId.includes('PIZZA_DIPPING')) return 'DIPPINGS';

    if (groupId.includes('SPECIALTY_SECOND')) return 'SPECIALTY_2ND_HALF';
    if (group.includes('SPECIALTY TOPPINGS 2ND HALF') || group.includes('2ND HALF') || group.includes('SECOND HALF')) return 'SPECIALTY_2ND_HALF';
    if (group.includes('SPECIALTY TOPPINGS 1ST HALF') || group.includes('1ST HALF') || group.includes('FIRST HALF')) return 'SPECIALTY_1ST_HALF';
    if (groupId.includes('SPECIALTY_TOPPINGS') || groupId === 'SPECIALTY' || group.includes('SPECIALTY TOPPINGS')) return 'SPECIALTY_1ST_HALF';
    if (group.includes('HALF TOPPINGS') && (label.includes('LEFT') || label.includes('1ST HALF'))) return 'SPECIALTY_1ST_HALF';
    if (group.includes('HALF TOPPINGS') && (label.includes('RIGHT') || label.includes('2ND HALF'))) return 'SPECIALTY_2ND_HALF';

    if (group.includes('NO TOPPING') || type === 'NO_TOPPING') return 'NO_TOPPINGS';
    if (group.includes('INSTRUCTION') || type === 'SPECIAL_INSTRUCTION') return 'SPECIAL_INSTRUCTIONS';
    if (group.includes('SAUCE') || type === 'SAUCE') return 'SAUCE';
    if (group.includes('TOPPING') || type === 'TOPPING' || type === 'EXTRA_TOPPING') return 'ADDITIONAL_TOPPINGS';
    if (group.includes('DESSERT') || type === 'DESSERT') return 'DESSERT';
    if (group.includes('BEVERAGE') || type === 'BEVERAGE') return 'BEVERAGES';
    return 'OTHER';
};

const buildStructuredProfileDisplayLines = (item: CartItem, rawLines: { text: string; originalSel?: CartSelection }[], itemQty: number, profile: CartProfile): string[] => {
  const buckets: Record<Bucket, string[]> = {
    'SIZE': [],
    'SAUCE': [],
    'ADDITIONAL_TOPPINGS': [],
    'SPECIALTY_1ST_HALF': [],
    'SPECIALTY_2ND_HALF': [],
    'SPECIAL_INSTRUCTIONS': [],
    'NO_TOPPINGS': [],
    'DIPPINGS': [],
    'DESSERT': [],
    'BEVERAGES': [],
    'CHOOSE_DIPPING_SAUCE': [],
    'OTHER': []
  };

  const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
  const itemId = String(item.productId || item.id || '').toLowerCase();
  const suppressSauceForItem = ['cyo-gf12', 'cyo-cauliflower', 'cyo-minucci'].includes(itemId);
  const allowSpecialtySauceIds = new Set(['sp-10', 'sp-12', 'sp-15']);
  const isSpecialtyPizza = String(item.category || '').toLowerCase() === 'specialty-pizza';
  const normalizeLabel = (input: string): string => {
    const text = String(input || '').trim();
    if (!text) return '';
    if (/^white pizza$/i.test(text) || /^white pizza\s*\((left|right)\)$/i.test(text)) {
      return 'White Sauce';
    }
    if (/^left half white pizza$/i.test(text)) return 'Left Half White Sauce';
    if (/^right half white pizza$/i.test(text)) return 'Right Half White Sauce';
    return text;
  };

  const normalizeSpecialtyLabel = (input: string): string =>
    String(input || '')
      .replace(/\s*\((left|right)\)\s*/i, ' ')
      .replace(/\s+x\d+(?=\s+(1ST|2ND)\s+HALF$|$)/i, '')
      .replace(/\s+(1ST|2ND)\s+HALF$/i, '')
      .replace(/\s+/g, ' ')
      .trim();

  rawLines.forEach(line => {
    if (!line.originalSel) {
       buckets['OTHER'].push(line.text);
       return;
    }

    const bucket = getSelectionBucket(item, line.originalSel);
    let text = normalizeLabel(line.text);

    if (bucket === 'SPECIALTY_1ST_HALF') {
        text = `${normalizeSpecialtyLabel(text)} 1ST HALF`;
    } else if (bucket === 'SPECIALTY_2ND_HALF') {
        text = `${normalizeSpecialtyLabel(text)} 2ND HALF`;
    }

    buckets[bucket].push(text);
  });

  // Merge customizations as additional source of truth (especially useful for xN quantities).
  (item.customizations || []).forEach((cust: any) => {
    const category = String(cust?.category || '').toUpperCase();
    const items = Array.isArray(cust?.items) ? cust.items : [];
    if (!category || items.length === 0) return;

    let target: Bucket | null = null;
    if (category.includes('CHOOSE DIPPING')) target = 'CHOOSE_DIPPING_SAUCE';
    else if (category.includes('DIPPING')) target = 'DIPPINGS';
    else if (category.includes('SPECIALTY') && (category.includes('2ND') || category.includes('SECOND'))) target = 'SPECIALTY_2ND_HALF';
    else if (category.includes('SPECIALTY') && category.includes('1ST')) target = 'SPECIALTY_1ST_HALF';
    else if (category.includes('SPECIALTY')) target = 'SPECIALTY_1ST_HALF';
    else if (category.includes('NO TOPPINGS')) target = 'NO_TOPPINGS';
    else if (category.includes('SPECIAL INSTRUCTIONS')) target = 'SPECIAL_INSTRUCTIONS';
    else if (category.includes('SAUCE')) target = 'SAUCE';
    else if (category.includes('TOPPINGS') || category.includes('ADDITIONAL')) target = 'ADDITIONAL_TOPPINGS';
    else if (category.includes('DESSERT')) target = 'DESSERT';
    else if (category.includes('BEVERAGE')) target = 'BEVERAGES';

    if (!target) return;

    items.forEach((raw: any) => {
      let text = normalizeLabel(String(raw || ''));
      if (!text) return;
      let itemTarget = target;
      if (itemTarget === 'SPECIALTY_1ST_HALF' || itemTarget === 'SPECIALTY_2ND_HALF') {
        if (/\b2ND HALF\b/i.test(text) || /\(RIGHT\)/i.test(text)) itemTarget = 'SPECIALTY_2ND_HALF';
        else if (/\b1ST HALF\b/i.test(text) || /\(LEFT\)/i.test(text)) itemTarget = 'SPECIALTY_1ST_HALF';
      }
      if (itemTarget === 'SPECIALTY_1ST_HALF') text = `${normalizeSpecialtyLabel(text)} 1ST HALF`;
      if (itemTarget === 'SPECIALTY_2ND_HALF') text = `${normalizeSpecialtyLabel(text)} 2ND HALF`;
      buckets[itemTarget].push(text);
    });
  });

  // Consolidate Items
  const consolidateItems = (lines: string[]): string[] => {
      const counts: Record<string, number> = {};
      const order: string[] = []; 
      
      lines.forEach(l => {
          let base = l;
          let qty = 1;
          const match = l.match(/^(.*?) x(\d+)$/);
          if (match) {
             base = match[1];
             qty = parseInt(match[2], 10);
          }
          
          if (!counts[base]) {
              counts[base] = 0;
              order.push(base);
          }
          counts[base] += qty;
      });
      
      return order.map(base => {
          const count = counts[base];
          if (count > 1) return `${base} x${count}`;
          return base;
      });
  };

  // For non-quantity buckets, keep single instance and strip accidental "xN" artifacts
  // caused by dual sources (selections + customizations).
  const dedupeNoQty = (lines: string[]): string[] => {
      const seen = new Set<string>();
      const out: string[] = [];
      lines.forEach((raw) => {
          const clean = normalizeLabel(String(raw || ''))
            .replace(/\s+x\d+(?=\s+(1ST|2ND)\s+HALF$|$)/i, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (!clean) return;
          const k = clean.toLowerCase();
          if (seen.has(k)) return;
          seen.add(k);
          out.push(clean);
      });
      return out;
  };

  // NEW LOGIC: Extract from Customizations (Source of Truth for Quantities)
  const extractFromCustomizations = (keyword: string): string[] => {
      if (!item.customizations) return [];
      const block = item.customizations.find(c => 
          c.category === `Add ${keyword}` || 
          c.category === keyword ||
          (c.category && c.category.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      if (!block || !block.items || !Array.isArray(block.items)) return [];

      // Re-consolidate items from customizations just in case
      const counts: Record<string, number> = {};
      const order: string[] = [];

      block.items.forEach((line: string) => {
          let base = line;
          let qty = 1;
          const match = line.match(/^(.*?)\s+x(\d+)\s*$/i);
          if (match) {
             base = match[1].trim();
             qty = parseInt(match[2], 10);
          } else {
             base = line.trim();
          }
          
          if (!counts[base]) {
              counts[base] = 0;
              order.push(base);
          }
          counts[base] += qty;
      });

      return order.map(base => {
          const count = counts[base];
          if (count > 1) return `${base} x${count}`;
          return base;
      });
  };

  // Apply to DIPPINGS
  const customizationDips = extractFromCustomizations('Dippings');
  if (customizationDips.length > 0) buckets['DIPPINGS'] = customizationDips;
  else buckets['DIPPINGS'] = consolidateItems(buckets['DIPPINGS']);

  const customizationChooseDip = extractFromCustomizations('Choose Dipping');
  if (customizationChooseDip.length > 0) buckets['CHOOSE_DIPPING_SAUCE'] = customizationChooseDip;
  else buckets['CHOOSE_DIPPING_SAUCE'] = consolidateItems(buckets['CHOOSE_DIPPING_SAUCE']);

  // Apply to DESSERT
  const customizationDesserts = extractFromCustomizations('Desserts');
  if (customizationDesserts.length > 0) buckets['DESSERT'] = customizationDesserts;
  else buckets['DESSERT'] = consolidateItems(buckets['DESSERT']);

  // Apply to BEVERAGES
  const customizationBevs = extractFromCustomizations('Beverages');
  if (customizationBevs.length > 0) buckets['BEVERAGES'] = customizationBevs;
  else buckets['BEVERAGES'] = consolidateItems(buckets['BEVERAGES']);

  buckets['SAUCE'] = dedupeNoQty(buckets['SAUCE']);
  buckets['ADDITIONAL_TOPPINGS'] = dedupeNoQty(buckets['ADDITIONAL_TOPPINGS']);
  buckets['SPECIALTY_1ST_HALF'] = dedupeNoQty(buckets['SPECIALTY_1ST_HALF']);
  buckets['SPECIALTY_2ND_HALF'] = dedupeNoQty(buckets['SPECIALTY_2ND_HALF']);
  buckets['SPECIAL_INSTRUCTIONS'] = dedupeNoQty(buckets['SPECIAL_INSTRUCTIONS']);
  buckets['NO_TOPPINGS'] = dedupeNoQty(buckets['NO_TOPPINGS']);

  // For Specialty Pizza, enforce a single toppings block order:
  // Sauce -> Additional Toppings -> Special Instructions -> No Toppings -> Dippings -> Dessert -> Beverages
  // Any legacy "specialty half" entries are folded into Additional Toppings.
  if (profile === 'SPECIALTY_PIZZA') {
    buckets['ADDITIONAL_TOPPINGS'] = dedupeNoQty([
      ...buckets['ADDITIONAL_TOPPINGS'],
      ...buckets['SPECIALTY_1ST_HALF'].map((x) => String(x || '').replace(/\s+1ST HALF$/i, '').trim()),
      ...buckets['SPECIALTY_2ND_HALF'].map((x) => String(x || '').replace(/\s+2ND HALF$/i, '').trim()),
    ]);
    buckets['SPECIALTY_1ST_HALF'] = [];
    buckets['SPECIALTY_2ND_HALF'] = [];
  }

  // Brooklyn does not expose specialty-half sections in cart order.
  // Keep left/right intent but fold those lines into Additional Toppings.
  if (profile === 'BROOKLYN') {
    const normalizeBrooklynHalf = (value: string, side: 'Left' | 'Right') =>
      `${normalizeSpecialtyLabel(String(value || '').replace(/\s+(1ST|2ND)\s+HALF$/i, '').trim())} (${side})`.trim();

    const fromFirstHalf = buckets['SPECIALTY_1ST_HALF'].map((x) => normalizeBrooklynHalf(x, 'Left'));
    const fromSecondHalf = buckets['SPECIALTY_2ND_HALF'].map((x) => normalizeBrooklynHalf(x, 'Right'));

    buckets['ADDITIONAL_TOPPINGS'] = dedupeNoQty([
      ...buckets['ADDITIONAL_TOPPINGS'],
      ...fromFirstHalf,
      ...fromSecondHalf,
    ]);
    buckets['SPECIALTY_1ST_HALF'] = [];
    buckets['SPECIALTY_2ND_HALF'] = [];
  }

  // If an item is represented as a 1ST/2ND HALF line, remove unsuffixed duplicate
  // from Additional Toppings to avoid mixed/incorrect reporting in CYO/Specialty.
  const stripHalfSuffix = (value: string) =>
    String(value || '')
      .replace(/\s+(1ST|2ND)\s+HALF$/i, '')
      .replace(/\s+x\d+$/i, '')
      .trim()
      .toLowerCase();
  const specialtyBases = new Set<string>([
    ...buckets['SPECIALTY_1ST_HALF'].map(stripHalfSuffix),
    ...buckets['SPECIALTY_2ND_HALF'].map(stripHalfSuffix),
  ]);
  if (specialtyBases.size > 0) {
    buckets['ADDITIONAL_TOPPINGS'] = buckets['ADDITIONAL_TOPPINGS'].filter((line) => !specialtyBases.has(stripHalfSuffix(line)));
  }

  // CYO White should not report plain Red Sauce as whole-sauce output.
  // If it's not a split-half sauce case, normalize to White Sauce.
  if (itemId === 'cyo-white') {
    const hasHalfSauce = buckets['SAUCE'].some((s) => /\bhalf\b/i.test(String(s || '')));
    if (!hasHalfSauce) {
      if (buckets['SAUCE'].length > 0) {
        buckets['SAUCE'] = ['White Sauce'];
      }
    }
  }

  if (suppressSauceForItem) {
    buckets['SAUCE'] = [];
  }

  if (isSpecialtyPizza && !allowSpecialtySauceIds.has(itemId)) {
    buckets['SAUCE'] = [];
  }

  // NEW: Suppress Size if in Title
  if (getItemSize(item)) {
      buckets['SIZE'] = [];
  }

  const order = BUCKET_ORDER[profile!];
  let result: string[] = [];

  // Add ordered buckets
  order.forEach(bucketKey => {
     const lines = buckets[bucketKey];
     const unique = Array.from(new Set(lines));
     result = [...result, ...unique];
  });

  // Keep profile output strict to the configured order only.
  // This avoids leaking SIZE/required-option/unknown artifacts into CYO/Specialty carts.

  if (debugCart) {
      console.log(`[PROFILE DEBUG: ${profile}] Final Order:`, result.map(t => ({ text: t })));
      // MARKER REMOVED
      // result.unshift('__CART_ORDER_ACTIVE_V1__');
  }

  return result;
};

const withCustomizationFallback = (item: CartItem, lines: string[]): string[] => {
  if (!item.customizations || item.customizations.length === 0) return lines;

  const existing = new Set(lines.map((line) => line.trim().toLowerCase()));
  const extraLines: string[] = [];

  item.customizations.forEach((cust: any) => {
    if (!cust || !Array.isArray(cust.items)) return;
    const category = String(cust.category || '').toLowerCase();

    // Skip categories that are intentionally represented in title or excluded.
    if (category.includes('size')) return;
    if (category.includes('quantity')) return;

    cust.items.forEach((raw: any) => {
      const text = String(raw || '').trim();
      if (!text) return;
      if (/^\d+\s+(chicken\s+tenders|mozzarella\s+sticks|arancini(\s+rice\s+ball)?)\b/i.test(text)) return;
      const key = text.toLowerCase();
      if (existing.has(key)) return;
      existing.add(key);
      extraLines.push(text);
    });
  });

  return extraLines.length > 0 ? [...lines, ...extraLines] : lines;
};

const toLookupKey = (value: string): string =>
  String(value || '')
    .toLowerCase()
    .replace(/\s*x\s*\d+$/i, '')
    .replace(/\s*(1st|2nd)\s+half$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeSectionName = (raw: string): string | null => {
  const s = String(raw || '').toLowerCase().trim();
  if (!s) return null;
  if (s.includes('whole cakes')) return 'Whole Cakes';
  if (s.includes('party cakes') || s.includes('party trays')) return 'Party Trays';
  if (s.includes('specialty toppings 1st') || s.includes('1st half')) return 'Specialty Toppings 1ST HALF';
  if (s.includes('specialty toppings 2nd') || s.includes('2nd half')) return 'Specialty Toppings 2ND HALF';
  if (s.includes('toast option')) return 'Toast Option';
  if (s.includes('substitute cheese')) return 'Substitute Cheese';
  if (s.includes('add cheese')) return 'Add Cheese';
  if (s.includes('extra cheese')) return 'Extra Cheese';
  if (s.includes('choose your panini type') || s.includes('choose panini')) return 'Choose Panini';
  if (s.includes('choose your wrap type') || s.includes('choose wrap')) return 'Choose Wrap';
  if (s.includes('choose panini')) return 'Choose Panini';
  if (s.includes('wrap type')) return 'Wrap type';
  if (s.includes('choose your base') || s.includes('salad base')) return 'Choose Your Base';
  if (s.includes('dressing choice')) return 'Dressing Choice';
  if (s.includes('choose your dressing') || s === 'dressing') return 'Choose Your dressing';
  if (s.includes('choose soup or salad')) return 'Choose Soup or Salad';
  if (s.includes('choose your toppings') || s.includes('salad toppings')) return 'Choose Your Toppings';
  if (s.includes('dressing preference')) return 'Dressing preference';
  if (s.includes('dressing instruction') || s.includes('dressing instructions')) return 'Dressing Instructions';
  if (s.includes('extra dressing')) return 'Extra Dressing';
  if (s.includes('choose your dipping')) return 'Choose Your Dipping Sauce';
  if (s.includes('choose your sauce')) return 'Choose your Sauce';
  if (s.includes('choose a sauce')) return 'Choose a Sauce';
  if (s.includes('sauce') && !s.includes('extra sauce')) return 'Sauce';
  if (s.includes('on the side toppings')) return 'On The Side Toppings';
  if (s.includes('side soups') || s.includes('soups & salads') || s.includes('extra bread')) return 'Side Soups, Salads, & Extra Bread';
  if (s.includes('side of extra chips')) return 'Side of Extra Chips';
  if (s.includes('side of extra')) return 'Side of Extra Chips';
  if (s.includes('side toppings')) return 'Side Toppings';
  if (s.includes('add sides')) return 'Add Sides';
  if (s.includes('build your platter') || s.includes('select your wraps') || s.includes('select your hoagies') || s.includes('select your hot sandwiches')) return 'Build Your Platter';
  if (s.includes('platter options')) return 'Build Your Platter';
  if (s.includes('cut options') || s.includes('cut options') || s.includes('cut option') || s.includes('cut in')) return 'Cut Options';
  if (s.includes('choose a pasta') || s.includes('your choice of pasta')) return 'Choose a Pasta';
  if (s.includes('pasta type')) return 'Pasta Type';
  if (s.includes('pasta additions')) return 'Extra Toppings';
  if (s.includes('substitute')) return 'Substitute';
  if (s.includes('add toppings')) return 'Add Toppings';
  if (s.includes('additional toppings')) return 'Additional Toppings';
  if (s.includes('extra toppings') || s === 'extras') return 'Extra Toppings';
  if (s.includes('lite toppings') || s === 'lite') return 'Lite Toppings';
  if (s.includes('no toppings')) return 'No Toppings';
  if (s.includes('special instructions') || s.includes('special instruction')) return 'Special Instructions';
  if (s.includes('dippings') || s.includes('add dippings')) return 'Dippings';
  if (s.includes('would you like to add extra sides') || s === 'extra sides') return 'Would You Like To Add Extra Sides';
  if (s.includes('would you like a dessert')) return 'Dessert';
  if (s.includes('dessert')) return 'Dessert';
  if (s === 'beverage') return 'Beverages';
  if (s.includes('beverage')) return 'Beverages';
  if (s === 'cheese') return 'Cheese';
  if (s === 'toppings') return 'Toppings';
  return null;
};

const getDesiredOrder = (item: CartItem): { mode: 'full' | 'tail'; sections: string[] } | null => {
  const category = String(item.category || '').toLowerCase();
  const name = String(item.name || '').toLowerCase();
  const pid = String(item.productId || item.id || '').toLowerCase();
  const isCreateYourOwnPasta =
    category === 'create-pasta' ||
    name.includes('build your own pasta') ||
    name.includes('create your own pasta');

  if (category === 'pizzas' && pid.startsWith('cyo-')) return { mode: 'full', sections: ['Sauce', 'Additional Toppings', 'Specialty Toppings 1ST HALF', 'Specialty Toppings 2ND HALF', 'Special Instructions', 'Dippings', 'Dessert', 'Beverages'] };
  if (category === 'minucci-pizzas') return { mode: 'full', sections: ['Special Instructions', 'No Toppings', 'Dippings', 'Dessert', 'Beverages'] };
  if (category === 'specialty-pizza') return { mode: 'full', sections: ['Sauce', 'Additional Toppings', 'Special Instructions', 'No Toppings', 'Dippings', 'Dessert', 'Beverages'] };
  if (category === 'brooklyn-pizza') return { mode: 'full', sections: ['Additional Toppings', 'Special Instructions', 'No Toppings', 'Dippings', 'Dessert', 'Beverages'] };
  if (category === 'stromboli-calzone') return { mode: 'full', sections: ['Choose Your Dipping Sauce', 'Additional Toppings', 'Dessert', 'Beverages'] };
  if (category === 'by-the-slice') return { mode: 'full', sections: ['Additional Toppings', 'Special Instructions', 'Dessert', 'Beverages'] };
  if (category === 'cheesesteaks') return { mode: 'full', sections: ['Toast Option', 'Cheese', 'On The Side Toppings', 'Toppings', 'Extra Toppings', 'Lite Toppings', 'No Toppings', 'Side Toppings', 'Would You Like To Add Extra Sides', 'Dessert', 'Beverages'] };
  if (category === 'hot-hoagies') return { mode: 'full', sections: ['Toast Option', 'Substitute Cheese', 'On The Side Toppings', 'Extra Toppings', 'Special Instructions', 'Would You Like To Add Extra Sides', 'Dessert', 'Beverages'] };
  if (category === 'cold-hoagies') return { mode: 'full', sections: ['Substitute Cheese', 'On The Side Toppings', 'Add Toppings', 'Extra Toppings', 'Lite Toppings', 'No Toppings', 'Side of Extra Chips', 'Side Toppings', 'Would You Like To Add Extra Sides', 'Dessert', 'Beverages'] };
  if (category === 'burgers') return { mode: 'full', sections: ['Toast Option', 'Substitute Cheese', 'Add Toppings', 'Extra Toppings', 'Lite Toppings', 'No Toppings', 'Dessert', 'Beverages'] };
  if (category === 'brioche') return { mode: 'full', sections: ['Toast Option', 'Add Cheese', 'Extra Cheese', 'No Toppings', 'Side Toppings', 'Beverages', 'Dessert'] };
  if (category === 'paninis' || category === 'panini') return { mode: 'full', sections: ['Choose Panini', 'Substitute Cheese', 'Extra Cheese', 'Lite Toppings', 'No Toppings', 'Side Toppings', 'Dessert', 'Beverages'] };
  if (category === 'wraps') return { mode: 'full', sections: ['Choose Wrap', 'Substitute Cheese', 'Extra Toppings', 'Extra Cheese', 'Lite Toppings', 'No Toppings', 'Side of Extra Chips', 'Side Toppings', 'Dessert', 'Beverages'] };
  if (category === 'traditional-dinners') return { mode: 'full', sections: ['Add Sides', 'Side Soups, Salads, & Extra Bread', 'Special Instructions', 'Dessert', 'Beverages'] };
  if (isCreateYourOwnPasta) return { mode: 'full', sections: ['Choose a Pasta', 'Choose a Sauce', 'Add Toppings', 'Choose Soup or Salad', 'Dessert', 'Beverage'] };
  if (category === 'baked-pasta' || (category === 'pasta' && name.includes('baked'))) {
    return { mode: 'full', sections: ['Add Toppings', 'Choose Soup or Salad', 'Dessert', 'Beverage'] };
  }
  if (category === 'pasta') {
    const isGnocchiAllaSorrentina = name.includes('gnocchi alla sorrentina') || pid === 'pasta-4';
    return isGnocchiAllaSorrentina
      ? { mode: 'full', sections: ['Add Toppings', 'Choose Soup or Salad', 'Dessert', 'Beverage'] }
      : { mode: 'full', sections: ['Choose a Pasta', 'Add Toppings', 'Choose Soup or Salad', 'Dessert', 'Beverage'] };
  }
  if (category === 'sides') return { mode: 'full', sections: ['Dessert', 'Beverages'] };
  if (category === 'create-salad') return { mode: 'full', sections: ['Choose Your Base', 'Choose Your dressing', 'Choose Your Toppings', 'Dressing Instructions', 'Extra Dressing', 'Extra Toppings', 'Dessert', 'Beverage'] };
  if (category === 'salads') return { mode: 'full', sections: ['Choose Your Base', 'Choose Your dressing', 'Extra Toppings', 'Dressing preference', 'Extra Dressing', 'No Toppings', 'Dessert', 'Beverage'] };
  if (category === 'seafood') {
    if (['sf-2', 'sf-3', 'sf-4', 'sf-5'].includes(pid)) {
      return { mode: 'full', sections: ['Choose a Pasta', 'Choose your Sauce', 'Dessert', 'Beverage'] };
    }
    if (pid === 'sf-11' || pid === 'sf-12' || name.includes('fish')) {
      return { mode: 'full', sections: ['Add Sides', 'Side Soups, Salads, & Extra Bread', 'Special Instructions', 'Dessert', 'Beverages'] };
    }
    return { mode: 'full', sections: ['Choose a Pasta', 'Choose your Sauce', 'Dessert', 'Beverages'] };
  }
  if (category === 'soups') return { mode: 'full', sections: ['Substitute', 'Special Instructions', 'Dessert', 'Beverage'] };
  if (category === 'kids' || category === 'kids-menu') {
    if (name.includes('create your own kids pasta')) return { mode: 'full', sections: ['Choose a Pasta', 'Choose a Sauce', 'Add Toppings', 'Special Instructions', 'Dessert', 'Beverage'] };
    if (name.includes('baked ziti') || name.includes('cheese ravioli') || name.includes('cheese tortellini')) return { mode: 'full', sections: ['Extra Toppings', 'Lite Toppings', 'No Toppings', 'Dessert', 'Beverage'] };
    if (name.includes('chicken fingers and french fries')) return { mode: 'full', sections: ['Desserts', 'Beverage'] };
    if (name.includes('pasta and meatball')) return { mode: 'full', sections: ['Choose a Pasta', 'Special Instructions', 'Add Toppings', 'Dessert', 'Beverage'] };
    return { mode: 'full', sections: ['Dessert', 'Beverage'] };
  }
  if (category === 'desserts' || category === 'pizzelle' || category === 'gelati') return { mode: 'full', sections: ['Dessert', 'Beverages'] };
  if (category === 'beverages') return { mode: 'full', sections: ['Dessert'] };
  if (category === 'catering-entrees') return { mode: 'full', sections: ['Add Sides', 'Side Soups, Salads, & Extra Bread', 'Special Instructions', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  if (category === 'catering-pasta') return { mode: 'full', sections: ['Choose a Pasta', 'Extra Toppings', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  if (category === 'catering-seafood-pasta') return { mode: 'full', sections: ['Pasta Type', 'Choose your Sauce', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  if (category === 'catering-sides') return { mode: 'full', sections: ['Dessert', 'Beverages'] };
  if (category === 'catering-salad-soups') return { mode: 'full', sections: ['Choose Your Base', 'Dressing Choice', 'Special Instructions', 'Dessert', 'Beverage'] };
  if (category === 'catering-hoagies-wraps') {
    if (name.includes('hoagie platter')) return { mode: 'full', sections: ['Build Your Platter', 'Cut Options', 'Side Toppings', 'Dessert', 'Beverages'] };
    if (name.includes('wrap platter')) return { mode: 'full', sections: ['Build Your Platter', 'Wrap type', 'Side Toppings', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
    if (name.includes('hot sandwich platter')) return { mode: 'full', sections: ['Build Your Platter', 'Cut Options', 'Side Toppings', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
    return { mode: 'full', sections: ['Build Your Platter', 'Side Toppings', 'Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  }
  if (category === 'catering-whole-cakes') return { mode: 'full', sections: ['Whole Cakes', 'Beverages'] };
  if (category === 'catering-party-trays') return { mode: 'full', sections: ['Special Instructions', 'Party Trays', 'Beverages'] };
  if (category === 'catering-desserts') return { mode: 'full', sections: ['Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  if (category === 'catering-beverages') return { mode: 'full', sections: ['Dessert'] };
  if (category === 'appetizers') return { mode: 'tail', sections: ['Dessert', 'Beverages'] };
  if (category === 'catering-appetizers') return { mode: 'tail', sections: ['Dessert', 'Whole Cakes', 'Party Trays', 'Beverages'] };
  return null;
};

const remapSectionForItem = (item: CartItem, section: string | null, text?: string): string | null => {
  if (!section) return null;
  const category = String(item.category || '').toLowerCase();
  const line = String(text || '').toLowerCase().trim();
  const isCreateYourOwnPasta =
    category === 'create-pasta' ||
    String(item.name || '').toLowerCase().includes('build your own pasta') ||
    String(item.name || '').toLowerCase().includes('create your own pasta');

  if (category === 'hot-hoagies') {
    if (section === 'Cheese') return 'Substitute Cheese';
    if (section === 'Extra Toppings' || section === 'Add Toppings') return 'Extra Toppings';
    if (section === 'Side Toppings' || section === 'Add Sides') return 'Would You Like To Add Extra Sides';
  }

  if (category === 'cold-hoagies') {
    if (section === 'Cheese') return 'Substitute Cheese';
    if (section === 'Toppings') return 'Add Toppings';
    if (section === 'Extra Toppings') return 'Extra Toppings';
    if (section === 'Lite Toppings') return 'Lite Toppings';
    if (section === 'No Toppings') return 'No Toppings';
    if (section === 'Would You Like To Add Extra Sides' || section === 'Add Sides') return 'Would You Like To Add Extra Sides';
    if (line.includes('side of extra chips')) return 'Side of Extra Chips';
  }

  if (category === 'burgers') {
    if (section === 'Cheese') return 'Substitute Cheese';
    if (section === 'Toppings') return 'Add Toppings';
  }

  if (category === 'brioche') {
    if (section === 'Cheese') return 'Add Cheese';
    if (section === 'Extra Toppings') return 'Extra Cheese';
  }

  if (category === 'paninis' || category === 'panini') {
    if (section === 'Cheese') return 'Substitute Cheese';
  }

  if (category === 'wraps') {
    if (section === 'Wrap type') return 'Choose Wrap';
    if (section === 'Cheese') return 'Substitute Cheese';
    if (section === 'Add Toppings') return 'Extra Toppings';
  }

  if (isCreateYourOwnPasta) {
    if (section === 'Pasta Type') return 'Choose a Pasta';
    if (section === 'Choose your Sauce') return 'Choose a Sauce';
    if (section === 'Sauce') return 'Choose a Sauce';
    if (section === 'Toppings' || section === 'Extra Toppings') return 'Add Toppings';
  }

  if (category === 'create-salad') {
    if (section === 'Dressing preference') return 'Dressing Instructions';
    if (section === 'Toppings') return 'Choose Your Toppings';
    if (section === 'Special Instructions' && line.includes('dressing')) return 'Dressing Instructions';
  }

  if (category === 'salads') {
    if (section === 'Choose Your Toppings') return 'Extra Toppings';
    if (section === 'Dressing Instructions') return 'Dressing preference';
    if (section === 'Beverages') return 'Beverage';
  }

  if (category === 'pasta') {
    if (section === 'Pasta Type') return 'Choose a Pasta';
    if (section === 'Toppings' || section === 'Extra Toppings') return 'Add Toppings';
    if (section === 'Soups & Salads' || section === 'Side Soups, Salads, & Extra Bread') return 'Choose Soup or Salad';
  }

  if (category === 'baked-pasta' || (category === 'pasta' && String(item.name || '').toLowerCase().includes('baked'))) {
    if (section === 'Pasta Type') return null;
    if (section === 'Toppings' || section === 'Extra Toppings' || section === 'Add Toppings') return 'Add Toppings';
    if (section === 'Sides' || section === 'Soups & Salads' || section === 'Side Soups, Salads, & Extra Bread' || section === 'Choose Soup or Salad') return 'Choose Soup or Salad';
  }

  if (category === 'seafood') {
    if (section === 'Pasta Type') return 'Choose a Pasta';
    if (section === 'Choose a Sauce') return 'Choose your Sauce';
    if (section === 'Sauce') return 'Choose your Sauce';
  }

  if (category === 'catering-seafood-pasta') {
    if (section === 'Choose a Sauce') return 'Choose your Sauce';
    if (section === 'Sauce') return 'Choose your Sauce';
  }

  if (category === 'kids' || category === 'kids-menu') {
    if (section === 'Pasta Type') return 'Choose a Pasta';
    if (section === 'Choose your Sauce') return 'Choose a Sauce';
  }

  if (category === 'traditional-dinners') {
    if (section === 'Sides') return 'Add Sides';
    if (section === 'Soups & Salads') return 'Side Soups, Salads, & Extra Bread';
  }
  
  if (category === 'catering-entrees') {
    if (section === 'Sides') return 'Add Sides';
    if (section === 'Soups & Salads') return 'Side Soups, Salads, & Extra Bread';
  }

  if (category === 'catering-pasta') {
    if (section === 'Pasta Type') return 'Choose a Pasta';
    if (section === 'Add Toppings' || section === 'Pasta Additions') return 'Extra Toppings';
  }

  if (category === 'catering-salad-soups') {
    if (section === 'Salad Base' || section === 'Choose Your Base') return 'Choose Your Base';
    if (section === 'Dressing' || section === 'Choose Your dressing') return 'Dressing Choice';
    if (section === 'Beverages') return 'Beverage';
  }

  if (category === 'catering-hoagies-wraps' && section === 'Cut in') {
    return 'Cut Options';
  }
  if (category === 'catering-hoagies-wraps' && section === 'Platter Options') {
    return 'Build Your Platter';
  }
  if (
    category === 'catering-hoagies-wraps' &&
    String(item.name || '').toLowerCase().includes('hoagie platter') &&
    (section === 'Whole Cakes' || section === 'Party Trays')
  ) {
    return 'Dessert';
  }

  return section;
};

const applyCategoryOrdering = (item: CartItem, lines: string[]): string[] => {
  const desired = getDesiredOrder(item);
  if (!desired) return lines;
  const category = String(item.category || '').toLowerCase();
  const lowerName = String(item.name || '').toLowerCase();
  const lowerPid = String(item.productId || item.id || '').toLowerCase();
  const suppressSections = new Set<string>();
  if (
    category === 'pasta' &&
    (lowerName.includes('gnocchi alla sorrentina') || lowerPid === 'pasta-4')
  ) {
    suppressSections.add('Choose a Pasta');
  }

  const resolveCateringDessertSection = (sel: any, current: string | null): string | null => {
    if (!category.startsWith('catering-')) return current;
    const section = String(current || '');
    if (section !== 'Dessert') return current;
    // Catering Salad/Soups must keep all sweets under Dessert (no internal split).
    if (category === 'catering-salad-soups') {
      return 'Dessert';
    }
    // Catering Sides must keep all sweets under Dessert (no internal split).
    if (category === 'catering-sides') {
      return 'Dessert';
    }
    if (category === 'catering-hoagies-wraps' && String(item.name || '').toLowerCase().includes('hoagie platter')) {
      return 'Dessert';
    }
    const sid = String(sel?.id || '').toLowerCase();
    if (sid.startsWith('ccake')) return 'Whole Cakes';
    if (sid.startsWith('cptray')) return 'Party Trays';
    return current;
  };

  const sectionByKey = new Map<string, string>();
  const bind = (label: string, section: string | null) => {
    if (!section) return;
    const k = toLookupKey(label);
    if (!k) return;
    if (!sectionByKey.has(k)) sectionByKey.set(k, section);
  };

  (item.selections || []).forEach((sel: any) => {
    const rawSection =
      normalizeSectionName(String(sel?.groupTitle || '')) ||
      normalizeSectionName(String(sel?.groupId || '')) ||
      normalizeSectionName(String(sel?.type || ''));
    const section = resolveCateringDessertSection(
      sel,
      remapSectionForItem(item, rawSection, String(sel?.label || ''))
    );
    bind(String(sel?.label || ''), section);
  });

  (item.customizations || []).forEach((cust: any) => {
    const rawSection = normalizeSectionName(String(cust?.category || ''));
    const section = remapSectionForItem(item, rawSection);
    const items = Array.isArray(cust?.items) ? cust.items : [];
    items.forEach((raw: any) => bind(String(raw || ''), section));
  });

  const buckets: Record<string, string[]> = {};
  const other: string[] = [];
  const sectionAliases: Record<string, string[]> = {
    Dessert: ['Dessert', 'Desserts'],
    Desserts: ['Desserts', 'Dessert'],
    Beverage: ['Beverage', 'Beverages'],
    Beverages: ['Beverages', 'Beverage'],
  };
  const getBucket = (section: string): string[] => {
    const names = sectionAliases[section] || [section];
    for (const name of names) {
      if (buckets[name] && buckets[name].length > 0) return buckets[name];
    }
    return [];
  };
  const pushUnique = (arr: string[], value: string) => {
    const t = String(value || '').trim();
    if (!t) return;
    if (!arr.includes(t)) arr.push(t);
  };

  lines.forEach((line) => {
    let text = String(line || '').trim();
    if (!text) return;
    const key = toLookupKey(text);
    let section = sectionByKey.get(key) || null;
    if (!section) {
      if (/1ST HALF$/i.test(text)) section = 'Specialty Toppings 1ST HALF';
      else if (/2ND HALF$/i.test(text)) section = 'Specialty Toppings 2ND HALF';
      else section = normalizeSectionName(text);
    }
    section = remapSectionForItem(item, section, text);
    if (section && suppressSections.has(section)) {
      return;
    }
    if (
      category === 'catering-hoagies-wraps' &&
      String(item.name || '').toLowerCase().includes('hoagie platter') &&
      section === 'Build Your Platter'
    ) {
      // Hoagie Platter must report Build Your Platter entries with dynamic xN quantity.
      const dynamicQty = Math.max(1, Number(item.quantity) || 1);
      if (!/\bx\d+\b/i.test(text)) text = `${text} x${dynamicQty}`;
    }
    if (category.startsWith('catering-') && section === 'Dessert') {
      const isHoagiePlatterCatering =
        category === 'catering-hoagies-wraps' &&
        String(item.name || '').toLowerCase().includes('hoagie platter');
      const isCateringSaladSoups = category === 'catering-salad-soups';
      const isCateringSides = category === 'catering-sides';
      if (!isHoagiePlatterCatering && !isCateringSaladSoups && !isCateringSides) {
        const lk = text.toLowerCase();
        if (lk.includes('tray')) section = 'Party Trays';
        else if (lk.includes('cake') || lk.includes('pie')) section = 'Whole Cakes';
      }
    }
    if (!section) {
      pushUnique(other, text);
      return;
    }
    if (!buckets[section]) buckets[section] = [];
    pushUnique(buckets[section], text);
  });

  if (desired.mode === 'tail') {
    const tailSections = new Set(desired.sections);
    const base = lines.filter((line) => {
      const key = toLookupKey(String(line || ''));
      const sec = remapSectionForItem(item, sectionByKey.get(key) || normalizeSectionName(String(line || '')), String(line || ''));
      return !sec || !tailSections.has(sec);
    });
    const tail = desired.sections.flatMap((sec) => getBucket(sec));
    return [...base, ...tail];
  }

  const ordered = desired.sections.flatMap((sec) => getBucket(sec));
  if (category === 'catering-hoagies-wraps' && String(item.name || '').toLowerCase().includes('hoagie platter')) {
    // Hoagie Platter must follow strict explicit order only.
    return ordered;
  }
  if (category === 'brioche') {
    return ordered;
  }
  const used = new Set(ordered.map((x) => x.toLowerCase()));
  const leftovers = [
    ...other,
    ...lines.filter((line) => {
      if (used.has(String(line || '').toLowerCase()) || ordered.includes(String(line || ''))) return false;
      const key = toLookupKey(String(line || ''));
      const mappedSection = remapSectionForItem(
        item,
        sectionByKey.get(key) || normalizeSectionName(String(line || '')),
        String(line || '')
      );
      if (mappedSection && suppressSections.has(mappedSection)) return false;
      return true;
    }),
  ];
  const dedupedLeftovers: string[] = [];
  leftovers.forEach((x) => pushUnique(dedupedLeftovers, x));
  return [...ordered, ...dedupedLeftovers];
};

const consolidateSemanticLines = (lines: string[]): string[] => {
  const parseTrailingQty = (value: string): { base: string; qty: number; explicit: boolean } => {
    const v = String(value || '').trim();
    const match = v.match(/^(.*?)\s*x\s*(\d+)$/i);
    if (!match) return { base: v, qty: 1, explicit: false };
    return {
      base: String(match[1] || '').trim(),
      qty: parseInt(match[2], 10) || 1,
      explicit: true,
    };
  };

  const normalized = (value: string) =>
    String(value || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  const selected = new Map<string, { base: string; qty: number; explicit: boolean }>();
  const order: string[] = [];

  lines.forEach((line) => {
    const parsed = parseTrailingQty(line);
    const key = normalized(parsed.base);
    if (!key) return;
    if (!selected.has(key)) {
      selected.set(key, parsed);
      order.push(key);
      return;
    }
    const prev = selected.get(key)!;
    // Prefer higher qty. If both qty=1, prefer plain label over explicit x1.
    if (parsed.qty > prev.qty) {
      selected.set(key, parsed);
      return;
    }
    if (parsed.qty === prev.qty && parsed.qty === 1 && prev.explicit && !parsed.explicit) {
      selected.set(key, parsed);
    }
  });

  return order
    .map((key) => selected.get(key)!)
    .map((entry) => (entry.qty > 1 ? `${entry.base} x${entry.qty}` : entry.base));
};

// --- LINES BUILDER ---

export const buildCartDisplayLines = (item: CartItem): string[] => {
  const isWings = isWingsItem(item);
  const isAppetizer = isAppetizerWithArtifacts(item);
  const itemQty = item.quantity ?? 1;
  const itemTitle = buildCartDisplayTitle(item); // To check redundancy
  const rawTitleName = itemTitle.replace(/^\d+\s+/, ''); // Remove item qty prefix
  const isCheesesteakItem =
    (item.category === 'cheesesteaks') ||
    (item.category || '').toLowerCase().includes('cheesesteak');
  const finalizeLines = (lines: string[]) => consolidateSemanticLines(applyCategoryOrdering(item, lines));

  // 1. Gather all selections/lines
  let rawLines: { 
    text: string; 
    priority: number; 
    originalSel?: CartSelection 
  }[] = [];

  if (item.selections && item.selections.length > 0) {
    item.selections.forEach(sel => {
      // Logic to determine priority and text
      let text = String(sel.label || '').trim();
      
      // Guard against duplicated salad-removal suffixes:
      // "Side Garden Salad (No A, No B) (No A, No B)" -> keep one.
      const repeatedNoSuffix = text.match(/^(.*)\s+\((No [^)]+)\)(?:\s+\(\2\))+$/i);
      if (repeatedNoSuffix) {
        text = `${String(repeatedNoSuffix[1] || '').trim()} (${String(repeatedNoSuffix[2] || '').trim()})`;
      }
      
      // Special formatting for salads with removed ingredients
      if (sel.removedIngredients && sel.removedIngredients.length > 0) {
        const hasRemovedSuffix = /\(\s*No\s+[^)]+\)\s*$/i.test(text);
        if (!hasRemovedSuffix) {
          const removedStr = sel.removedIngredients.map(r => `No ${r}`).join(', ');
          text = `${text} (${removedStr})`;
        }
      }

      let priority = 99;

      // Filter: Pizza Cheese suppression
      if (item.category === 'pizzas' && (sel.groupTitle === 'Cheese')) return;

      // Filter: Pepperoni Roll / Slice size suppression
      const isPepperoniRoll = item.id.includes('stromboli-8') || item.name === 'Pepperoni Roll';
      const isSlice = item.id.startsWith('slice-') || (item.name && item.name.includes('Slice'));
      if ((isPepperoniRoll || isSlice) && (sel.groupTitle === 'Size' || sel.type === 'size' || sel.type === 'required_option')) return;

      // Filter: Fries Pomodoro
      const isFries = item.id === 'app9' || item.name === 'French Fries' || 
                      item.id === 'app10' || item.name === 'Cheese Fries' || 
                      item.id === 'app12' || item.name === 'Cheddar Steak Fries';
      if (isFries && sel.label.includes('Pomodoro Sauce')) return;

      // Filter: Mozzarella Sticks quantity should appear only in title, never as a line item.
      const isMozzarellaSticks =
        item.id === 'app4' ||
        item.id === 'wing4' ||
        item.id === 'capp3' ||
        (item.name && item.name.includes('Mozzarella Sticks'));
      const isArancini =
        item.id === 'app8' ||
        item.id === 'capp4' ||
        (item.name && item.name.toLowerCase().includes('arancini'));
      const isChickenTenders =
        item.id === 'app6' ||
        item.id === 'wing3' ||
        item.id === 'capp2' ||
        (item.name && item.name.toLowerCase().includes('chicken tenders'));
      const isMozzarellaQtyLine =
        String(sel.groupTitle || '').toLowerCase() === 'quantity' ||
        /\b\d+\s+mozzarella sticks\b/i.test(String(sel.label || ''));
      if (isMozzarellaSticks && isMozzarellaQtyLine) return;
      const isAranciniQtyLine =
        String(sel.groupTitle || '').toLowerCase() === 'quantity' ||
        /\b\d+\s+arancini(\s+rice\s+ball)?\b/i.test(String(sel.label || ''));
      if (isArancini && isAranciniQtyLine) return;
      const isChickenTendersQtyLine =
        String(sel.groupTitle || '').toLowerCase() === 'quantity' ||
        /\b\d+\s+chicken\s+tenders\b/i.test(String(sel.label || ''));
      if (isChickenTenders && isChickenTendersQtyLine) return;


      // WINGS LOGIC (Disabled to use deterministic builder in buildWingsDisplayLines)
      if (isWings && false) {
        // Normalize quantity text
        text = normalizeWingsQuantityText(text);

        const lowerLabel = text.toLowerCase();
        const lowerGroup = (sel.groupId || '').toLowerCase();
        const lowerHeader = (sel.groupTitle || '').toLowerCase();

        // Priority Logic
        // 1) Included Dip
        // 2) Choose Your Sauce
        // 3) Special Instructions
        // 4) Extra Sauce
        // 5) Dippings (Extra)

        const isDippingGroup = lowerGroup.includes('dipping') || lowerGroup.includes('dip') || lowerHeader.includes('dipping') || lowerHeader.includes('dip');
        const isIncludedGroup = lowerGroup.includes('included') || lowerGroup.includes('comes with') || lowerHeader.includes('included') || lowerHeader.includes('comes with');
        const hasBleuCheese = /bleu cheese|blue cheese/i.test(text);

        if (hasBleuCheese) {
             let treatAsExtra = false;
             if (isDippingGroup) treatAsExtra = true;
             else if (isIncludedGroup) treatAsExtra = false;
             else {
                 // Fallback: Check occurrences
                 const allBleu = item.selections?.filter(s => /bleu cheese|blue cheese/i.test(s.label)) || [];
                 const myIndex = allBleu.findIndex(s => s.id === sel.id);
                 treatAsExtra = myIndex > 0;
             }

             if (treatAsExtra) {
                 if (!text.toLowerCase().startsWith('extra')) text = `Extra ${text}`;
                 priority = 50; // Dippings
             } else {
                 // Included
                 // Calculate size logic from original code?
                 let size = '2oz';
                 const qtySel = item.selections?.find(s => s.groupTitle === 'Quantity' || (s.label && s.label.toLowerCase().includes('wings')));
                 const qtyTxt = (qtySel?.label || '') + (qtySel?.id || '');
                 if (qtyTxt.includes('50')) size = '16oz';
                 else if (qtyTxt.includes('30')) size = '8oz';
                 else if (qtyTxt.includes('20')) size = '4oz';
                 
                 text = `${size} Bleu Cheese`;
                 priority = 10; // Included Dip
             }
             text = text.replace(/blue cheese/i, 'Bleu Cheese');
        } 
        else if (lowerGroup === 'wings_sauce' || (lowerHeader === 'sauce' && !lowerHeader.includes('extra'))) {
            priority = 20; // Choose Sauce
        }
        else if (sel.type === 'special_instruction' || lowerHeader.includes('special')) {
            priority = 30; // Instructions
        }
        else if (lowerGroup === 'wings_extra_sauce' || lowerLabel.includes('extra sauce')) {
            priority = 40; // Extra Sauce
        }
        else if (isDippingGroup) {
            priority = 50; // Dippings
        }

      }

      // General Text cleanup
      if (
        sel.type === 'extra_topping' &&
        !/^extra\b/i.test(text) &&
        !/^add\s+extra\b/i.test(text) &&
        !isWings &&
        !isMozzarellaSticks &&
        !isArancini
      ) { // Wings handled above
          text = `Extra ${text}`;
      }

      // Mozzarella Sticks sauce labels should not be forced as "Extra ...".
      if (isMozzarellaSticks && /sauce/i.test(text)) {
        text = text.replace(/^extra\s+/i, '').trim();
      }

      // Arancini sauce labels should not be forced as "Extra ...".
      if (isArancini && /sauce/i.test(text)) {
        text = text.replace(/^extra\s+/i, '').trim();
      }

      const isPizzaCategory = ['pizzas', 'specialty-pizza', 'brooklyn-pizza'].includes((item.category || '').toLowerCase());
      const isPizzaSauceSelection =
        isPizzaCategory &&
        (sel.groupId === 'pizza_sauce' || sel.type === 'sauce' || String(sel.groupTitle || '').toLowerCase().includes('sauce'));
      const isWhiteSauceLike =
        /^white pizza$/i.test(text) || /^white sauce$/i.test(text) || sel.id === 'sauce-white' || sel.id.startsWith('generated-white-pizza');
      const isRedSauceLike =
        /^red sauce$/i.test(text) || sel.id === 'sauce-pizza';

      if (isPizzaSauceSelection) {
        if (sel.distribution && sel.distribution !== 'whole') {
          const side = sel.distribution === 'left' ? 'Left' : 'Right';
          if (isWhiteSauceLike) text = `${side} Half White Sauce`;
          else if (isRedSauceLike) text = `${side} Half Red Pizza`;
          else text = `${side} Half ${text}`;
        } else {
          if (isWhiteSauceLike) text = 'White Sauce';
          else if (isRedSauceLike) text = 'Red Sauce';
        }
      }
      
      // Distribution
      if ((sel.type === 'topping' || sel.type === 'extra_topping') && 
           sel.distribution && sel.distribution !== 'whole') {
          text += ` (${sel.distribution === 'left' ? 'Left' : 'Right'})`;
      }
      
      // Clean up sizes
      if (sel.groupTitle === 'Size' || sel.type === 'size') {
           text = text.replace(/\s*\([^)]*\)/g, '');
           text = text.replace(/\s+\d+["']?.*$/, '');
           text = text.trim();
      }

      // White Pizza (whole only fallback)
      if (text === 'White Pizza') {
          text = 'White Sauce';
      }

      rawLines.push({ text, priority, originalSel: sel });
    });
  } else if (item.customizations) {
    // Legacy support
    item.customizations.forEach(c => {
        if (typeof c === 'string') {
            rawLines.push({ text: c, priority: 99 });
        } else if (c.items) {
             c.items.forEach((sub: string) => rawLines.push({ text: sub, priority: 99 }));
        }
    });
  }

  // 2. Routing Logic
  
  // DEBUG PIPELINE 1 (Input)
  const debugCart = typeof window !== 'undefined' && window.location.search.includes('debugCart=1');
  if (debugCart) {
      if (item.name.includes('Chicken Tenders')) {
        console.log('[TENDERS PIPELINE 1] Input item:', item.name);
        console.log('[TENDERS PIPELINE 1] Raw Lines:', rawLines.map(r => r.text));
      }
      
      // LOG REAL SELECTIONS FOR DISCOVERY
      console.log(`[DEBUG CART] Item: ${item.name} (${item.productId || 'no-id'}) [${item.category}]`);
      console.log('[DEBUG CART] Real Selections:', rawLines.map(l => ({
          text: l.text,
          type: l.originalSel?.type,
          groupId: l.originalSel?.groupId,
          groupTitle: l.originalSel?.groupTitle,
          label: l.originalSel?.label
      })));
  }

  // A.0) Traditional Dinners (Strict Order)
  if (isTraditionalDinnerItem(item)) {
      // Traditional Dinners already returns strict order:
      // Add Sides -> Side Soups, Salads, & Extra Bread -> Special Instructions -> Dessert -> Beverages.
      // Skip global category reordering here because it can reclassify loose labels (e.g. "Broccoli")
      // and push them to leftovers at the end.
      return consolidateSemanticLines(buildTraditionalDinnersLines(item, rawLines, itemQty));
  }

  // A) Chicken Tenders (Specific Priority)
  // Check this BEFORE isWings because Chicken Tenders might be misclassified as Wings
  // if they share sauce group IDs or similar structure.
  if (isChickenTendersItem(item)) {
      return finalizeLines(withCustomizationFallback(item, buildChickenTendersDisplayLines(item, rawLines, itemQty)));
  }

  // A.1) Mozzarella Sticks (strict deterministic order)
  if (isMozzarellaSticksItem(item)) {
      return finalizeLines(buildSauceBasedAppetizerLines(item, rawLines, 'mozzarella'));
  }

  // A.2) Arancini Rice Ball (strict deterministic order)
  if (isAranciniItem(item)) {
      return finalizeLines(buildSauceBasedAppetizerLines(item, rawLines, 'arancini'));
  }

  // B) Cheesesteaks (must run before wings to avoid "Add Wings (10)" side contamination)
  if (isCheesesteakItem) {
      // Cheesesteaks already uses strict deterministic ordering in dedicated builder.
      // Avoid secondary global reordering to prevent section drift.
      return buildCheesesteakLines(item, rawLines, itemQty);
  }

  // B.1) Hot Hoagies (strict deterministic order)
  if (item.category === 'hot-hoagies') {
      return buildHotHoagieLines(item, rawLines, itemQty);
  }

  // B.2) Cold Hoagies (strict deterministic order)
  if (item.category === 'cold-hoagies') {
      return buildColdHoagieLines(item, rawLines, itemQty);
  }

  // B.3) Wraps (strict deterministic order)
  if (item.category === 'wraps') {
      return buildWrapLines(item, rawLines, itemQty);
  }

  // B.4) Create Your Own Fresh Salad (strict deterministic order)
  if (item.category === 'create-salad') {
      // Keep per-section lines intact. Global semantic consolidation can hide
      // "Extra Toppings" when they share the same label as regular toppings.
      return buildCreateSaladLines(item, rawLines, itemQty);
  }

  // B.5) Specialty Fresh Salad (strict deterministic order)
  if (item.category === 'salads') {
      return buildSpecialtySaladLines(item, rawLines, itemQty);
  }

  // B.6) Soups (strict deterministic order)
  if (item.category === 'soups') {
      return buildSoupsLines(item, rawLines, itemQty);
  }

  // B.7) Kids Menu (strict deterministic order)
  if (item.category === 'kids' || item.category === 'kids-menu') {
      return buildKidsLines(item, rawLines, itemQty);
  }

  // C) Wings
  if (isWings) {
      // Use specialized builder for Wings to ensure deterministic order
      return finalizeLines(withCustomizationFallback(item, buildWingsDisplayLines(item, rawLines, itemQty)));
  }

  // D) Seafood Appetizers
  if (isSeafoodAppetizer(item)) {
      return finalizeLines(withCustomizationFallback(item, buildSeafoodAppetizersDisplayLines(item, rawLines, itemQty)));
  }

  // C.5) MINUCCI PIZZA (Special Builder)
  if (isMinucciItem(item)) {
      return finalizeLines(buildMinucciLines(item, rawLines, itemQty));
  }

  // C.5.1) CYO PIZZA SPECIAL BUILDER (100% Deterministic)
  if (item.category === 'pizzas' && item.productId?.startsWith('cyo-')) {
    // CYO already has strict deterministic ordering; avoid secondary global reordering
    // that can push unmapped lines to the end.
    return buildCyoPizzaLines(item, rawLines, itemQty);
  }

  // C.5.2) SPECIALTY PIZZA (Strict Spec)
  if (item.category === 'specialty-pizza') {
      // Specialty already uses strict deterministic ordering in profile builder.
      // Avoid secondary global reordering that can reclassify lines and break order.
      return buildSpecialtyPizzaLines(item, rawLines, itemQty);
  }

  // C.5.3) BROOKLYN PIZZA (Strict Spec)
  if (item.category === 'brooklyn-pizza') {
      // Brooklyn already uses strict deterministic ordering in profile builder.
      // Avoid secondary global reordering that can push side-distribution toppings
      // (Left/Right) to leftovers at the end.
      return buildBrooklynPizzaLines(item, rawLines, itemQty);
  }

  // C.5.35) BY THE SLICE (Strict Spec)
  if (item.category === 'by-the-slice') {
      return buildByTheSliceLines(item, rawLines, itemQty);
  }

  // C.5.4) STROMBOLI / CALZONE (Strict Spec)
  if (item.category === 'stromboli-calzone') {
      // Stromboli already builds strict order:
      // Choose Your Dipping Sauce -> Additional Toppings -> Dessert -> Beverages.
      // Avoid global reordering because it can reclassify Bleu/Ranch and break order.
      return buildStromboliCalzoneLines(item, rawLines, itemQty);
  }

  // E) Structured Profiles (CYO, Minucci, Specialty, Brooklyn, Stromboli)
  const profile = getCartProfile(item);
  if (debugCart) {
      console.log(`[DEBUG CART] Detected Profile: ${profile}`);
  }
  if (profile) {
      return finalizeLines(buildStructuredProfileDisplayLines(item, rawLines, itemQty, profile));
  }

  // 3. Filter and Format (Standard Items)
  const finalLines: { text: string; dedupeKey: string }[] = [];
  
  rawLines.forEach(line => {
      let content = line.text.trim();
      const lower = content.toLowerCase();

      // Filter: Garbage words
      if (/^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(lower)) return;
      if (isAppetizer && /^(american|full loaf|half loaf)(\s*x\s*\d+)?$/i.test(lower)) return; // Explicit check

      // Filter: pcs/pieces
      // Reject if matches "10 pcs", "10 pieces", etc.
      if (/\b\d+\s*(pcs|pieces?)\b/i.test(content)) return;

      // Filter: Redundant with Title
      // e.g. Title "30 Wings", Line "30 Wings"
      // or Line "Wings" if Title is "10 Wings"
      if (content === rawTitleName || rawTitleName.includes(content)) {
          // Careful: if content is "Wings" and title "10 Wings", maybe we want to hide it?
          // If title is "10 Wings" and line is "10 Wings", hide.
          // If title is "10 Wings" and line is "Wings", hide.
          if (content === rawTitleName) return;
          // If content is "10 Wings" and Title is "10 Wings" -> hidden above.
      }
      
      // Double check redundant Wing quantity lines
      if (isWings && /\d+\s*Wings/i.test(content)) {
          // If this line is the quantity selector that shaped the title, hide it.
          // Since we already built title from it (likely), hide it.
          // Unless the title uses default "10" and this line says "20 Wings"?
          // But buildCartDisplayTitle logic tries to use selection.
          // So usually it's redundant.
          if (rawTitleName.includes(content)) return;
      }

      // Final Check: Deduplication within list
      // (Done at the end)

      // Filter: Suppress Size if in Title
      // We check if this line text matches the found size
      const sizeFound = getItemSize(item);
      if (sizeFound) {
          // Strict text match or smart match?
          // "Large (16")" vs "Large"
          // getItemSize returns "Large (16")" from selections usually.
          // So if content === sizeFound, suppress.
          if (content === sizeFound) return;
          // Do not suppress real item names that happen to start with size words
          // (e.g. catering desserts/trays like "Large ...").
          const isPureSizeLabel =
            /^(small|medium|large|jumbo|personal)\b/i.test(content) &&
            !/(cake|tray|lava|cookie|tiramisu|cheesecake|brownie|cannoli|starry|pepsi|coke|sprite|water|tea|soda)/i.test(content);
          if (isPureSizeLabel) return;
      }

      const dedupeKey = line.originalSel
        ? `${content}::${line.originalSel.groupId || ''}::${line.originalSel.groupTitle || ''}::${line.originalSel.type || ''}`
        : content;

      finalLines.push({ text: content, dedupeKey });
  });

  // 4. Unique and Prefix
  // Keep same label when it comes from different groups/types.
  const seen = new Set<string>();
  const uniqueLines: string[] = [];
  finalLines.forEach((line) => {
    if (seen.has(line.dedupeKey)) return;
    seen.add(line.dedupeKey);
    uniqueLines.push(line.text);
  });

  // DEBUG LOG (Temporary)
  if (debugCart) {
     console.log('[CART_LINE_DEBUG]', { 
        uniqueLines
     });
  }
  
  return finalizeLines(withCustomizationFallback(item, uniqueLines));
};
