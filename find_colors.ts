import fs from 'fs';
import path from 'path';

function processDir(dir: string, regex: RegExp, results: Set<string>) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath, regex, results);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(regex);
      if (matches) {
        matches.forEach(m => results.add(m));
      }
    }
  }
}

const colors = new Set<string>();
processDir('src', /(?:text|bg|border)-\[#[0-9a-fA-F]+\]/g, colors);
console.log(Array.from(colors).sort().join('\n'));
