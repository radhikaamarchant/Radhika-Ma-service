import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

code = code.replace(/const groupedActive = activeInvs\.reduce\(\(acc, inv\) => \{\s+if \(!acc\[inv\.businessId\]\) acc\[inv\.businessId\] = \[\];\s+acc\[inv\.businessId\]\.push\(inv\);\s+return acc;\s+\}, \{\}\);/g, 
  `const groupedActive = activeInvs.reduce((acc, inv) => {\n              if (!acc[inv.businessId]) acc[inv.businessId] = [];\n              acc[inv.businessId].push(inv);\n              return acc;\n            }, {} as Record<string, Investment[]>);`);

code = code.replace(/const groupedCompleted = completedInvs\.reduce\(\(acc, inv\) => \{\s+if \(!acc\[inv\.businessId\]\) acc\[inv\.businessId\] = \[\];\s+acc\[inv\.businessId\]\.push\(inv\);\s+return acc;\s+\}, \{\}\);/g, 
  `const groupedCompleted = completedInvs.reduce((acc, inv) => {\n              if (!acc[inv.businessId]) acc[inv.businessId] = [];\n              acc[inv.businessId].push(inv);\n              return acc;\n            }, {} as Record<string, Investment[]>);`);

code = code.replace(/\} = calculateLiveProfit\(\s+invs,/g, '} = calculateLiveProfit(\n                  invs as Investment[],');

code = code.replace(/handleCreditInvestorClick\(h\.invs\)/g, 'handleCreditInvestorClick(h.invs as Investment[])');
code = code.replace(/handleCreditInvestorClick\(p\.invs\)/g, 'handleCreditInvestorClick(p.invs as Investment[])');
code = code.replace(/item\.invs\[0\]/g, '(item.invs as Investment[])[0]');
code = code.replace(/item\.invs/g, '(item.invs as Investment[])');


// Also fix line 693: src/pages/Investors.tsx(693,30): error TS2339: Property 'toLowerCase' does not exist on type 'unknown'.
code = code.replace(/const matchesSearch = Object\.values\(investor\)\.some\(\(val\) =>\s+val\?\.toString\(\)\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\),\s+\);/g, 
  `const matchesSearch = Object.values(investor).some((val) =>\n      String(val).toLowerCase().includes(searchTerm.toLowerCase())\n    );`);

fs.writeFileSync('src/pages/Investors.tsx', code);
console.log('Fixed typescript errors in Investors.tsx');
