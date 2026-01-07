import React from 'react';
import { AppView } from '../types';
import { ScrollText, Wallet, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItemClass = (view: AppView) => `
    flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors
    ${currentView === view ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}
  `;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 px-6 pb-4 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center h-full max-w-sm mx-auto relative px-8">
        
        {/* Bill (Home) */}
        <button className={navItemClass(AppView.BILL)} onClick={() => onNavigate(AppView.BILL)}>
          <ScrollText className={`w-6 h-6 ${currentView === AppView.BILL ? 'fill-indigo-100' : ''}`} />
          <span>账单</span>
        </button>

        {/* Floating Add Button Wrapper (Centered) */}
        <div className="relative -top-6">
           <button 
             onClick={() => onNavigate(AppView.ADD_TRANSACTION)}
             className="w-16 h-16 bg-indigo-600 rounded-full shadow-xl shadow-indigo-300 flex items-center justify-center text-white transform hover:scale-105 transition-all active:scale-95 border-4 border-gray-50"
           >
             <Plus className="w-8 h-8" />
           </button>
        </div>

        {/* Assets (Formerly Analytics) */}
        <button className={navItemClass(AppView.ASSETS)} onClick={() => onNavigate(AppView.ASSETS)}>
          <Wallet className={`w-6 h-6 ${currentView === AppView.ASSETS ? 'fill-indigo-100' : ''}`} />
          <span>资产</span>
        </button>

      </div>
    </div>
  );
};

export default Navigation;
