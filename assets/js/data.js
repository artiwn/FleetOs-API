window.FleetOSMock = {
  kpis: [
    { label: 'Tenants', value: '124', delta: '+8 this month', icon: '🏢', tone: 'cyan', route: 'tenants' },
    { label: 'Plants', value: '4,285', delta: '+142 active', icon: '🏭', tone: 'green', route: 'asset-registry' },
    { label: 'Devices', value: '68,521', delta: '99.1% online', icon: '🔌', tone: 'blue', route: 'devices' },
    { label: 'Live Power', value: '1.24 GW', delta: '+2.1% vs yesterday', icon: '⚡', tone: 'yellow', route: 'telemetry' },
    { label: 'Active Incidents', value: '187', delta: '15 critical', icon: '🚨', tone: 'red', route: 'incident-center' },
    { label: 'Commercial Models', value: '€1.2M', delta: 'Commercial Governance', icon: '💰', tone: 'violet', route: 'commercial-models' }
  ],
  fleetHealth: [
    { label: 'Normal', value: 81 },
    { label: 'Warning', value: 12 },
    { label: 'Fault', value: 5 },
    { label: 'Offline', value: 2 }
  ],
  quality: [
    { label: 'Telemetry', value: '98.7%' },
    { label: 'Alerts', value: '95.2%' },
    { label: 'Devices', value: '99.1%' },
    { label: 'Mappings', value: '97.4%' }
  ],
  alerts: [
    { title: 'Plant offline', tenant: 'Tenant Alpha Energy', plant: 'Plant A', severity: 'Critical', time: '4 min ago' },
    { title: 'BESS temperature warning', tenant: 'Tenant North Operations', plant: 'Armavir BESS', severity: 'High', time: '12 min ago' },
    { title: 'Telemetry Missing', tenant: 'Tenant Gamma Grid', plant: 'Madrid East', severity: 'Medium', time: '21 min ago' },
    { title: 'Inverter Fault Detected', tenant: 'Tenant Delta Enterprise', plant: 'Lyon PV Park', severity: 'Critical', time: '29 min ago' }
  ],
  integrations: [
    { name: 'Huawei FusionSolar', status: 'Healthy', sync: '1 min ago', errors: 0 },
    { name: 'Sungrow iSolarCloud', status: 'Delayed', sync: '18 min ago', errors: 4 },
    { name: 'SolarEdge', status: 'Healthy', sync: '2 min ago', errors: 0 },
    { name: 'Solis Cloud', status: 'Failed', sync: '54 min ago', errors: 12 }
  ],
  tenants: [
    { name: 'Tenant Alpha Energy', plants: 318, revenue: '€248k', health: 'Warning' },
    { name: 'Tenant North Operations', plants: 274, revenue: '€211k', health: 'Normal' },
    { name: 'Tenant Gamma Grid', plants: 195, revenue: '€174k', health: 'Fault' },
    { name: 'Tenant Delta Enterprise', plants: 166, revenue: '€132k', health: 'Normal' }
  ],
  activity: [
    'Tenant Tenant Alpha Energy changed integration credentials',
    'Critical alert assigned to Operations Team',
    'Huawei connector recovered after retry',
    'New plant commissioned: Gyumri Solar West',
    'Report exported by Global Admin',
    'User access policy updated for Tenant Admin role'
  ]
};
