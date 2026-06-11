/* ============================================================
   auth.js — Login / Register Modal (with real password auth)
   ============================================================ */

const AuthModal = (() => {
  let modal = null;
  let mode = 'login';

  function open(initialMode = 'login') {
    if (modal) return;
    mode = initialMode;
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'auth-modal';
    render();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  }

  function render() {
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-label="${mode === 'login' ? 'Login' : 'Register'}">
        <div class="modal-header">
          <div>
            <div class="brand-logo" style="font-size:1.2rem;margin-bottom:0.25rem">
              <span class="logo-icon">⚡</span>
              <span class="logo-text">SportZone</span>
            </div>
            <h2 class="modal-title">${mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          </div>
          <button class="modal-close" id="auth-close">✕</button>
        </div>
        <div class="modal-body">
          ${mode === 'login' ? renderLogin() : renderRegister()}
        </div>
      </div>
    `;
    modal.querySelector('#auth-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    if (mode === 'login') bindLogin(); else bindRegister();
  }

  function renderLogin() {
    return `
      <form id="auth-form" novalidate>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-email">Email Address</label>
          <input id="auth-email" class="form-input" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-password">Password</label>
          <input id="auth-password" class="form-input" type="password" placeholder="••••••••" autocomplete="current-password" />
        </div>
        <div id="auth-error" class="alert alert-error mb-4 hidden"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" id="auth-submit">Sign In</button>
        <p style="text-align:center;margin-top:1rem;font-size:0.875rem;color:var(--text-secondary)">
          Don't have an account?
          <button type="button" id="auth-switch" style="color:var(--primary);font-weight:700;background:none;border:none;cursor:pointer">Register</button>
        </p>
        <div style="margin-top:1rem;padding:0.75rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.75rem;color:var(--text-secondary)">
          <strong style="color:var(--primary)">🛠 Admin Access:</strong>
          admin@sportzone.com / Admin@123
        </div>
      </form>`;
  }

  function renderRegister() {
    return `
      <form id="auth-form" novalidate>
        <div class="form-row mb-4">
          <div class="form-group">
            <label class="form-label" for="auth-fname">First Name *</label>
            <input id="auth-fname" class="form-input" type="text" placeholder="John" />
          </div>
          <div class="form-group">
            <label class="form-label" for="auth-lname">Last Name</label>
            <input id="auth-lname" class="form-input" type="text" placeholder="Doe" />
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-email">Email Address *</label>
          <input id="auth-email" class="form-input" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="form-group mb-6">
          <label class="form-label" for="auth-password">Password * <span style="color:var(--text-muted);font-weight:400">(min. 6 chars)</span></label>
          <input id="auth-password" class="form-input" type="password" placeholder="••••••••" autocomplete="new-password" />
        </div>
        <div id="auth-error" class="alert alert-error mb-4 hidden"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" id="auth-submit">Create Account</button>
        <p style="text-align:center;margin-top:1rem;font-size:0.875rem;color:var(--text-secondary)">
          Already have an account?
          <button type="button" id="auth-switch" style="color:var(--primary);font-weight:700;background:none;border:none;cursor:pointer">Sign In</button>
        </p>
      </form>`;
  }

  function bindLogin() {
    modal.querySelector('#auth-switch').addEventListener('click', () => { mode = 'register'; render(); });
    modal.querySelector('#auth-form').addEventListener('submit', e => {
      e.preventDefault();
      const email  = modal.querySelector('#auth-email').value.trim();
      const pass   = modal.querySelector('#auth-password').value;
      const errEl  = modal.querySelector('#auth-error');
      const submitBtn = modal.querySelector('#auth-submit');

      errEl.classList.add('hidden');
      if (!email || !pass) {
        errEl.textContent = 'Please fill in all fields.';
        errEl.classList.remove('hidden');
        return;
      }

      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        const result = Store.login(email, pass);
        if (result.success) {
          const user = Store.getUser();
          if (result.role === 'admin') {
            Toast.success('Welcome back, Admin! 🛠️');
            close();
            Router.navigate('#/admin');
          } else {
            Toast.success(`Welcome back, ${user.name}! 🎉`);
            close();
          }
          Navbar.render();
        } else {
          submitBtn.classList.remove('btn-loading');
          submitBtn.disabled = false;
          errEl.textContent = result.message || 'Login failed.';
          errEl.classList.remove('hidden');
        }
      }, 500);
    });
  }

  function bindRegister() {
    modal.querySelector('#auth-switch').addEventListener('click', () => { mode = 'login'; render(); });
    modal.querySelector('#auth-form').addEventListener('submit', e => {
      e.preventDefault();
      const fname = modal.querySelector('#auth-fname').value.trim();
      const lname = modal.querySelector('#auth-lname').value.trim();
      const email = modal.querySelector('#auth-email').value.trim();
      const pass  = modal.querySelector('#auth-password').value;
      const errEl = modal.querySelector('#auth-error');
      const submitBtn = modal.querySelector('#auth-submit');

      errEl.classList.add('hidden');
      if (!fname || !email || !pass) {
        errEl.textContent = 'Please fill in all required fields.';
        errEl.classList.remove('hidden');
        return;
      }
      if (pass.length < 6) {
        errEl.textContent = 'Password must be at least 6 characters.';
        errEl.classList.remove('hidden');
        return;
      }
      if (!email.includes('@')) {
        errEl.textContent = 'Please enter a valid email address.';
        errEl.classList.remove('hidden');
        return;
      }

      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        const name   = `${fname} ${lname}`.trim();
        const result = Store.register(name, email, pass);
        if (result.success) {
          Toast.success(`Account created! Welcome to SportZone, ${fname}! 🏆`);
          close();
          Navbar.render();
        } else {
          submitBtn.classList.remove('btn-loading');
          submitBtn.disabled = false;
          errEl.textContent = result.message || 'Registration failed.';
          errEl.classList.remove('hidden');
        }
      }, 500);
    });
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  function close() {
    if (modal) {
      modal.remove();
      modal = null;
      document.body.style.overflow = '';
    }
    document.removeEventListener('keydown', onKey);
  }

  return { open, close };
})();

// Alias for backwards compatibility
const Auth = AuthModal;
