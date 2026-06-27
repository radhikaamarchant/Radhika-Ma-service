const fs = require('fs');
let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

content = content.replace(/border border-gray-100 rounded/g, 'border-y border-x-0 md:border-x border-gray-100 rounded-none md:rounded');

fs.writeFileSync('src/pages/Investors.tsx', content);
console.log('Fixed investors forms');
