const { store, signToken } = require('../data');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  let body = '';
  for await (const chunk of req) body += chunk;
  const { name, email, password } = JSON.parse(body || '{}');

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  if (store.users.find((u) => u.email === email)) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const user = { id: 'u' + Date.now(), name, email, password, createdAt: new Date().toISOString() };
  store.users.push(user);

  const token = signToken({ userId: user.id, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
};
