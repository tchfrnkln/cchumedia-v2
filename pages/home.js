/* ================================================================
   PRINTHUB — pages/home.js
   ================================================================ */
const Pages = window.Pages || {};

Pages.Home = (state) => {
  const featured = PRODUCTS.filter(p => p.badge || p.featured).slice(0, 12);
  const bestsellers = [...PRODUCTS].sort((a,b) => b.reviews - a.reviews).slice(0, 10);
  return `
  <!-- HERO -->
  <section style="background:var(--bg-base)">
    <div class="hero-wrap">
      <div class="hero-sidebar">
        <div class="sidebar-hdr">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          Categories
        </div>
        ${CATEGORIES.map(c => `
        <div class="sb-link" onclick="Store.navigate('shop',{cat:'${c.id}'})">
          <span class="si">${c.icon}</span>
          <span class="sl">${c.label}</span>
          <span class="sc">${c.count}</span>
        </div>`).join('')}
      </div>
      <div class="hero-main">
        <div class="hero-slide">
          <div class="hero-glow"></div>
          <div class="hero-content">
            <div class="hero-eyebrow">🔴 Now Live Online · Est. 2011 · Karu, Abuja</div>
            <h1 class="hero-title">Nigeria's Finest<br><span class="hl">Print & Branding</span><br>Portal</h1>
            <p class="hero-sub">Order banners, business cards, branded apparel, signage, books and more. Trusted by 3,000+ clients since 2011.</p>
            <div class="hero-ctas">
              <button class="btn btn-primary btn-xl" onclick="Store.navigate('shop')">🛒 Shop Products</button>
              <a href="${CONFIG.wa('Hi! I want to place a print order')}" target="_blank" class="btn btn-xl" style="background:rgba(255,255,255,.1);color:#fff;border:2px solid rgba(255,255,255,.25)">💬 WhatsApp Us</a>
            </div>
            <div class="hero-stats">
              <div><div class="hero-stat-v">3,000+</div><div class="hero-stat-l">Jobs Delivered</div></div>
              <div><div class="hero-stat-v">13+</div><div class="hero-stat-l">Years in Business</div></div>
              <div><div class="hero-stat-v">₦3k</div><div class="hero-stat-l">Prices From</div></div>
              <div><div class="hero-stat-v">24hr</div><div class="hero-stat-l">Rush Available</div></div>
            </div>
          </div>
          <div class="hero-visual">🖨️</div>
        </div>
        <div class="hero-nav">
          <button class="hero-dot on"></button>
          <button class="hero-dot"></button>
          <button class="hero-dot"></button>
        </div>
      </div>
    </div>
  </section>

  <!-- FLASH SALE -->
  <div class="flash-bar">
    <div class="container">
      <div class="flash-inner">
        <div class="flash-lbl"><span class="flash-tag">🔥 FLASH SALE</span> 20% off Banners & Flyers — ends in:</div>
        <div class="flash-timer">
          <div class="t-block"><span id="t-h">08</span><span>HRS</span></div>
          <span class="t-sep">:</span>
          <div class="t-block"><span id="t-m">24</span><span>MIN</span></div>
          <span class="t-sep">:</span>
          <div class="t-block"><span id="t-s">00</span><span>SEC</span></div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="Store.navigate('shop',{cat:'banners'})">Shop Sale →</button>
      </div>
    </div>
  </div>

  <!-- TRUST -->
  <div class="trust-strip">
    <div class="container">
      <div class="trust-inner">
        <div class="trust-item"><span class="trust-icon">🚚</span> Same-day Abuja delivery</div>
        <div class="trust-item"><span class="trust-icon">✅</span> Free design review</div>
        <div class="trust-item"><span class="trust-icon">🔬</span> 300 DPI quality check</div>
        <div class="trust-item"><span class="trust-icon">💳</span> Paystack · Flutterwave · USSD</div>
        <div class="trust-item"><span class="trust-icon">📦</span> Nationwide shipping</div>
        <div class="trust-item"><span class="trust-icon">🔄</span> Free reprint guarantee</div>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="container">
    <div class="main-layout">
      <!-- LEFT SIDEBAR -->
      <aside class="left-sidebar">
        <div class="widget">
          <div class="widget-hdr">🗂 Categories</div>
          <div class="widget-body">
            ${CATEGORIES.map(c=>`<div class="w-item" onclick="Store.navigate('shop',{cat:'${c.id}'})"><label>${c.icon} ${c.label}</label><span class="w-count">${c.count}</span></div>`).join('')}
          </div>
        </div>
        <div class="widget">
          <div class="widget-hdr">💰 Price Range</div>
          <div class="price-range-wrap">
            <div class="price-inputs">
              <input class="price-in" id="h-min" type="number" value="3000" placeholder="Min ₦">
              <input class="price-in" id="h-max" type="number" value="200000" placeholder="Max ₦">
            </div>
            <input type="range" class="range-sl" min="3000" max="200000" value="200000" oninput="document.getElementById('h-max').value=this.value">
          </div>
        </div>
        <div class="sidebar-cta">
          <div class="sc-icon">⚡</div>
          <div class="sc-title">Need a Custom Quote?</div>
          <div class="sc-sub">Get a response in under 2 hours</div>
          <button class="btn btn-white btn-sm btn-full" onclick="UI.openModal('quote-modal')">Free Quote</button>
        </div>
      </aside>

      <!-- MAIN RIGHT -->
      <main>
        <!-- PROMO BANNERS -->
        <div class="promo-grid">
          <div class="promo-banner pb-1" onclick="Store.navigate('shop',{cat:'banners'})">
            <div class="promo-bg">🏷️</div>
            <div class="promo-title">Banners from ₦5,000</div>
            <div class="promo-sub">Indoor · Outdoor · Roll-up · Backdrops</div>
            <div class="promo-cta">Shop Banners →</div>
          </div>
          <div class="promo-banner pb-2" onclick="Store.navigate('shop',{cat:'apparel'})">
            <div class="promo-bg">👕</div>
            <div class="promo-title">Branded Apparel</div>
            <div class="promo-sub">T-Shirts · Caps · Polos · Hoodies</div>
            <div class="promo-cta" style="background:var(--accent)">Shop Apparel →</div>
          </div>
        </div>

        <!-- CATEGORIES GRID -->
        <div style="margin-bottom:28px">
          <div class="sec-head">
            <div><div class="sec-title">Shop by Category<span class="dot"></span></div><div class="sec-sub">Browse all print & branding products</div></div>
          </div>
          <div class="catgrid">
            ${CATEGORIES.filter(c=>c.id!=='all').map(c=>`
            <div class="catgrid-item" onclick="Store.navigate('shop',{cat:'${c.id}'})">
              <div class="catgrid-em">${c.icon}</div>
              <div class="catgrid-name">${c.label}</div>
              <div class="catgrid-count">${c.count} products</div>
            </div>`).join('')}
          </div>
        </div>

        <!-- FEATURED PRODUCTS -->
        <div style="margin-bottom:28px">
          <div class="sec-head">
            <div><div class="sec-title">Featured Products<span class="dot"></span></div><div class="sec-sub">Our most ordered items</div></div>
            <span class="see-all" onclick="Store.navigate('shop')">See all →</span>
          </div>
          <div class="cat-chips">
            ${CATEGORIES.slice(0,9).map(c=>`<div class="chip" onclick="Store.navigate('shop',{cat:'${c.id}'})">${c.icon} ${c.id==='all'?'All':c.label.split(' ')[0]}</div>`).join('')}
          </div>
          <div class="product-grid">
            ${featured.map(p => UI.productCard(p)).join('')}
          </div>
        </div>

        <!-- BESTSELLERS -->
        <div style="margin-bottom:28px">
          <div class="sec-head">
            <div><div class="sec-title">🔥 Bestsellers<span class="dot"></span></div></div>
            <span class="see-all" onclick="Store.navigate('shop',{sort:'popular'})">See all →</span>
          </div>
          <div class="scroll-row">
            ${bestsellers.map(p => UI.productCard(p)).join('')}
          </div>
        </div>

        <!-- PROMO 3-GRID -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:28px">
          <div class="promo-banner pb-1" onclick="Store.navigate('kits')" style="min-height:110px">
            <div class="promo-bg">🚀</div>
            <div class="promo-title" style="font-size:1rem">Starter Kits</div>
            <div class="promo-sub">From ₦35,000 flat</div>
            <div class="promo-cta" style="font-size:.74rem">View Kits →</div>
          </div>
          <div class="promo-banner pb-3" onclick="Store.navigate('campaign')" style="min-height:110px">
            <div class="promo-bg">🗳️</div>
            <div class="promo-title" style="font-size:1rem">Campaign</div>
            <div class="promo-sub">From ₦50,000</div>
            <div class="promo-cta" style="background:#25d366;font-size:.74rem">Order Now →</div>
          </div>
          <div class="promo-banner pb-2" onclick="Store.navigate('earn')" style="min-height:110px">
            <div class="promo-bg">💰</div>
            <div class="promo-title" style="font-size:1rem">Earn 10%</div>
            <div class="promo-sub">Refer & earn forever</div>
            <div class="promo-cta" style="background:var(--accent);font-size:.74rem">Join Free →</div>
          </div>
        </div>

        <!-- AFFILIATE BANNER -->
        <div class="earn-banner">
          <div>
            <div class="earn-title">Earn While You Refer 💰</div>
            <div class="earn-sub">Join the C-Chu Media Affiliate Program. Earn commission on every order your referrals place — forever.</div>
            <div class="earn-tiers">
              <div class="earn-tier"><div class="et-pct">10%</div><div class="et-lbl">Orders 1–5</div></div>
              <div class="earn-tier"><div class="et-pct">5%</div><div class="et-lbl">Orders 6–10</div></div>
              <div class="earn-tier"><div class="et-pct">3%</div><div class="et-lbl">Order 11+ Forever</div></div>
              <div class="earn-tier"><div class="et-pct">∞</div><div class="et-lbl">No Limits</div></div>
            </div>
          </div>
          <div style="text-align:center">
            <div style="font-size:2.2rem;margin-bottom:10px">🎯</div>
            <button class="btn btn-primary btn-lg" onclick="Store.navigate('earn')">Join Free →</button>
            <div style="font-size:.72rem;color:rgba(255,255,255,.35);margin-top:6px">Paid monthly · No targets</div>
          </div>
        </div>

        <!-- DESIGN TOOL BANNER -->
        <div style="background:linear-gradient(135deg,#060618,#0e0e2a);border-radius:var(--r-xl);padding:32px;margin-bottom:28px;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center">
          <div>
            <div style="font-family:var(--font-display);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--accent);margin-bottom:10px">🎨 FREE ONLINE DESIGN TOOL</div>
            <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:900;color:#fff;margin-bottom:8px">Design Your Prints Right Here</div>
            <p style="font-size:.86rem;color:rgba(255,255,255,.55);margin-bottom:14px;line-height:1.7">Drag & drop editor · 100+ templates · Export print-ready files · Send directly to print.</p>
            <button class="btn btn-accent btn-lg" onclick="Store.navigate('design-tool')">🎨 Open Design Tool</button>
          </div>
          <div style="font-size:4rem;opacity:.6">🖥️</div>
        </div>

        <!-- PARTNERS -->
        <div style="margin-bottom:28px">
          <div class="sec-head"><div><div class="sec-title">Trusted by Nigeria's Leaders<span class="dot"></span></div></div></div>
          <div class="partners-row">
            ${PARTNERS.map(p=>`<div class="partner-tag">${p}</div>`).join('')}
          </div>
        </div>

        <!-- TESTIMONIALS -->
        <div style="margin-bottom:28px">
          <div class="sec-head">
            <div><div class="sec-title">What Clients Say<span class="dot"></span></div><div class="sec-sub">3,000+ jobs delivered · 4.9★ average</div></div>
          </div>
          <div class="testimonial-grid">
            ${TESTIMONIALS.map(t=>`
            <div class="tcard">
              <div class="tcard-stars">${'⭐'.repeat(t.rating)}</div>
              <p class="tcard-text">${t.text}</p>
              <div class="tcard-author">
                <div class="tcard-av">${t.initials}</div>
                <div><div class="tcard-name">${t.name}</div><div class="tcard-role">${t.role}</div></div>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- NEWSLETTER -->
        <div class="newsletter">
          <div class="nl-title">Get Print Tips & Exclusive Deals ✉️</div>
          <div class="nl-sub">Join 2,000+ subscribers. Weekly design tips, flash sales, and insider offers.</div>
          <div class="nl-form">
            <input class="nl-input" id="nl-home" type="email" placeholder="your@email.com">
            <button class="nl-btn" onclick="UI.subscribeNewsletter('nl-home')">Subscribe</button>
          </div>
        </div>
      </main>
    </div>
  </div>`;
};

window.pageInits = window.pageInits || {};
window.pageInits.home = (state) => { UI.startTimer(8 * 3600 + 24 * 60); };
