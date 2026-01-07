import React, { useMemo } from 'react';
import { Transaction } from '../types';
import TransactionCard from './TransactionCard';
import { Wallet, TrendingDown, TrendingUp, Bot, Sparkles } from 'lucide-react';
import Button from './Button';

interface DashboardProps {
  transactions: Transaction[];
  onAddClick: () => void;
  onAdvisorClick: () => void;
  onTransactionClick: (t: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddClick, onAdvisorClick, onTransactionClick }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const balance = totalIncome - totalExpense;

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: { date: Date, items: Transaction[], totalIncome: number, totalExpense: number } } = {};
    
    // Sort items by date desc first
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sorted.forEach(t => {
      const dateKey = t.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: new Date(t.date),
          items: [],
          totalIncome: 0,
          totalExpense: 0
        };
      }
      groups[dateKey].items.push(t);
      if (t.type === 'income') groups[dateKey].totalIncome += t.amount;
      else groups[dateKey].totalExpense += t.amount;
    });

    return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);

  const formatDateTitle = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (dateString === todayString) return '今天';
    if (dateString === yesterdayString) return '昨天';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  };

  return (
    <div className="space-y-6 pb-24 relative">
      {/* Floating Elf Advisor Widget */}
      <div 
        className="fixed bottom-32 right-6 z-40 cursor-pointer group"
        onClick={onAdvisorClick}
      >
        <div className="relative animate-bounce">
           {/* Speech Bubble */}
           <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-white px-3 py-2 rounded-xl rounded-tr-none shadow-lg border border-indigo-50 w-auto whitespace-nowrap transition-opacity duration-300">
              <p className="text-xs font-semibold text-indigo-600">Dream 精灵在线 ✨</p>
              <p className="text-[10px] text-gray-400">点击咨询理财建议</p>
           </div>
           
           {/* The Elf Avatar */}
           <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-xl shadow-indigo-300 flex items-center justify-center border-[3px] border-white transform transition-transform group-hover:scale-110">
              <Bot className="w-7 h-7 text-white" />
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
           </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">总资产</p>
            <h1 className="text-4xl font-bold tracking-tight">¥{balance.toFixed(2)}</h1>
          </div>
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-indigo-100" />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-300" />
              </div>
              <span className="text-xs text-indigo-100">收入</span>
            </div>
            <p className="font-semibold text-lg">¥{totalIncome.toFixed(0)}</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-orange-400/20 flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-orange-300" />
              </div>
              <span className="text-xs text-indigo-100">支出</span>
            </div>
            <p className="font-semibold text-lg">¥{totalExpense.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Grouped */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">收支明细</h2>
        </div>
        
        {groupedTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 mt-4">
            <p className="text-gray-400 mb-4">暂无交易记录</p>
            <Button onClick={onAddClick} variant="ghost" className="mx-auto">
              添加第一笔
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTransactions.map((group, index) => (
              <div key={index}>
                 {/* Date Header */}
                 <div className="flex justify-between items-end mb-3 px-2">
                    <div className="flex items-baseline gap-2">
                       <span className="font-bold text-gray-900 text-base">{formatDateTitle(group.date)}</span>
                       <span className="text-xs text-gray-400">{getDayOfWeek(group.date)}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex gap-3">
                       {group.totalIncome > 0 && <span>收 +{group.totalIncome.toFixed(2)}</span>}
                       {group.totalExpense > 0 && <span>支 -{group.totalExpense.toFixed(2)}</span>}
                    </div>
                 </div>
                 
                 {/* List */}
                 <div className="space-y-3">
                    {group.items.map(t => (
                      <TransactionCard 
                        key={t.id} 
                        transaction={t} 
                        onClick={() => onTransactionClick(t)} 
                      />
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
