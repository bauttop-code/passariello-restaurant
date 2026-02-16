import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🔄 Iniciando reemplazo masivo de grids...\n');

const filePath = join(process.cwd(), 'components', 'ProductDetailPage.tsx');

// Leer archivo
let content = readFileSync(filePath, 'utf-8');

// Contar ocurrencias antes
const count6Before = (content.match(/xl:grid-cols-6/g) || []).length;
const count5Before = (content.match(/xl:grid-cols-5/g) || []).length;
const count4Before = (content.match(/xl:grid-cols-4/g) || []).length;

console.log(`📊 Encontradas antes del reemplazo:`);
console.log(`   - xl:grid-cols-6: ${count6Before}`);
console.log(`   - xl:grid-cols-5: ${count5Before}`);
console.log(`   - xl:grid-cols-4: ${count4Before}`);
console.log(`   Total: ${count6Before + count5Before + count4Before}\n`);

// Hacer reemplazos (orden importa - del más específico al menos específico)
content = content.replace(/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch/g, 'grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch');
content = content.replace(/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4/g, 'grid grid-cols-1 md:grid-cols-3 gap-4');
content = content.replace(/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4/g, 'grid grid-cols-1 md:grid-cols-3 gap-4');
content = content.replace(/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4/g, 'grid grid-cols-1 md:grid-cols-3 gap-4');

// Contar después
const count6After = (content.match(/xl:grid-cols-6/g) || []).length;
const count5After = (content.match(/xl:grid-cols-5/g) || []).length;
const count4After = (content.match(/xl:grid-cols-4/g) || []).length;

console.log(`📊 Restantes después del reemplazo:`);
console.log(`   - xl:grid-cols-6: ${count6After}`);
console.log(`   - xl:grid-cols-5: ${count5After}`);
console.log(`   - xl:grid-cols-4: ${count4After}\n`);

// Escribir archivo
writeFileSync(filePath, content, 'utf-8');

const totalChanges = (count6Before - count6After) + (count5Before - count5After) + (count4Before - count4After);

console.log(`✅ ¡Completado! Se realizaron ${totalChanges} reemplazos`);
console.log(`📁 Archivo actualizado: ${filePath}`);
