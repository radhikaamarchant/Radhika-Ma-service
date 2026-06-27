const fs = require('fs');

let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

// Replace the header div with the new layout
const oldHeaderRegex = /<div className="px-[^>]*flex justify-between items-end relative min-h-\[36px\] mb-2 md:mb-0">[\s\S]*?<\/div>\n\s*<\/div>/;

const newHeader = `<div className="px-0 flex flex-col md:flex-row md:justify-between md:items-end relative mb-3 md:mb-0">
  <div className={\`flex flex-col md:flex-row w-full items-start md:items-center justify-between transition-all duration-300 gap-3 md:gap-0 \${isSearchExpanded ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}\`}>
    <div className="hidden md:block">
      <h2 className="text-[15px] md:text-xl font-normal text-kite-text tracking-tight uppercase">My Investors</h2>
    </div>
    
    <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto md:justify-end gap-3 md:gap-4">
      {/* Search Icon (Top on mobile, right on desktop) */}
      <div className="w-full md:w-auto px-4 md:px-0 flex justify-start md:justify-end md:order-2 border-b border-kite-border/50 md:border-none pb-2 md:pb-0">
        <button onClick={() => setIsSearchExpanded(true)} className="p-1 -ml-1 md:p-2 md:ml-0 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 flex items-center gap-2">
          <Search className="w-[18px] h-[18px] text-kite-blue" />
        </button>
      </div>
      
      {/* Action Button (Bottom on mobile, left of search on desktop) */}
      <div className="px-4 md:px-0 w-full md:w-auto md:order-1">
        <button onClick={startAddInvestor}
          className="bg-kite-blue hover:opacity-90 text-white px-4 h-[36px] rounded font-normal flex items-center justify-center transition-colors text-[13px] md:text-sm shadow-sm w-max md:w-auto"
        >
          <span>New Investors</span>
        </button>
      </div>
    </div>
  </div>
  
  <div className={\`flex items-center w-full transition-all duration-300 bg-white md:bg-transparent rounded-sm px-4 md:px-0 \${isSearchExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-4 absolute'}\`}>
    <button onClick={() => { setIsSearchExpanded(false); setSearchTerm(''); }} className="p-2 hover:bg-gray-100 rounded-full mr-1 transition-colors flex-shrink-0">
      <ArrowLeft className="w-[18px] h-[18px] text-kite-blue" />
    </button>
    <input 
      ref={searchInputRef}
      type="text" 
      placeholder="Search Eg: Radhika" 
      className="bg-transparent border-none outline-none w-full text-sm text-kite-text placeholder-gray-400 font-sans h-[36px]"
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

content = content.replace(oldHeaderRegex, newHeader);

// Replace font-medium with font-normal globally
content = content.replace(/font-medium/g, 'font-normal');
content = content.replace(/font-bold/g, 'font-normal');

// Write the file
fs.writeFileSync('src/pages/Investors.tsx', content);
