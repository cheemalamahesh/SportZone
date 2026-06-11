/* ============================================================
   product.js — Product Detail Page
   ============================================================ */

function renderProductPage(params) {
  const id = +params.id;
  const product = PRODUCTS.find(p => p.id === id);
  const page = document.getElementById('page-content');

  if (!product) {
    page.innerHTML = `<div class="empty-state" style="padding:8rem 2rem"><div class="empty-state-icon">❌</div><h3>Product Not Found</h3><a href="#/catalog" class="btn btn-primary mt-6">Browse Catalog</a></div>`;
    return;
  }

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  let selectedSize = product.sizes?.[0] || null;
  let selectedColor = product.colors?.[0] || null;
  let qty = 1;
  let activeTab = 'description';

  function getTabContent() {
    if (activeTab === 'description') {
      return `<p style="color:var(--text-secondary);line-height:1.8">${product.description}</p>
        <ul style="margin-top:1rem;display:flex;flex-direction:column;gap:0.5rem;color:var(--text-secondary)">
          <li>✅ Premium quality materials</li>
          <li>✅ Suitable for professional use</li>
          <li>✅ Warranty included</li>
          <li>✅ Ships within 2-3 business days</li>
        </ul>`;
    }
    if (activeTab === 'specs') {
      return `<div class="table-wrap"><table class="table"><thead><tr><th>Specification</th><th>Detail</th></tr></thead><tbody>
        <tr><td>Brand</td><td>${product.brand}</td></tr>
        <tr><td>Category</td><td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td></tr>
        <tr><td>Available Sizes</td><td>${product.sizes?.join(', ') || 'One Size'}</td></tr>
        <tr><td>Stock</td><td>${product.stock} units</td></tr>
        <tr><td>Rating</td><td>${product.rating} / 5 (${product.reviews} reviews)</td></tr>
      </tbody></table></div>`;
    }
    if (activeTab === 'reviews') {
      const mockReviews = [
        { name: 'Arjun S.', rating: 5, date: 'May 2026', text: 'Absolutely love this product! Quality is top-notch and delivery was super fast.' },
        { name: 'Priya M.', rating: 4, date: 'Apr 2026', text: 'Great value for money. Exactly as described. Would recommend to friends.' },
        { name: 'Rahul K.', rating: 5, date: 'Mar 2026', text: 'Best purchase I\'ve made in a long time. The quality surpassed my expectations!' }
      ];
      return mockReviews.map(r => `
        <div style="padding:1rem 0;border-bottom:1px solid var(--border-light)">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
            <div class="avatar" style="width:36px;height:36px;font-size:0.875rem">${r.name[0]}</div>
            <div>
              <div style="font-weight:700;font-size:0.875rem">${r.name}</div>
              <div style="font-size:0.75rem;color:var(--text-secondary)">${r.date}</div>
            </div>
            <span style="margin-left:auto;color:#F5A623">★★★★${r.rating === 5 ? '★' : '☆'}</span>
          </div>
          <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">${r.text}</p>
        </div>
      `).join('');
    }
    return '';
  }

  function render() {
    page.innerHTML = `
      <div class="page-header">
        <div class="container">
          <nav class="breadcrumb">
            <a href="#/">Home</a><span class="breadcrumb-sep">/</span>
            <a href="#/catalog">Shop</a><span class="breadcrumb-sep">/</span>
            <a href="#/catalog?category=${product.category}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a><span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">${product.name}</span>
          </nav>
        </div>
      </div>
      <div class="container">
        <div class="product-detail-layout">
          <!-- GALLERY -->
          <div class="product-gallery">
            <div class="product-main-image" id="main-image-wrap">
              <img id="main-product-img" src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-thumbnails">
              ${[product.image, product.image, product.image].map((img, i) => `
                <div class="product-thumb ${i === 0 ? 'active' : ''}" data-src="${img}" data-thumb="${i}">
                  <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>

          <!-- INFO -->
          <div>
            <div class="product-info-brand">${product.brand}</div>
            <h1 class="product-info-title">${product.name}</h1>

            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
              ${getStarHTML(product.rating)}
              <span style="font-size:0.875rem;color:var(--text-secondary)">${product.rating} (${product.reviews} reviews)</span>
              ${product.stock <= 5 ? `<span class="badge badge-warning">Only ${product.stock} left!</span>` : `<span class="badge badge-success">In Stock</span>`}
            </div>

            <div class="product-info-price">
              <span class="price-current">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
              ${discount > 0 ? `<span class="badge badge-sale">Save ${discount}%</span>` : ''}
            </div>

            <!-- Sizes -->
            ${product.sizes?.length ? `
              <div class="mb-4">
                <div class="product-options-label">Size: <strong>${selectedSize || ''}</strong></div>
                <div class="size-options" id="size-options">
                  ${product.sizes.map(s => `<button class="size-option ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
                </div>
              </div>` : ''}

            <!-- Colors -->
            ${product.colors?.length ? `
              <div class="mb-4">
                <div class="product-options-label">Color</div>
                <div class="color-options" id="color-options">
                  ${product.colors.map(c => `<div class="color-option ${c === selectedColor ? 'active' : ''}" data-color="${c}" style="background:${c};border:2px solid var(--border)" title="${c}"></div>`).join('')}
                </div>
              </div>` : ''}

            <!-- Quantity & Add to Cart -->
            <div class="product-add-section">
              <div class="qty-control">
                <button class="qty-btn" id="qty-dec">−</button>
                <span class="qty-value" id="qty-display">${qty}</span>
                <button class="qty-btn" id="qty-inc">+</button>
              </div>
              <button class="btn btn-primary btn-lg flex-1" id="add-to-cart-main">🛒 Add to Cart</button>
              <button class="btn btn-secondary btn-icon" id="wishlist-main" title="${Store.isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}">
                ${Store.isWishlisted(product.id) ? '❤️' : '🤍'}
              </button>
            </div>

            <div style="display:flex;gap:1.5rem;margin-bottom:1.5rem;flex-wrap:wrap">
              ${['🚚 Free delivery over ₹999', '↩️ 30-day returns', '🔒 Secure checkout'].map(f => `<span style="font-size:0.8125rem;color:var(--text-secondary)">${f}</span>`).join('')}
            </div>

            <!-- Tabs -->
            <div class="tabs mb-4" id="product-tabs">
              ${['description', 'specs', 'reviews'].map(tab => `
                <button class="tab-btn ${tab === activeTab ? 'active' : ''}" data-tab="${tab}">${tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              `).join('')}
            </div>
            <div id="tab-content" class="product-tab-content">${getTabContent()}</div>
          </div>
        </div>

        <!-- RELATED PRODUCTS -->
        ${related.length ? `
        <div class="section" style="padding-top:var(--space-12)">
          <div class="section-header">
            <h2 class="section-title">Related Products</h2>
          </div>
          <div id="related-grid" class="products-grid stagger-children">
            ${related.map(renderProductCard).join('')}
          </div>
        </div>` : ''}
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Thumbnails
    document.querySelectorAll('.product-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('main-product-img').src = thumb.dataset.src;
      });
    });

    // Sizes
    document.querySelectorAll('.size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        document.querySelector('.product-options-label strong').textContent = selectedSize;
      });
    });

    // Colors
    document.querySelectorAll('.color-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        selectedColor = el.dataset.color;
      });
    });

    // Qty
    document.getElementById('qty-dec')?.addEventListener('click', () => {
      if (qty > 1) { qty--; document.getElementById('qty-display').textContent = qty; }
    });
    document.getElementById('qty-inc')?.addEventListener('click', () => {
      if (qty < (product.stock || 99)) { qty++; document.getElementById('qty-display').textContent = qty; }
    });

    // Add to cart
    document.getElementById('add-to-cart-main')?.addEventListener('click', () => {
      Store.addToCart(product, qty, selectedSize, selectedColor);
      Toast.success(`${product.name} added to cart! 🛒`);
      Navbar.update();
    });

    // Wishlist
    document.getElementById('wishlist-main')?.addEventListener('click', () => {
      const added = Store.toggleWishlist(product);
      document.getElementById('wishlist-main').textContent = added ? '❤️' : '🤍';
      Toast[added ? 'success' : 'info'](added ? 'Added to wishlist! ❤️' : 'Removed from wishlist');
      Navbar.update();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        document.getElementById('tab-content').innerHTML = getTabContent();
      });
    });

    // Related products
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) bindProductCardEvents(relatedGrid);
  }

  render();
}
