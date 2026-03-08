/**
 * utils.js
 * Pure, side-effect-free helper functions.
 */

/**
 * Generate a collision-resistant unique ID.
 * @returns {string}
 */
function uid() {
  return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

/**
 * Parse a "YYYY-MM-DD" string as a LOCAL date (avoids UTC-midnight timezone bug).
 * @param {string} dateStr
 * @returns {Date}
 */
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format a "YYYY-MM-DD" string to a human-readable Indonesian date.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  return parseLocalDate(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Format a number to Indonesian locale string (e.g. 1500000 → "1.500.000").
 * @param {number} n
 * @returns {string}
 */
function formatNumber(n) {
  return Math.abs(n).toLocaleString('id-ID');
}

/**
 * Format a number as Rupiah (e.g. 1500000 → "Rp 1.500.000").
 * @param {number} n
 * @returns {string}
 */
function formatRupiah(n) {
  return 'Rp\u00A0' + formatNumber(n);
}

/**
 * Parse a formatted number string back to an integer (strips non-digit chars).
 * @param {string} str
 * @returns {number}
 */
function parseAmount(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

/**
 * Safely escape a string for insertion into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/**
 * Get the emoji icon for a given category key.
 * @param {string} cat
 * @returns {string}
 */
function getCategoryIcon(cat) {
  return CATEGORY_META[cat]?.icon ?? '📦';
}
