import {
  WORKOUT_DAYS,
  getProgramExercisesForDay,
  generateWorkoutSteps,
  ABS_EXERCISES,
} from '../src/data/program';
import { EXERCISES } from '../src/data/exercises';

describe('Workout Program Definition from PDF', () => {
  test('Contains all 7 days with exact definitions', () => {
    expect(Object.keys(WORKOUT_DAYS).length).toBe(7);

    // Day 1: Push Day
    expect(WORKOUT_DAYS[1].name).toBe('Push Day');
    expect(WORKOUT_DAYS[1].type).toBe('WORKOUT');
    expect(WORKOUT_DAYS[1].includesAbs).toBe(true);
    expect(WORKOUT_DAYS[1].warmupExercises[0].exerciseId).toBe('diamond_pushups');
    expect(WORKOUT_DAYS[1].warmupExercises[0].fixedReps).toBe(5);
    expect(WORKOUT_DAYS[1].warmupExercises[0].sets).toBe(2);
    expect(WORKOUT_DAYS[1].mainExercises.length).toBe(5);

    // Day 2: Pull Day
    expect(WORKOUT_DAYS[2].name).toBe('Pull Day');
    expect(WORKOUT_DAYS[2].type).toBe('WORKOUT');
    expect(WORKOUT_DAYS[2].includesAbs).toBe(false);
    expect(WORKOUT_DAYS[2].warmupExercises[0].exerciseId).toBe('lateral_raises');
    expect(WORKOUT_DAYS[2].warmupExercises[0].fixedReps).toBe(10);
    expect(WORKOUT_DAYS[2].warmupExercises[0].sets).toBe(1);

    // Day 3: Leg Day
    expect(WORKOUT_DAYS[3].name).toBe('Leg Day');
    expect(WORKOUT_DAYS[3].type).toBe('WORKOUT');
    expect(WORKOUT_DAYS[3].includesAbs).toBe(true);
    expect(WORKOUT_DAYS[3].warmupExercises[0].exerciseId).toBe('lunges');
    expect(WORKOUT_DAYS[3].warmupExercises[0].fixedReps).toBe(10);
    expect(WORKOUT_DAYS[3].warmupExercises[0].sets).toBe(2);

    // Day 4: Rest Day
    expect(WORKOUT_DAYS[4].name).toBe('Rest Day');
    expect(WORKOUT_DAYS[4].type).toBe('REST');
    expect(WORKOUT_DAYS[4].mainExercises.length).toBe(0);

    // Day 5: Upper Day
    expect(WORKOUT_DAYS[5].name).toBe('Upper Day');
    expect(WORKOUT_DAYS[5].type).toBe('WORKOUT');
    expect(WORKOUT_DAYS[5].includesAbs).toBe(true);
    expect(WORKOUT_DAYS[5].warmupExercises[0].exerciseId).toBe('knee_pushups');
    expect(WORKOUT_DAYS[5].warmupExercises[0].fixedReps).toBe(10);
    expect(WORKOUT_DAYS[5].warmupExercises[0].sets).toBe(2);
    expect(WORKOUT_DAYS[5].mainExercises.length).toBe(6);

    // Day 6: Leg Day
    expect(WORKOUT_DAYS[6].name).toBe('Leg Day');
    expect(WORKOUT_DAYS[6].type).toBe('WORKOUT');
    expect(WORKOUT_DAYS[6].includesAbs).toBe(true);
    expect(WORKOUT_DAYS[6].warmupExercises[0].fixedReps).toBe(5); // PDF Day 6 Lunges is 5x2
    expect(WORKOUT_DAYS[6].warmupExercises[0].sets).toBe(2);

    // Day 7: Rest Day
    expect(WORKOUT_DAYS[7].name).toBe('Rest Day');
    expect(WORKOUT_DAYS[7].type).toBe('REST');
  });

  test('All exercises in program have valid definitions in EXERCISES dictionary', () => {
    Object.values(WORKOUT_DAYS).forEach((day) => {
      [...day.warmupExercises, ...day.mainExercises].forEach((item) => {
        expect(EXERCISES[item.exerciseId]).toBeDefined();
        expect(EXERCISES[item.exerciseId].name).toBeTruthy();
        expect(EXERCISES[item.exerciseId].instructions.length).toBeGreaterThan(0);
      });
    });

    ABS_EXERCISES.forEach((absItem) => {
      expect(EXERCISES[absItem.exerciseId]).toBeDefined();
    });
  });

  test('Day 2 Equipment Variation: Pull-up bar replaces first 3 movements', () => {
    // Without pull-up bar: default 5 movements
    const defaultPull = getProgramExercisesForDay(2, ['towel', 'table', 'chair']);
    expect(defaultPull.main[0].exerciseId).toBe('towel_back_extension');
    expect(defaultPull.main[1].exerciseId).toBe('superman_pullback');
    expect(defaultPull.main[2].exerciseId).toBe('table_pullups');
    expect(defaultPull.main[3].exerciseId).toBe('school_bag_bicep_curls');
    expect(defaultPull.main[4].exerciseId).toBe('lateral_raises');
    expect(defaultPull.main.length).toBe(5);

    // With pull-up bar: pull-ups and chin-ups replace first 3
    const barPull = getProgramExercisesForDay(2, ['pull_up_bar']);
    expect(barPull.main[0].exerciseId).toBe('pull_ups');
    expect(barPull.main[1].exerciseId).toBe('chin_ups');
    expect(barPull.main[2].exerciseId).toBe('school_bag_bicep_curls');
    expect(barPull.main[3].exerciseId).toBe('lateral_raises');
    expect(barPull.main.length).toBe(4);
  });

  test('generateWorkoutSteps expands sets into discrete steps', () => {
    const steps = generateWorkoutSteps(1, ['chair']);
    // Warmup: 2 sets diamond pushups (2)
    // Main: 5 exercises * 2 sets = 10
    // Abs: 3 + 3 + 2 + 2 = 10 sets
    // Total: 2 + 10 + 10 = 22 discrete steps
    expect(steps.length).toBe(22);
    expect(steps[0].isWarmup).toBe(true);
    expect(steps[0].exerciseId).toBe('diamond_pushups');
    expect(steps[0].setNumber).toBe(1);
    expect(steps[1].setNumber).toBe(2);
    expect(steps[2].isWarmup).toBe(false);
    expect(steps[2].exerciseId).toBe('regular_pushups');
  });
});

