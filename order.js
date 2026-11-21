document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const msg = document.getElementById('order-msg');
  const prof = JSON.parse(localStorage.getItem('pawpal_profile') || '{}');
  if (!form) return;

  if (prof.name) form.elements.name.value = prof.name;
  if (prof.email) form.elements.email.value = prof.email;
  if (prof.phone) form.elements.phone.value = prof.phone;
  if (prof.address) form.elements.address.value = prof.address;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      msg.textContent = 'Your cart is empty.';
      msg.style.color = '#ef4444';
      return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: 'PP' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      total,
      items: [...cart],
      status: 'placed',
      customer: {
        name: form.elements.name.value,
        email: form.elements.email.value,
        phone: form.elements.phone.value,
        address: form.elements.address.value
      }
    };

    const orders = JSON.parse(localStorage.getItem('pawpal_orders') || '[]');
    orders.push(order);
    localStorage.setItem('pawpal_orders', JSON.stringify(orders));
    localStorage.setItem('pawpal_last_order', order.id);
    saveCart([]);
    msg.textContent = 'Order confirmed! Redirecting to tracking...';
    msg.style.color = '#10B981';
    setTimeout(() => { location.href = 'track.html?id=' + order.id; }, 1500);
  });
});