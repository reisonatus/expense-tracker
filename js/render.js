/**
 * render.js
 * All DOM rendering functions. Reads from app state, writes to DOM only.
 */

/* ── Dashboard ──────────────────────────────────────────── */

/**
 * Recalculate totals and update the three summary cards.
 * @param {Array} transactions
 */
function renderDashboard(transactions) {
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income  += t.amount;
        acc.balance += t.amount;
      } else {
        acc.expense += t.amount;
        acc.balance -= t.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 }
  );

  document.getElementById('totalBalance').textContent = formatRupiah(totals.balance);
  document.getElementById('totalIncome').textContent  = formatRupiah(totals.income);
  document.getElementById('totalExpense').textContent = formatRupiah(totals.expense);
}

/* ── Transaction list ───────────────────────────────────── */

/**
 * Return a filtered + sorted copy of transactions based on the current
 * filter/sort control values.
 * @param {Array} transactions
 * @returns {Array}
 */
function getFilteredTransactions(transactions) {
  const cat  = document.getElementById('filterCategory').value;
  const type = document.getElementById('filterType').value;
  const sort = document.getElementById('sortOrder').value;

  return [...transactions]
    .filter(t => cat  === 'all' || t.category === cat)
    .filter(t => type === 'all' || t.type     === type)
    .sort((a, b) => {
      switch (sort) {
        case 'newest':  return parseLocalDate(b.date) - parseLocalDate(a.date);
        case 'oldest':  return parseLocalDate(a.date) - parseLocalDate(b.date);
        case 'highest': return b.amount - a.amount;
        case 'lowest':  return a.amount - b.amount;
        default:        return 0;
      }
    });
}

/**
 * Render the transaction list into the DOM using a DocumentFragment.
 * @param {Array} transactions
 */
function renderList(transactions) {
  const listEl  = document.getElementById('txList');
  const emptyEl = document.getElementById('emptyState');
  const data    = getFilteredTransactions(transactions);

  listEl.innerHTML = '';

  if (data.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  const frag = document.createDocumentFragment();

  data.forEach(tx => {
    const li = document.createElement('li');
    li.className = 'tx-item';
    li.innerHTML = `
      <div class="tx-icon">${getCategoryIcon(tx.category)}</div>
      <div class="tx-info">
        <div class="tx-title"></div>
        <div class="tx-meta"></div>
      </div>
      <div class="tx-amount ${tx.type}"></div>
      <button class="btn-delete" aria-label="Hapus transaksi" data-id="${tx.id}">×</button>`;

    // Use textContent for user-supplied strings to prevent XSS
    li.querySelector('.tx-title').textContent = tx.title;
    li.querySelector('.tx-meta').textContent  =
      `${CATEGORY_META[tx.category]?.label ?? tx.category} · ${formatDate(tx.date)}`;
    li.querySelector('.tx-amount').textContent =
      `${tx.type === 'income' ? '+' : '−'} ${formatRupiah(tx.amount)}`;

    frag.appendChild(li);
  });

  listEl.appendChild(frag);
}

/* ── Full re-render ─────────────────────────────────────── */

/**
 * Re-render every part of the UI.
 * Called after any state mutation (add / delete transaction).
 * @param {Array} transactions
 */
function renderAll(transactions) {
  renderDashboard(transactions);
  renderList(transactions);
  renderChart(transactions);
}
