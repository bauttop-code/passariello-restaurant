
// Interface for options
export interface SeafoodOption {
  id: string;
  name: string;
  price: number;
  image?: string;
}

// Calamari Sub Sauce Options
export const calamariSubSauceOptions: SeafoodOption[] = [
  { id: 'cal1', name: 'Marinara Sauce', price: 0.00 },
  { id: 'cal2', name: 'White wine garlic sauce', price: 0.00 },
];

// Mussels Sauce Choice Options
export const musselsSauceOptions: SeafoodOption[] = [
  { id: 'mus2', name: 'Marinara Sauce', price: 0.00 },
  { id: 'mus1', name: 'White wine garlic sauce', price: 0.00 },
];

// Seafood Combo Sauce Choice Options
export const seafoodComboSauceOptions: SeafoodOption[] = [
  { id: 'sfc1', name: 'Marinara Sauce', price: 0.00 },
  { id: 'sfc2', name: 'White wine garlic sauce', price: 0.00 },
];

// Shrimp Marinara Sub Sauce Options
export const shrimpMarinaraSubSauceOptions: SeafoodOption[] = [
  { id: 'shm1', name: 'Sub White Sauce', price: 0.00 },
];

// Calamari & Shrimp Marinara Appetizer Sauce Choice (sf-2, app17)
export const marinaraAppetizerSauceOptions: SeafoodOption[] = [
  { id: 'mas1', name: 'Marinara Sauce', price: 0.00 },
  { id: 'mas2', name: 'White wine garlic sauce', price: 0.00 },
];

// Seafood Pasta Types (for sf-6, sf-7, sf-8, sf-9, sf-10)
export const seafoodPastaTypes: SeafoodOption[] = [
  { id: 'sfp2', name: 'Penne', price: 0.00, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { id: 'sfp4', name: 'Capellini', price: 0.00, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { id: 'sfp5', name: 'Fettuccine', price: 0.00, image: 'https://images.unsplash.com/photo-1611171711882-7d7a1f5c1280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { id: 'sfp8', name: 'Gluten Free Penne', price: 4.00, image: 'https://drive.google.com/thumbnail?id=19DhUTVbcnbkHioBLbq9wZx-NRCvvu7Nl&sz=w1000' },
  { id: 'sfp3', name: 'Linguine', price: 0.00, image: 'https://images.unsplash.com/photo-1611171711882-7d7a1f5c1280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { id: 'sfp7', name: 'Gnocchi', price: 2.00, image: 'https://drive.google.com/thumbnail?id=1fWZ6wibVSHz7SNWTaCKN38ycxbUt9k2z&sz=w1000' },
  { id: 'sfp9', name: 'Rigatoni', price: 0.00, image: 'https://images.unsplash.com/photo-1646953568310-8def6eb5a317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWdhdG9uaSUyMHBhc3RhfGVufDF8fHx8MTc2NDM2NzE5OXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'sfp1', name: 'Spaghetti', price: 0.00, image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { id: 'sfp6', name: 'Ziti', price: 0.00, image: 'https://drive.google.com/thumbnail?id=1JvFSnnImV1DJHodwU77OH3xN6zr7ekB8&sz=w1080' },
];
