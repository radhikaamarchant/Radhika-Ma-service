import fs from 'fs';
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');
code = code.replace(/i\.\(name \|\| ""\)\.toLowerCase\(\)/g, '(i.name || "").toLowerCase()');
code = code.replace(/investor\.\(name \|\| ""\)\.toLowerCase\(\)/g, '(investor.name || "").toLowerCase()');
fs.writeFileSync('src/pages/Investors.tsx', code);
