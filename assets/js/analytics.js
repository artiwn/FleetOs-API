const FleetAnalytics = (() => {
  const state = {
    tenant: localStorage.getItem('fleetos_tenant') || 'All Tenants',
    region: localStorage.getItem('fleetos_region') || 'All Regions',
    range: localStorage.getItem('fleetos_time') || 'Last 24h',
    compare: 'Fleet Average',
    metric: 'Energy Generated'
  };

  const tenants = ['All Tenants', 'Tenant Alpha Energy', 'Tenant North Operations', 'Tenant Gamma Grid', 'Tenant Delta Enterprise'];
  const regions = ['All Regions', 'Armenia', 'Germany', 'Spain', 'France'];
  const ranges = ['Today', 'Last 24h', '7 days', '30 days', 'Custom Range'];
  const metrics = ['Energy Generated', 'Performance Ratio', 'Availability', 'Specific Yield', 'Capacity Factor', 'Downtime'];

  const analytics = {
    kpis: [
      { label: 'Energy Generated', value: '128.4 MWh', note: '+8.4% vs previous period', route: 'telemetry', panel: 'energy' },
      { label: 'Performance Ratio', value: '83.6%', note: '+4.1% above fleet avg', route: 'analytics', panel: 'pr' },
      { label: 'Availability', value: '96.8%', note: '14 plants below target', route: 'plants', panel: 'availability' },
      { label: 'Capacity Factor', value: '21.4%', note: 'Utility-scale weighted', route: 'analytics', panel: 'capacity' },
      { label: 'Revenue Estimate', value: '€124.5K', note: 'Based on active tariff profiles', route: 'finance', panel: 'revenue' },
      { label: 'CO2 Offset', value: '72.1 t', note: 'Estimated environmental impact', route: 'reports', panel: 'co2' }
    ],
    tenants: [
      ['Tenant Alpha Energy', '42.8 MWh', '86.1%', '98.2%', '12', 'Healthy'],
      ['Tenant North Operations', '31.2 MWh', '79.4%', '94.1%', '26', 'Attention'],
      ['Tenant Gamma Grid', '28.6 MWh', '81.7%', '95.8%', '18', 'Healthy'],
      ['Tenant Delta Enterprise', '25.8 MWh', '76.9%', '91.3%', '34', 'At Risk']
    ],
    plants: [
      ['Plant A', 'Tenant Alpha Energy', '9.8 MWh', '88.4%', '99.1%', 'Top performer'],
      ['Plant C', 'Tenant Alpha Energy', '3.1 MWh', '84.6%', '97.3%', 'Stable'],
      ['Madrid East', 'Tenant Gamma Grid', '7.4 MWh', '82.2%', '96.0%', 'Stable'],
      ['Armavir BESS', 'Tenant North Operations', '5.2 MWh', '74.1%', '89.7%', 'Needs review'],
      ['Lyon PV Park', 'Tenant Delta Enterprise', '6.6 MWh', '72.8%', '88.5%', 'Underperforming']
    ],
    trends: {
      energy: [32, 44, 52, 68, 76, 84, 91, 88, 79, 72, 63, 54],
      pr: [70, 72, 75, 78, 82, 85, 84, 83, 81, 80, 79, 82],
      availability: [96, 94, 95, 97, 98, 96, 95, 94, 93, 95, 96, 97],
      alerts: [18, 24, 21, 15, 13, 11, 19, 23, 27, 22, 18, 14]
    }
  };

  function options(list, selected) {
    return list.map(x => `<option ${x === selected ? 'selected' : ''}>${x}</option>`).join('');
  }

  function init() {
    FleetLayout.mount(`
      <section class="page-hero analytics-hero">
        <div>
          <p class="eyebrow">Operations · Energy Analytics</p>
          <h1>Analytics & Performance</h1>
          <p class="muted">Analyze production, availability, performance ratio, capacity factor and portfolio benchmarks across tenants, plants and devices.</p>
        </div>
        <button class="freshness-card" id="analyticsFreshness" type="button">
          <span class="pulse"></span>
          <div><strong>Analytics snapshot</strong><small>Calculated 2 min ago</small></div>
        </button>
      </section>

      <section class="analytics-controls glass-card">
        <label>Tenant<select id="analyticsTenant">${options(tenants, state.tenant)}</select></label>
        <label>Region<select id="analyticsRegion">${options(regions, state.region)}</select></label>
        <label>Time Range<select id="analyticsRange">${options(ranges, state.range)}</select></label>
        <label>Primary Metric<select id="analyticsMetric">${options(metrics, state.metric)}</select></label>
        <label>Benchmark<select id="analyticsCompare">${options(['Fleet Average','Tenant Average','Region Average','Installed Capacity'], state.compare)}</select></label>
        <button class="primary-action" id="analyticsApply" type="button">Apply</button>
      </section>

      <section class="analytics-kpis" id="analyticsKpis"></section>

      <section class="dashboard-grid two-col analytics-upper">
        <div class="panel glass-card analytics-chart-card">
          <div class="panel-head">
            <div><h2>Energy & Performance Trend</h2><p>Time-series benchmark across the selected scope.</p></div>
            <div class="chip-row"><span class="status-pill success">Normalized</span><span class="status-pill">${state.range}</span></div>
          </div>
          <div class="analytics-trend-grid">
            <div>
              <h3>Energy Generated</h3>
              <div class="analytics-bars" id="energyTrend"></div>
            </div>
            <div>
              <h3>Performance Ratio</h3>
              <div class="analytics-bars" id="prTrend"></div>
            </div>
          </div>
        </div>

        <div class="panel glass-card">
          <div class="panel-head"><div><h2>Benchmark Summary</h2><p>Selected scope vs comparison baseline.</p></div><button id="openBenchmark" type="button">View benchmark</button></div>
          <div class="benchmark-card drill-analytics" data-panel="benchmark" data-title="Benchmark Summary" data-route="analytics">
            <div class="benchmark-score"><strong>+4.1%</strong><span>above fleet average PR</span></div>
            <div class="benchmark-lines">
              <div><span>Selected PR</span><strong>83.6%</strong></div>
              <div><span>Fleet average</span><strong>79.5%</strong></div>
              <div><span>Availability delta</span><strong>+1.9%</strong></div>
              <div><span>Plants below target</span><strong>14</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-grid two-col analytics-lower">
        <div class="panel glass-card">
          <div class="panel-head"><div><h2>Portfolio Comparison</h2><p>Tenants compared by energy, PR, availability and alert load.</p></div><button id="exportPortfolio" type="button">Export</button></div>
          <div class="data-table analytics-table" id="portfolioTable"></div>
        </div>
        <div class="panel glass-card">
          <div class="panel-head"><div><h2>Plant Ranking</h2><p>Top and underperforming plants in the current context.</p></div><button id="openPlants" type="button">Open Plants</button></div>
          <div class="data-table analytics-table" id="plantRanking"></div>
        </div>
      </section>

      <section class="panel glass-card">
        <div class="panel-head"><div><h2>Availability & Alert Correlation</h2><p>Operational analytics connecting downtime, open alerts and performance impact.</p></div><button id="openAlerts" type="button">Open Alerts Center</button></div>
        <div class="analytics-correlation">
          <div class="correlation-chart" id="availabilityTrend"></div>
          <div class="correlation-chart alert-correlation" id="alertTrend"></div>
          <div class="correlation-notes">
            <button class="quality-callout drill-analytics" data-panel="availability" data-title="Availability impact" data-route="plants" type="button"><strong>14 plants</strong><span>below 95% availability target</span></button>
            <button class="quality-callout drill-analytics" data-panel="alerts" data-title="Alert impact" data-route="alerts" type="button"><strong>26 alerts</strong><span>correlated with production loss</span></button>
            <button class="quality-callout drill-analytics" data-panel="downtime" data-title="Downtime estimate" data-route="telemetry" type="button"><strong>7.4 h</strong><span>estimated downtime in selected period</span></button>
          </div>
        </div>
      </section>
    `);
    render();
    wire();
  }

  function render() {
    document.getElementById('analyticsKpis').innerHTML = analytics.kpis.map(k => `
      <button class="kpi-card analytics-kpi drill-analytics" type="button" data-panel="${k.panel}" data-title="${k.label}" data-route="${k.route}">
        <span>${k.label}</span>
        <strong>${k.value}</strong>
        <small>${k.note}</small>
      </button>
    `).join('');
    renderBars('energyTrend', analytics.trends.energy, 'MWh');
    renderBars('prTrend', analytics.trends.pr, '%');
    renderMiniTrend('availabilityTrend', 'Availability Trend', analytics.trends.availability, '%');
    renderMiniTrend('alertTrend', 'Alert Trend', analytics.trends.alerts, 'alerts');
    renderTables();
  }

  function renderBars(id, values, unit) {
    const el = document.getElementById(id);
    el.innerHTML = values.map((v, i) => `
      <button class="analytics-bar drill-analytics" style="height:${Math.max(18, v)}%" type="button" data-panel="trend" data-title="Trend point ${i + 1}" data-route="telemetry">
        <span>${v}${unit === 'alerts' ? '' : unit}</span>
      </button>
    `).join('');
  }

  function renderMiniTrend(id, title, values, unit) {
    const el = document.getElementById(id);
    el.innerHTML = `<h3>${title}</h3><div class="mini-trend-row">${values.map((v, i) => `<button class="mini-trend-point drill-analytics" style="height:${Math.max(16, v)}%" type="button" data-panel="trend" data-title="${title} · point ${i + 1}" data-route="${unit === 'alerts' ? 'alerts' : 'telemetry'}"><span>${v}${unit === 'alerts' ? '' : unit}</span></button>`).join('')}</div>`;
  }

  function renderTables() {
    document.getElementById('portfolioTable').innerHTML = `
      <div class="table-row table-head"><span>Tenant</span><span>Energy</span><span>PR</span><span>Availability</span><span>Alerts</span><span>Status</span></div>
      ${analytics.tenants.map(row => `<button class="table-row drill-analytics" data-panel="tenant" data-title="${row[0]}" data-route="tenant-detail" type="button">${row.map((cell, i) => `<span class="${i === 5 ? statusClass(cell) : ''}">${cell}</span>`).join('')}</button>`).join('')}
    `;
    document.getElementById('plantRanking').innerHTML = `
      <div class="table-row table-head"><span>Plant</span><span>Tenant</span><span>Energy</span><span>PR</span><span>Availability</span><span>Ranking</span></div>
      ${analytics.plants.map(row => `<button class="table-row drill-analytics" data-panel="plant" data-title="${row[0]}" data-route="plant-detail" type="button">${row.map((cell, i) => `<span class="${i === 5 ? rankingClass(cell) : ''}">${cell}</span>`).join('')}</button>`).join('')}
    `;
  }

  function statusClass(value) {
    if (value === 'Healthy') return 'status-pill success';
    if (value === 'Attention') return 'status-pill warning';
    if (value === 'At Risk') return 'status-pill danger';
    return 'status-pill';
  }

  function rankingClass(value) {
    if (value === 'Top performer') return 'status-pill success';
    if (value === 'Needs review') return 'status-pill warning';
    if (value === 'Underperforming') return 'status-pill danger';
    return 'status-pill';
  }

  function drawerContent(panel, title, route) {
    const routeLabels = {
      telemetry: 'Open Telemetry Explorer', analytics: 'Open Analytics', plants: 'Open Plant Registry', 'plant-detail': 'Open Plant Detail', alerts: 'Open Alerts Center', finance: 'Open Finance', reports: 'Open Reports', 'tenant-detail': 'Open Tenant Detail'
    };
    const templates = {
      energy: [['Current period', '128.4 MWh'], ['Previous period', '118.5 MWh'], ['Delta', '+8.4%'], ['Main driver', 'Plant A']],
      pr: [['Current PR', '83.6%'], ['Fleet average', '79.5%'], ['Delta', '+4.1%'], ['Below target', '14 plants']],
      availability: [['Availability', '96.8%'], ['Target', '95%'], ['Below target', '14 plants'], ['Estimated downtime', '7.4 h']],
      capacity: [['Capacity factor', '21.4%'], ['Installed capacity', '86.2 MW'], ['Peak output', '42.8 MW'], ['Benchmark', '+1.2%']],
      revenue: [['Revenue estimate', '€124.5K'], ['Tariff profiles', '18 active'], ['Unbilled estimate', '€12.8K'], ['Collection health', '92%']],
      co2: [['CO2 offset', '72.1 t'], ['Energy basis', '128.4 MWh'], ['Report status', 'Ready'], ['ESG export', 'Available']],
      benchmark: [['Selected PR', '83.6%'], ['Fleet average', '79.5%'], ['Availability delta', '+1.9%'], ['Plants below target', '14']],
      alerts: [['Correlated alerts', '26'], ['Critical', '8'], ['Production impact', '4.6 MWh'], ['Open escalations', '3']],
      downtime: [['Estimated downtime', '7.4 h'], ['Affected devices', '18'], ['Lost energy', '3.2 MWh'], ['Recovery trend', 'Improving']],
      trend: [['Trend point', title], ['Context', `${state.tenant} · ${state.range}`], ['Layer', 'Normalized analytics'], ['Action', 'Open source data']],
      tenant: [['Tenant', title], ['Energy', 'Portfolio weighted'], ['Benchmark', 'Tenant vs fleet'], ['Drill-down', 'Tenant detail']],
      plant: [['Plant', title], ['Ranking context', 'Performance & availability'], ['Source', 'Integration + telemetry'], ['Drill-down', 'Plant detail']]
    };
    const rows = templates[panel] || templates.trend;
    return `
      <aside id="analyticsDrawer" class="detail-drawer open">
        <button class="drawer-close" type="button">x</button>
        <p class="eyebrow">Analytics preview</p>
        <h2>${title}</h2>
        <div class="drawer-body">
          <p>Analytics preview for <strong>${title}</strong> using preserved tenant, region and time context.</p>
          <div class="drawer-metrics">${rows.map(([k,v]) => `<div>${k}</div><strong>${v}</strong>`).join('')}</div>
        </div>
        <div class="drawer-actions">
          <button class="primary-action" data-route="${route}" type="button">${routeLabels[route] || 'Open full section'}</button>
          <button class="secondary-action drawer-close-2" type="button">Close</button>
        </div>
      </aside>
    `;
  }

  function openDrawer(panel, title, route) {
    document.getElementById('analyticsDrawer')?.remove();
    document.body.insertAdjacentHTML('beforeend', drawerContent(panel, title, route));
    document.querySelector('#analyticsDrawer .drawer-close')?.addEventListener('click', closeDrawer);
    document.querySelector('#analyticsDrawer .drawer-close-2')?.addEventListener('click', closeDrawer);
    document.querySelector('#analyticsDrawer [data-route]')?.addEventListener('click', e => {
      window.location.href = FleetLayout.pathFor(e.currentTarget.dataset.route);
    });
  }

  function closeDrawer() {
    document.getElementById('analyticsDrawer')?.remove();
  }

  function wire() {
    ['analyticsTenant','analyticsRegion','analyticsRange','analyticsMetric','analyticsCompare'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', e => {
        const key = id.replace('analytics','').toLowerCase();
        state[key] = e.target.value;
      });
    });
    document.getElementById('analyticsApply')?.addEventListener('click', () => FleetLayout.toast('Analytics context updated'));
    document.getElementById('analyticsFreshness')?.addEventListener('click', () => openDrawer('trend', 'Analytics Freshness', 'admin-console'));
    document.getElementById('openBenchmark')?.addEventListener('click', () => openDrawer('benchmark', 'Benchmark Summary', 'analytics'));
    document.getElementById('exportPortfolio')?.addEventListener('click', () => FleetLayout.toast('Portfolio comparison export prepared'));
    document.getElementById('openPlants')?.addEventListener('click', () => window.location.href = FleetLayout.pathFor('plants'));
    document.getElementById('openAlerts')?.addEventListener('click', () => window.location.href = FleetLayout.pathFor('alerts'));
    document.addEventListener('click', e => {
      const b = e.target.closest('.drill-analytics');
      if (!b) return;
      openDrawer(b.dataset.panel || 'trend', b.dataset.title || 'Analytics detail', b.dataset.route || 'analytics');
    });
  }

  return { init };
})();
