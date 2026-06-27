import { View } from"../types";
import { Bookmark, Gavel, User, Briefcase } from"lucide-react";
interface MobileBottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}
export default function MobileBottomNav({
  currentView,
  onNavigate,
}: MobileBottomNavProps) {
  // Mobile only requested buttons
  const navItems = [
    { id:"data-analysis" as View, label:"Analysis", icon: Bookmark },
    { id:"businesses" as View, label:"Businesses", icon: Gavel },
    { id:"investors" as View, label:"Investors", icon: User },
    { id:"investments" as View, label:"Investments", icon: Briefcase },
  ];
  return (
    <>
      {""}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-0.5 ${isActive ?"text-kite-blue" :"text-gray-500 hover:text-gray-800"}`}
          >
            <Icon
              className={`w-[22px] h-[22px] ${isActive ?"text-kite-blue" :"text-gray-400"}`}
              strokeWidth={isActive ? 2 : 1.5}
            />
            <span
              className={`text-[10px] md:text-[11px] font-medium tracking-wide ${isActive ?"text-kite-blue" :"text-gray-500"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}{""}
    </>
  );
}
