export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  budget_limit: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  category_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category_name: string;
  category_type: 'income' | 'expense';
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: {
    category_id: number;
    category_name: string;
    type: 'income' | 'expense';
    total: number;
    budget_limit: number;
  }[];
}
