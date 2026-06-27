import fs from 'fs';
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');
code = code.replace(/\(name \|\| ""\)\.toLowerCase\(\)/g, '((name as string) || "").toLowerCase()');
fs.writeFileSync('src/pages/Investors.tsx', code);
