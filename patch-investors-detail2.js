import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

// Reverse the buggy replacement if any
code = code.replace(/<div key=\{i\} className="p-4 bg-white cursor-pointer" onClick=\{\(\) => \{ const item = h \|\| p;.*?\}\}>/g, '<div key={i} className="p-4 bg-white">');

code = code.replace(/<div className="block md:hidden divide-y divide-gray-100">\s*\{holdings\.map\(\(h, i\) => \(\s*<div key=\{i\} className="p-4 bg-white">/g, 
  `<div className="block md:hidden divide-y divide-gray-100">
            {holdings.map((h, i) => (
              <div key={i} className="p-4 bg-white cursor-pointer" onClick={() => setSelectedPortfolioInvestment({ businessId: h.bizId, investorId: selectedInvestor.id, status: "active", timePeriodMonths: h.invs[0].timePeriodMonths, interestRate: h.invs[0].interestRate, startDate: h.invs[0].startDate, endDate: h.invs[0].endDate, amount: h.investedAmount, groupedInvestmentsList: h.invs })}>`);

code = code.replace(/<div className="block md:hidden divide-y divide-gray-100">\s*\{positions\.map\(\(p, i\) => \(\s*<div key=\{i\} className="p-4 bg-white">/g, 
  `<div className="block md:hidden divide-y divide-gray-100">
            {positions.map((p, i) => (
              <div key={i} className="p-4 bg-white cursor-pointer" onClick={() => setSelectedPortfolioInvestment({ businessId: p.bizId, investorId: selectedInvestor.id, status: "completed", timePeriodMonths: p.invs[0].timePeriodMonths, interestRate: p.invs[0].interestRate, startDate: p.invs[0].startDate, endDate: p.invs[0].endDate, amount: p.investedAmount, groupedInvestmentsList: p.invs })}>`);

fs.writeFileSync('src/pages/Investors.tsx', code);
console.log('Fixed buggy replacement');
