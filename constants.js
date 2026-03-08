/**
 * constants.js
 * App-wide constants — never mutated at runtime.
 */

const STORAGE_KEY = 'smart_expense_tracker_v1';

const CATEGORY_META = Object.freeze({
  Food:          { label: 'Makanan',      icon: '🍔' },
  Transport:     { label: 'Transportasi', icon: '🚗' },
  Salary:        { label: 'Gaji',         icon: '💼' },
  Utilities:     { label: 'Tagihan',      icon: '💡' },
  Entertainment: { label: 'Hiburan',      icon: '🎬' },
  Shopping:      { label: 'Belanja',      icon: '🛒' },
  Health:        { label: 'Kesehatan',    icon: '🏥' },
  Investment:    { label: 'Investasi',    icon: '📈' },
  Bonus:         { label: 'Bonus',        icon: '🎁' },
  Other:         { label: 'Lainnya',      icon: '📦' },
});

const EXPENSE_CATEGORIES = Object.freeze([
  'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other',
]);

const INCOME_CATEGORIES = Object.freeze([
  'Salary', 'Investment', 'Bonus', 'Other',
]);

const EXPENSE_COLORS = Object.freeze([
  '#f87171', '#fb923c', '#fbbf24', '#a3e635',
  '#818cf8', '#c084fc', '#38bdf8', '#34d399',
]);

const INCOME_COLORS = Object.freeze([
  '#34d399', '#38bdf8', '#a3e635', '#fbbf24',
  '#818cf8', '#c084fc', '#fb923c', '#f87171',
]);
