import { describe, expect, it } from 'vitest';
import { calculateCurrentCaffeine, getCharacterStatus, getDynamicHalfLife } from './utiles';

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: () => null,
  },
});

type UserProfile = Parameters<typeof getDynamicHalfLife>[0];

const createUser = (overrides: Partial<UserProfile>): UserProfile => ({
  nickname: '',
  weight: 60,
  gender: 'M',
  isMenstruating: false,
  dsm5Score: 0,
  isTapering: false,
  taperingWeek: 0,
  baseIntake: 0,
  hasCompletedOnboarding: true,
  isDarkMode: false,
  challengeStartedAt: '',
  sensitivity: 'NORMAL',
  preferredBedtime: '23:00',
  ...overrides,
});

describe('calculateCurrentCaffeine', () => {
  it('returns approximately the input amount when intake time is now', () => {
    const result = calculateCurrentCaffeine(200, new Date().toISOString(), 5);

    expect(result).toBeCloseTo(200, 0);
  });

  it('returns approximately half after one full half-life', () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    const result = calculateCurrentCaffeine(200, fiveHoursAgo, 5);

    expect(result).toBeGreaterThanOrEqual(95);
    expect(result).toBeLessThanOrEqual(105);
  });
});

describe('getCharacterStatus', () => {
  it("returns 'IDLE' when total caffeine is zero", () => {
    expect(getCharacterStatus(0, 400)).toBe('IDLE');
  });

  it("returns 'DANGER' when total caffeine exceeds the goal", () => {
    expect(getCharacterStatus(500, 400)).toBe('DANGER');
  });
});

describe('getDynamicHalfLife', () => {
  it('returns 5 for a male user with normal sensitivity', () => {
    expect(getDynamicHalfLife(createUser({ gender: 'M', sensitivity: 'NORMAL' }))).toBe(5);
  });

  it('returns 7.5 for a menstruating female user with normal sensitivity', () => {
    expect(getDynamicHalfLife(createUser({
      gender: 'F',
      sensitivity: 'NORMAL',
      isMenstruating: true,
    }))).toBe(7.5);
  });
});
