/* ============================================================
   home.js — Homepage
   ============================================================ */

function renderProductCard(product) {
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const wishlisted = Store.isWishlisted(product.id);
  return `
    <div class="product-card stagger-item" data-id="${product.id}">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-card-badges">
          ${product.badge === 'sale' ? `<span class="badge badge-sale">−${discount}%</span>` : ''}
          ${product.badge === 'new' ? '<span class="badge badge-new">New</span>' : ''}
          ${product.badge === 'hot' ? '<span class="badge badge-hot">🔥 Hot</span>' : ''}
          ${product.stock <= 5 ? '<span class="badge badge-warning">Low Stock</span>' : ''}
        </div>
        <div class="product-card-actions">
          <button class="card-action-btn wishlist-btn ${wishlisted ? 'wishlisted' : ''}" data-id="${product.id}" aria-label="Wishlist" title="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
            ${wishlisted ? '❤️' : '🤍'}
          </button>
          <button class="card-action-btn quick-view-btn" data-id="${product.id}" aria-label="Quick view" title="Quick view">👁️</button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${product.brand}</div>
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-rating">
          ${getStarHTML(product.rating)}
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="price-save">Save ${discount}%</span>` : ''}
        </div>
      </div>
      <div class="product-card-footer">
        <button class="btn btn-primary btn-block btn-sm add-to-cart-btn" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function bindProductCardEvents(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const product = PRODUCTS.find(p => p.id === +btn.dataset.id);
      if (product) {
        Store.addToCart(product, 1, product.sizes?.[0] || null);
        Toast.success(`${product.name} added to cart! 🛒`);
        Navbar.update();
      }
    });
  });

  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const product = PRODUCTS.find(p => p.id === +btn.dataset.id);
      if (!product) return;
      const added = Store.toggleWishlist(product);
      btn.classList.toggle('wishlisted', added);
      btn.textContent = added ? '❤️' : '🤍';
      Toast[added ? 'success' : 'info'](added ? `Added to wishlist! ❤️` : `Removed from wishlist`);
      Navbar.update();
    });
  });

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      const id = card.dataset.id;
      Router.navigate(`#/product/${id}`);
    });
  });

  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      Router.navigate(`#/product/${btn.dataset.id}`);
    });
  });
}

function renderHomePage() {
  const page = document.getElementById('page-content');
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 8);
  const trending = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const newArrivals = PRODUCTS.filter(p => p.badge === 'new');

  page.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid-overlay"></div>
      <div class="container hero-content">
        <div style="max-width:600px">
          <div class="hero-eyebrow">🏆 Premium Sports Equipment</div>
          <h1 class="hero-title">
            GEAR UP.<br>
            PUSH <span class="accent">HARDER.</span><br>
            WIN MORE.
          </h1>
          <p class="hero-desc">Discover professional-grade sports equipment for every athlete. From beginners to champions — we've got your game covered.</p>
          <div class="hero-actions">
            <a href="#/catalog" class="btn btn-primary btn-xl">Shop All Gear →</a>
            <a href="#/catalog?badge=sale" class="btn btn-secondary btn-xl">🔥 Sale Picks</a>
          </div>
          <div class="hero-stats">
            <div>
              <div class="hero-stat-value">500+</div>
              <div class="hero-stat-label">Products</div>
            </div>
            <div>
              <div class="hero-stat-value">50K+</div>
              <div class="hero-stat-label">Happy Athletes</div>
            </div>
            <div>
              <div class="hero-stat-value">4.8★</div>
              <div class="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section" style="padding-top:var(--space-12)">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Shop by Sport</h2>
            <p class="section-subtitle">Find the perfect gear for your favourite sport</p>
          </div>
          <a href="#/catalog" class="view-all-link">All Categories</a>
        </div>
        <div class="categories-grid stagger-children">
          ${CATEGORIES.map(cat => `
            <a href="#/catalog?category=${cat.id}" class="category-card">
              <span class="category-icon">${cat.icon}</span>
              <span class="category-name">${cat.name}</span>
              <span class="category-count">${cat.count} products</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured Deals</h2>
            <p class="section-subtitle">Handpicked products with unbeatable prices</p>
          </div>
          <a href="#/catalog?badge=sale" class="view-all-link">View All Deals</a>
        </div>
        <div id="featured-grid" class="products-grid stagger-children">
          ${featured.map(renderProductCard).join('')}
        </div>
      </div>
    </section>

    <!-- PROMO BANNER -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="promo-banner">
          <div class="promo-banner-text">
            <div class="promo-banner-eyebrow">⚡ Limited Time Offer</div>
            <h2 class="promo-banner-title">GET 20% OFF YOUR FIRST ORDER</h2>
            <p class="promo-banner-desc">Use code <strong>NEWUSER</strong> at checkout. Valid on all products.</p>
          </div>
          <div class="promo-banner-action">
            <a href="#/catalog" class="btn btn-white btn-xl">Shop Now →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- TRENDING -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">🔥 Trending Now</h2>
            <p class="section-subtitle">Most popular picks this week</p>
          </div>
          <a href="#/catalog" class="view-all-link">View All</a>
        </div>
        <div id="trending-grid" class="products-grid stagger-children">
          ${trending.map(renderProductCard).join('')}
        </div>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    ${newArrivals.length ? `
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">✨ New Arrivals</h2>
            <p class="section-subtitle">Fresh drops just landed</p>
          </div>
        </div>
        <div id="new-grid" class="products-grid stagger-children">
          ${newArrivals.map(renderProductCard).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- FEATURES STRIP -->
    <section style="background:var(--bg-surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:var(--space-10) 0;margin-top:var(--space-8)">
      <div class="container">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-6);text-align:center" id="features-strip">
          ${[
            ['🚚', 'Free Delivery', 'On orders above ₹999'],
            ['↩️', 'Easy Returns', '30-day hassle-free returns'],
            ['🔒', 'Secure Payments', '100% encrypted transactions'],
            ['🏆', 'Authentic Products', 'Official brand partnerships']
          ].map(([icon, title, desc]) => `
            <div>
              <div style="font-size:2rem;margin-bottom:0.5rem">${icon}</div>
              <div style="font-weight:700;font-size:0.9375rem;margin-bottom:0.25rem">${title}</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary)">${desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Bind events on all product grids
  ['featured-grid', 'trending-grid', 'new-grid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) bindProductCardEvents(el);
  });

  // Responsive features strip
  const strip = document.getElementById('features-strip');
  if (strip && window.innerWidth < 700) {
    strip.style.gridTemplateColumns = 'repeat(2,1fr)';
  }
}
