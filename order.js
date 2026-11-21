document.addEventListener('DOMContentLoaded', async () => {
  const user = await me();
  if (!user) { location.href = 'login.html'; return; }

  const form = document.getElementById('order-form');
  const msg = document.getElementById('order-msg');
  const payBtn = document.getElementById('pay-btn');

  const cart = await getCart();
  if (cart.length === 0) {
    msg.textContent = 'Your cart is empty.';
    msg.style.color = '#ef4444';
    payBtn.disabled = true;
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = 'Processing payment...';

    const r = await simulatePayment(total, 'card');
    if (!r.ok) {
      msg.textContent = r.data.error || 'Payment failed';
      msg.style.color = '#ef4444';
      payBtn.disabled = false;
      payBtn.textContent = 'Pay ₹4,999 & confirm order';
      return;
    }

    const orderData = {
      items: cart.map((i) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
      total,
      customer: {
        name: form.elements.name.value,
        email: form.elements.email.value,
        phone: form.elements.phone.value,
        address: form.elements.address.value,
      },
      paymentId: r.data.paymentId,
    };

    const or = await createOrder(orderData);
    if (!or.ok) {
      msg.textContent = or.data.error || 'Order failed';
      msg.style.color = '#ef4444';
      payBtn.disabled = false;
      payBtn.textContent = 'Pay ₹4,999 & confirm order';
      return;
    }

    msg.textContent = 'Order confirmed! Redirecting to tracking...';
    msg.style.color = '#10B981';
    setTimeout(() => { location.href = 'track.html?id=' + or.data.id; }, 1200);
  });
});