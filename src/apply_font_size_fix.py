#!/usr/bin/env python3
"""
Script para aplicar fontSize: 'calc(1em + 3px)' a todos los títulos de toppings/opciones
en ProductDetailPage.tsx
"""

import re

# Leer el archivo
with open('/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Contar cambios
changes = 0

# 1. Reemplazar todos los <span className="font-semibold"> que NO tienen style
pattern1 = r'<span className="font-semibold">'
replacement1 = r'<span className="font-semibold" style={{fontSize: \'calc(1em + 3px)\'}}>'
count1 = content.count(pattern1)
if count1 > 0:
    content = content.replace(pattern1, replacement1)
    changes += count1
    print(f"Replaced {count1} font-semibold occurrences")

# 2. Reemplazar todos los <span className="font-bold"> que NO tienen ya fontSize en el style
# Primero, encontramos todos los que NO tienen style={{fontSize
lines = content.split('\n')
new_lines = []
count2 = 0

for line in lines:
    # Si tiene <span className="font-bold"> pero NO tiene style={{fontSize
    if '<span className="font-bold">' in line and 'style={{fontSize' not in line:
        # Reemplazar solo este patrón específico
        new_line = line.replace(
            '<span className="font-bold">',
            '<span className="font-bold" style={{fontSize: \'calc(1em + 3px)\'}}>'
        )
        if new_line != line:
            count2 += 1
        new_lines.append(new_line)
    else:
        new_lines.append(line)

content = '\n'.join(new_lines)
changes += count2
print(f"Replaced {count2} font-bold occurrences")

# Escribir el archivo
with open('/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nTotal changes: {changes}")
print("Done! All topping titles now have the correct font size.")
