let fleetosVendorResults = [];
let fleetosVendorReport = '';

function vendorEscapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function vendorJsonPreview(data) {
  if (data === undefined || data === null || data === '') return '<span class="muted">No body</span>';
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return `<pre class="api-json-preview">${vendorEscapeHtml(text.length > 7000 ? text.slice(0, 7000) + '\n… truncated' : text)}</pre>`;
}

function vendorStatusBadge(result) {
  if (result.skipped) return '<span class="badge warning">Manual</span>';
  if (result.ok) return '<span class="badge success">OK</span>';
  return '<span class="badge danger">Error</span>';
}

function vendorResultCard(result, index) {
  const rows = result.count === null || result.count === undefined ? '—' : result.count;
  const methodClass = result.method === 'GET' ? 'success' : result.method === 'POST' ? 'warning' : 'neutral';
  return `<article class="glass-card api-check-card ${result.ok ? 'ok' : result.skipped ? 'skipped' : 'error'}">
    <div class="api-card-head">
      <div><span class="badge ${methodClass}">${vendorEscapeHtml(result.method)}</span><strong>${vendorEscapeHtml(result.vendor || result.group || 'Vendor')} · ${vendorEscapeHtml(result.label || result.path)}</strong></div>
      ${vendorStatusBadge(result)}
    </div>
    <div class="api-path">${vendorEscapeHtml(result.path)}</div>
    <div class="api-meta"><span>${vendorEscapeHtml(result.group || '')}</span><span>${result.skipped ? 'Manual only' : `${result.ms || 0} ms`}</span><span>Rows ${rows}</span><span>Status ${vendorEscapeHtml(result.status || '—')}</span></div>
    ${result.error ? `<p class="api-error">${vendorEscapeHtml(result.error)}</p>` : ''}
    ${result.notes ? `<p class="muted">${vendorEscapeHtml(result.notes)}</p>` : ''}
    ${result.sampleBody ? `<details><summary>Sample body</summary>${vendorJsonPreview(result.sampleBody)}</details>` : ''}
    ${!result.skipped ? `<details ${index === 0 ? 'open' : ''}><summary>Response</summary>${vendorJsonPreview(result.data ?? result.bodyText)}</details>` : ''}
  </article>`;
}

function renderVendorGroupSummary(results) {
  const groups = {};
  results.forEach(result => {
    const key = result.vendor || result.group || 'Vendor';
    groups[key] ||= { ok: 0, error: 0, skipped: 0 };
    if (result.skipped) groups[key].skipped += 1;
    else if (result.ok) groups[key].ok += 1;
    else groups[key].error += 1;
  });
  return Object.entries(groups).map(([group, counts]) => `<div class="data-row"><strong>${vendorEscapeHtml(group)}</strong><span>${counts.ok}</span><span>${counts.error}</span><span>${counts.skipped}</span></div>`).join('');
}

function buildVendorReport(results) {
  const ok = results.filter(r => r.ok).length;
  const errors = results.filter(r => !r.ok && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.ok && !r.skipped);
  return `FleetOS Vendor API backend check — ${new Date().toISOString()}\nFrontend source: ${FleetOSConfig.isLocalFrontend() ? 'Local proxy http://localhost:5050' : 'Vercel proxy'}\nAuthenticated: ${FleetOSAuth.isAuthenticated() ? 'yes' : 'no'}\nUser: ${(FleetOSAuth.getUser?.() || {}).username || '—'}\n\nSUMMARY\nOK: ${ok}\nErrors: ${errors}\nSkipped/manual: ${skipped}\n\nFAILED VENDOR ENDPOINTS\n${failed.length ? failed.map(r => `- ${r.vendor} | ${r.method} ${r.path} => ${r.status} ${r.statusText || r.error || ''}`).join('\n') : '- None'}\n\nALL CHECKED VENDOR ENDPOINTS\n${results.map(r => `- ${r.vendor} | ${r.group} | ${r.method} ${r.path} | ${r.skipped ? 'MANUAL' : r.ok ? 'OK' : 'ERROR'} | status=${r.status || '-'} | rows=${r.count ?? '-'} | time=${r.ms || 0}ms`).join('\n')}\n\nNOTE\nOnly safe vendor status/read endpoints are checked automatically. Token refresh, logout, raw passthrough and control/write actions are manual only.`;
}

function renderVendorApiConsole() {
  const catalog = FleetOSVendorAPI.endpointCatalog;
  const catalogRows = catalog.map(item => `<div class="data-row">
    <div><strong><span class="badge ${item.method === 'GET' ? 'success' : 'warning'}">${vendorEscapeHtml(item.method)}</span> ${vendorEscapeHtml(item.label)}</strong><small>${vendorEscapeHtml(item.notes || '')}</small></div>
    <span><code>${vendorEscapeHtml(item.path)}</code></span>
    <span>${vendorEscapeHtml(item.vendor)}</span>
    <span>${item.safe ? '<span class="badge success">Auto safe</span>' : '<span class="badge warning">Manual only</span>'}</span>
  </div>`).join('');

  return `<section class="page-hero">
    <div>
      <p class="eyebrow">Vendor Swagger Diagnostics</p>
      <h1>Vendor API Console</h1>
      <p class="muted">Checks DeyeCloud, Huawei and Solarx vendor endpoints through the same Bearer token and proxy path used by FleetOS UI. Safe read/status endpoints run automatically; token, logout, raw and control endpoints are manual only.</p>
    </div>
    <button class="create-action" id="runVendorChecks" type="button"><span class="pulse"></span><div><strong>Run vendor checks</strong><small>Safe endpoints only</small></div></button>
  </section>

  <section class="context-bar glass-card">
    <button class="ctx-item"><span>Auth</span><strong>${FleetOSAuth.isAuthenticated() ? 'Bearer token found' : 'No token'}</strong></button>
    <button class="ctx-item"><span>API Base</span><strong>${vendorEscapeHtml(FleetOSConfig.apiBaseUrl || '/api via Vercel')}</strong></button>
    <button class="ctx-item"><span>Mode</span><strong>${FleetOSConfig.isLocalFrontend() ? 'Local proxy' : 'Vercel proxy'}</strong></button>
    <button class="ctx-item"><span>Vendors</span><strong>DeyeCloud · Huawei · Solarx</strong></button>
  </section>

  <section class="panel glass-card">
    <div class="panel-head">
      <div><h2>Safe Vendor Endpoint Health</h2><p>Automatic check for vendor endpoints that are read/status oriented. Some GET endpoints may still return errors if backend requires provider-specific filters or configured credentials.</p></div>
      <div class="toolbar"><button class="secondary-action" id="copyVendorReport" type="button">Copy vendor report</button><button class="secondary-action" id="clearVendorResults" type="button">Clear</button></div>
    </div>
    <div id="vendorConsoleStatus" class="empty-state"><strong>Ready</strong><small>Click Run vendor checks after login as globaladmin.</small></div>
    <div class="data-table compact-table api-method-table" id="vendorGroupSummary" style="display:none"><div class="data-head"><span>Vendor</span><span>OK</span><span>Errors</span><span>Manual</span></div></div>
    <div id="vendorConsoleResults" class="api-check-grid"></div>
    <textarea id="vendorReportOutput" class="hidden" aria-label="Vendor backend report"></textarea>
  </section>

  <section class="panel glass-card">
    <div class="panel-head"><div><h2>Vendor Manual Request Runner</h2><p>Use this for token refresh, control commands, raw requests, or vendor endpoints that require IDs/filters. It uses the current FleetOS Bearer token and proxy.</p></div></div>
    <div class="form-grid three-cols">
      <label>Method
        <select id="vendorManualMethod"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select>
      </label>
      <label class="span-2">Path
        <input id="vendorManualPath" value="/api/Solarx/auth/token/status" />
      </label>
    </div>
    <label>JSON Body
      <textarea id="vendorManualBody" rows="8" placeholder='{ "example": true }'></textarea>
    </label>
    <div class="toolbar"><button class="create-action" id="runVendorManual" type="button">Run manual vendor request</button><button class="secondary-action" id="clearVendorManual" type="button">Clear manual result</button></div>
    <div id="vendorManualResult" class="api-check-grid"></div>
  </section>

  <section class="panel glass-card">
    <div class="panel-head"><div><h2>Vendor Endpoint Catalog</h2><p>Complete vendor endpoint catalog from Swagger for DeyeCloud, Huawei and Solarx. Control/write endpoints stay manual.</p></div></div>
    <div class="data-table compact-table api-method-table">
      <div class="data-head"><span>Endpoint</span><span>Path</span><span>Vendor</span><span>Mode</span></div>
      ${catalogRows}
    </div>
  </section>`;
}

async function wireVendorApiConsole() {
  const status = document.getElementById('vendorConsoleStatus');
  const resultsEl = document.getElementById('vendorConsoleResults');
  const groupEl = document.getElementById('vendorGroupSummary');
  const manualEl = document.getElementById('vendorManualResult');

  async function run() {
    if (!status || !resultsEl) return;
    status.innerHTML = '<strong>Checking vendor APIs...</strong><small>Running safe vendor endpoints through proxy.</small>';
    resultsEl.innerHTML = '';
    groupEl.style.display = 'none';
    fleetosVendorResults = await FleetOSVendorAPI.checkCatalog({ includeUnsafe: false });
    fleetosVendorReport = buildVendorReport(fleetosVendorResults);
    const ok = fleetosVendorResults.filter(r => r.ok).length;
    const errors = fleetosVendorResults.filter(r => !r.ok && !r.skipped).length;
    status.innerHTML = `<strong>Vendor check complete</strong><small>${ok} OK · ${errors} error(s). Manual/control endpoints not auto-run.</small>`;
    groupEl.style.display = '';
    groupEl.innerHTML = '<div class="data-head"><span>Vendor</span><span>OK</span><span>Errors</span><span>Manual</span></div>' + renderVendorGroupSummary(fleetosVendorResults);
    resultsEl.innerHTML = fleetosVendorResults.map(vendorResultCard).join('');
  }

  async function runManual() {
    const method = document.getElementById('vendorManualMethod')?.value || 'GET';
    const path = (document.getElementById('vendorManualPath')?.value || '').trim();
    const bodyText = (document.getElementById('vendorManualBody')?.value || '').trim();
    if (!manualEl) return;
    if (!path || !path.startsWith('/api/')) {
      manualEl.innerHTML = '<article class="glass-card api-check-card"><p class="api-error">Path must start with /api/.</p></article>';
      return;
    }
    let body;
    if (bodyText) {
      try { body = JSON.parse(bodyText); } catch (error) {
        manualEl.innerHTML = `<article class="glass-card api-check-card"><p class="api-error">Invalid JSON body: ${vendorEscapeHtml(error.message)}</p></article>`;
        return;
      }
    }
    manualEl.innerHTML = '<article class="glass-card api-check-card"><strong>Running vendor request...</strong></article>';
    const result = await FleetOSVendorAPI.request(path, { method, body });
    result.label = 'Manual Vendor Request';
    result.vendor = path.includes('/DeyeCloud/') ? 'DeyeCloud' : path.includes('/Huawei/') ? 'Huawei' : path.includes('/Solarx/') ? 'Solarx' : 'Vendor';
    result.group = 'Manual';
    result.notes = 'Manual request executed through FleetOS proxy and current Bearer token.';
    manualEl.innerHTML = vendorResultCard(result, 0);
  }

  document.getElementById('runVendorChecks')?.addEventListener('click', run);
  document.getElementById('clearVendorResults')?.addEventListener('click', () => {
    fleetosVendorResults = [];
    fleetosVendorReport = '';
    if (status) status.innerHTML = '<strong>Ready</strong><small>Click Run vendor checks after login as globaladmin.</small>';
    if (resultsEl) resultsEl.innerHTML = '';
    if (groupEl) groupEl.style.display = 'none';
  });
  document.getElementById('copyVendorReport')?.addEventListener('click', async () => {
    const text = fleetosVendorReport || buildVendorReport(fleetosVendorResults || []);
    document.getElementById('vendorReportOutput').value = text;
    try { await navigator.clipboard.writeText(text); alert('Vendor backend report copied.'); }
    catch (error) { alert('Copy failed. The report is available in the hidden textarea.'); }
  });
  document.getElementById('runVendorManual')?.addEventListener('click', runManual);
  document.getElementById('clearVendorManual')?.addEventListener('click', () => { if (manualEl) manualEl.innerHTML = ''; });

  run();
}

window.renderVendorApiConsole = renderVendorApiConsole;
window.wireVendorApiConsole = wireVendorApiConsole;
