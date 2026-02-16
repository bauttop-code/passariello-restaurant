#!/usr/bin/env python3
import re

# Leer el archivo
with open('/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazos para agregar flex items-center
replacements = [
    ('bg-[#A72020] text-white px-4 py-3 rounded-lg">', 'bg-[#A72020] text-white px-4 py-3 rounded-lg flex items-center">'),
    ('bg-[#A72020] text-white px-4 py-3 rounded-lg mb-5 relative z-10">', 'bg-[#A72020] text-white px-4 py-3 rounded-lg mb-5 relative z-10 flex items-center">'),
    ('bg-[#A72020] text-white px-4 py-3 rounded-lg mb-5">', 'bg-[#A72020] text-white px-4 py-3 rounded-lg mb-5 flex items-center">'),
    ('bg-[#A72020] text-white px-4 py-3 rounded-lg mb-2">', 'bg-[#A72020] text-white px-4 py-3 rounded-lg mb-2 flex items-center">'),
]

for old, new in replacements:
    content = content.replace(old, new)

# Escribir el archivo
with open('/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reemplazos completados")
