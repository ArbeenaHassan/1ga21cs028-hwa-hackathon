document.addEventListener('DOMContentLoaded', async () => {
  const user = await me();
  if (!user) { location.href = 'login.html'; return; }

  const params = new URLSearchParams(location.search);
  const orderId = params.get('id');
  const empty = document.getElementById('track-empty');
  const view = document.getElementById('track-view');
  const timeline = document.getElementById('timeline');

  if (!orderId) {
    empty.classList.remove('hidden');
    view.classList.add('hidden');
    return;
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    empty.classList.remove('hidden');
    empty.innerHTML = '<p class="empty">Order not found.</p><a href="order.html" class="btn btn-primary">Place an order</a>';
    view.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  view.classList.remove('hidden');

  document.getElementById('track-order-id').textContent = order.id;
  document.getElementById('track-order-date').textContent = new Date(order.date).toLocaleString();
  document.getElementById('track-order-total').textContent = '₹' + order.total;

  timeline.innerHTML = order.timeline.map((step, i) => `
    <div class="tl-item ${step.completed ? 'completed' : ''}">
      <div class="tl-marker">${i + 1}</div>
      <div class="tl-content">
        <h4>${step.step}</h4>
        <p>${new Date(step.time).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  `).join('');
});