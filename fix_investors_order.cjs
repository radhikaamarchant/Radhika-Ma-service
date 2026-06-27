const fs = require('fs');

let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

const regex = /<div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto md:justify-end gap-2 md:gap-4">[\s\S]*?<\/div>\n    <\/div>\n  <\/div>\n  \n  <div className=\{`flex items-center w-full/g;

const replacement = `<div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto md:justify-end gap-2 md:gap-4">
      {/* Action Button */}
      <div className="w-full md:w-auto pt-1 md:pt-0">
        <button onClick={startAddInvestor}
          className="bg-kite-blue hover:opacity-90 text-white px-4 h-[36px] rounded font-normal flex items-center justify-center transition-colors text-[13px] md:text-sm shadow-sm w-max md:w-auto"
        >
          <span>New Investors</span>
        </button>
      </div>

      {/* Search Icon */}
      <div className="w-full md:w-auto flex justify-start md:justify-end pb-2 md:pb-0">
        <button onClick={() => setIsSearchExpanded(true)} className="-ml-1 md:ml-0 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 flex items-center gap-2">
          <Search className="w-[18px] h-[18px] text-kite-blue" />
        </button>
      </div>
    </div>
  </div>
  
  <div className={\`flex items-center w-full`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/pages/Investors.tsx', content);
