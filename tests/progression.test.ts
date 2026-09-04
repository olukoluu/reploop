import { ProgressionService } from '../src/services/progression/progression-service';
import { WorkoutSession } from '../src/types/session';

describe('ProgressionService', () => {
  const session1: WorkoutSession = {
    id: 's1',
    dayNumber: 1,
    dayName: 'Push Day',
    startedAt: '2026-08-20T10:00:00.000Z',
    completedAt: '2026-08-20T10:35:00.000Z',
    durationSeconds: 2100,
    status: 'COMPLETED',
    currentStepIndex: 0,
    steps: [],
    sets: [
      {
        id: 'st1',
        sessionId: 's1',
        exerciseId: 'regular_pushups',
        exerciseName: 'Regular Push-ups',
        setNumber: 1,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 20,
        isWarmup: false,
        completedAt: '2026-08-20T10:10:00.000Z',
      },
      {
        id: 'st2',
        sessionId: 's1',
        exerciseId: 'regular_pushups',
        exerciseName: 'Regular Push-ups',
        setNumber: 2,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 18,
        isWarmup: false,
        completedAt: '2026-08-20T10:15:00.000Z',
      },
      {
        id: 'st_dip1',
        sessionId: 's1',
        exerciseId: 'chair_dips',
        exerciseName: 'Chair Dips',
        setNumber: 1,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 15,
        isWarmup: false,
        completedAt: '2026-08-20T10:20:00.000Z',
      },
    ],
  };

  const session2: WorkoutSession = {
    id: 's2',
    dayNumber: 1,
    dayName: 'Push Day',
    startedAt: '2026-08-24T10:00:00.000Z',
    completedAt: '2026-08-24T10:35:00.000Z',
    durationSeconds: 2100,
    status: 'COMPLETED',
    currentStepIndex: 0,
    steps: [],
    sets: [
      {
        id: 'st3',
        sessionId: 's2',
        exerciseId: 'regular_pushups',
        exerciseName: 'Regular Push-ups',
        setNumber: 1,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 24, // New PR! (24 > 20)
        isWarmup: false,
        completedAt: '2026-08-24T10:10:00.000Z',
      },
      {
        id: 'st4',
        sessionId: 's2',
        exerciseId: 'regular_pushups',
        exerciseName: 'Regular Push-ups',
        setNumber: 2,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 21,
        isWarmup: false,
        completedAt: '2026-08-24T10:15:00.000Z',
      },
      {
        id: 'st_dip2',
        sessionId: 's2',
        exerciseId: 'chair_dips',
        exerciseName: 'Chair Dips',
        setNumber: 1,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 15, // Equal performance (15 === 15)
        isWarmup: false,
        completedAt: '2026-08-24T10:20:00.000Z',
      },
    ],
  };

  const session3Regression: WorkoutSession = {
    id: 's3',
    dayNumber: 1,
    dayName: 'Push Day',
    startedAt: '2026-08-28T10:00:00.000Z',
    completedAt: '2026-08-28T10:35:00.000Z',
    durationSeconds: 2100,
    status: 'COMPLETED',
    currentStepIndex: 0,
    steps: [],
    sets: [
      {
        id: 'st5',
        sessionId: 's3',
        exerciseId: 'regular_pushups',
        exerciseName: 'Regular Push-ups',
        setNumber: 1,
        totalSets: 2,
        repType: 'FAILURE',
        reps: 19, // Regression compared to all-time PR of 24
        isWarmup: false,
        completedAt: '2026-08-28T10:10:00.000Z',
      },
    ],
  };

  test('Calculates exercise progression accurately over multiple sessions', () => {
    const progressions = ProgressionService.calculateAllProgressions([session1, session2]);
    const pushups = progressions['regular_pushups'];

    expect(pushups).toBeDefined();
    expect(pushups.allTimeBest).toBe(24);
    expect(pushups.previousBest).toBe(20);
    expect(pushups.lastSessionReps).toEqual([24, 21]);
    expect(pushups.history.length).toBe(2);

    const dips = progressions['chair_dips'];
    expect(dips).toBeDefined();
    expect(dips.allTimeBest).toBe(15);
  });

  test('Detects new Personal Best in summary', () => {
    const summary = ProgressionService.generateSummary(session2, [session1]);
    expect(summary.totalReps).toBe(60); // 24 + 21 + 15
    expect(summary.newPersonalBests.length).toBe(1);
    expect(summary.newPersonalBests[0].exerciseId).toBe('regular_pushups');
    expect(summary.newPersonalBests[0].previousBest).toBe(20);
    expect(summary.newPersonalBests[0].newBest).toBe(24);
  });

  test('Handles equal performance without falsely triggering a new PR', () => {
    const summary = ProgressionService.generateSummary(session2, [session1]);
    const dipSummary = summary.exercisesCompleted.find((e) => e.exerciseId === 'chair_dips');
    expect(dipSummary).toBeDefined();
    expect(dipSummary?.isNewPR).toBe(false);
  });

  test('Handles regression without decreasing all-time PR record', () => {
    const progressions = ProgressionService.calculateAllProgressions([
      session1,
      session2,
      session3Regression,
    ]);
    const pushups = progressions['regular_pushups'];
    expect(pushups.allTimeBest).toBe(24); // PR is retained
    expect(pushups.lastSessionReps).toEqual([19]); // Last session reps recorded accurately
    expect(pushups.history.length).toBe(3);
  });
});
