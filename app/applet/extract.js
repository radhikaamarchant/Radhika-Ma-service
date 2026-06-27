import fs from 'fs';
const code = fs.readFileSync('src/pages/Investments.tsx', 'utf8');
const start = code.indexOf('{selectedInvestment &&');
const end = code.indexOf('</AnimatePresence>', start) + 18;
const modalCode = code.substring(start, end);
fs.writeFileSync('modal.tsx', modalCode);
console.log('Saved to modal.tsx, length:', modalCode.length);
