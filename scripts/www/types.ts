export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string; // Main category (Level 1)
  subCategory?: string; // Detailed category (Level 2 or 3)
  date: string; // ISO String
  note: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export type AssetType = 'wechat' | 'alipay' | 'bank' | 'cash' | 'other';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  accountNumber?: string; // Last 4 digits for bank cards
}

export interface ExpenseSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export enum AppView {
  BILL = 'BILL', // Formerly Dashboard/Home
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  ASSETS = 'ASSETS', // Formerly Analytics
  ADVISOR = 'ADVISOR' // Accessed via floating elf only
}

export interface ReceiptData {
  amount?: number;
  date?: string;
  merchant?: string;
  category?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  children?: CategoryItem[];
}
