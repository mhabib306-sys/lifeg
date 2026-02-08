// ============================================================================
// Scoring Calculation Engine & Weight Management Module
// ============================================================================
// Multi-category gamification scoring system
// Target: ~100 points daily from 5 categories:
//   - Prayer: 30 pts (5 prayers + Quran)
//   - Diabetes: 25 pts (glucose avg + TIR + insulin)
//   - WHOOP: 25 pts (sleep + recovery + strain)
//   - Family: 5 pts (contact with family members)
//   - Habits: 15 pts (exercise, reading, vitamins, etc.)
//
// Uses memoization cache for performance (cleared on data changes)

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import {
  WEIGHTS_KEY,
  MAX_SCORES_KEY,
  DEFAULT_WEIGHTS,
  DEFAULT_MAX_SCORES,
  defaultDayData
} from '../constants.js';

// ============================================================================
// PRAYER HELPERS
// ============================================================================

/**
 * Parse prayer value from X.Y format
 * X = on-time prayers (0-1), Y = late prayers (0-9 in decimal)
 * Example: 1.3 = 1 on-time + 3 late prayers
 * @param {string|number} value - Prayer value in X.Y format
 * @returns {{onTime: number, late: number}} Parsed prayer counts
 */
export function parsePrayer(value) {
  if (!value && value !== 0) return { onTime: 0, late: 0 };
  const num = parseFloat(value) || 0;
  const onTime = Math.floor(num);
  const late = Math.round((num - onTime) * 10);
  return { onTime, late };
}

/**
 * Calculate score for a single prayer
 * @param {string|number} value - Prayer value in X.Y format
 * @returns {number} Score for this prayer
 */
export function calcPrayerScore(value) {
  const { onTime, late } = parsePrayer(value);
  return onTime * state.WEIGHTS.prayer.onTime + late * state.WEIGHTS.prayer.late;
}

// ============================================================================
// SCORES CACHE
// ============================================================================

/**
 * Clear the scores cache (call after any data change)
 */
export function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
}

/**
 * Generate cache key from data object
 * Uses JSON.stringify for simple but effective hashing
 */
export function getCacheKey(data) {
  return JSON.stringify(data);
}

// ============================================================================
// MAIN SCORING ENGINE
// ============================================================================

/**
 * Calculate daily scores across all categories
 * PERFORMANCE: Uses memoization to avoid redundant calculations
 * CACHE LIMIT: Clears when > 500 entries (~100KB memory)
 *
 * @param {Object} data - Daily data object with prayers, glucose, whoop, family, habits
 * @returns {Object} Scores: { prayer, diabetes, whoop, family, habit, total,
 *                           details: { totalOnTime, totalLate, quranPages } }
 *
 * SCORING ALGORITHMS (see DEFAULT_WEIGHTS for exact values):
 * - PRAYER: 5 x (onTime x 5pts + late x 2pts) + quranPages x 5pts
 * - GLUCOSE: avg (progressive 0-10 scaled from 105 target) +
 *            TIR (tirPerPoint x %) + insulin (base or penalty)
 * - WHOOP: sleep thresholds (high:7, mid:4, low:2) +
 *          recovery thresholds + strain matching bonus
 * - FAMILY: sum of individual weights (6 members, 1pt each)
 * - HABITS: sum of enabled habits with individual weights
 */
export function calculateScores(data) {
  const WEIGHTS = state.WEIGHTS;

  // Check cache first
  const cacheKey = getCacheKey(data);
  if (state.scoresCache.has(cacheKey)) {
    return state.scoresCache.get(cacheKey);
  }
  // Ensure data has required structure with safe defaults
  if (!data || typeof data !== 'object') {
    data = JSON.parse(JSON.stringify(defaultDayData));
  }
  const prayers = data.prayers || {};
  const glucose = data.glucose || {};
  const whoop = data.whoop || {};
  const family = data.family || {};
  const habits = data.habits || {};

  // Prayer Score
  let prayerScore = 0;
  let totalOnTime = 0, totalLate = 0;
  ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
    const { onTime, late } = parsePrayer(prayers[p]);
    totalOnTime += onTime;
    totalLate += late;
    prayerScore += onTime * WEIGHTS.prayer.onTime + late * WEIGHTS.prayer.late;
  });
  // Quran pages
  const quranPages = parseInt(prayers.quran) || 0;
  prayerScore += quranPages * WEIGHTS.prayer.quran;

  // Diabetes/Glucose Score
  let diabetesScore = 0;
  const avg = parseFloat(glucose.avg) || 0;
  const tir = parseFloat(glucose.tir) || 0;
  const insulin = parseFloat(glucose.insulin) || 0;

  // Avg glucose scoring - progressive: closer to 105 (midpoint of 70-140) = more points
  // Scale: 105 = max points, decreases as you move away from 105
  if (glucose.avg !== '' && glucose.avg !== undefined) {
    const target = 105; // ideal midpoint
    const maxPts = WEIGHTS.glucose.avgMax || 20;
    if (avg >= 70 && avg <= 140) {
      // Perfect range: scale from target (full points) to edges (half points)
      const distFromTarget = Math.abs(avg - target);
      const maxDist = 35; // distance from 105 to 70 or 140
      diabetesScore += maxPts * (1 - (distFromTarget / maxDist) * 0.5);
    } else if (avg > 140 && avg <= 180) {
      // Acceptable range: scale down from edge
      const ptsAt140 = maxPts * 0.5;
      const penalty = (avg - 140) * (ptsAt140 / 40); // lose all by 180
      diabetesScore += Math.max(0, ptsAt140 - penalty);
    }
    // Below 70 or above 180 = 0 points
  }

  // TIR scoring - progressive: each % point matters
  // Scale: 0.3 pts per % (so 70% = 21 pts, 100% = 30 pts)
  if (glucose.tir !== '' && glucose.tir !== undefined && tir > 0) {
    const ptsPerPercent = WEIGHTS.glucose.tirPerPoint || 0.3;
    diabetesScore += tir * ptsPerPercent;
  }

  // Insulin scoring: base points if <= threshold, flat penalty if > threshold
  const insulinThreshold = (WEIGHTS.glucose && WEIGHTS.glucose.insulinThreshold) || 40;
  if (glucose.insulin !== '' && glucose.insulin !== undefined && insulin > 0) {
    if (insulin <= insulinThreshold) {
      diabetesScore += WEIGHTS.glucose.insulinBase;
    } else {
      diabetesScore += WEIGHTS.glucose.insulinPenalty;
    }
  }

  // Whoop Age Score - Based on age-reducing metrics
  let whoopScore = 0;
  const w = whoop;
  const ww = WEIGHTS.whoop;

  // Sleep Performance: >= 90% optimal
  const sleepPerf = parseFloat(w.sleepPerf) || 0;
  if (w.sleepPerf !== '' && w.sleepPerf !== undefined) {
    if (sleepPerf >= 90) whoopScore += ww.sleepPerfHigh;
    else if (sleepPerf >= 70) whoopScore += ww.sleepPerfMid;
    else if (sleepPerf >= 50) whoopScore += ww.sleepPerfLow;
  }

  // Recovery
  const recovery = parseFloat(w.recovery) || 0;
  if (w.recovery !== '' && w.recovery !== undefined) {
    if (recovery >= 66) whoopScore += ww.recoveryHigh;
    else if (recovery >= 50) whoopScore += ww.recoveryMid;
    else if (recovery >= 33) whoopScore += ww.recoveryLow;
  }

  // Strain - recovery-matched scoring
  // High recovery (>= 66%) -> reward high strain (14-21)
  // Medium recovery (33-65%) -> reward moderate strain (10-14)
  // Low recovery (<33%) -> reward rest/light strain (0-10)
  const strain = parseFloat(w.strain) || 0;
  if (w.strain !== '' && w.strain !== undefined && w.recovery !== '' && w.recovery !== undefined) {
    let strainMatch = false;
    if (recovery >= 66 && strain >= 14) strainMatch = true;
    else if (recovery >= 33 && recovery < 66 && strain >= 10 && strain < 14) strainMatch = true;
    else if (recovery < 33 && strain < 10) strainMatch = true;

    if (strainMatch) whoopScore += (ww.strainMatch || 10);
    // Bonus for high strain on high recovery days
    if (recovery >= 66 && strain >= 18) whoopScore += (ww.strainHigh || 5);
  }

  // Family Score - individual weights per member
  let familyScore = 0;
  Object.entries(family).forEach(([member, checked]) => {
    if (checked) familyScore += WEIGHTS.family[member] || 0;
  });

  // Habit Score
  let habitScore = 0;
  habitScore += (parseInt(habits.exercise) || 0) * WEIGHTS.habits.exercise;
  habitScore += (parseInt(habits.reading) || 0) * WEIGHTS.habits.reading;
  habitScore += (parseInt(habits.meditation) || 0) * WEIGHTS.habits.meditation;
  habitScore += (parseFloat(habits.water) || 0) * WEIGHTS.habits.water;
  habitScore += habits.vitamins ? WEIGHTS.habits.vitamins : 0;
  habitScore += (parseInt(habits.brushTeeth) || 0) * WEIGHTS.habits.brushTeeth;
  // NoP scoring: points if 1, penalty if 0
  const nop = habits.nop;
  if (nop !== '' && nop !== null && nop !== undefined) {
    if (parseInt(nop) === 1) habitScore += (WEIGHTS.habits.nopYes || 5);
    else if (parseInt(nop) === 0) habitScore += (WEIGHTS.habits.nopNo || -3);
  }

  const result = {
    prayer: prayerScore,
    prayerOnTime: totalOnTime,
    prayerLate: totalLate,
    diabetes: Math.round(diabetesScore * 10) / 10,
    whoop: Math.round(whoopScore * 10) / 10,
    family: familyScore,
    habit: habitScore,
    total: Math.round((prayerScore + diabetesScore + whoopScore + familyScore + habitScore) * 10) / 10
  };

  // Cache the result (limit cache size to prevent memory issues)
  if (state.scoresCache.size > 500) state.scoresCache.clear();
  state.scoresCache.set(cacheKey, result);

  return result;
}

// ============================================================================
// DATA AGGREGATION
// ============================================================================

export function getLast30DaysData() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = getLocalDateString(date);
    const dayData = state.allData[dateStr] || defaultDayData;
    const dayScores = calculateScores(dayData);
    days.push({
      date: dateStr,
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...dayScores
    });
  }
  return days;
}

export function getLast30DaysStats() {
  let stats = { totalScore: 0, daysLogged: 0, totalOnTimePrayers: 0, totalLatePrayers: 0, totalFamilyCheckins: 0, avgRHR: 0, avgSleep: 0, rhrCount: 0, sleepCount: 0 };

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = getLocalDateString(date);
    if (state.allData[dateStr]) {
      stats.daysLogged++;
      const d = state.allData[dateStr];
      const dayScores = calculateScores(d);
      stats.totalScore += dayScores.total;
      stats.totalOnTimePrayers += dayScores.prayerOnTime;
      stats.totalLatePrayers += dayScores.prayerLate;
      stats.totalFamilyCheckins += Object.values(d.family).filter(Boolean).length;
      if (d.whoop.rhr) { stats.avgRHR += parseFloat(d.whoop.rhr); stats.rhrCount++; }
      if (d.whoop.sleepHours) { stats.avgSleep += parseFloat(d.whoop.sleepHours); stats.sleepCount++; }
    }
  }
  stats.totalScore = Math.round(stats.totalScore);
  stats.avgRHR = stats.rhrCount ? Math.round(stats.avgRHR / stats.rhrCount) : 0;
  stats.avgSleep = stats.sleepCount ? (stats.avgSleep / stats.sleepCount).toFixed(1) : 0;
  stats.avgDaily = stats.daysLogged ? Math.round(stats.totalScore / stats.daysLogged) : 0;
  return stats;
}

// ============================================================================
// PERSONAL BESTS
// ============================================================================

// Personal Bests tracking
export function getPersonalBests() {
  const dates = Object.keys(state.allData).sort();
  if (dates.length === 0) return null;

  let bests = {
    highestDayScore: { value: 0, date: null },
    highestWeekScore: { value: 0, weekStart: null },
    longestStreak: { value: 0, endDate: null },
    currentStreak: 0,
    bestPrayerDay: { value: 0, date: null },
    bestWhoopDay: { value: 0, date: null },
    mostQuranPages: { value: 0, date: null },
    perfectPrayerDays: 0,
    totalDaysLogged: dates.length
  };

  // Single iteration for all calculations (optimized from double iteration)
  let currentStreakCount = 0;
  let lastDate = null;
  const weekScores = {};

  dates.forEach(date => {
    const dayData = state.allData[date] || {};
    const prayers = dayData.prayers || {};
    const scores = calculateScores(dayData);

    // Highest day score
    if (scores.total > bests.highestDayScore.value) {
      bests.highestDayScore = { value: scores.total, date };
    }

    // Best prayer day
    if (scores.prayer > bests.bestPrayerDay.value) {
      bests.bestPrayerDay = { value: scores.prayer, date };
    }

    // Best whoop day
    if (scores.whoop > bests.bestWhoopDay.value) {
      bests.bestWhoopDay = { value: scores.whoop, date };
    }

    // Most Quran pages
    const quranPages = parseInt(prayers.quran) || 0;
    if (quranPages > bests.mostQuranPages.value) {
      bests.mostQuranPages = { value: quranPages, date };
    }

    // Perfect prayer days (5 on-time prayers)
    let onTimePrayers = 0;
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
      const { onTime } = parsePrayer(prayers[p]);
      if (onTime >= 1) onTimePrayers++;
    });
    if (onTimePrayers === 5) bests.perfectPrayerDays++;

    // Streak calculation
    if (lastDate) {
      const lastD = new Date(lastDate);
      const currD = new Date(date);
      const diffDays = Math.round((currD - lastD) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreakCount++;
      } else {
        currentStreakCount = 1;
      }
    } else {
      currentStreakCount = 1;
    }

    if (currentStreakCount > bests.longestStreak.value) {
      bests.longestStreak = { value: currentStreakCount, endDate: date };
    }

    lastDate = date;

    // Weekly scores (combined into single iteration - reuse scores.total)
    const d = new Date(date);
    const weekStart = getLocalDateString(new Date(d.setDate(d.getDate() - d.getDay())));
    if (!weekScores[weekStart]) weekScores[weekStart] = 0;
    weekScores[weekStart] += scores.total;
  });

  // Check if current streak is active (last entry was today or yesterday)
  const today = getLocalDateString();
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
  if (lastDate === today || lastDate === yesterday) {
    bests.currentStreak = currentStreakCount;
  }

  // Find highest week score
  Object.entries(weekScores).forEach(([weekStart, score]) => {
    if (score > bests.highestWeekScore.value) {
      bests.highestWeekScore = { value: Math.round(score), weekStart };
    }
  });

  return bests;
}

// ============================================================================
// WEIGHT MANAGEMENT
// ============================================================================

// Load weights and merge with defaults to ensure new keys are always present
export function loadWeights() {
  try {
    const stored = localStorage.getItem(WEIGHTS_KEY);
    if (!stored) return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    const saved = JSON.parse(stored);
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    // Deep merge: ensure all default keys exist
    const merged = JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    Object.keys(merged).forEach(category => {
      if (saved[category]) {
        Object.keys(merged[category]).forEach(key => {
          if (saved[category][key] !== undefined) merged[category][key] = saved[category][key];
        });
      }
    });
    return merged;
  } catch (e) {
    console.error('Error loading weights:', e);
    return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
  }
}

export function loadMaxScores() {
  try {
    const stored = localStorage.getItem(MAX_SCORES_KEY);
    if (!stored) return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
    const saved = JSON.parse(stored);
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
    return { ...DEFAULT_MAX_SCORES, ...saved };
  } catch (e) {
    console.error('Error loading max scores:', e);
    return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
  }
}

function saveWeights() {
  localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
}

function saveMaxScores() {
  localStorage.setItem(MAX_SCORES_KEY, JSON.stringify(state.MAX_SCORES));
}

export function updateWeight(category, field, value) {
  if (field) {
    state.WEIGHTS[category][field] = parseFloat(value) || 0;
  } else {
    state.WEIGHTS[category] = parseFloat(value) || 0;
  }
  saveWeights();
  invalidateScoresCache();
  window.debouncedSaveToGithub(); // Auto-save to GitHub
  window.render();
}

export function resetWeights() {
  state.WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
  saveWeights();
  invalidateScoresCache();
  window.debouncedSaveToGithub(); // Auto-save to GitHub
  window.render();
}

export function updateMaxScore(category, value) {
  state.MAX_SCORES[category] = parseFloat(value) || 0;
  saveMaxScores();
  invalidateScoresCache();
  window.debouncedSaveToGithub(); // Auto-save to GitHub
  window.render();
}

export function resetMaxScores() {
  state.MAX_SCORES = JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
  saveMaxScores();
  invalidateScoresCache();
  window.render();
}
