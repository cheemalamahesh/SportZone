/* ============================================================
   cart-drawer.js — Slide-in Cart Drawer
   ============================================================ */

const CartDrawer = (() => {
  let drawer = null;
  let open = false;

  function init() {
    Store.on('cart:updated', () => { if (open) render(); });
  }

  function toggle() { open ? close() : openDrawer(); }

  function openDrawer() {
    open = true;
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'cart-drawer-wrap';
      drawer.innerHTML = `
        <div id="cart-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);z-index:350;animation:fadeIn 0.2s ease"></div>
        <div id="cart-drawer" style="position:fixed;top:0;right:0;height:100vh;width:420px;max-width:100vw;background:var(--bg-surface);border-left:1px solid var(--border);z-index:360;display:flex;flex-direction:column;animation:slideInRight 0.3s ease">
          <div id="cart-drawer-header" style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border)">
            <h2 style="font-size:1.125rem;font-weight:700">🛒 Shopping Cart</h2>
            <button id="cart-close-btn" class="modal-close">✕</button>
          </div>
          <div id="cart-drawer-body" style="flex:1;overflow-y:auto;padding:1rem 1.5rem"></div>
          <div id="cart-drawer-footer" style="border-top:1px solid var(--border);padding:1.25rem 1.5rem"></div>
        </div>
      `;
      document.body.appendChild(drawer);
      drawer.querySelector('#cart-overlay').addEventListener('click', close);
      drawer.querySelector('#cart-close-btn').addEventListener('click', close);
      document.addEventListener('keydown', onKey);
    }
    render();
  }

  function render() {
    if (!drawer) return;
    const cart = Store.getCart();
    const body = drawer.querySelector('#cart-drawer-body');
    const footer = drawer.querySelector('#cart-drawer-footer');

    if (!cart.length) {
      body.innerHTML = `
        <div class="empty-state" style="padding:4rem 1rem">
          <div class="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some great sports gear to get started!</p>
          <a href="#/catalog" class="btn btn-primary mt-6" id="cart-shop-btn">Shop Now</a>
        </div>
      `;
      body.querySelector('#cart-shop-btn')?.addEventListener('click', close);
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="cart-drawer-item" style="display:flex;gap:0.875rem;padding:1rem 0;border-bottom:1px solid var(--border-light)">
        <img src="${item.product.image}" alt="${item.product.name}" style="width:72px;height:72px;object-fit:cover;border-radius:var(--radius-md);flex-shrink:0">
        <div style="flex:1;min-width:0">
          <div style="font-size:0.7rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:0.06em">${item.product.brand}</div>
          <div style="font-size:0.875rem;font-weight:600;margin:0.2rem 0;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.product.name}</div>
          ${item.size ? `<div style="font-size:0.75rem;color:var(--text-secondary)">Size: ${item.size}</div>` : ''}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.5rem">
            <div class="qty-control" style="transform:scale(0.9);transform-origin:left">
              <button class="qty-btn" data-key="${item.key}" data-action="dec">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-key="${item.key}" data-action="inc">+</button>
            </div>
            <div style="font-weight:800">${formatPrice(item.price * item.qty)}</div>
          </div>
        </div>
        <button class="btn-ghost" data-key="${item.key}" data-action="remove" style="align-self:flex-start;padding:0.25rem;color:var(--text-muted);font-size:1rem">✕</button>
      </div>
    `).join('');

    // Bind events
    body.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.key;
        const action = el.dataset.action;
        const item = Store.getCart().find(i => i.key === key);
        if (action === 'inc') Store.updateCartQty(key, (item?.qty || 0) + 1);
        else if (action === 'dec') Store.updateCartQty(key, (item?.qty || 1) - 1);
        else if (action === 'remove') Store.removeFromCart(key);
      });
    });

    const total = Store.getCartTotal();
    footer.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:1rem;font-size:1rem;font-weight:800">
        <span>Total</span><span>${formatPrice(total)}</span>
      </div>
      <a href="#/checkout" id="cart-checkout-btn" class="btn btn-primary btn-block btn-lg" style="margin-bottom:0.625rem">Checkout →</a>
      <a href="#/cart" id="cart-view-btn" class="btn btn-secondary btn-block">View Full Cart</a>
    `;
    footer.querySelector('#cart-checkout-btn').addEventListener('click', close);
    footer.querySelector('#cart-view-btn').addEventListener('click', close);
  }

  function close() {
    open = false;
    if (drawer) { drawer.remove(); drawer = null; }
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  return { init, toggle, open: openDrawer, close };
})();
