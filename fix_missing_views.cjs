const fs = require('fs');
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

const startStr = 'const isProfit = curValue - totalInvested >= 0; return ( <h4';
const endStr = '{/* --- Profit Slip Modal --- */}';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `const isProfit = curValue - totalInvested >= 0; 
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto bg-white border border-kite-border rounded-sm mt-4 md:mt-8">
      <div className="flex justify-between items-center mb-4 border-b border-kite-border pb-4">
        <h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Withdraw Investments</h3>
        <button type="button" onClick={() => setViewMode('list')} className="text-gray-500 hover:text-gray-700 font-medium">Back to List</button>
      </div>
      <div className="space-y-4">
        {holdings.map((h, i) => (
          <div key={i} className="p-4 border border-kite-border rounded-sm flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="font-normal text-[13px] md:text-[14px] text-kite-text uppercase mb-1">{h.business?.name || 'Unknown'}</h4>
              <p className="text-[12px] md:text-[13px] text-kite-text-light">Invested: {formatINR(h.amount)}</p>
              <p className="text-[12px] md:text-[13px] text-kite-text-light">Live Profit: <span className={h.liveProfit >= 0 ? 'text-kite-green' : 'text-kite-red'}>{formatINR(h.liveProfit)}</span></p>
              <p className="text-[12px] md:text-[13px] text-kite-text-light font-medium">Current Value: {formatINR(h.currentValue)}</p>
            </div>
            <div className="mt-3 md:mt-0 text-right">
               <button onClick={() => handleCreditInvestorClick(h.activeInvs)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-[13px] font-medium transition-colors">
                 Process Withdrawal
               </button>
            </div>
          </div>
        ))}
        {holdings.length === 0 && <p className="text-[13px] md:text-[14px] text-kite-text-light text-center py-4">No active investments found.</p>}
      </div>
    </div>
  );
  })()}

  {viewMode === 'withdraw-calc' && selectedInvestor && selectedInvestments.length > 0 && (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white border border-kite-border rounded-sm mt-4 md:mt-8 animate-fade-in">
       <div className="flex justify-between items-center mb-4 border-b border-kite-border pb-4">
        <h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Withdrawal Calculation</h3>
        <button onClick={() => setViewMode('withdraw-list')} className="text-gray-500 hover:text-gray-700 font-medium text-[13px] md:text-[14px]">Back</button>
      </div>
      <form onSubmit={goToBanking} className="space-y-4">
         <div className="text-[13px] md:text-[14px] text-kite-text">Please review calculation details before proceeding to bank transfer.</div>
         <div className="pt-4">
           <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium text-[13px] md:text-[14px]">Proceed to Bank Transfer →</button>
         </div>
      </form>
    </div>
  )}

  {viewMode === 'withdraw-bank' && selectedInvestor && selectedInvestments.length > 0 && (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white border border-kite-border rounded-sm mt-4 md:mt-8 animate-fade-in">
       <div className="flex justify-between items-center mb-4 border-b border-kite-border pb-4">
        <h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Bank Transfer Confirmation</h3>
        <button onClick={() => setViewMode('withdraw-calc')} className="text-gray-500 hover:text-gray-700 font-medium text-[13px] md:text-[14px]">Back</button>
      </div>
      <div className="space-y-4">
         <div className="text-[13px] md:text-[14px] text-kite-text">Confirm that funds have been successfully transferred to the investor's bank account.</div>
         <div className="pt-4">
           <button onClick={() => { handlePay(); setViewMode('list'); }} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium text-[13px] md:text-[14px]">Confirm Payment</button>
         </div>
      </div>
    </div>
  )}

  {viewMode === 'banking-record' && selectedInvestor && (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white border border-kite-border rounded-sm mt-4 md:mt-8 animate-fade-in">
       <div className="flex justify-between items-center mb-4 border-b border-kite-border pb-4">
        <h3 className="text-[14px] md:text-[15px] font-medium text-kite-text uppercase">Banking Records</h3>
        <button onClick={() => setViewMode('list')} className="text-gray-500 hover:text-gray-700 font-medium text-[13px] md:text-[14px]">Back to List</button>
      </div>
      <div className="space-y-4">
         {state.investments.filter(i => i.investorId === selectedInvestor.id && i.status === 'completed').map((inv, i) => {
           const business = state.businesses.find(b => b.id === inv.businessId);
           const payout = inv.payoutDetails;
           return (
              <div key={i} className="p-4 border border-kite-border rounded-sm flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h4 className="font-normal text-[13px] md:text-[14px] text-kite-text uppercase mb-1">{business?.name || 'Unknown Business'}</h4>
                  <p className="text-[12px] md:text-[13px] font-mono text-kite-text-light">Inv. ID: #{inv.id}</p>
                  <p className="text-[12px] md:text-[13px] text-kite-text-light">Paid on: {payout?.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-[11px] md:text-[12px] text-kite-text-light uppercase tracking-widest">Credited</p>
                  <p className="font-normal text-[13px] md:text-[14px] text-kite-green">{formatINR(payout?.totalCredited || 0)}</p>
                </div>
              </div>
           );
         })}
         {state.investments.filter(i => i.investorId === selectedInvestor.id && i.status === 'completed').length === 0 && (
            <div className="text-center py-12 text-kite-text-light bg-kite-bg border border-kite-border border-dashed rounded-sm">
              <p className="font-normal text-[13px] md:text-[14px] text-kite-text">No completed banking records found.</p>
              <p className="text-[12px] md:text-[13px] mt-1">When an investment is withdrawn, the profit slip will appear here.</p>
            </div>
         )}
      </div>
    </div>
  )}
  </div>
  {/* --- Profit Slip Modal --- */}`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex + endStr.length);
  fs.writeFileSync('src/pages/Investors.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find start or end!");
}
