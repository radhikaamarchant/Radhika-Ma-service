const fs = require('fs');
let content = fs.readFileSync('src/pages/Businesses.tsx', 'utf8');

const searchBoxRegex = /<div className="p-1 border-b border-kite-border flex items-center bg-white justify-between min-h-\[44px\]">[\s\S]*?<\/div>\n\s*<div className="overflow-hidden">/;

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
        type="text" 
        placeholder="Search eg: infy, reliance" 
        className="bg-transparent border-none outline-none w-full text-sm text-kite-text placeholder-gray-400 font-sans"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus={isSearchExpanded}
      />
      {searchTerm && (
        <button onClick={() => setSearchTerm('')} className="p-2 text-gray-400 hover:text-kite-text transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
  <div className="overflow-hidden">`;

content = content.replace(searchBoxRegex, newSearchBox);

fs.writeFileSync('src/pages/Businesses.tsx', content);
console.log('Fixed Search Expand animation');
