import fs from 'fs';
import path from 'path';

function fixCommentsInDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixCommentsInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for // comment text ... followed by JS keywords
      const regex = /\/\/ ([a-zA-Z0-9 _'"-]+?)\s+(const |let |var |return |if |else |window\.|set[A-Z]|export |import |} |<)/g;
      let newContent = content.replace(regex, (match, p1, p2) => {
        return `\n// ${p1}\n${p2}`;
      });

      // Special cases
      newContent = newContent.replace(/\/\/ ([a-zA-Z0-9 _'"-]+?)\s+(?=\w+\s*=\s*)/g, '\n// $1\n');
      
      // Some known ones from output
      newContent = newContent.replace(/} \/\/ ([a-zA-Z0-9 _'"-]+?)\s+(const )/g, '}\n// $1\n$2');
      newContent = newContent.replace(/\/\/ 16px horizontal and vertical padding flexShrink/, '\n// 16px horizontal and vertical padding\nflexShrink');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

fixCommentsInDir('src/pages');
fixCommentsInDir('src/components');
