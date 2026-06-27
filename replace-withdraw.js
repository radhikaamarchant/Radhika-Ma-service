const fs = require('fs');
let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

const startIdx = code.indexOf('{viewMode === "withdraw-list"');
const endIdx = code.indexOf('          })()}', startIdx) + 15;
const targetPart = code.substring(startIdx, endIdx);

const replacement = `{viewMode === "withdraw-list" && selectedInvestor && (() => {
  const sfProFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const activeInvs = state.investments.filter(i => i.investorId === selectedInvestor.id && i.status === "active");
  const completedInvs = state.investments.filter(i => i.investorId === selectedInvestor.id && i.status === "completed");

  const groupedActive = activeInvs.reduce((acc, inv) => {
    if (!acc[inv.businessId]) acc[inv.businessId] = [];
    acc[inv.businessId].push(inv);
    return acc;
  }, {});

  const groupedCompleted = completedInvs.reduce((acc, inv) => {
    if (!acc[inv.businessId]) acc[inv.businessId] = [];
    acc[inv.businessId].push(inv);
    return acc;
  }, {});

  let activeTotalInvested = 0;
  let activeTotalLiveProfit = 0;
  let activeTotalCurrentValue = 0;

  const holdings = Object.entries(groupedActive).map(([bizId, invs]) => {
    const business = state.businesses.find(b => b.id === bizId);
    const { investedAmount, liveTrendPercentage, liveProfit, currentValue } = calculateLiveProfit(invs, bizId, marketState.trends, state.settings);
    activeTotalInvested += investedAmount;
    activeTotalLiveProfit += liveProfit;
    activeTotalCurrentValue += currentValue;
    return { bizId, business, invs, investedAmount, liveProfit, liveTrendPercentage, currentValue };
  });

  const positions = Object.entries(groupedCompleted).map(([bizId, invs]) => {
    const business = state.businesses.find(b => b.id === bizId);
    let investedAmount = 0;
    invs.forEach(inv => {
      investedAmount += inv.amount;
    });
    return { bizId, business, invs, investedAmount };
  });

  const curValue = activeTotalCurrentValue;
  const isProfit = curValue - activeTotalInvested >= 0;

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 md:mt-8 space-y-4 animate-fade-in">
      {/* Header and Tabs */}
      <div className="bg-white border-b border-kite-border pt-4 px-4 md:px-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] md:text-[20px] font-normal text-kite-text">
            Portfolio
            <span className="text-kite-text-light text-[13px] md:text-[14px] ml-2 font-normal">
              {selectedInvestor.name}
            </span>
          </h2>
          <button onClick={() => setViewMode("list")} className="text-gray-500 hover:text-kite-blue transition-colors text-[13px] md:text-[14px]">
            Back to List
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button 
            className={\`pb-3 text-[14px] md:text-[15px] transition-colors border-b-2 \${withdrawTab === 'holdings' ? 'border-kite-blue text-kite-blue font-normal' : 'border-transparent text-kite-text hover:text-kite-blue font-normal'}\`}
            onClick={() => setWithdrawTab('holdings')}
          >
            Holdings <span className="text-[11px] md:text-[12px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 ml-1">{holdings.length}</span>
          </button>
          <button 
            className={\`pb-3 text-[14px] md:text-[15px] transition-colors border-b-2 \${withdrawTab === 'positions' ? 'border-kite-blue text-kite-blue font-normal' : 'border-transparent text-kite-text hover:text-kite-blue font-normal'}\`}
            onClick={() => setWithdrawTab('positions')}
          >
            Positions <span className="text-[11px] md:text-[12px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 ml-1">{positions.length}</span>
          </button>
        </div>
      </div>

      {withdrawTab === 'holdings' && (
        <div className="bg-white border border-kite-border md:rounded-sm overflow-hidden">
          {/* Holdings Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 border-b border-kite-border bg-gray-50/50">
            <div>
              <p className="text-[11px] md:text-[12px] text-kite-text-light tracking-wide mb-1 font-normal">Total investment</p>
              <p className="text-[16px] md:text-[20px] font-normal text-kite-text" style={{ fontFamily: sfProFont }}>{formatINR(activeTotalInvested)}</p>
            </div>
            <div>
              <p className="text-[11px] md:text-[12px] text-kite-text-light tracking-wide mb-1 font-normal">Current value</p>
              <p className="text-[16px] md:text-[20px] font-normal text-kite-text" style={{ fontFamily: sfProFont }}>{formatINR(curValue)}</p>
            </div>
            <div>
              <p className="text-[11px] md:text-[12px] text-kite-text-light tracking-wide mb-1 font-normal">Total P&L</p>
              <p className={\`text-[16px] md:text-[20px] font-normal \${isProfit ? 'text-kite-green' : 'text-kite-red'}\`} style={{ fontFamily: sfProFont }}>
                {isProfit ? '+' : ''}{formatINR(activeTotalLiveProfit)}
                <span className="text-[12px] md:text-[14px] ml-1.5 opacity-80">
                  ({activeTotalInvested > 0 ? ((activeTotalLiveProfit / activeTotalInvested) * 100).toFixed(2) : '0.00'}%)
                </span>
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[13px] md:text-[14px]">
              <thead className="bg-white border-b border-kite-border text-kite-text-light">
                <tr>
                  <th className="py-3 px-4 font-normal text-left">Instrument</th>
                  <th className="py-3 px-4 font-normal text-right">Invested</th>
                  <th className="py-3 px-4 font-normal text-right">Cur. val</th>
                  <th className="py-3 px-4 font-normal text-right">P&L</th>
                  <th className="py-3 px-4 font-normal text-right">% Chg</th>
                  <th className="py-3 px-4 font-normal text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {holdings.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-4 text-kite-text font-normal">{h.business?.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(h.investedAmount)}</td>
                    <td className="py-3 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(h.currentValue)}</td>
                    <td className={\`py-3 px-4 text-right font-normal \${h.liveProfit >= 0 ? 'text-kite-green' : 'text-kite-red'}\`} style={{ fontFamily: sfProFont }}>
                      {h.liveProfit >= 0 ? '+' : ''}{formatINR(h.liveProfit)}
                    </td>
                    <td className={\`py-3 px-4 text-right font-normal \${h.liveProfit >= 0 ? 'text-kite-green' : 'text-kite-red'}\`} style={{ fontFamily: sfProFont }}>
                      {h.liveProfit >= 0 ? '+' : ''}{h.investedAmount > 0 ? ((h.liveProfit / h.investedAmount) * 100).toFixed(2) : '0.00'}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleCreditInvestorClick(h.invs)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-sm text-[12px] opacity-0 group-hover:opacity-100 transition-opacity font-normal"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-kite-text-light font-normal text-[13px]">No holdings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden divide-y divide-gray-100">
            {holdings.map((h, i) => (
              <div key={i} className="p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[14px] text-kite-text font-normal">{h.business?.name || "Unknown"}</span>
                  <span className={\`text-[14px] font-normal \${h.liveProfit >= 0 ? 'text-kite-green' : 'text-kite-red'}\`} style={{ fontFamily: sfProFont }}>
                    {h.liveProfit >= 0 ? '+' : ''}{h.investedAmount > 0 ? ((h.liveProfit / h.investedAmount) * 100).toFixed(2) : '0.00'}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3 text-[12px] text-kite-text-light">
                  <div className="flex flex-col">
                    <span className="font-normal">Invested</span>
                    <span className="text-kite-text mt-0.5 font-normal" style={{ fontFamily: sfProFont }}>{formatINR(h.investedAmount)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-normal">LTP</span>
                    <span className={\`mt-0.5 font-normal \${h.liveProfit >= 0 ? 'text-kite-green' : 'text-kite-red'}\`} style={{ fontFamily: sfProFont }}>
                      {h.liveProfit >= 0 ? '+' : ''}{formatINR(h.liveProfit)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleCreditInvestorClick(h.invs)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm text-[13px] mt-1 font-normal transition-colors"
                >
                  Sell
                </button>
              </div>
            ))}
            {holdings.length === 0 && (
              <div className="p-8 text-center text-kite-text-light text-[13px] font-normal">No holdings found.</div>
            )}
          </div>
        </div>
      )}

      {withdrawTab === 'positions' && (
        <div className="bg-white border border-kite-border md:rounded-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[13px] md:text-[14px]">
              <thead className="bg-white border-b border-kite-border text-kite-text-light">
                <tr>
                  <th className="py-3 px-4 font-normal text-left">Instrument</th>
                  <th className="py-3 px-4 font-normal text-right">Invested</th>
                  <th className="py-3 px-4 font-normal text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {positions.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-kite-text font-normal">{p.business?.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(p.investedAmount)}</td>
                    <td className="py-3 px-4 text-center text-kite-text-light font-normal text-[12px]"><span className="bg-gray-100 px-2 py-1 rounded-sm">Completed</span></td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-kite-text-light font-normal text-[13px]">No positions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="block md:hidden divide-y divide-gray-100">
            {positions.map((p, i) => (
              <div key={i} className="p-4 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[14px] text-kite-text font-normal">{p.business?.name || "Unknown"}</span>
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm font-normal">Completed</span>
                </div>
                <div className="flex flex-col text-[12px] text-kite-text-light mt-2">
                  <span className="font-normal">Invested</span>
                  <span className="text-kite-text mt-0.5 font-normal" style={{ fontFamily: sfProFont }}>{formatINR(p.investedAmount)}</span>
                </div>
              </div>
            ))}
            {positions.length === 0 && (
              <div className="p-8 text-center text-kite-text-light text-[13px] font-normal">No positions found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
})()}`;

if(targetPart) {
  code = code.replace(targetPart, replacement);
  fs.writeFileSync('src/pages/Investors.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find target block.");
}
