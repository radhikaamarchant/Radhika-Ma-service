const fs = require('fs');
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

code = code.replace(
  '<button className="font-medium" placeholder="Search owner name..." value={ownerSearch}',
  '<input type="text" className="w-full bg-transparent p-2 outline-none text-[13px] md:text-[14px] text-gray-800 placeholder-gray-400 font-normal" placeholder="Search owner name..." value={ownerSearch}'
);

fs.writeFileSync('src/pages/Investors.tsx', code);
