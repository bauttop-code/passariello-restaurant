const fs = require('fs');

// Leer el archivo completo
const filePath = './components/ProductDetailPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Contar antes
const before1 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between"/g) || []).length;
const before2 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between mt-4"/g) || []).length;
const before3 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between \$/g) || []).length;
const beforeTotal = before1 + before2 + before3;

console.log('🔍 Encontrados:');
console.log(`   • ${before1} banners sin mt-4`);
console.log(`   • ${before2} banners con mt-4`);
console.log(`   • ${before3} banners con template string`);
console.log(`   • Total: ${beforeTotal} banners`);

// Reemplazo 1: Sin mt-4
content = content.replace(
  /w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between"/g,
  'w-full bg-[#F5F3EB] text-gray-900 p-5 rounded-lg flex items-center justify-between"'
);

// Reemplazo 2: Con mt-4
content = content.replace(
  /w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between mt-4"/g,
  'w-full bg-[#F5F3EB] text-gray-900 p-5 rounded-lg flex items-center justify-between mt-4"'
);

// Reemplazo 3: En template strings (con $)
content = content.replace(
  /w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between \$/g,
  'w-full bg-[#F5F3EB] text-gray-900 p-5 rounded-lg flex items-center justify-between $'
);

// Contar después
const after1 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between"/g) || []).length;
const after2 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between mt-4"/g) || []).length;
const after3 = (content.match(/w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between \$/g) || []).length;
const afterTotal = after1 + after2 + after3;

// Guardar archivo
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✅ Reemplazo completado:');
console.log(`   • Actualizados: ${beforeTotal - afterTotal} banners`);
console.log(`   • Restantes: ${afterTotal} banners rojos`);
console.log('\n🎨 Cambio aplicado:');
console.log('   bg-[#A72020] text-white → bg-[#F5F3EB] text-gray-900');

if (afterTotal === 0) {
  console.log('\n🎉 ¡Perfecto! Todos los banners han sido actualizados.');
}
