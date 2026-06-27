import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Enforce uppercase on business/investor names
  // This is tricky via regex because the variables might be inside JSX curly braces.
  // We can look for common patterns: {business.name}, {investor.name}, {selectedBusiness.name}, {investment.businessName}, {inv.name} etc.
  
  // Actually, doing a text-transform: uppercase via CSS is much safer if we can wrap them, but we can't easily.
  // Let's replace: {business.name} -> {business.name?.toUpperCase()}
  
  const replacements = [
    /\{business\.name\}/g,
    /\{investor\.name\}/g,
    /\{selectedBusiness\.name\}/g,
    /\{selectedInvestor\.name\}/g,
    /\{investment\.businessName\}/g,
    /\{inv\.name\}/g,
    /\{b\.name\}/g,
    /\{i\.name\}/g,
    /\{investor\.investorName\}/g,
    /\{inv\.investorName\}/g,
    /\{successData\.investorName\}/g,
    /\{successData\.businessName\}/g,
  ];

  for (const regex of replacements) {
    content = content.replace(regex, (match) => {
      const inner = match.substring(1, match.length - 1);
      return `{${inner}?.toUpperCase()}`;
    });
  }
  
  // Replace {business.name?.toUpperCase()?.toUpperCase()} to avoid duplicates if run multiple times
  content = content.replace(/\?\.toUpperCase\(\)\?\.toUpperCase\(\)/g, '?.toUpperCase()');

  // Replace colors
  // Light Mode Colors:
  // Background: #F7F8FA -> bg-kite-bg
  // Card Background: #FFFFFF -> bg-kite-surface
  // Secondary Background: #F2F3F5 -> bg-kite-alt
  // Border: #E5E7EB -> border-kite-border
  // Primary Text: #1F2937 -> text-kite-text
  // Secondary Text: #6B7280 -> text-kite-text-light
  // Muted Text: #9CA3AF -> text-kite-text-muted
  // Primary Blue Accent: #387ED1 -> text-kite-blue / bg-kite-blue
  
  // First, we shouldn't blindly replace all hex codes because they might be in arbitrary strings. But inside className="..." we can.
  // Actually, standardizing on utility classes is best.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

processDir('src/pages');
processDir('src/components');
