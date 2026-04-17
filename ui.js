/* ================================================================
   PRINTHUB — ui.js  ·  All UI Components & Rendering Engine
   ================================================================ */

const UI = (() => {

  // ── TOAST ─────────────────────────────────────────────────
  function toast(msg, type = 'info', duration = 3200) {
    const c = document.getElementById('toast-root');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = msg;
    c.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateY(12px) scale(.9)';
      t.style.transition = '.26s ease'; setTimeout(() => t.remove(), 280);
    }, duration);
  }

  // ── RENDER ENGINE ─────────────────────────────────────────
  function render() {
    const state = Store.getState();
    renderHeader(state);
    renderPage(state);
    renderFooter(state);
    renderModals(state);
    updateCartBadge();
  }

  // ── HEADER ────────────────────────────────────────────────
  function renderHeader(state) {
    const el = document.getElementById('site-header-root');
    if (!el) return;
    const { user, cart, theme } = state;
    const cartCount = cart.length;
    el.innerHTML = `
    <div id="ann-bar">
      🎉 <strong>Flash Sale:</strong> 20% off all Banner orders · Use code <strong>BANNER20</strong>
      <a href="#" onclick="Store.navigate('kits')"> Starter Kits →</a>
      <button id="ann-close" onclick="this.closest('#ann-bar').style.display='none'">×</button>
    </div>
    <header id="site-header">
      <div class="container">
        <div class="header-inner">
          <div class="logo" onclick="Store.navigate('home')">
            <div class="logo-mark">P</div>
            <div class="logo-text"><div class="name">PrintHub</div><div class="sub">by C-Chu Media Ltd</div></div>
          </div>
          <div class="header-search">
            <input type="text" id="search-input" placeholder="Search banners, cards, T-shirts, books..."
              autocomplete="off" oninput="UI.handleSearch(this.value)" onblur="UI.hideSearch()"
              onfocus="UI.showSearch()" onkeydown="if(event.key==='Enter')UI.doSearch()">
            <button class="search-btn" onclick="UI.doSearch()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            <div class="search-drop" id="search-drop">
              <div class="search-drop-lbl">Popular searches</div>
              ${CATEGORIES.filter(c=>c.id!=='all').slice(0,7).map(c=>`
              <div class="search-item" onclick="Store.navigate('shop',{cat:'${c.id}'})">
                <div class="search-icon">${c.icon}</div>${c.label}
              </div>`).join('')}
            </div>
          </div>
          <div class="header-actions">
            <div class="theme-toggle" onclick="Store.setTheme('${theme==='light'?'dark':'light'}')" title="Toggle theme"></div>
            <button class="hdr-btn" onclick="Store.navigate('wishlist')" title="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            ${user ? `
            <button class="hdr-btn" onclick="Store.navigate('account')" title="My Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${user.role==='admin'?'<span class="hdr-badge" style="background:var(--accent)">A</span>':''}
            </button>` : `
            <button class="hdr-btn" onclick="UI.openModal('auth-modal')" title="Login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>`}
            <a class="hdr-btn" href="${CONFIG.wa('Hi! I want to enquire about PrintHub')}" target="_blank">
              <svg viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.106 1.523 5.832L.057 24l6.304-1.654A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.513-5.168-1.406l-.371-.22-3.843 1.007 1.03-3.745-.242-.386A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
            <button class="hdr-btn" onclick="UI.toggleCart()" style="position:relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span class="hdr-badge" id="cart-badge" style="display:${cartCount>0?'flex':'none'}">${cartCount}</span>
            </button>
            <button class="btn btn-primary btn-sm" style="margin-left:4px" onclick="UI.openModal('quote-modal')">Order Now</button>
          </div>
        </div>
      </div>
      <nav id="main-nav">
        <div class="container">
          <div class="nav-scroll">
            <div class="nav-item"><span class="nav-link ${state.route.page==='home'?'active':''}" onclick="Store.navigate('home')">🏠 Home</span></div>
            <div class="nav-item">
              <span class="nav-link ${state.route.page==='shop'?'active':''}">
                🛒 All Products
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
              <div class="mega-menu">
                ${CATEGORIES.filter(c=>c.id!=='all').slice(0,9).map(c=>`
                <div class="mega-item" onclick="Store.navigate('shop',{cat:'${c.id}'})">
                  <div class="mega-em">${c.icon}</div>
                  <div><div class="mega-title">${c.label}</div><div class="mega-sub">${c.count} products</div></div>
                </div>`).join('')}
              </div>
            </div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='kits'?'active':''}" onclick="Store.navigate('kits')">🚀 Starter Kits</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='campaign'?'active':''}" onclick="Store.navigate('campaign')">🗳️ Campaign</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='publishing'?'active':''}" onclick="Store.navigate('publishing')">📚 Publishing</span></div>
            <div class="nav-item"><span class="nav-link" onclick="UI.openModal('quote-modal')">💬 Quick Quote</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='design-tool'?'active':''}" onclick="Store.navigate('design-tool')">🎨 Design Online</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='earn'?'active':''}" onclick="Store.navigate('earn')">💰 Earn</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='track'?'active':''}" onclick="Store.navigate('track')">📦 Track</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='faq'?'active':''}" onclick="Store.navigate('faq')">❓ FAQ</span></div>
            <div class="nav-item"><span class="nav-link ${state.route.page==='contact'?'active':''}" onclick="Store.navigate('contact')">📞 Contact</span></div>
            ${user?.role==='admin'?`<div class="nav-item"><span class="nav-link" style="color:var(--accent)" onclick="Store.navigate('admin')">⚙️ Admin</span></div>`:''}
          </div>
        </div>
      </nav>
    </header>`;
  }

  // ── FOOTER ────────────────────────────────────────────────
  function renderFooter(state) {
    const el = document.getElementById('site-footer-root');
    if (!el) return;
    const { route } = state;
    if (route.page === 'design-tool' || route.page === 'admin') { el.innerHTML = ''; return; }
    el.innerHTML = `
    <footer id="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo" onclick="Store.navigate('home')" style="margin-bottom:10px">
              <div class="logo-mark">P</div>
              <div class="logo-text"><div class="name">PrintHub</div><div class="sub">by C-Chu Media Ltd</div></div>
            </div>
            <p class="footer-tagline">Professional printing and branding solutions for businesses across Nigeria. Est. 2011 · Birthing your Imagination...</p>
            <div class="footer-contact">📍 ${CONFIG.address}</div>
            <div class="footer-contact">📞 <a href="tel:${CONFIG.phone1}">${CONFIG.phone1}</a> · <a href="tel:${CONFIG.phone2}">${CONFIG.phone2}</a></div>
            <div class="footer-contact">✉️ <a href="mailto:${CONFIG.email}">${CONFIG.email}</a></div>
            <div class="footer-contact">⏰ ${CONFIG.hours}</div>
            <div class="social-links">
              <a class="social-btn" href="${CONFIG.wa('Hi PrintHub!')}" target="_blank">💬</a>
              <a class="social-btn" href="#">📘</a>
              <a class="social-btn" href="#">📸</a>
              <a class="social-btn" href="#">🐦</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Products</div>
            ${CATEGORIES.filter(c=>c.id!=='all').slice(0,8).map(c=>`
            <span class="footer-link" onclick="Store.navigate('shop',{cat:'${c.id}'})">${c.icon} ${c.label}</span>`).join('')}
          </div>
          <div>
            <div class="footer-col-title">Services</div>
            <span class="footer-link" onclick="Store.navigate('kits')">🚀 Starter Kits</span>
            <span class="footer-link" onclick="Store.navigate('campaign')">🗳️ Campaign Materials</span>
            <span class="footer-link" onclick="Store.navigate('publishing')">📚 Book Publishing</span>
            <span class="footer-link" onclick="Store.navigate('design-tool')">🎨 Design Online</span>
            <span class="footer-link" onclick="UI.openModal('quote-modal')">💬 Custom Quote</span>
            <span class="footer-link" onclick="Store.navigate('earn')">💰 Affiliate Program</span>
          </div>
          <div>
            <div class="footer-col-title">Account</div>
            <span class="footer-link" onclick="Store.navigate('account')">👤 My Account</span>
            <span class="footer-link" onclick="Store.navigate('account',{tab:'orders'})">📦 My Orders</span>
            <span class="footer-link" onclick="Store.navigate('account',{tab:'loyalty'})">⭐ Loyalty Points</span>
            <span class="footer-link" onclick="Store.navigate('track')">🔍 Track Order</span>
            <span class="footer-link" onclick="Store.navigate('faq')">❓ FAQ</span>
            <span class="footer-link" onclick="Store.navigate('contact')">📞 Contact</span>
          </div>
          <div>
            <div class="footer-col-title">Payment</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px">
              ${['Paystack','Flutterwave','Bank Transfer','USSD','Card'].map(p=>`<div class="f-tag" style="text-align:center">${p}</div>`).join('')}
            </div>
            <div class="footer-col-title">Delivery</div>
            ${['Abuja Same-Day','Nationwide Courier','Pickup at Karu'].map(s=>`<div class="f-tag" style="margin-bottom:5px;display:block">${s}</div>`).join('')}
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© ${new Date().getFullYear()} C-Chu Media Limited. All rights reserved. "Birthing your Imagination..."</div>
          <div class="footer-tags">
            <div class="f-tag">3,000+ Jobs</div>
            <div class="f-tag">Est. 2011</div>
            <div class="f-tag">Abuja, Nigeria</div>
            <div class="f-tag">🔒 Secured</div>
          </div>
        </div>
      </div>
    </footer>
    <nav class="mob-nav">
      <div class="mob-nav-inner">
        <button class="mob-nav-btn ${route.page==='home'?'active':''}" onclick="Store.navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          Home
        </button>
        <button class="mob-nav-btn ${route.page==='shop'?'active':''}" onclick="Store.navigate('shop')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Shop
        </button>
        <button class="mob-nav-btn" onclick="UI.openModal('quote-modal')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Quote
        </button>
        <button class="mob-nav-btn" onclick="UI.toggleCart()" style="position:relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span id="mob-cart-badge" style="display:none;position:absolute;top:2px;right:10px;background:var(--brand);color:#fff;border-radius:99px;font-size:.56rem;padding:1px 4px;font-weight:800"></span>
          Cart
        </button>
        <button class="mob-nav-btn ${route.page==='account'?'active':''}" onclick="Store.navigate('account')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Account
        </button>
      </div>
    </nav>
    <a href="${CONFIG.wa('Hi! I want to place a print order')}" target="_blank" id="wa-float">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.106 1.523 5.832L.057 24l6.304-1.654A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.513-5.168-1.406l-.371-.22-3.843 1.007 1.03-3.745-.242-.386A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
    </a>`;
  }

  // ── PAGE ROUTER ───────────────────────────────────────────
  function renderPage(state) {
    const el = document.getElementById('page-root');
    if (!el) return;
    const { page, params } = state.route;
    switch (page) {
      case 'home':       el.innerHTML = Pages.Home(state); break;
      case 'shop':       el.innerHTML = Pages.Shop(state); break;
      case 'product':    el.innerHTML = Pages.Product(state); break;
      case 'checkout':   el.innerHTML = Pages.Checkout(state); break;
      case 'account':    el.innerHTML = Pages.Account(state); break;
      case 'admin':      el.innerHTML = Pages.Admin(state); break;
      case 'design-tool':el.innerHTML = Pages.DesignTool(state); break;
      case 'kits':       el.innerHTML = Pages.Kits(state); break;
      case 'campaign':   el.innerHTML = Pages.Campaign(state); break;
      case 'publishing': el.innerHTML = Pages.Publishing(state); break;
      case 'earn':       el.innerHTML = Pages.Earn(state); break;
      case 'track':      el.innerHTML = Pages.Track(state); break;
      case 'contact':    el.innerHTML = Pages.Contact(state); break;
      case 'faq':        el.innerHTML = Pages.FAQ(state); break;
      default:           el.innerHTML = Pages.Home(state);
    }
    // Run page init if exists
    if (window.pageInits && window.pageInits[page]) window.pageInits[page](state);
  }

  // ── MODALS ────────────────────────────────────────────────
  function renderModals(state) {
    const el = document.getElementById('modals-root');
    if (!el) return;
    el.innerHTML = `
    ${renderCartPanel(state)}
    ${renderProductModal(state)}
    ${renderQuoteModal(state)}
    ${renderAuthModal(state)}`;
  }

  function renderCartPanel(state) {
    const items = Cart.getCart();
    const total = Cart.getCartTotal();
    return `
    <div class="cart-overlay" id="cart-overlay" onclick="UI.closeCart()"></div>
    <div class="cart-panel" id="cart-panel">
      <div class="cart-hdr">
        <div class="cart-title">🛒 Cart (${items.length})</div>
        <button class="cart-close-btn" onclick="UI.closeCart()">×</button>
      </div>
      <div class="cart-body-inner" id="cart-body-inner">
        ${!items.length ? `<div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div style="font-weight:800;color:var(--text-primary);font-family:var(--font-display)">Your cart is empty</div>
          <p style="font-size:.84rem">Add products to get started</p>
          <button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="UI.closeCart();Store.navigate('shop')">Browse Products</button>
        </div>` : items.map(item => `
        <div class="cart-item">
          <div class="ci-img">${item.icon}</div>
          <div class="ci-info">
            <div class="ci-name">${item.name}</div>
            <div class="ci-meta">${item.config.size} · ${item.config.material} · ${item.config.finishing}</div>
            <div class="ci-qty">
              <button class="qty-btn" onclick="Cart.updateQty('${item.cartId}',${item.qty-1});UI.render()">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="Cart.updateQty('${item.cartId}',${item.qty+1});UI.render()">+</button>
            </div>
          </div>
          <div class="ci-right">
            <div class="ci-price">${formatNaira(item.total)}</div>
            <button class="ci-remove" onclick="Cart.removeItem('${item.cartId}');UI.render()">🗑</button>
          </div>
        </div>`).join('')}
      </div>
      ${items.length ? `<div class="cart-foot">
        <div class="cart-subtotal"><span>Subtotal</span><span class="amt">${formatNaira(total)}</span></div>
        <div class="cart-actions">
          <button class="btn btn-primary btn-full" onclick="UI.closeCart();Store.navigate('checkout')">Proceed to Checkout →</button>
          <button class="btn btn-wa btn-full" onclick="UI.cartToWhatsApp()">💬 Checkout via WhatsApp</button>
          <button class="btn btn-ghost btn-full" onclick="Cart.clearCart();UI.render()">Clear Cart</button>
        </div>
      </div>` : ''}
    </div>`;
  }

  function renderProductModal(state) {
    // Product modal is dynamically filled by openProductModal
    return `<div class="modal-overlay" id="product-modal" onclick="if(event.target===this)UI.closeModal('product-modal')">
      <div class="modal-box" id="product-modal-box"></div>
    </div>`;
  }

  function renderQuoteModal(state) {
    return `
    <div class="modal-overlay" id="quote-modal" onclick="if(event.target===this)UI.closeModal('quote-modal')">
      <div class="modal-box modal-sm">
        <div class="modal-hdr">
          <div>
            <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:900">⚡ Quick Quote</div>
            <div style="font-size:.82rem;color:var(--text-muted);margin-top:3px">We respond in under 2 hours · Mon–Sat 8am–7pm</div>
          </div>
          <button class="modal-close" onclick="UI.closeModal('quote-modal')">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Full Name *</label><input id="q-name" class="form-input" placeholder="Your name"></div>
            <div class="form-group"><label class="form-label">Phone *</label><input id="q-phone" class="form-input" type="tel" placeholder="+234 XXX XXX XXXX"></div>
          </div>
          <div class="form-group"><label class="form-label">Product / Service *</label>
            <select id="q-product" class="form-select">
              <option value="">Select...</option>
              <option>Banners & Large Format</option><option>Business Cards</option>
              <option>Flyers & Leaflets</option><option>Branded Apparel</option>
              <option>Book Publishing</option><option>Signage & Installation</option>
              <option>Souvenirs & Gifts</option><option>Campaign Materials</option>
              <option>Business Starter Kit</option><option>Vehicle Branding</option>
              <option>Other / General</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Quantity & Details *</label>
            <textarea id="q-details" class="form-textarea" placeholder="Quantity, size, colours, deadline..."></textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <button class="btn btn-primary btn-full" onclick="UI.submitQuote()">📨 Send Quote</button>
            <a class="btn btn-wa btn-full" id="q-wa-btn" href="${CONFIG.wa('Hi, I need a quote')}" target="_blank">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderAuthModal(state) {
    return `
    <div class="modal-overlay" id="auth-modal" onclick="if(event.target===this)UI.closeModal('auth-modal')">
      <div class="modal-box modal-sm">
        <div class="modal-hdr">
          <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:900">👤 My Account</div>
          <button class="modal-close" onclick="UI.closeModal('auth-modal')">×</button>
        </div>
        <div class="modal-body">
          <div class="auth-tabs">
            <div class="auth-tab active" id="tab-login" onclick="UI.switchAuthTab('login')">Login</div>
            <div class="auth-tab" id="tab-register" onclick="UI.switchAuthTab('register')">Register</div>
          </div>
          <div id="auth-login-form">
            <div class="form-group"><label class="form-label">Email</label><input id="login-email" class="form-input" type="email" placeholder="your@email.com"></div>
            <div class="form-group"><label class="form-label">Password</label><input id="login-password" class="form-input" type="password" placeholder="Password"></div>
            <div id="login-error" class="form-error" style="display:none;margin-bottom:10px"></div>
            <button class="btn btn-primary btn-full" onclick="UI.doLogin()">Login →</button>
            <div style="text-align:center;margin-top:12px;font-size:.82rem;color:var(--text-muted)">
              Demo: admin@cchumedia.com / admin123
            </div>
          </div>
          <div id="auth-register-form" style="display:none">
            <div class="form-row">
              <div class="form-group"><label class="form-label">Full Name *</label><input id="reg-name" class="form-input" placeholder="Your full name"></div>
              <div class="form-group"><label class="form-label">Phone</label><input id="reg-phone" class="form-input" placeholder="+234 XXX XXX XXXX"></div>
            </div>
            <div class="form-group"><label class="form-label">Email *</label><input id="reg-email" class="form-input" type="email" placeholder="your@email.com"></div>
            <div class="form-group"><label class="form-label">Password *</label><input id="reg-password" class="form-input" type="password" placeholder="Min 6 characters"></div>
            <div id="reg-error" class="form-error" style="display:none;margin-bottom:10px"></div>
            <button class="btn btn-primary btn-full" onclick="UI.doRegister()">Create Account →</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ── PRODUCT CARD ──────────────────────────────────────────
  function productCard(p) {
    const disc = p.origPrice ? Math.round((1 - p.basePrice/p.origPrice)*100) : 0;
    const wl = (DB.getVal('wishlist', [])||[]).includes(p.id);
    return `
    <div class="pcard" onclick="UI.openProductModal('${p.id}')">
      <div class="pcard-img">
        <span>${p.icon}</span>
        <div class="pcard-badges">
          ${p.badge ? `<span class="badge badge-${p.badge==='Bestseller'?'brand':p.badge==='Premium'||p.badge==='Luxury'?'dark':p.badge==='Sale'?'sale':'accent'}">${p.badge}</span>` : ''}
          ${disc > 0 ? `<span class="badge badge-sale">-${disc}%</span>` : ''}
        </div>
        <button class="pcard-wish ${wl?'on':''}" onclick="event.stopPropagation();UI.toggleWishlist('${p.id}',this)">${wl?'♥':'♡'}</button>
        <div class="pcard-atc" onclick="event.stopPropagation();UI.openProductModal('${p.id}')">+ Configure & Add</div>
      </div>
      <div class="pcard-body">
        <div class="pcard-cat">${p.cat}</div>
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-rating">
          <span class="stars">${'★'.repeat(Math.floor(p.rating))}</span>
          <span>${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="pcard-price">
          <span class="price-main">${formatNaira(p.basePrice)}</span>
          ${p.origPrice ? `<span class="price-orig">${formatNaira(p.origPrice)}</span>` : ''}
          <span class="price-from">from</span>
        </div>
      </div>
    </div>`;
  }

  // ── PRODUCT MODAL ─────────────────────────────────────────
  let _modalProduct = null;
  let _modalCfg = { size:'A4', material:'Glossy', finishing:'None', turnaround:'Standard (5–7 days)', qty:100 };

  function openProductModal(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    _modalProduct = p;
    _modalCfg = { size:'A4', material:'Glossy', finishing:'None', turnaround:'Standard (5–7 days)', qty:100 };
    const box = document.getElementById('product-modal-box');
    if (!box) return;
    box.innerHTML = buildProductModalHTML(p);
    calcModalPrice();
    openModal('product-modal');
  }

  function buildProductModalHTML(p) {
    return `
    <div class="modal-hdr">
      <div>
        ${p.badge ? `<span class="badge badge-brand" style="margin-bottom:6px">${p.badge}</span>` : ''}
        <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:900;margin-top:4px">${p.name}</div>
        <div style="font-size:.82rem;color:var(--text-muted);margin-top:2px">${CATEGORIES.find(c=>c.id===p.cat)?.label || p.cat} · From ${formatNaira(p.basePrice)}</div>
      </div>
      <button class="modal-close" onclick="UI.closeModal('product-modal')">×</button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:170px 1fr;gap:20px;margin-bottom:20px">
        <div style="aspect-ratio:1;background:var(--bg-muted);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:3.8rem">${p.icon}</div>
        <div>
          <p style="color:var(--text-secondary);font-size:.86rem;line-height:1.75;margin-bottom:11px">${p.desc}</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span class="badge badge-green">✅ Free Review</span>
            <span class="badge badge-accent">📦 FCT Delivery</span>
            <span class="badge badge-orange">⚡ Rush Available</span>
          </div>
        </div>
      </div>
      <div class="cfg-sec">
        <div class="cfg-lbl">Size / Format</div>
        <div class="cfg-chips">
          ${Object.keys(SIZES).map(s=>`<div class="cfg-chip ${s==='A4'?'on':''}" onclick="UI.selectCfg(this,'size','${s}')">${s}</div>`).join('')}
        </div>
      </div>
      <div class="cfg-sec">
        <div class="cfg-lbl">Paper / Material</div>
        <div class="cfg-chips">
          ${Object.keys(MATERIALS).map(m=>`<div class="cfg-chip ${m==='Glossy'?'on':''}" onclick="UI.selectCfg(this,'material','${m}')">${m}</div>`).join('')}
        </div>
      </div>
      <div class="cfg-sec">
        <div class="cfg-lbl">Finishing</div>
        <div class="cfg-chips">
          ${Object.keys(FINISHING).map(f=>`<div class="cfg-chip ${f==='None'?'on':''}" onclick="UI.selectCfg(this,'finishing','${f}')">${f}</div>`).join('')}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
        <div>
          <div class="cfg-lbl">Quantity</div>
          <input type="number" id="pm-qty" class="form-input" value="100" min="1" step="10" oninput="UI.calcModalPrice()">
          <div class="qty-shortcuts">${[50,100,250,500,1000].map(n=>`<span class="qs" onclick="document.getElementById('pm-qty').value=${n};UI.calcModalPrice()">${n.toLocaleString()}</span>`).join('')}</div>
        </div>
        <div>
          <div class="cfg-lbl">Turnaround</div>
          <select id="pm-turnaround" class="form-select" onchange="UI.calcModalPrice()">
            ${Object.keys(TURNAROUND).map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="price-display">
        <div>
          <div style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);margin-bottom:3px;font-family:var(--font-display)">Estimated Total</div>
          <div class="p-total" id="pm-total">₦0</div>
        </div>
        <div class="p-breakdown">
          <div class="p-unit" id="pm-unit">₦0/unit</div>
          <div class="p-save" id="pm-save" style="display:none"></div>
          <div style="font-size:.68rem;color:var(--text-muted);margin-top:2px">Live calculation</div>
        </div>
      </div>
      <div class="cfg-sec">
        <div class="cfg-lbl">Upload Artwork <span style="font-weight:400;text-transform:none;font-size:.78rem;color:var(--text-muted)">(optional)</span></div>
        <div class="upload-zone" onclick="document.getElementById('pm-file').click()">
          <div style="font-size:1.4rem;margin-bottom:5px">📎</div>
          <div style="font-size:.82rem;color:var(--text-muted)">Drop file or <strong style="color:var(--brand)">click to upload</strong></div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:3px">PDF, AI, PSD, PNG, JPG · Max 50MB</div>
        </div>
        <input type="file" id="pm-file" style="display:none" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" onchange="UI.handleFileUpload(this)">
        <div id="pm-file-preview"></div>
      </div>
      <div class="cfg-sec">
        <div class="cfg-lbl">Special Instructions</div>
        <textarea id="pm-notes" class="form-textarea" placeholder="Pantone colours, exact dimensions, special notes..."></textarea>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary btn-lg" style="flex:1;justify-content:center" onclick="UI.addToCartFromModal()">
          🛒 Add to Cart — <span id="pm-atc-price">₦0</span>
        </button>
        <button class="btn btn-wa btn-lg" style="padding:13px 16px" onclick="UI.quoteThisProduct()">💬</button>
        <button class="btn btn-accent btn-lg" style="padding:13px 16px" onclick="UI.designThisProduct('${p.id}')">🎨</button>
      </div>
    </div>`;
  }

  function selectCfg(el, type, val) {
    el.closest('.cfg-chips').querySelectorAll('.cfg-chip').forEach(c => c.classList.remove('on'));
    el.classList.add('on');
    _modalCfg[type] = val;
    calcModalPrice();
  }

  function calcModalPrice() {
    if (!_modalProduct) return;
    const qty = parseInt(document.getElementById('pm-qty')?.value) || 1;
    const ta = document.getElementById('pm-turnaround')?.value || 'Standard (5–7 days)';
    _modalCfg.qty = qty; _modalCfg.turnaround = ta;
    const { unit, total, discount } = calcProductPrice(_modalProduct.basePrice, _modalCfg.size, _modalCfg.material, _modalCfg.finishing, _modalCfg.turnaround, qty);
    const tot = document.getElementById('pm-total'); if (tot) tot.textContent = formatNaira(total);
    const u = document.getElementById('pm-unit'); if (u) u.textContent = formatNaira(unit) + '/unit';
    const s = document.getElementById('pm-save');
    if (s) { if (discount > 0) { s.textContent = `✓ ${(discount*100).toFixed(0)}% bulk discount`; s.style.display = 'block'; } else s.style.display = 'none'; }
    const atc = document.getElementById('pm-atc-price'); if (atc) atc.textContent = formatNaira(total);
  }

  function addToCartFromModal() {
    if (!_modalProduct) return;
    const qty = parseInt(document.getElementById('pm-qty')?.value) || 1;
    const notes = document.getElementById('pm-notes')?.value || '';
    Cart.addItem(_modalProduct, { ..._modalCfg, notes }, qty, null);
    closeModal('product-modal');
    updateCartBadge();
  }

  function quoteThisProduct() {
    if (!_modalProduct) return;
    closeModal('product-modal');
    openModal('quote-modal');
    setTimeout(() => { const sel = document.getElementById('q-product'); if (sel) { /* prefill */ } }, 100);
  }

  function designThisProduct(id) {
    closeModal('product-modal');
    Store.navigate('design-tool', { productId: id });
  }

  function handleFileUpload(input) {
    const file = input.files[0]; if (!file) return;
    const ok = file.size < 52428800;
    const preview = document.getElementById('pm-file-preview'); if (!preview) return;
    const sizeMB = (file.size/1048576).toFixed(1);
    preview.innerHTML = `<div style="display:flex;align-items:center;gap:8px;padding:7px 11px;background:${ok?'var(--green-soft)':'rgba(212,43,43,.07)'};border:1px solid ${ok?'#bbf7d0':'#fca5a5'};border-radius:var(--r-sm);margin-top:6px;font-size:.82rem">
      <span>${ok?'✅':'❌'}</span><span style="flex:1;font-weight:700">${file.name}</span><span style="color:var(--text-muted)">${sizeMB}MB</span></div>`;
    if (!ok) toast('File too large — max 50MB', 'error');
    else toast('✅ File attached successfully', 'success');
  }

  // ── CART ──────────────────────────────────────────────────
  function toggleCart() {
    document.getElementById('cart-panel')?.classList.toggle('open');
    document.getElementById('cart-overlay')?.classList.toggle('open');
  }
  function closeCart() {
    document.getElementById('cart-panel')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
  }
  function cartToWhatsApp() {
    const items = Cart.getCart();
    if (!items.length) { toast('Cart is empty', 'error'); return; }
    const lines = items.map(i => `• ${i.name} (${i.qty}pcs, ${i.config.size}, ${i.config.material}) — ${formatNaira(i.total)}`).join('\n');
    const total = formatNaira(Cart.getCartTotal());
    const msg = `Hi! PrintHub Cart:\n\n${lines}\n\nTotal: ${total}\n\nPlease confirm & payment.`;
    window.open(CONFIG.wa(msg), '_blank');
  }
  function updateCartBadge() {
    const count = Cart.getCartCount();
    ['cart-badge','mob-cart-badge'].forEach(id => {
      const el = document.getElementById(id); if (!el) return;
      el.textContent = count; el.style.display = count > 0 ? (id==='cart-badge'?'flex':'') : 'none';
    });
  }

  // ── MODAL ─────────────────────────────────────────────────
  function openModal(id) {
    document.getElementById(id)?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── AUTH MODAL ACTIONS ────────────────────────────────────
  function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.toggle('active', tab==='login');
    document.getElementById('tab-register').classList.toggle('active', tab==='register');
    document.getElementById('auth-login-form').style.display = tab==='login' ? '' : 'none';
    document.getElementById('auth-register-form').style.display = tab==='register' ? '' : 'none';
  }
  function doLogin() {
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const errEl = document.getElementById('login-error');
    const result = Auth.login(email, password);
    if (result.error) { errEl.textContent = result.error; errEl.style.display = 'block'; return; }
    Cart.mergeGuestCart(result.user.id);
    closeModal('auth-modal');
    toast(`👋 Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
    render();
  }
  function doRegister() {
    const name = document.getElementById('reg-name')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const errEl = document.getElementById('reg-error');
    if (!name || !email || !password) { errEl.textContent = 'Fill all required fields'; errEl.style.display = 'block'; return; }
    if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters'; errEl.style.display = 'block'; return; }
    const result = Auth.register({ name, email, phone, password });
    if (result.error) { errEl.textContent = result.error; errEl.style.display = 'block'; return; }
    Cart.mergeGuestCart(result.user.id);
    closeModal('auth-modal');
    toast(`🎉 Account created! Welcome, ${result.user.name.split(' ')[0]}!`, 'success');
    render();
  }

  // ── QUOTE ─────────────────────────────────────────────────
  function submitQuote() {
    const name = document.getElementById('q-name')?.value.trim();
    const phone = document.getElementById('q-phone')?.value.trim();
    const product = document.getElementById('q-product')?.value;
    const details = document.getElementById('q-details')?.value.trim();
    if (!name || !phone || !product || !details) { toast('Fill all required fields', 'error'); return; }
    const msg = `Hi! Quote Request — PrintHub\n\nName: ${name}\nPhone: ${phone}\nProduct: ${product}\n\nDetails: ${details}`;
    window.open(CONFIG.wa(msg), '_blank');
    closeModal('quote-modal');
    toast('✅ Quote sent via WhatsApp!', 'success');
  }

  // ── SEARCH ────────────────────────────────────────────────
  function showSearch() { document.getElementById('search-drop')?.classList.add('open'); }
  function hideSearch() { setTimeout(() => document.getElementById('search-drop')?.classList.remove('open'), 200); }
  function handleSearch(val) { if (val.length > 0) showSearch(); else hideSearch(); }
  function doSearch() {
    const val = document.getElementById('search-input')?.value.trim(); if (!val) return;
    Store.navigate('shop', { search: val });
  }

  // ── WISHLIST ──────────────────────────────────────────────
  function toggleWishlist(productId, btn) {
    const wl = DB.getVal('wishlist', []) || [];
    const isIn = wl.includes(productId);
    if (isIn) { DB.setVal('wishlist', wl.filter(id => id !== productId)); toast('Removed from wishlist', 'info'); }
    else { DB.setVal('wishlist', [...wl, productId]); toast('❤️ Saved to wishlist', 'success'); }
    if (btn) { btn.classList.toggle('on', !isIn); btn.textContent = isIn ? '♡' : '♥'; }
  }

  // ── NEWSLETTER ────────────────────────────────────────────
  function subscribeNewsletter(inputId) {
    const email = document.getElementById(inputId)?.value.trim();
    if (!email || !email.includes('@')) { toast('Enter a valid email address', 'error'); return; }
    window.open(CONFIG.wa(`New PrintHub newsletter subscriber: ${email}`), '_blank');
    if (document.getElementById(inputId)) document.getElementById(inputId).value = '';
    toast('✅ Subscribed! Welcome to PrintHub updates.', 'success');
  }

  // ── COUNTDOWN TIMER ───────────────────────────────────────
  let _timerInterval = null;
  function startTimer(secs) {
    if (_timerInterval) clearInterval(_timerInterval);
    let s = secs;
    _timerInterval = setInterval(() => {
      if (s <= 0) { clearInterval(_timerInterval); return; }
      s--;
      const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
      ['t-h','t-m','t-s'].forEach((id,i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String([h,m,sec][i]).padStart(2,'0');
      });
    }, 1000);
  }

  // ── FAQ TOGGLE ────────────────────────────────────────────
  function toggleFaq(i) {
    const item = document.getElementById(`faq-${i}`);
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  // ── STATUS BADGE ──────────────────────────────────────────
  function statusBadge(status) {
    const map = {
      'Pending Payment':'status-pending','Confirmed':'status-production',
      'Design Review':'status-production','In Production':'status-production',
      'Ready for Pickup':'status-ready','Shipped':'status-ready',
      'Delivered':'status-delivered','Cancelled':'status-cancelled',
    };
    return `<span class="order-status-dot ${map[status]||'status-pending'}">${status}</span>`;
  }

  // ── EXPORT ────────────────────────────────────────────────
  return {
    render, renderHeader, renderFooter, renderPage, renderModals,
    toast, productCard, openProductModal, selectCfg, calcModalPrice, addToCartFromModal,
    quoteThisProduct, designThisProduct, handleFileUpload,
    toggleCart, closeCart, cartToWhatsApp, updateCartBadge,
    openModal, closeModal,
    switchAuthTab, doLogin, doRegister,
    submitQuote, showSearch, hideSearch, handleSearch, doSearch,
    toggleWishlist, subscribeNewsletter, startTimer, toggleFaq, statusBadge,
  };
})();

window.pageInits = {};
