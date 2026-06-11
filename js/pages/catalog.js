/* ============================================================
   catalog.js — Product Catalog with Filters & Sort
   ============================================================ */

function renderCatalogPage(params = {}) {
  const page = document.getElementById('page-content');

  // State
  let filters = {
    category: params.category || '',
    brand: [],
    minPrice: 0,
    maxPrice: 50000,
    badge: params.badge || '',
    search: params.search || ''
  };
  let sortBy = 'featured';

  function getFiltered() {
    return PRODUCTS.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.badge && p.badge !== filters.badge) return false;
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) && !p.brand.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id - a.id;
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }

  function getCategoryLabel() {
    if (!filters.category) return 'All Products';
    const cat = CATEGORIES.find(c => c.id === filters.category);
    return cat ? `${cat.icon} ${cat.name}` : 'Products';
  }

  page.innerHTML = `
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb">
          <a href="#/">Home</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current" id="catalog-breadcrumb">${getCategoryLabel()}</span>
        </nav>
        <h1 class="page-header-title" id="catalog-title">${getCategoryLabel()}</h1>
      </div>
    </div>

    <div class="container">
      <div class="catalog-layout">

        <!-- SIDEBAR FILTERS -->
        <aside class="catalog-sidebar" id="catalog-sidebar" aria-label="Product filters">
          <div class="filter-panel">
            <div class="filter-panel-title">
              Filters
              <button class="filter-clear-btn" id="clear-filters-btn">Clear All</button>
            </div>

            <!-- Search -->
            <div class="filter-section">
              <div class="filter-section-title">Search</div>
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input id="filter-search" class="form-input" type="text" placeholder="Search products…" value="${filters.search}" />
              </div>
            </div>

            <!-- Categories -->
            <div class="filter-section">
              <div class="filter-section-title">Category</div>
              <div class="filter-options">
                <div class="filter-option">
                  <label><input type="radio" name="cat" value="" ${!filters.category ? 'checked' : ''}> All</label>
                  <span class="filter-count">${PRODUCTS.length}</span>
                </div>
                ${CATEGORIES.map(cat => `
                  <div class="filter-option">
                    <label><input type="radio" name="cat" value="${cat.id}" ${filters.category === cat.id ? 'checked' : ''}> ${cat.icon} ${cat.name}</label>
                    <span class="filter-count">${cat.count}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Brands -->
            <div class="filter-section">
              <div class="filter-section-title">Brand</div>
              <div class="filter-options">
                ${BRANDS.map(brand => `
                  <div class="filter-option">
                    <label><input type="checkbox" name="brand" value="${brand}" ${filters.brand.includes(brand) ? 'checked' : ''}> ${brand}</label>
                    <span class="filter-count">${PRODUCTS.filter(p => p.brand === brand).length}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Price Range -->
            <div class="filter-section">
              <div class="filter-section-title">Price Range</div>
              <div style="margin-bottom:0.5rem">
                <input type="range" class="range-slider" id="price-range" min="0" max="50000" step="500" value="${filters.maxPrice}" />
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;color:var(--text-secondary)">
                <span>₹0</span>
                <span id="price-range-label">Up to ${formatPrice(filters.maxPrice)}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <div>
          <!-- Toolbar -->
          <div class="catalog-toolbar">
            <div class="flex" style="gap:var(--space-3);flex-wrap:wrap;align-items:center">
              <button class="btn btn-secondary btn-sm mobile-filter-btn" id="mobile-filter-btn">⚙️ Filters</button>
              <span class="catalog-result-count" id="result-count">Loading…</span>
              <div id="active-filters" style="display:flex;gap:0.375rem;flex-wrap:wrap"></div>
            </div>
            <div class="catalog-sort">
              <label for="sort-select">Sort:</label>
              <select id="sort-select" class="form-select" style="width:auto;padding-right:2rem">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div id="products-grid" class="products-grid stagger-children"></div>
        </div>
      </div>
    </div>
  `;

  function renderGrid() {
    const filtered = getFiltered();
    const grid = document.getElementById('products-grid');
    const count = document.getElementById('result-count');
    const activeFilters = document.getElementById('active-filters');

    count.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    // Active filter chips
    const chips = [];
    if (filters.category) {
      const cat = CATEGORIES.find(c => c.id === filters.category);
      chips.push({ label: cat ? cat.name : filters.category, clear: () => { filters.category = ''; rerender(); } });
    }
    filters.brand.forEach(b => chips.push({ label: b, clear: () => { filters.brand = filters.brand.filter(x => x !== b); rerender(); } }));
    if (filters.maxPrice < 50000) chips.push({ label: `Up to ${formatPrice(filters.maxPrice)}`, clear: () => { filters.maxPrice = 50000; document.getElementById('price-range').value = 50000; rerender(); } });

    activeFilters.innerHTML = chips.map((chip, i) => `
      <span class="chip active" data-chip="${i}">${chip.label} ✕</span>
    `).join('');
    activeFilters.querySelectorAll('.chip').forEach((el, i) => el.addEventListener('click', () => chips[i].clear()));

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button class="btn btn-primary mt-6" id="reset-btn">Reset Filters</button>
        </div>`;
      document.getElementById('reset-btn')?.addEventListener('click', () => {
        filters = { category: '', brand: [], minPrice: 0, maxPrice: 50000, badge: '', search: '' };
        rerender();
      });
      return;
    }

    grid.innerHTML = filtered.map(renderProductCard).join('');
    bindProductCardEvents(grid);
  }

  function rerender() {
    // Update URL
    const parts = [];
    if (filters.category) parts.push(`category=${filters.category}`);
    if (filters.search) parts.push(`search=${encodeURIComponent(filters.search)}`);
    history.replaceState(null, '', `#/catalog${parts.length ? '?' + parts.join('&') : ''}`);
    renderGrid();
  }

  function bindFilterEvents() {
    // Category radios
    document.querySelectorAll('input[name="cat"]').forEach(radio => {
      radio.addEventListener('change', () => { filters.category = radio.value; renderGrid(); });
    });
    // Brand checkboxes
    document.querySelectorAll('input[name="brand"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) filters.brand.push(cb.value);
        else filters.brand = filters.brand.filter(b => b !== cb.value);
        renderGrid();
      });
    });
    // Price range
    document.getElementById('price-range')?.addEventListener('input', e => {
      filters.maxPrice = +e.target.value;
      document.getElementById('price-range-label').textContent = `Up to ${formatPrice(filters.maxPrice)}`;
      renderGrid();
    });
    // Search
    let searchTimer;
    document.getElementById('filter-search')?.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { filters.search = e.target.value; renderGrid(); }, 300);
    });
    // Sort
    document.getElementById('sort-select')?.addEventListener('change', e => { sortBy = e.target.value; renderGrid(); });
    // Clear all
    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
      filters = { category: '', brand: [], minPrice: 0, maxPrice: 50000, badge: '', search: '' };
      document.querySelector('input[name="cat"][value=""]').checked = true;
      document.getElementById('price-range').value = 50000;
      document.getElementById('price-range-label').textContent = `Up to ${formatPrice(50000)}`;
      document.getElementById('filter-search').value = '';
      document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = false);
      renderGrid();
    });
    // Mobile filter toggle
    document.getElementById('mobile-filter-btn')?.addEventListener('click', () => {
      const sidebar = document.getElementById('catalog-sidebar');
      sidebar.classList.toggle('open');
    });
  }

  renderGrid();
  bindFilterEvents();
}
