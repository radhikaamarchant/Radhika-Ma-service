import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

code = code.replace(/name\s*\.toLowerCase\(\)/g, '(name || "").toLowerCase()');
code = code.replace(/invs\.forEach\(\(inv\) => \{/g, '(invs as Investment[]).forEach((inv: any) => {');

fs.writeFileSync('src/pages/Investors.tsx', code);
console.log('Fixed typescript errors part 2');
