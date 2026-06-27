import fs from 'fs';

let code = fs.readFileSync('src/components/LivePortfolioDetail.tsx', 'utf8');

// Replace the BUY onClick contents
code = code.replace(/onClick=\{\(\) => \{\s+setShowTradeOptions\(false\);\s+onBuyClick[\s\S]*?setShowAddForm\(true\);\s+\}\}/, 'onClick={() => { setShowTradeOptions(false); if(onBuyClick) onBuyClick(selectedInvestment); }}');

// Replace the missing successAnimation states
code = code.replace(/\{showSuccessAnimation && successData && \([\s\S]*?\)\}/, '');
code = code.replace(/<AnimatePresence>\s*\{""\}\s*<\/AnimatePresence>/, '');


fs.writeFileSync('src/components/LivePortfolioDetail.tsx', code);
