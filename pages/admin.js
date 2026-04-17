/* ================================================================
   PRINTHUB — pages/admin.js
   Full admin: Dashboard, Orders, Products, Customers, Analytics
   ================================================================ */
Pages.Admin = (state) => {
  const { user } = state;
  if (!user || user.role !== 'admin') return `
    <div class="container page-wrap" style="text-align:center">
      <div style="font-size:3rem;margin-bottom:14px">🔒</div>
      <h2 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">Admin Access Required</h2>
      <button class="btn btn-primary btn-sm" style="margin-top:16px" onclick="UI.openModal('auth-modal')">Login as Admin</button>
    </div>`;

  const adminTab = state.adminTab || 'dashboard';
  return `
  <div class="admin-wrap">
    <nav class="admin-sidebar">
      <div style="padding:18px 18px 14px;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-display);font-weight:900;font-size:.88rem;color:var(--text-primary)">⚙️ Admin Panel</div>
        <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">${user.name}</div>
      </div>
      ${[
        ['dashboard','📊','Dashboard'],
        ['orders','📦','Orders'],
        ['products','🛒','Products'],
        ['customers','👥','Customers'],
        ['analytics','📈','Analytics'],
        ['settings','⚙️','Settings'],
      ].map(([id,ic,lbl]) => `
      <div class="admin-nav-item ${adminTab===id?'active':''}" onclick="Store.setState({adminTab:'${id}'});UI.render()">
        ${ic} ${lbl}
      </div>`).join('')}
      <div style="border-top:1px solid var(--border);margin-top:auto;padding-top:10px">
        <div class="admin-nav-item" onclick="Store.navigate('home')">🏠 Back to Site</div>
      </div>
    </nav>
    <main class="admin-main">
      ${renderAdminTab(adminTab)}
    </main>
  </div>`;
};

function renderAdminTab(tab) {
  switch (tab) {
    case 'dashboard': return adminDashboard();
    case 'orders':    return adminOrders();
    case 'products':  return adminProducts();
    case 'customers': return adminCustomers();
    case 'analytics': return adminAnalytics();
    case 'settings':  return adminSettings();
    default:          return adminDashboard();
  }
}

function adminDashboard() {
  const orders = Cart.getAllOrders();
  const customers = DB.get('users').filter(u => u.role !== 'admin');
  const totalRevenue = orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const pendingOrders = orders.filter(o => ['Pending Payment','Confirmed','Design Review','In Production'].includes(o.status));

  return `
  <div class="admin-header">
    <div>
      <h1 style="font-family:var(--font-display);font-size:1.5rem;font-weight:900">📊 Dashboard</h1>
      <div style="font-size:.82rem;color:var(--text-muted)">Welcome back! Here's what's happening.</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="Store.setState({adminTab:'orders'});UI.render()">View All Orders</button>
      <a class="btn btn-wa btn-sm" href="${CONFIG.wa('Hi!')}" target="_blank">💬 WhatsApp</a>
    </div>
  </div>

  <div class="stats-grid">
    ${[
      ['Total Revenue',formatNaira(totalRevenue),'💰','All time','stat-up'],
      ['Total Orders',orders.length,'📦','All time',''],
      ['Today\'s Orders',todayOrders.length,'📅','Last 24hrs',''],
      ['Pending',pendingOrders.length,'⏳','Needs action','stat-down'],
      ['Customers',customers.length,'👥','Registered','stat-up'],
      ['Products',PRODUCTS.length,'🛒','In catalogue',''],
    ].map(([l,v,i,sub,cls])=>`
    <div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="font-size:1.5rem">${i}</div>
        <span class="badge badge-${cls.includes('up')?'green':cls.includes('down')?'brand':'accent'}" style="font-size:.66rem">${sub}</span>
      </div>
      <div class="stat-val">${v}</div>
      <div class="stat-lbl">${l}</div>
    </div>`).join('')}
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="table-wrap">
      <div class="table-hdr"><h3>Recent Orders</h3><button class="btn btn-ghost btn-sm" onclick="Store.setState({adminTab:'orders'});UI.render()">View All</button></div>
      <div class="table-overflow">
        <table class="data-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            ${orders.slice(0,8).map(o=>`
            <tr onclick="adminEditOrder('${o.id}')" style="cursor:pointer">
              <td style="font-family:var(--font-display);font-weight:800;color:var(--brand)">${o.orderNumber}</td>
              <td>${o.customerName||'Guest'}</td>
              <td style="font-weight:700">${formatNaira(o.total)}</td>
              <td>${UI.statusBadge(o.status)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-hdr"><h3>Pending Actions</h3></div>
      <div style="padding:14px">
        ${pendingOrders.length === 0 ? '<p style="color:var(--text-muted);font-size:.86rem;text-align:center;padding:20px">All caught up! 🎉</p>' :
        pendingOrders.slice(0,6).map(o=>`
        <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border-soft)">
          <div style="flex:1">
            <div style="font-weight:800;font-size:.84rem;font-family:var(--font-display)">${o.orderNumber}</div>
            <div style="font-size:.74rem;color:var(--text-muted)">${o.customerName} · ${formatNaira(o.total)}</div>
          </div>
          ${UI.statusBadge(o.status)}
          <button class="btn btn-ghost btn-sm" onclick="adminEditOrder('${o.id}')">→</button>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function adminOrders() {
  const orders = Cart.getAllOrders();
  return `
  <div class="admin-header">
    <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">📦 Orders (${orders.length})</h1>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input class="table-search" id="admin-order-search" placeholder="Search orders..." oninput="adminFilterOrders(this.value)">
      <select class="form-select" style="width:auto" id="admin-status-filter" onchange="adminFilterOrders(document.getElementById('admin-order-search').value)">
        <option value="">All Statuses</option>
        ${ORDER_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="table-wrap">
    <div class="table-overflow">
      <table class="data-table" id="admin-orders-table">
        <thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Delivery</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${orders.map(o=>`
          <tr id="admin-row-${o.id}">
            <td style="font-family:var(--font-display);font-weight:900;color:var(--brand)">${o.orderNumber}</td>
            <td style="font-size:.8rem;white-space:nowrap">${new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
            <td>
              <div style="font-weight:700;font-size:.86rem">${o.customerName||'Guest'}</div>
              <div style="font-size:.74rem;color:var(--text-muted)">${o.customerPhone||''}</div>
            </td>
            <td style="font-size:.8rem">${o.items.length} item${o.items.length!==1?'s':''}</td>
            <td style="font-weight:800;font-family:var(--font-display)">${formatNaira(o.total)}</td>
            <td style="font-size:.8rem">${o.delivery?.method||'—'}</td>
            <td>${UI.statusBadge(o.status)}</td>
            <td>
              <div style="display:flex;gap:5px;flex-wrap:wrap">
                <button class="btn btn-ghost btn-sm" onclick="adminEditOrder('${o.id}')">📝 Manage</button>
                <a class="btn btn-wa btn-sm" href="${CONFIG.wa('Hi ' + (o.customerName||'') + ', regarding your order ' + o.orderNumber)}" target="_blank">💬</a>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <!-- ORDER DETAIL PANEL -->
  <div id="admin-order-detail" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:800;display:none;align-items:center;justify-content:center;padding:20px">
    <div id="admin-order-detail-box" style="background:var(--bg-elevated);border-radius:var(--r-xl);max-width:680px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-xl)"></div>
  </div>`;
}

function adminProducts() {
  return `
  <div class="admin-header">
    <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">🛒 Products (${PRODUCTS.length})</h1>
    <input class="table-search" placeholder="Search products..." oninput="adminFilterProducts(this.value)">
  </div>
  <div class="table-wrap">
    <div class="table-overflow">
      <table class="data-table" id="admin-products-table">
        <thead><tr><th>Icon</th><th>Product</th><th>Category</th><th>Base Price</th><th>Rating</th><th>Reviews</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${PRODUCTS.map(p=>`
          <tr>
            <td style="font-size:1.4rem;text-align:center">${p.icon}</td>
            <td>
              <div style="font-weight:800;font-size:.86rem;font-family:var(--font-display)">${p.name}</div>
              <div style="font-size:.74rem;color:var(--text-muted);margin-top:2px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.desc}</div>
            </td>
            <td><span class="badge badge-accent">${p.cat}</span></td>
            <td style="font-weight:800;font-family:var(--font-display);color:var(--brand)">${formatNaira(p.basePrice)}</td>
            <td>⭐ ${p.rating}</td>
            <td>${p.reviews.toLocaleString()}</td>
            <td>${p.featured ? '<span class="badge badge-green">Featured</span>' : '<span class="badge badge-accent">Standard</span>'}</td>
            <td>
              <div style="display:flex;gap:5px">
                <button class="btn btn-ghost btn-sm" onclick="UI.openProductModal('${p.id}')">👁 View</button>
                <button class="btn btn-ghost btn-sm" onclick="adminEditProduct('${p.id}')">✏️ Edit</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminCustomers() {
  const customers = DB.get('users');
  return `
  <div class="admin-header">
    <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">👥 Customers (${customers.length})</h1>
    <input class="table-search" placeholder="Search customers..." oninput="adminFilterCustomers(this.value)">
  </div>
  <div class="table-wrap">
    <div class="table-overflow">
      <table class="data-table" id="admin-customers-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Loyalty Pts</th><th>Orders</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${customers.map(c=>{
            const orders = Cart.getUserOrders(c.id);
            return `
            <tr>
              <td style="font-weight:800;font-family:var(--font-display)">${c.name}</td>
              <td style="font-size:.82rem">${c.email}</td>
              <td style="font-size:.82rem">${c.phone||'—'}</td>
              <td><span class="badge badge-${c.role==='admin'?'dark':'accent'}">${c.role}</span></td>
              <td style="font-weight:700;color:var(--brand)">⭐ ${(c.loyaltyPoints||0).toLocaleString()}</td>
              <td>${orders.length}</td>
              <td style="font-size:.78rem">${new Date(c.createdAt).toLocaleDateString('en-GB')}</td>
              <td>
                <div style="display:flex;gap:5px">
                  <button class="btn btn-ghost btn-sm" onclick="adminViewCustomer('${c.id}')">👁 View</button>
                  <button class="btn btn-ghost btn-sm" onclick="adminAddPoints('${c.id}')">⭐ Points</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminAnalytics() {
  const orders = Cart.getAllOrders().filter(o => o.status !== 'Cancelled');
  const revenue = orders.reduce((s,o)=>s+o.total,0);
  const catSales = {};
  orders.forEach(o => o.items.forEach(i => {
    const p = PRODUCTS.find(x=>x.id===i.productId);
    if (p) catSales[p.cat] = (catSales[p.cat]||0) + i.total;
  }));
  const topCats = Object.entries(catSales).sort((a,b)=>b[1]-a[1]).slice(0,8);

  return `
  <div class="admin-header">
    <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">📈 Analytics</h1>
  </div>
  <div class="stats-grid" style="margin-bottom:24px">
    ${[['Total Revenue',formatNaira(revenue),'💰'],
       ['Total Orders',orders.length,'📦'],
       ['Avg Order',formatNaira(orders.length ? revenue/orders.length : 0),'📊'],
       ['Customers',DB.get('users').filter(u=>u.role!=='admin').length,'👥']
    ].map(([l,v,i])=>`<div class="stat-card"><div style="font-size:1.8rem;margin-bottom:7px">${i}</div><div class="stat-val">${v}</div><div class="stat-lbl">${l}</div></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="table-wrap">
      <div class="table-hdr"><h3>Revenue by Category</h3></div>
      <div style="padding:14px">
        ${topCats.map(([cat,rev])=>{
          const pct = revenue > 0 ? Math.round(rev/revenue*100) : 0;
          const catInfo = CATEGORIES.find(c=>c.id===cat);
          return `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:.84rem">
              <span style="font-weight:700">${catInfo?.icon||''} ${catInfo?.label||cat}</span>
              <span style="font-weight:800;color:var(--brand)">${formatNaira(rev)}</span>
            </div>
            <div style="background:var(--bg-muted);border-radius:99px;height:6px">
              <div style="background:var(--brand);border-radius:99px;height:6px;width:${pct}%;transition:width .6s ease"></div>
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">${pct}% of revenue</div>
          </div>`;
        }).join('')}
        ${topCats.length === 0 ? '<p style="color:var(--text-muted);font-size:.86rem">No sales data yet.</p>' : ''}
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-hdr"><h3>Order Status Breakdown</h3></div>
      <div style="padding:14px">
        ${ORDER_STATUSES.map(s=>{
          const count = Cart.getAllOrders().filter(o=>o.status===s).length;
          const total = Cart.getAllOrders().length || 1;
          const pct = Math.round(count/total*100);
          return `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            ${UI.statusBadge(s)}
            <div style="flex:1;background:var(--bg-muted);border-radius:99px;height:5px">
              <div style="background:var(--brand);border-radius:99px;height:5px;width:${pct}%"></div>
            </div>
            <span style="font-weight:800;font-size:.82rem;min-width:24px;text-align:right">${count}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function adminSettings() {
  return `
  <div class="admin-header">
    <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:900">⚙️ Settings</h1>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="card">
      <div class="card-body">
        <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">📞 Business Info</div>
        <div class="form-group"><label class="form-label">Business Name</label><input class="form-input" value="C-Chu Media Limited"></div>
        <div class="form-group"><label class="form-label">WhatsApp Number</label><input class="form-input" value="${CONFIG.phone2}"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${CONFIG.email}"></div>
        <div class="form-group"><label class="form-label">Address</label><textarea class="form-textarea" rows="2">${CONFIG.address}</textarea></div>
        <button class="btn btn-primary btn-sm" onclick="UI.toast('Settings saved!','success')">Save</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">💰 Pricing Config</div>
        <div class="form-group"><label class="form-label">Loyalty Points Rate</label>
          <input class="form-input" value="2%" readonly style="opacity:.6">
          <div class="form-error" style="color:var(--text-muted)">2% of order value → 1pt = ₦1</div>
        </div>
        <div class="form-group"><label class="form-label">Abuja Delivery Fee</label><input class="form-input" value="₦2,000"></div>
        <div class="form-group"><label class="form-label">Nationwide Delivery Fee</label><input class="form-input" value="₦5,000"></div>
        <button class="btn btn-primary btn-sm" onclick="UI.toast('Settings saved!','success')">Save</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">🔐 Security</div>
        <div class="form-group"><label class="form-label">Admin Password</label><input class="form-input" type="password" placeholder="New admin password"></div>
        <button class="btn btn-outline btn-sm" onclick="UI.toast('Feature coming soon','info')">Update Password</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div style="font-family:var(--font-display);font-weight:800;margin-bottom:16px">🗄️ Data Management</div>
        <p style="font-size:.84rem;color:var(--text-muted);margin-bottom:14px">Export or reset site data.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" onclick="adminExportData()">⬇️ Export Orders</button>
          <button class="btn btn-danger btn-sm" onclick="adminResetData()">🗑 Reset All Data</button>
        </div>
      </div>
    </div>
  </div>`;
}

// Admin actions
function adminEditOrder(orderId) {
  const order = Cart.getOrder(orderId);
  if (!order) return;
  const box = document.getElementById('admin-order-detail-box');
  const panel = document.getElementById('admin-order-detail');
  if (!box || !panel) return;
  box.innerHTML = `
  <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:900">${order.orderNumber}</div>
      <div style="font-size:.8rem;color:var(--text-muted)">${new Date(order.createdAt).toLocaleString('en-GB')}</div>
    </div>
    <button onclick="document.getElementById('admin-order-detail').style.display='none'" style="background:var(--bg-muted);border:none;border-radius:var(--r-sm);width:32px;height:32px;cursor:pointer;font-size:1rem">×</button>
  </div>
  <div style="padding:20px 24px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
      <div><div style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">Customer</div>
        <div style="font-weight:700">${order.customerName||'Guest'}</div>
        <div style="font-size:.82rem;color:var(--text-muted)">${order.customerPhone||''}</div>
        <div style="font-size:.82rem;color:var(--text-muted)">${order.customerEmail||''}</div>
      </div>
      <div><div style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">Delivery</div>
        <div style="font-weight:700">${order.delivery?.method||'—'}</div>
        <div style="font-size:.82rem;color:var(--text-muted)">${order.delivery?.address||''}</div>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Items</div>
      ${order.items.map(i=>`
      <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-soft)">
        <div style="font-size:1.3rem">${i.icon}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.86rem">${i.name}</div>
          <div style="font-size:.76rem;color:var(--text-muted)">${i.qty}pcs · ${i.config.size} · ${i.config.material} · ${i.config.finishing} · ${i.config.turnaround}</div>
        </div>
        <div style="font-weight:900;font-family:var(--font-display);color:var(--brand)">${formatNaira(i.total)}</div>
      </div>`).join('')}
    </div>
    <div style="background:var(--bg-muted);border-radius:var(--r);padding:12px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:.86rem;margin-bottom:4px"><span>Subtotal</span><span>${formatNaira(order.subtotal)}</span></div>
      ${order.loyaltyDiscount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:.86rem;margin-bottom:4px;color:var(--green)"><span>Loyalty Discount</span><span>-${formatNaira(order.loyaltyDiscount)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;font-size:.86rem;margin-bottom:4px"><span>Delivery</span><span>${formatNaira(order.deliveryFee)}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:900;font-family:var(--font-display);color:var(--brand)"><span>Total</span><span>${formatNaira(order.total)}</span></div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Update Status</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <select id="admin-status-select" class="form-select" style="flex:1;min-width:180px">
          ${ORDER_STATUSES.map(s=>`<option value="${s}" ${s===order.status?'selected':''}>${s}</option>`).join('')}
        </select>
        <input id="admin-status-note" class="form-input" style="flex:1;min-width:160px" placeholder="Note (optional)">
        <button class="btn btn-primary btn-sm" onclick="adminUpdateStatus('${order.id}')">Update</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <a class="btn btn-wa btn-sm" href="${CONFIG.wa('Hi ' + (order.customerName||'') + ', regarding order ' + order.orderNumber)}" target="_blank">💬 WhatsApp Customer</a>
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('admin-order-detail').style.display='none'">Close</button>
    </div>
  </div>`;
  panel.style.display = 'flex';
}

function adminUpdateStatus(orderId) {
  const status = document.getElementById('admin-status-select')?.value;
  const note = document.getElementById('admin-status-note')?.value.trim();
  const { user } = Store.getState();
  if (!status) return;
  Cart.updateOrderStatus(orderId, status, note, user?.name || 'Admin');
  UI.toast('✅ Status updated to: ' + status, 'success');
  document.getElementById('admin-order-detail').style.display = 'none';
  UI.render();
}

function adminFilterOrders(search) {
  const statusFilter = document.getElementById('admin-status-filter')?.value || '';
  const rows = document.querySelectorAll('#admin-orders-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());
    const matchStatus = !statusFilter || text.includes(statusFilter.toLowerCase());
    row.style.display = matchSearch && matchStatus ? '' : 'none';
  });
}

function adminFilterProducts(search) {
  document.querySelectorAll('#admin-products-table tbody tr').forEach(row => {
    row.style.display = !search || row.textContent.toLowerCase().includes(search.toLowerCase()) ? '' : 'none';
  });
}

function adminFilterCustomers(search) {
  document.querySelectorAll('#admin-customers-table tbody tr').forEach(row => {
    row.style.display = !search || row.textContent.toLowerCase().includes(search.toLowerCase()) ? '' : 'none';
  });
}

function adminEditProduct(id) { UI.toast('Product editor coming in v2 — edit data.js to update products', 'info'); }
function adminViewCustomer(id) {
  const customer = DB.getOne('users', id);
  if (!customer) return;
  UI.toast(`${customer.name} · ${customer.email} · ${customer.loyaltyPoints||0} pts · ${Cart.getUserOrders(id).length} orders`, 'info', 5000);
}
function adminAddPoints(customerId) {
  const pts = prompt('Add loyalty points to this customer:');
  if (!pts || isNaN(pts)) return;
  Auth.addLoyaltyPoints(customerId, parseInt(pts));
  UI.toast(`✅ Added ${pts} points!`, 'success');
  UI.render();
}
function adminExportData() {
  const data = { orders: Cart.getAllOrders(), customers: DB.get('users').map(u=>({...u,password:'[hidden]'})) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'printhub-export.json'; a.click();
  UI.toast('📥 Data exported!', 'success');
}
function adminResetData() {
  if (!confirm('⚠️ This will delete ALL orders and customer data (except admin). Are you sure?')) return;
  DB.clear('orders'); DB.clear('users'); DB.setVal('seeded', false);
  UI.toast('Data reset. Reload the page.', 'info');
  setTimeout(() => location.reload(), 1500);
}
