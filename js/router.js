/* ============================================================
   router.js — Hash-based SPA Router
   ============================================================ */

const Router = (() => {
  const routes = {};
  let current = null;

  function register(path, handler) {
    routes[path] = handler;
  }

  function parsePath(hash) {
    const [rawPath, queryStr] = hash.replace(/^#\/?/, '').split('?');
    const path = rawPath || '';
    const params = {};
    if (queryStr) {
      queryStr.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { path, params };
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  function resolve() {
    const { path, params } = parsePath(window.location.hash);
    const pageContent = document.getElementById('page-content');

    // Try exact match first, then prefix match
    let handler = routes[path];
    let routeParams = params;

    if (!handler) {
      // Try pattern matching for /product/:id
      for (const [route, fn] of Object.entries(routes)) {
        if (route.includes(':')) {
          const routeParts = route.split('/');
          const pathParts = path.split('/');
          if (routeParts.length === pathParts.length) {
            const match = {};
            const matched = routeParts.every((part, i) => {
              if (part.startsWith(':')) { match[part.slice(1)] = pathParts[i]; return true; }
              return part === pathParts[i];
            });
            if (matched) { handler = fn; routeParams = { ...params, ...match }; break; }
          }
        }
      }
    }

    if (!handler) handler = routes['404'] || (() => {
      pageContent.innerHTML = '<div class="empty-state" style="padding:8rem 2rem"><div class="empty-state-icon">🔍</div><h3>Page Not Found</h3><p>The page you are looking for does not exist.</p><a href="#/" class="btn btn-primary mt-6">Go Home</a></div>';
    });

    current = { path, params: routeParams };
    pageContent.innerHTML = '';
    pageContent.classList.remove('animate-fade-in');
    void pageContent.offsetWidth;
    pageContent.classList.add('animate-fade-in');
    handler(routeParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  function getCurrent() { return current; }

  return { register, navigate, init, getCurrent };
})();
