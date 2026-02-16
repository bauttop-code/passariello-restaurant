#!/usr/bin/env python3
"""
Script para aplicar el patch de cambio de color de banners de toppings.
Solo cambia bg-[#A72020] text-white por bg-[#F5F3EB] text-[#1F2937]
en líneas específicas que son banners de CollapsibleTrigger.
"""

import re

# Leer el archivo
with open('/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Patrón específico: banners que son CollapsibleTrigger sin template strings
# Solo reemplaza className="..." no className={...}
pattern = r'className="(w-full bg-\[#A72020\] text-white p-5 rounded-lg flex items-center justify-between(?:\s+mt-4)?)"'
replacement = r'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between\1"'

# Función de reemplazo más precisa
def replace_banner(match):
    full_match = match.group(0)
    # Extraer el className completo
    class_content = match.group(1)
    
    # Determinar si tiene mt-4
    if 'mt-4' in class_content:
        return 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between mt-4"'
    else:
        return 'className="w-full bg-[#F5F3EB] text-[#1F2937] p-5 rounded-lg flex items-center justify-between"'

# Aplicar el reemplazo
new_content = re.sub(pattern, replace_banner, content)

# Escribir el archivo
with open('/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Patch aplicado exitosamente")
print(f"Total de reemplazos: {content.count('bg-[#A72020] text-white') - new_content.count('bg-[#A72020] text-white')}")
