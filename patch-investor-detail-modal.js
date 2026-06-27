import fs from 'fs';

let code = fs.readFileSync('src/components/InvestorDetail.tsx', 'utf8');

// 1. Import LivePortfolioDetail
if (!code.includes('LivePortfolioDetail')) {
  code = code.replace(/import \{ formatINR \} from "\.\.\/utils\/mockData";/, 'import { formatINR } from "../utils/mockData";\nimport { LivePortfolioDetail } from "./LivePortfolioDetail";');
}

// 2. Add state selectedPortfolioInvestment
if (!code.includes('selectedPortfolioInvestment')) {
  code = code.replace(/const \[isEditingDetails, setIsEditingDetails\] = useState\(false\);/, 'const [isEditingDetails, setIsEditingDetails] = useState(false);\n  const [selectedPortfolioInvestment, setSelectedPortfolioInvestment] = useState<any>(null);');
}

// 3. Render LivePortfolioDetail at the end of the file
if (!code.includes('<LivePortfolioDetail')) {
  const modalInject = `
      {selectedPortfolioInvestment && (
        <LivePortfolioDetail
          selectedInvestment={selectedPortfolioInvestment}
          onClose={() => setSelectedPortfolioInvestment(null)}
        />
      )}
  `;
  code = code.replace(/<\/div>\n\s+<\/div>\n\s+<\/div>\n\s+\);\n\}/, '</div>\n        </div>\n      </div>\n' + modalInject + '\n    </div>\n  );\n}');
}

// 4. Update the onClick in the table row and div
// For desktop row:
code = code.replace(/<tr\s+key=\{inv\.id\}\s+className="hover:bg-kite-bg transition-colors"\s+>/g, 
  `<tr key={inv.id} className="hover:bg-kite-bg transition-colors cursor-pointer" onClick={() => { const bizInvs = investorInvestments.filter(i => i.businessId === inv.businessId); setSelectedPortfolioInvestment({ businessId: inv.businessId, investorId: investor.id, status: "active", timePeriodMonths: bizInvs[0].timePeriodMonths, interestRate: bizInvs[0].interestRate, startDate: bizInvs[0].startDate, endDate: bizInvs[0].endDate, amount: bizInvs.reduce((acc, i) => acc + i.amount, 0), groupedInvestmentsList: bizInvs }); }}>`);

// For mobile div:
code = code.replace(/<div key=\{inv\.id\} className="p-3 hover:bg-kite-bg">/g, 
  `<div key={inv.id} className="p-3 hover:bg-kite-bg cursor-pointer" onClick={() => { const bizInvs = investorInvestments.filter(i => i.businessId === inv.businessId); setSelectedPortfolioInvestment({ businessId: inv.businessId, investorId: investor.id, status: "active", timePeriodMonths: bizInvs[0].timePeriodMonths, interestRate: bizInvs[0].interestRate, startDate: bizInvs[0].startDate, endDate: bizInvs[0].endDate, amount: bizInvs.reduce((acc, i) => acc + i.amount, 0), groupedInvestmentsList: bizInvs }); }}>`);

// 5. Uppercase business names
code = code.replace(/business\?\.name \|\| "Unknown"/g, 'business?.name?.toUpperCase() || "UNKNOWN"');

fs.writeFileSync('src/components/InvestorDetail.tsx', code);
console.log('Patched InvestorDetail.tsx');
