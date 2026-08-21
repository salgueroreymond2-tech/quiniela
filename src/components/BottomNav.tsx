import React from 'react';
import { LayoutDashboard, BarChart3, Trophy, MessageSquare, User } from 'lucide-react';

export type NavTab = 'dashboard' | 'ranking' | 'playoffs' | 'social' | 'profile' | 'admin' | 'login';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  if (activeTab === 'login' || activeTab === 'admin') return null;

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'ranking', label: 'Ranking', icon: BarChart3 },
    { id: 'playoffs', label: 'Playoffs', icon: Trophy },
    { id: 'social', label: 'Social', icon: MessageSquare },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#140b16]/95 backdrop-blur-lg border-t border-[#3c313e]/70 px-2 py-2 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#bf00ff] text-white shadow-lg glow-purple-sm scale-105'
                  : 'text-[#d5c0d7]/70 hover:text-white hover:bg-[#261c28]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
