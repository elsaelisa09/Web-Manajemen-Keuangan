
export type TransactionType = 'income' | 'expense' | 'savings';

export type TransactionCategory = 
  | 'salary' | 'bonus' | 'gift' | 'investment' // income
  | 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'health' | 'education' // expense
  | 'emergency' | 'vacation' | 'investment' | 'general'; // savings

export type DebtType = 'owe' | 'owed'; // owe = saya hutang ke orang, owed = orang hutang ke saya

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Debt {
  id: string;
  user_id: string;
  person_name: string;
  amount: number;
  type: DebtType;
  description?: string;
  due_date?: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  description?: string;
  emoji: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  balance: number;
  totalOwed: number; // total uang yang orang hutang ke kita
  totalOwe: number; // total hutang kita ke orang
}
