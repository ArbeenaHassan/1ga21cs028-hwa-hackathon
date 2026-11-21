const API = window.location.origin;

async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    credentials: 'include',
    ...opts,
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  return { ok: res.ok, status: res.status, data };
}

async function me() {
  const r = await api('/api/auth/me');
  return r.ok ? r.data.user : null;
}

async function logout() {
  await api('/api/auth/logout', { method: 'POST' });
  location.href = 'login.html';
}

async function getProducts() {
  const r = await api('/api/products');
  return r.ok ? r.data : [];
}

async function getCart() {
  const r = await api('/api/cart');
  return r.ok ? r.data : [];
}

async function addToCart(productId, qty = 1) {
  const r = await api('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, qty }),
  });
  return r;
}

async function updateCartQty(productId, qty) {
  const r = await api('/api/cart', {
    method: 'PUT',
    body: JSON.stringify({ productId, qty }),
  });
  return r;
}

async function removeFromCart(productId) {
  const r = await api('/api/cart', {
    method: 'DELETE',
    body: JSON.stringify({ productId }),
  });
  return r;
}

async function createOrder(order) {
  const r = await api('/api/orders', { method: 'POST', body: JSON.stringify(order) });
  return r;
}

async function getOrders() {
  const r = await api('/api/orders');
  return r.ok ? r.data : [];
}

async function simulatePayment(amount, paymentMethod) {
  const r = await api('/api/payment', { method: 'POST', body: JSON.stringify({ amount, paymentMethod }) });
  return r;
}

function money(n) { return '₹' + Number(n || 0).toLocaleString(); }

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const cartCountEl = document.querySelector('#nav-cart-count');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '60px';
      links.style.right = '20px';
      links.style.background = '#1E293B';
      links.style.border = '1px solid rgba(255,255,255,0.08)';
      links.style.borderRadius = '12px';
      links.style.padding = '16px';
      links.style.gap = '16px';
    });
  }

  async function refreshCartCount() {
    const cart = await getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCountEl) cartCountEl.textContent = count;
  }
  refreshCartCount();

  const user = await me();
  const authLinks = document.querySelectorAll('[data-auth]');
  const guestLinks = document.querySelectorAll('[data-guest]');

  function setAuthUI(u) {
    authLinks.forEach((el) => { el.style.display = u ? '' : 'none'; });
    guestLinks.forEach((el) => { el.style.display = u ? 'none' : ''; });
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn && u) {
      logoutBtn.style.display = '';
      logoutBtn.addEventListener('click', () => logout());
    }
  }
  setAuthUI(user);
});

window.API = API;
window.api = api;
window.me = me;
window.logout = logout;
window.getProducts = getProducts;
window.getCart = getCart;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.createOrder = createOrder;
window.getOrders = getOrders;
window.simulatePayment = simulatePayment;
window.money = money;