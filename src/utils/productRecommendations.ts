import { Product } from '../components/ProductCard';

// Load initial data from localStorage
const loadFromStorage = (key: string): { [key: string]: number } => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

const saveToStorage = (key: string, data: { [key: string]: number }): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Store to track product views
const productViews: { [productId: string]: number } = loadFromStorage('passariello_product_views');
const productLastViewed: { [productId: string]: number } = loadFromStorage('passariello_last_viewed');

/**
 * Track when a product is viewed
 */
export function trackProductView(productId: string): void {
  if (!productViews[productId]) {
    productViews[productId] = 0;
  }
  productViews[productId]++;
  productLastViewed[productId] = Date.now();
  
  // Persist to localStorage
  saveToStorage('passariello_product_views', productViews);
  saveToStorage('passariello_last_viewed', productLastViewed);
}

/**
 * Calculate recommendation score for a product
 * Factors:
 * - View count (70% weight)
 * - Recency of views (20% weight)
 * - Random factor for variety (10% weight)
 */
function calculateScore(productId: string): number {
  const views = productViews[productId] || 0;
  const lastViewed = productLastViewed[productId] || 0;
  
  // Normalize view count (assume max 100 views for scaling)
  const viewScore = Math.min(views / 10, 10) * 0.7;
  
  // Recency score - views in last hour get higher score
  const hoursSinceView = (Date.now() - lastViewed) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 10 - hoursSinceView) * 0.2;
  
  // Small random factor for variety
  const randomScore = Math.random() * 1;
  
  return viewScore + recencyScore + randomScore;
}

/**
 * Get recommended products based on view patterns
 * @param allProducts - All available products
 * @param count - Number of recommendations to return
 * @returns Array of recommended products
 */
export function getRecommendedProducts(allProducts: Product[], count: number = 12): Product[] {
  // If no views yet, return a curated selection of popular items
  const totalViews = Object.values(productViews).reduce((sum, views) => sum + views, 0);
  
  if (totalViews < 5) {
    // Return pre-selected popular items for cold start
    // Prioritize certain product names and categories
    const popularKeywords = ['cheese', 'pepperoni', 'wings', 'buffalo', 'marinara', 'caesar', 'italian'];
    const popularCategories = ['pizzas', 'specialty-pizza', 'wings', 'appetizers', 'pasta', 'cheesesteaks'];
    
    const popularProducts = allProducts.filter(p => {
      const categoryMatch = popularCategories.includes(p.category || '');
      const nameMatch = popularKeywords.some(keyword => 
        (p.name || '').toLowerCase().includes(keyword)
      );
      return categoryMatch || nameMatch;
    });
    
    // If we don't have enough popular products, add random ones
    if (popularProducts.length < count) {
      const remaining = allProducts.filter(p => !popularProducts.includes(p));
      popularProducts.push(...remaining.slice(0, count - popularProducts.length));
    }
    
    // Shuffle and return
    return popularProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }
  
  // Calculate scores for all products
  const scoredProducts = allProducts.map(product => ({
    product,
    score: calculateScore(product.id)
  }));
  
  // Sort by score and return top products
  scoredProducts.sort((a, b) => b.score - a.score);
  
  return scoredProducts.slice(0, count).map(item => item.product);
}

/**
 * Get view count for a product (for debugging/testing)
 */
export function getProductViews(productId: string): number {
  return productViews[productId] || 0;
}

/**
 * Reset all tracking data (for testing)
 */
export function resetTracking(): void {
  Object.keys(productViews).forEach(key => delete productViews[key]);
  Object.keys(productLastViewed).forEach(key => delete productLastViewed[key]);
  
  // Clear localStorage
  localStorage.removeItem('passariello_product_views');
  localStorage.removeItem('passariello_last_viewed');
}
