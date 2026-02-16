#!/usr/bin/env python3
import sys

# Leer el archivo
with open('/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Contar ocurrencias antes
count_before = content.count('xl:grid-cols-5 2xl:grid-cols-6')

# Hacer el reemplazo
content = content.replace('xl:grid-cols-5 2xl:grid-cols-6', 'xl:grid-cols-6')

# Contar después
count_after = content.count('xl:grid-cols-6')

# Escribir el archivo
with open('/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Completado!")
print(f"   Instancias reemplazadas: {count_before}")
print(f"   De: 'xl:grid-cols-5 2xl:grid-cols-6'")
print(f"   A:  'xl:grid-cols-6'")
print(f"   Total xl:grid-cols-6 ahora: {count_after}")
