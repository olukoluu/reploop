import { WorkoutScheduler } from '../src/services/scheduler/workout-scheduler';
import { SettingsRepository } from '../src/services/storage/settings-repository';
import { WORKOUT_DAYS, getNextDayNumber } from '../src/data/program';

// Mock AsyncStorage for Jest environment
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (key: string) => store[key] || null),
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    multiRemove: jest.fn(async (keys: string[]) => {
      keys.forEach((k) => delete store[k]);
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

describe('WorkoutScheduler', () => {
  beforeEach(async () => {
    await SettingsRepository.clearAll();
  });

  test('Starts on Day 1 by default', async () => {
    const day = await WorkoutScheduler.getCurrentWorkoutDay();
    expect(day.dayNumber).toBe(1);
    expect(day.name).toBe('Push Day');
  });

  test('Advances cycle sequentially from 1 to 7 then loops back to 1', async () => {
    await WorkoutScheduler.setDay(1);

    const day2 = await WorkoutScheduler.advanceToNextDay();
    expect(day2.dayNumber).toBe(2);
    expect(day2.name).toBe('Pull Day');

    await WorkoutScheduler.setDay(6);
    const day7 = await WorkoutScheduler.advanceToNextDay();
    expect(day7.dayNumber).toBe(7);
    expect(day7.type).toBe('REST');

    const day1NextCycle = await WorkoutScheduler.advanceToNextDay();
    expect(day1NextCycle.dayNumber).toBe(1);
    expect(day1NextCycle.name).toBe('Push Day');
  });

  test('getNextWorkoutDayInfo returns next scheduled day without advancing', () => {
    expect(WorkoutScheduler.getNextWorkoutDayInfo(4).dayNumber).toBe(5);
    expect(WorkoutScheduler.getNextWorkoutDayInfo(4).name).toBe('Upper Day');
    expect(WorkoutScheduler.getNextWorkoutDayInfo(7).dayNumber).toBe(1);
  });

  describe('Missed Workout Scenarios', () => {
    test('Scenario 1: Day 1 completed, Day 2 missed -> active day remains Day 2 Pull Day', async () => {
      await WorkoutScheduler.setDay(1);
      await WorkoutScheduler.advanceToNextDay(); // Day 1 completed, now on Day 2

      // User missed Day 2 and opens app days later:
      const currentDay = await WorkoutScheduler.getCurrentWorkoutDay();
      expect(currentDay.dayNumber).toBe(2);
      expect(currentDay.name).toBe('Pull Day');
    });

    test('Scenario 2: Day 1 completed, multiple days missed -> schedule continues on Day 2', async () => {
      await WorkoutScheduler.setDay(1);
      await WorkoutScheduler.advanceToNextDay();

      // Days pass...
      const currentDay = await WorkoutScheduler.getCurrentWorkoutDay();
      expect(currentDay.dayNumber).toBe(2);
      expect(currentDay.name).toBe('Pull Day');
    });

    test('Scenario 3: Miss workout before prescribed rest day (Day 3 missed) -> stays on Day 3', async () => {
      await WorkoutScheduler.setDay(3); // On Leg Day before Day 4 Rest
      const currentDay = await WorkoutScheduler.getCurrentWorkoutDay();
      expect(currentDay.dayNumber).toBe(3);
      expect(currentDay.type).toBe('WORKOUT');

      // Completing Day 3 advances to Day 4 Rest Day
      const nextDay = await WorkoutScheduler.advanceToNextDay();
      expect(nextDay.dayNumber).toBe(4);
      expect(nextDay.type).toBe('REST');
    });

    test('Scenario 4: Complete workout after being behind schedule -> sequence advances cleanly', async () => {
      await WorkoutScheduler.setDay(5); // Upper Day
      const day5 = await WorkoutScheduler.getCurrentWorkoutDay();
      expect(day5.dayNumber).toBe(5);

      const day6 = await WorkoutScheduler.advanceToNextDay();
      expect(day6.dayNumber).toBe(6);
      expect(day6.name).toBe('Leg Day');

      const day7 = await WorkoutScheduler.advanceToNextDay();
      expect(day7.dayNumber).toBe(7);
      expect(day7.type).toBe('REST');
    });
  });
});
