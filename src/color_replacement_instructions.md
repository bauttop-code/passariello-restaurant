# Color Replacement Task for ProductDetailPage.tsx

## Objective
Replace all instances of the sage green color `#a6bba1` with dark red color `#A72020` throughout the entire `/components/ProductDetailPage.tsx` file.

## Statistics
- Total instances found: 163
- Instances manually replaced so far: ~10
- Remaining instances: ~153

## What needs to be replaced:
1. `bg-[#a6bba1]` → `bg-[#A72020]` (73 instances)
2. `border-[#a6bba1]` → `border-[#A72020]` (62 instances)  
3. `text-[#a6bba1]` → `text-[#A72020]` (already done)
4. `fill-[#a6bba1]` → `fill-[#A72020]`
5. `const activeColor = '#a6bba1'` → `const activeColor = '#A72020'` (already done)

## Manual Command (if shell access available):
```bash
sed -i 's/#a6bba1/#A72020/g' /components/ProductDetailPage.tsx
```

## Progress:
✅ Line 232: activeColor constant
✅ Line 3734: text color
✅ Line 4337: Special Instructions button
✅ Line 4395: Pasta customization button
✅ Line 4419: Pasta Type Section div
✅ Line 4434-4437: Radio button border and background
✅ Line 4452: Additions Section div

⏳ Remaining: ~153 instances across lines 4500-8200
