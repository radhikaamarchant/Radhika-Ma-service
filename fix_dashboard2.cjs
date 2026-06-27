const fs = require('fs');

const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<div className="px-4 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4">/g, '<div className="px-4 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-4">');
content = content.replace(/<h2 className="px-4 md:px-0 text-\[15px\]/g, '<h2 className="text-[15px]');

fs.writeFileSync(file, content);
console.log('Fixed Dashboard');
