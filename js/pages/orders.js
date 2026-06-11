/* ============================================================
   orders.js — Orders History Page
   ============================================================ */

function renderOrdersPage() {
  const page = document.getElementById('page-content');
  const user = Store.getUser();

  if (!user) {
    page.innerHTML = `
      <div class="empty-state" style="padding:8rem 2rem">
        <div class="empty-state-icon">🔐</div>
        <h3>Sign In to View Orders</h3>
        <p>Please sign in to see your order history.</p>
        <button class="btn btn-primary btn-lg mt-6" id="orders-login-btn">Sign In</button>
      </div>`;
    document.getElementById('orders-login-btn')?.addEventListener('click', () => Auth.open('login'));
    return;
  }

  const orders = Store.getOrders();
  const statusColors = {
    pending: 'pending', processing: 'processing', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled'
  };

  page.innerHTML = `
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb"><a href="#/">Home</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">My Orders</span></nav>
        <h1 class="page-header-title">📦 My Orders</h1>
      </div>
    </div>
    <div class="container orders-page">
      ${!orders.length ? `
        <div class="empty-state" style="padding:6rem 2rem">
          <div class="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here once you make a purchase.</p>
          <a href="#/catalog" class="btn btn-primary btn-lg mt-6">Start Shopping →</a>
        </div>` :
      `<div style="display:flex;flex-direction:column;gap:1rem">
         ${orders.map(order => `
           <div class="order-card">
             <div class="order-card-header">
               <div>
                 <div class="order-id">${order.id}</div>
                 <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:0.2rem">Placed: ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
               </div>
               <div style="display:flex;align-items:center;gap:1rem">
                 <span class="status-badge ${statusColors[order.status]}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                 <span style="font-weight:800;font-size:1rem">${formatPrice(order.total)}</span>
               </div>
             </div>
             <div class="order-card-body">
               <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
                 <div class="order-items-preview">
                   ${order.items.slice(0, 4).map(item => `
                     <div class="order-item-thumb">
                       <img src="${item.image}" alt="${item.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
                     </div>`).join('')}
                   ${order.items.length > 4 ? `<div class="order-item-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--bg-elevated);font-size:0.8rem;font-weight:700;color:var(--text-secondary)">+${order.items.length - 4}</div>` : ''}
                 </div>
                 <div style="font-size:0.875rem;color:var(--text-secondary)">${order.itemCount} item${order.itemCount !== 1 ? 's' : ''}</div>
               </div>
               ${order.status === 'shipped' ? `
                 <div class="alert alert-info" style="margin-top:0.875rem;font-size:0.8rem">🚚 Your order is on its way! Expected delivery: ${new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN')}</div>` : ''}
             </div>
           </div>`).join('')}
       </div>`}
    </div>
  `;
}
