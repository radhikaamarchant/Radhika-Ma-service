import fs from 'fs';
import path from 'path';

const sizeMap: Record<string, string> = {
  'text-[9px]': 'text-[10px]',
  'text-[10px]': 'text-[10px]',
  'text-[11px]': 'text-[10px] md:text-[11px]',
  'text-[12px]': 'text-[11px] md:text-[12px]',
  'text-[13px]': 'text-[12px] md:text-[13px]',
  'text-[14px]': 'text-[13px] md:text-[14px]',
  'text-[15px]': 'text-[13px] md:text-[15px]',
  'text-[16px]': 'text-[14px] md:text-[16px]',
  'text-[18px]': 'text-[16px] md:text-[18px]',
  'text-[20px]': 'text-[18px] md:text-[20px]',
  'text-[24px]': 'text-[20px] md:text-[24px]',
  'text-xs': 'text-[11px] md:text-[12px]',
  'text-sm': 'text-[13px] md:text-[14px]',
  'text-base': 'text-[14px] md:text-[15px]',
  'text-lg': 'text-[16px] md:text-[18px]',
  'text-xl': 'text-[18px] md:text-[20px]',
  'text-2xl': 'text-[20px] md:text-[24px]',
  'text-3xl': 'text-[20px] md:text-[24px]',
};

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove all existing responsive text size classes
  // e.g. md:text-[14px], sm:text-sm, lg:text-lg, etc.
  content = content.replace(/\b(?:sm|md|lg|xl|2xl):text-\S+\b/g, '');

  // 2. Replace the base text size classes with our responsive pairs
  // We need to be careful to only match whole words
  for (const [oldClass, newClass] of Object.entries(sizeMap)) {
    // regex for word boundary, but note that `]` is a word boundary if followed by space, but inside it's tricky.
    // best is to use regex with negative lookahead/lookbehind
    const escaped = oldClass.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`(?<![-:])\\b${escaped}\\b`, 'g');
    content = content.replace(regex, newClass);
  }
  
  // Clean up double spaces caused by removing classes
  content = content.replace(/\s{2,}/g, ' ');

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
      processFile(fullPath);
    }
  }
}

processDir('src/pages');
processDir('src/components');
