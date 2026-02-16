# 🚀 INSTRUCCIONES PARA APLICAR EL PATCH

## Resumen

Necesitas aplicar 77 cambios de color en banners de toppings de `/components/ProductDetailPage.tsx`:
- **Cambio:** `bg-[#A72020] text-white` → `bg-[#F5F3EB] text-[#1F2937]`
- **Solo en:** Banners CollapsibleTrigger con className estático
- **No toca:** Template strings, botones Add to Cart, estados selected, badges, errors

---

## Opción 1: Script Node.js (Recomendado)

### Paso 1: Copia este script y guárdalo como `apply-patch.js`

```javascript
const fs = require('fs');
const path = require('path');

// Leer el archivo
const filePath = path.join(__dirname, 'components', 'ProductDetailPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Patrón sin mt-4
const pattern1 = 'className="w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between"';
const replacement1 = 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between"';

// Patrón con mt-4
const pattern2 = 'className="w-full bg-[#A72020] text-white p-5 rounded-lg flex items-center justify-between mt-4"';
const replacement2 = 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between mt-4"';

// Contar ocurrencias antes
const countBefore = (content.match(/bg-\[#A72020\] text-white p-5/g) || []).length;

// Aplicar reemplazos
content = content.replaceAll(pattern1, replacement1);
content = content.replaceAll(pattern2, replacement2);

// Contar ocurrencias después
const countAfter = (content.match(/bg-\[#A72020\] text-white p-5/g) || []).length;
const changed = countBefore - countAfter;

// Escribir el archivo
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Patch aplicado exitosamente');
console.log(`📊 Banners actualizados: ${changed} de 77 esperados`);
console.log(`📝 Banners con template strings pendientes: ${countAfter - 30}`);
console.log(`⚠️  Revisa MANUAL_FOLLOW_UP.md para los 30 cambios manuales restantes`);
```

### Paso 2: Ejecuta el script

```bash
node apply-patch.js
```

---

## Opción 2: Buscar y Reemplazar en VS Code

### Paso 1: Abrir Find & Replace (Cmd+Shift+H o Ctrl+Shift+H)

### Paso 2: Configuración
- ✅ Activar "Use Regular Expression" (.*) 
- ✅ En "files to include": `**/ProductDetailPage.tsx`

### Paso 3: Primer reemplazo (sin mt-4)

**Find:**
```
className="w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between"
```

**Replace:**
```
className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between"
```

Click "Replace All" → Debería encontrar ~60 ocurrencias

### Paso 4: Segundo reemplazo (con mt-4)

**Find:**
```
className="w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between mt-4"
```

**Replace:**
```
className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between mt-4"
```

Click "Replace All" → Debería encontrar ~17 ocurrencias

### Paso 5: Verificar

Total de reemplazos: ~77

---

## Opción 3: sed (Terminal)

```bash
# Backup primero
cp components/ProductDetailPage.tsx components/ProductDetailPage.tsx.backup

# Reemplazo 1 (sin mt-4)
sed -i '' 's/className="w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between"/className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between"/g' components/ProductDetailPage.tsx

# Reemplazo 2 (con mt-4)
sed -i '' 's/className="w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between mt-4"/className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between mt-4"/g' components/ProductDetailPage.tsx
```

**Nota:** En Linux, usa `sed -i` sin `''`

---

## ✅ Verificación Post-Patch

### 1. Cuenta de cambios
```bash
# Deber haber ~30 ocurrencias restantes (template strings)
grep -c 'bg-\[#A72020\] text-white p-5' components/ProductDetailPage.tsx
```

### 2. Cuenta de nuevos banners crema
```bash
# Debería haber ~77 ocurrencias
grep -c 'bg-\[#F5F3EB\] text-\[#1F2937\] p-5' components/ProductDetailPage.tsx
```

### 3. Revisión visual en UI
- Abre el menú
- Navega a cualquier producto con toppings
- Confirma que los banners son **color crema** (#F5F3EB)
- Confirma que los botones "Add to Cart" son **rojos** (no cambiaron)
- Confirma que los estados selected son **rojos** (no cambiaron)

---

## ⚠️ SIGUIENTE PASO

Después de aplicar este patch (77 cambios), quedan **30 cambios manuales** de banners con template strings.

Ver: `/MANUAL_FOLLOW_UP.md` para instrucciones detalladas.

---

## 🔄 Rollback (Si es necesario)

```bash
cp components/ProductDetailPage.tsx.backup components/ProductDetailPage.tsx
```

O usar Git:
```bash
git checkout components/ProductDetailPage.tsx
```
