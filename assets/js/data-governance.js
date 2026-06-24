const DG = (() => {
  const maps = [
    { id:'MAP-001', vendor:'Huawei FusionSolar', source:'plant.realPower', target:'plant.real_time_power_kw', entity:'Plant KPI', coverage:'Mapped', quality:'Pass', owner:'Data Mapper', version:'v18', object:'Plant A', desc:'Live active power mapped into FleetOS canonical plant operational KPI with unit normalization from W to kW.' },
    { id:'MAP-002', vendor:'Solis Cloud', source:'fault_code', target:'alert.alert_category', entity:'Alert', coverage:'Needs Review', quality:'Warning', owner:'Governance Team', version:'v11', object:'INV-00432', desc:'Vendor-specific alert code needs category confirmation before it can power incident grouping and RCA.' },
    { id:'MAP-003', vendor:'Sungrow iSolarCloud', source:'deviceSn', target:'device.serial_number', entity:'Device', coverage:'Mapped', quality:'Pass', owner:'Device & Topology Registry', version:'v9', object:'String STR-BER-A1-01', desc:'Device serial mapping linked to Device & Topology Registry identity resolution and duplicate detection.' },
    { id:'MAP-004', vendor:'Deye', source:'battery.soc', target:'bess.soc_pct', entity:'BESS', coverage:'Partial', quality:'Warning', owner:'BESS Specialist', version:'v5', object:'Armavir BESS', desc:'BESS SOC is supported, but SOH and cycle indicators are missing from the source payload.' }
  ];
  const validations = [
    { id:'VAL-2401', rule:'Required parent device', severity:'Blocking', records:'18', dataset:'Device Registry', status:'Open', owner:'Device Governance', action:'Assign parent from topology tree', desc:'Orphan devices cannot be trusted for plant-level aggregation until they are attached to a valid parent hierarchy.' },
    { id:'VAL-2402', rule:'Timestamp freshness window', severity:'High', records:'1,284', dataset:'Telemetry', status:'Investigating', owner:'Integration Ops', action:'Replay failed sync job', desc:'Telemetry samples are outside accepted freshness window and should be marked delayed on dashboards.' },
    { id:'VAL-2403', rule:'Energy value range', severity:'Medium', records:'42', dataset:'Energy Accounting', status:'Queued', owner:'Analytics Team', action:'Check unit conversion', desc:'Energy records exceed expected range, likely caused by Wh/kWh mapping mismatch.' },
    { id:'VAL-2404', rule:'Duplicate serial number', severity:'High', records:'7', dataset:'Device & Topology Registry', status:'Open', owner:'Device Governance', action:'Open duplicate resolver', desc:'Same serial appears under multiple plants. Needs source-to-core identity resolution.' }
  ];
  const freshness = [
    { module:'Plants', status:'Fresh', last:'2 min ago', source:'Huawei, Solis, Deye', affected:'0 objects' },
    { module:'Devices', status:'Fresh', last:'4 min ago', source:'All connectors', affected:'0 objects' },
    { module:'Telemetry', status:'Delayed', last:'27 min ago', source:'Sungrow iSolarCloud', affected:'1,284 samples' },
    { module:'Alerts', status:'Partial', last:'12 min ago', source:'Solis Cloud', affected:'14 alerts' },
    { module:'Energy Accounting', status:'Fresh', last:'6 min ago', source:'Smart meters', affected:'0 records' }
  ];
  const lineage = [
    { id:'RAW-884921', source:'Huawei FusionSolar', entity:'Plant KPI', raw:'Captured', parse:'Pass', map:'Pass', validate:'Pass', core:'Written', canonical:'plant.real_time_power_kw', object:'Plant A' },
    { id:'RAW-884922', source:'Solis Cloud', entity:'Alert', raw:'Captured', parse:'Pass', map:'Review', validate:'Blocked', core:'Not written', canonical:'alert.alert_category', object:'INV-00432' },
    { id:'RAW-884923', source:'Sungrow iSolarCloud', entity:'Telemetry', raw:'Captured', parse:'Warning', map:'Pass', validate:'Delayed', core:'Partial', canonical:'telemetry.active_power', object:'Madrid East' }
  ];
  const tone = (v='') => /Blocking|High|Blocked|Not written|Open|Delayed|Review/.test(v) ? 'danger' : /Warning|Partial|Queued|Investigating/.test(v) ? 'warning' : 'success';
  const badge = v => `<span class="badge ${tone(v)}">${v}</span>`;
  const drawer = (title, item, mode='') => {
    let d = document.getElementById('detailDrawer');
    if (!d) { d = document.createElement('aside'); d.id = 'detailDrawer'; d.className = 'detail-drawer'; document.body.appendChild(d); }
    const fields = Object.entries(item).filter(([k]) => k !== 'desc').map(([k,v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    d.innerHTML = `<button class="drawer-close" type="button">x</button><p class="eyebrow">${title}</p><h2>${item.id || item.module || item.rule}</h2><div class="drawer-body"><div class="drawer-status-row">${badge(item.quality || item.severity || item.status || item.core || 'Governed')}<span class="badge warning">${mode || 'Data Governance'}</span></div><p>${item.desc || 'Governance object connected to source payload, canonical model, validation rules, asset hierarchy and audit trail.'}</p><div class="drawer-metrics rich">${fields}</div><div class="drawer-action-grid"><button onclick="FleetLayout.toast('Mapping editor opened')">Open mapping editor</button><button onclick="FleetLayout.toast('Validation replay queued')">Replay validation</button><button onclick="FleetLayout.toast('Raw payload inspector opened')">Inspect raw payload</button><button onclick="FleetLayout.toast('Audit trace opened')">View audit trace</button></div><div class="timeline-mini"><strong>Lineage Timeline</strong><p>Raw payload captured with checksum</p><p>Parsed and normalized into canonical fields</p><p>Validation status attached to core write decision</p></div></div><div class="drawer-actions"><button class="primary-action" onclick="FleetLayout.toast('Governance action saved')">Save governance action</button><button class="secondary-action drawer-close-2">Close</button></div>`;
    d.classList.add('open'); d.querySelectorAll('.drawer-close,.drawer-close-2').forEach(b => b.onclick = () => d.classList.remove('open'));
  };
  return { maps, validations, freshness, lineage, tone, badge, drawer };
})();

const mappingRows = DG.maps.map((m,i)=>`<button class="data-row governance-row" onclick="DG.drawer('Mapping Rule', DG.maps[${i}], 'Canonical Mapping')"><div><strong>${m.id} · ${m.vendor}</strong><small>${m.source} → ${m.target}</small></div><div><strong>${m.entity}</strong><small>${m.object}</small></div><div>${DG.badge(m.coverage)}</div><div>${DG.badge(m.quality)}</div><div><strong>${m.owner}</strong><small>${m.version}</small></div></button>`).join('');
const validationRows = DG.validations.map((v,i)=>`<button class="data-row validation-row" onclick="DG.drawer('Validation Issue', DG.validations[${i}], 'Validation')"><div><strong>${v.id} · ${v.rule}</strong><small>${v.dataset}</small></div><div>${DG.badge(v.severity)}</div><div><strong>${v.records}</strong><small>affected records</small></div><div>${DG.badge(v.status)}</div><div><strong>${v.owner}</strong><small>${v.action}</small></div></button>`).join('');
const freshRows = DG.freshness.map((f,i)=>`<button class="info-card" onclick="DG.drawer('Freshness Details', DG.freshness[${i}], 'Freshness')"><span>${f.module}</span><strong>${f.status} · ${f.last}</strong><small>${f.source}<br>${f.affected}</small></button>`).join('');
const lineageRows = DG.lineage.map((l,i)=>`<button class="data-row lineage-row" onclick="DG.drawer('Raw → Core Trace', DG.lineage[${i}], 'Traceability')"><div><strong>${l.id}</strong><small>${l.source} · ${l.entity}</small></div><div>${DG.badge(l.raw)}</div><div>${DG.badge(l.parse)}</div><div>${DG.badge(l.map)}</div><div>${DG.badge(l.validate)}</div><div>${DG.badge(l.core)}</div></button>`).join('');

FleetLayout.mount(`
${V51.hero('System · Data Governance v5.4', 'Data Governance Center', 'Canonical mapping, validation, freshness monitoring, source traceability and raw-to-core lineage for FleetOS integrations.', 'Governance snapshot delayed')}
${V51.kpis([
  {label:'Mapping Coverage',value:'97.4%',note:'3,842 / 3,944 vendor fields mapped'},
  {label:'Blocking Issues',value:'18',note:'orphan devices require ownership'},
  {label:'Freshness SLA',value:'94.8%',note:'telemetry degraded by Sungrow lag'},
  {label:'Traceable Writes',value:'99.9%',note:'raw payload → normalized core'}
])}
<section class="split-workspace">
  <article class="panel glass-card">
    <div class="panel-head"><div><h2>Raw → Parse → Map → Validate → Core</h2><p>Pipeline visibility for every source record before it becomes FleetOS canonical data.</p></div><button onclick="FleetLayout.toast('Full lineage report exported')">Export lineage</button></div>
    <div class="lineage-flow">
      <div><span>1</span><strong>Raw Capture</strong><small>payload_json, checksum, correlation_id</small></div>
      <div><span>2</span><strong>Parser Layer</strong><small>nulls, schema drift, diagnostics</small></div>
      <div><span>3</span><strong>Mapping Layer</strong><small>vendor fields → canonical model</small></div>
      <div><span>4</span><strong>Validation</strong><small>required fields, range checks, duplicates</small></div>
      <div><span>5</span><strong>Core Write</strong><small>device, telemetry, events, accounting</small></div>
    </div>
  </article>
  <aside class="panel glass-card">
    <div class="panel-head"><div><h2>Freshness Monitor</h2><p>Shows which UI modules can be trusted right now.</p></div></div>
    <div class="info-stack">${freshRows}</div>
  </aside>
</section>
<section class="panel glass-card governance-table">
  <div class="panel-head"><div><h2>Mapping Center</h2><p>Vendor-specific fields normalized into FleetOS canonical entities and asset hierarchy.</p></div><button onclick="FleetLayout.toast('New mapping rule draft created')">New mapping rule</button></div>
  <div class="data-head governance-row"><div>Mapping</div><div>Entity / Asset</div><div>Coverage</div><div>Quality</div><div>Owner</div></div>${mappingRows}
</section>
<section class="panel glass-card governance-table">
  <div class="panel-head"><div><h2>Validation Queue</h2><p>Issues blocking reliable dashboards, reports, incidents and accounting flows.</p></div><button onclick="FleetLayout.toast('Validation run started')">Run validation</button></div>
  <div class="data-head validation-row"><div>Rule</div><div>Severity</div><div>Records</div><div>Status</div><div>Owner / Action</div></div>${validationRows}
</section>
<section class="panel glass-card governance-table">
  <div class="panel-head"><div><h2>Source Traceability</h2><p>Every canonical write keeps lineage back to source system and raw payload.</p></div><button onclick="FleetLayout.toast('Raw payload inspector opened')">Open raw inspector</button></div>
  <div class="data-head lineage-row"><div>Raw ID</div><div>Raw</div><div>Parse</div><div>Map</div><div>Validate</div><div>Core</div></div>${lineageRows}
</section>`);
