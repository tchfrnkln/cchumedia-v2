/* ================================================================
   PRINTHUB — store.js
   Global state store. All reactive state lives here.
   ================================================================ */

const Store = (() => {
  let _state = {
    route: { page: 'home', params: {} },
    user: null,
    cart: [],
    theme: localStorage.getItem('ph_theme') || 'light',
    wishlist: JSON.parse(localStorage.getItem('ph_wishlist') || '[]'),
    notification: null,
    adminTab: 'dashboard',
    accountTab: 'orders',
    shopFilters: { cat: 'all', sort: 'popular', minPrice: 0, maxPrice: 999999, search: '' },
    modal: null, // { type, data }
  };

  const _listeners = [];

  function getState() { return { ..._state }; }

  function setState(patch) {
    _state = { ..._state, ...patch };
    _listeners.forEach(fn => fn(_state));
  }

  function subscribe(fn) {
    _listeners.push(fn);
    return () => { const i = _listeners.indexOf(fn); if (i > -1) _listeners.splice(i, 1); };
  }

  // Theme
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('ph_theme', t);
    setState({ theme: t });
  }
  // Apply theme on load
  document.documentElement.dataset.theme = _state.theme;

  // Session
  function loadSession() {
    const uid = DB.getVal('session');
    if (uid) {
      const user = DB.getOne('users', uid);
      if (user) setState({ user });
    }
  }

  function navigate(page, params = {}) {
    setState({ route: { page, params } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update URL hash
    const hash = params && Object.keys(params).length
      ? `#${page}?${new URLSearchParams(params).toString()}`
      : `#${page}`;
    history.pushState({ page, params }, '', hash === '#home' ? '/' : hash);
  }

  return { getState, setState, subscribe, setTheme, loadSession, navigate };
})();
