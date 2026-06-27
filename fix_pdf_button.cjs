const fs = require('fs');
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

code = code.replace(
  '<h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Preview PDF Document</h3>',
  '<button onClick={() => setPdfInvestor(pdfProfitSlip?.investor || selectedInvestor)} className="text-[13px] md:text-[14px] font-medium text-kite-text hover:text-kite-blue">Preview PDF Document</button>'
);

fs.writeFileSync('src/pages/Investors.tsx', code);
