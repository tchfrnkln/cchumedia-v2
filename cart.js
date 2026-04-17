/* ================================================================
   PRINTHUB — cart.js  ·  Cart, Orders & Checkout
   ================================================================ */

const Cart = (() => {

  // ── CART OPERATIONS ───────────────────────────────────────
  function getCart() {
    const { user } = Store.getState();
    if (user) return DB.getVal('cart_' + user.id, []);
    return DB.getVal('cart_guest', []);
  }

  function saveCart(items) {
    const { user } = Store.getState();
    if (user) DB.setVal('cart_' + user.id, items);
    else DB.setVal('cart_guest', items);
    Store.setState({ cart: items });
  }

  function addItem(product, config, qty, designData) {
    const { unit, total, discount } = calcProductPrice(
      product.basePrice, config.size, config.material, config.finishing, config.turnaround, qty
    );
    const items = getCart();
    items.push({
      cartId: DB.uid(),
      productId: product.id,
      name: product.name,
      icon: product.icon,
      qty,
      unitPrice: unit,
      total,
      discount,
      config: { ...config },
      designData: designData || null,
      addedAt: Date.now(),
    });
    saveCart(items);
    UI.toast(`🛒 ${product.name} added to cart!`, 'success');
    return items;
  }

  function removeItem(cartId) {
    saveCart(getCart().filter(i => i.cartId !== cartId));
    UI.toast('Item removed', 'info');
  }

  function updateQty(cartId, newQty) {
    if (newQty < 1) { removeItem(cartId); return; }
    const items = getCart().map(i => {
      if (i.cartId !== cartId) return i;
      const product = PRODUCTS.find(p => p.id === i.productId);
      if (!product) return i;
      const { unit, total, discount } = calcProductPrice(
        product.basePrice, i.config.size, i.config.material, i.config.finishing, i.config.turnaround, newQty
      );
      return { ...i, qty: newQty, unitPrice: unit, total, discount };
    });
    saveCart(items);
  }

  function clearCart() { saveCart([]); }

  function getCartTotal() { return getCart().reduce((s, i) => s + i.total, 0); }
  function getCartCount() { return getCart().length; }

  // Apply loyalty points discount
  function applyLoyaltyDiscount(points) {
    // 1 point = ₦1 discount
    return Math.min(points, getCartTotal());
  }

  // ── ORDER OPERATIONS ───────────────────────────────────────
  function placeOrder({ user, delivery, payment, loyaltyPointsUsed, coupon, notes }) {
    const items = getCart();
    if (!items.length) return { error: 'Cart is empty' };

    const subtotal = getCartTotal();
    const loyaltyDiscount = loyaltyPointsUsed ? applyLoyaltyDiscount(loyaltyPointsUsed) : 0;
    const deliveryFee = delivery.method === 'pickup' ? 0 : delivery.method === 'abuja' ? 2000 : 5000;
    const total = subtotal - loyaltyDiscount + deliveryFee;

    const orderNum = 'PH-' + Date.now().toString(36).toUpperCase();

    const order = DB.insert('orders', {
      id: DB.uid(),
      orderNumber: orderNum,
      userId: user?.id || 'guest',
      customerName: user?.name || delivery.name,
      customerEmail: user?.email || delivery.email,
      customerPhone: user?.phone || delivery.phone,
      items: [...items],
      subtotal,
      loyaltyDiscount,
      deliveryFee,
      total,
      delivery,
      payment: { ...payment, status: 'Pending' },
      status: 'Pending Payment',
      notes: notes || '',
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      loyaltyPointsEarned: Math.round(total * CONFIG.loyaltyRate),
      statusHistory: [{ status: 'Pending Payment', at: Date.now(), by: 'System' }],
      createdAt: Date.now(),
    });

    // Deduct loyalty points used
    if (user && loyaltyPointsUsed > 0) {
      Auth.redeemPoints(user.id, loyaltyPointsUsed);
    }

    clearCart();
    return { order };
  }

  function getUserOrders(uid) {
    return DB.query('orders', o => o.userId === uid).sort((a,b) => b.createdAt - a.createdAt);
  }

  function getOrder(id) { return DB.getOne('orders', id); }
  function getOrderByNumber(num) { return DB.query('orders', o => o.orderNumber === num)[0] || null; }

  function getAllOrders() { return DB.get('orders').sort((a,b) => b.createdAt - a.createdAt); }

  function updateOrderStatus(orderId, status, note, adminId) {
    const order = DB.getOne('orders', orderId);
    if (!order) return null;
    const history = [...(order.statusHistory || []), { status, at: Date.now(), by: adminId || 'Admin', note: note || '' }];
    const updated = DB.update('orders', orderId, { status, statusHistory: history });

    // Award loyalty points when delivered
    if (status === 'Delivered' && order.userId !== 'guest') {
      const pts = order.loyaltyPointsEarned || 0;
      if (pts > 0) Auth.addLoyaltyPoints(order.userId, pts);
    }

    return updated;
  }

  // Merge guest cart on login
  function mergeGuestCart(userId) {
    const guest = DB.getVal('cart_guest', []);
    if (!guest.length) return;
    const existing = DB.getVal('cart_' + userId, []);
    DB.setVal('cart_' + userId, [...existing, ...guest]);
    DB.setVal('cart_guest', []);
    Store.setState({ cart: DB.getVal('cart_' + userId, []) });
  }

  // Build WhatsApp checkout message
  function buildWhatsAppMessage(order) {
    const lines = order.items.map(i =>
      `• ${i.name} (${i.qty}pcs, ${i.config.size}, ${i.config.material}, ${i.config.finishing}) — ${formatNaira(i.total)}`
    ).join('\n');
    return `Hi! PrintHub Order *${order.orderNumber}*\n\n${lines}\n\nSubtotal: ${formatNaira(order.subtotal)}\nDelivery: ${formatNaira(order.deliveryFee)}\n*Total: ${formatNaira(order.total)}*\n\nDelivery: ${order.delivery.method}\nPayment: ${order.payment.method}\n\nPlease confirm.`;
  }

  // Load cart from storage on init
  function init() {
    const { user } = Store.getState();
    const items = user ? DB.getVal('cart_' + user.id, []) : DB.getVal('cart_guest', []);
    Store.setState({ cart: items });
  }

  return { getCart, saveCart, addItem, removeItem, updateQty, clearCart, getCartTotal, getCartCount,
    placeOrder, getUserOrders, getOrder, getOrderByNumber, getAllOrders, updateOrderStatus,
    mergeGuestCart, buildWhatsAppMessage, init };
})();
