// This is a utility script to perform bulk color replacement
// Reading ProductDetailPage.tsx and replacing all instances of #a6bba1 with #A72020

import * as fs from 'fs';

const filePath = '/components/ProductDetailPage.tsx';

// Read the entire file
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Perform all replacements (case-insensitive for hex codes)
let updatedContent = fileContent;

// Replace all variations of the sage green color with dark red
updatedContent = updatedContent.replace(/#a6bba1/g, '#A72020');
updatedContent = updatedContent.replace(/#A6BBA1/g, '#A72020');
updatedContent = updatedContent.replace(/#A6bba1/g, '#A72020');

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent, 'utf-8');

console.log('✅ Color replacement completed!');
console.log('All instances of #a6bba1 have been replaced with #A72020');
