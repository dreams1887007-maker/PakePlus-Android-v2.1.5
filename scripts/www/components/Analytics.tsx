import React, { useMemo, useState } from 'react';
import { Transaction, Budget } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Settings, Save } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface AnalyticsProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (budget: Budget) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

const Analytics: React.FC<AnalyticsProps> = ({ transactions, budgets, onUpdateBudget }) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const expenses = transactions.filter(t => t.type === 'expense');

  // Prepare Pie Chart Data (Expenses by Category)
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Prepare Bar Chart Data (Last 7 Days Spending)
  const dailyData = useMemo(() => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const dailyTotal = expenses
        .filter(t => t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.amount, 0);
        
      data.push({
        name: d.toLocaleDateString('zh-CN', { weekday: 'short' }),
        amount: dailyTotal
      });
    }
    return data;
  }, [expenses]);

  // Calculate Budget Progress
  const budgetProgress = useMemo(() => {
    // Get spending for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const spendingMap = new Map<string, number>();
    currentMonthExpenses.forEach(t => {
      spendingMap.set(t.category, (spendingMap.get(t.category) || 0) + t.amount);
    });

    return CATEGORIES.expense.map(cat => {
      const spent = spendingMap.get(cat) || 0;
      const budgetItem = budgets.find(b => b.category === cat);
      const limit = budgetItem ? budgetItem.limit : 0;
      const percent = limit > 0 ? (spent / limit) * 100 : 0;
      return { category: cat, spent, limit, percent };
    }).filter(item => isEditingBudget || item.limit > 0 || item.spent > 0);
  }, [expenses, budgets, isEditingBudget]);

  const handleBudgetChange = (category: string, value: string) => {
    const num = parseFloat(value);
    onUpdateBudget({ category, limit: isNaN(num) ? 0 : num });
  };

  if (expenses.length === 0 && !isEditingBudget) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20 text-gray-400">
        <p>暂无支出数据分析</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Spending by Category */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">分类支出占比</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Budget Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">月度预算 (本月)</h3>
          <button 
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
          >
            {isEditingBudget ? <Save className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="space-y-4">
          {budgetProgress.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{item.category}</span>
                {isEditingBudget ? (
                   <div className="flex items-center gap-1">
                     <span className="text-gray-400 text-xs">¥</span>
                     <input 
                       type="number" 
                       value={item.limit || ''} 
                       onChange={(e) => handleBudgetChange(item.category, e.target.value)}
                       className="w-20 border border-gray-200 rounded px-2 py-1 text-right text-sm focus:outline-none focus:border-indigo-500"
                       placeholder="0"
                     />
                   </div>
                ) : (
                   <span className="text-gray-500">
                     ¥{item.spent.toFixed(0)} <span className="text-xs text-gray-400">/ {item.limit > 0 ? `¥${item.limit}` : '∞'}</span>
                   </span>
                )}
              </div>
              
              {!isEditingBudget && item.limit > 0 && (
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percent > 100 ? 'bg-red-500' : 
                      item.percent > 80 ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
          {budgetProgress.length === 0 && !isEditingBudget && (
            <p className="text-center text-sm text-gray-400 py-4">点击设置按钮来设定预算</p>
          )}
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">近7天趋势</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#f3f4f6'}} formatter={(value: number) => `¥${value.toFixed(2)}`} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
