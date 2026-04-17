/* ================================================================
   PRINTHUB — pages/product.js
   ================================================================ */
Pages.Product = (state) => {
  const { params } = state.route;
  const product = PRODUCTS.find(p => p.id === params?.id);
  if (!product) return `<div class="container page-wrap"><p>Product not found. <button class="btn btn-primary btn-sm" onclick="Store.navigate('shop')">Browse Products</button></p></div>`;
  const cat = CATEGORIES.find(c => c.id === product.cat);
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);

  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb">
        <span onclick="Store.navigate('home')">Home</span><span class="sep">›</span>
        <span onclick="Store.navigate('shop',{cat:'${product.cat}'})">${cat?.label || product.cat}</span><span class="sep">›</span>
        <span class="current">${product.name}</span>
      </div>
    </div>
  </div>
  <div class="container page-wrap" style="padding-top:28px">
    <div class="product-page-grid">
      <!-- IMAGE -->
      <div class="product-image-area">
        <div class="product-main-img" id="prod-main-img">${product.icon}</div>
        <div class="product-thumbs">
          ${[product.icon, product.icon, product.icon].map((ic,i) => `
          <div class="product-thumb ${i===0?'active':''}" onclick="document.getElementById('prod-main-img').textContent='${ic}';this.closest('.product-thumbs').querySelectorAll('.product-thumb').forEach(t=>t.classList.remove('active'));this.classList.add('active')">${ic}</div>`).join('')}
        </div>
        <!-- TRUST BADGES -->
        <div class="card" style="margin-top:14px">
          <div class="card-body" style="padding:14px">
            ${[['✅','Free Design Review','Expert preflight check on every file'],['📦','Abuja Same-Day Delivery','For orders before 2PM'],['⚡','Rush 24hr','Express production available'],['🔄','Free Reprint','If it doesn\'t match your proof']].map(b=>`
            <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border-soft)">
              <span style="font-size:1.1rem">${b[0]}</span>
              <div><div style="font-weight:700;font-size:.82rem;font-family:var(--font-display)">${b[1]}</div><div style="font-size:.76rem;color:var(--text-muted)">${b[2]}</div></div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- INFO + CONFIGURATOR -->
      <div class="product-info-area">
        <div class="product-badges-row">
          ${product.badge ? `<span class="badge badge-${product.badge==='Bestseller'?'brand':product.badge==='Premium'?'dark':product.badge==='Sale'?'sale':'accent'}">${product.badge}</span>` : ''}
          ${product.origPrice ? `<span class="badge badge-sale">Save ${Math.round((1-product.basePrice/product.origPrice)*100)}%</span>` : ''}
        </div>
        <h1 class="product-title">${product.name}</h1>
        <div class="product-rating-row">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}</span>
          <span style="font-size:.86rem;color:var(--text-muted)">${product.rating} (${product.reviews.toLocaleString()} reviews)</span>
          <span class="badge badge-green">In Stock</span>
        </div>
        <div class="product-price-row">
          <span class="product-price-main">${formatNaira(product.basePrice)}</span>
          ${product.origPrice ? `<span class="product-price-orig">${formatNaira(product.origPrice)}</span>` : ''}
          <span style="font-size:.82rem;color:var(--text-muted)">from (per unit/piece)</span>
        </div>
        <p class="product-desc">${product.desc}</p>

        <!-- INLINE CONFIGURATOR -->
        <div class="card" style="margin-bottom:18px">
          <div class="card-body">
            <div class="cfg-sec">
              <div class="cfg-lbl">Size / Format</div>
              <div class="cfg-chips" id="prod-size">
                ${Object.keys(SIZES).map(s=>`<div class="cfg-chip ${s==='A4'?'on':''}" onclick="prodSelectCfg(this,'size','${s}')">${s}</div>`).join('')}
              </div>
            </div>
            <div class="cfg-sec">
              <div class="cfg-lbl">Paper / Material</div>
              <div class="cfg-chips" id="prod-material">
                ${Object.keys(MATERIALS).map(m=>`<div class="cfg-chip ${m==='Glossy'?'on':''}" onclick="prodSelectCfg(this,'material','${m}')">${m}</div>`).join('')}
              </div>
            </div>
            <div class="cfg-sec">
              <div class="cfg-lbl">Finishing</div>
              <div class="cfg-chips" id="prod-finishing">
                ${Object.keys(FINISHING).map(f=>`<div class="cfg-chip ${f==='None'?'on':''}" onclick="prodSelectCfg(this,'finishing','${f}')">${f}</div>`).join('')}
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
              <div>
                <div class="cfg-lbl">Quantity</div>
                <input type="number" id="prod-qty" class="form-input" value="100" min="1" step="10" oninput="prodCalcPrice()">
                <div class="qty-shortcuts">${[50,100,250,500,1000].map(n=>`<span class="qs" onclick="document.getElementById('prod-qty').value=${n};prodCalcPrice()">${n.toLocaleString()}</span>`).join('')}</div>
              </div>
              <div>
                <div class="cfg-lbl">Turnaround</div>
                <select id="prod-turnaround" class="form-select" onchange="prodCalcPrice()">
                  ${Object.keys(TURNAROUND).map(t=>`<option value="${t}">${t}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="price-display">
              <div>
                <div style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);margin-bottom:3px;font-family:var(--font-display)">Estimated Total</div>
                <div class="p-total" id="prod-total">${formatNaira(product.basePrice * 100 * 0.95)}</div>
              </div>
              <div class="p-breakdown">
                <div class="p-unit" id="prod-unit">${formatNaira(product.basePrice * 0.95)}/unit</div>
                <div class="p-save" id="prod-save">✓ 5% bulk discount</div>
                <div style="font-size:.68rem;color:var(--text-muted);margin-top:2px">Live calculation</div>
              </div>
            </div>
          </div>
        </div>

        <!-- UPLOAD -->
        <div class="card" style="margin-bottom:18px">
          <div class="card-body">
            <div class="cfg-lbl">Upload Artwork <span style="font-weight:400;text-transform:none;font-size:.78rem;color:var(--text-muted)">(optional)</span></div>
            <div class="upload-zone" onclick="document.getElementById('prod-file').click()">
              <div style="font-size:1.4rem;margin-bottom:5px">📎</div>
              <div style="font-size:.82rem;color:var(--text-muted)">Drop file or <strong style="color:var(--brand)">click to upload</strong></div>
              <div style="font-size:.72rem;color:var(--text-muted);margin-top:3px">PDF, AI, PSD, PNG, JPG · Max 50MB</div>
            </div>
            <input type="file" id="prod-file" style="display:none" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" onchange="UI.handleFileUpload(this)">
            <div id="pm-file-preview"></div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div style="display:flex;gap:10px;margin-bottom:18px">
          <button class="btn btn-primary btn-xl" style="flex:1;justify-content:center" onclick="prodAddToCart('${product.id}')">
            🛒 Add to Cart — <span id="prod-atc-price">${formatNaira(product.basePrice * 100 * 0.95)}</span>
          </button>
          <button class="btn btn-wa btn-xl" style="padding:14px 18px" onclick="prodBuyNow('${product.id}')">💬</button>
          <button class="btn btn-accent btn-xl" style="padding:14px 18px" onclick="Store.navigate('design-tool',{productId:'${product.id}'})">🎨</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:24px">
          <button class="btn btn-ghost btn-sm" onclick="UI.toggleWishlist('${product.id}',this)">♡ Wishlist</button>
          <button class="btn btn-ghost btn-sm" onclick="UI.openModal('quote-modal')">💬 Request Quote</button>
          <a class="btn btn-ghost btn-sm" href="${CONFIG.wa('Hi! I want to order: ' + product.name)}" target="_blank">📞 Call to Order</a>
        </div>

        <!-- NOTES -->
        <div class="card">
          <div class="card-body">
            <div class="cfg-lbl">Special Instructions</div>
            <textarea id="prod-notes" class="form-textarea" placeholder="Pantone colours, exact dimensions, special notes..."></textarea>
          </div>
        </div>
      </div>
    </div>

    ${related.length ? `
    <div style="margin-top:40px">
      <div class="sec-head">
        <div><div class="sec-title">You May Also Like<span class="dot"></span></div></div>
        <span class="see-all" onclick="Store.navigate('shop',{cat:'${product.cat}'})">See all →</span>
      </div>
      <div class="product-grid">
        ${related.map(p => UI.productCard(p)).join('')}
      </div>
    </div>` : ''}
  </div>`;
};

// Product page state
let _prodCfg = { size:'A4', material:'Glossy', finishing:'None', turnaround:'Standard (5–7 days)' };

window.pageInits = window.pageInits || {};
window.pageInits.product = (state) => {
  _prodCfg = { size:'A4', material:'Glossy', finishing:'None', turnaround:'Standard (5–7 days)' };
  prodCalcPrice();
};

function prodSelectCfg(el, type, val) {
  el.closest('.cfg-chips').querySelectorAll('.cfg-chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  _prodCfg[type] = val;
  prodCalcPrice();
}

function prodCalcPrice() {
  const state = Store.getState();
  const product = PRODUCTS.find(p => p.id === state.route.params?.id);
  if (!product) return;
  const qty = parseInt(document.getElementById('prod-qty')?.value) || 1;
  const ta = document.getElementById('prod-turnaround')?.value || 'Standard (5–7 days)';
  _prodCfg.turnaround = ta;
  const { unit, total, discount } = calcProductPrice(product.basePrice, _prodCfg.size, _prodCfg.material, _prodCfg.finishing, ta, qty);
  const t = document.getElementById('prod-total'); if (t) t.textContent = formatNaira(total);
  const u = document.getElementById('prod-unit'); if (u) u.textContent = formatNaira(unit) + '/unit';
  const s = document.getElementById('prod-save');
  if (s) { if (discount > 0) { s.textContent = `✓ ${(discount*100).toFixed(0)}% bulk discount`; s.style.display = 'block'; } else s.style.display = 'none'; }
  const a = document.getElementById('prod-atc-price'); if (a) a.textContent = formatNaira(total);
}

function prodAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId); if (!product) return;
  const qty = parseInt(document.getElementById('prod-qty')?.value) || 1;
  const notes = document.getElementById('prod-notes')?.value || '';
  Cart.addItem(product, { ..._prodCfg, notes }, qty, null);
  UI.updateCartBadge();
}

function prodBuyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId); if (!product) return;
  const qty = parseInt(document.getElementById('prod-qty')?.value) || 1;
  const msg = `Hi! I want to order:\n\n${product.name}\nQty: ${qty}\nSize: ${_prodCfg.size} · Material: ${_prodCfg.material} · Finishing: ${_prodCfg.finishing}\nTurnaround: ${_prodCfg.turnaround}\n\nTotal: ${document.getElementById('prod-total')?.textContent || ''}`;
  window.open(CONFIG.wa(msg), '_blank');
}
