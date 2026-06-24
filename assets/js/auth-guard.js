(() => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isLoginPage = page === 'login.html';
  const prefix = window.location.pathname.includes('/pages/') ? '../' : '';

  if (!window.FleetOSAuth) return;

  if (!isLoginPage && !FleetOSAuth.isAuthenticated()) {
    const cleanPath = window.location.pathname.replace(/^\/+/, '');
    const next = encodeURIComponent(cleanPath + window.location.search + window.location.hash);
    window.location.replace(`${prefix}login.html?next=${next}`);
  }
})();
