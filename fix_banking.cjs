const fs = require('fs');
let content = fs.readFileSync('src/pages/Banking.tsx', 'utf8');

content = content.replace(/bg-white border text-kite-text border-kite-border rounded-sm/g, 'bg-white border-y border-x-0 md:border text-kite-text border-kite-border rounded-none md:rounded-sm');

fs.writeFileSync('src/pages/Banking.tsx', content);
console.log('Fixed Banking');
