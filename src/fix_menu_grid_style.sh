#!/bin/bash

# Script to update grid spacing in App.tsx for editorial style menu
# This updates gap spacing to create more whitespace like the reference image

# Backup original file
cp App.tsx App.tsx.backup

# Replace gap-6 sm:gap-4 with gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10
# This creates more vertical spacing (like the reference) while keeping horizontal spacing tighter
sed -i '' 's/gap-6 sm:gap-4/gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10/g' App.tsx

# Replace gap-6 sm:gap-4 in grids that also have mb-6 or mb-8
sed -i '' 's/gap-6 sm:gap-4 mb-6/gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 mb-6/g' App.tsx
sed -i '' 's/gap-6 sm:gap-4 mb-8/gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 mb-8/g' App.tsx

echo "✅ Updated grid spacing for editorial style"
echo "✅ Backup saved as App.tsx.backup"
