// Script to replace all color codes in ProductDetailPage.tsx
const fs = require('fs');

// Read the file
let content = fs.readFileSync('/components/ProductDetailPage.tsx', 'utf8');

// Count initial occurrences
const initialCount = (content.match(/#a6bba1/gi) || []).length;
console.log(`Found ${initialCount} occurrences of #a6bba1`);

// Replace all case-insensitive variations
content = content.replace(/#a6bba1/gi, '#A72020');
content = content.replace(/#A6BBA1/g, '#A72020');
content = content.replace(/#A6bba1/g, '#A72020');

// Count final occurrences  
const finalCount = (content.match(/#a6bba1/gi) || []).length;
console.log(`After replacement: ${finalCount} occurrences remain`);
console.log(`Successfully replaced ${initialCount - finalCount} instances`);

// Write back
fs.writeFileSync('/components/ProductDetailPage.tsx', content, 'utf8');
console.log('File updated successfully!');
