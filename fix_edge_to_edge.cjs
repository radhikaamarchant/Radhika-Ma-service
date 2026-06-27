const fs = require('fs');

const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/DataAnalysis.tsx',
  'src/pages/Businesses.tsx',
  'src/pages/Investors.tsx',
  'src/pages/Investments.tsx',
  'src/pages/Banking.tsx',
  'src/pages/MyPnL.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Headers: find flex flex-col md:flex-row justify-between and add px-4 md:px-0
    content = content.replace(/className="flex flex-col md:flex-row justify-between/g, 'className="px-4 md:px-0 flex flex-col md:flex-row justify-between');
    content = content.replace(/px-4 md:px-0 px-4 md:px-0/g, 'px-4 md:px-0');

    // Cards: edge-to-edge
    content = content.replace(/bg-white border border-kite-border rounded-sm/g, 'bg-white border-y border-x-0 md:border-x border-kite-border rounded-none md:rounded-sm');
    content = content.replace(/bg-white p-1\.5 md:p-3 rounded-sm border border-kite-border/g, 'bg-white p-1.5 md:p-3 rounded-none md:rounded-sm border-y border-x-0 md:border-x border-kite-border');
    content = content.replace(/w-full bg-white p-2 md:p-4 rounded-sm border border-kite-border/g, 'w-full bg-white p-2 md:p-4 rounded-none md:rounded-sm border-y border-x-0 md:border-x border-kite-border');
    
    // Ensure titles without the flex flex-col md:flex-row justify-between also get padding
    content = content.replace(/<h2 className="text-\[15px\] md:text-xl/g, '<h2 className="px-4 md:px-0 text-[15px] md:text-xl');
    content = content.replace(/px-4 md:px-0 px-4 md:px-0/g, 'px-4 md:px-0');

    fs.writeFileSync(file, content);
  }
}
console.log('Fixed edge-to-edge styling');
