import fs from 'fs';

let content = fs.readFileSync('src/pages/Banking.tsx', 'utf8');
content = content.replace(
  /<p className="font-medium text-kite-text text-\[11px\] md:text-\[12px\] > <p className="font-mono/g,
  '<p className="font-medium text-kite-text text-[11px] md:text-[12px]">{bankDetails.bankName}</p> <p className="font-mono'
);
fs.writeFileSync('src/pages/Banking.tsx', content, 'utf8');
