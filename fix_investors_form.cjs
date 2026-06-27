const fs = require('fs');
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

code = code.replace(
  'setShowOwnerSelect(false); }} > {name} </div> ))} </div> )} </div> </div> )} <div> <label className="block text-[11px] md:text-[12px] font-medium uppercase tracking-wider text-gray-500 mb-2">Investor ID Number</label>',
  'setShowOwnerSelect(false); }} > {name} </div> ))} </div> )} </div> </div> <div className="md:w-2/3 md:pt-4"> <form onSubmit={(e) => { e.preventDefault(); setViewMode(\'add-step-2\'); }} className="space-y-6"> <div> <label className="block text-[11px] md:text-[12px] font-medium uppercase tracking-wider text-gray-500 mb-2">Investor ID Number</label>'
);

// We must also fix the button cancel application!
code = code.replace(
  '<button className="font-medium">Cancel Application</button>',
  '<button type="button" onClick={() => { setViewMode(\'list\'); setFormData({ name: \'\', bankName: INDIAN_BANKS[0], accountNumber: \'\', ifscCode: \'\', accountHolderName: \'\', rmasServiceCharge: \'\', investorId: generateId(\'INV\') }); }} className="text-gray-500 hover:text-gray-700 font-medium text-[13px] md:text-[14px]">Cancel Application</button> <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 md:py-2.5 rounded font-medium transition-colors text-[13px] md:text-[14px]">Next Step →</button>'
);

fs.writeFileSync('src/pages/Investors.tsx', code);
