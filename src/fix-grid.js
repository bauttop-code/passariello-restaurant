// Script para cambiar xl:grid-cols-6 a xl:grid-cols-4 en los toppings
// Solo cambiaremos los que tienen gap-4 o gap-5 (toppings)
// NO cambiaremos los que tienen gap-6 (productos del menú)

const fs = require('fs');

const filePath = './components/ProductDetailPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Cambiar xl:grid-cols-6 gap-4 a xl:grid-cols-4 gap-4
content = content.replace(/xl:grid-cols-6 gap-4/g, 'xl:grid-cols-4 gap-4');

// Cambiar xl:grid-cols-6 gap-5 a xl:grid-cols-4 gap-5
content = content.replace(/xl:grid-cols-6 gap-5/g, 'xl:grid-cols-4 gap-5');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Arreglado! Cambiados todos los grids de toppings de xl:grid-cols-6 a xl:grid-cols-4');
console.log('   - Toppings con gap-4: xl:grid-cols-6 → xl:grid-cols-4');
console.log('   - Toppings con gap-5: xl:grid-cols-6 → xl:grid-cols-4');
console.log('   - Menú principal con gap-6 se mantiene en xl:grid-cols-6');
