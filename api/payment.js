const { getUserFromCookie } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const user = getUserFromCookie(req.headers.cookie);
  if (!user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  let body = '';
  for await (const chunk of req) body += chunk;
  const { amount, paymentMethod } = JSON.parse(body || '{}');

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }

  const paymentId = 'pay_' + Date.now().toString().slice(-6);
  res.json({ ok: true, paymentId, amount, status: 'success' });
};
