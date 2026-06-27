const fs = require('fs');

let content = fs.readFileSync('src/pages/Businesses.tsx', 'utf8');

// Resizing
content = content.replace(
  'className="bg-kite-blue hover:opacity-90 text-white px-4 h-[40px] md:h-[44px] rounded-md font-medium flex items-center justify-center space-x-2 transition-colors text-sm w-full md:w-auto shadow-sm"',
  'className="bg-kite-blue hover:opacity-90 text-white px-4 h-[36px] rounded font-medium flex items-center justify-center space-x-2 transition-colors text-[13px] shadow-sm"'
);

// State
content = content.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  "const [searchTerm, setSearchTerm] = useState('');\n  const [isSearchExpanded, setIsSearchExpanded] = useState(false);"
);

// Imports
if (!content.includes('ArrowLeft')) {
  content = content.replace(
    "import { Plus, Search, Building2, UserCircle, Briefcase, IndianRupee, Landmark, History, FileText, Download, TrendingUp, AlertCircle, X, ChevronRight, Calculator, BadgeCheck, Clock, Calendar } from 'lucide-react';",
    "import { Plus, Search, Building2, UserCircle, Briefcase, IndianRupee, Landmark, History, FileText, Download, TrendingUp, AlertCircle, X, ChevronRight, Calculator, BadgeCheck, Clock, Calendar, ArrowLeft } from 'lucide-react';"
  );
}

// Search UI
const searchBoxRegex = /<div className="p-2 sm:p-3 border-b border-kite-border flex items-center bg-kite-bg">[\s\S]*?<\/div>\n\s*<div className="overflow-hidden">/;
const newSearchBox = `<div className="p-1 border-b border-kite-border flex items-center bg-white justify-between min-h-[44px]">
    {!isSearchExpanded ? (
      <div className="flex justify-end w-full px-2">
        <button onClick={() => setIsSearchExpanded(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Search className="w-[18px] h-[18px] text-kite-text-light" />
        </button>
      </div>
    ) : (
      <div className="flex items-center w-full bg-white px-2">
        <button onClick={() => { setIsSearchExpanded(false); setSearchTerm(''); }} className="p-2 hover:bg-gray-50 rounded-full mr-1 transition-colors">
          <ArrowLeft className="w-[18px] h-[18px] text-kite-text-light" />
        </button>
        <input 
          type="text" 
          placeholder="Search eg: infy, reliance" 
          className="bg-transparent border-none outline-none w-full text-sm text-kite-text placeholder-gray-400 font-sans"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="p-2 text-gray-400 hover:text-kite-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )}
  </div>
  <div className="overflow-hidden">`;

content = content.replace(searchBoxRegex, newSearchBox);

// Card layout
const oldCardRegex = /<div className="flex flex-col">\s*<div className="flex items-center space-x-1\.5 mb-0\.5">\s*<span className="font-medium text-kite-text text-sm md:text-base group-hover:text-kite-blue transition-colors">\{business\.name\}<\/span>\s*\{isBlueTick[\s\S]*?<\/div>\s*<div className="flex items-center space-x-2">\s*<span className="text-\[11px\] md:text-xs text-kite-text-light">Owner: \{business\.ownerName\}<\/span>\s*<span className="text-kite-border">•<\/span>\s*<span className="font-mono text-\[11px\] md:text-xs text-kite-text-light">ID: #\{business\.businessId\}<\/span>\s*<\/div>\s*<\/div>/;

const newCard = `<div className="flex flex-col flex-1 pl-1 md:pl-2">
      <span className="text-[10px] md:text-[11px] text-kite-text-light mb-0.5 leading-tight">{business.ownerName}</span>
      <div className="flex items-center space-x-1.5 mb-1">
        <span className="font-medium text-kite-text text-[13px] md:text-sm group-hover:text-kite-blue transition-colors uppercase leading-tight tracking-wide">{business.name}</span>
        {isBlueTick(business.id) && <BadgeCheck className="w-3.5 h-3.5 text-white fill-blue-500 flex-shrink-0" />}
        {isPreVerified(business.id) && <Clock className="w-3 h-3 text-black flex-shrink-0" />}
      </div>
      <span className="font-sans text-[10px] md:text-[11px] text-kite-text-light leading-tight">{business.businessId}</span>
    </div>`;

content = content.replace(oldCardRegex, newCard);

fs.writeFileSync('src/pages/Businesses.tsx', content);
console.log('Fixed Businesses UI');
