export interface ToppingOption {
  id: string;
  name: string;
  price?: number;
}

export const saladBases: ToppingOption[] = [
  { id: 'mixed-greens', name: 'Mixed Greens' },
  { id: 'romaine', name: 'Romaine Lettuce' },
  { id: 'spinach', name: 'Spinach' },
  { id: 'iceberg', name: 'Iceberg Lettuce' },
  { id: 'mix-iceberg-romaine', name: 'Mix Iceberg and Romaine' },
];

export const saladDressings: ToppingOption[] = [
  { id: 'balsamic', name: 'Balsamic Vinaigrette' },
  { id: 'balsamic-oil', name: 'Balsamic Vinegar & Oil' },
  { id: 'blue-cheese', name: 'Blue Cheese' },
  { id: 'buffalo', name: 'Buffalo' },
  { id: 'caesar', name: 'Caesar' },
  { id: 'chipotle-ranch', name: 'Chipotle Ranch' },
  { id: 'creamy-italian', name: 'Creamy Italian' },
  { id: 'fat-free-italian', name: 'Fat Free Italian' },
  { id: 'fat-free-ranch', name: 'Fat Free Ranch' },
  { id: 'french', name: 'French' },
  { id: 'honey-mustard', name: 'Honey Mustard' },
  { id: 'lemon-oil', name: 'Lemon Oil', price: 0.00 },
  { id: 'lite-caesar', name: 'Lite Caesar' },
  { id: 'ranch', name: 'Ranch' },
  { id: 'red-wine-vinegar-oil', name: 'Red Wine Vinegar & Oil' },
  { id: 'russian', name: 'Russian' },
  { id: 'white-balsamic-oil', name: 'White Balsamic Vinegar & Oil', price: 0.00 },
  { id: 'no-dressing', name: 'No Dressing' },
];

export const dressingInstructions: ToppingOption[] = [
  { id: 'on-side', name: 'Dressing on the Side' },
  { id: 'light', name: 'Light Dressing' },
  { id: 'extra', name: 'Extra Dressing' },
  { id: 'mixed', name: 'Mixed In' },
];

export const extraDressings: ToppingOption[] = [
  { id: 'extra-balsamic', name: 'Extra Balsamic Vinaigrette', price: 1.99 },
  { id: 'extra-balsamic-oil', name: 'Extra Balsamic Vinegar & Oil', price: 1.99 },
  { id: 'extra-blue-cheese', name: 'Extra Blue Cheese', price: 1.99 },
  { id: 'extra-buffalo', name: 'Extra Buffalo', price: 1.99 },
  { id: 'extra-caesar', name: 'Extra Caesar', price: 1.99 },
  { id: 'extra-chipotle-ranch', name: 'Extra Chipotle Ranch', price: 1.99 },
  { id: 'extra-creamy-italian', name: 'Extra Creamy Italian', price: 1.99 },
  { id: 'extra-fat-free-italian', name: 'Extra Fat Free Italian', price: 1.99 },
  { id: 'extra-fat-free-ranch', name: 'Extra Fat Free Ranch', price: 1.99 },
  { id: 'extra-french', name: 'Extra French', price: 1.99 },
  { id: 'extra-honey-mustard', name: 'Extra Honey Mustard', price: 1.99 },
  { id: 'extra-lemon-oil', name: 'Extra Lemon Oil', price: 1.99 },
  { id: 'extra-lite-caesar', name: 'Extra Lite Caesar', price: 1.99 },
  { id: 'extra-ranch', name: 'Extra Ranch', price: 1.99 },
  { id: 'extra-red-wine-vinegar-oil', name: 'Extra Red Wine Vinegar & Oil', price: 1.99 },
  { id: 'extra-russian', name: 'Extra Russian', price: 1.99 },
  { id: 'extra-white-balsamic-oil', name: 'Extra White Balsamic Vinegar & Oil', price: 1.99 },
];

export const specialInstructions: ToppingOption[] = [
  { id: 'no-onions', name: 'No Onions' },
  { id: 'no-tomatoes', name: 'No Tomatoes' },
  { id: 'no-cheese', name: 'No Cheese' },
  { id: 'no-croutons', name: 'No Croutons' },
  { id: 'extra-veggies', name: 'Extra Vegetables' },
  { id: 'well-done', name: 'Well Done (if applicable)' },
];