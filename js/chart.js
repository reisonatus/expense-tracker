/**
 * chart.js
 * Pure SVG donut chart renderer — no external dependencies.
 */

/**
 * Convert polar coordinates to Cartesian (x, y).
 * 0° is at the top (12 o'clock), going clockwise.
 * @param {number} cx - center x
 * @param {number} cy - center y
 * @param {number} r  - radius
 * @param {number} angleDeg
 * @returns {{ x: number, y: number }}
 */
function polarToXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Render a donut chart into an SVG element and populate a legend table.
 *
 * @param {SVGElement}       svgEl      - Target <svg> element
 * @param {HTMLTableElement} legendEl   - Target <table> element for the legend
 * @param {{ cat: string, value: number }[]} data  - Aggregated category data
 * @param {string[]}         colors     - Array of hex color strings
 * @param {string}           emptyColor - Stroke color when there is no data
 */
function buildDonutSVG(svgEl, legendEl, data, colors, emptyColor) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const CX = 100, CY = 100, R = 72, SW = 30;

  // ── Empty state ──────────────────────────────────────────
  if (total === 0) {
    svgEl.innerHTML = `
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none"
        stroke="${emptyColor}" stroke-width="${SW}"/>
      <text x="${CX}" y="${CY - 6}" text-anchor="middle"
        fill="#7b82a6" font-size="12">Belum ada</text>
      <text x="${CX}" y="${CY + 10}" text-anchor="middle"
        fill="#7b82a6" font-size="12">data</text>`;
    legendEl.innerHTML = `
      <tr><td colspan="3"
        style="color:var(--clr-muted);font-size:.8rem;padding:6px 0">
        Belum ada data.
      </td></tr>`;
    return;
  }

  // ── Build arc paths ──────────────────────────────────────
  let startAngle = 0;
  let paths = '';

  data.forEach((d, i) => {
    const slice    = (d.value / total) * 360;
    const endAngle = startAngle + slice;
    const color    = colors[i % colors.length];

    // Small gap between slices for visual separation
    const s     = polarToXY(CX, CY, R, startAngle + 0.5);
    const e     = polarToXY(CX, CY, R, endAngle   - 0.5);
    const large = slice > 180 ? 1 : 0;

    paths += `<path
      d="M ${s.x.toFixed(3)} ${s.y.toFixed(3)}
         A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}"
      fill="none" stroke="${color}" stroke-width="${SW}" stroke-linecap="butt"/>`;

    startAngle = endAngle;
  });

  // ── Center label ─────────────────────────────────────────
  svgEl.innerHTML = `
    ${paths}
    <text x="${CX}" y="${CY - 5}" text-anchor="middle"
      fill="#7b82a6" font-size="9">TOTAL</text>
    <text x="${CX}" y="${CY + 10}" text-anchor="middle"
      fill="#e8eaf6" font-size="9.5" font-weight="bold">
      ${escapeHtml(formatRupiah(total))}
    </text>`;

  // ── Legend table ─────────────────────────────────────────
  legendEl.innerHTML = data.map((d, i) => {
    const pct   = ((d.value / total) * 100).toFixed(1);
    const color = colors[i % colors.length];
    const label = escapeHtml(CATEGORY_META[d.cat]?.label ?? d.cat);
    return `<tr>
      <td><span class="legend-dot" style="background:${color}"></span>${label}</td>
      <td class="legend-val">${formatRupiah(d.value)}</td>
      <td class="legend-pct">${pct}%</td>
    </tr>`;
  }).join('');
}

/**
 * Aggregate transactions by category for a given type, then render both donut charts.
 * @param {Array} transactions
 */
function renderChart(transactions) {
  /**
   * @param {'income'|'expense'} type
   * @returns {{ cat: string, value: number }[]}
   */
  function aggregate(type) {
    const grouped = transactions
      .filter(t => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {});
    return Object.entries(grouped).map(([cat, value]) => ({ cat, value }));
  }

  buildDonutSVG(
    document.getElementById('chartExpense'),
    document.getElementById('legendExpense'),
    aggregate('expense'),
    EXPENSE_COLORS,
    '#2e3248',
  );

  buildDonutSVG(
    document.getElementById('chartIncome'),
    document.getElementById('legendIncome'),
    aggregate('income'),
    INCOME_COLORS,
    '#2e3248',
  );
}
