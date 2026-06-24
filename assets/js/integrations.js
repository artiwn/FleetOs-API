const vendorTemplates = {
  Huawei: {
    software: 'FusionSolar', method: 'API', protocol: 'REST / HTTPS', auth: 'OAuth 2.0 + Account', base: 'https://eu5.fusionsolar.huawei.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Europe', 'Asia Pacific', 'Middle East', 'Global'],
    toggles: ['Northbound API Access', 'Historical Import', 'Data Scope'],
    connection: ['Region', 'Northbound API Access'],
    credentials: ['API Account Username', 'API Account Password', 'OAuth Tenant ID', 'OAuth Tenant Secret'],
    discovery: { plants: 14, devices: 126, metrics: 215, alerts: 58 },
    scope: 'Standard telemetry + critical/standard alert profile'
  },
  Solis: {
    software: 'SolisCloud', method: 'API', protocol: 'REST / HTTPS', auth: 'API Key Authentication', base: 'https://www.soliscloud.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Global', 'Europe', 'Asia', 'US'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Region'],
    credentials: ['API Key', 'API Secret'],
    discovery: { plants: 5, devices: 35, metrics: 112, alerts: 24 },
    scope: 'Solar plant telemetry + inverter alerts'
  },
  GoodWe: {
    software: 'SEMS Portal', method: 'API', protocol: 'REST / HTTPS', auth: 'SEMS Account / OpenAPI', base: 'https://eu.semsportal.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Europe', 'Global', 'China', 'Australia'],
    toggles: ['OpenAPI Access', 'API Credentials', 'Historical Import', 'Data Scope'],
    connection: ['Region', 'OpenAPI Access'],
    credentials: ['SEMS Account', 'SEMS Password', 'API Key', 'API Secret'],
    discovery: { plants: 9, devices: 84, metrics: 176, alerts: 39 },
    scope: 'SEMS account plants + OpenAPI metrics'
  },
  Deye: {
    software: 'DeyeCloud / Solarman', method: 'API', protocol: 'REST / HTTPS', auth: 'App ID / App Secret', base: 'https://global.solarmanpv.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Global', 'Europe', 'Asia'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Region', 'Device Serial Number optional'],
    credentials: ['BaseURL', 'AppId', 'AppSecret', 'Email', 'Password', 'CompanyId'],
    discovery: { plants: 7, devices: 61, metrics: 142, alerts: 22 },
    scope: 'Cloud account + optional serial-filtered devices'
  },
  SolaX: {
    software: 'SolaX Cloud', method: 'API', protocol: 'REST / HTTPS', auth: 'Token Authentication', base: 'https://www.solaxcloud.com/proxyApp', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Global', 'Europe', 'US'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Region', 'Registration Number / Device Serial Number'],
    credentials: ['BaseURL', 'Login', 'Password', 'ClientId', 'ClientSecret', 'TokenEndpoint'],
    discovery: { plants: 4, devices: 29, metrics: 96, alerts: 18 },
    scope: 'Token-linked plant and device telemetry'
  },
  Sungrow: {
    software: 'iSolarCloud', method: 'API', protocol: 'REST / HTTPS', auth: 'App Key Authentication', base: 'https://gateway.isolarcloud.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Europe', 'Global', 'China', 'Australia'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Region', 'Plant ID optional'],
    credentials: ['App Key', 'Access Key'],
    discovery: { plants: 11, devices: 98, metrics: 174, alerts: 31 },
    scope: 'iSolarCloud plant list + optional plant filter'
  },
  Peimar: {
    software: 'Peimar X Portal', method: 'API', protocol: 'REST / HTTPS', auth: 'Portal Account / API Token', base: 'https://portal.peimar.com', port: '443', format: 'JSON', sync: 'Scheduled', direction: 'Inbound',
    regionOptions: ['Europe', 'Global'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Portal URL', 'Device Serial Number optional'],
    credentials: ['Portal Account', 'Portal Password', 'API Token'],
    discovery: { plants: 3, devices: 18, metrics: 82, alerts: 12 },
    scope: 'Portal account plants + optional API token access'
  },
  Other: {
    software: 'Custom Platform', method: 'Custom', protocol: 'Custom', auth: 'Dynamic Authentication', base: 'Defined manually', port: 'Custom', format: 'JSON / XML / CSV', sync: 'Manual', direction: 'Inbound',
    regionOptions: ['Custom / Global'],
    toggles: ['Historical Import', 'Data Scope'],
    connection: ['Platform Name', 'Integration Method', 'Connection Parameters'],
    credentials: ['Credential Name', 'Credential Value', 'Additional Parameters'],
    discovery: { plants: 0, devices: 0, metrics: 0, alerts: 0 },
    scope: 'Custom mapping based on provided parameters'
  }
};

const liveProviderTemplateState = {
  loaded: false,
  loading: false,
  names: [],
  details: {},
  errors: {}
};

function templateVendorKey(name){
  const text = String(name || '').trim();
  if (!text) return 'Other';
  if (/deye/i.test(text)) return 'DeyeCloud';
  if (/solarx|solax/i.test(text)) return 'Solarx';
  return text;
}
function titleFromCamel(key){
  return String(key || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
function objectValueAt(obj, paths, fallback = ''){
  for (const path of paths) {
    const value = String(path).split('.').reduce((acc, part) => acc && acc[part], obj);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}
function liveTemplateCredentials(detail){
  const source = detail?.connectionAuthentication || detail?.authentication || detail?.credentials || {};
  const blacklist = new Set(['connectionStatus','sampleDataStatus','authenticationStatus','notes']);
  const keys = Object.keys(source || {}).filter(k => !blacklist.has(k));
  if (!keys.length) return null;
  return keys.map(titleFromCamel);
}
function mergeLiveVendorTemplate(name, detail = {}){
  const key = templateVendorKey(name);
  const lower = key.toLowerCase();
  const fallbackKey = /deye/.test(lower) ? 'Deye' : /solarx|solax/.test(lower) ? 'SolaX' : key;
  const base = vendorTemplates[key] || vendorTemplates[fallbackKey] || vendorTemplates.Other;
  const credentials = liveTemplateCredentials(detail);
  const general = detail?.general || {};
  const apiRequest = detail?.apiRequest || {};
  const sync = detail?.synchronization || {};
  const connection = detail?.connectionAuthentication || {};

  vendorTemplates[key] = {
    ...base,
    software: objectValueAt(detail, ['software','displayName','general.integrationName','general.producerVendorTemplate'], base.software || key),
    method: objectValueAt(detail, ['method','general.integrationMethod'], base.method || 'API'),
    protocol: objectValueAt(detail, ['protocol','apiRequest.protocol'], base.protocol || 'REST / HTTPS'),
    auth: objectValueAt(detail, ['auth','authType','connectionAuthentication.authenticationStatus'], base.auth || 'Backend template auth'),
    base: objectValueAt(detail, ['baseUrl','host','endpoint','connectionAuthentication.baseUrl','general.baseUrl'], base.base || 'Managed by backend template'),
    port: objectValueAt(detail, ['port','apiRequest.port'], base.port || '443'),
    format: objectValueAt(detail, ['format','dataFormat','apiRequest.format'], base.format || 'JSON'),
    sync: objectValueAt(sync, ['syncFrequency'], sync.syncFrequency || base.sync || 'Scheduled'),
    direction: objectValueAt(detail, ['direction','apiRequest.direction'], base.direction || 'Inbound'),
    credentials: credentials || base.credentials || ['API Account Username', 'API Account Password'],
    discovery: base.discovery || { plants: 0, devices: 0, metrics: 0, alerts: 0 },
    scope: 'Backend provider template loaded from Swagger API',
    liveProviderTemplate: true,
    templateName: name,
    templateDetail: detail,
    rateLimit: apiRequest.rateLimit,
    rateLimitPeriod: apiRequest.rateLimitPeriod,
    syncFrequency: sync.syncFrequency,
    syncStartTime: sync.syncStartTime,
    lastSyncTimestampField: sync.lastSyncTimestampField,
    vendorName: general.vendorName,
    integrationStatus: general.integrationStatus,
    connectionStatus: connection.connectionStatus,
    sampleDataStatus: connection.sampleDataStatus,
    authenticationStatus: connection.authenticationStatus
  };
  return vendorTemplates[key];
}
function allVendorTemplateKeys(){
  const live = liveProviderTemplateState.names.map(templateVendorKey);
  const mock = Object.keys(vendorTemplates);
  return Array.from(new Set([...live, ...mock]));
}

function refreshVendorFilterOptions(){
  const filter = document.getElementById('vendorFilter');
  if (!filter) return;
  const current = filter.value || 'All Vendors';
  filter.innerHTML = `<option>All Vendors</option>${allVendorTemplateKeys().map(v=>`<option>${v}</option>`).join('')}`;
  if ([...filter.options].some(o => o.value === current)) filter.value = current;
}

function vendorOptionsHtml(selected){
  const live = liveProviderTemplateState.names.map(templateVendorKey);
  const liveSet = new Set(live);
  const mock = Object.keys(vendorTemplates).filter(k => !liveSet.has(k));
  const option = key => `<option value="${key}" ${key === selected ? 'selected' : ''}>${key}${liveSet.has(key) ? ' · live template' : ''}</option>`;
  const livePart = live.length ? `<optgroup label="Backend provider templates">${live.map(option).join('')}</optgroup>` : '';
  const mockPart = mock.length ? `<optgroup label="Mock fallback templates">${mock.map(option).join('')}</optgroup>` : '';
  return livePart + mockPart;
}
function renderLiveTemplateStatus(vendor, state = 'idle', detail = null, message = ''){
  const box = document.getElementById('liveTemplateStatus');
  if (!box) return;
  const tpl = vendorTemplates[vendor] || vendorTemplates[templateVendorKey(vendor)] || null;
  const isLive = Boolean(tpl?.liveProviderTemplate || detail);
  const cls = state === 'error' ? 'danger' : isLive ? 'success' : state === 'loading' ? 'warning' : 'neutral';
  const label = state === 'loading' ? 'Loading provider template…' : state === 'error' ? 'Template unavailable' : isLive ? 'Live template applied' : 'Mock fallback template';
  const meta = message || (isLive ? `Loaded from /api/admin/provider-integrations/templates/${tpl?.templateName || vendor}` : 'Backend template is not available yet. Existing mock template remains active.');
  box.innerHTML = `<span class="badge ${cls}">${label}</span><small>${meta}</small>`;
}
function applyTemplateDetailToForm(vendor){
  const tpl = vendorTemplates[vendor] || vendorTemplates[templateVendorKey(vendor)];
  if (!tpl) return;
  const setIfEmpty = (id, value) => {
    const el = document.getElementById(id);
    if (!el || value === undefined || value === null || value === '') return;
    if (!el.value || el.disabled) el.value = String(value);
  };
  setIfEmpty('rateLimit', tpl.rateLimit);
  setIfEmpty('rateLimitPeriod', tpl.rateLimitPeriod);
  setIfEmpty('syncFrequency', tpl.syncFrequency);
  setIfEmpty('syncStartTime', tpl.syncStartTime);
  setIfEmpty('lastSyncTimestampField', tpl.lastSyncTimestampField);
  setIfEmpty('vendorName', tpl.vendorName || vendor);
  const statusEl = document.getElementById('integrationStatus');
  if (statusEl && tpl.integrationStatus) statusEl.value = tpl.integrationStatus;
  if (tpl.connectionStatus) document.getElementById('connectionResult').textContent = tpl.connectionStatus;
  if (tpl.sampleDataStatus) document.getElementById('discoveryStatus').textContent = tpl.sampleDataStatus;
  if (tpl.authenticationStatus) document.getElementById('readyAuth').textContent = tpl.authenticationStatus;
}
async function fetchProviderTemplateDetail(vendor){
  const key = templateVendorKey(vendor);
  const apiName = liveProviderTemplateState.names.find(n => templateVendorKey(n) === key) || key;
  if (!window.FleetOSPlatformAPI?.providerIntegrations?.template) return null;
  if (liveProviderTemplateState.details[key]) return liveProviderTemplateState.details[key];
  renderLiveTemplateStatus(key, 'loading');
  try {
    const detail = await FleetOSPlatformAPI.providerIntegrations.template(apiName);
    liveProviderTemplateState.details[key] = detail || {};
    mergeLiveVendorTemplate(apiName, detail || {});
    renderLiveTemplateStatus(key, 'success', detail || {});
    applyTemplateDetailToForm(key);
    return detail || {};
  } catch (error) {
    liveProviderTemplateState.errors[key] = error?.message || String(error);
    renderLiveTemplateStatus(key, 'error', null, `GET /templates/${apiName} failed. Mock fallback remains active.`);
    return null;
  }
}
async function loadLiveProviderTemplates(){
  if (liveProviderTemplateState.loading || liveProviderTemplateState.loaded) return;
  if (!window.FleetOSPlatformAPI?.providerIntegrations?.templates) return;
  liveProviderTemplateState.loading = true;
  const select = document.getElementById('vendorSelect');
  renderLiveTemplateStatus(select?.value || 'Other', 'loading', null, 'Loading available provider templates…');
  try {
    const names = await FleetOSPlatformAPI.providerIntegrations.templates();
    liveProviderTemplateState.names = Array.isArray(names) ? names : [];
    liveProviderTemplateState.loaded = true;
    liveProviderTemplateState.names.forEach(name => mergeLiveVendorTemplate(name, {}));
    refreshVendorFilterOptions();
    if (select) {
      const previous = select.value || templateVendorKey(liveProviderTemplateState.names[0]) || 'Other';
      select.innerHTML = vendorOptionsHtml(previous);
      if (!select.value && select.options.length) select.selectedIndex = 0;
      hydrateVendor();
      await fetchProviderTemplateDetail(select.value);
    }
    const count = liveProviderTemplateState.names.length;
    renderLiveTemplateStatus(select?.value || 'Other', count ? 'success' : 'idle', null, count ? `${count} backend provider template(s) available. Mock templates are preserved as fallback.` : 'No backend templates returned. Mock templates remain active.');
  } catch (error) {
    renderLiveTemplateStatus(select?.value || 'Other', 'error', null, 'Unable to load provider template list. Mock templates remain active.');
  } finally {
    liveProviderTemplateState.loading = false;
  }
}


let integrations = JSON.parse(localStorage.getItem('fleetos_demo_integrations') || 'null') || [
  {id:'INT-00091',code:'INT-HUAWEI-001',name:'Tenant Alpha Energy — Huawei FusionSolar',tenant:'Tenant Alpha Energy',vendor:'Huawei',software:'FusionSolar',status:'Active',health:'Healthy',auth:'Valid',discovery:'Completed',plants:142,devices:1840,metrics:215,alerts:58,lastSync:'2 min ago',assignedTenants:'Global',activeIntegrations:18,version:'v2.4.1',apiVersion:'2024-11',mappingVersion:'Solar Core v1.8',authType:'OAuth 2.0 + Account',discoveryEnabled:'Yes',baseUrl:'https://eu5.fusionsolar.huawei.com',createdBy:'Global Admin',createdAt:'2026-05-12',updatedBy:'Integration Admin',updatedAt:'2026-06-04',lastActivity:'2 min ago',lastSuccessfulSync:'2 min ago',vendorName:'Huawei FusionSolar',allowedIpWhitelist:'203.0.113.10, 203.0.113.24',domainWhitelist:'eu5.fusionsolar.huawei.com, api.fusionsolar.huawei.com',rateLimit:'1000',rateLimitPeriod:'Hour',syncFrequency:'5 min',syncStartTime:'00:00',lastSyncTimestampField:'updated_at',partnerVendorId:'HUA-EU-2048',accountId:'FS-OPS-7712',contactPhoneNumber:'+49 30 5557 1400',contactName:'Martin Keller',contactRole:'Mr.',technicalContactEmail:'fusion.support@vendorcloud.example',technicalContactPhone:'+49 30 5557 1401',supportEmail:'support@vendorcloud.example'},
  {id:'INT-00092',code:'INT-SUNGROW-002',name:'Tenant North Operations — Sungrow iSolarCloud',tenant:'Tenant North Operations',vendor:'Sungrow',software:'iSolarCloud',status:'Inactive',health:'Warning',auth:'Valid',discovery:'Completed With Warnings',plants:58,devices:790,metrics:174,alerts:31,lastSync:'18 min ago',assignedTenants:'12 Tenants',activeIntegrations:12,version:'v1.9.0',apiVersion:'2024-08',mappingVersion:'Solar Core v1.7',authType:'App Key Authentication',discoveryEnabled:'Yes',baseUrl:'https://gateway.isolarcloud.com',createdBy:'Global Admin',createdAt:'2026-05-18',updatedBy:'Integration Admin',updatedAt:'2026-06-03',lastActivity:'18 min ago',lastSuccessfulSync:'18 min ago',vendorName:'Sungrow iSolarCloud',allowedIpWhitelist:'198.51.100.12, 198.51.100.44',domainWhitelist:'gateway.isolarcloud.com',rateLimit:'800',rateLimitPeriod:'Hour',syncFrequency:'15 min',syncStartTime:'00:10',lastSyncTimestampField:'timestamp',partnerVendorId:'SUN-GLB-1180',accountId:'ISC-442918',contactPhoneNumber:'+44 20 5550 9182',contactName:'Emily Carter',contactRole:'Ms.',technicalContactEmail:'isolar.support@vendorcloud.example',technicalContactPhone:'+44 20 5550 9183',supportEmail:'support@vendorcloud.example'},
  {id:'INT-00093',code:'INT-SOLIS-003',name:'Tenant Gamma Grid — Solis SolisCloud',tenant:'Tenant Gamma Grid',vendor:'Solis',software:'SolisCloud',status:'Inactive',health:'Failed',auth:'Expired',discovery:'Failed',plants:0,devices:0,metrics:0,alerts:0,lastSync:'54 min ago',assignedTenants:'4 Tenants',activeIntegrations:4,version:'v1.3.6',apiVersion:'2024-03',mappingVersion:'Solar Core v1.5',authType:'API Key Authentication',discoveryEnabled:'No',baseUrl:'https://www.soliscloud.com',createdBy:'Global Admin',createdAt:'2026-04-28',updatedBy:'Integration Admin',updatedAt:'2026-05-29',lastActivity:'54 min ago',lastSuccessfulSync:'Previous period',vendorName:'SolisCloud',allowedIpWhitelist:'192.0.2.15, 192.0.2.29',domainWhitelist:'www.soliscloud.com',rateLimit:'500',rateLimitPeriod:'Hour',syncFrequency:'30 min',syncStartTime:'00:20',lastSyncTimestampField:'lastUpdateTime',partnerVendorId:'SOLIS-OPS-5031',accountId:'SC-907144',contactPhoneNumber:'+1 555 672 4400',contactName:'Laura Smith',contactRole:'Ms.',technicalContactEmail:'solis.support@vendorcloud.example',technicalContactPhone:'+1 555 672 4401',supportEmail:'support@vendorcloud.example'}
];
function saveInts(){ localStorage.setItem('fleetos_demo_integrations', JSON.stringify(integrations)); }

function integrationTenants(){
  const stored = JSON.parse(localStorage.getItem('fleetos_demo_tenants') || 'null');
  if (stored && stored.length) return stored;
  return [
    {id:'CLT-000125', name:'Tenant Alpha Energy'},
    {id:'CLT-000126', name:'Tenant North Operations'},
    {id:'CLT-000127', name:'Tenant Gamma Grid'},
    {id:'CLT-000128', name:'Tenant Delta Enterprise'}
  ];
}
function selectedIntegrationTenantName(){
  const scoped = localStorage.getItem('fleetos_integration_tenant') || '';
  const tenants = integrationTenants();
  if (scoped && scoped !== 'All Tenants') return scoped;
  return tenants[0]?.name || '';
}
function tenantOptions(selected){
  return integrationTenants().map(c => `<option value="${c.name}" ${c.name === selected ? 'selected' : ''}>${c.name}</option>`).join('');
}
function autoIntegrationName(){
  const tenant = document.getElementById('tenantSelect')?.value || '';
  const vendor = document.getElementById('vendorSelect')?.value || 'Huawei';
  const tpl = vendorTemplates[vendor] || vendorTemplates.Huawei;
  return tenant ? `${tenant} — ${vendor} ${tpl.software}` : `${vendor} ${tpl.software}`;
}
function updateIntegrationName(force = false){
  const input = document.getElementById('integrationName');
  if (!input) return;
  if (force || !input.dataset.touched || !input.value.trim()) input.value = autoIntegrationName();
}
function statusCls(v){
  v = String(v).toLowerCase();
  if (v.includes('fail') || v.includes('expired') || v.includes('critical')) return 'danger';
  if (v.includes('warning') || v.includes('testing') || v.includes('draft') || v.includes('inactive')) return 'warning';
  return 'success';
}
function connectorStatus(x){
  return String(x?.status || '').toLowerCase() === 'active' ? 'Active' : 'Inactive';
}
function assignedTenantsLabel(x){
  return x?.assignedTenants || (x?.tenant === 'All Tenants' ? 'Global' : '1 Tenant');
}
function connectorConfig(x){
  const tpl = vendorTemplates[x?.vendor] || vendorTemplates.Other;
  return {
    authType: x?.authType || tpl.auth || 'Dynamic Authentication',
    baseUrl: x?.baseUrl || tpl.base || 'Defined manually',
    apiVersion: x?.apiVersion || 'Vendor API',
    mappingVersion: x?.mappingVersion || 'Solar Core v1.0',
    discoveryEnabled: x?.discoveryEnabled || (String(x?.discovery || '').toLowerCase().includes('completed') ? 'Yes' : 'No')
  };
}
function integrationRowActions(id){
  return `<div class="archive-actions-cell integration-row-actions">
    <div class="kebab-wrap">
      <button class="kebab-btn" data-action="menu" aria-label="Open connector actions" title="Actions">⋮</button>
      <div class="kebab-menu" data-menu-for="${id}">
        <button data-int-action="edit">Edit</button>
        <button data-int-action="archive">Archive</button>
      </div>
    </div>
  </div>`;
}
function integrationRows(rows){
  return `<div class="data-table integration-table integration-table-actions"><div class="data-head"><span>Connector</span><span>Vendor / Type</span><span>Assigned Tenants</span><span>Status</span><span>Last Activity</span><span>Actions</span></div>${rows.map(x => { const cStatus = connectorStatus(x); return `<div class="data-row clickable-row" data-id="${x.id}" role="button" tabindex="0"><div><strong>${x.vendor} ${x.software}</strong><small>${x.code}<br>${x.id}</small></div><div><strong>${x.vendor}</strong><small>${(vendorTemplates[x.vendor] || vendorTemplates.Other).method}</small></div><div><strong>${assignedTenantsLabel(x)}</strong><small>${x.tenant || 'Platform scope'}</small></div><div class="integration-health-cell"><span class="badge ${statusCls(cStatus)}">${cStatus}</span><small>Lifecycle controlled by Global Admin</small></div><div><strong>${x.lastActivity || x.lastSync || '—'}</strong><small>Last successful sync: ${x.lastSuccessfulSync || x.lastSync || '—'}</small></div>${integrationRowActions(x.id)}</div>`; }).join('')}</div>`;
}
function renderIntegrations(){
  const tenant = localStorage.getItem('fleetos_integration_tenant') || 'All Tenants';
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Connector Registry</p><h1>Connector Registry</h1><p class="muted">Reusable vendor connector definitions with status, tenant assignment and registry metadata.</p></div><button class="create-action" id="openIntegrationWizard" type="button"><span class="pulse"></span><div><strong>+ New Connector</strong><small>${tenant}</small></div></button></section><section class="context-bar glass-card"><button class="ctx-item"><span>Visible Integrations</span><strong>${integrations.filter(x=>!isArchivedIntegration(x)).length}</strong></button><button class="ctx-item"><span>Active</span><strong>${integrations.filter(x=>!isArchivedIntegration(x) && connectorStatus(x)==='Active').length}</strong></button><button class="ctx-item"><span>Inactive</span><strong>${integrations.filter(x=>!isArchivedIntegration(x) && connectorStatus(x)==='Inactive').length}</strong></button><button class="ctx-item"><span>Tenant Scope</span><strong>${tenant}</strong></button></section><section class="panel glass-card"><div class="panel-head"><div><h2>Vendor Connectors</h2><p>Click a connector row to open registry details. Operational sync monitoring belongs to Connector Operations.</p></div><div class="toolbar"><input id="intSearch" placeholder="Search connector, vendor, tenant..."/><select id="vendorFilter"><option>All Vendors</option>${allVendorTemplateKeys().map(v=>`<option>${v}</option>`).join('')}</select></div></div><div id="integrationTable">${integrationRows(integrations.filter(x=>!isArchivedIntegration(x)))}</div></section>${integrationWizard(tenant)}`;
}
function integrationWizard(){
  const steps = ['General','Connection & Authentication','API Request','Synchronization','Partner Account'];
  const stepDescriptions = {
    'General': 'Define the connector identity, vendor name and lifecycle status. Activation controls live here because they change the registry lifecycle.',
    'Connection & Authentication': 'Configure vendor host, whitelist rules and credentials. Connection and sample-data tests are executed from this section.',
    'API Request': 'Define request limits and API throttling parameters used by the connector adapter.',
    'Synchronization': 'Define schedule and timestamp fields used by the sync pipeline. Failed-sync behavior is handled by platform policies.',
    'Partner Account': 'Capture vendor-side account and contact information only. Tenant ownership and plant/operator IDs are managed elsewhere.'
  };
  const stepIntro = name => `<div class="wizard-description full"><strong>${name}</strong><p>${stepDescriptions[name]}</p><textarea name="${name.toLowerCase().replace(/[^a-z0-9]+/g,'_')}_notes" placeholder="Notes for ${name}..."></textarea></div>`;
  return `<aside class="modal" id="intModal"><div class="modal-card wide-modal"><button class="modal-close" id="closeIntModal">x</button><p class="eyebrow">Integration Parameters</p><h2>Connect Vendor Platform</h2><p class="muted">Admin-facing setup only: identity, connection address, vendor credentials, API limits, synchronization and partner/account contact context.</p><div class="setup-layout"><div class="setup-rail">${steps.map((s,i)=>`<button class="${i===0?'active':''}" data-step="${i}"><b>${i+1}</b><span>${s}</span></button>`).join('')}</div><form id="intForm" class="form-grid setup-form">
<div class="wizard-step active">
  <label class="full">Integration Name <input name="name" id="integrationName" placeholder="Auto-generated from Vendor"></label>
  <label>Integration Code <input id="integrationCode" disabled value="Auto-generated"></label>
  <label>Producer / Vendor Template * <select name="vendor" id="vendorSelect">${vendorOptionsHtml('Huawei')}</select></label>
  <div class="wizard-live-template full" id="liveTemplateStatus"><span class="badge neutral">Template source</span><small>Mock fallback template is active until backend templates load.</small></div>
  <label>Vendor Name <input name="vendorName" id="vendorName" placeholder="Vendor company name"></label>
  <label>Integration Status <input id="integrationStatus" disabled value="Archived"></label>
  <div class="integration-page-actions full"><button type="button" class="primary-action" id="activateIntegration">Activate Integration</button><button type="button" id="suspendIntegration">Suspend Integration</button><button type="button" id="archiveIntegration">Archive</button></div>
  ${stepIntro('General')}
</div>
<div class="wizard-step">
  <label class="full">Base URL / Host Address <input id="baseUrl" name="baseUrl" placeholder="Vendor host address"></label>
  <label class="full">Callback URL <input id="callbackUrl" disabled value="Auto-generated when needed"></label>
  <label class="full">Allowed IP Whitelist <textarea name="allowedIpWhitelist" placeholder="One IP or CIDR per line"></textarea></label>
  <label class="full">Domain Whitelist <textarea name="domainWhitelist" placeholder="One domain per line"></textarea></label>
  <div class="full dynamic-fields" id="credentialFields"></div>
  <div class="timeline-mini full" id="authResult">Status: Not Tested</div>
  <div class="readiness full"><h3>Connection Checks</h3><p>Connection <b id="connectionResult">Not tested</b></p><p>Sample Data <b id="discoveryStatus">Not tested</b></p><p>Authentication <b id="readyAuth">Pending</b></p></div>
  <div class="integration-page-actions full"><button type="button" class="primary-action" id="connectionTest">Test Connection</button><button type="button" id="authTest">Test Sample Data</button></div>
  ${stepIntro('Connection & Authentication')}
</div>
<div class="wizard-step">
  <label>Rate Limit <input id="rateLimit" name="rateLimit" type="number" min="0" placeholder="Example: 1000"></label>
  <label>Rate Limit Period <select id="rateLimitPeriod" name="rateLimitPeriod"><option>Minute</option><option>Hour</option><option>Day</option></select></label>
  ${stepIntro('API Request')}
</div>
<div class="wizard-step">
  <label>Sync Frequency <select id="syncFrequency" name="syncFrequency"><option>1 min</option><option selected>5 min</option><option>15 min</option><option>Hourly</option><option>Daily</option></select></label>
  <label>Sync Start Time <input id="syncStartTime" name="syncStartTime" type="time" value="00:00"></label>
  <label class="full">Last Sync Timestamp Field <input id="lastSyncTimestampField" name="lastSyncTimestampField" placeholder="Example: lastSyncAt / updated_at / timestamp"></label>
  ${stepIntro('Synchronization')}
</div>
<div class="wizard-step">
  <label>Partner ID in Vendor System <input name="partnerVendorId" placeholder="Vendor partner ID"></label>
  <label>Account ID <input name="accountId" placeholder="Vendor account ID"></label>
  <label>Contact Phone Number <input name="contactPhoneNumber" type="tel" inputmode="tel" placeholder="+374 XX XXX XXX"></label>
  <label>Contact Name <input name="contactName" placeholder="Contact full name"></label>
  <label>Contact Role <select name="contactRole"><option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option><option>Prof.</option><option>Other</option></select></label>
  <label>Technical Contact Email <input name="technicalContactEmail" type="email" placeholder="technical@example.com"></label>
  <label>Technical Contact Phone <input name="technicalContactPhone" type="tel" inputmode="tel" placeholder="+374 XX XXX XXX"></label>
  <label>Support Email <input name="supportEmail" type="email" placeholder="support@example.com"></label>
  ${stepIntro('Partner Account')}
</div>
<div class="integration-hidden-state" aria-hidden="true"><input id="softwareName" type="hidden"><input id="protocol" type="hidden"><input id="portNumber" type="hidden"><input id="endpointInfo" type="hidden"><input id="methodSelect" type="hidden"><input id="directionSelect" type="hidden"><input id="syncMode" type="hidden"><input id="dataFormat" type="hidden"><span id="readyDiscovery">Pending</span><span id="plantsFound">0</span><span id="devicesFound">0</span><span id="metricsFound">0</span><span id="alertsFound">0</span><button type="button" id="runDiscovery"></button><button type="button" id="approveDiscovery"></button></div>
</form></div><div class="modal-actions"><button id="prevIntStep">Back</button><button id="nextIntStep">Save & Continue</button><button class="primary-action" id="saveIntegration">Save Integration</button></div></div></aside>`;
}
function fieldType(name){
  const lower = name.toLowerCase();
  if (lower.includes('password') || lower.includes('secret') || lower.includes('token') || lower.includes('key')) return 'password';
  return 'text';
}
function selectOptions(options){ return options.map(x => `<option>${x}</option>`).join(''); }
function hydrateVendor(){
  const vendor = document.getElementById('vendorSelect')?.value || 'Huawei';
  const tpl = vendorTemplates[vendor] || vendorTemplates[templateVendorKey(vendor)] || vendorTemplates.Huawei;
  renderLiveTemplateStatus(vendor);
  const byId = id => document.getElementById(id);
  if (!byId('softwareName')) return;

  const setValue = (id, value) => { const el = byId(id); if (el) el.value = value; };
  setValue('softwareName', tpl.software);
  setValue('protocol', tpl.protocol);
  setValue('baseUrl', tpl.base);
  setValue('portNumber', tpl.port);
  setValue('endpointInfo', vendor === 'Other' ? 'Manual / Advanced details' : `${tpl.base} / vendor API template`);
  setValue('callbackUrl', tpl.method === 'Webhook' ? 'https://api.fleetos.com/webhooks/auto-generated' : 'Auto-generated by FleetOS when callback is required');
  setValue('methodSelect', tpl.method);
  setValue('directionSelect', tpl.direction);
  setValue('syncMode', tpl.sync);
  setValue('dataFormat', tpl.format.includes('JSON') ? 'JSON' : 'CSV');

  const credentialFields = byId('credentialFields');
  if (credentialFields) {
    credentialFields.innerHTML = tpl.credentials.map(f => { const key = f.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); return `<label>${f}<input name="credential_${key}" type="${fieldType(f)}" placeholder="${f}"></label>`; }).join('');
  }
  applyTemplateDetailToForm(vendor);


  const estimated = byId('estimatedLoad');
  if (estimated) estimated.textContent = `${tpl.discovery.plants || 'Custom'} plants · ${tpl.discovery.devices || 'Custom'} devices · ${tpl.discovery.metrics || 'Custom'} metrics · ${tpl.scope}`;
}
function setWizardIntegrationStatus(status){
  const general = document.getElementById('integrationStatus');
  if (general) general.value = status;
}
function isArchivedIntegration(x){
  return String(x?.status || '').toLowerCase() === 'archived';
}
const archivedIntegrationMocks = [
  {id:'ARCH-INT-00012', code:'INT-HUAWEI-OLD-001', name:'Arpi Solar Group — Huawei FusionSolar Legacy', tenant:'Arpi Solar Group', vendor:'Huawei', software:'FusionSolar', status:'Archived', health:'Archived', auth:'Expired', discovery:'Completed', plants:42, devices:612, inverters:94, meters:38, weatherPlants:7, bess:2, metrics:184, alerts:37, archivedAt:'2026-04-12', archivedBy:'Integration Admin', archiveReason:'Replaced by FusionSolar v2 connector', lastSuccessfulSync:'2026-04-11 23:45', retention:'Preserve raw + normalized history', restore:'Available', endpoint:'https://eu5.fusionsolar.huawei.com', authType:'OAuth 2.0 + Account', connectorVersion:'v1.8.3', apiVersion:'2024-05', mappingVersion:'Solar Core v1.6', discoveryMode:'Full discovery', syncInterval:'5 min', firstConnected:'2025-08-14', totalSyncJobs:'18,420', successfulJobs:'18,102', failedJobs:'318', avgDuration:'12.4s'},
  {id:'ARCH-INT-00018', code:'INT-SUNGROW-DEMO-004', name:'SolarPark East — Sungrow iSolarCloud', tenant:'SolarPark East', vendor:'Sungrow', software:'iSolarCloud', status:'Archived', health:'Archived', auth:'Revoked', discovery:'Completed', plants:18, devices:244, inverters:51, meters:21, weatherPlants:4, bess:0, metrics:156, alerts:21, archivedAt:'2026-03-28', archivedBy:'Global Admin', archiveReason:'Plant portfolio decommissioned', lastSuccessfulSync:'2026-03-27 18:10', retention:'Audit + reporting snapshots', restore:'Restricted', endpoint:'https://gateway.isolarcloud.com', authType:'App Key Authentication', connectorVersion:'v1.5.0', apiVersion:'2024-02', mappingVersion:'Solar Core v1.5', discoveryMode:'Portfolio discovery', syncInterval:'15 min', firstConnected:'2025-10-02', totalSyncJobs:'9,870', successfulJobs:'9,640', failedJobs:'230', avgDuration:'9.1s'},
  {id:'ARCH-INT-00027', code:'INT-SOLAREDGE-ARM-002', name:'GreenVolt Armenia — SolarEdge Monitoring', tenant:'GreenVolt Armenia', vendor:'SolarEdge', software:'Monitoring Platform', status:'Archived', health:'Archived', auth:'Valid at archive', discovery:'Completed', plants:9, devices:138, inverters:36, meters:9, weatherPlants:3, bess:1, metrics:129, alerts:14, archivedAt:'2026-02-15', archivedBy:'Tenant Operations', archiveReason:'Archived by tenant request', lastSuccessfulSync:'2026-02-15 12:30', retention:'Full metadata retained', restore:'Available', endpoint:'https://monitoringapi.solaredge.com', authType:'API Key Authentication', connectorVersion:'v1.4.2', apiVersion:'2023-12', mappingVersion:'Solar Core v1.4', discoveryMode:'Tenant-scoped discovery', syncInterval:'10 min', firstConnected:'2025-06-21', totalSyncJobs:'11,208', successfulJobs:'11,044', failedJobs:'164', avgDuration:'7.8s'},
  {id:'ARCH-INT-00031', code:'INT-HUAWEI-BESS-009', name:'MegaSolar BESS — Huawei NetEco', tenant:'MegaSolar BESS', vendor:'Huawei', software:'NetEco', status:'Archived', health:'Archived', auth:'Disabled', discovery:'Partial', plants:3, devices:71, inverters:12, meters:6, weatherPlants:2, bess:8, metrics:208, alerts:46, archivedAt:'2026-01-04', archivedBy:'Data Governance', archiveReason:'Duplicate connection merged into canonical connector', lastSuccessfulSync:'2026-01-03 09:20', retention:'Merged lineage retained', restore:'Not recommended', endpoint:'https://netecomock.huawei.example', authType:'Service Account', connectorVersion:'v0.9.8', apiVersion:'2023-09', mappingVersion:'Storage Core v0.9', discoveryMode:'BESS device discovery', syncInterval:'5 min', firstConnected:'2025-04-18', totalSyncJobs:'7,442', successfulJobs:'7,008', failedJobs:'434', avgDuration:'16.6s'},
  {id:'ARCH-INT-00034', code:'INT-TESLA-BESS-001', name:'EcoStorage One — Tesla PowerHub', tenant:'EcoStorage One', vendor:'Tesla', software:'PowerHub', status:'Archived', health:'Archived', auth:'Expired', discovery:'Completed', plants:1, devices:24, inverters:4, meters:3, weatherPlants:1, bess:4, metrics:96, alerts:12, archivedAt:'2025-12-22', archivedBy:'Platform Support', archiveReason:'Migration completed to BESS normalization adapter', lastSuccessfulSync:'2025-12-21 17:05', retention:'Cold storage after 12 months', restore:'Available', endpoint:'https://powerhub.tesla.example', authType:'Token Authentication', connectorVersion:'v1.0.1', apiVersion:'2023-10', mappingVersion:'Storage Core v1.0', discoveryMode:'Storage-plant discovery', syncInterval:'15 min', firstConnected:'2025-02-12', totalSyncJobs:'5,018', successfulJobs:'4,966', failedJobs:'52', avgDuration:'6.3s'}
];

function archivedIntegrationRecords(){
  const existing = integrations.filter(isArchivedIntegration);
  const ids = new Set(existing.map(x => x.id));
  return [...existing, ...archivedIntegrationMocks.filter(x => !ids.has(x.id))];
}

function archiveActionMenu(id){
  return `<div class="kebab-wrap archive-actions-menu">
    <button class="kebab-btn" data-action="menu" aria-label="Open archive actions" title="Actions">⋮</button>
    <div class="kebab-menu" data-menu-for="${id}">
      <button data-action="view">View archive record</button>
      <button data-action="restore">Restore request</button>
      <button data-action="export">Export metadata</button>
    </div>
  </div>`;
}

function archivedIntegrationRows(rows){
  return `<div class="data-table archive-integration-table"><div class="data-head archive-row-v56"><span>Archived Integration</span><span>Tenant / Vendor</span><span>Archived</span><span>Reason</span><span>Data Retention</span><span></span></div>${rows.map(x => `<div class="data-row archive-row-v56 clickable-row" data-id="${x.id}">
    <div><strong>${x.name}</strong><small>${x.code || 'ARCHIVE'}<br>${x.id}</small></div>
    <div><strong>${x.tenant || 'Platform scope'}</strong><small>${x.vendor} · ${x.software || 'Connector'}</small></div>
    <div><strong>${x.archivedAt || x.updatedAt || 'Archived'}</strong><small>By ${x.archivedBy || x.updatedBy || 'Global Admin'}</small></div>
    <div><strong>${x.archiveReason || 'Lifecycle archived'}</strong><small>Last sync: ${x.lastSuccessfulSync || x.lastSync || '—'}</small></div>
    <div><strong>${x.retention || 'Preserve history'}</strong><small>Restore: ${x.restore || 'Available'}</small></div>
    <div class="archive-actions-cell">${archiveActionMenu(x.id)}</div>
  </div>`).join('')}</div>`;
}

function archivedIntegrationById(id){
  return archivedIntegrationRecords().find(x => x.id === id);
}

function archiveField(label, value, note = ''){
  return `<div><span>${label}</span><strong>${value ?? '—'}</strong>${note ? `<small>${note}</small>` : ''}</div>`;
}

function openArchivedIntegrationDetail(id){
  const x = archivedIntegrationById(id);
  if (!x) return;
  const old = document.getElementById('archiveDetailModal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.className = 'modal open archive-detail-modal';
  modal.id = 'archiveDetailModal';
  const status = x.status || 'Archived';
  const docs = [
    `${x.vendor || 'Connector'} migration report.pdf`,
    `${x.tenant || 'Tenant'} archive approval.pdf`,
    `${x.code || x.id} metadata export.zip`
  ];
  modal.innerHTML = `<div class="modal-card archive-detail-card">
    <button class="modal-close" type="button" data-close="archive-detail">x</button>

    <div class="archive-detail-head archive-detail-head-v58">
      <div>
        <p class="eyebrow">Archived integration record</p>
        <h2>${x.name}</h2>
        <p class="muted">${x.id} · ${x.code || 'ARCHIVE'} · ${x.vendor} ${x.software || ''}</p>
      </div>
    </div>
    <div class="archive-status-line-v58"><span class="badge warn">${status}</span><small>Read-only historical snapshot · live sync disabled</small></div>

    <section class="kpi-grid detail-kpis archive-detail-kpis">
      <article class="kpi-card"><span>Plants</span><strong>${x.plants ?? '—'}</strong><small>historical scope</small></article>
      <article class="kpi-card"><span>Devices</span><strong>${x.devices ?? '—'}</strong><small>last discovered devices</small></article>
      <article class="kpi-card"><span>Sync Jobs</span><strong>${x.totalSyncJobs ?? '—'}</strong><small>${x.failedJobs ?? '—'} failed</small></article>
      <article class="kpi-card"><span>Restore</span><strong>${x.restore || 'Available'}</strong><small>reactivation policy</small></article>
    </section>

    <section class="archive-detail-section-v58">
      <div class="section-title-v58"><h3>Overview</h3><p>Core archive identity and lifecycle context.</p></div>
      <div class="info-grid archive-detail-grid">
        ${archiveField('Integration Name', x.name, 'Archived connector display name')}
        ${archiveField('Integration ID', x.id, x.code || 'Archive record')}
        ${archiveField('Tenant', x.tenant || 'Platform scope', 'Client / organization context')}
        ${archiveField('Vendor / Platform', `${x.vendor || '—'} · ${x.software || 'Connector'}`, 'Source platform')}
        ${archiveField('Archive Date', x.archivedAt || x.updatedAt || 'Archived', `By ${x.archivedBy || x.updatedBy || 'Global Admin'}`)}
        ${archiveField('Archive Reason', x.archiveReason || 'Lifecycle archived', 'Why this connection was removed from live operations')}
        ${archiveField('Auth State', x.auth || 'Archived', 'Credential state at archive time')}
        ${archiveField('Discovery State', x.discovery || '—', 'Last known discovery result')}
      </div>
    </section>

    <section class="archive-detail-section-v58">
      <div class="section-title-v58"><h3>Configuration Snapshot</h3><p>Read-only connector configuration captured at the time of archive.</p></div>
      <div class="info-grid archive-detail-grid">
        ${archiveField('API Endpoint', x.endpoint || x.baseUrl || 'Endpoint unavailable', 'Source API base URL')}
        ${archiveField('Connector Version', x.connectorVersion || x.version || '—', 'Adapter release')}
        ${archiveField('API Version', x.apiVersion || '—', 'Vendor API contract')}
        ${archiveField('Mapping Version', x.mappingVersion || '—', 'Canonical normalization mapping')}
        ${archiveField('Discovery Mode', x.discoveryMode || x.discovery || '—', 'How devices were discovered')}
        ${archiveField('Sync Interval', x.syncInterval || x.syncFrequency || '—', 'Last active schedule')}
        ${archiveField('Retention Policy', x.retention || 'Preserve history', 'Raw payloads, normalized records and lineage')}
      </div>
    </section>

    <section class="archive-detail-section-v58">
      <div class="section-title-v58"><h3>Connected Devices</h3><p>Last known asset scope before the connector was archived.</p></div>
      <div class="asset-snapshot-grid-v58">
        <article><span>Plants</span><strong>${x.plants ?? '—'}</strong></article>
        <article><span>Devices</span><strong>${x.devices ?? '—'}</strong></article>
        <article><span>Inverters</span><strong>${x.inverters ?? '—'}</strong></article>
        <article><span>Meters</span><strong>${x.meters ?? '—'}</strong></article>
        <article><span>Weather Stations</span><strong>${x.weatherPlants ?? '—'}</strong></article>
        <article><span>BESS Systems</span><strong>${x.bess ?? '—'}</strong></article>
        <article><span>Metrics</span><strong>${x.metrics ?? '—'}</strong></article>
        <article><span>Alerts</span><strong>${x.alerts ?? '—'}</strong></article>
      </div>
    </section>

    <section class="archive-detail-section-v58">
      <div class="section-title-v58"><h3>Historical Statistics</h3><p>Operational sync statistics preserved for audit and restore decisions.</p></div>
      <div class="info-grid archive-detail-grid">
        ${archiveField('First Connected', x.firstConnected || '—', 'Initial activation date')}
        ${archiveField('Last Successful Sync', x.lastSuccessfulSync || x.lastSync || '—', 'Last trusted source-to-core event')}
        ${archiveField('Total Sync Jobs', x.totalSyncJobs || '—', 'Historical job count')}
        ${archiveField('Successful Jobs', x.successfulJobs || '—', 'Completed jobs')}
        ${archiveField('Failed Jobs', x.failedJobs || '—', 'Failed or dead-lettered jobs')}
        ${archiveField('Average Sync Duration', x.avgDuration || '—', 'Mean job execution time')}
      </div>
    </section>

    <section class="archive-detail-section-v58 archive-history-panel">
      <div class="section-title-v58"><h3>Archive Timeline</h3><p>Lifecycle events for the archived integration.</p></div>
      <div class="ops-timeline-v56">
        <div><span>${x.archivedAt || 'Archive'}</span><strong>Connection archived</strong><small>${x.archiveReason || 'Lifecycle archive completed'}</small></div>
        <div><span>${x.lastSuccessfulSync || 'Sync'}</span><strong>Last successful sync preserved</strong><small>Final trusted dataset retained for audit and reporting</small></div>
        <div><span>Mapping</span><strong>${x.mappingVersion || 'Canonical mapping'} locked</strong><small>Normalization configuration saved as read-only snapshot</small></div>
        <div><span>Data</span><strong>Retention policy applied</strong><small>${x.retention || 'Preserve raw + normalized history'}</small></div>
        <div><span>Created</span><strong>Integration connected</strong><small>${x.firstConnected || 'Historical activation date not available'}</small></div>
      </div>
    </section>

    <section class="archive-detail-section-v58">
      <div class="section-title-v58"><h3>Related Documents</h3><p>Mock archive evidence and export artifacts.</p></div>
      <div class="archive-doc-list-v58">
        ${docs.map((d, i) => `<article><strong>${d}</strong><small>${i === 0 ? 'Migration / archive evidence' : i === 1 ? 'Approval record' : 'Technical export package'}</small><button onclick="FleetLayout.toast('Opening ${d}')">Open</button></article>`).join('')}
      </div>
    </section>

    <div class="modal-actions row-actions archive-detail-actions">
      <button type="button" data-archive-action="history">View History</button>
      <button type="button" data-archive-action="export">Export Metadata</button>
      <button type="button" data-archive-action="restore">Create Restore Request</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  FleetLayout.enhanceActionMenus?.(modal);
}
function closeArchiveMenus(){
  document.querySelectorAll('.kebab-menu.open').forEach(m => m.classList.remove('open'));
}

function renderArchivedIntegrations(){
  const archived = archivedIntegrationRecords();
  const restored = 11;
  const permanent = 3;
  const thisMonth = archived.filter(x => String(x.archivedAt || '').startsWith('2026-06')).length || 6;
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Integration Governance</p><h1>Integration Archive</h1><p class="muted">Historical connector records preserved for audit, lineage, restore decisions and metadata export. This is not live monitoring.</p></div><div class="hero-actions"><button class="freshness-card" onclick="FleetLayout.toast('Archive export prepared')"><span class="pulse"></span><div><strong>Export Archive</strong><small>CSV + metadata</small></div></button></div></section>
  <section class="kpi-grid detail-kpis"><article class="kpi-card"><span>Archived Integrations</span><strong>${archived.length}</strong><small>Inactive preserved connectors</small></article><article class="kpi-card"><span>Archived This Month</span><strong>${thisMonth}</strong><small>Lifecycle changes</small></article><article class="kpi-card"><span>Restored</span><strong>${restored}</strong><small>Previously reactivated</small></article><article class="kpi-card"><span>Permanent Removals</span><strong>${permanent}</strong><small>Approved purge events</small></article></section>
  <section class="panel glass-card"><div class="panel-head"><div><h2>Archived Connector Records</h2><p>Each record keeps tenant, vendor, archive reason, last successful sync, retention policy and restore availability.</p></div><div class="toolbar"><input id="archiveSearch" placeholder="Search archived integration, vendor, tenant, reason..."/><select id="archiveVendorFilter"><option>All Vendors</option><option>Huawei</option><option>Sungrow</option><option>SolarEdge</option><option>Tesla</option><option>GoodWe</option></select></div></div><div id="archivedIntegrationTable">${archivedIntegrationRows(archived)}</div></section>`;
}
function renderIntegrationArchive(){ return renderArchivedIntegrations(); }

function wireArchivedIntegrations(){
  const search = document.getElementById('archiveSearch');
  const vendor = document.getElementById('archiveVendorFilter');
  const apply = () => {
    const q = (search?.value || '').toLowerCase();
    const v = vendor?.value || 'All Vendors';
    const rows = archivedIntegrationRecords().filter(x => (v === 'All Vendors' || x.vendor === v) && `${x.name} ${x.vendor} ${x.tenant} ${x.archiveReason || ''}`.toLowerCase().includes(q));
    document.getElementById('archivedIntegrationTable').innerHTML = rows.length ? archivedIntegrationRows(rows) : '<div class="empty-state"><strong>No matching archived integrations</strong><span>Try another keyword or vendor.</span></div>';
  };
  if (search) search.oninput = apply;
  if (vendor) vendor.onchange = apply;
  document.getElementById('archivedIntegrationTable')?.addEventListener('click', e => {
    const btn = e.target.closest('button');
    const row = e.target.closest('.data-row');
    if (!row) return;
    const id = row.dataset.id;
    const action = btn?.dataset.action || 'view';

    if (action === 'menu') {
      e.stopPropagation();
      const menu = btn.closest('.kebab-wrap')?.querySelector('.kebab-menu');
      const alreadyOpen = menu?.classList.contains('open');
      closeArchiveMenus();
      if (menu && !alreadyOpen) menu.classList.add('open');
      return;
    }

    closeArchiveMenus();
    if (action === 'restore') { e.stopPropagation(); FleetLayout.toast('Restore request created for archived integration'); return; }
    if (action === 'export') { e.stopPropagation(); FleetLayout.toast('Archive metadata export prepared'); return; }
    localStorage.setItem('fleetos_selected_integration', id);
    openArchivedIntegrationDetail(id);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.kebab-wrap')) closeArchiveMenus();
    if (e.target.matches('[data-close="archive-detail"]')) document.getElementById('archiveDetailModal')?.remove();
    if (e.target.matches('[data-archive-action="restore"]')) FleetLayout.toast('Restore request created for archived integration');
    if (e.target.matches('[data-archive-action="export"]')) FleetLayout.toast('Archive metadata export prepared');
    if (e.target.matches('[data-archive-action="history"]')) FleetLayout.toast('Opening archive history');
  });
}
function wireIntegrationArchive(){ return wireArchivedIntegrations(); }

function wireIntegrations(){
  let step = 0;
  const modal = document.getElementById('intModal'), steps = [...document.querySelectorAll('.wizard-step')], rails = [...document.querySelectorAll('.setup-rail button')];
  const show = i => { step = Math.max(0, Math.min(steps.length - 1, i)); steps.forEach((s,n)=>s.classList.toggle('active', n === step)); rails.forEach((r,n)=>r.classList.toggle('active', n === step)); hydrateVendor(); };
  loadLiveProviderTemplates();
  document.getElementById('openIntegrationWizard').onclick = async () => { modal.classList.add('open'); hydrateVendor(); await fetchProviderTemplateDetail(document.getElementById('vendorSelect').value); updateIntegrationName(true); setWizardIntegrationStatus('Archived'); };
  document.getElementById('closeIntModal').onclick = () => modal.classList.remove('open');
  rails.forEach(r => r.onclick = () => show(+r.dataset.step));
  document.getElementById('prevIntStep').onclick = e => { e.preventDefault(); show(step - 1); };
  document.getElementById('nextIntStep').onclick = e => { e.preventDefault(); show(step + 1); FleetLayout.toast('Step saved'); };
  document.getElementById('vendorSelect').onchange = async () => { hydrateVendor(); await fetchProviderTemplateDetail(document.getElementById('vendorSelect').value); updateIntegrationName(true); FleetLayout.toast('Vendor template applied'); };
  document.getElementById('integrationName').addEventListener('input', e => e.target.dataset.touched = '1');

  document.getElementById('connectionTest').onclick = () => {
    const v = document.getElementById('vendorSelect').value;
    document.getElementById('connectionResult').textContent = `${v} connection successful · SSL OK · Endpoint reachable · Port ${(vendorTemplates[v] || vendorTemplates[templateVendorKey(v)] || vendorTemplates.Other).port}`;
    FleetLayout.toast('Connection test passed');
  };
  document.getElementById('authTest').onclick = () => {
    const v = document.getElementById('vendorSelect').value;
    document.getElementById('authResult').textContent = `Status: Valid · ${v} sample data received`;
    document.getElementById('discoveryStatus').textContent = 'Passed';
    document.getElementById('readyAuth').textContent = 'Passed';
    FleetLayout.toast('Sample data test passed');
  };
  document.getElementById('runDiscovery').onclick = () => {
    const v = document.getElementById('vendorSelect').value;
    const d = (vendorTemplates[v] || vendorTemplates[templateVendorKey(v)] || vendorTemplates.Other).discovery;
    document.getElementById('discoveryStatus').textContent = 'Completed';
    document.getElementById('plantsFound').textContent = d.plants;
    document.getElementById('devicesFound').textContent = d.devices;
    document.getElementById('metricsFound').textContent = d.metrics;
    document.getElementById('alertsFound').textContent = d.alerts;
    document.getElementById('readyDiscovery').textContent = 'Passed';
    FleetLayout.toast(`${v} discovery completed`);
  };
  document.getElementById('approveDiscovery').onclick = () => FleetLayout.toast('Discovery approved. Plants/devices will be generated.');
  document.getElementById('activateIntegration').onclick = () => { setWizardIntegrationStatus('Active'); FleetLayout.toast('Integration status changed to Active'); };
  document.getElementById('suspendIntegration').onclick = () => { setWizardIntegrationStatus('Inactive'); FleetLayout.toast('Integration status changed to Inactive'); };
  document.getElementById('archiveIntegration').onclick = () => { setWizardIntegrationStatus('Archived'); FleetLayout.toast('Integration status changed to Archived'); };

  const filter = () => {
    const q = document.getElementById('intSearch').value.toLowerCase(), v = document.getElementById('vendorFilter').value;
    document.getElementById('integrationTable').innerHTML = integrationRows(integrations.filter(x => !isArchivedIntegration(x)).filter(x => (v === 'All Vendors' || x.vendor === v) && `${x.name} ${x.vendor} ${x.tenant}`.toLowerCase().includes(q)));
  };
  document.getElementById('intSearch').oninput = filter;
  document.getElementById('vendorFilter').onchange = filter;
  document.getElementById('integrationTable').onclick = e => {
    const btn = e.target.closest('button');
    const row = e.target.closest('.data-row');
    if (!row) return;
    const id = row.dataset.id;
    if (btn?.dataset.action === 'menu') {
      e.preventDefault();
      e.stopPropagation();
      const menu = btn.closest('.kebab-wrap')?.querySelector('.kebab-menu');
      const alreadyOpen = menu?.classList.contains('open');
      closeArchiveMenus();
      if (menu && !alreadyOpen) menu.classList.add('open');
      return;
    }
    const action = btn?.dataset.intAction;
    if (action) {
      e.preventDefault();
      e.stopPropagation();
      closeArchiveMenus();
      if (action === 'edit') {
        localStorage.setItem('fleetos_selected_integration', id);
        localStorage.setItem('fleetos_integration_detail_edit', 'general');
        location.href='integration-detail.html';
        return;
      }
      if (action === 'archive') {
        const item = integrations.find(x => x.id === id);
        if (item) { item.status = 'Archived'; item.archived = true; item.archivedAt = new Date().toISOString().slice(0,10); saveInts(); filter(); FleetLayout.toast('Connector archived'); }
        return;
      }
    }
    localStorage.setItem('fleetos_selected_integration', id);
    location.href='integration-detail.html';
  };
  document.getElementById('saveIntegration').onclick = e => {
    e.preventDefault();
    const fd = new FormData(document.getElementById('intForm'));
    let name = fd.get('name');
    const vendor = fd.get('vendor') || 'Huawei', tpl = vendorTemplates[vendor] || vendorTemplates[templateVendorKey(vendor)] || vendorTemplates.Other;
    const tenant = 'Platform scope';
    if (!name) name = autoIntegrationName();
    integrations.unshift({
      id: 'INT-' + Math.floor(10000 + Math.random() * 89999),
      code: 'INT-' + vendor.toUpperCase() + '-' + Math.floor(100 + Math.random() * 899),
      name, tenant, vendor, software: tpl.software, status: document.getElementById('integrationStatus')?.value || 'Archived', health: 'Warning',
      auth: document.getElementById('authResult').textContent.includes('Valid') ? 'Valid' : 'Not Tested',
      discovery: document.getElementById('discoveryStatus').textContent,
      plants: +document.getElementById('plantsFound').textContent || 0,
      devices: +document.getElementById('devicesFound').textContent || 0,
      metrics: +document.getElementById('metricsFound').textContent || 0,
      alerts: +document.getElementById('alertsFound').textContent || 0,
      lastSync: 'Not synced',
      assignedTenants: 'Global',
      activeIntegrations: 1,
      version: 'v1.0.0',
      apiVersion: 'Vendor API',
      mappingVersion: 'Solar Core v1.0',
      authType: tpl.auth,
      discoveryEnabled: document.getElementById('discoveryStatus').textContent === 'Completed' ? 'Yes' : 'No',
      baseUrl: tpl.base,
      createdBy: 'Global Admin',
      createdAt: new Date().toISOString().slice(0,10),
      updatedBy: 'Global Admin',
      updatedAt: new Date().toISOString().slice(0,10),
      lastActivity: 'Created now',
      lastSuccessfulSync: 'Not synced',
      vendorName: fd.get('vendorName') || vendor,
      baseUrl: fd.get('baseUrl') || tpl.base,
      allowedIpWhitelist: fd.get('allowedIpWhitelist') || '203.0.113.10, 203.0.113.24',
      domainWhitelist: fd.get('domainWhitelist') || 'api.vendor-cloud.example, *.vendor-cloud.example',
      rateLimit: fd.get('rateLimit') || '1000',
      rateLimitPeriod: fd.get('rateLimitPeriod') || 'Hour',
      syncFrequency: fd.get('syncFrequency') || '5 min',
      syncStartTime: fd.get('syncStartTime') || '00:00',
      lastSyncTimestampField: fd.get('lastSyncTimestampField') || 'updated_at',
      partnerVendorId: fd.get('partnerVendorId') || 'VND-ACCT-2048',
      accountId: fd.get('accountId') || 'ACC-738291',
      contactPhoneNumber: fd.get('contactPhoneNumber') || '+1 555 248 9123',
      contactName: fd.get('contactName') || 'Michael Johnson',
      contactRole: fd.get('contactRole') || 'Mr.',
      technicalContactEmail: fd.get('technicalContactEmail') || 'integration.support@vendorcloud.example',
      technicalContactPhone: fd.get('technicalContactPhone') || '+1 555 380 4471',
      supportEmail: fd.get('supportEmail') || 'support@vendorcloud.example',
      credentials: Object.fromEntries(Array.from(fd.entries()).filter(([k]) => k.startsWith('credential_')).map(([k,v]) => [k.replace('credential_','').replaceAll('_',' '), v || 'Configured value']))
    });
    saveInts();
    modal.classList.remove('open');
    document.getElementById('integrationTable').innerHTML = integrationRows(integrations.filter(x=>!isArchivedIntegration(x)));
    FleetLayout.toast('Integration saved');
  };
}


function selectedIntegration(){
  const id = localStorage.getItem('fleetos_selected_integration');
  return integrations.find(x => x.id === id) || integrations[0];
}
let integrationDetailEditMode = false;
function renderIntegrationDetail(){
  const x = selectedIntegration();
  const cfg = connectorConfig(x);
  const status = connectorStatus(x);
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Connector Registry</p><h1>${x.vendor} ${x.software}</h1><p class="muted">Connector detail mirrors Integration Parameters. The same sections and field names are used so Global Admin can review what was configured without switching mental models.</p></div><div class="hero-actions"><button class="freshness-card" onclick="location.href='integrations.html'"><span class="pulse"></span><div><strong>Back to Registry</strong><small>Connector list</small></div></button></div></section>
  <section class="kpi-grid detail-kpis"><article class="kpi-card"><span>Status</span><strong>${status}</strong><small>Active / Inactive registry state</small></article><article class="kpi-card"><span>Vendor Name</span><strong>${x.vendorName || x.vendor}</strong><small>${x.software}</small></article><article class="kpi-card"><span>Base URL / Host Address</span><strong>${cfg.baseUrl}</strong><small>Connection endpoint</small></article><article class="kpi-card"><span>Sync Frequency</span><strong>${x.syncFrequency || '5 min'}</strong><small>Starts ${x.syncStartTime || '00:00'}</small></article><article class="kpi-card"><span>Contact Name</span><strong>${x.contactName || 'Michael Johnson'}</strong><small>${x.contactPhoneNumber || '+1 555 248 9123'}</small></article></section>
  <section class="client-layout-v17 detail-layout-standard">
    <aside class="glass-card client-side-card-v17">
      <h3>Integration Navigation</h3>
      <button class="active" data-integration-tab="general">General</button>
      <button data-integration-tab="connection">Connection & Authentication</button>
      <button data-integration-tab="api">API Request</button>
      <button data-integration-tab="synchronization">Synchronization</button>
      <button data-integration-tab="partner">Partner Account</button>
    </aside>
    <section class="glass-card client-main-card-v17">
      <div class="detail-content-head-v32"><div><h2 id="integrationDetailTitle">General</h2><p class="muted">Integration detail uses the same left-navigation detail layout as Client Detail.</p></div><div class="detail-tab-actions"><button id="editIntegrationTab" class="small-btn primary" type="button">Edit</button><button id="cancelIntegrationEdit" class="small-btn ghost hidden" type="button">Cancel</button><button id="saveIntegrationEdit" class="small-btn success hidden" type="button">Save Changes</button></div></div>
      <div id="integrationDetailContent">${integrationDetailTab(x,'general')}</div>
    </section>
  </section>`;
}
function integrationTabLabel(tab){ return ({general:'General',connection:'Connection & Authentication',api:'API Request',synchronization:'Synchronization',partner:'Partner Account'})[tab] || 'Integration Detail'; }
function displayValue(value, fallback = 'Configured value'){
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  return String(value);
}
function maskSecret(label, value){
  const raw = displayValue(value);
  if (raw === 'Configured value') return raw;
  return /password|secret|token|key/i.test(label) ? '••••••••' : raw;
}
function connectorCredentialMap(x){
  const tpl = vendorTemplates[x.vendor] || vendorTemplates.Other;
  const stored = x.credentials || {};
  return Object.fromEntries(tpl.credentials.map(name => [name, stored[name] || stored[name.toLowerCase()] || 'Configured value']));
}
function editableControl(key, value, label){
  const safe = String(displayValue(value, '')).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const long = safe.length > 45 || /notes|whitelist|domain/i.test(key + ' ' + label);
  if (/status$/i.test(key)) return `<select data-edit-key="${key}"><option ${safe==='Active'?'selected':''}>Active</option><option ${safe==='Inactive'?'selected':''}>Inactive</option><option ${safe==='Archived'?'selected':''}>Archived</option></select>`;
  if (long) return `<textarea data-edit-key="${key}">${safe}</textarea>`;
  return `<input data-edit-key="${key}" value="${safe}">`;
}
function detailInfoGrid(items, editable = false){
  return `<div class="info-grid ${editable ? 'editing-grid' : ''}">${items.map(([label, value, key]) => `<div><span>${label}</span>${editable && key ? editableControl(key, value, label) : `<strong>${displayValue(value)}</strong>`}</div>`).join('')}</div>`;
}
function detailNote(title, copy){
  return `<div class="panel-lite full"><h3>${title}</h3><p class="detail-copy">${copy}</p></div>`;
}
function integrationDetailTab(x, tab, editable = integrationDetailEditMode){
  const cfg = connectorConfig(x);
  const status = connectorStatus(x);
  if(tab === 'connection') {
    const credentials = connectorCredentialMap(x);
    return `<div class="split-grid"><div class="panel-lite"><h3>Connection</h3>${detailInfoGrid([
      ['Base URL / Host Address', cfg.baseUrl, 'baseUrl'],
      ['Callback URL', x.callbackUrl || 'Auto-generated when needed', 'callbackUrl'],
      ['Allowed IP Whitelist', x.allowedIpWhitelist || '203.0.113.10, 203.0.113.24', 'allowedIpWhitelist'],
      ['Domain Whitelist', x.domainWhitelist || 'api.vendor-cloud.example, *.vendor-cloud.example', 'domainWhitelist']
    ], editable)}</div><div class="panel-lite"><h3>Authentication</h3>${detailInfoGrid([
      ['Connection Check', x.connectionResult || 'Connection passed', 'connectionResult'],
      ['Sample Data Check', x.discovery || 'Sample data validated', 'discovery'],
      ['Authentication', x.auth || 'Valid', 'auth']
    ], editable)}</div><div class="panel-lite full"><h3>Credential Fields</h3><div class="info-grid ${editable ? 'editing-grid' : ''}">${Object.entries(credentials).map(([label, value]) => `<div><span>${label}</span>${editable ? editableControl(`credentials::${label}`, value, label) : `<strong>${maskSecret(label, value)}</strong>`}</div>`).join('')}</div></div>${detailNote('Connection & Authentication Notes', x.connection_authentication_notes || 'Shows only the connection, endpoint, whitelist, validation and credential context entered in Integration Parameters. Sensitive values are masked.')}</div>`;
  }
  if(tab === 'api') return `<div class="split-grid"><div class="panel-lite"><h3>API Request</h3>${detailInfoGrid([
    ['Rate Limit', x.rateLimit || '1000', 'rateLimit'],
    ['Rate Limit Period', x.rateLimitPeriod || 'Hour', 'rateLimitPeriod']
  ], editable)}</div>${detailNote('API Request Notes', x.api_request_notes || 'Shows the same request-limit fields configured in the API Request step.')}</div>`;
  if(tab === 'synchronization') return `<div class="split-grid"><div class="panel-lite"><h3>Synchronization</h3>${detailInfoGrid([
    ['Sync Frequency', x.syncFrequency || '5 min', 'syncFrequency'],
    ['Sync Start Time', x.syncStartTime || '00:00', 'syncStartTime'],
    ['Last Sync Timestamp Field', x.lastSyncTimestampField || 'updated_at', 'lastSyncTimestampField']
  ], editable)}</div>${detailNote('Synchronization Notes', x.synchronization_notes || 'Failed sync action is intentionally not shown here. Retry, alerting and queue handling belong to Connector Operations.')}</div>`;
  if(tab === 'partner') return `<div class="split-grid"><div class="panel-lite"><h3>Partner Account</h3>${detailInfoGrid([
    ['Partner ID in Vendor System', x.partnerVendorId || 'VND-ACCT-2048', 'partnerVendorId'],
    ['Account ID', x.accountId || 'ACC-738291', 'accountId'],
    ['Contact Phone Number', x.contactPhoneNumber || '+1 555 248 9123', 'contactPhoneNumber'],
    ['Contact Name', x.contactName || 'Michael Johnson', 'contactName'],
    ['Contact Role', x.contactRole || 'Mr.', 'contactRole'],
    ['Technical Contact Email', x.technicalContactEmail || 'integration.support@vendorcloud.example', 'technicalContactEmail'],
    ['Technical Contact Phone', x.technicalContactPhone || '+1 555 380 4471', 'technicalContactPhone'],
    ['Support Email', x.supportEmail || 'support@vendorcloud.example', 'supportEmail']
  ], editable)}</div>${detailNote('Partner Account Notes', x.partner_account_notes || 'Partner Account displays vendor-side account and contact context only. Tenant ownership fields are intentionally removed from Global Admin Integration Parameters.')}</div>`;
  return `<div class="split-grid"><div class="panel-lite"><h3>General</h3>${detailInfoGrid([
    ['Integration Name', x.name || `${x.vendor} ${x.software}`, 'name'],
    ['Integration Code', x.code, 'code'],
    ['Producer / Vendor Template', x.vendor, 'vendor'],
    ['Vendor Name', x.vendorName || x.vendor, 'vendorName'],
    ['Integration Status', x.status || status, 'status']
  ], editable)}</div>${detailNote('General Notes', x.general_notes || 'This page uses the same section names and field names as Integration Parameters so the setup form and read-only detail remain aligned.')}</div>`;
}
function activeIntegrationDetailTab(){
  return document.querySelector('[data-integration-tab].active')?.dataset.integrationTab || 'general';
}
function setIntegrationDetailEditMode(enabled){
  integrationDetailEditMode = enabled;
  const tab = activeIntegrationDetailTab();
  const content = document.getElementById('integrationDetailContent');
  if (content) content.innerHTML = integrationDetailTab(selectedIntegration(), tab, enabled);
  const title = document.getElementById('integrationDetailTitle');
  if (title) title.textContent = integrationTabLabel(tab);
  document.getElementById('editIntegrationTab')?.classList.toggle('hidden', enabled);
  document.getElementById('cancelIntegrationEdit')?.classList.toggle('hidden', !enabled);
  document.getElementById('saveIntegrationEdit')?.classList.toggle('hidden', !enabled);
}
function saveIntegrationDetailEdits(){
  const x = selectedIntegration();
  document.querySelectorAll('#integrationDetailContent [data-edit-key]').forEach(input => {
    const key = input.dataset.editKey;
    const value = input.value;
    if (key.startsWith('credentials::')) {
      x.credentials = x.credentials || {};
      x.credentials[key.replace('credentials::','')] = value;
    } else {
      x[key] = value;
    }
  });
  x.updatedBy = 'Global Admin';
  x.updatedAt = new Date().toISOString().slice(0,10);
  saveInts();
  setIntegrationDetailEditMode(false);
  FleetLayout.toast('Section saved');
}
function wireIntegrationDetail(){
  document.querySelectorAll('[data-integration-tab]').forEach(b => b.onclick = () => {
    document.querySelectorAll('[data-integration-tab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const title = document.getElementById('integrationDetailTitle');
    if (title) title.textContent = integrationTabLabel(b.dataset.integrationTab);
    setIntegrationDetailEditMode(false);
  });
  document.getElementById('editIntegrationTab')?.addEventListener('click', () => setIntegrationDetailEditMode(true));
  document.getElementById('cancelIntegrationEdit')?.addEventListener('click', () => setIntegrationDetailEditMode(false));
  document.getElementById('saveIntegrationEdit')?.addEventListener('click', saveIntegrationDetailEdits);
  const requested = localStorage.getItem('fleetos_integration_detail_edit');
  if (requested) {
    localStorage.removeItem('fleetos_integration_detail_edit');
    const tabBtn = document.querySelector(`[data-integration-tab="${requested}"]`) || document.querySelector('[data-integration-tab].active');
    if (tabBtn) { document.querySelectorAll('[data-integration-tab]').forEach(x => x.classList.remove('active')); tabBtn.classList.add('active'); const title = document.getElementById('integrationDetailTitle'); if (title) title.textContent = integrationTabLabel(tabBtn.dataset.integrationTab); }
    setIntegrationDetailEditMode(true);
  }
}
