/* ================================================================
   PRINTHUB — pages/shop.js
   ================================================================ */
Pages.Shop = (state) => {
  const { params } = state.route;
  const cat = params?.cat || 'all';
  const sort = params?.sort || 'popular';
  const search = params?.search || '';

  let products = cat === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === cat);
  if (search) products = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === 'low') products.sort((a,b) => a.basePrice - b.basePrice);
  else if (sort === 'high') products.sort((a,b) => b.basePrice - a.basePrice);
  else products.sort((a,b) => b.reviews - a.reviews);

  const catLabel = CATEGORIES.find(c => c.id === cat)?.label || 'All Products';

  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb">
        <span onclick="Store.navigate('home')">Home</span><span class="sep">›</span>
        <span class="current">${search ? `Search: "${search}"` : catLabel}</span>
      </div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-top:6px">
        <div>
          <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;letter-spacing:-.5px">${search ? `Results for "${search}"` : catLabel}</h1>
          <p style="color:var(--text-muted);font-size:.86rem;margin-top:3px">${products.length} product${products.length!==1?'s':''} found</p>
        </div>
        <select class="form-select" style="width:auto;min-width:200px" onchange="Store.navigate('shop',{cat:'${cat}',sort:this.value})">
          <option value="popular" ${sort==='popular'?'selected':''}>Sort: Most Popular</option>
          <option value="low" ${sort==='low'?'selected':''}>Price: Low to High</option>
          <option value="high" ${sort==='high'?'selected':''}>Price: High to Low</option>
        </select>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="main-layout">
      <!-- SIDEBAR -->
      <aside class="left-sidebar">
        <div class="widget">
          <div class="widget-hdr">🗂 Categories</div>
          <div class="widget-body">
            ${CATEGORIES.map(c=>`<div class="w-item ${c.id===cat?'active':''}" onclick="Store.navigate('shop',{cat:'${c.id}'})"><label>${c.icon} ${c.label}</label><span class="w-count">${c.count}</span></div>`).join('')}
          </div>
        </div>
        <div class="widget">
          <div class="widget-hdr">💰 Price Range</div>
          <div class="price-range-wrap">
            <div class="price-inputs">
              <input class="price-in" id="sp-min" type="number" value="3000" placeholder="Min ₦">
              <input class="price-in" id="sp-max" type="number" value="200000" placeholder="Max ₦">
            </div>
            <input type="range" class="range-sl" min="3000" max="200000" value="200000" oninput="document.getElementById('sp-max').value=this.value">
            <button class="btn btn-ghost btn-sm btn-full" style="margin-top:9px" onclick="shopFilterByPrice()">Apply Filter</button>
          </div>
        </div>
        <div class="widget">
          <div class="widget-hdr">🔽 Sort By</div>
          <div class="widget-body">
            <div class="w-item" onclick="Store.navigate('shop',{cat:'${cat}',sort:'popular'})"><label>Most Popular</label>↓</div>
            <div class="w-item" onclick="Store.navigate('shop',{cat:'${cat}',sort:'low'})"><label>Price: Low to High</label></div>
            <div class="w-item" onclick="Store.navigate('shop',{cat:'${cat}',sort:'high'})"><label>Price: High to Low</label></div>
          </div>
        </div>
        <div class="sidebar-cta">
          <div class="sc-icon">⚡</div>
          <div class="sc-title">Custom Print?</div>
          <div class="sc-sub">Get a quote in under 2 hours</div>
          <button class="btn btn-white btn-sm btn-full" onclick="UI.openModal('quote-modal')">Free Quote</button>
        </div>
      </aside>
      <!-- PRODUCTS -->
      <main class="w-screen">
        <div class="cat-chips w-95 md:w-full overflow-hidden">
          ${CATEGORIES.slice(0,10).map(c=>`<div class="chip ${c.id===cat?'on':''}" onclick="Store.navigate('shop',{cat:'${c.id}'})">${c.icon} ${c.id==='all'?'All':c.label.split(' ')[0]}</div>`).join('')}
        </div>
        <div class="w-95 md:w-4/5 overflow-hidden">
          ${products.length ? `<div class="product-grid" id="shop-grid">${products.map(p=>UI.productCard(p)).join('')}</div>` : `
          <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
            <div style="font-size:3rem;margin-bottom:11px">🔍</div>
            <div style="font-size:1rem;font-weight:700;margin-bottom:7px">No products found</div>
            <p style="font-size:.86rem">Try a different category or <button class="btn btn-primary btn-sm" onclick="Store.navigate('shop')">browse all</button></p>
          </div>`}
        </div>
      </main>
    </div>
  </div>`;
};

function shopFilterByPrice() {
  const min = parseInt(document.getElementById('sp-min')?.value) || 0;
  const max = parseInt(document.getElementById('sp-max')?.value) || 999999;
  const grid = document.getElementById('shop-grid'); if (!grid) return;
  grid.querySelectorAll('.pcard').forEach(card => {
    const priceEl = card.querySelector('.price-main'); if (!priceEl) return;
    const price = parseInt(priceEl.textContent.replace(/[₦,]/g,''));
    card.style.display = (price >= min && price <= max) ? '' : 'none';
  });
}
