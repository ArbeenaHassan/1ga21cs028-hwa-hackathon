const { store } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { id } = req.query || {};
  if (id) {
    const product = store.products.find((p) => p.id === id);
    if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(product);
  } else {
    res.json(store.products);
  }
};
