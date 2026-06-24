/* FleetOS live API UI bridge
   Uses working Swagger endpoints as primary data source when they return records.
   If an endpoint returns [] or fails, the existing mock/localStorage data remains as fallback. */
(function () {
  const SOURCE_LABEL = 'Live API';

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.data)) return value.data;
    return [];
  }

  function safeText(value, fallback = '—') {
    return value === undefined || value === null || value === '' ? fallback : String(value);
  }

  function fmtDate(value, fallback = 'No data') {
    if (!value) return fallback;
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return String(value);
    }
  }

  function badge(status) {
    const value = String(status || '').toLowerCase();
    if (value.includes('ok') || value.includes('active') || value.includes('online') || value.includes('normal')) return 'success';
    if (value.includes('fail') || value.includes('fault') || value.includes('offline') || value.includes('critical')) return 'danger';
    if (value.includes('warn') || value.includes('unknown') || value.includes('stale') || value.includes('delayed')) return 'warning';
    return 'neutral';
  }

  function insertBanner(message, mode = 'info') {
    const main = document.querySelector('.main-content');
    if (!main || document.querySelector('.live-api-banner')) return;
    const div = document.createElement('div');
    div.className = `live-api-banner ${mode}`;
    div.innerHTML = `<strong>${mode === 'success' ? 'Live data enabled' : 'Mock fallback active'}</strong><span>${message}</span>`;
    const first = main.querySelector('.page-hero')?.nextSibling;
    if (first) main.insertBefore(div, first);
    else main.prepend(div);
  }

  function insertIntegrationLiveSummary(items = []) {
    const main = document.querySelector('.main-content');
    if (!main || document.querySelector('.integration-live-summary')) return;
    const rows = items.map(item => `
      <article>
        <span>${safeText(item.label, 'Endpoint')}</span>
        <strong>${safeText(item.value, '—')}</strong>
        <small>${safeText(item.meta, '')}</small>
      </article>`).join('');
    const section = document.createElement('section');
    section.className = 'integration-live-summary glass-card';
    section.innerHTML = `
      <div>
        <p class="eyebrow">Backend live source</p>
        <h3>Connected API snapshot</h3>
      </div>
      <div class="integration-live-summary-grid">${rows}</div>`;
    const context = main.querySelector('.context-bar');
    if (context && context.nextSibling) main.insertBefore(section, context.nextSibling);
    else main.appendChild(section);
  }


  function sum(values) {
    return values.reduce((acc, value) => acc + Number(value || 0), 0);
  }

  function compactNumber(value, suffix = '') {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return `0${suffix}`;
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k${suffix}`;
    return `${n}${suffix}`;
  }

  function snapshotFromLive({ plants = [], devices = [], alerts = [], integrations = [], providers = [], templates = [] }) {
    const plantCount = plants.length || sum(integrations.map(x => x.plantsCount));
    const deviceCount = devices.length || sum(integrations.map(x => x.devicesCount));
    const alertCount = alerts.length || sum(integrations.map(x => x.alertsCount));
    const currentPowerKw = sum(plants.map(x => x.currentPowerKw));
    const liveProviderNames = integrations.map(x => x.displayName || x.provider).filter(Boolean);
    const providerNames = providers.length ? providers : liveProviderNames;
    const staleCount = sum(integrations.map(x => x.stalePlantsCount));
    const errorRate = integrations.length ? (sum(integrations.map(x => x.errorRatePct)) / integrations.length) : 0;
    return {
      plantCount,
      deviceCount,
      alertCount,
      currentPowerKw,
      providerNames,
      staleCount,
      errorRate,
      integrationCount: integrations.length,
      templateCount: templates.length
    };
  }

  function applyOverviewMockFromLive(payload) {
    if (!window.FleetOSMock) return;
    const snap = snapshotFromLive(payload);
    const currentPowerText = snap.currentPowerKw > 0 ? `${(snap.currentPowerKw / 1000).toFixed(2)} MW` : '0 kW';
    FleetOSMock.kpis = [
      { label: 'Live Providers', value: String(snap.providerNames.length || snap.integrationCount), delta: snap.providerNames.join(', ') || 'No provider names', icon: '🔗', tone: 'cyan', route: 'integrations' },
      { label: 'Plants', value: compactNumber(snap.plantCount), delta: `Live endpoint rows: ${payload.plants.length}`, icon: '🏭', tone: 'green', route: 'plants' },
      { label: 'Devices', value: compactNumber(snap.deviceCount), delta: `Live endpoint rows: ${payload.devices.length}`, icon: '🔌', tone: 'blue', route: 'devices' },
      { label: 'Live Power', value: currentPowerText, delta: '/api/plants aggregate', icon: '⚡', tone: 'yellow', route: 'telemetry' },
      { label: 'Active Incidents', value: compactNumber(snap.alertCount), delta: `Live endpoint rows: ${payload.alerts.length}`, icon: '🚨', tone: 'red', route: 'alerts' },
      { label: 'Templates', value: compactNumber(snap.templateCount), delta: 'Provider integration templates', icon: '🧩', tone: 'violet', route: 'integrations' }
    ];

    if (payload.integrations.length) {
      FleetOSMock.integrations = payload.integrations.map(row => ({
        name: safeText(row.displayName, safeText(row.provider, 'Provider')),
        status: safeText(row.status, 'Unknown'),
        sync: safeText(row.lastSyncText, fmtDate(row.lastSyncAtUtc)),
        errors: Number(row.vendorExtensions?.errorsCount || row.errorRatePct || 0)
      }));
    }

    if (payload.alerts.length) {
      FleetOSMock.alerts = payload.alerts.slice(0, 6).map(row => ({
        title: safeText(row.title, 'Live Alert'),
        tenant: 'Backend Live API',
        plant: safeText(row.plantName, safeText(row.sourcePlantId, 'Unknown Plant')),
        severity: safeText(row.severity, 'Unknown'),
        time: fmtDate(row.occurredAtUtc, 'No occurrence time')
      }));
    }

    FleetOSMock.quality = [
      { label: 'Providers', value: String(snap.providerNames.length || snap.integrationCount) },
      { label: 'Templates', value: String(snap.templateCount) },
      { label: 'Stale Plants', value: String(snap.staleCount) },
      { label: 'Avg Error Rate', value: `${snap.errorRate.toFixed(1)}%` }
    ];
  }

  function integrationVendor(provider) {
    const p = String(provider || '').trim();
    if (/deye/i.test(p)) return 'DeyeCloud';
    if (/solax/i.test(p)) return 'SolaX';
    return p || 'Unknown';
  }

  function integrationSoftware(provider) {
    const p = integrationVendor(provider);
    if (/deye/i.test(p)) return 'DeyeCloud';
    if (/solax/i.test(p)) return 'SolaX Cloud';
    return p;
  }

  function ensureVendorTemplateAliases() {
    try {
      if (typeof vendorTemplates === 'undefined') return;
      if (vendorTemplates.Deye && !vendorTemplates.DeyeCloud) {
        vendorTemplates.DeyeCloud = { ...vendorTemplates.Deye, software: 'DeyeCloud', scope: 'Backend provider template / live integration summary' };
      }
      if (vendorTemplates.DeyeCloud && !vendorTemplates.Deye) {
        vendorTemplates.Deye = { ...vendorTemplates.DeyeCloud, software: 'DeyeCloud', scope: 'Backend provider template / live integration summary' };
      }
      if (vendorTemplates.SolaX && !vendorTemplates.Solarx) {
        vendorTemplates.Solarx = { ...vendorTemplates.SolaX, software: 'SolaX Cloud', scope: 'Backend provider template / live integration summary' };
      }
      if (vendorTemplates.Solarx && !vendorTemplates.SolaX) {
        vendorTemplates.SolaX = { ...vendorTemplates.Solarx, software: 'SolaX Cloud', scope: 'Backend provider template / live integration summary' };
      }
    } catch (e) {}
  }

  function mapIntegration(row, index) {
    const provider = integrationVendor(row.provider || row.displayName);
    const status = safeText(row.status, 'Unknown');
    return {
      id: `LIVE-${provider}-${index + 1}`,
      code: `LIVE-${provider.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
      name: safeText(row.displayName, provider),
      tenant: 'Backend Live API',
      vendor: provider,
      software: integrationSoftware(provider),
      status,
      health: status,
      auth: 'Backend managed',
      discovery: row.plantsCount > 0 ? 'Completed' : 'No plant data',
      plants: Number(row.plantsCount || 0),
      devices: Number(row.devicesCount || 0),
      metrics: Number(row.vendorExtensions?.metricsCount || 0),
      alerts: Number(row.alertsCount || 0),
      lastSync: safeText(row.lastSyncText, fmtDate(row.lastSyncAtUtc)),
      assignedTenants: 'Global',
      activeIntegrations: Number(row.plantsWithDataCount || 0),
      version: 'Backend live',
      apiVersion: 'Swagger v1',
      mappingVersion: 'Normalized live summary',
      authType: 'Server-side connector auth',
      discoveryEnabled: 'Yes',
      baseUrl: 'Managed by backend',
      createdBy: 'Backend',
      createdAt: '—',
      updatedBy: 'Backend',
      updatedAt: fmtDate(row.lastSyncAtUtc, 'No sync'),
      lastActivity: safeText(row.lastSyncText, 'No data'),
      lastSuccessfulSync: safeText(row.lastSyncText, 'No data'),
      vendorName: safeText(row.displayName, provider),
      lastErrorMessage: safeText(row.lastErrorMessage, ''),
      vendorExtensions: row.vendorExtensions || {}
    };
  }

  function mapPlant(row, index) {
    const provider = safeText(row.provider, 'Backend');
    const name = safeText(row.name, `Live Plant ${index + 1}`);
    const powerKw = Number(row.currentPowerKw || 0);
    const installedKw = Number(row.installedPowerKw || 0);
    return {
      id: safeText(row.id, `LIVE-PLANT-${index + 1}`),
      externalId: safeText(row.sourcePlantId, '—'),
      code: safeText(row.sourcePlantId, `LIVE-PLT-${index + 1}`),
      name,
      tenant: 'Backend Live API',
      portfolio: provider,
      integration: `${provider} live integration`,
      vendor: provider,
      status: safeText(row.status, 'Unknown'),
      type: 'Solar Plant',
      country: safeText(row.vendorExtensions?.country, '—'),
      region: safeText(row.vendorExtensions?.region, '—'),
      city: safeText(row.vendorExtensions?.city, '—'),
      address: safeText(row.vendorExtensions?.address, '—'),
      lat: safeText(row.vendorExtensions?.latitude, '—'),
      lng: safeText(row.vendorExtensions?.longitude, '—'),
      timezone: safeText(row.vendorExtensions?.timezone, '—'),
      capacityDc: installedKw ? Number((installedKw / 1000).toFixed(2)) : 0,
      capacityAc: installedKw ? Number((installedKw / 1000).toFixed(2)) : 0,
      gridCapacity: installedKw ? Number((installedKw / 1000).toFixed(2)) : 0,
      panels: 0,
      inverters: 0,
      strings: 0,
      transformers: 0,
      meters: 0,
      battery: 'Unknown',
      devices: Number(row.vendorExtensions?.devicesCount || 0),
      alerts: Number(row.vendorExtensions?.alertsCount || 0),
      livePower: powerKw ? `${(powerKw / 1000).toFixed(2)} MW` : '0 kW',
      today: row.todayEnergyKwh ? `${Number(row.todayEnergyKwh).toFixed(1)} kWh` : '0 kWh',
      month: '—',
      pr: '—',
      lastData: fmtDate(row.lastDataAt, 'No live data'),
      freshness: safeText(row.dataQualityStatus, 'Unknown'),
      commissioned: '—',
      owner: '—',
      operator: '—',
      om: '—',
      totalEnergy: row.totalEnergyKwh
    };
  }

  function mapDevice(row, index) {
    const provider = safeText(row.provider, 'Backend');
    return {
      id: safeText(row.id, `LIVE-DEVICE-${index + 1}`),
      externalId: safeText(row.sourceDeviceId, '—'),
      name: safeText(row.name, `Live Device ${index + 1}`),
      type: safeText(row.deviceType, 'Device'),
      subtype: safeText(row.vendorExtensions?.subtype, 'Backend live record'),
      manufacturer: provider,
      model: safeText(row.vendorExtensions?.model, '—'),
      serial: safeText(row.serialNumber, '—'),
      firmware: safeText(row.vendorExtensions?.firmware, '—'),
      ip: safeText(row.vendorExtensions?.ip, '—'),
      mac: safeText(row.vendorExtensions?.mac, '—'),
      plantId: safeText(row.sourcePlantId, '—'),
      plant: safeText(row.plantName, 'Unknown Plant'),
      tenant: 'Backend Live API',
      vendor: provider,
      integration: `${provider} live integration`,
      status: safeText(row.status, 'Unknown'),
      lifecycle: 'Active',
      capacity: safeText(row.vendorExtensions?.capacity, '—'),
      installation: '—',
      warranty: '—',
      lastSeen: fmtDate(row.lastSeenAt, 'No live data'),
      alerts: Number(row.vendorExtensions?.alertsCount || 0),
      power: safeText(row.vendorExtensions?.power, '—'),
      voltage: safeText(row.vendorExtensions?.voltage, '—'),
      current: safeText(row.vendorExtensions?.current, '—'),
      temperature: safeText(row.vendorExtensions?.temperature, '—'),
      sourceStatus: safeText(row.dataQualityStatus, 'Live API'),
      parent: safeText(row.vendorExtensions?.parent, '—'),
      children: safeText(row.vendorExtensions?.children, '—')
    };
  }

  function mapAlert(row, index) {
    const provider = safeText(row.provider, 'Backend');
    const severity = safeText(row.severity, 'Unknown');
    return {
      id: safeText(row.id, `LIVE-ALERT-${index + 1}`),
      fleetCode: safeText(row.vendorExtensions?.fleetCode, ''),
      vendorRawCode: safeText(row.sourceAlertId, ''),
      vendorCode: safeText(row.sourceAlertId, ''),
      vendorMessage: safeText(row.message, ''),
      severity,
      priority: severity === 'Critical' ? 'P1' : severity === 'Warning' ? 'P2' : 'P3',
      title: safeText(row.title, 'Live Alert'),
      status: safeText(row.status, 'Open'),
      category: safeText(row.vendorExtensions?.category, 'Backend Live API'),
      tenant: 'Backend Live API',
      plantId: safeText(row.sourcePlantId, '—'),
      plant: safeText(row.plantName, 'Unknown Plant'),
      deviceId: safeText(row.sourceDeviceId, '—'),
      device: safeText(row.deviceName, 'Unknown Device'),
      deviceType: safeText(row.vendorExtensions?.deviceType, 'Device'),
      vendor: provider,
      source: provider,
      integration: `${provider} live integration`,
      created: fmtDate(row.occurredAtUtc, 'No occurrence time'),
      updated: fmtDate(row.lastSyncAt, 'No sync'),
      age: 'Live API',
      sla: '—',
      owner: 'Unassigned',
      telemetry: safeText(row.vendorExtensions?.telemetry, '—'),
      description: safeText(row.message, safeText(row.title, 'Live backend alert')),
      probableCause: safeText(row.vendorExtensions?.probableCause, 'No backend probable cause provided.'),
      recommendation: safeText(row.vendorExtensions?.recommendation, 'Review source data and assign a responsible operator if needed.'),
      timeline: [
        `${fmtDate(row.occurredAtUtc, 'Unknown time')} · Alert received from ${provider}`,
        `${fmtDate(row.lastSyncAt, 'Unknown sync')} · Last synchronized with FleetOS`
      ],
      related: { telemetryMetric: '—', caseId: '—', taskId: '—' }
    };
  }


  async function applyOverview() {
    if (!/(^|\/)index\.html$/.test(location.pathname) && !/\/$/.test(location.pathname)) return;
    try {
      const [plantsResult, devicesResult, alertsResult, integrationsResult, providersResult, templatesResult] = await Promise.allSettled([
        FleetOSPlatformAPI.live.plants(),
        FleetOSPlatformAPI.live.devices(),
        FleetOSPlatformAPI.live.alerts(),
        FleetOSPlatformAPI.live.integrations(),
        FleetOSPlatformAPI.live.providers(),
        FleetOSPlatformAPI.providerIntegrations.templates()
      ]);
      const payload = {
        plants: plantsResult.status === 'fulfilled' ? asArray(plantsResult.value) : [],
        devices: devicesResult.status === 'fulfilled' ? asArray(devicesResult.value) : [],
        alerts: alertsResult.status === 'fulfilled' ? asArray(alertsResult.value) : [],
        integrations: integrationsResult.status === 'fulfilled' ? asArray(integrationsResult.value) : [],
        providers: providersResult.status === 'fulfilled' ? asArray(providersResult.value) : [],
        templates: templatesResult.status === 'fulfilled' ? asArray(templatesResult.value) : []
      };
      const hasAnyLiveSignal = payload.plants.length || payload.devices.length || payload.alerts.length || payload.integrations.length || payload.providers.length || payload.templates.length;
      if (!hasAnyLiveSignal) {
        insertBanner('All checked live endpoints returned empty data or failed. Overview keeps mock fallback.', 'warning');
        return;
      }
      applyOverviewMockFromLive(payload);
      if (typeof renderOverview === 'function' && typeof wireOverview === 'function') {
        FleetLayout.mount(renderOverview());
        wireOverview();
      }
      insertBanner('Overview is using working live API endpoints. Empty live arrays keep mock context where backend has no rows yet.', 'success');
      insertIntegrationLiveSummary([
        { label: '/api/integrations', value: `${payload.integrations.length} row(s)`, meta: payload.integrations.map(x => x.displayName || x.provider).filter(Boolean).join(', ') || 'No integration rows' },
        { label: '/api/plants · /devices · /alerts', value: `${payload.plants.length}/${payload.devices.length}/${payload.alerts.length}`, meta: 'Live rows returned by platform endpoints' },
        { label: '/api/Providers · templates', value: `${payload.providers.length}/${payload.templates.length}`, meta: [...payload.providers, ...payload.templates].join(', ') || 'No provider/template rows' }
      ]);
    } catch (error) {
      insertBanner(`Overview live layer failed: ${error?.message || error}. Mock dashboard remains visible.`, 'warning');
    }
  }

  async function applyIntegrations() {
    if (!/integrations\.html$/.test(location.pathname)) return;
    ensureVendorTemplateAliases();
    try {
      const [integrationResult, providersResult, templatesResult] = await Promise.allSettled([
        FleetOSPlatformAPI.live.integrations(),
        FleetOSPlatformAPI.live.providers(),
        FleetOSPlatformAPI.providerIntegrations.templates()
      ]);
      const data = integrationResult.status === 'fulfilled' ? asArray(integrationResult.value) : [];
      const providers = providersResult.status === 'fulfilled' ? asArray(providersResult.value) : [];
      const templates = templatesResult.status === 'fulfilled' ? asArray(templatesResult.value) : [];

      if (!data.length) {
        insertBanner('/api/integrations returned no records, so the prototype keeps mock connector data.', 'warning');
        if (providers.length || templates.length) {
          insertIntegrationLiveSummary([
            { label: '/api/Providers', value: `${providers.length} provider(s)`, meta: providers.join(', ') || 'No providers' },
            { label: '/api/admin/provider-integrations/templates', value: `${templates.length} template(s)`, meta: templates.join(', ') || 'No templates' }
          ]);
        }
        return;
      }

      // Important: live API data is applied only to the current rendered view.
      // We intentionally do not call saveInts() here, so backend snapshots do not overwrite local mock/demo data in localStorage.
      integrations = data.map(mapIntegration);
      FleetLayout.mount(renderIntegrations());
      wireIntegrations();
      insertBanner(`/api/integrations returned ${data.length} live connector record(s). Mock data is preserved as fallback and was not overwritten.`, 'success');
      insertIntegrationLiveSummary([
        { label: '/api/integrations', value: `${data.length} live connector(s)`, meta: data.map(x => x.displayName || x.provider).filter(Boolean).join(', ') || 'No names' },
        { label: '/api/Providers', value: `${providers.length} provider(s)`, meta: providers.join(', ') || 'Endpoint empty or unavailable' },
        { label: '/api/admin/provider-integrations/templates', value: `${templates.length} template(s)`, meta: templates.join(', ') || 'Endpoint empty or unavailable' }
      ]);
    } catch (error) {
      insertBanner(`/api/integrations failed: ${error?.message || error}. Mock connector data is still visible.`, 'warning');
    }
  }

  async function applyPlants() {
    if (!/plants\.html$/.test(location.pathname)) return;
    try {
      const data = asArray(await FleetOSPlatformAPI.live.plants());
      if (!data.length) {
        insertBanner('/api/plants returned an empty array. Showing mock Plant Registry fallback.', 'warning');
        return;
      }
      window.FleetOSLivePlants = data.map(mapPlant);
      FleetLayout.mount(renderPlants());
      wirePlants();
      insertBanner(`/api/plants returned ${data.length} live plant record(s).`, 'success');
    } catch (error) {
      insertBanner(`/api/plants failed: ${error?.message || error}. Showing mock Plant Registry fallback.`, 'warning');
    }
  }

  async function applyDevices() {
    if (!/devices\.html$/.test(location.pathname)) return;
    try {
      const data = asArray(await FleetOSPlatformAPI.live.devices());
      if (!data.length) {
        insertBanner('/api/devices returned an empty array. Showing mock Device List fallback.', 'warning');
        return;
      }
      window.FleetOSLiveDevices = data.map(mapDevice);
      FleetLayout.mount(renderDevices());
      wireDevices();
      insertBanner(`/api/devices returned ${data.length} live device record(s).`, 'success');
    } catch (error) {
      insertBanner(`/api/devices failed: ${error?.message || error}. Showing mock Device List fallback.`, 'warning');
    }
  }

  async function applyAlerts() {
    if (!/alerts\.html$/.test(location.pathname)) return;
    try {
      const data = asArray(await FleetOSPlatformAPI.live.alerts());
      if (!data.length) {
        insertBanner('/api/alerts returned an empty array. Showing mock Alerts fallback.', 'warning');
        return;
      }
      if (Array.isArray(FleetAlerts)) {
        FleetAlerts.splice(0, FleetAlerts.length, ...data.map(mapAlert));
        FleetLayout.mount(renderAlertsPage());
        wireAlertsPage();
        insertBanner(`/api/alerts returned ${data.length} live alert record(s).`, 'success');
      }
    } catch (error) {
      insertBanner(`/api/alerts failed: ${error?.message || error}. Showing mock Alerts fallback.`, 'warning');
    }
  }

  async function run() {
    if (!window.FleetOSPlatformAPI || !window.FleetAPI) return;
    await Promise.allSettled([applyOverview(), applyIntegrations(), applyPlants(), applyDevices(), applyAlerts()]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else setTimeout(run, 0);
})();
