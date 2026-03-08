/**
 * ui.js
 * UI helpers: toast notifications, form validation, category switcher.
 */

/* ── Toast ──────────────────────────────────────────────── */

/**
 * Show a non-blocking toast message.
 * @param {string} msg
 * @param {'success'|'error'|'info'} type
 */
function showToast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  el.setAttribute('role', 'status');
  document.getElementById('toastContainer').appendChild(el);
  // Animation duration is 2.8s (see CSS keyframes)
  setTimeout(() => el.remove(), 2800);
}

/* ── Field validation helpers ───────────────────────────── */

/**
 * Mark a field as invalid and show an error message.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 * @param {string} msg
 */
function setFieldError(inputEl, errorEl, msg) {
  inputEl.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg;
  errorEl.classList.add('visible');
}

/**
 * Clear the error state from a field.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 */
function clearFieldError(inputEl, errorEl) {
  inputEl.removeAttribute('aria-invalid');
  errorEl.classList.remove('visible');
}

/**
 * Validate the transaction form.
 * Shows inline errors and returns false if any field is invalid.
 * @returns {boolean}
 */
function validateForm() {
  const title     = document.getElementById('txTitle');
  const amount    = document.getElementById('txAmount');
  const date      = document.getElementById('txDate');
  const errTitle  = document.getElementById('errTitle');
  const errAmount = document.getElementById('errAmount');
  const errDate   = document.getElementById('errDate');

  let ok = true;

  if (!title.value.trim()) {
    setFieldError(title, errTitle, 'Nama transaksi wajib diisi.');
    ok = false;
  } else {
    clearFieldError(title, errTitle);
  }

  if (parseAmount(amount.value) <= 0) {
    setFieldError(amount, errAmount, 'Nominal harus lebih dari 0.');
    ok = false;
  } else {
    clearFieldError(amount, errAmount);
  }

  if (!date.value) {
    setFieldError(date, errDate, 'Tanggal wajib diisi.');
    ok = false;
  } else {
    clearFieldError(date, errDate);
  }

  return ok;
}

/* ── Category dropdown ──────────────────────────────────── */

/**
 * Repopulate the category <select> based on transaction type.
 * @param {'income'|'expense'} type
 */
function updateCategoryOptions(type) {
  const sel  = document.getElementById('txCategory');
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  sel.innerHTML = cats
    .map(c => `<option value="${c}">${CATEGORY_META[c].icon} ${CATEGORY_META[c].label}</option>`)
    .join('');
}
