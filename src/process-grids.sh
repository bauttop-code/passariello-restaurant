#!/bin/bash

# Script para reemplazar todos los grids de toppings a 3 columnas
FILE="./components/ProductDetailPage.tsx"

echo "🔄 Procesando $FILE..."

# Hacer backup
cp "$FILE" "$FILE.backup"

# Reemplazar todos los patrones usando sed
sed -i 's/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch/grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch/g' "$FILE"
sed -i 's/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4/grid grid-cols-1 md:grid-cols-3 gap-4/g' "$FILE"
sed -i 's/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4/grid grid-cols-1 md:grid-cols-3 gap-4/g' "$FILE"
sed -i 's/grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4/grid grid-cols-1 md:grid-cols-3 gap-4/g' "$FILE"

echo "✅ Reemplazos completados!"
echo "📁 Backup guardado en: $FILE.backup"
