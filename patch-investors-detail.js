import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

// 1. Add import for LivePortfolioDetail
if (!code.includes('LivePortfolioDetail')) {
  code = code.replace(/import \{ SwipeButton \} from "\.\.\/components\/SwipeButton";/, 'import { SwipeButton } from "../components/SwipeButton";\nimport { LivePortfolioDetail } from "../components/LivePortfolioDetail";');
}

// 2. Add selectedPortfolioInvestment state
if (!code.includes('selectedPortfolioInvestment')) {
  code = code.replace(/const \[selectedInvestments, setSelectedInvestments\] = useState<Investment\[\]>\(\n\s+\[\],\n\s+\);/, 'const [selectedInvestments, setSelectedInvestments] = useState<Investment[]>([]);\n  const [selectedPortfolioInvestment, setSelectedPortfolioInvestment] = useState<any>(null);');
}

// 3. Render LivePortfolioDetail at the end of the file, just before </main> or inside it.
// Let's inject it right after the viewMode === "withdraw-list" block ends, or just at the end of the JSX return.
// But wait, it's a fixed modal, so we can just put it anywhere inside the return.
if (!code.includes('<LivePortfolioDetail')) {
  const modalInject = `
      {selectedPortfolioInvestment && (
        <LivePortfolioDetail
          selectedInvestment={selectedPortfolioInvestment}
          onClose={() => setSelectedPortfolioInvestment(null)}
        />
      )}
  `;
  code = code.replace(/<\/AnimatePresence>\n\s+<\/div>\n\s+<\/main>/, '</AnimatePresence>\n' + modalInject + '\n      </div>\n    </main>');
}

// 4. Update the onClick in viewMode === "withdraw-list" to set selectedPortfolioInvestment instead of handleCreditInvestorClick
// For desktop holdings row:
code = code.replace(/<button\s+onClick=\{\(\) => handleCreditInvestorClick\(h\.invs\)\}\s+className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1\.5 rounded-sm text-\[12px\] opacity-0 group-hover:opacity-100 transition-opacity font-normal"\s+>\s+Sell\s+<\/button>/g, 
  `<button onClick={(e) => { e.stopPropagation(); setSelectedPortfolioInvestment({ businessId: h.bizId, investorId: selectedInvestor.id, status: "active", timePeriodMonths: h.invs[0].timePeriodMonths, interestRate: h.invs[0].interestRate, startDate: h.invs[0].startDate, endDate: h.invs[0].endDate, amount: h.investedAmount, groupedInvestmentsList: h.invs }); }} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-sm text-[12px] opacity-0 group-hover:opacity-100 transition-opacity font-normal">Sell</button>`);

// For desktop positions row (completed):
// wait, if status is completed, the modal can also handle it! 
code = code.replace(/<button\s+onClick=\{\(\) => handleCreditInvestorClick\(p\.invs\)\}\s+className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1\.5 rounded-sm text-\[12px\] opacity-0 group-hover:opacity-100 transition-opacity font-normal"\s+>\s+View\s+<\/button>/g, 
  `<button onClick={(e) => { e.stopPropagation(); setSelectedPortfolioInvestment({ businessId: p.bizId, investorId: selectedInvestor.id, status: "completed", timePeriodMonths: p.invs[0].timePeriodMonths, interestRate: p.invs[0].interestRate, startDate: p.invs[0].startDate, endDate: p.invs[0].endDate, amount: p.investedAmount, groupedInvestmentsList: p.invs }); }} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-sm text-[12px] opacity-0 group-hover:opacity-100 transition-opacity font-normal">View</button>`);

// For mobile holdings:
code = code.replace(/<button\s+onClick=\{\(\) => handleCreditInvestorClick\(h\.invs\)\}\s+className="px-4 py-1\.5 bg-blue-50 text-blue-600 rounded text-\[13px\] font-medium w-full mt-3"\s+>\s+SELL\s+<\/button>/g,
  `<button onClick={(e) => { e.stopPropagation(); setSelectedPortfolioInvestment({ businessId: h.bizId, investorId: selectedInvestor.id, status: "active", timePeriodMonths: h.invs[0].timePeriodMonths, interestRate: h.invs[0].interestRate, startDate: h.invs[0].startDate, endDate: h.invs[0].endDate, amount: h.investedAmount, groupedInvestmentsList: h.invs }); }} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded text-[13px] font-medium w-full mt-3">SELL</button>`);

// For mobile positions:
code = code.replace(/<button\s+onClick=\{\(\) => handleCreditInvestorClick\(p\.invs\)\}\s+className="px-4 py-1\.5 bg-blue-50 text-blue-600 rounded text-\[13px\] font-medium w-full mt-3"\s+>\s+VIEW\s+<\/button>/g,
  `<button onClick={(e) => { e.stopPropagation(); setSelectedPortfolioInvestment({ businessId: p.bizId, investorId: selectedInvestor.id, status: "completed", timePeriodMonths: p.invs[0].timePeriodMonths, interestRate: p.invs[0].interestRate, startDate: p.invs[0].startDate, endDate: p.invs[0].endDate, amount: p.investedAmount, groupedInvestmentsList: p.invs }); }} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded text-[13px] font-medium w-full mt-3">VIEW</button>`);

// 5. Uppercase business names in Investors.tsx
code = code.replace(/h\.business\?\.name \|\| "Unknown"/g, 'h.business?.name?.toUpperCase() || "UNKNOWN"');
code = code.replace(/p\.business\?\.name \|\| "Unknown"/g, 'p.business?.name?.toUpperCase() || "UNKNOWN"');
code = code.replace(/business\?\.name \|\| "Unknown Business"/g, 'business?.name?.toUpperCase() || "UNKNOWN"');

// 6. Make the whole row clickable? The prompt says "When clicking on a specific business in this investor's list, it must open a 'Live Portfolio Detail' view"
// Let's add onClick to the <tr> and <div> for holdings and positions.
code = code.replace(/<tr key=\{i\} className="hover:bg-gray-50\/50 transition-colors group">/g, 
  `<tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedPortfolioInvestment({ businessId: h.bizId, investorId: selectedInvestor.id, status: "active", timePeriodMonths: h.invs[0].timePeriodMonths, interestRate: h.invs[0].interestRate, startDate: h.invs[0].startDate, endDate: h.invs[0].endDate, amount: h.investedAmount, groupedInvestmentsList: h.invs })}>`);

code = code.replace(/<tr key=\{i\} className="hover:bg-gray-50\/50 transition-colors">/g, 
  `<tr key={i} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedPortfolioInvestment({ businessId: p.bizId, investorId: selectedInvestor.id, status: "completed", timePeriodMonths: p.invs[0].timePeriodMonths, interestRate: p.invs[0].interestRate, startDate: p.invs[0].startDate, endDate: p.invs[0].endDate, amount: p.investedAmount, groupedInvestmentsList: p.invs })}>`);

code = code.replace(/<div key=\{i\} className="p-4 bg-white">/g, 
  `<div key={i} className="p-4 bg-white cursor-pointer" onClick={() => { const item = h || p; const status = h ? 'active' : 'completed'; setSelectedPortfolioInvestment({ businessId: item.bizId, investorId: selectedInvestor.id, status: status, timePeriodMonths: item.invs[0].timePeriodMonths, interestRate: item.invs[0].interestRate, startDate: item.invs[0].startDate, endDate: item.invs[0].endDate, amount: item.investedAmount, groupedInvestmentsList: item.invs }); }}>`);


fs.writeFileSync('src/pages/Investors.tsx', code);
console.log('Patched Investors.tsx');
