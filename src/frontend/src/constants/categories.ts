// Expense categories (alphabetically sorted)
export const EXPENSE_CATEGORIES = [
  'AK Expenses',
  'EB Bill',
  'Internet Bill',
  'Mobile Bill',
  'Online Shopping',
  'Snacks',
] as const;

// Saving categories (alphabetically sorted)
export const SAVING_CATEGORIES = [
  'FD',
  'PPF',
  'RD',
  'SIP',
  'Saving Box',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type SavingCategory = typeof SAVING_CATEGORIES[number];
export type Category = ExpenseCategory | SavingCategory;
