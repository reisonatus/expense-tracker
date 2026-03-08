/**
 * events.js
 * Wires up all DOM event listeners.
 * Receives the mutable state object so handlers can read/write it.
 *
 * @param {{ transactions: Array }} state - Shared mutable state reference
 */
function setupEventListeners(state) {
  const btnExpense = document.getElementById('btnExpense');
  const btnIncome  = document.getElementById('btnIncome');
  const txTypeEl   = document.getElementById('txType');
  const txAmountEl = document.getElementById('txAmount');

  // ── Type toggle ────────────────────────────────────────
  function switchType(type) {
    txTypeEl.value = type;
    btnExpense.setAttribute('aria-pressed', String(type === 'expense'));
    btnIncome.setAttribute('aria-pressed',  String(type === 'income'));
    updateCategoryOptions(type);
  }

  btnExpense.addEventListener('click', () => switchType('expense'));
  btnIncome.addEventListener('click',  () => switchType('income'));

  // ── Amount — live formatting ───────────────────────────
  txAmountEl.addEventListener('input', function () {
    const raw = parseAmount(this.value);
    this.value = raw > 0 ? raw.toLocaleString('id-ID') : '';
    clearFieldError(this, document.getElementById('errAmount'));
  });

  // ── Live clear-error on title / date ──────────────────
  document.getElementById('txTitle').addEventListener('input', function () {
    clearFieldError(this, document.getElementById('errTitle'));
  });
  document.getElementById('txDate').addEventListener('change', function () {
    clearFieldError(this, document.getElementById('errDate'));
  });

  // ── Save button ────────────────────────────────────────
  document.getElementById('btnSubmit').addEventListener('click', () => {
    if (!validateForm()) return;

    const tx = {
      id:       uid(),
      title:    document.getElementById('txTitle').value.trim(),
      amount:   parseAmount(txAmountEl.value),
      type:     txTypeEl.value,
      category: document.getElementById('txCategory').value,
      date:     document.getElementById('txDate').value,
    };

    state.transactions.push(tx);
    saveToStorage(state.transactions);
    renderAll(state.transactions);
    showToast('Transaksi berhasil disimpan!', 'success');

    // Reset input fields (preserve type toggle)
    document.getElementById('txTitle').value = '';
    txAmountEl.value = '';
    document.getElementById('txDate').valueAsDate = new Date();
    updateCategoryOptions(txTypeEl.value);

    ['txTitle', 'txAmount', 'txDate'].forEach(id => {
      const errMap = { txTitle: 'errTitle', txAmount: 'errAmount', txDate: 'errDate' };
      clearFieldError(document.getElementById(id), document.getElementById(errMap[id]));
    });
  });

  // ── Filters & sort ─────────────────────────────────────
  ['filterCategory', 'filterType', 'sortOrder'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => renderList(state.transactions));
  });

  // ── Delete — event delegation on the list ─────────────
  document.getElementById('txList').addEventListener('click', e => {
    const btn = e.target.closest('.btn-delete');
    if (!btn) return;
    state.deleteTargetId = btn.dataset.id;
    document.getElementById('deleteModal').classList.add('active');
    document.getElementById('btnConfirm').focus();
  });

  // ── Modal buttons ──────────────────────────────────────
  document.getElementById('btnCancel').addEventListener('click', () => closeModal(state));
  document.getElementById('btnConfirm').addEventListener('click', () => confirmDelete(state));
  document.getElementById('deleteModal').addEventListener('click', e => {
    if (e.target.id === 'deleteModal') closeModal(state);
  });

  // ── Escape key closes modal ────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(state);
  });

  // ── Export CSV ─────────────────────────────────────────
  document.getElementById('btnExport').addEventListener('click', () => exportCSV(state.transactions));
}

/* ── Modal helpers ──────────────────────────────────────── */

function closeModal(state) {
  document.getElementById('deleteModal').classList.remove('active');
  state.deleteTargetId = null;
}

function confirmDelete(state) {
  if (!state.deleteTargetId) return;
  const before = state.transactions.length;
  state.transactions = state.transactions.filter(t => t.id !== state.deleteTargetId);
  if (state.transactions.length < before) {
    saveToStorage(state.transactions);
    renderAll(state.transactions);
    showToast('Transaksi dihapus.', 'error');
  }
  closeModal(state);
}

/* ── CSV Export ─────────────────────────────────────────── */

/**
 * Export all transactions to a UTF-8 BOM CSV file.
 * BOM ensures Excel reads Indonesian characters correctly.
 * @param {Array} transactions
 */
function exportCSV(transactions) {
  if (transactions.length === 0) {
    showToast('Tidak ada data untuk diekspor.', 'info');
    return;
  }

  const BOM     = '\uFEFF';
  const headers = ['ID', 'Nama Transaksi', 'Nominal', 'Tipe', 'Kategori', 'Tanggal'];
  const rows    = transactions.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount,
    t.type,
    t.category,
    t.date,
  ]);

  const csv  = BOM + [headers, ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: `laporan_keuangan_${new Date().toISOString().slice(0, 10)}.csv`,
  });

  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('File CSV berhasil diunduh.', 'success');
}
