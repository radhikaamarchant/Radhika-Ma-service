import fs from 'fs';

let code = fs.readFileSync('src/pages/Investors.tsx', 'utf8');

const startIndex = code.indexOf('{withdrawTab === "holdings" && (');
const endIndex = code.indexOf('              </div>\n            );\n          })()}');

if (startIndex !== -1 && endIndex !== -1) {
  const newHoldingsCode = `{withdrawTab === "holdings" && (
                  <div className="bg-gray-50 md:bg-white md:border md:border-kite-border md:rounded-sm overflow-hidden pb-20">
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
                          {holdings.map((h, i) => {
                            const qty = h.invs.length;
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
                                    groupedInvestmentsList: h.invs
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
                      {/* Kite Style Top Summary Card */}
                      <div className="bg-white m-3 rounded-sm shadow-sm border border-gray-100 p-4">
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

                      {/* Kite Style Filter/Search Row */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 text-kite-text-light text-[13px]">
                        <div className="flex items-center space-x-4">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                          <span className="flex items-center">Equity <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                        </div>
                        <div className="flex items-center space-x-4">
                           <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> Family</span>
                           <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> Analytics</span>
                        </div>
                      </div>

                      {/* Kite Style List */}
                      <div className="bg-white">
                        {holdings.map((h, i) => {
                          const qty = h.invs.length;
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
                                  groupedInvestmentsList: h.invs
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
                    </div>
                  </div>
                )}

                {withdrawTab === "positions" && (
                  <div className="bg-gray-50 md:bg-white md:border md:border-kite-border md:rounded-sm overflow-hidden pb-20">
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
                          {positions.map((p, i) => {
                            const qty = p.invs.length;
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
                                    groupedInvestmentsList: p.invs
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
                      {/* Kite Style Filter/Search Row */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 text-kite-text-light text-[13px] mt-2">
                        <div className="flex items-center space-x-4">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        </div>
                      </div>

                      <div className="bg-white">
                        {positions.map((p, i) => {
                          const qty = p.invs.length;
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
                                  groupedInvestmentsList: p.invs
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
                    </div>
                  </div>
                )}
`;

  code = code.substring(0, startIndex) + newHoldingsCode + code.substring(endIndex);
  fs.writeFileSync('src/pages/Investors.tsx', code);
  console.log('Successfully applied Kite portfolio styling to Investors.tsx');
} else {
  console.log('Failed to find start or end index for portfolio list block.');
}
