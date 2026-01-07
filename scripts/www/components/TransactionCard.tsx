import React from 'react';
import { Transaction } from '../types';
import { CategoryIcon } from './CategoryIcons';
import { EXPENSE_CATEGORIES_TREE, INCOME_CATEGORIES_TREE } from '../constants';

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (t: Transaction) => void;
}

// Helper to find icon name for a category from the tree
const findIconForCategory = (categoryName: string, subCategoryName?: string, type: 'expense' | 'income' = 'expense'): string => {
  const tree = type === 'expense' ? EXPENSE_CATEGORIES_TREE : INCOME_CATEGORIES_TREE;
  
  // Try to find in top level
  const main = tree.find(c => c.name === categoryName);
  
  if (main) {
    // If subcategory exists, try to find its icon
    if (subCategoryName && main.children) {
      // Search level 2
      let sub = main.children.find(c => c.name === subCategoryName);
      if (sub) return sub.icon;
      
      // Search level 3
      for (const child of main.children) {
        if (child.children) {
           sub = child.children.find(c => c.name === subCategoryName);
           if (sub) return sub.icon;
        }
      }
    }
    return main.icon;
  }
  return 'HelpCircle';
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const isExpense = transaction.type === 'expense';
  
  // Determine display name: Show "Main - Sub" or just "Main"
  const displayName = transaction.subCategory 
    ? transaction.subCategory 
    : transaction.category;

  const iconName = findIconForCategory(transaction.category, transaction.subCategory, transaction.type);

  return (
    <div 
      onClick={() => onClick(transaction)}
      className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isExpense ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' : 'bg-green-50 text-green-600 group-hover:bg-green-100'}`}>
          <CategoryIcon iconName={iconName} className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
             {displayName}
             {transaction.subCategory && <span className="text-xs text-gray-400 font-normal ml-2">{transaction.category}</span>}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">{transaction.note || '无备注'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isExpense ? 'text-gray-900' : 'text-green-600'}`}>
          {isExpense ? '-' : '+'} ¥{transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
