const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('/components/ProductDetailPage.tsx', 'utf8');

// Contador de reemplazos
let count = 0;

// Reemplazo 1: Sin mt-4
const pattern1 = 'className="w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between"';
const replacement1 = 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between"';

const matches1 = content.match(new RegExp(pattern1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
if (matches1) {
  count += matches1.length;
  content = content.replace(new RegExp(pattern1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement1);
}

// Reemplazo 2: Con mt-4
const pattern2 = 'className="w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between mt-4"';
const replacement2 = 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between mt-4"';

const matches2 = content.match(new RegExp(pattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
if (matches2) {
  count += matches2.length;
  content = content.replace(new RegExp(pattern2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement2);
}

// Escribir el archivo
fs.writeFileSync('/components/ProductDetailPage.tsx', content, 'utf8');

console.log(`✅ Patch aplicado exitosamente`);
console.log(`📊 Total de banners actualizados: ${count}`);
console.log(`📝 Los 19 banners con template strings requieren cambio manual (ver MANUAL_FOLLOW_UP.md)`);
