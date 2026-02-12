// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { parsePrayer, calculateScores } from '../src/features/scoring.js';
import { state } from '../src/state.js';
import { DEFAULT_WEIGHTS, DEFAULT_MAX_SCORES, DEFAULT_CATEGORY_WEIGHTS } from '../src/constants.js';

beforeEach(() => {
  // Reset state for each test
  state.WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
  state.MAX_SCORES = JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
  state.CATEGORY_WEIGHTS = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_WEIGHTS));
  state.scoresCache = new Map();
  state.scoresCacheVersion = 0;
});

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
});

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
});
