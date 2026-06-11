/* ============================================================
   admin.js — Full Admin Panel with CRUD Product Management
   ============================================================ */

function renderAdminPage() {
  const page = document.getElementById('page-content');

  // Guard: must be admin
  if (!Store.isAdmin()) {
    page.innerHTML = `
      <div class="empty-state" style="padding:8rem 2rem">
        <div class="empty-state-icon">🔐</div>
        <h3>Admin Access Required</h3>
        <p>You must be signed in as an admin to access this page.</p>
        <div style="margin-top:1.5rem;padding:1rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);font-size:0.875rem;color:var(--text-secondary)">
          <strong style="color:var(--primary)">Admin Credentials:</strong><br>
          Email: <code style="color:var(--text-primary)">admin@sportzone.com</code><br>
          Password: <code style="color:var(--text-primary)">Admin@123</code>
        </div>
        <button class="btn btn-primary mt-6" onclick="AuthModal.open()">Sign In as Admin</button>
      </div>`;
    return;
  }

  let activeSection = 'dashboard';
  let editingProduct = null;   // null = add mode, object = edit mode

  /* ---- helpers ---- */
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const CATEGORIES = ['football', 'basketball', 'tennis', 'fitness', 'swimming', 'cycling'];

  /* ---- Section: Dashboard ---- */
  function dashboardHTML() {
    const orders   = Store.getOrders();
    const products = Store.getProducts();
    const revenue  = orders.reduce((s, o) => s + o.total, 0);
    const stats = [
      { icon: '💰', label: 'Total Revenue',  value: fmt(revenue),       change: '+12%', pos: true },
      { icon: '🛒', label: 'Total Orders',   value: orders.length,      change: '+5%',  pos: true },
      { icon: '📦', label: 'Total Products', value: products.length,    change: '+3',   pos: true },
      { icon: '🏷️', label: 'Low Stock Items',value: products.filter(p => p.stock <= 5).length, change: 'Alert', pos: false },
    ];
    return `
      <div class="admin-stats-grid">
        ${stats.map(s => `
          <div class="admin-stat-card">
            <div class="admin-stat-top">
              <span class="admin-stat-icon">${s.icon}</span>
              <span class="admin-stat-change ${s.pos ? 'positive' : 'negative'}">${s.change}</span>
            </div>
            <div class="admin-stat-value">${s.value}</div>
            <div class="admin-stat-label">${s.label}</div>
          </div>`).join('')}
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header">
          <span class="admin-table-title">Recent Orders</span>
          <button class="btn btn-secondary btn-sm" onclick="switchSection('orders')">View All</button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.slice(0, 5).map(o => `
                <tr>
                  <td><span style="color:var(--primary);font-weight:700">${o.id}</span></td>
                  <td>${new Date(o.date).toLocaleDateString('en-IN')}</td>
                  <td>${o.itemCount} item${o.itemCount !== 1 ? 's' : ''}</td>
                  <td><strong>${fmt(o.total)}</strong></td>
                  <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:2rem">No orders yet</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ---- Section: Products ---- */
  function productsHTML() {
    const products = Store.getProducts();
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <span class="admin-table-title">All Products</span>
            <span style="color:var(--text-secondary);font-size:0.8rem;margin-left:0.5rem">(${products.length} total)</span>
          </div>
          <button class="btn btn-primary btn-sm" id="add-product-btn">
            <span>＋</span> Add Product
          </button>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th style="text-align:center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                      <img src="${p.image}" alt="${p.name}"
                           style="width:44px;height:44px;object-fit:cover;border-radius:var(--radius-md);border:1px solid var(--border);flex-shrink:0"
                           onerror="this.style.background='var(--bg-elevated)';this.removeAttribute('src')">
                      <div>
                        <div style="font-weight:600;font-size:0.875rem">${p.name}</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary)">${p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-info" style="text-transform:capitalize">${p.category}</span></td>
                  <td style="font-size:0.875rem">${p.brand}</td>
                  <td><strong>${fmt(p.price)}</strong></td>
                  <td>
                    <span style="font-weight:700;color:${p.stock <= 5 ? 'var(--error)' : p.stock <= 15 ? 'var(--warning)' : 'var(--success)'}">${p.stock}</span>
                  </td>
                  <td>⭐ ${p.rating}</td>
                  <td>
                    <div style="display:flex;gap:0.375rem;justify-content:center">
                      <button class="btn btn-secondary btn-sm" data-edit="${p.id}">✏️ Edit</button>
                      <button class="btn btn-danger btn-sm" data-delete="${p.id}">🗑 Delete</button>
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ---- Section: Orders ---- */
  function ordersHTML() {
    const orders = Store.getOrders();
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <span class="admin-table-title">All Orders (${orders.length})</span>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${orders.length ? orders.map(o => `
                <tr>
                  <td><span style="color:var(--primary);font-weight:700">${o.id}</span></td>
                  <td>${new Date(o.date).toLocaleDateString('en-IN')}</td>
                  <td>${o.itemCount}</td>
                  <td><strong>${fmt(o.total)}</strong></td>
                  <td>
                    <select class="form-select" style="padding:0.2rem 0.4rem;font-size:0.75rem;width:auto;min-width:110px" data-order-id="${o.id}">
                      ${['pending','processing','shipped','delivered','cancelled'].map(s =>
                        `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
                      ).join('')}
                    </select>
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-sm" data-save-order="${o.id}">Save</button>
                  </td>
                </tr>`).join('')
              : '<tr><td colspan="6" style="text-align:center;color:var(--text-secondary);padding:2rem">No orders yet</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ---- Section: Customers ---- */
  function customersHTML() {
    const mockCustomers = [
      { name: 'Arjun Singh',  email: 'arjun@example.com',  orders: 5, spent: 24995, joined: '2026-01-15' },
      { name: 'Priya Mehta',  email: 'priya@example.com',  orders: 3, spent: 15497, joined: '2026-02-20' },
      { name: 'Rahul Kumar',  email: 'rahul@example.com',  orders: 8, spent: 51996, joined: '2026-03-10' },
      { name: 'Sneha Joshi',  email: 'sneha@example.com',  orders: 2, spent: 8998,  joined: '2026-04-05' },
    ];
    return `
      <div class="admin-table-card">
        <div class="admin-table-header">
          <span class="admin-table-title">Customers</span>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
            <tbody>
              ${mockCustomers.map(c => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                      <div class="avatar" style="width:32px;height:32px;font-size:0.8rem">${c.name[0]}</div>
                      <span style="font-weight:600">${c.name}</span>
                    </div>
                  </td>
                  <td style="color:var(--text-secondary)">${c.email}</td>
                  <td>${c.orders}</td>
                  <td><strong>${fmt(c.spent)}</strong></td>
                  <td style="color:var(--text-secondary)">${new Date(c.joined).toLocaleDateString('en-IN')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ---- Product Modal (Add / Edit) ---- */
  function openProductModal(product = null) {
    editingProduct = product;
    const isEdit = product !== null;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'admin-product-modal';
    overlay.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <button class="modal-close" id="close-product-modal">✕</button>
        </div>
        <div class="modal-body">
          <form id="product-form" autocomplete="off">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Product Name *</label>
                <input class="form-input" id="pf-name" type="text" placeholder="e.g. Pro Match Football" value="${isEdit ? product.name : ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Brand *</label>
                <input class="form-input" id="pf-brand" type="text" placeholder="e.g. Nike" value="${isEdit ? product.brand : ''}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select class="form-select" id="pf-category" required>
                  <option value="">Select category</option>
                  ${CATEGORIES.map(c => `<option value="${c}" ${isEdit && product.category === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Price (₹) *</label>
                <input class="form-input" id="pf-price" type="number" min="1" step="0.01" placeholder="e.g. 2999" value="${isEdit ? product.price : ''}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Original Price (₹) <span style="color:var(--text-muted)">(for discount display)</span></label>
                <input class="form-input" id="pf-original-price" type="number" min="0" step="0.01" placeholder="e.g. 3999" value="${isEdit ? (product.originalPrice || '') : ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Stock Quantity *</label>
                <input class="form-input" id="pf-stock" type="number" min="0" placeholder="e.g. 50" value="${isEdit ? product.stock : ''}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Rating (0–5)</label>
                <input class="form-input" id="pf-rating" type="number" min="0" max="5" step="0.1" placeholder="e.g. 4.5" value="${isEdit ? product.rating : '4.0'}">
              </div>
              <div class="form-group">
                <label class="form-label">Reviews Count</label>
                <input class="form-input" id="pf-reviews" type="number" min="0" placeholder="e.g. 128" value="${isEdit ? product.reviews : '0'}">
              </div>
            </div>
            <div class="form-group" style="margin-top:0.75rem">
              <label class="form-label">Image URL *</label>
              <input class="form-input" id="pf-image" type="url" placeholder="https://images.unsplash.com/photo-..." value="${isEdit ? product.image : ''}" required>
              <div class="form-hint">Paste any image URL. You can use Unsplash, Pexels, or any direct image link.</div>
            </div>
            <div class="form-group" style="margin-top:0.75rem">
              <label class="form-label">Description</label>
              <textarea class="form-textarea" id="pf-description" placeholder="Product description...">${isEdit ? (product.description || '') : ''}</textarea>
            </div>
            <div class="form-row" style="margin-top:0.75rem">
              <div class="form-group">
                <label class="form-label">Sizes <span style="color:var(--text-muted)">(comma separated)</span></label>
                <input class="form-input" id="pf-sizes" type="text" placeholder="S, M, L, XL" value="${isEdit && product.sizes ? product.sizes.join(', ') : ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Colors <span style="color:var(--text-muted)">(comma separated)</span></label>
                <input class="form-input" id="pf-colors" type="text" placeholder="Red, Blue, Black" value="${isEdit && product.colors ? product.colors.join(', ') : ''}">
              </div>
            </div>
            <div style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap">
              <label class="form-check">
                <input type="checkbox" id="pf-featured" ${isEdit && product.featured ? 'checked' : ''}>
                <span class="form-check-label">Featured Product</span>
              </label>
              <label class="form-check">
                <input type="checkbox" id="pf-new" ${isEdit && product.isNew ? 'checked' : ''}>
                <span class="form-check-label">New Arrival</span>
              </label>
              <label class="form-check">
                <input type="checkbox" id="pf-bestseller" ${isEdit && product.isBestSeller ? 'checked' : ''}>
                <span class="form-check-label">Best Seller</span>
              </label>
            </div>
            <div id="product-form-error" style="margin-top:0.75rem"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-product-modal">Cancel</button>
          <button class="btn btn-primary" id="save-product-btn">${isEdit ? '💾 Save Changes' : '➕ Add Product'}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeModal() {
      overlay.remove();
      document.body.style.overflow = '';
    }

    overlay.querySelector('#close-product-modal').onclick  = closeModal;
    overlay.querySelector('#cancel-product-modal').onclick = closeModal;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    overlay.querySelector('#save-product-btn').onclick = () => {
      const errEl = overlay.querySelector('#product-form-error');
      errEl.innerHTML = '';

      const name     = overlay.querySelector('#pf-name').value.trim();
      const brand    = overlay.querySelector('#pf-brand').value.trim();
      const category = overlay.querySelector('#pf-category').value;
      const price    = parseFloat(overlay.querySelector('#pf-price').value);
      const origP    = parseFloat(overlay.querySelector('#pf-original-price').value) || null;
      const stock    = parseInt(overlay.querySelector('#pf-stock').value);
      const rating   = parseFloat(overlay.querySelector('#pf-rating').value) || 4.0;
      const reviews  = parseInt(overlay.querySelector('#pf-reviews').value) || 0;
      const image    = overlay.querySelector('#pf-image').value.trim();
      const desc     = overlay.querySelector('#pf-description').value.trim();
      const sizesRaw = overlay.querySelector('#pf-sizes').value;
      const colorsRaw= overlay.querySelector('#pf-colors').value;
      const featured = overlay.querySelector('#pf-featured').checked;
      const isNew    = overlay.querySelector('#pf-new').checked;
      const isBestSeller = overlay.querySelector('#pf-bestseller').checked;

      if (!name || !brand || !category || isNaN(price) || isNaN(stock) || !image) {
        errEl.innerHTML = '<div class="alert alert-error">⚠️ Please fill in all required fields.</div>';
        return;
      }

      const sizes  = sizesRaw  ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean)  : [];
      const colors = colorsRaw ? colorsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      const discount = origP && origP > price ? Math.round((1 - price / origP) * 100) : 0;

      const productData = {
        name, brand, category, price, stock, rating, reviews, image,
        description: desc, sizes, colors, featured, isNew, isBestSeller,
        originalPrice: origP, discount
      };

      const btn = overlay.querySelector('#save-product-btn');
      btn.classList.add('btn-loading');
      btn.disabled = true;

      setTimeout(() => {
        if (isEdit) {
          Store.updateProduct(product.id, productData);
          Toast.success(`"${name}" updated successfully!`);
        } else {
          Store.addProduct(productData);
          Toast.success(`"${name}" added to the store!`);
        }
        closeModal();
        renderAdmin(); // Re-render the admin panel
      }, 400);
    };
  }

  /* ---- Delete confirmation ---- */
  function confirmDelete(id) {
    const p = Store.getProduct(id);
    if (!p) return;
    if (!confirm(`Delete "${p.name}"?\n\nThis cannot be undone.`)) return;
    Store.deleteProduct(id);
    Toast.success(`"${p.name}" removed from the store.`);
    renderAdmin();
  }

  /* ---- Switch sidebar section ---- */
  function switchSection(section) {
    activeSection = section;
    renderAdmin();
  }
  window.switchSection = switchSection;

  /* ---- Main render ---- */
  function renderAdmin() {
    const navItems = [
      { id: 'dashboard', icon: '📊', label: 'Dashboard'  },
      { id: 'products',  icon: '📦', label: 'Products'   },
      { id: 'orders',    icon: '🛒', label: 'Orders'     },
      { id: 'customers', icon: '👥', label: 'Customers'  },
    ];

    let sectionHTML = '';
    if (activeSection === 'dashboard') sectionHTML = dashboardHTML();
    else if (activeSection === 'products') sectionHTML = productsHTML();
    else if (activeSection === 'orders')   sectionHTML = ordersHTML();
    else if (activeSection === 'customers') sectionHTML = customersHTML();

    page.innerHTML = `
      <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-brand">
            <span style="color:var(--primary);font-size:1.4rem">⚡</span>
            <span>Sport<strong>Zone</strong></span>
          </div>
          <div class="admin-sidebar-section-label">MAIN MENU</div>
          ${navItems.map(item => `
            <button class="admin-nav-item ${activeSection === item.id ? 'active' : ''}" data-section="${item.id}">
              <span class="admin-nav-icon">${item.icon}</span>
              ${item.label}
            </button>`).join('')}
          <div class="admin-sidebar-divider"></div>
          <a href="#/" class="admin-nav-item">
            <span class="admin-nav-icon">🏠</span>
            Back to Store
          </a>
          <button class="admin-nav-item" onclick="Store.logout();Router.navigate('#/')">
            <span class="admin-nav-icon">🚪</span>
            Logout
          </button>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
          <div class="admin-header">
            <div>
              <h1 class="admin-page-title">${navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}</h1>
              <p style="color:var(--text-secondary);font-size:0.875rem;margin-top:0.25rem">
                Welcome back, ${Store.getUser()?.name || 'Admin'} 👋
              </p>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <div class="avatar" style="width:36px;height:36px">A</div>
            </div>
          </div>
          <div id="admin-section-content">${sectionHTML}</div>
        </main>
      </div>`;

    /* ---- Bind sidebar nav ---- */
    page.querySelectorAll('[data-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSection = btn.dataset.section;
        renderAdmin();
      });
    });

    /* ---- Bind product table actions ---- */
    if (activeSection === 'products') {
      page.querySelector('#add-product-btn')?.addEventListener('click', () => openProductModal(null));

      page.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = Store.getProduct(btn.dataset.edit);
          if (p) openProductModal(p);
        });
      });

      page.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => confirmDelete(btn.dataset.delete));
      });
    }

    /* ---- Bind order status save ---- */
    if (activeSection === 'orders') {
      page.querySelectorAll('[data-save-order]').forEach(btn => {
        btn.addEventListener('click', () => {
          const orderId = btn.dataset.saveOrder;
          const sel = page.querySelector(`[data-order-id="${orderId}"]`);
          if (sel) {
            Store.updateOrderStatus(orderId, sel.value);
            Toast.success('Order status updated!');
          }
        });
      });
    }
  }

  renderAdmin();
}
