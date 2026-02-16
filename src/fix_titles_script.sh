#!/bin/bash

# Script para aplicar fontSize: 'calc(1em + 3px)' a todos los títulos de toppings

FILE="/components/ProductDetailPage.tsx"

# Backup del archivo original
cp "$FILE" "${FILE}.backup"

# Reemplazar todos los font-semibold sin estilo
sed -i 's/<span className="font-semibold">/<span className="font-semibold" style={{fontSize: '\''calc(1em + 3px)'\''}}>g' "$FILE"

# Reemplazar todos los font-bold que NO tengan ya el estilo fontSize
# Este es más complejo porque algunos ya lo tienen
perl -i -pe 's/<span className="font-bold">(?!.*style={{fontSize)/<span className="font-bold" style={{fontSize: '\''calc(1em + 3px)'\''}}>g' "$FILE"

echo "Completed! Check $FILE"
echo "Backup saved at ${FILE}.backup"
