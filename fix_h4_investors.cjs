const fs = require('fs');
let content = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

content = content.replace(/<div className="font-normal uppercasebusiness\?\.name \|\| 'Unknown Business'\}<\/h4>/g, '<h4 className="font-normal uppercase text-[13px] md:text-[14px] text-kite-text">{business?.name || \'Unknown Business\'}</h4>');

// There is also an error with the search input button X closing tag earlier ?
// Let's check `</button> </div> )} </div> </div> </div>`

fs.writeFileSync('src/pages/Investors.tsx', content);
