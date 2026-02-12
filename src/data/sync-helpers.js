// ============================================================================
// Sync Helpers — pure merge/validation functions extracted from github-sync.js
// ============================================================================
// These are testable without network access or DOM dependencies.

/**
 * Parse a timestamp value into epoch ms. Returns 0 for invalid/missing.
 */
export function parseTimestamp(value) {
  const ts = value ? new Date(value).getTime() : 0;
  return Number.isFinite(ts) ? ts : 0;
}

/**
 * Check if a value is "empty" for merge purposes.
 */
export function isEmptyVal(v) {
  return v === '' || v === null || v === undefined;
}

/**
 * Check if a value is a plain object (not array, not null).
 */
export function isObjectRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Validate the structure of a cloud payload.
 * Returns an array of error strings (empty = valid).
 */
export function validateCloudPayload(data) {
  const errors = [];
  if (data.data && typeof data.data !== 'object') errors.push('data must be an object');
  if (data.tasks && !Array.isArray(data.tasks)) errors.push('tasks must be an array');
  if (data.taskCategories && !Array.isArray(data.taskCategories)) errors.push('taskCategories must be an array');
  if (data.taskLabels && !Array.isArray(data.taskLabels)) errors.push('taskLabels must be an array');
  if (data.taskPeople && !Array.isArray(data.taskPeople)) errors.push('taskPeople must be an array');
  if (data.customPerspectives && !Array.isArray(data.customPerspectives)) errors.push('customPerspectives must be an array');
  if (data.homeWidgets && !Array.isArray(data.homeWidgets)) errors.push('homeWidgets must be an array');
  if (data.triggers && !Array.isArray(data.triggers)) errors.push('triggers must be an array');
  if (data.lastUpdated && isNaN(new Date(data.lastUpdated).getTime())) errors.push('lastUpdated is not a valid date');
  if (data.meetingNotesByEvent && typeof data.meetingNotesByEvent !== 'object') errors.push('meetingNotesByEvent must be an object');
  if (Array.isArray(data.tasks)) {
    const sample = data.tasks.slice(0, 5);
    sample.forEach((task, i) => {
      if (!task || typeof task !== 'object') errors.push(`tasks[${i}] is not an object`);
      else if (!task.id) errors.push(`tasks[${i}] missing id`);
    });
  }
  return errors;
}

/**
 * Normalize deleted-task tombstones: prune expired entries (>180 days),
 * ensure string IDs and ISO timestamps.
 */
export function normalizeDeletedTaskTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const now = Date.now();
  const ttlMs = 180 * 24 * 60 * 60 * 1000;
  const normalized = {};
  Object.entries(raw).forEach(([id, ts]) => {
    if (!id) return;
    const parsed = parseTimestamp(ts);
    if (!parsed) return;
    if (now - parsed > ttlMs) return;
    normalized[String(id)] = new Date(parsed).toISOString();
  });
  return normalized;
}

/**
 * Normalize deleted-entity tombstones (nested by collection).
 */
export function normalizeDeletedEntityTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.entries(raw).forEach(([collection, ids]) => {
    if (!ids || typeof ids !== 'object') return;
    out[collection] = normalizeDeletedTaskTombstones(ids);
  });
  return out;
}

/**
 * Merge cloud daily tracking data into local allData.
 * Gap-fill strategy: if local field is empty but cloud has a value, adopt it.
 * @param {Object} localAllData - local state.allData (mutated in place)
 * @param {Object} cloudAllData - cloud data.data
 * @returns {Object} the merged localAllData
 */
export function mergeCloudAllData(localAllData, cloudAllData) {
  const categories = ['prayers', 'glucose', 'whoop', 'libre', 'family', 'habits'];

  Object.keys(cloudAllData).forEach(date => {
    if (!localAllData[date]) {
      localAllData[date] = cloudAllData[date];
      return;
    }

    const local = localAllData[date];
    const cloud = cloudAllData[date];

    categories.forEach(cat => {
      if (!cloud[cat]) return;
      if (!local[cat]) {
        local[cat] = cloud[cat];
        return;
      }
      Object.keys(cloud[cat]).forEach(field => {
        if (isEmptyVal(local[cat][field]) && !isEmptyVal(cloud[cat][field])) {
          local[cat][field] = cloud[cat][field];
        }
      });
    });
  });

  return localAllData;
}

/**
 * Merge an entity collection using newest-wins by timestamp.
 * @param {Array} localItems - local entity array
 * @param {Array} cloudItems - cloud entity array
 * @param {string[]} timestampFields - fields to use for ordering (e.g. ['updatedAt', 'createdAt'])
 * @param {Function} [isDeletedFn] - optional predicate (collection, id) => boolean
 * @returns {Array} merged entity array
 */
export function mergeEntityCollection(localItems = [], cloudItems = [], timestampFields = [], isDeletedFn = null) {
  const localList = Array.isArray(localItems) ? localItems : [];
  const cloudList = Array.isArray(cloudItems) ? cloudItems : [];
  const byId = new Map();

  localList.forEach(item => {
    if (isObjectRecord(item) && item.id) {
      if (isDeletedFn && isDeletedFn(item.id)) return;
      byId.set(item.id, item);
    }
  });

  cloudList.forEach(cloudItem => {
    if (!isObjectRecord(cloudItem) || !cloudItem.id) return;
    if (isDeletedFn && isDeletedFn(cloudItem.id)) return;

    const localItem = byId.get(cloudItem.id);
    if (!localItem) {
      byId.set(cloudItem.id, cloudItem);
      return;
    }
    if (!timestampFields.length) {
      return; // Keep local on conflict when no timestamp exists
    }
    const localTs = parseTimestamp(timestampFields.map(f => localItem[f]).find(Boolean));
    const cloudTs = parseTimestamp(timestampFields.map(f => cloudItem[f]).find(Boolean));
    if (cloudTs > localTs) byId.set(cloudItem.id, cloudItem);
  });

  return Array.from(byId.values());
}
