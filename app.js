/**
 * app.js
 * Entry point — bootstraps the application.
 *
 * All mutable runtime state lives in a single `state` object so it can be
 * passed by reference into event handlers without relying on module globals.
 */

const state = {
  transactions:   [],
  deleteTargetId: null,
};

function init() {
  // 1. Rehydrate from localStorage
  state.transactions = loadFromStorage();

  // 2. Set form defaults
  document.getElementById('txDate').valueAsDate = new Date();
  updateCategoryOptions('expense');

  // 3. Wire up all events (pass state so handlers can mutate it)
  setupEventListeners(state);

  // 4. Initial render
  renderAll(state.transactions);
}

// Wait for the DOM to be fully parsed before initialising
document.addEventListener('DOMContentLoaded', init);
