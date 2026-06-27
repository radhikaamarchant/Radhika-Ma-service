const fs = require('fs');

let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

// Add useRef, useEffect if missing
if (!content.includes('useRef')) {
  content = content.replace(
    /import React, \{ useState \} from 'react';/,
    "import React, { useState, useRef, useEffect } from 'react';"
  );
}

// Add state for search
if (!content.includes('isSearchExpanded')) {
  content = content.replace(
    /const \[searchTerm, setSearchTerm\] = useState\(''\);/,
    `const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);`
  );
}

// Replace Header and Button
const oldHeaderRegex = /<div className="flex justify-between items-end">\s*<div>\s*<h2 className="text-\[15px\] md:text-xl font-normal text-kite-text tracking-tight uppercase">My Investors<\/h2>\s*<\/div>\s*<button onClick=\{startAddInvestor\}\s*className="bg-kite-blue hover:opacity-90 text-white px-3 py-1\.5 md:px-4 md:py-2 rounded-sm font-medium flex items-center space-x-1 md:space-x-2 transition-colors text-xs md:text-sm"\s*>\s*<Plus className="w-3\.5 h-3\.5 md:w-4 md:h-4" \/>\s*<span>New Investor<\/span>\s*<\/button>\s*<\/div>/;

// Fallback regex if font-medium is still there
const oldHeaderRegex2 = /<div className="flex justify-between items-end">\s*<div>\s*<h2 className="text-\[15px\] md:text-xl font-medium text-kite-text tracking-tight uppercase">My Investors<\/h2>\s*<\/div>\s*<button onClick=\{startAddInvestor\}\s*className="bg-kite-blue hover:opacity-90 text-white px-3 py-1\.5 md:px-4 md:py-2 rounded-sm font-medium flex items-center space-x-1 md:space-x-2 transition-colors text-xs md:text-sm"\s*>\s*<Plus className="w-3\.5 h-3\.5 md:w-4 md:h-4" \/>\s*<span>New Investor<\/span>\s*<\/button>\s*<\/div>/;

const newHeader = `<div className="flex justify-between items-end">
  <div className="hidden md:block">
    <h2 className="text-[15px] md:text-xl font-normal text-kite-text tracking-tight uppercase">My Investors</h2>
  </div>
  <button onClick={startAddInvestor}
    className="bg-kite-blue hover:opacity-90 text-white px-3 md:px-4 h-[36px] rounded font-medium flex items-center justify-center space-x-1 md:space-x-2 transition-colors text-[13px] md:text-sm shadow-sm md:ml-auto"
  >
    <span>New Investors</span>
  </button>
</div>`;

content = content.replace(oldHeaderRegex, newHeader);
content = content.replace(oldHeaderRegex2, newHeader);


// Replace Search UI
const oldSearchRegex = /<div className="p-2 sm:p-4 border-b border-kite-border flex items-center bg-kite-bg">\s*<Search  className="w-3\.5 h-3\.5 md:w-4 md:h-4 text-kite-text-light mr-2" \/>\s*<input type="text" placeholder="Search investor by name, ID, mobile number\.\.\." className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder-gray-400"\s*value=\{searchTerm\}\s*onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\s*\/>\s*<\/div>/;

const newSearchBox = `<div className="border-b border-kite-border bg-white flex items-center min-h-[44px] relative overflow-hidden">
    <div className={\`absolute right-0 flex justify-end w-full px-2 transition-all duration-300 \${isSearchExpanded ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0'}\`}>
      <button onClick={() => setIsSearchExpanded(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
        <Search className="w-[18px] h-[18px] text-kite-text" />
      </button>
    </div>
    
    <div className={\`flex items-center w-full px-2 transition-all duration-300 \${isSearchExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4 absolute'}\`}>
      <button onClick={() => { setIsSearchExpanded(false); setSearchTerm(''); }} className="p-2 hover:bg-gray-50 rounded-full mr-1 transition-colors flex-shrink-0">
        <ArrowLeft className="w-[18px] h-[18px] text-kite-text" />
      </button>
      <input 
        ref={searchInputRef}
        type="text" 
        placeholder="Search eg: infy, reliance" 
        className="bg-transparent border-none outline-none w-full text-sm text-kite-text placeholder-gray-400 font-sans"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button onClick={() => setSearchTerm('')} className="p-2 text-gray-400 hover:text-kite-text transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>`;

content = content.replace(oldSearchRegex, newSearchBox);

// Replace card layout
const oldCardRegex = /<div className="flex flex-col">\s*<div className="flex items-center space-x-1\.5 mb-0\.5">\s*<span className="font-medium text-kite-text text-sm md:text-base group-hover:text-kite-blue transition-colors">\{investor\.name\}<\/span>\s*\{investor\.id === 'admin_investor' && <BadgeCheck className="w-3\.5 h-3\.5 text-white fill-blue-500 flex-shrink-0" \/>\}\s*<\/div>\s*<span className="font-mono text-\[11px\] md:text-xs text-kite-text-light">#\{investor\.investorId\}<\/span>\s*<\/div>/;

const newCard = `<div className="flex flex-col flex-1 pl-1 md:pl-2">
      <div className="flex items-center space-x-1.5 mb-1">
        <span className="font-normal text-kite-text text-[13px] md:text-sm group-hover:text-kite-blue transition-colors uppercase leading-tight tracking-wide">{investor.name}</span>
        {investor.id === 'admin_investor' && <BadgeCheck className="w-3.5 h-3.5 text-white fill-blue-500 flex-shrink-0" />}
      </div>
      <span className="font-sans text-[10px] md:text-[11px] text-kite-text-light leading-tight">{investor.investorId}</span>
    </div>`;

content = content.replace(oldCardRegex, newCard);

// Also remove font-medium from amount and return percentages
content = content.replace(
  '<span className="font-medium text-kite-text text-sm">{formatINR(totalAmountInvested)}</span>',
  '<span className="font-normal text-kite-text text-sm">{formatINR(totalAmountInvested)}</span>'
);

content = content.replace(
  /<span className=\{`text-\[11px\] font-medium mt-0\.5 \$\{returnPercentage >= 0 \? 'text-kite-green' : 'text-kite-red'\}`\}>/g,
  '<span className={`text-[11px] font-normal mt-0.5 ${returnPercentage >= 0 ? \'text-kite-green\' : \'text-kite-red\'}`}>'
);

fs.writeFileSync('src/pages/Investors.tsx', content);
console.log('Fixed Investors UI');
