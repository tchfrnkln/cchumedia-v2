/* ================================================================
   PRINTHUB — pages/account.js
   Tabs: orders, addresses, loyalty, affiliate, profile, wishlist
   ================================================================ */
Pages.Account = (state) => {
  const { user, wishlist } = state;
  const tab = state.route.params?.tab || 'orders';

  if (!user) return `
    <div class="container page-wrap" style="text-align:center">
      <div style="font-size:3.5rem;margin-bottom:14px">👤</div>
      <h2 style="font-family:var(--font-display);font-size:1.6rem;font-weight:900;margin-bottom:8px">Login to Your Account</h2>
      <p style="color:var(--text-muted);margin-bottom:22px">Login or create an account to track orders, save designs, earn loyalty points and more.</p>
      <button class="btn btn-primary btn-lg" onclick="UI.openModal('auth-modal')">Login / Register</button>
    </div>`;

  const orders = Cart.getUserOrders(user.id);
  const tabs = [
    { id:'orders',    icon:'📦', label:'My Orders' },
    { id:'loyalty',   icon:'⭐', label:'Loyalty Points' },
    { id:'affiliate', icon:'💰', label:'Affiliate' },
    { id:'addresses', icon:'📍', label:'Addresses' },
    { id:'wishlist',  icon:'❤️', label:'Wishlist' },
    { id:'profile',   icon:'⚙️', label:'Profile & Settings' },
  ];
  if (user.role === 'admin') tabs.push({ id:'admin-link', icon:'🔧', label:'Admin Panel' });

  const renderTab = () => {
    switch(tab) {
      case 'orders':    return accountOrders(user, orders);
      case 'loyalty':   return accountLoyalty(user, orders);
      case 'affiliate': return accountAffiliate(user);
      case 'addresses': return accountAddresses(user);
      case 'wishlist':  return accountWishlist();
      case 'profile':   return accountProfile(user);
      default:          return accountOrders(user, orders);
    }
  };

  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb">
        <span onclick="Store.navigate('home')">Home</span><span class="sep">›</span>
        <span class="current">My Account</span>
      </div>
    </div>
  </div>
  <div class="container page-wrap" style="padding-top:24px">
    <div class="account-grid">
      <!-- SIDEBAR -->
      <aside class="account-sidebar">
        <div class="account-user-card">
          <div class="account-avatar">${user.name.charAt(0).toUpperCase()}</div>
          <div style="font-family:var(--font-display);font-weight:900;font-size:1rem">${user.name}</div>
          <div style="font-size:.76rem;opacity:.7;margin-top:2px">${user.email}</div>
          <div style="margin-top:10px;background:rgba(255,255,255,.15);border-radius:var(--r);padding:8px;display:flex;align-items:center;justify-content:center;gap:7px">
            <span style="font-size:1.1rem">⭐</span>
            <div><div style="font-family:var(--font-display);font-weight:900;font-size:1rem">${(user.loyaltyPoints||0).toLocaleString()}</div>
            <div style="font-size:.66rem;opacity:.7">Loyalty Points</div></div>
          </div>
        </div>
        <nav class="account-nav">
          ${tabs.map(t => `
          <${t.id === 'admin-link' ? `a onclick="Store.navigate('admin')"` : `button onclick="Store.navigate('account',{tab:'${t.id}'})"` } 
            class="${tab === t.id ? 'active' : ''}">
            <span class="nav-icon">${t.icon}</span>${t.label}
          </${t.id === 'admin-link' ? 'a' : 'button'}>`).join('')}
          <button onclick="Auth.logout();UI.render()" style="color:#dc2626 !important">
            <span class="nav-icon">🚪</span>Logout
          </button>
        </nav>
      </aside>
      <!-- MAIN -->
      <main>${renderTab()}</main>
    </div>
  </div>`;
};

function accountOrders(user, orders) {
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">
    <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900">📦 My Orders (${orders.length})</h2>
    <button class="btn btn-primary btn-sm" onclick="Store.navigate('shop')">+ New Order</button>
  </div>
  ${orders.length === 0 ? `
  <div style="text-align:center;padding:48px;color:var(--text-muted)">
    <div style="font-size:3rem;margin-bottom:11px">📦</div>
    <div style="font-weight:700;margin-bottom:6px">No orders yet</div>
    <button class="btn btn-primary btn-sm" onclick="Store.navigate('shop')">Start Shopping</button>
  </div>` : orders.map(o => `
  <div class="order-card" onclick="accExpandOrder('${o.id}',this)" style="cursor:pointer">
    <div class="order-card-hdr">
      <div>
        <div style="font-family:var(--font-display);font-weight:900;font-size:.92rem">${o.orderNumber}</div>
        <div style="font-size:.76rem;color:var(--text-muted)">${new Date(o.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</div>
      </div>
      ${UI.statusBadge(o.status)}
      <div style="font-family:var(--font-display);font-weight:900;color:var(--brand)">${formatNaira(o.total)}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
      ${o.items.slice(0,3).map(i=>`<span style="font-size:.76rem;background:var(--bg-muted);padding:2px 8px;border-radius:99px">${i.icon} ${i.name.split(' ').slice(0,3).join(' ')}</span>`).join('')}
      ${o.items.length > 3 ? `<span style="font-size:.76rem;background:var(--bg-muted);padding:2px 8px;border-radius:99px">+${o.items.length-3} more</span>` : ''}
    </div>
    <div id="order-expand-${o.id}" style="display:none;border-top:1px solid var(--border-soft);padding-top:12px;margin-top:4px">
      ${o.items.map(i=>`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:7px">
        <div style="font-size:1.3rem">${i.icon}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.84rem;font-family:var(--font-display)">${i.name}</div>
          <div style="font-size:.74rem;color:var(--text-muted)">${i.qty}pcs · ${i.config.size} · ${i.config.material} · ${i.config.finishing}</div>
        </div>
        <div style="font-weight:900;font-family:var(--font-display);font-size:.88rem;color:var(--brand)">${formatNaira(i.total)}</div>
      </div>`).join('')}
      <div style="border-top:1px solid var(--border-soft);padding-top:10px;margin-top:6px">
        <div style="font-size:.8rem;margin-bottom:6px"><strong>Status History:</strong></div>
        ${(o.statusHistory||[]).map(h=>`
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:5px;font-size:.78rem">
          <div style="width:7px;height:7px;border-radius:50%;background:var(--brand);flex-shrink:0"></div>
          <div style="color:var(--text-secondary)">${h.status}</div>
          <div style="color:var(--text-muted)">${new Date(h.at).toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</div>
          ${h.note ? `<div style="color:var(--text-muted);font-style:italic">— ${h.note}</div>` : ''}
        </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <a class="btn btn-ghost btn-sm" href="${CONFIG.wa('Hi! Please update me on order ' + o.orderNumber)}" target="_blank">💬 Get Update</a>
        <button class="btn btn-ghost btn-sm" onclick="accReorder('${o.id}')">🔁 Reorder</button>
        ${o.status === 'Pending Payment' ? `<button class="btn btn-primary btn-sm" onclick="accPayNow('${o.id}')">💳 Pay Now</button>` : ''}
      </div>
    </div>
  </div>`).join('')}`;
}

function accountLoyalty(user, orders) {
  const pts = user.loyaltyPoints || 0;
  const earned = orders.filter(o=>o.status==='Delivered').reduce((s,o)=>s+(o.loyaltyPointsEarned||0),0);
  return `
  <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;margin-bottom:18px">⭐ Loyalty Points</h2>
  <div class="loyalty-points-card" style="margin-bottom:20px">
    <div style="font-size:.78rem;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.45);margin-bottom:6px;font-family:var(--font-display)">Your Balance</div>
    <div class="lp-big">${pts.toLocaleString()}</div>
    <div style="font-size:.86rem;color:rgba(255,255,255,.55);margin-top:4px">= ${formatNaira(pts)} discount on your next order</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
      <div style="background:rgba(255,255,255,.07);border-radius:var(--r);padding:12px;text-align:center">
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:900;color:var(--brand)">${earned.toLocaleString()}</div>
        <div style="font-size:.72rem;color:rgba(255,255,255,.45);margin-top:2px">Total Earned</div>
      </div>
      <div style="background:rgba(255,255,255,.07);border-radius:var(--r);padding:12px;text-align:center">
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:900;color:var(--accent)">2%</div>
        <div style="font-size:.72rem;color:rgba(255,255,255,.45);margin-top:2px">Earn Rate</div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:12px">How Loyalty Works</div>
      ${[['💰','Earn 2%','Get 2% of every order value as points when delivered'],['1️⃣','1 Point = ₦1','Redeem your points for naira discounts at checkout'],['⭐','No Expiry','Your points never expire — accumulate and save'],['🎁','Bonus Points','Earn extra points on referrals and special events']].map(([ic,t,s])=>`
      <div style="display:flex;gap:10px;margin-bottom:10px">
        <div style="font-size:1.3rem">${ic}</div>
        <div><div style="font-weight:700;font-size:.86rem;font-family:var(--font-display)">${t}</div><div style="font-size:.8rem;color:var(--text-muted)">${s}</div></div>
      </div>`).join('')}
    </div>
  </div>
  <button class="btn btn-primary btn-full" onclick="Store.navigate('checkout')">Redeem at Checkout →</button>`;
}

function accountAffiliate(user) {
  const stats = Auth.getAffiliateStats(user.id);
  const refLink = `${location.origin}/?ref=${user.id}`;
  return `
  <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;margin-bottom:18px">💰 Affiliate Program</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px">
    ${[['Referrals',stats.count,'👥'],['Earned',formatNaira(stats.earned),'💵'],['Your Tier',stats.count<5?'10%':stats.count<10?'5%':'3%','🏆']].map(([l,v,i])=>`
    <div class="stat-card" style="text-align:center">
      <div style="font-size:1.8rem;margin-bottom:5px">${i}</div>
      <div class="stat-val">${v}</div>
      <div class="stat-lbl">${l}</div>
    </div>`).join('')}
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:12px">📎 Your Referral Link</div>
      <div style="display:flex;gap:8px;align-items:center">
        <input class="form-input" value="${refLink}" id="ref-link-input" readonly style="font-size:.8rem">
        <button class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText('${refLink}');UI.toast('Link copied!','success')">Copy</button>
      </div>
      <p style="font-size:.78rem;color:var(--text-muted);margin-top:7px">Share this link. Earn commission when anyone orders via your link.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:12px">Commission Tiers</div>
      <div class="earn-tiers">
        <div class="earn-tier" style="background:var(--bg-muted)"><div class="et-pct" style="color:var(--brand)">10%</div><div class="et-lbl" style="color:var(--text-muted)">Orders 1–5</div></div>
        <div class="earn-tier" style="background:var(--bg-muted)"><div class="et-pct" style="color:var(--brand)">5%</div><div class="et-lbl" style="color:var(--text-muted)">Orders 6–10</div></div>
        <div class="earn-tier" style="background:var(--bg-muted)"><div class="et-pct" style="color:var(--brand)">3%</div><div class="et-lbl" style="color:var(--text-muted)">11+ Forever</div></div>
        <div class="earn-tier" style="background:var(--bg-muted)"><div class="et-pct" style="color:var(--accent)">∞</div><div class="et-lbl" style="color:var(--text-muted)">No Limit</div></div>
      </div>
    </div>
  </div>`;
}

function accountAddresses(user) {
  const addresses = user.addresses || [];
  return `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
    <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900">📍 Saved Addresses</h2>
    <button class="btn btn-primary btn-sm" onclick="accAddAddressForm()">+ Add Address</button>
  </div>
  <div id="acc-addr-form" style="display:none;margin-bottom:16px">
    <div class="card">
      <div class="card-body">
        <div style="font-family:var(--font-display);font-weight:800;margin-bottom:14px">New Address</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Label (e.g. Home, Office)</label><input id="addr-label" class="form-input" placeholder="Home"></div>
          <div class="form-group"><label class="form-label">Phone</label><input id="addr-phone" class="form-input" placeholder="+234..."></div>
        </div>
        <div class="form-group"><label class="form-label">Street Address</label><textarea id="addr-street" class="form-textarea" rows="2" placeholder="Street, Area, LGA, State"></textarea></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="accSaveAddress()">Save Address</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('acc-addr-form').style.display='none'">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  ${addresses.length === 0 ? `<div style="text-align:center;padding:36px;color:var(--text-muted)"><div style="font-size:2.5rem;margin-bottom:10px">📍</div><p>No saved addresses yet</p></div>` :
  addresses.map(a => `
  <div class="card" style="margin-bottom:10px">
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-family:var(--font-display);font-weight:800;margin-bottom:4px">${a.label||'Address'}</div>
          <div style="font-size:.84rem;color:var(--text-secondary)">${a.street||a.address||''}</div>
          ${a.phone ? `<div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">${a.phone}</div>` : ''}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="accDeleteAddress('${a.id}')">🗑 Delete</button>
      </div>
    </div>
  </div>`).join('')}`;
}

function accountWishlist() {
  const wlIds = DB.getVal('wishlist', []) || [];
  const wishProducts = PRODUCTS.filter(p => wlIds.includes(p.id));
  return `
  <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;margin-bottom:18px">❤️ Wishlist (${wishProducts.length})</h2>
  ${wishProducts.length === 0 ? `<div style="text-align:center;padding:36px;color:var(--text-muted)"><div style="font-size:2.5rem;margin-bottom:10px">❤️</div><p>Your wishlist is empty</p><button class="btn btn-primary btn-sm" onclick="Store.navigate('shop')">Browse Products</button></div>` :
  `<div class="product-grid">${wishProducts.map(p => UI.productCard(p)).join('')}</div>`}`;
}

function accountProfile(user) {
  return `
  <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;margin-bottom:18px">⚙️ Profile & Settings</h2>
  <div class="card" style="margin-bottom:16px">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">Personal Information</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Full Name</label><input id="prof-name" class="form-input" value="${user.name}"></div>
        <div class="form-group"><label class="form-label">Phone</label><input id="prof-phone" class="form-input" value="${user.phone||''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Email (cannot change)</label><input class="form-input" value="${user.email}" disabled style="opacity:.6"></div>
      <button class="btn btn-primary btn-sm" onclick="accUpdateProfile()">Save Changes</button>
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">Change Password</div>
      <div class="form-group"><label class="form-label">Current Password</label><input id="prof-old-pass" class="form-input" type="password" placeholder="Current password"></div>
      <div class="form-group"><label class="form-label">New Password</label><input id="prof-new-pass" class="form-input" type="password" placeholder="New password (min 6 chars)"></div>
      <button class="btn btn-outline btn-sm" onclick="accChangePassword()">Update Password</button>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <div style="font-family:var(--font-display);font-weight:800;margin-bottom:8px">🌙 Appearance</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-weight:600;font-size:.9rem">Dark / Night Mode</div><div style="font-size:.78rem;color:var(--text-muted)">Easier on the eyes at night</div></div>
        <div class="theme-toggle" onclick="Store.setTheme(Store.getState().theme==='light'?'dark':'light')"></div>
      </div>
    </div>
  </div>`;
}

// Account action handlers
function accExpandOrder(id, el) {
  const expand = document.getElementById('order-expand-' + id);
  if (!expand) return;
  expand.style.display = expand.style.display === 'none' ? 'block' : 'none';
}
function accReorder(orderId) {
  const order = Cart.getOrder(orderId);
  if (!order) return;
  order.items.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) Cart.addItem(product, item.config, item.qty, null);
  });
  UI.toggleCart();
  UI.render();
  UI.toast('🛒 Items added to cart!', 'success');
}
function accPayNow(orderId) {
  const order = Cart.getOrder(orderId);
  if (order) window.open(CONFIG.wa('Hi! I want to pay for order: ' + order.orderNumber), '_blank');
}
function accAddAddressForm() {
  const f = document.getElementById('acc-addr-form');
  if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function accSaveAddress() {
  const { user } = Store.getState();
  if (!user) return;
  const label = document.getElementById('addr-label')?.value.trim() || 'Address';
  const phone = document.getElementById('addr-phone')?.value.trim();
  const street = document.getElementById('addr-street')?.value.trim();
  if (!street) { UI.toast('Enter address details', 'error'); return; }
  Auth.addAddress(user.id, { label, phone, street });
  UI.toast('Address saved!', 'success');
  Store.navigate('account', { tab: 'addresses' });
}
function accDeleteAddress(addrId) {
  const { user } = Store.getState();
  if (!user) return;
  Auth.removeAddress(user.id, addrId);
  UI.toast('Address removed', 'info');
  Store.navigate('account', { tab: 'addresses' });
}
function accUpdateProfile() {
  const { user } = Store.getState();
  if (!user) return;
  const name = document.getElementById('prof-name')?.value.trim();
  const phone = document.getElementById('prof-phone')?.value.trim();
  if (!name) { UI.toast('Name required', 'error'); return; }
  Auth.updateProfile(user.id, { name, phone });
  UI.toast('✅ Profile updated!', 'success');
  UI.render();
}
function accChangePassword() {
  const { user } = Store.getState();
  if (!user) return;
  const oldPass = document.getElementById('prof-old-pass')?.value;
  const newPass = document.getElementById('prof-new-pass')?.value;
  if (!oldPass || !newPass) { UI.toast('Fill both password fields', 'error'); return; }
  if (newPass.length < 6) { UI.toast('New password too short', 'error'); return; }
  const result = Auth.changePassword(user.id, oldPass, newPass);
  if (result.error) { UI.toast('⚠️ ' + result.error, 'error'); return; }
  UI.toast('✅ Password updated!', 'success');
  document.getElementById('prof-old-pass').value = '';
  document.getElementById('prof-new-pass').value = '';
}
