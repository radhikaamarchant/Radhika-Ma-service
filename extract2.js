import fs from 'fs';
const code = fs.readFileSync('src/pages/Investments.tsx', 'utf8');
const start = code.indexOf('{selectedInvestment &&');
const end = code.indexOf('})()}', start) + 5;
fs.writeFileSync('modal.tsx', code.substring(start, end));
