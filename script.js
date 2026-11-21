document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

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

  const form = document.getElementById('order-form');
  const msg = document.getElementById('form-msg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      console.log('Pre-order submitted:', data);
      msg.textContent = 'Thanks! Your pre-order request has been received (demo). We will reach out soon.';
      msg.style.color = '#10B981';
      form.reset();
      setTimeout(() => { msg.textContent = ''; }, 6000);
    });
  }

  updateCartCount();
});

const PRODUCT = { id: 'pawpal', name: 'PawPal Smart Toy + Feeder', price: 4999, image: '🐶' };

function getCart() {
  return JSON.parse(localStorage.getItem('pawpal_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('pawpal_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product = PRODUCT, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const els = document.querySelectorAll('#nav-cart-count');
  els.forEach((el) => { el.textContent = count; });
}

window.addToCart = addToCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;
window.PRODUCT = PRODUCT;

function addToWishlist(product = PRODUCT) {
  const wish = JSON.parse(localStorage.getItem('pawpal_wishlist') || '[]');
  if (!wish.find((i) => i.id === product.id)) wish.push(product);
  localStorage.setItem('pawpal_wishlist', JSON.stringify(wish));
}
window.addToWishlist = addToWishlist;