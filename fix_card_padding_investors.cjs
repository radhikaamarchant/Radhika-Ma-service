const fs = require('fs');

let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

content = content.replace(
  '<div className="flex flex-col flex-1 pl-1 md:pl-2">',
  '<div className="flex flex-col flex-1">'
);

fs.writeFileSync('src/pages/Investors.tsx', content);
console.log('Fixed card padding in Investors');
