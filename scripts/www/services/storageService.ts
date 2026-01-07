import { Transaction, Budget, Asset } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_ASSETS } from '../constants';

const STORAGE_KEY = 'dream_transactions_v1';
const BUDGET_STORAGE_KEY = 'dream_budgets_v1';
const ASSETS_STORAGE_KEY = 'dream_assets_v1';

export const getTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load transactions", e);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
};

export const getBudgets = (): Budget[] => {
  try {
    const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load budgets", e);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]) => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
  } catch (e) {
    console.error("Failed to save budgets", e);
  }
};

export const getAssets = (): Asset[] => {
  try {
    const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (!stored) {
      return INITIAL_ASSETS;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load assets", e);
    return INITIAL_ASSETS;
  }
};

export const saveAssets = (assets: Asset[]) => {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error("Failed to save assets", e);
  }
};
