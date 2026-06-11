/* ============================================================
   store.js — Global State Management (with Admin support)
   ============================================================ */

const Store = (() => {
  // Admin credentials (hardcoded)
  const ADMIN_EMAIL = 'admin@sportzone.com';
  const ADMIN_PASSWORD = 'Admin@123';

  let state = {
    cart: [],
    wishlist: [],
    user: null,
    orders: [],
    products: null   // null = use PRODUCTS seed; set to array after admin edits
  };

  /* ---------- Persist / Load ---------- */
  function load() {
    try {
      const saved = localStorage.getItem('sz_state');
      if (saved) {
        const p = JSON.parse(saved);
        state.cart      = p.cart      || [];
        state.wishlist  = p.wishlist  || [];
        state.user      = p.user      || null;
        state.orders    = p.orders    || [];
        state.products  = p.products  || null;
      }
    } catch (e) { /* ignore parse errors */ }
  }

  function save() {
    try {
      localStorage.setItem('sz_state', JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  /* ---------- Events ---------- */
  const _listeners = {};
  function on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }
  function emit(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
  }

  /* ===================== PRODUCTS (Admin CRUD) ===================== */
  function getProducts() {
    return state.products ? state.products : [...PRODUCTS];
  }

  function getProduct(id) {
    // eslint-disable-next-line eqeqeq
    return getProducts().find(p => p.id == id);
  }

  function addProduct(product) {
    const list = getProducts();
    product.id = 'P-' + Date.now();
    list.push(product);
    state.products = list;
    save();
    emit('products:updated', list);
    return product;
  }

  function updateProduct(id, updates) {
    const list = getProducts();
    // eslint-disable-next-line eqeqeq
    const idx = list.findIndex(p => p.id == id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      state.products = list;
      save();
      emit('products:updated', list);
      return list[idx];
    }
    return null;
  }

  function deleteProduct(id) {
    // eslint-disable-next-line eqeqeq
    const list = getProducts().filter(p => p.id != id);
    state.products = list;
    // Also remove from cart & wishlist
    // eslint-disable-next-line eqeqeq
    state.cart     = state.cart.filter(i => i.id != id);
    // eslint-disable-next-line eqeqeq
    state.wishlist = state.wishlist.filter(p => p.id != id);
    save();
    emit('products:updated', list);
    emit('cart:updated', state.cart);
    emit('wishlist:updated', state.wishlist);
  }

  /* ===================== CART ===================== */
  function getCart()      { return state.cart; }
  function getCartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }
  function getCartTotal() { return state.cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function addToCart(product, qty = 1, size = null, color = null) {
    const key = `${product.id}_${size}_${color}`;
    const existing = state.cart.find(i => i.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock || 99);
    } else {
      state.cart.push({ key, id: product.id, product, price: product.price, qty, size, color });
    }
    save();
    emit('cart:updated', state.cart);
  }

  function removeFromCart(key) {
    state.cart = state.cart.filter(i => i.key !== key);
    save();
    emit('cart:updated', state.cart);
  }

  function updateCartQty(key, qty) {
    const item = state.cart.find(i => i.key === key);
    if (item) {
      if (qty <= 0) removeFromCart(key);
      else item.qty = qty;
    }
    save();
    emit('cart:updated', state.cart);
  }

  function clearCart() {
    state.cart = [];
    save();
    emit('cart:updated', state.cart);
  }

  /* ===================== WISHLIST ===================== */
  function getWishlist()     { return state.wishlist; }
  function isWishlisted(id)  { return state.wishlist.some(p => p.id === id); }

  function toggleWishlist(product) {
    const idx = state.wishlist.findIndex(p => p.id === product.id);
    if (idx === -1) state.wishlist.push(product);
    else state.wishlist.splice(idx, 1);
    save();
    emit('wishlist:updated', state.wishlist);
    return idx === -1;
  }

  /* ===================== AUTH ===================== */
  function getUser()  { return state.user; }
  function isAdmin()  { return state.user && state.user.role === 'admin'; }

  function login(email, password) {
    // Admin login
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      state.user = {
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        avatar: 'A',
        joined: new Date().toISOString()
      };
      save();
      emit('auth:changed', state.user);
      return { success: true, role: 'admin' };
    }
    // Regular user login — check registered users
    try {
      const users = JSON.parse(localStorage.getItem('sz_users') || '[]');
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found) {
        state.user = { name: found.name, email: found.email, role: 'user', avatar: found.name[0].toUpperCase(), joined: found.joined };
        save();
        emit('auth:changed', state.user);
        return { success: true, role: 'user' };
      }
      return { success: false, message: 'Invalid email or password.' };
    } catch (e) {
      return { success: false, message: 'Login failed.' };
    }
  }

  function register(name, email, password) {
    if (email.toLowerCase() === ADMIN_EMAIL) return { success: false, message: 'Email not available.' };
    try {
      const users = JSON.parse(localStorage.getItem('sz_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newUser = { name, email, password, joined: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('sz_users', JSON.stringify(users));
      state.user = { name, email, role: 'user', avatar: name[0].toUpperCase(), joined: newUser.joined };
      save();
      emit('auth:changed', state.user);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Registration failed.' };
    }
  }

  function logout() {
    state.user = null;
    save();
    emit('auth:changed', null);
  }

  /* ===================== ORDERS ===================== */
  function getOrders() { return state.orders; }

  function placeOrder(cart, total, address) {
    const order = {
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      total,
      items: cart.map(i => ({ ...i.product, qty: i.qty, size: i.size, color: i.color })),
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      address
    };
    state.orders.unshift(order);
    clearCart();
    save();
    emit('orders:updated', state.orders);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      save();
      emit('orders:updated', state.orders);
    }
  }

  /* ===================== THEME ===================== */
  function getTheme() { return localStorage.getItem('sz_theme') || 'dark'; }
  function setTheme(t) {
    localStorage.setItem('sz_theme', t);
    document.documentElement.dataset.theme = t;
    emit('theme:changed', t);
  }
  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  /* ---------- Init ---------- */
  load();
  // Apply theme immediately
  document.documentElement.dataset.theme = getTheme();

  return {
    on, emit,
    // Products
    getProducts, getProduct, addProduct, updateProduct, deleteProduct,
    // Cart
    getCart, getCartCount, getCartTotal, addToCart, removeFromCart, updateCartQty, clearCart,
    // Wishlist
    getWishlist, isWishlisted, toggleWishlist,
    // Auth
    getUser, isAdmin, login, register, logout,
    // Orders
    getOrders, placeOrder, updateOrderStatus,
    // Theme
    getTheme, setTheme, toggleTheme,
    // Admin email (for display)
    ADMIN_EMAIL
  };
})();
