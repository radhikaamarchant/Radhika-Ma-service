const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace(/border border-kite-border hover:border-kite-blue rounded-sm/g, 'border-y border-x-0 md:border-x border-kite-border hover:border-kite-blue rounded-none md:rounded-sm');

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Fixed dashboard cards');
