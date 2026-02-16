#!/usr/bin/env python3
import re

# Read the file
with open('/components/ProductDetailPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Replace font-semibold without style
pattern1 = r'<span className="font-semibold">([^<]+)</span>'
replacement1 = r'<span className="font-semibold" style={{fontSize: \'calc(1em + 3px)\'}}>\ 1</span>'

content = re.sub(pattern1, replacement1, content)

# Pattern 2: Replace font-bold without calc style already (but keep those that have it)
# First, let's find font-bold spans that don't have the fontSize style
pattern2 = r'<span className="font-bold"((?! style=\{\{fontSize)(?:[^>]*))>([^<]+)</span>'
replacement2 = r'<span className="font-bold" style={{fontSize: \'calc(1em + 3px)\'}}>\ 2</span>'

content = re.sub(pattern2, replacement2, content)

# Write back
with open('/components/ProductDetailPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Updated all topping titles.")
