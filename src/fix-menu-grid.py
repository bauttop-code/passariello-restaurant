#!/usr/bin/env python3
# Script para cambiar xl:grid-cols-5 2xl:grid-cols-6 a xl:grid-cols-6 en App.tsx

import re

with open('/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Contador
count = content.count('xl:grid-cols-5 2xl:grid-cols-6')

# Reemplazar el patrón
content = content.replace('xl:grid-cols-5 2xl:grid-cols-6', 'xl:grid-cols-6')

with open('/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Completado! Cambiados {count} instancias en el menú")
print(f"   De: 'xl:grid-cols-5 2xl:grid-cols-6'")
print(f"   A:  'xl:grid-cols-6'")
print("   Ahora el menú principal mostrará 6 columnas en pantallas xl (1280px+)")