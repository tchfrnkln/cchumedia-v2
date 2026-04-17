/* ================================================================
   PRINTHUB — auth.js  ·  Authentication & User Management
   ================================================================ */

const Auth = (() => {

  function register({ name, email, phone, password }) {
    if (!name || !email || !password) return { error: 'All fields required' };
    const exists = DB.query('users', u => u.email.toLowerCase() === email.toLowerCase())[0];
    if (exists) return { error: 'Email already registered' };
    const user = DB.insert('users', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      password,
      role: 'customer',
      loyaltyPoints: 0,
      addresses: [],
      createdAt: Date.now(),
    });
    _setSession(user);
    return { user };
  }

  function login(email, password) {
    const user = DB.query('users', u =>
      u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    )[0];
    if (!user) return { error: 'Invalid email or password' };
    _setSession(user);
    return { user };
  }

  function logout() {
    DB.setVal('session', null);
    Store.setState({ user: null });
    // Merge guest cart to nothing, redirect home
    Store.navigate('home');
  }

  function _setSession(user) {
    DB.setVal('session', user.id);
    Store.setState({ user });
  }

  function updateProfile(uid, patch) {
    const updated = DB.update('users', uid, patch);
    if (updated) Store.setState({ user: updated });
    return updated;
  }

  function changePassword(uid, oldPass, newPass) {
    const user = DB.getOne('users', uid);
    if (!user || user.password !== oldPass) return { error: 'Current password incorrect' };
    DB.update('users', uid, { password: newPass });
    return { success: true };
  }

  function addAddress(uid, addr) {
    const user = DB.getOne('users', uid);
    if (!user) return;
    const addresses = [...(user.addresses || []), { ...addr, id: DB.uid() }];
    return DB.update('users', uid, { addresses });
  }

  function removeAddress(uid, addrId) {
    const user = DB.getOne('users', uid);
    if (!user) return;
    const addresses = (user.addresses || []).filter(a => a.id !== addrId);
    return DB.update('users', uid, { addresses });
  }

  function addLoyaltyPoints(uid, points) {
    const user = DB.getOne('users', uid);
    if (!user) return;
    const newPoints = (user.loyaltyPoints || 0) + Math.round(points);
    DB.update('users', uid, { loyaltyPoints: newPoints });
    Store.setState({ user: { ...Store.getState().user, loyaltyPoints: newPoints } });
    return newPoints;
  }

  function redeemPoints(uid, points) {
    const user = DB.getOne('users', uid);
    if (!user || (user.loyaltyPoints || 0) < points) return { error: 'Insufficient points' };
    const newPoints = user.loyaltyPoints - points;
    DB.update('users', uid, { loyaltyPoints: newPoints });
    Store.setState({ user: { ...Store.getState().user, loyaltyPoints: newPoints } });
    return { success: true, remaining: newPoints };
  }

  // Affiliate management
  function getAffiliateStats(uid) {
    const referrals = DB.query('orders', o => o.referredBy === uid);
    const total = referrals.reduce((s, o) => s + (o.affiliateEarning || 0), 0);
    return { count: referrals.length, earned: total, orders: referrals };
  }

  return { register, login, logout, updateProfile, changePassword, addAddress, removeAddress, addLoyaltyPoints, redeemPoints, getAffiliateStats };
})();
