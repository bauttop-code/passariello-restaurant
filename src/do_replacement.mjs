#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const filePath = './components/ProductDetailPage.tsx';

console.log('Reading file...');
let content = readFileSync(filePath, 'utf8');

const beforeCount = (content.match(/#a6bba1/gi) || []).length;
console.log(`Found ${beforeCount} instances of #a6bba1`);

// Replace all instances
content = content.replaceAll('#a6bba1', '#A72020');
content = content.replaceAll('#A6BBA1', '#A72020'); 
content = content.replaceAll('#A6bba1', '#A72020');

const afterCount = (content.match(/#a6bba1/gi) || []).length;
console.log(`After replacement: ${afterCount} instances remain`);
console.log(`Replaced: ${beforeCount - afterCount} instances`);

console.log('Writing file...');
writeFileSync(filePath, content, 'utf8');

console.log('✅ Done!');
