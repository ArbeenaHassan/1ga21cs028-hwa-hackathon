const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'pawpal_dev_secret_change_in_prod';

const store = {
  users: [],
  products: [
    { id: 'pawpal-full', name: 'PawPal Smart Toy + Feeder', price: 4999, image: '🐶', desc: 'Full smart toy with camera, voice, puzzles and auto feeder.' },
    { id: 'pawpal-toy', name: 'PawPal Smart Toy Only', price: 2999, image: '🧠', desc: 'Smart toy with camera, voice and multi-level puzzles.' },
    { id: 'pawpal-feeder', name: 'PawPal Auto Feeder Only', price: 2499, image: '🍽️', desc: 'Timed food and water dispenser with sleep detection.' },
  ],
  carts: {},
  orders: [],
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const signingInput = base64url(header) + '.' + base64url(payload);
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest('base64url');
  return signingInput + '.' + sig;
}

function verifyToken(token) {
  try {
    const [h, p, s] = token.split('.');
    const signingInput = h + '.' + p;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest('base64url');
    if (expected !== s) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp * 1000) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function getUserFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) return null;
  const payload = verifyToken(match[1]);
  if (!payload) return null;
  return store.users.find((u) => u.id === payload.userId) || null;
}

module.exports = { store, JWT_SECRET, base64url, signToken, verifyToken, getUserFromCookie };
