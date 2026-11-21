const { store, signToken, verifyToken } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  let body = '';
  for await (const chunk of req) body += chunk;
  const { email, password } = JSON.parse(body || '{}');

  const user = store.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signToken({ userId: user.id, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
};
