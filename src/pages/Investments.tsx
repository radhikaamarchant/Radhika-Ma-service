import React, { useState } from 'react';
import { useAppContext } from '../utils/AppContext';
import { formatINR } from '../utils/mockData';
import { Plus, ReceiptIndianRupee, Search, X, CheckCircle, Wallet } from 'lucide-react';
import { Investment } from '../types';

export default function Investments() {
  const { state, dispatch } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showInterestCalculation, setShowInterestCalculation] = useState(false);

  const [formData, setFormData] = useState({
    businessId: '',
    investorId: '',
    amount: '',
    timePeriodMonths: '12',
    adminCommissionInvestorPct: '2',
    adminCommissionBusinessPct: '2',
  });

  const selectedBusiness = state.businesses.find(b => b.id === formData.businessId);
  const selectedBusinessInterest = selectedBusiness ? selectedBusiness.interestRate : 0;

  const getRawAmount = (formattedValue: string) => {
    return parseFloat(formattedValue.replace(/,/g, '')) || 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = raw ? Number(raw).toLocaleString('en-IN') : '';
    setFormData({...formData, amount: formatted});
  };

  const calculateCommissions = () => {
    const amount = getRawAmount(formData.amount);
    const invPct = parseFloat(formData.adminCommissionInvestorPct) || 0;
    const busPct = parseFloat(formData.adminCommissionBusinessPct) || 0;
    return {
      fromInvestor: (amount * invPct) / 100,
      fromBusiness: (amount * busPct) / 100,
    };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    const amount = getRawAmount(formData.amount);
    if (amount <= 0) return;

    const comms = calculateCommissions();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(formData.timePeriodMonths));

    const newInvestment: Investment = {
      id: `inv${Date.now()}`,
      businessId: formData.businessId,
      investorId: formData.investorId,
      amount: amount,
      timePeriodMonths: parseInt(formData.timePeriodMonths),
      interestRate: selectedBusinessInterest,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      adminCommissionInvestor: comms.fromInvestor,
      adminCommissionBusiness: comms.fromBusiness,
      status: 'active',
    };

    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
    
    if (amount >= selectedBusiness.fundingRequired) {
        dispatch({ type: 'UPDATE_BUSINESS_STATUS', payload: { id: formData.businessId, status: 'funded' } });
    }

    setShowAddForm(false);
    setFormData({ businessId: '', investorId: '', amount: '', timePeriodMonths: '12', adminCommissionInvestorPct: '2', adminCommissionBusinessPct: '2' });
  };

  const filteredInvestments = state.investments.filter(inv => {
    const business = state.businesses.find(b => b.id === inv.businessId);
    const investor = state.investors.find(i => i.id === inv.investorId);
    const match = searchTerm.toLowerCase();
    return business?.name.toLowerCase().includes(match) || investor?.name.toLowerCase().includes(match);
  });

  const activeBusinesses = state.businesses;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black tracking-tight">Funding & Investments</h2>
          <p className="text-sm text-gray-500 mt-1">Connect investors with businesses and collect commissions.</p>
        </div>
        <div className="flex-1 w-full flex justify-end gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by business or investor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-shadow"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            <span>New Funding Link</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center space-x-2">
            <ReceiptIndianRupee size={20} />
            <span>Process New Funding</span>
          </h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Select Business</label>
                <select required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none bg-white" 
                  value={formData.businessId} onChange={e => {
                    const reqFund = state.businesses.find(b=>b.id===e.target.value)?.fundingRequired;
                    const reqFundFormatted = reqFund ? reqFund.toLocaleString('en-IN') : '';
                    setFormData({...formData, businessId: e.target.value, amount: reqFundFormatted});
                  }}>
                  <option value="">-- Select Business --</option>
                  {activeBusinesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name} (Requires {formatINR(b.fundingRequired)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Select Investor</label>
                <select required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none bg-white" 
                  value={formData.investorId} onChange={e => setFormData({...formData, investorId: e.target.value})}>
                  <option value="">-- Select Investor --</option>
                  {state.investors.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Investment Amount (₹) (INR Format)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">₹</span>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 font-bold focus:ring-2 focus:ring-black outline-none" 
                    value={formData.amount} onChange={handleAmountChange} placeholder="e.g. 5,00,000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Time Period (Months)</label>
                <input required type="number" min="1" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black outline-none" 
                  value={formData.timePeriodMonths} onChange={e => setFormData({...formData, timePeriodMonths: e.target.value})} />
              </div>
            </div>

            {selectedBusiness && (
              <div className="mt-4 border border-green-200 rounded-lg overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setShowInterestCalculation(!showInterestCalculation)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2"
                >
                  <span className="font-semibold text-green-800 flex items-center space-x-2 min-w-0">
                    <span className="truncate">Business Interest Rate: {selectedBusinessInterest}%</span>
                  </span>
                  <span className="text-green-600 text-xl flex-shrink-0">{showInterestCalculation ? '−' : '+'}</span>
                </button>
                {showInterestCalculation && getRawAmount(formData.amount) > 0 && (
                  <div className="p-4 bg-white border-t border-green-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Calculated Return to Investor</p>
                      <p className="text-xs text-gray-500 mt-0.5">Based on <span className="font-bold text-green-600">{selectedBusinessInterest}%</span> interest rate applied on <span className="font-mono font-medium">{formatINR(getRawAmount(formData.amount))}</span>.</p>
                    </div>
                    <div className="text-left md:text-right flex flex-col gap-2 min-w-0">
                       <p className="text-sm font-semibold text-gray-600 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded break-words whitespace-normal">
                         Monthly Return: <span className="font-bold font-mono text-black break-all">{formatINR((getRawAmount(formData.amount) * selectedBusinessInterest / 100) / 12)}</span>
                       </p>
                       <p className="text-sm font-bold text-green-800 border border-green-100 bg-green-50 px-3 py-1.5 rounded break-words whitespace-normal">
                         Yearly Return: <span className="font-black font-mono text-green-900 break-all">{formatINR(getRawAmount(formData.amount) * selectedBusinessInterest / 100)}</span>
                       </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-6">
              <h4 className="text-sm font-bold mb-3 text-red-600">Admin Commission Processing</h4>
              <p className="text-xs text-gray-500 mb-4">Set percentage to collect commission from both parties at the time of funding.</p>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold mb-1">From Business (%)</label>
                        <input type="number" step="0.1" className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-black outline-none" 
                            value={formData.adminCommissionBusinessPct} onChange={e => setFormData({...formData, adminCommissionBusinessPct: e.target.value})} />
                    </div>
                    <div className="flex-1 flex flex-col justify-end pb-2">
                        <span className="text-sm font-bold text-red-600">{formatINR(calculateCommissions().fromBusiness)}</span>
                    </div>
                </div>
                <div className="flex gap-4 border-l border-gray-200 pl-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold mb-1">From Investor (%)</label>
                        <input type="number" step="0.1" className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-black outline-none" 
                            value={formData.adminCommissionInvestorPct} onChange={e => setFormData({...formData, adminCommissionInvestorPct: e.target.value})} />
                    </div>
                    <div className="flex-1 flex flex-col justify-end pb-2">
                        <span className="text-sm font-bold text-red-600">{formatINR(calculateCommissions().fromInvestor)}</span>
                    </div>
                </div>
              </div>
               <div className="text-right mt-2">
                    <p className="text-sm font-bold text-red-600">Total Admin Profit: {formatINR(calculateCommissions().fromBusiness + calculateCommissions().fromInvestor)}</p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 font-semibold text-gray-500 hover:text-black mr-4">Cancel</button>
              <button type="submit" className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Finalize Funding</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredInvestments.map(inv => {
            const business = state.businesses.find(b => b.id === inv.businessId);
            const investor = state.investors.find(i => i.id === inv.investorId);
            return (
                <div key={inv.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:border-gray-300 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${inv.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                {inv.status.toUpperCase()}
                            </span>
                            <span className="text-xs font-medium text-gray-500">{inv.timePeriodMonths} Months</span>
                        </div>
                        <h4 className="text-lg font-bold text-black">{business?.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Funded by <span className="font-semibold text-black">{investor?.name}</span></p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col md:items-end flex-2 px-6">
                        <p className="text-xs text-gray-500 mb-1 tracking-wider uppercase font-bold">Invested Amount</p>
                        <p className="text-xl font-bold text-black">{formatINR(inv.amount)}</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">Interest: {inv.interestRate}%</p>
                    </div>

                    <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-6 flex flex-col gap-2 items-start md:items-end w-full md:w-auto">
                        <button 
                          onClick={() => setSelectedInvestment(inv)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg text-sm w-full md:w-auto transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: 'DELETE_INVESTMENT', payload: inv.id });
                          }}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm px-6 py-2 border border-red-200 hover:bg-red-50 rounded-lg transition-colors w-full md:w-auto"
                        >
                          Delete
                        </button>
                        <p className="text-xs text-gray-400 mt-1 text-right w-full">ID: #{inv.id}</p>
                    </div>
                </div>
            );
        })}
        {filteredInvestments.length === 0 && (
            <div className="text-center p-6 md:p-12 bg-white border border-gray-200 rounded-xl border-dashed">
                <ReceiptIndianRupee size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">No funding records found.</p>
            </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center z-10">
              <h3 className="font-bold text-xl text-black flex items-center space-x-2">
                <Wallet size={24} className="text-blue-500" />
                <span>Investment Full Details</span>
              </h3>
              <button 
                onClick={() => setSelectedInvestment(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                   <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase ${selectedInvestment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                     {selectedInvestment.status}
                   </span>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Investment ID</p>
                   <p className="font-mono font-medium text-black">#{selectedInvestment.id}</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Business Name</p>
                   <p className="font-bold text-lg text-black">{state.businesses.find(b => b.id === selectedInvestment.businessId)?.name}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Investor Name</p>
                   <p className="font-bold text-lg text-black">{state.investors.find(i => i.id === selectedInvestment.investorId)?.name}</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div>
                   <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Capital Invested</p>
                   <p className="font-black text-2xl text-black">{formatINR(selectedInvestment.amount)}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Interest Rate</p>
                   <p className="font-black text-2xl text-green-700">{selectedInvestment.interestRate}% <span className="text-sm font-medium text-gray-500">for {selectedInvestment.timePeriodMonths}m</span></p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</p>
                   <p className="font-medium">{new Date(selectedInvestment.startDate).toLocaleDateString('en-IN')}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Maturity Date (Est)</p>
                   <p className="font-medium">{new Date(selectedInvestment.endDate).toLocaleDateString('en-IN')}</p>
                 </div>
               </div>

               <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-bold mb-4 text-red-600">RMAS Administrative Commissions</h4>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Commission from Business</span>
                    <span className="font-bold">{formatINR(selectedInvestment.adminCommissionBusiness)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Commission from Investor</span>
                    <span className="font-bold">{formatINR(selectedInvestment.adminCommissionInvestor)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-gray-100">
                    <span className="font-bold text-black">Total Admin Revenue Collected</span>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{formatINR(selectedInvestment.adminCommissionBusiness + selectedInvestment.adminCommissionInvestor)}</span>
                  </div>
               </div>

               {selectedInvestment.status === 'completed' && selectedInvestment.payoutDetails && (
                 <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                   <h4 className="font-bold text-green-800 flex items-center space-x-2 mb-4">
                     <CheckCircle size={18} />
                     <span>Completed Settlement Details</span>
                   </h4>
                   <div className="space-y-2 text-sm text-green-900">
                     <div className="flex justify-between">
                       <span>Total Profit + Capital Credited</span>
                       <span className="font-bold">{formatINR(selectedInvestment.payoutDetails.totalCredited)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>RMAS Commission Deducted</span>
                       <span className="font-medium text-red-600">-{formatINR(selectedInvestment.payoutDetails.rmasCommission)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Happy Muslim Tax Deducted</span>
                       <span className="font-medium text-red-600">-{formatINR(selectedInvestment.payoutDetails.happyIncomeTax)}</span>
                     </div>
                     <div className="flex justify-between pt-2 border-t border-green-200">
                       <span>Payout Date</span>
                       <span className="font-mono">{new Date(selectedInvestment.payoutDetails.payoutDate).toLocaleDateString('en-IN')}</span>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

