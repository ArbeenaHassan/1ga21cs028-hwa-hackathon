const { store, getUserFromCookie } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const user = getUserFromCookie(req.headers.cookie);
  if (!user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method === 'GET') {
    const userOrders = store.orders.filter((o) => o.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(userOrders);
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { items, total, customer, paymentId } = JSON.parse(body || '{}');

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    const order = {
      id: 'PP' + Date.now().toString().slice(-6),
      userId: user.id,
      date: new Date().toISOString(),
      total,
      items,
      customer,
      paymentId,
      status: 'placed',
      timeline: [
        { step: 'Order placed', time: new Date().toISOString(), completed: true },
        { step: 'Processing', time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), completed: true },
        { step: 'Shipped', time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), completed: false },
        { step: 'Out for delivery', time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), completed: false },
        { step: 'Delivered', time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), completed: false },
      ],
    };
    store.orders.push(order);

    const key = 'cart:' + user.id;
    store.carts[key] = [];

    res.status(201).json(order);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
