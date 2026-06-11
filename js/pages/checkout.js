/* ============================================================
   checkout.js — Multi-step Checkout
   ============================================================ */

function renderCheckoutPage() {
  const page = document.getElementById('page-content');
  const cart = Store.getCart();

  if (!cart.length) {
    page.innerHTML = `
      <div class="empty-state" style="padding:8rem 2rem">
        <div class="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add items to your cart before checking out.</p>
        <a href="#/catalog" class="btn btn-primary mt-6">Shop Now →</a>
      </div>`;
    return;
  }

  let currentStep = 1;
  let formData = { address: {}, payment: {}, complete: false };
  const subtotal = Store.getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  function stepperHTML() {
    const steps = ['Shipping', 'Payment', 'Review'];
    return `
      <div class="stepper checkout-stepper">
        ${steps.map((label, i) => {
          const n = i + 1;
          const cls = n < currentStep ? 'done' : n === currentStep ? 'active' : '';
          return `
            ${n > 1 ? `<div class="step-line${n - 1 < currentStep ? ' done' : ''}"></div>` : ''}
            <div class="step ${cls}">
              <div class="step-circle">${n < currentStep ? '✓' : n}</div>
              <span class="step-label">${label}</span>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderStep1() {
    return `
      <div class="checkout-step-panel">
        <div class="checkout-step-title">📦 Shipping Information</div>
        <form id="shipping-form" novalidate>
          <div class="form-row mb-4">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input class="form-input" name="firstName" required placeholder="John" value="${formData.address.firstName || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input class="form-input" name="lastName" required placeholder="Doe" value="${formData.address.lastName || ''}" />
            </div>
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Email *</label>
            <input class="form-input" name="email" type="email" required placeholder="john@example.com" value="${formData.address.email || Store.getUser()?.email || ''}" />
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Phone *</label>
            <input class="form-input" name="phone" type="tel" required placeholder="+91 98765 43210" value="${formData.address.phone || ''}" />
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Address Line 1 *</label>
            <input class="form-input" name="address1" required placeholder="123 Main Street" value="${formData.address.address1 || ''}" />
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Address Line 2</label>
            <input class="form-input" name="address2" placeholder="Apartment, suite, etc." value="${formData.address.address2 || ''}" />
          </div>
          <div class="form-row mb-4">
            <div class="form-group">
              <label class="form-label">City *</label>
              <input class="form-input" name="city" required placeholder="Mumbai" value="${formData.address.city || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">PIN Code *</label>
              <input class="form-input" name="pin" required placeholder="400001" value="${formData.address.pin || ''}" />
            </div>
          </div>
          <div class="form-group mb-6">
            <label class="form-label">State *</label>
            <select class="form-select" name="state">
              <option value="">Select state</option>
              ${['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Rajasthan'].map(s => `<option ${formData.address.state === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-lg">Continue to Payment →</button>
        </form>
      </div>`;
  }

  function renderStep2() {
    return `
      <div class="checkout-step-panel">
        <div class="checkout-step-title">💳 Payment Details</div>
        <div class="tabs mb-5" id="payment-tabs">
          ${[['card', '💳 Card'], ['upi', '📱 UPI'], ['cod', '💵 Cash on Delivery']].map(([val, label], i) =>
            `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-payment="${val}">${label}</button>`
          ).join('')}
        </div>
        <div id="payment-form-area">
          ${renderCardForm()}
        </div>
        <div style="margin-top:1.5rem;display:flex;gap:0.75rem">
          <button class="btn btn-secondary" id="back-to-step1">← Back</button>
          <button class="btn btn-primary btn-lg flex-1" id="next-to-step3">Review Order →</button>
        </div>
      </div>`;
  }

  function renderCardForm() {
    return `
      <div class="form-group mb-4">
        <label class="form-label">Card Number</label>
        <input class="form-input" placeholder="4242 4242 4242 4242" maxlength="19" id="card-number" />
      </div>
      <div class="form-row mb-4">
        <div class="form-group">
          <label class="form-label">Expiry</label>
          <input class="form-input" placeholder="MM/YY" maxlength="5" id="card-expiry" />
        </div>
        <div class="form-group">
          <label class="form-label">CVV</label>
          <input class="form-input" placeholder="123" maxlength="3" type="password" id="card-cvv" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Name on Card</label>
        <input class="form-input" placeholder="John Doe" id="card-name" />
      </div>`;
  }

  function renderStep3() {
    const addr = formData.address;
    return `
      <div class="checkout-step-panel">
        <div class="checkout-step-title">📋 Review Your Order</div>
        <div style="margin-bottom:1.5rem">
          <div style="font-weight:700;margin-bottom:0.75rem;color:var(--text-secondary);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.06em">Shipping To</div>
          <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:0.875rem 1rem;font-size:0.9rem">
            <strong>${addr.firstName} ${addr.lastName}</strong><br>
            ${addr.address1}${addr.address2 ? ', ' + addr.address2 : ''}<br>
            ${addr.city}, ${addr.state} - ${addr.pin}<br>
            📧 ${addr.email} | 📱 ${addr.phone}
          </div>
        </div>
        <div style="margin-bottom:1.5rem">
          <div style="font-weight:700;margin-bottom:0.75rem;color:var(--text-secondary);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.06em">Items (${Store.getCartCount()})</div>
          <div style="display:flex;flex-direction:column;gap:0.625rem">
            ${cart.map(item => `
              <div style="display:flex;align-items:center;gap:0.875rem;padding:0.75rem;background:var(--bg-elevated);border-radius:var(--radius-md)">
                <img src="${item.product.image}" alt="${item.product.name}" style="width:50px;height:50px;object-fit:cover;border-radius:var(--radius-sm)">
                <div style="flex:1">
                  <div style="font-size:0.875rem;font-weight:600">${item.product.name}</div>
                  ${item.size ? `<div style="font-size:0.75rem;color:var(--text-secondary)">Size: ${item.size}</div>` : ''}
                </div>
                <div style="font-weight:700">×${item.qty}</div>
                <div style="font-weight:800">${formatPrice(item.price * item.qty)}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:1.5rem;display:flex;gap:0.75rem">
          <button class="btn btn-secondary" id="back-to-step2">← Back</button>
          <button class="btn btn-primary btn-lg flex-1" id="place-order-btn">✅ Place Order</button>
        </div>
      </div>`;
  }

  function renderSummary() {
    return `
      <div class="order-summary-card">
        <div class="order-summary-title">Order Summary</div>
        <div class="summary-line"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : formatPrice(shipping)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${formatPrice(total)}</span></div>
        <div style="margin-top:1rem">
          ${cart.slice(0, 3).map(item => `
            <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem">
              <img src="${item.product.image}" alt="${item.product.name}" style="width:40px;height:40px;object-fit:cover;border-radius:var(--radius-sm)">
              <span style="font-size:0.8rem;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.product.name}</span>
              <span style="font-size:0.8rem;font-weight:700">×${item.qty}</span>
            </div>`).join('')}
          ${cart.length > 3 ? `<p style="font-size:0.8rem;color:var(--text-secondary)">+${cart.length - 3} more item(s)</p>` : ''}
        </div>
      </div>`;
  }

  function render() {
    page.innerHTML = `
      <div class="page-header">
        <div class="container">
          <h1 class="page-header-title">Checkout</h1>
        </div>
      </div>
      <div class="container">
        <div id="checkout-stepper-wrap">${stepperHTML()}</div>
        <div class="checkout-layout">
          <div id="checkout-step-area">
            ${currentStep === 1 ? renderStep1() : currentStep === 2 ? renderStep2() : renderStep3()}
          </div>
          <div>${renderSummary()}</div>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    if (currentStep === 1) {
      document.getElementById('shipping-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        if (!data.firstName || !data.email || !data.phone || !data.address1 || !data.city || !data.pin || !data.state) {
          Toast.error('Please fill in all required fields.');
          return;
        }
        formData.address = data;
        currentStep = 2;
        render();
      });
    }
    if (currentStep === 2) {
      document.getElementById('back-to-step1')?.addEventListener('click', () => { currentStep = 1; render(); });
      document.getElementById('next-to-step3')?.addEventListener('click', () => { currentStep = 3; render(); });

      // Payment tab switching
      document.querySelectorAll('[data-payment]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-payment]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const area = document.getElementById('payment-form-area');
          const type = btn.dataset.payment;
          if (type === 'card') area.innerHTML = renderCardForm();
          else if (type === 'upi') area.innerHTML = `<div class="form-group"><label class="form-label">UPI ID</label><input class="form-input" placeholder="yourname@paytm" /></div>`;
          else area.innerHTML = `<div class="alert alert-info">💵 You will pay cash when your order is delivered. No online payment required.</div>`;
        });
      });

      // Card number formatting
      document.getElementById('card-number')?.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
      });
      document.getElementById('card-expiry')?.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5);
      });
    }
    if (currentStep === 3) {
      document.getElementById('back-to-step2')?.addEventListener('click', () => { currentStep = 2; render(); });
      document.getElementById('place-order-btn')?.addEventListener('click', () => {
        const btn = document.getElementById('place-order-btn');
        btn.classList.add('btn-loading');
        btn.textContent = 'Placing Order…';
        btn.disabled = true;
        setTimeout(() => {
          const order = Store.placeOrder(cart, total, formData.address);
          Navbar.update();
          page.innerHTML = `
            <div class="container">
              <div class="checkout-success">
                <div class="checkout-success-icon">🎉</div>
                <h2 style="font-size:1.75rem;font-weight:800;margin-bottom:0.75rem">Order Placed Successfully!</h2>
                <p style="color:var(--text-secondary);margin-bottom:0.5rem">Order ID: <strong style="color:var(--primary)">${order.id}</strong></p>
                <p style="color:var(--text-secondary);margin-bottom:2rem">Thank you for shopping with SportZone. You'll receive a confirmation email at <strong>${formData.address.email}</strong></p>
                <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
                  <a href="#/orders" class="btn btn-primary btn-lg">Track My Order →</a>
                  <a href="#/" class="btn btn-secondary btn-lg">Continue Shopping</a>
                </div>
              </div>
            </div>`;
        }, 1800);
      });
    }
  }

  render();
}
