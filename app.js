/* ================================================================
   PRINTHUB — app.js  ·  Main Entry Point & Router
   ================================================================ */

(function init() {
  // ── LOAD SESSION ──────────────────────────────────────────
  Store.loadSession();
  Cart.init();

  // ── ROUTE FROM URL HASH ───────────────────────────────────
  function parseHash() {
    const hash = location.hash.replace('#', '');
    if (!hash || hash === '/') return { page: 'home', params: {} };
    const [page, qs] = hash.split('?');
    const params = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
    return { page: page || 'home', params };
  }

  const { page, params } = parseHash();
  Store.setState({ route: { page, params } });

  // ── SUBSCRIBE → RENDER ────────────────────────────────────
  Store.subscribe(() => {
    UI.render();
    UI.updateCartBadge();
  });

  // ── INITIAL RENDER ────────────────────────────────────────
  UI.render();

  // ── BROWSER NAVIGATION ────────────────────────────────────
  window.addEventListener('popstate', (e) => {
    const r = parseHash();
    Store.setState({ route: r });
  });

  // ── KEYBOARD SHORTCUTS ────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['product-modal','quote-modal','auth-modal','admin-order-detail'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('open'); el.style.display = 'none'; }
      });
      UI.closeCart();
      document.body.style.overflow = '';
    }
  });

  // ── HASH NAVIGATION OVERRIDE ──────────────────────────────
  // Allow Store.navigate to work from HTML onclick attributes
  window.navigate = Store.navigate.bind(Store);

  console.log('%c PrintHub eCommerce System', 'color:#D42B2B;font-size:14px;font-weight:bold');
  console.log('%c Full-stack JS · localStorage DB · Reactive State', 'color:#7B7EC8;font-size:11px');
  console.log('%c Admin: admin@cchumedia.com / admin123', 'color:#059669;font-size:11px');
})();
