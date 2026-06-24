const FleetTelemetry = (() => {
  const state = {
    tenant: 'Tenant Alpha Energy',
    plant: 'Plant A',
    device: 'INV-00432',
    metric: 'Current Power',
    range: localStorage.getItem('fleetos_time') || 'Last 24h',
    layer: 'Normalized'
  };

  try {
    const savedContext = JSON.parse(localStorage.getItem('fleetos_telemetry_context') || 'null');
    if (savedContext && typeof savedContext === 'object') {
      Object.assign(state, savedContext);
    }
  } catch (_) {}

  const tenants = ['All Tenants', 'Tenant Alpha Energy', 'Tenant North Operations', 'Tenant Gamma Grid', 'Tenant Delta Enterprise'];
  const plantsByTenant = {
    'All Tenants': ['All Plants', 'Plant A', 'Armavir BESS', 'Madrid East', 'Lyon PV Park'],
    'Tenant Alpha Energy': ['Plant A', 'Gyumri Solar West', 'Plant C'],
    'Tenant North Operations': ['Armavir BESS', 'Sevan Solar Hub'],
    'Tenant Gamma Grid': ['Madrid East', 'Valencia Commercial'],
    'Tenant Delta Enterprise': ['Lyon PV Park', 'Nice Industrial PV']
  };
  const devicesByPlant = {
    'All Plants': ['All Devices', 'INV-00432', 'MTR-0921', 'BESS-1001', 'WS-0201'],
    'Plant A': ['INV-00432', 'INV-00433', 'MTR-0921', 'WS-0201'],
    'Gyumri Solar West': ['INV-01021', 'MTR-1002', 'GW-0120'],
    'Plant C': ['INV-02017', 'MTR-2104'],
    'Armavir BESS': ['BESS-1001', 'PCS-1001', 'BMS-1001', 'MTR-1100'],
    'Sevan Solar Hub': ['INV-0501', 'INV-0502', 'MTR-0501'],
    'Madrid East': ['INV-8301', 'MTR-8301', 'GW-8301'],
    'Valencia Commercial': ['INV-7401', 'MTR-7401'],
    'Lyon PV Park': ['INV-6201', 'INV-6202', 'MTR-6201'],
    'Nice Industrial PV': ['INV-7100', 'MTR-7100']
  };
  const metrics = [
    { name: 'Current Power', unit: 'kW', type: 'Power', normalized: 'current_power_kw', vendor: 'activePower' },
    { name: 'Energy Today', unit: 'kWh', type: 'Energy', normalized: 'energy_today_kwh', vendor: 'dayEnergy' },
    { name: 'AC Voltage', unit: 'V', type: 'Electrical', normalized: 'ac_voltage_v', vendor: 'gridVoltage' },
    { name: 'AC Current', unit: 'A', type: 'Electrical', normalized: 'ac_current_a', vendor: 'gridCurrent' },
    { name: 'Frequency', unit: 'Hz', type: 'Grid', normalized: 'frequency_hz', vendor: 'gridFrequency' },
    { name: 'Device Temperature', unit: '°C', type: 'Thermal', normalized: 'device_temperature_c', vendor: 'temperature' },
    { name: 'Battery SOC', unit: '%', type: 'Battery', normalized: 'state_of_charge_pct', vendor: 'soc' }
  ];

  function baseForMetric(metric) {
    const map = {
      'Current Power': [34, 41, 52, 66, 79, 87, 93, 88, 76, 61, 44, 29],
      'Energy Today': [5, 12, 24, 39, 55, 69, 82, 91, 96, 98, 99, 100],
      'AC Voltage': [88, 87, 89, 90, 88, 91, 90, 89, 88, 90, 89, 88],
      'AC Current': [22, 31, 43, 58, 70, 83, 86, 80, 63, 48, 33, 21],
      'Frequency': [75, 76, 75, 74, 76, 75, 77, 76, 75, 74, 75, 76],
      'Device Temperature': [32, 35, 39, 46, 58, 67, 73, 70, 61, 52, 43, 36],
      'Battery SOC': [66, 62, 58, 55, 51, 47, 52, 59, 68, 76, 82, 79]
    };
    return map[metric] || map['Current Power'];
  }

  function metricUnit() {
    return metrics.find(m => m.name === state.metric)?.unit || '';
  }

  function valueForHeight(h) {
    const unit = metricUnit();
    if (unit === 'kW') return Math.round(h * 10.2);
    if (unit === 'kWh') return Math.round(h * 3.4);
    if (unit === 'V') return Math.round(210 + h * 1.2);
    if (unit === 'A') return Math.round(h * 1.8);
    if (unit === 'Hz') return (49.5 + h / 100).toFixed(2);
    if (unit === '°C') return Math.round(18 + h * .55);
    if (unit === '%') return Math.round(h);
    return h;
  }

  function options(list, selected) {
    return list.map(x => `<option ${x === selected ? 'selected' : ''}>${x}</option>`).join('');
  }

  function renderShell() {
    FleetLayout.mount(`
      <section class="page-hero telemetry-hero">
        <div>
          <p class="eyebrow">Operations · Telemetry & Data</p>
          <h1>Telemetry Explorer</h1>
          <p class="muted">Explore normalized and raw time-series data by tenant, plant, device, metric and time range.</p>
        </div>
        <button class="freshness-card" id="freshnessBtn" type="button">
          <span class="pulse"></span>
          <div><strong>Data freshness</strong><small id="freshnessText">Fresh · 2 min ago</small></div>
        </button>
      </section>

      <section class="telemetry-workspace glass-card">
        <aside class="telemetry-controls">
          <div class="panel-head compact"><div><h2>Query Context</h2><p>Scope and metric selection</p></div></div>
          <label>Tenant<select id="tenantSelect">${options(tenants, state.tenant)}</select></label>
          <label>Plant<select id="plantSelect"></select></label>
          <label>Device<select id="deviceSelect"></select></label>
          <label>Metric<select id="metricSelect">${options(metrics.map(m => m.name), state.metric)}</select></label>
          <label>Time Range<select id="rangeSelect">${options(['Today','Last 24h','7 days','30 days','Custom Range'], state.range)}</select></label>
          <label>Data Layer<select id="layerSelect">${options(['Normalized','Raw Vendor'], state.layer)}</select></label>
          <div class="telemetry-actions">
            <button class="primary-action" id="runQueryBtn" type="button">Run Query</button>
            <button class="secondary-action" id="resetQueryBtn" type="button">Reset</button>
          </div>
          <div class="telemetry-note">
            <strong>Canonical mapping</strong>
            <span id="mappingText">activePower → current_power_kw</span>
          </div>
        </aside>

        <div class="telemetry-main">
          <div class="telemetry-summary" id="telemetrySummary"></div>
          <section class="panel-lite telemetry-chart-card">
            <div class="panel-head">
              <div><h2 id="chartTitle">Current Power</h2><p id="chartSubtitle">Plant A · INV-00432 · Normalized</p></div>
              <div class="chip-row"><span class="status-pill success">Fresh</span><span class="status-pill">UTC + Plant local</span></div>
            </div>
            <div class="telemetry-chart" id="telemetryChart"></div>
          </section>
        </div>
      </section>

      <section class="dashboard-grid two-col telemetry-lower">
        <div class="panel glass-card">
          <div class="panel-head"><div><h2>Telemetry Points</h2><p>Latest sampled records for the selected metric.</p></div><button id="exportTelemetryBtn" type="button">Export CSV</button></div>
          <div class="data-table telemetry-table" id="telemetryTable"></div>
        </div>
        <div class="panel glass-card">
          <div class="panel-head"><div><h2>Data Quality</h2><p>Completeness, duplicates and invalid values.</p></div><button id="openAdminConsoleBtn" type="button">Open Admin Console</button></div>
          <div class="quality-grid telemetry-quality">
            <button type="button" data-panel="quality" data-title="Completeness"><strong>98.7%</strong><span>Completeness</span></button>
            <button type="button" data-panel="quality" data-title="Missing points"><strong>14</strong><span>Missing points</span></button>
            <button type="button" data-panel="quality" data-title="Duplicate records"><strong>3</strong><span>Duplicate records</span></button>
            <button type="button" data-panel="quality" data-title="Invalid records"><strong>1</strong><span>Invalid records</span></button>
          </div>
          <div class="telemetry-note spacious"><strong>Validation rules</strong><span>Required: plant, timestamp, metric and value. Range and consistency checks are applied before records become business-ready.</span></div>
        </div>
      </section>

      <section class="panel glass-card">
        <div class="panel-head"><div><h2>Metric Catalog</h2><p>Vendor fields mapped into FleetOS canonical telemetry fields.</p></div><button id="mappingToastBtn" type="button">Mapping Preview</button></div>
        <div class="data-table metric-catalog" id="metricCatalog"></div>
      </section>
    `);
    fillDependentSelects();
    wire();
    render();
  }

  function fillDependentSelects() {
    const plantList = plantsByTenant[state.tenant] || plantsByTenant['All Tenants'];
    if (!plantList.includes(state.plant)) state.plant = plantList[0];
    const deviceList = devicesByPlant[state.plant] || ['All Devices'];
    if (!deviceList.includes(state.device)) state.device = deviceList[0];
    const plantSelect = document.getElementById('plantSelect');
    const deviceSelect = document.getElementById('deviceSelect');
    if (plantSelect) plantSelect.innerHTML = options(plantList, state.plant);
    if (deviceSelect) deviceSelect.innerHTML = options(deviceList, state.device);
  }

  function summaryCards(values) {
    const latest = valueForHeight(values.at(-1));
    const min = Math.min(...values.map(valueForHeight));
    const max = Math.max(...values.map(valueForHeight));
    const avg = Math.round(values.map(valueForHeight).reduce((a,b) => Number(a)+Number(b), 0) / values.length * 10) / 10;
    const unit = metricUnit();
    return [
      ['Latest Value', `${latest} ${unit}`, 'Last sample · 2 min ago'],
      ['Average', `${avg} ${unit}`, state.range],
      ['Min / Max', `${min} / ${max}`, unit],
      ['Quality', '98.7%', 'Business-ready records']
    ].map(([label, value, note]) => `
      <article class="kpi-card compact-kpi">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${note}</small>
      </article>
    `).join('');
  }

  function renderChart(values) {
    const labels = state.range === 'Today' ? ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','00:00','02:00','04:00'] : ['P1','P2','P3','P4','P5','P6','P7','P8','P9','P10','P11','P12'];
    document.getElementById('telemetryChart').innerHTML = values.map((v, i) => `
      <button class="telemetry-bar" type="button" style="height:${Math.max(14, v)}%" data-index="${i}" data-value="${valueForHeight(v)}" data-label="${labels[i]}">
        <span>${valueForHeight(v)} ${metricUnit()}</span>
      </button>
    `).join('');
  }

  function renderTable(values) {
    const metric = metrics.find(m => m.name === state.metric);
    const rows = values.slice().reverse().map((v, idx) => {
      const minute = String((idx * 5 + 5) % 60).padStart(2, '0');
      return `
        <div class="data-row actionable" data-panel="telemetry-point" data-title="${state.metric} sample">
          <div><strong>${state.metric}</strong><small>${state.plant} · ${state.device}</small></div>
          <div><strong>${valueForHeight(v)} ${metric.unit}</strong><small>${state.layer}</small></div>
          <div><strong>2026-06-04 14:${minute}</strong><small>UTC / plant local</small></div>
          <div><span class="status-pill success">Valid</span></div>
        </div>`;
    }).join('');
    document.getElementById('telemetryTable').innerHTML = `
      <div class="data-head"><span>Metric</span><span>Value</span><span>Timestamp</span><span>Status</span></div>${rows}`;
  }

  function renderCatalog() {
    document.getElementById('metricCatalog').innerHTML = `
      <div class="data-head"><span>Metric</span><span>Vendor Field</span><span>FleetOS Field</span><span>Unit</span><span>Type</span></div>
      ${metrics.map(m => `
        <div class="data-row actionable" data-panel="mapping" data-title="${m.name} mapping">
          <div><strong>${m.name}</strong><small>${m.type}</small></div>
          <div><strong>${m.vendor}</strong><small>source field</small></div>
          <div><strong>${m.normalized}</strong><small>canonical field</small></div>
          <div><strong>${m.unit}</strong><small>standard unit</small></div>
          <div><span class="status-pill success">Mapped</span></div>
        </div>`).join('')}`;
  }

  function render() {
    const metric = metrics.find(m => m.name === state.metric) || metrics[0];
    const values = baseForMetric(state.metric);
    document.getElementById('tenantSelect').value = state.tenant;
    fillDependentSelects();
    document.getElementById('metricSelect').value = state.metric;
    document.getElementById('rangeSelect').value = state.range;
    document.getElementById('layerSelect').value = state.layer;
    document.getElementById('telemetrySummary').innerHTML = summaryCards(values);
    document.getElementById('chartTitle').textContent = state.metric;
    document.getElementById('chartSubtitle').textContent = `${state.plant} · ${state.device} · ${state.layer}`;
    document.getElementById('mappingText').textContent = `${metric.vendor} → ${metric.normalized}`;
    renderChart(values);
    renderTable(values);
    renderCatalog();
  }

  function openTelemetryDrawer(title, body, route = 'telemetry') {
    document.querySelector('#detailDrawer')?.remove();
    const drawer = document.createElement('aside');
    drawer.id = 'detailDrawer';
    drawer.className = 'detail-drawer open';
    drawer.innerHTML = `
      <button class="drawer-close" type="button">x</button>
      <p class="eyebrow">Telemetry preview</p>
      <h2>${title}</h2>
      <div class="drawer-body">${body}</div>
      <div class="drawer-actions">
        <button class="primary-action" data-route="${route}">Open ${route === 'admin-console' ? 'Admin Console' : 'Telemetry Explorer'}</button>
        <button class="secondary-action drawer-close-2">Close</button>
      </div>`;
    document.body.appendChild(drawer);
    drawer.querySelectorAll('.drawer-close,.drawer-close-2').forEach(b => b.addEventListener('click', () => drawer.remove()));
    drawer.querySelector('.primary-action')?.addEventListener('click', () => { window.location.href = FleetLayout.pathFor(route); });
  }

  function panelBody(kind, title, trigger) {
    const metric = metrics.find(m => m.name === state.metric) || metrics[0];
    if (kind === 'quality') {
      return `<p>${title} for the selected query context.</p><div class="drawer-metrics rich"><div><span>Tenant</span><strong>${state.tenant}</strong></div><div><span>Plant</span><strong>${state.plant}</strong></div><div><span>Missing</span><strong>14 points</strong></div><div><span>Invalid</span><strong>1 record</strong></div></div>`;
    }
    if (kind === 'mapping') {
      return `<p>FleetOS stores business-ready telemetry in the canonical model while preserving the source field reference.</p><div class="drawer-metrics rich"><div><span>Vendor field</span><strong>${metric.vendor}</strong></div><div><span>FleetOS field</span><strong>${metric.normalized}</strong></div><div><span>Standard unit</span><strong>${metric.unit}</strong></div><div><span>Layer</span><strong>${state.layer}</strong></div></div>`;
    }
    if (kind === 'telemetry-point') {
      return `<p>Latest sampled value from ${state.device} in ${state.plant}.</p><div class="drawer-metrics rich"><div><span>Metric</span><strong>${state.metric}</strong></div><div><span>Value</span><strong>${trigger?.querySelectorAll('strong')[1]?.textContent || '—'}</strong></div><div><span>Status</span><strong>Valid</strong></div><div><span>Freshness</span><strong>2 min ago</strong></div></div>`;
    }
    return `<p>Selected telemetry point.</p>`;
  }

  function wire() {
    ['tenant','plant','device','metric','range','layer'].forEach(name => {
      document.getElementById(`${name}Select`)?.addEventListener('change', e => {
        state[name] = e.target.value;
        if (name === 'tenant') {
          const plantList = plantsByTenant[state.tenant] || plantsByTenant['All Tenants'];
          state.plant = plantList[0];
          state.device = (devicesByPlant[state.plant] || ['All Devices'])[0];
        }
        if (name === 'plant') state.device = (devicesByPlant[state.plant] || ['All Devices'])[0];
        render();
      });
    });
    document.getElementById('runQueryBtn')?.addEventListener('click', () => FleetLayout.toast(`Telemetry query updated: ${state.metric}`));
    document.getElementById('resetQueryBtn')?.addEventListener('click', () => {
      Object.assign(state, { tenant: 'Tenant Alpha Energy', plant: 'Plant A', device: 'INV-00432', metric: 'Current Power', range: 'Last 24h', layer: 'Normalized' }); render(); FleetLayout.toast('Telemetry query reset');
    });
    document.getElementById('freshnessBtn')?.addEventListener('click', () => openTelemetryDrawer('Data Freshness', `<p>Freshness by dataset for the current query.</p><div class="drawer-metrics rich"><div><span>Telemetry</span><strong>Fresh</strong></div><div><span>Last sample</span><strong>2 min ago</strong></div><div><span>Alerts</span><strong>Delayed</strong></div><div><span>Devices</span><strong>Fresh</strong></div></div>`));
    document.getElementById('exportTelemetryBtn')?.addEventListener('click', () => FleetLayout.toast('CSV export queued for selected telemetry context'));
    document.getElementById('openAdminConsoleBtn')?.addEventListener('click', () => { window.location.href = FleetLayout.pathFor('admin-console'); });
    document.getElementById('mappingToastBtn')?.addEventListener('click', () => openTelemetryDrawer('Mapping Preview', panelBody('mapping', 'Mapping Preview'), 'admin-console'));
    document.addEventListener('click', e => {
      const bar = e.target.closest('.telemetry-bar');
      if (bar) {
        openTelemetryDrawer(`${state.metric} · ${bar.dataset.label}`, `<p>Sample point from the selected telemetry chart.</p><div class="drawer-metrics rich"><div><span>Value</span><strong>${bar.dataset.value} ${metricUnit()}</strong></div><div><span>Device</span><strong>${state.device}</strong></div><div><span>Plant</span><strong>${state.plant}</strong></div><div><span>Layer</span><strong>${state.layer}</strong></div></div>`);
        return;
      }
      const row = e.target.closest('.telemetry-table .data-row, .metric-catalog .data-row, .telemetry-quality button');
      if (row) {
        const kind = row.dataset.panel || 'telemetry-point';
        const title = row.dataset.title || 'Telemetry preview';
        openTelemetryDrawer(title, panelBody(kind, title, row), kind === 'quality' || kind === 'mapping' ? 'admin-console' : 'telemetry');
      }
    });
    window.addEventListener('fleetos:context', e => {
      if (e.detail?.time) { state.range = e.detail.time; render(); }
    });
  }

  return { renderShell };
})();

FleetTelemetry.renderShell();
