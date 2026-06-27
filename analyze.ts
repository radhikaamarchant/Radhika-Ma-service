import fs from 'fs';
const content = fs.readFileSync('src/pages/Investments.tsx', 'utf8');
const matches = content.match(/text-\S+/g) || [];
const counts: any = {};
for (const m of matches) {
  counts[m] = (counts[m] || 0) + 1;
}
const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
console.log(sorted.slice(0, 30).map(x => x.join(': ')).join('\n'));
