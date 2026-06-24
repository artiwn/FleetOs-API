function assignmentRows(){
  const ps = (typeof plants === 'function' ? plants() : []);
  const clients = (typeof FleetClientModel !== 'undefined' ? FleetClientModel.clients : []);
  const rows = JSON.parse(localStorage.getItem('fleetos_demo_assignments') || 'null') || ps.slice(0,5).map((p,i)=>{
    const client = clients.find(c => c.id === p.clientId) || clients[i % (clients.length || 1)] || { name: p.owner || 'Owning Client' };
    return { id:'ASN-000'+(i+41), client:client.name, plant:p.name, role:i%2?'Operator':'Owner', access:i%2?'Technical':'Full', status:'Active', from:'2026-06-01', to:'No end date', primary:i===0?'Yes':'No', responsibilities:['Ownership','Operations','Reporting'].slice(0, i%3+1), permissions:['View Plant Data','View Device','View Production','Download Reports'] };
  });
  localStorage.setItem('fleetos_demo_assignments', JSON.stringify(rows));
  return rows;
}
function saveAssignments(rows){ localStorage.setItem('fleetos_demo_assignments', JSON.stringify(rows)); }
function renderAssignments(){
  const rows = assignmentRows();
  const clientOptions = (typeof FleetClientModel !== 'undefined' ? FleetClientModel.clients : []).map(c=>`<option>${c.name}</option>`).join('');
  const plantOptions = (typeof plants === 'function' ? plants() : []).map(p=>`<option>${p.name}</option>`).join('');
  return `<section class="page-hero"><div><p class="eyebrow">Global Admin · Client Ownership</p><h1>Client–Plant Ownership</h1><p class="muted">Connect owning clients with plants, define ownership role, access level, responsibilities and permissions. Tenant remains the managing service workspace.</p></div><button class="freshness-card" id="validateAssignment"><span class="pulse"></span><div><strong>Validate Assignment</strong><small>Duplicate role, ownership uniqueness, date overlap</small></div></button></section>
  <section class="assignment-workspace glass-card">
    <div class="assignment-form">
      <div class="panel-head"><div><h2>Create Assignment</h2><p>Only existing clients and plants can be selected.</p></div></div>
      <div class="form-grid">
        <label>Client *<select id="assignClient">${clientOptions}</select></label>
        <label>Plant *<select id="assignPlant">${plantOptions}</select></label>
        <label>Relationship Role<select id="assignRole"><option>Owner</option><option>Operator</option><option>Operator</option><option>O&M Provider</option><option>Investor</option><option>Owner Manager</option><option>EPC</option></select></label>
        <label>Access Level<select id="assignAccess"><option>Full</option><option>Operational</option><option>Technical</option><option>Financial</option><option>View Only</option></select></label>
        <label>Effective From<input type="date" id="assignFrom" value="2026-06-01"></label>
        <label>Effective To<input id="assignTo" value="No end date"></label>
        <label class="check full"><input type="checkbox" id="assignPrimary" checked> Primary Relationship</label>
      </div>
      <div class="matrix-grid">
        <div><h3>Responsibilities</h3>${['Ownership','Operations','Maintenance','Alert Response','Reporting','Data Review','Commercial Review','Technical Approval'].map(x=>`<label class="check"><input type="checkbox" class="resp" value="${x}" ${['Ownership','Operations','Reporting'].includes(x)?'checked':''}> ${x}</label>`).join('')}</div>
        <div><h3>Permissions</h3>${['View Plant Data','View Device','View Production','View Alerts','View Maintenance Tickets','Create Work Orders','Download Reports','Edit Technical Data'].map(x=>`<label class="check"><input type="checkbox" class="perm" value="${x}" ${['View Plant Data','View Device','View Production','Download Reports'].includes(x)?'checked':''}> ${x}</label>`).join('')}</div>
      </div>
      <div class="drawer-actions"><button class="secondary-action" id="resetAssignment" type="button">Reset</button><button class="primary-action" id="saveAssignment" type="button">Save Assignment</button></div>
    </div>
    <div class="assignment-rules panel-lite"><h3>Validation Rules</h3><div class="timeline-mini"><p><strong>Client must exist</strong> · only existing client can be selected</p><p><strong>Plant must exist</strong> · only existing plant can be selected</p><p><strong>Duplicate role check</strong> · same client cannot duplicate same role for same plant</p><p><strong>Owner uniqueness</strong> · one primary owning client per plant</p><p><strong>Date overlap check</strong> · same role cannot overlap incorrectly</p></div></div>
  </section>
  <section class="panel glass-card"><div class="panel-head"><div><h2>Assignment List</h2><p>Client, plant, role, access level, status and effective dates.</p></div><div class="toolbar"><input id="assignmentSearch" placeholder="Search client, plant, role..."></div></div><div id="assignmentTable">${assignmentTable(rows)}</div></section>`;
}
function assignmentTable(rows){
  return `<div class="data-table assignment-table"><div class="data-head"><span>Client</span><span>Plant</span><span>Role</span><span>Access</span><span>Status</span><span>Actions</span></div>${rows.map(r=>`<div class="data-row" data-id="${r.id}"><div><strong>${r.client || r.tenant}</strong><small>${r.id}</small></div><div><strong>${r.plant}</strong><small>${r.primary==='Yes'?'Primary relationship':'Secondary relationship'}</small></div><div><strong>${r.role}</strong><small>${r.responsibilities.join(', ')}</small></div><div><strong>${r.access}</strong><small>${r.permissions.slice(0,3).join(', ')}</small></div><div><span class="badge success">${r.status}</span><small>${r.from} → ${r.to}</small></div><div class="row-actions"><button data-action="view">View</button><button data-action="deactivate">Deactivate</button></div></div>`).join('')}</div>`;
}
function wireAssignments(){
  const validate=()=>FleetLayout.toast('Validation passed: client exists, plant exists, no duplicate role conflict.');
  document.getElementById('validateAssignment')?.addEventListener('click', validate);
  document.getElementById('saveAssignment')?.addEventListener('click',()=>{
    const rows=assignmentRows();
    const item={id:'ASN-'+String(Math.floor(100000+Math.random()*899999)), client:assignClient.value, plant:assignPlant.value, role:assignRole.value, access:assignAccess.value, status:'Active', from:assignFrom.value||'2026-06-01', to:assignTo.value||'No end date', primary:assignPrimary.checked?'Yes':'No', responsibilities:[...document.querySelectorAll('.resp:checked')].map(x=>x.value), permissions:[...document.querySelectorAll('.perm:checked')].map(x=>x.value)};
    rows.unshift(item); saveAssignments(rows); document.getElementById('assignmentTable').innerHTML=assignmentTable(rows); FleetLayout.toast('Client–Plant ownership saved');
  });
  document.getElementById('resetAssignment')?.addEventListener('click',()=>FleetLayout.toast('Assignment form reset in demo'));
  document.getElementById('assignmentSearch')?.addEventListener('input', e=>{
    const q=e.target.value.toLowerCase();
    const rows=assignmentRows().filter(r=>`${r.client || r.tenant} ${r.plant} ${r.role} ${r.access}`.toLowerCase().includes(q));
    document.getElementById('assignmentTable').innerHTML=assignmentTable(rows);
  });
  document.getElementById('assignmentTable')?.addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.action==='deactivate'){ b.closest('.data-row').querySelector('.badge').textContent='Inactive'; b.closest('.data-row').querySelector('.badge').className='badge warning'; FleetLayout.toast('Assignment deactivated in demo'); }
    else FleetLayout.toast('Assignment detail drawer will be expanded later');
  });
}
