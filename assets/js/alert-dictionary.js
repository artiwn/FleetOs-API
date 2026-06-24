
const AlertDictionaryState = { tab: 'overview', group: 'All', severity: 'All', q: '', data: null };
const ALERT_JSON_PATH = '../assets/data/FleetOS_Canonical_Alerts_UI_Ready_v1.json';
function esc(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function tone(value){ const v=String(value||'').toLowerCase(); if(v.includes('critical')) return 'danger'; if(v.includes('fault')||v.includes('high')) return 'warning'; if(v.includes('warn')||v.includes('medium')) return 'neutral'; return 'success'; }
function titleBlock(title, desc, action=''){ return `<div class="section-title-v17"><div><h2>${esc(title)}</h2><p class="muted">${esc(desc)}</p></div>${action}</div>`; }
async function loadAlertDictionary(){
  try {
    const res = await fetch(ALERT_JSON_PATH, {cache:'no-store'});
    AlertDictionaryState.data = await res.json();
  } catch(err) {
    AlertDictionaryState.data = {counts:{canonical_alerts:0,vendor_mappings:0}, canonical_alerts:[], vendor_mappings:[]};
    console.error('Cannot load FleetOS alert dictionary', err);
  }
  renderPage();
}
function canonical(){ return AlertDictionaryState.data?.canonical_alerts || []; }
function mappings(){ return AlertDictionaryState.data?.vendor_mappings || []; }
function vendorCountFor(code){ return mappings().filter(m=>m.fleetos_alert?.code===code).length; }
function uniqueVendorsFor(code){ return [...new Set(mappings().filter(m=>m.fleetos_alert?.code===code).map(m=>m.source_alert?.vendor).filter(Boolean))]; }
function severityFor(code){
  const sevs = mappings().filter(m=>m.fleetos_alert?.code===code).map(m=>String(m.source_alert?.severity||'').toLowerCase());
  if(sevs.some(s=>s.includes('critical'))) return 'Critical';
  if(sevs.some(s=>s.includes('high')||s.includes('fault'))) return 'Fault';
  if(sevs.some(s=>s.includes('medium')||s.includes('warning'))) return 'Warning';
  return 'Info';
}
function groups(){ return ['All', ...new Set(canonical().map(a=>a.category).filter(Boolean).sort())]; }
function filteredCodes(){
  const q=AlertDictionaryState.q.toLowerCase().trim();
  return canonical().filter(a => (AlertDictionaryState.group==='All'||a.category===AlertDictionaryState.group))
    .filter(a => AlertDictionaryState.severity==='All'||severityFor(a.fleetos_alert_code)===AlertDictionaryState.severity)
    .filter(a => !q || [a.fleetos_alert_code,a.fleetos_alert_name,a.category,...uniqueVendorsFor(a.fleetos_alert_code)].join(' ').toLowerCase().includes(q));
}
function renderOverview(){
  const c=AlertDictionaryState.data?.counts||{};
  const vendors=[...new Set(mappings().map(m=>m.source_alert?.vendor).filter(Boolean))].sort();
  const catCount=groups().length-1;
  return `${titleBlock('FleetOS Alert Dictionary','Canonical alert taxonomy loaded from Alert Mapping Registry. No local mock codes are used on this page.')}
  <section class="kpi-grid compact-kpis alert-dict-kpis-v95"><article class="kpi-card cyan"><span>Canonical Alerts</span><strong>${c.canonical_alerts||canonical().length}</strong><small>FleetOS high-level alert buckets</small></article><article class="kpi-card blue"><span>Vendor Mappings</span><strong>${c.vendor_mappings||mappings().length}</strong><small>source code → FleetOS code</small></article><article class="kpi-card green"><span>Vendors</span><strong>${vendors.length}</strong><small>${esc(vendors.join(' · '))}</small></article><article class="kpi-card yellow"><span>Categories</span><strong>${catCount}</strong><small>GRID · PV · BATTERY · INVERTER...</small></article></section>
  <div class="normalization-empty-grid">${groups().filter(g=>g!=='All').map(g=>`<article data-group="${esc(g)}"><strong>${esc(g)}</strong><small>${canonical().filter(a=>a.category===g).length} FleetOS alerts · ${mappings().filter(m=>m.fleetos_alert?.category===g).length} vendor mappings</small></article>`).join('')}</div>`;
}
function renderFilters(){ return `<section class="filter-panel compact-filter-panel"><label>Category<select id="dictGroupFilter">${groups().map(g=>`<option ${AlertDictionaryState.group===g?'selected':''}>${esc(g)}</option>`).join('')}</select></label><label>Severity<select id="dictSeverityFilter">${['All','Critical','Fault','Warning','Info'].map(s=>`<option ${AlertDictionaryState.severity===s?'selected':''}>${s}</option>`).join('')}</select></label><label>Search<input id="dictSearch" value="${esc(AlertDictionaryState.q)}" placeholder="FleetOS code, vendor, category..." /></label><button class="secondary-action" id="dictReset" type="button">Reset</button></section>`; }
function renderCodes(){
  return `${titleBlock('Canonical FleetOS Alerts','Each row is a normalized FleetOS alert code. Vendor-specific codes remain visible inside the mapping drawer.', '<button class="primary-action" id="dictExport" type="button">Export</button>')}${renderFilters()}<div class="data-table alert-dictionary-table-v95"><div class="data-head"><span>FleetOS Code</span><span>FleetOS Alert Name</span><span>Category</span><span>Severity</span><span>Vendor Mappings</span><span>Actions</span></div>${filteredCodes().map(a=>{const sev=severityFor(a.fleetos_alert_code); const v=uniqueVendorsFor(a.fleetos_alert_code); return `<div class="data-row dictionary-row-v95" data-code="${esc(a.fleetos_alert_code)}"><div><strong>${esc(a.fleetos_alert_code)}</strong><small>${esc(a.ui_binding?.code_field_key || 'normalized_alarm_code')}</small></div><div><strong>${esc(a.fleetos_alert_name)}</strong><small>${esc(a.description || 'FleetOS normalized alert bucket')}</small></div><div><strong>${esc(a.category)}</strong><small>${esc(a.ui_binding?.category_field_key || 'alarm_category')}</small></div><span class="badge ${tone(sev)}">${sev}</span><div><strong>${vendorCountFor(a.fleetos_alert_code)}</strong><small>${esc(v.slice(0,3).join(' · '))}${v.length>3?'...':''}</small></div><div class="row-actions"><button class="secondary-action small-btn" data-open-code="${esc(a.fleetos_alert_code)}" type="button">Open</button></div></div>`;}).join('')}</div>`;
}
function renderVendorMappings(){
  const items=mappings().slice(0,150);
  return `${titleBlock('Vendor Alert Mappings','Real vendor mappings from Alert Mapping Registry. The table keeps FleetOS fields and raw vendor fields separated.')}
  <div class="data-table alert-vendor-map-table-v95"><div class="data-head"><span>FleetOS Alert</span><span>Vendor Code</span><span>Vendor Error Name</span><span>Severity</span><span>Recommended Action</span><span>Device Family</span></div>${items.map(m=>`<div class="data-row"><div><strong>${esc(m.fleetos_alert?.code)}</strong><small>${esc(m.fleetos_alert?.name)}</small></div><div><strong>${esc(m.source_alert?.vendor)} ${esc(m.source_alert?.code)}</strong><small>${esc(m.source_alert?.vendor)}</small></div><div><strong>${esc(m.source_alert?.name)}</strong><small>${esc(m.source_alert?.description).slice(0,90)}</small></div><span class="badge ${tone(m.source_alert?.severity)}">${esc(m.source_alert?.severity || 'Info')}</span><div><strong>${esc(m.source_alert?.recommended_action).slice(0,80)}</strong><small>${esc(m.source_alert?.probable_cause).slice(0,70)}</small></div><div><strong>${esc(m.source_alert?.device_family).slice(0,40)}</strong><small>${esc(m.mapping_id)}</small></div></div>`).join('')}</div><p class="muted table-note-v95">Showing first 150 of ${mappings().length} mappings for prototype performance.</p>`;
}
function renderIntegration(){
  const sample=mappings()[0];
  const fields=sample?.ui_fields || {};
  return `${titleBlock('UI Field Bindings','How Alert Dictionary is connected to FleetOS UI Dictionary. These field keys must be used by Alert List and Alert Detail.')}
  <div class="data-table alert-bindings-table-v4"><div class="data-head"><span>Data Field</span><span>UI Field</span><span>Meaning</span></div>${Object.entries(fields).map(([k,v])=>`<div class="data-row"><div><strong>${esc(k)}</strong><small>mapped value</small></div><div><strong>${esc(v)}</strong><small>shared UI label</small></div><div><strong>${esc(k.includes('fleetos')?'Normalized FleetOS field':'Original vendor field')}</strong><small>single label source for frontend</small></div></div>`).join('')}</div>`;
}
function activeContent(){ if(AlertDictionaryState.tab==='codes') return renderCodes(); if(AlertDictionaryState.tab==='vendor') return renderVendorMappings(); if(AlertDictionaryState.tab==='bindings') return renderIntegration(); return renderOverview(); }
function shell(content){ return `<section class="normalization-workspace-v92"><aside class="glass-card production-side-card-v92"><h3>Alert Dictionary</h3><button class="${AlertDictionaryState.tab==='overview'?'active':''}" data-alert-dict-tab="overview">Overview</button><button class="${AlertDictionaryState.tab==='codes'?'active':''}" data-alert-dict-tab="codes">Canonical Alerts</button><button class="${AlertDictionaryState.tab==='vendor'?'active':''}" data-alert-dict-tab="vendor">Vendor Mappings</button><button class="${AlertDictionaryState.tab==='bindings'?'active':''}" data-alert-dict-tab="bindings">UI Bindings</button></aside><section class="glass-card production-main-card-v92" id="alertDictContent">${content}</section></section>`; }
function renderPage(){ FleetLayout.mount(`<section class="page-hero"><div><p class="eyebrow">Global Admin · Data Governance</p><h1>Alert Dictionary</h1><p class="muted">FleetOS canonical alert dictionary and source vendor mappings controlled by the normalization layer.</p></div><button class="freshness-card" onclick="FleetLayout.toast('Alert dictionary is loaded')"><span class="pulse"></span><div><strong>v1.0.0</strong><small>28 alerts · 844 mappings</small></div></button></section>${shell(activeContent())}<aside class="detail-drawer alert-code-drawer-v95" id="alertCodeDrawer"><button class="drawer-close" type="button" id="alertCodeDrawerClose">x</button><div id="alertCodeDrawerBody"></div></aside>`); wire(); }
function wire(){
  document.querySelectorAll('[data-alert-dict-tab]').forEach(btn=>btn.onclick=()=>{AlertDictionaryState.tab=btn.dataset.alertDictTab; renderPage();});
  document.querySelectorAll('[data-group]').forEach(card=>card.onclick=()=>{AlertDictionaryState.group=card.dataset.group; AlertDictionaryState.tab='codes'; renderPage();});
  document.getElementById('dictGroupFilter')?.addEventListener('change',e=>{AlertDictionaryState.group=e.target.value; renderPage();});
  document.getElementById('dictSeverityFilter')?.addEventListener('change',e=>{AlertDictionaryState.severity=e.target.value; renderPage();});
  document.getElementById('dictSearch')?.addEventListener('input',e=>{AlertDictionaryState.q=e.target.value; setTimeout(renderPage,80);});
  document.getElementById('dictReset')?.addEventListener('click',()=>{AlertDictionaryState.group='All';AlertDictionaryState.severity='All';AlertDictionaryState.q='';renderPage();});
  document.querySelectorAll('[data-open-code], .dictionary-row-v95').forEach(el=>el.onclick=(ev)=>{const code=el.dataset.openCode || el.dataset.code || el.closest('[data-code]')?.dataset.code; if(code) openDrawer(code); ev.stopPropagation();});
  document.getElementById('alertCodeDrawerClose')?.addEventListener('click',()=>document.getElementById('alertCodeDrawer')?.classList.remove('open'));
}
function openDrawer(code){ const a=canonical().find(x=>x.fleetos_alert_code===code); const items=mappings().filter(m=>m.fleetos_alert?.code===code).slice(0,30); document.getElementById('alertCodeDrawerBody').innerHTML=`<p class="eyebrow">FleetOS Alert Detail</p><h2>${esc(code)}</h2><p class="muted">${esc(a?.fleetos_alert_name)}</p><div class="info-grid alert-code-info-v95"><div><span>Category</span><strong>${esc(a?.category)}</strong></div><div><span>Severity</span><strong>${severityFor(code)}</strong></div><div><span>Vendor Mappings</span><strong>${vendorCountFor(code)}</strong></div><div><span>UI Field</span><strong>${esc(a?.ui_binding?.name_field_key || 'alarm_name')}</strong></div></div><div class="section-title-v17 mini"><div><h3>Vendor Examples</h3><p class="muted">${items.map(m=>`${esc(m.source_alert?.vendor)} ${esc(m.source_alert?.code)} — ${esc(m.source_alert?.name)}`).join('<br>')}</p></div></div>`; document.getElementById('alertCodeDrawer').classList.add('open'); }
FleetLayout.mount('<section class="glass-card"><p class="muted">Loading FleetOS alert dictionary...</p></section>');
loadAlertDictionary();
