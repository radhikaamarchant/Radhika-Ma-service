const fs = require('fs');
let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

// Fix Open account
content = content.replace(/<button className="font-medium">Open account<\/h3>/g, '<h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Open account</h3>');

// Fix Link Bank Account
content = content.replace(/<button className="font-medium">Link Bank Account<\/h3>/g, '<h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Link Bank Account</h3>');

// Fix Preview PDF Document
content = content.replace(/<button className="font-medium">Preview PDF Document<\/h3>/g, '<h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Preview PDF Document</h3>');

fs.writeFileSync('src/pages/Investors.tsx', content);
