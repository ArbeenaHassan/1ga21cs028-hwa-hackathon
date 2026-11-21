document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const btn = document.getElementById('checkout-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) return;
      location.href = 'order.html';
    });
  }
});

function renderCart() {
  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const emptyMsg = container.querySelector('.empty');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty">Your cart is empty.</p>';
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  if (emptyMsg) emptyMsg.remove();

  let subtotal = 0;
  cart.forEach((item, i) => {
    subtotal += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-img">${item.image}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price} each</p>
        <div class="cart-qty">
          <button type="button" onclick="changeQty(${i}, -1)">−</button>
          <input type="number" value="${item.qty}" min="1" onchange="setQty(${i}, this.value)">
          <button type="button" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeItem(${i})">Remove</button>
    `;
    container.appendChild(el);
  });

  if (subtotalEl) subtotalEl.textContent = '₹' + subtotal;
  if (totalEl) totalEl.textContent = '₹' + subtotal;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function changeQty(i, delta) {
  const cart = getCart();
  if (!cart[i]) return;
  cart[i].qty += delta;
  if (cart[i].qty < 1) cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

function setQty(i, val) {
  const cart = getCart();
  if (!cart[i]) return;
  cart[i].qty = Math.max(1, parseInt(val) || 1);
  saveCart(cart);
  renderCart();
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

window.changeQty = changeQty;
window.setQty = setQty;
window.removeItem = removeItem;