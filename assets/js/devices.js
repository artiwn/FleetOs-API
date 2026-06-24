const demoDevices = [
  { id:'DEV-INV-00432', externalId:'HUA-INV-00432', name:'INV-00432', type:'Inverter', subtype:'String Inverter', manufacturer:'Huawei', model:'SUN2000-100KTL-M1', serial:'SN-HUA-00432', firmware:'V300R023C10', ip:'10.24.1.42', mac:'A4:C1:38:02:11:42', plantId:'PLT-000421', plant:'Plant A', tenant:'Tenant Alpha Energy', vendor:'Huawei', integration:'Tenant Alpha Energy — Huawei FusionSolar', status:'Online', lifecycle:'Active', capacity:'100 kW', installation:'2023-04-16', warranty:'2028-04-16', lastSeen:'2 min ago', alerts:0, power:'83.4 kW', voltage:'612 V', current:'136 A', temperature:'42 °C', pr:'98.1%', sourceStatus:'Mapped', parent:'Area A / Transformer T1', children:'MPPT 1–12 · 24 strings' },
  { id:'DEV-INV-00921', externalId:'HUA-INV-00921', name:'INV-00921', type:'Inverter', subtype:'String Inverter', manufacturer:'Huawei', model:'SUN2000-60KTL-M0', serial:'SN-HUA-00921', firmware:'V300R021C00', ip:'10.24.1.77', mac:'A4:C1:38:02:19:21', plantId:'PLT-000422', plant:'Gyumri Solar West', tenant:'Tenant Alpha Energy', vendor:'Huawei', integration:'Tenant Alpha Energy — Huawei FusionSolar', status:'Warning', lifecycle:'Active', capacity:'60 kW', installation:'2024-02-02', warranty:'2029-02-02', lastSeen:'11 min ago', alerts:2, power:'41.2 kW', voltage:'588 V', current:'70 A', temperature:'58 °C', pr:'91.4%', sourceStatus:'Mapped', parent:'Area B / Transformer T1', children:'MPPT 1–8 · 16 strings' },
  { id:'DEV-BAT-00018', externalId:'SUN-BESS-00018', name:'BESS Rack 18', type:'Battery', subtype:'Battery Rack', manufacturer:'Sungrow', model:'ST2752UX', serial:'SN-SUN-BAT-18', firmware:'BMS-4.8.2', ip:'10.25.8.18', mac:'54:AF:97:11:40:18', plantId:'PLT-000501', plant:'Armavir BESS Solar', tenant:'Tenant North Operations', vendor:'Sungrow', integration:'Tenant North Operations — Sungrow iSolarCloud', status:'Warning', lifecycle:'Active', capacity:'215 kWh', installation:'2022-09-18', warranty:'2032-09-18', lastSeen:'18 min ago', alerts:3, power:'-42 kW', voltage:'742 V', current:'-56 A', temperature:'36 °C', soc:'68%', soh:'94%', sourceStatus:'Mapped', parent:'BESS Container 01', children:'Modules 01–16 · Cells group A' },
  { id:'DEV-MTR-00088', externalId:'HUA-MTR-00088', name:'Main Export Meter', type:'Meter', subtype:'Bidirectional Meter', manufacturer:'Huawei', model:'DTSU666-H', serial:'SN-MTR-00088', firmware:'1.2.9', ip:'10.24.2.88', mac:'00:1B:44:11:3A:88', plantId:'PLT-000421', plant:'Plant A', tenant:'Tenant Alpha Energy', vendor:'Huawei', integration:'Tenant Alpha Energy — Huawei FusionSolar', status:'Online', lifecycle:'Active', capacity:'Grid Point', installation:'2023-04-16', warranty:'2028-04-16', lastSeen:'1 min ago', alerts:0, power:'31.2 MW', voltage:'20 kV', current:'901 A', frequency:'50.01 Hz', sourceStatus:'Mapped', parent:'Grid Connection Point', children:'Import / Export accounting records' },
  { id:'DEV-WTH-00012', externalId:'SOL-WTH-00012', name:'Weather Station 12', type:'Weather Station', subtype:'Irradiance + Temperature', manufacturer:'Solis', model:'SWS-200', serial:'SN-WTH-00012', firmware:'2.1.4', ip:'10.31.4.12', mac:'9C:B6:D0:12:01:12', plantId:'PLT-000611', plant:'Madrid East', tenant:'Tenant Gamma Grid', vendor:'Solis', integration:'Tenant Gamma Grid — Solis SolisCloud', status:'Offline', lifecycle:'Active', capacity:'Sensor', installation:'2021-11-08', warranty:'2026-11-08', lastSeen:'54 min ago', alerts:4, irradiance:'0 W/m2', ambient:'—', moduleTemp:'—', sourceStatus:'Mapped', parent:'Plant Sensor Pole A', children:'Irradiance · Ambient temp · Wind speed' },
  { id:'DEV-TRF-00007', externalId:'HUA-TRF-00007', name:'Transformer T1', type:'Transformer', subtype:'Step-up Transformer', manufacturer:'ABB', model:'TX-2500', serial:'SN-TRF-00007', firmware:'N/A', ip:'—', mac:'—', plantId:'PLT-000720', plant:'Lyon PV Park', tenant:'Tenant Delta Enterprise', vendor:'Huawei', integration:'Tenant Delta Enterprise — Huawei FusionSolar', status:'Online', lifecycle:'Active', capacity:'2.5 MVA', installation:'2023-08-20', warranty:'2033-08-20', lastSeen:'3 min ago', alerts:0, power:'2.1 MVA', voltage:'20 kV', current:'61 A', temperature:'51 °C', sourceStatus:'Linked Existing', parent:'Subplant A', children:'Inverter group A · Meter group A' },
  { id:'DEV-GTW-00031', externalId:'DEY-GTW-00031', name:'Gateway 31', type:'Gateway', subtype:'Communication Device', manufacturer:'Deye', model:'Solarman Logger', serial:'SN-GTW-00031', firmware:'3.6.1', ip:'10.41.2.31', mac:'C8:5B:76:31:11:02', plantId:'PLT-000817', plant:'Plant B', tenant:'Tenant Alpha Energy', vendor:'Deye', integration:'Tenant Alpha Energy — Deye DeyeCloud / Solarman', status:'Online', lifecycle:'Active', capacity:'Logger', installation:'2025-01-29', warranty:'2027-01-29', lastSeen:'4 min ago', alerts:0, signal:'Good', dataLag:'4 min', sourceStatus:'Mapped', parent:'Masis Communication Cabinet', children:'8 inverters · 2 meters' }
];
function devices(){ if (Array.isArray(window.FleetOSLiveDevices) && window.FleetOSLiveDevices.length) return window.FleetOSLiveDevices; const stored=JSON.parse(localStorage.getItem('fleetos_demo_devices') || 'null'); if(stored&&stored.length) return stored; localStorage.setItem('fleetos_demo_devices', JSON.stringify(demoDevices)); return demoDevices; }
function saveDevices(list){ localStorage.setItem('fleetos_demo_devices', JSON.stringify(list)); }
function deviceStatusCls(v){ v=String(v).toLowerCase(); if(v.includes('offline')||v.includes('fault')) return 'danger'; if(v.includes('warning')||v.includes('delayed')) return 'warning'; return 'success'; }
function selectedDevice(){ const id=localStorage.getItem('fleetos_selected_device'); return devices().find(d=>d.id===id) || devices()[0]; }
function deviceRows(list){ return `<div class="data-table device-table"><div class="data-head"><span>Device</span><span>Plant / Tenant</span><span>Type</span><span>Vendor Source</span><span>Status</span><span>Actions</span></div>${list.map(d=>`<div class="data-row" data-id="${d.id}"><div><strong>${d.name}</strong><small>${d.id}<br>${d.serial}</small></div><div><strong>${d.plant}</strong><small>${d.tenant}</small></div><div><strong>${d.type}</strong><small>${d.subtype} · ${d.capacity}</small></div><div><strong>${d.vendor}</strong><small>${d.integration}<br>${d.sourceStatus}</small></div><div><span class="badge ${deviceStatusCls(d.status)}">${d.status}</span><small>${d.alerts} alerts · ${d.lastSeen}</small></div><div class="row-actions"><button data-action="open">Open</button><button data-action="plant">Plant</button><button data-action="telemetry">Telemetry</button><button data-action="alerts">Alerts</button></div></div>`).join('')}</div>`; }
function renderDevices(){
  const all=devices();
  const activePlantFilter=localStorage.getItem('fleetos_device_filter_plant') || '';
  const activePlant=activePlantFilter ? all.find(d=>d.plantId===activePlantFilter) : null;
  const list=activePlantFilter ? all.filter(d=>d.plantId===activePlantFilter) : all;
  const online=list.filter(d=>d.status==='Online').length;
  const attention=list.filter(d=>d.status!=='Online').length;
  const mapped=list.filter(d=>d.sourceStatus).length;
  const filterBanner=activePlantFilter ? `<div class="filter-banner"><div><strong>Filtered by plant</strong><small>${activePlant ? activePlant.plant : activePlantFilter} · ${list.length} device records</small></div><button id="clearPlantDeviceFilter">Clear filter</button></div>` : '';
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Groups</p><h1>Device List</h1><p class="muted">All devices connected to Plants, grouped by plant, tenant, vendor source and operational status.</p></div><button class="freshness-card" id="openDeviceSource"><span class="pulse"></span><div><strong>Source Traceability</strong><small>Vendor ID → FleetOS Device</small></div></button></section>
  ${filterBanner}
  <section class="context-bar glass-card"><button class="ctx-item"><span>Total Devices</span><strong>${list.length}</strong></button><button class="ctx-item"><span>Online</span><strong>${online}</strong></button><button class="ctx-item"><span>Attention</span><strong>${attention}</strong></button><button class="ctx-item"><span>Mapped Devices</span><strong>${mapped}</strong></button></section>
  <section class="panel glass-card"><div class="panel-head"><div><h2>Device List</h2><p>Search by device, plant, tenant, vendor, type, serial or status.</p></div><div class="toolbar"><input id="deviceSearch" placeholder="Search devices, serial, plant..."/><select id="deviceTypeFilter"><option>All Types</option><option>Inverter</option><option>Battery</option><option>Meter</option><option>Weather Station</option><option>Transformer</option><option>Gateway</option></select><select id="deviceStatusFilter"><option>All Statuses</option><option>Online</option><option>Warning</option><option>Offline</option></select></div></div><div id="deviceTable">${deviceRows(list)}</div></section>
  <aside class="detail-drawer" id="deviceSourceDrawer"><button class="drawer-close" id="closeDeviceSource">x</button><h2>Device Source Traceability</h2><div class="drawer-body"><p>Each device is stored as FleetOS master data and keeps the source reference from the vendor platform.</p><ul><li>External Device ID</li><li>Vendor and integration name</li><li>Plant relationship</li><li>Parent / child topology</li><li>Last seen and freshness</li></ul></div><div class="drawer-actions"><button class="primary-action" onclick="location.href='plants.html'">Open Groups</button></div></aside>`;
}
function wireDevices(){
  const table=document.getElementById('deviceTable');
  const search=document.getElementById('deviceSearch');
  const type=document.getElementById('deviceTypeFilter');
  const status=document.getElementById('deviceStatusFilter');
  const plantFilter=()=>localStorage.getItem('fleetos_device_filter_plant') || '';
  function baseList(){ const pf=plantFilter(); return pf ? devices().filter(d=>d.plantId===pf) : devices(); }
  function apply(){
    const q=(search.value||'').toLowerCase();
    let list=baseList().filter(d=>[d.name,d.id,d.serial,d.plant,d.tenant,d.vendor,d.type,d.status,d.model].join(' ').toLowerCase().includes(q));
    if(type.value!=='All Types') list=list.filter(d=>d.type===type.value);
    if(status.value!=='All Statuses') list=list.filter(d=>d.status===status.value);
    table.innerHTML=deviceRows(list);
    bindRows();
  }
  function bindRows(){ table.querySelectorAll('.data-row').forEach(row=> row.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{ const id=row.dataset.id; const d=devices().find(x=>x.id===id); if(btn.dataset.action==='open'){ localStorage.setItem('fleetos_selected_device', id); location.href='device-detail.html'; } if(btn.dataset.action==='plant'){ localStorage.setItem('fleetos_selected_plant', d.plantId); location.href='plant-detail.html'; } if(btn.dataset.action==='telemetry'){ localStorage.setItem('fleetos_telemetry_context', JSON.stringify({tenant:d.tenant, plant:d.plant, device:d.name, metric:'Current Power', range:localStorage.getItem('fleetos_time')||'Last 24h', layer:'Normalized'})); location.href='telemetry.html'; } if(btn.dataset.action==='alerts'){ localStorage.setItem('fleetos_alert_context', JSON.stringify({deviceId:d.id, plantId:d.plantId, tenant:d.tenant})); location.href='alerts.html'; } })); }
  [search,type,status].forEach(el=> el && el.addEventListener(el.tagName==='INPUT'?'input':'change', apply));
  bindRows();
  document.getElementById('clearPlantDeviceFilter')?.addEventListener('click',()=>{ localStorage.removeItem('fleetos_device_filter_plant'); location.reload(); });
  document.getElementById('openDeviceSource')?.addEventListener('click',()=>document.getElementById('deviceSourceDrawer').classList.add('open'));
  document.getElementById('closeDeviceSource')?.addEventListener('click',()=>document.getElementById('deviceSourceDrawer').classList.remove('open'));
}
function deviceTelemetry(d){
  const fields=[['Power',d.power||d.signal||'—'],['Voltage',d.voltage||'—'],['Current',d.current||'—'],['Temperature',d.temperature||d.ambient||'—'],['SOC',d.soc||'—'],['Last Seen',d.lastSeen]];
  return `<div class="info-grid">${fields.map(x=>`<div><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}</div><div class="panel-lite full"><h3>Telemetry Trend Preview</h3><div class="bar-chart mini-trend"><button style="height:56%"><span>56%</span></button><button style="height:64%"><span>64%</span></button><button style="height:71%"><span>71%</span></button><button style="height:69%"><span>69%</span></button><button style="height:83%"><span>83%</span></button><button style="height:78%"><span>78%</span></button></div></div>`;
}
function deviceTab(d, tab){
  if(tab==='master') return `<div class="info-grid"><div><span>Device ID</span><strong>${d.id}</strong></div><div><span>External Device ID</span><strong>${d.externalId}</strong></div><div><span>Manufacturer</span><strong>${d.manufacturer}</strong></div><div><span>Model</span><strong>${d.model}</strong></div><div><span>Serial Number</span><strong>${d.serial}</strong></div><div><span>Firmware Version</span><strong>${d.firmware}</strong></div><div><span>IP Address</span><strong>${d.ip}</strong></div><div><span>MAC Address</span><strong>${d.mac}</strong></div><div><span>Installation Date</span><strong>${d.installation}</strong></div><div><span>Warranty Expiry</span><strong>${d.warranty}</strong></div></div>`;
  if(tab==='topology') return `<div class="split-grid"><div class="panel-lite"><h3>Relationship</h3><div class="asset-tree"><p>${d.plant}\n└── ${d.parent}\n    └── ${d.name}\n        └── ${d.children}</p></div></div><div class="panel-lite"><h3>Linked Plant</h3><div class="info-grid"><div><span>Plant</span><strong>${d.plant}</strong></div><div><span>Tenant</span><strong>${d.tenant}</strong></div><div><span>Lifecycle</span><strong>${d.lifecycle}</strong></div><div><span>Source Status</span><strong>${d.sourceStatus}</strong></div></div><div class="drawer-actions"><button class="primary-action" id="openDevicePlant">Open Plant</button></div></div></div>`;
  if(tab==='telemetry') return `<div class="split-grid"><div class="panel-lite"><h3>Live Metrics</h3>${deviceTelemetry(d)}</div><div class="panel-lite"><h3>Alerts Preview</h3><div class="timeline-mini"><p><strong>${d.alerts}</strong> active alert(s)</p><p>${d.alerts ? 'Attention required: review device status and related plant events.' : 'No active device alerts.'}</p><p>Status: ${d.status} · Last seen: ${d.lastSeen}</p></div><div class="drawer-actions"><button class="primary-action" onclick='localStorage.setItem("fleetos_telemetry_context", JSON.stringify({tenant:"${d.tenant}", plant:"${d.plant}", device:"${d.name}", metric:"Current Power", range:localStorage.getItem("fleetos_time")||"Last 24h", layer:"Normalized"})); location.href="telemetry.html"'>Open Telemetry</button><button class="secondary-action" onclick='localStorage.setItem("fleetos_alert_context", JSON.stringify({deviceId:"${d.id}", plantId:"${d.plantId}", tenant:"${d.tenant}"})); location.href="alerts.html"'>Open Alerts</button></div></div></div>`;
  if(tab==='source') return `<div class="info-grid"><div><span>Integration</span><strong>${d.integration}</strong></div><div><span>Vendor</span><strong>${d.vendor}</strong></div><div><span>External ID</span><strong>${d.externalId}</strong></div><div><span>Mapping Status</span><strong>${d.sourceStatus}</strong></div><div><span>Last Seen</span><strong>${d.lastSeen}</strong></div><div><span>Data Freshness</span><strong>${d.status==='Offline'?'Stale':'Fresh'}</strong></div></div><div class="timeline-mini full"><p><strong>Discovery</strong> · Device discovered from vendor source</p><p><strong>Mapping</strong> · Vendor type normalized to ${d.type}</p><p><strong>Sync</strong> · Operational data updated ${d.lastSeen}</p></div>`;
  return `<div class="split-grid"><div class="panel-lite"><h3>Device Summary</h3><div class="info-grid"><div><span>Status</span><strong>${d.status}</strong></div><div><span>Type</span><strong>${d.type}</strong></div><div><span>Plant</span><strong>${d.plant}</strong></div><div><span>Capacity / Role</span><strong>${d.capacity}</strong></div><div><span>Alerts</span><strong>${d.alerts}</strong></div><div><span>Last Seen</span><strong>${d.lastSeen}</strong></div></div></div><div class="panel-lite"><h3>Operational Snapshot</h3>${deviceTelemetry(d)}</div></div>`;
}

function devicePortalStatusTextV92(d){
  const s=String(d.status||'').toLowerCase();
  if(s.includes('offline')) return 'Not visible as healthy in client portal';
  if(s.includes('warning')) return 'Visible with warning note in client portal';
  return 'Visible as working in client portal';
}
function devicePassportPanelV92(d){
  return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static device master data used by registry, support, warranty and replacement workflows.</p></div></div>
  <div class="device-passport-grid-v92">
    <article><span>Identity</span><strong>${d.name}</strong><small>${d.id} · ${d.externalId}</small></article>
    <article><span>Classification</span><strong>${d.type}</strong><small>${d.subtype}</small></article>
    <article><span>Manufacturer</span><strong>${d.manufacturer || d.vendor}</strong><small>${d.model}</small></article>
    <article><span>Serial Number</span><strong>${d.serial}</strong><small>Unique traceable device number</small></article>
    <article><span>Firmware / Protocol</span><strong>${d.firmware}</strong><small>${d.protocol || 'Protocol version: vendor default'}</small></article>
    <article><span>Rated Capacity</span><strong>${d.capacity}</strong><small>Technical passport value</small></article>
    <article><span>Network Type</span><strong>${d.ip && d.ip !== '—' ? 'LAN / WLAN' : 'Passive / field device'}</strong><small>IP ${d.ip || '—'} · MAC ${d.mac || '—'}</small></article>
    <article><span>Warranty</span><strong>${d.warranty}</strong><small>Installed ${d.installation}</small></article>
  </div>
  <div class="data-table compact-table device-passport-table-v92"><div class="data-head"><span>Parameter</span><span>Value</span><span>Used By</span></div>
    <div class="data-row"><div><strong>Rated Power / Capacity</strong></div><div><span>${d.capacity}</span></div><div><small>Reports · Device & Topology Registry · Lifecycle</small></div></div>
    <div class="data-row"><div><strong>Parent Relation</strong></div><div><span>${d.parent}</span></div><div><small>Topology · Plant Detail · Alerts</small></div></div>
    <div class="data-row"><div><strong>Child Objects</strong></div><div><span>${d.children}</span></div><div><small>Topology · Impact analysis</small></div></div>
  </div>`;
}
function deviceConnectivityFullPanelV92(d){
  return `<div class="section-title-v17"><div><h2>Connectivity</h2><p class="muted">Communication, freshness and integration health for this device.</p></div></div>
  ${cardGrid([
    ['Online Status', d.status, devicePortalStatusTextV92(d)],
    ['Last Seen', d.lastSeen, 'Latest communication timestamp'],
    ['Signal Strength', d.signal || (d.status==='Offline' ? 'No signal' : 'Good'), 'Logger / network quality'],
    ['Data Freshness', d.status==='Offline' ? 'Stale' : d.status==='Warning' ? 'Delayed' : 'Fresh', 'Used by dashboards and alert logic'],
    ['Gateway / Logger', d.parent || 'Direct integration', 'Communication path'],
    ['Integration Status', d.sourceStatus || 'Mapped', d.integration]
  ], 'device-param-grid-v58')}
  <div class="device-chain-v92"><div><span>Device</span><strong>${d.name}</strong></div><i></i><div><span>Gateway / Parent</span><strong>${d.parent}</strong></div><i></i><div><span>Vendor Cloud</span><strong>${d.vendor}</strong></div><i></i><div><span>FleetOS Core</span><strong>${d.sourceStatus}</strong></div></div>`;
}
function telemetrySummaryPanelV92(d){
  const key=deviceTypeKey(d);
  const rows = key==='battery' ? [['SOC',deviceMetricValue(d,'soc')],['Charge Power','18 kW'],['Discharge Power',deviceMetricValue(d,'activePower')],['Battery Temperature',deviceMetricValue(d,'temperature')],['SOH',deviceMetricValue(d,'soh')],['Cycle Count','1,284']] :
    key==='meter' ? [['Import Today',deviceMetricValue(d,'todayImport')],['Export Today',deviceMetricValue(d,'todayExport')],['Total Import',deviceMetricValue(d,'import')],['Total Export',deviceMetricValue(d,'export')],['Voltage',deviceMetricValue(d,'voltage')],['Frequency',deviceMetricValue(d,'frequency')]] :
    key==='logger' ? [['Signal',deviceMetricValue(d,'signal')],['Data Lag',deviceMetricValue(d,'dataLag')],['Linked Devices',deviceMetricValue(d,'linked')],['WLAN',deviceMetricValue(d,'wlan')],['LAN IP',deviceMetricValue(d,'lanIp')],['Last Seen',d.lastSeen]] :
    [['Current Power',deviceMetricValue(d,'activePower')],['Daily Yield',deviceMetricValue(d,'dailyEnergy')],['Monthly Yield',d.monthlyYield || '4.82 MWh'],['Total Yield',deviceMetricValue(d,'totalYield')],['Temperature',deviceMetricValue(d,'temperature')],['Voltage / Current',`${deviceMetricValue(d,'lineVoltage')} · ${deviceMetricValue(d,'phaseCurrent')}`]];
  return `<div class="section-title-v17"><div><h2>Telemetry Summary</h2><p class="muted">Mock normalized telemetry values. This view prepares the UI before live API connection.</p></div></div>
  <div class="device-monitoring-grid-v58">${deviceMiniChart(key==='battery'?'Storage Power':'Power Trend')}${deviceMiniChart(key==='meter'?'Import / Export':'Energy Trend')}</div>
  ${cardGrid(rows, 'device-param-grid-v58')}`;
}
function lifecyclePanelV92(d){
  return `<div class="section-title-v17"><div><h2>Lifecycle / Replacement History</h2><p class="muted">Device lifecycle state, service events, replacement trace and warranty checkpoints.</p></div></div>
  <div class="device-lifecycle-summary-v92">
    <article><span>Lifecycle Status</span><strong>${d.lifecycle || 'Active'}</strong><small>Active device in operational registry</small></article>
    <article><span>Commissioning Date</span><strong>${d.installation}</strong><small>First operational binding</small></article>
    <article><span>Warranty Until</span><strong>${d.warranty}</strong><small>Warranty and service tracking</small></article>
  </div>
  <div class="timeline-v17 device-lifecycle-v92">
    <div><b>${d.installation}</b><span>Commissioned and linked to ${d.plant}</span></div>
    <div><b>2025</b><span>Firmware baseline confirmed · ${d.firmware}</span></div>
    <div><b>2026</b><span>Topology relation checked · ${d.parent}</span></div>
    <div><b>2026</b><span>${d.type==='Battery' ? 'Battery health inspection completed' : d.type==='Meter' ? 'Accounting point verification completed' : 'Communication module / device health verified'}</span></div>
    <div><b>Next</b><span>Warranty inspection and replacement eligibility review</span></div>
  </div>`;
}
function relatedObjectsPanelV92(d){
  return `<div class="section-title-v17"><div><h2>Related Objects</h2><p class="muted">Shows where the device belongs in FleetOS and who is responsible for it.</p></div></div>
  <div class="device-related-flow-v92">
    <article><span>Tenant</span><strong>${d.tenant}</strong><small>Operational scope</small></article>
    <i></i>
    <article><span>Client</span><strong>Arpi Solar Group</strong><small>Portal visibility: ${devicePortalStatusTextV92(d)}</small></article>
    <i></i>
    <article><span>Plant</span><strong>${d.plant}</strong><small>${d.plantId}</small></article>
    <i></i>
    <article><span>Device</span><strong>${d.name}</strong><small>${d.type} · ${d.serial}</small></article>
  </div>
  <div class="data-table compact-table device-related-table-v92"><div class="data-head"><span>Relation</span><span>Object / Party</span><span>Responsibility</span><span>Action</span></div>
    <div class="data-row"><div><strong>Owner / Client</strong></div><div><span>Arpi Solar Group</span></div><div><small>Receives portal view, reports and commercial summary</small></div><div><button class="small-btn" type="button" onclick="location.href='client-detail.html'">Open</button></div></div>
    <div class="data-row"><div><strong>Parent Plant</strong></div><div><span>${d.plant}</span></div><div><small>Operational workspace and alerts context</small></div><div><button class="small-btn" type="button" onclick="localStorage.setItem('fleetos_selected_plant','${d.plantId}');location.href='plant-detail.html'">Open</button></div></div>
    <div class="data-row"><div><strong>Integration</strong></div><div><span>${d.integration}</span></div><div><small>Vendor source and sync traceability</small></div><div><button class="small-btn" type="button" onclick="location.href='integration-detail.html'">Open</button></div></div>
    <div class="data-row"><div><strong>Service Team</strong></div><div><span>Tenant Operations Team</span></div><div><small>Device support, replacement and field checks</small></div><div><button class="small-btn" type="button" onclick="location.href='tasks-work-orders.html'">Tasks</button></div></div>
  </div>`;
}
function deviceDocumentsPanelV92(d){
  return `<div class="section-title-v17"><div><h2>Documents</h2><p class="muted">Device-level documents for support, warranty, commissioning and compliance.</p></div></div>
  <div class="document-grid-v17 device-documents-v92">
    <article><strong>Datasheet</strong><small>${d.manufacturer || d.vendor} ${d.model} · PDF · Valid</small><button class="small-btn" type="button">View</button></article>
    <article><strong>Warranty Certificate</strong><small>Until ${d.warranty} · Linked to serial ${d.serial}</small><button class="small-btn" type="button">View</button></article>
    <article><strong>Installation Report</strong><small>${d.installation} · Commissioning evidence</small><button class="small-btn" type="button">View</button></article>
    <article><strong>Service Report</strong><small>Last inspection · 2026 · No blocker</small><button class="small-btn" type="button">View</button></article>
    <article><strong>Firmware Snapshot</strong><small>${d.firmware} · Vendor source record</small><button class="small-btn" type="button">View</button></article>
    <article><strong>Replacement Record</strong><small>No active replacement case</small><button class="small-btn" type="button">Create</button></article>
  </div>`;
}
function deviceAuditPanelV92(d){
  return `<div class="section-title-v17"><div><h2>Audit</h2><p class="muted">Immutable device change trail across registry, integration, topology and user actions.</p></div></div>
  <div class="timeline-v17 device-audit-v92">
    <div><b>Created</b><span>${d.installation} · Device record created for ${d.plant}</span></div>
    <div><b>Imported</b><span>Vendor source imported from ${d.integration}</span></div>
    <div><b>Mapped</b><span>External ID ${d.externalId} mapped to FleetOS ID ${d.id}</span></div>
    <div><b>Linked</b><span>Topology relation set: ${d.parent}</span></div>
    <div><b>Checked</b><span>Last communication checked · ${d.lastSeen}</span></div>
    <div><b>Modified</b><span>Updated by Global Admin · 15 Jun 2026</span></div>
  </div>`;
}

function renderDeviceDetail(){
  const d=selectedDevice();
  return `<section class="page-hero"><div><p class="eyebrow">Device Detail Workspace</p><h1>${d.name}</h1><p class="muted">${d.type} · ${d.plant} · ${d.tenant} · ${d.id}</p></div><div class="hero-actions"><button class="freshness-card" id="deviceSync"><span class="pulse"></span><div><strong>Run Device Sync</strong><small>${d.lastSeen}</small></div></button><button class="freshness-card" onclick="location.href='devices.html'"><span class="pulse"></span><div><strong>Back to Registry</strong><small>All devices</small></div></button></div></section>
  <section class="kpi-grid detail-kpis"><article class="kpi-card"><span>Device Status</span><strong>${d.status}</strong><small>${d.alerts} active alerts</small></article><article class="kpi-card"><span>Device Type</span><strong>${d.type}</strong><small>${d.subtype}</small></article><article class="kpi-card"><span>Vendor</span><strong>${d.vendor}</strong><small>${d.sourceStatus}</small></article><article class="kpi-card"><span>Capacity / Role</span><strong>${d.capacity}</strong><small>${d.model}</small></article><article class="kpi-card"><span>Last Seen</span><strong>${d.lastSeen}</strong><small>Connectivity status</small></article><article class="kpi-card"><span>Plant</span><strong>${d.plant}</strong><small>${d.tenant}</small></article></section>
  <section class="glass-card tabs-shell"><div class="detail-tabs"><button class="active" data-tab="overview">Overview</button><button data-tab="master">Master Data</button><button data-tab="topology">Topology</button><button data-tab="telemetry">Telemetry & Alerts</button><button data-tab="source">Source & Sync</button></div><div id="deviceDetailContent">${deviceTab(d,'overview')}</div></section>`;
}
function wireDeviceDetail(){ const d=selectedDevice(); document.getElementById('deviceSync')?.addEventListener('click',()=>FleetLayout.toast(`Device sync requested for ${d.name}`)); document.querySelectorAll('.detail-tabs button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('.detail-tabs button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); document.getElementById('deviceDetailContent').innerHTML=deviceTab(d,b.dataset.tab); const plantBtn=document.getElementById('openDevicePlant'); if(plantBtn) plantBtn.onclick=()=>{ localStorage.setItem('fleetos_selected_plant', d.plantId); location.href='plant-detail.html'; }; }); }

/* v58 Universal Device Detail Layout */
function deviceMetricValue(d, key){
  const type = String(d.type || '').toLowerCase();
  const vendor = String(d.vendor || '').toLowerCase();
  const warning = d.status !== 'Online';
  const rated = parseFloat(String(d.capacity || '').replace(/[^0-9.]/g,'')) || (type.includes('inverter') ? 30 : 1);
  const inverterDefaults = {
    activePower: d.power || (warning ? (rated * .45).toFixed(2) + ' kW' : (rated * .78).toFixed(2) + ' kW'),
    reactivePower: vendor.includes('huawei') ? '0.002 kvar' : '0.00 kVar',
    powerFactor: vendor.includes('huawei') ? '1.000' : '0.99',
    frequency: d.frequency || '50.00 Hz',
    dailyEnergy: vendor.includes('huawei') ? '156.91 kWh' : (warning ? '6.60 kWh' : '48.4 kWh'),
    totalYield: vendor.includes('huawei') ? '149,933.20 kWh' : '684.2 MWh',
    temperature: d.temperature || (warning ? '59.0 °C' : '43.0 °C'),
    insulation: vendor.includes('huawei') ? '4.359 MOhm' : '—',
    phaseCurrent: vendor.includes('huawei') ? '22.552 / 22.468 / 22.438 A' : '136 A',
    lineVoltage: vendor.includes('huawei') ? '379.2 / 378.6 / 382.4 V' : d.voltage || '400 V',
    startup: vendor.includes('huawei') ? '2026-06-11 05:49:24' : 'Today 06:12',
    shutdown: vendor.includes('huawei') ? 'N/A' : '—'
  };
  const batteryDefaults = { activePower:d.power||'-42 kW', dailyEnergy:'312 kWh', totalYield:'18.4 MWh', temperature:d.temperature||'36 °C', soc:d.soc||'68%', soh:d.soh||'94%', voltage:d.voltage||'742 V', current:d.current||'-56 A' };
  const meterDefaults = { activePower:d.power||'31.2 MW', dailyEnergy:'1.2 GWh', totalYield:'42.8 GWh', frequency:d.frequency||'50.01 Hz', voltage:d.voltage||'20 kV', current:d.current||'901 A' };
  const gatewayDefaults = { signal:d.signal||'Good', dataLag:d.dataLag||d.lastSeen, linked:d.children||'8 inverters · 2 meters', status:d.status };
  if(type.includes('battery')) return batteryDefaults[key] || inverterDefaults[key] || '—';
  if(type.includes('meter')) return meterDefaults[key] || inverterDefaults[key] || '—';
  if(type.includes('gateway') || type.includes('logger')) return gatewayDefaults[key] || inverterDefaults[key] || '—';
  return inverterDefaults[key] || '—';
}
function deviceTitleMeta(d){
  return `${d.type} · ${d.manufacturer || d.vendor} ${d.model} · ${d.serial}`;
}
function universalDeviceSidebar(d){
  const isInverter = d.type === 'Inverter';
  const isBattery = d.type === 'Battery';
  const isMeter = d.type === 'Meter';
  const isGateway = d.type === 'Gateway' || d.type === 'Logger';
  return `<aside class="detail-side-nav device-detail-nav-v58" aria-label="Device navigation">
    <button class="active" data-device-tab="overview" type="button"><span>Overview</span></button>
    <button data-device-tab="monitoring" type="button"><span>Monitoring</span></button>
    ${isInverter ? '<button data-device-tab="strings" type="button"><span>PV Strings</span></button>' : ''}
    ${isBattery ? '<button data-device-tab="battery" type="button"><span>Battery State</span></button>' : ''}
    ${isMeter ? '<button data-device-tab="measurements" type="button"><span>Measurements</span></button>' : ''}
    ${isGateway ? '<button data-device-tab="connectivity" type="button"><span>Connectivity</span></button>' : ''}
    <button data-device-tab="information" type="button"><span>Device Information</span></button>
    <button data-device-tab="alerts" type="button"><span>Alerts</span></button>
    <button data-device-tab="history" type="button"><span>Historical Information</span></button>
    <button data-device-tab="remote" type="button"><span>Remote Control</span></button>
    <button data-device-tab="source" type="button"><span>Source & Sync</span></button>
  </aside>`;
}
function deviceStatusPill(d){ return `<span class="badge ${deviceStatusCls(d.status)}">${d.status}</span>`; }
function deviceKpis(d){
  const isGateway = d.type === 'Gateway' || d.type === 'Logger';
  return `<section class="kpi-grid detail-kpis device-kpi-grid-v58">
    <article class="kpi-card"><span>Status</span><strong>${d.status}</strong><small>${d.alerts} active alerts</small></article>
    <article class="kpi-card"><span>${isGateway ? 'Signal / Uplink' : 'Active Power'}</span><strong>${isGateway ? deviceMetricValue(d,'signal') : deviceMetricValue(d,'activePower')}</strong><small>${isGateway ? deviceMetricValue(d,'dataLag') : 'Live operational value'}</small></article>
    <article class="kpi-card"><span>Today Yield</span><strong>${deviceMetricValue(d,'dailyEnergy')}</strong><small>Energy monitoring</small></article>
    <article class="kpi-card"><span>Rated Capacity</span><strong>${d.capacity}</strong><small>${d.model}</small></article>
    <article class="kpi-card"><span>Temperature</span><strong>${deviceMetricValue(d,'temperature')}</strong><small>Internal / sensor value</small></article>
    <article class="kpi-card"><span>Last Seen</span><strong>${d.lastSeen}</strong><small>Connectivity freshness</small></article>
  </section>`;
}
function deviceMiniChart(label){
  return `<div class="device-chart-card-v58"><div class="chart-card-head-v20"><strong>${label}</strong><small>Mock trend · Day</small></div><div class="mini-bar-chart-v20"><span style="height:25%"></span><span style="height:42%"></span><span style="height:66%"></span><span style="height:78%"></span><span style="height:92%"></span><span style="height:74%"></span><span style="height:54%"></span><span style="height:35%"></span></div></div>`;
}
function operatingDataGrid(d){
  const rows = [
    ['Active Power', deviceMetricValue(d,'activePower')], ['Reactive Power', deviceMetricValue(d,'reactivePower')], ['Power Factor', deviceMetricValue(d,'powerFactor')], ['Grid Frequency', deviceMetricValue(d,'frequency')],
    ['Daily Energy', deviceMetricValue(d,'dailyEnergy')], ['Total Yield', deviceMetricValue(d,'totalYield')], ['Phase Current', deviceMetricValue(d,'phaseCurrent')], ['Line Voltage', deviceMetricValue(d,'lineVoltage')],
    ['Internal Temperature', deviceMetricValue(d,'temperature')], ['Insulation Resistance', deviceMetricValue(d,'insulation')], ['Startup Time', deviceMetricValue(d,'startup')], ['Shutdown Time', deviceMetricValue(d,'shutdown')]
  ];
  return `<div class="device-param-grid-v58">${rows.map(([k,v])=>`<article><span>${k}</span><strong>${v}</strong></article>`).join('')}</div>`;
}
function stringRows(d){
  const isHuawei = String(d.vendor).toLowerCase().includes('huawei');
  const count = isHuawei ? 8 : 4;
  const rows = Array.from({length:count},(_,i)=>{
    const n=i+1; const volt=[628.7,628.7,673.9,673.9,547.3,547.3,560,560][i] || 612.4; const cur=[7.02,0,5.24,0,6.87,0,6.78,0][i] || 5.1;
    return `<div class="data-row"><div><strong>PV${n}</strong><small>MPPT ${Math.ceil(n/2)}</small></div><div><span>${volt} V</span></div><div><span>${cur} A</span></div><div><span>${cur ? (volt*cur/1000).toFixed(2) : '0.00'} kW</span></div><div><span>${cur ? '8,640.00 Wp' : '0.00 Wp'}</span></div></div>`;
  }).join('');
  return `<div class="data-table compact-table device-string-table-v58"><div class="data-head"><span>String</span><span>Voltage</span><span>Current</span><span>Power</span><span>String Capacity</span></div>${rows}</div>`;
}
function remoteControlPanel(d){
  const inverter = d.type === 'Inverter';
  const battery = d.type === 'Battery';
  const gateway = d.type === 'Gateway' || d.type === 'Logger';
  const actions = gateway ? ['Restart Communication', 'Refresh Linked Devices', 'Run Connectivity Test'] : battery ? ['Charge / Discharge Mode', 'SOC Reserve Limit', 'Emergency Stop'] : inverter ? ['Device Start / Stop', 'Export Power Limit', 'Active Power Adjustment', 'Reactive Power Adjustment', 'Power Factor Adjustment'] : ['Run Diagnostic', 'Refresh Data', 'Open Command Center'];
  return `<div class="device-control-grid-v58">${actions.map(a=>`<button type="button"><strong>${a}</strong><small>Capability-gated · audit required</small></button>`).join('')}</div><p class="muted device-note-v58">Write-actions are shown as mock controls. In production they must go through capability flags, confirmation, approval rules and audit log.</p>`;
}
function deviceDetailPanel(d, tab){
  if(tab==='overview') return `<div class="section-title-v17"><div><h2>Device Overview</h2><p class="muted">Unified FleetOS device workspace with vendor-aware information blocks.</p></div></div><div class="device-overview-grid-v58"><article><span>Status</span><strong>${deviceStatusPill(d)}</strong><small>${d.lastSeen}</small></article><article><span>Plant</span><strong>${d.plant}</strong><small>${d.tenant}</small></article><article><span>Vendor / Model</span><strong>${d.vendor}</strong><small>${d.model}</small></article><article><span>Serial Number</span><strong>${d.serial}</strong><small>${d.id}</small></article></div><div class="section-title-v17 mini"><div><h3>Operating Data</h3><p class="muted">Realtime values based on inverter examples from Huawei and GoodWe screens.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='monitoring') return `<div class="section-title-v17"><div><h2>Monitoring</h2><p class="muted">Power, energy and operation curves. Tabs like Operation Monitoring, MPPT Curve and Energy Monitoring can be connected later.</p></div></div><div class="device-monitoring-grid-v58">${deviceMiniChart('Operation Monitoring')}${deviceMiniChart('Energy Monitoring')}</div><div class="section-title-v17 mini"><div><h3>Live Metrics</h3><p class="muted">Fast numeric inspection while charts are loaded.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='strings') return `<div class="section-title-v17"><div><h2>PV Strings</h2><p class="muted">String / MPPT level values for inverter devices.</p></div></div>${stringRows(d)}`;
  if(tab==='battery') return `<div class="section-title-v17"><div><h2>Battery State</h2><p class="muted">Storage-specific summary for BESS devices.</p></div></div><div class="info-grid"><div><span>SOC</span><strong>${deviceMetricValue(d,'soc')}</strong></div><div><span>SOH</span><strong>${deviceMetricValue(d,'soh')}</strong></div><div><span>Power Flow</span><strong>${deviceMetricValue(d,'activePower')}</strong></div><div><span>Voltage</span><strong>${deviceMetricValue(d,'voltage')}</strong></div><div><span>Current</span><strong>${deviceMetricValue(d,'current')}</strong></div><div><span>Temperature</span><strong>${deviceMetricValue(d,'temperature')}</strong></div></div>`;
  if(tab==='measurements') return `<div class="section-title-v17"><div><h2>Measurements</h2><p class="muted">Meter measurements for import/export and accounting context.</p></div></div><div class="info-grid"><div><span>Power</span><strong>${deviceMetricValue(d,'activePower')}</strong></div><div><span>Voltage</span><strong>${deviceMetricValue(d,'voltage')}</strong></div><div><span>Current</span><strong>${deviceMetricValue(d,'current')}</strong></div><div><span>Frequency</span><strong>${deviceMetricValue(d,'frequency')}</strong></div><div><span>Today Energy</span><strong>${deviceMetricValue(d,'dailyEnergy')}</strong></div><div><span>Total Energy</span><strong>${deviceMetricValue(d,'totalYield')}</strong></div></div>`;
  if(tab==='connectivity') return `<div class="section-title-v17"><div><h2>Connectivity</h2><p class="muted">Logger / Gateway connection and downstream device freshness.</p></div></div><div class="info-grid"><div><span>Signal</span><strong>${deviceMetricValue(d,'signal')}</strong></div><div><span>Data Lag</span><strong>${deviceMetricValue(d,'dataLag')}</strong></div><div><span>Linked Devices</span><strong>${deviceMetricValue(d,'linked')}</strong></div><div><span>IP Address</span><strong>${d.ip}</strong></div><div><span>MAC Address</span><strong>${d.mac}</strong></div><div><span>Status</span><strong>${d.status}</strong></div></div>`;
  if(tab==='information') return `<div class="section-title-v17"><div><h2>Device Information</h2><p class="muted">Static master data and vendor identifiers.</p></div></div><div class="info-grid"><div><span>Device Name</span><strong>${d.name}</strong></div><div><span>Device Type</span><strong>${d.type}</strong></div><div><span>Subtype</span><strong>${d.subtype}</strong></div><div><span>Vendor</span><strong>${d.vendor}</strong></div><div><span>Manufacturer</span><strong>${d.manufacturer}</strong></div><div><span>Model</span><strong>${d.model}</strong></div><div><span>Serial Number</span><strong>${d.serial}</strong></div><div><span>Firmware</span><strong>${d.firmware}</strong></div><div><span>IP Address</span><strong>${d.ip}</strong></div><div><span>MAC Address</span><strong>${d.mac}</strong></div><div><span>Installation Date</span><strong>${d.installation}</strong></div><div><span>Warranty</span><strong>${d.warranty}</strong></div></div>`;
  if(tab==='alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Device-level events and issues.</p></div></div><div class="data-table compact-table device-alert-table-v58"><div class="data-head"><span>Alert</span><span>Severity</span><span>Source</span><span>Time</span><span>Status</span></div>${d.alerts ? `<div class="data-row"><div><strong>${d.type} communication / performance warning</strong><small>${d.name}</small></div><div><span class="badge warning">Warning</span></div><div><span>${d.vendor}</span></div><div><span>${d.lastSeen}</span></div><div><span>Open</span></div></div>` : `<div class="data-row"><div><strong>No active issues</strong><small>${d.name}</small></div><div><span class="badge success">Normal</span></div><div><span>FleetOS</span></div><div><span>Now</span></div><div><span>Clear</span></div></div>`}</div>`;
  if(tab==='history') return `<div class="section-title-v17"><div><h2>Historical Information</h2><p class="muted">Replacement, firmware, configuration and connectivity history.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Operational telemetry refreshed · ${d.lastSeen}</span></div><div><b>Yesterday</b><span>Configuration snapshot stored from ${d.vendor}</span></div><div><b>03 Jun</b><span>Firmware version confirmed · ${d.firmware}</span></div><div><b>${d.installation}</b><span>Device registered and linked to ${d.plant}</span></div></div>`;
  if(tab==='remote') return `<div class="section-title-v17"><div><h2>Remote Control</h2><p class="muted">Common controls inspired by inverter source screens, with FleetOS audit guardrails.</p></div></div>${remoteControlPanel(d)}`;
  if(tab==='source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Vendor traceability and canonical mapping state.</p></div></div><div class="info-grid"><div><span>Integration</span><strong>${d.integration}</strong></div><div><span>Vendor</span><strong>${d.vendor}</strong></div><div><span>External ID</span><strong>${d.externalId}</strong></div><div><span>FleetOS ID</span><strong>${d.id}</strong></div><div><span>Mapping Status</span><strong>${d.sourceStatus}</strong></div><div><span>Last Seen</span><strong>${d.lastSeen}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Telemetry · Alerts · ${d.type === 'Inverter' ? 'Remote control' : 'Type-specific controls'}</strong></div></div>`;
  return '';
}
function renderDeviceDetail(){
  const d=selectedDevice();
  return `<section class="page-hero device-hero-v58"><div><p class="eyebrow">Global Admin · Device Detail</p><h1>${d.name}</h1><p class="muted">${deviceTitleMeta(d)}</p></div><div class="hero-actions"><button class="primary-action" onclick="location.href='devices.html'">Back to Device List</button></div></section>
  <section class="context-bar glass-card device-context-v58"><div><span>Plant</span><strong>${d.plant}</strong></div><div><span>Tenant</span><strong>${d.tenant}</strong></div><div><span>Client Scope</span><strong>${d.plant.includes('Asset') ? 'Arpi Solar Group' : 'Assigned client'}</strong></div><div><span>Last Communication</span><strong>${d.lastSeen}</strong></div></section>
  ${deviceKpis(d)}
  <section class="detail-layout-v58 device-detail-layout-v58">${universalDeviceSidebar(d)}<main class="glass-card detail-main-v58"><div id="deviceDetailContent">${deviceDetailPanel(d,'overview')}</div></main></section>`;
}
function wireDeviceDetail(){
  const d=selectedDevice();
  document.querySelectorAll('[data-device-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-device-tab]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const content=document.getElementById('deviceDetailContent');
    if(content) content.innerHTML=deviceDetailPanel(d, btn.dataset.deviceTab);
  }));
}

/* v59 Device Detail v2: type-driven workspace, topology and architecture */
const fleetosExtraDeviceTypesV59 = [
  { id:'DEV-LOG-00387', externalId:'DEY-LOGGER-3877560314', name:'Logger 3877560314', type:'Logger', subtype:'Data Logger / Collector', manufacturer:'Deye', model:'Solarman Logger', serial:'3877560314', firmware:'3.8.0', ip:'10.41.2.87', mac:'C8:5B:76:87:11:14', plantId:'PLT-000817', plant:'Plant B', tenant:'Tenant Alpha Energy', vendor:'Deye', integration:'Tenant Alpha Energy — Deye DeyeCloud / Solarman', status:'Online', lifecycle:'Active', capacity:'Collector', installation:'2025-01-29', warranty:'2027-01-29', lastSeen:'3 min ago', alerts:0, signal:'Excellent', wlan:'82%', dataLag:'3 min', lanIp:'192.168.1.45', cybersecurity:'CS1.0.0', sourceStatus:'Mapped', parent:'Communication Cabinet', children:'4 inverters · 1 battery · 1 meter' },
  { id:'DEV-MIC-250113', externalId:'DEY-MICRO-250113031C', name:'Microinverter 250113031C', type:'Microinverter', subtype:'Module-level Inverter', manufacturer:'Deye', model:'SUN-M80G4-EU-Q0', serial:'250113031C', firmware:'V1.2.6', ip:'10.41.3.18', mac:'C8:5B:76:25:01:13', plantId:'PLT-000817', plant:'Plant B', tenant:'Tenant Alpha Energy', vendor:'Deye', integration:'Tenant Alpha Energy — Deye DeyeCloud / Solarman', status:'Online', lifecycle:'Active', capacity:'800 W', installation:'2025-02-04', warranty:'2035-02-04', lastSeen:'2 min ago', alerts:0, power:'719 W', voltage:'230 V', current:'3.1 A', frequency:'50.00 Hz', temperature:'39 °C', sourceStatus:'Mapped', parent:'Roof Array A / Logger 3877560314', children:'PV module strings A1–A4' },
  { id:'DEV-PVM-230322', externalId:'DEY-MODULE-2303227667-2', name:'PV Module 2303227667-2', type:'PV Module', subtype:'Smart PV Module', manufacturer:'Deye', model:'PV-550M', serial:'2303227667-2', firmware:'N/A', ip:'—', mac:'—', plantId:'PLT-000817', plant:'Plant B', tenant:'Tenant Alpha Energy', vendor:'Deye', integration:'Tenant Alpha Energy — Deye DeyeCloud / Solarman', status:'Online', lifecycle:'Active', capacity:'550 Wp', installation:'2025-02-04', warranty:'2040-02-04', lastSeen:'1 min ago', alerts:0, voltage:'42.6 V', current:'12.9 A', power:'549 W', temperature:'44 °C', sourceStatus:'Mapped', parent:'Microinverter 250113031C / Input 2', children:'Panel position R2-C4' },
  { id:'DEV-COM-SGW-0001', externalId:'SGW-WINET-B2290652984', name:'Communication Module1', type:'Communication Module', subtype:'WiNet-S', manufacturer:'Sungrow', model:'WiNet-S', serial:'B2290652984', firmware:'COMM-2.4.5', ip:'10.25.1.91', mac:'18:93:D7:29:84:00', plantId:'PLT-000501', plant:'Armavir BESS Solar', tenant:'Tenant North Operations', vendor:'Sungrow', integration:'Tenant North Operations — Sungrow iSolarCloud', status:'Online', lifecycle:'Active', capacity:'Network Gateway', installation:'2025-10-09', warranty:'2027-10-09', lastSeen:'1 min ago', alerts:0, signal:'Good', wlan:'64%', dataLag:'1 min', sourceStatus:'Mapped', parent:'Plant network cabinet', children:'2 inverters · 1 BESS · 1 meter' }
];
const fleetosDefaultDevicesV59 = [...demoDevices, ...fleetosExtraDeviceTypesV59];
function devices(){
  let stored=[];
  try{ stored=JSON.parse(localStorage.getItem('fleetos_demo_devices') || '[]') || []; }catch(e){ stored=[]; }
  const merged=[...stored];
  fleetosDefaultDevicesV59.forEach(d=>{ if(!merged.some(x=>x.id===d.id)) merged.push(d); });
  if(!merged.length) merged.push(...fleetosDefaultDevicesV59);
  localStorage.setItem('fleetos_demo_devices', JSON.stringify(merged));
  return merged;
}
function isType(d, name){ return String(d.type || '').toLowerCase().includes(name); }
function deviceTypeKey(d){
  const t=String(d.type||'').toLowerCase();
  if(t.includes('micro')) return 'microinverter';
  if(t.includes('inverter')) return 'inverter';
  if(t.includes('battery')) return 'battery';
  if(t.includes('logger')||t.includes('gateway')||t.includes('communication')) return 'logger';
  if(t.includes('meter')) return 'meter';
  if(t.includes('weather')) return 'weather';
  if(t.includes('pv module')||t.includes('module')) return 'module';
  return 'generic';
}
function deviceTypeLabel(d){
  const map={inverter:'Inverter',microinverter:'Microinverter',battery:'Battery',logger:'Logger / Communication',meter:'Meter',weather:'Weather Station',module:'PV Module',generic:d.type||'Device'};
  return map[deviceTypeKey(d)] || d.type;
}
function deviceRows(list){ return `<div class="data-table device-table"><div class="data-head"><span>Device</span><span>Plant / Tenant</span><span>Type</span><span>Vendor Source</span><span>Status</span><span>Actions</span></div>${list.map(d=>`<div class="data-row" data-id="${d.id}"><div><strong>${d.name}</strong><small>${d.id}<br>${d.serial}</small></div><div><strong>${d.plant}</strong><small>${d.tenant}</small></div><div><strong>${d.type}</strong><small>${d.subtype} · ${d.capacity}</small></div><div><strong>${d.vendor}</strong><small>${d.integration}<br>${d.sourceStatus}</small></div><div><span class="badge ${deviceStatusCls(d.status)}">${d.status}</span><small>${d.alerts} alerts · ${d.lastSeen}</small></div><div class="row-actions"><button data-action="open">Open</button><button data-action="plant">Plant</button><button data-action="telemetry">Telemetry</button><button data-action="alerts">Alerts</button></div></div>`).join('')}</div>`; }
function renderDevices(){
  const all=devices();
  const activePlantFilter=localStorage.getItem('fleetos_device_filter_plant') || '';
  const activePlant=activePlantFilter ? all.find(d=>d.plantId===activePlantFilter) : null;
  const list=activePlantFilter ? all.filter(d=>d.plantId===activePlantFilter) : all;
  const online=list.filter(d=>d.status==='Online').length;
  const attention=list.filter(d=>d.status!=='Online').length;
  const mapped=list.filter(d=>d.sourceStatus).length;
  const types=[...new Set(all.map(d=>d.type).filter(Boolean))].sort();
  const filterBanner=activePlantFilter ? `<div class="filter-banner"><div><strong>Filtered by plant</strong><small>${activePlant ? activePlant.plant : activePlantFilter} · ${list.length} device records</small></div><button id="clearPlantDeviceFilter">Clear filter</button></div>` : '';
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Groups</p><h1>Device List</h1><p class="muted">All devices connected to Plants, grouped by plant, tenant, vendor source and operational status.</p></div><button class="freshness-card" id="openDeviceSource"><span class="pulse"></span><div><strong>Source Traceability</strong><small>Vendor ID → FleetOS Device</small></div></button></section>
  ${filterBanner}
  <section class="context-bar glass-card"><button class="ctx-item"><span>Total Devices</span><strong>${list.length}</strong></button><button class="ctx-item"><span>Online</span><strong>${online}</strong></button><button class="ctx-item"><span>Attention</span><strong>${attention}</strong></button><button class="ctx-item"><span>Mapped Devices</span><strong>${mapped}</strong></button></section>
  <section class="panel glass-card"><div class="panel-head"><div><h2>Device List</h2><p>Search by device, plant, tenant, vendor, type, serial or status.</p></div><div class="toolbar"><input id="deviceSearch" placeholder="Search devices, serial, plant..."/><select id="deviceTypeFilter"><option>All Types</option>${types.map(t=>`<option>${t}</option>`).join('')}</select><select id="deviceStatusFilter"><option>All Statuses</option><option>Online</option><option>Warning</option><option>Offline</option></select></div></div><div id="deviceTable">${deviceRows(list)}</div></section>
  <aside class="detail-drawer" id="deviceSourceDrawer"><button class="drawer-close" id="closeDeviceSource">x</button><h2>Device Source Traceability</h2><div class="drawer-body"><p>Each device is stored as FleetOS master data and keeps the source reference from the vendor platform.</p><ul><li>External Device ID</li><li>Vendor and integration name</li><li>Plant relationship</li><li>Parent / child topology</li><li>Last seen and freshness</li></ul></div><div class="drawer-actions"><button class="primary-action" onclick="location.href='plants.html'">Open Groups</button></div></aside>`;
}
function devicePrimaryMetric(d){
  const k=deviceTypeKey(d);
  if(k==='battery') return {label:'SOC / SOH', value:`${d.soc||'68%'} · ${d.soh||'94%'}`, hint:'Battery health'};
  if(k==='logger') return {label:'Signal / Data Lag', value:`${d.signal||'Good'} · ${d.dataLag||d.lastSeen}`, hint:'Communication health'};
  if(k==='meter') return {label:'Grid Power', value:d.power||'31.2 MW', hint:'Accounting point'};
  if(k==='weather') return {label:'Irradiance', value:d.irradiance||'0 W/m2', hint:'Weather telemetry'};
  if(k==='module') return {label:'Module Power', value:d.power||'549 W', hint:'Module-level output'};
  return {label:'Active Power', value:d.power||'83.4 kW', hint:'Realtime output'};
}
function deviceHeroActions(d){
  return `<button class="secondary-action" type="button" onclick="location.href='devices.html'">Back to Device List</button><button class="secondary-action" type="button" onclick="localStorage.setItem('fleetos_selected_plant','${d.plantId}');location.href='plant-detail.html'">Open Plant</button><button class="primary-action" type="button" id="refreshDeviceV59">Refresh</button>`;
}
function deviceKpis(d){
  const primary=devicePrimaryMetric(d);
  return `<section class="kpi-grid detail-kpis device-kpi-grid-v58 device-kpi-grid-v59">
    <article class="kpi-card"><span>Status</span><strong>${d.status}</strong><small>${d.alerts} active alerts · ${d.lastSeen}</small></article>
    <article class="kpi-card"><span>${primary.label}</span><strong>${primary.value}</strong><small>${primary.hint}</small></article>
    <article class="kpi-card"><span>Type</span><strong>${deviceTypeLabel(d)}</strong><small>${d.subtype}</small></article>
    <article class="kpi-card"><span>Vendor / Model</span><strong>${d.vendor}</strong><small>${d.model}</small></article>
    <article class="kpi-card"><span>Serial Number</span><strong>${d.serial}</strong><small>${d.externalId}</small></article>
    <article class="kpi-card"><span>Parent Relation</span><strong>${d.parent}</strong><small>${d.children}</small></article>
  </section>`;
}
function universalDeviceSidebar(d){
  const key=deviceTypeKey(d);
  const typeSpecific = key==='inverter'||key==='microinverter' ? '<button data-device-tab="strings" type="button"><span>PV Strings</span></button>' :
    key==='battery' ? '<button data-device-tab="battery" type="button"><span>Battery State</span></button>' :
    key==='logger' ? '<button data-device-tab="connectivity" type="button"><span>Logger View</span></button>' :
    key==='meter' ? '<button data-device-tab="measurements" type="button"><span>Measurements</span></button>' :
    key==='weather' ? '<button data-device-tab="weather" type="button"><span>Weather Data</span></button>' :
    key==='module' ? '<button data-device-tab="module" type="button"><span>Module Data</span></button>' : '';
  return `<aside class="detail-side-nav device-detail-nav-v58 device-detail-nav-v92" aria-label="Device navigation">
    <button class="active" data-device-tab="overview" type="button"><span>Overview</span></button>
    <button data-device-tab="passport" type="button"><span>Technical Passport</span></button>
    <button data-device-tab="connectivity-full" type="button"><span>Connectivity</span></button>
    <button data-device-tab="telemetry" type="button"><span>Telemetry Summary</span></button>
    <button data-device-tab="architecture" type="button"><span>Topology</span></button>
    ${typeSpecific}
    <button data-device-tab="alerts" type="button"><span>Alerts / Events</span></button>
    <button data-device-tab="lifecycle" type="button"><span>Lifecycle</span></button>
    <button data-device-tab="related" type="button"><span>Related Objects</span></button>
    <button data-device-tab="documents" type="button"><span>Documents</span></button>
    <button data-device-tab="configuration" type="button"><span>Configuration</span></button>
    <button data-device-tab="audit" type="button"><span>Audit</span></button>
    <button data-device-tab="source" type="button"><span>Source & Sync</span></button>
  </aside>`;
}
function deviceMetricValue(d, key){
  const k=deviceTypeKey(d);
  const base={activePower:d.power||'83.4 kW', reactivePower:'0.002 kvar', powerFactor:'1.000', frequency:d.frequency||'50.00 Hz', dailyEnergy:d.dailyEnergy||'156.91 kWh', totalYield:d.totalYield||'149,933.20 kWh', temperature:d.temperature||'42 °C', insulation:'4.359 MOhm', phaseCurrent:'22.552 / 22.468 / 22.438 A', lineVoltage:d.voltage||'379.2 / 378.6 / 382.4 V', startup:'2026-06-11 05:49:24', shutdown:'N/A'};
  if(k==='battery') return ({activePower:d.power||'-42 kW', soc:d.soc||'68%', soh:d.soh||'94%', voltage:d.voltage||'53.60 V', current:d.current||'0.00 A', temperature:d.temperature||'25.00 °C', rated:'5.000 kWh', backup:'— min', charged:'0.14 kWh', discharged:'0.07 kWh', packages:'4', chargeVoltage:'58.40 V', dischargeVoltage:'0.00 V', chargeCurrent:'0 A', dischargeCurrent:'250 A'}[key] || base[key] || '—');
  if(k==='logger') return ({signal:d.signal||'Good', wlan:d.wlan||'82%', dataLag:d.dataLag||d.lastSeen, linked:d.children||'8 inverters · 2 meters', lanIp:d.lanIp||d.ip, cybersecurity:d.cybersecurity||'CS1.0.0'}[key] || base[key] || '—');
  if(k==='meter') return ({activePower:d.power||'31.2 MW', voltage:d.voltage||'20 kV', current:d.current||'901 A', frequency:d.frequency||'50.01 Hz', import:'1.82 MWh', export:'7.44 MWh', todayImport:'0.12 MWh', todayExport:'1.09 MWh'}[key] || base[key] || '—');
  if(k==='weather') return ({irradiance:d.irradiance||'0 W/m2', ambient:d.ambient||'27 °C', moduleTemp:d.moduleTemp||'41 °C', wind:'3.2 m/s', humidity:'42%', rainfall:'0 mm'}[key] || base[key] || '—');
  if(k==='module') return ({activePower:d.power||'549 W', voltage:d.voltage||'42.6 V', current:d.current||'12.9 A', temperature:d.temperature||'44 °C', string:'String A-2', mppt:'MPPT 1', position:'R2-C4'}[key] || base[key] || '—');
  return base[key] || '—';
}
function cardGrid(items, cls='device-param-grid-v58'){
  return `<div class="${cls}">${items.map(([k,v,h])=>`<article><span>${k}</span><strong>${v}</strong>${h?`<small>${h}</small>`:''}</article>`).join('')}</div>`;
}
function operatingDataGrid(d){
  const key=deviceTypeKey(d);
  if(key==='logger') return cardGrid([['Signal Strength',deviceMetricValue(d,'signal')],['WLAN',deviceMetricValue(d,'wlan')],['Data Lag',deviceMetricValue(d,'dataLag')],['Linked Devices',deviceMetricValue(d,'linked')],['LAN IP',deviceMetricValue(d,'lanIp')],['Cyber Security Version',deviceMetricValue(d,'cybersecurity')],['Status',d.status],['Last Update',d.lastSeen]]);
  if(key==='battery') return cardGrid([['SOC',deviceMetricValue(d,'soc')],['SOH',deviceMetricValue(d,'soh')],['Voltage',deviceMetricValue(d,'voltage')],['Current',deviceMetricValue(d,'current')],['Temperature',deviceMetricValue(d,'temperature')],['Rated Capacity',deviceMetricValue(d,'rated')],['Charged Today',deviceMetricValue(d,'charged')],['Discharged Today',deviceMetricValue(d,'discharged')]]);
  if(key==='weather') return cardGrid([['Irradiance',deviceMetricValue(d,'irradiance')],['Ambient Temp',deviceMetricValue(d,'ambient')],['Module Temp',deviceMetricValue(d,'moduleTemp')],['Wind Speed',deviceMetricValue(d,'wind')],['Humidity',deviceMetricValue(d,'humidity')],['Rainfall',deviceMetricValue(d,'rainfall')]]);
  if(key==='meter') return cardGrid([['Active Power',deviceMetricValue(d,'activePower')],['Import Today',deviceMetricValue(d,'todayImport')],['Export Today',deviceMetricValue(d,'todayExport')],['Voltage',deviceMetricValue(d,'voltage')],['Current',deviceMetricValue(d,'current')],['Frequency',deviceMetricValue(d,'frequency')]]);
  if(key==='module') return cardGrid([['Power',deviceMetricValue(d,'activePower')],['Voltage',deviceMetricValue(d,'voltage')],['Current',deviceMetricValue(d,'current')],['Temperature',deviceMetricValue(d,'temperature')],['String',deviceMetricValue(d,'string')],['MPPT',deviceMetricValue(d,'mppt')],['Position',deviceMetricValue(d,'position')]]);
  return cardGrid([['Active Power',deviceMetricValue(d,'activePower')],['Reactive Power',deviceMetricValue(d,'reactivePower')],['Power Factor',deviceMetricValue(d,'powerFactor')],['Grid Frequency',deviceMetricValue(d,'frequency')],['Daily Energy',deviceMetricValue(d,'dailyEnergy')],['Total Yield',deviceMetricValue(d,'totalYield')],['Phase Current',deviceMetricValue(d,'phaseCurrent')],['Line Voltage',deviceMetricValue(d,'lineVoltage')],['Internal Temperature',deviceMetricValue(d,'temperature')],['Insulation Resistance',deviceMetricValue(d,'insulation')],['Startup Time',deviceMetricValue(d,'startup')],['Shutdown Time',deviceMetricValue(d,'shutdown')]]);
}
function deviceMiniChart(label){
  return `<div class="device-chart-card-v58"><div class="chart-card-head-v20"><strong>${label}</strong><small>Mock trend · Last 24h</small></div><div class="mini-bar-chart-v20"><span style="height:25%"></span><span style="height:42%"></span><span style="height:66%"></span><span style="height:78%"></span><span style="height:92%"></span><span style="height:74%"></span><span style="height:54%"></span><span style="height:35%"></span></div></div>`;
}
function architectureFlow(d){
  const key=deviceTypeKey(d);
  const nodes = key==='battery' ? [['Plant',d.plant],['Hybrid Inverter','Power conversion'],['Battery',d.name],['BMS','Health / limits'],['Grid','Import / Export']] :
    key==='logger' ? [['Plant',d.plant],['Logger',d.name],['Inverters','Linked devices'],['Meter','Accounting'],['Cloud','Vendor sync']] :
    key==='meter' ? [['Plant',d.plant],['Inverters','Generation'],['Meter',d.name],['Grid','Import / Export'],['Accounting','Records']] :
    key==='weather' ? [['Plant',d.plant],['Weather Station',d.name],['Irradiance','Sensor'],['Temperature','Sensor'],['Performance Analytics','PR context']] :
    key==='module' ? [['Plant',d.plant],['PV String','Array A'],['PV Module',d.name],['Microinverter','Module conversion'],['Grid','AC output']] :
    [['PV Arrays','DC input'],[deviceTypeLabel(d),d.name],['Battery / Load','Optional'],['Meter','Grid point'],['Grid','Export / Import']];
  return `<div class="device-architecture-v59">${nodes.map((n,i)=>`<div class="arch-node-v59"><span>${n[0]}</span><strong>${n[1]}</strong></div>${i<nodes.length-1?'<div class="arch-link-v59"><span></span></div>':''}`).join('')}</div>`;
}
function architectureRelations(d){
  return `<div class="split-grid device-relations-v59"><div class="panel-lite"><h3>Hierarchy</h3><div class="asset-tree"><p>${d.plant}\n└── ${d.parent}\n    └── ${d.name}\n        └── ${d.children}</p></div></div><div class="panel-lite"><h3>Connected Objects</h3>${cardGrid([['Plant',d.plant],['Tenant',d.tenant],['Parent',d.parent],['Children',d.children],['Vendor Source',d.vendor],['Mapping',d.sourceStatus]],'device-param-grid-v58 compact-v59')}</div></div>`;
}
function stringRows(d){
  const count=deviceTypeKey(d)==='microinverter'?4:8;
  const rows=Array.from({length:count},(_,i)=>{ const n=i+1; const volt=[256.2,5.5,0,0,547.3,547.3,560,560][i]||612.4; const cur=[3.1,0,0,0,6.87,0,6.78,0][i]||5.1; return `<div class="data-row"><div><strong>PV${n}</strong><small>MPPT ${Math.ceil(n/2)}</small></div><div><span>${volt} V</span></div><div><span>${cur} A</span></div><div><span>${cur ? (volt*cur/1000).toFixed(2) : '0.00'} kW</span></div><div><span>${cur ? '8,640.00 Wp' : '0.00 Wp'}</span></div></div>`; }).join('');
  return `<div class="data-table compact-table device-string-table-v58"><div class="data-head"><span>Input</span><span>Voltage</span><span>Current</span><span>Power</span><span>String Capacity</span></div>${rows}</div>`;
}
function batteryDetail(d){
  return `<div class="device-battery-visual-v59"><div class="battery-gauge-v59"><strong>${deviceMetricValue(d,'soc')}</strong><span>SOC</span></div><div>${cardGrid([['Battery Voltage',deviceMetricValue(d,'voltage')],['Battery Current',deviceMetricValue(d,'current')],['Battery Health',deviceMetricValue(d,'soh')],['Temp',deviceMetricValue(d,'temperature')],['Package Quantity',deviceMetricValue(d,'packages')]],'device-param-grid-v58 compact-v59')}</div></div><div class="section-title-v17 mini"><div><h3>Charge / Discharge Limits</h3><p class="muted">Limits and flags inspired by battery detail screens.</p></div></div>${cardGrid([['Charge End Voltage',deviceMetricValue(d,'chargeVoltage')],['Discharge End Voltage',deviceMetricValue(d,'dischargeVoltage')],['Charge Limit Current',deviceMetricValue(d,'chargeCurrent')],['Discharge Limit Current',deviceMetricValue(d,'dischargeCurrent')],['Force Charge Flag','0000'],['Check SOC Flag','0000']], 'device-param-grid-v58')}`;
}
function configurationPanel(d){
  const key=deviceTypeKey(d);
  const common=[['Firmware',d.firmware],['Configuration Version', key==='logger'?'Communication Profile v2':'Parameter Set v1'],['Task History','Available'],['Audit Required','Yes']];
  const specific= key==='inverter'||key==='microinverter' ? [['Active Power Adjustment','Supported'],['Reactive Power Adjustment','Supported'],['Power Factor Adjustment','Supported'],['Firmware Upgrade','Supported']] : key==='battery' ? [['Charge / Discharge Mode','Supported'],['SOC Reserve','Supported'],['Manual Health Check','Supported'],['Emergency Stop','Restricted']] : key==='logger' ? [['Search for Devices','Supported'],['Restart Communication','Supported'],['Network Settings','Read-only'],['WLAN Signal','Supported']] : [['Read Parameters','Supported'],['Remote Command','Capability gated'],['Repair','Available'],['Refresh','Supported']];
  return `<div class="section-title-v17"><div><h2>Configuration</h2><p class="muted">Capability-aware settings and command entry points.</p></div></div>${cardGrid([...common,...specific])}<div class="drawer-actions device-config-actions-v59"><button class="primary-action">View Task History</button><button class="secondary-action">Read Parameters</button><button class="secondary-action">Open Command Center</button></div>`;
}
function remoteControlPanel(d){
  const key=deviceTypeKey(d);
  const actions = key==='logger' ? ['Restart Communication','Search for Devices','Run Connectivity Test','Refresh Linked Devices'] : key==='battery' ? ['Manual Battery Health Check','Charge / Discharge Mode','Set SOC Reserve','Emergency Stop'] : key==='meter' ? ['Refresh Measurements','Verify Accounting Point','Sync Meter Clock'] : key==='weather' ? ['Refresh Sensors','Run Sensor Check','Calibrate Sensor'] : key==='module' ? ['Refresh Module Data','Locate Module','Open Parent Microinverter'] : ['Device Start / Stop','Active Power Adjustment','Reactive Power Adjustment','Power Factor Adjustment','Firmware Upgrade'];
  return `<div class="device-control-grid-v58">${actions.map(a=>`<button type="button"><strong>${a}</strong><small>Capability-gated · audit required</small></button>`).join('')}</div><p class="muted device-note-v58">Write-actions are mock controls for UX validation. In production they must use capability flags, confirmation, approval rules and immutable audit log.</p>`;
}
function deviceDetailPanel(d, tab){
  if(tab==='overview') return `<div class="section-title-v17"><div><h2>Device Overview</h2><p class="muted">Type-driven workspace: ${deviceTypeLabel(d)} shows only relevant operational data.</p></div></div><div class="device-overview-grid-v58"><article><span>Status</span><strong>${deviceStatusPill(d)}</strong><small>${d.lastSeen}</small></article><article><span>Plant</span><strong>${d.plant}</strong><small>${d.tenant}</small></article><article><span>Vendor / Model</span><strong>${d.vendor}</strong><small>${d.model}</small></article><article><span>Serial Number</span><strong>${d.serial}</strong><small>${d.id}</small></article></div><div class="section-title-v17 mini"><div><h3>Realtime Snapshot</h3><p class="muted">Main values change by device type.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='telemetry'||tab==='monitoring') return `<div class="section-title-v17"><div><h2>Telemetry</h2><p class="muted">Chart-ready operational view for ${deviceTypeLabel(d)}.</p></div></div><div class="device-monitoring-grid-v58">${deviceMiniChart(deviceTypeKey(d)==='logger'?'Communication Quality':'Operation Monitoring')}${deviceMiniChart(deviceTypeKey(d)==='battery'?'Charge / Discharge':'Energy Monitoring')}</div><div class="section-title-v17 mini"><div><h3>Live Metrics</h3><p class="muted">Fast numeric inspection while charts are loaded.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='architecture') return `<div class="section-title-v17"><div><h2>Architecture</h2><p class="muted">Visual relationship between plant, device and connected objects.</p></div></div>${architectureFlow(d)}${architectureRelations(d)}`;
  if(tab==='strings') return `<div class="section-title-v17"><div><h2>PV Strings / Inputs</h2><p class="muted">MPPT and PV input values for inverter and microinverter devices.</p></div></div>${stringRows(d)}`;
  if(tab==='battery') return `<div class="section-title-v17"><div><h2>Battery State</h2><p class="muted">Storage-specific information: SOC, health, voltage/current, packages and limits.</p></div></div>${batteryDetail(d)}`;
  if(tab==='connectivity') return `<div class="section-title-v17"><div><h2>Connectivity</h2><p class="muted">Logger / communication module status and subordinate devices.</p></div></div>${operatingDataGrid(d)}<div class="section-title-v17 mini"><div><h3>Subordinate Devices</h3><p class="muted">Devices managed through this logger.</p></div></div><div class="data-table compact-table subordinate-device-table-v59"><div class="data-head"><span>Status</span><span>Device Type</span><span>Model</span><span>Software Version</span><span>SN</span></div><div class="data-row"><div><span class="badge success">Connected</span></div><div><strong>Inverter</strong></div><div><span>SUN2000-50KTL-M0</span></div><div><span>V300R001C00SPC127</span></div><div><span>BN2251034144</span></div></div><div class="data-row"><div><span class="badge success">Connected</span></div><div><strong>Meter</strong></div><div><span>DTSU666-H</span></div><div><span>1.2.9</span></div><div><span>SN-MTR-00088</span></div></div></div>`;
  if(tab==='measurements') return `<div class="section-title-v17"><div><h2>Measurements</h2><p class="muted">Meter measurements for import/export and accounting context.</p></div></div>${operatingDataGrid(d)}${cardGrid([['Total Import',deviceMetricValue(d,'import')],['Total Export',deviceMetricValue(d,'export')],['Accounting Source','Smart Meter'],['Data Status','Confirmed']])}`;
  if(tab==='weather') return `<div class="section-title-v17"><div><h2>Weather Data</h2><p class="muted">Weather plant values used for performance analytics.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='module') return `<div class="section-title-v17"><div><h2>Module Data</h2><p class="muted">Module-level values are shown inside the device topology without turning the whole registry into module-only UI.</p></div></div>${operatingDataGrid(d)}`;
  if(tab==='information') return `<div class="section-title-v17"><div><h2>Technical Info</h2><p class="muted">Static master data, vendor identifiers and lifecycle attributes.</p></div></div><div class="info-grid"><div><span>Device Name</span><strong>${d.name}</strong></div><div><span>Device Type</span><strong>${d.type}</strong></div><div><span>Subtype</span><strong>${d.subtype}</strong></div><div><span>Vendor</span><strong>${d.vendor}</strong></div><div><span>Manufacturer</span><strong>${d.manufacturer}</strong></div><div><span>Model</span><strong>${d.model}</strong></div><div><span>Serial Number</span><strong>${d.serial}</strong></div><div><span>Firmware</span><strong>${d.firmware}</strong></div><div><span>IP Address</span><strong>${d.ip}</strong></div><div><span>MAC Address</span><strong>${d.mac}</strong></div><div><span>Installation Date</span><strong>${d.installation}</strong></div><div><span>Warranty</span><strong>${d.warranty}</strong></div></div>`;
  if(tab==='alerts') return `<div class="section-title-v17"><div><h2>Alerts / Faults</h2><p class="muted">Device-level active and historical events.</p></div></div><div class="data-table compact-table device-alert-table-v58"><div class="data-head"><span>Alert</span><span>Severity</span><span>Source</span><span>Time</span><span>Status</span></div>${d.alerts ? `<div class="data-row"><div><strong>${d.type} communication / performance warning</strong><small>${d.name}</small></div><div><span class="badge warning">Warning</span></div><div><span>${d.vendor}</span></div><div><span>${d.lastSeen}</span></div><div><span>Open</span></div></div>` : `<div class="data-row"><div><strong>No active issues</strong><small>${d.name}</small></div><div><span class="badge success">Normal</span></div><div><span>FleetOS</span></div><div><span>Now</span></div><div><span>Clear</span></div></div>`}</div><div class="drawer-actions"><button class="primary-action" onclick='localStorage.setItem("fleetos_alert_context", JSON.stringify({deviceId:"${d.id}", plantId:"${d.plantId}", tenant:"${d.tenant}"})); location.href="alerts.html"'>Open Alerts Center</button></div>`;
  if(tab==='configuration') return configurationPanel(d) + `<div class="section-title-v17 mini"><div><h3>Remote Actions</h3><p class="muted">Common actions are shown below the config blocks.</p></div></div>${remoteControlPanel(d)}`;
  if(tab==='activity') return `<div class="section-title-v17"><div><h2>Activity Log</h2><p class="muted">Telemetry refresh, configuration changes, firmware and repair history.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Operational telemetry refreshed · ${d.lastSeen}</span></div><div><b>Today</b><span>Architecture relationship checked · ${d.parent}</span></div><div><b>Yesterday</b><span>Configuration snapshot stored from ${d.vendor}</span></div><div><b>03 Jun</b><span>Firmware version confirmed · ${d.firmware}</span></div><div><b>${d.installation}</b><span>Device registered and linked to ${d.plant}</span></div></div>`;
  if(tab==='source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Vendor traceability and canonical mapping state.</p></div></div><div class="info-grid"><div><span>Integration</span><strong>${d.integration}</strong></div><div><span>Vendor</span><strong>${d.vendor}</strong></div><div><span>External ID</span><strong>${d.externalId}</strong></div><div><span>FleetOS ID</span><strong>${d.id}</strong></div><div><span>Mapping Status</span><strong>${d.sourceStatus}</strong></div><div><span>Last Seen</span><strong>${d.lastSeen}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Telemetry · Alerts · Architecture · ${deviceTypeLabel(d)} controls</strong></div></div>`;
  if(tab==='passport') return devicePassportPanelV92(d);
  if(tab==='connectivity-full') return deviceConnectivityFullPanelV92(d);
  if(tab==='lifecycle') return lifecyclePanelV92(d);
  if(tab==='related') return relatedObjectsPanelV92(d);
  if(tab==='documents') return deviceDocumentsPanelV92(d);
  if(tab==='audit') return deviceAuditPanelV92(d);
  return '';
}
function renderDeviceDetail(){
  const d=selectedDevice();
  return `<section class="page-hero device-hero-v58 device-hero-v59"><div><p class="eyebrow">Global Admin · Device Detail</p><h1>${d.name}</h1><p class="muted">${deviceTypeLabel(d)} · ${d.manufacturer || d.vendor} ${d.model} · ${d.serial}</p></div><div class="hero-actions">${deviceHeroActions(d)}</div></section>
  <section class="context-bar glass-card device-context-v58"><div><span>Plant</span><strong>${d.plant}</strong></div><div><span>Tenant</span><strong>${d.tenant}</strong></div><div><span>Device Type</span><strong>${deviceTypeLabel(d)}</strong></div><div><span>Last Communication</span><strong>${d.lastSeen}</strong></div></section>
  ${deviceKpis(d)}
  <section class="detail-layout-v58 device-detail-layout-v58 device-detail-layout-v59">${universalDeviceSidebar(d)}<main class="glass-card detail-main-v58"><div id="deviceDetailContent">${deviceDetailPanel(d,'overview')}</div></main></section>`;
}
function wireDeviceDetail(){
  const d=selectedDevice();
  document.getElementById('refreshDeviceV59')?.addEventListener('click',()=>FleetLayout.toast(`Device data refresh requested for ${d.name}`));
  document.querySelectorAll('[data-device-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-device-tab]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const content=document.getElementById('deviceDetailContent');
    if(content) content.innerHTML=deviceDetailPanel(d, btn.dataset.deviceTab);
  }));
}
