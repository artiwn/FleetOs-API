(function(){
  /**
   * FleetOS UI normalization binding (silent runtime mode)
   *
   * Purpose:
   * - Keep UI labels/fields internally connected to FleetOS_UI_Screens_v1.json
   *   and FleetOS_UI_Field_Dictionary_v1.json.
   * - Do NOT render developer contract tables on business screens.
   * - Add non-visual data attributes where existing DOM labels/columns match
   *   canonical UI labels, field keys or ui keys.
   * - Expose window.FleetOSUiContract for debug/testing only.
   */
  const pageToScreens = {
    'plants.html': ['plant_list'],
    'plant-detail.html': ['plant_detail'],
    'devices.html': ['device_list'],
    'device-detail.html': [
      'inverter_detail',
      'battery_detail',
      'logger_dongle_detail',
      'meter_epm',
      'module',
      'weather_station',
      'ev_charger'
    ],
    'alerts.html': ['alarm_list'],
    'alert-detail.html': ['alarm_detail'],
    'telemetry.html': ['telemetry', 'historical_data'],
    'production.html': ['energy_flow'],
    'asset-topology.html': ['topology', 'device_architecture'],
    'settings.html': ['device_configuration'],
    'client-plant-assignment.html': ['authorization'],
    'client-users-permissions.html': ['authorization'],
    'users.html': ['authorization']
  };

  const dataBase = location.pathname.includes('/pages/') ? '../assets/data/' : 'assets/data/';
  const normalize = (value) => String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[：:]+$/g, '')
    .trim()
    .toLowerCase();

  async function loadJson(name){
    const response = await fetch(dataBase + name, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${name} load failed`);
    return response.json();
  }

  function flattenFields(screen){
    const fields = [];
    (screen.sections || []).forEach(section => {
      (section.fields || []).forEach(field => {
        fields.push({
          ...field,
          section_id: section.section_id,
          section_name: section.section_name,
          section_domain: section.domain || field.domain || ''
        });
      });
    });
    return fields;
  }

  function resolveScreenIds(){
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    const fromBody = document.body.getAttribute('data-fleetos-screen-id');
    if (fromBody) return fromBody.split(',').map(x => x.trim()).filter(Boolean);
    return pageToScreens[filename] || [];
  }

  function buildLookup(fields, dictionary){
    const dictionaryByKey = new Map((dictionary.fields || []).map(item => [item.field_key, item]));
    const lookup = new Map();

    fields.forEach(field => {
      const dict = dictionaryByKey.get(field.field_key) || {};
      const payload = {
        field_key: field.field_key,
        ui_key: field.ui_key || dict.ui_key || '',
        canonical_field: field.canonical_field || dict.canonical_field || field.field_key,
        ui_label: field.ui_label || dict.ui_label || field.field_key,
        entity: field.entity || dict.entity || '',
        data_type: field.data_type || dict.data_type || '',
        unit: field.unit || dict.unit || '',
        required_level: field.required_level || dict.required_level || '',
        section_id: field.section_id || '',
        section_name: field.section_name || '',
        source_file: field.source_file || dict.source_file || ''
      };

      [payload.ui_label, payload.field_key, payload.ui_key, payload.canonical_field]
        .filter(Boolean)
        .forEach(key => {
          const normalized = normalize(key);
          if (!normalized) return;
          if (!lookup.has(normalized)) lookup.set(normalized, payload);
        });
    });

    return lookup;
  }

  function isCandidateElement(element){
    if (!element || element.nodeType !== 1) return false;
    if (element.closest('#fleetosJsonUiContracts')) return false;
    const tag = element.tagName.toLowerCase();
    if (['script', 'style', 'svg', 'path', 'main', 'section', 'article', 'div', 'body', 'html'].includes(tag)) return false;
    const text = normalize(element.textContent);
    return text.length > 0 && text.length <= 80;
  }

  function bindElement(element, field){
    element.dataset.fieldKey = field.field_key || '';
    element.dataset.uiKey = field.ui_key || '';
    element.dataset.canonicalField = field.canonical_field || field.field_key || '';
    element.dataset.fleetosBound = 'true';
    element.dataset.fleetosEntity = field.entity || '';
    element.dataset.fleetosSection = field.section_id || '';
  }

  function bindVisibleDom(lookup){
    const candidates = Array.from(document.querySelectorAll('label, th, dt, dd, span, small, strong, b, p, button, a, option, h1, h2, h3, h4'))
      .filter(isCandidateElement);
    let boundCount = 0;

    candidates.forEach(element => {
      const text = normalize(element.textContent);
      const field = lookup.get(text);
      if (!field) return;
      bindElement(element, field);
      boundCount += 1;
    });

    return boundCount;
  }

  async function mountSilentBinding(){
    try {
      const screenIds = resolveScreenIds();
      if (!screenIds.length) return;

      const [screensJson, fieldDictionary] = await Promise.all([
        loadJson('FleetOS_UI_Screens_v1.json'),
        loadJson('FleetOS_UI_Field_Dictionary_v1.json')
      ]);

      const screenMap = new Map((screensJson.screens || []).map(screen => [screen.screen_id, screen]));
      const screens = screenIds.map(id => screenMap.get(id)).filter(Boolean);
      const expectedFields = screens.flatMap(flattenFields);
      const lookup = buildLookup(expectedFields, fieldDictionary);
      const boundElements = bindVisibleDom(lookup);

      document.body.dataset.fleetosScreenIds = screenIds.join(',');
      document.body.dataset.fleetosUiContractMode = 'silent';

      window.FleetOSUiContract = {
        mode: 'silent',
        screenIds,
        expectedFieldCount: expectedFields.length,
        boundElementCount: boundElements,
        fields: expectedFields.map(field => ({
          field_key: field.field_key,
          ui_key: field.ui_key,
          canonical_field: field.canonical_field,
          ui_label: field.ui_label,
          entity: field.entity,
          required_level: field.required_level,
          section_id: field.section_id,
          section_name: field.section_name
        }))
      };
    } catch (error) {
      console.warn('FleetOS silent UI binding skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(mountSilentBinding, 0));
  } else {
    setTimeout(mountSilentBinding, 0);
  }
})();
