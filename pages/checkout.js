/* ================================================================
   PRINTHUB — pages/checkout.js
   Multi-step: Cart Review → Delivery → Payment → Confirmation
   ================================================================ */
Pages.Checkout = (state) => {
  const items = Cart.getCart();
  const { user } = state;
  if (!items.length) return `
    <div class="container page-wrap" style="text-align:center">
      <div style="font-size:4rem;margin-bottom:14px">🛒</div>
      <h2 style="font-family:var(--font-display);font-size:1.6rem;font-weight:900;margin-bottom:8px">Your cart is empty</h2>
      <p style="color:var(--text-muted);margin-bottom:22px">Add some products before checking out.</p>
      <button class="btn btn-primary btn-lg" onclick="Store.navigate('shop')">Browse Products</button>
    </div>`;

  const subtotal = Cart.getCartTotal();
  const loyaltyPts = user?.loyaltyPoints || 0;
  const maxLoyaltyDiscount = Math.min(loyaltyPts, subtotal);

  return `
  <div class="page-hero">
    <div class="container">
      <div class="breadcrumb">
        <span onclick="Store.navigate('home')">Home</span><span class="sep">›</span>
        <span onclick="UI.toggleCart()">Cart</span><span class="sep">›</span>
        <span class="current">Checkout</span>
      </div>
      <h1 style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;margin-top:8px">Checkout</h1>
    </div>
  </div>
  <div class="container page-wrap" style="padding-top:24px">
    <div class="checkout-grid">
      <!-- LEFT: FORMS -->
      <div>
        <!-- STEP 1: CONTACT INFO -->
        <div class="checkout-section">
          <h3>👤 Contact Information</h3>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Full Name *</label>
              <input id="co-name" class="form-input" placeholder="Your full name" value="${user?.name || ''}"></div>
            <div class="form-group"><label class="form-label">Phone *</label>
              <input id="co-phone" class="form-input" type="tel" placeholder="+234 XXX XXX XXXX" value="${user?.phone || ''}"></div>
          </div>
          <div class="form-group"><label class="form-label">Email Address</label>
            <input id="co-email" class="form-input" type="email" placeholder="your@email.com" value="${user?.email || ''}"></div>
          ${!user ? `<p style="font-size:.8rem;color:var(--text-muted);margin-top:4px">
            <a onclick="UI.openModal('auth-modal')" style="color:var(--brand);cursor:pointer;font-weight:700">Login or create an account</a> to earn loyalty points and track your order.</p>` : ''}
        </div>

        <!-- STEP 2: DELIVERY -->
        <div class="checkout-section">
          <h3>🚚 Delivery Method</h3>
          <div class="delivery-method selected" id="del-pickup" onclick="coSelectDelivery('pickup',0,this)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:800;font-family:var(--font-display);font-size:.92rem">🏪 Pickup at Karu, Abuja</div>
                <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">Suite 38, Mazfallah Complex · Ready same day (orders before 2PM)</div>
              </div>
              <div style="font-family:var(--font-display);font-weight:900;color:var(--green);font-size:.92rem">FREE</div>
            </div>
          </div>
          <div class="delivery-method" id="del-abuja" onclick="coSelectDelivery('abuja',2000,this)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:800;font-family:var(--font-display);font-size:.92rem">🚗 Abuja Delivery</div>
                <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">Delivered within Abuja FCT · 1–2 business days</div>
              </div>
              <div style="font-family:var(--font-display);font-weight:900;color:var(--brand);font-size:.92rem">₦2,000</div>
            </div>
          </div>
          <div class="delivery-method" id="del-nationwide" onclick="coSelectDelivery('nationwide',5000,this)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:800;font-family:var(--font-display);font-size:.92rem">📦 Nationwide Courier</div>
                <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">GIG Logistics / DHL · 2–5 business days nationwide</div>
              </div>
              <div style="font-family:var(--font-display);font-weight:900;color:var(--brand);font-size:.92rem">₦5,000</div>
            </div>
          </div>
          <div id="del-address-wrap" style="display:none;margin-top:12px">
            <div class="form-group"><label class="form-label">Delivery Address *</label>
              <textarea id="co-address" class="form-textarea" rows="2" placeholder="Street address, LGA, State"></textarea></div>
          </div>
        </div>

        <!-- STEP 3: PAYMENT -->
        <div class="checkout-section">
          <h3>💳 Payment Method</h3>
          ${[
            ['paystack','💳 Paystack (Card / USSD / Bank Transfer)','Secure online payment · Instant confirmation'],
            ['transfer','🏦 Bank Transfer','Transfer to our GTBank account · Send receipt via WhatsApp'],
            ['cash','💵 Cash on Pickup','Pay cash when you collect at our Karu office'],
            ['whatsapp','💬 WhatsApp Order','Complete your order via WhatsApp chat'],
          ].map(([v,label,sub],i) => `
          <div class="payment-method ${i===0?'selected':''}" id="pm-${v}" onclick="coSelectPayment('${v}',this)">
            <div>
              <div style="font-weight:800;font-family:var(--font-display);font-size:.88rem">${label}</div>
              <div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">${sub}</div>
            </div>
          </div>`).join('')}

          <div id="bank-details" style="display:none;background:var(--bg-muted);border-radius:var(--r);padding:14px;margin-top:10px;font-size:.86rem">
            <div style="font-weight:800;font-family:var(--font-display);margin-bottom:8px">Bank Transfer Details</div>
            <div style="display:grid;gap:4px">
              <div><strong>Bank:</strong> GTBank</div>
              <div><strong>Account Name:</strong> C-Chu Media Limited</div>
              <div><strong>Account Number:</strong> 0123456789</div>
              <div style="color:var(--text-muted);margin-top:6px;font-size:.8rem">After transfer, send proof to WhatsApp: ${CONFIG.phone2}</div>
            </div>
          </div>
        </div>

        <!-- LOYALTY POINTS -->
        ${loyaltyPts > 0 ? `
        <div class="checkout-section">
          <h3>⭐ Loyalty Points</h3>
          <div class="loyalty-box">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div>
                <div style="font-weight:800;font-family:var(--font-display)">You have ${loyaltyPts.toLocaleString()} points</div>
                <div style="font-size:.8rem;color:var(--text-muted)">1 point = ₦1 discount · Max: ${formatNaira(maxLoyaltyDiscount)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;color:var(--brand)">₦${loyaltyPts.toLocaleString()}</div>
                <div style="font-size:.72rem;color:var(--text-muted)">available</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <input id="co-loyalty" type="number" class="form-input" style="max-width:140px" placeholder="Points to use" max="${loyaltyPts}" min="0" oninput="coUpdateTotals()">
              <button class="btn btn-outline btn-sm" onclick="document.getElementById('co-loyalty').value=${loyaltyPts};coUpdateTotals()">Use All</button>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('co-loyalty').value=0;coUpdateTotals()">Clear</button>
            </div>
          </div>
        </div>` : ''}

        <!-- NOTES -->
        <div class="checkout-section">
          <h3>📝 Order Notes</h3>
          <textarea id="co-notes" class="form-textarea" placeholder="Special instructions, reference numbers, or any notes for our team..."></textarea>
        </div>

        <!-- PLACE ORDER -->
        <div id="co-error" class="form-error" style="display:none;margin-bottom:12px;padding:10px 14px;background:rgba(212,43,43,.07);border-radius:var(--r)"></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary btn-xl" style="flex:1;justify-content:center" onclick="coPlaceOrder()">
            🎉 Place Order — <span id="co-place-btn-total">${formatNaira(subtotal)}</span>
          </button>
          <a class="btn btn-wa btn-xl" style="padding:14px 16px" onclick="coWhatsAppOrder()">💬</a>
        </div>
        <p style="font-size:.76rem;color:var(--text-muted);margin-top:10px;text-align:center">
          🔒 Your order is secure. By placing an order you agree to our terms & conditions.
        </p>
      </div>

      <!-- RIGHT: ORDER SUMMARY -->
      <div>
        <div class="order-summary">
          <h3>📋 Order Summary</h3>
          ${items.map(item => `
          <div class="summary-item">
            <div class="summary-item-img">${item.icon}</div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:.84rem;font-family:var(--font-display)">${item.name}</div>
              <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">${item.config.size} · ${item.config.material} · ${item.config.finishing}</div>
              <div style="font-size:.75rem;color:var(--text-muted)">Qty: ${item.qty} · ${item.config.turnaround}</div>
              ${item.discount > 0 ? `<div style="font-size:.72rem;color:var(--green);margin-top:1px">✓ ${(item.discount*100).toFixed(0)}% bulk discount applied</div>` : ''}
            </div>
            <div style="font-weight:900;font-family:var(--font-display);font-size:.88rem;color:var(--brand);white-space:nowrap">${formatNaira(item.total)}</div>
          </div>`).join('')}
          
          <div class="summary-totals">
            <div class="summary-row"><span>Subtotal</span><span>${formatNaira(subtotal)}</span></div>
            <div class="summary-row" id="loyalty-discount-row" style="color:var(--green);display:none"><span>⭐ Loyalty Discount</span><span id="loyalty-discount-amt">-₦0</span></div>
            <div class="summary-row"><span>Delivery</span><span id="co-delivery-fee-display">FREE</span></div>
            <div class="summary-row total"><span>Total</span><span id="co-order-total">${formatNaira(subtotal)}</span></div>
          </div>

          ${user ? `
          <div style="margin-top:14px;padding:11px;background:var(--green-soft);border-radius:var(--r);font-size:.8rem">
            <strong>⭐ Loyalty Earn:</strong> You'll earn ~${Math.round(subtotal * CONFIG.loyaltyRate)} points on this order when delivered.
          </div>` : ''}

          <div style="margin-top:14px;padding:10px;background:var(--bg-muted);border-radius:var(--r);font-size:.78rem;color:var(--text-muted)">
            <strong>Need help?</strong> Call <a href="tel:${CONFIG.phone1}" style="color:var(--brand)">${CONFIG.phone1}</a> or <a href="${CONFIG.wa('Hi, I need help with my order')}" target="_blank" style="color:var(--brand)">WhatsApp us</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

// Checkout state
let _coDelivery = { method:'pickup', fee:0 };
let _coPayment = 'paystack';

function coSelectDelivery(method, fee, el) {
  _coDelivery = { method, fee };
  document.querySelectorAll('.delivery-method').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  const addrWrap = document.getElementById('del-address-wrap');
  if (addrWrap) addrWrap.style.display = method !== 'pickup' ? 'block' : 'none';
  const bankDetails = document.getElementById('bank-details');
  if (bankDetails) bankDetails.style.display = 'none';
  coUpdateTotals();
}

function coSelectPayment(method, el) {
  _coPayment = method;
  document.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  const bankDetails = document.getElementById('bank-details');
  if (bankDetails) bankDetails.style.display = method === 'transfer' ? 'block' : 'none';
}

function coUpdateTotals() {
  const subtotal = Cart.getCartTotal();
  const loyaltyInput = document.getElementById('co-loyalty');
  const loyaltyPts = loyaltyInput ? Math.min(parseInt(loyaltyInput.value)||0, parseInt(loyaltyInput.max)||0) : 0;
  const loyaltyDisc = Math.min(loyaltyPts, subtotal);
  const total = subtotal - loyaltyDisc + _coDelivery.fee;

  const totEl = document.getElementById('co-order-total');
  if (totEl) totEl.textContent = formatNaira(total);
  const btnTot = document.getElementById('co-place-btn-total');
  if (btnTot) btnTot.textContent = formatNaira(total);
  const delivEl = document.getElementById('co-delivery-fee-display');
  if (delivEl) delivEl.textContent = _coDelivery.fee > 0 ? formatNaira(_coDelivery.fee) : 'FREE';
  const loyRow = document.getElementById('loyalty-discount-row');
  if (loyRow) loyRow.style.display = loyaltyDisc > 0 ? 'flex' : 'none';
  const loyAmt = document.getElementById('loyalty-discount-amt');
  if (loyAmt) loyAmt.textContent = '-' + formatNaira(loyaltyDisc);
}

function coPlaceOrder() {
  const name = document.getElementById('co-name')?.value.trim();
  const phone = document.getElementById('co-phone')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();
  const notes = document.getElementById('co-notes')?.value.trim();
  const loyaltyInput = document.getElementById('co-loyalty');
  const loyaltyUsed = loyaltyInput ? parseInt(loyaltyInput.value)||0 : 0;
  const errEl = document.getElementById('co-error');

  if (!name || !phone) {
    errEl.textContent = '⚠️ Please fill in your name and phone number.';
    errEl.style.display = 'block'; return;
  }
  errEl.style.display = 'none';

  const { user } = Store.getState();
  const deliveryAddr = document.getElementById('co-address')?.value || '';

  if (_coPayment === 'whatsapp') { coWhatsAppOrder(); return; }

  const result = Cart.placeOrder({
    user,
    delivery: { method: _coDelivery.method, fee: _coDelivery.fee, name, phone, email, address: deliveryAddr },
    payment: { method: _coPayment },
    loyaltyPointsUsed: loyaltyUsed,
    notes,
  });

  if (result.error) { errEl.textContent = '⚠️ ' + result.error; errEl.style.display = 'block'; return; }

  if (_coPayment === 'transfer') {
    const msg = Cart.buildWhatsAppMessage(result.order);
    window.open(CONFIG.wa(msg), '_blank');
  }

  Store.navigate('checkout-success', { orderId: result.order.id, orderNumber: result.order.orderNumber });
  UI.render();
}

function coWhatsAppOrder() {
  const items = Cart.getCart();
  if (!items.length) { UI.toast('Cart is empty', 'error'); return; }
  const name = document.getElementById('co-name')?.value.trim() || 'Customer';
  const lines = items.map(i => `• ${i.name} (${i.qty}pcs, ${i.config.size}, ${i.config.material}) — ${formatNaira(i.total)}`).join('\n');
  const total = formatNaira(Cart.getCartTotal() + _coDelivery.fee);
  const msg = `Hi PrintHub! 🖨️\n\nOrder from: ${name}\n\n${lines}\n\nDelivery: ${_coDelivery.method}\nPayment: ${_coPayment}\nTotal: ${total}\n\nPlease confirm & send payment details.`;
  window.open(CONFIG.wa(msg), '_blank');
}

// Checkout success page (handles route checkout-success)
Pages['checkout-success'] = (state) => {
  const { params } = state.route;
  const order = params?.orderId ? Cart.getOrder(params.orderId) : null;
  return `
  <div class="container page-wrap" style="max-width:600px;text-align:center">
    <div style="font-size:4rem;margin-bottom:16px">🎉</div>
    <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:900;margin-bottom:8px">Order Placed!</h1>
    <p style="color:var(--text-muted);font-size:1rem;margin-bottom:6px">Thank you for your order. We'll review your files and be in touch shortly.</p>
    ${order ? `<div style="background:var(--brand-light);border:2px solid var(--brand);border-radius:var(--r-lg);padding:16px 22px;margin:20px 0;display:inline-block">
      <div style="font-size:.76rem;color:var(--text-muted);margin-bottom:3px">ORDER NUMBER</div>
      <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:900;color:var(--brand)">${order.orderNumber}</div>
    </div>` : ''}
    <p style="font-size:.86rem;color:var(--text-muted);margin-bottom:24px">Save your order number to track your order status. We'll also contact you on WhatsApp.</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary btn-lg" onclick="Store.navigate('account',{tab:'orders'})">📦 Track My Order</button>
      <button class="btn btn-ghost btn-lg" onclick="Store.navigate('shop')">Continue Shopping</button>
      <a class="btn btn-wa btn-lg" href="${CONFIG.wa('Hi! I just placed order ' + (order?.orderNumber||''))}" target="_blank">💬 WhatsApp Support</a>
    </div>
  </div>`;
};
