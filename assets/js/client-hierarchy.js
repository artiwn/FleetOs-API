const FleetClientModel = (() => {
  const clients = [
    {
      id: 'CL-00041', code: 'CLI-ARPI', name: 'Arpi Solar Group', type: 'Legal Entity', legalForm: 'LLC', registrationNo: 'AM-REG-204419', taxId: 'TIN-00421190', country: 'Armenia', city: 'Yerevan', address: 'Baghramyan Ave 12, Yerevan', status: 'Active', verification: 'Verified', account: 'Mariam Sargsyan', primaryContact: 'Aram Petrosyan', contactEmail: 'aram.petrosyan@arpi.example', contactPhone: '+374 10 555 201', tenant: 'Tenant Alpha Energy', plants: ['PL-ARM-001', 'PL-ARM-002', 'PL-ARM-003'], users: 42, documents: 18, billing: 'Enterprise · Net 30', supportTier: 'Premium SLA', accessScope: 'All assigned plants · Read-only owner portal', exportPolicy: 'Reports export allowed after tenant approval', assignmentRole: 'Owner', onboarding: 'Completed'
    },
    {
      id: 'CL-00042', code: 'CLI-VALLEY', name: 'Valley Solar Holdings', type: 'Legal Entity', legalForm: 'Corporation', registrationNo: 'US-CA-778401', taxId: 'EIN-88-2041941', country: 'United States', city: 'San Diego', address: '750 Harbor Drive, San Diego, CA', status: 'Active', verification: 'Verified', account: 'Daniel Weber', primaryContact: 'Olivia Chen', contactEmail: 'ops@valleysolar.example', contactPhone: '+1 619 555 0148', tenant: 'Tenant North Operations', plants: ['PL-US-011', 'PL-US-012'], users: 38, documents: 11, billing: 'Professional · Net 15', supportTier: 'Standard SLA', accessScope: 'California portfolio · Finance + Reports', exportPolicy: 'Self-service monthly reports', assignmentRole: 'Owner / Investor', onboarding: 'Completed'
    },
    {
      id: 'CL-00043', code: 'CLI-GAMMA', name: 'Gamma Grid Holdings', type: 'Legal Entity', legalForm: 'Holding Company', registrationNo: 'US-TX-120984', taxId: 'EIN-74-9102231', country: 'United States', city: 'Austin', address: '210 Battery Road, Austin, TX', status: 'Review', verification: 'KYC Review', account: 'Laura Garcia', primaryContact: 'Michael Stone', contactEmail: 'm.stone@gammagrid.example', contactPhone: '+1 512 555 0192', tenant: 'GridOps Partner', plants: ['PL-US-021'], users: 29, documents: 9, billing: 'Custom · Manual Review', supportTier: 'Custom SLA', accessScope: 'Storage hub only · Viewer mode', exportPolicy: 'Manual approval required', assignmentRole: 'Investor Client', onboarding: 'Commercial review'
    },
    {
      id: 'CL-00044', code: 'CLI-ANNA', name: 'Anna Hakobyan', type: 'Individual', legalForm: 'Private Person', registrationNo: 'PSP-AM-448219', taxId: 'Personal ID 0109840123', country: 'Armenia', city: 'Gyumri', address: 'Shirak Region, Gyumri', status: 'Pending', verification: 'Identity Pending', account: 'Mariam Sargsyan', primaryContact: 'Anna Hakobyan', contactEmail: 'anna.hakobyan@example.com', contactPhone: '+374 91 555 771', tenant: 'Tenant Alpha Energy', plants: [], users: 1, documents: 4, billing: 'Owner Portal · Prepaid', supportTier: 'Basic SLA', accessScope: 'No active plant assigned yet', exportPolicy: 'Disabled until verification', assignmentRole: 'Future Owner', onboarding: 'Identity verification'
    }
  ];

  try {
    const savedClients = JSON.parse(localStorage.getItem('fleetos_custom_clients') || '[]');
    savedClients.forEach(client => {
      if (client && client.id && !clients.some(x => x.id === client.id)) clients.push(client);
    });
  } catch (e) {
    console.warn('Unable to restore custom clients', e);
  }

  const plants = [
    {
      id: 'PL-ARM-001', code: 'ARM-SOL-001', externalId: 'HUA-PLANT-991', name: 'Arpi Plant 01', clientId: 'CL-00041', portfolio: 'Armenia Utility Portfolio', status: 'Active', type: 'Utility Scale', country: 'Armenia', region: 'Kotayk', city: 'Abovyan', address: 'North field, Sector A', timezone: 'Asia/Yerevan', capacityDc: '5.40 MWp', capacityAc: '4.80 MW', gridCapacity: '5.0 MW', commissioning: '2024-09-18', owner: 'Arpi Solar Group', operator: 'Tenant Alpha Energy', om: 'Unisys Energy O&M', powerNow: '3.82 MW', energyToday: '24.6 MWh', alerts: 2, health: 'Warning', panels: 9820, inverters: 18, strings: 216, transformers: 2, meters: 4, battery: 'No', devices: ['INV-ARM-001','INV-ARM-002','INV-ARM-003','LOG-ARM-001','MTR-ARM-001','WX-ARM-001','TR-ARM-001','SW-ARM-001']
    },
    {
      id: 'PL-ARM-002', code: 'ARM-SOL-002', externalId: 'HUA-PLANT-992', name: 'Arpi Plant 02', clientId: 'CL-00041', portfolio: 'Armenia Utility Portfolio', status: 'Active', type: 'Commercial', country: 'Armenia', region: 'Armavir', city: 'Vagharshapat', address: 'Industrial park, Block 7', timezone: 'Asia/Yerevan', capacityDc: '2.10 MWp', capacityAc: '1.95 MW', gridCapacity: '2.0 MW', commissioning: '2025-03-02', owner: 'Arpi Solar Group', operator: 'Tenant Alpha Energy', om: 'Unisys Energy O&M', powerNow: '1.36 MW', energyToday: '9.1 MWh', alerts: 0, health: 'Normal', panels: 3860, inverters: 8, strings: 92, transformers: 1, meters: 2, battery: 'Yes', devices: ['INV-ARM-021','LOG-ARM-021','BESS-ARM-001','MTR-ARM-021','WX-ARM-021','TR-ARM-021','SW-ARM-021']
    },
    {
      id: 'PL-ARM-003', code: 'ARM-BESS-003', externalId: 'SUN-PLANT-410', name: 'Arpi Hybrid Storage Plant', clientId: 'CL-00041', portfolio: 'Hybrid Storage Portfolio', status: 'Maintenance', type: 'Industrial', country: 'Armenia', region: 'Yerevan', city: 'Yerevan', address: 'Energy storage yard 3', timezone: 'Asia/Yerevan', capacityDc: '1.60 MWp', capacityAc: '1.40 MW', gridCapacity: '1.5 MW', commissioning: '2025-11-22', owner: 'Arpi Solar Group', operator: 'Tenant Alpha Energy', om: 'BESS Service Team', powerNow: '0.72 MW', energyToday: '4.8 MWh', alerts: 4, health: 'Fault', panels: 2880, inverters: 5, strings: 54, transformers: 1, meters: 3, battery: 'Yes', devices: ['INV-ARM-031','LOG-ARM-031','BESS-ARM-031','PCS-ARM-031','MTR-ARM-031','TR-ARM-031','SW-ARM-031']
    },
    {
      id: 'PL-US-011', code: 'CA-SOL-011', externalId: 'SE-FAC-011', name: 'North Valley Solar 11', clientId: 'CL-00042', portfolio: 'California O&M Portfolio', status: 'Active', type: 'Utility Scale', country: 'United States', region: 'California', city: 'Fresno', address: 'Valley road 114', timezone: 'America/Los_Angeles', capacityDc: '8.20 MWp', capacityAc: '7.60 MW', gridCapacity: '8.0 MW', commissioning: '2023-06-17', owner: 'Valley Solar Holdings', operator: 'Tenant North Operations', om: 'Tenant North Operations', powerNow: '6.41 MW', energyToday: '41.2 MWh', alerts: 1, health: 'Normal', panels: 14800, inverters: 22, strings: 310, transformers: 3, meters: 5, battery: 'No', devices: ['INV-US-011','INV-US-012','LOG-US-011','MTR-US-011','WX-US-011','TR-US-011','SW-US-011']
    },
    {
      id: 'PL-US-012', code: 'CA-SOL-012', externalId: 'SE-FAC-012', name: 'North Valley Solar 12', clientId: 'CL-00042', portfolio: 'California O&M Portfolio', status: 'Active', type: 'Commercial', country: 'United States', region: 'California', city: 'Bakersfield', address: 'Grid extension zone B', timezone: 'America/Los_Angeles', capacityDc: '3.70 MWp', capacityAc: '3.20 MW', gridCapacity: '3.5 MW', commissioning: '2024-01-30', owner: 'Valley Solar Holdings', operator: 'Tenant North Operations', om: 'Tenant North Operations', powerNow: '2.45 MW', energyToday: '16.7 MWh', alerts: 0, health: 'Normal', panels: 6840, inverters: 12, strings: 136, transformers: 1, meters: 2, battery: 'No', devices: ['INV-US-021','LOG-US-021','MTR-US-021','WX-US-021','TR-US-021','SW-US-021']
    },
    {
      id: 'PL-US-021', code: 'TX-BESS-021', externalId: 'TES-BESS-021', name: 'Gamma Storage & Solar Hub', clientId: 'CL-00043', portfolio: 'Texas Investor Portfolio', status: 'Review', type: 'Industrial', country: 'United States', region: 'Texas', city: 'Austin', address: 'Battery road 210', timezone: 'America/Chicago', capacityDc: '4.30 MWp', capacityAc: '4.00 MW', gridCapacity: '4.2 MW', commissioning: '2025-08-11', owner: 'Gamma Grid Holdings', operator: 'GridOps Partner', om: 'External O&M', powerNow: '2.20 MW', energyToday: '12.4 MWh', alerts: 5, health: 'Warning', panels: 7900, inverters: 14, strings: 168, transformers: 2, meters: 4, battery: 'Yes', devices: ['INV-US-101','LOG-US-101','BESS-US-101','PCS-US-101','MTR-US-101','WX-US-101','TR-US-101','SW-US-101']
    }
  ];

  const devices = [
    { id:'INV-ARM-001', plantId:'PL-ARM-001', type:'Inverter', name:'Inverter 01', vendor:'Huawei', model:'SUN2000-215KTL', serial:'HUA-INV-0001', capacity:'215 kW', firmware:'V500R023', status:'Active', location:'Area A', lastSeen:'2 min ago', children:'MPPT 1–12 · Strings 1–12' },
    { id:'INV-ARM-002', plantId:'PL-ARM-001', type:'Inverter', name:'Inverter 02', vendor:'Huawei', model:'SUN2000-215KTL', serial:'HUA-INV-0002', capacity:'215 kW', firmware:'V500R023', status:'Active', location:'Area A', lastSeen:'2 min ago', children:'MPPT 1–12 · Strings 13–24' },
    { id:'INV-ARM-003', plantId:'PL-ARM-001', type:'Inverter', name:'Inverter 03', vendor:'Huawei', model:'SUN2000-215KTL', serial:'HUA-INV-0003', capacity:'215 kW', firmware:'V500R021', status:'Warning', location:'Area B', lastSeen:'18 min ago', children:'MPPT 1–12 · Strings 25–36' },
    { id:'MTR-ARM-001', plantId:'PL-ARM-001', type:'Meter', name:'Main Export Meter', vendor:'Janitza', model:'UMG 604', serial:'MTR-9120', capacity:'Bidirectional', firmware:'2.4.1', status:'Active', location:'Grid connection', lastSeen:'1 min ago', children:'Import / Export point' },
    { id:'WX-ARM-001', plantId:'PL-ARM-001', type:'Weather Station', name:'Weather Station A', vendor:'Kipp & Zonen', model:'RT1', serial:'WX-1103', capacity:'Irradiance / Temp', firmware:'1.9', status:'Active', location:'North roof', lastSeen:'3 min ago', children:'Irradiance · Ambient temp · Module temp' },
    { id:'LOG-ARM-001', plantId:'PL-ARM-001', type:'Logger', name:'Gateway Logger A', vendor:'Huawei', model:'SmartLogger3000A', serial:'LOG-ARM-001', capacity:'64 linked devices', firmware:'V300R023', status:'Active', location:'Control room', lastSeen:'1 min ago', children:'Inverters 01–18 · Meter · Weather plant' },
    { id:'TR-ARM-001', plantId:'PL-ARM-001', type:'Grid Device', name:'Transformer 01', vendor:'ABB', model:'2.5 MVA', serial:'TR-2109', capacity:'2.5 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-ARM-001', plantId:'PL-ARM-001', type:'Switchgear', name:'MV Switchgear 01', vendor:'Schneider', model:'SM6-24', serial:'SW-ARM-001', capacity:'24 kV · 1250 A', firmware:'Relay 7.2', status:'Active', location:'Subplant', lastSeen:'2 min ago', children:'Breaker · Feeders · Protection relay' },
    { id:'INV-ARM-021', plantId:'PL-ARM-002', type:'Inverter', name:'Inverter 21', vendor:'Huawei', model:'SUN2000-125KTL', serial:'HUA-INV-0021', capacity:'125 kW', firmware:'V500R023', status:'Active', location:'Area A', lastSeen:'2 min ago', children:'MPPT 1–10 · Strings 1–10' },
    { id:'BESS-ARM-001', plantId:'PL-ARM-002', type:'Battery', name:'Battery Container 01', vendor:'CATL', model:'LFP Rack 500', serial:'BESS-ARM-001', capacity:'500 kWh', firmware:'BMS 3.2', status:'Active', location:'Battery yard', lastSeen:'1 min ago', children:'Rack 1–4 · BMS · HVAC' },
    { id:'MTR-ARM-021', plantId:'PL-ARM-002', type:'Meter', name:'Bidirectional Meter 21', vendor:'Schneider', model:'PM8000', serial:'MTR-ARM-021', capacity:'Bidirectional', firmware:'4.1', status:'Active', location:'Grid cabinet', lastSeen:'1 min ago', children:'Import / Export point' },
    { id:'WX-ARM-021', plantId:'PL-ARM-002', type:'Weather Station', name:'Weather Station 21', vendor:'SMA', model:'Sunny SensorBox', serial:'WX-ARM-021', capacity:'Irradiance / Temp / Wind', firmware:'1.2', status:'Active', location:'Plant mast', lastSeen:'4 min ago', children:'Weather sensors' },
    { id:'LOG-ARM-021', plantId:'PL-ARM-002', type:'Logger', name:'Hybrid Gateway 21', vendor:'SMA', model:'Data Manager M', serial:'LOG-ARM-021', capacity:'32 linked devices', firmware:'2.13', status:'Active', location:'Grid cabinet', lastSeen:'2 min ago', children:'Inverter 21 · BESS · Meter · Weather' },
    { id:'TR-ARM-021', plantId:'PL-ARM-002', type:'Grid Device', name:'Transformer 21', vendor:'Siemens', model:'1.6 MVA', serial:'TR-ARM-021', capacity:'1.6 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-ARM-021', plantId:'PL-ARM-002', type:'Switchgear', name:'LV Switchgear 21', vendor:'Siemens', model:'SIVACON S8', serial:'SW-ARM-021', capacity:'400 V · 1600 A', firmware:'Relay 6.8', status:'Active', location:'Grid cabinet', lastSeen:'2 min ago', children:'Breakers · Feeders · Meter link' },
    { id:'INV-ARM-031', plantId:'PL-ARM-003', type:'Inverter', name:'Hybrid Inverter 31', vendor:'Sungrow', model:'SG125CX', serial:'SG-INV-031', capacity:'125 kW', firmware:'2.18', status:'Warning', location:'Hybrid field', lastSeen:'22 min ago', children:'MPPT · Strings · PCS link' },
    { id:'BESS-ARM-031', plantId:'PL-ARM-003', type:'Battery', name:'BESS Container 31', vendor:'BYD', model:'LFP 1MWh', serial:'BESS-031', capacity:'1 MWh', firmware:'BMS 4.5', status:'Fault', location:'Storage yard', lastSeen:'35 min ago', children:'Rack 1–6 · Modules · Cells' },
    { id:'PCS-ARM-031', plantId:'PL-ARM-003', type:'PCS', name:'Power Conversion System 31', vendor:'Sungrow', model:'PCS500', serial:'PCS-031', capacity:'500 kW', firmware:'1.8', status:'Warning', location:'Storage yard', lastSeen:'20 min ago', children:'DC bus · AC output' },
    { id:'LOG-ARM-031', plantId:'PL-ARM-003', type:'Logger', name:'Storage Gateway 31', vendor:'Sungrow', model:'COM100E', serial:'LOG-ARM-031', capacity:'48 linked devices', firmware:'3.4', status:'Warning', location:'Storage control panel', lastSeen:'16 min ago', children:'Hybrid inverter · BESS · PCS · Meter' },
    { id:'INV-US-011', plantId:'PL-US-011', type:'Inverter', name:'Inverter CA-11', vendor:'SolarEdge', model:'SE100K', serial:'SE-INV-011', capacity:'100 kW', firmware:'4.17', status:'Active', location:'Block A', lastSeen:'1 min ago', children:'Strings 1–12' },
    { id:'MTR-US-011', plantId:'PL-US-011', type:'Meter', name:'Main Meter CA-11', vendor:'Itron', model:'ION8650', serial:'MTR-US-011', capacity:'Export', firmware:'3.9', status:'Active', location:'POI', lastSeen:'1 min ago', children:'Export point' },
    { id:'WX-US-011', plantId:'PL-US-011', type:'Weather Station', name:'Weather CA-11', vendor:'Campbell', model:'CR1000X', serial:'WX-US-011', capacity:'Weather package', firmware:'2.1', status:'Active', location:'Mast A', lastSeen:'2 min ago', children:'Irradiance · Wind · Humidity' },
    { id:'LOG-US-011', plantId:'PL-US-011', type:'Logger', name:'Gateway CA-11', vendor:'SolarEdge', model:'Gateway Pro', serial:'LOG-US-011', capacity:'96 linked devices', firmware:'4.22', status:'Active', location:'Network cabinet', lastSeen:'1 min ago', children:'Inverter fleet · Meters · Weather plant' },
    { id:'LOG-US-021', plantId:'PL-US-012', type:'Logger', name:'Gateway CA-12', vendor:'SolarEdge', model:'Gateway Pro', serial:'LOG-US-021', capacity:'48 linked devices', firmware:'4.22', status:'Active', location:'Control cabinet', lastSeen:'2 min ago', children:'Inverter 21 · Meter · Weather plant' },
    { id:'INV-US-101', plantId:'PL-US-021', type:'Inverter', name:'Inverter TX-101', vendor:'Tesla', model:'Solar Inverter', serial:'TES-INV-101', capacity:'150 kW', firmware:'5.0', status:'Active', location:'Solar block', lastSeen:'3 min ago', children:'MPPT · Strings' },
    { id:'BESS-US-101', plantId:'PL-US-021', type:'Battery', name:'Battery System TX-101', vendor:'Tesla', model:'Megapack', serial:'TES-BESS-101', capacity:'2 MWh', firmware:'BMS 7.1', status:'Warning', location:'Battery pad', lastSeen:'14 min ago', children:'Racks · BMS · Thermal system' },
    { id:'MTR-US-101', plantId:'PL-US-021', type:'Meter', name:'Settlement Meter TX-101', vendor:'Itron', model:'ION8650', serial:'MTR-US-101', capacity:'Bidirectional', firmware:'3.9', status:'Active', location:'POI', lastSeen:'1 min ago', children:'Settlement point' },
    { id:'LOG-US-101', plantId:'PL-US-021', type:'Logger', name:'Megapack Plant Gateway', vendor:'Tesla', model:'PowerHub Gateway', serial:'LOG-US-101', capacity:'120 linked devices', firmware:'5.7', status:'Warning', location:'Plant network room', lastSeen:'12 min ago', children:'Inverters · BESS · PCS · Settlement meter' },
    { id:'MTR-ARM-031', plantId:'PL-ARM-003', type:'Meter', name:'Storage Settlement Meter 31', vendor:'Schneider', model:'PM8000', serial:'MTR-ARM-031', capacity:'Bidirectional', firmware:'4.1', status:'Warning', location:'Storage POI', lastSeen:'18 min ago', children:'Import / Export point' },
    { id:'TR-ARM-031', plantId:'PL-ARM-003', type:'Grid Device', name:'Transformer 31', vendor:'Siemens', model:'1.6 MVA', serial:'TR-ARM-031', capacity:'1.6 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-ARM-031', plantId:'PL-ARM-003', type:'Switchgear', name:'Hybrid Switchgear 31', vendor:'ABB', model:'UniGear ZS1', serial:'SW-ARM-031', capacity:'12 kV · 1250 A', firmware:'Relay 8.1', status:'Warning', location:'Subplant', lastSeen:'18 min ago', children:'BESS feeder · PV feeder · Grid breaker' },
    { id:'INV-US-012', plantId:'PL-US-011', type:'Inverter', name:'Inverter CA-12', vendor:'SolarEdge', model:'SE100K', serial:'SE-INV-012', capacity:'100 kW', firmware:'4.17', status:'Active', location:'Block B', lastSeen:'2 min ago', children:'Strings 13–24' },
    { id:'TR-US-011', plantId:'PL-US-011', type:'Grid Device', name:'Transformer CA-11', vendor:'ABB', model:'4 MVA', serial:'TR-US-011', capacity:'4 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-US-011', plantId:'PL-US-011', type:'Switchgear', name:'MV Switchgear CA-11', vendor:'Eaton', model:'XGIS', serial:'SW-US-011', capacity:'15 kV · 1200 A', firmware:'Relay 5.9', status:'Active', location:'Subplant', lastSeen:'3 min ago', children:'Breakers · Feeders · Protection relay' },
    { id:'INV-US-021', plantId:'PL-US-012', type:'Inverter', name:'Inverter CA-21', vendor:'SolarEdge', model:'SE82.8K', serial:'SE-INV-021', capacity:'82.8 kW', firmware:'4.17', status:'Active', location:'Block A', lastSeen:'2 min ago', children:'Strings 1–12' },
    { id:'MTR-US-021', plantId:'PL-US-012', type:'Meter', name:'Main Meter CA-12', vendor:'Itron', model:'ION8650', serial:'MTR-US-021', capacity:'Export', firmware:'3.9', status:'Active', location:'POI', lastSeen:'1 min ago', children:'Export point' },
    { id:'WX-US-021', plantId:'PL-US-012', type:'Weather Station', name:'Weather CA-12', vendor:'Campbell', model:'CR1000X', serial:'WX-US-021', capacity:'Weather package', firmware:'2.1', status:'Active', location:'Mast A', lastSeen:'2 min ago', children:'Irradiance · Wind · Humidity' },
    { id:'TR-US-021', plantId:'PL-US-012', type:'Grid Device', name:'Transformer CA-12', vendor:'ABB', model:'2 MVA', serial:'TR-US-021', capacity:'2 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-US-021', plantId:'PL-US-012', type:'Switchgear', name:'Switchgear CA-12', vendor:'Schneider', model:'Premset', serial:'SW-US-021', capacity:'12 kV · 1000 A', firmware:'Relay 6.1', status:'Active', location:'Subplant', lastSeen:'3 min ago', children:'Breakers · Grid feeder' },
    { id:'PCS-US-101', plantId:'PL-US-021', type:'PCS', name:'Power Conversion System TX-101', vendor:'Tesla', model:'Megapack PCS', serial:'PCS-US-101', capacity:'1 MW', firmware:'5.7', status:'Warning', location:'Battery pad', lastSeen:'12 min ago', children:'DC bus · AC output' },
    { id:'WX-US-101', plantId:'PL-US-021', type:'Weather Station', name:'Weather TX-101', vendor:'Campbell', model:'CR1000X', serial:'WX-US-101', capacity:'Weather package', firmware:'2.1', status:'Active', location:'Mast B', lastSeen:'2 min ago', children:'Irradiance · Wind · Humidity' },
    { id:'TR-US-101', plantId:'PL-US-021', type:'Grid Device', name:'Transformer TX-101', vendor:'ABB', model:'3 MVA', serial:'TR-US-101', capacity:'3 MVA', firmware:'—', status:'Active', location:'Subplant', lastSeen:'5 min ago', children:'Switchgear · Breaker' },
    { id:'SW-US-101', plantId:'PL-US-021', type:'Switchgear', name:'Storage Switchgear TX-101', vendor:'Eaton', model:'Power Xpert UX', serial:'SW-US-101', capacity:'15 kV · 2000 A', firmware:'Relay 7.7', status:'Warning', location:'Subplant', lastSeen:'14 min ago', children:'PCS feeder · PV feeder · Main breaker' }
  ];

  function badge(value) {
    const v = String(value || '').toLowerCase();
    if (v.includes('fault') || v.includes('review') || v.includes('maintenance')) return 'warning';
    if (v.includes('offline') || v.includes('blocked')) return 'danger';
    return 'success';
  }
  function getClient(id) { return clients.find(x => x.id === id) || clients[0]; }
  function getPlant(id) { return plants.find(x => x.id === id) || plants[0]; }
  function plantsForClient(clientId) { return plants.filter(x => x.clientId === clientId); }
  function devicesForPlant(plantId) { return devices.filter(x => x.plantId === plantId); }
  function countsForClient(clientId) {
    const ps = plantsForClient(clientId);
    const ds = ps.flatMap(p => devicesForPlant(p.id));
    return {
      plants: ps.length,
      devices: ds.length,
      capacity: ps.reduce((sum, p) => sum + parseFloat(p.capacityDc), 0).toFixed(1) + ' MWp',
      alerts: ps.reduce((sum, p) => sum + Number(p.alerts || 0), 0)
    };
  }
  function selectClient(id) { localStorage.setItem('fleetos_selected_client', id); }
  function selectPlant(id) { localStorage.setItem('fleetos_selected_plant', id); }
  function selectedClient() { return getClient(localStorage.getItem('fleetos_selected_client') || clients[0].id); }
  function selectedPlant() { return getPlant(localStorage.getItem('fleetos_selected_plant') || plantsForClient(selectedClient().id)[0]?.id || plants[0].id); }

  return { clients, plants, devices, badge, getClient, getPlant, plantsForClient, devicesForPlant, countsForClient, selectClient, selectPlant, selectedClient, selectedPlant };
})();

(function hydrateCustomPlantBuilderRecords(){
  try {
    const customPlants = JSON.parse(localStorage.getItem('fleetos_custom_plants') || '[]');
    const customDevices = JSON.parse(localStorage.getItem('fleetos_custom_devices') || '[]');
    customPlants.forEach(p => {
      if (p && p.id && !FleetClientModel.plants.some(x => x.id === p.id)) FleetClientModel.plants.push(p);
    });
    customDevices.forEach(d => {
      if (d && d.id && !FleetClientModel.devices.some(x => x.id === d.id)) FleetClientModel.devices.push(d);
    });
  } catch (err) {
    console.warn('Unable to hydrate custom Plant Builder records', err);
  }
})();

const FleetDeviceCatalog = (() => {
  const catalog = [
    { kind:'Inverter', vendor:'Solis', model:'S6-GC100K', rating:'100 kW', protocol:'Modbus TCP / RS485', shared:'Vendor, model, rated power, phase count, MPPT count, supported protocol', individual:'Device name, serial number, firmware, install date, location, string assignment' },
    { kind:'Inverter', vendor:'Huawei', model:'SUN2000-215KTL', rating:'215 kW', protocol:'Modbus TCP / FusionSolar', shared:'Vendor, model, rated power, MPPT count, DC input limits, protocol', individual:'Device name, serial number, firmware, commissioning date, physical area' },
    { kind:'Meter', vendor:'Huawei', model:'DTSU666-H', rating:'Bidirectional', protocol:'RS485 / Modbus', shared:'Vendor, model, meter type, accuracy class, supported protocol', individual:'Serial number, meter address, CT ratio, install point, install date' },
    { kind:'Meter', vendor:'Schneider', model:'PM8000', rating:'Bidirectional', protocol:'Modbus TCP', shared:'Vendor, model, accuracy class, voltage/current range, protocol', individual:'Serial number, IP/address, CT/PT ratio, grid point, tariff role' },
    { kind:'Logger', vendor:'Solis', model:'S2-WL-ST', rating:'Wi-Fi / LAN', protocol:'SolisCloud / Modbus', shared:'Vendor, model, network type, supported inverter families', individual:'Serial number, MAC address, SIM/IMEI if cellular, plant network position' },
    { kind:'Logger', vendor:'Meteocontrol', model:'blue\'Log X', rating:'Multi-vendor gateway', protocol:'Modbus / Sunspec / API', shared:'Vendor, model, supported protocol set, max linked devices', individual:'Serial number, MAC/IP, device address map, cabinet location' },
    { kind:'BESS', vendor:'BYD', model:'Battery-Box Premium', rating:'LFP storage', protocol:'CAN / RS485 BMS', shared:'Vendor, model, chemistry, nominal capacity, voltage range, BMS protocol', individual:'Serial number, rack/container ID, install date, warranty, linked PCS/BMS address' },
    { kind:'BESS', vendor:'CATL', model:'EnerOne Rack', rating:'372 kWh rack', protocol:'BMS / Modbus', shared:'Vendor, model, chemistry, capacity, thermal specs, BMS protocol', individual:'Rack serial, module serials, container position, commissioning date' },
    { kind:'PCS', vendor:'Sungrow', model:'PCS500', rating:'500 kW', protocol:'Modbus TCP', shared:'Vendor, model, AC/DC limits, conversion capacity, protocol', individual:'Serial number, firmware, linked BESS, grid feeder, install date' },
    { kind:'Weather Station', vendor:'Kipp & Zonen', model:'RT1', rating:'Irradiance / temp', protocol:'Modbus / analog', shared:'Vendor, model, sensor types, measurement range', individual:'Serial number, mast location, calibration date, sensor channel map' },
    { kind:'Transformer', vendor:'ABB', model:'2.5 MVA', rating:'2.5 MVA', protocol:'Protection relay optional', shared:'Vendor, model, rated power, voltage levels, cooling type', individual:'Serial number, subplant location, protection relay ID, oil test date' },
    { kind:'Switchgear', vendor:'Schneider', model:'SM6-24', rating:'24 kV · 1250 A', protocol:'Relay / SCADA', shared:'Vendor, model, rated voltage/current, breaker type', individual:'Serial number, feeder names, relay address, breaker IDs, install date' }
  ];
  const compatibility = [
    { from:'Solis S6-GC100K', to:'Huawei DTSU666-H / Schneider PM8000', type:'Meter', status:'Compatible if Modbus address, CT ratio and firmware support are configured', rule:'Inverter ↔ meter link is logical/electrical, not ownership by vendor.' },
    { from:'Solis S6-GC100K', to:'BYD Battery-Box / CATL EnerOne', type:'BESS', status:'Conditional: requires supported BMS protocol and approved battery list', rule:'Battery compatibility is protocol + firmware + voltage window.' },
    { from:'Any inverter', to:'Meteocontrol blue\'Log X', type:'Logger', status:'Compatible through Modbus/Sunspec or vendor adapter', rule:'Logger can be multi-vendor and becomes a plant-level gateway.' },
    { from:'BESS', to:'Sungrow PCS500', type:'PCS', status:'Compatible when DC bus, BMS and EMS control profile match', rule:'PCS is linked to BESS, not to PV strings.' },
    { from:'Weather Station', to:'Logger / SCADA', type:'Weather', status:'Usually connected to logger/SCADA, not directly to inverter', rule:'Weather data is plant context for analytics.' },
    { from:'Inverter', to:'MPPT / String', type:'Internal topology', status:'Built-in hierarchy, not a third-party device selection', rule:'MPPT belongs to inverter; strings connect to inverter DC inputs.' },
    { from:'Transformer', to:'Switchgear / Meter', type:'Grid infrastructure', status:'Plant-level electrical relation', rule:'These are siblings in plant topology, linked by feeder / POI.' }
  ];
  return { catalog, compatibility };
})();

function clientKpis(client) {
  const c = FleetClientModel.countsForClient(client.id);
  return `<section class="kpi-grid client-kpi-grid">
    <article class="kpi-card cyan"><span class="kpi-label">Client Plants</span><div class="kpi-value">${c.plants}</div><small class="kpi-delta">Client → Plant structure</small></article>
    <article class="kpi-card green"><span class="kpi-label">Total Capacity</span><div class="kpi-value">${c.capacity}</div><small class="kpi-delta">DC installed capacity</small></article>
    <article class="kpi-card blue"><span class="kpi-label">Device Records</span><div class="kpi-value">${c.devices}</div><small class="kpi-delta">Inverters, meters, BESS, weather</small></article>
    <article class="kpi-card yellow"><span class="kpi-label">Open Alerts</span><div class="kpi-value">${c.alerts}</div><small class="kpi-delta">Across client plants</small></article>
  </section>`;
}

function renderClientsPage() {
  const rows = FleetClientModel.clients;
  const legalCount = rows.filter(c => c.type === 'Legal Entity').length;
  const individualCount = rows.filter(c => c.type === 'Individual').length;
  const activeCount = rows.filter(c => c.status === 'Active').length;
  FleetLayout.mount(`
    <section class="page-hero">
      <div><p class="eyebrow">Global Admin · Client Registry</p><h1>Clients</h1><p class="muted">Canonical client registry for legal entities and individuals, with plant assignment, portal access and document scope.</p></div>
      <button class="create-action" id="openClientCreate" type="button"><span class="pulse"></span><div><strong>+ Add Client</strong><small>Tenant link · portal profile</small></div></button>
    </section>
    <section class="context-bar glass-card">
      <button class="ctx-item" type="button"><span>Total Clients</span><strong>${rows.length}</strong></button>
      <button class="ctx-item" type="button"><span>Legal Entities</span><strong>${legalCount}</strong></button>
      <button class="ctx-item" type="button"><span>Individuals</span><strong>${individualCount}</strong></button>
      <button class="ctx-item" type="button"><span>Assigned Plants</span><strong>${FleetClientModel.plants.length}</strong></button>
    </section>
    <section class="panel glass-card">
      <div class="panel-head"><div><h2>Client Registry</h2><p class="muted">Global Admin can create the canonical client record and link it to the managing tenant. Operational plant access is still controlled through assignment scope.</p></div></div>
      <div class="toolbar">
        <input id="clientSearchV28" placeholder="Search client, code, contact, country..." />
        <select id="clientTypeV28"><option value="all">All types</option><option value="Legal Entity">Legal Entity</option><option value="Individual">Individual</option></select>
        <select id="clientStatusV28"><option value="all">All statuses</option><option>Active</option><option>Review</option><option>Pending</option></select>
      </div>
      <div class="data-table client-table-v17 client-registry-table-v28" id="clientRowsV28">
        ${clientRowsMarkup(rows)}
      </div>
    </section>
    ${clientCreateModal()}
  `);
  const render = () => {
    const query = (document.getElementById('clientSearchV28')?.value || '').toLowerCase().trim();
    const type = document.getElementById('clientTypeV28')?.value || 'all';
    const status = document.getElementById('clientStatusV28')?.value || 'all';
    const filtered = rows.filter(c => {
      const haystack = [c.name, c.code, c.id, c.type, c.country, c.city, c.primaryContact, c.contactEmail, c.tenant, c.status].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (type === 'all' || c.type === type) && (status === 'all' || c.status === status);
    });
    const target = document.getElementById('clientRowsV28');
    if (target) target.innerHTML = clientRowsMarkup(filtered);
  };
  document.getElementById('clientSearchV28')?.addEventListener('input', render);
  document.getElementById('clientTypeV28')?.addEventListener('change', render);
  document.getElementById('clientStatusV28')?.addEventListener('change', render);
  document.getElementById('openClientCreate')?.addEventListener('click', openClientCreateModal);
  document.getElementById('clientCreateBackdrop')?.addEventListener('click', e => {
    if (e.target.id === 'clientCreateBackdrop' || e.target.closest('[data-close-client-create]')) closeClientCreateModal();
  });
  document.getElementById('clientCreateForm')?.addEventListener('submit', submitClientCreateForm);
  initClientCreateWizard();
  document.querySelector('.client-table-v17')?.addEventListener('click', e => {
    const row = e.target.closest('.data-row[data-client]');
    if (!row) return;
    FleetClientModel.selectClient(row.dataset.client);
    location.href = 'client-detail.html';
  });
}

function clientCreateModal() {
  const tenants = ['Tenant Alpha Energy', 'Tenant North Operations', 'GridOps Partner', 'Enterprise O&M Tenant'];
  const countries = ['Armenia', 'United States', 'Germany', 'Spain'];
  const regions = ['Yerevan', 'Kotayk', 'Armavir', 'California', 'Texas', 'Bavaria', 'Madrid'];
  const cities = ['Yerevan', 'Gyumri', 'Abovyan', 'Vagharshapat', 'San Diego', 'Austin', 'Munich', 'Madrid'];
  const timezones = ['Asia/Yerevan', 'America/Los_Angeles', 'America/Chicago', 'Europe/Berlin', 'Europe/Madrid'];
  return `<div class="modal client-create-modal wide-modal" id="clientCreateBackdrop" aria-hidden="true">
    <div class="modal-card client-create-card">
      <button class="modal-close" type="button" data-close-client-create>x</button>
      <div class="client-create-head">
        <div><p class="eyebrow">Client Registry · Create Client</p><h2>Add New Client</h2><p class="muted">Create a canonical client profile and link it to the tenant that manages or supervises this client.</p></div>
        <span class="badge warning">Draft</span>
      </div>
      <form id="clientCreateForm" class="client-create-form setup-layout">
        <aside class="setup-rail client-create-rail" aria-label="Create client steps">
          <button class="active" type="button" data-client-create-step="tenant"><b>1</b><span>Tenant Link</span></button>
          <button type="button" data-client-create-step="identity"><b>2</b><span>Identity</span></button>
          <button type="button" data-client-create-step="location"><b>3</b><span>Location & Preferences</span></button>
          <button type="button" data-client-create-step="portal"><b>4</b><span>Contacts & Portal</span></button>
          <button type="button" data-client-create-step="documentation"><b>5</b><span>Documentation</span></button>
          <button type="button" data-client-create-step="banking"><b>6</b><span>Banking Information</span></button>
          <button type="button" data-client-create-step="review"><b>7</b><span>Review</span></button>
        </aside>
        <div class="client-create-content setup-content">
          <section class="form-section-card client-create-step-panel active" data-client-create-panel="tenant">
            <div class="section-title"><div><h3>Tenant Link</h3><p class="muted">Choose which tenant manages or supervises this client record.</p></div></div>
            <div class="client-form-grid two-col">
              <label>Managing Tenant<select name="tenant" required>${tenants.map(t => `<option>${t}</option>`).join('')}</select></label>
              <label>Client Type<select name="type" id="clientCreateType" required><option>Individual</option><option>Legal Entity</option></select></label>
              <label>Account Activation<input name="activation" readonly value="Auto-generated on save" /></label>
              <label>Status<select name="status"><option>Pending</option><option>Review</option><option>Active</option></select></label>
            </div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="identity">
            <div class="section-title"><div><h3>Identity</h3><p class="muted">Personal or legal identity data used for the canonical client profile.</p></div></div>
            <div class="client-form-grid three-col">
              <label>Name<input name="name" required placeholder="Name or legal name" /></label>
              <label>Surname<input name="surname" placeholder="Surname" /></label>
              <label>Last name<input name="lastName" placeholder="Last name" /></label>
              <label>Date of birth<input name="dob" placeholder="dd/mm/yyyy" pattern="\\d{2}/\\d{2}/\\d{4}" /></label>
              <label>User Role<input name="userRole" placeholder="End User / Owner Viewer" /></label>
              <label>Language<select name="language"><option>English</option><option>Armenian</option><option>Russian</option><option>German</option><option>Spanish</option></select></label>
            </div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="location">
            <div class="section-title"><div><h3>Location & Preferences</h3><p class="muted">Library-based values for geography, timezone and end-user preferences.</p></div></div>
            <div class="client-form-grid three-col">
              <label>Country<select name="country" required>${countries.map(x => `<option>${x}</option>`).join('')}</select></label>
              <label>Region<select name="region">${regions.map(x => `<option>${x}</option>`).join('')}</select></label>
              <label>City<select name="city">${cities.map(x => `<option>${x}</option>`).join('')}</select></label>
              <label class="wide-field">Address<input name="address" placeholder="Street, building, apartment" /></label>
              <label>Time Zone<select name="timezone">${timezones.map(x => `<option>${x}</option>`).join('')}</select></label>
              <label>Temperature Format<select name="temperature"><option>°C</option></select></label>
              <label>Currency Unit<select name="currency"><option>AMD</option><option>USD</option><option>EUR</option></select></label>
              <label>Irradiation<select name="irradiation"><option>kWh/m2</option><option>W/m2</option><option>MJ/m2</option></select></label>
            </div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="portal">
            <div class="section-title"><div><h3>Contacts & Portal Account</h3><p class="muted">Client contact details and initial portal credentials.</p></div></div>
            <div class="client-form-grid three-col">
              <label>Phone Number 1<input name="phone1" type="tel" placeholder="+374..." /></label>
              <label>Phone Number 2<input name="phone2" type="tel" placeholder="Optional" /></label>
              <label>E-mail<input name="email" type="email" required placeholder="client@example.com" /></label>
              <label>Username<input name="username" required placeholder="username" /></label>
              <label>Password<input name="password" type="password" required placeholder="Temporary password" /></label>
              <label>Portal Role<input name="portalRole" placeholder="Owner Viewer" /></label>
            </div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="documentation">
            <div class="section-title"><div><h3>Documentation</h3><p class="muted">Upload client identity, state registration and project documents required for the client profile.</p></div></div>
            <div class="client-form-grid two-col">
              <label>Client Passport Number<input name="passportNumber" placeholder="Passport number" /></label>
              <label>State Registration Document Number<input name="stateRegistrationNumber" placeholder="State registration document number" /></label>
              <label>Client Passport<input name="clientPassport" type="file" accept=".pdf,.jpg,.jpeg,.png" data-doc-label="Client Passport" /></label>
              <label>State Registration Document<input name="stateRegistrationDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" data-doc-label="State Registration Document" /></label>
              <label class="wide-field">Project Doc<input name="projectDoc" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" data-doc-label="Project Doc" /></label>
            </div>
            <div class="client-uploaded-docs" id="clientUploadedDocs"><div class="empty-state mini">No documents added yet.</div></div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="banking">
            <div class="section-title"><div><h3>Banking Information</h3><p class="muted">Bank account information used for billing, settlements and client financial records.</p></div><button class="secondary-action" type="button" id="addClientBank">+ Add Bank</button></div>
            <div class="client-bank-list" id="clientBankList">
              <div class="client-bank-card" data-bank-index="0">
                <div class="client-bank-head"><strong>Bank 1</strong><label class="checkbox-label checkbox-inline"><input type="radio" name="primaryBank" value="0" checked><span>Primary bank</span></label></div>
                <div class="client-form-grid four-col">
                  <label>Bank<input name="bankName" placeholder="Bank name" /></label>
                  <label>Bank Code<input name="bankCode" placeholder="Bank code" /></label>
                  <label>Account Number<input name="accountNumber" placeholder="Account number / IBAN" /></label>
                  <label>Account Currency<select name="accountCurrency"><option>AMD</option><option>USD</option><option>EUR</option><option>GBP</option></select></label>
                </div>
                <div class="inline-actions client-bank-actions"><button type="button" class="secondary-action" data-remove-bank>Delete</button></div>
              </div>
            </div>
          </section>
          <section class="form-section-card client-create-step-panel" data-client-create-panel="review">
            <div class="section-title"><div><h3>Review</h3><p class="muted">Check tenant link, identity, portal access, documents and banking data before saving the client profile.</p></div></div>
            <div class="info-grid client-create-review">
              <div><span>Managing Tenant</span><strong data-review-field="tenant">Tenant Alpha Energy</strong><small>Tenant that supervises this client record</small></div>
              <div><span>Client Type</span><strong data-review-field="type">Individual</strong><small>Identity flow selected in step 1</small></div>
              <div><span>Primary Contact</span><strong data-review-field="contact">Not entered</strong><small>Email and phone are checked in portal step</small></div>
              <div><span>Portal Account</span><strong data-review-field="portal">Not configured</strong><small>Username and temporary password</small></div>
              <div><span>Location</span><strong data-review-field="location">Armenia</strong><small>Country, region, city and timezone</small></div>
              <div><span>Documentation</span><strong data-review-field="documents">Not uploaded</strong><small>Client passport, state registration document and project doc</small></div>
              <div><span>Banking</span><strong data-review-field="banking">Not entered</strong><small>Bank, account number and account currency</small></div>
            </div>
          </section>
          <div class="modal-actions client-create-actions"><button class="secondary-btn" type="button" data-close-client-create>Cancel</button><button class="primary-action" type="submit">Create Client</button></div>
        </div>
      </form>
    </div>
  </div>`;
}

function openClientCreateModal() {
  document.getElementById('clientCreateBackdrop')?.classList.add('open');
  setClientCreateStep('tenant');
  syncClientCreateTypeFields();
  updateClientCreateReview();
}

function closeClientCreateModal() {
  document.getElementById('clientCreateBackdrop')?.classList.remove('open');
}

function initClientCreateWizard() {
  const modal = document.getElementById('clientCreateBackdrop');
  if (!modal) return;
  initClientDocumentList(modal);
  initClientBankList(modal);
  modal.querySelectorAll('[data-client-create-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      setClientCreateStep(btn.dataset.clientCreateStep);
      updateClientCreateReview();
    });
  });
  modal.querySelector('#clientCreateType')?.addEventListener('change', () => {
    syncClientCreateTypeFields();
    updateClientCreateReview();
  });
  modal.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', updateClientCreateReview);
    el.addEventListener('change', updateClientCreateReview);
  });
  syncClientCreateTypeFields();
}

function setClientCreateStep(step) {
  const modal = document.getElementById('clientCreateBackdrop');
  if (!modal) return;
  initClientDocumentList(modal);
  initClientBankList(modal);
  modal.querySelectorAll('[data-client-create-step]').forEach(btn => btn.classList.toggle('active', btn.dataset.clientCreateStep === step));
  modal.querySelectorAll('[data-client-create-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.clientCreatePanel === step));
}

function syncClientCreateTypeFields() {
  const modal = document.getElementById('clientCreateBackdrop');
  if (!modal) return;
  const type = modal.querySelector('#clientCreateType')?.value || 'Individual';
  modal.querySelectorAll('[data-create-type-fields]').forEach(group => {
    group.hidden = group.dataset.createTypeFields !== type;
  });
}

function updateClientCreateReview() {
  const form = document.getElementById('clientCreateForm');
  if (!form) return;
  const fd = new FormData(form);
  const type = fd.get('type') || 'Individual';
  const individualName = [fd.get('name'), fd.get('surname'), fd.get('lastName')].map(x => (x || '').toString().trim()).filter(Boolean).join(' ');
  const legalName = (fd.get('companyName') || '').toString().trim();
  const contact = type === 'Individual' ? individualName : (fd.get('contactPerson') || legalName || '').toString().trim();
  const set = (key, value) => {
    const el = form.querySelector(`[data-review-field="${key}"]`);
    if (el) el.textContent = value || 'Not entered';
  };
  set('tenant', fd.get('tenant'));
  set('type', type);
  set('contact', contact || fd.get('email'));
  set('portal', fd.get('username'));
  set('location', [fd.get('country'), fd.get('region'), fd.get('city')].filter(Boolean).join(' · '));
  const clientPassport = form.querySelector('[name="clientPassport"]')?.files?.[0]?.name || '';
  const stateDoc = form.querySelector('[name="stateRegistrationDocument"]')?.files?.[0]?.name || '';
  const projectDoc = form.querySelector('[name="projectDoc"]')?.files?.[0]?.name || '';
  set('documents', [clientPassport || fd.get('passportNumber'), stateDoc || fd.get('stateRegistrationNumber'), projectDoc].filter(Boolean).join(' · '));
  const banks = Array.from(form.querySelectorAll('.client-bank-card')).map((card, idx) => {
    const name = card.querySelector('[name="bankName"]')?.value || '';
    const code = card.querySelector('[name="bankCode"]')?.value || '';
    const account = card.querySelector('[name="accountNumber"]')?.value || '';
    const currency = card.querySelector('[name="accountCurrency"]')?.value || '';
    const primary = card.querySelector('[name="primaryBank"]')?.checked ? 'Primary' : '';
    return [primary, name, code, account, currency].filter(Boolean).join(' · ');
  }).filter(Boolean);
  set('banking', banks.join(' | '));
}

function initClientDocumentList(modal) {
  const render = () => {
    const host = modal.querySelector('#clientUploadedDocs');
    if (!host) return;
    const docs = Array.from(modal.querySelectorAll('[data-doc-label]')).map(input => ({ label: input.dataset.docLabel, name: input.files?.[0]?.name || '' })).filter(x => x.name);
    host.innerHTML = docs.length ? docs.map(x => `<div class="client-doc-row" data-doc-name="${x.label}"><div><strong>${x.label}</strong><small>${x.name}</small></div><button type="button" class="secondary-action" data-remove-doc="${x.label}">Delete</button></div>`).join('') : '<div class="empty-state mini">No documents added yet.</div>';
  };
  modal.querySelectorAll('[data-doc-label]').forEach(input => input.addEventListener('change', () => { render(); updateClientCreateReview(); }));
  modal.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-doc]');
    if (!btn) return;
    const input = Array.from(modal.querySelectorAll('[data-doc-label]')).find(x => x.dataset.docLabel === btn.dataset.removeDoc);
    if (input) input.value = '';
    render();
    updateClientCreateReview();
  });
  render();
}

function initClientBankList(modal) {
  const host = modal.querySelector('#clientBankList');
  const add = modal.querySelector('#addClientBank');
  if (!host || !add || host.dataset.ready) return;
  host.dataset.ready = 'true';
  const refresh = () => {
    host.querySelectorAll('.client-bank-card').forEach((card, i) => {
      card.dataset.bankIndex = i;
      card.querySelector('.client-bank-head strong').textContent = `Bank ${i + 1}`;
      const radio = card.querySelector('[name="primaryBank"]');
      if (radio) radio.value = i;
      card.querySelector('[data-remove-bank]').disabled = host.querySelectorAll('.client-bank-card').length === 1;
    });
    if (!host.querySelector('[name="primaryBank"]:checked')) host.querySelector('[name="primaryBank"]')?.click();
    updateClientCreateReview();
  };
  const bindCard = card => card.querySelectorAll('input, select').forEach(el => { el.addEventListener('input', updateClientCreateReview); el.addEventListener('change', updateClientCreateReview); });
  host.querySelectorAll('.client-bank-card').forEach(bindCard);
  add.onclick = () => {
    const clone = host.querySelector('.client-bank-card').cloneNode(true);
    clone.querySelectorAll('input').forEach(input => { if (input.type === 'radio') input.checked = false; else input.value = ''; });
    clone.querySelectorAll('select').forEach(select => select.value = 'AMD');
    host.appendChild(clone);
    bindCard(clone);
    refresh();
  };
  host.addEventListener('click', e => {
    const del = e.target.closest('[data-remove-bank]');
    if (del && host.querySelectorAll('.client-bank-card').length > 1) { del.closest('.client-bank-card').remove(); refresh(); }
  });
  refresh();
}

function submitClientCreateForm(e) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const type = fd.get('type') || 'Individual';
  const first = (fd.get('name') || '').toString().trim();
  const surname = (fd.get('surname') || '').toString().trim();
  const lastName = (fd.get('lastName') || '').toString().trim();
  const companyName = (fd.get('companyName') || '').toString().trim();
  const contactPerson = (fd.get('contactPerson') || '').toString().trim();
  const fullName = type === 'Individual' ? [first, surname, lastName].filter(Boolean).join(' ') : companyName;
  if (!fullName) {
    FleetLayout.toast(type === 'Individual' ? 'Enter client name before creating' : 'Enter company name before creating');
    setClientCreateStep('identity');
    return;
  }
  const id = `CL-${String(Date.now()).slice(-5)}`;
  const bankAccounts = Array.from(e.currentTarget.querySelectorAll('.client-bank-card')).map((card, idx) => ({
    bankName: card.querySelector('[name="bankName"]')?.value || '',
    bankCode: card.querySelector('[name="bankCode"]')?.value || '',
    accountNumber: card.querySelector('[name="accountNumber"]')?.value || '',
    accountCurrency: card.querySelector('[name="accountCurrency"]')?.value || '',
    primary: !!card.querySelector('[name="primaryBank"]')?.checked
  })).filter(b => b.bankName || b.bankCode || b.accountNumber || b.accountCurrency);
  const billingSummary = bankAccounts.length
    ? bankAccounts.map(b => `${b.primary ? 'Primary · ' : ''}${b.bankName}${b.bankCode ? ' · ' + b.bankCode : ''}${b.accountNumber ? ' · ' + b.accountNumber : ''}${b.accountCurrency ? ' · ' + b.accountCurrency : ''}`).join(' | ')
    : 'Not configured';
  const client = {
    id,
    code: `CLI-${fullName.replace(/[^A-Z0-9]/gi, '').slice(0, 6).toUpperCase() || 'NEW'}`,
    name: fullName || 'New Client',
    type,
    legalForm: type === 'Individual' ? 'Private Person' : 'Legal Entity',
    registrationNo: type === 'Individual' ? 'Pending identity ID' : (fd.get('registrationNo') || 'Pending registration number'),
    taxId: type === 'Individual' ? 'Pending personal ID' : (fd.get('taxId') || 'Pending tax ID'),
    country: fd.get('country') || 'Armenia',
    city: fd.get('city') || 'Yerevan',
    region: fd.get('region') || '',
    address: fd.get('address') || 'Address pending',
    status: fd.get('status') || 'Pending',
    verification: 'Draft · Pending verification',
    account: 'Global Admin Intake',
    primaryContact: type === 'Individual' ? (fullName || first) : (contactPerson || fullName),
    contactEmail: fd.get('email') || '',
    contactPhone: fd.get('phone1') || '',
    phone2: fd.get('phone2') || '',
    tenant: fd.get('tenant') || 'Tenant Alpha Energy',
    plants: [],
    users: 1,
    documents: Array.from(e.currentTarget.querySelectorAll('[data-doc-label]')).filter(input => input.files && input.files.length).length,
    billing: billingSummary,
    bankAccounts,
    supportTier: 'Not assigned',
    accessScope: 'No plant assignment yet',
    exportPolicy: 'Disabled until activation',
    assignmentRole: fd.get('portalRole') || fd.get('userRole') || fd.get('userRoleLegal') || 'End User',
    onboarding: 'Client profile created',
    username: fd.get('username') || '',
    language: fd.get('language') || fd.get('languageLegal') || 'English',
    timezone: fd.get('timezone') || 'Asia/Yerevan',
    temperature: fd.get('temperature') || '°C',
    currency: fd.get('currency') || 'AMD',
    irradiation: fd.get('irradiation') || 'kWh/m2',
    activationAt: new Date().toLocaleString()
  };
  FleetClientModel.clients.push(client);
  try {
    const saved = JSON.parse(localStorage.getItem('fleetos_custom_clients') || '[]');
    saved.push(client);
    localStorage.setItem('fleetos_custom_clients', JSON.stringify(saved));
  } catch (err) {}
  FleetClientModel.selectClient(client.id);
  FleetLayout.toast('Client created and linked to managing tenant');
  closeClientCreateModal();
  location.href = 'client-detail.html';
}

function clientRowsMarkup(rows) {
  if (!rows.length) return `<div class="empty-state-v28"><strong>No clients found</strong><small>Try changing search, type or status filters.</small></div>`;
  return `<div class="data-head"><span>Client</span><span>Legal / Identity</span><span>Assignment Scope</span><span>Access / Contract</span><span>Actions</span></div>${rows.map(c => {
    const k = FleetClientModel.countsForClient(c.id);
    return `<div class="data-row clickable-row" data-client="${c.id}"><div><strong>${c.name}</strong><small>${c.code}<br>${c.id}</small></div><div><strong>${c.type}</strong><small>${c.legalForm} · ${c.verification}<br>${c.country}, ${c.city}</small></div><div><strong>${k.plants} plants · ${k.capacity}</strong><small>${c.assignmentRole} · ${c.tenant}</small></div><div><span class="badge ${FleetClientModel.badge(c.status)}">${c.status}</span><small>${c.users} portal accounts · ${c.billing}</small></div><div class="row-actions"><button data-action="open">Open Client</button></div></div>`;
  }).join('')}`;
}

function renderClientDetailPage() {
  const client = FleetClientModel.selectedClient();
  const plants = FleetClientModel.plantsForClient(client.id);
  FleetLayout.mount(`
    <section class="page-hero client-hero-v17">
      <div><p class="eyebrow">Client Detail · ${client.type}</p><h1>${client.name}</h1><p class="muted">${client.code} · ${client.country}, ${client.city} · Account Manager: ${client.account}</p></div>
      <button class="freshness-card" id="backToClients" type="button"><span class="pulse"></span><div><strong>Client workspace</strong><small>Plants are client-level, managed through tenant workspace</small></div></button>
    </section>
    ${clientKpis(client)}
    <section class="client-layout-v17">
      <aside class="glass-card client-side-card-v17">
        <h3>Client Navigation</h3>
        <button class="active" data-client-tab="overview"><span>Overview</span></button>
        <button data-client-tab="identity"><span>Identity</span></button>
        <button data-client-tab="location"><span>Location & Preferences</span></button>
        <button data-client-tab="portal"><span>Contacts & Portal</span></button>
        <button data-client-tab="users"><span>Users & Access</span></button>
        <button data-client-tab="plants"><span>Assigned Plants</span></button>
        <button data-client-tab="commercial"><span>Commercial & Payments</span></button>
        <button data-client-tab="alerts"><span>Alerts</span></button>
        <button data-client-tab="activity"><span>Activity</span></button>
      </aside>
      <section class="glass-card client-main-card-v17">
        <div class="client-tab-content" id="clientTabContent">${clientTab(client, plants, 'overview')}</div>
      </section>
    </section>
  `);
  document.getElementById('backToClients').onclick = () => location.href = 'clients.html';
  document.querySelectorAll('[data-client-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-client-tab]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('clientTabContent').innerHTML = clientTab(client, plants, btn.dataset.clientTab);
  }));
  document.getElementById('clientTabContent').addEventListener('click', e => {
    const builderBtn = e.target.closest('[data-open-plant-builder]');
    const closeBuilder = e.target.closest('[data-close-plant-builder]');
    const stepBtn = e.target.closest('[data-builder-step]');
    const addDevice = e.target.closest('[data-builder-add-device]');
    const removeDevice = e.target.closest('[data-builder-remove-device]');
    const row = e.target.closest('[data-plant]');
    if (builderBtn) return openPlantBuilder();
    if (closeBuilder) return closePlantBuilder();
    if (stepBtn) return setPlantBuilderStep(stepBtn.dataset.builderStep);
    if (addDevice) return addBuilderDevice(addDevice.dataset.builderAddDevice);
    if (removeDevice) return removeBuilderDevice(removeDevice.dataset.builderRemoveDevice);
    if (!row) return;
    FleetClientModel.selectClient(client.id);
    FleetClientModel.selectPlant(row.dataset.plant);
    location.href = 'plant-detail.html';
  });
}


function plantBuilderModal(client) {
  return `<div class="plant-builder-modal-v27" id="plantBuilderModalV27" aria-hidden="true">
    <div class="plant-builder-shell-v27">
      <div class="plant-builder-top-v27">
        <div><p class="eyebrow">Create Plant · ${client.name}</p><h2>Plant Builder</h2><p class="muted">Build the plant from catalog device. FleetOS pre-fills shared model data and asks only for individual instance data.</p></div>
        <button class="drawer-close" type="button" data-close-plant-builder>x</button>
      </div>
      <div class="builder-steps-v27">
        <button class="active" type="button" data-builder-step="info"><b>1</b><span>Plant Info</span></button>
        <button type="button" data-builder-step="device"><b>2</b><span>Device</span></button>
        <button type="button" data-builder-step="compatibility"><b>3</b><span>Compatibility</span></button>
        <button type="button" data-builder-step="topology"><b>4</b><span>Topology</span></button>
        <button type="button" data-builder-step="review"><b>5</b><span>Review</span></button>
      </div>
      <div class="builder-body-v27" id="plantBuilderBodyV27">${plantBuilderStep('info')}</div>
      <div class="builder-footer-v27"><button class="secondary-btn" type="button" data-close-plant-builder>Cancel</button><button class="primary-btn" type="button" onclick="FleetLayout.toast('Plant Builder mock saved for review')">Create Plant</button></div>
    </div>
  </div>`;
}

function plantBuilderStep(step) {
  if (step === 'device') return `<div class="builder-two-col-v27">
    <section><div class="section-title-v17 mini"><div><h3>Device Catalog</h3><p class="muted">Choose a model from database. Shared fields come from catalog; individual fields are entered per physical device.</p></div></div>
      <div class="device-catalog-grid-v27">${FleetDeviceCatalog.catalog.map((x, i) => `<article>
        <div><strong>${x.vendor} ${x.model}</strong><small>${x.kind} · ${x.rating}</small></div>
        <p><b>Shared:</b> ${x.shared}</p><p><b>Individual:</b> ${x.individual}</p>
        <button class="small-btn" type="button" data-builder-add-device="${i}">Add to Plant</button>
      </article>`).join('')}</div>
    </section>
    <aside class="builder-selection-v27"><h3>Selected Device</h3><div id="builderDeviceListV27">${builderDeviceList()}</div></aside>
  </div>`;
  if (step === 'compatibility') return `<div class="section-title-v17"><div><h2>Device Compatibility Rules</h2><p class="muted">Vendor is an attribute, not the hierarchy. Compatibility is based on protocol, firmware, electrical limits and source capability.</p></div></div>
    <div class="data-table compact-table compatibility-table-v27"><div class="data-head"><span>Source</span><span>Compatible With</span><span>Type</span><span>Status</span><span>Rule</span></div>${FleetDeviceCatalog.compatibility.map(x => `<div class="data-row"><div><strong>${x.from}</strong></div><div><strong>${x.to}</strong></div><div><span>${x.type}</span></div><div><span class="badge ${x.status.includes('Conditional') ? 'warning' : 'success'}">${x.status.split(':')[0]}</span><small>${x.status.includes(':') ? x.status.split(':').slice(1).join(':').trim() : x.status}</small></div><div><small>${x.rule}</small></div></div>`).join('')}</div>`;
  if (step === 'topology') return `<div class="section-title-v17"><div><h2>Topology Builder</h2><p class="muted">A plant can contain mixed-vendor device. Relationships are physical/electrical/logical, not vendor ownership.</p></div></div>
    <div class="plant-builder-topology-v27">
      <div class="topology-node-v27 root"><b>Plant</b><span>New plant workspace</span></div>
      <div class="topology-branches-v27">
        <div><b>Inverters</b><span>children: MPPT → Strings → PV modules</span></div>
        <div><b>Meters</b><span>POI / import-export / accounting</span></div>
        <div><b>Logger / Gateway</b><span>linked devices and data source</span></div>
        <div><b>BESS</b><span>linked to PCS and racks/modules</span></div>
        <div><b>Weather Station</b><span>plant-level analytics context</span></div>
        <div><b>Transformer / Switchgear</b><span>grid infrastructure</span></div>
      </div>
    </div>`;
  if (step === 'review') return `<div class="section-title-v17"><div><h2>Review</h2><p class="muted">Before creating the plant, check required individual data and compatibility warnings.</p></div></div>
    <div class="builder-review-grid-v27"><article><span>Plant</span><strong>New Plant</strong><small>Name, code, address, timezone</small></article><article><span>Device</span><strong id="builderReviewCountV27">${builderDevices().length} selected</strong><small>From catalog database</small></article><article><span>Required individual fields</span><strong>Serials / addresses / install dates</strong><small>Per physical instance</small></article><article><span>Compatibility</span><strong>Conditional checks required</strong><small>BMS, meter, logger, protocol</small></article></div>`;
  return `<div class="section-title-v17"><div><h2>Plant Information</h2><p class="muted">Only plant identity and location are entered manually. Device details are selected in the next step.</p></div></div>
    <div class="builder-form-grid-v27"><label>Plant Name<input value="New Plant" /></label><label>Plant Code<input value="AUTO-PL-001" /></label><label>Country<input value="Armenia" /></label><label>Region<input value="Kotayk" /></label><label>Address<input value="Plant address" /></label><label>Timezone<input value="Asia/Yerevan" /></label><label>Client<input value="${FleetClientModel.selectedClient().name}" /></label><label>Managing Tenant<input value="Tenant workspace" /></label></div>`;
}

function builderDevices() {
  try { return JSON.parse(sessionStorage.getItem('fleetos_builder_devices_v27') || '[]'); } catch { return []; }
}
function saveBuilderDevices(list) { sessionStorage.setItem('fleetos_builder_devices_v27', JSON.stringify(list)); }
function builderDeviceList() {
  const list = builderDevices();
  if (!list.length) return `<div class="empty-state"><strong>No device selected</strong><small>Add inverter, meter, logger, BESS or infrastructure devices from the catalog.</small></div>`;
  return `<div class="builder-device-list-v27">${list.map((x, i) => `<article><div><strong>${x.vendor} ${x.model}</strong><small>${x.kind} · ${x.rating}</small></div><button class="small-btn danger" type="button" data-builder-remove-device="${i}">Remove</button></article>`).join('')}</div>`;
}
function openPlantBuilder() {
  const modal = document.getElementById('plantBuilderModalV27');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  setPlantBuilderStep('info');
}
function closePlantBuilder() {
  const modal = document.getElementById('plantBuilderModalV27');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
function setPlantBuilderStep(step) {
  document.querySelectorAll('[data-builder-step]').forEach(x => x.classList.toggle('active', x.dataset.builderStep === step));
  const body = document.getElementById('plantBuilderBodyV27');
  if (body) body.innerHTML = plantBuilderStep(step);
}
function addBuilderDevice(index) {
  const item = FleetDeviceCatalog.catalog[Number(index)];
  if (!item) return;
  const list = builderDevices();
  list.push(item);
  saveBuilderDevices(list);
  const target = document.getElementById('builderDeviceListV27');
  if (target) target.innerHTML = builderDeviceList();
  FleetLayout.toast(`${item.kind} added to Plant Builder`);
}
function removeBuilderDevice(index) {
  const list = builderDevices();
  list.splice(Number(index), 1);
  saveBuilderDevices(list);
  const target = document.getElementById('builderDeviceListV27');
  if (target) target.innerHTML = builderDeviceList();
}

function plantSummaryCards(plants) {
  if (!plants.length) return `<div class="empty-state"><strong>No plants assigned yet</strong><small>Plants will appear here after assignment is completed.</small></div>`;
  return `<div class="plant-card-grid-v17">${plants.map(p => {
    const ds = FleetClientModel.devicesForPlant(p.id);
    return `<article class="plant-card-v17 clickable-row" data-plant="${p.id}">
      <div class="plant-card-top-v17"><div><strong>${p.name}</strong><small>${p.code} · ${p.portfolio}</small></div><span class="badge ${FleetClientModel.badge(p.health)}">${p.health}</span></div>
      <div class="plant-card-metrics-v17"><div><span>Capacity</span><b>${p.capacityDc}</b></div><div><span>Now</span><b>${p.powerNow}</b></div><div><span>Today</span><b>${p.energyToday}</b></div><div><span>Alerts</span><b>${p.alerts}</b></div></div>
      <div class="device-strip-v17"><span>Inverters ${p.inverters}</span><span>Meters ${p.meters}</span><span>BESS ${p.battery}</span><span>${ds.length} sample records</span></div>
    </article>`;
  }).join('')}</div>`;
}


function clientProfileCard(client) {
  const legalRows = client.type === 'Individual'
    ? [
      ['Client Type', client.type], ['Full Name', client.name], ['Personal / Passport ID', client.registrationNo], ['Tax / Personal ID', client.taxId], ['Identity Status', client.verification], ['Residential Location', `${client.country}, ${client.city}`]
    ]
    : [
      ['Client Type', client.type], ['Legal Form', client.legalForm], ['Registration Number', client.registrationNo], ['Tax ID', client.taxId], ['KYC / Verification', client.verification], ['Registered Address', client.address]
    ];
  return `<div class="info-grid">
    ${legalRows.map(([k,v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('')}
    <div><span>Primary Contact</span><strong>${client.primaryContact}</strong></div>
    <div><span>Email</span><strong>${client.contactEmail}</strong></div>
    <div><span>Phone</span><strong>${client.contactPhone}</strong></div>
    <div><span>Account Manager</span><strong>${client.account}</strong></div>
    <div><span>Managing Tenant</span><strong>${client.tenant}</strong></div>
    <div><span>Onboarding</span><strong>${client.onboarding}</strong></div>
  </div>`;
}

function assignmentRows(client, plants) {
  if (!plants.length) return `<div class="empty-state"><strong>No plant assigned yet</strong><small>This client is registered, but no plant assignment is visible for Global Admin.</small></div>`;
  return `<div class="data-table compact-table assignment-table-v28"><div class="data-head"><span>Plant</span><span>Role / Tenant</span><span>Access Scope</span><span>Documents</span><span>Action</span></div>${plants.map(p => `<div class="data-row" data-plant="${p.id}"><div><strong>${p.name}</strong><small>${p.code}<br>${p.country}, ${p.city}</small></div><div><strong>${client.assignmentRole}</strong><small>${p.operator}</small></div><div><span class="badge ${FleetClientModel.badge(p.health)}">${p.health}</span><small>Portal: overview, energy, reports</small></div><div><strong>Assignment active</strong><small>Owner matrix · O&M terms · reports</small></div><div class="row-actions"><button type="button">Open Plant</button></div></div>`).join('')}</div>`;
}

function accessScopeMatrix(client, plants) {
  const plantScope = plants.length ? plants.map(p => p.name).join(', ') : 'No active plant scope';
  return `<div class="section-title-v17"><div><h2>Access Scope</h2><p class="muted">Client access is limited to assigned plants and client-facing modules. Global Admin reviews the scope, Tenant Admin manages changes.</p></div><button class="small-btn" type="button" onclick="location.href='client-users-permissions.html'">View Permissions</button></div>
  <div class="info-grid">
    <div><span>Plant Scope</span><strong>${plantScope}</strong><small>${client.accessScope}</small></div>
    <div><span>Allowed Modules</span><strong>Overview · My Plants · Reports · Documents · Billing</strong><small>No integrations, no platform settings, no tenant-wide operations</small></div>
    <div><span>Role Templates</span><strong>Owner Viewer · Finance Viewer · Report Exporter</strong><small>${client.users} portal accounts</small></div>
    <div><span>Export Policy</span><strong>${client.exportPolicy}</strong><small>All exports are traceable in audit</small></div>
  </div>`;
}

function clientDocuments(client) {
  const base = client.type === 'Individual'
    ? [['Identity Verification.pdf','Identity · Pending'], ['Owner Portal Consent.pdf','Access · Draft'], ['Plant Assignment Request.pdf','Assignment · Waiting']]
    : [['Client Agreement.pdf','Commercial · Active'], ['Registration Extract.pdf','Legal · Verified'], ['Tax Certificate.pdf','Finance · Verified']];
  const common = [['Plant Management Matrix','Access · Updated this week'], ['Data Processing Agreement.pdf','Compliance · Signed'], ['Billing Contacts.pdf','Finance · Active']];
  return `<div class="section-title-v17"><div><h2>Documents</h2><p class="muted">Client-level legal, commercial and access documents. Technical device manuals stay inside Plant Detail.</p></div><span class="badge success">Read-only</span></div><div class="document-grid-v17 document-grid-v28">${base.concat(common).map(([name, meta]) => `<article><strong>${name}</strong><small>${meta}</small><button class="small-btn" type="button">View</button></article>`).join('')}</div>`;
}

function clientOverviewTab(client, plants) {
  const counts = FleetClientModel.countsForClient(client.id);
  const alertState = counts.alerts > 0 ? 'warning' : 'success';
  const portalState = client.username ? 'success' : 'warning';
  const healthText = counts.alerts > 0 ? `${counts.alerts} active issue${counts.alerts === 1 ? '' : 's'}` : 'No active issues';
  return `<div class="section-title-v17"><div><h2>Client Overview</h2><p class="muted">Useful client-level snapshot: who manages the client, what plants are linked, portal state and active operational risk.</p></div><span class="badge ${FleetClientModel.badge(client.status)}">${client.status}</span></div>
  <div class="info-grid">
    <div><span>Managing Tenant</span><strong>${client.tenant}</strong><small>Tenant responsible for supervision and operations</small></div>
    <div><span>Client Type</span><strong>${client.type}</strong><small>${client.legalForm}</small></div>
    <div><span>Assigned Plants</span><strong>${counts.plants}</strong><small>${counts.capacity} total DC capacity</small></div>
    <div><span>Device Records</span><strong>${counts.devices}</strong><small>Devices across assigned plants</small></div>
    <div><span>Active Alerts</span><strong>${healthText}</strong><small>Plant and device alerts visible for support context</small></div>
    <div><span>Portal Status</span><strong>${client.username ? 'Configured' : 'Pending'}</strong><small>${client.username || 'No portal username yet'}</small></div>
  </div>
  <div class="section-title-v17 mini"><div><h3>Operational Snapshot</h3><p class="muted">Only high-value information is shown here, not every internal admin field.</p></div></div>
  <div class="placeholder-grid compact-cards client-ops-grid-v40">
    <article><span>Plants</span><strong>${counts.plants}</strong><small>Open Plants tab to inspect client devices</small></article>
    <article><span>Alerts</span><strong>${counts.alerts}</strong><small>Open Alerts tab to see recent issues</small></article>
    <article><span>Portal Users</span><strong>${clientPortalUsers(client, plants).length}</strong><small>Open Users & Access for detailed portal scope</small></article>
    <article><span>Documents</span><strong>${client.documents || 0}</strong><small>Client documents stay available from registry context</small></article>
  </div>
  ${plants.length ? `<div class="section-title-v17 mini"><div><h3>Assigned Plants Preview</h3><p class="muted">Quick preview of the most important linked plants.</p></div></div>${plantSummaryCards(plants.slice(0, 3))}` : `<div class="empty-state"><strong>No plant assigned yet</strong><small>Use Assigned Plants to review plant role, access scope and commercial visibility.</small></div>`}`;
}

function clientIdentityTab(client) {
  const rows = client.type === 'Individual'
    ? [
      ['Name / Full Name', client.name, 'Created from Name, Surname and Last name'],
      ['Date of Birth', client.dob || 'Not provided', 'Format: dd/mm/yyyy'],
      ['Personal / Passport ID', client.registrationNo, 'Identity document reference'],
      ['Tax / Personal ID', client.taxId, 'Tax or personal number'],
      ['Verification', client.verification, 'Identity verification state'],
      ['User Role', client.assignmentRole, 'Initial role from create form']
    ]
    : [
      ['Legal Name', client.name, 'Company / legal entity name'],
      ['Legal Form', client.legalForm, 'Entity profile type'],
      ['Registration Number', client.registrationNo, 'Company registration reference'],
      ['Tax ID', client.taxId, 'VAT / tax identification'],
      ['Verification', client.verification, 'KYC / legal verification state'],
      ['User Role', client.assignmentRole, 'Initial role from create form']
    ];
  return `<div class="section-title-v17"><div><h2>Identity</h2><p class="muted">Identity data collected during Client creation. This section stays focused on legal/person data only.</p></div></div>
  <div class="info-grid">${rows.map(([k,v,h]) => `<div><span>${k}</span><strong>${v || 'Not provided'}</strong><small>${h}</small></div>`).join('')}</div>`;
}

function clientLocationPreferencesTab(client) {
  return `<div class="section-title-v17"><div><h2>Location & Preferences</h2><p class="muted">Library-based geography and client-facing display preferences.</p></div></div>
  <div class="info-grid">
    <div><span>Country</span><strong>${client.country || 'Not provided'}</strong><small>Library value</small></div>
    <div><span>Region</span><strong>${client.region || 'Not provided'}</strong><small>Library value</small></div>
    <div><span>City</span><strong>${client.city || 'Not provided'}</strong><small>Library value</small></div>
    <div><span>Address</span><strong>${client.address || 'Not provided'}</strong><small>Client address</small></div>
    <div><span>Time Zone</span><strong>${client.timezone || 'Not provided'}</strong><small>Used for portal dates and reporting</small></div>
    <div><span>Language</span><strong>${client.language || 'English'}</strong><small>End-user portal preference</small></div>
    <div><span>Temperature Format</span><strong>${client.temperature || '°C'}</strong><small>End-user portal preference</small></div>
    <div><span>Currency Unit</span><strong>${client.currency || 'AMD'}</strong><small>End-user portal preference</small></div>
    <div><span>Irradiation</span><strong>${client.irradiation || 'kWh/m2'}</strong><small>Library value for solar metrics</small></div>
  </div>`;
}


function clientPlantAssignments(client, plants) {
  const fallbackRole = client.assignmentRole || (client.type === 'Individual' ? 'Owner' : 'Owner / Investor');
  const roleByIndex = ['Owner', 'Energy Beneficiary', 'O&M Observer', 'Energy Consumer'];
  return plants.map((plant, index) => ({
    plant,
    role: client.id === 'CL-00041' ? roleByIndex[index] || fallbackRole : fallbackRole,
    portalScope: index === 0 ? 'Overview · Energy · Alerts · Reports' : index === 1 ? 'Overview · Energy · Reports' : 'Overview · Alerts · Documents',
    commercialScope: plant.battery === 'Yes' ? 'Generation + Storage settlement' : 'Generation settlement',
    status: plant.status === 'Active' ? 'Active' : plant.status,
    since: index === 0 ? '18 Sep 2024' : index === 1 ? '02 Mar 2025' : '22 Nov 2025'
  }));
}

function clientPortalUsers(client, plants) {
  const firstPlant = plants[0]?.name || 'No plant assigned';
  const secondPlant = plants[1]?.name || firstPlant;
  const base = [
    {
      name: client.primaryContact || client.name,
      email: client.contactEmail || 'not-configured@example.com',
      role: client.type === 'Individual' ? 'Owner User' : 'Client Admin',
      scope: plants.length ? 'All assigned plants' : 'No plant scope yet',
      modules: 'Overview, Energy, Reports, Documents',
      status: client.username ? 'Active' : client.status === 'Active' ? 'Invited' : 'Pending',
      lastLogin: client.username ? '2 days ago' : 'No login yet',
      mfa: 'Recommended'
    }
  ];
  if (client.type !== 'Individual') {
    base.push(
      { name: 'Narek Grigoryan', email: 'finance@' + (client.code || 'client').toLowerCase().replace(/[^a-z0-9]/g, '') + '.example', role: 'Finance Contact', scope: 'Commercial + invoices', modules: 'Finance, Reports, Documents', status: 'Active', lastLogin: '5 days ago', mfa: 'Enabled' },
      { name: 'Lilit Avagyan', email: 'technical@' + (client.code || 'client').toLowerCase().replace(/[^a-z0-9]/g, '') + '.example', role: 'Technical Viewer', scope: firstPlant, modules: 'Overview, Devices, Alerts', status: 'Active', lastLogin: 'Yesterday', mfa: 'Enabled' },
      { name: 'External Auditor', email: 'audit@' + (client.code || 'client').toLowerCase().replace(/[^a-z0-9]/g, '') + '.example', role: 'Read-only Auditor', scope: secondPlant, modules: 'Reports, Documents, Audit', status: 'Suspended', lastLogin: '31 days ago', mfa: 'Required' }
    );
  }
  return base;
}

function clientUsersAccessTab(client, plants) {
  const users = clientPortalUsers(client, plants);
  const active = users.filter(u => u.status === 'Active').length;
  const pending = users.filter(u => u.status !== 'Active').length;
  return `<div class="section-title-v17"><div><h2>Users & Access</h2><p class="muted">People from this client who can enter the End User portal. This is client-facing access, not Tenant Admin staff management.</p></div><button class="small-btn" type="button" onclick="FleetLayout.toast('Add portal user mock')">+ Add User</button></div>
  <div class="info-grid">
    <div><span>Total Portal Users</span><strong>${users.length}</strong><small>Visible in client workspace</small></div>
    <div><span>Active Users</span><strong>${active}</strong><small>Can access portal now</small></div>
    <div><span>Pending / Restricted</span><strong>${pending}</strong><small>Invited, suspended or waiting verification</small></div>
    <div><span>Default Plant Scope</span><strong>${plants.length ? 'Assigned plants only' : 'No plant scope'}</strong><small>Client users never see tenant-wide operations</small></div>
    <div><span>Default Role Template</span><strong>${client.type === 'Individual' ? 'Owner User' : 'Client Admin'}</strong><small>End User portal role family</small></div>
    <div><span>Export Control</span><strong>${client.exportPolicy || 'Not configured'}</strong><small>Reports and document download policy</small></div>
  </div>
  <div class="data-table compact-table client-users-access-table-v89">
    <div class="data-head"><span>User</span><span>Portal Role</span><span>Plant / Data Scope</span><span>Allowed Modules</span><span>Status</span><span>Security</span></div>
    ${users.map(u => `<div class="data-row"><div><strong>${u.name}</strong><small>${u.email}</small></div><div><strong>${u.role}</strong><small>Client-facing role</small></div><div><strong>${u.scope}</strong><small>Object-level access scope</small></div><div><strong>${u.modules}</strong><small>No admin/system configuration</small></div><div><span class="badge ${u.status === 'Active' ? 'success' : u.status === 'Suspended' ? 'danger' : 'warning'}">${u.status}</span><small>Last login: ${u.lastLogin}</small></div><div><strong>MFA: ${u.mfa}</strong><small>Audit required for access changes</small></div></div>`).join('')}
  </div>
  <div class="section-title-v17 mini"><div><h3>Access Rules Snapshot</h3><p class="muted">These rules explain the boundary between Client Portal and Tenant/Admin workspaces.</p></div></div>
  <div class="placeholder-grid compact-cards client-ops-grid-v40 client-access-rules-v89">
    <article><span>Allowed</span><strong>View own plants</strong><small>Overview, My Plant, simplified devices and alerts.</small></article>
    <article><span>Allowed</span><strong>Download approved reports</strong><small>Only when export policy allows it.</small></article>
    <article><span>Blocked</span><strong>No tenant operations</strong><small>No integrations, registry management, mapping or billing setup.</small></article>
    <article><span>Audit</span><strong>Access changes logged</strong><small>Every role/scope update belongs to Global Admin audit.</small></article>
  </div>`;
}

function clientContactsPortalTab(client, plants) {
  return `<div class="section-title-v17"><div><h2>Contacts & Portal</h2><p class="muted">Primary contact data. Detailed portal users and permissions are separated into Users & Access.</p></div><span class="badge ${client.username ? 'success' : 'warning'}">${client.username ? 'Portal configured' : 'Portal pending'}</span></div>
  <div class="info-grid">
    <div><span>Primary Contact</span><strong>${client.primaryContact || 'Not provided'}</strong><small>Contact person / client owner</small></div>
    <div><span>E-mail</span><strong>${client.contactEmail || 'Not provided'}</strong><small>Primary portal and notification address</small></div>
    <div><span>Phone Number 1</span><strong>${client.contactPhone || 'Not provided'}</strong><small>Main contact phone</small></div>
    <div><span>Phone Number 2</span><strong>${client.phone2 || 'Not provided'}</strong><small>Optional contact phone</small></div>
    <div><span>Username</span><strong>${client.username || 'Not configured'}</strong><small>Portal account username</small></div>
    <div><span>Portal Role</span><strong>${client.assignmentRole || 'End User'}</strong><small>Client-facing role template</small></div>
    <div><span>Portal Users</span><strong>${clientPortalUsers(client, plants).length}</strong><small>Open Users & Access for role and scope</small></div>
    <div><span>Plant Scope</span><strong>${plants.length} assigned plant${plants.length === 1 ? '' : 's'}</strong><small>${client.accessScope}</small></div>
  </div>
  <div class="section-title-v17 mini"><div><h3>Portal Usage</h3><p class="muted">Useful support indicators without exposing the full RBAC matrix here.</p></div></div>
  <div class="placeholder-grid compact-cards client-ops-grid-v40">
    <article><span>Portal Status</span><strong>${client.username ? 'Active' : 'Pending'}</strong><small>${client.activationAt || 'Activation date unavailable'}</small></article>
    <article><span>Last Login</span><strong>${client.username ? '2 days ago' : 'No login yet'}</strong><small>Mock support signal</small></article>
    <article><span>MFA</span><strong>${client.username ? 'Recommended' : 'Not configured'}</strong><small>Security policy snapshot</small></article>
    <article><span>Export Policy</span><strong>${client.exportPolicy || 'Not configured'}</strong><small>Reports and document exports</small></article>
  </div>`;
}

function clientPlantsTab(client, plants) {
  const counts = FleetClientModel.countsForClient(client.id);
  if (!plants.length) return `<div class="section-title-v17"><div><h2>Assigned Plants</h2><p class="muted">Plants linked to this client will appear here with role, access and commercial scope.</p></div><span class="badge warning">No assignment</span></div><div class="empty-state"><strong>No plants assigned</strong><small>No End User portal plant scope will be available until at least one plant is assigned.</small></div>`;
  return `<div class="section-title-v17"><div><h2>Assigned Plants</h2><p class="muted">Client plant portfolio with assignment role, portal visibility and commercial scope.</p></div><span class="badge success">${plants.length} assigned</span></div>
  <div class="info-grid">
    <div><span>Total Plants</span><strong>${plants.length}</strong><small>Assigned to this client</small></div>
    <div><span>Total Capacity</span><strong>${counts.capacity}</strong><small>Installed DC capacity</small></div>
    <div><span>Device Records</span><strong>${counts.devices}</strong><small>Linked plant devices</small></div>
    <div><span>Open Alerts</span><strong>${counts.alerts}</strong><small>Across assigned plants</small></div>
  </div>
  <div class="data-table compact-table client-plant-table-v40 client-assignment-table-v89">
    <div class="data-head"><span>Plant</span><span>Client Role</span><span>Portal Scope</span><span>Status / Capacity</span><span>Commercial Scope</span><span>Actions</span></div>
    ${clientPlantAssignments(client, plants).map(a => `<div class="data-row" data-plant="${a.plant.id}"><div><strong>${a.plant.name}</strong><small>${a.plant.code}<br>${a.plant.id}</small></div><div><strong>${a.role}</strong><small>Assigned since ${a.since}</small></div><div><strong>${a.portalScope}</strong><small>Client portal visibility</small></div><div><span class="badge ${FleetClientModel.badge(a.plant.health)}">${a.plant.health}</span><small>${a.plant.capacityDc} DC · ${a.plant.capacityAc} AC</small></div><div><strong>${a.commercialScope}</strong><small>${a.plant.alerts} alerts · ${a.plant.energyToday}</small></div><div class="row-actions"><button type="button">Open</button></div></div>`).join('')}
  </div>`;
}


function clientBankAccounts(client) {
  const saved = Array.isArray(client.bankAccounts) ? client.bankAccounts : [];
  const normalized = saved.map((b, i) => ({
    bankName: b.bankName || b.bank || 'Not provided',
    bankCode: b.bankCode || 'Not provided',
    accountNumber: b.accountNumber || b.account || 'Not provided',
    accountCurrency: b.accountCurrency || b.currency || client.currency || 'AMD',
    primary: !!b.primary || i === 0
  })).filter(b => b.bankName !== 'Not provided' || b.accountNumber !== 'Not provided');
  if (normalized.length) return normalized;
  if (client.billing && client.billing !== 'Not configured') {
    return [{
      bankName: client.country === 'Armenia' ? 'ACBA Bank' : 'Primary Operating Bank',
      bankCode: 'Not provided',
      accountNumber: client.country === 'Armenia' ? 'AM110001234567890' : 'EU00 1000 2000 3000 4000',
      accountCurrency: client.currency || (client.country === 'Armenia' ? 'AMD' : 'EUR'),
      primary: true
    }];
  }
  return [];
}

function clientBankingSection(client) {
  const banks = clientBankAccounts(client);
  if (!banks.length) return `<div class="section-title-v17 mini"><div><h3>Banking Information</h3><p class="muted">Bank account information used for billing, settlements and client financial records.</p></div><span class="badge warning">Not configured</span></div><div class="empty-state"><strong>No bank account added</strong><small>Create Client banking fields will appear here after saving.</small></div>`;
  return `<div class="section-title-v17 mini"><div><h3>Banking Information</h3><p class="muted">Bank account information used for billing, settlements and client financial records.</p></div><span class="badge success">${banks.length} bank${banks.length === 1 ? '' : 's'}</span></div>
  <div class="data-table compact-table client-bank-detail-table-v91"><div class="data-head"><span>Bank</span><span>Bank Code</span><span>Account Number</span><span>Currency</span><span>Status</span></div>${banks.map(b => `<div class="data-row"><div><strong>${b.bankName || 'Not provided'}</strong><small>${b.primary ? 'Primary bank' : 'Additional bank'}</small></div><div><strong>${b.bankCode || 'Not provided'}</strong><small>Bank code</small></div><div><strong>${b.accountNumber || 'Not provided'}</strong><small>Account number / IBAN</small></div><div><strong>${b.accountCurrency || 'Not provided'}</strong><small>Account currency</small></div><div><span class="badge ${b.primary ? 'success' : 'neutral'}">${b.primary ? 'Primary' : 'Secondary'}</span></div></div>`).join('')}</div>`;
}

function clientCommercialProfile(client, plants) {
  const currency = client.currency || (client.country === 'Armenia' ? 'AMD' : 'EUR');
  const bankAccounts = clientBankAccounts(client);
  const primaryBank = bankAccounts.find(b => b.primary) || bankAccounts[0];
  const firstBank = primaryBank?.bankName || (client.country === 'Armenia' ? 'ACBA Bank' : 'Primary Operating Bank');
  const iban = primaryBank?.accountNumber || (client.country === 'Armenia' ? 'AM110001234567890' : 'EU00 1000 2000 3000 4000');
  const monthlyEnergy = plants.reduce((sum, p) => sum + (parseFloat(String(p.energyToday || '0').replace(/[^0-9.]/g, '')) || 0) * 30, 0);
  const saleRate = client.id === 'CL-00042' ? 0.104 : client.id === 'CL-00043' ? 0.118 : 0.092;
  const estimatedRevenue = Math.round(monthlyEnergy * 1000 * saleRate);
  const revenueCurrency = currency === 'AMD' ? '€' : currency === 'USD' ? '$' : '€';
  return {
    model: client.type === 'Individual' ? 'Owner Portal · Self-consumption' : 'Commercial PPA + Energy Sale',
    contract: client.id === 'CL-00043' ? 'Commercial review' : 'Active',
    paymentTerms: client.billing?.includes('Net 15') ? 'Net 15' : client.type === 'Individual' ? 'Prepaid / direct settlement' : 'Net 30',
    invoiceCycle: client.type === 'Individual' ? 'Monthly summary' : 'Monthly invoice',
    energyBuyer: client.id === 'CL-00042' ? 'California Green Offtaker Inc.' : client.id === 'CL-00043' ? 'GridOps Market Desk' : 'Green Market Trader LLC',
    salesChannel: client.id === 'CL-00043' ? 'Market / storage arbitrage' : 'PPA / grid export settlement',
    saleRate: `${revenueCurrency}${saleRate.toFixed(3)} / kWh`,
    estimatedRevenue: `${revenueCurrency}${estimatedRevenue.toLocaleString()}`,
    bank: firstBank,
    iban,
    currency,
    destination: client.type === 'Individual' ? 'Client personal settlement account' : 'Client commercial settlement account',
    settlementStatus: client.id === 'CL-00043' ? 'Needs commercial approval' : 'Ready for monthly close',
    approval: client.id === 'CL-00043' ? 'Global Admin + Finance approval required' : 'Tenant Finance can prepare settlement, Global Admin audits changes'
  };
}

function clientCommercialRows(client, plants, profile) {
  return clientPlantAssignments(client, plants).map((a, index) => {
    const bidirectional = a.plant.battery === 'Yes';
    const buyer = bidirectional && client.id === 'CL-00043' ? 'Balancing Market / Trader' : profile.energyBuyer;
    const rate = bidirectional ? profile.saleRate + ' · storage premium review' : profile.saleRate;
    const meter = bidirectional ? 'Export + storage meter' : 'Grid export meter';
    const settlement = index === 0 ? profile.settlementStatus : a.plant.status === 'Active' ? 'Included in next monthly close' : 'Hold until plant status clears';
    return { ...a, buyer, rate, meter, settlement };
  });
}

function clientCommercialPaymentsTab(client, plants) {
  const profile = clientCommercialProfile(client, plants);
  const rows = clientCommercialRows(client, plants, profile);
  if (!plants.length) return `<div class="section-title-v17"><div><h2>Commercial & Payments</h2><p class="muted">Commercial logic appears after at least one plant is assigned to this client.</p></div><span class="badge warning">No plant scope</span></div><div class="empty-state"><strong>No commercial chain yet</strong><small>Assign a plant first, then connect commercial model, energy sale, payment destination and settlement audit.</small></div>`;
  return `<div class="section-title-v17"><div><h2>Commercial & Payments</h2><p class="muted">Full client chain: Client → Assigned Plant → Commercial Model → Energy Sale → Payment Destination → Settlement / Audit.</p></div><span class="badge ${profile.contract === 'Active' ? 'success' : 'warning'}">${profile.contract}</span></div>
  <div class="commercial-flow-v90">
    <article><span>1</span><strong>Client</strong><small>${client.name}<br>${client.code}</small></article>
    <article><span>2</span><strong>Assigned Plants</strong><small>${plants.length} plant${plants.length === 1 ? '' : 's'} · ${client.assignmentRole}</small></article>
    <article><span>3</span><strong>Commercial Model</strong><small>${profile.model}</small></article>
    <article><span>4</span><strong>Energy Sale</strong><small>${profile.salesChannel}<br>${profile.saleRate}</small></article>
    <article><span>5</span><strong>Payment Destination</strong><small>${profile.bank}<br>${profile.currency}</small></article>
    <article><span>6</span><strong>Settlement / Audit</strong><small>${profile.settlementStatus}</small></article>
  </div>
  <div class="info-grid commercial-client-grid-v90">
    <div><span>Commercial Model</span><strong>${profile.model}</strong><small>Defines how assigned plants create billable value</small></div>
    <div><span>Estimated Monthly Revenue</span><strong>${profile.estimatedRevenue}</strong><small>Mock value from assigned plant production and sale rate</small></div>
    <div><span>Payment Terms</span><strong>${profile.paymentTerms}</strong><small>${profile.invoiceCycle}</small></div>
    <div><span>Energy Buyer</span><strong>${profile.energyBuyer}</strong><small>${profile.salesChannel}</small></div>
    <div><span>Payment Destination</span><strong>${profile.destination}</strong><small>${profile.bank} · ${profile.iban}</small></div>
    <div><span>Approval Rule</span><strong>${profile.approval}</strong><small>All changes are written to audit trail</small></div>
  </div>
  ${clientBankingSection(client)}
  <div class="section-title-v17 mini"><div><h3>Plant Commercial Scope</h3><p class="muted">Each assigned plant can have its own buyer, rate, metering basis and settlement state.</p></div><button class="small-btn" type="button" onclick="FleetLayout.toast('Commercial model edit mock')">Edit Commercial Model</button></div>
  <div class="data-table compact-table client-commercial-chain-table-v90">
    <div class="data-head"><span>Assigned Plant</span><span>Client Role</span><span>Energy Sale</span><span>Meter / Accounting Basis</span><span>Payment Destination</span><span>Settlement</span></div>
    ${rows.map(r => `<div class="data-row"><div><strong>${r.plant.name}</strong><small>${r.plant.code}<br>${r.plant.capacityDc} DC</small></div><div><strong>${r.role}</strong><small>${r.commercialScope}</small></div><div><strong>${r.buyer}</strong><small>${r.rate}</small></div><div><strong>${r.meter}</strong><small>Confirmed kWh · Monthly period close</small></div><div><strong>${profile.bank}</strong><small>${profile.iban}<br>${profile.currency}</small></div><div><span class="badge ${r.settlement.includes('Hold') || r.settlement.includes('Needs') ? 'warning' : 'success'}">${r.settlement}</span><small>Audit: last checked by Global Admin</small></div></div>`).join('')}
  </div>
  <div class="section-title-v17 mini"><div><h3>Settlement Audit</h3><p class="muted">Commercial and payment changes are sensitive and must stay traceable.</p></div></div>
  <div class="timeline-v17 commercial-client-audit-v90">
    <div><b>Commercial profile</b><span>${profile.model} linked to ${client.name}</span></div>
    <div><b>Energy sales</b><span>${profile.energyBuyer} · ${profile.saleRate} · ${profile.salesChannel}</span></div>
    <div><b>Payment destination</b><span>${profile.bank} · ${profile.currency} · ${profile.destination}</span></div>
    <div><b>Settlement rule</b><span>Monthly close uses confirmed metering records from assigned plants</span></div>
  </div>`;
}

function clientAlertsTab(client, plants) {
  const alerts = plants.flatMap(p => {
    const count = Number(p.alerts || 0);
    if (!count) return [];
    const severity = p.health === 'Fault' ? 'Critical' : 'Warning';
    const sourceDevice = (FleetClientModel.devicesForPlant(p.id).find(d => d.status === 'Warning' || d.status === 'Fault') || FleetClientModel.devicesForPlant(p.id)[0] || {}).name || 'Plant telemetry';
    return Array.from({ length: Math.min(count, 2) }, (_, i) => ({
      plant: p,
      title: i === 0 ? (p.health === 'Fault' ? 'Plant performance degraded' : 'Telemetry delayed') : 'Device requires attention',
      severity,
      source: i === 0 ? p.name : sourceDevice,
      time: i === 0 ? '2 min ago' : '14 min ago',
      status: i === 0 ? 'Open' : 'Acknowledged'
    }));
  });
  const critical = alerts.filter(a => a.severity === 'Critical').length;
  const warning = alerts.filter(a => a.severity === 'Warning').length;
  return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Active plant and device issues connected to this client. This is support context, not the full Tenant Alerts Center.</p></div><span class="badge ${alerts.length ? 'warning' : 'success'}">${alerts.length ? alerts.length + ' active' : 'Clear'}</span></div>
  <div class="info-grid">
    <div><span>Critical</span><strong>${critical}</strong><small>Needs immediate attention</small></div>
    <div><span>Warning</span><strong>${warning}</strong><small>Operational issue or delayed data</small></div>
    <div><span>Impacted Plants</span><strong>${new Set(alerts.map(a => a.plant.id)).size}</strong><small>Plants with active issues</small></div>
    <div><span>Primary Flow</span><strong>Alert → Plant → Device</strong><small>Escalation remains in Tenant/O&M workspace</small></div>
  </div>
  ${alerts.length ? `<div class="data-table compact-table client-alert-table-v40"><div class="data-head"><span>Alert</span><span>Severity</span><span>Plant</span><span>Source</span><span>Status</span></div>${alerts.map(a => `<div class="data-row" data-plant="${a.plant.id}"><div><strong>${a.title}</strong><small>${a.time}</small></div><div><span class="badge ${a.severity === 'Critical' ? 'danger' : 'warning'}">${a.severity}</span></div><div><strong>${a.plant.name}</strong><small>${a.plant.code}</small></div><div><strong>${a.source}</strong><small>Plant / device context</small></div><div><strong>${a.status}</strong><small>Open in plant workspace</small></div></div>`).join('')}</div>` : `<div class="empty-state"><strong>No active alerts</strong><small>Assigned plants do not currently report active issues.</small></div>`}`;
}

function clientActivityTab(client, plants) {
  const firstPlant = plants[0];
  return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Client-level timeline with only useful governance and support events.</p></div></div>
  <div class="timeline-v17 client-activity-v40">
    <div><b>Today</b><span>Client profile reviewed by Global Admin</span></div>
    <div><b>${client.activationAt || 'Recently'}</b><span>Client account activation generated</span></div>
    <div><b>This week</b><span>${plants.length ? `${plants.length} plant${plants.length === 1 ? '' : 's'} visible in client context` : 'No plants assigned yet'}</span></div>
    <div><b>This month</b><span>Portal access policy checked: ${client.accessScope || 'No scope configured'}</span></div>
    ${firstPlant ? `<div><b>Plant event</b><span>${firstPlant.name} reported ${firstPlant.alerts} active alert${firstPlant.alerts === 1 ? '' : 's'}</span></div>` : ''}
  </div>`;
}

function clientTab(client, plants, tab) {
  if (tab === 'identity') return clientIdentityTab(client);
  if (tab === 'location') return clientLocationPreferencesTab(client);
  if (tab === 'portal') return clientContactsPortalTab(client, plants);
  if (tab === 'users') return clientUsersAccessTab(client, plants);
  if (tab === 'plants') return clientPlantsTab(client, plants);
  if (tab === 'commercial') return clientCommercialPaymentsTab(client, plants);
  if (tab === 'alerts') return clientAlertsTab(client, plants);
  if (tab === 'activity') return clientActivityTab(client, plants);
  return clientOverviewTab(client, plants);
}

function renderPlantDetailPage() {
  const plant = FleetClientModel.selectedPlant();
  const client = FleetClientModel.getClient(plant.clientId);
  const devices = FleetClientModel.devicesForPlant(plant.id);
  FleetLayout.mount(`
    <section class="page-hero plant-hero-v17">
      <div><p class="eyebrow">Plant Detail · ${client.name}</p><h1>${plant.name}</h1><p class="muted">${plant.code} · ${plant.type} · ${plant.country}, ${plant.city}</p></div>
      <button class="freshness-card" id="backToClient" type="button"><span class="pulse"></span><div><strong>Back to Client</strong><small>${client.name}</small></div></button>
    </section>
    <section class="context-bar plant-context-v17"><div><span>Portfolio</span><strong>${plant.portfolio}</strong></div><div><span>Client / Managing Tenant</span><strong>${plant.owner} / ${plant.operator}</strong></div><div><span>Service / O&M Provider</span><strong>${plant.om}</strong></div><div><span>Data Freshness</span><strong>Last update 2 min ago</strong></div></section>
    <section class="kpi-grid plant-kpi-grid-v17">
      <article class="kpi-card cyan"><span class="kpi-label">Current Power</span><div class="kpi-value">${plant.powerNow}</div><small class="kpi-delta">Live plant production</small></article>
      <article class="kpi-card green"><span class="kpi-label">Today Energy</span><div class="kpi-value">${plant.energyToday}</div><small class="kpi-delta">Period metric</small></article>
      <article class="kpi-card blue"><span class="kpi-label">Capacity DC</span><div class="kpi-value">${plant.capacityDc}</div><small class="kpi-delta">Installed capacity</small></article>
      <article class="kpi-card yellow"><span class="kpi-label">Open Alerts</span><div class="kpi-value">${plant.alerts}</div><small class="kpi-delta">Plant-level incidents</small></article>
    </section>
    <section class="plant-workspace-v17">
      <aside class="glass-card plant-side-card-v17">
        <h3>Plant Workspace</h3>
        <button class="active" data-plant-tab="overview">Overview</button>
        <button data-plant-tab="structure">Plant Structure</button>
        <button data-plant-tab="energy">Energy & Telemetry</button>
        <button data-plant-tab="alerts">Alerts & Events</button>
        <button data-plant-tab="device">Devices & Device</button>
        <button data-plant-tab="inverters">Inverters</button>
        <button data-plant-tab="arrays">Arrays & Strings</button>
        ${plant.battery === 'Yes' || devices.some(d => d.type === 'Battery' || d.type === 'PCS') ? '<button data-plant-tab="batteries">BESS / PCS</button>' : ''}
        <button data-plant-tab="metering">Metering & Grid</button>
        <button data-plant-tab="gateways">Loggers & Gateways</button>
        <button data-plant-tab="reportsdocs">Reports & Documents</button>
        <button data-plant-tab="adminsync">Settings & Sync</button>
        <button data-plant-tab="activity">Activity</button>
      </aside>
      <section class="glass-card plant-main-card-v17"><div id="plantTabContent">${plantTab(plant, devices, 'overview')}</div></section>
    </section>
  `);
  document.getElementById('backToClient').onclick = () => { FleetClientModel.selectClient(client.id); location.href = 'client-detail.html'; };
  document.querySelectorAll('[data-plant-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-plant-tab]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('plantTabContent').innerHTML = plantTab(plant, devices, btn.dataset.plantTab);
    FleetLayout.enhanceActionMenus(document.getElementById('plantTabContent'));
  }));
  document.getElementById('plantTabContent').addEventListener('click', e => {
    const open = e.target.closest('[data-open-device]');
    const history = e.target.closest('[data-device-history]');
    if (open) {
      localStorage.setItem('fleetos_selected_device', open.dataset.openDevice);
      location.href = 'device-detail.html';
    }
    if (history) {
      localStorage.setItem('fleetos_selected_device', history.dataset.deviceHistory);
      location.href = 'device-detail.html#activity';
    }
  });
}

function deviceRows(items) {
  if (!items.length) return `<div class="empty-state"><strong>No device records</strong><small>This plant does not have this asset type in the current hierarchy model.</small></div>`;
  return `<div class="data-table plant-device-table-v17"><div class="data-head"><span>Object</span><span>Type / Vendor</span><span>Capacity / Model</span><span>Status</span><span>Traceability</span><span>Actions</span></div>${items.map(d => `<div class="data-row" data-device-id="${d.id}"><div><strong>${d.name}</strong><small>${d.id}<br>${d.serial}</small></div><div><strong>${d.type}</strong><small>${d.vendor}</small></div><div><strong>${d.capacity}</strong><small>${d.model}</small></div><div><span class="badge ${FleetClientModel.badge(d.status)}">${d.status}</span><small>Last seen ${d.lastSeen}</small></div><div><strong>${d.location}</strong><small>${d.children}</small></div><div class="row-actions"><button type="button" data-open-device="${d.id}">View Device</button><button type="button" data-device-history="${d.id}">Open History</button></div></div>`).join('')}</div>`;
}

function plantTab(plant, devices, tab) {
  const by = type => devices.filter(d => d.type === type || (type === 'Grid Device' && (d.type === 'Grid Device' || d.type === 'Switchgear')) || (type === 'Battery' && (d.type === 'Battery' || d.type === 'PCS')));
  if (tab === 'structure') return `<div class="section-title-v17"><div><h2>Plant Structure</h2><p class="muted">Hierarchical plant tree. This is the bridge between the plant and physical device.</p></div></div><div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Area A<ul><li>Inverter Group A<ul><li>MPPT 1–12</li><li>Strings 1–24</li></ul></li></ul></li><li>Area B<ul><li>Inverter Group B</li><li>Solar Array B</li></ul></li><li>Subplant<ul><li>Transformer</li><li>Metering point</li></ul></li>${plant.battery === 'Yes' ? '<li>Battery System<ul><li>BESS Container</li><li>BMS / PCS / HVAC</li></ul></li>' : ''}</ul></div>`;
  if (tab === 'energy') return `<div class="section-title-v17"><div><h2>Energy & Telemetry</h2><p class="muted">Plant-level live production, period energy and data freshness summary.</p></div></div><div class="info-grid"><div><span>Current Power</span><strong>${plant.powerNow}</strong></div><div><span>Today Energy</span><strong>${plant.energyToday}</strong></div><div><span>Installed Capacity DC</span><strong>${plant.capacityDc}</strong></div><div><span>Installed Capacity AC</span><strong>${plant.capacityAc}</strong></div><div><span>Last Data</span><strong>2 min ago</strong></div><div><span>Telemetry Quality</span><strong>${plant.health === 'Fault' ? 'Partial / delayed' : 'Fresh'}</strong></div></div><div class="chart-placeholder">Energy production chart placeholder · Today / Week / Month</div>`;
  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts & Events</h2><p class="muted">Plant-level incident entry point with severity and affected device context.</p></div></div><div class="info-grid"><div><span>Open Alerts</span><strong>${plant.alerts}</strong></div><div><span>Health</span><strong>${plant.health}</strong></div><div><span>Primary Scope</span><strong>Plant / Device</strong></div><div><span>Workflow</span><strong>Alert → SOP → Task</strong></div></div><div class="data-table compact-table plant-alert-table-v17"><div class="data-head"><span>Alert</span><span>Severity</span><span>Source</span><span>Status</span></div><div class="data-row"><div><strong>${plant.alerts ? 'Telemetry delayed' : 'No active issues'}</strong><small>${plant.name}</small></div><div><span class="badge ${plant.alerts ? 'warning' : 'success'}">${plant.alerts ? 'Warning' : 'Normal'}</span></div><div><span>${plant.alerts ? 'Device / Integration' : 'System'}</span></div><div><span>${plant.alerts ? 'Open' : 'Clear'}</span></div></div></div>`;
  if (tab === 'device') return `<div class="section-title-v17"><div><h2>Devices & Device</h2><p class="muted">Full device registry for this plant. Use specific tabs for focused views.</p></div></div>${deviceRows(devices)}`;
  if (tab === 'arrays') return `<div class="section-title-v17"><div><h2>Arrays & Strings</h2><p class="muted">PV module and string hierarchy linked to inverter / MPPT structure.</p></div></div><div class="info-grid"><div><span>Panels</span><strong>${plant.panels.toLocaleString()}</strong></div><div><span>Strings</span><strong>${plant.strings}</strong></div><div><span>Associated Inverters</span><strong>${plant.inverters}</strong></div><div><span>Traceability</span><strong>Plant → Area → Inverter → MPPT → String</strong></div></div>`;
  if (tab === 'metering') return `<div class="section-title-v17"><div><h2>Metering & Grid</h2><p class="muted">Metering points, transformers, switchgear, grid interface and weather context.</p></div></div>${deviceRows(devices.filter(d => d.type === 'Meter' || d.type === 'Grid Device' || d.type === 'Switchgear' || d.type === 'Weather Station'))}`;
  if (tab === 'reportsdocs') return `<div class="section-title-v17"><div><h2>Reports & Documents</h2><p class="muted">Plant-level reports, exports, drawings and technical documents.</p></div></div><div class="document-grid-v17"><article><strong>Daily Production Summary</strong><small>Generated today · Energy</small></article><article><strong>Monthly Performance Report</strong><small>Scheduled · PDF/XLSX</small></article><article><strong>Single Line Diagram.pdf</strong><small>Electrical Drawings</small></article><article><strong>Commissioning Report.pdf</strong><small>Commissioning</small></article><article><strong>Device Manuals.zip</strong><small>Manufacturer Manuals</small></article><article><strong>Warranty Documents.pdf</strong><small>Warranty</small></article></div>`;
  if (tab === 'adminsync') return `<div class="section-title-v17"><div><h2>Settings & Sync</h2><p class="muted">Read-only plant configuration, lifecycle and external source traceability.</p></div></div><div class="info-grid"><div><span>Timezone</span><strong>${plant.timezone}</strong></div><div><span>Grid Capacity</span><strong>${plant.gridCapacity}</strong></div><div><span>Service / O&M Provider</span><strong>${plant.om}</strong></div><div><span>Battery Installed</span><strong>${plant.battery}</strong></div><div><span>FleetOS Plant ID</span><strong>${plant.id}</strong></div><div><span>External Plant ID</span><strong>${plant.externalId}</strong></div><div><span>Last Sync</span><strong>2 min ago</strong></div><div><span>Data Freshness</span><strong>${plant.health === 'Fault' ? 'Delayed' : 'Fresh'}</strong></div></div>`;
  if (tab === 'inverters') return `<div class="section-title-v17"><div><h2>Inverters</h2><p class="muted">Inverter registry with MPPT and string traceability.</p></div></div>${deviceRows(by('Inverter'))}`;
  if (tab === 'batteries') return `<div class="section-title-v17"><div><h2>Batteries</h2><p class="muted">BESS / PCS devices are separated because storage has SOC, SOH, cycle and safety logic.</p></div></div>${deviceRows(by('Battery'))}`;
  if (tab === 'meters') return `<div class="section-title-v17"><div><h2>Meters</h2><p class="muted">Import, export and bidirectional metering points.</p></div></div>${deviceRows(by('Meter'))}`;
  if (tab === 'weather') return `<div class="section-title-v17"><div><h2>Weather Stations</h2><p class="muted">Irradiance, ambient temperature, module temperature, wind and humidity sensors.</p></div></div>${deviceRows(by('Weather Station'))}`;
  if (tab === 'grid') return `<div class="section-title-v17"><div><h2>Grid Device</h2><p class="muted">Transformer, switchgear and grid interface devices.</p></div></div>${deviceRows(by('Grid Device'))}`;
  if (tab === 'gateways') return `<div class="section-title-v17"><div><h2>Loggers & Gateways</h2><p class="muted">Communication devices that collect child-device telemetry and forward it to FleetOS through vendor connectors.</p></div></div>${deviceRows(devices.filter(d => d.type === 'Logger' || d.type === 'Gateway'))}`;
  if (tab === 'modules') return `<div class="section-title-v17"><div><h2>Solar Modules</h2><p class="muted">Module registry summary. Full import/edit workflow will come later.</p></div></div><div class="info-grid"><div><span>Panels</span><strong>${plant.panels.toLocaleString()}</strong></div><div><span>Technology</span><strong>Mono / Poly mixed</strong></div><div><span>Rated Power</span><strong>540 Wp average</strong></div><div><span>Status</span><strong>Active with warranty tracking</strong></div></div>`;
  if (tab === 'strings') return `<div class="section-title-v17"><div><h2>Strings & Arrays</h2><p class="muted">String registry is linked to inverter and MPPT hierarchy.</p></div></div><div class="info-grid"><div><span>Strings</span><strong>${plant.strings}</strong></div><div><span>Associated Inverters</span><strong>${plant.inverters}</strong></div><div><span>Orientation</span><strong>South / East-West groups</strong></div><div><span>Traceability</span><strong>Plant → Area → Inverter → MPPT → String</strong></div></div>`;
  if (tab === 'reports') return `<div class="section-title-v17"><div><h2>Reports</h2><p class="muted">Plant-level exports and periodic summaries connected to the reporting workspace.</p></div></div><div class="document-grid-v17"><article><strong>Daily Production Summary</strong><small>Generated today · Energy</small></article><article><strong>Monthly Performance Report</strong><small>Scheduled · PDF/XLSX</small></article><article><strong>Alert History Export</strong><small>On demand · Events</small></article></div>`;
  if (tab === 'documents') return `<div class="section-title-v17"><div><h2>Documents</h2><p class="muted">Plant-level technical documents and drawings.</p></div></div><div class="document-grid-v17"><article><strong>Single Line Diagram.pdf</strong><small>Electrical Drawings</small></article><article><strong>Commissioning Report.pdf</strong><small>Commissioning</small></article><article><strong>Device Manuals.zip</strong><small>Manufacturer Manuals</small></article><article><strong>Warranty Documents.pdf</strong><small>Warranty</small></article></div>`;
  if (tab === 'settings') return `<div class="section-title-v17"><div><h2>Settings Snapshot</h2><p class="muted">Read-only plant configuration context. Deep editing belongs to Settings / Admin Console.</p></div></div><div class="info-grid"><div><span>Timezone</span><strong>${plant.timezone}</strong></div><div><span>Grid Capacity</span><strong>${plant.gridCapacity}</strong></div><div><span>Service / O&M Provider</span><strong>${plant.om}</strong></div><div><span>Battery Installed</span><strong>${plant.battery}</strong></div><div><span>Notifications</span><strong>Plant alerts enabled</strong></div><div><span>Control Actions</span><strong>Capability-gated</strong></div></div>`;
  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Traceability between FleetOS plant record and external vendor source.</p></div></div><div class="info-grid"><div><span>FleetOS Plant ID</span><strong>${plant.id}</strong></div><div><span>External Plant ID</span><strong>${plant.externalId}</strong></div><div><span>Source System</span><strong>${plant.externalId?.startsWith('HUA') ? 'Huawei FusionSolar' : plant.externalId?.startsWith('SUN') ? 'Sungrow / iSolarCloud' : plant.externalId?.startsWith('SE') ? 'SolarEdge' : 'Vendor connector'}</strong></div><div><span>Last Sync</span><strong>2 min ago</strong></div><div><span>Data Freshness</span><strong>${plant.health === 'Fault' ? 'Delayed' : 'Fresh'}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div></div>`;
  if (tab === 'gis') return `<div class="section-title-v17"><div><h2>GIS Map</h2><p class="muted">Map placeholder for plant boundary, device locations and grid connection points.</p></div></div><div class="gis-map-v17"><span class="gis-dot-v17 inv">INV</span><span class="gis-dot-v17 meter">MTR</span><span class="gis-dot-v17 wx">WX</span><span class="gis-dot-v17 tr">GRID</span></div>`;
  if (tab === 'lifecycle') return `<div class="section-title-v17"><div><h2>Asset Lifecycle</h2><p class="muted">Lifecycle state across plant and device.</p></div></div><div class="info-grid"><div><span>Plant Status</span><strong>${plant.status}</strong></div><div><span>Commissioning Date</span><strong>${plant.commissioning}</strong></div><div><span>Last Inspection</span><strong>2026-05-22</strong></div><div><span>Expected Useful Life</span><strong>25 years</strong></div></div>`;
  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Recent plant-level operational and governance timeline.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Telemetry snapshot refreshed for ${plant.name}</span></div><div><b>Yesterday</b><span>Plant device hierarchy reviewed</span></div><div><b>03 Jun</b><span>External source mapping confirmed: ${plant.externalId}</span></div></div>`;
  return `<div class="section-title-v17"><div><h2>Plant Overview</h2><p class="muted">Master data, location and technical characteristics for this plant.</p></div></div><div class="info-grid"><div><span>Plant ID</span><strong>${plant.id}</strong></div><div><span>External Plant ID</span><strong>${plant.externalId}</strong></div><div><span>Plant Status</span><strong>${plant.status}</strong></div><div><span>Plant Type</span><strong>${plant.type}</strong></div><div><span>Location</span><strong>${plant.country}, ${plant.region}, ${plant.city}</strong></div><div><span>Address</span><strong>${plant.address}</strong></div><div><span>Commissioning Date</span><strong>${plant.commissioning}</strong></div><div><span>Installed Capacity AC</span><strong>${plant.capacityAc}</strong></div><div><span>Grid Connection Capacity</span><strong>${plant.gridCapacity}</strong></div><div><span>Battery Installed</span><strong>${plant.battery}</strong></div></div><div class="section-title-v17 mini"><div><h3>Device Summary</h3><p class="muted">Quick view before opening specific asset tabs.</p></div></div>${deviceRows(devices)}`;
}

function selectedFleetDevice() {
  const id = localStorage.getItem('fleetos_selected_device') || 'INV-ARM-001';
  return FleetClientModel.devices.find(d => d.id === id) || FleetClientModel.devices.find(d => d.type === 'Inverter') || FleetClientModel.devices[0];
}

function devicePowerValue(device) {
  const num = parseInt(String(device.capacity || '0').replace(/[^0-9]/g, ''), 10) || 125;
  if (device.status === 'Warning') return Math.round(num * 0.62) + ' kW';
  if (device.status === 'Fault') return '0 kW';
  return Math.round(num * 0.78) + ' kW';
}

function renderDeviceDetailPage() {
  const device = selectedFleetDevice();
  const plant = FleetClientModel.getPlant(device.plantId) || FleetClientModel.selectedPlant();
  const client = FleetClientModel.getClient(plant.clientId);
  const siblings = FleetClientModel.devicesForPlant(plant.id);
  const isInverter = device.type === 'Inverter';
  const isMeter = device.type === 'Meter';
  const isPcs = device.type === 'PCS';
  const isBess = device.type === 'Battery';
  const isWeather = device.type === 'Weather Station';
  const isLogger = device.type === 'Logger' || device.type === 'Gateway';
  const isTransformer = isTransformerDevice(device);
  const isSwitchgear = isSwitchgearDevice(device);

  FleetLayout.mount(`
    <section class="page-hero device-hero-v19">
      <div>
        <p class="eyebrow">Device Detail · ${plant.name}</p>
        <h1>${device.name}</h1>
        <p class="muted">${device.id} · ${device.type} · ${device.vendor} ${device.model}</p>
      </div>
      <div class="hero-actions-v19">
        <button class="small-btn ghost" id="backToPlant" type="button">Back to Plant</button>
        <button class="small-btn" id="openDeviceAlerts" type="button">View Alerts</button>
      </div>
    </section>
    <section class="context-bar device-context-v19">
      <div><span>Owning Client</span><strong>${client.name}</strong></div>
      <div><span>Plant</span><strong>${plant.name}</strong></div>
      <div><span>Location</span><strong>${device.location}</strong></div>
      <div><span>Last Communication</span><strong>${device.lastSeen}</strong></div>
    </section>
    <section class="kpi-grid device-kpi-grid-v19">
      <article class="kpi-card ${device.status === 'Warning' ? 'yellow' : 'green'}"><span class="kpi-label">Status</span><div class="kpi-value">${device.status}</div><small class="kpi-delta">Connectivity and operational state</small></article>
      <article class="kpi-card cyan"><span class="kpi-label">${isLogger ? 'Signal / Uplink' : isSwitchgear ? 'Breaker / Feeder' : isTransformer ? 'Load / Temp' : 'Current Power'}</span><div class="kpi-value">${isInverter ? devicePowerValue(device) : isPcs ? pcsDerivedMetrics(device).acPower : isBess ? bessDerivedMetrics(device).flowPower : isLogger ? loggerDerivedMetrics(device).signal : isSwitchgear ? switchgearDerivedMetrics(device).breakerState : isTransformer ? transformerDerivedMetrics(device).load : device.capacity}</div><small class="kpi-delta">Type-specific live value</small></article>
      <article class="kpi-card blue"><span class="kpi-label">Rated Capacity</span><div class="kpi-value">${device.capacity}</div><small class="kpi-delta">Technical passport value</small></article>
      <article class="kpi-card yellow"><span class="kpi-label">Open Alerts</span><div class="kpi-value">${device.status === 'Warning' ? 1 : 0}</div><small class="kpi-delta">Device-level incidents</small></article>
    </section>
    <section class="device-workspace-v19">
      <aside class="glass-card device-side-card-v19">
        <h3>${device.type} Workspace</h3>
        <button class="active" data-device-tab="overview">Overview</button>
        ${isMeter ? '<button data-device-tab="accounting">Energy Accounting</button><button data-device-tab="importExport">Import / Export</button><button data-device-tab="tariffs">Tariffs</button>' : isPcs ? '<button data-device-tab="conversion">Power Conversion</button><button data-device-tab="charge">Charge / Discharge</button><button data-device-tab="connectedBess">Connected BESS</button><button data-device-tab="grid">Grid Connection</button>' : isBess ? '<button data-device-tab="soc">SOC / SOH</button><button data-device-tab="charge">Charge / Discharge</button><button data-device-tab="pcs">PCS</button><button data-device-tab="racks">Racks / Modules</button>' : isWeather ? '<button data-device-tab="irradiance">Irradiance</button><button data-device-tab="temperature">Temperature</button><button data-device-tab="wind">Wind</button><button data-device-tab="sensors">Sensors</button>' : isLogger ? '<button data-device-tab="connectivity">Connectivity</button><button data-device-tab="linked">Linked Devices</button><button data-device-tab="sync">Sync & Freshness</button><button data-device-tab="network">Network</button>' : isSwitchgear ? '<button data-device-tab="breakers">Breakers</button><button data-device-tab="feeders">Feeders</button><button data-device-tab="events">Protection Events</button><button data-device-tab="commands">Commands</button>' : isTransformer ? '<button data-device-tab="measurements">Electrical Measurements</button><button data-device-tab="protection">Protection Events</button><button data-device-tab="grid">Grid / Feeders</button>' : '<button data-device-tab="telemetry">Telemetry</button>'}
        <button data-device-tab="alerts">Alerts</button>
        <button data-device-tab="topology">Topology</button>
        ${isInverter ? '<button data-device-tab="mppt">MPPT / Strings</button>' : ''}
        <button data-device-tab="passport">Technical Passport</button>
        <button data-device-tab="source">Source & Sync</button>
        <button data-device-tab="activity">Activity</button>
      </aside>
      <section class="glass-card device-main-card-v19"><div id="deviceTabContent">${deviceDetailTab(device, plant, siblings, 'overview')}</div></section>
    </section>
  `);
  document.getElementById('backToPlant').onclick = () => { FleetClientModel.selectPlant(plant.id); location.href = 'plant-detail.html'; };
  document.getElementById('openDeviceAlerts').onclick = () => FleetLayout.toast('Device alerts context selected: ' + device.id);
  document.querySelectorAll('[data-device-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-device-tab]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('deviceTabContent').innerHTML = deviceDetailTab(device, plant, siblings, btn.dataset.deviceTab);
  }));
  if (location.hash === '#activity') document.querySelector('[data-device-tab="activity"]')?.click();
  document.getElementById('deviceTabContent').addEventListener('click', e => {
    const stringBtn = e.target.closest('[data-open-string]');
    if (stringBtn) {
      openStringDrawer(device, stringBtn.dataset.openString, stringBtn.dataset.parentMppt || 'MPPT 1');
      return;
    }
    const mpptBtn = e.target.closest('[data-open-mppt]');
    if (mpptBtn) {
      openMpptDrawer(device, mpptBtn.dataset.openMppt);
      return;
    }
    const open = e.target.closest('[data-open-device]');
    if (!open) return;
    localStorage.setItem('fleetos_selected_device', open.dataset.openDevice);
    location.href = 'device-detail.html';
  });
}

function inverterDerivedMetrics(device) {
  const rated = parseInt(String(device.capacity || '0').replace(/[^0-9]/g, ''), 10) || 125;
  const degraded = device.status === 'Warning';
  return {
    rated,
    currentPower: degraded ? Math.round(rated * 0.62) : Math.round(rated * 0.78),
    dailyYield: degraded ? '0.96 MWh' : '1.42 MWh',
    monthlyYield: degraded ? '23.8 MWh' : '38.4 MWh',
    lifetimeYield: degraded ? '412 MWh' : '684 MWh',
    efficiency: degraded ? '96.1%' : '98.4%',
    temperature: degraded ? '58°C' : '43°C',
    dcPower: degraded ? Math.round(rated * 0.66) + ' kW' : Math.round(rated * 0.83) + ' kW',
    acPower: degraded ? Math.round(rated * 0.62) + ' kW' : Math.round(rated * 0.78) + ' kW',
    dcVoltage: degraded ? '768 V' : '812 V',
    acVoltage: '400 V',
    current: degraded ? '156 A' : '211 A',
    frequency: '50.0 Hz',
    freshness: degraded ? 'Delayed' : 'Fresh'
  };
}

function miniBarChartV20(values) {
  const max = Math.max(...values, 1);
  return `<div class="mini-bar-chart-v20">${values.map((v, i) => `<span style="height:${Math.max(12, Math.round(v / max * 100))}%" title="Hour ${i + 1}: ${v}"></span>`).join('')}</div>`;
}

function inverterMetricCards(device) {
  const m = inverterDerivedMetrics(device);
  return `<div class="device-metric-grid-v20">
    <article><span>Current Power</span><strong>${m.currentPower} kW</strong><small>Live AC output</small></article>
    <article><span>Daily Yield</span><strong>${m.dailyYield}</strong><small>Today</small></article>
    <article><span>Monthly Yield</span><strong>${m.monthlyYield}</strong><small>Current month</small></article>
    <article><span>Lifetime Yield</span><strong>${m.lifetimeYield}</strong><small>Since commissioning</small></article>
    <article><span>Efficiency</span><strong>${m.efficiency}</strong><small>Estimated conversion efficiency</small></article>
    <article><span>Temperature</span><strong>${m.temperature}</strong><small>Internal sensor</small></article>
  </div>`;
}


function meterDerivedMetrics(device) {
  const bidirectional = String(device.capacity || '').toLowerCase().includes('bi');
  return {
    currentImport: bidirectional ? '18.4 kW' : '0.0 kW',
    currentExport: bidirectional ? '112.8 kW' : '128.6 kW',
    dailyImport: bidirectional ? '42.7 kWh' : '0.0 kWh',
    dailyExport: bidirectional ? '1.84 MWh' : '2.12 MWh',
    netEnergy: bidirectional ? '+1.79 MWh' : '+2.12 MWh',
    accuracy: device.vendor === 'Janitza' ? 'Class 0.5S' : 'Class 0.2S',
    profile: bidirectional ? 'Commercial bidirectional metering' : 'Export settlement metering',
    freshness: device.status === 'Warning' ? 'Delayed' : 'Fresh'
  };
}

function meterMetricCards(device) {
  const m = meterDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 meter-metric-grid-v21">
    <article><span>Current Import</span><strong>${m.currentImport}</strong><small>Grid to plant</small></article>
    <article><span>Current Export</span><strong>${m.currentExport}</strong><small>Plant to grid</small></article>
    <article><span>Daily Import</span><strong>${m.dailyImport}</strong><small>Accounting period today</small></article>
    <article><span>Daily Export</span><strong>${m.dailyExport}</strong><small>Accounting period today</small></article>
    <article><span>Net Energy</span><strong>${m.netEnergy}</strong><small>Export minus import</small></article>
    <article><span>Communication</span><strong>${device.status}</strong><small>Last seen ${device.lastSeen}</small></article>
  </div>`;
}

function meterAccountingRows(device) {
  const warning = device.status === 'Warning';
  const rows = [
    ['Today 00:00–06:00', warning ? '18.4 kWh' : '6.2 kWh', warning ? '421.8 kWh' : '532.4 kWh', warning ? '+403.4 kWh' : '+526.2 kWh', warning ? 'Partial' : 'Confirmed'],
    ['Today 06:00–12:00', warning ? '24.3 kWh' : '9.8 kWh', warning ? '738.2 kWh' : '891.6 kWh', warning ? '+713.9 kWh' : '+881.8 kWh', warning ? 'Delayed' : 'Confirmed'],
    ['Yesterday', '51.2 kWh', '2.04 MWh', '+1.99 MWh', 'Confirmed'],
    ['Current month', '0.84 MWh', '38.6 MWh', '+37.8 MWh', 'Confirmed']
  ];
  return `<div class="data-table compact-table meter-accounting-table-v21"><div class="data-head"><span>Period</span><span>Import</span><span>Export</span><span>Net</span><span>Status</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span>${r[1]}</span></div><div><span>${r[2]}</span></div><div><strong>${r[3]}</strong></div><div><span class="badge ${r[4] === 'Confirmed' ? 'success' : 'warning'}">${r[4]}</span></div></div>`).join('')}</div>`;
}

function meterDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const m = meterDerivedMetrics(device);
  const warningRow = device.status === 'Warning';

  if (tab === 'accounting') return `<div class="section-title-v17"><div><h2>Energy Accounting</h2><p class="muted">Confirmed import/export records used for reporting, billing and reconciliation.</p></div></div>${meterAccountingRows(device)}
    <div class="section-title-v17 mini"><div><h3>Accounting rule</h3><p class="muted">Meter records are period-based facts. They are separate from live monitoring and should be auditable before they feed billing.</p></div></div>`;

  if (tab === 'importExport') return `<div class="section-title-v17"><div><h2>Import / Export</h2><p class="muted">Grid exchange view for this metering point.</p></div></div>
    <div class="telemetry-layout-v20">
      <div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Export profile · Today</strong><small>kWh by interval</small></div>${miniBarChartV20([8,14,32,78,116,138,126,102,64,24])}</div>
      <div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Import profile · Today</strong><small>kWh by interval</small></div>${miniBarChartV20([6,5,4,3,2,2,3,5,7,8])}</div>
    </div>
    <div class="info-grid compact-info-v20"><div><span>Current Import</span><strong>${m.currentImport}</strong></div><div><span>Current Export</span><strong>${m.currentExport}</strong></div><div><span>Daily Import</span><strong>${m.dailyImport}</strong></div><div><span>Daily Export</span><strong>${m.dailyExport}</strong></div><div><span>Net Exchange</span><strong>${m.netEnergy}</strong></div><div><span>Direction</span><strong>Exporting</strong></div></div>`;

  if (tab === 'tariffs') return `<div class="section-title-v17"><div><h2>Tariffs</h2><p class="muted">Commercial profile linked to this meter for revenue, settlements and billing.</p></div></div>
    <div class="info-grid"><div><span>Tariff Profile</span><strong>Commercial Feed-in 2026</strong></div><div><span>Feed-in Tariff</span><strong>€0.087 / kWh</strong></div><div><span>Import Cost</span><strong>€0.142 / kWh</strong></div><div><span>Billing Period</span><strong>Monthly</strong></div><div><span>Settlement Rule</span><strong>Net export by confirmed meter records</strong></div><div><span>Revenue Link</span><strong>Finance & Tariffs</strong></div></div>`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Metering issues usually affect accounting, reporting and billing confidence.</p></div></div>
    <div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div>
      <div class="data-row"><div><strong>${warningRow ? 'Meter reading delayed' : 'No active metering issues'}</strong><small>${device.name}</small></div><div>${warningRow ? '<span class="badge warning">Warning</span>' : '<span class="badge success">Normal</span>'}</div><div><span>${warningRow ? device.lastSeen : 'Now'}</span></div><div><span>${warningRow ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${warningRow ? 'Open Alert' : 'View History'}</button></div></div>
    </div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Meter belongs to the plant metering/grid layer, not under an inverter.</p></div></div>
    <div class="topology-path-v20"><span>Tenant</span><b>→</b><span>${plant.name}</span><b>→</b><span>Grid Connection</span><b>→</b><span>${device.name}</span></div>
    <div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Subplant / POI<ul><li>Transformer</li><li>${device.type} · ${device.name}<ul><li>Import channel</li><li>Export channel</li><li>Accounting records</li></ul></li><li>Grid interface</li></ul></li></ul></div>
    <div class="section-title-v17 mini"><div><h3>Related device</h3><p class="muted">Inverters and BESS feed the plant energy flow; meter records the confirmed exchange with the grid.</p></div></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static metering device data.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Meter Type</span><strong>${device.capacity}</strong></div><div><span>Accuracy Class</span><strong>${m.accuracy}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>Installation Point</span><strong>${device.location}</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage and freshness for metering records.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} metering connector</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical meter</strong></div><div><span>Accounting Freshness</span><strong>${m.freshness}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Import · Export · Accounting · Alerts</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Meter replacement, reading quality, sync and audit events.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Meter interval records imported and normalized</span></div><div><b>Today</b><span>${warningRow ? 'Delayed reading flagged for accounting review' : 'Accounting records confirmed'}</span></div><div><b>Yesterday</b><span>Tariff profile checked against Finance & Tariffs</span></div><div><b>03 Jun</b><span>Meter mapped to ${plant.name} grid connection point</span></div><div><b>01 Jun</b><span>Technical passport verified</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Meter Overview</h2><p class="muted">Grid exchange, confirmed accounting records, tariff linkage and source traceability.</p></div></div>
    ${meterMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Metering Role</span><strong>${m.profile}</strong><small>${device.children}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>Meter level rule</h3><p class="muted">Meter devices usually live at grid connection, subplant or consumption/export points. They produce accounting records and commercial facts, not MPPT/String hierarchy.</p></div></div>`;
}


function bessDerivedMetrics(device) {
  const isPcs = device.type === 'PCS';
  const warning = device.status === 'Warning';
  const fault = device.status === 'Fault';
  return {
    soc: fault ? '18%' : warning ? '42%' : '76%',
    soh: fault ? '91%' : warning ? '94%' : '97%',
    flowPower: isPcs ? (warning ? '280 kW' : '430 kW') : fault ? '0 kW' : warning ? '180 kW' : '320 kW',
    mode: fault ? 'Protection' : warning ? 'Discharge limited' : 'Charge / Discharge ready',
    chargePower: fault ? '0 kW' : warning ? '120 kW' : '360 kW',
    dischargePower: fault ? '0 kW' : warning ? '180 kW' : '420 kW',
    temperature: fault ? '41°C' : warning ? '38°C' : '31°C',
    cycles: fault ? '812' : warning ? '604' : '428',
    racks: device.capacity && device.capacity.includes('2 MWh') ? 8 : device.capacity && device.capacity.includes('1 MWh') ? 6 : 4,
    modules: device.capacity && device.capacity.includes('2 MWh') ? 64 : device.capacity && device.capacity.includes('1 MWh') ? 48 : 32,
    freshness: fault ? 'Stale' : warning ? 'Delayed' : 'Fresh'
  };
}

function bessMetricCards(device) {
  const m = bessDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 bess-metric-grid-v22">
    <article><span>SOC</span><strong>${m.soc}</strong><small>State of charge</small></article>
    <article><span>SOH</span><strong>${m.soh}</strong><small>Battery health</small></article>
    <article><span>Power Flow</span><strong>${m.flowPower}</strong><small>Active charge/discharge</small></article>
    <article><span>Mode</span><strong>${m.mode}</strong><small>Operating state</small></article>
    <article><span>Temperature</span><strong>${m.temperature}</strong><small>Thermal system</small></article>
    <article><span>Cycles</span><strong>${m.cycles}</strong><small>Lifetime cycles</small></article>
  </div>`;
}

function bessRacksTable(device) {
  const m = bessDerivedMetrics(device);
  return `<div class="data-table compact-table bess-rack-table-v22"><div class="data-head"><span>Rack</span><span>Modules</span><span>SOC</span><span>Temp</span><span>Status</span><span>Action</span></div>${Array.from({length:m.racks}).map((_,i)=>`<div class="data-row"><div><strong>Rack ${i+1}</strong><small>${device.id}-RACK-${i+1}</small></div><div><strong>${Math.round(m.modules / m.racks)} modules</strong><small>Cell groups monitored</small></div><div><span>${Math.max(12, parseInt(m.soc) - (i%3)*2)}%</span></div><div><span>${30 + (i%4)}°C</span></div><div><span class="badge ${(device.status === 'Fault' && i===0) || (device.status === 'Warning' && i===1) ? 'warning' : 'success'}">${(device.status === 'Fault' && i===0) ? 'Protection' : (device.status === 'Warning' && i===1) ? 'Check' : 'Normal'}</span></div><div><button class="small-btn" type="button">Open Rack</button></div></div>`).join('')}</div>`;
}

function bessDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const m = bessDerivedMetrics(device);
  const hasIssue = device.status === 'Warning' || device.status === 'Fault';

  if (tab === 'soc') return `<div class="section-title-v17"><div><h2>SOC / SOH</h2><p class="muted">Battery health and availability overview. SOC is operational; SOH is lifecycle condition.</p></div></div>
    ${bessMetricCards(device)}
    <div class="telemetry-layout-v20"><div class="chart-card-v20"><div class="chart-card-head-v20"><strong>SOC curve · Today</strong><small>State of charge</small></div>${miniBarChartV20(hasIssue ? [66,62,58,53,49,45,42,39,34,28] : [38,44,56,68,76,82,79,73,67,61])}</div><div class="info-grid compact-info-v20"><div><span>SOC</span><strong>${m.soc}</strong></div><div><span>SOH</span><strong>${m.soh}</strong></div><div><span>Availability</span><strong>${device.status === 'Fault' ? 'Limited' : 'Available'}</strong></div><div><span>Thermal State</span><strong>${m.temperature}</strong></div><div><span>Cycle Count</span><strong>${m.cycles}</strong></div><div><span>Freshness</span><strong>${m.freshness}</strong></div></div></div>`;

  if (tab === 'charge') return `<div class="section-title-v17"><div><h2>Charge / Discharge</h2><p class="muted">Current storage operating mode and power direction. Commands are capability-gated and audited.</p></div></div>
    <div class="device-overview-grid-v19"><article><span>Operating Mode</span><strong>${m.mode}</strong><small>Capability-driven state</small></article><article><span>Charge Power</span><strong>${m.chargePower}</strong><small>Solar/grid to battery</small></article><article><span>Discharge Power</span><strong>${m.dischargePower}</strong><small>Battery to load/grid</small></article><article><span>Command Safety</span><strong>Approval required</strong><small>Remote actions audited</small></article></div>
    <div class="data-table compact-table bess-command-table-v22"><div class="data-head"><span>Mode</span><span>Direction</span><span>Limit</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>Charge</strong><small>Accept energy into BESS</small></div><div><span>Grid / PV → Battery</span></div><div><span>Max ${m.chargePower}</span></div><div><span class="badge success">Available</span></div><div><button class="small-btn" type="button">View Command</button></div></div><div class="data-row"><div><strong>Discharge</strong><small>Release energy from BESS</small></div><div><span>Battery → Grid / Load</span></div><div><span>Max ${m.dischargePower}</span></div><div><span class="badge ${hasIssue ? 'warning' : 'success'}">${hasIssue ? 'Limited' : 'Available'}</span></div><div><button class="small-btn" type="button">View Command</button></div></div></div>`;

  if (tab === 'pcs') return `<div class="section-title-v17"><div><h2>PCS</h2><p class="muted">Power Conversion System bridge between DC battery bus and AC plant/grid side.</p></div></div>
    <div class="asset-tree-v17"><div>BESS · ${device.name}</div><ul><li>PCS / Converter<ul><li>DC bus</li><li>AC output</li><li>Protection relays</li><li>Cooling loop</li></ul></li></ul></div>
    <div class="info-grid"><div><span>PCS Linked</span><strong>${siblings.find(x => x.type === 'PCS')?.name || (device.type === 'PCS' ? device.name : 'PCS Controller')}</strong></div><div><span>Rated Power</span><strong>${device.type === 'PCS' ? device.capacity : '500 kW'}</strong></div><div><span>DC Bus</span><strong>Nominal 750 V</strong></div><div><span>AC Output</span><strong>400 V / 50 Hz</strong></div><div><span>Protection</span><strong>${hasIssue ? 'Check required' : 'Normal'}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div></div>${siblings.find(x => x.type === 'PCS') ? `<div class="inline-actions-v24"><button class="small-btn" type="button" data-open-device="${siblings.find(x => x.type === 'PCS').id}">Open PCS Detail</button></div>` : ''}`;

  if (tab === 'racks') return `<div class="section-title-v17"><div><h2>Racks / Modules</h2><p class="muted">BESS internal topology. Racks contain modules, modules contain monitored cell groups.</p></div></div>
    <div class="topology-path-v20"><span>Plant</span><b>→</b><span>BESS</span><b>→</b><span>Container</span><b>→</b><span>Rack</span><b>→</b><span>Module</span><b>→</b><span>Cell Group</span></div>${bessRacksTable(device)}`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Battery and PCS events connected to SOP, tasks and work orders.</p></div></div>
    <div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${hasIssue ? 'BESS availability reduced' : 'No active battery issues'}</strong><small>${device.name}</small></div><div>${hasIssue ? '<span class="badge warning">Warning</span>' : '<span class="badge success">Normal</span>'}</div><div><span>${hasIssue ? device.lastSeen : 'Now'}</span></div><div><span>${hasIssue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${hasIssue ? 'Open SOP' : 'View History'}</button></div></div>${device.status === 'Fault' ? '<div class="data-row"><div><strong>Rack protection state</strong><small>Rack 1 · BMS</small></div><div><span class="badge warning">Critical</span></div><div><span>35 min ago</span></div><div><span>Open</span></div><div><button class="small-btn" type="button">Create Work Order</button></div></div>' : ''}</div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Storage hierarchy and plant-level sibling devices.</p></div></div>
    <div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Storage Yard<ul><li>${device.type} · ${device.name}<ul><li>BMS</li><li>PCS link</li><li>Rack 1–${m.racks}</li><li>Module groups</li><li>Thermal system / HVAC</li></ul></li></ul></li></ul></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static BESS master data, separate from live battery telemetry.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Rated Capacity</span><strong>${device.capacity}</strong></div><div><span>Firmware / BMS</span><strong>${device.firmware}</strong></div><div><span>Battery Chemistry</span><strong>LFP</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Warranty</span><strong>Active · 10 years / cycles based</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage and capability flags for storage telemetry and commands.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} connector</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>BESS canonical model mapped</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Capability Flags</span><strong>SOC · SOH · BMS alerts · Commands gated</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">BESS operational timeline, command audit and lifecycle events.</p></div></div><div class="status-timeline-v20"><div class="chart-card-head-v20"><strong>Status timeline</strong><small>Last 24 hours</small></div><div class="status-steps-v20"><span class="ok">Available</span><span class="ok">Charge</span><span class="ok">Discharge</span><span class="${hasIssue ? 'warn' : 'ok'}">${hasIssue ? 'Limited' : 'Idle'}</span><span class="${device.status === 'Fault' ? 'warn' : 'ok'}">${device.status === 'Fault' ? 'Protection' : 'Ready'}</span></div></div><div class="timeline-v17"><div><b>Today</b><span>SOC/SOH snapshot refreshed from BMS</span></div><div><b>Today</b><span>${hasIssue ? 'BESS limitation event linked to SOP' : 'Charge / discharge window completed normally'}</span></div><div><b>Yesterday</b><span>Rack balancing check completed</span></div><div><b>03 Jun</b><span>Storage topology confirmed under ${plant.name}</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>BESS Overview</h2><p class="muted">Battery storage workspace focused on state of charge, health, operating mode and internal topology.</p></div></div>${bessMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Storage Hierarchy</span><strong>${device.location}</strong><small>${device.children}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>BESS level rule</h3><p class="muted">BESS children are PCS/BMS, racks, modules and cell groups. Meter, inverter, transformer and weather station remain plant-level sibling devices.</p></div></div>`;
}

function pcsDerivedMetrics(device) {
  const warning = device.status === 'Warning' || device.status === 'Fault';
  return {
    acPower: warning ? '312 kW' : '420 kW',
    dcPower: warning ? '328 kW' : '438 kW',
    efficiency: warning ? '95.1%' : '97.8%',
    dcVoltage: warning ? '720 V' : '760 V',
    acVoltage: warning ? '392 V' : '400 V',
    current: warning ? '456 A' : '610 A',
    frequency: '50.0 Hz',
    mode: warning ? 'Limited conversion' : 'Grid-following',
    gridState: warning ? 'Connected · limited' : 'Connected · normal',
    freshness: warning ? 'Delayed' : 'Fresh'
  };
}

function pcsMetricCards(device) {
  const m = pcsDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 pcs-metric-grid-v24">
    <article><span>AC Power</span><strong>${m.acPower}</strong><small>Grid-side output</small></article>
    <article><span>DC Power</span><strong>${m.dcPower}</strong><small>Battery-side input/output</small></article>
    <article><span>Efficiency</span><strong>${m.efficiency}</strong><small>Conversion efficiency</small></article>
    <article><span>Mode</span><strong>${m.mode}</strong><small>Operating state</small></article>
    <article><span>Grid State</span><strong>${m.gridState}</strong><small>AC coupling</small></article>
    <article><span>Freshness</span><strong>${m.freshness}</strong><small>Last seen ${device.lastSeen}</small></article>
  </div>`;
}

function pcsCommandRows(device) {
  const warning = device.status === 'Warning' || device.status === 'Fault';
  const rows = [
    ['Charge conversion', 'AC/DC', 'Grid / PV → DC bus', warning ? 'Limited' : 'Available', 'Max 500 kW'],
    ['Discharge conversion', 'DC/AC', 'Battery DC bus → Grid / Load', warning ? 'Limited' : 'Available', 'Max 500 kW'],
    ['Reactive support', 'AC', 'PCS → Grid support', 'Available', '+/-250 kVAr'],
    ['Emergency stop', 'Safety', 'PCS shutdown command', 'Approval required', 'Risky command']
  ];
  return `<div class="data-table compact-table pcs-command-table-v24"><div class="data-head"><span>Function</span><span>Direction</span><span>Flow</span><span>Status</span><span>Limit</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span>${r[1]}</span></div><div><span>${r[2]}</span></div><div><span class="badge ${r[3] === 'Available' ? 'success' : r[3] === 'Approval required' ? 'warning' : 'warning'}">${r[3]}</span></div><div><span>${r[4]}</span></div><div><button class="small-btn" type="button">View Command</button></div></div>`).join('')}</div>`;
}

function pcsConnectedBessRows(device, siblings) {
  const related = siblings.filter(d => d.type === 'Battery');
  const rows = related.length ? related : [{ id:'BESS-LINK-01', name:'BESS Container', type:'Battery', status:'Active', capacity:'1 MWh', location:'Storage yard', lastSeen:device.lastSeen }];
  return `<div class="data-table compact-table pcs-bess-table-v24"><div class="data-head"><span>BESS Asset</span><span>Capacity</span><span>Location</span><span>Status</span><span>Last Seen</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r.name}</strong><small>${r.id}</small></div><div><span>${r.capacity}</span></div><div><span>${r.location}</span></div><div><span class="badge ${FleetClientModel.badge(r.status)}">${r.status}</span></div><div><span>${r.lastSeen}</span></div><div>${r.id.startsWith('BESS-LINK') ? '<button class="small-btn" type="button">View Link</button>' : `<button class="small-btn" type="button" data-open-device="${r.id}">Open BESS</button>`}</div></div>`).join('')}</div>`;
}

function pcsDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const m = pcsDerivedMetrics(device);
  const hasIssue = device.status === 'Warning' || device.status === 'Fault';

  if (tab === 'conversion') return `<div class="section-title-v17"><div><h2>Power Conversion</h2><p class="muted">PCS converts battery DC energy to AC grid/load energy and AC energy back to DC during charge.</p></div></div>${pcsMetricCards(device)}
    <div class="telemetry-layout-v20"><div class="chart-card-v20"><div class="chart-card-head-v20"><strong>AC/DC conversion · Today</strong><small>AC Power / DC Power</small></div>${miniBarChartV20(hasIssue ? [0,80,140,220,312,260,190,120,60,0] : [0,120,240,360,420,438,390,280,160,60])}</div><div class="info-grid compact-info-v20"><div><span>AC Power</span><strong>${m.acPower}</strong></div><div><span>DC Power</span><strong>${m.dcPower}</strong></div><div><span>Efficiency</span><strong>${m.efficiency}</strong></div><div><span>Mode</span><strong>${m.mode}</strong></div><div><span>DC Voltage</span><strong>${m.dcVoltage}</strong></div><div><span>AC Voltage</span><strong>${m.acVoltage}</strong></div><div><span>Current</span><strong>${m.current}</strong></div><div><span>Frequency</span><strong>${m.frequency}</strong></div></div></div>`;

  if (tab === 'charge') return `<div class="section-title-v17"><div><h2>Charge / Discharge</h2><p class="muted">Capability-gated PCS operating functions. Write-actions remain controlled by Command Center and audit rules.</p></div></div>${pcsCommandRows(device)}`;

  if (tab === 'connectedBess') return `<div class="section-title-v17"><div><h2>Connected BESS</h2><p class="muted">PCS is linked to battery containers/racks through the storage DC bus. BESS remains a sibling storage asset under the plant.</p></div></div>${pcsConnectedBessRows(device, siblings)}<div class="section-title-v17 mini"><div><h3>PCS level rule</h3><p class="muted">PCS is not the whole battery. It is the conversion device between BESS DC side and AC grid/load side.</p></div></div>`;

  if (tab === 'grid') return `<div class="section-title-v17"><div><h2>Grid Connection</h2><p class="muted">AC-side connection, protection state and grid support context for the PCS.</p></div></div><div class="device-overview-grid-v19"><article><span>Grid State</span><strong>${m.gridState}</strong><small>AC breaker and grid sync</small></article><article><span>AC Voltage</span><strong>${m.acVoltage}</strong><small>Grid side</small></article><article><span>Frequency</span><strong>${m.frequency}</strong><small>Nominal frequency</small></article><article><span>Reactive Support</span><strong>Available</strong><small>Capability gated</small></article></div><div class="data-table compact-table pcs-grid-table-v24"><div class="data-head"><span>Protection</span><span>State</span><span>Last Event</span><span>Action</span></div><div class="data-row"><div><strong>Grid sync</strong><small>AC coupling</small></div><div><span class="badge success">Synchronized</span></div><div><span>Today · normal</span></div><div><button class="small-btn" type="button">View History</button></div></div><div class="data-row"><div><strong>Breaker state</strong><small>PCS AC breaker</small></div><div><span class="badge success">Closed</span></div><div><span>No trip</span></div><div><button class="small-btn" type="button">Open Events</button></div></div></div>`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">PCS alerts related to conversion, protection, grid sync and BESS communication.</p></div></div><div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${hasIssue ? 'Conversion limited / DC bus warning' : 'No active PCS issues'}</strong><small>${device.name}</small></div><div><span class="badge ${hasIssue ? 'warning' : 'success'}">${hasIssue ? 'Warning' : 'Normal'}</span></div><div><span>${hasIssue ? device.lastSeen : 'Now'}</span></div><div><span>${hasIssue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${hasIssue ? 'Open Alert' : 'View History'}</button></div></div></div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">PCS position in the storage and grid conversion chain.</p></div></div><div class="topology-path-v20"><span>Plant</span><b>→</b><span>BESS / Storage Yard</span><b>→</b><span>${device.name}</span><b>→</b><span>AC Grid Interface</span></div><div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Storage Yard<ul><li>BESS Container / Racks</li><li>${device.type} · ${device.name}<ul><li>DC bus</li><li>AC output</li><li>Grid protection</li><li>Command interface</li></ul></li></ul></li><li>Grid Side<ul><li>Transformer</li><li>Switchgear</li><li>Metering point</li></ul></li></ul></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static PCS master data and electrical ratings.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Rated Power</span><strong>${device.capacity}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>DC Voltage Range</span><strong>600–900 V</strong></div><div><span>AC Output</span><strong>400 V · 50 Hz</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage and capability flags for PCS telemetry and commands.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} storage connector</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical PCS</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Capability Flags</span><strong>AC/DC telemetry · Grid sync · Commands gated</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">PCS operational history, command audit and protection events.</p></div></div><div class="status-timeline-v20"><div class="chart-card-head-v20"><strong>Status timeline</strong><small>Last 24 hours</small></div><div class="status-steps-v20"><span class="ok">Ready</span><span class="ok">Charge</span><span class="ok">Discharge</span><span class="${hasIssue ? 'warn' : 'ok'}">${hasIssue ? 'Limited' : 'Ready'}</span><span class="ok">Grid synced</span></div></div><div class="timeline-v17"><div><b>Today</b><span>PCS conversion telemetry refreshed from storage connector</span></div><div><b>Today</b><span>${hasIssue ? 'Conversion limit event linked to BESS workflow' : 'Charge/discharge conversion completed normally'}</span></div><div><b>Yesterday</b><span>Grid synchronization check completed</span></div><div><b>03 Jun</b><span>PCS linked to ${plant.name} storage topology</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>PCS Overview</h2><p class="muted">Power Conversion System workspace. PCS converts energy between battery DC side and AC grid/load side.</p></div></div>${pcsMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Conversion Role</span><strong>${device.children}</strong><small>${device.location}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>PCS level rule</h3><p class="muted">PCS is a storage infrastructure device, not a PV inverter. It belongs near BESS and grid device in the plant topology.</p></div></div>`;
}

function weatherDerivedMetrics(device) {
  const offline = device.status === 'Offline' || device.status === 'Fault';
  const warning = device.status === 'Warning';
  return {
    irradiance: offline ? '—' : warning ? '612 W/m2' : '846 W/m2',
    ambient: offline ? '—' : warning ? '31°C' : '28°C',
    moduleTemp: offline ? '—' : warning ? '47°C' : '42°C',
    wind: offline ? '—' : '4.6 m/s',
    humidity: offline ? '—' : '42%',
    pressure: offline ? '—' : '1012 hPa',
    freshness: offline ? 'Stale' : warning ? 'Delayed' : 'Fresh',
    sensorsOnline: offline ? '0 / 5' : warning ? '4 / 5' : '5 / 5'
  };
}

function weatherMetricCards(device) {
  const m = weatherDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 weather-metric-grid-v23">
    <article><span>Irradiance</span><strong>${m.irradiance}</strong><small>Plane / plant sensor</small></article>
    <article><span>Ambient Temp</span><strong>${m.ambient}</strong><small>Air temperature</small></article>
    <article><span>Module Temp</span><strong>${m.moduleTemp}</strong><small>PV module sensor</small></article>
    <article><span>Wind</span><strong>${m.wind}</strong><small>Speed sensor</small></article>
    <article><span>Humidity</span><strong>${m.humidity}</strong><small>Weather context</small></article>
    <article><span>Sensors Online</span><strong>${m.sensorsOnline}</strong><small>Data quality</small></article>
  </div>`;
}

function weatherSensorRows(device) {
  const m = weatherDerivedMetrics(device);
  const rows = [
    ['Irradiance sensor', 'POA / GHI', m.irradiance, m.freshness, 'Used for performance ratio'],
    ['Ambient temperature', 'Temperature', m.ambient, m.freshness, 'Weather correction'],
    ['Module temperature', 'Temperature', m.moduleTemp, m.freshness, 'PV performance context'],
    ['Wind sensor', 'Wind speed', m.wind, device.status === 'Offline' ? 'Stale' : 'Fresh', 'Safety and diagnostics'],
    ['Humidity sensor', 'Humidity', m.humidity, device.status === 'Warning' ? 'Delayed' : m.freshness, 'Environmental context']
  ];
  return `<div class="data-table compact-table weather-sensor-table-v23"><div class="data-head"><span>Sensor</span><span>Type</span><span>Current</span><span>Quality</span><span>Purpose</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span>${r[1]}</span></div><div><strong>${r[2]}</strong></div><div><span class="badge ${r[3] === 'Fresh' ? 'success' : 'warning'}">${r[3]}</span></div><div><span>${r[4]}</span></div></div>`).join('')}</div>`;
}

function weatherDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const m = weatherDerivedMetrics(device);
  const hasIssue = device.status === 'Warning' || device.status === 'Offline' || device.status === 'Fault';

  if (tab === 'irradiance') return `<div class="section-title-v17"><div><h2>Irradiance</h2><p class="muted">Solar resource context used to explain production and performance ratio.</p></div></div>
    <div class="telemetry-layout-v20"><div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Irradiance curve · Today</strong><small>W/m2</small></div>${miniBarChartV20(hasIssue ? [0,0,140,280,420,612,520,380,170,0] : [0,80,240,480,720,846,790,610,360,90])}</div><div class="info-grid compact-info-v20"><div><span>Current Irradiance</span><strong>${m.irradiance}</strong></div><div><span>Quality</span><strong>${m.freshness}</strong></div><div><span>Sensor Role</span><strong>Performance context</strong></div><div><span>Linked Plant</span><strong>${plant.name}</strong></div></div></div>`;

  if (tab === 'temperature') return `<div class="section-title-v17"><div><h2>Temperature</h2><p class="muted">Ambient and module temperature readings used for diagnostics and performance interpretation.</p></div></div>
    <div class="device-overview-grid-v19"><article><span>Ambient</span><strong>${m.ambient}</strong><small>Air temperature</small></article><article><span>Module</span><strong>${m.moduleTemp}</strong><small>PV surface temperature</small></article><article><span>Delta</span><strong>${m.moduleTemp === '—' ? '—' : '+14°C'}</strong><small>Module vs ambient</small></article><article><span>Quality</span><strong>${m.freshness}</strong><small>Last seen ${device.lastSeen}</small></article></div>
    <div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Temperature profile · Today</strong><small>Module temperature</small></div>${miniBarChartV20(hasIssue ? [18,20,24,31,38,47,43,35,28,22] : [17,20,25,32,39,42,40,34,27,21])}</div>`;

  if (tab === 'wind') return `<div class="section-title-v17"><div><h2>Wind</h2><p class="muted">Wind conditions can support safety, soiling context and weather normalization.</p></div></div>
    <div class="device-overview-grid-v19"><article><span>Wind Speed</span><strong>${m.wind}</strong><small>Current value</small></article><article><span>Direction</span><strong>${m.wind === '—' ? '—' : 'NE'}</strong><small>Sensor estimate</small></article><article><span>Gust</span><strong>${m.wind === '—' ? '—' : '7.2 m/s'}</strong><small>Last interval</small></article><article><span>Quality</span><strong>${m.freshness}</strong><small>Weather sensor feed</small></article></div>`;

  if (tab === 'sensors') return `<div class="section-title-v17"><div><h2>Sensors</h2><p class="muted">Weather plant child sensors. These are subcomponents of the plant, not independent plant devices.</p></div></div>${weatherSensorRows(device)}`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Weather plant alerts affect performance interpretation and data quality confidence.</p></div></div>
    <div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${hasIssue ? 'Weather data delayed' : 'No active weather issues'}</strong><small>${device.name}</small></div><div>${hasIssue ? '<span class="badge warning">Warning</span>' : '<span class="badge success">Normal</span>'}</div><div><span>${hasIssue ? device.lastSeen : 'Now'}</span></div><div><span>${hasIssue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${hasIssue ? 'Open Alert' : 'View History'}</button></div></div></div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Weather plant belongs to the plant sensor layer and provides context to energy analytics.</p></div></div>
    <div class="topology-path-v20"><span>Plant</span><b>→</b><span>Sensor Mast / Roof</span><b>→</b><span>${device.name}</span><b>→</b><span>Weather sensors</span></div>
    <div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Weather / Sensor Layer<ul><li>${device.type} · ${device.name}<ul><li>Irradiance sensor</li><li>Ambient temperature</li><li>Module temperature</li><li>Wind speed / direction</li><li>Humidity / pressure</li></ul></li></ul></li></ul></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static weather station master data and sensor package information.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Sensor Package</span><strong>${device.capacity}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage and freshness for weather telemetry.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} weather connector</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical weather station</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Capability Flags</span><strong>Irradiance · Temperature · Wind · Humidity</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Weather data imports, sensor checks and data-quality events.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Weather telemetry normalized for ${plant.name}</span></div><div><b>Today</b><span>${hasIssue ? 'Weather feed delay flagged for data quality review' : 'All weather sensors reporting normally'}</span></div><div><b>Yesterday</b><span>Irradiance sensor calibration status checked</span></div><div><b>03 Jun</b><span>Weather plant linked to plant performance analytics</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Weather Station Overview</h2><p class="muted">Environmental context for solar generation, performance diagnostics and reporting.</p></div></div>${weatherMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Sensor Package</span><strong>${device.children}</strong><small>${device.location}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>Weather level rule</h3><p class="muted">Weather plant is a plant-level sensor asset. Its child objects are sensors, while inverters, meters and BESS remain sibling device.</p></div></div>`;
}


function loggerDerivedMetrics(device) {
  const issue = device.status === 'Warning' || device.status === 'Offline' || device.status === 'Fault';
  const linked = parseInt(String(device.capacity || '').replace(/[^0-9]/g, ''), 10) || 48;
  return {
    linked,
    online: issue ? Math.max(0, linked - 6) : Math.max(0, linked - 1),
    signal: issue ? '64%' : '92%',
    uplink: issue ? 'Degraded' : 'Healthy',
    latency: issue ? '820 ms' : '84 ms',
    packetLoss: issue ? '4.8%' : '0.2%',
    protocol: device.vendor === 'Huawei' ? 'Modbus TCP / FusionSolar' : device.vendor === 'Sungrow' ? 'Modbus TCP / iSolarCloud' : 'Vendor gateway API',
    freshness: issue ? 'Delayed' : 'Fresh'
  };
}

function loggerMetricCards(device) {
  const m = loggerDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 logger-metric-grid-v23">
    <article><span>Linked Devices</span><strong>${m.linked}</strong><small>Child telemetry sources</small></article>
    <article><span>Online Devices</span><strong>${m.online}</strong><small>Currently reporting</small></article>
    <article><span>Signal Quality</span><strong>${m.signal}</strong><small>Network strength</small></article>
    <article><span>Uplink</span><strong>${m.uplink}</strong><small>Gateway connectivity</small></article>
    <article><span>Latency</span><strong>${m.latency}</strong><small>Current roundtrip</small></article>
    <article><span>Packet Loss</span><strong>${m.packetLoss}</strong><small>Last sync window</small></article>
  </div>`;
}

function loggerLinkedRows(device, plant, siblings) {
  const m = loggerDerivedMetrics(device);
  const linked = siblings.filter(x => x.id !== device.id).slice(0, 8);
  if (!linked.length) return `<div class="empty-state"><strong>No linked devices</strong><small>This gateway has no sample children in the current plant model.</small></div>`;
  return `<div class="data-table compact-table logger-linked-table-v23"><div class="data-head"><span>Device</span><span>Type</span><span>Link</span><span>Freshness</span><span>Status</span><span>Action</span></div>${linked.map((x,i)=>`<div class="data-row"><div><strong>${x.name}</strong><small>${x.id}</small></div><div><span>${x.type}</span></div><div><span>${i % 3 === 0 ? 'RS485 / Modbus' : 'Ethernet / TCP'}</span></div><div><span>${i === 2 && device.status === 'Warning' ? '18 min ago' : x.lastSeen}</span></div><div><span class="badge ${i === 2 && device.status === 'Warning' ? 'warning' : FleetClientModel.badge(x.status)}">${i === 2 && device.status === 'Warning' ? 'Delayed' : x.status}</span></div><div><button class="small-btn" type="button" data-open-device="${x.id}">Open Device</button></div></div>`).join('')}</div>`;
}

function loggerDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const m = loggerDerivedMetrics(device);
  const hasIssue = device.status === 'Warning' || device.status === 'Offline' || device.status === 'Fault';

  if (tab === 'connectivity') return `<div class="section-title-v17"><div><h2>Connectivity</h2><p class="muted">Gateway health, network quality and communication stability.</p></div></div>${loggerMetricCards(device)}
    <div class="telemetry-layout-v20"><div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Signal quality · Today</strong><small>Network strength</small></div>${miniBarChartV20(hasIssue ? [88,86,82,76,70,64,62,66,69,65] : [90,92,94,93,95,92,91,94,96,92])}</div><div class="info-grid compact-info-v20"><div><span>Protocol</span><strong>${m.protocol}</strong></div><div><span>Latency</span><strong>${m.latency}</strong></div><div><span>Packet Loss</span><strong>${m.packetLoss}</strong></div><div><span>Uplink</span><strong>${m.uplink}</strong></div></div></div>`;

  if (tab === 'linked') return `<div class="section-title-v17"><div><h2>Linked Devices</h2><p class="muted">Devices whose telemetry is collected through this logger or gateway.</p></div></div>${loggerLinkedRows(device, plant, siblings)}`;

  if (tab === 'sync') return `<div class="section-title-v17"><div><h2>Sync & Freshness</h2><p class="muted">Data freshness across child devices and connector stages.</p></div></div>
    <div class="data-table compact-table logger-sync-table-v23"><div class="data-head"><span>Stage</span><span>Last Success</span><span>Lag</span><span>Quality</span><span>Action</span></div>
      <div class="data-row"><div><strong>Gateway Poll</strong><small>${device.name}</small></div><div><span>${device.lastSeen}</span></div><div><span>${hasIssue ? '12 min' : '1 min'}</span></div><div><span class="badge ${hasIssue ? 'warning' : 'success'}">${m.freshness}</span></div><div><button class="small-btn" type="button">Open Trace</button></div></div>
      <div class="data-row"><div><strong>Raw Ingestion</strong><small>Payload capture</small></div><div><span>${hasIssue ? '14 min ago' : '1 min ago'}</span></div><div><span>${hasIssue ? 'Delayed' : 'Normal'}</span></div><div><span class="badge ${hasIssue ? 'warning' : 'success'}">${hasIssue ? 'Partial' : 'Fresh'}</span></div><div><button class="small-btn" type="button">View Raw</button></div></div>
      <div class="data-row"><div><strong>Core Write</strong><small>Canonical telemetry</small></div><div><span>${hasIssue ? '16 min ago' : '2 min ago'}</span></div><div><span>${hasIssue ? 'Delayed' : 'Normal'}</span></div><div><span class="badge ${hasIssue ? 'warning' : 'success'}">${hasIssue ? 'Delayed' : 'Fresh'}</span></div><div><button class="small-btn" type="button">Open Data Quality</button></div></div>
    </div>`;

  if (tab === 'network') return `<div class="section-title-v17"><div><h2>Network</h2><p class="muted">Communication channel, addressing and network diagnostics.</p></div></div><div class="info-grid"><div><span>Network Type</span><strong>Ethernet + RS485</strong></div><div><span>IP Address</span><strong>10.24.${m.linked % 20}.14</strong></div><div><span>Subnet</span><strong>Plant OT Network</strong></div><div><span>Signal</span><strong>${m.signal}</strong></div><div><span>Protocol</span><strong>${m.protocol}</strong></div><div><span>VPN / Tunnel</span><strong>${hasIssue ? 'Reconnecting' : 'Connected'}</strong></div></div>`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Gateway issues can impact many downstream devices, so they should be visible and prioritized.</p></div></div>
    <div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${hasIssue ? 'Gateway sync delayed' : 'No active gateway issues'}</strong><small>${device.name}</small></div><div>${hasIssue ? '<span class="badge warning">Warning</span>' : '<span class="badge success">Normal</span>'}</div><div><span>${hasIssue ? device.lastSeen : 'Now'}</span></div><div><span>${hasIssue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${hasIssue ? 'Open SOP' : 'View History'}</button></div></div></div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Logger / Gateway sits between plant device and the vendor connector. It collects child-device data but does not own the electrical hierarchy.</p></div></div>
    <div class="topology-path-v20"><span>Plant</span><b>→</b><span>OT Network</span><b>→</b><span>${device.name}</span><b>→</b><span>Linked Devices</span><b>→</b><span>Vendor Connector</span></div>
    <div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Communication Layer<ul><li>${device.type} · ${device.name}<ul><li>Inverter telemetry channels</li><li>Metering channel</li><li>Weather plant channel</li><li>BESS / PCS channel when installed</li></ul></li></ul></li><li>Electrical Layer<ul><li>Inverters</li><li>Meters</li><li>BESS / PCS</li><li>Transformer</li></ul></li></ul></div>${loggerLinkedRows(device, plant, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static gateway asset data and communication capabilities.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Capacity</span><strong>${device.capacity}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage for gateway and child-device payloads.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} gateway connector</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical logger / gateway</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Polling · Child devices · Sync trace · Alerts</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Gateway sync, child-device polling, network and governance timeline.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Gateway payload normalized for ${plant.name}</span></div><div><b>Today</b><span>${hasIssue ? 'Sync delay detected across linked devices' : 'All linked devices reporting within freshness threshold'}</span></div><div><b>Yesterday</b><span>Communication map refreshed from source connector</span></div><div><b>03 Jun</b><span>Gateway linked to plant OT network and Data Governance lineage</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Logger / Gateway Overview</h2><p class="muted">Communication gateway that collects device telemetry and forwards it into FleetOS through vendor connectors.</p></div></div>${loggerMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Gateway Role</span><strong>${device.children}</strong><small>${device.location}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>Gateway level rule</h3><p class="muted">Logger / Gateway is a communication asset. It links to child devices for data collection, but inverters, meters, BESS and transformers remain plant-level device in the asset hierarchy.</p></div></div>`;
}


function isTransformerDevice(device) {
  return device && (device.type === 'Transformer' || device.type === 'Grid Device' || String(device.name || '').toLowerCase().includes('transformer') || String(device.id || '').startsWith('TR-'));
}

function transformerDerivedMetrics(device) {
  const hasIssue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const capacity = device.capacity || '2.5 MVA';
  return {
    capacity,
    load: hasIssue ? '71%' : '58%',
    hvVoltage: hasIssue ? '10.7 kV' : '11.0 kV',
    lvVoltage: hasIssue ? '392 V' : '400 V',
    temperature: hasIssue ? '78°C' : '62°C',
    oilStatus: hasIssue ? 'Check required' : 'Normal',
    protection: hasIssue ? 'Warning' : 'Normal',
    feederCount: String(device.children || '').toLowerCase().includes('switch') ? '4 feeders' : '2 feeders',
    freshness: hasIssue ? 'Delayed' : 'Fresh'
  };
}

function transformerMetricCards(device) {
  const m = transformerDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 transformer-metric-grid-v25">
    <article><span>Load</span><strong>${m.load}</strong><small>Current transformer load</small></article>
    <article><span>HV Voltage</span><strong>${m.hvVoltage}</strong><small>Grid side</small></article>
    <article><span>LV Voltage</span><strong>${m.lvVoltage}</strong><small>Plant side</small></article>
    <article><span>Temperature</span><strong>${m.temperature}</strong><small>Thermal state</small></article>
    <article><span>Oil / Insulation</span><strong>${m.oilStatus}</strong><small>Protection context</small></article>
    <article><span>Protection</span><strong>${m.protection}</strong><small>Relay / trip status</small></article>
  </div>`;
}

function transformerMeasurementRows(device) {
  const m = transformerDerivedMetrics(device);
  const rows = [
    ['HV voltage', m.hvVoltage, '11 kV nominal', m.freshness],
    ['LV voltage', m.lvVoltage, '400 V nominal', m.freshness],
    ['Load factor', m.load, 'Capacity ' + m.capacity, device.status === 'Warning' ? 'Check' : 'Normal'],
    ['Winding temperature', m.temperature, 'Thermal sensor', device.status === 'Warning' ? 'Elevated' : 'Normal'],
    ['Oil / insulation state', m.oilStatus, 'Inspection signal', device.status === 'Warning' ? 'Warning' : 'Normal']
  ];
  return `<div class="data-table compact-table transformer-measure-table-v25"><div class="data-head"><span>Measurement</span><span>Current</span><span>Reference</span><span>Quality</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span>${r[1]}</span></div><div><span>${r[2]}</span></div><div><span class="badge ${r[3] === 'Normal' || r[3] === 'Fresh' ? 'success' : 'warning'}">${r[3]}</span></div></div>`).join('')}</div>`;
}

function transformerProtectionRows(device) {
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const rows = issue ? [
    ['Temperature threshold', 'Warning', device.lastSeen, 'Open', 'Open Event'],
    ['Oil level inspection', 'Warning', 'Today', 'Pending', 'Create Task'],
    ['Breaker trip', 'Normal', 'No trip', 'Clear', 'View History']
  ] : [
    ['Differential protection', 'Normal', 'No event', 'Clear', 'View History'],
    ['Overcurrent protection', 'Normal', 'No event', 'Clear', 'View History'],
    ['Breaker trip', 'Normal', 'No trip', 'Clear', 'View History']
  ];
  return `<div class="data-table compact-table transformer-protection-table-v25"><div class="data-head"><span>Protection</span><span>Severity</span><span>Last Event</span><span>Status</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.location}</small></div><div><span class="badge ${r[1] === 'Normal' ? 'success' : 'warning'}">${r[1]}</span></div><div><span>${r[2]}</span></div><div><span>${r[3]}</span></div><div><button class="small-btn" type="button">${r[4]}</button></div></div>`).join('')}</div>`;
}

function transformerDetailTab(device, plant, siblings, tab) {
  const m = transformerDerivedMetrics(device);
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';

  if (tab === 'measurements') return `<div class="section-title-v17"><div><h2>Electrical Measurements</h2><p class="muted">Transformer electrical state between plant generation/storage and the grid interface.</p></div></div>${transformerMetricCards(device)}${transformerMeasurementRows(device)}`;

  if (tab === 'protection') return `<div class="section-title-v17"><div><h2>Protection Events</h2><p class="muted">Relay, trip, thermal and insulation events. These should feed Alerts, SOP and Work Orders.</p></div></div>${transformerProtectionRows(device)}`;

  if (tab === 'grid') return `<div class="section-title-v17"><div><h2>Grid / Feeders</h2><p class="muted">Transformer relation to switchgear, feeders, meters and the plant AC bus.</p></div></div>
    <div class="device-overview-grid-v19"><article><span>Feeders</span><strong>${m.feederCount}</strong><small>Connected outgoing circuits</small></article><article><span>Grid Side</span><strong>${m.hvVoltage}</strong><small>HV connection</small></article><article><span>Plant Side</span><strong>${m.lvVoltage}</strong><small>LV bus</small></article><article><span>Metering Point</span><strong>${siblings.find(x => x.type === 'Meter')?.name || 'Main meter'}</strong><small>Related plant sibling</small></article></div>
    <div class="data-table compact-table transformer-feeder-table-v25"><div class="data-head"><span>Feeder</span><span>Connected Area</span><span>Load</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>Feeder A</strong><small>PV inverter area</small></div><div><span>Inverters / AC bus</span></div><div><span>42%</span></div><div><span class="badge success">Normal</span></div><div><button class="small-btn" type="button">View Feeder</button></div></div><div class="data-row"><div><strong>Feeder B</strong><small>Storage / auxiliary</small></div><div><span>BESS / PCS / Aux</span></div><div><span>${issue ? '71%' : '36%'}</span></div><div><span class="badge ${issue ? 'warning' : 'success'}">${issue ? 'Check' : 'Normal'}</span></div><div><button class="small-btn" type="button">Open Events</button></div></div></div>`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Transformer events connected to incident, SOP and work-order flows.</p></div></div><div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${issue ? 'Transformer temperature / oil status check' : 'No active transformer issues'}</strong><small>${device.name}</small></div><div><span class="badge ${issue ? 'warning' : 'success'}">${issue ? 'Warning' : 'Normal'}</span></div><div><span>${issue ? device.lastSeen : 'Now'}</span></div><div><span>${issue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${issue ? 'Open Alert' : 'View History'}</button></div></div></div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Transformer position in the plant electrical infrastructure.</p></div></div><div class="topology-path-v20"><span>Plant</span><b>→</b><span>AC Collection</span><b>→</b><span>${device.name}</span><b>→</b><span>Switchgear / Grid</span></div><div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Generation Side<ul><li>Inverters</li><li>PCS / BESS if available</li></ul></li><li>Electrical Infrastructure<ul><li>${device.type} · ${device.name}<ul><li>HV side</li><li>LV side</li><li>Protection relay</li><li>Feeders</li></ul></li><li>Switchgear / Breaker</li><li>Metering point</li></ul></li></ul></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static master data for transformer device.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model / Rating</span><strong>${device.model}</strong></div><div><span>Rated Capacity</span><strong>${device.capacity}</strong></div><div><span>Cooling / Oil</span><strong>Oil immersed · monitored</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div><div><span>Warranty</span><strong>Active · 2024–2029</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage for transformer operational state and protection events.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} / plant SCADA</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical transformer</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Measurements · Protection · Events</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Transformer operational, inspection and protection timeline.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Transformer measurements normalized for ${plant.name}</span></div><div><b>Today</b><span>${issue ? 'Temperature / oil status check routed to operations' : 'Protection state verified as normal'}</span></div><div><b>Yesterday</b><span>Feeder load snapshot refreshed</span></div><div><b>03 Jun</b><span>Transformer linked to plant infrastructure topology</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Transformer Overview</h2><p class="muted">Electrical infrastructure workspace for transformer load, voltage, temperature and protection state.</p></div></div>${transformerMetricCards(device)}<div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>Transformer</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Role</span><strong>${device.children}</strong><small>${device.location}</small></article></div><div class="section-title-v17 mini"><div><h3>Transformer level rule</h3><p class="muted">Transformer is plant-level electrical infrastructure. It connects generation/storage AC output to switchgear, metering and the grid side.</p></div></div>`;
}


function isSwitchgearDevice(device) {
  return device && (device.type === 'Switchgear' || String(device.name || '').toLowerCase().includes('switchgear') || String(device.id || '').startsWith('SW-'));
}

function switchgearDerivedMetrics(device) {
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  return {
    breakerState: issue ? 'Check' : 'Closed',
    protection: issue ? 'Warning' : 'Normal',
    feederCount: issue ? '5 feeders' : '4 feeders',
    lastTrip: issue ? device.lastSeen : 'No trip',
    busVoltage: String(device.capacity || '').includes('400') ? '400 V' : String(device.capacity || '').includes('24') ? '24 kV' : '12 kV',
    load: issue ? '68%' : '44%',
    commandMode: issue ? 'Approval required' : 'Available',
    freshness: issue ? 'Delayed' : 'Fresh'
  };
}

function switchgearMetricCards(device) {
  const m = switchgearDerivedMetrics(device);
  return `<div class="device-metric-grid-v20 switchgear-metric-grid-v26">
    <article><span>Main Breaker</span><strong>${m.breakerState}</strong><small>Current breaker state</small></article>
    <article><span>Bus Voltage</span><strong>${m.busVoltage}</strong><small>Switchgear bus</small></article>
    <article><span>Load</span><strong>${m.load}</strong><small>Current feeder load</small></article>
    <article><span>Feeders</span><strong>${m.feederCount}</strong><small>Connected circuits</small></article>
    <article><span>Protection</span><strong>${m.protection}</strong><small>Relay / interlock state</small></article>
    <article><span>Last Trip</span><strong>${m.lastTrip}</strong><small>Protection event state</small></article>
  </div>`;
}

function switchgearBreakerRows(device) {
  const m = switchgearDerivedMetrics(device);
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const rows = [
    ['Main breaker', m.breakerState, 'Grid connection', issue ? 'Check' : 'Normal', 'View State'],
    ['PV feeder breaker', 'Closed', 'Inverter AC bus', 'Normal', 'Open Feeder'],
    ['BESS / PCS breaker', issue ? 'Limited' : 'Closed', 'Storage feeder', issue ? 'Warning' : 'Normal', 'Open Events'],
    ['Auxiliary breaker', 'Closed', 'Aux loads / control', 'Normal', 'View State']
  ];
  return `<div class="data-table compact-table switchgear-breaker-table-v26"><div class="data-head"><span>Breaker</span><span>State</span><span>Connected Circuit</span><span>Status</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span>${r[1]}</span></div><div><span>${r[2]}</span></div><div><span class="badge ${r[3] === 'Normal' ? 'success' : 'warning'}">${r[3]}</span></div><div><button class="small-btn" type="button">${r[4]}</button></div></div>`).join('')}</div>`;
}

function switchgearFeederRows(device) {
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const rows = [
    ['Feeder 01', 'PV inverters', '42%', 'Normal', 'Open Feeder'],
    ['Feeder 02', 'BESS / PCS', issue ? '68%' : '36%', issue ? 'Warning' : 'Normal', 'View Load'],
    ['Feeder 03', 'Transformer / grid', '51%', 'Normal', 'View Path'],
    ['Feeder 04', 'Auxiliary loads', '12%', 'Normal', 'View State']
  ];
  return `<div class="data-table compact-table switchgear-feeder-table-v26"><div class="data-head"><span>Feeder</span><span>Connected Asset</span><span>Load</span><span>Status</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.location}</small></div><div><span>${r[1]}</span></div><div><span>${r[2]}</span></div><div><span class="badge ${r[3] === 'Normal' ? 'success' : 'warning'}">${r[3]}</span></div><div><button class="small-btn" type="button">${r[4]}</button></div></div>`).join('')}</div>`;
}

function switchgearEventRows(device) {
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const rows = issue ? [
    ['Interlock check', 'Warning', device.lastSeen, 'Open', 'Open SOP'],
    ['BESS feeder load', 'Warning', 'Today', 'Pending', 'Create Task'],
    ['Breaker trip', 'Normal', 'No trip', 'Clear', 'View History']
  ] : [
    ['Protection relay', 'Normal', 'No event', 'Clear', 'View History'],
    ['Breaker trip', 'Normal', 'No trip', 'Clear', 'View History'],
    ['Interlock state', 'Normal', 'Verified today', 'Clear', 'View State']
  ];
  return `<div class="data-table compact-table switchgear-event-table-v26"><div class="data-head"><span>Event</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span class="badge ${r[1] === 'Normal' ? 'success' : 'warning'}">${r[1]}</span></div><div><span>${r[2]}</span></div><div><span>${r[3]}</span></div><div><button class="small-btn" type="button">${r[4]}</button></div></div>`).join('')}</div>`;
}

function switchgearCommandRows(device) {
  const m = switchgearDerivedMetrics(device);
  const rows = [
    ['Open breaker', 'Risky', 'Breaker open command', 'Approval required', 'View Command'],
    ['Close breaker', 'Risky', 'Breaker close command', m.commandMode, 'View Command'],
    ['Reset protection relay', 'Controlled', 'Relay reset after inspection', 'Operator approval', 'Prepare'],
    ['Request state refresh', 'Safe', 'Read-only status refresh', 'Available', 'Run Check']
  ];
  return `<div class="data-table compact-table switchgear-command-table-v26"><div class="data-head"><span>Command</span><span>Risk</span><span>Description</span><span>Status</span><span>Action</span></div>${rows.map(r=>`<div class="data-row"><div><strong>${r[0]}</strong><small>${device.name}</small></div><div><span class="badge ${r[1] === 'Safe' ? 'success' : r[1] === 'Controlled' ? 'warning' : 'danger'}">${r[1]}</span></div><div><span>${r[2]}</span></div><div><span>${r[3]}</span></div><div><button class="small-btn" type="button">${r[4]}</button></div></div>`).join('')}</div>`;
}

function switchgearDetailTab(device, plant, siblings, tab) {
  const m = switchgearDerivedMetrics(device);
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const issue = device.status === 'Warning' || device.status === 'Fault' || device.status === 'Offline';
  const transformer = siblings.find(x => isTransformerDevice(x));
  const meter = siblings.find(x => x.type === 'Meter');

  if (tab === 'breakers') return `<div class="section-title-v17"><div><h2>Breakers</h2><p class="muted">Breaker and interlock state for plant grid infrastructure.</p></div></div>${switchgearMetricCards(device)}${switchgearBreakerRows(device)}`;

  if (tab === 'feeders') return `<div class="section-title-v17"><div><h2>Feeders</h2><p class="muted">Outgoing circuits connected to PV, BESS/PCS, transformer and auxiliary loads.</p></div></div>${switchgearFeederRows(device)}`;

  if (tab === 'events') return `<div class="section-title-v17"><div><h2>Protection Events</h2><p class="muted">Trip, relay, interlock and feeder protection events routed to Alerts, SOP and Work Orders.</p></div></div>${switchgearEventRows(device)}`;

  if (tab === 'commands') return `<div class="section-title-v17"><div><h2>Commands</h2><p class="muted">Switchgear commands are risky control actions. They must stay capability-gated and audited.</p></div></div>${switchgearCommandRows(device)}`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Switchgear events connected to incident, SOP and work-order flows.</p></div></div><div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div><div class="data-row"><div><strong>${issue ? 'Switchgear interlock / feeder check' : 'No active switchgear issues'}</strong><small>${device.name}</small></div><div><span class="badge ${issue ? 'warning' : 'success'}">${issue ? 'Warning' : 'Normal'}</span></div><div><span>${issue ? device.lastSeen : 'Now'}</span></div><div><span>${issue ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${issue ? 'Open Alert' : 'View History'}</button></div></div></div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Switchgear sits between transformer, feeders, metering point and grid connection.</p></div></div><div class="topology-path-v20"><span>Plant</span><b>→</b><span>Transformer</span><b>→</b><span>${device.name}</span><b>→</b><span>Feeders / Grid</span></div><div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>Electrical Infrastructure<ul><li>${transformer ? transformer.name : 'Transformer'}<ul><li>${device.type} · ${device.name}<ul><li>Main breaker</li><li>PV feeder</li><li>BESS / PCS feeder</li><li>Aux feeder</li><li>${meter ? meter.name : 'Metering point'}</li></ul></li></ul></li></ul></li></ul></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static switchgear master data and protection package.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Rated Capacity</span><strong>${device.capacity}</strong></div><div><span>Protection Relay</span><strong>${device.firmware}</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div><div><span>Warranty</span><strong>Active · 2024–2029</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage for switchgear state, breaker events and command capability.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor} / plant SCADA</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical switchgear</strong></div><div><span>Data Freshness</span><strong>${m.freshness}</strong></div><div><span>Capability Flags</span><strong>Breakers · Feeders · Protection · Commands</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Switchgear operational, protection and command audit timeline.</p></div></div><div class="timeline-v17"><div><b>Today</b><span>Switchgear state normalized for ${plant.name}</span></div><div><b>Today</b><span>${issue ? 'Feeder / interlock check routed to operations' : 'Breaker state verified as normal'}</span></div><div><b>Yesterday</b><span>Feeder load snapshot refreshed</span></div><div><b>03 Jun</b><span>Switchgear linked to transformer and grid topology</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Switchgear Overview</h2><p class="muted">Electrical infrastructure workspace for breaker state, feeders, protection and command readiness.</p></div></div>${switchgearMetricCards(device)}<div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>Switchgear</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Role</span><strong>${device.children}</strong><small>${device.location}</small></article></div><div class="section-title-v17 mini"><div><h3>Switchgear level rule</h3><p class="muted">Switchgear is plant-level electrical infrastructure. It groups breakers and feeders; it is related to transformer, meters and PCS through plant topology.</p></div></div>`;
}

function deviceDetailTab(device, plant, siblings, tab) {
  const statusBadge = `<span class="badge ${FleetClientModel.badge(device.status)}">${device.status}</span>`;
  const isInverter = device.type === 'Inverter';
  const metrics = inverterDerivedMetrics(device);
  const warningRow = device.status === 'Warning';

  if (device.type === 'Meter') return meterDetailTab(device, plant, siblings, tab);
  if (device.type === 'PCS') return pcsDetailTab(device, plant, siblings, tab);
  if (device.type === 'Battery') return bessDetailTab(device, plant, siblings, tab);
  if (device.type === 'Weather Station') return weatherDetailTab(device, plant, siblings, tab);
  if (device.type === 'Logger' || device.type === 'Gateway') return loggerDetailTab(device, plant, siblings, tab);
  if (isSwitchgearDevice(device)) return switchgearDetailTab(device, plant, siblings, tab);
  if (isTransformerDevice(device)) return transformerDetailTab(device, plant, siblings, tab);

  if (tab === 'telemetry') return `<div class="section-title-v17"><div><h2>Telemetry</h2><p class="muted">Inverter telemetry split by AC/DC power, voltage, current, frequency and temperature.</p></div></div>
    <div class="telemetry-layout-v20">
      <div class="chart-card-v20"><div class="chart-card-head-v20"><strong>Power curve · Today</strong><small>AC Power / DC Power</small></div>${miniBarChartV20(warningRow ? [18, 22, 34, 56, 72, 84, 72, 54, 36, 21] : [22, 31, 48, 76, 98, 116, 124, 106, 74, 42])}</div>
      <div class="info-grid compact-info-v20"><div><span>AC Power</span><strong>${metrics.acPower}</strong></div><div><span>DC Power</span><strong>${metrics.dcPower}</strong></div><div><span>DC Voltage</span><strong>${metrics.dcVoltage}</strong></div><div><span>AC Voltage</span><strong>${metrics.acVoltage}</strong></div><div><span>Current</span><strong>${metrics.current}</strong></div><div><span>Frequency</span><strong>${metrics.frequency}</strong></div><div><span>Temperature</span><strong>${metrics.temperature}</strong></div><div><span>Freshness</span><strong>${metrics.freshness}</strong></div></div>
    </div>
    <div class="data-table compact-table telemetry-table-v20"><div class="data-head"><span>Metric</span><span>Current</span><span>Previous</span><span>Quality</span></div>
      <div class="data-row"><div><strong>AC active power</strong><small>Grid-side output</small></div><div><span>${metrics.acPower}</span></div><div><span>${warningRow ? '118 kW' : '164 kW'}</span></div><div>${warningRow ? '<span class="badge warning">Delayed</span>' : '<span class="badge success">Fresh</span>'}</div></div>
      <div class="data-row"><div><strong>DC input power</strong><small>PV-side input</small></div><div><span>${metrics.dcPower}</span></div><div><span>${warningRow ? '129 kW' : '178 kW'}</span></div><div><span class="badge success">Fresh</span></div></div>
      <div class="data-row"><div><strong>Temperature</strong><small>Internal device sensor</small></div><div><span>${metrics.temperature}</span></div><div><span>${warningRow ? '54°C' : '41°C'}</span></div><div>${warningRow ? '<span class="badge warning">Check</span>' : '<span class="badge success">Normal</span>'}</div></div>
    </div>`;

  if (tab === 'alerts') return `<div class="section-title-v17"><div><h2>Alerts</h2><p class="muted">Device-level events connected to Alerts, SOP, Tasks and Work Orders.</p></div></div>
    <div class="data-table compact-table device-alert-table-v19"><div class="data-head"><span>Alert</span><span>Severity</span><span>Time</span><span>Status</span><span>Action</span></div>
      <div class="data-row"><div><strong>${warningRow ? 'Low performance / telemetry delay' : 'No active issues'}</strong><small>${device.name}</small></div><div>${warningRow ? '<span class="badge warning">Warning</span>' : '<span class="badge success">Normal</span>'}</div><div><span>${warningRow ? device.lastSeen : 'Now'}</span></div><div><span>${warningRow ? 'Open' : 'Clear'}</span></div><div><button class="small-btn" type="button">${warningRow ? 'Open Alert' : 'View History'}</button></div></div>
      ${warningRow ? '<div class="data-row"><div><strong>String imbalance detected</strong><small>MPPT 3 · String 5</small></div><div><span class="badge warning">Warning</span></div><div><span>23 min ago</span></div><div><span>Open</span></div><div><button class="small-btn" type="button">Open SOP</button></div></div>' : ''}
    </div>`;

  if (tab === 'topology') return `<div class="section-title-v17"><div><h2>Topology</h2><p class="muted">Device position inside the plant hierarchy and nearby related device.</p></div></div>
    <div class="topology-path-v20"><span>Tenant</span><b>→</b><span>${plant.name}</span><b>→</b><span>${device.location}</span><b>→</b><span>${device.name}</span></div>
    <div class="asset-tree-v17"><div>Plant · ${plant.name}</div><ul><li>${device.location}<ul><li>${device.type} · ${device.name}<ul>${isInverter ? '<li>MPPT 1–12</li><li>String groups 1–24</li><li>PV module groups</li><li>Linked meter is plant-level sibling, not inverter child</li>' : `<li>${device.children}</li>`}</ul></li></ul></li></ul></div>
    <div class="section-title-v17 mini"><div><h3>Sibling device in this plant</h3><p class="muted">Meters, weather stations, transformers and BESS are related through Plant, not normally mounted under the inverter.</p></div></div>${deviceSiblingList(device, siblings)}`;

  if (tab === 'mppt') return renderMpptStringsTab(device, warningRow);

  if (tab === 'passport') return `<div class="section-title-v17"><div><h2>Technical Passport</h2><p class="muted">Static master data. This should not be mixed with live telemetry.</p></div></div><div class="info-grid"><div><span>Device ID</span><strong>${device.id}</strong></div><div><span>Serial Number</span><strong>${device.serial}</strong></div><div><span>Vendor</span><strong>${device.vendor}</strong></div><div><span>Model</span><strong>${device.model}</strong></div><div><span>Rated Capacity</span><strong>${device.capacity}</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>Commissioning</span><strong>${plant.commissioning}</strong></div><div><span>Warranty</span><strong>Active · 2024–2029</strong></div><div><span>Plant</span><strong>${plant.name}</strong></div><div><span>Install Location</span><strong>${device.location}</strong></div></div>`;

  if (tab === 'source') return `<div class="section-title-v17"><div><h2>Source & Sync</h2><p class="muted">Connector lineage and freshness for this source device record.</p></div></div><div class="info-grid"><div><span>Source System</span><strong>${device.vendor === 'Huawei' ? 'Huawei FusionSolar' : device.vendor + ' connector'}</strong></div><div><span>Source Entity ID</span><strong>${device.serial}</strong></div><div><span>FleetOS Device ID</span><strong>${device.id}</strong></div><div><span>Last Seen</span><strong>${device.lastSeen}</strong></div><div><span>Mapping Status</span><strong>Mapped to canonical device</strong></div><div><span>Data Freshness</span><strong>${metrics.freshness}</strong></div><div><span>Raw Payload</span><strong>Available in Data Governance</strong></div><div><span>Capability Flags</span><strong>Telemetry · Alerts · Passport</strong></div></div>`;

  if (tab === 'activity') return `<div class="section-title-v17"><div><h2>Activity</h2><p class="muted">Recent operational and governance timeline for this device.</p></div></div><div class="status-timeline-v20"><div class="chart-card-head-v20"><strong>Status timeline</strong><small>Last 24 hours</small></div><div class="status-steps-v20"><span class="ok">Normal</span><span class="ok">Normal</span><span class="ok">Normal</span><span class="${warningRow ? 'warn' : 'ok'}">${warningRow ? 'Warning' : 'Normal'}</span><span class="${warningRow ? 'warn' : 'ok'}">${warningRow ? 'Warning' : 'Normal'}</span></div></div><div class="timeline-v17"><div><b>Today</b><span>${device.name} telemetry refreshed from source connector</span></div><div><b>Today</b><span>${warningRow ? 'Low performance alert created and linked to MPPT 3' : 'No active alert created during current period'}</span></div><div><b>Yesterday</b><span>Technical passport checked against source connector</span></div><div><b>03 Jun</b><span>Device hierarchy confirmed under ${plant.name}</span></div><div><b>01 Jun</b><span>Firmware version ${device.firmware} verified</span></div></div>`;

  return `<div class="section-title-v17"><div><h2>Inverter Overview</h2><p class="muted">Production-ready inverter detail shell with operational KPI, topology and source traceability.</p></div></div>
    ${inverterMetricCards(device)}
    <div class="device-overview-grid-v19"><article><span>Status</span><strong>${statusBadge}</strong><small>Last seen ${device.lastSeen}</small></article><article><span>Device Type</span><strong>${device.type}</strong><small>${device.vendor} · ${device.model}</small></article><article><span>Parent Plant</span><strong>${plant.name}</strong><small>${plant.code}</small></article><article><span>Traceability</span><strong>${device.location}</strong><small>${device.children}</small></article></div>
    <div class="section-title-v17 mini"><div><h3>Device level rule</h3><p class="muted">For an inverter, real children are MPPT inputs and strings. Meter, weather station, transformer and BESS are sibling plant-level devices unless the electrical design explicitly links them.</p></div></div>`;
}

function mpptRowsV23(device) {
  const warning = device.status === 'Warning';
  return Array.from({ length: 6 }).map((_, i) => {
    const mppt = `MPPT ${i + 1}`;
    const s1 = i * 2 + 1;
    const s2 = i * 2 + 2;
    const warn = warning && i === 2;
    return `<div class="mppt-card-v23">
      <div class="mppt-card-head-v23">
        <div><strong>${mppt}</strong><small>${device.id}-MPPT-${String(i + 1).padStart(2, '0')}</small></div>
        <span class="badge ${warn ? 'warning' : 'success'}">${warn ? 'Warning' : 'Normal'}</span>
      </div>
      <div class="mppt-metrics-v23">
        <div><span>DC Voltage</span><b>${790 + i * 4} V</b></div>
        <div><span>DC Current</span><b>${18 + (i % 4)}.${i} A</b></div>
        <div><span>DC Power</span><b>${Math.round((790 + i * 4) * (18 + (i % 4)) / 1000)} kW</b></div>
        <div><span>Strings</span><b>2</b></div>
      </div>
      <div class="string-list-v23">
        ${[s1, s2].map((num, idx) => {
          const stringId = `String-${String(num).padStart(2, '0')}`;
          const stringWarn = warn && idx === 0;
          return `<button type="button" class="string-pill-v23 ${stringWarn ? 'warning' : ''}" data-open-string="${stringId}" data-parent-mppt="${mppt}">
            <span>${stringId}</span><small>${stringWarn ? 'Current imbalance' : '24 PV modules · Normal'}</small>
          </button>`;
        }).join('')}
      </div>
      <button class="small-btn" type="button" data-open-mppt="${mppt}">Open MPPT Detail</button>
    </div>`;
  }).join('');
}

function renderMpptStringsTab(device, warningRow) {
  return `<div class="section-title-v17"><div><h2>MPPT / Strings</h2><p class="muted">Inverter-specific electrical hierarchy. MPPT inputs collect string groups, and strings trace down to PV module groups.</p></div></div>
    <div class="mppt-summary-v20"><article><span>MPPT Channels</span><strong>12</strong><small>Inputs monitored</small></article><article><span>String Groups</span><strong>24</strong><small>2 strings per MPPT</small></article><article><span>PV Modules</span><strong>approx. 546</strong><small>Estimated under inverter</small></article><article><span>Imbalance</span><strong>${warningRow ? 'Detected' : 'None'}</strong><small>String current variance</small></article></div>
    <div class="mppt-tree-v23"><div class="mppt-tree-title-v23"><strong>${device.name}</strong><small>Plant → Inverter → MPPT → String → PV Modules</small></div>${mpptRowsV23(device)}</div>
    <div class="data-table compact-table inverter-string-table-v19 inverter-string-table-v23"><div class="data-head"><span>MPPT</span><span>Strings</span><span>DC Voltage</span><span>Current</span><span>Status</span><span>Action</span></div>${Array.from({length:12}).map((_,i)=>`<div class="data-row"><div><strong>MPPT ${i+1}</strong><small>${device.id}-MPPT-${i+1}</small></div><div><strong>String ${i*2+1}–${i*2+2}</strong><small>PV module group</small></div><div><span>${790+i*4} V</span></div><div><span>${18+(i%4)}.${i} A</span></div><div><span class="badge ${i===2 && warningRow ? 'warning' : 'success'}">${i===2 && warningRow ? 'Warning' : 'Normal'}</span></div><div><button class="small-btn" type="button" data-open-mppt="MPPT ${i+1}">Open Detail</button></div></div>`).join('')}</div>`;
}

function ensureStringDrawerShell() {
  let drawer = document.getElementById('stringDetailDrawerV23');
  if (drawer) return drawer;
  drawer = document.createElement('aside');
  drawer.id = 'stringDetailDrawerV23';
  drawer.className = 'detail-drawer string-detail-drawer-v23';
  document.body.appendChild(drawer);
  return drawer;
}

function openMpptDrawer(device, mpptName) {
  const idx = parseInt(String(mpptName).replace(/[^0-9]/g, ''), 10) || 1;
  const drawer = ensureStringDrawerShell();
  drawer.innerHTML = `<button class="drawer-close" type="button" aria-label="Close">x</button>
    <div class="drawer-heading-v55"><h2>${mpptName}</h2><p>${device.name} · input channel detail</p></div>
    <div class="drawer-status-row"><span class="badge ${device.status === 'Warning' && idx === 3 ? 'warning' : 'success'}">${device.status === 'Warning' && idx === 3 ? 'Warning' : 'Normal'}</span><span>Last update ${device.lastSeen}</span></div>
    <div class="drawer-metrics rich mppt-drawer-metrics-v23"><div><span>DC Voltage</span><strong>${790 + idx * 4} V</strong></div><div><span>DC Current</span><strong>${18 + (idx % 4)}.${idx} A</strong></div><div><span>DC Power</span><strong>${Math.round((790 + idx * 4) * (18 + (idx % 4)) / 1000)} kW</strong></div><div><span>Connected Strings</span><strong>2</strong></div></div>
    <div class="drawer-body"><strong>MPPT role</strong><p>MPPT collects DC input from connected PV strings and is monitored under the inverter, not as a separate plant-level device.</p></div>
    <div class="drawer-action-grid"><button type="button" data-open-string="String-${String(idx*2-1).padStart(2,'0')}" data-parent-mppt="${mpptName}">Open String ${idx*2-1}</button><button type="button" data-open-string="String-${String(idx*2).padStart(2,'0')}" data-parent-mppt="${mpptName}">Open String ${idx*2}</button></div>`;
  drawer.classList.add('open');
  drawer.querySelector('.drawer-close').onclick = () => drawer.classList.remove('open');
  drawer.querySelectorAll('[data-open-string]').forEach(btn => btn.onclick = () => openStringDrawer(device, btn.dataset.openString, btn.dataset.parentMppt));
}

function openStringDrawer(device, stringName, parentMppt) {
  const n = parseInt(String(stringName).replace(/[^0-9]/g, ''), 10) || 1;
  const warning = device.status === 'Warning' && n === 5;
  const drawer = ensureStringDrawerShell();
  drawer.innerHTML = `<button class="drawer-close" type="button" aria-label="Close">x</button>
    <div class="drawer-heading-v55"><h2>${stringName}</h2><p>${parentMppt} · ${device.name}</p></div>
    <div class="drawer-status-row"><span class="badge ${warning ? 'warning' : 'success'}">${warning ? 'Warning' : 'Normal'}</span><span>Last update ${device.lastSeen}</span></div>
    <div class="drawer-metrics rich string-drawer-metrics-v23"><div><span>Voltage</span><strong>${620 + n * 3} V</strong></div><div><span>Current</span><strong>${warning ? '7.8 A' : (9 + (n % 3)) + '.4 A'}</strong></div><div><span>Power</span><strong>${warning ? '4.8 kW' : (6 + (n % 5)) + '.2 kW'}</strong></div><div><span>PV Modules</span><strong>24</strong></div></div>
    <div class="drawer-body"><strong>Electrical detail</strong><p>${warning ? 'Current is below neighbouring strings. This is a good candidate for inspection or SOP follow-up.' : 'String output is aligned with neighbouring strings in the same MPPT group.'}</p></div>
    <div class="drawer-body"><strong>PV Modules</strong><div class="pv-module-list-v23">${Array.from({length:12}).map((_,i)=>`<span>PV-${String(n).padStart(2,'0')}-${String(i+1).padStart(2,'0')}</span>`).join('')}</div><small class="muted">Showing 12 of 24 modules for prototype readability.</small></div>
    <div class="drawer-body"><strong>Alerts</strong><p>${warning ? 'Low string current · mismatch suspected · open investigation recommended.' : 'No active string-level alerts detected.'}</p></div>
    <div class="drawer-action-grid"><button type="button">View String Telemetry</button><button type="button">Create Inspection Task</button></div>`;
  drawer.classList.add('open');
  drawer.querySelector('.drawer-close').onclick = () => drawer.classList.remove('open');
}

function deviceSiblingList(device, siblings) {
  const list = siblings.filter(x => x.id !== device.id).slice(0, 5);
  if (!list.length) return `<div class="empty-state"><strong>No sibling device</strong><small>This plant has only one sample device record.</small></div>`;
  return `<div class="device-sibling-grid-v19">${list.map(x => `<article><strong>${x.name}</strong><small>${x.type} · ${x.status}</small></article>`).join('')}</div>`;
}
