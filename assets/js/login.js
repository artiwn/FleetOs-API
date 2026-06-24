(() => {
  const DEFAULT_USERNAME = 'globaladmin';
  const DEFAULT_PASSWORD = 'GlobalAdmin123!';

  function qs(name) { return new URLSearchParams(window.location.search).get(name); }
  function setStatus(message, type = '') {
    const box = document.getElementById('loginStatus');
    if (!box) return;
    box.textContent = message;
    box.className = `login-status ${type}`.trim();
  }

  function nextUrl() {
    const next = qs('next');
    if (!next || next.includes('://') || next.startsWith('/')) return 'index.html';
    return next;
  }

  function syncConfigFields() {
    const authBase = document.getElementById('authBaseUrl');
    const apiBase = document.getElementById('apiBaseUrl');
    if (authBase) authBase.value = FleetOSConfig.authBaseUrl;
    if (apiBase) apiBase.value = FleetOSConfig.apiBaseUrl;
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form.username.value.trim();
    const password = form.password.value;
    FleetOSConfig.setAuthBaseUrl(form.authBaseUrl.value.trim());
    FleetOSConfig.setApiBaseUrl(form.apiBaseUrl.value.trim());

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Signing in...';
    setStatus(`Connecting through ${FleetOSConfig.authBaseUrl || ''}/api/Auth/login...`, 'info');

    try {
      await FleetOSAuth.login(username, password);
      setStatus('Login successful. Opening Global Admin...', 'success');
      window.location.href = nextUrl();
    } catch (error) {
      setStatus(error.message || 'Unable to login. Check API URL or credentials.', 'error');
      button.disabled = false;
      button.textContent = 'Sign in as Global Admin';
    }
  }

  function renderLogin() {
    const root = document.getElementById('loginApp');
    if (!root) return;
    root.innerHTML = `
      <main class="login-shell">
        <section class="login-card glass-card">
          <div class="login-brand">
            <div class="brand-mark">F</div>
            <div>
              <p class="eyebrow">FleetOS Auth</p>
              <h1>Global Admin Login</h1>
              <p class="muted">Locally login goes through http://localhost:5050. On Vercel it uses relative /api paths through vercel.json.</p>
            </div>
          </div>

          <form id="loginForm" class="login-form">
            <label>Username
              <input name="username" autocomplete="username" value="${DEFAULT_USERNAME}" />
            </label>
            <label>Password
              <input name="password" autocomplete="current-password" type="password" value="${DEFAULT_PASSWORD}" />
            </label>
            <details class="login-config">
              <summary>API configuration (optional)</summary>
              <label>Auth base URL
                <input id="authBaseUrl" name="authBaseUrl" placeholder="Local: http://localhost:5050 · Vercel: leave empty" />
              </label>
              <label>API base URL
                <input id="apiBaseUrl" name="apiBaseUrl" placeholder="Local: http://localhost:5050 · Vercel: leave empty" />
              </label>
            </details>
            <button class="primary-action" type="submit">Sign in as Global Admin</button>
            <div id="loginStatus" class="login-status info">Ready: globaladmin / GlobalAdmin123! · local proxy auto-detected</div>
          </form>
        </section>
      </main>`;
    syncConfigFields();
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  }

  renderLogin();
})();
