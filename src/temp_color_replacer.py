#!/usr/bin/env python3
# Script to replace all color codes from sage green to dark red in ProductDetailPage.tsx

import re

# Read the file
with open('/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all instances (case insensitive for hex color codes)
content = content.replace('#a6bba1', '#A72020')
content = content.replace('#A6BBA1', '#A72020')
content = content.replace('#A6bba1', '#A72020')

# Write the file back
with open('/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Color replacement completed successfully!")
print("Replaced all instances of #a6bba1 with #A72020")
