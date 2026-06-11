/* ============================================================
   navbar.js — Top Navigation Bar
   ============================================================ */

const Navbar = (() => {
  function render() {
    const root = document.getElementById('navbar-root');
    const user = Store.getUser();
    const cartCount = Store.getCartCount();
    const wishlistCount = Store.getWishlist().length;

    root.innerHTML = `
      <nav id="main-navbar" class="navbar" role="navigation" aria-label="Main navigation"
        style="position:fixed;top:0;left:0;right:0;z-index:var(--z-sticky);
               background:var(--navbar-bg);backdrop-filter:blur(16px);
               border-bottom:1px solid var(--navbar-border);height:72px;
               display:flex;align-items:center;transition:all var(--transition-base)">
        <div class="container flex-between" style="width:100%;height:100%">
          <!-- Logo -->
          <a href="#/" class="brand-logo" id="nav-logo" aria-label="SportZone Home">
            <span class="logo-icon" style="color:var(--primary)">⚡</span>
            <span class="logo-text">SportZone</span>
          </a>

          <!-- Desktop Nav Links -->
          <div id="nav-links" style="display:flex;align-items:center;gap:0.25rem" class="desktop-nav">
            ${[
              ['#/', 'Home'],
              ['#/catalog', 'Shop'],
              ['#/catalog?category=football', '⚽ Football'],
              ['#/catalog?category=basketball', '🏀 Basketball'],
              ['#/catalog?category=fitness', '🏋️ Fitness'],
            ].map(([href, label]) => `<a href="${href}" class="nav-link" style="padding:0.5rem 0.875rem;border-radius:var(--radius-md);font-size:0.875rem;font-weight:500;color:var(--text-secondary);transition:all var(--transition-fast)">${label}</a>`).join('')}
          </div>

          <!-- Actions -->
          <div style="display:flex;align-items:center;gap:0.5rem">
            <!-- Search -->
            <button id="nav-search-btn" class="btn btn-ghost btn-icon" aria-label="Search" title="Search">🔍</button>
            <!-- Theme Toggle -->
            <button id="nav-theme-btn" class="btn btn-ghost btn-icon" aria-label="Toggle theme" title="Toggle theme">
              ${document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <!-- Wishlist -->
            <a href="#/wishlist" class="btn btn-ghost btn-icon" style="position:relative" aria-label="Wishlist">
              ❤️${wishlistCount > 0 ? `<span class="badge-count" style="position:absolute;top:-4px;right:-4px;font-size:0.6rem">${wishlistCount}</span>` : ''}
            </a>
            <!-- Cart -->
            <button id="nav-cart-btn" class="btn btn-ghost btn-icon" style="position:relative" aria-label="Cart (${cartCount} items)">
              🛒${cartCount > 0 ? `<span class="badge-count" id="cart-badge" style="position:absolute;top:-4px;right:-4px;font-size:0.6rem">${cartCount}</span>` : ''}
            </button>
            <!-- User -->
            ${user
              ? `<div class="dropdown" id="user-dropdown">
                  <button class="avatar" id="user-avatar-btn" aria-haspopup="true" title="${user.name}">${user.avatar}</button>
                  <div class="dropdown-menu" id="user-menu" style="display:none;right:0;left:auto;min-width:200px">
                    <div style="padding:0.75rem 1rem;border-bottom:1px solid var(--border)">
                      <div style="font-weight:700;font-size:0.9rem">${user.name}</div>
                      <div style="font-size:0.75rem;color:var(--text-secondary)">${user.email}</div>
                    </div>
                    <a href="#/account" class="dropdown-item">👤 My Account</a>
                    <a href="#/orders" class="dropdown-item">📦 My Orders</a>
                    <a href="#/wishlist" class="dropdown-item">❤️ Wishlist</a>
                    ${Store.isAdmin() ? '<a href="#/admin" class="dropdown-item" style="color:var(--primary);font-weight:700">🛠️ Admin Panel</a>' : ''}
                    <div style="height:1px;background:var(--border);margin:0.25rem 0"></div>
                    <button class="dropdown-item danger" id="nav-logout-btn" style="width:100%;text-align:left">🚪 Sign Out</button>
                  </div>
                </div>`
              : `<button id="nav-login-btn" class="btn btn-outline-primary btn-sm">Sign In</button>`
            }
            <!-- Mobile hamburger -->
            <button id="nav-hamburger" class="btn btn-ghost btn-icon" aria-label="Menu" style="display:none">☰</button>
          </div>
        </div>
      </nav>
      <!-- Mobile menu -->
      <div id="mobile-menu" style="display:none;position:fixed;top:72px;left:0;right:0;background:var(--bg-surface);border-bottom:1px solid var(--border);z-index:199;padding:1rem;flex-direction:column;gap:0.25rem">
        ${[['#/', 'Home'], ['#/catalog', 'Shop All'], ['#/wishlist', 'Wishlist'], ['#/cart', 'Cart'], ['#/orders', 'Orders']].map(([href, label]) => `<a href="${href}" class="mobile-nav-link" style="display:block;padding:0.75rem 1rem;border-radius:var(--radius-md);font-weight:500;color:var(--text-primary)">${label}</a>`).join('')}
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Search
    document.getElementById('nav-search-btn')?.addEventListener('click', Search.open);
    // Cart
    document.getElementById('nav-cart-btn')?.addEventListener('click', CartDrawer.toggle);
    // Login
    document.getElementById('nav-login-btn')?.addEventListener('click', () => Auth.open('login'));
    // Logout
    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      Store.logout();
      Toast.info('Signed out. See you soon!');
      render();
    });

    // Theme toggle
    document.getElementById('nav-theme-btn')?.addEventListener('click', () => {
      Store.toggleTheme();
      const nowDark = document.documentElement.dataset.theme === 'dark';
      const btn = document.getElementById('nav-theme-btn');
      if (btn) btn.textContent = nowDark ? '☀️' : '🌙';
    });

    // User dropdown
    const avatarBtn = document.getElementById('user-avatar-btn');
    const userMenu = document.getElementById('user-menu');
    if (avatarBtn && userMenu) {
      avatarBtn.addEventListener('click', e => {
        e.stopPropagation();
        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
      });
      document.addEventListener('click', () => { if (userMenu) userMenu.style.display = 'none'; });
    }

    // Mobile hamburger
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const visible = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = visible ? 'none' : 'flex';
      });
    }

    // Highlight active nav link
    const hash = window.location.hash.split('?')[0];
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href').split('?')[0] === hash) {
        link.style.color = 'var(--primary)';
        link.style.background = 'var(--primary-glow)';
      }
    });

    // Responsive: show hamburger on mobile
    function checkWidth() {
      const hamburger = document.getElementById('nav-hamburger');
      const desktopNav = document.querySelector('.desktop-nav');
      if (!hamburger) return;
      if (window.innerWidth < 900) {
        hamburger.style.display = 'flex';
        if (desktopNav) desktopNav.style.display = 'none';
      } else {
        hamburger.style.display = 'none';
        if (desktopNav) desktopNav.style.display = 'flex';
        if (mobileMenu) mobileMenu.style.display = 'none';
      }
    }
    checkWidth();
    window.addEventListener('resize', checkWidth);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('main-navbar');
      if (nav) {
        if (window.scrollY > 20) {
          nav.style.boxShadow = 'var(--shadow-md)';
        } else {
          nav.style.boxShadow = 'none';
        }
      }
    });
  }

  function update() { render(); }

  return { render, update };
})();
