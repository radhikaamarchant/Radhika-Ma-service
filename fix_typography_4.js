import fs from 'fs';

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Change all remaining font-medium to font-normal in these specific text blocks
  code = code.replace(/className={`text-\[11px\] md:text-\[12px\] font-medium/g, 'className={`text-[11px] md:text-[12px] font-normal');
  code = code.replace(/className={`text-\[10px\] md:text-\[11px\] font-medium/g, 'className={`text-[10px] md:text-[11px] font-normal');

  // Also adjust Investor Name specifically to be text-[10px] md:text-[11px] as requested
  // Right now we have:
  // <span className="text-[#444444] font-normal uppercase tracking-wide">{investor?.name?.toUpperCase()}</span>
  // Let's add the size classes there explicitly, or in the parent div. The parent div was modified to text-[10px] md:text-[11px] earlier.
  
  fs.writeFileSync(filePath, code);
  console.log(`Updated ${filePath}`);
}

updateFile('src/pages/Investments.tsx');
updateFile('src/pages/Investors.tsx');
