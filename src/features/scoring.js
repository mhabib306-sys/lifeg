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
  DEFAULT_CATEGORY_WEIGHTS,
  CATEGORY_WEIGHTS_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  LEVEL_THRESHOLDS,
  LEVEL_TIERS,
  STREAK_MULTIPLIERS,
  STREAK_MIN_THRESHOLD,
  SCORE_TIERS,
  ACHIEVEMENTS,
  FOCUS_TIPS,
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

// Daily focus cache — avoids recomputing 7-day averages on every render()
let _dailyFocusCache = null;
let _dailyFocusCacheVersion = -1;

/**
 * Clear the scores cache (call after any data change)
 */
export function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
  _dailyFocusCache = null;
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

  // Raw scores
  const rawPrayer = prayerScore;
  const rawDiabetes = Math.round(diabetesScore * 10) / 10;
  const rawWhoop = Math.round(whoopScore * 10) / 10;
  const rawFamily = familyScore;
  const rawHabit = habitScore;
  const rawTotal = Math.round((prayerScore + diabetesScore + whoopScore + familyScore + habitScore) * 10) / 10;

  // Normalized scores (0-1 ratio per category)
  const maxPrayer = Math.max(state.MAX_SCORES?.prayer || 35, 1);
  const maxDiabetes = Math.max(state.MAX_SCORES?.diabetes || 25, 1);
  const maxWhoop = Math.max(state.MAX_SCORES?.whoop || 14, 1);
  const maxFamily = Math.max(state.MAX_SCORES?.family || 6, 1);
  const maxHabits = Math.max(state.MAX_SCORES?.habits || 16, 1);

  const normPrayer = Math.max(0, Math.min(1, rawPrayer / maxPrayer));
  const normDiabetes = Math.max(0, Math.min(1, rawDiabetes / maxDiabetes));
  const normWhoop = Math.max(0, Math.min(1, rawWhoop / maxWhoop));
  const normFamily = Math.max(0, Math.min(1, rawFamily / maxFamily));
  const normHabits = Math.max(0, Math.min(1, rawHabit / maxHabits));

  // Weighted average overall percentage
  const cw = state.CATEGORY_WEIGHTS || DEFAULT_CATEGORY_WEIGHTS;
  const totalWeight = (cw.prayer || 0) + (cw.diabetes || 0) + (cw.whoop || 0) + (cw.family || 0) + (cw.habits || 0);
  const normOverall = totalWeight > 0
    ? (normPrayer * (cw.prayer || 0) + normDiabetes * (cw.diabetes || 0) + normWhoop * (cw.whoop || 0) + normFamily * (cw.family || 0) + normHabits * (cw.habits || 0)) / totalWeight
    : 0;

  const result = {
    prayer: rawPrayer,
    prayerOnTime: totalOnTime,
    prayerLate: totalLate,
    diabetes: rawDiabetes,
    whoop: rawWhoop,
    family: rawFamily,
    habit: rawHabit,
    total: rawTotal,
    // Normalized scores (0-1)
    normalized: {
      prayer: normPrayer,
      diabetes: normDiabetes,
      whoop: normWhoop,
      family: normFamily,
      habits: normHabits,
      overall: Math.max(0, Math.min(1, normOverall))
    }
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
  state.WEIGHTS._updatedAt = new Date().toISOString();
  localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
}

function saveMaxScores() {
  state.MAX_SCORES._updatedAt = new Date().toISOString();
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

// ============================================================================
// SCORE COLOR TIER
// ============================================================================

/**
 * Get the color tier for a normalized score (0-1)
 * @param {number} score - Normalized score (0-1)
 * @returns {{ color: string, label: string, bg: string }}
 */
export function getScoreTier(score) {
  for (let i = SCORE_TIERS.length - 1; i >= 0; i--) {
    if (score >= SCORE_TIERS[i].min) return SCORE_TIERS[i];
  }
  return SCORE_TIERS[0];
}

// ============================================================================
// XP + LEVELS
// ============================================================================

/**
 * Get the level for a given XP total
 * @param {number} totalXP
 * @returns {number} Level (1-based)
 */
export function getLevel(totalXP) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

/**
 * Get XP needed for next level and progress within current level
 * @param {number} totalXP
 * @returns {{ level: number, currentLevelXP: number, nextLevelXP: number, progress: number, tierName: string, tierIcon: string }}
 */
export function getLevelInfo(totalXP) {
  const level = getLevel(totalXP);
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level] || currentLevelXP + 1000;
  const progress = (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP);
  const tier = LEVEL_TIERS.find(t => level >= t.min && level <= t.max) || LEVEL_TIERS[0];
  return {
    level,
    currentLevelXP,
    nextLevelXP,
    progress: Math.max(0, Math.min(1, progress)),
    tierName: tier.name,
    tierIcon: tier.icon
  };
}

/**
 * Get the streak multiplier for a given streak count
 * @param {number} streakDays
 * @returns {number} Multiplier (1.0 - 1.5)
 */
export function getStreakMultiplier(streakDays) {
  for (let i = STREAK_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (streakDays >= STREAK_MULTIPLIERS[i].min) return STREAK_MULTIPLIERS[i].multiplier;
  }
  return 1.0;
}

/**
 * Calculate XP earned for a given day's normalized overall score
 * @param {number} overallPercent - 0-1 normalized overall score
 * @param {number} streakMultiplier - streak multiplier (1.0-1.5)
 * @returns {{ base: number, streakBonus: number, total: number }}
 */
export function calculateDailyXP(overallPercent, streakMultiplier) {
  const base = Math.floor(overallPercent * 100);
  const streakBonus = Math.floor(base * (streakMultiplier - 1));
  return { base, streakBonus, total: base + streakBonus };
}

// ============================================================================
// STREAK LOGIC
// ============================================================================

/**
 * Update streak state based on today's score.
 * Should be called after data changes.
 * @param {string} dateStr - YYYY-MM-DD of the day being scored
 * @param {number} overallPercent - 0-1 normalized overall score
 */
export function updateStreak(dateStr, overallPercent) {
  const streak = state.streak;
  const isLogged = overallPercent >= STREAK_MIN_THRESHOLD;

  if (!isLogged) return; // Don't update streak for empty/minimal days

  if (!streak.lastLoggedDate) {
    // First ever logged day
    streak.current = 1;
    streak.lastLoggedDate = dateStr;
    streak.multiplier = getStreakMultiplier(1);
  } else if (dateStr === streak.lastLoggedDate) {
    // Same day, just update multiplier
    streak.multiplier = getStreakMultiplier(streak.current);
  } else {
    const last = new Date(streak.lastLoggedDate);
    const curr = new Date(dateStr);
    const diffMs = curr.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      streak.current++;
      streak.lastLoggedDate = dateStr;
    } else if (diffDays === 2 && streak.shield.available) {
      // Missed one day — use shield
      streak.shield.available = false;
      streak.shield.lastUsed = streak.lastLoggedDate; // the missed day
      streak.current++;
      streak.lastLoggedDate = dateStr;
    } else if (diffDays > 1) {
      // Streak broken
      streak.current = 1;
      streak.lastLoggedDate = dateStr;
    }
    // diffDays <= 0: going back in time, don't update streak
    if (diffDays <= 0) return;
  }

  // Update longest
  if (streak.current > streak.longest) {
    streak.longest = streak.current;
  }

  // Update multiplier
  streak.multiplier = getStreakMultiplier(streak.current);

  // Regenerate shield on Monday
  const today = new Date(dateStr);
  if (today.getDay() === 1 && streak.shield.lastUsed !== dateStr) {
    streak.shield.available = true;
  }

  saveStreak();
}

// ============================================================================
// XP ACCUMULATION
// ============================================================================

/**
 * Award XP for a day if not already awarded.
 * Should be called after updateStreak().
 * @param {string} dateStr - YYYY-MM-DD
 * @param {number} overallPercent - 0-1 normalized score
 * @returns {{ awarded: boolean, xpData?: object, levelUp?: boolean }}
 */
export function awardDailyXP(dateStr, overallPercent) {
  if (overallPercent < STREAK_MIN_THRESHOLD) return { awarded: false };

  // Check if already awarded for this date
  const existing = state.xp.history.find(h => h.date === dateStr);
  if (existing) return { awarded: false };

  const prevLevel = getLevel(state.xp.total);
  const xpData = calculateDailyXP(overallPercent, state.streak.multiplier);
  xpData.date = dateStr;

  state.xp.total += xpData.total;
  state.xp.history.push(xpData);

  // Keep history manageable (last 365 entries)
  if (state.xp.history.length > 365) {
    state.xp.history = state.xp.history.slice(-365);
  }

  const newLevel = getLevel(state.xp.total);
  saveXP();

  return { awarded: true, xpData, levelUp: newLevel > prevLevel };
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

/**
 * Build achievement context from current state and check for new unlocks.
 * @param {string} dateStr - current date
 * @param {object} scores - result from calculateScores()
 * @returns {string[]} Array of newly unlocked achievement IDs
 */
export function checkAchievements(dateStr, scores) {
  const newlyUnlocked = [];

  // Build context
  const levelInfo = getLevelInfo(state.xp.total);
  const dates = Object.keys(state.allData).sort();

  // Count total family days
  let totalFamilyDays = 0;
  let totalQuranPages = 0;
  let perfectPrayerStreak = 0;
  let maxPerfectPrayerStreak = 0;

  dates.forEach(d => {
    const dayData = state.allData[d];
    if (!dayData) return;
    // Family days
    const fam = dayData.family || {};
    if (Object.values(fam).some(v => v)) totalFamilyDays++;
    // Quran pages
    totalQuranPages += parseInt(dayData.prayers?.quran) || 0;
    // Perfect prayer streak
    let onTime = 0;
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
      const { onTime: ot } = parsePrayer(dayData.prayers?.[p]);
      if (ot >= 1) onTime++;
    });
    if (onTime === 5) {
      perfectPrayerStreak++;
      if (perfectPrayerStreak > maxPerfectPrayerStreak) maxPerfectPrayerStreak = perfectPrayerStreak;
    } else {
      perfectPrayerStreak = 0;
    }
  });

  const norm = scores?.normalized || {};
  const allAbove60 = (norm.prayer >= 0.6) && (norm.diabetes >= 0.6) && (norm.whoop >= 0.6) && (norm.family >= 0.6) && (norm.habits >= 0.6);

  const ctx = {
    streak: state.streak.current,
    prayerOnTime: scores?.prayerOnTime || 0,
    perfectPrayerStreak: maxPerfectPrayerStreak,
    overallPercent: norm.overall || 0,
    allCategoriesAbove60: allAbove60,
    totalFamilyDays,
    totalDaysLogged: dates.length,
    totalQuranPages,
    level: levelInfo.level
  };

  // Check each achievement
  ACHIEVEMENTS.forEach(ach => {
    if (state.achievements.unlocked[ach.id]) return; // Already unlocked
    if (ach.check(ctx)) {
      state.achievements.unlocked[ach.id] = { date: dateStr, notified: false };
      newlyUnlocked.push(ach.id);
    }
  });

  if (newlyUnlocked.length > 0) {
    saveAchievements();
  }

  return newlyUnlocked;
}

/**
 * Mark an achievement as notified (toast shown)
 * @param {string} achievementId
 */
export function markAchievementNotified(achievementId) {
  if (state.achievements.unlocked[achievementId]) {
    state.achievements.unlocked[achievementId].notified = true;
    saveAchievements();
  }
}

// ============================================================================
// DAILY FOCUS
// ============================================================================

/**
 * Get the daily focus suggestion based on 7-day category averages.
 * @returns {{ category: string, avgPercent: number, tip: string } | null}
 */
export function getDailyFocus() {
  if (_dailyFocusCache && _dailyFocusCacheVersion === state.scoresCacheVersion) {
    return _dailyFocusCache;
  }
  const today = new Date();
  const categoryTotals = { prayer: 0, diabetes: 0, whoop: 0, family: 0, habits: 0 };
  const categoryCounts = { prayer: 0, diabetes: 0, whoop: 0, family: 0, habits: 0 };

  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    if (state.allData[dateStr]) {
      const scores = calculateScores(state.allData[dateStr]);
      if (scores.normalized) {
        Object.keys(categoryTotals).forEach(cat => {
          const val = scores.normalized[cat] || 0;
          categoryTotals[cat] += val;
          categoryCounts[cat]++;
        });
      }
    }
  }

  // Need at least 3 days of data
  const totalDays = Math.max(...Object.values(categoryCounts));
  if (totalDays < 3) return null;

  // Find weakest category
  let weakest = null;
  let weakestAvg = 1;
  Object.keys(categoryTotals).forEach(cat => {
    if (categoryCounts[cat] < 1) return;
    const avg = categoryTotals[cat] / categoryCounts[cat];
    if (avg < weakestAvg) {
      weakestAvg = avg;
      weakest = cat;
    }
  });

  if (!weakest) return null;

  const displayNames = { prayer: 'Prayer', diabetes: 'Glucose', whoop: 'Recovery', family: 'Family', habits: 'Habits' };
  const result = {
    category: weakest,
    displayName: displayNames[weakest] || weakest,
    avgPercent: Math.round(weakestAvg * 100),
    tip: FOCUS_TIPS[weakest] || 'Focus on improving this area.'
  };
  _dailyFocusCache = result;
  _dailyFocusCacheVersion = state.scoresCacheVersion;
  return result;
}

/**
 * Process gamification for a day: update streak, award XP, check achievements.
 * Call this after any tracking data change.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {{ xpResult: object, newAchievements: string[] }}
 */
export function processGamification(dateStr) {
  const dayData = state.allData[dateStr] || defaultDayData;
  const scores = calculateScores(dayData);
  const overallPercent = scores.normalized?.overall || 0;

  // Update streak
  updateStreak(dateStr, overallPercent);

  // Award XP
  const xpResult = awardDailyXP(dateStr, overallPercent);

  // Check achievements
  const newAchievements = checkAchievements(dateStr, scores);

  // Ensure gamification state is synced to cloud (saveXP/saveStreak/saveAchievements
  // only write to localStorage — this ensures cloud gets the update too)
  window.debouncedSaveToGithub?.();

  return { xpResult, newAchievements };
}

// ============================================================================
// GAMIFICATION PERSISTENCE
// ============================================================================

export function saveXP() {
  state.xp._updatedAt = new Date().toISOString();
  localStorage.setItem(XP_KEY, JSON.stringify(state.xp));
}

export function saveStreak() {
  state.streak._updatedAt = new Date().toISOString();
  localStorage.setItem(STREAK_KEY, JSON.stringify(state.streak));
}

export function saveAchievements() {
  state.achievements._updatedAt = new Date().toISOString();
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state.achievements));
}

export function saveCategoryWeights() {
  state.CATEGORY_WEIGHTS._updatedAt = new Date().toISOString();
  localStorage.setItem(CATEGORY_WEIGHTS_KEY, JSON.stringify(state.CATEGORY_WEIGHTS));
}

export function updateCategoryWeight(category, value) {
  state.CATEGORY_WEIGHTS[category] = parseFloat(value) || 0;
  saveCategoryWeights();
  invalidateScoresCache();
  window.debouncedSaveToGithub();
  window.render();
}

export function resetCategoryWeights() {
  state.CATEGORY_WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_WEIGHTS));
  saveCategoryWeights();
  invalidateScoresCache();
  window.debouncedSaveToGithub();
  window.render();
}

/**
 * Recalculate all gamification data from scratch (for rebuilding after sync or import)
 */
export function rebuildGamification() {
  // Reset XP and streak
  state.xp = { total: 0, history: [] };
  state.streak = {
    current: 0, longest: 0, lastLoggedDate: null,
    shield: { available: true, lastUsed: null }, multiplier: 1.0
  };

  // Process all dates in order
  const dates = Object.keys(state.allData).sort();
  dates.forEach(dateStr => {
    const dayData = state.allData[dateStr];
    if (!dayData) return;
    const scores = calculateScores(dayData);
    const overallPercent = scores.normalized?.overall || 0;
    updateStreak(dateStr, overallPercent);
    // Award XP without level-up notifications during rebuild
    if (overallPercent >= STREAK_MIN_THRESHOLD) {
      const existing = state.xp.history.find(h => h.date === dateStr);
      if (!existing) {
        const xpData = calculateDailyXP(overallPercent, state.streak.multiplier);
        xpData.date = dateStr;
        state.xp.total += xpData.total;
        state.xp.history.push(xpData);
      }
    }
  });

  // Trim history
  if (state.xp.history.length > 365) {
    state.xp.history = state.xp.history.slice(-365);
  }

  // Check all achievements
  if (dates.length > 0) {
    const lastDate = dates[dates.length - 1];
    const lastScores = calculateScores(state.allData[lastDate] || defaultDayData);
    checkAchievements(lastDate, lastScores);
  }

  saveXP();
  saveStreak();
  saveAchievements();
  window.debouncedSaveToGithub?.();
}
