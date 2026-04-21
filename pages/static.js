/* ================================================================
   PRINTHUB — pages/static.js
   Kits · Campaign · Publishing · Earn · Track · FAQ · Contact
   ================================================================ */

Pages.Kits = () => `
<div class="page-hero dark">
  <div class="container">
    <div class="breadcrumb" style="margin-bottom:10px">
      <span onclick="Store.navigate('home')" style="color:rgba(255,255,255,.6)">Home</span>
      <span class="sep" style="color:rgba(255,255,255,.3)">›</span>
      <span class="current">Starter Kits</span>
    </div>
    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px">🚀 Business Starter Kits</h1>
    <p style="color:rgba(255,255,255,.55);max-width:540px">Everything a new or growing business needs to look professional. Curated bundles at one flat price — designed for Nigerian businesses.</p>
  </div>
</div>
<div class="container page-wrap">
  <div class="kits-grid">
    ${[
      { name:'Basic Starter', price:'₦35,000', badge:'Best for Startups', color:'var(--accent)',
        desc:'Perfect for a new business just getting started with professional print materials.',
        items:['500 Business Cards (Glossy)','500 A5 Flyers (Full Colour)','1 Roll-up Banner (85×200cm)','Letterhead Design (PDF file)','FREE Design Consultation'],
        turnaround:'7 business days', featured:false },
      { name:'Business Pro', price:'₦65,000', badge:'Most Popular ⭐', color:'var(--brand)',
        desc:'A complete professional brand package for established businesses.',
        items:['1,000 Business Cards (Matte Laminated)','1,000 A5 Flyers','2 Roll-up Banners','500 Letterheads (Printed)','1 A4 Brochure (Designed + 100pcs)','Branded Stamp','FREE Design Service'],
        turnaround:'5 business days', featured:true },
      { name:'Corporate Suite', price:'₦120,000', badge:'For Corporations', color:'#0c0c18',
        items:['2,000 Business Cards (Spot UV)','2,000 A5 Flyers','3 Roll-up Banners','1,000 Letterheads','500 Branded Envelopes','Company Profile (Design + 20pcs)','Vehicle Decal (1 car)','Branded T-Shirts (10pcs)','Acrylic Desk Sign','FREE Priority Design Service'],
        turnaround:'5 business days', featured:false },
    ].map(kit => `
    <div class="kit-card ${kit.featured?'featured':''}">
      ${kit.featured ? `<div class="hidden" style="position:absolute;top:0;left:50%;transform:translate(-50%,-50%);background:var(--brand);color:#fff;padding:4px 14px;border-radius:99px;font-size:.72rem;font-weight:800;font-family:var(--font-display);white-space:nowrap">${kit.badge}</div>` : ''}
      <div class="kit-hdr" style="background:${kit.featured?'linear-gradient(135deg,var(--brand),var(--brand-dark))':kit.color==='var(--accent)'?'linear-gradient(135deg,#5a5da0,#7B7EC8)':'linear-gradient(135deg,#0c0c18,#1a0606)'};color:#fff">
        <div style="font-family:var(--font-display);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;opacity:.7;margin-bottom:6px">${kit.badge}</div>
        <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:900">${kit.name}</div>
        <div class="kit-price" style="margin-top:8px">${kit.price}<span style="font-size:.9rem;font-weight:400;opacity:.6"> flat</span></div>
      </div>
      <div class="kit-body">
        ${kit.desc ? `<p style="font-size:.84rem;color:var(--text-secondary);margin-bottom:14px">${kit.desc}</p>` : ''}
        <div class="kit-items">
          ${kit.items.map(item=>`<div class="kit-item"><span class="kit-check">✓</span><span>${item}</span></div>`).join('')}
        </div>
        <div class="kit-turnaround">⏱ Turnaround: ${kit.turnaround}</div>
        <button class="btn btn-primary btn-full" onclick="UI.openModal('quote-modal')">Order This Kit →</button>
        <a class="btn btn-wa btn-full" style="margin-top:7px" href="${CONFIG.wa('Hi! I want to order the ' + kit.name + ' kit (' + kit.price + ')')}" target="_blank">💬 Order on WhatsApp</a>
      </div>
    </div>`).join('')}
  </div>
  <div style="margin-top:32px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:32px">
    <div style="font-size:2rem;margin-bottom:12px">🤝</div>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;margin-bottom:8px">Need a Custom Kit?</h3>
    <p style="color:var(--text-muted);margin-bottom:18px">We can build a custom kit tailored exactly to your business needs and budget.</p>
    <button class="btn btn-primary btn-lg" onclick="UI.openModal('quote-modal')">Request Custom Kit</button>
  </div>
</div>`;

Pages.Campaign = () => `
<div class="page-hero dark">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px">🗳️ Campaign Materials</h1>
    <p style="color:rgba(255,255,255,.55);max-width:480px">Election, political and civic campaign materials. Fast turnaround, bulk pricing, rush available.</p>
  </div>
</div>
<div class="container page-wrap">
  <div class="promo-grid" style="margin-bottom:28px">
    <div class="promo-banner pb-1">
      <div class="promo-bg">🗳️</div>
      <div class="promo-title">Ward / LGA Campaign</div>
      <div class="promo-sub">From ₦50,000 · Banners, flyers, T-shirts, caps</div>
      <div class="promo-cta" onclick="UI.openModal('quote-modal')">Get Quote →</div>
    </div>
    <div class="promo-banner pb-2">
      <div class="promo-bg">🏛️</div>
      <div class="promo-title">State-Wide Campaign</div>
      <div class="promo-sub">From ₦200,000 · Full suite, vehicle branding</div>
      <div class="promo-cta" onclick="UI.openModal('quote-modal')">Get Quote →</div>
    </div>
  </div>
  <div class="product-grid">
    ${PRODUCTS.filter(p=>p.cat==='campaign').map(p=>UI.productCard(p)).join('')}
    ${PRODUCTS.filter(p=>p.cat==='banners').slice(0,2).map(p=>UI.productCard(p)).join('')}
    ${PRODUCTS.filter(p=>p.cat==='apparel').slice(0,2).map(p=>UI.productCard(p)).join('')}
  </div>
  <div style="margin-top:28px;background:linear-gradient(135deg,#0c0c18,#180606);border-radius:var(--r-xl);padding:32px;text-align:center">
    <div style="font-size:2rem;margin-bottom:12px">⚡</div>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;color:#fff;margin-bottom:8px">Rush Campaign Production Available</h3>
    <p style="color:rgba(255,255,255,.55);margin-bottom:18px">We understand election timelines. Get your materials produced in 24–48 hours.</p>
    <a class="btn btn-primary btn-lg" href="${CONFIG.wa('Hi! I need urgent campaign materials. Rush production.')}" target="_blank">📞 Call for Rush Order</a>
  </div>
</div>`;

Pages.Publishing = () => `
<div class="page-hero dark">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px">📚 Book Publishing</h1>
    <p style="color:rgba(255,255,255,.55);max-width:480px">Professional book design, editing and print services. From concept to printed copy.</p>
  </div>
</div>
<div class="container page-wrap">
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px;margin-bottom:32px">
    ${[
      { name:'Self-Publishing Basic', price:'₦80,000', items:['Cover Design (Front + Back + Spine)','Interior Layout & Typesetting','10 Printed Copies (Perfect Bound)','ISBN Registration Guidance','PDF Digital Copy'], badge:'', color:'var(--accent)' },
      { name:'Self-Publishing Pro', price:'₦150,000', items:['Full Cover Design (All sides)','Interior Layout + Illustrations','50 Printed Copies','Light Copy Editing','ISBN Registration','1 Year Digital Distribution Support'], badge:'Most Popular ⭐', color:'var(--brand)' },
      { name:'Institutional Print', price:'Custom', items:['Academic & corporate books','Minimum 100 copies','Full design service','ISBN registration','Hardcover or softcover','Distribution support available'], badge:'For Organisations', color:'#0c0c18' },
    ].map(pkg => `
    <div class="kit-card">
      <div class="kit-hdr" style="background:${pkg.color==='var(--brand)'?'linear-gradient(135deg,var(--brand),var(--brand-dark))':pkg.color==='var(--accent)'?'linear-gradient(135deg,#5a5da0,#7B7EC8)':'linear-gradient(135deg,#0c0c18,#1a0606)'};color:#fff">
        ${pkg.badge ? `<div style="font-size:.7rem;opacity:.7;margin-bottom:5px;font-family:var(--font-display)">${pkg.badge}</div>` : ''}
        <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:900">${pkg.name}</div>
        <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:900;margin-top:7px">${pkg.price}</div>
      </div>
      <div class="kit-body">
        <div class="kit-items">${pkg.items.map(i=>`<div class="kit-item"><span class="kit-check">✓</span><span>${i}</span></div>`).join('')}</div>
        <button class="btn btn-primary btn-full" onclick="UI.openModal('quote-modal')">Get Started →</button>
      </div>
    </div>`).join('')}
  </div>
  <div class="product-grid">${PRODUCTS.filter(p=>p.cat==='books').map(p=>UI.productCard(p)).join('')}</div>
</div>`;

Pages.Earn = () => `
<div class="page-hero dark">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px">💰 Affiliate & Earn Program</h1>
    <p style="color:rgba(255,255,255,.55);max-width:540px">Refer customers to PrintHub and earn commission on every order they place — forever.</p>
  </div>
</div>
<div class="container page-wrap">
  <div class="earn-banner" style="margin-bottom:28px">
    <div>
      <div class="earn-title">Earn Up to 10% Commission 💰</div>
      <div class="earn-sub">No targets. No limits. Monthly payouts. All you do is share your link.</div>
      <div class="earn-tiers">
        <div class="earn-tier"><div class="et-pct">10%</div><div class="et-lbl">Orders 1–5</div></div>
        <div class="earn-tier"><div class="et-pct">5%</div><div class="et-lbl">Orders 6–10</div></div>
        <div class="earn-tier"><div class="et-pct">3%</div><div class="et-lbl">11+ Forever</div></div>
        <div class="earn-tier"><div class="et-pct">∞</div><div class="et-lbl">No Cap</div></div>
      </div>
    </div>
    <div style="text-align:center">
      <button class="btn btn-primary btn-xl" onclick="Store.getState().user ? Store.navigate('account',{tab:'affiliate'}) : UI.openModal('auth-modal')">Join Free →</button>
      <div style="font-size:.72rem;color:rgba(255,255,255,.35);margin-top:7px">No cost · No commitment</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;margin-bottom:32px">
    ${[['1️⃣','Sign Up Free','Create a free account in 30 seconds'],['2️⃣','Get Your Link','Copy your unique referral link'],['3️⃣','Share It','Share on WhatsApp, social media, to clients'],['4️⃣','Earn Money','Get paid for every order your referrals make']].map(([i,t,s])=>`
    <div class="card"><div class="card-body" style="text-align:center">
      <div style="font-size:2.2rem;margin-bottom:10px">${i}</div>
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:5px">${t}</div>
      <div style="font-size:.84rem;color:var(--text-muted)">${s}</div>
    </div></div>`).join('')}
  </div>

  <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px;margin-bottom:24px">
    <h3 style="font-family:var(--font-display);font-weight:900;font-size:1.1rem;margin-bottom:16px">💡 Example Earnings</h3>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Referrals per Month</th><th>Avg Order Value</th><th>Your Commission</th><th>Monthly Earnings</th></tr></thead>
        <tbody>
          <tr><td>5 referrals</td><td>₦25,000</td><td>10%</td><td style="font-weight:900;color:var(--brand)">₦12,500</td></tr>
          <tr><td>10 referrals</td><td>₦30,000</td><td>5–10%</td><td style="font-weight:900;color:var(--brand)">₦27,500</td></tr>
          <tr><td>20 referrals</td><td>₦35,000</td><td>3–10%</td><td style="font-weight:900;color:var(--brand)">₦52,500</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div style="text-align:center">
    <button class="btn btn-primary btn-xl" onclick="Store.getState().user ? Store.navigate('account',{tab:'affiliate'}) : UI.openModal('auth-modal')">
      💰 Start Earning Today
    </button>
  </div>
</div>`;

Pages.Track = () => `
<div class="page-hero">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;margin-bottom:8px">📦 Track Your Order</h1>
    <p style="color:var(--text-muted)">Enter your order number to see real-time production status.</p>
  </div>
</div>
<div class="container page-wrap">
  <div class="container-xs" style="margin:0 auto">
    <div class="card" style="margin-bottom:20px">
      <div class="card-body">
        <div style="display:flex;gap:0;margin-bottom:4px">
          <input id="track-input" class="form-input" style="border-radius:var(--r) 0 0 var(--r);border-right:none" placeholder="Order number, e.g. PH-XYZ123" onkeydown="if(event.key==='Enter')trackOrder()">
          <button class="btn btn-primary" style="border-radius:0 var(--r) var(--r) 0;padding:10px 20px" onclick="trackOrder()">Track</button>
        </div>
        <p style="font-size:.76rem;color:var(--text-muted);margin-top:8px">Your order number was sent to you via WhatsApp when you placed your order.</p>
      </div>
    </div>
    <div id="track-result" style="display:none"></div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:22px">
      <h3 style="font-family:var(--font-display);font-weight:800;font-size:.95rem;margin-bottom:16px">📍 Order Journey</h3>
      <div class="track-steps">
        ${['Pending Payment','Confirmed','Design Review','In Production','Ready for Pickup / Shipped','Delivered'].map((s,i)=>`
        <div class="track-step">
          <div class="track-dot" id="track-dot-${i}"></div>
          <div><div style="font-weight:700;font-size:.86rem;font-family:var(--font-display)">${s}</div>
          <div style="font-size:.76rem;color:var(--text-muted)">${['Payment received and order confirmed','Order confirmed, ready for production','Artwork reviewed and approved','Your order is being printed','Ready for collection or dispatched','Order complete! Enjoy your prints'].join('||').split('||')[i]}</div></div>
        </div>`).join('')}
      </div>
    </div>
    <div style="text-align:center;margin-top:22px">
      <p style="font-size:.86rem;color:var(--text-muted);margin-bottom:12px">Need a faster update? Chat with us directly.</p>
      <a class="btn btn-wa btn-lg" href="${CONFIG.wa('Hi! I need an update on my PrintHub order.')}" target="_blank">💬 WhatsApp for Update</a>
    </div>
  </div>
</div>`;

function trackOrder() {
  const val = document.getElementById('track-input')?.value.trim();
  if (!val) { UI.toast('Enter your order number', 'error'); return; }
  const order = Cart.getOrderByNumber(val.toUpperCase());
  const result = document.getElementById('track-result'); if (!result) return;
  if (!order) {
    result.innerHTML = `<div style="background:var(--brand-light);border:2px solid var(--brand);border-radius:var(--r-xl);padding:18px;margin-bottom:16px;text-align:center">
      <div style="font-size:1.4rem;margin-bottom:7px">🔍</div>
      <div style="font-weight:800;font-family:var(--font-display)">Order not found</div>
      <p style="font-size:.82rem;color:var(--text-muted);margin-top:5px">Check the order number or <a href="${CONFIG.wa('Hi! Please update me on my order')}" target="_blank" style="color:var(--brand)">contact us on WhatsApp</a></p>
    </div>`;
    result.style.display = 'block'; return;
  }
  const steps = ORDER_STATUSES.slice(0,-1);
  const currentIdx = steps.indexOf(order.status);
  result.innerHTML = `
  <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:22px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:900">${order.orderNumber}</div>
        <div style="font-size:.78rem;color:var(--text-muted)">${order.customerName} · ${new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
      </div>
      ${UI.statusBadge(order.status)}
    </div>
    <div class="track-steps">
      ${steps.map((s,i)=>`
      <div class="track-step">
        <div class="track-dot ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}"></div>
        <div>
          <div style="font-weight:${i===currentIdx?'800':'600'};font-size:.84rem;color:${i<=currentIdx?'var(--text-primary)':'var(--text-muted)'}">${s}</div>
          ${order.statusHistory?.find(h=>h.status===s) ? `<div style="font-size:.72rem;color:var(--text-muted)">${new Date(order.statusHistory.find(h=>h.status===s).at).toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</div>` : ''}
        </div>
      </div>`).join('')}
    </div>
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-soft);display:flex;gap:8px;flex-wrap:wrap">
      <a class="btn btn-wa btn-sm" href="${CONFIG.wa('Hi! Please update me on order ' + order.orderNumber)}" target="_blank">💬 Get Update</a>
      <div style="font-size:.8rem;color:var(--text-muted);padding:7px;align-self:center">Total: <strong>${formatNaira(order.total)}</strong></div>
    </div>
  </div>`;
  result.style.display = 'block';
}

Pages.FAQ = () => `
<div class="page-hero">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;margin-bottom:8px">❓ Frequently Asked Questions</h1>
    <p style="color:var(--text-muted)">Everything you need to know about printing with PrintHub. Can't find your answer? <a onclick="UI.openModal('quote-modal')" style="color:var(--brand);cursor:pointer;font-weight:700">Contact us</a></p>
  </div>
</div>
<div class="container page-wrap">
  <div class="container-sm" style="margin:0 auto">
    <div style="margin-bottom:20px">
      <input class="form-input" placeholder="Search FAQs..." oninput="faqSearch(this.value)">
    </div>
    <div class="faq-cat-nav">
      ${['All',...[...new Set(FAQ_DATA.map(f=>f.cat))]].map(cat=>`
      <button class="faq-cat-btn ${cat==='All'?'active':''}" onclick="faqFilterCat('${cat}',this)">${cat}</button>`).join('')}
    </div>
    <div id="faq-list">
      ${FAQ_DATA.map((f,i)=>`
      <div class="faq-item" id="faq-${i}" data-cat="${f.cat}">
        <div class="faq-q" onclick="UI.toggleFaq(${i})">
          <span>${f.q}</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-a">${f.a}</div>
      </div>`).join('')}
    </div>
    <div style="text-align:center;margin-top:32px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:28px">
      <div style="font-size:2rem;margin-bottom:10px">💬</div>
      <h3 style="font-family:var(--font-display);font-weight:900;font-size:1.1rem;margin-bottom:7px">Still have a question?</h3>
      <p style="color:var(--text-muted);font-size:.86rem;margin-bottom:16px">Our team is available Mon–Sat 8am–7pm</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn-wa btn-lg" href="${CONFIG.wa('Hi! I have a question about PrintHub')}" target="_blank">💬 WhatsApp Us</a>
        <button class="btn btn-outline btn-lg" onclick="UI.openModal('quote-modal')">Send Message</button>
      </div>
    </div>
  </div>
</div>`;

function faqSearch(val) {
  const q = val.toLowerCase();
  document.querySelectorAll('.faq-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = !q || text.includes(q) ? '' : 'none';
  });
}
function faqFilterCat(cat, btn) {
  document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-item').forEach(item => {
    item.style.display = cat === 'All' || item.dataset.cat === cat ? '' : 'none';
  });
}

Pages.Contact = () => `
<div class="page-hero">
  <div class="container">
    <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;margin-bottom:8px">📞 Contact Us</h1>
    <p style="color:var(--text-muted)">We're here Mon–Sat 8am–7pm. Get a response in under 2 hours.</p>
  </div>
</div>
<div class="container page-wrap">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
    <div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-body">
          <h3 style="font-family:var(--font-display);font-weight:800;font-size:1rem;margin-bottom:16px">Send a Message</h3>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Name *</label><input id="ct-name" class="form-input" placeholder="Your full name"></div>
            <div class="form-group"><label class="form-label">Phone *</label><input id="ct-phone" class="form-input" placeholder="+234..."></div>
          </div>
          <div class="form-group"><label class="form-label">Email</label><input id="ct-email" class="form-input" type="email" placeholder="your@email.com"></div>
          <div class="form-group"><label class="form-label">Subject</label>
            <select id="ct-subject" class="form-select">
              <option>General Inquiry</option><option>Custom Quote Request</option>
              <option>Order Follow-up</option><option>Design Consultation</option>
              <option>Complaint / Issue</option><option>B2B / Corporate Account</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Message *</label><textarea id="ct-message" class="form-textarea" rows="4" placeholder="Tell us how we can help..."></textarea></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <button class="btn btn-primary btn-full" onclick="contactSubmit()">📨 Send Message</button>
            <a class="btn btn-wa btn-full" id="ct-wa-btn" href="${CONFIG.wa('Hi PrintHub!')}" target="_blank">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
    <div>
      ${[['📍','Visit Us',CONFIG.address,''],['📞','Call Us',CONFIG.phone1 + ' · ' + CONFIG.phone2,'tel:' + CONFIG.phone1],['✉️','Email Us',CONFIG.email,'mailto:' + CONFIG.email],['💬','WhatsApp','Chat directly for fastest response',CONFIG.wa('Hi PrintHub!')],['⏰','Opening Hours','Mon – Sat: 8:00 AM – 7:00 PM','']].map(([icon,title,val,link])=>`
      <div class="card" style="margin-bottom:12px">
        <div class="card-body" style="display:flex;gap:13px;align-items:flex-start;padding:16px">
          <div style="font-size:1.5rem">${icon}</div>
          <div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:.88rem;margin-bottom:3px">${title}</div>
            ${link ? `<a href="${link}" target="_blank" style="font-size:.84rem;color:var(--brand)">${val}</a>` : `<div style="font-size:.84rem;color:var(--text-secondary)">${val}</div>`}
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</div>`;

function contactSubmit() {
  const name = document.getElementById('ct-name')?.value.trim();
  const phone = document.getElementById('ct-phone')?.value.trim();
  const subject = document.getElementById('ct-subject')?.value;
  const message = document.getElementById('ct-message')?.value.trim();
  if (!name || !phone || !message) { UI.toast('Please fill in all required fields', 'error'); return; }
  const msg = `Hi PrintHub!\n\nName: ${name}\nPhone: ${phone}\nSubject: ${subject}\n\n${message}`;
  window.open(CONFIG.wa(msg), '_blank');
  UI.toast('✅ Message sent via WhatsApp!', 'success');
}
