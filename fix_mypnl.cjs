const fs = require('fs');
let content = fs.readFileSync('src/pages/MyPnL.tsx', 'utf8');

content = content.replace(/bg-white rounded-sm border border-kite-border/g, 'bg-white rounded-none md:rounded-sm border-y border-x-0 md:border-x border-kite-border');

fs.writeFileSync('src/pages/MyPnL.tsx', content);
console.log('Fixed MyPnL');
