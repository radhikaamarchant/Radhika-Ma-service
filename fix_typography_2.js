import fs from 'fs';

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Change all font-medium to font-normal within our blocks, specifically text-[#444444] spans
  code = code.replace(/<span className="text-\[#444444\] font-medium tracking-wide">/g, '<span className="text-[#444444] font-normal tracking-wide">');
  code = code.replace(/<span className="text-\[#444444\] font-medium uppercase tracking-wide">/g, '<span className="text-[#444444] font-normal uppercase tracking-wide">');
  
  // Make sizes a bit smaller, 12px/13px to 11px/12px for Line 1 and 3
  code = code.replace(/<div className="flex items-center text-\[12px\] md:text-\[13px\]">/g, '<div className="flex items-center text-[11px] md:text-[12px]">');
  code = code.replace(/className={`text-\[12px\] md:text-\[13px\] font-medium/g, 'className={`text-[11px] md:text-[12px] font-medium');
  code = code.replace(/className={`text-\[12px\] md:text-\[13px\] font-semibold/g, 'className={`text-[11px] md:text-[12px] font-medium');

  // Also replace for business name
  code = code.replace(/<h3 className="text-\[#444444\] font-medium text-\[13px\] md:text-\[14px\] uppercase tracking-wide">/g, '<h3 className="text-[#444444] font-normal text-[12px] md:text-[13px] uppercase tracking-wide">');

  // PnL values right align
  code = code.replace(/className={`text-\[13px\] md:text-\[14px\] font-medium/g, 'className={`text-[13px] md:text-[14px] font-normal');
  code = code.replace(/<div className="text-\[13px\] md:text-\[14px\] font-medium text-\[#444444\]">/g, '<div className="text-[13px] md:text-[14px] font-normal text-[#444444]">');

  fs.writeFileSync(filePath, code);
  console.log(`Updated ${filePath}`);
}

updateFile('src/pages/Investments.tsx');
updateFile('src/pages/Investors.tsx');
