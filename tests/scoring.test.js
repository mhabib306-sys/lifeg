// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parsePrayer,
  calcPrayerScore,
  invalidateScoresCache,
  getCacheKey,
  calculateScores,
  getLast30DaysData,
  getLast30DaysStats,
  getPersonalBests,
  loadWeights,
  loadMaxScores,
  updateWeight,
  resetWeights,
  resetMaxScores,
  getScoreTier,
  getLevel,
  getLevelInfo,
  getStreakMultiplier,
  calculateDailyXP,
  updateStreak,
  awardDailyXP,
  processGamification,
  getDailyFocus,
  checkAchievements,
  markAchievementNotified,
  saveXP,
  saveStreak,
  saveAchievements,
  updateMaxScore,
  updateCategoryWeight,
  resetCategoryWeights,
  rebuildGamification,
} from '../src/features/scoring.js';
import { state } from '../src/state.js';
import {
  DEFAULT_WEIGHTS,
  DEFAULT_MAX_SCORES,
  DEFAULT_CATEGORY_WEIGHTS,
  WEIGHTS_KEY,
  MAX_SCORES_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  STREAK_MIN_THRESHOLD,
  LEVEL_THRESHOLDS,
  SCORE_TIERS,
} from '../src/constants.js';
import { getLocalDateString } from '../src/utils.js';

// ---------------------------------------------------------------------------
// Global setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  // Reset scoring state
  state.WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
  state.MAX_SCORES = JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
  state.CATEGORY_WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_WEIGHTS));
  state.scoresCache = new Map();
  state.scoresCacheVersion = 0;

  // Reset gamification state
  state.xp = { total: 0, history: [] };
  state.streak = {
    current: 0,
    longest: 0,
    lastLoggedDate: null,
    shield: { available: true, lastUsed: null },
    multiplier: 1.0,
  };
  state.achievements = { unlocked: {} };

  // Reset allData to empty so tests are isolated
  state.allData = {};

  // Clear localStorage
  localStorage.clear();

  // Mock window.render and window.debouncedSaveToGithub
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
});

// ============================================================================
// parsePrayer
// ============================================================================
describe('parsePrayer', () => {
  it('parses 1 as 1 on-time, 0 late', () => {
    expect(parsePrayer('1')).toEqual({ onTime: 1, late: 0 });
  });

  it('parses 0.1 as 0 on-time, 1 late', () => {
    expect(parsePrayer('0.1')).toEqual({ onTime: 0, late: 1 });
  });

  it('parses 1.3 as 1 on-time, 3 late', () => {
    expect(parsePrayer('1.3')).toEqual({ onTime: 1, late: 3 });
  });

  it('returns zeros for empty/null/undefined', () => {
    expect(parsePrayer('')).toEqual({ onTime: 0, late: 0 });
    expect(parsePrayer(null)).toEqual({ onTime: 0, late: 0 });
    expect(parsePrayer(undefined)).toEqual({ onTime: 0, late: 0 });
  });

  it('handles numeric input (not just strings)', () => {
    expect(parsePrayer(1)).toEqual({ onTime: 1, late: 0 });
    expect(parsePrayer(0)).toEqual({ onTime: 0, late: 0 });
  });

  it('does not produce string results (type coercion bug)', () => {
    const { onTime, late } = parsePrayer('1.2');
    expect(typeof onTime).toBe('number');
    expect(typeof late).toBe('number');
  });

  it('parses 0.0 as 0 on-time, 0 late', () => {
    expect(parsePrayer('0.0')).toEqual({ onTime: 0, late: 0 });
    expect(parsePrayer(0.0)).toEqual({ onTime: 0, late: 0 });
  });

  it('treats negative values as 0 on-time, 0 late (Math.floor + round)', () => {
    // parseFloat(-1) = -1, Math.floor(-1) = -1, late = round(0) = 0
    const result = parsePrayer(-1);
    expect(result.onTime).toBe(-1);
    expect(result.late).toBe(0);
  });

  it('parses 2.5 as 2 on-time, 5 late', () => {
    expect(parsePrayer('2.5')).toEqual({ onTime: 2, late: 5 });
  });

  it('parses string "abc" as 0 on-time, 0 late', () => {
    // parseFloat("abc") = NaN, || 0 => 0
    expect(parsePrayer('abc')).toEqual({ onTime: 0, late: 0 });
  });

  it('parses boolean true as 0 (parseFloat(true) is NaN)', () => {
    // parseFloat(true) is NaN => || 0 => {0, 0}
    expect(parsePrayer(true)).toEqual({ onTime: 0, late: 0 });
  });

  it('parses boolean false as 0', () => {
    // false is falsy + not 0 => early return {0,0}
    expect(parsePrayer(false)).toEqual({ onTime: 0, late: 0 });
  });
});

// ============================================================================
// calcPrayerScore
// ============================================================================
describe('calcPrayerScore', () => {
  it('scores 1 on-time prayer at WEIGHTS.prayer.onTime', () => {
    expect(calcPrayerScore('1')).toBe(DEFAULT_WEIGHTS.prayer.onTime);
  });

  it('scores 1 late prayer at WEIGHTS.prayer.late', () => {
    expect(calcPrayerScore('0.1')).toBe(DEFAULT_WEIGHTS.prayer.late);
  });

  it('scores mixed on-time + late', () => {
    // 1.2 = 1 on-time + 2 late => 5 + 2*2 = 9
    expect(calcPrayerScore('1.2')).toBe(5 + 2 * 2);
  });

  it('returns 0 for empty value', () => {
    expect(calcPrayerScore('')).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(calcPrayerScore(null)).toBe(0);
  });

  it('uses state.WEIGHTS (mutable)', () => {
    state.WEIGHTS.prayer.onTime = 10;
    expect(calcPrayerScore('1')).toBe(10);
  });
});

// ============================================================================
// invalidateScoresCache
// ============================================================================
describe('invalidateScoresCache', () => {
  it('clears the scores cache', () => {
    state.scoresCache.set('test', { total: 42 });
    expect(state.scoresCache.size).toBe(1);
    invalidateScoresCache();
    expect(state.scoresCache.size).toBe(0);
  });

  it('increments scoresCacheVersion', () => {
    const before = state.scoresCacheVersion;
    invalidateScoresCache();
    expect(state.scoresCacheVersion).toBe(before + 1);
  });

  it('increments version on each call', () => {
    invalidateScoresCache();
    invalidateScoresCache();
    invalidateScoresCache();
    expect(state.scoresCacheVersion).toBe(3);
  });
});

// ============================================================================
// getCacheKey
// ============================================================================
describe('getCacheKey', () => {
  it('returns JSON.stringify of the data', () => {
    const data = { a: 1, b: 'two' };
    expect(getCacheKey(data)).toBe(JSON.stringify(data));
  });

  it('produces different keys for different data', () => {
    expect(getCacheKey({ x: 1 })).not.toBe(getCacheKey({ x: 2 }));
  });

  it('produces same key for identical objects', () => {
    const a = { prayers: { fajr: '1' } };
    const b = { prayers: { fajr: '1' } };
    expect(getCacheKey(a)).toBe(getCacheKey(b));
  });

  it('handles empty object', () => {
    expect(getCacheKey({})).toBe('{}');
  });

  it('handles nested objects', () => {
    const data = { a: { b: { c: 3 } } };
    expect(getCacheKey(data)).toBe('{"a":{"b":{"c":3}}}');
  });
});

// ============================================================================
// calculateScores
// ============================================================================
describe('calculateScores', () => {
  it('returns zero scores for empty data', () => {
    const scores = calculateScores({});
    expect(scores.prayer).toBe(0);
    expect(scores.family).toBe(0);
    expect(scores.total).toBe(0);
  });

  it('scores all 5 prayers on time correctly', () => {
    const data = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
    };
    const scores = calculateScores(data);
    // 5 prayers * 5 pts each = 25
    expect(scores.prayer).toBe(25);
    expect(scores.prayerOnTime).toBe(5);
    expect(scores.prayerLate).toBe(0);
  });

  it('scores late prayers at reduced rate', () => {
    const data = {
      prayers: { fajr: '0.1', dhuhr: '0.1', asr: '0.1', maghrib: '0.1', isha: '0.1', quran: 0 },
    };
    const scores = calculateScores(data);
    // 5 late prayers * 2 pts each = 10
    expect(scores.prayer).toBe(10);
    expect(scores.prayerOnTime).toBe(0);
    expect(scores.prayerLate).toBe(5);
  });

  it('includes quran bonus', () => {
    const data = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
    };
    const scores = calculateScores(data);
    // 25 (prayers) + 2*5 (quran) = 35
    expect(scores.prayer).toBe(35);
  });

  it('scores family members individually', () => {
    const data = {
      family: { mom: true, dad: true, jana: false, tia: false, ahmed: false, eman: false },
    };
    const scores = calculateScores(data);
    // mom (1) + dad (1) = 2
    expect(scores.family).toBe(2);
  });

  it('returns numeric types for all scores (no string coercion)', () => {
    const data = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: '2' },
      glucose: { avg: '105', tir: '80', insulin: '30' },
      family: { mom: true, dad: true },
      habits: { exercise: 1, reading: 1 },
    };
    const scores = calculateScores(data);
    expect(typeof scores.prayer).toBe('number');
    expect(typeof scores.diabetes).toBe('number');
    expect(typeof scores.family).toBe('number');
    expect(typeof scores.habit).toBe('number');
    expect(typeof scores.total).toBe('number');
    expect(typeof scores.normalized.overall).toBe('number');
  });

  it('normalized scores are between 0 and 1', () => {
    const data = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 10 },
      glucose: { avg: '105', tir: '100', insulin: '20' },
      family: { mom: true, dad: true, jana: true, tia: true, ahmed: true, eman: true },
      habits: { exercise: 1, reading: 1, meditation: 1, water: '3', vitamins: true, brushTeeth: 2, nop: '1' },
      whoop: { sleepPerf: '95', recovery: '80', strain: '18' },
    };
    const scores = calculateScores(data);
    Object.values(scores.normalized).forEach(val => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    });
  });

  it('caches results for repeated calls with same data', () => {
    const data = { prayers: { fajr: '1' } };
    const first = calculateScores(data);
    const second = calculateScores(data);
    expect(first).toBe(second); // Same reference (from cache)
  });

  // ---------- Glucose scoring tiers ----------
  describe('glucose scoring', () => {
    it('scores glucose avg=105 (target) at max points', () => {
      const data = { glucose: { avg: '105', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      const maxPts = state.WEIGHTS.glucose.avgMax;
      expect(scores.diabetes).toBe(maxPts);
    });

    it('scores glucose avg=70 at half max (edge of perfect range)', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '70', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      const maxPts = state.WEIGHTS.glucose.avgMax;
      // At edge: maxPts * (1 - (35/35)*0.5) = maxPts * 0.5
      expect(scores.diabetes).toBe(maxPts * 0.5);
    });

    it('scores glucose avg=140 at half max (edge of perfect range)', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '140', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      const maxPts = state.WEIGHTS.glucose.avgMax;
      expect(scores.diabetes).toBe(maxPts * 0.5);
    });

    it('scores glucose avg=180 at 0 (worst acceptable)', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '180', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBeCloseTo(0, 1);
    });

    it('scores glucose avg=200 at 0 (above 180 = 0)', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '200', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBe(0);
    });

    it('scores glucose avg=50 at 0 (below 70 = 0)', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '50', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBe(0);
    });

    it('scores TIR at tirPerPoint per percent', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '', tir: '80', insulin: '' } };
      const scores = calculateScores(data);
      const expected = 80 * state.WEIGHTS.glucose.tirPerPoint;
      expect(scores.diabetes).toBeCloseTo(expected, 1);
    });

    it('gives insulin base points when <= threshold', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '', tir: '', insulin: '30' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBe(state.WEIGHTS.glucose.insulinBase);
    });

    it('gives insulin penalty when > threshold', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '', tir: '', insulin: '50' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBe(state.WEIGHTS.glucose.insulinPenalty);
    });

    it('does not score empty glucose avg', () => {
      invalidateScoresCache();
      const data = { glucose: { avg: '', tir: '', insulin: '' } };
      const scores = calculateScores(data);
      expect(scores.diabetes).toBe(0);
    });
  });

  // ---------- WHOOP scoring ----------
  describe('whoop scoring', () => {
    it('scores high sleep perf (>=90) at sleepPerfHigh', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '95', recovery: '', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.sleepPerfHigh);
    });

    it('scores mid sleep perf (70-89) at sleepPerfMid', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '75', recovery: '', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.sleepPerfMid);
    });

    it('scores low sleep perf (50-69) at sleepPerfLow', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '55', recovery: '', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.sleepPerfLow);
    });

    it('scores 0 for sleep perf below 50', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '30', recovery: '', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(0);
    });

    it('scores recovery high (>=66)', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '70', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.recoveryHigh);
    });

    it('scores recovery mid (50-65)', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '55', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.recoveryMid);
    });

    it('scores recovery low (33-49)', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '40', strain: '' } };
      const scores = calculateScores(data);
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.recoveryLow);
    });

    it('scores strain match for high recovery + high strain', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '70', strain: '15' } };
      const scores = calculateScores(data);
      // recoveryHigh (2) + strainMatch (3) = 5
      expect(scores.whoop).toBe(
        state.WEIGHTS.whoop.recoveryHigh + state.WEIGHTS.whoop.strainMatch
      );
    });

    it('awards strain bonus for high strain on high recovery', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '70', strain: '19' } };
      const scores = calculateScores(data);
      // recoveryHigh + strainMatch + strainHigh
      expect(scores.whoop).toBe(
        state.WEIGHTS.whoop.recoveryHigh +
        state.WEIGHTS.whoop.strainMatch +
        state.WEIGHTS.whoop.strainHigh
      );
    });

    it('scores strain match for medium recovery + moderate strain', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '50', strain: '12' } };
      const scores = calculateScores(data);
      // recoveryMid (1) + strainMatch (3) = 4
      expect(scores.whoop).toBe(
        state.WEIGHTS.whoop.recoveryMid + state.WEIGHTS.whoop.strainMatch
      );
    });

    it('scores strain match for low recovery + light strain', () => {
      invalidateScoresCache();
      const data = { whoop: { sleepPerf: '', recovery: '20', strain: '5' } };
      const scores = calculateScores(data);
      // recovery < 33 = 0 pts + strainMatch (3) = 3
      expect(scores.whoop).toBe(state.WEIGHTS.whoop.strainMatch);
    });
  });

  // ---------- Habit scoring with NoP ----------
  describe('habit scoring', () => {
    it('scores exercise', () => {
      invalidateScoresCache();
      const data = { habits: { exercise: 1 } };
      const scores = calculateScores(data);
      expect(scores.habit).toBe(state.WEIGHTS.habits.exercise);
    });

    it('scores NoP = 1 (yes) as positive', () => {
      invalidateScoresCache();
      const data = { habits: { nop: '1' } };
      const scores = calculateScores(data);
      expect(scores.habit).toBe(state.WEIGHTS.habits.nopYes);
    });

    it('scores NoP = 0 (no) as penalty', () => {
      invalidateScoresCache();
      const data = { habits: { nop: '0' } };
      const scores = calculateScores(data);
      expect(scores.habit).toBe(state.WEIGHTS.habits.nopNo);
    });

    it('does not score empty NoP', () => {
      invalidateScoresCache();
      const data = { habits: { nop: '' } };
      const scores = calculateScores(data);
      expect(scores.habit).toBe(0);
    });

    it('scores all habits combined', () => {
      invalidateScoresCache();
      const data = {
        habits: {
          exercise: 1,
          reading: 1,
          meditation: 1,
          water: '2.5',
          vitamins: true,
          brushTeeth: 2,
          nop: '1',
        },
      };
      const scores = calculateScores(data);
      const w = state.WEIGHTS.habits;
      const expected =
        1 * w.exercise + 1 * w.reading + 1 * w.meditation +
        2.5 * w.water + w.vitamins + 2 * w.brushTeeth + w.nopYes;
      expect(scores.habit).toBe(expected);
    });

    it('vitamins false = no points', () => {
      invalidateScoresCache();
      const data = { habits: { vitamins: false } };
      const scores = calculateScores(data);
      expect(scores.habit).toBe(0);
    });
  });

  // ---------- Cache limit ----------
  it('clears cache when exceeding 500 entries', () => {
    // Fill cache to 501 entries
    for (let i = 0; i < 501; i++) {
      state.scoresCache.set(`key-${i}`, { total: i });
    }
    expect(state.scoresCache.size).toBe(501);
    // Next calculateScores call should clear the cache (size > 500)
    calculateScores({ prayers: { fajr: '1' } });
    // Cache was cleared and then the new result was added
    expect(state.scoresCache.size).toBe(1);
  });

  it('handles null data gracefully', () => {
    const scores = calculateScores(null);
    expect(scores.total).toBe(0);
    expect(scores.prayer).toBe(0);
  });

  it('handles non-object data gracefully', () => {
    const scores = calculateScores('not an object');
    expect(scores.total).toBe(0);
  });

  it('scores all 6 family members', () => {
    invalidateScoresCache();
    const data = {
      family: { mom: true, dad: true, jana: true, tia: true, ahmed: true, eman: true },
    };
    const scores = calculateScores(data);
    expect(scores.family).toBe(6);
  });
});

// ============================================================================
// loadWeights / loadMaxScores
// ============================================================================
describe('loadWeights', () => {
  it('returns defaults when nothing in localStorage', () => {
    localStorage.removeItem(WEIGHTS_KEY);
    const weights = loadWeights();
    expect(weights.prayer.onTime).toBe(DEFAULT_WEIGHTS.prayer.onTime);
    expect(weights.glucose.avgMax).toBe(DEFAULT_WEIGHTS.glucose.avgMax);
  });

  it('deep merges stored weights with defaults', () => {
    const partial = { prayer: { onTime: 10 } };
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(partial));
    const weights = loadWeights();
    expect(weights.prayer.onTime).toBe(10);
    // Other prayer keys should still exist from defaults
    expect(weights.prayer.late).toBe(DEFAULT_WEIGHTS.prayer.late);
    expect(weights.prayer.quran).toBe(DEFAULT_WEIGHTS.prayer.quran);
  });

  it('returns defaults for invalid JSON', () => {
    localStorage.setItem(WEIGHTS_KEY, 'not json');
    const weights = loadWeights();
    expect(weights.prayer.onTime).toBe(DEFAULT_WEIGHTS.prayer.onTime);
  });

  it('returns defaults for null stored value', () => {
    localStorage.setItem(WEIGHTS_KEY, 'null');
    const weights = loadWeights();
    expect(weights.prayer.onTime).toBe(DEFAULT_WEIGHTS.prayer.onTime);
  });

  it('returns defaults for number stored value', () => {
    localStorage.setItem(WEIGHTS_KEY, '42');
    const weights = loadWeights();
    expect(weights.prayer.onTime).toBe(DEFAULT_WEIGHTS.prayer.onTime);
  });
});

describe('loadMaxScores', () => {
  it('returns defaults when nothing in localStorage', () => {
    localStorage.removeItem(MAX_SCORES_KEY);
    const maxScores = loadMaxScores();
    expect(maxScores.prayer).toBe(DEFAULT_MAX_SCORES.prayer);
  });

  it('merges stored max scores with defaults', () => {
    localStorage.setItem(MAX_SCORES_KEY, JSON.stringify({ prayer: 50 }));
    const maxScores = loadMaxScores();
    expect(maxScores.prayer).toBe(50);
    expect(maxScores.diabetes).toBe(DEFAULT_MAX_SCORES.diabetes);
  });

  it('returns defaults for invalid JSON', () => {
    localStorage.setItem(MAX_SCORES_KEY, '{bad json');
    const maxScores = loadMaxScores();
    expect(maxScores.prayer).toBe(DEFAULT_MAX_SCORES.prayer);
  });

  it('returns defaults for null stored value', () => {
    localStorage.setItem(MAX_SCORES_KEY, 'null');
    const maxScores = loadMaxScores();
    expect(maxScores.prayer).toBe(DEFAULT_MAX_SCORES.prayer);
  });
});

// ============================================================================
// updateWeight / resetWeights / resetMaxScores
// ============================================================================
describe('updateWeight', () => {
  it('updates a nested weight field', () => {
    updateWeight('prayer', 'onTime', 10);
    expect(state.WEIGHTS.prayer.onTime).toBe(10);
  });

  it('saves to localStorage', () => {
    updateWeight('prayer', 'onTime', 10);
    const stored = JSON.parse(localStorage.getItem(WEIGHTS_KEY));
    expect(stored.prayer.onTime).toBe(10);
  });

  it('invalidates cache', () => {
    const versionBefore = state.scoresCacheVersion;
    updateWeight('prayer', 'onTime', 10);
    expect(state.scoresCacheVersion).toBe(versionBefore + 1);
  });

  it('calls window.render and window.debouncedSaveToGithub', () => {
    updateWeight('prayer', 'onTime', 10);
    expect(window.render).toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handles string values by parsing to float', () => {
    updateWeight('prayer', 'onTime', '7.5');
    expect(state.WEIGHTS.prayer.onTime).toBe(7.5);
  });

  it('defaults to 0 for non-numeric string', () => {
    updateWeight('prayer', 'onTime', 'abc');
    expect(state.WEIGHTS.prayer.onTime).toBe(0);
  });
});

describe('resetWeights', () => {
  it('resets WEIGHTS to defaults', () => {
    state.WEIGHTS.prayer.onTime = 99;
    resetWeights();
    expect(state.WEIGHTS.prayer.onTime).toBe(DEFAULT_WEIGHTS.prayer.onTime);
  });

  it('invalidates cache', () => {
    const versionBefore = state.scoresCacheVersion;
    resetWeights();
    expect(state.scoresCacheVersion).toBe(versionBefore + 1);
  });

  it('calls window.render', () => {
    resetWeights();
    expect(window.render).toHaveBeenCalled();
  });
});

describe('resetMaxScores', () => {
  it('resets MAX_SCORES to defaults', () => {
    state.MAX_SCORES.prayer = 999;
    resetMaxScores();
    expect(state.MAX_SCORES.prayer).toBe(DEFAULT_MAX_SCORES.prayer);
  });

  it('invalidates cache', () => {
    const versionBefore = state.scoresCacheVersion;
    resetMaxScores();
    expect(state.scoresCacheVersion).toBe(versionBefore + 1);
  });

  it('calls window.render and debouncedSaveToGithub', () => {
    resetMaxScores();
    expect(window.render).toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

describe('updateMaxScore', () => {
  it('updates a max score value', () => {
    updateMaxScore('prayer', 50);
    expect(state.MAX_SCORES.prayer).toBe(50);
  });

  it('saves to localStorage', () => {
    updateMaxScore('prayer', 50);
    const stored = JSON.parse(localStorage.getItem(MAX_SCORES_KEY));
    expect(stored.prayer).toBe(50);
  });

  it('invalidates cache and calls render', () => {
    const versionBefore = state.scoresCacheVersion;
    updateMaxScore('prayer', 50);
    expect(state.scoresCacheVersion).toBe(versionBefore + 1);
    expect(window.render).toHaveBeenCalled();
  });
});

// ============================================================================
// getScoreTier
// ============================================================================
describe('getScoreTier', () => {
  it('returns "Needs Work" for score 0', () => {
    const tier = getScoreTier(0);
    expect(tier.label).toBe('Needs Work');
  });

  it('returns "Needs Work" for score 0.39', () => {
    const tier = getScoreTier(0.39);
    expect(tier.label).toBe('Needs Work');
  });

  it('returns "Getting There" for score 0.40', () => {
    const tier = getScoreTier(0.40);
    expect(tier.label).toBe('Getting There');
  });

  it('returns "Solid" for score 0.60', () => {
    const tier = getScoreTier(0.60);
    expect(tier.label).toBe('Solid');
  });

  it('returns "Great" for score 0.80', () => {
    const tier = getScoreTier(0.80);
    expect(tier.label).toBe('Great');
  });

  it('returns "Outstanding" for score 0.90', () => {
    const tier = getScoreTier(0.90);
    expect(tier.label).toBe('Outstanding');
  });

  it('returns "Outstanding" for score 1.0', () => {
    const tier = getScoreTier(1.0);
    expect(tier.label).toBe('Outstanding');
  });

  it('returns first tier for negative score', () => {
    const tier = getScoreTier(-0.5);
    expect(tier.label).toBe('Needs Work');
  });

  it('returns an object with color, label, and bg fields', () => {
    const tier = getScoreTier(0.5);
    expect(tier).toHaveProperty('color');
    expect(tier).toHaveProperty('label');
    expect(tier).toHaveProperty('bg');
  });
});

// ============================================================================
// getLevel / getLevelInfo
// ============================================================================
describe('getLevel', () => {
  it('returns 1 for 0 XP', () => {
    expect(getLevel(0)).toBe(1);
  });

  it('returns 1 for 99 XP (below level 2 threshold)', () => {
    expect(getLevel(99)).toBe(1);
  });

  it('returns 2 for 100 XP (level 2 threshold)', () => {
    expect(getLevel(100)).toBe(2);
  });

  it('returns 3 for 250 XP', () => {
    expect(getLevel(250)).toBe(3);
  });

  it('returns max level for very high XP', () => {
    expect(getLevel(999999)).toBe(LEVEL_THRESHOLDS.length);
  });

  it('returns 10 for 3200 XP (exact threshold)', () => {
    expect(getLevel(3200)).toBe(10);
  });

  it('returns 1 for negative XP', () => {
    expect(getLevel(-100)).toBe(1);
  });
});

describe('getLevelInfo', () => {
  it('returns level 1 info for 0 XP', () => {
    const info = getLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.currentLevelXP).toBe(0);
    expect(info.nextLevelXP).toBe(100);
    expect(info.progress).toBe(0);
    expect(info.tierName).toBe('Spark');
  });

  it('shows half progress for 50 XP (50 of 100 needed)', () => {
    const info = getLevelInfo(50);
    expect(info.progress).toBeCloseTo(0.5, 1);
  });

  it('returns correct tier name for level 5 (Ember)', () => {
    const info = getLevelInfo(LEVEL_THRESHOLDS[4]); // level 5
    expect(info.level).toBe(5);
    expect(info.tierName).toBe('Ember');
  });

  it('returns correct tier name for level 10 (Flame)', () => {
    const info = getLevelInfo(LEVEL_THRESHOLDS[9]); // level 10
    expect(info.level).toBe(10);
    expect(info.tierName).toBe('Flame');
  });

  it('progress is clamped between 0 and 1', () => {
    const info = getLevelInfo(0);
    expect(info.progress).toBeGreaterThanOrEqual(0);
    expect(info.progress).toBeLessThanOrEqual(1);
  });

  it('has tierIcon property', () => {
    const info = getLevelInfo(0);
    expect(info).toHaveProperty('tierIcon');
  });
});

// ============================================================================
// getStreakMultiplier
// ============================================================================
describe('getStreakMultiplier', () => {
  it('returns 1.0 for 0 days', () => {
    expect(getStreakMultiplier(0)).toBe(1.0);
  });

  it('returns 1.0 for 1 day streak', () => {
    expect(getStreakMultiplier(1)).toBe(1.0);
  });

  it('returns 1.1 for 2-day streak', () => {
    expect(getStreakMultiplier(2)).toBe(1.1);
  });

  it('returns 1.1 for 3-day streak', () => {
    expect(getStreakMultiplier(3)).toBe(1.1);
  });

  it('returns 1.2 for 4-day streak', () => {
    expect(getStreakMultiplier(4)).toBe(1.2);
  });

  it('returns 1.3 for 7-day streak', () => {
    expect(getStreakMultiplier(7)).toBe(1.3);
  });

  it('returns 1.4 for 14-day streak', () => {
    expect(getStreakMultiplier(14)).toBe(1.4);
  });

  it('returns 1.5 for 30-day streak', () => {
    expect(getStreakMultiplier(30)).toBe(1.5);
  });

  it('returns 1.5 for 365-day streak (capped)', () => {
    expect(getStreakMultiplier(365)).toBe(1.5);
  });
});

// ============================================================================
// calculateDailyXP
// ============================================================================
describe('calculateDailyXP', () => {
  it('returns 0 base for 0% score', () => {
    const xp = calculateDailyXP(0, 1.0);
    expect(xp.base).toBe(0);
    expect(xp.streakBonus).toBe(0);
    expect(xp.total).toBe(0);
  });

  it('returns 100 base for 100% score with 1.0 multiplier', () => {
    const xp = calculateDailyXP(1.0, 1.0);
    expect(xp.base).toBe(100);
    expect(xp.streakBonus).toBe(0);
    expect(xp.total).toBe(100);
  });

  it('returns 50 base for 50% score', () => {
    const xp = calculateDailyXP(0.5, 1.0);
    expect(xp.base).toBe(50);
  });

  it('applies streak multiplier correctly', () => {
    const xp = calculateDailyXP(1.0, 1.5);
    expect(xp.base).toBe(100);
    expect(xp.streakBonus).toBe(50); // 100 * 0.5
    expect(xp.total).toBe(150);
  });

  it('applies 1.3 multiplier correctly', () => {
    const xp = calculateDailyXP(0.8, 1.3);
    expect(xp.base).toBe(80);
    expect(xp.streakBonus).toBe(Math.floor(80 * 0.3)); // 24
    expect(xp.total).toBe(80 + Math.floor(80 * 0.3));
  });

  it('floors base XP (no fractions)', () => {
    const xp = calculateDailyXP(0.555, 1.0);
    expect(xp.base).toBe(55); // Math.floor(55.5)
  });
});

// ============================================================================
// updateStreak
// ============================================================================
describe('updateStreak', () => {
  it('does nothing if overallPercent < threshold', () => {
    updateStreak('2026-02-01', 0.1);
    expect(state.streak.current).toBe(0);
  });

  it('starts streak at 1 for first logged day', () => {
    updateStreak('2026-02-01', 0.5);
    expect(state.streak.current).toBe(1);
    expect(state.streak.lastLoggedDate).toBe('2026-02-01');
  });

  it('increments streak for consecutive day', () => {
    updateStreak('2026-02-01', 0.5);
    updateStreak('2026-02-02', 0.5);
    expect(state.streak.current).toBe(2);
    expect(state.streak.lastLoggedDate).toBe('2026-02-02');
  });

  it('resets streak for gap > 1 day (no shield)', () => {
    updateStreak('2026-02-01', 0.5);
    state.streak.shield.available = false;
    updateStreak('2026-02-04', 0.5); // 3-day gap
    expect(state.streak.current).toBe(1);
  });

  it('uses shield for 1-day gap when available', () => {
    updateStreak('2026-02-01', 0.5);
    expect(state.streak.shield.available).toBe(true);
    updateStreak('2026-02-03', 0.5); // Missed Feb 2
    expect(state.streak.current).toBe(2);
    expect(state.streak.shield.available).toBe(false);
  });

  it('resets streak for 1-day gap when shield not available', () => {
    updateStreak('2026-02-01', 0.5);
    state.streak.shield.available = false;
    updateStreak('2026-02-03', 0.5);
    expect(state.streak.current).toBe(1);
  });

  it('updates longest streak', () => {
    updateStreak('2026-02-01', 0.5);
    updateStreak('2026-02-02', 0.5);
    updateStreak('2026-02-03', 0.5);
    expect(state.streak.longest).toBe(3);
  });

  it('does not update for same day (idempotent)', () => {
    updateStreak('2026-02-01', 0.5);
    updateStreak('2026-02-01', 0.7);
    expect(state.streak.current).toBe(1);
  });

  it('does not update for past date (going backward)', () => {
    updateStreak('2026-02-05', 0.5);
    updateStreak('2026-02-03', 0.5); // Earlier date
    // diffDays <= 0 => early return
    expect(state.streak.current).toBe(1);
    expect(state.streak.lastLoggedDate).toBe('2026-02-05');
  });

  it('updates multiplier based on streak length', () => {
    // Build a 4-day streak to get 1.2 multiplier
    updateStreak('2026-02-01', 0.5);
    updateStreak('2026-02-02', 0.5);
    updateStreak('2026-02-03', 0.5);
    updateStreak('2026-02-04', 0.5);
    expect(state.streak.multiplier).toBe(1.2);
  });

  it('regenerates shield on Monday', () => {
    // Feb 2, 2026 is Monday
    updateStreak('2026-02-01', 0.5); // Sunday
    state.streak.shield.available = false;
    updateStreak('2026-02-02', 0.5); // Monday
    expect(state.streak.shield.available).toBe(true);
  });

  it('saves streak to localStorage', () => {
    updateStreak('2026-02-01', 0.5);
    const stored = JSON.parse(localStorage.getItem(STREAK_KEY));
    expect(stored.current).toBe(1);
  });
});

// ============================================================================
// awardDailyXP
// ============================================================================
describe('awardDailyXP', () => {
  it('does not award XP if overallPercent < threshold', () => {
    const result = awardDailyXP('2026-02-01', 0.1);
    expect(result.awarded).toBe(false);
    expect(state.xp.total).toBe(0);
  });

  it('awards XP for a qualifying day', () => {
    state.streak.multiplier = 1.0;
    const result = awardDailyXP('2026-02-01', 0.8);
    expect(result.awarded).toBe(true);
    expect(result.xpData.base).toBe(80);
    expect(state.xp.total).toBe(80);
  });

  it('does not double-award for same date', () => {
    state.streak.multiplier = 1.0;
    awardDailyXP('2026-02-01', 0.8);
    const second = awardDailyXP('2026-02-01', 0.9);
    expect(second.awarded).toBe(false);
    expect(state.xp.total).toBe(80); // Only first award
  });

  it('records XP in history', () => {
    state.streak.multiplier = 1.0;
    awardDailyXP('2026-02-01', 0.5);
    expect(state.xp.history).toHaveLength(1);
    expect(state.xp.history[0].date).toBe('2026-02-01');
  });

  it('detects level up', () => {
    state.xp.total = 95; // Level 1 (0-99)
    state.streak.multiplier = 1.0;
    const result = awardDailyXP('2026-02-01', 0.8); // +80 XP = 175 (level 2)
    expect(result.levelUp).toBe(true);
  });

  it('no level up when staying same level', () => {
    state.xp.total = 0;
    state.streak.multiplier = 1.0;
    const result = awardDailyXP('2026-02-01', 0.3); // +30 XP = 30 (still level 1)
    expect(result.levelUp).toBe(false);
  });

  it('trims history to 365 entries', () => {
    state.streak.multiplier = 1.0;
    // Fill 365 entries
    for (let i = 0; i < 365; i++) {
      const d = new Date(2024, 0, 1);
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      state.xp.history.push({ date: ds, base: 50, streakBonus: 0, total: 50 });
    }
    expect(state.xp.history).toHaveLength(365);
    // Award one more
    awardDailyXP('2026-02-01', 0.5);
    expect(state.xp.history).toHaveLength(365); // trimmed
    expect(state.xp.history[state.xp.history.length - 1].date).toBe('2026-02-01');
  });

  it('saves XP to localStorage', () => {
    state.streak.multiplier = 1.0;
    awardDailyXP('2026-02-01', 0.5);
    const stored = JSON.parse(localStorage.getItem(XP_KEY));
    expect(stored.total).toBe(50);
  });
});

// ============================================================================
// processGamification
// ============================================================================
describe('processGamification', () => {
  it('updates streak, awards XP, and checks achievements', () => {
    state.allData['2026-02-01'] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
      glucose: { avg: '105', tir: '80', insulin: '30' },
      family: { mom: true, dad: true, jana: true, tia: true, ahmed: true, eman: true },
      habits: { exercise: 1, reading: 1, meditation: 1, water: '2', vitamins: true, brushTeeth: 2, nop: '1' },
      whoop: { sleepPerf: '95', recovery: '80', strain: '18' },
    };
    const result = processGamification('2026-02-01');
    expect(state.streak.current).toBe(1);
    expect(result.xpResult.awarded).toBe(true);
    expect(result.xpResult.xpData.total).toBeGreaterThan(0);
    expect(Array.isArray(result.newAchievements)).toBe(true);
  });

  it('calls debouncedSaveToGithub', () => {
    state.allData['2026-02-01'] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
    };
    processGamification('2026-02-01');
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('does not award XP for empty day', () => {
    const result = processGamification('2026-02-01');
    expect(result.xpResult.awarded).toBe(false);
  });

  it('unlocks "day-one" achievement for first day logged', () => {
    state.allData['2026-02-01'] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
      family: { mom: true, dad: true },
    };
    const result = processGamification('2026-02-01');
    expect(result.newAchievements).toContain('day-one');
  });
});

// ============================================================================
// checkAchievements / markAchievementNotified
// ============================================================================
describe('checkAchievements', () => {
  it('unlocks perfect-prayer when 5 on-time', () => {
    state.allData['2026-02-01'] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
    };
    const scores = calculateScores(state.allData['2026-02-01']);
    const unlocked = checkAchievements('2026-02-01', scores);
    expect(unlocked).toContain('perfect-prayer');
    expect(unlocked).toContain('day-one');
  });

  it('does not re-unlock already unlocked achievements', () => {
    state.achievements.unlocked['day-one'] = { date: '2026-01-01', notified: true };
    state.allData['2026-02-01'] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
    };
    const scores = calculateScores(state.allData['2026-02-01']);
    const unlocked = checkAchievements('2026-02-01', scores);
    expect(unlocked).not.toContain('day-one');
  });
});

describe('markAchievementNotified', () => {
  it('marks an unlocked achievement as notified', () => {
    state.achievements.unlocked['day-one'] = { date: '2026-02-01', notified: false };
    markAchievementNotified('day-one');
    expect(state.achievements.unlocked['day-one'].notified).toBe(true);
  });

  it('does nothing for non-existent achievement', () => {
    markAchievementNotified('nonexistent');
    expect(state.achievements.unlocked['nonexistent']).toBeUndefined();
  });

  it('saves to localStorage', () => {
    state.achievements.unlocked['day-one'] = { date: '2026-02-01', notified: false };
    markAchievementNotified('day-one');
    const stored = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY));
    expect(stored.unlocked['day-one'].notified).toBe(true);
  });
});

// ============================================================================
// getLast30DaysData
// ============================================================================
describe('getLast30DaysData', () => {
  it('returns exactly 30 entries', () => {
    const data = getLast30DaysData();
    expect(data).toHaveLength(30);
  });

  it('each entry has date, day, month, label, and score fields', () => {
    const data = getLast30DaysData();
    const entry = data[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('day');
    expect(entry).toHaveProperty('month');
    expect(entry).toHaveProperty('label');
    expect(entry).toHaveProperty('total');
    expect(entry).toHaveProperty('prayer');
    expect(entry).toHaveProperty('normalized');
  });

  it('uses allData for dates that have data', () => {
    const today = getLocalDateString();
    state.allData[today] = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
    };
    invalidateScoresCache();
    const data = getLast30DaysData();
    const todayEntry = data.find(d => d.date === today);
    expect(todayEntry).toBeDefined();
    expect(todayEntry.prayer).toBe(25);
  });

  it('returns zero scores for dates without data', () => {
    state.allData = {};
    invalidateScoresCache();
    const data = getLast30DaysData();
    expect(data[0].total).toBe(0);
  });
});

// ============================================================================
// getLast30DaysStats
// ============================================================================
describe('getLast30DaysStats', () => {
  it('returns zero stats for empty allData', () => {
    state.allData = {};
    invalidateScoresCache();
    const stats = getLast30DaysStats();
    expect(stats.daysLogged).toBe(0);
    expect(stats.totalScore).toBe(0);
    expect(stats.avgDaily).toBe(0);
  });

  it('counts days logged within last 30 days', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const ys = getLocalDateString(yesterday);
    state.allData = {
      [ys]: {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
        family: {},
        whoop: {},
      },
    };
    invalidateScoresCache();
    const stats = getLast30DaysStats();
    expect(stats.daysLogged).toBe(1);
    expect(stats.totalScore).toBeGreaterThan(0);
  });

  it('computes avgRHR correctly', () => {
    const today = getLocalDateString();
    state.allData = {
      [today]: {
        prayers: {},
        glucose: {},
        family: {},
        whoop: { rhr: '60', sleepHours: '7' },
        habits: {},
      },
    };
    invalidateScoresCache();
    const stats = getLast30DaysStats();
    expect(stats.avgRHR).toBe(60);
    expect(parseFloat(stats.avgSleep)).toBeCloseTo(7, 0);
  });
});

// ============================================================================
// getPersonalBests
// ============================================================================
describe('getPersonalBests', () => {
  it('returns null when no data', () => {
    state.allData = {};
    expect(getPersonalBests()).toBeNull();
  });

  it('tracks highest day score', () => {
    state.allData = {
      '2026-01-01': {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
        family: { mom: true, dad: true },
      },
      '2026-01-02': {
        prayers: { fajr: '0.1' },
      },
    };
    invalidateScoresCache();
    const bests = getPersonalBests();
    expect(bests.highestDayScore.date).toBe('2026-01-01');
    expect(bests.highestDayScore.value).toBeGreaterThan(0);
  });

  it('counts perfect prayer days', () => {
    state.allData = {
      '2026-01-01': {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1' },
      },
      '2026-01-02': {
        prayers: { fajr: '0.1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1' },
      },
    };
    invalidateScoresCache();
    const bests = getPersonalBests();
    expect(bests.perfectPrayerDays).toBe(1);
  });

  it('tracks longest streak of consecutive days', () => {
    state.allData = {
      '2026-01-01': { prayers: {} },
      '2026-01-02': { prayers: {} },
      '2026-01-03': { prayers: {} },
      '2026-01-05': { prayers: {} }, // gap
    };
    invalidateScoresCache();
    const bests = getPersonalBests();
    expect(bests.longestStreak.value).toBe(3);
  });

  it('tracks most quran pages', () => {
    state.allData = {
      '2026-01-01': { prayers: { quran: 5 } },
      '2026-01-02': { prayers: { quran: 10 } },
    };
    invalidateScoresCache();
    const bests = getPersonalBests();
    expect(bests.mostQuranPages.value).toBe(10);
    expect(bests.mostQuranPages.date).toBe('2026-01-02');
  });

  it('reports totalDaysLogged', () => {
    state.allData = {
      '2026-01-01': {},
      '2026-01-05': {},
      '2026-01-10': {},
    };
    invalidateScoresCache();
    const bests = getPersonalBests();
    expect(bests.totalDaysLogged).toBe(3);
  });
});

// ============================================================================
// getDailyFocus
// ============================================================================
describe('getDailyFocus', () => {
  it('returns null when fewer than 3 days of data in last 7 days', () => {
    state.allData = {};
    invalidateScoresCache();
    expect(getDailyFocus()).toBeNull();
  });

  it('returns weakest category when sufficient data exists', () => {
    // Create 4 days of data (all from last 7 days)
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      state.allData[dateStr] = {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
        glucose: { avg: '105', tir: '80', insulin: '30' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: { exercise: 1, reading: 1, meditation: 1, water: '2', vitamins: true, brushTeeth: 2, nop: '1' },
        whoop: { sleepPerf: '95', recovery: '80', strain: '18' },
      };
    }
    invalidateScoresCache();
    const focus = getDailyFocus();
    expect(focus).not.toBeNull();
    // Family should be weakest since all false
    expect(focus.category).toBe('family');
    expect(focus).toHaveProperty('displayName');
    expect(focus).toHaveProperty('avgPercent');
    expect(focus).toHaveProperty('tip');
  });

  it('uses daily focus cache on second call', () => {
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      state.allData[dateStr] = {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
        family: { mom: true, dad: true },
        habits: { exercise: 1 },
        whoop: { sleepPerf: '95', recovery: '80', strain: '18' },
      };
    }
    invalidateScoresCache();
    const first = getDailyFocus();
    const second = getDailyFocus();
    // Should return cached result (same reference)
    expect(first).toBe(second);
  });
});

// ============================================================================
// Persistence helpers
// ============================================================================
describe('saveXP', () => {
  it('saves xp state to localStorage', () => {
    state.xp.total = 42;
    saveXP();
    const stored = JSON.parse(localStorage.getItem(XP_KEY));
    expect(stored.total).toBe(42);
  });

  it('adds _updatedAt timestamp', () => {
    saveXP();
    expect(state.xp._updatedAt).toBeDefined();
  });
});

describe('saveStreak', () => {
  it('saves streak state to localStorage', () => {
    state.streak.current = 5;
    saveStreak();
    const stored = JSON.parse(localStorage.getItem(STREAK_KEY));
    expect(stored.current).toBe(5);
  });
});

describe('saveAchievements', () => {
  it('saves achievements to localStorage', () => {
    state.achievements.unlocked['test'] = { date: '2026-01-01', notified: false };
    saveAchievements();
    const stored = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY));
    expect(stored.unlocked['test']).toBeDefined();
  });
});

// ============================================================================
// updateCategoryWeight / resetCategoryWeights
// ============================================================================
describe('updateCategoryWeight', () => {
  it('updates a category weight', () => {
    updateCategoryWeight('prayer', 30);
    expect(state.CATEGORY_WEIGHTS.prayer).toBe(30);
  });

  it('invalidates cache and calls render', () => {
    const versionBefore = state.scoresCacheVersion;
    updateCategoryWeight('prayer', 30);
    expect(state.scoresCacheVersion).toBe(versionBefore + 1);
    expect(window.render).toHaveBeenCalled();
  });
});

describe('resetCategoryWeights', () => {
  it('resets to defaults', () => {
    state.CATEGORY_WEIGHTS.prayer = 99;
    resetCategoryWeights();
    expect(state.CATEGORY_WEIGHTS.prayer).toBe(DEFAULT_CATEGORY_WEIGHTS.prayer);
  });

  it('calls render and debouncedSaveToGithub', () => {
    resetCategoryWeights();
    expect(window.render).toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

// ============================================================================
// rebuildGamification
// ============================================================================
describe('rebuildGamification', () => {
  it('recalculates all XP from scratch', () => {
    // Seed some data
    state.allData = {
      '2026-01-01': {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
        family: { mom: true, dad: true },
        habits: { exercise: 1, reading: 1 },
      },
      '2026-01-02': {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 0 },
        family: { mom: true },
      },
    };
    invalidateScoresCache();
    rebuildGamification();
    expect(state.xp.total).toBeGreaterThan(0);
    expect(state.xp.history.length).toBeGreaterThan(0);
    expect(state.streak.longest).toBeGreaterThanOrEqual(1);
  });

  it('processes dates in sorted order', () => {
    // Need enough data per day so normalized overall >= STREAK_MIN_THRESHOLD (0.20)
    // Prayer 5 on-time (25/35=0.714) + family 3 (3/6=0.5) => overall = (0.714*20+0.5*20)/100 = 0.243
    const dayTemplate = {
      prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1' },
      family: { mom: true, dad: true, jana: true },
    };
    state.allData = {
      '2026-01-03': { ...dayTemplate },
      '2026-01-01': { ...dayTemplate },
      '2026-01-02': { ...dayTemplate },
    };
    invalidateScoresCache();
    rebuildGamification();
    // 3 consecutive days should give a streak of 3
    expect(state.streak.current).toBe(3);
    expect(state.streak.longest).toBe(3);
  });

  it('resets XP and streak before rebuilding', () => {
    state.xp.total = 9999;
    state.streak.current = 100;
    state.allData = {};
    rebuildGamification();
    expect(state.xp.total).toBe(0);
    expect(state.streak.current).toBe(0);
  });
});
