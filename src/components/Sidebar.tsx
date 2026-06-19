import { Building2, Users, ReceiptIndianRupee, LayoutDashboard, CreditCard, PieChart } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'businesses' as View, label: 'Businesses', icon: Building2 },
    { id: 'investors' as View, label: 'Investors', icon: Users },
    { id: 'investments' as View, label: 'Investments', icon: ReceiptIndianRupee },
    { id: 'banking' as View, label: 'Banking', icon: CreditCard },
    { id: 'pnl' as View, label: 'MY P&L', icon: PieChart },
  ];

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black break-words">
            RADHIKA MA<br/>SERVICE
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Secure Invest</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-semibold
                ${isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            RM
          </div>
          <div className="text-sm">
            <p className="font-semibold text-black">Radhika M</p>
            <p className="text-xs text-gray-500 font-medium">chif cmp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
