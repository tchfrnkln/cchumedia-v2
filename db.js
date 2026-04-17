/* ================================================================
   PRINTHUB — db.js
   localStorage persistence layer. Mimics a real database.
   Tables: users, orders, products, cart, sessions, loyalty, designs
   ================================================================ */

const DB = (() => {
  const PREFIX = 'ph_';

  function get(table) {
    try { return JSON.parse(localStorage.getItem(PREFIX + table)) || []; }
    catch { return []; }
  }
  function set(table, data) {
    localStorage.setItem(PREFIX + table, JSON.stringify(data));
    return data;
  }
  function getOne(table, id) {
    return get(table).find(r => r.id === id) || null;
  }
  function insert(table, record) {
    const rows = get(table);
    const newRecord = { ...record, id: record.id || uid(), createdAt: record.createdAt || Date.now() };
    rows.push(newRecord);
    set(table, rows);
    return newRecord;
  }
  function update(table, id, patch) {
    const rows = get(table);
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: Date.now() };
    set(table, rows);
    return rows[idx];
  }
  function remove(table, id) {
    const rows = get(table).filter(r => r.id !== id);
    set(table, rows);
  }
  function query(table, predicate) {
    return get(table).filter(predicate);
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function clear(table) { localStorage.removeItem(PREFIX + table); }
  function getVal(key, fallback = null) {
    const v = localStorage.getItem(PREFIX + 'kv_' + key);
    return v !== null ? JSON.parse(v) : fallback;
  }
  function setVal(key, value) {
    localStorage.setItem(PREFIX + 'kv_' + key, JSON.stringify(value));
  }

  // Seed admin user on first run
  function seedAdmin() {
    if (!getVal('seeded')) {
      insert('users', {
        id: 'admin001',
        email: 'admin@cchumedia.com',
        password: 'admin123', // plain text OK for demo
        name: 'Silas Umekwe',
        role: 'admin',
        phone: '+234 901 559 9370',
        loyaltyPoints: 0,
        createdAt: Date.now(),
      });
      setVal('seeded', true);
    }
  }

  seedAdmin();

  return { get, set, getOne, insert, update, remove, query, uid, clear, getVal, setVal };
})();
