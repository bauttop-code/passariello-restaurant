import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
import { Header } from './components/Header';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSideMenu } from './components/MobileSideMenu';
import { MobileHomeScreen } from './components/MobileHomeScreen';
import { MobileMoreScreen } from './components/MobileMoreScreen';
import { MobileReorderScreen } from './components/MobileReorderScreen';
import { MobileSettingsScreen } from './components/MobileSettingsScreen';
import { MobileDeliveryModal } from './components/MobileDeliveryModal';
import { OrdersDialog } from './components/OrdersDialog';
// import { PromoBanner } from './components/PromoBanner';
import { ProductCard, Product } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Footer } from './components/Footer';
import { LocationSelector } from './components/LocationSelector';
import { LocationDetailView } from './components/LocationDetailView';
import { FloatingMenu } from './components/FloatingMenu';
import { OrderTypeSelection } from './components/OrderTypeSelection';
import { GuestFavorites } from './components/GuestFavorites';
import { ConfirmPickupDialog } from './components/ConfirmPickupDialog';
import { WelcomeOrderTypeModal } from './components/WelcomeOrderTypeModal';
import { OrderTypePanel } from './components/OrderTypePanel';
import { LocationRequiredModal } from './components/LocationRequiredModal';
import { DeliveryDebugPanel } from './components/DeliveryDebugPanel';
import { Toaster } from './components/ui/sonner';
import { Search } from 'lucide-react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { cheesesteaksProducts } from './data/cheesesteaks';
import { wingsProducts } from './data/wings';
import { saladsProducts } from './data/salads';
import { appetizersProducts } from './data/appetizers';
import { useBodyScrollLockFix } from './hooks/useBodyScrollLockFix';
import { useRequiredUserLocation } from './hooks/useRequiredUserLocation';
import { getDeliveryEligibility, type Store } from './utils/deliveryEligibility';
import { getPickupEligibility, type PickupStore } from './utils/pickupEligibility';
import { useAutoLocationResolution } from './hooks/useAutoLocationResolution';
import { getSupabaseClient } from './utils/supabase/client';
import { trackProductView, getRecommendedProducts } from './utils/productRecommendations';
import traditionalDinnersImage1 from 'figma:asset/3d529cb84ae66dbfa34608dfbb0b31f962071207.png';
import traditionalDinnersImage2 from 'figma:asset/754da828dbf51bd8e4e1463a5b58479fab3fb1ff.png';

// Import catering seafood image
import cateringSeafoodImg from 'figma:asset/25ef617226e52310fed403c72ab2a5d79ef8a874.png';

// Import burger images
import cheeseburgerImg from 'figma:asset/2b15ff29dbcb3817ed3264be55d300a6d29152f8.png';
import cheeseburgerDeluxeImg from 'figma:asset/0f5f2868e77d97d95f8c64e3bae24e2821ba16c0.png';
import pizzaBurgerImg from 'figma:asset/2b15ff29dbcb3817ed3264be55d300a6d29152f8.png';
import hamburgerImg from 'figma:asset/2b15ff29dbcb3817ed3264be55d300a6d29152f8.png';

// Import fish images
import fishPlatesImg from 'figma:asset/1d7b73bd5fd97a7ba58c7339a8bbec262dbb6066.png';



// Create Your Own Pizza Products
const createYourOwnPizzas: Product[] = [
  {
    id: 'cyo-napoletana',
    name: 'Napoletana',
    description: 'Traditional Neapolitan style thin crust pizza',
    price: '$17.99',
    priceRange: '$17.99 - $18.99 - $20.99',
    image: 'https://drive.google.com/thumbnail?id=1-o9lh6hYTKwlfmbZvc2F0WZtYXuYamLq&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-napoletana-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-white',
    name: 'White',
    description: 'Thin, round & brushed with garlic, olive oil & mozzarella cheese.',
    price: '$17.99',
    priceRange: '$17.99 - $18.99 - $20.99',
    image: 'https://drive.google.com/thumbnail?id=15i3B4i96bplLEv9738B3OfY4hDM9E1-P&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-white-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-sicilian',
    name: 'Sicilian',
    description: 'Thick crust square pizza with mozzarella cheese',
    price: '$22.99',
    priceRange: '$22.99',
    image: 'https://drive.google.com/thumbnail?id=1hAS5JonLefoHXNrqadW7zbBUxhDEUyC5&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-sicilian-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-sicilian-pesto',
    name: 'Sicilian Pesto',
    description: 'Thick crust. Marinara sauce, mozzarella and pecorino cheese, oregano, and pesto.',
    price: '$23.99',
    priceRange: '$23.99',
    image: 'https://drive.google.com/thumbnail?id=1kparNIlZZx-VQMRFhsmKSfFs7QxY4III&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-sicilian-pesto-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
          { id: 'no-pesto', name: 'No Pesto', price: 0 },
        ],
      },
      {
        id: 'cyo-sicilian-pesto-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-pan',
    name: 'Pan Pizza',
    description: 'Thick round pan baked pizza',
    price: '$20.49',
    priceRange: '$20.49',
    image: 'https://drive.google.com/thumbnail?id=195ZzCvra0Q9W-IH7_eVnPs5nFPAePfwd&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-pan-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-gf12',
    name: 'Gluten Free 12"',
    description: '(6 Slices). Thin & round Gluten-Free crust.',
    price: '$16.49',
    priceRange: '$16.49',
    image: 'https://drive.google.com/thumbnail?id=194q9lg8EKREYP0AkX-tHv9A_G87D58bP&sz=w1000',
    category: 'pizzas',
    customizationOptions: [
      {
        id: 'cyo-gf12-special-instructions',
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        multiple: true,
        options: [
          { id: 'half-white', name: 'Half White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'cyo-cauliflower',
    name: 'Cauliflower Gluten Free 10"',
    description: '(4 Slices). Thin & round Cauliflower crust.',
    price: '$12.99',
    priceRange: '$12.99',
    image: 'https://drive.google.com/thumbnail?id=1XaXUfeHhv6OiJ6Vh84zPy_fkcnIjbTQ7&sz=w1000',
    category: 'pizzas',
  },
  {
    id: 'cyo-minucci',
    name: 'Minucci 8"',
    description: '( 4 Slices )Whole wheat, thin and round',
    price: '$9.99',
    priceRange: '$9.99 - $12.99',
    image: 'https://drive.google.com/thumbnail?id=131vpwTUJIsszd5lTA8bmKG5cjxe4om8M&sz=w1000',
    category: 'pizzas',
  },
];

// Minucci Pizzas Products
const minucciPizzas: Product[] = [
  {
    id: 'minucci-1',
    name: 'Minucci Broccoli & Tomato',
    description: '8" Whole wheat thin crust topped with broccoli, tomatoes, mozzarella cheese, and pecorino cheese.',
    price: '$12.99',
    priceRange: '$12.99',
    image: 'https://drive.google.com/thumbnail?id=1WmCHR68OQCwhR2hWifrs9hf6nXlJ5fxW&sz=w1000',
    category: 'minucci-pizzas',
    customizationOptions: [
      {
        id: 'minucci-1-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-broccoli', name: 'No Broccoli', price: 0 },
          { id: 'no-tomatoes', name: 'No Tomatoes', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'minucci-2',
    name: 'Minucci Margherita',
    description: '8" Whole wheat thin crust topped with marinara sauce, fresh mozzarella and basil.',
    price: '$9.99',
    priceRange: '$9.99',
    image: 'https://drive.google.com/thumbnail?id=1ioMwjTgR4dluMdWH57xK1R8Lz4z0pB8d&sz=w1000',
    category: 'minucci-pizzas',
    customizationOptions: [
      {
        id: 'minucci-2-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'minucci-3',
    name: 'Minucci Quattro Gusti.',
    description: '8" Whole wheat thin crust topped with roasted red peppers, artichokes, zucchini, eggplant, basil, fresh mozzarella and pecorino cheese.',
    price: '$12.99',
    priceRange: '$12.99',
    image: 'https://drive.google.com/thumbnail?id=1y_msNiMndrh1-7QPslKEJrS_mHhOri_p&sz=w1000',
    category: 'minucci-pizzas',
    customizationOptions: [
      {
        id: 'minucci-3-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-red-peppers', name: 'No Roasted Red Peppers', price: 0 },
          { id: 'no-artichokes', name: 'No Artichokes', price: 0 },
          { id: 'no-zucchini', name: 'No Zucchini', price: 0 },
          { id: 'no-eggplant', name: 'No Eggplant', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
        ],
      },
    ],
  },
];

// Brooklyn Style Pizza Products
const brooklynPizzaProducts: Product[] = [
  {
    id: 'brooklyn-1',
    name: 'Brooklyn Caprese',
    description: 'Marinara sauce, cherry tomatoes, fresh mozzarella, garlic, basil ribbons and oil.',
    price: '$24.99',
    priceRange: '$24.99',
    image: 'https://drive.google.com/thumbnail?id=171aQqiYT8hPoNLgatwHXXYxShSpQcAfF&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-2',
    name: 'Brooklyn Eggplant Parmigiana',
    description: 'Mozzarella cheese, baked breaded eggplant, marinara sauce, pecorino cheese, and basil ribbons.',
    price: '$24.99',
    priceRange: '$24.99',
    image: 'https://drive.google.com/thumbnail?id=1IyE2W2bUXXJWKSF0pbgCw8tEYbRWsjsg&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-3',
    name: 'Brooklyn Margherita',
    description: 'Margherita sauce, pecorino cheese, fresh mozzarella and basil.',
    price: '$22.49',
    priceRange: '$22.49',
    image: 'https://drive.google.com/thumbnail?id=1E5hPLB5CFWJw9ZVuNs6tHV2XyD9bkl7c&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-4',
    name: 'Brooklyn Shrimp',
    description: 'Scampi sauce, feta cheese, provolone, parsley, shrimp (30), mozzarella, Old Bay Spice, garlic and oil.',
    price: '$37.99',
    priceRange: '$37.99',
    image: 'https://drive.google.com/thumbnail?id=12LEQvkVS5oqr3zNANNKnYqIthY8gDF0d&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-5',
    name: 'Creamy Garlic',
    description: 'Fresh mozzarella cheese, garlic, creamy alfredo, feta cheese, dash of marinara sauce and pesto basil.',
    price: '$24.99',
    priceRange: '$24.99',
    image: 'https://drive.google.com/thumbnail?id=1PtFWnek1KbunjxEPWrl-Bk7B0kqF172v&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-6',
    name: 'Mediterranea',
    description: 'Eggplant, marinara sauce, sun-dried tomatoes, roasted red peppers, onions, black olives, fresh mozzarella and oregano.',
    price: '$28.99',
    priceRange: '$28.99',
    image: 'https://drive.google.com/thumbnail?id=1tVlEZYZ94IXGmcmFvLlgG2P8sleb3rOU&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-7',
    name: 'Roman',
    description: 'Mozzarella, zucchini, roasted red peppers, sun-dried tomatoes, green olives, mushrooms, pesto and oregano.',
    price: '$28.99',
    priceRange: '$28.99',
    image: 'https://drive.google.com/thumbnail?id=1KEmzr4nZG4HacG0-vVMNMRV1pMdSG9s9&sz=w1000',
    category: 'brooklyn-pizza',
  },
  {
    id: 'brooklyn-8',
    name: 'Brooklyn Grandma',
    description: 'Mozzarella cheese, marinara sauce, pecorino cheese, oregano, basil ribbons.',
    price: '$22.49',
    priceRange: '$22.49',
    image: 'https://drive.google.com/thumbnail?id=1in5R0r6y_geflfxJNi7FkY4tWLq3NLCa&sz=w1000',
    category: 'brooklyn-pizza',
  },
];

// Stromboli & Calzone Products
const stromboliImg = 'https://drive.google.com/thumbnail?id=19yb5mjh06MuLpDYZcjl2gEsajdWBDJL8&sz=w1000';
const calzoneImg = 'https://drive.google.com/thumbnail?id=1ysxJ_RrhqDpmaQAscDLQXk9nUv5hU_Lm&sz=w1000';

const stromboliCalzoneProducts: Product[] = [
  {
    id: 'stromboli-1',
    name: 'Buffalo Chicken Stromboli',
    description: 'Chicken Steak mixed in our homemade buffalo sauce and mozzarella cheese. Served with your choice of bleu cheese or ranch.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-2',
    name: 'Cheese Stromboli',
    description: 'Served with a cup of Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-3',
    name: 'Chicken Steak Stromboli',
    description: 'Chicken steak and mozzarella. Served with a cup of Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-4',
    name: 'Italiano Stromboli',
    description: 'Chicken steak and mozzarella. Served with a cup of Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-5',
    name: 'Passariello Stromboli',
    description: 'Pepperoni, sausage, mushrooms and mozzarella. Served with our Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-6',
    name: 'Steak Stromboli',
    description: 'Beef steak and mozzarella, served with a cup of Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-7',
    name: 'Veggie Stromboli',
    description: 'Tomatoes, mushrooms, broccoli, garlic, mixed peppers and mozzarella. Served with a cup of Pomodoro sauce on the side.',
    price: '$20.99',
    priceRange: '$13.99 - $20.99',
    image: stromboliImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'calzone-1',
    name: 'Turnover',
    description: 'Mozzarella and Pomodoro sauce baked inside. Served with our Pomodoro sauce on the side.',
    price: '$17.99',
    priceRange: '$12.49 - $17.99',
    image: 'https://drive.google.com/thumbnail?id=1rB67G0E2V1fwCPaba9ThPVeqtQOur0rY&sz=w1000',
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'calzone-2',
    name: 'Calzone',
    description: 'Stuffed with mozzarella and ricotta cheese. Served with our Pomodoro sauce on the side.',
    price: '$17.99',
    priceRange: '$12.49 - $17.99',
    image: calzoneImg,
    category: 'stromboli-calzone',
    hasToppings: true,
  },
  {
    id: 'stromboli-8',
    name: 'Pepperoni Roll',
    description: 'Pepperoni, mozzarella, and american cheese. Served with a side of Pomodoro sauce.',
    price: '$8.49',
    image: 'https://drive.google.com/thumbnail?id=1e8B1xyfVXwl4AFys_v64huM7hGlWCZmr&sz=w1000',
    category: 'stromboli-calzone',
    hasToppings: true,
  },
];

// By the Slice Products
const byTheSliceProducts: Product[] = [
  {
    id: 'slice-1',
    name: 'Focaccia Slice',
    description: 'Thick crust pan baked and topped with our homemade marinara sauce, roasted garlic and fresh basil ribbons.',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1UaXYVrnzxFI-mSUcUIPqkUe_pyJKsRQW&sz=w1000',
    category: 'by-the-slice',
  },
  {
    id: 'slice-2',
    name: 'Plain Slice',
    description: 'Traditional round thin.',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=18ruRtTRT14PX6DroQrxlt2hx5qXCyxaF&sz=w1000',
    category: 'by-the-slice',
  },
  {
    id: 'slice-3',
    name: 'Sicilian Slice',
    description: 'Thick square pan baked.',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1naGiJjRFzhiusGD58RL00lT4MQGJp8xO&sz=w1000',
    category: 'by-the-slice',
  },
  {
    id: 'slice-4',
    name: 'White Slice',
    description: 'Brushed with garlic and olive oil.',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1DQWoSFVakn1fCu14J1ZmJpBvH2DoBDML&sz=w1000',
    category: 'by-the-slice',
  },
];

// Traditional Dinners Products
const traditionalDinnersProducts: Product[] = [
  {
    id: 'td-1',
    name: 'Chicken Alla Vodka',
    description: 'Chicken breasts, coated in seasoned flour and a light egg batter, topped with our homemade creamy vodka sauce. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=18_wINvmWrePaMcr0rNMOc7FUavAbBrVU&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-2',
    name: 'Chicken Cacciatore',
    description: 'Chicken strips lightly breaded with flour sautéed with onions, white wine, spices, and marinara sauce. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=13-fm6ymVy36W9LuLtqJ7ZguGjfInrLiY&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-3',
    name: 'Chicken Caprese',
    description: 'Grilled Chicken topped with our homemade caprese mix and drizzled with balsamic glaze. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=1DKAGJhv2f8gMRqhg15KP7PAqAmB7naA3&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-4',
    name: 'Chicken Cordon Bleu',
    description: 'Chicken breast, lightly breaded with seasoned flour and dipped in egg batter, stuffed with ham and american cheese. Served with a side of our homemade creamy vodka sauce and fresh homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=1js0fjN7f_8FYPta28K9H8XH65GhzH4nS&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-5',
    name: 'Chicken Francese',
    description: 'Chicken breasts, lightly battered in seasoned flour and egg, finished with a white wine and lemon butter sauce. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=1zyWQO1Etg43UIZSBdDZxR0Ynzc1rrS2q&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-6',
    name: 'Chicken Marsala',
    description: 'Chicken breasts, lightly coated in seasoned flour, sautéed with fresh mushrooms in a creamy marsala sauce. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=18eQ5lvHPaxl2K6H-6SlGs3o61bdla1Li&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-7',
    name: 'Chicken Parmigiana',
    description: 'Tender chicken cutlets, dipped in seasoned flour and a light egg batter, coated with Italian breadcrumbs, topped with savory pomodoro sauce, and melted mozzarella. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=13kkfGfRdUa9ib2gMfEiPEzW_x8IIDvlJ&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-8',
    name: 'Eggplant Parmigiana',
    description: 'Four layers of fresh-baked breaded eggplant, grated parmesan cheese, pomodoro sauce, and topped with melted mozzarella cheese. Served with a side of our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=18B38B5PIemFiZxuErRJRu3hrHaBSs1Wc&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-9',
    name: 'Eggplant Rollatini',
    description: '(3) Fresh baked eggplant cutlets, rolled and stuffed with ricotta, topped with pomodoro sauce and mozzarella. Served with a side of fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=18B38B5PIemFiZxuErRJRu3hrHaBSs1Wc&sz=w1000',
    category: 'traditional-dinners',
  },
  {
    id: 'td-10',
    name: 'Roasted Chicken',
    description: 'Roasted seasoned half chicken and fresh rosemary. Served with a side of fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=1C6iuzpQqoa6LpB4H4UvQa7TwixL2F4fJ&sz=w1000',
    category: 'traditional-dinners',
  },
];

// Create Your Own Pasta Products
const createPastaProducts: Product[] = [
  {
    id: 'cp-1',
    name: 'Build Your Own Pasta',
    description: 'Choose your pasta, sauce, and toppings',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1KZlRhe496nIZu9LJaMbwCXJSI01x4yQx&sz=w1000',
    category: 'create-pasta',
  },
];

// Pasta Products
const pastaProducts: Product[] = [
  // Regular Pasta
  {
    id: 'pasta-1',
    name: 'Alfredo Sauce',
    description: 'Heavy cream, butter and pecorino cheese. Served with our fresh baked homemade bread.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1rZIRDMfpbmzGypgw2gaJNn4p0DizVeV1&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-2',
    name: 'Bolognese Sauce',
    description: 'Vine-ripened fresh tomatoes, sautéed lean ground beef, olive oil, onions, carrots, Italian spices and basil. Served with our fresh baked homemade bread.',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=1toDglS09efc9ZspYl3fNc_o4fBudOrdv&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-3',
    name: 'Garlic & Oil',
    description: 'Fresh garlic sautéed in olive oil and Italian spices. Served with our fresh baked homemade bread.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1dGKmemolMs3Xu0roP7O98028DMI5-RJE&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-4',
    name: 'Gnocchi Alla Sorrentina',
    description: 'Marinara sauce, fresh mozzarella, pecorino cheese and basil. Served with our fresh baked homemade bread.',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=1XlBclIzKHKZseW8pXg0ysKFmQ58gmA2s&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-5',
    name: 'Marinara Sauce',
    description: 'Vine-ripened fresh tomatoes, garlic, olive oil and fresh basil. Served with our fresh baked homemade bread.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=19r_ISTtvJc9WAPWoJqtXV3UZJUNvz0Yo&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-6',
    name: 'Mushroom Sauce',
    description: 'Fresh sliced mushrooms, garlic, sautéed in marinara sauce. Served with our fresh baked homemade bread.',
    price: '$14.49',
    image: 'https://drive.google.com/thumbnail?id=1Qcek_MmvxxYuVrJ-Q72z0Nv5WIAreTkN&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-7',
    name: 'Pasta with Meatballs',
    description: '(2) Baked Italian seasoned meatballs served with our pomodoro sauce.',
    price: '$16.99',
    image: 'https://drive.google.com/thumbnail?id=1M2cJh1yIdIya0hzHH4Nr8ta-qW1YpVKF&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-8',
    name: 'Pomodoro Sauce',
    description: 'Vine-ripened fresh tomatoes, onions, carrots, hint of garlic, Italian spices and basil. Served with our fresh baked homemade bread.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1_cydxB3cCNSNS_6po0G070Ud-3oyTXPq&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-9',
    name: 'Pomodoro Sauce with Sausage',
    description: 'Pasta with (2) sausages served in our Pomodoro sauce. Served with our fresh baked homemade bread.',
    price: '$16.99',
    image: 'https://drive.google.com/thumbnail?id=1QqsdG3YatAZb1W34OrFv_r0mTuIqwBYZ&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-10',
    name: 'Sausage & Roasted Peppers',
    description: 'Sausage & roasted red pepper sauce sauteed to make a hearty Italian specialty',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=1qAoGivLdbLlBmeJW3LFoZJcWp57xkRV0&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-11',
    name: 'Vodka Sauce',
    description: 'Fresh tomatoes, blended with heavy cream, parmesan and a hint of vodka. Served with our fresh baked homemade bread.',
    price: '$14.49',
    image: 'https://drive.google.com/thumbnail?id=1Zma9py9fX7tFp0oy6YtuPrfwVfqf4Pnf&sz=w1000',
    category: 'pasta',
  },
  {
    id: 'pasta-12',
    name: 'Pasta Alla Passariello',
    description: 'Sautéed sliced mushrooms, chopped ham, garlic, and onions in olive oil, deglazed with a splash of white wine, and cooked in a blush sauce. Served with a side of our fresh baked homemade bread.',
    price: '$16.49',
    image: 'https://drive.google.com/thumbnail?id=1emSQwD76QRqnlFhF7zpqa_fIidO2T3Zf&sz=w1000',
    category: 'pasta',
  },
  // Baked Pasta
  {
    id: 'baked-pasta-1',
    name: 'Baked Cheese Ravioli',
    description: '(6) Ravioli stuffed with ricotta, topped with Pomodoro sauce and mozzarella cheese. Served with a side of fresh baked homemade bread.',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=1GO8bF2ojSY3lWRSj52Iexdc89p9J6OYn&sz=w1000',
    category: 'baked-pasta',
  },
  {
    id: 'baked-pasta-2',
    name: 'Baked Cheese Tortellini',
    description: 'Round pasta filled with ricotta cheese, topped with Pomodoro sauce and mozzarella cheese. Served with a side of fresh baked homemade bread.',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=1gO18Ob9R4iFsXXFtfKw1vS87qfaARsCj&sz=w1000',
    category: 'baked-pasta',
  },
  {
    id: 'baked-pasta-3',
    name: 'Baked Gnocchi',
    description: 'Gnocchi with a blend of ricotta and pecorino cheeses, topped with Pomodoro sauce and mozzarella cheese. Served with a side of fresh baked homemade bread.',
    price: '$15.49',
    image: 'https://drive.google.com/thumbnail?id=17MizwXJ574g8w83q6ft2Naz79VYmbKK7&sz=w1000',
    category: 'baked-pasta',
  },
  {
    id: 'baked-pasta-4',
    name: 'Baked Ziti',
    description: 'Ziti with a blend of ricotta cheese and Pomodoro sauce, topped with mozzarella cheese. Served with a side of our fresh baked homemade bread.',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=1cct56RVcXKeZIC5mjJJAkc-5WNoF7YWt&sz=w1000',
    category: 'baked-pasta',
  },
  {
    id: 'baked-pasta-5',
    name: 'Classic Lasagna',
    description: '(Ground Beef) Five Layers of wide pasta ribbons, layered with a blend of Bolognese sauce, ricotta cheese, Pomodoro sauce, and topped with mozzarella cheese. Served with a side of fresh baked homemade bread.',
    price: '$15.99',
    image: 'https://drive.google.com/thumbnail?id=19Fy2sZjMdKZGh3TmtGCYX3de_1SWYsQb&sz=w1000',
    category: 'baked-pasta',
  },
  {
    id: 'baked-pasta-6',
    name: 'Baked Stuffed Shells',
    description: '(5) Ricotta cheese stuffed pasta shells topped with Pomodoro sauce and mozzarella cheese. Served with a side of fresh baked homemade bread.',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=1iNCyVfTo6dQf10huT8DVzejNmeY9PofX&sz=w1000',
    category: 'baked-pasta',
  },
];

// Sides Products
const sidesProducts: Product[] = [
  {
    id: 'side-1',
    name: 'Broccoli',
    description: 'Fresh, cut crowns, steamed with olive oil and garlic.',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1K4Gzs-HYBa2bFz2MH75DyyxB5xm6Jf_A&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-2',
    name: 'Cauliflower Medley',
    description: 'Cauliflower roasted with zucchini, mixed peppers and raisins.',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1YFMgKJs_daVrsP7FgvPIEP53TrEF11Y0&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-3',
    name: 'Garden Rice',
    description: 'Steamed rice mixed with a fresh vegetable medley of carrots, peppers, onions, and peas.',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1gYbFAsbcBCGsW4jXrTWvIf5Zc8y2JNeP&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-4',
    name: 'Mashed Potatoes',
    description: 'Creamy and smooth Mashed Potatoes. (with or without gravy)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1yVPvnVHqFjW2ni7YGl9RHpx6fRg--NcK&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-5',
    name: 'Meatballs',
    description: '(Beef) Served in Pomodoro sauce with freshly baked, homemade bread.',
    price: '$9.49',
    image: 'https://drive.google.com/thumbnail?id=1Ynag62AV-JgSopOQ3h3ouWwarYBhlufz&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-6',
    name: 'Roasted Potatoes',
    description: 'Fresh hand cut potatoes roasted with carrots, onions and a dash of marinara sauce.',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=17MwPTMNGDiXEof86opqisehooBQf6Rvr&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-7',
    name: 'Sausage',
    description: 'Served in Pomodoro sauce with fresh baked homemade bread (2 Sausages).',
    price: '$9.49',
    image: 'https://drive.google.com/thumbnail?id=1VbYyk-he0f5GQ3La2jQKTjtnYQ6Ygzqo&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-8',
    name: 'String Beans and Carrots',
    description: 'Fresh green beans and carrots sauteed in olive oil and garlic.',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=11ZH1BrZH9qdfh6yCUVnsIBDQbDWHZZMW&sz=w1000',
    category: 'sides',
  },
  {
    id: 'side-9',
    name: 'Side of Bread',
    description: 'Passariello\'s homemade, fresh baked roll (1 Piece).',
    price: '$0.55',
    image: 'https://drive.google.com/thumbnail?id=1IvFgnN1WG37YCyBNpDof1Exz5hcPJpeh&sz=w1000',
    category: 'sides',
  },
];

// Seafood Products
const seafoodProducts: Product[] = [
  {
    id: 'sf-1',
    name: 'Fried Shrimp',
    description: 'Golden fried shrimp served with cocktail sauce',
    price: '$19.99',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
    category: 'seafood',
  },
  {
    id: 'sf-2',
    name: 'Calamari Marinara Appetizer',
    description: 'Tender calamari sauteed in garlic, olive oil and homemade marinara sauce. Served with our fresh baked homemade bread.',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=1duYLTM4UosYH9FO-V0BPW-f_8WukGcYq&sz=w1000',
    category: 'seafood',
  },
  {
    id: 'sf-3',
    name: 'Mussels Appetizer',
    description: 'Steamed mussels sautéed in garlic & olive oil, with your choice of marinara sauce or white wine sauce. Served with our fresh baked homemade bread.',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=1MNqq69VuluMlXo_iGTz9coZaUgg5KE-Y&sz=w1000',
    category: 'seafood',
  },
  {
    id: 'sf-4',
    name: 'Seafood Combo Appetizer',
    description: 'Mussels, shrimp, and calamari sauteed in garlic & olive oil, with your choice of marinara sauce or white wine sauce. Served with our fresh baked homemade bread.',
    price: '$17.49',
    image: 'https://drive.google.com/thumbnail?id=1124OqaoFK0waUTIP_vPt41rjxYRgtFyE&sz=w1000',
    category: 'seafood',
  },
  {
    id: 'sf-5',
    name: 'Shrimp Marinara Appetizer',
    description: 'Peeled shrimp sauteed in garlic, olive oil and homemade marinara sauce. Served with our fresh baked homemade bread.',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=1BCBEkY4eq5WgKSXNjhWKPgb6Q5EmukCW&sz=w1000',
    category: 'seafood',
  },
  {
    id: 'sf-6',
    name: 'Calamari Marinara',
    description: 'Tender calamari sautéed in garlic, olive oil and marinara sauce. Served with a side of fresh baked homemade bread.',
    price: '$17.49',
    image: 'https://drive.google.com/thumbnail?id=1Xq4Xz9UcZgIHvTPf35R7iRQisSV3YWMW&sz=w1000',
    category: 'seafood',
    customizationOptions: [
      {
        id: 'sf-6-pasta',
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-6-pasta-cappellini', name: 'Cappellini', price: 0 },
          { id: 'sf-6-pasta-fettuccine', name: 'Fettuccine', price: 0 },
          { id: 'sf-6-pasta-fusilli', name: 'Fusilli', price: 0 },
          { id: 'sf-6-pasta-gf-penne', name: 'Gluten Free Penne', price: 4.00 },
          { id: 'sf-6-pasta-gnocchi', name: 'Gnocchi', price: 2.00 },
          { id: 'sf-6-pasta-linguine', name: 'Linguine', price: 0 },
          { id: 'sf-6-pasta-penne', name: 'Penne', price: 0 },
          { id: 'sf-6-pasta-rigatoni', name: 'Rigatoni', price: 0 },
          { id: 'sf-6-pasta-spaghetti', name: 'Spaghetti', price: 0 },
          { id: 'sf-6-pasta-ziti', name: 'Ziti', price: 0 },
        ],
      },
      {
        id: 'sf-6-toppings',
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { id: 'sf-6-topping-mushrooms', name: 'Mushrooms', price: 1.49 },
          { id: 'sf-6-topping-spinach', name: 'Spinach', price: 1.49 },
          { id: 'sf-6-topping-broccoli', name: 'Broccoli', price: 1.49 },
        ],
      },
      {
        id: 'sf-6-sauce',
        title: 'Sub Sauce',
        subtitle: 'Optional',
        required: false,
        maxSelections: 1,
        options: [
          { id: 'sf-6-sauce-white', name: 'Sub White Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sf-7',
    name: 'Clam Sauce',
    description: 'Baby clams sautéed in garlic and olive oil with your choice of marinara sauce or white wine and garlic. Served with a side of fresh baked homemade bread.',
    price: '$17.49',
    image: 'https://drive.google.com/thumbnail?id=19my6DpT_3Sxn-pOmvXoulWvQ8zN8mHHI&sz=w1000',
    category: 'seafood',
    customizationOptions: [
      {
        id: 'sf-7-pasta',
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-7-pasta-cappellini', name: 'Cappellini', price: 0 },
          { id: 'sf-7-pasta-fettuccine', name: 'Fettuccine', price: 0 },
          { id: 'sf-7-pasta-fusilli', name: 'Fusilli', price: 0 },
          { id: 'sf-7-pasta-gf-penne', name: 'Gluten Free Penne', price: 4.00 },
          { id: 'sf-7-pasta-gnocchi', name: 'Gnocchi', price: 2.00 },
          { id: 'sf-7-pasta-linguine', name: 'Linguine', price: 0 },
          { id: 'sf-7-pasta-penne', name: 'Penne', price: 0 },
          { id: 'sf-7-pasta-rigatoni', name: 'Rigatoni', price: 0 },
          { id: 'sf-7-pasta-spaghetti', name: 'Spaghetti', price: 0 },
          { id: 'sf-7-pasta-ziti', name: 'Ziti', price: 0 },
        ],
      },
      {
        id: 'sf-7-toppings',
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { id: 'sf-7-topping-mushrooms', name: 'Mushrooms', price: 1.49 },
          { id: 'sf-7-topping-spinach', name: 'Spinach', price: 1.49 },
          { id: 'sf-7-topping-broccoli', name: 'Broccoli', price: 1.49 },
        ],
      },
      {
        id: 'sf-7-sauce',
        title: 'Sauce Choice',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-7-sauce-white', name: 'White Sauce', price: 0 },
          { id: 'sf-7-sauce-red', name: 'Red Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sf-8',
    name: 'Mussels',
    description: 'Mussels sautéed in garlic, olive oil and Italian spices with your choice of marinara sauce or white wine and garlic. Served with a side of fresh homemade bread.',
    price: '$17.49',
    image: 'https://drive.google.com/thumbnail?id=1jaEDLq_gWdBOged8UO8-U2qAE1WClXa3&sz=w1000',
    category: 'seafood',
    customizationOptions: [
      {
        id: 'sf-8-pasta',
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-8-pasta-cappellini', name: 'Cappellini', price: 0 },
          { id: 'sf-8-pasta-fettuccine', name: 'Fettuccine', price: 0 },
          { id: 'sf-8-pasta-fusilli', name: 'Fusilli', price: 0 },
          { id: 'sf-8-pasta-gf-penne', name: 'Gluten Free Penne', price: 4.00 },
          { id: 'sf-8-pasta-gnocchi', name: 'Gnocchi', price: 2.00 },
          { id: 'sf-8-pasta-linguine', name: 'Linguine', price: 0 },
          { id: 'sf-8-pasta-penne', name: 'Penne', price: 0 },
          { id: 'sf-8-pasta-rigatoni', name: 'Rigatoni', price: 0 },
          { id: 'sf-8-pasta-spaghetti', name: 'Spaghetti', price: 0 },
          { id: 'sf-8-pasta-ziti', name: 'Ziti', price: 0 },
        ],
      },
      {
        id: 'sf-8-toppings',
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { id: 'sf-8-topping-mushrooms', name: 'Mushrooms', price: 1.49 },
          { id: 'sf-8-topping-spinach', name: 'Spinach', price: 1.49 },
          { id: 'sf-8-topping-broccoli', name: 'Broccoli', price: 1.49 },
        ],
      },
      {
        id: 'sf-8-sauce',
        title: 'Sauce Choice',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-8-sauce-white', name: 'White Wine Garlic Sauce', price: 0 },
          { id: 'sf-8-sauce-marinara', name: 'Marinara Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sf-9',
    name: 'Seafood Combo',
    description: 'Mussels, shrimp, & calamari sautéed in garlic & olive oil, served with your choice of white or red sauce. Served with a side of our fresh homemade bread.',
    price: '$21.49',
    image: 'https://drive.google.com/thumbnail?id=1ytQsJiFRqJ2k5sG6C7ywaN0OAGPyEFa1&sz=w1000',
    category: 'seafood',
    customizationOptions: [
      {
        id: 'sf-9-pasta',
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-9-pasta-cappellini', name: 'Cappellini', price: 0 },
          { id: 'sf-9-pasta-fettuccine', name: 'Fettuccine', price: 0 },
          { id: 'sf-9-pasta-fusilli', name: 'Fusilli', price: 0 },
          { id: 'sf-9-pasta-gf-penne', name: 'Gluten Free Penne', price: 4.00 },
          { id: 'sf-9-pasta-gnocchi', name: 'Gnocchi', price: 2.00 },
          { id: 'sf-9-pasta-linguine', name: 'Linguine', price: 0 },
          { id: 'sf-9-pasta-penne', name: 'Penne', price: 0 },
          { id: 'sf-9-pasta-rigatoni', name: 'Rigatoni', price: 0 },
          { id: 'sf-9-pasta-spaghetti', name: 'Spaghetti', price: 0 },
          { id: 'sf-9-pasta-ziti', name: 'Ziti', price: 0 },
        ],
      },
      {
        id: 'sf-9-toppings',
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { id: 'sf-9-topping-mushrooms', name: 'Mushrooms', price: 1.49 },
          { id: 'sf-9-topping-spinach', name: 'Spinach', price: 1.49 },
          { id: 'sf-9-topping-broccoli', name: 'Broccoli', price: 1.49 },
        ],
      },
      {
        id: 'sf-9-sauce',
        title: 'Sauce Choice',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-9-sauce-red', name: 'Red', price: 0 },
          { id: 'sf-9-sauce-white', name: 'White', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sf-10',
    name: 'Shrimp Marinara',
    description: 'Peeled shrimp sautéed in garlic, olive oil and homemade marinara sauce. Served with a side of fresh baked homemade bread.',
    price: '$17.49',
    image: 'https://drive.google.com/thumbnail?id=19kbinWKHjsN4HyoqTqKRJi4CDPSxMg3Z&sz=w1000',
    category: 'seafood',
    customizationOptions: [
      {
        id: 'sf-10-pasta',
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sf-10-pasta-cappellini', name: 'Cappellini', price: 0 },
          { id: 'sf-10-pasta-fettuccine', name: 'Fettuccine', price: 0 },
          { id: 'sf-10-pasta-fusilli', name: 'Fusilli', price: 0 },
          { id: 'sf-10-pasta-gf-penne', name: 'Gluten Free Penne', price: 4.00 },
          { id: 'sf-10-pasta-gnocchi', name: 'Gnocchi', price: 2.00 },
          { id: 'sf-10-pasta-linguine', name: 'Linguine', price: 0 },
          { id: 'sf-10-pasta-penne', name: 'Penne', price: 0 },
          { id: 'sf-10-pasta-rigatoni', name: 'Rigatoni', price: 0 },
          { id: 'sf-10-pasta-spaghetti', name: 'Spaghetti', price: 0 },
          { id: 'sf-10-pasta-ziti', name: 'Ziti', price: 0 },
        ],
      },
      {
        id: 'sf-10-toppings',
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { id: 'sf-10-topping-mushrooms', name: 'Mushrooms', price: 1.49 },
          { id: 'sf-10-topping-spinach', name: 'Spinach', price: 1.49 },
          { id: 'sf-10-topping-broccoli', name: 'Broccoli', price: 1.49 },
        ],
      },
      {
        id: 'sf-10-sauce',
        title: 'Sub Sauce',
        subtitle: 'Optional',
        required: false,
        maxSelections: 1,
        options: [
          { id: 'sf-10-sauce-white', name: 'Sub White Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sf-11',
    name: 'Fried Flounder',
    description: '(2) Fillet of flounder breaded and fried to a perfect crispy golden brown, fresh lemon wedges and tartar sauce. Served with our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=15pdm1iqQh1B0ZMcXYTdg7WMbb0DV40hZ&sz=w1000',
    category: 'seafood',
  },
  {
    id: 'sf-12',
    name: 'Tilapia',
    description: 'Fillet of white-flake tilapia encrusted with chipotle tortilla chips, topped with fresh tomatoes, red onions, and a lemon wedge. Served with our fresh baked homemade bread.',
    price: '$18.99',
    image: 'https://drive.google.com/thumbnail?id=1_c1YW9_VeRIrlL7TqzwDOVmynwLWuNJ-&sz=w1000',
    category: 'seafood',
  },
];

// Create Your Own Salad Products
const createSaladProducts: Product[] = [
  {
    id: 'cs-1',
    name: 'Create Your Own Small Salad',
    description: 'Select your choice of "Green Leaf" bases, dressing and up to any 5 different toppings from our farm table. Served with our fresh baked homemade bread.',
    price: '$8.49',
    image: 'https://drive.google.com/thumbnail?id=1mIsYQWR-8wdTzzW7jIswStkqVrbO6TM-&sz=w1000',
    category: 'create-salad',
  },
  {
    id: 'cs-2',
    name: 'Create Your Own Fresh Salad',
    description: 'Select your choice of "Green Leaf" bases, dressing and up to any 5 different toppings from our farm table. Served with our fresh baked homemade bread.',
    price: '$14.49',
    image: 'https://drive.google.com/thumbnail?id=1mIsYQWR-8wdTzzW7jIswStkqVrbO6TM-&sz=w1000',
    category: 'create-salad',
  },
];

// Mock product data
const products: Product[] = [
  ...brooklynPizzaProducts,
  ...stromboliCalzoneProducts,
  ...byTheSliceProducts,
  ...createYourOwnPizzas,
  ...minucciPizzas,
  ...traditionalDinnersProducts,
  ...createPastaProducts,
  ...pastaProducts,
  ...sidesProducts,
  ...seafoodProducts,
  ...createSaladProducts,
  // Specialty Pizzas
  {
    id: 'sp-1',
    name: 'Margherita',
    description: 'Thin crust, homemade marinara sauce, fresh mozzarella, and topped with fresh basil ribbons.',
    price: '$21.99',
    priceRange: '$20.99 - $21.99 - $23.99',
    image: 'https://drive.google.com/thumbnail?id=120ugNoM9VYGyYlSYNDnYlsZIdoFAm0iH&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-1-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-basil', name: 'No Basil', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-2',
    name: 'Works',
    description: 'Thin crust, pizza sauce, pepperoni, sausage, mushrooms, onions, peppers and mozzarella.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1Q9T1qPvrAzuu0NlKo1C0wgmdxYWlKwwy&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-2-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-pepperoni', name: 'No Pepperoni', price: 0 },
          { id: 'no-sausage', name: 'No Sausage', price: 0 },
          { id: 'no-mushrooms', name: 'No Mushrooms', price: 0 },
          { id: 'no-onions', name: 'No Onions', price: 0 },
          { id: 'no-peppers', name: 'No Peppers', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-3',
    name: 'Toscana',
    description: 'Thin crust white pizza, fresh mozzarella, sliced tomatoes & fresh basil ribbons.',
    price: '$23.99',
    priceRange: '$22.99 - $23.99 - $25.99',
    image: 'https://drive.google.com/thumbnail?id=16MeO4AI_7nJEfygII69rzi6iB7Cs4Fa4&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-3-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-tomatoes', name: 'No Tomatoes', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-4',
    name: 'Chicken & Broccoli Alfredo',
    description: 'Thick crust pan pizza with savory chunks of chicken breast, broccoli florets & mozzarella baked in our creamy Alfredo sauce.',
    price: '$27.99',
    priceRange: '$27.99',
    image: 'https://drive.google.com/thumbnail?id=140zAyOOA6OYO7D4iny08TndmvE5iT-M4&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-4-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-broccoli', name: 'No Broccoli', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-5',
    name: 'Capri Pan Pizza',
    description: 'Thick crust pan white pizza with fresh spinach, broccoli florets, tomatoes, mozzarella and ricotta rosettes.',
    price: '$27.99',
    priceRange: '$27.99',
    image: 'https://drive.google.com/thumbnail?id=1TPLewmyVfYIXGTm1cAsNKJrV0fEsSEQI&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-5-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-spinach', name: 'No Spinach', price: 0 },
          { id: 'no-broccoli', name: 'No Broccoli', price: 0 },
          { id: 'no-tomatoes', name: 'No Tomatoes', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-ricotta', name: 'No Ricotta Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-6',
    name: 'Cheesesteak Pan Pizza',
    description: 'Thick crust, chopped steak mixed with pizza sauce, shredded mozzarella, and topped with american cheese slices.',
    price: '$27.99',
    priceRange: '$27.99',
    image: 'https://drive.google.com/thumbnail?id=1nMdMZUSsaDc9WM41-R9vRokVRF5beJ7x&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-6-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-steak', name: 'No Steak', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-american', name: 'No American Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-7',
    name: 'Chicken Bacon Ranch (White)',
    description: 'Thin crust, grilled chicken, white pizza, bacon, mozzarella and ranch dressing.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1mw_qHdB3Vo35dS5GfbzwLKDm5N8ubwWt&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-7-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-bacon', name: 'No Bacon', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-ranch', name: 'No Ranch', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-8',
    name: 'Buffalo Chicken',
    description: 'Thin crust, fresh chicken tossed in our homemade buffalo sauce and mozzarella.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1TqHCCFcUqJWi4Rp2jzDoWgaMDmtPuhNn&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-8-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-buffalo', name: 'No Buffalo Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-9',
    name: 'Boom Boom Chicken Pan Pizza',
    description: 'Thick crust, chopped chicken steak, mozzarella cheese, boom boom sauce, topped with american cheese slices.',
    price: '$27.99',
    priceRange: '$27.99',
    image: 'https://drive.google.com/thumbnail?id=1psE-aTlTzfwurE7SdAQebCWw0AS3lOFW&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-9-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-american', name: 'No American Cheese', price: 0 },
          { id: 'no-boom-boom', name: 'No Boom Boom Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-10',
    name: 'Hawaiian (Red or White)',
    description: 'Thin crust with chunks of pineapple, ham, and mozzarella.',
    price: '$23.99',
    priceRange: '$22.99 - $23.99 - $25.99',
    image: 'https://drive.google.com/thumbnail?id=1KWjtYLW-WzdmFZFcH1EP-mcheISEnCcy&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-10-sauce-choice',
        title: 'Sauce Choice',
        subtitle: 'Required',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sauce-red', name: 'Red Sauce', price: 0 },
          { id: 'sauce-white', name: 'White Sauce', price: 0 },
        ],
      },
      {
        id: 'sp-10-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-pineapple', name: 'No Pineapple', price: 0 },
          { id: 'no-ham', name: 'No Ham', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-11',
    name: 'Penne Vodka Pizza',
    description: 'Thin crust, penne mixed with fresh homemade vodka sauce, mozzarella cheese, topped with fresh basil ribbons.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1FNC3lPMkwX7X5KQxLUUg-ddvMNX_ykYb&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-11-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-penne', name: 'No Penne', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-12',
    name: 'Veggie (Red or White)',
    description: 'Thin crust pizza, topped with fresh spinach, broccoli, tomato and mozzarella with pecorino cheese sprinkled on top.',
    price: '$23.99',
    priceRange: '$22.99 - $23.99 - $25.99',
    image: 'https://drive.google.com/thumbnail?id=1Kun3q_ccJkXnr0Hs2m8XfoiHDojbmnXI&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-12-sauce-choice',
        title: 'Sauce Choice',
        subtitle: 'Required',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sauce-red', name: 'Red Sauce', price: 0 },
          { id: 'sauce-white', name: 'White Sauce', price: 0 },
        ],
      },
      {
        id: 'sp-12-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-spinach', name: 'No Spinach', price: 0 },
          { id: 'no-broccoli', name: 'No Broccoli', price: 0 },
          { id: 'no-tomato', name: 'No Tomato', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-13',
    name: 'BBQ Chicken',
    description: 'Thin crust, chunks of savory chicken, onions, rich BBQ sauce, and mozzarella.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=16RaYnyB3rnqTbCITwKf38pDCyYeEIguU&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-13-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-onions', name: 'No Onions', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-bbq', name: 'No BBQ Sauce', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-14',
    name: 'Chicken Parmigiana Pizza',
    description: 'Thin crust, breaded strips of chicken cutlet, pomodoro sauce, grated pecorino cheese, and basil.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1jCdHjBSg0U99pZ8C5XXTmVvh7ZlIsEuH&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-14-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-15',
    name: 'Quattro Formaggi (Red or White)',
    description: 'Thin crust pizza, pecorino, provolone, mozzarella and american cheeses.',
    price: '$23.99',
    priceRange: '$22.99 - $23.99 - $25.99',
    image: 'https://drive.google.com/thumbnail?id=1S7In38OHfLK81die1kOzw2rU-3JYrRWo&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-15-sauce-choice',
        title: 'Sauce Choice',
        subtitle: 'Required',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sauce-red', name: 'Red Sauce', price: 0 },
          { id: 'sauce-white', name: 'White Sauce', price: 0 },
        ],
      },
      {
        id: 'sp-15-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
          { id: 'no-provolone', name: 'No Provolone Cheese', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-american', name: 'No American Cheese', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-16',
    name: 'Hot Honey Roni Pizza',
    description: 'Thin crust, pizza sauce, mozzarella cheese, cup n char pepperoni, drizzled with Mike\'s hot honey.',
    price: '$27.49',
    priceRange: '$26.49 - $27.49 - $29.49',
    image: 'https://drive.google.com/thumbnail?id=1DZb3PL5dx3ZG8NmUwRHYV7pI2yTVEe4q&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-16-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-pepperoni', name: 'No Cup n Char Pepperoni', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-hot-honey', name: 'No Hot Honey', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-17',
    name: 'Focaccia Passariello',
    description: 'Thick crust, Square pan-baked and topped with our homemade marinara sauce, roasted garlic, and fresh basil ribbons.',
    price: '$22.49',
    priceRange: '$22.49',
    image: 'https://drive.google.com/thumbnail?id=1WNu3mUh3owE5NG9NuWiss6iG-svLmEDp&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-17-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-18',
    name: 'Baked Ziti Pizza',
    description: 'Ziti mixed with ricotta, pomodoro sauce, mozzarella, topped with pecorino and fresh basil, baked on a thin crust.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1dqnHvGZmRg8zbbYzllIJSf66oPJsp5QE&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-18-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-ziti', name: 'No Ziti', price: 0 },
          { id: 'no-ricotta', name: 'No Ricotta Cheese', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-19',
    name: 'Chipotle Chicken',
    description: 'Thin crust, breaded chicken, chopped tomatoes, homemade chipotle ranch sauce, and mozzarella.',
    price: '$26.49',
    priceRange: '$25.49 - $26.49 - $28.49',
    image: 'https://drive.google.com/thumbnail?id=1EbKK76s2Bz4FviJMpCCPT6SOs5LsYd67&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-19-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-chicken', name: 'No Chicken', price: 0 },
          { id: 'no-tomatoes', name: 'No Tomatoes', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-chipotle', name: 'No Chipotle Ranch', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-20',
    name: 'Melanzana',
    description: 'Thin crust, slices of grilled eggplant, mozzarella, pomodoro sauce, pecorino cheese and basil.',
    price: '$23.99',
    priceRange: '$22.99 - $23.99 - $25.99',
    image: 'https://drive.google.com/thumbnail?id=1pFOfLplapzAuWzSNeQn70RaWq_oknWNg&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-20-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-eggplant', name: 'No Eggplant', price: 0 },
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  {
    id: 'sp-21',
    name: 'Grandma',
    description: 'Thin crust, mozzarella cheese, marinara sauce, pecorino cheese, oregano, basil ribbons.',
    price: '$21.99',
    priceRange: '$20.99 - $21.99 - $23.99',
    image: 'https://drive.google.com/thumbnail?id=1eu9jzOvmNarzbIdmNQRnHarfrF349JtV&sz=w1000',
    category: 'specialty-pizza',
    customizationOptions: [
      {
        id: 'sp-21-no-toppings',
        title: 'No Toppings',
        subtitle: 'Select items to remove',
        required: false,
        multiple: true,
        options: [
          { id: 'no-mozzarella', name: 'No Mozzarella Cheese', price: 0 },
          { id: 'no-pecorino', name: 'No Pecorino Cheese', price: 0 },
          { id: 'no-basil', name: 'No Basil', price: 0 },
        ],
      },
    ],
  },
  // Entrees
  {
    id: '7',
    name: 'Chicken Parmigiana',
    description: 'Breaded chicken breast with marinara and melted mozzarella',
    price: '$14.99',
    image: 'https://drive.google.com/thumbnail?id=13kkfGfRdUa9ib2gMfEiPEzW_x8IIDvlJ&sz=w400',
    category: 'entrees',
  },
  {
    id: '8',
    name: 'Eggplant Parmigiana',
    description: 'Breaded eggplant layered with marinara and cheese',
    price: '$13.99',
    image: 'https://drive.google.com/thumbnail?id=18B38B5PIemFiZxuErRJRu3hrHaBSs1Wc&sz=w400',
    category: 'entrees',
  },
  {
    id: 'e3',
    name: 'Veal Parmigiana',
    description: 'Breaded veal cutlet with marinara and melted mozzarella',
    price: '$17.99',
    image: 'https://images.unsplash.com/photo-1712746785116-4a901521fe8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWFsJTIwcGFybWlnaWFuYSUyMGl0YWxpYW58ZW58MXx8fHwxNzYyNDQyNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e4',
    name: 'Sausage & Peppers',
    description: 'Italian sausage with roasted peppers and onions',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1597012523223-3b2300183816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVzYWdlJTIwcGVwcGVycyUyMGl0YWxpYW58ZW58MXx8fHwxNzYyNDQyNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e5',
    name: 'Meatball Parmigiana',
    description: 'Homemade meatballs with marinara and mozzarella',
    price: '$13.49',
    image: 'https://images.unsplash.com/photo-1598511726903-ef08ef6eff94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0YmFsbCUyMHBhcm1pZ2lhbmF8ZW58MXx8fHwxNzYyNDQyNjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e6',
    name: 'Lasagna',
    description: 'Layers of pasta, meat sauce, ricotta, and mozzarella',
    price: '$14.99',
    image: 'https://images.unsplash.com/photo-1621510456681-2330135e5871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNhZ25hJTIwcGxhdGV8ZW58MXx8fHwxNzYyNDQyNjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e7',
    name: 'Fettuccine Alfredo',
    description: 'Fettuccine pasta in a rich creamy parmesan sauce',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1599749012259-126a66c5f674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXR0dWNjaW5lJTIwYWxmcmVkbyUyMHBhc3RhfGVufDF8fHx8MTc2MjQ0MjY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e8',
    name: 'Spaghetti & Meatballs',
    description: 'Classic spaghetti with homemade meatballs and marinara',
    price: '$13.99',
    image: 'https://images.unsplash.com/photo-1677139599935-67eb22b12bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBtZWF0YmFsbHN8ZW58MXx8fHwxNzYyMzU5MDUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e9',
    name: 'Penne alla Vodka',
    description: 'Penne pasta in a creamy tomato vodka sauce',
    price: '$13.49',
    image: 'https://images.unsplash.com/photo-1709201417401-5c72ed84f191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5uZSUyMHZvZGthJTIwcGFzdGF8ZW58MXx8fHwxNzYyNDQyNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e10',
    name: 'Chicken Marsala',
    description: 'Sautéed chicken with mushrooms in marsala wine sauce',
    price: '$15.99',
    image: 'https://drive.google.com/thumbnail?id=18eQ5lvHPaxl2K6H-6SlGs3o61bdla1Li&sz=w400',
    category: 'entrees',
  },
  {
    id: 'e11',
    name: 'Chicken Francese',
    description: 'Egg-battered chicken in a lemon butter white wine sauce',
    price: '$15.99',
    image: 'https://drive.google.com/thumbnail?id=1zyWQO1Etg43UIZSBdDZxR0Ynzc1rrS2q&sz=w400',
    category: 'entrees',
  },
  {
    id: 'e12',
    name: 'Veal Marsala',
    description: 'Tender veal with mushrooms in marsala wine sauce',
    price: '$18.99',
    image: 'https://images.unsplash.com/photo-1753939843647-266025e0d1ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwbWFyc2FsYXxlbnwxfHx8fDE3NjI0NDI2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e13',
    name: 'Baked Ziti',
    description: 'Ziti pasta baked with ricotta, marinara, and mozzarella',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1641394535269-dbea1fa94ff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHppdGl8ZW58MXx8fHwxNzYyNDQyNjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e14',
    name: 'Stuffed Shells',
    description: 'Large pasta shells stuffed with ricotta and baked',
    price: '$13.49',
    image: 'https://images.unsplash.com/photo-1606503854923-95e45999ae2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVmZmVkJTIwc2hlbGxzJTIwcGFzdGF8ZW58MXx8fHwxNzYyNDQyNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e15',
    name: 'Manicotti',
    description: 'Pasta tubes filled with ricotta and topped with marinara',
    price: '$13.49',
    image: 'https://images.unsplash.com/photo-1699192676286-545f9e23ca25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY290dGklMjBpdGFsaWFufGVufDF8fHx8MTc2MjQ0MjY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e16',
    name: 'Cheese Ravioli',
    description: 'Ravioli stuffed with ricotta in marinara sauce',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjByYXZpb2xpfGVufDF8fHx8MTc2MjQ0MjY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e17',
    name: 'Tortellini Alfredo',
    description: 'Cheese tortellini in a creamy alfredo sauce',
    price: '$13.99',
    image: 'https://images.unsplash.com/photo-1646940930570-35ffcaedfd24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3J0ZWxsaW5pJTIwYWxmcmVkb3xlbnwxfHx8fDE3NjI0NDI2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  {
    id: 'e18',
    name: 'Linguine with Clam Sauce',
    description: 'Linguine pasta with fresh clams in white wine sauce',
    price: '$16.99',
    image: 'https://images.unsplash.com/photo-1759728886965-da7fd4626b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5ndWluZSUyMGNsYW0lMjBzYXVjZXxlbnwxfHx8fDE3NjI0NDI2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'entrees',
  },
  // Cheesesteaks - imported from data file
  ...cheesesteaksProducts,
  // Wings - imported from data file
  ...wingsProducts,
  // Salads - imported from data file
  ...saladsProducts,
  // Appetizers - imported from data file
  ...appetizersProducts,
  // Seafood
  {
    id: '14',
    name: 'Shrimp Scampi',
    description: 'Garlic butter shrimp with white wine sauce',
    price: '$16.99',
    image: 'https://images.unsplash.com/photo-1603894483228-9a3d10c32390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBzY2FtcGklMjBwYXN0YXxlbnwxfHx8fDE3NjIyOTA0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'seafood',
  },
  // Wraps
  {
    id: '15a',
    name: 'Buffalo Chicken Cheesesteak Wrap',
    description: 'Chicken steak mixed with our homemade spicy buffalo sauce, topped with american cheese. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1i7wGMGhwMZCIKp_eHWWV7EaQP22B47ev&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15b',
    name: 'Cheesesteak Wrap',
    description: 'Beef steak, american cheese, lettuce, tomatoes, oregano and raw onions. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1F8J8yVVenhZUDClrtQuXZvK4kGM0IGRt&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15c',
    name: 'Chicken Caesar Wrap',
    description: 'Grilled chicken and romaine tossed with a rich caesar dressing and shredded parmesan cheese. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1aEAO2Eh0HThx05qY8eMNdirxD7YmntzT&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15d',
    name: 'Chicken Cheesesteak Wrap',
    description: 'Chicken steak, american cheese, lettuce, tomatoes, oregano and raw onions. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1lOkFojFzMER6wliu1UGJrMHiLVd4EWqn&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15e',
    name: 'Grilled Chicken Wrap',
    description: 'Grilled chicken strips with spinach, roasted red peppers, and provolone cheese. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=10MlIiIoPBWJNJXKt6tPLbDZ39w7Sxff4&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15f',
    name: 'Italian Wrap',
    description: 'Ham, capicola, salami, provolone cheese, shredded lettuce, tomatoes, raw onions, oregano, oil and vinegar. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1qiWUXXi33oFjesNPj-pENg-rsVjacXIv&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15g',
    name: 'Tuna Wrap',
    description: 'Fresh tuna salad, shredded lettuce, oregano and tomatoes. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1UJT_JmjZiTX6QQzGYg7f2lRSOdus2nra&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15h',
    name: 'Turkey Wrap',
    description: 'Oven-roasted turkey, lettuce, tomatoes, oregano and raw onions. Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1iP0WoJobcReULUOEdBZHlbgqCZOy6Tqm&sz=w1000',
    category: 'wraps',
  },
  {
    id: '15i',
    name: 'Veggie Wrap',
    description: 'Grilled eggplant, grilled zucchini, roasted red peppers, and provolone cheese. (Served Cold). Served with potato chips.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=15TO8ZNjqeFFiJPmGa9JWT49-pVMQUE3y&sz=w1000',
    category: 'wraps',
  },
  // Hot Hoagies
  {
    id: '16',
    name: 'Chicken Parm Sandwich',
    description: 'Crispy chicken tenders, topped with pomodoro sauce & melted mozzarella cheese.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1zJuKS0CjgAe1GnahIq0oOQy3WYqewqgZ&sz=w1000',
    category: 'hot-hoagies',
  },
  {
    id: '16a',
    name: 'Eggplant Parm Sandwich',
    description: 'Four layers of fresh baked eggplant, mozzarella, pomodoro and parmesan cheese.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=18CQ3nFb3UZC22LOud6tc5f6WQ1Pc8wIv&sz=w1000',
    category: 'hot-hoagies',
  },
  {
    id: '16b',
    name: 'Grilled Chicken Hoagie',
    description: 'Grilled chicken strips, lettuce, sliced tomato, raw onions, oregano & oil.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1GIYK8O5ShAPwcNf6ZzTeXI-bUuyqDKlG&sz=w1000',
    category: 'hot-hoagies',
  },
  {
    id: '16c',
    name: 'Meatball Parm Sandwich',
    description: 'Beef meatballs, pomodoro sauce & melted mozzarella cheese.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1MAawvTdDtBifSrdtl0ZwqshtZkwpWH2N&sz=w1000',
    category: 'hot-hoagies',
  },
  {
    id: '16d',
    name: 'Sausage Parm Sandwich',
    description: 'Sliced Italian sausage, pomodoro sauce & melted mozzarella cheese.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1qioOcHq35_Rs-BTm72wqo5k5s-CjmHl7&sz=w1000',
    category: 'hot-hoagies',
  },
  {
    id: '16e',
    name: 'Sausage, Peppers & Onions',
    description: 'Sliced Italian sausage grilled with mixed sweet peppers and onions sandwich.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1u1tCLAWcpltQenxYG3DAPfPuuG4Pz1dB&sz=w1000',
    category: 'hot-hoagies',
  },
  // Cold Hoagies
  {
    id: '17a',
    name: 'Ham & Cheese',
    description: 'Served on a 10" Italian hoagie roll with ham, your choice of cheese, shredded lettuce, sliced tomatoes, raw onions, salt, oil, vinegar, and oregano.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1sK9xKTkPzJ4nIVergARE8rXhF3963nB2&sz=w1000',
    category: 'cold-hoagies',
  },
  {
    id: '17b',
    name: 'Italian Hoagie',
    description: 'Served on a 10" Italian hoagie roll with ham, salami, capicola, provolone shredded lettuce, sliced tomatoes, raw onions, salt, oil, vinegar, and oregano.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1VgWWUWrDD2r2EBky6QLBehfr5PFMLsyY&sz=w1000',
    category: 'cold-hoagies',
  },
  {
    id: '17c',
    name: 'Tuna Hoagie',
    description: 'Served on a 10" Italian hoagie roll with tuna salad, shredded lettuce, sliced tomatoes, raw onions, salt and oregano.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1YcqlzjvlorooxdAx9hKpZl42Erk_GtKq&sz=w1000',
    category: 'cold-hoagies',
  },
  {
    id: '17d',
    name: 'Turkey Hoagie',
    description: 'Served on a 10" Italian hoagie roll with oven roasted turkey, shredded lettuce, sliced tomatoes, raw onions, salt, oil, vinegar, and oregano.',
    price: '$13.49',
    image: 'https://drive.google.com/thumbnail?id=1JFXkk4162uCpnBW3HiTwkLKBg3JKswv-&sz=w1000',
    category: 'cold-hoagies',
  },
  // Brioche
  {
    id: '18',
    name: 'Brioche Buffalo Crispy Chicken',
    description: 'Crispy chicken tenders, tossed in buffalo sauce and topped with lettuce & oregano. Served with french fries.',
    price: '$12.49',
    image: 'https://drive.google.com/thumbnail?id=15Fk8kIJP6rfKa1sinDl_Wvh9v8_t-ZKq&sz=w1000',
    category: 'brioche',
  },
  {
    id: '18b',
    name: 'Brioche Grilled Chicken',
    description: 'Topped with lettuce, sliced tomatoes, pickles, oregano and ranch. Served with french fries.',
    price: '$12.49',
    image: 'https://drive.google.com/thumbnail?id=1Sid0_GmKkYbj1UwmnWBS7x2bfqI0lvYP&sz=w1000',
    category: 'brioche',
  },
  {
    id: '18c',
    name: 'Brioche Mozzarella Grilled Chicken',
    description: 'Topped with mozzarella cheese, spinach and roasted red peppers. Served with french fries.',
    price: '$12.49',
    image: 'https://drive.google.com/thumbnail?id=1QgR1_s47A25DJ9hlSUvjE-SFOWYslNrs&sz=w1000',
    category: 'brioche',
  },
  // Paninis
  {
    id: 'panini-1',
    name: 'Grilled Chicken Panini',
    description: 'Provolone, lettuce, tomatoes, oregano and mayo. Served with potato chips.',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1OjJ94caowciE271AJH33q5w5-qNNdIP-&sz=w1000',
    category: 'paninis',
  },
  {
    id: 'panini-2',
    name: 'Grilled Veggie Panini',
    description: 'Eggplant, zucchini, roasted red peppers and provolone cheese. Served with potato chips.',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1HhnIkRFzLbIFlwQDU-tAjkS-3zHoyz-a&sz=w1000',
    category: 'paninis',
  },
  {
    id: 'panini-3',
    name: 'Prosciutto Mozzarella Panini',
    description: 'Prosciutto, mozzarella, roasted red peppers and nut-free pesto spread. Served with potato chips.',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1iaXAxlxKdQ0ejp5Or6UN__6kV96jpb-T&sz=w1000',
    category: 'paninis',
  },
  // Burgers
  {
    id: 'burger-1',
    name: 'Cheeseburger',
    description: '8 oz Beef Burger with american cheese. Served with french fries.',
    price: '$10.99',
    image: 'https://drive.google.com/thumbnail?id=1lYF58QiV8gUh8-hQtGpSL_kgT2y4FCfA&sz=w1000',
    category: 'burgers',
  },
  {
    id: 'burger-2',
    name: 'Cheeseburger Deluxe',
    description: '8 oz Beef Burger, lettuce, tomato, oregano, onions and american cheese. Served with french fries.',
    price: '$12.99',
    image: 'https://drive.google.com/thumbnail?id=1x-tZHLRk76D9vc4eXziH5nBVtcx6ZAcx&sz=w1000',
    category: 'burgers',
  },
  {
    id: 'burger-3',
    name: 'Pizza Burger',
    description: '8 oz Beef Burger, pomodoro sauce and mozzarella. Served with french fries.',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1QgWec_gADv9gk47bsxrCXAiWKE3ogGOG&sz=w1000',
    category: 'burgers',
  },
  {
    id: 'burger-4',
    name: 'Hamburger',
    description: '8 oz Beef Burger. Served with french fries.',
    price: '$9.99',
    image: 'https://drive.google.com/thumbnail?id=1bvtkdvdnaNOk5el2lN9wUOYbFKWZFZd7&sz=w1000',
    category: 'burgers',
  },
  // Sides
  // Soups
  {
    id: 'soup1',
    name: 'Pasta e Fagioli Soup',
    description: 'Ditalini Pasta, White Cannellini Beans, Onions, Celery. Served with a side of our fresh baked homemade bread.',
    price: '$8.49',
    priceRange: '$8.49 - $12.99',
    image: 'https://drive.google.com/thumbnail?id=15wBRDs037tG4neSd-IX-mdetvcIJ4w4M&sz=w1000',
    category: 'soups',
  },
  {
    id: 'soup2',
    name: 'Soup of the Day',
    description: 'Please call your local Pizzeria for the Soup of the Day.',
    price: '$8.49',
    priceRange: '$8.49 - $12.99',
    image: 'https://drive.google.com/thumbnail?id=1sG9VxC4eVV6sBHkEdzw1XhHvQou26X9J&sz=w1000',
    category: 'soups',
  },
  // Kids
  {
    id: 'k1',
    name: 'Create Your Own Kids Pasta',
    description: 'Served with our freshly baked homemade bread',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=1KZlRhe496nIZu9LJaMbwCXJSI01x4yQx&sz=w1000',
    category: 'kids',
    customizationSections: [
      {
        title: 'Pasta Type',
        subtitle: 'Choose exactly 1',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'Cappellini', price: 0 },
          { name: 'Fettuccine', price: 0 },
          { name: 'Gluten Free Kids Pasta', price: 1.50 },
          { name: 'Gnocchi', price: 0 },
          { name: 'Linguine', price: 0 },
          { name: 'Penne', price: 0 },
          { name: 'Rigatoni', price: 0 },
          { name: 'Spaghetti', price: 0 },
        ]
      },
      {
        title: 'Add Toppings',
        subtitle: 'Optional',
        required: false,
        options: [
          { name: 'Mushrooms', price: 1.00 },
          { name: 'Spinach', price: 1.00 },
          { name: 'Broccoli', price: 1.00 },
          { name: 'Grilled Chicken Strips', price: 1.99 },
          { name: 'Shrimp', price: 4.99 },
        ]
      },
      {
        title: 'Special Instructions',
        subtitle: 'Optional',
        required: false,
        options: [
          { name: 'Sauce On The Side', price: 0 },
        ]
      }
    ]
  },
  {
    id: 'k2',
    name: 'Kids Baked Ziti',
    description: 'Ziti with a blend of ricotta cheese, pomodoro sauce and topped with mozzarella cheese.',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=1Rqtr9k0H6myDbvASnfD_nqry38yVhqen&sz=w1000',
    category: 'kids',
  },
  {
    id: 'k3',
    name: 'Kids Cheese Ravioli',
    description: '(3) Ravioli stuffed with ricotta cheese, pomodoro sauce and topped with mozzarella cheese.',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=1N1-GjuWSKxY7VNjBk1AO5Jz4DRKSiXdV&sz=w1000',
    category: 'kids',
  },
  {
    id: 'k4',
    name: 'Kids Cheese Tortellini',
    description: 'Tortellini stuffed with ricotta cheese, pomodoro sauce and topped with mozzarella cheese.',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=15UgPgstLaUGCpoavaTqpg7axOz1HTngg&sz=w1000',
    category: 'kids',
  },
  {
    id: 'k5',
    name: 'Kids Chicken Fingers and French Fries',
    description: '(2) Crispy breaded tenders served with french fries and honey mustard.',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=1ZWyfK-kvMtUXL4mM3WvfiCTrN3fU1eKa&sz=w1000',
    category: 'kids',
  },
  {
    id: 'k6',
    name: 'Kids Pasta and Meatball',
    description: 'Your choice of pasta, (1) meatball, and pomodoro sauce.',
    price: '$10.49',
    image: 'https://drive.google.com/thumbnail?id=1dJv9IQB4oI22VT1Odktxcfpw-4ktW4dr&sz=w1000',
    category: 'kids',
  },
  // Desserts
  {
    id: 'd1',
    name: 'Chocolate Molten Lava Cake',
    description: 'Moist dark chocolate cake enrobed with dark chocolate, filled with dark chocolate truffle that melts when heated up.(Please heat up in Microwave for 45 seconds)',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1M-6K4D_oD3g5Eq4PkR0E2aJEN_mSNRMA&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd2',
    name: 'Cookie Lava',
    description: 'Jumbo cookie baked with chunks of rich chocolate truffle that melts when heated up.(Please heat up in Microwave for 45 seconds)',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1oqXRQ5rDP2fivh3aQ_cfqpUTSaTieTXx&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd3',
    name: 'Dark Side of the Moon',
    description: 'Fudge cake soaked with coffee liqueur and filled with chocolate mousse. Enrobed in ganache and finished with chocolate crumbs and a crescent moon.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1cmpMOyZSS2XtPCNCzEPqXLikpWvTSNL3&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd4',
    name: 'Tiramisu',
    description: 'Layers of espresso drenched ladyfingers separated by mascarpone cream and dusted with cocoa powder.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1XbNi8dJGuogG7qOG0Nm3xL6STeHpoNib&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd5',
    name: 'New York Cheesecake',
    description: 'A rich cheesecake exploding with vanilla flavor sitting on a buttery graham cracker crust.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1KWdGeUtxNNx9PM02MGy8wBEZQYRjZZlL&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd6',
    name: "Reese's Peanut Butter Pie",
    description: 'Dark chocolate and peanut butter mousse mixed with Reese\'s peanut butter cups.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1sKk80VLKPOX8wOZ2EGGKpw8539xemTug&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd7',
    name: 'Carrot Cake',
    description: 'carrot cake made with freshly grated carrots, warm spices, and a hint of vanilla.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1N06OqTGyNLg5yMGJ04Kn5dPEIRZDEZdg&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd8',
    name: 'Peanut Butter Bomb',
    description: 'A chocolate candy bar bottom. Topped with peanut butter ganache and a mound of chocolate mousse. Coated in a blanket of chocolate ganche. Finished with chopped peanuts and peanut butter sauce. GLUTEN FREE',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1McuANMiSmm18pgKKVokhlds5guzn3gV6&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd9',
    name: 'Limoncello Mascarpone',
    description: 'Layers of lemony sponge cake, filled with a mixture of mascarpone and cream.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1v_NcMuPkcnrTXyBJX2_hZI5Jqm6NJBUN&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd10',
    name: 'Chocolate Overload Cake',
    description: 'Made with layers of moist chocolate sponge, silky chocolate ganache, and a creamy chocolate frosting',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1-osIjijJl0auXYkiypXd4vOnz_XbUja5&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd11',
    name: 'Chocolate Pudding Brownie Cup',
    description: 'Chocolate pudding, whipped cream and brownie crumbles.',
    price: '$6.49',
    image: 'https://drive.google.com/thumbnail?id=1CmxoI_yZNkbQlwFnj1ugZadKIiooSSPy&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd12',
    name: 'Chocolate Shell Cannoli',
    description: 'Crispy pastry shells dipped in chocolate, filled with sweet ricotta cheese, dried fruit, and chocolate chips.',
    price: '$5.49',
    image: 'https://drive.google.com/thumbnail?id=1jNO4jodVWqx0sFIKK_OSSmWCaCbYVhmV&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd13',
    name: 'Plain Shell Cannoli',
    description: 'Crispy pastry shells filled with sweet ricotta cheese and chocolate chips.',
    price: '$4.99',
    image: 'https://drive.google.com/thumbnail?id=1q1W4fx3rdo48cZ66b-sZlV20kXXZMHkM&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd14',
    name: 'Triple Chocolate Chip Cookie',
    description: 'Jumbo cookie baked with chunks of rich chocolate.',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1KXgNjjUtdVMJxI58bevEkDfXH_a5sGDi&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd15',
    name: 'M&M Cookie',
    description: 'buttery cookie loaded with colorful M&M candies in every bite.',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1sMJwxgMlZM2yLfS86SDw3QRHeFjy5Xex&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'd16',
    name: 'Oatmeal Cookie',
    description: 'chewy oatmeal cookie made with whole rolled oats',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=152EJJEqMd2bvXmfeTNdl906A1P_hWcZ1&sz=w1000',
    category: 'desserts',
  },
  {
    id: 'pz1',
    name: 'Pizzelle Anisette',
    description: 'Traditional Italian waffle cookie with delicate anise flavor',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1UVaPsOynpa_gHR-z83MaBHoQxgu6r-VK&sz=w1000',
    category: 'pizzelle',
  },
  {
    id: 'pz2',
    name: 'Pizzelle Chocolate',
    description: 'Traditional Italian waffle cookie with rich chocolate flavor',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1UVaPsOynpa_gHR-z83MaBHoQxgu6r-VK&sz=w1000',
    category: 'pizzelle',
  },
  {
    id: 'pz3',
    name: 'Pizzelle Vanilla',
    description: 'Traditional Italian waffle cookie with classic vanilla flavor',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1UVaPsOynpa_gHR-z83MaBHoQxgu6r-VK&sz=w1000',
    category: 'pizzelle',
  },
  // COPPA GELATI (3.52 Oz)
  {
    id: 'gc1',
    name: 'Gelato Coppa Yogurt & Berries',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Creamy Italian gelato with yogurt and fresh berries (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=17q6RqLncO9nnlD8w86Aux7vpXbfiIew1&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc2',
    name: 'Gelato Coppa Strawberry & Caramello',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Italian gelato with sweet strawberries and rich caramel swirl (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1u2mviABnPNoT1pkIUb26sI6kETT150BR&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc3',
    name: 'Gelato Coppa Stracciatella',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Classic Italian gelato with delicate chocolate shavings (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=14Lh0E16Fz2905H2sKY-ly1WGveiMJ_V0&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc4',
    name: 'Gelato Coppa Caffe',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Rich Italian coffee-flavored gelato (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=13YdXQzXnzb317fjgmu-xfY-deA9osNtK&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc5',
    name: 'Gelato Coppa Spagnola',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Traditional Spanish-style Italian gelato (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1tzVIEzRT_WgCpjBCWK-x8LldImyLyAlR&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc6',
    name: 'Gelato Coppa Pistachio',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Authentic Italian gelato with rich Sicilian pistachio flavor (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1pXzy4GQ_J0D1ICMITLLJ5XWSEstQkK1p&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc7',
    name: 'Gelato Coppa Bueno',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Indulgent Italian gelato with chocolate hazelnut Bueno flavor (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1pXzy4GQ_J0D1ICMITLLJ5XWSEstQkK1p&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc8',
    name: 'Gelato Coppa Snickers',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Creamy Italian gelato with Snickers candy pieces (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1pXzy4GQ_J0D1ICMITLLJ5XWSEstQkK1p&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gc9',
    name: 'Gelato Coppa Salted Caramel',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">3.52 Oz</span> Smooth Italian gelato with salted caramel swirls (Available for Pickup Only)',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1pXzy4GQ_J0D1ICMITLLJ5XWSEstQkK1p&sz=w1000',
    category: 'gelati',
  },
  // GELATI REGULAR
  {
    id: 'g1',
    name: 'Gelato Limoncello',
    description: 'Refreshing Italian lemon gelato with a hint of limoncello liqueur (Available for Pickup Only)',
    price: '$5.99',
    image: 'https://drive.google.com/thumbnail?id=1ObTljEmWjOoayZ0Z5eeScd8SGL5t4Y5a&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'g2',
    name: 'Gelato Chocolate & Cream',
    description: 'Luxurious Italian gelato with rich chocolate and smooth cream swirls (Available for Pickup Only)',
    price: '$5.99',
    image: 'https://drive.google.com/thumbnail?id=1h8Y6WnsO4nbvl7MsKh5JM_y2uaztp1Nl&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'g3',
    name: 'Gelato Wild Berries',
    description: 'Vibrant Italian gelato with a medley of wild forest berries (Available for Pickup Only)',
    price: '$5.99',
    image: 'https://drive.google.com/thumbnail?id=1tuLHWuASiaDCfakcPZAKLazVjth43xq-&sz=w1000',
    category: 'gelati',
  },
  // GELATI PREMIUM 17.58 Oz
  {
    id: 'gp1',
    name: 'Gelato Caramelo Salato',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">17.58 Oz</span> Decadent Italian gelato with salted caramel (Available for Pickup Only)',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1fkPX5mEHJGEVXRIt3QJA2We6qZMYzNtv&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gp2',
    name: 'Gelato Cioccolato',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">17.58 Oz</span> Rich Italian chocolate gelato made with premium cocoa (Available for Pickup Only)',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1Nwy0AMG4Ax9LsvS8DQn6Iav-1Xbt3SO_&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gp3',
    name: 'Gelato Nocciola',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">17.58 Oz</span> Creamy Italian hazelnut gelato with authentic Piedmont hazelnuts (Available for Pickup Only)',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1par7jdp0Vq8OpiIS3KZEnfiu6AvG0IF6&sz=w1000',
    category: 'gelati',
  },
  {
    id: 'gp4',
    name: 'Gelato Vaniglia Amarena',
    description: '<span class="bg-[#A72020] text-white px-2 py-0.5 rounded font-semibold">17.58 Oz</span> Classic vanilla gelato with Italian amarena cherries (Available for Pickup Only)',
    price: '$11.99',
    image: 'https://drive.google.com/thumbnail?id=1tZfrYTFZW3aLx__0kEmZbxlX6XqXUuYM&sz=w1000',
    category: 'gelati',
  },
  // Beverages
  {
    id: 'b1',
    name: "Passariello's Water",
    description: 'Refreshing bottled water',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1E3OQK-JYZSMqFXZQ-LvW5ILO5-BnaQnU&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b1a',
    name: "Passariello's Sparkling Water",
    description: 'Refreshing sparkling water',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1ncvuDYrtVtl9jQp8aD0KzArQtKqhBlA0&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b2',
    name: "Kid's Apple Juice",
    description: 'Pure apple juice',
    price: '$1.79',
    image: 'https://drive.google.com/thumbnail?id=107gnynzrSacPDOkMHjBaBEAAjzX_stzM&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b3',
    name: 'Starry 2L',
    description: 'Lemon-lime soda',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1Fku2fLf48jtCA0SFuAdV02N3VVNtsp9Q&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b4',
    name: 'Diet Pepsi 20oz',
    description: 'Diet cola beverage',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1AHCaOFkOZtEaRaAEI5SIS6BPLDCF59nV&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b5',
    name: 'Pepsi 20oz',
    description: 'Classic cola beverage',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1JpgdoknAMiCj8ygdZYA7c2vFcV6RZLbN&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b6',
    name: 'Cherry Pepsi 20oz',
    description: 'Cherry-flavored cola',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1GNrz-gtfDzVStuIfki1dEi-vZayFR_VW&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b7',
    name: 'Brisk Iced Tea 2L',
    description: 'Refreshing iced tea',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1gGmo4YB1IElJag6Ho4gQ1-qK0Dz9-86f&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b8',
    name: 'Ginger Ale 2L',
    description: 'Crisp ginger ale',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1fMPwQU8-G84hMxRqS7qj589gRCNFBt7U&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b9',
    name: 'Ginger Ale 20oz',
    description: 'Crisp ginger ale',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1WLRyisDosWTQkAVJWGJ4Om2imiIDY0iq&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b10',
    name: "Kid's Chocolate Milk",
    description: 'Rich chocolate milk',
    price: '$1.79',
    image: 'https://drive.google.com/thumbnail?id=1GYr6taakeRulvuXAzkob3npvpnpwF6UN&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b11',
    name: 'Mug Root Beer 2L',
    description: 'Classic root beer',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1G8I811J3nvvxoZ8XbuBiO3clcfXYHXgx&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b12',
    name: 'Mountain Dew 20oz',
    description: 'Citrus soda',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1BccbrFdK-S9e-tFnx5uNfdihRF7HNzpw&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b13',
    name: 'Mountain Dew 2L',
    description: 'Citrus soda',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1XcE9vTHosX1BS82Cj4PNY1AkZt7LZ-yQ&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b14',
    name: 'Starry 20oz',
    description: 'Lemon-lime soda',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1O3pU2657SYzrUMoKLzrW84LvvX7kvq4E&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b15',
    name: 'Pepsi 2L',
    description: 'Classic cola beverage',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1WzjWxgvbU9QaJxuwvUrOQ1_j4nILsZKS&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b16',
    name: 'Cherry Pepsi 2L',
    description: 'Cherry-flavored cola',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1GTQPhw1yK1HrYiGjGp2gfo1Hqbdk9GcN&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b17',
    name: 'Diet Pepsi 2L',
    description: 'Diet cola beverage',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1F3v0hCmak_vwjpmOhZbGXxkGVhJ50DfF&sz=w1000',
    category: 'beverages',
  },
  {
    id: 'b18',
    name: 'Brisk Iced Tea 20oz',
    description: 'Refreshing iced tea',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1wpQU7v96vnTYkUoVRkyY-3gK5yGzaXBH&sz=w1000',
    category: 'beverages',
  },
  // Catering - Appetizers
  {
    id: 'capp1',
    name: 'Wings',
    description: 'Breaded with seasoned flour. Served with celery and bleu cheese.',
    price: '$16.99',
    priceRange: '$16.99 - $33.99 - $50.99 - $84.99',
    image: 'https://drive.google.com/thumbnail?id=1ujoCteMfDts1Tt-7WRf5dc6DYjbg_yoy&sz=w1080',
    category: 'catering-appetizers',
  },
  {
    id: 'capp2',
    name: 'Chicken Tenders',
    description: 'Crispy breaded tenders served with french fries and honey mustard.',
    price: '$12.49',
    priceRange: '$12.49 - $24.99 - $59.99 - $89.99 - $139.99',
    image: 'https://drive.google.com/thumbnail?id=1gwPOh67rKlynGVNB8xlyrYqQcYeWqHby&sz=w1000',
    category: 'catering-appetizers',
  },
  {
    id: 'capp3',
    name: 'Mozzarella Sticks',
    description: 'Creamy mozzarella breaded, deep fried, served with a side of Pomodoro sauce.',
    price: '$9.49',
    priceRange: '$9.49 - $18.99 - $37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1efvwOvo5aRDys4jBi_lqoR2zdH1ffCe9&sz=w1000',
    category: 'catering-appetizers',
  },
  {
    id: 'capp4',
    name: 'Arancini Rice Ball',
    description: 'Rice, ground beef, mozzarella and peas, served with a side of Pomodoro sauce.',
    price: '$4.49',
    priceRange: '$4.49 - $22.45 - $67.35 - $89.80 - $179.60',
    image: 'https://drive.google.com/thumbnail?id=1i0efar_ftC01mUpuoTMO3e8CzO8EqmSe&sz=w1000',
    category: 'catering-appetizers',
  },
  // Catering - Entrees
  {
    id: 'c1',
    name: 'Chicken Alla Vodka Tray',
    description: 'Chicken breasts, coated in seasoned flour and a light egg batter, topped with our homemade creamy vodka sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1dq4Ag9sTEdEMLlI4BIo_FqkY4qAoYzfS&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c2',
    name: 'Chicken Cacciatore Tray',
    description: 'Chicken breasts, coated in seasoned flour and a light egg batter, topped with our homemade creamy vodka sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=12cDQtd8u07Fdo0YXS7-AApudhO71f-9R&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c3',
    name: 'Chicken Caprese Tray',
    description: 'Grilled Chicken topped with our homemade caprese mix and drizzled with balsamic glaze. Medium Tray served with 10 pieces of homemade bread. Large Tray served with 20 pieces of homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1WXFe-ES8HmWWIUl_kitTr-FvAnc_t-dt&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c4',
    name: 'Chicken Francese Tray',
    description: 'Chicken breasts, lightly battered in seasoned flour and egg, finished with a white wine and lemon butter sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1Vz5V4t_hbDwt8ha5TCJG-EFv18rH7CeN&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c5',
    name: 'Chicken Marsala Tray',
    description: 'Chicken breasts, lightly coated in seasoned flour, sautéed with fresh mushrooms in a creamy marsala sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1xqqAuy7ifLWqJS28ypEl9yFouhsyxEy1&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c6',
    name: 'Chicken Parmigiana Tray',
    description: 'Tender Chicken Cutlets, dipped in seasoned flour and a light egg batter, coated with Italian breadcrumbs, topped with savory pomodoro sauce, and melted mozzarella. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1T92kiY05DQL1UIkCO3FR-7Jmjp2XpgHI&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c7',
    name: 'Grilled Chicken Tray',
    description: 'Topped with spinach, roasted peppers, and fresh mozzarella. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$73.99',
    priceRange: '$73.99 - $147.99',
    image: 'https://drive.google.com/thumbnail?id=1BodE8XwbPIj6RByAbTcF_1P-0cLrYqTa&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c8',
    name: 'Meatballs with Pomodoro Sauce Tray',
    description: 'Beef Meatballs cooked in our homemade pomodoro sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$60.99',
    priceRange: '$60.99 - $121.99',
    image: 'https://drive.google.com/thumbnail?id=1jK0sGK91D19gY6j30F96-b6cqRqa5Rd8&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c9',
    name: 'Sausage with Pomodoro Sauce Tray',
    description: 'Sweet Sausage Links, cooked in our homemade pomodoro sauce. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$60.99',
    priceRange: '$60.99 - $121.99',
    image: 'https://drive.google.com/thumbnail?id=1bnXLX1n6D-KwuTs1VlzxAzAhVKT9UyhJ&sz=w1000',
    category: 'catering-entrees',
  },
  {
    id: 'c10',
    name: 'Sausage, Peppers & Onions Tray',
    description: 'Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$52.49',
    priceRange: '$52.49 - $104.99',
    image: 'https://drive.google.com/thumbnail?id=1r3GF-V-zlfqxx_rYBLTLX6QDtqlHn9vz&sz=w1000',
    category: 'catering-entrees',
  },
  // Catering - Pasta & Baked Pasta
  {
    id: 'cp1',
    name: 'Baked Ziti Tray',
    description: 'Ziti with a blend of ricotta cheese and pomodoro sauce, topped with mozzarella cheese. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=1FmaDEfbCC8oPJt7WZFIYSae8CcCH3BRZ&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp2',
    name: 'Cheese Ravioli Tray',
    description: 'Ravioli stuffed with ricotta, topped with pomodoro sauce and mozzarella. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=1kggvMQhFWn441L596-dywaJJYuBZe1NU&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp3',
    name: 'Cheese Tortellini Tray',
    description: 'Round pasta filled with ricotta in our pomodoro sauce topped with mozzarella. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=1o_TnLoiDKGkK7bQZ8Va6yY0MfIvjFyHd&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp4',
    name: 'Classic Lasagna Tray',
    description: '(Ground Beef) Five Layers of wide pasta ribbons, layered with a blend of bolognese sauce, ricotta cheese, pomodoro sauce, and topped with mozzarella cheese. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$68.49',
    priceRange: '$68.49 - $136.99',
    image: 'https://drive.google.com/thumbnail?id=1y7UtecNyAqS6w9MoCnzYFw1SmKY5aTao&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp5',
    name: 'Eggplant Parmigiana Tray',
    description: 'Four layers of fresh-baked breaded eggplant, grated parmesan cheese, pomodoro sauce, and topped with melted mozzarella cheese. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=1ilOLY0SvZbvlSzV0W3NEdF-jxfpN43lA&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp6',
    name: 'Eggplant Rollatini Tray',
    description: 'Fresh baked eggplant cutlets, rolled and stuffed with ricotta Pomodoro sauce and topped with mozzarella.Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=15NrXYaicxzNzGq1FqLspFowd6EKnXAUv&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp7',
    name: 'Pasta with Alfredo Sauce Tray',
    description: 'Heavy cream, butter and pecorino cheese. Served over your choice of pasta. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$43.49',
    priceRange: '$43.49 - $86.99',
    image: 'https://drive.google.com/thumbnail?id=1JQv6RGPYJFAndzgk5lbZVwo0vTyfQTpr&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp8',
    name: 'Pasta with Bolognese Sauce Tray',
    description: 'Vine-ripened fresh tomatoes, sautéed lean ground beef, olive oil, onions, carrots, Italian spices and basil. Served over your choice of pasta. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$49.49',
    priceRange: '$49.49 - $98.99',
    image: 'https://drive.google.com/thumbnail?id=1ytitD1Z1RGVaia-cEE81Lkptf3-g1Vuj&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp9',
    name: 'Pasta with Marinara Sauce Tray',
    description: 'Vine-ripened fresh tomatoes, garlic, olive oil and fresh basil. Served over your choice of pasta. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$42.49',
    priceRange: '$42.49 - $84.99',
    image: 'https://drive.google.com/thumbnail?id=1S5f36Lo4-n_Vum8IxuznFJ6DeQ_m7sWZ&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp10',
    name: 'Pasta with Pomodoro Sauce Tray',
    description: 'Vine-ripened fresh tomatoes, onions, carrots, hint of garlic, Italian spices and basil. Served over your choice of pasta. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$42.49',
    priceRange: '$42.49 - $84.99',
    image: 'https://drive.google.com/thumbnail?id=1DaK8bt9GjY9ialaLYk0FZfkL-3fAt6_f&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp11',
    name: 'Pasta with Vodka Sauce Tray',
    description: 'Fresh tomatoes, blended with heavy cream, parmesan and a hint of vodka. Served over your choice of pasta.Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$46.99',
    priceRange: '$46.99 - $93.99',
    image: 'https://drive.google.com/thumbnail?id=1PB2bie2XZ6-2DQuOjTEeqxRHGfokCvGV&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp12',
    name: 'Stuffed Shells Tray',
    description: 'Pasta shells filled with ricotta cheese, topped with Pomodoro sauce and mozzarella. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$50.49',
    priceRange: '$50.49 - $100.99',
    image: 'https://drive.google.com/thumbnail?id=1vh_AFBeRbgqAyWFmq9HftOD00xa4JNXM&sz=w1000',
    category: 'catering-pasta',
  },
  {
    id: 'cp13',
    name: 'Baked Gnocchi',
    description: 'Potato gnocchi baked with pomodoro sauce and topped with mozzarella cheese. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$55.99',
    priceRange: '$55.99 - $110.99',
    image: 'https://images.unsplash.com/photo-1669908978664-485e69bc26cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMGdub2NjaGklMjBjaGVlc2V8ZW58MXx8fHwxNzY1OTA0MjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'catering-pasta',
  },
  {
    id: 'cp14',
    name: 'Gnocchi Alla Sorrentina',
    description: 'Potato gnocchi with pomodoro sauce, fresh mozzarella, and basil. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$55.99',
    priceRange: '$55.99 - $110.99',
    image: 'https://images.unsplash.com/photo-1642372849465-ad4afb304542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbm9jY2hpJTIwc29ycmVudGluYSUyMHRvbWF0b3xlbnwxfHx8fDE3NjU5MDQyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'catering-pasta',
  },
  // Catering - Salads
  {
    id: 'csalad1',
    name: 'Antipasto Salad Bowl',
    description: 'Salami, capicola, ham, provolone, black and green olives, tomatoes, red onions, and marinated vegetables. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$75.99',
    priceRange: '$37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1ihC2bZxrTcSThAYBeAGnwVgUzYuODsPa&sz=w1000',
    category: 'catering-salad-soups',
    defaultSize: 'Large',
  },
  {
    id: 'csalad2',
    name: 'Caesar Salad Bowl',
    description: 'Shredded parmesan cheese, croutons, and rich creamy caesar dressing. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$61.99',
    priceRange: '$30.99 - $61.99',
    image: 'https://drive.google.com/thumbnail?id=1fgo0cFZdg6jHr7QzX5Uz_PiKKdUTARIH&sz=w1000',
    category: 'catering-salad-soups',
  },
  {
    id: 'csalad3',
    name: 'Chicken Caesar Salad Bowl',
    description: 'Shredded parmesan cheese, croutons, grilled chicken, and rich creamy caesar dressing. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$75.99',
    priceRange: '$37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1MwG1q7uElqdUe3b0MGXc7M9Kto8PGKGN&sz=w1000',
    category: 'catering-salad-soups',
  },
  {
    id: 'csalad4',
    name: 'Garden Salad Bowl',
    description: 'Tomatoes, red onions, shredded carrots, cucumbers, green and black olives. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$67.99',
    priceRange: '$33.99 - $67.99',
    image: 'https://drive.google.com/thumbnail?id=1-sh2C5Cmy7inSH3zyQgjclc2i_e_W5hz&sz=w1000',
    category: 'catering-salad-soups',
  },
  {
    id: 'csalad5',
    name: 'Roasted Red Pepper Salad Bowl',
    description: 'Roasted red peppers, ciliegine mozzarella and black olives. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$75.99',
    priceRange: '$37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1UYh8TPgtEqDyW68XCps3pb7TWwTOcmCO&sz=w1000',
    category: 'catering-salad-soups',
    defaultSize: 'Large',
  },
  {
    id: 'csalad6',
    name: 'Three Cheese Salad Bowl',
    description: 'Mozzarella, provolone and american cheeses with tomatoes, onions, black and green olives, cucumbers and marinated vegetables. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$75.99',
    priceRange: '$37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1jagiQXOLqx7VwudiGGydZ1qfOB8OCxPw&sz=w1000',
    category: 'catering-salad-soups',
    defaultSize: 'Large',
  },
  {
    id: 'csalad7',
    name: 'Traditional Chef Salad Bowl',
    description: 'Ham, turkey, provolone, sliced eggs, green and black olives, croutons, tomatoes, red onions & shredded carrots. Medium Tray served with 10 pieces of our homemade bread. Large Tray served with 20 pieces of our homemade bread.',
    price: '$75.99',
    priceRange: '$37.99 - $75.99',
    image: 'https://drive.google.com/thumbnail?id=1SxrwkCJoiYU-F_RLkA5NP7_Rgz9IS2oN&sz=w1000',
    category: 'catering-salad-soups',
  },
  // Catering - Sandwiches
  {
    id: 'c13',
    name: 'Hoagie Platter',
    description: 'Choice of Italian, Turkey, Ham & American Cheese, or Tuna Fish. Mix & Match. Each Hoagie comes with 1 bag of chips. (Minimum Order of 4)',
    price: '$0.00',
    priceRange: '$49.99 - $99.99',
    image: 'https://drive.google.com/thumbnail?id=1q-i0Qgnja2KGZRX95ZnYm7g95_DpDewT&sz=w1000',
    category: 'catering-hoagies-wraps',
  },
  {
    id: 'c14',
    name: 'Wrap Platter',
    description: 'Choice of Italian, Turkey, Ham & American Cheese, Tuna Salad, Grilled Veggie, Chicken Caesar, Grilled Chicken, Cheesesteak, Chicken Cheesesteak, Buffalo Chicken Cheesesteak. Mix & Match. Each Wrap comes with 1 bag of chips. (Minimum Order of 4).',
    price: '$0.00',
    priceRange: '$49.99 - $99.99',
    image: 'https://drive.google.com/thumbnail?id=1qTCYKLBqijjlkZ1EHOG4EeCx_ZfW8bf-&sz=w1000',
    category: 'catering-hoagies-wraps',
  },
  {
    id: 'c15',
    name: 'Hot Sandwich Platter',
    description: 'Choice of Cheesesteak, Chicken Cheesesteak, Buffalo Chicken Cheesesteak, Cheesesteak Hoagie, Chicken Cheesesteak Hoagie, Chicken Parm Sandwich, Eggplant Parm Sandwich, Meatball Parm Sandwich, Pizza Steak, Sausage Parm Sandwich, Sausage Peppers Onions Sandwich, Passariellos Cheesesteak, Cooper Passiesteak. Mix & Match. Each Sandwich comes with 1 bag of chips. (Minimum Order of 4)',
    price: '$0.00',
    priceRange: '$49.99 - $99.99',
    image: 'https://drive.google.com/thumbnail?id=1ImoaJfWit81GZHj2v31wHzwTdYR9V1DB&sz=w1000',
    category: 'catering-hoagies-wraps',
  },
  // Catering - Sides
  {
    id: 'cside1',
    name: 'Broccoli Tray',
    description: 'Fresh cut broccoli crowns steamed then sauteed in olive oil and garlic.',
    price: '$82.99',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1G82l4yh0APyHmwZBb-10Sia-TZ2VJ9IT&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside2',
    name: 'Cauliflower Medley Tray',
    description: 'Cauliflower roasted with zucchini, mixed peppers and raisins.',
    price: '$41.49',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1qcZJZlEXpCFgEj-EYxYO02eR40xWeb0p&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside3',
    name: 'Garden Rice Tray',
    description: 'Fluffy rice steamed with a medley of fresh carrots, peppers, onions, and peas.',
    price: '$41.49',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1jAcBCC98UbgHd7cFp4zjAlLIb14BUwr1&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside4',
    name: 'Mashed Potatoes Tray',
    description: 'Deliciously creamy mashed potatoes whipped to perfection.',
    price: '$82.99',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1hReCjIPAQWVoUpxip--lL17LZMYBPlSg&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside5',
    name: 'Roasted Potatoes & Carrots Tray',
    description: 'Red bliss potatoes, roasted with carrots, red onions and a touch of marinara sauce.',
    price: '$82.99',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=191WMNnjkl98_eD6SsjzGebqAInOLHsqW&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside6',
    name: 'Roasted Rosemary Potatoes Tray',
    description: 'Fresh rosemary and spices roasted with red bliss potatoes with fresh rosemary, olive oil and spices.',
    price: '$82.99',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1xZvNd6AdOXGTnMbsMMD6_F5WSQgbp92t&sz=w1000',
    category: 'catering-sides',
  },
  {
    id: 'cside7',
    name: 'String Beans & Carrots Tray',
    description: 'Farm fresh string beans and carrots sauteed in olive oil and garlic.',
    price: '$41.49',
    priceRange: '$41.49 - $82.99',
    image: 'https://drive.google.com/thumbnail?id=1UwySUWwL--7x8jlx4enashkEYRH2pxoh&sz=w1000',
    category: 'catering-sides',
  },
  // Catering - Whole Cakes
  {
    id: 'ccake1',
    name: 'Chocolate Overload Cake',
    description: 'Made with layers of moist chocolate sponge, silky chocolate ganache, and a creamy chocolate frosting',
    price: '$69.99',
    image: 'https://drive.google.com/thumbnail?id=14926Br5zmumNvhnp9NZ_Aywjzc2BQYUd&sz=w1000',
    category: 'catering-whole-cakes',
  },
  {
    id: 'ccake2',
    name: 'Limoncello Mascarpone Tray',
    description: 'Layers of lemony sponge cakes, filled with a mixture of mascarpone and cream.',
    price: '$59.99',
    image: 'https://drive.google.com/thumbnail?id=1qNMMfx4PMrvPEF-_NW4htO2SsiveojDt&sz=w1000',
    category: 'catering-whole-cakes',
  },
  {
    id: 'ccake3',
    name: 'Reese\'s Peanut Butter Pie Cake',
    description: 'Dark chocolate and peanut butter mousse mixed with reeses peanut butter cups.',
    price: '$89.99',
    image: 'https://drive.google.com/thumbnail?id=1gOx3qiNpz2dvC9BlqwD5UE-i2RkVovH_&sz=w1000',
    category: 'catering-whole-cakes',
  },
  {
    id: 'ccake4',
    name: 'Tiramisu Tray',
    description: 'Espresso and Kahlua soaked Savoiardi biscuits surrounded with cream cheese filing. Garnished with chocolate flakes.',
    price: '$59.99',
    image: 'https://drive.google.com/thumbnail?id=1MB2F8oWRsdJfgmtx3hVKuJP-1ijJd-P8&sz=w1000',
    category: 'catering-whole-cakes',
  },
  // Catering - Party Trays
  {
    id: 'cptray1',
    name: 'Handfilled Cannoli Plain Tray',
    description: 'Crispy pastry shells filled with sweet ricotta cheese, dried fruit, and chocolate chips.',
    price: '$89.99',
    priceRange: '$44.99 - $89.99',
    image: 'https://drive.google.com/thumbnail?id=1lPT2kqfPWyENq24WtfrMKx40xjlGVnwA&sz=w1000',
    category: 'catering-party-trays',
  },
  {
    id: 'cptray2',
    name: 'Handfilled Chocolate Shell Cannoli Tray',
    description: 'Crispy pastry shells, dipped in chocolate then filled with sweet ricotta cheese, dried fruit, and chocolate chips.',
    price: '$99.99',
    priceRange: '$49.99 - $99.99',
    image: 'https://drive.google.com/thumbnail?id=1CHX8P3uHdFNPREyh9XF-ELAHY65TRyE_&sz=w1000',
    category: 'catering-party-trays',
  },
  {
    id: 'cptray3',
    name: 'Mini Cannoli Tray',
    description: 'Crispy pastry shells filled with sweet ricotta cheese, dried fruit, and chocolate chips.',
    price: '$59.99',
    priceRange: '$29.99 - $59.99',
    image: 'https://drive.google.com/thumbnail?id=1Yo976kdvIWNuza0V7O3rMOqgrTF2DLNN&sz=w1000',
    category: 'catering-party-trays',
  },
  {
    id: 'cptray4',
    name: 'Triple Chocolate Chip Cookie Tray',
    description: 'Jumbo cookie baked with chunks of rich chocolate.',
    price: '$59.99',
    priceRange: '$29.99 - $59.99',
    image: 'https://drive.google.com/thumbnail?id=17-yUFYxpvnARx4zfHMkyjxPZ-4G5FZE3&sz=w1000',
    category: 'catering-party-trays',
  },
  {
    id: 'cptray5',
    name: 'Brownie & Cookie Tray',
    description: 'Jumbo cookie baked with chunks of rich chocolate & chocolate brownie crafted with a premium dark chocolate, baked to perfection with a soft center and crisp edges. Tray comes with your choice of 5 brownies and 5 cookies, or 10 brownies and 10 cookies.',
    price: '$59.99',
    priceRange: '$29.99 - $59.99',
    image: 'https://drive.google.com/thumbnail?id=1E04hZIDhViZgXKF0PvSSja6Mq3YsyMRT&sz=w1000',
    category: 'catering-party-trays',
  },
  {
    id: 'cptray6',
    name: 'Brownie Tray',
    description: 'Chocolate Brownie crafted with a premium dark chocolate, baked to perfection with a soft center and crisp edges.',
    price: '$59.99',
    priceRange: '$29.99 - $59.99',
    image: 'https://drive.google.com/thumbnail?id=1Lp9zx7u-P4dWdVwqv7TRiRmhnsEC-m8S&sz=w1000',
    category: 'catering-party-trays',
  },
  // Catering - Seafood Pasta
  {
    id: 'cs1',
    name: 'Baby Clam Sauce Tray',
    description: 'Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$137.99',
    priceRange: '$68.99 - $137.99',
    image: 'https://drive.google.com/thumbnail?id=1kDWkVbWs_ccfbU4yokz0ujbPw3q5hpLh&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs2',
    name: 'Calamari Marinara Tray',
    description: 'Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$133.99',
    priceRange: '$66.99 - $133.99',
    image: 'https://drive.google.com/thumbnail?id=1fg2CnfyojU9Zr9b05sUKqoLOr12dQyL6&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs3',
    name: 'Fried Flounder Tray',
    description: 'Fillets of Flounder, breaded and fried to a perfect crispy golden brown, served with fresh lemon wedges and tartar sauce. Medium Tray comes with 10 fillets and 10 pieces of Homemade bread. Large Tray comes with 20 fillets and 20 pieces of Homemade bread.',
    price: '$135.99',
    priceRange: '$67.99 - $135.99',
    image: 'https://drive.google.com/thumbnail?id=1W-huR70Bm4c5oQPFxBH8wWE5puEvTMtY&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs4',
    name: 'Mussels Tray',
    description: 'Mussels sautéed in garlic & olive oil, served with your choice of marinara sauce or white wine and garlic sauce. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$133.99',
    priceRange: '$66.99 - $133.99',
    image: 'https://drive.google.com/thumbnail?id=1M1ssQ8ENkBIyCGvwabzF2dI2B7jCIHFa&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs5',
    name: 'Seafood Combo Tray',
    description: 'Mussels, shrimp, & calamari sautéed in garlic & olive oil, served with your choice of white or red sauce. Medium Tray served with 10 pieces of our Homemade bread. Large Tray served with 20 pieces of our Homemade bread.',
    price: '$77.99',
    priceRange: '$77.99 - $155.99',
    image: 'https://drive.google.com/thumbnail?id=1dmzd4F69ZZBMTQPmuCRKPTi_L-OnELua&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs6',
    name: 'Shrimp Marinara Tray',
    description: 'Peeled shrimp sautéed in garlic, olive oil and homemade marinara sauce, served over your choice of pasta. Medium Tray comes with 30 pieces of shrimp and 10 pieces of our Homemade bread. Large Tray comes with 60 pieces of shrimp and 20 pieces of our Homemade bread.',
    price: '$137.99',
    priceRange: '$68.99 - $137.99',
    image: 'https://drive.google.com/thumbnail?id=1O08tO_n_KTIK0XjWwGuMpHOV3Sk3HgSn&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  {
    id: 'cs7',
    name: 'Tilapia Tray',
    description: 'Fillets of white-flake tilapia encrusted with chipotle tortilla chips, topped with fresh tomatoes, red onions, and a lemon wedge. Medium Tray comes with 10 Fillets of Tilapia and 10 pieces of our Homemade bread. Large Tray comes with 20 fillets of tilapia and 20 pieces of our Homemade bread.',
    price: '$106.99',
    priceRange: '$106.99 - $213.99',
    image: 'https://drive.google.com/thumbnail?id=1K5btgUkwlO8fLRBfBPtrQMgzG3zF4eyr&sz=w1000',
    category: 'catering-seafood-pasta',
  },
  // Catering - Beverages
  {
    id: 'cbev1',
    name: "Passariello's Water",
    description: 'Refreshing bottled water',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1E3OQK-JYZSMqFXZQ-LvW5ILO5-BnaQnU&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev2',
    name: "Passariello's Sparkling Water",
    description: 'Refreshing sparkling water',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1ncvuDYrtVtl9jQp8aD0KzArQtKqhBlA0&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev3',
    name: "Kid's Apple Juice",
    description: 'Pure apple juice',
    price: '$1.79',
    image: 'https://drive.google.com/thumbnail?id=107gnynzrSacPDOkMHjBaBEAAjzX_stzM&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev4',
    name: 'Starry 2L',
    description: 'Lemon-lime soda',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1Fku2fLf48jtCA0SFuAdV02N3VVNtsp9Q&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev5',
    name: 'Diet Pepsi 20oz',
    description: 'Diet cola beverage',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1AHCaOFkOZtEaRaAEI5SIS6BPLDCF59nV&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev6',
    name: 'Pepsi 20oz',
    description: 'Classic cola beverage',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1JpgdoknAMiCj8ygdZYA7c2vFcV6RZLbN&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev7',
    name: 'Cherry Pepsi 20oz',
    description: 'Cherry-flavored cola',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1GNrz-gtfDzVStuIfki1dEi-vZayFR_VW&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev8',
    name: 'Brisk Iced Tea 2L',
    description: 'Refreshing iced tea',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1gGmo4YB1IElJag6Ho4gQ1-qK0Dz9-86f&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev9',
    name: 'Ginger Ale 2L',
    description: 'Crisp ginger ale',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1fMPwQU8-G84hMxRqS7qj589gRCNFBt7U&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev10',
    name: 'Ginger Ale 20oz',
    description: 'Crisp ginger ale',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1WLRyisDosWTQkAVJWGJ4Om2imiIDY0iq&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev11',
    name: "Kid's Chocolate Milk",
    description: 'Rich chocolate milk',
    price: '$1.79',
    image: 'https://drive.google.com/thumbnail?id=1GYr6taakeRulvuXAzkob3npvpnpwF6UN&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev12',
    name: 'Mug Root Beer 2L',
    description: 'Classic root beer',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1G8I811J3nvvxoZ8XbuBiO3clcfXYHXgx&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev13',
    name: 'Mountain Dew 20oz',
    description: 'Citrus soda',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1BccbrFdK-S9e-tFnx5uNfdihRF7HNzpw&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev14',
    name: 'Mountain Dew 2L',
    description: 'Citrus soda',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1XcE9vTHosX1BS82Cj4PNY1AkZt7LZ-yQ&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev15',
    name: 'Starry 20oz',
    description: 'Lemon-lime soda',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1O3pU2657SYzrUMoKLzrW84LvvX7kvq4E&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev16',
    name: 'Pepsi 2L',
    description: 'Classic cola beverage',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1WzjWxgvbU9QaJxuwvUrOQ1_j4nILsZKS&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev17',
    name: 'Cherry Pepsi 2L',
    description: 'Cherry-flavored cola',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1GTQPhw1yK1HrYiGjGp2gfo1Hqbdk9GcN&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev18',
    name: 'Diet Pepsi 2L',
    description: 'Diet cola beverage',
    price: '$3.99',
    image: 'https://drive.google.com/thumbnail?id=1F3v0hCmak_vwjpmOhZbGXxkGVhJ50DfF&sz=w1000',
    category: 'catering-beverages',
  },
  {
    id: 'cbev19',
    name: 'Brisk Iced Tea 20oz',
    description: 'Refreshing iced tea',
    price: '$2.99',
    image: 'https://drive.google.com/thumbnail?id=1wpQU7v96vnTYkUoVRkyY-3gK5yGzaXBH&sz=w1000',
    category: 'catering-beverages',
  },
  // Catering - Desserts
  {
    id: 'cd1',
    name: 'Chocolate Molten Lava Cake',
    description: 'Moist dark chocolate cake enrobed with dark chocolate, filled with dark chocolate truffle that melts when heated up.(Please heat up in Microwave for 45 seconds)',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1M-6K4D_oD3g5Eq4PkR0E2aJEN_mSNRMA&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd2',
    name: 'Cookie Lava',
    description: 'Jumbo cookie baked with chunks of rich chocolate truffle that melts when heated up.(Please heat up in Microwave for 45 seconds)',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1oqXRQ5rDP2fivh3aQ_cfqpUTSaTieTXx&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd3',
    name: 'Dark Side of the Moon',
    description: 'Fudge cake soaked with coffee liqueur and filled with chocolate mousse. Enrobed in ganache and finished with chocolate crumbs and a crescent moon.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1cmpMOyZSS2XtPCNCzEPqXLikpWvTSNL3&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd4',
    name: 'Tiramisu',
    description: 'Layers of espresso drenched ladyfingers separated by mascarpone cream and dusted with cocoa powder.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1XbNi8dJGuogG7qOG0Nm3xL6STeHpoNib&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd5',
    name: 'New York Cheesecake',
    description: 'A rich cheesecake exploding with vanilla flavor sitting on a buttery graham cracker crust.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1KWdGeUtxNNx9PM02MGy8wBEZQYRjZZlL&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd6',
    name: "Reese's Peanut Butter Pie",
    description: 'Dark chocolate and peanut butter mousse mixed with Reese\'s peanut butter cups.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1sKk80VLKPOX8wOZ2EGGKpw8539xemTug&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd7',
    name: 'Carrot Cake',
    description: 'carrot cake made with freshly grated carrots, warm spices, and a hint of vanilla.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1N06OqTGyNLg5yMGJ04Kn5dPEIRZDEZdg&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd8',
    name: 'Peanut Butter Bomb',
    description: 'A chocolate candy bar bottom. Topped with peanut butter ganache and a mound of chocolate mousse. Coated in a blanket of chocolate ganche. Finished with chopped peanuts and peanut butter sauce. GLUTEN FREE',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1McuANMiSmm18pgKKVokhlds5guzn3gV6&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd9',
    name: 'Limoncello Mascarpone',
    description: 'Layers of lemony sponge cake, filled with a mixture of mascarpone and cream.',
    price: '$7.99',
    image: 'https://drive.google.com/thumbnail?id=1v_NcMuPkcnrTXyBJX2_hZI5Jqm6NJBUN&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd10',
    name: 'Chocolate Overload Cake',
    description: 'Made with layers of moist chocolate sponge, silky chocolate ganache, and a creamy chocolate frosting',
    price: '$8.99',
    image: 'https://drive.google.com/thumbnail?id=1-osIjijJl0auXYkiypXd4vOnz_XbUja5&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd11',
    name: 'Chocolate Pudding Brownie Cup',
    description: 'Chocolate pudding, whipped cream and brownie crumbles.',
    price: '$6.49',
    image: 'https://drive.google.com/thumbnail?id=1CmxoI_yZNkbQlwFnj1ugZadKIiooSSPy&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd12',
    name: 'Chocolate Shell Cannoli',
    description: 'Crispy pastry shells dipped in chocolate, filled with sweet ricotta cheese, dried fruit, and chocolate chips.',
    price: '$5.49',
    image: 'https://drive.google.com/thumbnail?id=1jNO4jodVWqx0sFIKK_OSSmWCaCbYVhmV&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd13',
    name: 'Plain Shell Cannoli',
    description: 'Crispy pastry shells filled with sweet ricotta cheese and chocolate chips.',
    price: '$4.99',
    image: 'https://drive.google.com/thumbnail?id=1q1W4fx3rdo48cZ66b-sZlV20kXXZMHkM&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd14',
    name: 'Triple Chocolate Chip Cookie',
    description: 'Jumbo cookie baked with chunks of rich chocolate.',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1KXgNjjUtdVMJxI58bevEkDfXH_a5sGDi&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd15',
    name: 'M&M Cookie',
    description: 'buttery cookie loaded with colorful M&M candies in every bite.',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=1sMJwxgMlZM2yLfS86SDw3QRHeFjy5Xex&sz=w1000',
    category: 'catering-desserts',
  },
  {
    id: 'cd16',
    name: 'Oatmeal Cookie',
    description: 'chewy oatmeal cookie made with whole rolled oats',
    price: '$3.79',
    image: 'https://drive.google.com/thumbnail?id=152EJJEqMd2bvXmfeTNdl906A1P_hWcZ1&sz=w1000',
    category: 'catering-desserts',
  },
];

interface CartItemCustomization {
  category: string;
  items: string[];
}

// UNIFIED SELECTION TYPE - Single source of truth for ALL user choices
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
  label: string;           // Human-readable text (e.g., "Add Extra Sauce") - NEVER show id in UI
  type: SelectionType;     // Kind of selection
  groupId?: string;        // Group identifier (e.g., "hot_hoagie_extra")
  groupTitle?: string;     // Exact group banner name from menu (e.g., "Extra Toppings")
  productId?: string;      // Base product id this selection belongs to
  distribution?: 'left' | 'whole' | 'right'; // For pizza half toppings
  beverageCategory?: string; // For beverages
  removedIngredients?: string[];
}

interface CartItem {
  id: string;
  productId: string;       // Original product ID - REQUIRED
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: CartItemCustomization[]; // LEGACY - for backward compatibility
  selections?: CartSelection[]; // NEW STRUCTURED MODEL - Single source of truth
  category?: string;
}

// CRITICAL: Define stores OUTSIDE component to prevent recreation on every render
// This prevents infinite loops in useAutoLocationResolution
const STORE_LOCATIONS: Store[] = [
  {
    id: '1',
    name: 'Haddonfield',
    address: '119 Kings Hwy E',
    city: 'Haddonfield',
    state: 'NJ',
    zip: '08033',
    lat: 39.89792706143064,
    lng: -75.03314038686908,
  },
  {
    id: '2',
    name: 'Moorestown',
    address: '13 W Main St',
    city: 'Moorestown',
    state: 'NJ',
    zip: '08057',
    lat: 39.96395827445834,
    lng: -74.94753350369767,
  },
  {
    id: '3',
    name: 'Voorhees',
    address: '111 Laurel Oak Rd',
    city: 'Voorhees',
    state: 'NJ',
    zip: '08043',
    lat: 39.84678444777853,
    lng: -74.98846601755474,
  },
];

// Patch console.error to downgrade specific geolocation errors (permissions policy)
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const isPermissionsPolicyError = args.some(arg => 
    typeof arg === 'string' && arg.toLowerCase().includes('permissions policy')
  );

  if (isPermissionsPolicyError) {
    const newArgs = args.map(arg => 
      typeof arg === 'string' ? arg.replace(/❌\s*/g, '') : arg
    );
    // Use warn instead of error to reduce alarm
    console.warn(...newArgs);
    return;
  }
  originalConsoleError.apply(console, args);
};

// Patch console.log to suppress spam unless debugCart=1
const originalConsoleLog = console.log;
const debugCartEnabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugCart') === '1';

console.log = (...args: any[]) => {
  const msg = args.length > 0 && typeof args[0] === 'string' ? args[0] : '';
  
  // Filter out noisy logs if debug is not enabled
  if (!debugCartEnabled) {
    if (msg.includes('MobileBottomNav rendered with:')) return;
    if (msg.includes('Header - openMobileMenu changed:')) return;
    if (msg.includes('Searching for:')) return;
    if (msg.includes('Mobile detected, skipping body scroll lock')) return;
    if (msg.includes('body.overflowY:')) return;
  }
  
  originalConsoleLog.apply(console, args);
};

// H2 Title Styling Constant - Single Source of Truth
const H2_TITLE_CLASS = "-mt-3 sm:-mt-4 mb-2 sm:mb-3 font-bold text-[26px] sm:text-[32px] text-[#404041] text-left";

export default function App() {
  // Fix body scroll lock issues globally
  useBodyScrollLockFix();
  
  // REQUIRED: User location detection
  const {
    coords: userCoords,
    source: locationSource,
    loading: locationLoading,
    error: locationError,
    permissionDenied: locationPermissionDenied,
    retryGeolocation,
  } = useRequiredUserLocation(true);

  // Calculate delivery eligibility based on user location
  const deliveryEligibility = userCoords 
    ? getDeliveryEligibility(userCoords, STORE_LOCATIONS)
    : { availableStores: [], nearestStore: null, isDeliverable: false };

  // Calculate pickup eligibility based on user location (50 miles radius)
  const pickupEligibility = userCoords
    ? getPickupEligibility(userCoords, STORE_LOCATIONS)
    : { canPickup: false, pickupStores: [], nearestStore: null };

  // AUTO-RESOLVE pickup and delivery based on user location
  const { 
    resolution: locationResolution, 
    loading: resolutionLoading 
  } = useAutoLocationResolution(userCoords, STORE_LOCATIONS);
  
  const [showLanding, setShowLanding] = useState(false);
  const [fromLandingPage, setFromLandingPage] = useState(true);
  const [mode, setMode] = useState<'regular' | 'guest-favorites' | 'catering' | 'reorder'>('regular');
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'location' | 'location-detail' | 'checkout' | 'login' | 'register'>('list');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileBottomTab, setMobileBottomTab] = useState<'home' | 'menu' | 'locations' | 'more'>('menu');
  const [showMobileHome, setShowMobileHome] = useState(false);
  const [isMobileDeliveryModalOpen, setIsMobileDeliveryModalOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);

  // Helper functions for modal state management
  const openMobileDeliveryModal = () => {
    setIsMobileDeliveryModalOpen(true);
  };

  const closeMobileDeliveryModal = () => {
    setIsMobileDeliveryModalOpen(false);
  };

  const [scheduledDateString, setScheduledDateString] = useState('Today');
  const [scheduledTimeString, setScheduledTimeString] = useState('ASAP');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Map section IDs to category IDs for the header highlight
  const mapSectionIdToCategory = (id: string) => {
    // Pizzelle and Gelati sections should highlight the 'desserts' button
    if (id === 'pizzelle' || id === 'gelati') {
      return 'desserts';
    }
    return id;
  };

  // Scroll spy - detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header
      
      // Get all section entries
      const sectionEntries = Object.entries(sectionRefs.current);
      
      // Find which section is currently in view
      for (let i = sectionEntries.length - 1; i >= 0; i--) {
        const [id, ref] = sectionEntries[i];
        if (ref) {
          const top = ref.offsetTop;
          if (scrollPosition >= top) {
            const mappedId = mapSectionIdToCategory(id);
            setActiveCategory(mappedId);
            break;
          }
        }
      }
    };

    // Call once on mount to set initial category
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mode]);

  // Update active category when mode changes
  const handleModeChange = (newMode: 'regular' | 'guest-favorites' | 'catering' | 'reorder') => {
    // Reorder requires authenticated user
    if (newMode === 'reorder' && !user) {
      setMode('reorder');
      setViewMode('login');
      return;
    }

    setMode(newMode);
    
    // Close detail view if open
    if (viewMode === 'detail') {
      setViewMode('list');
      setSelectedProduct(null);
      setIsEditMode(false);
      setEditingItemId(null);
    }
    
    // Scroll to top of page immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Guest Favorites doesn't need category navigation
    const targetCategory = newMode === 'catering' ? 'catering-appetizers' : 'pizzas';
    setActiveCategory(targetCategory);
  };

  // Handle category change from CategoryNav
  const handleCategoryChange = (categoryId: string) => {
    // Close detail view if open
    if (viewMode === 'detail') {
      setViewMode('list');
      setSelectedProduct(null);
      setIsEditMode(false);
      setEditingItemId(null);
      
      // Wait for the view to change before scrolling to category
      setActiveCategory(categoryId);
      setTimeout(() => {
        const section = sectionRefs.current[categoryId];
        if (section) {
          const yOffset = -150; // Offset for sticky header
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      }, 100);
    } else {
      setActiveCategory(categoryId);
      // Scroll directly to category
      setTimeout(() => {
        const section = sectionRefs.current[categoryId];
        if (section) {
          const yOffset = -150; // Offset for sticky header
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      }, 50);
    }
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Haddonfield');
  const [selectedLocationForDetail, setSelectedLocationForDetail] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<{
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  } | null>(null);
  const [scheduledTime, setScheduledTime] = useState('ASAP');
  const [openCart, setOpenCart] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [showPickupDialog, setShowPickupDialog] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showOrderTypePanel, setShowOrderTypePanel] = useState(false);
  
  // Auth states
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const supabase = getSupabaseClient();

  // Load delivery info from localStorage on mount
  useEffect(() => {
    const savedDeliveryMode = localStorage.getItem('deliveryMode');
    const savedDeliveryAddress = localStorage.getItem('deliveryAddress');
    const hasVisitedInSession = sessionStorage.getItem('hasVisitedBefore');
    
    // If user has visited in this session, don't show welcome modal
    if (hasVisitedInSession === 'true') {
      setShowWelcomeModal(false);
    }
    
    if (savedDeliveryMode) {
      setDeliveryMode(savedDeliveryMode as 'Pickup' | 'Delivery');
    }
    
    if (savedDeliveryAddress) {
      try {
        setDeliveryAddress(JSON.parse(savedDeliveryAddress));
      } catch (e) {
        console.error('Error parsing saved delivery address:', e);
      }
    }
  }, []);

  // STEP 2: Measure header height and set CSS variable (desktop only)
  useLayoutEffect(() => {
    // Only apply on desktop (1024px+)
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      return;
    }

    const updateHeaderHeight = () => {
      const headerElement = document.getElementById('app-sticky-header');
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        document.documentElement.style.setProperty('--appHeaderH', `${headerHeight}px`);
        console.log('[App] Header height measured:', headerHeight, 'px');
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Watch for resize changes (breakpoints, banners, etc)
    const observer = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    const headerElement = document.getElementById('app-sticky-header');
    if (headerElement) {
      observer.observe(headerElement);
    }

    // Cleanup: disconnect observer
    return () => {
      observer.disconnect();
    };
  }, []);

  // Save delivery info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('deliveryMode', deliveryMode);
  }, [deliveryMode]);

  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
    }
  }, [deliveryAddress]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // AUTO-ASSIGN pickup location when resolution is ready
  useEffect(() => {
    if (locationResolution && locationResolution.pickup.autoAssignedStore) {
      const autoStore = locationResolution.pickup.autoAssignedStore;
      console.log('🎯 Auto-assigning pickup location:', autoStore.name);
      setCurrentLocation(autoStore.name);
    }
  }, [locationResolution]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Location information helper
  const getLocationInfo = () => {
    const locations = {
      'Haddonfield': {
        address: '119 Kings Hwy E',
        city: 'Haddonfield',
        zip: '08033',
      },
      'Moorestown': {
        address: '13 W Main St',
        city: 'Moorestown',
        zip: '08057',
      },
      'Voorhees': {
        address: '111 Laurel Oak Rd',
        city: 'Voorhees',
        zip: '08043',
      },
    };
    return locations[currentLocation as keyof typeof locations] || locations['Haddonfield'];
  };

  const locationInfo = getLocationInfo();

  // Opens product detail view - used by card click (NO popup)
  const openProductDetails = (product: Product) => {
    // Track product view for recommendations
    trackProductView(product.id);
    
    // Navigate directly to product detail
    setScrollPosition(window.scrollY);
    setSelectedProduct(product);
    setViewMode('detail');
    setIsEditMode(false);
    setEditingItemId(null);
    setEditingCartItem(null);
    
    // Update active category to match the product's category
    // Map pizzelle and gelati to desserts category
    if (product.category) {
      const categoryMap: { [key: string]: string } = {
        'pizzelle': 'desserts',
        'gelati': 'desserts'
      };
      const mappedCategory = categoryMap[product.category] || product.category;
      setActiveCategory(mappedCategory);
    }
    
    window.scrollTo(0, 0);
  };

  // Handler for ADD button ONLY - can show pickup dialog first
  const handleAddClick = (product: Product) => {
    // Track product view for recommendations
    trackProductView(product.id);
    
    // Check if user has seen the dialog before
    const hasSeen = sessionStorage.getItem('hasSeenPickupDialog') === 'true';
    
    // Check if delivery info is missing
    const missingDeliveryInfo = deliveryMode === 'Delivery' && !deliveryAddress;
    
    // Check if pickup info is missing
    const missingPickupInfo = deliveryMode === 'Pickup' && (!currentLocation || !scheduledTime);
    
    // If user has seen dialog and has all required info, go directly to product
    if (hasSeen && !missingDeliveryInfo && !missingPickupInfo) {
      openProductDetails(product);
      return;
    }
    
    // Otherwise show pickup dialog first
    setPendingProduct(product);
    setShowPickupDialog(true);
  };

  // Temporary aliases for backward compatibility (will be removed after migration)
  const handleCustomize = openProductDetails;   // click en tarjeta => detalle (SIN popup)
  const handleDirectOpen = handleAddClick;      // click en ADD => popup si aplica

  const handleConfirmPickup = () => {
    // Close pickup dialog
    setShowPickupDialog(false);
    
    // Mark as confirmed in session storage so it doesn't show again
    sessionStorage.setItem('hasSeenPickupDialog', 'true');
    
    // Now open product detail page with the pending product
    if (pendingProduct) {
      openProductDetails(pendingProduct);
      setPendingProduct(null);
      // Scroll to top when opening product detail
      window.scrollTo(0, 0);
    }
  };

  const handleWelcomePickup = () => {
    setDeliveryMode('Pickup');
    localStorage.setItem('deliveryMode', 'Pickup');
    sessionStorage.setItem('hasVisitedBefore', 'true');
    // Open LocationSelector to select pickup location
    setViewMode('location');
  };

  const handleWelcomeDelivery = () => {
    // ✅ SOLUCIÓN: Usar flushSync para garantizar que el estado se actualice ANTES de abrir el modal
    flushSync(() => {
      setDeliveryMode('Delivery');
    });
    
    localStorage.setItem('deliveryMode', 'Delivery');
    sessionStorage.setItem('hasVisitedBefore', 'true');
    
    // ✅ Ahora el modal se abre CON el estado correcto ya aplicado
    openMobileDeliveryModal();
  };

  const handleOrderTypePanelConfirm = (mode: 'Pickup' | 'Delivery', scheduledTime: string) => {
    setDeliveryMode(mode);
    setScheduledTime(scheduledTime);
    localStorage.setItem('deliveryMode', mode);
    
    // Close the panel
    setShowOrderTypePanel(false);
    
    // Open LocationSelector for BOTH Pickup and Delivery modes
    setViewMode('location');
  };

  const handleAddToCart = (product: Product, quantity: number, customizations?: CartItemCustomization[], selections?: CartSelection[]) => {
    // ============================================================
    // CRITICAL DEBUG LOG - Received data from ProductDetailPage
    // ============================================================
    console.log('🔴 DEBUG CART - handleAddToCart received:', {
      productId: product.id,
      productName: product.name,
      quantity,
      selectionsCount: selections?.length || 0,
      selections: selections || [],
      groupedSelections: (selections || []).reduce((acc: Record<string, string[]>, sel) => {
        const key = sel.groupTitle || sel.type || 'ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(sel.label || sel.id);
        return acc;
      }, {}),
      customizationsCount: customizations?.length || 0
    });
    
    // Validate selections: ensure all have required fields
    const validatedSelections = (selections || []).map(sel => {
      if (!sel.label || sel.label === sel.id) {
        console.warn('⚠️ Selection missing label or using ID as label:', {
          productId: product.id,
          selectionId: sel.id,
          selection: sel
        });
      }
      return sel;
    });
    
    setCartItems(prev => {
      // If editing, update the specific item
      if (isEditMode && editingItemId) {
        return prev.map(item => 
          item.id === editingItemId 
            ? { ...item, quantity, customizations: customizations || item.customizations, selections: validatedSelections }
            : item
        );
      }
      
      // Always add as new item with unique ID (don't merge duplicates)
      const uniqueId = `${product.id}-${Date.now()}-${Math.random()}`;
      const newItem: CartItem = {
        id: uniqueId,
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price.replace('$', '')),
        quantity: quantity,
        image: product.image,
        customizations: customizations || [],
        selections: validatedSelections,
        category: product.category
      };
      
      console.log('✅ DEBUG CART - CartItem created:', {
        itemId: newItem.id,
        productId: newItem.productId,
        selectionsStored: newItem.selections?.length || 0
      });
      
      const nextCartItems = [...prev, newItem];
      
      console.log('[DEBUG] handleAddToCart → cartItems before set', {
        addedProductId: product.id,
        addedProductName: product.name,
        addedSelectionsCount: validatedSelections?.length ?? 0,
        nextCartItems: nextCartItems,
        lastItemSelections: nextCartItems[nextCartItems.length - 1]?.selections
      });
      
      return nextCartItems;
    });
    console.log(isEditMode ? `Updated item: ${product.name}` : `Added ${quantity}x ${product.name} to cart`);
  };

  // Specialty pizzas - filter products with category 'specialty-pizza'
  const thickCrustPizzaIds = ['sp-4', 'sp-5', 'sp-6', 'sp-9', 'cyo-sicilian-pesto', 'sp-17'];
  const specialtyPizzasThinCrust = products.filter(p => 
    p.category === 'specialty-pizza' && !thickCrustPizzaIds.includes(p.id)
  );
  // Filter and sort specialty pizzas thick crust according to thickCrustPizzaIds order
  const specialtyPizzasThickCrust = thickCrustPizzaIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const handleLogoClick = () => {
    setViewMode('list');
    setMode('regular');
    setActiveCategory('pizzas');
  };

  const handleLocationClick = () => {
    // En móvil, abrir el modal de delivery primero
    if (window.innerWidth < 768) {
      openMobileDeliveryModal();
    } else {
      // En desktop, ir directo al LocationSelector
      setViewMode('location');
    }
  };

  const handleCheckout = () => {
    setViewMode('checkout');
    setOpenCart(false);
    window.scrollTo(0, 0);
  };

  const handleSelectLocation = (location: any) => {
    setCurrentLocation(location.name);
    setSelectedLocationForDetail(location);
    setFromLandingPage(false);
    setViewMode('list');
  };

  const handleLocationDetailClick = () => {
    // Get the full location object based on currentLocation name
    const locations = [
      {
        id: '1',
        name: 'Haddonfield',
        address: '119 Kings Hwy E',
        city: 'Haddonfield',
        state: 'NJ',
        zip: '08033',
        hours: 'Open today 11:00 AM to 10:00 PM',
        lat: 39.89792706143064,
        lng: -75.03314038686908,
      },
      {
        id: '2',
        name: 'Moorestown',
        address: '13 W Main St',
        city: 'Moorestown',
        state: 'NJ',
        zip: '08057',
        hours: 'Open today 11:00 AM to 10:00 PM',
        lat: 39.96395827445834,
        lng: -74.94753350369767,
      },
      {
        id: '3',
        name: 'Voorhees',
        address: '111 Laurel Oak Rd',
        city: 'Voorhees',
        state: 'NJ',
        zip: '08043',
        hours: 'Open today 11:00 AM to 10:00 PM',
        lat: 39.84678444777853,
        lng: -74.98846601755474,
      },
    ];
    
    const location = locations.find(loc => loc.name === currentLocation) || locations[0];
    setSelectedLocationForDetail(location);
    setViewMode('location-detail');
  };

  const handleConfirmDelivery = (address: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
  }) => {
    setDeliveryAddress(address);
    setFromLandingPage(false);
    setViewMode('list');
  };

  const handleScheduleChange = (date: Date | undefined) => {
    setScheduledDate(date);
    if (date) {
      // Format the date and time nicely
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric'
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const dateStr = date.toLocaleDateString('en-US', dateOptions);
      const timeStr = date.toLocaleTimeString('en-US', timeOptions);
      setScheduledTime(`ASAP ${dateStr} at ${timeStr}`);
    } else {
      setScheduledTime('ASAP');
    }
  };

  const handleEditCartItem = (itemId: string) => {
    // Find the cart item first to get the productId
    const cartItem = cartItems.find(i => i.id === itemId);
    if (!cartItem) return;
    
    // Then find the product by productId
    const product = products.find(p => p.id === cartItem.productId);
    if (product) {
      setScrollPosition(window.scrollY);
      setSelectedProduct(product);
      setEditingCartItem(cartItem); // Pass the full cart item to ProductDetailPage
      setViewMode('detail');
      setIsEditMode(true);
      setEditingItemId(itemId);
      // Scroll to top when opening product detail
      window.scrollTo(0, 0);
    }
  };

  const handleDuplicateCartItem = (itemId: string) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (item) {
        // Create new item with unique ID
        const uniqueId = `${item.productId}-${Date.now()}-${Math.random()}`;
        return [...prev, { ...item, id: uniqueId }];
      }
      return prev;
    });
    console.log(`Duplicated item with ID: ${itemId}`);
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    console.log(`Removed item with ID: ${itemId}`);
  };

  // Handle floating menu actions
  const handleOrderAhead = () => {
    // Open the cart to schedule an order
    setOpenCart(true);
    // Scroll to top after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  };

  const handleSwitchToCatering = () => {
    setMode('catering');
    setActiveCategory('catering-entrees');
    setViewMode('list');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Calculate total cart items
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Show checkout page
  if (viewMode === 'checkout') {
    return (
      <CheckoutPage
        items={cartItems}
        deliveryMode={deliveryMode}
        location={currentLocation}
        scheduledTime={scheduledTime}
        deliveryAddress={deliveryAddress}
        onBack={() => {
          setViewMode('list');
          setOpenCart(true);
        }}
        onEditLocation={handleLocationClick}
        onEditSchedule={() => {
          // Open cart sidebar and schedule picker
          setViewMode('list');
          setOpenCart(true);
        }}
        onSignInClick={() => setViewMode('login')}
      />
    );
  }

  // Show login page
  if (viewMode === 'login') {
    return (
      <LoginPage
        onAuthSuccess={() => {
          setViewMode('list');
        }}
        onBack={() => setViewMode('list')}
        onCreateAccount={() => setViewMode('register')}
      />
    );
  }

  // Show register page
  if (viewMode === 'register') {
    return (
      <RegisterPage
        onAuthSuccess={() => {
          setViewMode('list');
        }}
        onBack={() => setViewMode('list')}
        onLoginClick={() => setViewMode('login')}
      />
    );
  }

  // Show location selector
  if (viewMode === 'location') {
    return (
      <LocationSelector
        onClose={() => {
          setViewMode('list');
        }}
        onSelectLocation={handleSelectLocation}
        currentLocation={currentLocation}
        mode={mode}
        onModeChange={handleModeChange}
        cartItemsCount={cartItemsCount}
        deliveryMode={deliveryMode}
        onDeliveryModeChange={setDeliveryMode}
        onConfirmDelivery={handleConfirmDelivery}
        deliveryAddress={deliveryAddress}
        fromLanding={fromLandingPage}
        userCoords={userCoords}
        locationSource={locationSource}
        deliveryEligibility={deliveryEligibility}
        pickupEligibility={pickupEligibility}
        locationResolution={locationResolution}
        resolutionLoading={resolutionLoading}
      />
    );
  }

  // Show location detail view
  if (viewMode === 'location-detail' && selectedLocationForDetail) {
    return (
      <LocationDetailView
        location={selectedLocationForDetail}
        onClose={() => {
          setViewMode('list');
        }}
        mode={mode}
        onModeChange={handleModeChange}
        cartItemsCount={cartItemsCount}
        deliveryMode={deliveryMode}
        onDeliveryModeChange={setDeliveryMode}
        onLocationClick={handleLocationClick}
        onOrderNowClick={() => {
          setViewMode('list');
        }}
        deliveryAddress={deliveryAddress}
      />
    );
  }

  // Show detail view if a product is selected
  if (viewMode === 'detail' && selectedProduct) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] overflow-hidden min-h-0 bg-white">
        <Header 
          mode={mode} 
          onModeChange={handleModeChange} 
          cartItemsCount={cartItemsCount}
          cartItems={cartItems}
          onLogoClick={handleLogoClick}
          onLocationClick={handleLocationClick}
          onLocationDetailClick={handleLocationDetailClick}
          onOrderTypeClick={() => setShowOrderTypePanel(true)}
          currentLocation={currentLocation}
          onEditCartItem={handleEditCartItem}
          onDuplicateCartItem={handleDuplicateCartItem}
          onRemoveCartItem={handleRemoveCartItem}
          deliveryMode={deliveryMode}
          onDeliveryModeChange={setDeliveryMode}
          deliveryAddress={deliveryAddress}
          scheduledTime={scheduledTime}
          onScheduleChange={handleScheduleChange}
          allProducts={products}
          onAddToCart={handleAddToCart}
          openCart={openCart}
          onCartOpenChange={setOpenCart}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCheckout={handleCheckout}
          user={user}
          isLoadingAuth={isLoadingAuth}
          onSignInClick={() => setViewMode('login')}
          onLogout={handleLogout}
          onProductClick={(product) => {
            trackProductView(product.id);
            handleAddClick(product);
          }}
        />
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => {
            setViewMode('list');
            setIsEditMode(false);
            setEditingItemId(null);
            setEditingCartItem(null);
            // Restore scroll position
            setTimeout(() => {
              window.scrollTo(0, scrollPosition);
            }, 0);
          }}
          onAddToCart={handleAddToCart}
          allProducts={products}
          isEditMode={isEditMode}
          editingCartItem={editingCartItem}
          deliveryMode={deliveryMode}
          onDeliveryModeChange={setDeliveryMode}
          currentLocation={currentLocation}
          scheduledTime={scheduledTime}
          cartItemsCount={cartItemsCount}
          onLocationClick={handleLocationClick}
          onCartClick={() => setOpenCart(true)}
          mode={mode}
          onModeChange={handleModeChange}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onProductChange={(newProduct) => {
            setSelectedProduct(newProduct);
            setIsEditMode(false);
            setEditingItemId(null);
            // Scroll to top when changing product
            window.scrollTo(0, 0);
          }}
        />
        
        <FloatingMenu 
          onOrderAhead={handleOrderAhead}
          onFindLocation={handleLocationClick}
          onSwitchToCatering={handleSwitchToCatering}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Mobile Header - Only on Mobile - Hidden on home and more screens */}
      {!showMobileHome && mobileBottomTab !== 'more' && (
        <MobileHeader
          deliveryMode={deliveryMode}
          currentLocation={currentLocation}
          scheduledTime={scheduledTime}
          cartItemsCount={cartItemsCount}
          onLocationClick={handleLocationClick}
          onCartClick={() => setOpenCart(true)}
          mode={mode}
          onModeChange={handleModeChange}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onReorderClick={() => setIsOrdersDialogOpen(true)}
          allProducts={products}
          onProductClick={(product) => {
            setSelectedProduct(product);
            setShowProductDetail(true);
          }}
          deliveryAddress={deliveryAddress}
          onDeliveryModeChange={(mode) => setDeliveryMode(mode)}
          onLocationChange={(location) => setCurrentLocation(location)}
          onScheduledDateChange={(date) => setScheduledDateString(date)}
          onScheduledTimeChange={(time) => setScheduledTimeString(time)}
          onDeliveryInfoSubmit={(info) => {
            setDeliveryAddress({
              name: info.fullName,
              phone: info.phone,
              email: info.email,
              address: info.address,
              zip: info.zipCode
            });
          }}
        />
      )}

      {/* Desktop Header - Hidden on Mobile */}
      <Header 
        mode={mode} 
        onModeChange={handleModeChange} 
        cartItemsCount={cartItemsCount}
        cartItems={cartItems}
        onLogoClick={handleLogoClick}
        onLocationClick={handleLocationClick}
        onLocationDetailClick={handleLocationDetailClick}
        onOrderTypeClick={() => setShowOrderTypePanel(true)}
        currentLocation={currentLocation}
        onEditCartItem={handleEditCartItem}
        onDuplicateCartItem={handleDuplicateCartItem}
        onRemoveCartItem={handleRemoveCartItem}
        deliveryMode={deliveryMode}
        onDeliveryModeChange={setDeliveryMode}
        deliveryAddress={deliveryAddress}
        scheduledTime={scheduledTime}
        onScheduleChange={handleScheduleChange}
        openCart={openCart}
        onCartOpenChange={setOpenCart}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allProducts={products}
        onAddToCart={handleAddToCart}
        onCheckout={handleCheckout}
        openMobileMenu={isMobileMenuOpen}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
        user={user}
        isLoadingAuth={isLoadingAuth}
        onSignInClick={() => setViewMode('login')}
        onLogout={handleLogout}
        onProductClick={(product) => {
          trackProductView(product.id);
          handleAddClick(product);
        }}
      />

      {/* Mobile Side Menu - Always available */}
      <MobileSideMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        mode={mode}
        onModeChange={handleModeChange}
        deliveryMode={deliveryMode}
        currentLocation={currentLocation}
        deliveryAddress={deliveryAddress}
        onLocationClick={handleLocationClick}
        user={user}
        isLoadingAuth={isLoadingAuth}
        onSignInClick={() => setViewMode('login')}
        onLogout={handleLogout}
      />
      
      {/* <PromoBanner /> */}

      {/* Main Content - Hidden when showing mobile home, more screen, or settings */}
      {!showMobileHome && mobileBottomTab !== 'more' && !isMobileSettingsOpen && (
      <main>
        {mode === 'reorder' ? (
          <MobileReorderScreen
            user={user}
            isLoadingAuth={isLoadingAuth}
            onSignInClick={() => {
              setViewMode('login');
            }}
            onRegisterClick={() => {
              setViewMode('register');
            }}
            onLogout={handleLogout}
          />
        ) : mode === 'guest-favorites' ? (
          <GuestFavorites
            products={getRecommendedProducts(products, 12)}
            onAddToCart={(product) => {
              handleAddToCart(product, 1);
            }}
            onProductClick={(product) => {
              trackProductView(product.id);
              handleAddClick(product);
            }}
          />
        ) : mode === 'catering' ? (
          <>
            {/* Catering - Appetizers */}
            <div 
              ref={(el) => (sectionRefs.current['catering-appetizers'] = el)}
              data-category="catering-appetizers"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[36px] text-[#404041] text-left font-['Tinos']">Appetizers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {products.filter(p => p.category === 'catering-appetizers').map((product) => (
                  <ProductCard key={product.id} product={product} onCardClick={openProductDetails} onAddClick={handleAddClick} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Entrees */}
            <div 
              ref={(el) => (sectionRefs.current['catering-entrees'] = el)}
              data-category="catering-entrees"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[36px] text-[#404041] text-left font-['Tinos']">Entrees</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {products.filter(p => p.category === 'catering-entrees').map((product) => (
                  <ProductCard key={product.id} product={product} onCardClick={openProductDetails} onAddClick={handleAddClick} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Pasta & Baked Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['catering-pasta'] = el)}
              data-category="catering-pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[36px] text-[#404041] text-left font-['Tinos']">Pasta & Baked Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {products.filter(p => p.category === 'catering-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCardClick={openProductDetails} onAddClick={handleAddClick} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Seafood Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['catering-seafood-pasta'] = el)}
              data-category="catering-seafood-pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-seafood-pasta-PRIMARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Seafood Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-seafood-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Sides */}
            <div 
              ref={(el) => (sectionRefs.current['catering-sides'] = el)}
              data-category="catering-sides"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-sides-PRIMARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Catering Sides</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-sides').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Salad/Soups */}
            <div 
              ref={(el) => (sectionRefs.current['catering-salad-soups'] = el)}
              data-category="catering-salad-soups"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-salad-soups-PRIMARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Salad/Soups</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-salad-soups').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Hoagies/Wraps Platters */}
            <div 
              ref={(el) => (sectionRefs.current['catering-hoagies-wraps'] = el)}
              data-category="catering-hoagies-wraps"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-hoagies-wraps-PRIMARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Hoagies/Wraps Platters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-hoagies-wraps').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Whole Cakes */}
            <div 
              ref={(el) => (sectionRefs.current['catering-whole-cakes'] = el)}
              data-category="catering-whole-cakes"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-whole-cakes-PRIMARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Whole Cakes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-whole-cakes').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Party Trays */}
            <div 
              ref={(el) => (sectionRefs.current['catering-party-trays'] = el)}
              data-category="catering-party-trays"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Party Trays</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-party-trays').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Desserts */}
            <div 
              ref={(el) => (sectionRefs.current['catering-desserts'] = el)}
              data-category="catering-desserts"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Individual Desserts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-desserts').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Beverages */}
            <div 
              ref={(el) => (sectionRefs.current['catering-beverages'] = el)}
              data-category="catering-beverages"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Beverages</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-beverages').sort((a, b) => {
                  // Required order: 2L -> 20oz -> Water -> Kids
                  const getOrder = (name: string) => {
                    const n = name.toLowerCase();
                    if (n.includes('2l')) return 1;
                    if (n.includes('20oz')) return 2;
                    if (n.includes('water')) return 3;
                    if (n.includes("kid's")) return 4;
                    return 5;
                  };
                  const diff = getOrder(a.name) - getOrder(b.name);
                  if (diff !== 0) return diff;
                  return a.name.localeCompare(b.name);
                }).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Regular Menu - All Sections */}
            
            {/* Pizzas Section */}
            <div 
              ref={(el) => (sectionRefs.current['pizzas'] = el)}
              data-category="pizzas"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Create Your Own Pizza</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 mb-6 sm:mb-8 px-0.5 sm:px-0">
                {createYourOwnPizzas.filter(p => p.id !== 'cyo-sicilian-pesto').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Minucci Pizzas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {minucciPizzas.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Specialty Pizza */}
            <div 
              ref={(el) => (sectionRefs.current['specialty-pizza'] = el)}
              data-category="specialty-pizza"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Specialty Pizzas (Thin Crust)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 mb-6 sm:mb-8 px-0.5 sm:px-0">
                {specialtyPizzasThinCrust.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Specialty Pizzas (Thick Crust Square & Round Pan Pizza)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {specialtyPizzasThickCrust.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Brooklyn Style Pizza */}
            <div 
              ref={(el) => (sectionRefs.current['brooklyn-pizza'] = el)}
              data-category="brooklyn-pizza"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Brooklyn Style Pizza (16" Square Pan of Thin, Crispy Crust.)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {brooklynPizzaProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Stromboli & Calzone */}
            <div 
              ref={(el) => (sectionRefs.current['stromboli-calzone'] = el)}
              data-category="stromboli-calzone"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Stromboli / Calzone & Turnover</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {stromboliCalzoneProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* By The Slice */}
            <div 
              ref={(el) => (sectionRefs.current['by-the-slice'] = el)}
              data-category="by-the-slice"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">By The Slice</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'by-the-slice').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Cheesesteaks */}
            <div 
              ref={(el) => (sectionRefs.current['cheesesteaks'] = el)}
              data-category="cheesesteaks"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Cheesesteaks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {cheesesteaksProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Hot Hoagies */}
            <div 
              ref={(el) => (sectionRefs.current['hot-hoagies'] = el)}
              data-category="hot-hoagies"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Hot Hoagies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'hot-hoagies').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Cold Hoagies */}
            <div 
              ref={(el) => (sectionRefs.current['cold-hoagies'] = el)}
              data-category="cold-hoagies"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Cold Hoagies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'cold-hoagies').sort((a, b) => {
                  if (a.name === 'Italian Hoagie') return -1;
                  if (b.name === 'Italian Hoagie') return 1;
                  if (a.name === 'Ham & Cheese') return -1;
                  if (b.name === 'Ham & Cheese') return 1;
                  return 0;
                }).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Burgers */}
            <div 
              ref={(el) => (sectionRefs.current['burgers'] = el)}
              data-category="burgers"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Burgers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'burgers').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Brioche */}
            <div 
              ref={(el) => (sectionRefs.current['brioche'] = el)}
              data-category="brioche"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Brioche</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'brioche').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Paninis */}
            <div 
              ref={(el) => (sectionRefs.current['paninis'] = el)}
              data-category="paninis"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Panini</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'paninis').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Appetizers */}
            <div 
              ref={(el) => (sectionRefs.current['appetizers'] = el)}
              data-category="appetizers"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Appetizers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {appetizersProducts.filter(p => p.subcategory !== 'seafood').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>


            </div>



            {/* Wraps */}
            <div 
              ref={(el) => (sectionRefs.current['wraps'] = el)}
              data-category="wraps"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Wraps</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'wraps').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Traditional Dinners */}
            <div 
              ref={(el) => (sectionRefs.current['traditional-dinners'] = el)}
              data-category="traditional-dinners"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Traditional Dinners</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'traditional-dinners').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Create Your Own Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['create-pasta'] = el)}
              data-category="create-pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Create Your Own Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'create-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['pasta'] = el)}
              data-category="pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'pasta' && !p.name.toLowerCase().includes('baked')).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
              
              {/* Baked Pasta Banner */}
              <h2 className="mb-2 sm:mb-3 mt-3 sm:mt-4 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Baked Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'baked-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Sides */}
            <div 
              ref={(el) => (sectionRefs.current['sides'] = el)}
              data-category="sides"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Sides</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'sides').map((product) => {
                  const displayName = product.name === 'Side of Bread' || product.name.startsWith('Side ') 
                    ? product.name 
                    : `Side ${product.name}`;
                  
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={{...product, name: displayName}} 
                      onCustomize={handleCustomize} 
                      onDirectOpen={handleDirectOpen} 
                      locationInfo={locationInfo} 
                      onChangeLocation={handleLocationClick} 
                      deliveryMode={deliveryMode} 
                      deliveryAddress={deliveryAddress} 
                    />
                  );
                })}
              </div>
            </div>

            {/* Seafood */}
            <div 
              ref={(el) => (sectionRefs.current['seafood'] = el)}
              data-category="seafood"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Seafood Appetizers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'seafood' && ['sf-2', 'sf-3', 'sf-4', 'sf-5'].includes(p.id)).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              <h2 className="mt-4 sm:mt-6 mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Seafood</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'seafood' && ['sf-6', 'sf-7', 'sf-8', 'sf-9', 'sf-10'].includes(p.id)).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              <h2 className="mt-4 sm:mt-6 mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Fish</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'seafood' && ['sf-11', 'sf-12'].includes(p.id)).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Create Your Own Salad */}
            <div 
              ref={(el) => (sectionRefs.current['create-salad'] = el)}
              data-category="create-salad"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Create Your Own Fresh Salad</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'create-salad').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Salads & Soups */}
            <div 
              ref={(el) => (sectionRefs.current['salads-soups'] = el)}
              data-category="salads-soups"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Specialty Fresh Salad</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'salads').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Soups */}
            <div 
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Soups</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'soups').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Kids Menu */}
            <div 
              ref={(el) => (sectionRefs.current['kids'] = el)}
              data-category="kids"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Kid's Menu</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'kids').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Desserts/Pizzelle/Gelati - Combined Section */}
            <div 
              ref={(el) => {
                sectionRefs.current['desserts'] = el;
                sectionRefs.current['pizzelle'] = el;
                sectionRefs.current['gelati'] = el;
              }}
              data-category="desserts"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              {/* Desserts Section */}
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Desserts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0 mb-8">
                {products.filter(p => p.category === 'desserts').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              {/* Pizzelle Section */}
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left mt-4 font-['Tinos']">Pizzelle</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0 mb-8">
                {products.filter(p => p.category === 'pizzelle').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>

              {/* Gelati Section */}
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left mt-4 font-['Tinos']">Gelati</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'gelati').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Beverages */}
            <div 
              ref={(el) => (sectionRefs.current['beverages'] = el)}
              data-category="beverages"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Beverage</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'beverages').sort((a, b) => {
                  // Order: Water first, then Kids, then 20oz, then 2L
                  const getOrder = (name: string) => {
                    if (name.toLowerCase().includes('water')) return 1;
                    if (name.toLowerCase().includes("kid's")) return 2;
                    if (name.includes('20oz')) return 3;
                    if (name.includes('2L')) return 4;
                    return 5;
                  };
                  return getOrder(a.name) - getOrder(b.name);
                }).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering Sections */}
            {/* Catering - Appetizers */}
            <div 
              ref={(el) => (sectionRefs.current['catering-appetizers'] = el)}
              data-category="catering-appetizers"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Catering Appetizers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-appetizers').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Entrees */}
            <div 
              ref={(el) => (sectionRefs.current['catering-entrees'] = el)}
              data-category="catering-entrees"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Catering Entrees</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-entrees').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Pasta & Baked Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['catering-pasta'] = el)}
              data-category="catering-pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Pasta & Baked Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Seafood Pasta */}
            <div 
              ref={(el) => (sectionRefs.current['catering-seafood-pasta'] = el)}
              data-category="catering-seafood-pasta"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-seafood-pasta-SECONDARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Seafood Pasta</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-seafood-pasta').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Sides */}
            <div 
              ref={(el) => (sectionRefs.current['catering-sides'] = el)}
              data-category="catering-sides"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-sides-SECONDARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Catering Sides</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-sides').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Salad/Soups */}
            <div 
              ref={(el) => (sectionRefs.current['catering-salad-soups'] = el)}
              data-category="catering-salad-soups"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-salad-soups-SECONDARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Salad/Soups</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-salad-soups').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Hoagies/Wraps Platters */}
            <div 
              ref={(el) => (sectionRefs.current['catering-hoagies-wraps'] = el)}
              data-category="catering-hoagies-wraps"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-hoagies-wraps-SECONDARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Hoagies/Wraps Platters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-hoagies-wraps').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Whole Cakes */}
            <div 
              ref={(el) => (sectionRefs.current['catering-whole-cakes'] = el)}
              data-category="catering-whole-cakes"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 data-testid="catering-title-whole-cakes-SECONDARY" className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Whole Cakes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-whole-cakes').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Party Trays */}
            <div 
              ref={(el) => (sectionRefs.current['catering-party-trays'] = el)}
              data-category="catering-party-trays"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Party Trays</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-party-trays').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Desserts */}
            <div 
              ref={(el) => (sectionRefs.current['catering-desserts'] = el)}
              data-category="catering-desserts"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Individual Desserts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-desserts').map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>

            {/* Catering - Beverages */}
            <div 
              ref={(el) => (sectionRefs.current['catering-beverages'] = el)}
              data-category="catering-beverages"
              className="px-2 sm:px-4 lg:px-8 py-2 max-w-[1800px] mx-auto"
            >
              <h2 className="mb-2 sm:mb-3 font-normal text-[26px] sm:text-[32px] text-[#404041] text-left font-['Tinos']">Catering Beverages</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4 px-0.5 sm:px-0">
                {products.filter(p => p.category === 'catering-beverages').sort((a, b) => {
                  // Required order: 2L -> 20oz -> Water -> Kids
                  const getOrder = (name: string) => {
                    const n = name.toLowerCase();
                    if (n.includes('2l')) return 1;
                    if (n.includes('20oz')) return 2;
                    if (n.includes('water')) return 3;
                    if (n.includes("kid's")) return 4;
                    return 5;
                  };
                  const diff = getOrder(a.name) - getOrder(b.name);
                  if (diff !== 0) return diff;
                  return a.name.localeCompare(b.name);
                }).map((product) => (
                  <ProductCard key={product.id} product={product} onCustomize={handleCustomize} onDirectOpen={handleDirectOpen} locationInfo={locationInfo} onChangeLocation={handleLocationClick} deliveryMode={deliveryMode} deliveryAddress={deliveryAddress} />
                ))}
              </div>
            </div>
          </>
        )}

        <Footer />
      </main>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Don't show FloatingMenu in guest-favorites mode or mobile home/more screens */}
      {mode !== 'guest-favorites' && !showMobileHome && mobileBottomTab !== 'more' && (
        <FloatingMenu 
          onOrderAhead={handleOrderAhead}
          onFindLocation={handleLocationClick}
          onSwitchToCatering={handleSwitchToCatering}
        />
      )}

      {/* Mobile Home Screen */}
      {showMobileHome && (
        <MobileHomeScreen
          currentLocation={currentLocation}
          onLocationClick={() => {
            setShowMobileHome(false);
            setMobileBottomTab('locations');
            handleLocationClick();
          }}
          onOrderNow={() => {
            setShowMobileHome(false);
            setMobileBottomTab('menu');
          }}
          onJoinWaitlist={() => {
            // TODO: Implement waitlist functionality
            console.log('Join waitlist clicked');
          }}
          onOpenDeliveryModal={() => {
            openMobileDeliveryModal();
          }}
          onNavigateToMenu={() => {
            setShowMobileHome(false);
            setMobileBottomTab('menu');
          }}
          onSignInClick={() => {
            setViewMode('login');
            setShowMobileHome(false);
          }}
          onCartClick={() => {
            setOpenCart(true);
            setShowMobileHome(false);
            setMobileBottomTab('menu');
          }}
        />
      )}

      {/* Mobile More Screen */}
      {mobileBottomTab === 'more' && !isMobileSettingsOpen && (
        <MobileMoreScreen
          user={user}
          isLoadingAuth={isLoadingAuth}
          onSignInClick={() => {
            setViewMode('login');
            setMobileBottomTab('menu');
          }}
          onRegisterClick={() => {
            setViewMode('register');
            setMobileBottomTab('menu');
          }}
          onLogout={handleLogout}
          onMenuOrderClick={() => {
            setMobileBottomTab('menu');
          }}
          onJoinWaitlistClick={() => {
            // TODO: Implement waitlist functionality
            console.log('Join waitlist clicked');
          }}
          onReorderClick={() => {
            handleModeChange('reorder');
            setMobileBottomTab('menu');
          }}
          onTogoDeliveryClick={() => {
            setDeliveryMode('Delivery');
            setTimeout(() => {
              handleLocationClick();
              setMobileBottomTab('menu');
            }, 0);
          }}
          onCateringClick={() => {
            setMode('catering');
            setMobileBottomTab('menu');
          }}
          onJoinClubClick={() => {
            window.open('https://www.passariellos.com/passarielloseclub', '_blank');
          }}
          onGiftCardsClick={() => {
            window.open('https://www.passariellos.com/giftcard', '_blank');
          }}
          onSettingsClick={() => {
            setIsMobileSettingsOpen(true);
          }}
        />
      )}

      {/* Mobile Settings Screen */}
      {isMobileSettingsOpen && (
        <MobileSettingsScreen
          onBack={() => {
            setIsMobileSettingsOpen(false);
          }}
        />
      )}

      {/* Mobile Bottom Navigation - Outside main to avoid z-index issues */}
      <MobileBottomNav 
        activeTab={mobileBottomTab}
        onTabChange={(tab) => {
          setMobileBottomTab(tab);
          if (tab === 'home') {
            setShowMobileHome(true);
          } else {
            setShowMobileHome(false);
            if (tab === 'locations') {
              handleLocationClick();
            }
          }
        }}
        onMoreClick={() => {
          setMobileBottomTab('more');
        }}
      />

      {/* Mobile Delivery Modal */}
      <MobileDeliveryModal
        isOpen={isMobileDeliveryModalOpen}
        onClose={closeMobileDeliveryModal}
        currentMode={deliveryMode}
        currentLocation={currentLocation}
        currentDate={scheduledDateString}
        currentTime={scheduledTimeString}
        onConfirm={(mode, location, date, time) => {
          setDeliveryMode(mode);
          setCurrentLocation(location);
          setScheduledDateString(date);
          setScheduledTimeString(time);
          setScheduledTime(time === 'ASAP' ? 'ASAP' : `${date}, ${time}`);
        }}
        onDeliveryConfirm={() => {
          // No hacemos nada adicional, solo cerrar el modal
          console.log('Delivery confirmed successfully');
        }}
        onDeliveryInfoSubmit={(info) => {
          // Guardar la información de delivery
          setDeliveryAddress({
            name: info.fullName,
            phone: info.phone,
            email: info.email,
            address: info.address,
            zip: info.zipCode
          });
          console.log('Delivery info submitted:', info);
        }}
        initialDeliveryInfo={
          deliveryAddress?.address
            ? {
                fullName: deliveryAddress.name,
                phone: deliveryAddress.phone,
                email: deliveryAddress.email,
                address: deliveryAddress.address,
                zipCode: deliveryAddress.zip
              }
            : undefined
        }
      />



      {/* Orders Dialog */}
      <OrdersDialog
        open={isOrdersDialogOpen}
        onOpenChange={setIsOrdersDialogOpen}
      />

      {/* Welcome Order Type Modal - Shows on first load */}
      <WelcomeOrderTypeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          sessionStorage.setItem('hasVisitedBefore', 'true');
        }}
        onSelectPickup={handleWelcomePickup}
        onSelectDelivery={handleWelcomeDelivery}
      />

      {/* Order Type Panel - Opens from cart sidebar */}
      <OrderTypePanel
        isOpen={showOrderTypePanel}
        onClose={() => setShowOrderTypePanel(false)}
        currentMode={deliveryMode}
        currentScheduledTime={scheduledTime}
        location={currentLocation}
        deliveryAddress={deliveryAddress || undefined}
        onConfirm={handleOrderTypePanelConfirm}
        userCoords={userCoords}
        stores={STORE_LOCATIONS}
        locationLoading={locationLoading}
      />

      {/* Confirm Pickup Dialog - Shows before product detail */}
      <ConfirmPickupDialog
        isOpen={showPickupDialog}
        onClose={() => {
          setShowPickupDialog(false);
          setPendingProduct(null);
        }}
        onConfirm={handleConfirmPickup}
        location={locationInfo?.city || currentLocation}
        address={locationInfo?.address || ''}
        city={locationInfo?.city || currentLocation}
        zip={locationInfo?.zip || ''}
        deliveryMode={deliveryMode}
        deliveryAddress={deliveryAddress ? `${deliveryAddress.address}` : undefined}
        deliveryCity={deliveryAddress?.address.split(',')[1]?.trim()}
        deliveryZip={deliveryAddress?.zip}
        userCoords={userCoords}
        stores={STORE_LOCATIONS}
        onChangeLocation={() => {
          // Close pickup dialog and open location selector in Pickup mode
          setShowPickupDialog(false);
          setPendingProduct(null);
          setDeliveryMode('Pickup'); // Ensure we're in Pickup mode
          setViewMode('location'); // Open LocationSelector
        }}
      />

      <Toaster position="top-center" richColors />

      {/* Location Required Modal - BLOCKING */}
      <LocationRequiredModal
        isOpen={locationLoading || (!userCoords && (locationError !== null || locationPermissionDenied))}
        loading={locationLoading}
        error={locationError}
        permissionDenied={locationPermissionDenied}
        source={locationSource}
        onRetry={retryGeolocation}
      />

      {/* Debug Panel - Only shows if ?debug=true in URL */}
      <DeliveryDebugPanel
        userCoords={userCoords}
        locationSource={locationSource}
        deliveryEligibility={deliveryEligibility}
        pickupEligibility={pickupEligibility}
        deliveryMode={deliveryMode}
      />
    </div>
  );
}
