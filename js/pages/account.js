/* ============================================================
   account.js — User Account Page
   ============================================================ */

function renderAccountPage() {
  const page = document.getElementById('page-content');
  const user = Store.getUser();

  if (!user) {
    page.innerHTML = `
      <div class="empty-state" style="padding:8rem 2rem">
        <div class="empty-state-icon">🔐</div>
        <h3>Sign In to Access Your Account</h3>
        <p>Manage your profile, orders, and preferences.</p>
        <button class="btn btn-primary btn-lg mt-6" id="account-login-btn">Sign In</button>
      </div>`;
    document.getElementById('account-login-btn')?.addEventListener('click', () => Auth.open('login'));
    return;
  }

  let activeSection = 'profile';

  const navItems = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'orders', icon: '📦', label: 'My Orders' },
    { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
    { id: 'security', icon: '🔒', label: 'Security' },
  ];

  function getSectionContent() {
    if (activeSection === 'profile') {
      return `
        <div class="card">
          <div class="card-header"><h3 class="heading-3">Profile Information</h3></div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border)">
              <div class="avatar avatar-xl">${user.avatar}</div>
              <div>
                <div style="font-size:1.25rem;font-weight:800">${user.name}</div>
                <div style="color:var(--text-secondary);font-size:0.9rem">${user.email}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">Member since ${new Date(user.joined || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            <form id="profile-form">
              <div class="form-row mb-4">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input class="form-input" value="${user.name}" name="name" />
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input class="form-input" type="email" value="${user.email}" name="email" />
                </div>
              </div>
              <div class="form-row mb-4">
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input class="form-input" placeholder="+91 98765 43210" name="phone" />
                </div>
                <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input class="form-input" type="date" name="dob" />
                </div>
              </div>
              <div class="form-group mb-6">
                <label class="form-label">Default Address</label>
                <textarea class="form-textarea" name="address" placeholder="123 Main St, City, State - 400001"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>`;
    }
    if (activeSection === 'orders') {
      const orders = Store.getOrders().slice(0, 5);
      return `
        <div class="card">
          <div class="card-header">
            <h3 class="heading-3">Recent Orders</h3>
            <a href="#/orders" class="view-all-link">View All</a>
          </div>
          <div class="card-body" style="padding:0">
            ${!orders.length ? `<div style="padding:3rem;text-align:center;color:var(--text-secondary)">No orders yet</div>` :
            `<div class="table-wrap"><table class="table">
              <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td><span style="color:var(--primary);font-weight:700">${o.id}</span></td>
                    <td>${new Date(o.date).toLocaleDateString('en-IN')}</td>
                    <td>${o.itemCount}</td>
                    <td>${formatPrice(o.total)}</td>
                    <td><span class="status-badge ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table></div>`}
          </div>
        </div>`;
    }
    if (activeSection === 'wishlist') {
      const wishlist = Store.getWishlist().slice(0, 4);
      return `
        <div class="card">
          <div class="card-header">
            <h3 class="heading-3">Wishlist</h3>
            <a href="#/wishlist" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            ${!wishlist.length ? `<div style="text-align:center;padding:2rem;color:var(--text-secondary)">No saved items yet</div>` :
            `<div class="products-grid" style="grid-template-columns:repeat(2,1fr)" id="account-wishlist-grid">
              ${wishlist.map(renderProductCard).join('')}
            </div>`}
          </div>
        </div>`;
    }
    if (activeSection === 'security') {
      return `
        <div class="card">
          <div class="card-header"><h3 class="heading-3">Security Settings</h3></div>
          <div class="card-body">
            <div class="form-group mb-4">
              <label class="form-label">Current Password</label>
              <input class="form-input" type="password" placeholder="••••••••" />
            </div>
            <div class="form-group mb-4">
              <label class="form-label">New Password</label>
              <input class="form-input" type="password" placeholder="Min. 8 characters" />
            </div>
            <div class="form-group mb-6">
              <label class="form-label">Confirm New Password</label>
              <input class="form-input" type="password" placeholder="••••••••" />
            </div>
            <button class="btn btn-primary" id="change-pass-btn">Update Password</button>
            <div class="divider"></div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-weight:700">Danger Zone</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">Sign out from all devices</div>
              </div>
              <button class="btn btn-danger btn-sm" id="signout-all-btn">Sign Out</button>
            </div>
          </div>
        </div>`;
    }
    return '';
  }

  function render() {
    page.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1 class="page-header-title">My Account</h1>
        </div>
      </div>
      <div class="container">
        <div class="account-layout">
          <aside class="account-sidebar">
            <div class="account-nav">
              <div style="padding:1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:0.875rem">
                <div class="avatar avatar-lg">${user.avatar}</div>
                <div>
                  <div style="font-weight:700;font-size:0.9375rem">${user.name}</div>
                  <div style="font-size:0.75rem;color:var(--text-secondary)">${user.email}</div>
                </div>
              </div>
              ${navItems.map(item => `
                <div class="account-nav-item ${activeSection === item.id ? 'active' : ''}" data-section="${item.id}">
                  <span class="account-nav-icon">${item.icon}</span>
                  ${item.label}
                </div>`).join('')}
              <div class="account-nav-item danger" id="account-logout-btn" style="color:var(--error);border-top:1px solid var(--border);margin-top:0.25rem">
                <span class="account-nav-icon">🚪</span> Sign Out
              </div>
            </div>
          </aside>
          <div id="account-content">${getSectionContent()}</div>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('[data-section]').forEach(el => {
      el.addEventListener('click', () => {
        activeSection = el.dataset.section;
        render();
      });
    });

    document.getElementById('account-logout-btn')?.addEventListener('click', () => {
      Store.logout();
      Toast.info('Signed out. See you soon!');
      Navbar.update();
      Router.navigate('#/');
    });

    document.getElementById('profile-form')?.addEventListener('submit', e => {
      e.preventDefault();
      Toast.success('Profile updated successfully! ✅');
    });

    document.getElementById('change-pass-btn')?.addEventListener('click', () => {
      Toast.success('Password updated! 🔒');
    });

    document.getElementById('signout-all-btn')?.addEventListener('click', () => {
      Store.logout();
      Navbar.update();
      Router.navigate('#/');
      Toast.info('Signed out from all devices');
    });

    const wishlistGrid = document.getElementById('account-wishlist-grid');
    if (wishlistGrid) bindProductCardEvents(wishlistGrid);
  }

  render();
}
