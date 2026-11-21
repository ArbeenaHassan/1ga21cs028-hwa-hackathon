const { getUserFromCookie } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const user = getUserFromCookie(req.headers.cookie);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({ user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
};
