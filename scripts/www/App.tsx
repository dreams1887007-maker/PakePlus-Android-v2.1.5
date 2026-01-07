import React, { useState, useEffect } from 'react';
import { Transaction, Budget, Asset, AppView } from './types';
import { getTransactions, saveTransactions, getBudgets, saveBudgets, getAssets, saveAssets } from './services/storageService';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import AssetsView from './components/AssetsView';
import Advisor from './components/Advisor';
import Navigation from './components/Navigation';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.BILL);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // State for editing
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load initial data
  useEffect(() => {
    const data = getTransactions();
    const budgetData = getBudgets();
    const assetsData = getAssets();
    setTransactions(data);
    setBudgets(budgetData);
    setAssets(assetsData);
    setLoading(false);
  }, []);

  // Save data on change
  useEffect(() => {
    if (!loading) {
      saveTransactions(transactions);
      saveBudgets(budgets);
      saveAssets(assets);
    }
  }, [transactions, budgets, assets, loading]);

  const handleSaveTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
        // Update existing
        setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
        setEditingTransaction(null);
    } else {
        // Create new
        setTransactions(prev => [transaction, ...prev]);
    }
    setCurrentView(AppView.BILL);
  };

  const handleDeleteTransaction = (id: string) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setEditingTransaction(null);
      setCurrentView(AppView.BILL);
  };

  const handleEditClick = (transaction: Transaction) => {
      setEditingTransaction(transaction);
      setCurrentView(AppView.ADD_TRANSACTION);
  };

  const handleCancelEdit = () => {
      setEditingTransaction(null);
      setCurrentView(AppView.BILL);
  };

  const handleUpdateBudget = (newBudget: Budget) => {
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === newBudget.category);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newBudget;
        return updated;
      }
      return [...prev, newBudget];
    });
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.BILL:
        return (
          <Dashboard 
            transactions={transactions} 
            onAddClick={() => {
                setEditingTransaction(null);
                setCurrentView(AppView.ADD_TRANSACTION);
            }} 
            onAdvisorClick={() => setCurrentView(AppView.ADVISOR)}
            onTransactionClick={handleEditClick}
          />
        );
      case AppView.ADD_TRANSACTION:
        return (
            <TransactionForm 
                onSave={handleSaveTransaction} 
                onCancel={handleCancelEdit}
                initialData={editingTransaction}
                onDelete={handleDeleteTransaction}
            />
        );
      case AppView.ASSETS:
        return <AssetsView assets={assets} onUpdateAsset={handleUpdateAsset} />;
      case AppView.ADVISOR:
        return <Advisor transactions={transactions} />;
      default:
        return (
          <Dashboard 
            transactions={transactions} 
            onAddClick={() => setCurrentView(AppView.ADD_TRANSACTION)} 
            onAdvisorClick={() => setCurrentView(AppView.ADVISOR)}
            onTransactionClick={handleEditClick}
          />
        );
    }
  };

  const getHeaderTitle = () => {
    switch(currentView) {
      case AppView.BILL: return 'Dream 记账';
      case AppView.ASSETS: return '我的资产';
      case AppView.ADD_TRANSACTION: return editingTransaction ? '编辑账单' : '记一笔';
      case AppView.ADVISOR: return '智能顾问';
      default: return 'Dream';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {/* Header - Now Centered */}
        <header className={`px-6 pt-12 pb-4 bg-white sticky top-0 z-30 flex items-center justify-between ${currentView === AppView.ADD_TRANSACTION ? 'hidden' : ''}`}>
             {/* Invisible spacer to balance the flex layout */}
             <div className="w-10"></div> 

             {/* Centered Title */}
             <div className="flex flex-col items-center">
                {currentView === AppView.BILL ? (
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Dream
                  </h1>
                ) : (
                  <h1 className="text-xl font-bold text-gray-900">
                    {getHeaderTitle()}
                  </h1>
                )}
             </div>

             {/* Right Side: Profile Icon */}
             <button 
               onClick={() => setIsProfileOpen(true)}
               className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 active:scale-95 transition-transform"
             >
                <span className="text-sm font-bold text-gray-600">Me</span>
             </button>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto no-scrollbar ${currentView === AppView.ADD_TRANSACTION ? 'pb-0' : 'px-6 pb-20'}`}>
          {renderContent()}
        </main>

        {/* Bottom Navigation - Hidden on Add Transaction screen for immersion */}
        {currentView !== AppView.ADD_TRANSACTION && (
          <Navigation currentView={currentView} onNavigate={(view) => {
              // Ensure we clear editing state when navigating via bottom bar
              setEditingTransaction(null);
              setCurrentView(view);
          }} />
        )}

        {/* User Profile Overlay */}
        <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </div>
    </div>
  );
};

export default App;
