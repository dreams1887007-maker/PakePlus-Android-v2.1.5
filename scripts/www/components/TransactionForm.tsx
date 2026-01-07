import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, CategoryItem } from '../types';
import { EXPENSE_CATEGORIES_TREE, INCOME_CATEGORIES_TREE, CATEGORIES } from '../constants';
import Button from './Button';
import { Camera, ChevronLeft, ChevronRight, Calendar, PenLine, Check, Trash2 } from 'lucide-react';
import { parseReceiptImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import { CategoryIcon } from './CategoryIcons';

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onCancel, onDelete, initialData }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  
  // Category State
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  
  // Navigation State for Categories
  const currentTree = type === 'expense' ? EXPENSE_CATEGORIES_TREE : INCOME_CATEGORIES_TREE;
  const [currentLevelItems, setCurrentLevelItems] = useState<CategoryItem[]>(currentTree);
  const [breadcrumbs, setBreadcrumbs] = useState<CategoryItem[]>([]);

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form if editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setDate(initialData.date.split('T')[0]);
      setNote(initialData.note);
      setMainCategory(initialData.category);
      setSubCategory(initialData.subCategory || '');

      // Logic to restore breadcrumbs based on category
      const tree = initialData.type === 'expense' ? EXPENSE_CATEGORIES_TREE : INCOME_CATEGORIES_TREE;
      const targetMain = tree.find(c => c.name === initialData.category);
      
      if (targetMain) {
        // If we have a subcategory, we need to drill down
        if (initialData.subCategory && targetMain.children) {
           setBreadcrumbs([targetMain]);
           setCurrentLevelItems(targetMain.children);
        } else {
           // Provide visual feedback even if top level
           // But keeping it at top level allows easy switching
           setBreadcrumbs([]);
           setCurrentLevelItems(tree); 
        }
      }
    }
  }, [initialData]);

  // Reset category selection when type changes (only if not initializing)
  useEffect(() => {
    if (initialData && initialData.type === type) return; // Prevent reset on init

    setCurrentLevelItems(type === 'expense' ? EXPENSE_CATEGORIES_TREE : INCOME_CATEGORIES_TREE);
    setBreadcrumbs([]);
    // Only clear categories if user manually switched type
    if (!initialData || initialData.type !== type) {
        setMainCategory('');
        setSubCategory('');
    }
  }, [type, initialData]);

  const handleCategorySelect = (item: CategoryItem) => {
    if (item.children && item.children.length > 0) {
      // Drill down
      setBreadcrumbs([...breadcrumbs, item]);
      setCurrentLevelItems(item.children);
      
      // If it's the first level, set it as main category
      if (breadcrumbs.length === 0) {
        setMainCategory(item.name);
      }
    } else {
      // Leaf node selected
      if (breadcrumbs.length === 0) {
         setMainCategory(item.name);
         setSubCategory('');
      } else {
         setMainCategory(breadcrumbs[0].name);
         setSubCategory(item.name);
      }
    }
  };

  const handleBackUp = () => {
    if (breadcrumbs.length === 0) return;
    
    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.pop();
    setBreadcrumbs(newBreadcrumbs);
    
    if (newBreadcrumbs.length === 0) {
      setCurrentLevelItems(type === 'expense' ? EXPENSE_CATEGORIES_TREE : INCOME_CATEGORIES_TREE);
      setMainCategory('');
      setSubCategory('');
    } else {
      const lastItem = newBreadcrumbs[newBreadcrumbs.length - 1];
      setCurrentLevelItems(lastItem.children || []);
    }
  };

  const isCategorySelected = (item: CategoryItem) => {
    if (subCategory === item.name) return true;
    if (mainCategory === item.name && !subCategory && breadcrumbs.length === 0) return true;
    return false;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || !mainCategory) return;

    const newTransaction: Transaction = {
      id: initialData ? initialData.id : uuidv4(),
      amount: parseFloat(amount),
      type,
      category: mainCategory,
      subCategory: subCategory || undefined,
      date: new Date(date).toISOString(),
      note: note || (subCategory ? `${mainCategory}-${subCategory}` : mainCategory)
    };

    onSave(newTransaction);
  };

  const handleDelete = () => {
      if (initialData && onDelete) {
          if (confirm('确定要删除这笔账单吗？')) {
              onDelete(initialData.id);
          }
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      try {
        const data = await parseReceiptImage(base64Data);
        if (data.amount) setAmount(data.amount.toString());
        if (data.date) setDate(data.date);
        if (data.merchant) setNote(data.merchant);
        if (data.category && CATEGORIES.expense.includes(data.category)) {
             setMainCategory(data.category);
             setSubCategory('');
             setType('expense');
        }
      } catch (error) {
        alert("无法识别收据，请重试或手动输入。");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden animate-fade-in">
      {/* 1. Top Navigation Bar */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-50 shadow-sm z-10 bg-white/80 backdrop-blur-md">
        <button 
          onClick={onCancel} 
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-lg font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
          {initialData ? '编辑账单' : '记一笔'}
        </h2>
        
        <div className="flex items-center gap-2">
            {initialData && onDelete && (
                <button 
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            )}
            <button 
            onClick={() => handleSubmit()} 
            disabled={!amount || !mainCategory}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                amount && mainCategory 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            >
            保存
            </button>
        </div>
      </div>

      {/* 2. Compact Input Section (Amount & Type) */}
      <div className="px-6 py-4 bg-white flex flex-col items-center">
        {/* Type Switcher - Small Caps */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-3 w-40">
          <button 
            className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${type === 'expense' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setType('expense')}
          >
            支出
          </button>
          <button 
            className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${type === 'income' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setType('income')}
          >
            收入
          </button>
        </div>

        {/* Amount Input - Hero Style */}
        <div className="relative w-full text-center mb-2">
            <span className={`absolute top-2 text-2xl font-bold ${type === 'expense' ? 'text-gray-900' : 'text-green-600'}`}>¥</span>
            <input
              type="number"
              step="0.01"
              required
              autoFocus={!initialData} 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full text-center text-5xl font-bold bg-transparent outline-none placeholder-gray-200 ${type === 'expense' ? 'text-gray-900' : 'text-green-600'}`}
              placeholder="0.00"
            />
        </div>

        {/* Meta Bar: Date | Note | Camera */}
        <div className="flex items-center gap-3 w-full mt-2">
           <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm text-gray-600 outline-none w-full"
              />
           </div>
           <div className="flex-[1.5] flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <PenLine className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="添加备注..."
                className="bg-transparent text-sm text-gray-900 outline-none w-full placeholder-gray-400"
              />
           </div>
           {type === 'expense' && (
             <>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-lg border transition-colors flex-shrink-0 ${isScanning ? 'bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                >
                  <Camera className="w-4 h-4" />
                </button>
             </>
           )}
        </div>
      </div>

      {/* 3. Category Grid - Flex Grow to take remaining space */}
      <div className="flex-1 bg-gray-50/50 border-t border-gray-100 overflow-y-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 px-2">
            {breadcrumbs.length > 0 && (
              <button onClick={handleBackUp} className="mr-1 p-1 -ml-1 hover:bg-gray-200 rounded-full">
                <ChevronLeft className="w-4 h-4 text-indigo-600" />
              </button>
            )}
            <span className={breadcrumbs.length === 0 ? "font-bold text-gray-900" : ""}>
              {type === 'expense' ? '全部' : '全部'}
            </span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="w-3 h-3 text-gray-300" />
                <span className={index === breadcrumbs.length - 1 ? "font-bold text-gray-900" : ""}>
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-5 gap-y-6 gap-x-2">
          {currentLevelItems.map((item) => {
            const isActive = isCategorySelected(item);
            const colorClass = isActive 
              ? (item.color || 'bg-indigo-100 text-indigo-600') 
              : 'bg-white text-gray-400 border border-gray-100 shadow-sm';

            return (
              <button
                key={item.id}
                onClick={() => handleCategorySelect(item)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${colorClass} ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-indigo-100 shadow-lg' : ''}`}>
                  <CategoryIcon iconName={item.icon} className="w-6 h-6" />
                  {/* Indicator for subcategories */}
                  {item.children && item.children.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                       <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] text-center truncate w-full font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
