import { Product } from '../components/ProductCard';

export interface Topping {
  id: string;
  name: string;
  price?: number;
  largPrice?: number; // Price for large size
  image?: string;
  included?: boolean;
  removableIngredients?: { id: string; name: string; }[];
}

// Sauce images
export const SAUCE_IMAGES: { [key: string]: string } = {
  'buffalo': 'https://drive.google.com/thumbnail?id=1-EDW7ulTkm2Yb60gHkL2Sma5cy0_OhZi&sz=w1000',
  'bbq': 'https://drive.google.com/thumbnail?id=15gTOtiE45rp2lo3zJCXZ7c-a76xMOvOB&sz=w1000',
  'hot': 'https://drive.google.com/thumbnail?id=1eaHYz33jzMZIWqEgXmIQSEs5unQK6g87&sz=w1000',
  'mild': 'https://drive.google.com/thumbnail?id=16yXWXXUbsTyUNxrd-j_RMDqxRUurBWuu&sz=w1000',
  'honey-mustard': 'https://drive.google.com/thumbnail?id=1l9ix4xEZLPiwjsIxYzXVNALwePILDiOB&sz=w1000',
  'mild-honey': 'https://drive.google.com/thumbnail?id=1pTqzglr_HUbwisaVDvSvKu9C4SBj6YKg&sz=w1000',
  'crazy-hot': 'https://drive.google.com/thumbnail?id=15cYhkEsAtiv8R8KVz2Lb_uh9UNfcy0_X&sz=w1000',
  'garlic-parmesan': 'https://drive.google.com/thumbnail?id=1z42hECiOpG6zRRwqLpVBgYR_7p9qsQRO&sz=w1000',
  'sting-honey': 'https://drive.google.com/thumbnail?id=1pTqzglr_HUbwisaVDvSvKu9C4SBj6YKg&sz=w1000',
  'ranch': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000',
  'bleu-cheese': 'https://drive.google.com/thumbnail?id=1IC2l-gLbo0QYFislwjItAp__I6DaajmN&sz=w1000',
  'pomodoro-sauce': 'https://drive.google.com/thumbnail?id=1qPUFm2DZTraEiDuC0h2DCNCQhAki1kx-&sz=w1000',
  'default': 'https://images.unsplash.com/photo-1519666213631-be6e024eac6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200'
};

// Helper function to get sauce image
export const getSauceImage = (sauceName: string): string => {
  const nameLower = sauceName.toLowerCase();
  if (nameLower.includes('buffalo')) return SAUCE_IMAGES.buffalo;
  if (nameLower.includes('bbq')) return SAUCE_IMAGES.bbq;
  if (nameLower.includes('crazy hot')) return SAUCE_IMAGES['crazy-hot'];
  if (nameLower.includes('garlic parmesan') || nameLower.includes('garlic-parmesan')) return SAUCE_IMAGES['garlic-parmesan'];
  if (nameLower.includes('sting honey') || nameLower.includes('sting-honey')) return SAUCE_IMAGES['sting-honey'];
  if (nameLower.includes('honey mustard') || nameLower.includes('honey-mustard')) return SAUCE_IMAGES['honey-mustard'];
  if (nameLower.includes('hot') || nameLower.includes('spicy')) return SAUCE_IMAGES.hot;
  if (nameLower.includes('mild honey')) return SAUCE_IMAGES['mild-honey'];
  if (nameLower.includes('mild')) return SAUCE_IMAGES.mild;
  if (nameLower.includes('pomodoro')) return SAUCE_IMAGES['pomodoro-sauce'];
  if (nameLower.includes('ranch')) return SAUCE_IMAGES.ranch;
  if (nameLower.includes('bleu') || nameLower.includes('blue cheese')) return SAUCE_IMAGES['bleu-cheese'];
  return SAUCE_IMAGES.default;
};

// Salad Topping images
export const SALAD_TOPPING_IMAGES: { [key: string]: string } = {
  'st1': 'https://drive.google.com/thumbnail?id=1raKjTe8PSZNQmy7KApo6PkWzm1IBto_P&sz=w1000', // Anchovies
  'st2': 'https://drive.google.com/thumbnail?id=19q_8iv7dK5PVRy1lbDXn50wHmYbGL1jO&sz=w1000', // Bacon
  'st3': 'https://drive.google.com/thumbnail?id=15XpbkSBwMaMwJ7hOgbtpW5ifIppKB5S3&sz=w1000', // Beets
  'st4': 'https://images.unsplash.com/photo-1622637012640-83ff490e189f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG9saXZlcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Black Olives
  'st5': 'https://images.unsplash.com/photo-1734771219838-61863137b117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxhbWFyaSUyMHJpbmdzJTIwZnJpZWR8ZW58MXx8fHwxNzY5ODE0NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Calamari Mix
  'st6': 'https://images.unsplash.com/photo-1724154854089-4bbd0e7d09c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXByZXNlJTIwdG9tYXRvJTIwbW96emFyZWxsYXxlbnwxfHx8fDE3NjM3NDYzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Caprese Mix
  'st7': 'https://images.unsplash.com/photo-1762631383378-115f2d4cbe07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBjYXJyb3RzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Carrots
  'st8': 'https://images.unsplash.com/photo-1767277672167-18105701959b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlcnklMjBzdGlja3MlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Celery
  'st9': 'https://drive.google.com/thumbnail?id=1Vm5_OiGyPVMo6OKFgWxvr8EFSjkiWsLU&sz=w1000', // Chic Peas
  'st10': 'https://images.unsplash.com/photo-1719196339826-c66c13ad5b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9wcGVkJTIwdG9tYXRvZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Chopped Tomatoes
  'st11': 'https://images.unsplash.com/photo-1761315414769-2a80c29657f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwa2VybmVscyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Corn
  'st12': 'https://drive.google.com/thumbnail?id=1EzFTywi3a1CCDJGsjNZwBVq06zZq_HSQ&sz=w1000', // Crispy Chicken
  'st13': 'https://images.unsplash.com/photo-1622752989445-d6644e17fba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGNyb3V0b25zJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Croutons
  'st14': 'https://images.unsplash.com/photo-1708388064990-e62aa000d2d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBjdWN1bWJlcnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Cucumbers
  'st15': 'https://images.unsplash.com/photo-1648683622470-d52bfe2d3830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGNyYW5iZXJyaWVzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Dried Cranberries
  'st16': 'https://images.unsplash.com/photo-1680987398307-e1ae27a6ed67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW1idXJnZXIlMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Egg
  'st17': 'https://images.unsplash.com/photo-1686998423980-ab223d183055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXRhJTIwY2hlZXNlJTIwY3J1bWJsZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Feta Cheese
  'st18': 'https://images.unsplash.com/photo-1769458313860-3c8db667d990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1venphcmVsbGElMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Fresh Mozzarella
  'st19': 'https://images.unsplash.com/photo-1760445528267-25140a7bd31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG9saXZlcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Green Olives
  'st20': 'https://images.unsplash.com/photo-1622376242797-538aa64a9d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBncmVlbiUyMHBlcHBlcnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Green Peppers
  'st21': 'https://images.unsplash.com/photo-1716034353309-c6066ae24c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHN0cmlwcyUyMHNhbGFkJTIwdG9wcGluZ3xlbnwxfHx8fDE3Njk4MTQ3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Grilled Chicken
  'st22': 'https://images.unsplash.com/photo-1738332739213-c917c40442c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJrZXklMjBzbGljZXMlMjBkZWxpfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Ham
  'st23': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWJlZCUyMG1venphcmVsbGElMjBjaGVlc2V8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Mozzarella Cubed
  'st24': 'https://images.unsplash.com/photo-1751183295754-9cff9577a44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJtaWdpYW5vJTIwY2hlZXNlJTIwc2hhdmluZ3N8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Parmigiano
  'st25': 'https://images.unsplash.com/photo-1630492782892-74f99406dc59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHNhbGFkfGVufDF8fHx8MTc2MzYyODgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pasta Mix
  'st26': 'https://images.unsplash.com/photo-1729353639014-6eced0fd2a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBzbGljZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pepperoni
  'st27': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5uZSUyMHBhc3RhfGVufDF8fHx8MTc2Mzc0NjMzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Plain Pasta
  'st28': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm92b2xvbmUlMjBjaGVlc2UlMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Provolone
  'st29': 'https://images.unsplash.com/photo-1761846352355-ae006c7dd3ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBtdXNocm9vbXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Raw Mushroom
  'st30': 'https://images.unsplash.com/photo-1720847009696-4f8795c36e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjByZWQlMjBvbmlvbnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Red Onions
  'st31': 'https://images.unsplash.com/photo-1577953881875-ddc6b4783438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwcmVkJTIwcGVwcGVycyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Roasted Red Peppers
  'st32': 'https://images.unsplash.com/photo-1656754414791-e98223665ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJlZGRlZCUyMGNoZWRkYXIlMjBjaGVlc2UlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Shredded Cheddar
  'st33': 'https://images.unsplash.com/photo-1656754414791-e98223665ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJlZGRlZCUyMG1venphcmVsbGElMjBjaGVlc2UlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Shredded Mozzarella
  'st34': 'https://images.unsplash.com/photo-1766146432356-dd4201940ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjBkcmllZCUyMHRvbWF0b2VzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Sun Dried Tomatoes
  'st35': 'https://images.unsplash.com/photo-1740993384743-dc8f2879f398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBzZWVkcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Sunflower Seeds
  'st36': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGNoZWVzZSUyMHNsaWNlc3xlbnwxfHx8fDE3Njk4MTQ3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Swiss
  'st37': 'https://images.unsplash.com/photo-1711989874705-bb85dc205541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3J0aWxsYSUyMHN0cmlwcyUyMHNhbGFkJTIwdG9wcGluZ3xlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Tortilla Strips
  'st38': 'https://images.unsplash.com/photo-1710106687822-999dbeb73dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Tuna Mix
  'st39': 'https://images.unsplash.com/photo-1738332739213-c917c40442c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJrZXklMjBzbGljZXMlMjBkZWxpfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Turkey
};

// Salad Extra Topping images (for "Extra Toppings" section)
export const SALAD_EXTRA_TOPPING_IMAGES: { [key: string]: string } = {
  'set1': 'https://drive.google.com/thumbnail?id=1raKjTe8PSZNQmy7KApo6PkWzm1IBto_P&sz=w1000', // Anchovies (from st1)
  'set2': 'https://images.unsplash.com/photo-1680987398307-e1ae27a6ed67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW1idXJnZXIlMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Egg (from st16)
  'set3': 'https://images.unsplash.com/photo-1686998423980-ab223d183055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXRhJTIwY2hlZXNlJTIwY3J1bWJsZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Feta Cheese (from st17)
  'set4': 'https://images.unsplash.com/photo-1656754414791-e98223665ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJlZGRlZCUyMGNoZWRkYXIlMjBjaGVlc2UlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Shredded Cheddar (from st32)
  'set5': 'https://images.unsplash.com/photo-1656754414791-e98223665ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJlZGRlZCUyMG1venphcmVsbGElMjBjaGVlc2UlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Mozzarella Shredded (from st33)
  'set6': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWJlZCUyMG1venphcmVsbGElMjBjaGVlc2V8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Mozzarella Cubed (from st23)
  'set7': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm92b2xvbmUlMjBjaGVlc2UlMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Provolone (from st28)
  'set8': 'https://images.unsplash.com/photo-1751183295754-9cff9577a44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJtaWdpYW5vJTIwY2hlZXNlJTIwc2hhdmluZ3N8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Parmigiano (from st24)
  'set9': 'https://images.unsplash.com/photo-1590912710024-6d51a6771abd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMGNoZWVzZSUyMHNsaWNlc3xlbnwxfHx8fDE3Njk4MTQ3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Swiss (from st36)
  'set10': 'https://images.unsplash.com/photo-1648683622470-d52bfe2d3830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGNyYW5iZXJyaWVzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Dried Cranberries (from st15)
  'set11': 'https://images.unsplash.com/photo-1622752989445-d6644e17fba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGNyb3V0b25zJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Croutons (from st13)
  'set12': 'https://images.unsplash.com/photo-1711989874705-bb85dc205541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3J0aWxsYSUyMHN0cmlwcyUyMHNhbGFkJTIwdG9wcGluZ3xlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Tortilla Strips (from st37)
  'set13': 'https://images.unsplash.com/photo-1740993384743-dc8f2879f398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBzZWVkcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Sunflower Seeds (from st35)
  'set14': 'https://images.unsplash.com/photo-1719196339826-c66c13ad5b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9wcGVkJTIwdG9tYXRvZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Chopped Tomatoes (from st10)
  'set15': 'https://images.unsplash.com/photo-1708388064990-e62aa000d2d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBjdWN1bWJlcnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Cucumbers (from st14)
  'set16': 'https://images.unsplash.com/photo-1720847009696-4f8795c36e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjByZWQlMjBvbmlvbnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Red Onions (from st30)
  'set17': 'https://images.unsplash.com/photo-1622376242797-538aa64a9d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBncmVlbiUyMHBlcHBlcnMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Green Peppers (from st20)
  'set18': 'https://images.unsplash.com/photo-1762631383378-115f2d4cbe07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBjYXJyb3RzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Carrots (from st7)
  'set19': 'https://drive.google.com/thumbnail?id=1gwtm_YlInG0mAOpQfzXqOfNJNTW3Pkv3&sz=w1000', // Broccoli
  'set20': 'https://images.unsplash.com/photo-1761846352355-ae006c7dd3ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGljZWQlMjBtdXNocm9vbXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Raw Mushrooms (from st29)
  'set21': 'https://images.unsplash.com/photo-1622637012640-83ff490e189f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG9saXZlcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Black Olives (from st4)
  'set22': 'https://drive.google.com/thumbnail?id=1xPlROHPgRsBfX4E5kYF8vygJkH51vLoW&sz=w1000', // Marinated Vegetables
  'set23': 'https://drive.google.com/thumbnail?id=15XpbkSBwMaMwJ7hOgbtpW5ifIppKB5S3&sz=w1000', // Beets (from st3)
  'set24': 'https://images.unsplash.com/photo-1761315414769-2a80c29657f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwa2VybmVscyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Corn (from st11)
  'set25': 'https://images.unsplash.com/photo-1577953881875-ddc6b4783438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwcmVkJTIwcGVwcGVycyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Roasted Red Peppers (from st31)
  'set26': 'https://images.unsplash.com/photo-1760445528267-25140a7bd31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMG9saXZlcyUyMGJvd2x8ZW58MXx8fHwxNzY5ODE0NzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Green Olives (from st19)
  'set27': 'https://images.unsplash.com/photo-1766146432356-dd4201940ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjBkcmllZCUyMHRvbWF0b2VzJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Sun Dried Tomatoes (from st34)
  'set28': 'https://drive.google.com/thumbnail?id=1Vm5_OiGyPVMo6OKFgWxvr8EFSjkiWsLU&sz=w1000', // Chic Peas (from st9)
  'set29': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5uZSUyMHBhc3RhfGVufDF8fHx8MTc2Mzc0NjMzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Plain Pasta (from st27)
  'set30': 'https://images.unsplash.com/photo-1767277672167-18105701959b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlcnklMjBzdGlja3MlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Celery (from st8)
  'set31': 'https://images.unsplash.com/photo-1724154854089-4bbd0e7d09c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXByZXNlJTIwdG9tYXRvJTIwbW96emFyZWxsYXxlbnwxfHx8fDE3NjM3NDYzNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Caprese Mix (from st6)
  'set32': 'https://drive.google.com/thumbnail?id=19q_8iv7dK5PVRy1lbDXn50wHmYbGL1jO&sz=w1000', // Bacon (from st2)
  'set33': 'https://drive.google.com/thumbnail?id=1EzFTywi3a1CCDJGsjNZwBVq06zZq_HSQ&sz=w1000', // Crispy Chicken (from st12)
  'set34': 'https://images.unsplash.com/photo-1738332739213-c917c40442c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJrZXklMjBzbGljZXMlMjBkZWxpfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Turkey (from st39)
  'set35': 'https://images.unsplash.com/photo-1710106687822-999dbeb73dee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Tuna Mix (from st38)
  'set36': 'https://images.unsplash.com/photo-1716034353309-c6066ae24c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHN0cmlwcyUyMHNhbGFkJTIwdG9wcGluZ3xlbnwxfHx8fDE3Njk4MTQ3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Grilled Chicken (from st21)
  'set37': 'https://images.unsplash.com/photo-1738332739213-c917c40442c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJrZXklMjBzbGljZXMlMjBkZWxpfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Ham (from st22)
  'set38': 'https://images.unsplash.com/photo-1729353639014-6eced0fd2a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBzbGljZXMlMjBib3dsfGVufDF8fHx8MTc2OTgxNDc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pepperoni (from st26)
  'set39': 'https://images.unsplash.com/photo-1734771219838-61863137b117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxhbWFyaSUyMHJpbmdzJTIwZnJpZWR8ZW58MXx8fHwxNzY5ODE0NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Calamari Mix (from st5)
  'set40': 'https://images.unsplash.com/photo-1769458313860-3c8db667d990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1venphcmVsbGElMjBzbGljZXN8ZW58MXx8fHwxNzY5ODE0NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Fresh Mozzarella (from st18)
  'set41': 'https://images.unsplash.com/photo-1630492782892-74f99406dc59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHNhbGFkfGVufDF8fHx8MTc2MzYyODgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Pasta Mix
};

// Salad Base images (for "Choose Your Base" section)
export const SALAD_BASE_IMAGES: { [key: string]: string } = {
  // IDs from saladToppings.ts - using Google Drive images
  'iceberg': 'https://drive.google.com/thumbnail?id=1kAMqhapgNyOa2gMp2EG-YI45VRIFH4C1&sz=w1000', // Iceberg
  'romaine': 'https://drive.google.com/thumbnail?id=1jRQxEtXaI-5YwpCfeVtOYYDR6iZcSppk&sz=w1000', // Romaine
  'mixed-greens': 'https://images.unsplash.com/photo-1647268902830-298d9b6471ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMGdyZWVucyUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3Njk4MTQ3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Mixed Greens / Spring Mix
  'spinach': 'https://drive.google.com/thumbnail?id=1JdeEgQaRGlRswXCtvR4q3fpG7XGJGwPC&sz=w1000', // Spinach
  'mix-iceberg-romaine': 'https://drive.google.com/thumbnail?id=10ZeOYSS3QT0_sIUm72FWf0axNNBL01Rx&sz=w1000', // Mix Iceberg and Romaine
  // Legacy IDs for backwards compatibility
  'sb1': 'https://drive.google.com/thumbnail?id=1kAMqhapgNyOa2gMp2EG-YI45VRIFH4C1&sz=w1000', // Iceberg
  'sb2': 'https://drive.google.com/thumbnail?id=1jRQxEtXaI-5YwpCfeVtOYYDR6iZcSppk&sz=w1000', // Romaine
  'sb3': 'https://drive.google.com/thumbnail?id=10ZeOYSS3QT0_sIUm72FWf0axNNBL01Rx&sz=w1000', // Mix Romaine and Iceberg
  'sb4': 'https://drive.google.com/thumbnail?id=1JdeEgQaRGlRswXCtvR4q3fpG7XGJGwPC&sz=w1000', // Spinach
  'sb5': 'https://drive.google.com/thumbnail?id=1CxSWYfTtzlrGe4h0_99Ol_V8bb_qFMyt&sz=w1000', // Spring Mix
};

// Salad Dressing images (for "Choose Your Dressing" section)
export const SALAD_DRESSING_IMAGES: { [key: string]: string } = {
  // IDs from saladToppings.ts - using Google Drive images
  'avocado-ranch': 'https://drive.google.com/thumbnail?id=1Gg6iNlPUaImDp7LZTPQYmjbXrHZvB39x&sz=w1000', // Avocado Ranch
  'balsamic': 'https://drive.google.com/thumbnail?id=1q4TcoTy4bBKv6V-0lKdVwg4FhrPrGiZn&sz=w1000', // Balsamic Vinaigrette
  'balsamic-oil': 'https://drive.google.com/thumbnail?id=14SFcFmFhOVNs5fyInrhoF7VyLuYbio-G&sz=w1000', // Balsamic Vinegar & Oil
  'blue-cheese': 'https://drive.google.com/thumbnail?id=1IC2l-gLbo0QYFislwjItAp__I6DaajmN&sz=w1000', // Blue Cheese
  'buffalo': 'https://drive.google.com/thumbnail?id=1-EDW7ulTkm2Yb60gHkL2Sma5cy0_OhZi&sz=w1000', // Buffalo
  'caesar': 'https://drive.google.com/thumbnail?id=10VOoUiN14zDD_ype7l5BSEFgbJcf7IaA&sz=w1000', // Caesar
  'chipotle-ranch': 'https://drive.google.com/thumbnail?id=15HPwrLT70Gcs6LUkC5GXrpV-a2nUT0H5&sz=w1000', // Chipotle Ranch
  'creamy-italian': 'https://drive.google.com/thumbnail?id=1h-B9fqghICR_PZLYIXPd_VAWHQPL4HzI&sz=w1000', // Creamy Italian
  'fat-free-italian': 'https://drive.google.com/thumbnail?id=11WyvDp-cEGohwxEPW2yxgwAX1JJhVbzQ&sz=w1000', // Fat Free Italian
  'fat-free-ranch': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Fat Free Ranch
  'french': 'https://drive.google.com/thumbnail?id=1DD78wzRUoCiQ4C7gZLT_wVQZBJiqp4nu&sz=w1000', // French
  'green-goddess': 'https://drive.google.com/thumbnail?id=1v2T09u3nIJrT_i4seDT76K8ysG5opUBz&sz=w1000', // Green Goddess
  'honey-mustard': 'https://drive.google.com/thumbnail?id=1l9ix4xEZLPiwjsIxYzXVNALwePILDiOB&sz=w1000', // Honey Mustard
  'lemon-oil': 'https://drive.google.com/thumbnail?id=1DX2c1hCjOoGBAOGUDrbgxOaKOfYQBx6m&sz=w1000', // Lemon Oil
  'lite-caesar': 'https://drive.google.com/thumbnail?id=10VOoUiN14zDD_ype7l5BSEFgbJcf7IaA&sz=w1000', // Lite Caesar
  'ranch': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Ranch
  'red-wine-vinegar-oil': 'https://drive.google.com/thumbnail?id=1sFzS6XXbS8bkOFKjZx4RZl2jbsGxUy1x&sz=w1000', // Red Wine Vinegar & Oil
  'russian': 'https://drive.google.com/thumbnail?id=1r_u8OvKKj5wKbcYi1IY1uem0-cNuBP48&sz=w1000', // Russian
  'white-balsamic-oil': 'https://drive.google.com/thumbnail?id=1Ry37WLAxDHV3s1_gwJbAnSuEXKGkkOnc&sz=w1000', // White Balsamic Vinegar & Oil
  // Legacy IDs for backwards compatibility
  'sd1': 'https://drive.google.com/thumbnail?id=1Gg6iNlPUaImDp7LZTPQYmjbXrHZvB39x&sz=w1000', // Avocado Ranch
  'sd2': 'https://drive.google.com/thumbnail?id=1GGvVde4_4JwEI6bzaMAVrbSAy0W_gg4i&sz=w1000', // Balsamic Vinaigrette
  'sd3': 'https://drive.google.com/thumbnail?id=14SFcFmFhOVNs5fyInrhoF7VyLuYbio-G&sz=w1000', // Balsamic Vinegar & Oil
  'sd4': 'https://drive.google.com/thumbnail?id=1IC2l-gLbo0QYFislwjItAp__I6DaajmN&sz=w1000', // Bleu Cheese
  'sd5': 'https://drive.google.com/thumbnail?id=1-EDW7ulTkm2Yb60gHkL2Sma5cy0_OhZi&sz=w1000', // Buffalo
  'sd6': 'https://drive.google.com/thumbnail?id=1L6oviEaIAB85VpWSvRsAyZvAiZTeSjJv&sz=w1000', // Caesar
  'sd7': 'https://drive.google.com/thumbnail?id=15HPwrLT70Gcs6LUkC5GXrpV-a2nUT0H5&sz=w1000', // Chipotle Ranch
  'sd8': 'https://drive.google.com/thumbnail?id=1h-B9fqghICR_PZLYIXPd_VAWHQPL4HzI&sz=w1000', // Creamy Italian
  'sd9': 'https://drive.google.com/thumbnail?id=11WyvDp-cEGohwxEPW2yxgwAX1JJhVbzQ&sz=w1000', // Fat Free Italian
  'sd10': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Fat Free Ranch
  'sd11': 'https://drive.google.com/thumbnail?id=1DD78wzRUoCiQ4C7gZLT_wVQZBJiqp4nu&sz=w1000', // French
  'sd12': 'https://drive.google.com/thumbnail?id=1v2T09u3nIJrT_i4seDT76K8ysG5opUBz&sz=w1000', // Green Goddess
  'sd13': 'https://drive.google.com/thumbnail?id=1l9ix4xEZLPiwjsIxYzXVNALwePILDiOB&sz=w1000', // Honey Mustard
  'sd14': 'https://drive.google.com/thumbnail?id=1DX2c1hCjOoGBAOGUDrbgxOaKOfYQBx6m&sz=w1000', // Lemon Oil
  'sd15': 'https://drive.google.com/thumbnail?id=10VOoUiN14zDD_ype7l5BSEFgbJcf7IaA&sz=w1000', // Lite Caesar
  'sd16': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // No Dressing
  'sd17': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Ranch
  'sd18': 'https://drive.google.com/thumbnail?id=1sFzS6XXbS8bkOFKjZx4RZl2jbsGxUy1x&sz=w1000', // Red Wine Vinegar & Oil
  'sd19': 'https://drive.google.com/thumbnail?id=1r_u8OvKKj5wKbcYi1IY1uem0-cNuBP48&sz=w1000', // Russian
  'sd20': 'https://drive.google.com/thumbnail?id=1Ry37WLAxDHV3s1_gwJbAnSuEXKGkkOnc&sz=w1000', // White Balsamic Vinegar & Oil
  'sd21': 'https://drive.google.com/thumbnail?id=1AjIIFqxtZCJonUNFIFNP1hfUhZYkEI_S&sz=w1000', // Oil
  'sd22': 'https://drive.google.com/thumbnail?id=1T3FUU5BFv60sag9eIKbwwXMDTGRDkspF&sz=w1000', // Lemon
  'sd23': 'https://drive.google.com/thumbnail?id=1Bof4Gqrl0PeXgPxGpXbyCU2ZmZrF5dqj&sz=w1000', // Red Vinegar
  'sd24': 'https://drive.google.com/thumbnail?id=1q4TcoTy4bBKv6V-0lKdVwg4FhrPrGiZn&sz=w1000', // Balsamic Vinegar
};

// Salad Extra Dressing images (for "Extra Dressing" section)
export const SALAD_EXTRA_DRESSING_IMAGES: { [key: string]: string } = {
  'sed1': 'https://drive.google.com/thumbnail?id=1WwLuvGOSu2ezGy38ztr39_wtWWX3k8XO&sz=w1000', // Avocado Ranch
  'sed2': 'https://drive.google.com/thumbnail?id=1q4TcoTy4bBKv6V-0lKdVwg4FhrPrGiZn&sz=w1000', // Balsamic Vinaigrette
  'sed3': 'https://drive.google.com/thumbnail?id=14SFcFmFhOVNs5fyInrhoF7VyLuYbio-G&sz=w1000', // Balsamic Vinegar & Oil
  'sed4': 'https://drive.google.com/thumbnail?id=1IC2l-gLbo0QYFislwjItAp__I6DaajmN&sz=w1000', // Bleu Cheese
  'sed5': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Buffalo (use Ranch image as placeholder)
  'sed6': 'https://drive.google.com/thumbnail?id=1L6oviEaIAB85VpWSvRsAyZvAiZTeSjJv&sz=w1000', // Caesar
  'sed7': 'https://drive.google.com/thumbnail?id=15HPwrLT70Gcs6LUkC5GXrpV-a2nUT0H5&sz=w1000', // Chipotle Ranch
  'sed8': 'https://drive.google.com/thumbnail?id=1h-B9fqghICR_PZLYIXPd_VAWHQPL4HzI&sz=w1000', // Creamy Italian
  'sed9': 'https://drive.google.com/thumbnail?id=11WyvDp-cEGohwxEPW2yxgwAX1JJhVbzQ&sz=w1000', // Fat Free Italian
  'sed10': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Fat Free Ranch
  'sed11': 'https://drive.google.com/thumbnail?id=1DD78wzRUoCiQ4C7gZLT_wVQZBJiqp4nu&sz=w1000', // French
  'sed12': 'https://drive.google.com/thumbnail?id=1v2T09u3nIJrT_i4seDT76K8ysG5opUBz&sz=w1000', // Green Goddess
  'sed13': 'https://drive.google.com/thumbnail?id=1l9ix4xEZLPiwjsIxYzXVNALwePILDiOB&sz=w1000', // Honey Mustard
  'sed14': 'https://drive.google.com/thumbnail?id=1DX2c1hCjOoGBAOGUDrbgxOaKOfYQBx6m&sz=w1000', // Lemon Oil
  'sed15': 'https://drive.google.com/thumbnail?id=10VOoUiN14zDD_ype7l5BSEFgbJcf7IaA&sz=w1000', // Lite Caesar
  'sed16': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // No Dressing (use Ranch as placeholder)
  'sed17': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Ranch
  'sed18': 'https://drive.google.com/thumbnail?id=1sFzS6XXbS8bkOFKjZx4RZl2jbsGxUy1x&sz=w1000', // Red Wine Vinegar & Oil
  'sed19': 'https://drive.google.com/thumbnail?id=1r_u8OvKKj5wKbcYi1IY1uem0-cNuBP48&sz=w1000', // Russian
  'sed20': 'https://drive.google.com/thumbnail?id=1Ry37WLAxDHV3s1_gwJbAnSuEXKGkkOnc&sz=w1000', // White Balsamic Vinegar & Oil
  'sed21': 'https://drive.google.com/thumbnail?id=1AjIIFqxtZCJonUNFIFNP1hfUhZYkEI_S&sz=w1000', // Oil
  'sed22': 'https://drive.google.com/thumbnail?id=1T3FUU5BFv60sag9eIKbwwXMDTGRDkspF&sz=w1000', // Lemon
  'sed23': 'https://drive.google.com/thumbnail?id=1Bof4Gqrl0PeXgPxGpXbyCU2ZmZrF5dqj&sz=w1000', // Red Vinegar
  'sed24': 'https://drive.google.com/thumbnail?id=1q4TcoTy4bBKv6V-0lKdVwg4FhrPrGiZn&sz=w1000', // Balsamic Vinegar
  // Para los IDs de extraDressings
  'extra-avocado-ranch': 'https://drive.google.com/thumbnail?id=1WwLuvGOSu2ezGy38ztr39_wtWWX3k8XO&sz=w1000', // Avocado Ranch
  'extra-balsamic': 'https://drive.google.com/thumbnail?id=1q4TcoTy4bBKv6V-0lKdVwg4FhrPrGiZn&sz=w1000', // Balsamic Vinaigrette
  'extra-balsamic-oil': 'https://drive.google.com/thumbnail?id=14SFcFmFhOVNs5fyInrhoF7VyLuYbio-G&sz=w1000', // Balsamic Vinegar & Oil
  'extra-blue-cheese': 'https://drive.google.com/thumbnail?id=1IC2l-gLbo0QYFislwjItAp__I6DaajmN&sz=w1000', // Blue Cheese
  'extra-buffalo': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Buffalo
  'extra-caesar': 'https://drive.google.com/thumbnail?id=1L6oviEaIAB85VpWSvRsAyZvAiZTeSjJv&sz=w1000', // Caesar
  'extra-chipotle-ranch': 'https://drive.google.com/thumbnail?id=15HPwrLT70Gcs6LUkC5GXrpV-a2nUT0H5&sz=w1000', // Chipotle Ranch
  'extra-creamy-italian': 'https://drive.google.com/thumbnail?id=1h-B9fqghICR_PZLYIXPd_VAWHQPL4HzI&sz=w1000', // Creamy Italian
  'extra-fat-free-italian': 'https://drive.google.com/thumbnail?id=11WyvDp-cEGohwxEPW2yxgwAX1JJhVbzQ&sz=w1000', // Fat Free Italian
  'extra-fat-free-ranch': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Fat Free Ranch
  'extra-french': 'https://drive.google.com/thumbnail?id=1DD78wzRUoCiQ4C7gZLT_wVQZBJiqp4nu&sz=w1000', // French
  'extra-green-goddess': 'https://drive.google.com/thumbnail?id=1v2T09u3nIJrT_i4seDT76K8ysG5opUBz&sz=w1000', // Green Goddess
  'extra-honey-mustard': 'https://drive.google.com/thumbnail?id=1l9ix4xEZLPiwjsIxYzXVNALwePILDiOB&sz=w1000', // Honey Mustard
  'extra-lemon-oil': 'https://drive.google.com/thumbnail?id=1DX2c1hCjOoGBAOGUDrbgxOaKOfYQBx6m&sz=w1000', // Lemon Oil
  'extra-lite-caesar': 'https://drive.google.com/thumbnail?id=10VOoUiN14zDD_ype7l5BSEFgbJcf7IaA&sz=w1000', // Lite Caesar
  'extra-ranch': 'https://drive.google.com/thumbnail?id=18IJxohQw6ZqTsHANKHJoMpK1YmvExnOs&sz=w1000', // Ranch
  'extra-red-wine-vinegar-oil': 'https://drive.google.com/thumbnail?id=1sFzS6XXbS8bkOFKjZx4RZl2jbsGxUy1x&sz=w1000', // Red Wine Vinegar & Oil
  'extra-russian': 'https://drive.google.com/thumbnail?id=1r_u8OvKKj5wKbcYi1IY1uem0-cNuBP48&sz=w1000', // Russian
  'extra-white-balsamic-oil': 'https://drive.google.com/thumbnail?id=1Ry37WLAxDHV3s1_gwJbAnSuEXKGkkOnc&sz=w1000', // White Balsamic Vinegar & Oil
};

// Build Your Own Pasta Sauce images
export const BUILD_PASTA_SAUCE_IMAGES: { [key: string]: string } = {
  'bps1': 'https://drive.google.com/thumbnail?id=1_cydxB3cCNSNS_6po0G070Ud-3oyTXPq&sz=w400', // Pomodoro Sauce
  'bps2': 'https://drive.google.com/thumbnail?id=1M2cJh1yIdIya0hzHH4Nr8ta-qW1YpVKF&sz=w400', // Pomodoro Sauce with (2) Meatballs
  'bps3': 'https://drive.google.com/thumbnail?id=1QqsdG3YatAZb1W34OrFv_r0mTuIqwBYZ&sz=w400', // Pomodoro Sauce with (2) Sausage
  'bps4': 'https://drive.google.com/thumbnail?id=19r_ISTtvJc9WAPWoJqtXV3UZJUNvz0Yo&sz=w400', // Marinara Sauce
  'bps5': 'https://drive.google.com/thumbnail?id=1toDglS09efc9ZspYl3fNc_o4fBudOrdv&sz=w400', // Bolognese Sauce
  'bps6': 'https://drive.google.com/thumbnail?id=1Zma9py9fX7tFp0oy6YtuPrfwVfqf4Pnf&sz=w400', // Vodka Sauce
  'bps7': 'https://drive.google.com/thumbnail?id=1dGKmemolMs3Xu0roP7O98028DMI5-RJE&sz=w400', // Garlic & Oil
  'bps8': '', // Butter Sauce (no image)
  'bps9': 'https://drive.google.com/thumbnail?id=1Qcek_MmvxxYuVrJ-Q72z0Nv5WIAreTkN&sz=w400', // Mushroom Sauce
  'bps10': 'https://drive.google.com/thumbnail?id=1rZIRDMfpbmzGypgw2gaJNn4p0DizVeV1&sz=w400', // Alfredo Sauce
  'bps11': 'https://drive.google.com/thumbnail?id=1qAoGivLdbLlBmeJW3LFoZJcWp57xkRV0&sz=w400', // Sausage & Roasted Peppers
  'bps12': 'https://drive.google.com/thumbnail?id=1emSQwD76QRqnlFhF7zpqa_fIidO2T3Zf&sz=w400', // Pasta alla Passariello
};

// Seafood Pasta Type images
export const SEAFOOD_PASTA_TYPE_IMAGES: { [key: string]: string } = {
  'sfp1': 'https://drive.google.com/thumbnail?id=10hgB8Hu9ZzN6zW-F_6EeAN3UuqTzSrAx&sz=w400', // Spaghetti
  'sfp2': 'https://drive.google.com/thumbnail?id=1giuOIv84WD3Z-yB3UAcpCDsp8-N91OJ-&sz=w400', // Penne
  'sfp3': 'https://drive.google.com/thumbnail?id=1Ful6PZ4WaOug1uh2kOGZA9Q4tgnjTM59&sz=w400', // Linguine
  'sfp4': 'https://drive.google.com/thumbnail?id=11oENl2Sf2uVmtcQX5M9iyvG4u9poF4IH&sz=w400', // Capellini
  'sfp5': 'https://drive.google.com/thumbnail?id=1tzbNi9YKq3TC-B9_VkcqGqxSwqkKfz37&sz=w400', // Fettuccine
  'sfp6': 'https://drive.google.com/thumbnail?id=1JvFSnnImV1DJHodwU77OH3xN6zr7ekB8&sz=w1080', // Ziti
  'sfp9': 'https://drive.google.com/thumbnail?id=1B2GHWA0NHWvNNhfqEJSZvquTRnTOMrte&sz=w1000', // Rigatoni
  'sfp7': 'https://drive.google.com/thumbnail?id=1fWZ6wibVSHz7SNWTaCKN38ycxbUt9k2z&sz=w1000', // Gnocchi
  'sfp8': 'https://drive.google.com/thumbnail?id=19DhUTVbcnbkHioBLbq9wZx-NRCvvu7Nl&sz=w1000', // GF Penne
};

// Kids Pasta Sauce images
export const KIDS_PASTA_SAUCE_IMAGES: { [key: string]: string } = {
  'kps1': 'https://drive.google.com/thumbnail?id=1d-EDKEtACSwCdw2JkhnvxusWQepJytSk&sz=w400', // Tomato
  'kps2': 'https://drive.google.com/thumbnail?id=1rZIRDMfpbmzGypgw2gaJNn4p0DizVeV1&sz=w400', // Alfredo
  'kps3': 'https://drive.google.com/thumbnail?id=1-wuPKIVgmQEaGzqHCoVcyQKSEgNkWlVB&sz=w400', // Butter Sauce
  'kps4': 'https://drive.google.com/thumbnail?id=1Zma9py9fX7tFp0oy6YtuPrfwVfqf4Pnf&sz=w400', // Vodka Sauce
  'kps5': 'https://drive.google.com/thumbnail?id=1_cydxB3cCNSNS_6po0G070Ud-3oyTXPq&sz=w400', // Pomodoro Sauce
  'kps6': 'https://drive.google.com/thumbnail?id=1dJv9IQB4oI22VT1Odktxcfpw-4ktW4dr&sz=w400', // Pomodoro Sauce & (1) Meatball
};

// Kids Pasta Topping images
export const KIDS_PASTA_TOPPING_IMAGES: { [key: string]: string } = {
  'kpat1': 'https://drive.google.com/thumbnail?id=1e5p7Mpa83h-EonD4mue7gIBErHH01jGo&sz=w400', // Mushrooms
  'kpat2': 'https://drive.google.com/thumbnail?id=1zc9sVnQ5fz4h_qpGq_RQnAhiiTYXyqCV&sz=w400', // Spinach
  'kpat3': 'https://drive.google.com/thumbnail?id=1gwtm_YlInG0mAOpQfzXqOfNJNTW3Pkv3&sz=w400', // Broccoli
  'kpat4': 'https://drive.google.com/thumbnail?id=1zU0PP9a8DjN0uhPKyFuyzjdXMVYNfPQw&sz=w400', // Grilled Chicken Strips
  'kpat5': 'https://drive.google.com/thumbnail?id=14mjBfgjg1U5hT7MS2L1MUTH1DwWO7jFF&sz=w400', // Shrimp
};

// Kids Pasta Type images
export const KIDS_PASTA_TYPE_IMAGES: { [key: string]: string } = {
  'kpt1': 'https://drive.google.com/thumbnail?id=10hgB8Hu9ZzN6zW-F_6EeAN3UuqTzSrAx&sz=w400', // Spaghetti
  'kpt2': 'https://drive.google.com/thumbnail?id=1giuOIv84WD3Z-yB3UAcpCDsp8-N91OJ-&sz=w400', // Penne
  'kpt3': 'https://drive.google.com/thumbnail?id=1JvFSnnImV1DJHodwU77OH3xN6zr7ekB8&sz=w1080', // Ziti
  'kpt4': 'https://drive.google.com/thumbnail?id=1Ful6PZ4WaOug1uh2kOGZA9Q4tgnjTM59&sz=w400', // Linguine
  'kpt5': 'https://drive.google.com/thumbnail?id=11oENl2Sf2uVmtcQX5M9iyvG4u9poF4IH&sz=w400', // Capellini
  'kpt6': 'https://drive.google.com/thumbnail?id=1tzbNi9YKq3TC-B9_VkcqGqxSwqkKfz37&sz=w400', // Fettuccine
  'kpt7': 'https://drive.google.com/thumbnail?id=1B2GHWA0NHWvNNhfqEJSZvquTRnTOMrte&sz=w1000', // Rigatoni
  'kpt8': 'https://drive.google.com/thumbnail?id=1fWZ6wibVSHz7SNWTaCKN38ycxbUt9k2z&sz=w1000', // Gnocchi
  'kpt9': 'https://drive.google.com/thumbnail?id=19DhUTVbcnbkHioBLbq9wZx-NRCvvu7Nl&sz=w1000', // GF Penne
};

export const includedToppings: Topping[] = [
  {
    id: 't1',
    name: 'Mozzarella Cheese',
    included: true,
    image: 'https://images.unsplash.com/photo-1734774924912-dcbb467f8599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3p6YXJlbGxhJTIwc3RpY2tzJTIwYXBwZXRpemVyfGVufDF8fHx8MTc2MjM1OTA1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 't2',
    name: 'Tomato Sauce',
    included: true,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzYXVjZXxlbnwxfHx8fDE3NjI4MDM1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 't3',
    name: 'Garlic Bread',
    included: true,
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBicmVhZHxlbnwxfHx8fDE3NjIzNzM3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 't4',
    name: 'Fresh Basil',
    included: true,
    image: 'https://images.unsplash.com/photo-1662422325326-19089df23d98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhc2lsJTIwbGVhdmVzfGVufDF8fHx8MTc2MjgxMDg0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 't5',
    name: 'Olive Oil',
    included: true,
    image: 'https://images.unsplash.com/photo-1743193144224-d2db90ea7784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbCUyMGRyaXp6bGV8ZW58MXx8fHwxNzYyODEwODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export const additionalToppings: Topping[] = [
  {
    id: 'a1',
    name: 'Cup n Char Pepperoni',
    price: 4.99,
    image: 'https://drive.google.com/thumbnail?id=1zLG_JHEEY8q_eH_EnMhOD7kx8nDHv9Rk&sz=w400',
  },
  {
    id: 'a2',
    name: 'Sausage',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1T7bfuraVR49J9dfJwBs8s2TSv4d7SoyI&sz=w400',
  },
  {
    id: 'a3',
    name: 'Pepperoni',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1AWQvufIjyVIVncZDRUG-Dy9XfgVERvXc&sz=w400',
  },
  {
    id: 'a4',
    name: 'Mushrooms',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1e5p7Mpa83h-EonD4mue7gIBErHH01jGo&sz=w400',
  },
  {
    id: 'a5',
    name: 'Fresh Mozzarella',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1Ol3OqaVbYxwLGAACMUPS_sJuca5IgfZS&sz=w400',
  },
  {
    id: 'a6',
    name: 'Grilled Onions',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1kWHOgg-PbnjGq1vJbyvTZD4eGKYT0djd&sz=w400',
  },
  {
    id: 'a7',
    name: 'Sliced Black Olives',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1aCYhCnbMQeG8ZgI1dgZCdQvKrGmlDso9&sz=w400',
  },
  {
    id: 'a8',
    name: 'Ham',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1_5UtdDm2QOO2iMUT9gIXDR8_JfozqkPl&sz=w400',
  },
  {
    id: 'a9',
    name: 'Bacon',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=19q_8iv7dK5PVRy1lbDXn50wHmYbGL1jO&sz=w400',
  },
  {
    id: 'a10',
    name: 'Chopped Garlic',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1uOj-ZtqX38qZMrDk-b03OjJ6-Nhoqyww&sz=w400',
  },
  {
    id: 'a11',
    name: 'Zucchini',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=17_SsmNN8yRHgQDI0qTNyGy6fgGjSuGZ1&sz=w400',
  },
  {
    id: 'a12',
    name: 'Sliced Hot Cherry Peppers',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1jleJl6tUqdtnwkwm4ap526-L6VlefOYH&sz=w400',
  },
  {
    id: 'a13',
    name: 'Mix Sweet Peppers',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1cEYCMH7PaiZHi8PAGW_l1E9HNo-HqAZm&sz=w400',
  },
  {
    id: 'a14',
    name: 'Roasted Peppers',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1FixnCdbylb4CTQV_hDIfhua8NaX87sme&sz=w400',
  },
  {
    id: 'a15',
    name: 'Sundried Tomatoes',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=14Jw0NQfkqCIITdEsMyP0ANQIjR9vLlcb&sz=w400',
  },
  {
    id: 'a16',
    name: 'Anchovies',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1raKjTe8PSZNQmy7KApo6PkWzm1IBto_P&sz=w400',
  },
  {
    id: 'a17',
    name: 'Spinach',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1zc9sVnQ5fz4h_qpGq_RQnAhiiTYXyqCV&sz=w400',
  },
  {
    id: 'a18',
    name: 'Extra Cheese',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1zqbadi42-LGOF4L7m7fPUWpSS7L4Yrd6&sz=w400',
  },
  {
    id: 'a19',
    name: 'Ricotta Cheese',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1WD_EbE-L27RmlggvIuU656A6ChXpAufY&sz=w400',
  },
  {
    id: 'a20',
    name: 'Sliced Meatballs',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1f63otm7CqMF_7T9rnabUURnNZX-D_OYT&sz=w400',
  },
  {
    id: 'a21',
    name: 'Chopped Tomato',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1H4iNykLVvOiRItfPHBaar1PIbNWwsBjP&sz=w400',
  },
  {
    id: 'a22',
    name: 'Broccoli Florets',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1gwtm_YlInG0mAOpQfzXqOfNJNTW3Pkv3&sz=w400',
  },
  {
    id: 'a23',
    name: 'Eggplant',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=121jJUd3UR30lBcXzKboSSEAat9_skQHO&sz=w400',
  },
  {
    id: 'a24',
    name: 'Artichokes',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1xmgRvCCIypumXrqHjuKHLGqmwuCQqIN5&sz=w400',
  },
  {
    id: 'a25',
    name: 'Pineapple',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1p0SdVWZmuq-h9D2t63hUZRTkKnurxie5&sz=w400',
  },
  {
    id: 'a26',
    name: "Mike's Hot Honey",
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=13sMdpB6f3mDzHju1EoQTXM71XE1DmBKd&sz=w400',
  },
  {
    id: 'a27',
    name: 'Grilled Chicken',
    price: 10.99,
    image: 'https://drive.google.com/thumbnail?id=1zU0PP9a8DjN0uhPKyFuyzjdXMVYNfPQw&sz=w400',
  },
  {
    id: 'a28',
    name: 'Beef Steak',
    price: 10.99,
    image: 'https://drive.google.com/thumbnail?id=1iiKMtj4hlB8T3YiCG7RxjceQDmuwSxni&sz=w400',
  },
  {
    id: 'a29',
    name: 'Chicken Steak',
    price: 10.99,
    image: 'https://drive.google.com/thumbnail?id=1FO0Dts4Y4pCgE0WPax0ijSjKFzuXAqfj&sz=w400',
  },
  {
    id: 'a30',
    name: 'Banana Peppers',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1s-xm4fbYN6yXmTafrwYI1y_phOFVshUo&sz=w400',
  },
  {
    id: 'a31',
    name: 'Mix Grilled Peppers',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1kWHOgg-PbnjGq1vJbyvTZD4eGKYT0djd&sz=w400',
  },
  {
    id: 'a32',
    name: 'Raw Onions',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1VShE_FfooQ7FPBY8vv0eDoNpvU6a1cc5&sz=w400',
  },
  {
    id: 'a33',
    name: 'Sliced Tomatoes',
    price: 3.49,
    image: 'https://drive.google.com/thumbnail?id=1vGy2iRsL4C5tR8TFVVC_L3-MYw8DuTE9&sz=w400',
  },
];