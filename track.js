document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('id') || localStorage.getItem('pawpal_last_order');
  const empty = document.getElementById('track-empty');
  const view = document.getElementById('track-view');

  if (!orderId) {
    if (empty) empty.classList.remove('hidden');
    if (view) view.classList.add('hidden');
    return;
  }

  const orders = JSON.parse(localStorage.getItem('pawpal_orders') || '[]');
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    if (empty) { empty.classList.remove('hidden'); empty.innerHTML = '<p class="empty">Order not found.</p><a href="order.html" class="btn btn-primary">Place an order</a>'; }
    if (view) view.classList.add('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  if (view) view.classList.remove('hidden');

  document.getElementById('track-order-id').textContent = order.id;
  document.getElementById('track-order-date').textContent = new Date(order.date).toLocaleString();
  document.getElementById('track-order-total').textContent = '₹' + order.total;

  const base = new Date(order.date).getTime();
  const steps = [
    { id: 'tl-1-time', offset: 0, completed: true },
    { id: 'tl-2-time', offset: 30 * 60 * 1000, completed: true },
    { id: 'tl-3-time', offset: 2 * 60 * 60 * 1000, completed: false },
    { id: 'tl-4-time', offset: 5 * 60 * 60 * 1000, completed: false },
    { id: 'tl-5-time', offset: 12 * 60 * 60 * 1000, completed: false }
  ];

  steps.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) el.textContent = new Date(base + s.offset).toLocaleString([], { hour: '2-digit', minute: '2-digit' });
    const item = el.closest('.tl-content').parentElement;
    if (s.completed) item.classList.add('completed');
  });
});