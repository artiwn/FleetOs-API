/* FleetOS Vendor API diagnostics layer
   Scope: vendor-specific Swagger endpoints for DeyeCloud, Huawei and Solarx.
   Safe automatic checks are limited to read/status endpoints. Token/control/write actions stay manual. */
const FleetOSVendorAPI = (() => {
  function qs(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.set(key, String(value));
    });
    const text = search.toString();
    return text ? `?${text}` : '';
  }

  function request(path, options = {}) {
    return FleetOSPlatformAPI.rawRequest(path, options);
  }

  const deyeCloud = {
    tokenAccess: (forceRefresh = false) => request(`/api/DeyeCloud/token-access${qs({ forceRefresh })}`, { method: 'POST' }),
    tokenStatus: () => request('/api/DeyeCloud/token/status'),
    tokenClear: () => request('/api/DeyeCloud/token/clear', { method: 'POST' }),
    accountInfo: () => request('/api/DeyeCloud/account-info', { method: 'POST' }),
    businessToken: (forceRefresh = false) => request(`/api/DeyeCloud/business-token${qs({ forceRefresh })}`, { method: 'POST' }),
    devices: (page = 1, size = 20) => request(`/api/DeyeCloud/devices${qs({ page, size })}`),
    stationList: (payload = { page: 1, size: 20 }) => request('/api/DeyeCloud/station-list', { method: 'POST', body: payload }),
    deviceList: (payload = { page: 1, size: 20, stationIds: [] }) => request('/api/DeyeCloud/device-list', { method: 'POST', body: payload }),
    deviceLatest: (payload) => request('/api/DeyeCloud/device-latest', { method: 'POST', body: payload }),
    measurePoints: (payload) => request('/api/DeyeCloud/measurePoints', { method: 'POST', body: payload }),
    history: (payload) => request('/api/DeyeCloud/history', { method: 'POST', body: payload }),
    stationLatest: (payload) => request('/api/DeyeCloud/station/latest', { method: 'POST', body: payload }),
    stationHistory: (payload) => request('/api/DeyeCloud/station/history', { method: 'POST', body: payload }),
    order: (orderId) => request(`/api/DeyeCloud/order/${encodeURIComponent(orderId)}`),
    customControl: (payload) => request('/api/DeyeCloud/order/custom-control', { method: 'POST', body: payload }),
    batteryMode: (payload) => request('/api/DeyeCloud/order/battery-mode', { method: 'POST', body: payload }),
    batteryParameter: (payload) => request('/api/DeyeCloud/order/battery-parameter', { method: 'POST', body: payload }),
    tou: (payload) => request('/api/DeyeCloud/order/tou', { method: 'POST', body: payload }),
    dynamicControl: (payload) => request('/api/DeyeCloud/strategy/dynamic-control', { method: 'POST', body: payload })
  };

  const huawei = {
    devices: (page = 1, size = 20) => request(`/api/Huawei/devices${qs({ page, size })}`),
    logout: () => request('/api/Huawei/logout', { method: 'POST' }),
    stationList: () => request('/api/Huawei/station/list', { method: 'POST' }),
    stationRealtime: (payload) => request('/api/Huawei/station/realtime', { method: 'POST', body: payload }),
    stationHourly: (payload) => request('/api/Huawei/station/hourly', { method: 'POST', body: payload }),
    stationDaily: (payload) => request('/api/Huawei/station/daily', { method: 'POST', body: payload }),
    stationMonthly: (payload) => request('/api/Huawei/station/monthly', { method: 'POST', body: payload }),
    stationYearly: (payload) => request('/api/Huawei/station/yearly', { method: 'POST', body: payload }),
    deviceRealtime: (payload) => request('/api/Huawei/device/realtime', { method: 'POST', body: payload }),
    deviceHistory: (payload) => request('/api/Huawei/device/history', { method: 'POST', body: payload }),
    deviceDaily: (payload) => request('/api/Huawei/device/daily', { method: 'POST', body: payload }),
    deviceMonthly: (payload) => request('/api/Huawei/device/monthly', { method: 'POST', body: payload }),
    deviceYearly: (payload) => request('/api/Huawei/device/yearly', { method: 'POST', body: payload })
  };

  const solarx = {
    token: (forceRefresh = false) => request(`/api/Solarx/auth/token${qs({ forceRefresh })}`, { method: 'POST' }),
    tokenStatus: () => request('/api/Solarx/auth/token/status'),
    plants: (params = {}) => request(`/api/Solarx/plants${qs(params)}`),
    devices: (params = {}) => request(`/api/Solarx/devices${qs(params)}`),
    plantsRealtime: (params = {}) => request(`/api/Solarx/plants/realtime${qs(params)}`),
    alarms: (params = {}) => request(`/api/Solarx/alarms${qs(params)}`),
    plantsStatistics: (payload) => request('/api/Solarx/plants/statistics', { method: 'POST', body: payload }),
    devicesRealtime: (params = {}) => request(`/api/Solarx/devices/realtime${qs(params)}`),
    devicesHistory: (params = {}) => request(`/api/Solarx/devices/history${qs(params)}`),
    requestResult: (payload) => request('/api/Solarx/control/request-result', { method: 'POST', body: payload }),
    masterDevice: (payload) => request('/api/Solarx/control/master-device', { method: 'POST', body: payload }),
    exportLimit: (payload) => request('/api/Solarx/control/export-limit', { method: 'POST', body: payload }),
    importLimit: (payload) => request('/api/Solarx/control/import-limit', { method: 'POST', body: payload }),
    exitRemoteControl: (payload) => request('/api/Solarx/control/exit-remote-control', { method: 'POST', body: payload }),
    powerControlMode: (payload) => request('/api/Solarx/control/power-control-mode', { method: 'POST', body: payload }),
    selfUseMode: (payload) => request('/api/Solarx/control/self-use-mode', { method: 'POST', body: payload }),
    constPowerMode: (payload) => request('/api/Solarx/control/const-power-mode', { method: 'POST', body: payload }),
    raw: (payload) => request('/api/Solarx/raw', { method: 'POST', body: payload })
  };

  const endpointCatalog = [
    { vendor: 'DeyeCloud', group: 'DeyeCloud Auth', label: 'Token Access', method: 'POST', path: '/api/DeyeCloud/token-access?forceRefresh=false', safe: false, notes: 'Manual only. Creates/refreshes provider token.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Auth', label: 'Token Status', method: 'GET', path: '/api/DeyeCloud/token/status', safe: true, notes: 'Safe token status check.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Auth', label: 'Clear Token', method: 'POST', path: '/api/DeyeCloud/token/clear', safe: false, notes: 'Manual only. Clears provider token.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Auth', label: 'Account Info', method: 'POST', path: '/api/DeyeCloud/account-info', safe: false, notes: 'Manual only. Provider account call.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Auth', label: 'Business Token', method: 'POST', path: '/api/DeyeCloud/business-token?forceRefresh=false', safe: false, notes: 'Manual only. Creates/refreshes business token.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Devices', method: 'GET', path: '/api/DeyeCloud/devices?page=1&size=20', safe: true, notes: 'Safe list check with pagination defaults.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Station List', method: 'POST', path: '/api/DeyeCloud/station-list', safe: false, sampleBody: { page: 1, size: 20 }, notes: 'Manual only. Requires provider data context.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Device List', method: 'POST', path: '/api/DeyeCloud/device-list', safe: false, sampleBody: { page: 1, size: 20, stationIds: [] }, notes: 'Manual only. Requires station IDs.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Device Latest', method: 'POST', path: '/api/DeyeCloud/device-latest', safe: false, sampleBody: { deviceList: [] }, notes: 'Manual only. Requires device list.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Measure Points', method: 'POST', path: '/api/DeyeCloud/measurePoints', safe: false, sampleBody: { deviceSn: '', deviceType: '' }, notes: 'Manual only. Requires device SN/type.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Device History', method: 'POST', path: '/api/DeyeCloud/history', safe: false, sampleBody: { deviceSn: '', granularity: 1, startAt: '', endAt: '', measurePoints: [] }, notes: 'Manual only. Requires device SN and period.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Station Latest', method: 'POST', path: '/api/DeyeCloud/station/latest', safe: false, sampleBody: { stationId: 0 }, notes: 'Manual only. Requires station ID.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Data', label: 'Station History', method: 'POST', path: '/api/DeyeCloud/station/history', safe: false, sampleBody: { stationId: 0, granularity: 1, startAt: '', endAt: '' }, notes: 'Manual only. Requires station ID and period.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Orders', label: 'Order by ID', method: 'GET', path: '/api/DeyeCloud/order/{orderId}', safe: false, notes: 'Manual only. Requires orderId.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Control', label: 'Custom Control', method: 'POST', path: '/api/DeyeCloud/order/custom-control', safe: false, sampleBody: { deviceSn: '', content: '', timeoutSeconds: 30 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Control', label: 'Battery Mode', method: 'POST', path: '/api/DeyeCloud/order/battery-mode', safe: false, sampleBody: { deviceSn: '', batteryModeType: '', action: '' }, notes: 'Manual only. Control/write action.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Control', label: 'Battery Parameter', method: 'POST', path: '/api/DeyeCloud/order/battery-parameter', safe: false, sampleBody: { deviceSn: '', paramterType: '', value: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Control', label: 'TOU Update', method: 'POST', path: '/api/DeyeCloud/order/tou', safe: false, sampleBody: { deviceSn: '', timeUseSettingItems: [], timeoutSeconds: 30 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'DeyeCloud', group: 'DeyeCloud Control', label: 'Dynamic Control', method: 'POST', path: '/api/DeyeCloud/strategy/dynamic-control', safe: false, sampleBody: { deviceSn: '', gridChargeAction: '', solarSellAction: '', touAction: '', workMode: '' }, notes: 'Manual only. Control/write action.' },

    { vendor: 'Huawei', group: 'Huawei Data', label: 'Devices', method: 'GET', path: '/api/Huawei/devices?page=1&size=20', safe: true, notes: 'Safe list check with pagination defaults.' },
    { vendor: 'Huawei', group: 'Huawei Auth', label: 'Logout', method: 'POST', path: '/api/Huawei/logout', safe: false, notes: 'Manual only. Ends provider session.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station List', method: 'POST', path: '/api/Huawei/station/list', safe: false, notes: 'Manual only. Provider station call.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station Realtime', method: 'POST', path: '/api/Huawei/station/realtime', safe: false, sampleBody: { stationCodes: '' }, notes: 'Manual only. Requires station codes.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station Hourly', method: 'POST', path: '/api/Huawei/station/hourly', safe: false, sampleBody: { stationCodes: '', collectTime: 0 }, notes: 'Manual only. Requires station codes/time.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station Daily', method: 'POST', path: '/api/Huawei/station/daily', safe: false, sampleBody: { stationCodes: '', collectTime: 0 }, notes: 'Manual only. Requires station codes/time.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station Monthly', method: 'POST', path: '/api/Huawei/station/monthly', safe: false, sampleBody: { stationCodes: '', collectTime: 0 }, notes: 'Manual only. Requires station codes/time.' },
    { vendor: 'Huawei', group: 'Huawei Data', label: 'Station Yearly', method: 'POST', path: '/api/Huawei/station/yearly', safe: false, sampleBody: { stationCodes: '', collectTime: 0 }, notes: 'Manual only. Requires station codes/time.' },
    { vendor: 'Huawei', group: 'Huawei Device Data', label: 'Device Realtime', method: 'POST', path: '/api/Huawei/device/realtime', safe: false, sampleBody: { devIds: '', devTypeId: 0 }, notes: 'Manual only. Requires device IDs/type.' },
    { vendor: 'Huawei', group: 'Huawei Device Data', label: 'Device History', method: 'POST', path: '/api/Huawei/device/history', safe: false, sampleBody: { devIds: '', devTypeId: 0, startTime: 0, endTime: 0 }, notes: 'Manual only. Requires device IDs/time.' },
    { vendor: 'Huawei', group: 'Huawei Device Data', label: 'Device Daily', method: 'POST', path: '/api/Huawei/device/daily', safe: false, sampleBody: { devIds: '', devTypeId: 0, collectTime: 0 }, notes: 'Manual only. Requires device IDs/time.' },
    { vendor: 'Huawei', group: 'Huawei Device Data', label: 'Device Monthly', method: 'POST', path: '/api/Huawei/device/monthly', safe: false, sampleBody: { devIds: '', devTypeId: 0, collectTime: 0 }, notes: 'Manual only. Requires device IDs/time.' },
    { vendor: 'Huawei', group: 'Huawei Device Data', label: 'Device Yearly', method: 'POST', path: '/api/Huawei/device/yearly', safe: false, sampleBody: { devIds: '', devTypeId: 0, collectTime: 0 }, notes: 'Manual only. Requires device IDs/time.' },

    { vendor: 'Solarx', group: 'Solarx Auth', label: 'Token', method: 'POST', path: '/api/Solarx/auth/token?forceRefresh=false', safe: false, notes: 'Manual only. Creates/refreshes provider token.' },
    { vendor: 'Solarx', group: 'Solarx Auth', label: 'Token Status', method: 'GET', path: '/api/Solarx/auth/token/status', safe: true, notes: 'Safe token status check.' },
    { vendor: 'Solarx', group: 'Solarx Data', label: 'Plants', method: 'GET', path: '/api/Solarx/plants', safe: true, notes: 'Safe provider plant query with no filters.' },
    { vendor: 'Solarx', group: 'Solarx Data', label: 'Devices', method: 'GET', path: '/api/Solarx/devices', safe: true, notes: 'Safe provider device query with no filters.' },
    { vendor: 'Solarx', group: 'Solarx Data', label: 'Plant Realtime', method: 'GET', path: '/api/Solarx/plants/realtime', safe: true, notes: 'Safe provider realtime query with no filters; backend may require PlantId.' },
    { vendor: 'Solarx', group: 'Solarx Data', label: 'Alarms', method: 'GET', path: '/api/Solarx/alarms', safe: true, notes: 'Safe provider alarm query with no filters.' },
    { vendor: 'Solarx', group: 'Solarx Data', label: 'Plant Statistics', method: 'POST', path: '/api/Solarx/plants/statistics', safe: false, sampleBody: { plantId: '', dateType: 1, date: '', businessType: 0 }, notes: 'Manual only. Requires plant/date context.' },
    { vendor: 'Solarx', group: 'Solarx Device Data', label: 'Devices Realtime', method: 'GET', path: '/api/Solarx/devices/realtime', safe: true, notes: 'Safe provider realtime query with no filters; backend may require SN/type.' },
    { vendor: 'Solarx', group: 'Solarx Device Data', label: 'Devices History', method: 'GET', path: '/api/Solarx/devices/history', safe: true, notes: 'Safe provider history query with no filters; backend may require time/SN.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Request Result', method: 'POST', path: '/api/Solarx/control/request-result', safe: false, sampleBody: { requestId: '' }, notes: 'Manual only. Reads request log by ID.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Master Device', method: 'POST', path: '/api/Solarx/control/master-device', safe: false, sampleBody: { deviceSn: '', deviceType: 0, businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Export Limit', method: 'POST', path: '/api/Solarx/control/export-limit', safe: false, sampleBody: { snList: [], deviceType: 0, isEnable: 0, limitValue: 0, businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Import Limit', method: 'POST', path: '/api/Solarx/control/import-limit', safe: false, sampleBody: { snList: [], deviceType: 0, isEnable: 0, limitValue: 0, businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Exit Remote Control', method: 'POST', path: '/api/Solarx/control/exit-remote-control', safe: false, sampleBody: { snList: [], businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Power Control Mode', method: 'POST', path: '/api/Solarx/control/power-control-mode', safe: false, sampleBody: { snList: [], activePower: 0, reactivePower: 0, duration: 0, businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Self Use Mode', method: 'POST', path: '/api/Solarx/control/self-use-mode', safe: false, sampleBody: { snList: [], businessType: 0, chargeUpperSoc: 0, minSoc: 0, chargeFromGridEnable: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Control', label: 'Const Power Mode', method: 'POST', path: '/api/Solarx/control/const-power-mode', safe: false, sampleBody: { snList: [], constPowerGridEnable: 0, constPowerDischargeLimit: 0, businessType: 0 }, notes: 'Manual only. Control/write action.' },
    { vendor: 'Solarx', group: 'Solarx Raw', label: 'Raw Request', method: 'POST', path: '/api/Solarx/raw', safe: false, sampleBody: { relativeUri: '', payload: {} }, notes: 'Manual only. Raw provider passthrough.' }
  ];

  async function checkCatalog({ includeUnsafe = false } = {}) {
    const checks = endpointCatalog.filter(item => item.safe || includeUnsafe);
    const results = [];
    for (const endpoint of checks) {
      if (!endpoint.safe) {
        results.push({ ...endpoint, ok: false, skipped: true, status: 'Skipped', statusText: 'Skipped', ms: 0, count: null, data: null, error: 'Manual only. Use Vendor Manual Request Runner.' });
        continue;
      }
      const result = await request(endpoint.path, { method: endpoint.method });
      results.push({ ...endpoint, ...result });
    }
    return results;
  }

  return { deyeCloud, huawei, solarx, endpointCatalog, checkCatalog, request, qs };
})();

window.FleetOSVendorAPI = FleetOSVendorAPI;
