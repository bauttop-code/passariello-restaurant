#!/usr/bin/env python3
"""
Script to update grid spacing in App.tsx for editorial style menu
"""

import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Standard grid with gap-6 sm:gap-4
pattern1 = r'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-(\d+) lg:grid-cols-(\d+) xl:grid-cols-(\d+) gap-6 sm:gap-4'
replacement1 = r'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-8 sm:gap-10'

# Replace all occurrences
content = re.sub(pattern1, replacement1, content)

# Pattern 2: Grid with additional classes (mb-6, mb-8, px-0.5, etc.)
# We need to preserve these additional classes
pattern2 = r'(grid grid-cols-2 sm:grid-cols-2 md:grid-cols-\d+ lg:grid-cols-\d+ xl:grid-cols-\d+) gap-6 sm:gap-4'
replacement2 = r'\1 gap-8 sm:gap-10'
content = re.sub(pattern2, replacement2, content)

# Write back
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated all grid spacing to gap-8 sm:gap-10 for editorial style")
print("✅ Updated grid responsive breakpoints for cleaner layout")
