document.addEventListener('DOMContentLoaded', async () => {
  const user = await me();
  if (!user) { location.href = 'login.html'; return; }

  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  async function renderCart() {
    const cart = await getCart();
    container.innerHTML = '';
    if (cart.length === 0) {
      container.innerHTML = '<p class="empty">Your cart is empty.</p>';
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (totalEl) totalEl.textContent = '₹0';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.qty;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img">${item.image}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price} each</p>
          <div class="cart-qty">
            <button type="button" onclick="changeQty('${item.productId}', -1)">−</button>
            <input type="number" value="${item.qty}" min="1" onchange="setQty('${item.productId}', this.value)">
            <button type="button" onclick="changeQty('${item.productId}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeItem('${item.productId}')">Remove</button>
      `;
      container.appendChild(el);
    });
    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal;
    if (totalEl) totalEl.textContent = '₹' + subtotal;
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  window.changeQty = async (productId, delta) => {
    const cart = await getCart();
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    if (item.qty + delta < 1) {
      await removeFromCart(productId);
    } else {
      await updateCartQty(productId, item.qty + delta);
    }
    renderCart();
  };

  window.setQty = async (productId, val) => {
    await updateCartQty(productId, Math.max(1, parseInt(val) || 1));
    renderCart();
  };

  window.removeItem = async (productId) => {
    await removeFromCart(productId);
    renderCart();
  };

  renderCart();

  checkoutBtn.addEventListener('click', () => location.href = 'order.html');
});