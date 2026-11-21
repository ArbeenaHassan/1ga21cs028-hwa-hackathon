const { store, getUserFromCookie } = require('../data');

function cartId(userId) { return 'cart:' + userId; }

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const user = getUserFromCookie(req.headers.cookie);
  if (!user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const key = cartId(user.id);
  if (!store.carts[key]) store.carts[key] = [];

  if (req.method === 'GET') {
    res.json(store.carts[key]);
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { productId, qty = 1 } = JSON.parse(body || '{}');
    const product = store.products.find((p) => p.id === productId);
    if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
    const existing = store.carts[key].find((i) => i.productId === productId);
    if (existing) existing.qty += qty;
    else store.carts[key].push({ productId, qty: parseInt(qty) });
    res.status(201).json(store.carts[key]);
    return;
  }

  if (req.method === 'PUT') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { productId, qty } = JSON.parse(body || '{}');
    const item = store.carts[key].find((i) => i.productId === productId);
    if (!item) { res.status(404).json({ error: 'Item not in cart' }); return; }
    item.qty = Math.max(1, parseInt(qty));
    res.json(store.carts[key]);
    return;
  }

  if (req.method === 'DELETE') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { productId } = JSON.parse(body || '{}');
    store.carts[key] = store.carts[key].filter((i) => i.productId !== productId);
    res.json(store.carts[key]);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
