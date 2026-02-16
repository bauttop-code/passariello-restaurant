import * as fs from 'fs';
import * as path from 'path';

// Función para reemplazar todos los grids de toppings a 3 columnas
export function replaceGridsTo3Columns() {
  const filePath = path.join(process.cwd(), 'components', 'ProductDetailPage.tsx');
  
  // Leer el archivo
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Patrones a reemplazar
  const replacements = [
    {
      from: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch',
      to: 'grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch'
    },
    {
      from: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4',
      to: 'grid grid-cols-1 md:grid-cols-3 gap-4'
    },
    {
      from: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4',
      to: 'grid grid-cols-1 md:grid-cols-3 gap-4'
    },
    {
      from: 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4',
      to: 'grid grid-cols-1 md:grid-cols-3 gap-4'
    },
  ];
  
  let totalChanges = 0;
  
  // Hacer todos los reemplazos
  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    content = content.replace(regex, to);
    
    if (count > 0) {
      console.log(`✓ Reemplazados ${count} de: ${from}`);
      totalChanges += count;
    }
  });
  
  // Escribir el archivo modificado
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ Total de cambios: ${totalChanges}`);
  console.log(`📁 Archivo actualizado: ${filePath}`);
  
  return totalChanges;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  replaceGridsTo3Columns();
}
