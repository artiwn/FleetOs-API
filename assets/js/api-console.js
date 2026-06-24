let fleetosApiResults = [];
let fleetosManualResult = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function apiStatusClass(result) {
  if (result.skipped) return 'warning';
  if (result.ok) return 'success';
  if (result.status === 401 || result.status === 403) return 'warning';
  return 'danger';
}

function apiStatusText(result) {
  if (result.skipped) return 'Skipped';
  if (result.ok) return 'OK';
  if (result.status) return `Error ${result.status}`;
  return 'Fetch Error';
}

function apiStatusBadge(result) {
  return `<span class="badge ${apiStatusClass(result)}">${apiStatusText(result)}</span>`;
}

function apiPretty(value) {
  try { return JSON.stringify(value, null, 2); } catch (e) { return String(value); }
}

function apiPreviewData(result) {
  if (!result.ok) return result.bodyText || result.error || result.statusText || 'No response body';
  if (Array.isArray(result.data)) return result.data.slice(0, 3);
  return result.data;
}

function apiResultCard(result, index) {
  const count = result.count === null || result.count === undefined ? '—' : result.count;
  const methodClass = String(result.method || 'GET').toLowerCase();
  return `<article class="glass-card api-check-card" data-api-result="${index}">
    <div class="panel-head compact">
      <div>
        <h3>${escapeHtml(result.label)}</h3>
        <p class="muted"><span class="badge neutral">${escapeHtml(result.group || 'API')}</span> <span class="api-method ${methodClass}">${escapeHtml(result.method || 'GET')}</span> <code>${escapeHtml(result.path)}</code></p>
      </div>
      ${apiStatusBadge(result)}
    </div>
    <div class="metric-grid compact api-metrics">
      <div><span>Status</span><strong>${escapeHtml(result.status ?? '—')}</strong></div>
      <div><span>Time</span><strong>${escapeHtml(result.ms || 0)} ms</strong></div>
      <div><span>Rows</span><strong>${escapeHtml(count)}</strong></div>
      <div><span>Source</span><strong>${escapeHtml(result.source || (FleetOSConfig.isLocalFrontend() ? 'Local proxy' : 'Vercel proxy'))}</strong></div>
    </div>
    <p class="muted api-notes">${escapeHtml(result.notes || '')}</p>
    <pre class="api-preview">${escapeHtml(apiPretty(apiPreviewData(result)))}</pre>
  </article>`;
}

function apiGroupSummary(results) {
  const grouped = results.reduce((acc, item) => {
    const group = item.group || 'Other';
    acc[group] ||= { total: 0, ok: 0, error: 0, skipped: 0 };
    acc[group].total += 1;
    if (item.skipped) acc[group].skipped += 1;
    else if (item.ok) acc[group].ok += 1;
    else acc[group].error += 1;
    return acc;
  }, {});
  return Object.entries(grouped).map(([group, data]) => `<div class="data-row">
    <strong>${escapeHtml(group)}</strong>
    <span>${data.ok}/${data.total} OK</span>
    <span>${data.error} errors</span>
    <span>${data.skipped} skipped</span>
  </div>`).join('');
}

function buildBackendReport(results) {
  const stamp = new Date().toISOString();
  const lines = [];
  lines.push(`FleetOS API backend check — ${stamp}`);
  lines.push(`Frontend source: ${FleetOSConfig.isLocalFrontend() ? 'Local proxy http://localhost:5050' : 'Vercel proxy /api rewrites'}`);
  lines.push(`Authenticated: ${FleetOSAuth.isAuthenticated() ? 'yes' : 'no'}`);
  const user = FleetOSAuth.getUser();
  if (user) lines.push(`User: ${user.username || user.email || JSON.stringify(user)}`);
  lines.push('');
  lines.push('SUMMARY');
  lines.push(`OK: ${results.filter(r => r.ok).length}`);
  lines.push(`Errors: ${results.filter(r => !r.ok && !r.skipped).length}`);
  lines.push(`Skipped/manual: ${results.filter(r => r.skipped).length}`);
  lines.push('');
  lines.push('FAILED ENDPOINTS');
  const failed = results.filter(r => !r.ok && !r.skipped);
  if (!failed.length) lines.push('None');
  failed.forEach(r => lines.push(`- ${r.method} ${r.path} => ${r.status || 0} ${r.statusText || r.error || ''}`));
  lines.push('');
  lines.push('ALL CHECKED ENDPOINTS');
  results.forEach(r => {
    const count = r.count === null || r.count === undefined ? '-' : r.count;
    lines.push(`- ${r.group || 'API'} | ${r.method} ${r.path} | ${r.skipped ? 'SKIPPED' : r.ok ? 'OK' : 'ERROR'} | status=${r.status ?? '-'} | rows=${count} | time=${r.ms || 0}ms`);
  });
  lines.push('');
  lines.push('NOTE');
  lines.push('Huawei, DeyeCloud and SolarX vendor-specific endpoints are intentionally excluded from this check.');
  return lines.join('\n');
}

function renderApiConsole() {
  const catalogRows = FleetOSPlatformAPI.endpointCatalog.map(item => `<div class="data-row">
    <strong>${escapeHtml(item.label)}</strong>
    <span>${escapeHtml(item.method)} <code>${escapeHtml(item.path)}</code></span>
    <span>${escapeHtml(item.group)}</span>
    <span>${item.safe ? '<span class="badge success">Auto safe</span>' : '<span class="badge warning">Manual only</span>'}</span>
  </div>`).join('');

  return `<section class="page-hero">
    <div>
      <p class="eyebrow">Swagger Diagnostics</p>
      <h1>Platform API Console</h1>
      <p class="muted">Checks all non-vendor FleetOS endpoints through the same Bearer token and proxy path used by the UI. Safe endpoints run automatically; endpoints with {id}, POST, PUT and PATCH are listed as Manual only. Huawei, DeyeCloud and SolarX vendor endpoints are intentionally skipped until vendor onboarding is complete.</p>
    </div>
    <button class="create-action" id="runApiChecks" type="button"><span class="pulse"></span><div><strong>Run diagnostics</strong><small>Safe endpoints auto-check</small></div></button>
  </section>

  <section class="context-bar glass-card">
    <button class="ctx-item"><span>Auth</span><strong>${FleetOSAuth.isAuthenticated() ? 'Bearer token found' : 'No token'}</strong></button>
    <button class="ctx-item"><span>API Base</span><strong>${escapeHtml(FleetOSConfig.apiBaseUrl || '/api via Vercel')}</strong></button>
    <button class="ctx-item"><span>Mode</span><strong>${FleetOSConfig.isLocalFrontend() ? 'Local proxy' : 'Vercel proxy'}</strong></button>
    <button class="ctx-item"><span>Vendor APIs</span><strong>Skipped</strong></button>
  </section>

  <section class="panel glass-card">
    <div class="panel-head">
      <div><h2>Safe Endpoint Health</h2><p>Automatic check for safe concrete endpoints. All admin/platform Swagger endpoints are listed below; endpoints with ids or write actions stay manual to avoid changing backend data.</p></div>
      <div class="toolbar"><button class="secondary-action" id="copyBackendReport" type="button">Copy backend report</button><button class="secondary-action" id="clearApiResults" type="button">Clear</button></div>
    </div>
    <div id="apiConsoleStatus" class="empty-state"><strong>Ready</strong><small>Click Run diagnostics after login as globaladmin.</small></div>
    <div class="data-table compact-table api-method-table" id="apiGroupSummary" style="display:none"><div class="data-head"><span>Group</span><span>OK</span><span>Errors</span><span>Skipped</span></div></div>
    <div id="apiConsoleResults" class="api-check-grid"></div>
    <textarea id="backendReportOutput" class="hidden" aria-label="Backend report"></textarea>
  </section>

  <section class="panel glass-card">
    <div class="panel-head"><div><h2>Manual Request Runner</h2><p>Use this only for endpoints that need ids, POST bodies or backend-team tests. It uses the same token and proxy.</p></div></div>
    <div class="form-grid three-cols">
      <label>Method
        <select id="manualApiMethod">
          <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
        </select>
      </label>
      <label class="span-2">Path
        <input id="manualApiPath" value="/api/admin/provider-integrations/templates/DeyeCloud" />
      </label>
    </div>
    <label>JSON Body
      <textarea id="manualApiBody" rows="8" placeholder='{ "example": true }'></textarea>
    </label>
    <div class="toolbar"><button class="create-action" id="runManualApi" type="button">Run manual request</button><button class="secondary-action" id="clearManualApi" type="button">Clear manual result</button></div>
    <div id="manualApiResult" class="api-check-grid"></div>
  </section>

  <section class="panel glass-card">
    <div class="panel-head"><div><h2>Endpoint Catalog</h2><p>Complete non-vendor endpoint catalog from Swagger: Tenants, Clients, PlantRegistry, ProviderIntegrations, Platform Live API and Platform Operations. Vendor-specific Huawei/DeyeCloud/SolarX endpoints are excluded intentionally.</p></div></div>
    <div class="data-table compact-table api-method-table">
      <div class="data-head"><span>Endpoint</span><span>Path</span><span>Group</span><span>Mode</span></div>
      ${catalogRows}
    </div>
  </section>`;
}

async function wireApiConsole() {
  const status = document.getElementById('apiConsoleStatus');
  const resultsEl = document.getElementById('apiConsoleResults');
  const groupEl = document.getElementById('apiGroupSummary');
  const reportOutput = document.getElementById('backendReportOutput');

  async function run() {
    status.innerHTML = '<strong>Checking...</strong><small>Requests are running through proxy and Bearer token.</small>';
    resultsEl.innerHTML = '';
    groupEl.style.display = 'none';
    fleetosApiResults = await FleetOSPlatformAPI.checkCatalog({ includeUnsafe: false });
    const ok = fleetosApiResults.filter(x => x.ok).length;
    const errors = fleetosApiResults.filter(x => !x.ok && !x.skipped).length;
    status.innerHTML = `<strong>${ok}/${fleetosApiResults.length} endpoints OK</strong><small>${errors} backend/API error(s). Vendor APIs are excluded.</small>`;
    groupEl.style.display = 'grid';
    groupEl.innerHTML = '<div class="data-head"><span>Group</span><span>OK</span><span>Errors</span><span>Skipped</span></div>' + apiGroupSummary(fleetosApiResults);
    resultsEl.innerHTML = fleetosApiResults.map(apiResultCard).join('');
    reportOutput.value = buildBackendReport(fleetosApiResults);
    if (window.FleetLayout?.toast) FleetLayout.toast(`${ok}/${fleetosApiResults.length} API checks passed`);
  }

  async function runManual() {
    const method = document.getElementById('manualApiMethod')?.value || 'GET';
    const path = (document.getElementById('manualApiPath')?.value || '').trim();
    const bodyText = (document.getElementById('manualApiBody')?.value || '').trim();
    const manualEl = document.getElementById('manualApiResult');
    if (!path.startsWith('/api/')) {
      manualEl.innerHTML = '<article class="glass-card api-check-card"><p class="api-error">Path must start with /api/</p></article>';
      return;
    }
    let body;
    if (bodyText) {
      try { body = JSON.parse(bodyText); } catch (e) {
        manualEl.innerHTML = `<article class="glass-card api-check-card"><p class="api-error">Invalid JSON body: ${escapeHtml(e.message)}</p></article>`;
        return;
      }
    }
    manualEl.innerHTML = '<article class="glass-card api-check-card"><strong>Running manual request...</strong></article>';
    fleetosManualResult = await FleetOSPlatformAPI.rawRequest(path, { method, body });
    fleetosManualResult.label = 'Manual Request';
    fleetosManualResult.group = 'Manual';
    fleetosManualResult.notes = 'Manual diagnostic result. Add to backend report if needed.';
    manualEl.innerHTML = apiResultCard(fleetosManualResult, 0);
  }

  document.getElementById('runApiChecks')?.addEventListener('click', run);
  document.getElementById('clearApiResults')?.addEventListener('click', () => {
    fleetosApiResults = [];
    resultsEl.innerHTML = '';
    groupEl.style.display = 'none';
    reportOutput.value = '';
    status.innerHTML = '<strong>Ready</strong><small>Click Run diagnostics after login as globaladmin.</small>';
  });
  document.getElementById('copyBackendReport')?.addEventListener('click', async () => {
    const text = reportOutput.value || buildBackendReport(fleetosApiResults);
    if (!text.trim()) {
      if (window.FleetLayout?.toast) FleetLayout.toast('Run diagnostics first');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (window.FleetLayout?.toast) FleetLayout.toast('Backend report copied');
    } catch (e) {
      reportOutput.classList.remove('hidden');
      reportOutput.focus();
      reportOutput.select();
    }
  });
  document.getElementById('runManualApi')?.addEventListener('click', runManual);
  document.getElementById('clearManualApi')?.addEventListener('click', () => {
    fleetosManualResult = null;
    const manualEl = document.getElementById('manualApiResult');
    if (manualEl) manualEl.innerHTML = '';
  });

  run();
}
