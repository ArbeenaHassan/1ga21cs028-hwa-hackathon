document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadWishlist();
  loadOrders();
});

function loadProfile() {
  const prof = JSON.parse(localStorage.getItem('pawpal_profile') || '{}');
  const form = document.getElementById('profile-form');
  const msg = document.getElementById('profile-msg');
  if (!form) return;
  if (prof.name) form.elements.name.value = prof.name;
  if (prof.email) form.elements.email.value = prof.email;
  if (prof.phone) form.elements.phone.value = prof.phone;
  if (prof.address) form.elements.address.value = prof.address;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      phone: form.elements.phone.value,
      address: form.elements.address.value
    };
    localStorage.setItem('pawpal_profile', JSON.stringify(data));
    msg.textContent = 'Profile saved.';
    msg.style.color = '#10B981';
    setTimeout(() => { msg.textContent = ''; }, 4000);
  });
}

function loadWishlist() {
  const list = document.getElementById('wishlist-list');
  const wish = JSON.parse(localStorage.getItem('pawpal_wishlist') || '[]');
  if (!list) return;
  list.innerHTML = '';
  if (wish.length === 0) {
    list.innerHTML = '<p class="empty">Your wishlist is empty.</p>';
    return;
  }
  wish.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'wishlist-item';
    el.innerHTML = `
      <div><strong>${item.name}</strong><div style="font-size:12px;color:var(--muted)">₹${item.price}</div></div>
      <div class="wishlist-actions">
        <button class="btn-ghost" onclick="moveToCart(${i})">Add to cart</button>
        <button class="btn-ghost" onclick="removeFromWishlist(${i})">Remove</button>
      </div>
    `;
    list.appendChild(el);
  });
}

function moveToCart(i) {
  const wish = JSON.parse(localStorage.getItem('pawpal_wishlist') || '[]');
  const item = wish[i];
  addToCart(item);
  wish.splice(i, 1);
  localStorage.setItem('pawpal_wishlist', JSON.stringify(wish));
  loadWishlist();
}

function removeFromWishlist(i) {
  const wish = JSON.parse(localStorage.getItem('pawpal_wishlist') || '[]');
  wish.splice(i, 1);
  localStorage.setItem('pawpal_wishlist', JSON.stringify(wish));
  loadWishlist();
}

function loadOrders() {
  const list = document.getElementById('orders-list');
  if (!list) return;
  const orders = JSON.parse(localStorage.getItem('pawpal_orders') || '[]');
  list.innerHTML = '';
  if (orders.length === 0) {
    list.innerHTML = '<p class="empty">No orders yet.</p>';
    return;
  }
  [...orders].reverse().forEach((o) => {
    const el = document.createElement('div');
    el.className = 'order-item';
    el.innerHTML = `
      <div>
        <div><strong>Order #${o.id}</strong></div>
        <div style="font-size:12px;color:var(--muted)">${new Date(o.date).toLocaleString()} · ${o.items.reduce((s,i)=>s+i.qty,0)} item(s)</div>
      </div>
      <div style="text-align:right">₹${o.total}</div>
    `;
    list.appendChild(el);
  });
}

window.addToCart = addToCart;