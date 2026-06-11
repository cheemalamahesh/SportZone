/* ============================================================
   cart.js — Full Cart Page
   ============================================================ */

function renderCartPage() {
  const page = document.getElementById('page-content');

  function render() {
    const cart = Store.getCart();
    const subtotal = Store.getCartTotal();
    let promoDiscount = 0;
    let appliedPromo = null;
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - promoDiscount + shipping;

    page.innerHTML = `
      <div class="page-header">
        <div class="container">
          <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">Shopping Cart</span></nav>
          <h1 class="page-header-title">🛒 Shopping Cart</h1>
        </div>
      </div>
      <div class="container">
        ${!cart.length ? `
          <div class="empty-state" style="padding:6rem 2rem">
            <div class="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items yet.</p>
            <a href="#/catalog" class="btn btn-primary btn-lg mt-6">Start Shopping →</a>
          </div>` :
        `<div class="cart-layout">
          <!-- Cart Items -->
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
              <span style="font-weight:700;font-size:1rem">${Store.getCartCount()} item${Store.getCartCount() !== 1 ? 's' : ''}</span>
              <button class="btn btn-danger btn-sm" id="clear-cart-btn">🗑️ Clear Cart</button>
            </div>
            <div id="cart-items-list" style="display:flex;flex-direction:column;gap:0.875rem">
              ${cart.map(item => `
                <div class="cart-item" data-key="${item.key}">
                  <a href="#/product/${item.product.id}" class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
                  </a>
                  <div class="cart-item-details">
                    <div class="cart-item-brand">${item.product.brand}</div>
                    <a href="#/product/${item.product.id}" class="cart-item-name">${item.product.name}</a>
                    <div class="cart-item-meta">
                      ${item.size ? `Size: ${item.size}` : ''}
                    </div>
                    <div class="cart-item-controls">
                      <div class="qty-control">
                        <button class="qty-btn" data-key="${item.key}" data-action="dec">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-key="${item.key}" data-action="inc">+</button>
                      </div>
                      <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
                      <button class="btn btn-danger btn-sm" data-key="${item.key}" data-action="remove">Remove</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:1.5rem">
              <a href="#/catalog" class="btn btn-secondary">← Continue Shopping</a>
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <div class="order-summary-card">
              <div class="order-summary-title">Order Summary</div>
              <div id="summary-lines">
                <div class="summary-line"><span>Subtotal (${Store.getCartCount()} items)</span><span>${formatPrice(subtotal)}</span></div>
                <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : formatPrice(shipping)}</span></div>
                ${shipping > 0 ? `<div style="font-size:0.75rem;color:var(--text-secondary);margin-top:-0.5rem">Add ${formatPrice(999 - subtotal)} more for free shipping</div>` : ''}
                <div class="summary-line" id="promo-line" style="display:none"><span>Promo Discount</span><span id="promo-amount" style="color:var(--success)"></span></div>
                <div class="summary-line total"><span>Total</span><span id="total-amount">${formatPrice(total)}</span></div>
              </div>

              <!-- Promo Code -->
              <div class="promo-input-wrap">
                <input id="promo-input" class="form-input" type="text" placeholder="Promo code (e.g. SAVE10)" />
                <button id="apply-promo-btn" class="btn btn-secondary">Apply</button>
              </div>
              <div id="promo-msg" style="font-size:0.8rem;margin-top:0.25rem"></div>

              <a href="#/checkout" class="btn btn-primary btn-block btn-lg" style="margin-top:1rem">Proceed to Checkout →</a>
              <div style="margin-top:0.875rem;text-align:center">
                ${['🔒 Secure checkout', '↩️ Easy returns'].map(f => `<span style="font-size:0.75rem;color:var(--text-secondary);margin:0 0.5rem">${f}</span>`).join('')}
              </div>
            </div>

            <!-- Trust badges -->
            <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
              ${['VISA', 'MC', 'PayPal', 'UPI'].map(p => `<span class="payment-badge">${p}</span>`).join('')}
            </div>
          </div>
        </div>`}
      </div>
    `;

    if (!cart.length) return;

    // Bind qty / remove
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const action = btn.dataset.action;
        if (action === 'remove') { Store.removeFromCart(key); render(); Navbar.update(); }
        else {
          const item = Store.getCart().find(i => i.key === key);
          if (action === 'inc') Store.updateCartQty(key, (item?.qty || 0) + 1);
          else Store.updateCartQty(key, (item?.qty || 1) - 1);
          render();
          Navbar.update();
        }
      });
    });

    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
      if (confirm('Clear all items from cart?')) { Store.clearCart(); render(); Navbar.update(); }
    });

    // Promo
    document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
      const code = document.getElementById('promo-input').value.trim().toUpperCase();
      const promo = PROMO_CODES[code];
      const msg = document.getElementById('promo-msg');
      if (!promo) {
        msg.textContent = '❌ Invalid promo code';
        msg.style.color = 'var(--error)';
        return;
      }
      promoDiscount = Math.round(subtotal * promo.discount);
      appliedPromo = code;
      msg.textContent = `✅ ${promo.label} applied!`;
      msg.style.color = 'var(--success)';
      document.getElementById('promo-line').style.display = 'flex';
      document.getElementById('promo-amount').textContent = `−${formatPrice(promoDiscount)}`;
      document.getElementById('total-amount').textContent = formatPrice(subtotal - promoDiscount + shipping);
    });
  }

  render();
}
