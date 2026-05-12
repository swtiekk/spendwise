export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Transaction {
  id: number;
  amount: string;
  transaction_date: string;
  store_branch: string | null;
  category: 'food' | 'beverage' | 'snacks' | 'utilities' | 'personal_care' | 'others';
  item_description: string | null;
  source: 'ocr' | 'manual';
  created_at: string;
}

export interface Budget {
  id: number;
  income: string;
  cycle: 'monthly' | 'weekly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Receipt {
  id: number;
  image: string;
  raw_ocr_text: string | null;
  extracted_amount: string | null;
  extracted_date: string | null;
  extracted_store: string | null;
  extracted_category: string | null;
  ocr_confidence: number | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface BudgetSummary {
  income: string;
  cycle: string;
  start_date: string;
  end_date: string;
  total_spent: number;
  remaining: number;
  transactions: number;
}
