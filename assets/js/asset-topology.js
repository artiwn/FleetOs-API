FleetLayout.mount(`
  ${V51.hero('Devices · Technical Structure', 'Topology Explorer', 'Interactive canonical hierarchy from tenant and portfolio down to plant, zone, array, string, inverter, meter, BESS and sensors.', 'v5.3 topology workspace')}
  ${V51.kpis([{label:'Plants',value:'4,285',note:'Across all tenants'}, {label:'Devices',value:'68,521',note:'Registered technical devices'}, {label:'Topology Issues',value:'27',note:'Orphans and invalid relations'}, {label:'Validation',value:'97.4%',note:'Hierarchy consistency'}])}
  <section class="split-workspace topology-v53">
    <article class="panel glass-card">
      <div class="panel-head"><div><h2>Hierarchy Explorer</h2><p>Canonical plant → zone → array → string/device structure.</p></div><button onclick="FleetLayout.toast('Topology validation started')">Validate Tree</button></div>
      <div class="topology-toolbar"><button class="active">Tree</button><button>Relations</button><button>Source Mapping</button><button>Issues</button></div>
      <div class="tree-view rich-tree">
        <button class="tree-node">🏢 Tenant Alpha Energy <small>Managing Tenant</small></button>
        <button class="tree-node l1">📁 EU Utility Portfolio <small>12 plants · 128 MWp</small></button>
        <button class="tree-node l2">🏭 Plant A <small>54.2 MWp · Normal</small></button>
        <button class="tree-node l3">🧭 Zone A / North Field <small>4 arrays</small></button>
        <button class="tree-node l4">▦ Array A1 <small>24 strings</small></button>
        <button class="tree-node l4">🧵 String 01 <small>24 modules · MPPT 01</small></button>
        <button class="tree-node l4 selected">🔌 INV-00432 · Huawei SUN2000 <small>Online · 250 kW</small></button>
        <button class="tree-node l5">🔀 MPPT 01 <small>3 strings attached</small></button>
        <button class="tree-node l3 warn">🔋 BESS Rack 02 <small>Warning · maintenance lifecycle</small></button>
        <button class="tree-node l3">📟 Grid Export Meter 01 <small>Accounting source</small></button>
        <button class="tree-node l3">🌦 Weather Station WS-01 <small>Irradiance / temperature</small></button>
      </div>
    </article>
    <aside class="panel glass-card">
      <div class="panel-head"><div><h2>Selected Object</h2><p>Technical passport, relations and source traceability.</p></div><button onclick="location.href='asset-registry.html'">Open Registry</button></div>
      <div class="info-stack">
        <div class="info-card"><span>Object</span><strong>INV-00432 · Huawei SUN2000</strong></div>
        <div class="info-card"><span>Canonical ID</span><strong>dev_INV_00432</strong></div>
        <div class="info-card"><span>Parent</span><strong>Array A1 · Plant A</strong></div>
        <div class="info-card"><span>Source</span><strong>Huawei FusionSolar</strong></div>
        <div class="info-card"><span>Validation</span><strong>No duplicate serials · parent valid</strong></div>
      </div>
      <div class="lineage-flow compact-lineage"><div><span>Source</span><strong>Huawei</strong></div><div><span>Mapping</span><strong>Matched</strong></div><div><span>Core</span><strong>Updated</strong></div><div><span>Audit</span><strong>Logged</strong></div><div><span>UI</span><strong>Ready</strong></div></div>
    </aside>
  </section>
  <section class="panel glass-card"><div class="panel-head"><div><h2>Topology Validation Center</h2><p>Issues that block clean asset master-data hierarchy.</p></div><button onclick="FleetLayout.toast('Validation report exported')">Export Report</button></div><div class="module-grid"><article class="module-card"><span>Orphan Devices</span><strong>17</strong><small>Missing plant or parent relation</small></article><article class="module-card"><span>Invalid Parent</span><strong>4</strong><small>Child type violates hierarchy matrix</small></article><article class="module-card"><span>Duplicate Serials</span><strong>6</strong><small>Merge or mapping decision needed</small></article><article class="module-card"><span>Missing Passport</span><strong>143</strong><small>Warranty, firmware or model fields missing</small></article></div></section>
`);
