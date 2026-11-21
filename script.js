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
});