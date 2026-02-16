#!/usr/bin/env python3
import re

# Read the file
with open('/components/ProductDetailPage.tsx', 'r') as f:
    content = f.read()

# Replace all instances of py-3 with h-14 in the specific className pattern
content = content.replace(
    'className="flex-1 flex items-center justify-between px-4 py-3"',
    'className="flex-1 flex items-center justify-between px-4 h-14"'
)

# Also replace the py-2 instance
content = content.replace(
    'className="flex-1 flex items-center justify-between px-4 py-2"',
    'className="flex-1 flex items-center justify-between px-4 h-14"'
)

# Also handle the ones with gap-3
content = content.replace(
    'className="flex-1 flex items-center justify-between px-4 py-3 gap-3"',
    'className="flex-1 flex items-center justify-between px-4 h-14 gap-3"'
)

# Write back
with open('/components/ProductDetailPage.tsx', 'w') as f:
    f.write(content)

print("Replacement complete!")
