document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const products = await getProducts();
  grid.innerHTML = '';

  const user = await me();

  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">${p.image}</div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <p class="product-price">${money(p.price)}</p>
      <div class="product-actions">
        <input type="number" class="product-qty" value="1" min="1">
        <button class="btn btn-primary btn-full add-to-cart" data-id="${p.id}" ${!user ? 'disabled' : ''}>Add to cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    if (!user) {
      alert('Please sign in before adding items to cart.');
      location.href = 'login.html';
      return;
    }
    const card = btn.closest('.product-card');
    const qty = parseInt(card.querySelector('.product-qty').value) || 1;
    const r = await addToCart(btn.dataset.id, qty);
    if (r.ok) {
      btn.textContent = 'Added!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = 'Add to cart'; btn.disabled = false; }, 1200);
      const count = (await getCart()).reduce((s, i) => s + i.qty, 0);
      const el = document.getElementById('nav-cart-count');
      if (el) el.textContent = count;
    } else {
      alert(r.data.error || 'Failed to add to cart');
    }
  });
});