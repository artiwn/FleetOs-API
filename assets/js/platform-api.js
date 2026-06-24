/* FleetOS Platform/Admin API layer
   Scope: Swagger platform/admin endpoints only. Vendor-specific Huawei/Deye/SolarX endpoints are intentionally skipped. */
const FleetOSPlatformAPI = (() => {
  function qs(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.set(key, String(value));
    });
    const text = search.toString();
    return text ? `?${text}` : '';
  }

  function jsonOptions(method, body) {
    return {
      method,
      body: body === undefined ? undefined : JSON.stringify(body || {})
    };
  }

  function sourceLabel() {
    return FleetOSConfig.isLocalFrontend() ? 'Local proxy' : 'Vercel proxy';
  }

  function resolveApiUrl(path) {
    const base = FleetOSConfig.apiBaseUrl || '';
    return `${base}${path}`;
  }

  function authHeaders({ body, extraHeaders } = {}) {
    const headers = new Headers(extraHeaders || {});
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    if (body !== undefined && body !== null && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const token = FleetOSAuth.getAccessToken();
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  async function rawRequest(path, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const body = options.body;
    const started = performance.now();
    const headers = authHeaders({ body, extraHeaders: options.headers });
    let parsedBody = null;
    let responseText = '';
    try {
      const response = await fetch(resolveApiUrl(path), {
        method,
        headers,
        body: body === undefined || body === null || method === 'GET' || method === 'HEAD'
          ? undefined
          : (typeof body === 'string' ? body : JSON.stringify(body))
      });
      responseText = await response.text();
      try { parsedBody = responseText ? JSON.parse(responseText) : null; } catch (e) { parsedBody = responseText; }
      const ms = Math.round(performance.now() - started);
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText || '',
        ms,
        path,
        method,
        source: sourceLabel(),
        count: Array.isArray(parsedBody) ? parsedBody.length : parsedBody?.items?.length ?? parsedBody?.data?.length ?? null,
        data: parsedBody,
        bodyText: responseText,
        error: response.ok ? '' : `${response.statusText || 'Request failed'} (${response.status})`
      };
    } catch (error) {
      const ms = Math.round(performance.now() - started);
      return {
        ok: false,
        status: 0,
        statusText: 'Network/Fetch Error',
        ms,
        path,
        method,
        source: sourceLabel(),
        count: null,
        data: null,
        bodyText: '',
        error: error?.message || String(error)
      };
    }
  }

  const live = {
    plants: () => FleetAPI.request('/api/plants'),
    devices: () => FleetAPI.request('/api/devices'),
    alerts: () => FleetAPI.request('/api/alerts'),
    integrations: () => FleetAPI.request('/api/integrations'),
    providers: () => FleetAPI.request('/api/Providers')
  };

  const tenants = {
    list: () => FleetAPI.request('/api/admin/tenants'),
    get: (id) => FleetAPI.request(`/api/admin/tenants/${encodeURIComponent(id)}`),
    create: (payload) => FleetAPI.request('/api/admin/tenants', jsonOptions('POST', payload)),
    update: (id, payload) => FleetAPI.request(`/api/admin/tenants/${encodeURIComponent(id)}`, jsonOptions('PUT', payload)),
    activate: (id) => FleetAPI.request(`/api/admin/tenants/${encodeURIComponent(id)}/activate`, { method: 'POST' }),
    deactivate: (id) => FleetAPI.request(`/api/admin/tenants/${encodeURIComponent(id)}/deactivate`, { method: 'POST' }),
    archive: (id) => FleetAPI.request(`/api/admin/tenants/${encodeURIComponent(id)}/archive`, { method: 'POST' })
  };

  const clients = {
    list: () => FleetAPI.request('/api/admin/clients'),
    get: (id) => FleetAPI.request(`/api/admin/clients/${encodeURIComponent(id)}`),
    create: (payload) => FleetAPI.request('/api/admin/clients', jsonOptions('POST', payload)),
    update: (id, payload) => FleetAPI.request(`/api/admin/clients/${encodeURIComponent(id)}`, jsonOptions('PUT', payload)),
    updateStatus: (id, status) => FleetAPI.request(`/api/admin/clients/${encodeURIComponent(id)}/status`, jsonOptions('PATCH', { status }))
  };

  const plantRegistry = {
    list: () => FleetAPI.request('/api/admin/plants'),
    get: (id) => FleetAPI.request(`/api/admin/plants/${encodeURIComponent(id)}`),
    create: (payload) => FleetAPI.request('/api/admin/plants', jsonOptions('POST', payload)),
    update: (id, payload) => FleetAPI.request(`/api/admin/plants/${encodeURIComponent(id)}`, jsonOptions('PUT', payload)),
    updateStatus: (id, status) => FleetAPI.request(`/api/admin/plants/${encodeURIComponent(id)}/status`, jsonOptions('PATCH', { status }))
  };

  const providerIntegrations = {
    templates: () => FleetAPI.request('/api/admin/provider-integrations/templates'),
    template: (providerType) => FleetAPI.request(`/api/admin/provider-integrations/templates/${encodeURIComponent(providerType)}`),
    list: () => FleetAPI.request('/api/admin/provider-integrations'),
    get: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}`),
    create: (payload) => FleetAPI.request('/api/admin/provider-integrations', jsonOptions('POST', payload)),
    update: (id, payload) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}`, jsonOptions('PUT', payload)),
    validate: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/validate`, { method: 'POST' }),
    testConnection: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/test-connection`, { method: 'POST' }),
    testSampleData: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/test-sample-data`, { method: 'POST' }),
    activate: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/activate`, { method: 'POST' }),
    suspend: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/suspend`, { method: 'POST' }),
    archive: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/archive`, { method: 'POST' }),
    failed: (id) => FleetAPI.request(`/api/admin/provider-integrations/${encodeURIComponent(id)}/failed`, { method: 'POST' })
  };

  const operations = {
    runJob: (jobName) => FleetAPI.request(`/api/JobTrigger/run/${encodeURIComponent(jobName)}`, { method: 'POST' })
  };

  const endpointCatalog = [
    // Platform Live API — read-only normalized live data
    { group: 'Platform Live API', label: 'Live Plants', method: 'GET', path: '/api/plants', safe: true, used: true, notes: 'Returns normalized plant list. Safe automatic check.' },
    { group: 'Platform Live API', label: 'Live Devices', method: 'GET', path: '/api/devices', safe: true, used: true, notes: 'Returns normalized device list. Safe automatic check.' },
    { group: 'Platform Live API', label: 'Live Alerts', method: 'GET', path: '/api/alerts', safe: true, used: true, notes: 'Returns normalized alert list. Safe automatic check.' },
    { group: 'Platform Live API', label: 'Live Integrations', method: 'GET', path: '/api/integrations', safe: true, used: true, notes: 'Returns provider summary cards. Safe automatic check.' },
    { group: 'Platform Live API', label: 'Providers', method: 'GET', path: '/api/Providers', safe: true, used: true, notes: 'Returns provider registry. Safe automatic check.' },

    // Tenants — Global Admin tenant CRUD / lifecycle
    { group: 'Tenants', label: 'List Tenants', method: 'GET', path: '/api/admin/tenants', safe: true, used: true, notes: 'Global Admin tenant list. Currently expected to expose backend readiness.' },
    { group: 'Tenants', label: 'Create Tenant', method: 'POST', path: '/api/admin/tenants', safe: false, used: false, notes: 'Manual only. Creates tenant using TenantProvisioningDto.' },
    { group: 'Tenants', label: 'Get Tenant by ID', method: 'GET', path: '/api/admin/tenants/{id}', safe: false, used: false, notes: 'Manual only. Requires tenant UUID.' },
    { group: 'Tenants', label: 'Update Tenant', method: 'PUT', path: '/api/admin/tenants/{id}', safe: false, used: false, notes: 'Manual only. Requires tenant UUID and TenantProvisioningDto.' },
    { group: 'Tenants', label: 'Activate Tenant', method: 'POST', path: '/api/admin/tenants/{id}/activate', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },
    { group: 'Tenants', label: 'Deactivate Tenant', method: 'POST', path: '/api/admin/tenants/{id}/deactivate', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },
    { group: 'Tenants', label: 'Archive Tenant', method: 'POST', path: '/api/admin/tenants/{id}/archive', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },

    // Clients — Global Admin client CRUD / status
    { group: 'Clients', label: 'List Clients', method: 'GET', path: '/api/admin/clients', safe: true, used: true, notes: 'Client registry list. Currently expected to expose backend readiness.' },
    { group: 'Clients', label: 'Create Client', method: 'POST', path: '/api/admin/clients', safe: false, used: false, notes: 'Manual only. Creates client using ClientProvisioningDto.' },
    { group: 'Clients', label: 'Get Client by ID', method: 'GET', path: '/api/admin/clients/{id}', safe: false, used: false, notes: 'Manual only. Requires client UUID.' },
    { group: 'Clients', label: 'Update Client', method: 'PUT', path: '/api/admin/clients/{id}', safe: false, used: false, notes: 'Manual only. Requires client UUID and ClientProvisioningDto.' },
    { group: 'Clients', label: 'Update Client Status', method: 'PATCH', path: '/api/admin/clients/{id}/status', safe: false, used: false, notes: 'Manual only. Requires client UUID and status body.' },

    // PlantRegistry — Global Admin plant registry CRUD / status
    { group: 'PlantRegistry', label: 'List Admin Plants', method: 'GET', path: '/api/admin/plants', safe: true, used: true, notes: 'PlantRegistry list endpoint. Currently expected to expose backend readiness.' },
    { group: 'PlantRegistry', label: 'Create Admin Plant', method: 'POST', path: '/api/admin/plants', safe: false, used: false, notes: 'Manual only. Creates plant using PlantProvisioningDto.' },
    { group: 'PlantRegistry', label: 'Get Admin Plant by ID', method: 'GET', path: '/api/admin/plants/{id}', safe: false, used: false, notes: 'Manual only. Requires plant UUID.' },
    { group: 'PlantRegistry', label: 'Update Admin Plant', method: 'PUT', path: '/api/admin/plants/{id}', safe: false, used: false, notes: 'Manual only. Requires plant UUID and PlantProvisioningDto.' },
    { group: 'PlantRegistry', label: 'Update Admin Plant Status', method: 'PATCH', path: '/api/admin/plants/{id}/status', safe: false, used: false, notes: 'Manual only. Requires plant UUID and status body.' },

    // ProviderIntegrations — provider templates, integration CRUD and lifecycle/test actions
    { group: 'ProviderIntegrations', label: 'List Provider Templates', method: 'GET', path: '/api/admin/provider-integrations/templates', safe: true, used: true, notes: 'Returns available provider template names. Safe automatic check.' },
    { group: 'ProviderIntegrations', label: 'Provider Template by Type', method: 'GET', path: '/api/admin/provider-integrations/templates/{providerType}', safe: false, used: false, notes: 'Manual only. Requires provider type, for example DeyeCloud or Solarx.' },
    { group: 'ProviderIntegrations', label: 'Provider Template — DeyeCloud', method: 'GET', path: '/api/admin/provider-integrations/templates/DeyeCloud', safe: true, used: true, notes: 'Concrete template detail. Safe automatic check.' },
    { group: 'ProviderIntegrations', label: 'Provider Template — Solarx', method: 'GET', path: '/api/admin/provider-integrations/templates/Solarx', safe: true, used: true, notes: 'Concrete template detail. Safe automatic check.' },
    { group: 'ProviderIntegrations', label: 'List Provider Integrations', method: 'GET', path: '/api/admin/provider-integrations', safe: true, used: true, notes: 'Provider integration registry list. Currently expected to expose backend readiness.' },
    { group: 'ProviderIntegrations', label: 'Create Provider Integration', method: 'POST', path: '/api/admin/provider-integrations', safe: false, used: false, notes: 'Manual only. Creates provider integration using SaveProviderIntegrationRequest.' },
    { group: 'ProviderIntegrations', label: 'Get Provider Integration by ID', method: 'GET', path: '/api/admin/provider-integrations/{id}', safe: false, used: false, notes: 'Manual only. Requires provider integration UUID.' },
    { group: 'ProviderIntegrations', label: 'Update Provider Integration', method: 'PUT', path: '/api/admin/provider-integrations/{id}', safe: false, used: false, notes: 'Manual only. Requires provider integration UUID and SaveProviderIntegrationRequest.' },
    { group: 'ProviderIntegrations', label: 'Validate Provider Integration', method: 'POST', path: '/api/admin/provider-integrations/{id}/validate', safe: false, used: false, notes: 'Manual only. Requires provider integration UUID.' },
    { group: 'ProviderIntegrations', label: 'Test Provider Connection', method: 'POST', path: '/api/admin/provider-integrations/{id}/test-connection', safe: false, used: false, notes: 'Manual only. Requires provider integration UUID.' },
    { group: 'ProviderIntegrations', label: 'Test Provider Sample Data', method: 'POST', path: '/api/admin/provider-integrations/{id}/test-sample-data', safe: false, used: false, notes: 'Manual only. Requires provider integration UUID.' },
    { group: 'ProviderIntegrations', label: 'Activate Provider Integration', method: 'POST', path: '/api/admin/provider-integrations/{id}/activate', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },
    { group: 'ProviderIntegrations', label: 'Suspend Provider Integration', method: 'POST', path: '/api/admin/provider-integrations/{id}/suspend', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },
    { group: 'ProviderIntegrations', label: 'Archive Provider Integration', method: 'POST', path: '/api/admin/provider-integrations/{id}/archive', safe: false, used: false, notes: 'Manual only. Lifecycle write action.' },
    { group: 'ProviderIntegrations', label: 'Mark Provider Integration Failed', method: 'POST', path: '/api/admin/provider-integrations/{id}/failed', safe: false, used: false, notes: 'Manual only. Lifecycle/error-state write action.' },

    // Platform Operations — operational trigger, manual only
    { group: 'Platform Operations', label: 'Run Job Trigger', method: 'POST', path: '/api/JobTrigger/run/{jobName}', safe: false, used: false, notes: 'Manual only. Requires jobName and can trigger server job.' }
  ];

  async function checkCatalog({ includeUnsafe = false } = {}) {
    const checks = endpointCatalog.filter(item => item.safe || includeUnsafe);
    const results = [];
    for (const endpoint of checks) {
      if (!endpoint.safe) {
        results.push({ ...endpoint, ok: false, skipped: true, status: 'Skipped', statusText: 'Skipped', ms: 0, count: null, data: null, error: 'Unsafe/write endpoint. Use Manual Request Runner.' });
        continue;
      }
      const result = await rawRequest(endpoint.path, { method: endpoint.method });
      results.push({ ...endpoint, ...result });
    }
    return results;
  }

  async function checkAllReadEndpoints() {
    return checkCatalog({ includeUnsafe: false });
  }

  return {
    live,
    tenants,
    clients,
    plantRegistry,
    providerIntegrations,
    operations,
    endpointCatalog,
    checkCatalog,
    checkAllReadEndpoints,
    rawRequest,
    qs
  };
})();

window.FleetOSPlatformAPI = FleetOSPlatformAPI;
