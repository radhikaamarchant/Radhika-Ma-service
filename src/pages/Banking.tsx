import React, { useState } from 'react';
import { useAppContext } from '../utils/AppContext';
import { formatINR } from '../utils/mockData';
import { ArrowLeft, Search } from 'lucide-react';
import { Business, Investor, Investment } from '../types';

type EntityDetails = 
  | { type: 'business', data: Business }
  | { type: 'investor', data: Investor };

export default function Banking() {
  const { state } = useAppContext();
  const [selectedEntity, setSelectedEntity] = useState<EntityDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const businessesWithBanks = state.businesses.filter(b => b.bankDetails);
  const investorsWithBanks = state.investors.filter(i => i.bankDetails);

  const allAccounts = [
    ...businessesWithBanks.map(b => ({ type: 'business' as const, data: b, name: b.name, id: b.id, subtitle: b.ownerName, bank: b.bankDetails })),
    ...investorsWithBanks.map(i => ({ type: 'investor' as const, data: i, name: i.name, id: i.id, subtitle: `ID: #${i.investorId}`, bank: i.bankDetails }))
  ].filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.bank?.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatement = () => {
    if (!selectedEntity) return null;

    let transactions: any[] = [];
    const isBusiness = selectedEntity.type === 'business';
    const bData = isBusiness ? selectedEntity.data as Business : null;
    const iData = !isBusiness ? selectedEntity.data as Investor : null;
    
    // Calculate transactions based on entity type
    if (isBusiness && bData) {
      if (bData.registrationFee) {
          transactions.push({
              date: bData.registrationDate,
              description: 'Business Registration Fee',
              type: 'debit',
              amount: bData.registrationFee
          });
      }
      if (bData.registrationCommissionPaid) {
          transactions.push({
              date: bData.registrationDate,
              description: 'RMAS Registration Commission',
              type: 'debit',
              amount: bData.registrationCommissionPaid
          });
      }

      const businessInvestments = state.investments.filter(inv => inv.businessId === bData.id);
      businessInvestments.forEach(inv => {
        // Investment received (Credit)
        transactions.push({
            date: inv.startDate,
            description: `Investment Capital Received (Inv ID: #${inv.id})`,
            type: 'credit',
            amount: inv.amount
        });

        // Upfront admin commission
        if (inv.adminCommissionBusiness > 0) {
            transactions.push({
                date: inv.startDate,
                description: `RMAS Admin Commission Booking (Inv ID: #${inv.id})`,
                type: 'debit',
                amount: inv.adminCommissionBusiness
            });
        }

        // if completed, it means business paid back (Debit)
        if (inv.status === 'completed' && inv.payoutDetails) {
            // total business payout is total profit + capital 
            // the business pays out the gross amount: totalCredited + taxes + system commission
            const grossPayout = inv.payoutDetails.totalCredited + inv.payoutDetails.rmasCommission + inv.payoutDetails.happyIncomeTax;
            transactions.push({
                date: inv.payoutDetails.payoutDate,
                description: `Withdrawal Settlement Paid (Inv ID: #${inv.id})`,
                type: 'debit',
                amount: grossPayout
            });
        }
      });
    } else if (iData) {
      const investorInvestments = state.investments.filter(inv => inv.investorId === iData.id);
      investorInvestments.forEach(inv => {
          // Investment out (Debit)
          transactions.push({
              date: inv.startDate,
              description: `Investment Distributed (Inv ID: #${inv.id})`,
              type: 'debit',
              amount: inv.amount
          });

          // Upfront admin commission
          if (inv.adminCommissionInvestor > 0) {
              transactions.push({
                  date: inv.startDate,
                  description: `RMAS Admin Commission Booking (Inv ID: #${inv.id})`,
                  type: 'debit',
                  amount: inv.adminCommissionInvestor
              });
          }

          // If completed, investment return (Credit)
          if (inv.status === 'completed' && inv.payoutDetails) {
              const grossCredit = inv.payoutDetails.totalCredited + inv.payoutDetails.happyIncomeTax + inv.payoutDetails.rmasCommission;
              transactions.push({
                  date: inv.payoutDetails.payoutDate,
                  description: `Gross Settlement Credited (Inv ID: #${inv.id})`,
                  type: 'credit',
                  amount: grossCredit
              });
              
              if (inv.payoutDetails.happyIncomeTax > 0) {
                 transactions.push({
                     date: inv.payoutDetails.payoutDate,
                     description: `Happy Muslim Income Tax Deduction (Inv ID: #${inv.id})`,
                     type: 'debit',
                     amount: inv.payoutDetails.happyIncomeTax
                 });
              }
              
              if (inv.payoutDetails.rmasCommission > 0) {
                 transactions.push({
                     date: inv.payoutDetails.payoutDate,
                     description: `RMAS Settlement Commission (Inv ID: #${inv.id})`,
                     type: 'debit',
                     amount: inv.payoutDetails.rmasCommission
                 });
              }
          }
      });
    }

    // Sort transactions by date
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    const statementRows = transactions.map((t, idx) => {
        if (t.type === 'credit') runningBalance += t.amount;
        if (t.type === 'debit') runningBalance -= t.amount;
        return { ...t, balance: runningBalance, id: idx };
    });

    const bankDetails = isBusiness ? bData?.bankDetails : iData?.bankDetails;
    const name = isBusiness ? bData?.name : iData?.name;
    const secondaryName = isBusiness ? `Owner: ${bData?.ownerName}` : `ID: #${iData?.investorId}`;

    return (
      <div className="bg-white border text-gray-900 border-gray-200 rounded-xl p-4 md:p-8 shadow-sm font-sans mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-200 pb-8">
           <div className="flex items-start space-x-6">
             <button onClick={() => setSelectedEntity(null)} className="mt-1 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
               <ArrowLeft size={24} />
             </button>
             <div>
               <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                 {isBusiness ? 'Business Statement' : 'Investor Statement'}
               </p>
               <h3 className="text-3xl font-black text-black tracking-tight mb-2">
                 {name}
               </h3>
               <p className="text-sm font-semibold text-gray-500">{secondaryName}</p>
             </div>
           </div>
           {bankDetails && (
               <div className="mt-6 md:mt-0 text-right bg-gray-50 p-5 rounded border border-gray-200 min-w-[250px]">
                   <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Current Banking Profile</p>
                   <p className="font-bold text-gray-900 text-lg">{bankDetails.bankName}</p>
                   <p className="font-mono text-sm mt-1 text-gray-700">A/C: {bankDetails.accountNumber}</p>
                   <p className="font-mono text-sm text-gray-700">IFSC: {bankDetails.ifscCode}</p>
               </div>
           )}
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="border-b-2 border-black font-bold uppercase text-xs tracking-wider text-black">
                <tr>
                  <th className="py-4 pr-4 w-32">Date</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4 text-right">Debit</th>
                  <th className="py-4 px-4 text-right">Credit</th>
                  <th className="py-4 pl-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-base">
                  {statementRows.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-400 font-medium">No transactions on record.</td></tr>
                  ) : (
                      statementRows.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="py-4 pr-4 text-gray-500 whitespace-nowrap font-medium text-sm">{new Date(row.date).toLocaleDateString('en-IN')}</td>
                              <td className="py-4 px-4 font-medium text-gray-900">{row.description}</td>
                              <td className="py-4 px-4 text-right font-mono font-medium text-gray-500">{row.type === 'debit' ? formatINR(row.amount) : ''}</td>
                              <td className="py-4 px-4 text-right font-mono font-medium text-gray-900">{row.type === 'credit' ? formatINR(row.amount) : ''}</td>
                              <td className="py-4 pl-4 text-right font-mono font-bold text-black border-l border-transparent group-hover:border-gray-200">{formatINR(row.balance)}</td>
                          </tr>
                      ))
                  )}
              </tbody>
            </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {selectedEntity ? (
          renderStatement()
      ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight">Banking Directory</h2>
                <p className="text-sm text-gray-500 font-medium mt-2">Unified statement access for all registered businesses and investors.</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search name, ID or bank..."
                  className="w-full pl-10 pr-4 py-2 border border-black rounded-sm focus:ring-2 focus:ring-black focus:outline-none transition-shadow font-medium"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white border-t-2 border-black">
              {allAccounts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">No accounts found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-gray-50 border-b border-gray-200 font-bold uppercase text-xs tracking-wider text-gray-500">
                    <tr>
                      <th className="p-4 w-1/4">Entity Name</th>
                      <th className="p-4 w-32">Role</th>
                      <th className="p-4">Bank Details</th>
                      <th className="p-4 text-right w-32">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-base">
                    {allAccounts.map(acc => (
                      <tr 
                        key={`${acc.type}-${acc.id}`} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedEntity({ type: acc.type, data: acc.data })}
                      >
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{acc.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{acc.subtitle}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${acc.type === 'business' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                            {acc.type}
                          </span>
                        </td>
                        <td className="p-4">
                          {acc.bank ? (
                            <div>
                              <p className="font-semibold text-gray-900">{acc.bank.bankName}</p>
                              <p className="text-sm font-mono text-gray-500 mt-1">{acc.bank.accountNumber}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not configured</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-bold text-black border-b border-black pb-0.5 group-hover:border-transparent transition-colors">
                            Statement →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </>
      )}
    </div>
  );
}
