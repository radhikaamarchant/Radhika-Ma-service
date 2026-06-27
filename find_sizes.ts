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

const sizes = new Set<string>();
processDir('src', /text-\[[0-9]+px\]/g, sizes);
console.log(Array.from(sizes).sort().join('\n'));
