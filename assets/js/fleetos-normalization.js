/* FleetOS frontend normalization contract
   This file documents the canonical UI language used by the prototype.
   Source of truth JSON files live in assets/data/.
*/
window.FleetOSNormalization = {
  terms: {
    plant: 'Plant',
    device: 'Device',
    alert: 'Alert',
    event: 'Event',
    telemetry: 'Telemetry',
    tenant: 'Tenant',
    connector: 'Connector'
  },
  forbiddenUiSynonyms: {
    Plant: ['Site', 'Station'],
    Device: ['Asset', 'Equipment'],
    Alert: ['Alarm'],
    TemperatureUnit: ['°F', 'Fahrenheit']
  },
  normalizedUnits: {
    temperature: '°C',
    power: 'kW',
    energy: 'kWh',
    voltage: 'V',
    current: 'A',
    frequency: 'Hz',
    percent: '%'
  },
  dictionaries: {
    fields: 'assets/data/FleetOS_UI_Field_Dictionary_v1.json',
    screens: 'assets/data/FleetOS_UI_Screens_v1.json',
    alerts: 'assets/data/FleetOS_Canonical_Alerts_UI_Ready_v1.json',
    alertIntegration: 'assets/data/FleetOS_UI_Alert_Integration_v1.json'
  }
};
