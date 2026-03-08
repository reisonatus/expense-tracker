/**
 * storage.js
 * Thin wrapper around localStorage.
 * All reads/writes go through here so the rest of the app stays storage-agnostic.
 */

/**
 * Load transactions array from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 * @returns {Array}
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[storage] Failed to load:', err);
    return [];
  }
}

/**
 * Persist the transactions array to localStorage.
 * @param {Array} transactions
 */
function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.warn('[storage] Failed to save:', err);
  }
}
