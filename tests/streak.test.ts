import { StreakService } from '../src/services/streak/streak-service';
import { WorkoutSession } from '../src/types/session';

describe('StreakService', () => {
  const baseSession = (
    id: string,
    dayNumber: number,
    dateStr: string
  ): WorkoutSession => ({
    id,
    dayNumber,
    dayName: `Day ${dayNumber}`,
    startedAt: `${dateStr}T10:00:00.000Z`,
    completedAt: `${dateStr}T10:35:00.000Z`,
    durationSeconds: 2100,
    status: 'COMPLETED',
    currentStepIndex: 0,
    steps: [],
    sets: [],
  });

  test('Preserves streak across consecutive workout days', () => {
    const sessions = [
      baseSession('s1', 1, '2026-08-20'),
      baseSession('s2', 2, '2026-08-21'),
      baseSession('s3', 3, '2026-08-22'),
    ];

    const streak = StreakService.calculateStreak(
      sessions,
      new Date('2026-08-22T15:00:00.000Z')
    );

    expect(streak.currentStreak).toBe(3);
    expect(streak.totalWorkoutsCompleted).toBe(3);
  });

  test('Prescribed rest day does NOT break the streak', () => {
    // Day 3 (Legs) on Aug 22, Day 4 (Rest) on Aug 23, Day 5 (Upper) on Aug 24
    const sessions = [
      baseSession('s1', 1, '2026-08-20'),
      baseSession('s2', 2, '2026-08-21'),
      baseSession('s3', 3, '2026-08-22'),
      baseSession('s4', 5, '2026-08-24'), // skipped rest day in logging, but resumed correctly on Upper day
    ];

    const streak = StreakService.calculateStreak(
      sessions,
      new Date('2026-08-24T15:00:00.000Z')
    );

    expect(streak.currentStreak).toBe(4);
    expect(streak.longestStreak).toBe(4);
  });
});

