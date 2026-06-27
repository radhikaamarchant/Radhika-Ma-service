const fs = require('fs');
let content = fs.readFileSync('src/pages/Businesses.tsx', 'utf8');

// Fix symmetry
content = content.replace(
  '<div className="flex flex-col flex-1 pl-1 md:pl-2">',
  '<div className="flex flex-col flex-1">'
);

// Fix fonts to 400 (remove font-medium from specific text elements in the card)
content = content.replace(
  '<span className="font-medium text-kite-text text-[13px] md:text-sm group-hover:text-kite-blue transition-colors uppercase leading-tight tracking-wide">{business.name}</span>',
  '<span className="font-normal text-kite-text text-[13px] md:text-sm group-hover:text-kite-blue transition-colors uppercase leading-tight tracking-wide">{business.name}</span>'
);

content = content.replace(
  '<span className="font-medium text-kite-text text-sm">{formatINR(business.fundingRequired)}</span>',
  '<span className="font-normal text-kite-text text-sm">{formatINR(business.fundingRequired)}</span>'
);

content = content.replace(
  '<span className="text-[11px] font-medium mt-0.5 text-kite-green">',
  '<span className="text-[11px] font-normal mt-0.5 text-kite-green">'
);

// Change font-medium to font-normal for the business name in other places if any
content = content.replace(/className="text-\[15px\] md:text-xl font-medium/g, 'className="text-[15px] md:text-xl font-normal');

// Search placeholder should say "Search eg: infy, reliance" 
// (Wait, we already did that)

fs.writeFileSync('src/pages/Businesses.tsx', content);
console.log('Fixed card padding and font weights');
