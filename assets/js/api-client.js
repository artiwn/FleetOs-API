const FleetOSConfig = (() => {
  const LOCAL_PROXY_BASE_URL = 'http://localhost:5050';
  const LEGACY_DIRECT_BACKENDS = [
    'https://fleetosauth.unisys.am',
    'https://fleetosapi.unisys.am'
  ];

  function isLocalFrontend() {
    return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
  }

  function defaultBaseUrl() {
    // Local Live Server runs on 127.0.0.1:5500, while the API proxy runs on localhost:5050.
    // Vercel must stay relative so vercel.json rewrites /api/* to the real Swagger backends.
    return isLocalFrontend() ? LOCAL_PROXY_BASE_URL : '';
  }

  function clean(value) {
    return String(value || '').trim().replace(/\/$/, '');
  }

  function get(key) {
    const stored = clean(localStorage.getItem(key));

    // Previous patches may have stored the real Swagger domains in localStorage.
    // That bypasses the proxy and causes browser OPTIONS/CORS errors, so ignore them.
    if (LEGACY_DIRECT_BACKENDS.includes(stored)) return defaultBaseUrl();

    return stored || defaultBaseUrl();
  }

  function set(key, value) {
    const next = clean(value);
    if (!next || LEGACY_DIRECT_BACKENDS.includes(next)) localStorage.removeItem(key);
    else localStorage.setItem(key, next);
  }

  return {
    get authBaseUrl() { return get('fleetos_auth_base_url'); },
    get apiBaseUrl() { return get('fleetos_api_base_url'); },
    setAuthBaseUrl(value) { set('fleetos_auth_base_url', value); },
    setApiBaseUrl(value) { set('fleetos_api_base_url', value); },
    isLocalFrontend,
    defaultBaseUrl
  };
})();

const FleetOSAuth = (() => {
  const ACCESS_TOKEN_KEY = 'fleetos_access_token';
  const REFRESH_TOKEN_KEY = 'fleetos_refresh_token';
  const USER_KEY = 'fleetos_auth_user';
  const EXPIRES_AT_KEY = 'fleetos_token_expires_at';

  function readTokenFromPayload(payload) {
    return payload?.token || payload?.accessToken || payload?.access_token || payload?.jwt || payload?.data?.token || payload?.data?.accessToken || payload?.result?.token || payload?.result?.accessToken || '';
  }

  function readRefreshTokenFromPayload(payload) {
    return payload?.refreshToken || payload?.refresh_token || payload?.data?.refreshToken || payload?.data?.refresh_token || payload?.result?.refreshToken || payload?.result?.refresh_token || '';
  }

  function readUserFromPayload(payload, username) {
    return payload?.user || payload?.data?.user || payload?.result?.user || payload?.profile || { username };
  }

  function storeSession(payload, username) {
    const accessToken = readTokenFromPayload(payload);
    const refreshToken = readRefreshTokenFromPayload(payload);
    if (!accessToken) throw new Error('Login response does not contain access token.');

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(readUserFromPayload(payload, username)));

    const expiresIn = payload?.expiresIn || payload?.expires_in || payload?.data?.expiresIn || payload?.result?.expiresIn;
    const expiresAt = payload?.expiresAt || payload?.expires_at || payload?.data?.expiresAt || payload?.result?.expiresAt;
    if (expiresAt) localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
    else if (expiresIn) localStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + Number(expiresIn) * 1000));

    window.dispatchEvent(new CustomEvent('fleetos:auth', { detail: getSession() }));
    return getSession();
  }

  async function parseResponse(response) {
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
    if (!response.ok) {
      const message = body?.message || body?.error || body?.title || response.statusText || 'Request failed';
      throw new Error(`${message} (${response.status})`);
    }
    return body;
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');

    const token = getAccessToken();
    if (token && options.auth !== false) headers.set('Authorization', `Bearer ${token}`);

    const baseUrl = options.baseUrl || FleetOSConfig.authBaseUrl;
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    return parseResponse(response);
  }

  async function login(username, password) {
    const payload = await request('/api/Auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ username, password })
    });
    return storeSession(payload, username);
  }

  async function register(data) {
    return request('/api/Auth/register', { method: 'POST', auth: false, body: JSON.stringify(data || {}) });
  }

  async function refresh() {
    const refreshToken = getRefreshToken();
    const payload = await request('/api/Auth/refresh', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ refreshToken })
    });
    return storeSession(payload, getUser()?.username || 'globaladmin');
  }

  async function me() {
    const payload = await request('/api/Auth/me', { method: 'GET' });
    const user = payload?.user || payload?.data || payload?.result || payload;
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }

  async function validate() {
    return request('/api/Auth/validate', {
      method: 'POST'
    });
  }

  function decodeJwtPayload(token = getAccessToken()) {
    try {
      const part = String(token || '').split('.')[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
      return JSON.parse(decodeURIComponent(escape(atob(padded))));
    } catch (e) {
      try {
        const part = String(token || '').split('.')[1];
        if (!part) return null;
        const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
        return JSON.parse(atob(padded));
      } catch (fallbackError) { return null; }
    }
  }

  function getJwtClaims() { return decodeJwtPayload(getAccessToken()) || {}; }

  function readRoleFromClaims(claims = getJwtClaims()) {
    return claims.role
      || claims.roles
      || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
      || '';
  }

  function getAccessToken() { return localStorage.getItem(ACCESS_TOKEN_KEY) || ''; }
  function getRefreshToken() { return localStorage.getItem(REFRESH_TOKEN_KEY) || ''; }
  function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; } }
  function getSession() { return { accessToken: getAccessToken(), refreshToken: getRefreshToken(), user: getUser(), claims: getJwtClaims(), role: readRoleFromClaims(), expiresAt: localStorage.getItem(EXPIRES_AT_KEY) || '' }; }
  function isAuthenticated() { return Boolean(getAccessToken()); }

  function logout(redirect = true) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    if (redirect) {
      const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
      window.location.href = `${prefix}login.html`;
    }
  }

  return { login, register, refresh, me, validate, logout, request, getAccessToken, getRefreshToken, getUser, getSession, getJwtClaims, readRoleFromClaims, decodeJwtPayload, isAuthenticated };
})();

const FleetAPI = (() => {
  async function request(path, options = {}) {
    return FleetOSAuth.request(path, { ...options, baseUrl: options.baseUrl || FleetOSConfig.apiBaseUrl });
  }

  return {
    request,
    auth: FleetOSAuth,
    config: FleetOSConfig
  };
})();

window.FleetOSConfig = FleetOSConfig;
window.FleetOSAuth = FleetOSAuth;
window.FleetAPI = FleetAPI;
