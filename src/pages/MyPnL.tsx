import React, { useState } from 'react';
import { useAppContext } from '../utils/AppContext';
import { formatINR } from '../utils/mockData';
import { List, ArrowLeft, Percent, Landmark } from 'lucide-react';

interface StatementEntry {
  id: string;
  date: string;
  type: 'commission' | 'tax';
  description: string;
  source: string;
  amount: number;
}

export default function MyPnL() {
  const { state } = useAppContext();
  const [showStatement, setShowStatement] = useState(false);

  let totalCommission = 0;
  let totalTax = 0;
  const statement: StatementEntry[] = [];

  // Calculate totals and build statement
  state.investments.forEach((inv) => {
    const business = state.businesses.find(b => b.id === inv.businessId);
    const investor = state.investors.find(i => i.id === inv.investorId);
    
    // Upfront Commissions
    if (inv.adminCommissionBusiness > 0) {
      totalCommission += inv.adminCommissionBusiness;
      statement.push({
        id: `comm_bus_${inv.id}`,
        date: inv.startDate,
        type: 'commission',
        description: `Upfront Commission from Business`,
        source: business ? business.name : 'Unknown Business',
        amount: inv.adminCommissionBusiness
      });
    }
    if (inv.adminCommissionInvestor > 0) {
      totalCommission += inv.adminCommissionInvestor;
      statement.push({
        id: `comm_inv_${inv.id}`,
        date: inv.startDate,
        type: 'commission',
        description: `Upfront Commission from Investor`,
        source: investor ? investor.name : 'Unknown Investor',
        amount: inv.adminCommissionInvestor
      });
    }
    
    // Settlement/Completion details
    if (inv.status === 'completed' && inv.payoutDetails) {
      if (inv.payoutDetails.rmasCommission > 0) {
        totalCommission += inv.payoutDetails.rmasCommission;
        statement.push({
          id: `comm_set_${inv.id}`,
          date: inv.payoutDetails.payoutDate,
          type: 'commission',
          description: `Settlement RMAS Commission`,
          source: `Inv ID: #${inv.id}`,
          amount: inv.payoutDetails.rmasCommission
        });
      }
      if (inv.payoutDetails.happyIncomeTax > 0) {
        totalTax += inv.payoutDetails.happyIncomeTax;
        statement.push({
          id: `tax_set_${inv.id}`,
          date: inv.payoutDetails.payoutDate,
          type: 'tax',
          description: `Tax Deduction`,
          source: `Inv ID: #${inv.id}`,
          amount: inv.payoutDetails.happyIncomeTax
        });
      }
    }
  });

  // Add Business Registration Charges
  state.businesses.forEach((b) => {
    if (b.registrationCommissionPaid && b.registrationCommissionPaid > 0) {
      totalCommission += b.registrationCommissionPaid;
      statement.push({
        id: `reg_bus_comm_${b.id}`,
        date: b.registrationDate,
        type: 'commission',
        description: `Business Registration RMAS Commission`,
        source: b.name,
        amount: b.registrationCommissionPaid
      });
    }
    if (b.taxPaid && b.taxPaid > 0) {
      totalTax += b.taxPaid;
      statement.push({
        id: `reg_bus_tax_${b.id}`,
        date: b.registrationDate,
        type: 'tax',
        description: `Business Registration Tax`,
        source: b.name,
        amount: b.taxPaid
      });
    }
  });

  // Add Investor Registration Charges
  state.investors.forEach((i) => {
    if (i.rmasServiceCharge && i.rmasServiceCharge > 0) {
      totalCommission += i.rmasServiceCharge;
      statement.push({
        id: `reg_inv_comm_${i.id}`,
        date: i.joinDate,
        type: 'commission',
        description: `Investor Registration Service Charge`,
        source: i.name,
        amount: i.rmasServiceCharge
      });
    }
  });

  // Sort statement by date
  statement.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (showStatement) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
          <button onClick={() => setShowStatement(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-black tracking-tight">P&L Detailed Statement</h2>
            <p className="text-sm font-semibold text-gray-500 mt-1">Transaction history of commissions and taxes collected.</p>
          </div>
        </div>

        <div className="bg-white border border-black rounded-sm overflow-x-auto shadow-sm">
           <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-black font-bold uppercase text-xs tracking-wider text-black">
                <tr>
                  <th className="py-4 px-6 w-32">Date</th>
                  <th className="py-4 px-6 text-center w-32">Type</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6 text-right">Amount Credited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-base">
                {statement.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium tracking-wide uppercase text-sm">No P&L Records Found</td>
                  </tr>
                ) : (
                  statement.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 font-medium text-gray-600">{new Date(row.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${row.type === 'commission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{row.description}</td>
                      <td className="py-4 px-6 text-gray-500">{row.source}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-black border-l border-transparent group-hover:border-gray-200">
                        {formatINR(row.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-black tracking-tight">MY P&L Overview</h2>
        <p className="text-sm font-semibold text-gray-500 mt-2">Track total administrative commissions and tax deductions collected across all investments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 mb-8">
             <span className="font-bold uppercase tracking-widest text-sm text-blue-600">Total Commissions</span>
             <Percent size={28} className="text-blue-200" />
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black tracking-tight text-black mb-2">{formatINR(totalCommission)}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Revenue from RMAS Admin Deductions</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 mb-8">
            <span className="font-bold uppercase tracking-widest text-sm text-purple-600">Total Taxes Collected</span>
            <Landmark size={28} className="text-purple-200" />
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black tracking-tight text-black mb-2">{formatINR(totalTax)}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Revenue from Tax Deductions</p>
          </div>
        </div>
      </div>

      <div className="pt-8 w-full md:w-auto">
        <button 
          onClick={() => setShowStatement(true)}
          className="w-full md:w-auto bg-black text-white font-bold py-4 px-10 border border-black rounded-sm flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <List size={22} />
          <span>View Detailed P&L Statement</span>
        </button>
      </div>
    </div>
  );
}
