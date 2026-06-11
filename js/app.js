/* ============================================================
   app.js — App Bootstrap & Route Registration
   ============================================================ */

(function () {
  // Theme is applied by Store immediately on load, but fallback:
  const savedTheme = Store.getTheme();
  document.documentElement.dataset.theme = savedTheme;

  // Register all routes
  Router.register('',              renderHomePage);
  Router.register('/',             renderHomePage);
  Router.register('catalog',       renderCatalogPage);
  Router.register('product/:id',   renderProductPage);
  Router.register('cart',          renderCartPage);
  Router.register('checkout',      renderCheckoutPage);
  Router.register('wishlist',      renderWishlistPage);
  Router.register('orders',        renderOrdersPage);
  Router.register('account',       renderAccountPage);
  Router.register('admin',         renderAdminPage);

  // Re-render navbar on state changes
  Store.on('auth:changed',     () => Navbar.render());
  Store.on('cart:updated',     () => Navbar.render());
  Store.on('wishlist:updated', () => Navbar.render());
  Store.on('theme:changed',    () => Navbar.render());

  // Init components
  CartDrawer.init();
  Navbar.render();
  Router.init();

  // Re-render navbar on route change (active link highlight)
  window.addEventListener('hashchange', () => Navbar.render());

  console.log('%c⚡ SportZone', 'color:#FF6B35;font-size:2rem;font-weight:bold;font-family:sans-serif');
  console.log('%cAdmin → admin@sportzone.com / Admin@123', 'color:#8B949E;font-size:0.85rem');
})();
