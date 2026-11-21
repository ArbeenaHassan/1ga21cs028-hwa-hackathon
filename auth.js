const API = window.location.origin;

async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    credentials: 'include',
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function login(email, password) {
  const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  return r;
}

async function register(name, email, password) {
  const r = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  return r;
}

async function logout() {
  await api('/api/auth/logout', { method: 'POST' });
}

async function me() {
  const r = await api('/api/auth/me');
  return r.ok ? r.data.user : null;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('login-msg');
      const r = await login(loginForm.elements.email.value, loginForm.elements.password.value);
      if (r.ok) {
        msg.textContent = 'Signed in. Redirecting...';
        msg.style.color = '#10B981';
        setTimeout(() => { location.href = 'index.html'; }, 800);
      } else {
        msg.textContent = r.data.error || 'Login failed';
        msg.style.color = '#ef4444';
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('signup-msg');
      const r = await register(signupForm.elements.name.value, signupForm.elements.email.value, signupForm.elements.password.value);
      if (r.ok) {
        msg.textContent = 'Account created. Redirecting...';
        msg.style.color = '#10B981';
        setTimeout(() => { location.href = 'index.html'; }, 800);
      } else {
        msg.textContent = r.data.error || 'Signup failed';
        msg.style.color = '#ef4444';
      }
    });
  }
});

window.api = api;
window.me = me;
window.logout = logout;
window.API = API;