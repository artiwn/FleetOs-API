
function render(){
  const k = V51.kpis([
    {label:'Executable Commands', value:'42', note:'Capability-aware catalog'},
    {label:'Pending Approval', value:'7', note:'High-risk actions waiting'},
    {label:'Executed Today', value:'18', note:'16 success · 2 failed'},
    {label:'Unsupported', value:'11', note:'Vendor capability gaps'}
  ]);
  const rows = V51.commands.map(c=>`<button class="data-row command-row" data-id="${c.id}"><strong>${c.title}<small>${c.id} · ${c.target}</small></strong><span>${c.scope}</span><span class="badge ${V51.tone(c.risk)}">${c.risk}</span><span>${c.capability}</span><span>${c.approval}</span><span class="badge ${V51.tone(c.status)}">${c.status}</span></button>`).join('');
  return `${V51.hero('Operations / Control Plane','Command Center','Unified write-action workspace for plant, device, BESS and integration commands. Every action is guarded by capability flags, confirmation, approvals and audit.','v5.2 command workflow')}${k}
  <section class="split-workspace">
    <div class="panel"><div class="panel-head"><div><h2>Command Queue</h2><p>Commands are not simple buttons: they carry risk, capability, approval and execution result.</p></div><button class="primary-action" onclick="FleetLayout.toast('Demo command drafted')">New Command</button></div>
      <div class="data-table"><div class="data-head command-head"><span>Command</span><span>Scope</span><span>Risk</span><span>Capability</span><span>Approval</span><span>Status</span></div>${rows}</div>
    </div>
    <aside class="panel"><div class="panel-head"><div><h2>Execution Guardrails</h2><p>Documentation-driven safety model for write actions.</p></div></div>
      <div class="info-stack">
        <div class="info-card"><span>Capability check</span><strong>Available / Unsupported / Read-only</strong></div>
        <div class="info-card"><span>Approval rules</span><strong>High-risk command requires Global Admin</strong></div>
        <div class="info-card"><span>Execution evidence</span><strong>Vendor result, retry, rollback, comment</strong></div>
        <div class="info-card"><span>Audit</span><strong>Immutable command log for every attempt</strong></div>
      </div>
    </aside>
  </section>
  <section class="panel"><div class="panel-head"><div><h2>Command Lifecycle</h2><p>Draft → Validate capability → Confirm risk → Approve → Execute → Verify → Audit.</p></div></div>
    <div class="lineage-flow"><div><span>01</span><strong>Draft</strong><small>Select target and action</small></div><div><span>02</span><strong>Capability</strong><small>Vendor support check</small></div><div><span>03</span><strong>Approval</strong><small>Policy and risk gate</small></div><div><span>04</span><strong>Execute</strong><small>Send command and capture result</small></div><div><span>05</span><strong>Audit</strong><small>Immutable operation trail</small></div></div>
  </section>`;
}
FleetLayout.mount(render());
document.querySelector('.main-content').addEventListener('click',e=>{const b=e.target.closest('[data-id]'); if(!b)return; const item=V51.commands.find(x=>x.id===b.dataset.id); V51.drawer('Command Detail', item, '<div class="drawer-action-grid"><button>Approve</button><button>Execute</button><button>Retry</button><button>Open Audit</button></div>');});
