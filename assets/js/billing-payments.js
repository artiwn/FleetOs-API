
function render(){
  const k = V51.kpis([
    {label:'Monthly Revenue', value:'€1.24M', note:'Tariff + service + subscription'},
    {label:'Open Invoices', value:'38', note:'€284k outstanding'},
    {label:'Payment Success', value:'96.8%', note:'Provider settlement health'},
    {label:'Disputes', value:'4', note:'Linked to work orders'}
  ]);
  const rows = V51.invoices.map(i=>`<button class="data-row billing-row" data-id="${i.id}"><strong>${i.title}<small>${i.id} · ${i.tenant}</small></strong><span>${i.period}</span><span>${i.amount}</span><span>${i.source}</span><span>${i.due}</span><span class="badge ${V51.tone(i.status)}">${i.status}</span></button>`).join('');
  return `${V51.hero('Business / Commercial Operations','Billing & Payments','Commercial workspace for invoices, payments, settlements, tariff-linked charges and reconciliation.','v5.2 billing workflow')}${k}
  <section class="split-workspace">
    <div class="panel"><div class="panel-head"><div><h2>Invoice & Settlement Queue</h2><p>Invoices are linked to energy accounting, tariff profiles, contracts, work orders and disputes.</p></div><button class="primary-action" onclick="FleetLayout.toast('Invoice draft created')">Create Invoice</button></div>
      <div class="data-table"><div class="data-head billing-head"><span>Invoice</span><span>Period</span><span>Amount</span><span>Source</span><span>Due</span><span>Status</span></div>${rows}</div>
    </div>
    <aside class="panel"><div class="panel-head"><div><h2>Payment Settings</h2><p>Provider readiness and reconciliation summary.</p></div></div>
      <div class="info-stack">
        <div class="info-card"><span>Providers</span><strong>Stripe · Bank transfer · Local gateway</strong></div>
        <div class="info-card"><span>Methods</span><strong>Card · Invoice · Settlement account</strong></div>
        <div class="info-card"><span>Reconciliation</span><strong>23 matched · 2 require review</strong></div>
        <div class="info-card"><span>Accounting export</span><strong>ERP batch ready</strong></div>
      </div>
    </aside>
  </section>
  <section class="panel"><div class="panel-head"><div><h2>Commercial Data Chain</h2><p>Energy accounting and operational service evidence feed the commercial layer.</p></div></div>
    <div class="lineage-flow"><div><span>01</span><strong>Metering</strong><small>Confirmed kWh / MWh records</small></div><div><span>02</span><strong>Tariff</strong><small>Profile, plan, SLA</small></div><div><span>03</span><strong>Invoice</strong><small>Charges and settlement refs</small></div><div><span>04</span><strong>Payment</strong><small>Provider status</small></div><div><span>05</span><strong>Reconcile</strong><small>ERP and audit export</small></div></div>
  </section>`;
}
FleetLayout.mount(render());
document.querySelector('.main-content').addEventListener('click',e=>{const b=e.target.closest('[data-id]'); if(!b)return; const item=V51.invoices.find(x=>x.id===b.dataset.id); V51.drawer('Invoice Detail', item, '<div class="drawer-action-grid"><button>Record Payment</button><button>Open Dispute</button><button>Export PDF</button><button>Reconcile</button></div>');});
