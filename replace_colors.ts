import fs from 'fs';
import path from 'path';

const colorReplacements: Record<string, string> = {
  // text colors
  'text-[#212529]': 'text-kite-text',
  'text-[#333333]': 'text-kite-text',
  'text-[#424242]': 'text-kite-text',
  'text-[#444444]': 'text-kite-text',
  'text-[#444]': 'text-kite-text',
  'text-[#6B7280]': 'text-kite-text-light',
  'text-[#6c757d]': 'text-kite-text-light',
  'text-[#757575]': 'text-kite-text-light',
  'text-[#9b9b9b]': 'text-kite-text-muted',
  'text-[#387ED1]': 'text-kite-blue',
  'text-[#387ed1]': 'text-kite-blue',
  'text-[#2d66a9]': 'text-kite-blue-dark',
  'text-[#4184f3]': 'text-kite-blue',
  
  // bg colors
  'bg-[#F9F9F9]': 'bg-kite-bg',
  'bg-[#f8f9fa]': 'bg-kite-bg',
  'bg-[#fafafa]': 'bg-kite-bg',
  'bg-[#f4f4f4]': 'bg-kite-bg',
  'bg-[#e9ecef]': 'bg-kite-border',
  'bg-[#E5E7EB]': 'bg-kite-border',
  'bg-[#387ED1]': 'bg-kite-blue',
  'bg-[#387ed1]': 'bg-kite-blue',
  'bg-[#2a63a8]': 'bg-kite-blue-dark',
  'bg-[#2b65a8]': 'bg-kite-blue-dark',
  'bg-[#326cd1]': 'bg-kite-blue-dark',
  'bg-[#4184f3]': 'bg-kite-blue',
  
  // borders
  'border-[#E5E7EB]': 'border-kite-border',
  'border-[#e5e7eb]': 'border-kite-border',
  'border-[#F0F0F0]': 'border-kite-border',
  'border-[#e9ecef]': 'border-kite-border',
  'border-[#F9F9F9]': 'border-kite-bg',
  'border-[#387ed1]': 'border-kite-blue',
};

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [oldClass, newClass] of Object.entries(colorReplacements)) {
    // replace using global regex, escaping the brackets
    const escapedOld = oldClass.replace(/[\[\]\#]/g, '\\$&');
    const regex = new RegExp(escapedOld, 'g');
    content = content.replace(regex, newClass);
  }

  // Also replace inline styles like color: '#424242'
  content = content.replace(/color:\s*['"]#(?:444444|424242|333333|212529|444)['"]/g, 'color: "var(--text-color)"');
  content = content.replace(/color:\s*['"]#(?:6B7280|6c757d|757575)['"]/g, 'color: "var(--text-light-color)"');
  content = content.replace(/color:\s*['"]#(?:9b9b9b|ccc)['"]/g, 'color: "var(--text-muted-color)"');
  content = content.replace(/color:\s*['"]#(?:387ED1|387ed1)['"]/g, 'color: "var(--color-kite-blue)"');

  // Replace font weights
  // "Do not use Bold (700) unless absolutely necessary." -> font-bold to font-semibold
  // Actually, some places might need bold. The prompt says "unless absolutely necessary". I will map font-bold to font-semibold just to be safe.
  content = content.replace(/font-bold/g, 'font-semibold');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDir('src/pages');
processDir('src/components');
