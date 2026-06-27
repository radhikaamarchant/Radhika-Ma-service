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
    content = content.replace(/<h2 className="px-4 md:px-0 text-\[15px\]/g, '<h2 className="text-[15px]');
    content = content.replace(/<p className="px-4 md:px-0 text-xs/g, '<p className="text-xs');
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed h2');
