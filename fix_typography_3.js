import fs from 'fs';

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Make Investor and LTP even smaller
  code = code.replace(/<div className="flex items-center text-\[11px\] md:text-\[12px\]">/g, '<div className="flex items-center text-[10px] md:text-[11px]">');
  code = code.replace(/className={`text-\[11px\] md:text-\[12px\] font-medium/g, 'className={`text-[10px] md:text-[11px] font-medium');

  // Re-adjust Line 1 (Qty/Avg) to text-[11px] md:text-[12px] because the previous replace affected all
  // Wait, let's just make everything text-[11px] on mobile except Investor which should be specifically text-[10px] or we leave Qty/Avg as 11px and Investor as 10px.
  
  fs.writeFileSync(filePath, code);
}

// Actually let's use exact string replacement
let invCode = fs.readFileSync('src/pages/Investments.tsx', 'utf8');
invCode = invCode.replace(
  /<div className="flex items-center text-\[11px\] md:text-\[12px\]">\s*<span className="text-\[#9EA1A6\] font-normal mr-1">Investor:<\/span>/,
  '<div className="flex items-center text-[10px] md:text-[11px]">\n                     <span className="text-[#9EA1A6] font-normal mr-1">Investor:</span>'
);
fs.writeFileSync('src/pages/Investments.tsx', invCode);

let invsCode = fs.readFileSync('src/pages/Investors.tsx', 'utf8');
invsCode = invsCode.replace(
  /<div className="flex items-center text-\[11px\] md:text-\[12px\]">\s*<span className="text-\[#9EA1A6\] font-normal mr-1">Invested:<\/span>/g,
  '<div className="flex items-center text-[10px] md:text-[11px]">\n                                     <span className="text-[#9EA1A6] font-normal mr-1">Invested:</span>'
);
fs.writeFileSync('src/pages/Investors.tsx', invsCode);
