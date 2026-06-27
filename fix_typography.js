import fs from 'fs';

function updateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Change Qty and Avg numbers to normal font-medium
  code = code.replace(/<span className="text-\[#222222\] font-medium">\{qty\}<\/span>/g, '<span className="text-[#444444] font-medium tracking-wide">{qty}</span>');
  code = code.replace(/<span className="text-\[#222222\] font-medium">\{formatINR\(avgPrice\)\.replace\("₹", ""\)\}<\/span>/g, '<span className="text-[#444444] font-medium tracking-wide">{formatINR(avgPrice).replace("₹", "")}</span>');
  code = code.replace(/<span className="text-\[#222222\] font-medium">\{avgPrice\.toFixed\(2\)\}<\/span>/g, '<span className="text-[#444444] font-medium tracking-wide">{avgPrice.toFixed(2)}</span>');
  
  // Make Business Name slightly smaller and font-medium
  code = code.replace(/<h3 className="text-\[#222222\] font-medium text-\[13px\] md:text-\[14px\] uppercase tracking-wide">/g, '<h3 className="text-[#444444] font-medium text-[13px] md:text-[14px] uppercase tracking-wide">');

  // Investor Name / Invested
  code = code.replace(/<span className="text-\[#222222\] font-medium uppercase">\{investor\?\.name\?\.toUpperCase\(\)\}<\/span>/g, '<span className="text-[#444444] font-medium uppercase tracking-wide">{investor?.name?.toUpperCase()}</span>');
  code = code.replace(/<span className="text-\[#222222\] font-medium uppercase">\{formatINR\(h\.investedAmount\)\.replace\("₹", ""\)\}<\/span>/g, '<span className="text-[#444444] font-medium uppercase tracking-wide">{formatINR(h.investedAmount).replace("₹", "")}</span>');
  code = code.replace(/<span className="text-\[#222222\] font-medium uppercase">\{formatINR\(p\.investedAmount\)\.replace\("₹", ""\)\}<\/span>/g, '<span className="text-[#444444] font-medium uppercase tracking-wide">{formatINR(p.investedAmount).replace("₹", "")}</span>');

  // LTP
  code = code.replace(/<span className="text-\[#222222\] font-medium">\{formatINR\(currentLTP\)\.replace\("₹", ""\)\}<\/span>/g, '<span className="text-[#444444] font-medium tracking-wide">{formatINR(currentLTP).replace("₹", "")}</span>');
  code = code.replace(/<span className="text-\[#222222\] font-medium">\{ltp\.toFixed\(2\)\}<\/span>/g, '<span className="text-[#444444] font-medium tracking-wide">{ltp.toFixed(2)}</span>');

  // Right-aligned Absolute P&L (was font-semibold, change to font-medium)
  code = code.replace(/font-semibold/g, 'font-medium');
  code = code.replace(/text-\[#222222\]/g, 'text-[#444444]');

  fs.writeFileSync(filePath, code);
  console.log(`Updated ${filePath}`);
}

updateFile('src/pages/Investments.tsx');
updateFile('src/pages/Investors.tsx');
