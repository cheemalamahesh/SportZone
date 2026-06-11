/* ============================================================
   wishlist.js — Wishlist Page
   ============================================================ */

function renderWishlistPage() {
  const page = document.getElementById('page-content');
  const wishlist = Store.getWishlist();

  page.innerHTML = `
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">Wishlist</span></nav>
        <h1 class="page-header-title">❤️ My Wishlist</h1>
      </div>
    </div>
    <div class="container wishlist-page">
      ${!wishlist.length ? `
        <div class="empty-state" style="padding:6rem 2rem">
          <div class="empty-state-icon">🤍</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love by clicking the heart icon on any product.</p>
          <a href="#/catalog" class="btn btn-primary btn-lg mt-6">Discover Products →</a>
        </div>` :
      `<div style="margin-bottom:1rem;color:var(--text-secondary);font-size:0.9rem">${wishlist.length} saved item${wishlist.length !== 1 ? 's' : ''}</div>
       <div id="wishlist-grid" class="products-grid stagger-children">
         ${wishlist.map(renderProductCard).join('')}
       </div>`}
    </div>
  `;

  const grid = document.getElementById('wishlist-grid');
  if (grid) bindProductCardEvents(grid);
}
