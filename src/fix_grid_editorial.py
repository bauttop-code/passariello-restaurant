#!/usr/bin/env python3
"""
Fix grid spacing for editorial style menu
"""

# Read the entire file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Count original occurrences
original_count = content.count('gap-6 sm:gap-4')
print(f"Found {original_count} occurrences of 'gap-6 sm:gap-4'")

# Replace all occurrences
content = content.replace('gap-6 sm:gap-4', 'gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10')

# Write back
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
with open('App.tsx', 'r', encoding='utf-8') as f:
    new_content = f.read()

new_count = new_content.count('gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10')
print(f"✅ Replaced {original_count} occurrences")
print(f"✅ New spacing pattern appears {new_count} times")
print("✅ Editorial style grid spacing applied successfully")
