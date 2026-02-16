// Script temporal para cambiar todos los grids de toppings a 3 columnas
const fs = require('fs');

const filePath = './components/ProductDetailPage.tsx';

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

// Contador de cambios
let changes = 0;

// Reemplazar todos los patrones de xl:grid-cols-6, xl:grid-cols-5, xl:grid-cols-4
const patterns = [
  { old: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4', new: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { old: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4', new: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { old: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4', new: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { old: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch', new: 'grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch' },
];

patterns.forEach(pattern => {
  const count = (content.match(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  content = content.replace(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.new);
  changes += count;
  console.log(`Reemplazados ${count} instancias de: ${pattern.old}`);
});

// Escribir el archivo modificado
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✅ Total de cambios realizados: ${changes}`);
console.log(`Archivo actualizado: ${filePath}`);
