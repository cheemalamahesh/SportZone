/* ============================================================
   search.js — Global search overlay
   ============================================================ */

const Search = (() => {
  let overlay = null;

  function open() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'search-overlay';
    overlay.innerHTML = `
      <div class="modal modal-lg" style="max-width:600px" role="dialog" aria-label="Search">
        <div class="modal-header">
          <h2 class="modal-title">🔍 Search Products</h2>
          <button class="modal-close" id="search-close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="search-input-wrap" style="margin-bottom:1.25rem">
            <span class="search-icon">🔍</span>
            <input id="search-field" class="form-input" type="text" placeholder="Search for products, brands, categories…" autocomplete="off" autofocus />
          </div>
          <div id="search-results"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const field = overlay.querySelector('#search-field');
    const results = overlay.querySelector('#search-results');

    field.addEventListener('input', () => {
      const q = field.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ''; return; }
      const found = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 6);

      if (!found.length) {
        results.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem">No products found</p>';
        return;
      }
      results.innerHTML = found.map(p => `
        <a href="#/product/${p.id}" class="search-result-item" style="display:flex;align-items:center;gap:0.875rem;padding:0.75rem;border-radius:var(--radius-md);cursor:pointer;transition:background var(--transition-fast);text-decoration:none;color:inherit">
          <img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:var(--radius-sm);flex-shrink:0" loading="lazy">
          <div style="flex:1;min-width:0">
            <div style="font-size:0.8rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.06em">${p.brand}</div>
            <div style="font-size:0.9375rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
          </div>
          <div style="font-size:1rem;font-weight:800;white-space:nowrap">${formatPrice(p.price)}</div>
        </a>
      `).join('');

      results.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('mouseover', () => el.style.background = 'var(--bg-elevated)');
        el.addEventListener('mouseout', () => el.style.background = '');
        el.addEventListener('click', close);
      });
    });

    overlay.querySelector('#search-close-btn').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
    field.focus();
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  function close() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.removeEventListener('keydown', onKey);
  }

  return { open, close };
})();
