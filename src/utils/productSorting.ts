
/**
 * Sorts extra options based on product rules.
 * 
 * Rules:
 * 1. If product is "Chicken Tenders" (case-insensitive, includes variants):
 *    - Prioritize items with "Honey Mustard" in the name.
 *    - Maintain relative order of other items.
 * 2. Otherwise, return the original order.
 * 
 * Does not mutate the original array.
 */
export function sortExtrasForProduct(extras: any[], productName: string): any[] {
  if (!productName || !productName.toLowerCase().includes('chicken tenders')) {
    return extras;
  }

  const honeyMustard = [];
  const others = [];

  for (const item of extras) {
    if (item.name && item.name.toLowerCase().includes('honey mustard')) {
      honeyMustard.push(item);
    } else {
      others.push(item);
    }
  }

  return [...honeyMustard, ...others];
}
