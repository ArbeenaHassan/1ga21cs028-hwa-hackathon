document.addEventListener('DOMContentLoaded', async () => {
  const user = await me();
  if (!user) { location.href = 'login.html'; return; }

  const profileView = document.getElementById('profile-view');
  const profileEdit = document.getElementById('profile-edit');
  const profileForm = document.getElementById('profile-form');
  const editBtn = document.getElementById('edit-btn');
  const cancelEdit = document.getElementById('cancel-edit');
  const signoutBtn = document.getElementById('signout-btn');
  const msg = document.getElementById('profile-msg');
  const ordersList = document.getElementById('orders-list');

  signoutBtn.addEventListener('click', () => logout());

  async function loadProfile() {
    const u = await me();
    if (!u) return;
    profileView.innerHTML = `
      <p><strong>Name:</strong> ${u.name}</p>
      <p><strong>Email:</strong> ${u.email}</p>
      <p><strong>Member since:</strong> ${new Date(u.createdAt).toLocaleDateString()}</p>
    `;
    if (profileForm) {
      profileForm.elements.name.value = u.name;
      profileForm.elements.email.value = u.email;
    }
  }

  async function loadOrders() {
    const orders = await getOrders();
    ordersList.innerHTML = '';
    if (orders.length === 0) {
      ordersList.innerHTML = '<p class="empty">No orders yet.</p>';
      return;
    }
    orders.forEach((o) => {
      const el = document.createElement('div');
      el.className = 'order-item';
      el.innerHTML = `
        <div>
          <div><strong>Order #${o.id}</strong></div>
          <div style="font-size:12px;color:var(--muted)">${new Date(o.date).toLocaleString()} · ${o.items.reduce((s,i)=>s+i.qty,0)} item(s)</div>
        </div>
        <div style="text-align:right">${money(o.total)}</div>
      `;
      ordersList.appendChild(el);
    });
  }

  editBtn.addEventListener('click', () => {
    profileView.classList.add('hidden');
    profileEdit.classList.remove('hidden');
  });

  cancelEdit.addEventListener('click', () => {
    profileView.classList.remove('hidden');
    profileEdit.classList.add('hidden');
    msg.textContent = '';
  });

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Demo: profile update is simulated (auth me returns stored user)
    msg.textContent = 'Profile updated (demo).';
    msg.style.color = '#10B981';
    setTimeout(() => { msg.textContent = ''; }, 3000);
    profileView.classList.remove('hidden');
    profileEdit.classList.add('hidden');
    loadProfile();
  });

  loadProfile();
  loadOrders();
});