import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

const startIndex = code.indexOf('{viewMode === "withdraw-list" &&');
let endIndex = code.indexOf('          })()}');
// We need to make sure we get the correct closing block.
// "          })()}"

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{viewMode === "withdraw-list" &&
          selectedInvestor &&
          (() => {
            const sfProFont =
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

            const activeInvs = state.investments.filter(
              (i) =>
                i.investorId === selectedInvestor.id && i.status === "active",
            );
            const completedInvs = state.investments.filter(
              (i) =>
                i.investorId === selectedInvestor.id &&
                i.status === "completed",
            );

            const groupedActive = activeInvs.reduce(
              (acc, inv) => {
                if (!acc[inv.businessId]) acc[inv.businessId] = [];
                acc[inv.businessId].push(inv);
                return acc;
              },
              {} as Record<string, Investment[]>,
            );

            const groupedCompleted = completedInvs.reduce(
              (acc, inv) => {
                if (!acc[inv.businessId]) acc[inv.businessId] = [];
                acc[inv.businessId].push(inv);
                return acc;
              },
              {} as Record<string, Investment[]>,
            );

            let activeTotalInvested = 0;
            let activeTotalLiveProfit = 0;
            let activeTotalCurrentValue = 0;

            const holdings = Object.entries(groupedActive).map(
              ([bizId, invs]) => {
                const business = state.businesses.find((b) => b.id === bizId);
                const {
                  investedAmount,
                  liveTrendPercentage,
                  liveProfit,
                  currentValue,
                } = calculateLiveProfit(
                  invs as Investment[],
                  bizId,
                  marketState.trends,
                  state.settings,
                );
                activeTotalInvested += investedAmount;
                activeTotalLiveProfit += liveProfit;
                activeTotalCurrentValue += currentValue;
                return {
                  bizId,
                  business,
                  invs,
                  investedAmount,
                  liveProfit,
                  liveTrendPercentage,
                  currentValue,
                };
              },
            );

            const positions = Object.entries(groupedCompleted).map(
              ([bizId, invs]) => {
                const business = state.businesses.find((b) => b.id === bizId);
                let investedAmount = 0;
                (invs as Investment[]).forEach((inv: any) => {
                  investedAmount += inv.amount;
                });
                return { bizId, business, invs, investedAmount };
              },
            );

            const curValue = activeTotalCurrentValue;
            const isProfit = curValue - activeTotalInvested >= 0;

            return (
              <div className="w-full h-full min-h-screen bg-gray-50 md:bg-transparent md:max-w-6xl md:mx-auto md:mt-8 animate-fade-in pb-20">
                {/* Header and Tabs */}
                <div className="bg-gray-50 pt-4 px-4 md:px-6 relative z-10 border-b border-gray-200 md:border-none">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setViewMode("list")}
                      className="text-gray-700 hover:text-black transition-colors mr-3 p-1 -ml-1 rounded-full hover:bg-gray-200"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h2 className="text-[22px] md:text-[24px] font-bold text-gray-900 tracking-tight flex items-center">
                      Portfolio
                      <span className="text-gray-500 font-medium text-[13px] md:text-[14px] ml-3 mt-1 tracking-normal uppercase">
                        {selectedInvestor.name || ""}
                      </span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      className={\`pb-3 text-[14px] md:text-[15px] transition-colors border-b-2 flex items-center gap-2 \${withdrawTab === "holdings" ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-600 hover:text-gray-900 font-medium"}\`}
                      onClick={() => setWithdrawTab("holdings")}
                    >
                      Holdings
                      <span className={\`text-[11px] md:text-[12px] rounded-full px-2 py-0.5 \${withdrawTab === "holdings" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}\`}>
                        {holdings.length}
                      </span>
                    </button>
                    <button
                      className={\`pb-3 text-[14px] md:text-[15px] transition-colors border-b-2 flex items-center gap-2 \${withdrawTab === "positions" ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-600 hover:text-gray-900 font-medium"}\`}
                      onClick={() => setWithdrawTab("positions")}
                    >
                      Positions
                      <span className={\`text-[11px] md:text-[12px] rounded-full px-2 py-0.5 \${withdrawTab === "positions" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}\`}>
                        {positions.length}
                      </span>
                    </button>
                  </div>
                </div>

                {withdrawTab === "holdings" && (
                  <div className="bg-gray-50 md:bg-white md:border md:border-kite-border md:rounded-sm overflow-hidden">
                    {/* Desktop Table (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto border-b border-kite-border">
                      <table className="w-full text-left text-[13px] md:text-[14px]">
                        <thead className="bg-white border-b border-kite-border text-kite-text-light">
                          <tr>
                            <th className="py-3 px-4 font-normal text-left">Instrument</th>
                            <th className="py-3 px-4 font-normal text-right">Qty.</th>
                            <th className="py-3 px-4 font-normal text-right">Avg. cost</th>
                            <th className="py-3 px-4 font-normal text-right">LTP</th>
                            <th className="py-3 px-4 font-normal text-right">Cur. val</th>
                            <th className="py-3 px-4 font-normal text-right">P&L</th>
                            <th className="py-3 px-4 font-normal text-right">% Chg</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {holdings.length === 0 ? (
                            <tr>
                              <td colSpan={7}>
                                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                  <div className="text-gray-300 mb-4">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                  </div>
                                  <p className="text-gray-500 font-medium text-[15px]">No active holdings found</p>
                                </div>
                              </td>
                            </tr>
                          ) : holdings.map((h, i) => {
                            const qty = (h.invs as Investment[]).length;
                            const avgPrice = h.investedAmount / qty;
                            const ltp = h.currentValue / qty;
                            const pnlPercent = h.investedAmount > 0 ? (h.liveProfit / h.investedAmount) * 100 : 0;
                            
                            return (
                              <tr
                                key={i}
                                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPortfolioInvestment({
                                    businessId: h.bizId,
                                    investorId: selectedInvestor.id,
                                    status: "active",
                                    timePeriodMonths: (h.invs as Investment[])[0].timePeriodMonths,
                                    interestRate: (h.invs as Investment[])[0].interestRate,
                                    startDate: (h.invs as Investment[])[0].startDate,
                                    endDate: (h.invs as Investment[])[0].endDate,
                                    amount: h.investedAmount,
                                    groupedInvestmentsList: h.invs as Investment[]
                                  });
                                }}
                              >
                                <td className="py-4 px-4 text-kite-text font-normal">{h.business?.name?.toUpperCase() || "UNKNOWN"}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{qty}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{avgPrice.toFixed(2)}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{ltp.toFixed(2)}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(h.currentValue)}</td>
                                <td className={\`py-4 px-4 text-right font-normal \${h.liveProfit >= 0 ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                  {h.liveProfit >= 0 ? "+" : ""}
                                  {formatINR(h.liveProfit)}
                                </td>
                                <td className={\`py-4 px-4 text-right font-normal \${h.liveProfit >= 0 ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                  {h.liveProfit >= 0 ? "+" : ""}
                                  {pnlPercent.toFixed(2)}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Holdings List (Matches Kite App) */}
                    <div className="block md:hidden">
                      {holdings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                          <div className="text-gray-300 mb-4">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium text-[15px]">No active holdings found</p>
                        </div>
                      ) : (
                        <>
                          {/* Kite Style Top Summary Card - Full Width on Mobile */}
                          <div className="bg-white px-4 py-4 mb-2">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-[12px] text-kite-text-light mb-1">Invested</p>
                                <p className="text-[18px] text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(activeTotalInvested).replace("₹", "")}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[12px] text-kite-text-light mb-1">Current</p>
                                <p className="text-[18px] text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(curValue).replace("₹", "")}</p>
                              </div>
                            </div>
                            <div className="h-[1px] w-full bg-gray-100 mb-4"></div>
                            <div className="flex justify-between items-center">
                              <p className="text-[14px] text-kite-text-light">P&L</p>
                              <div className="flex items-center space-x-2">
                                <span className={\`text-[16px] font-normal \${isProfit ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                  {isProfit ? "+" : ""}{formatINR(activeTotalLiveProfit).replace("₹", "")}
                                </span>
                                <span className={\`text-[11px] px-1.5 py-0.5 rounded-sm \${isProfit ? "bg-kite-green/10 text-kite-green" : "bg-kite-red/10 text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                  {isProfit ? "+" : ""}{activeTotalInvested > 0 ? ((activeTotalLiveProfit / activeTotalInvested) * 100).toFixed(2) : "0.00"}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Kite Style List */}
                          <div className="bg-white">
                            {holdings.map((h, i) => {
                              const qty = (h.invs as Investment[]).length;
                              const avgPrice = h.investedAmount / qty;
                              const ltp = h.currentValue / qty;
                              const pnlPercent = h.investedAmount > 0 ? (h.liveProfit / h.investedAmount) * 100 : 0;
                              
                              return (
                                <div 
                                  key={i} 
                                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPortfolioInvestment({
                                      businessId: h.bizId,
                                      investorId: selectedInvestor.id,
                                      status: "active",
                                      timePeriodMonths: (h.invs as Investment[])[0].timePeriodMonths,
                                      interestRate: (h.invs as Investment[])[0].interestRate,
                                      startDate: (h.invs as Investment[])[0].startDate,
                                      endDate: (h.invs as Investment[])[0].endDate,
                                      amount: h.investedAmount,
                                      groupedInvestmentsList: h.invs as Investment[]
                                    });
                                  }}
                                >
                                  <div className="flex justify-between items-center mb-1.5">
                                    <div className="text-[12px] text-kite-text-light" style={{ fontFamily: sfProFont }}>
                                      Qty. {qty} <span className="mx-1">•</span> Avg. {avgPrice.toFixed(2)}
                                    </div>
                                    <div className={\`text-[12px] \${pnlPercent >= 0 ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                      {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center mb-1.5">
                                    <div className="text-[14px] text-kite-text uppercase font-normal tracking-wide">
                                      {h.business?.name?.toUpperCase() || "UNKNOWN"}
                                    </div>
                                    <div className={\`text-[14px] \${h.liveProfit >= 0 ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                      {h.liveProfit >= 0 ? "+" : ""}{formatINR(Math.abs(h.liveProfit)).replace("₹", "")}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-[12px] text-kite-text-light">
                                      Invested <span style={{ fontFamily: sfProFont }}>{formatINR(h.investedAmount).replace("₹", "")}</span>
                                    </div>
                                    <div className="text-[12px] text-kite-text-light flex items-center">
                                      <span className="mr-1">LTP</span>
                                      <span className="text-kite-text mr-1" style={{ fontFamily: sfProFont }}>{ltp.toFixed(2)}</span>
                                      <span className={\`\${h.liveTrendPercentage >= 0 ? "text-kite-green" : "text-kite-red"}\`} style={{ fontFamily: sfProFont }}>
                                        ({h.liveTrendPercentage >= 0 ? "+" : ""}{h.liveTrendPercentage.toFixed(2)}%)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {withdrawTab === "positions" && (
                  <div className="bg-gray-50 md:bg-white md:border md:border-kite-border md:rounded-sm overflow-hidden">
                    {/* Desktop Table (Hidden on Mobile) */}
                    <div className="hidden md:block overflow-x-auto border-b border-kite-border">
                      <table className="w-full text-left text-[13px] md:text-[14px]">
                        <thead className="bg-white border-b border-kite-border text-kite-text-light">
                          <tr>
                            <th className="py-3 px-4 font-normal text-left">Instrument</th>
                            <th className="py-3 px-4 font-normal text-right">Qty.</th>
                            <th className="py-3 px-4 font-normal text-right">Avg. price</th>
                            <th className="py-3 px-4 font-normal text-right">Invested</th>
                            <th className="py-3 px-4 font-normal text-center w-24">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {positions.length === 0 ? (
                            <tr>
                              <td colSpan={5}>
                                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                  <div className="text-gray-300 mb-4">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                  </div>
                                  <p className="text-gray-500 font-medium text-[15px]">No active positions found</p>
                                </div>
                              </td>
                            </tr>
                          ) : positions.map((p, i) => {
                            const qty = (p.invs as Investment[]).length;
                            const avgPrice = p.investedAmount / qty;
                            return (
                              <tr
                                key={i}
                                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPortfolioInvestment({
                                    businessId: p.bizId,
                                    investorId: selectedInvestor.id,
                                    status: "completed",
                                    timePeriodMonths: (p.invs as Investment[])[0].timePeriodMonths,
                                    interestRate: (p.invs as Investment[])[0].interestRate,
                                    startDate: (p.invs as Investment[])[0].startDate,
                                    endDate: (p.invs as Investment[])[0].endDate,
                                    amount: p.investedAmount,
                                    groupedInvestmentsList: p.invs as Investment[]
                                  });
                                }}
                              >
                                <td className="py-4 px-4 text-kite-text font-normal">{p.business?.name?.toUpperCase() || "UNKNOWN"}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{qty}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{avgPrice.toFixed(2)}</td>
                                <td className="py-4 px-4 text-right text-kite-text font-normal" style={{ fontFamily: sfProFont }}>{formatINR(p.investedAmount)}</td>
                                <td className="py-4 px-4 text-center">
                                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">Closed</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Positions List */}
                    <div className="block md:hidden">
                      {positions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                          <div className="text-gray-300 mb-4">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium text-[15px]">No active positions found</p>
                        </div>
                      ) : (
                        <div className="bg-white">
                          {positions.map((p, i) => {
                            const qty = (p.invs as Investment[]).length;
                            const avgPrice = p.investedAmount / qty;
                            
                            return (
                              <div 
                                key={i} 
                                className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPortfolioInvestment({
                                    businessId: p.bizId,
                                    investorId: selectedInvestor.id,
                                    status: "completed",
                                    timePeriodMonths: (p.invs as Investment[])[0].timePeriodMonths,
                                    interestRate: (p.invs as Investment[])[0].interestRate,
                                    startDate: (p.invs as Investment[])[0].startDate,
                                    endDate: (p.invs as Investment[])[0].endDate,
                                    amount: p.investedAmount,
                                    groupedInvestmentsList: p.invs as Investment[]
                                  });
                                }}
                              >
                                <div className="flex justify-between items-center mb-1.5">
                                  <div className="text-[12px] text-kite-text-light" style={{ fontFamily: sfProFont }}>
                                    Qty. {qty} <span className="mx-1">•</span> Avg. {avgPrice.toFixed(2)}
                                  </div>
                                  <div className="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                                    Closed
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mb-1.5">
                                  <div className="text-[14px] text-kite-text uppercase font-normal tracking-wide">
                                    {p.business?.name?.toUpperCase() || "UNKNOWN"}
                                  </div>
                                  <div className="text-[14px] text-kite-text" style={{ fontFamily: sfProFont }}>
                                    {formatINR(p.investedAmount).replace("₹", "")}
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="text-[12px] text-kite-text-light">
                                    Invested
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 15);
  fs.writeFileSync('src/pages/Investors.tsx', code);
  console.log("Successfully replaced block!");
} else {
  console.log("Could not find start or end index.");
}
