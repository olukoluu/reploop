import { EquipmentId } from '../types/equipment';
import { ProgramExercise, WorkoutDay } from '../types/program';
import { FlattenedWorkoutStep } from '../types/session';
import { EXERCISES } from './exercises';

export const ABS_EXERCISES: ProgramExercise[] = [
  {
    id: 'abs-1',
    exerciseId: 'abs_crunches',
    order: 1,
    sets: 3,
    repType: 'FAILURE',
    isWarmup: false,
    notes: 'Abs crunches till failure x 3',
  },
  {
    id: 'abs-2',
    exerciseId: 'russian_twist',
    order: 2,
    sets: 3,
    repType: 'FAILURE',
    isWarmup: false,
    notes: 'Russian twist till failure x 3',
  },
  {
    id: 'abs-3',
    exerciseId: 'leg_raises',
    order: 3,
    sets: 2,
    repType: 'FAILURE',
    isWarmup: false,
    notes: 'Leg raises till failure x 2',
  },
  {
    id: 'abs-4',
    exerciseId: 'knee_tucks',
    order: 4,
    sets: 2,
    repType: 'FAILURE',
    isWarmup: false,
    notes: 'Knee tucks till failure x 2',
  },
];

export const WORKOUT_DAYS: Record<number, WorkoutDay> = {
  1: {
    dayNumber: 1,
    name: 'Push Day',
    subtitle: 'Chest, Triceps & Front Delts',
    targetMuscles: 'Chest, Triceps & Front Delts (Shoulders)',
    type: 'WORKOUT',
    includesAbs: true,
    warmupExercises: [
      {
        id: 'd1-w1',
        exerciseId: 'diamond_pushups',
        order: 1,
        sets: 2,
        repType: 'FIXED',
        fixedReps: 5,
        isWarmup: true,
        notes: 'Warm up: Diamond push-ups 5 x 2',
      },
    ],
    mainExercises: [
      {
        id: 'd1-m1',
        exerciseId: 'regular_pushups',
        order: 1,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Regular push-ups till failure x 2',
      },
      {
        id: 'd1-m2',
        exerciseId: 'diamond_pushups',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Diamond push-ups till failure x 2',
      },
      {
        id: 'd1-m3',
        exerciseId: 'chair_dips',
        order: 3,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Chair dips till failure x 2',
        requiresEquipment: ['chair'],
      },
      {
        id: 'd1-m4',
        exerciseId: 'wide_arm_pushups',
        order: 4,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Wide-arm push-ups till failure x 2',
      },
      {
        id: 'd1-m5',
        exerciseId: 'incline_pushups',
        order: 5,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Incline push-ups till failure x 2',
        requiresEquipment: ['chair'],
      },
    ],
  },
  2: {
    dayNumber: 2,
    name: 'Pull Day',
    subtitle: 'Back, Biceps & Delts',
    targetMuscles: 'Back, Biceps and Side and Rear Delts',
    type: 'WORKOUT',
    includesAbs: false,
    warmupExercises: [
      {
        id: 'd2-w1',
        exerciseId: 'lateral_raises',
        order: 1,
        sets: 1,
        repType: 'FIXED',
        fixedReps: 10,
        isWarmup: true,
        notes: 'Warm ups: Lateral raises 10 x 1',
      },
    ],
    mainExercises: [
      {
        id: 'd2-m1',
        exerciseId: 'towel_back_extension',
        order: 1,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Towel back extension till failure x 2',
        requiresEquipment: ['towel'],
      },
      {
        id: 'd2-m2',
        exerciseId: 'superman_pullback',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Superman pullback till failure x 2',
      },
      {
        id: 'd2-m3',
        exerciseId: 'table_pullups',
        order: 3,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Table pull-ups till failure x 2',
        requiresEquipment: ['table'],
      },
      {
        id: 'd2-m4',
        exerciseId: 'school_bag_bicep_curls',
        order: 4,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'School bag bicep curls till failure x 2',
        requiresEquipment: ['school_bag'],
      },
      {
        id: 'd2-m5',
        exerciseId: 'lateral_raises',
        order: 5,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Lateral raises till failure x 2',
      },
    ],
  },
  3: {
    dayNumber: 3,
    name: 'Leg Day',
    subtitle: 'Glutes, Quads & Hamstrings',
    targetMuscles: 'Glutes, Quads, Hamstrings & Calves',
    type: 'WORKOUT',
    includesAbs: true,
    warmupExercises: [
      {
        id: 'd3-w1',
        exerciseId: 'lunges',
        order: 1,
        sets: 2,
        repType: 'FIXED',
        fixedReps: 10,
        isWarmup: true,
        notes: 'Warm-ups: Lunges 10 x 2',
      },
    ],
    mainExercises: [
      {
        id: 'd3-m1',
        exerciseId: 'squats',
        order: 1,
        sets: 3,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Squats till failure x 3',
      },
      {
        id: 'd3-m2',
        exerciseId: 'split_squats',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Split squats till failure x 2',
      },
      {
        id: 'd3-m3',
        exerciseId: 'calves_raises',
        order: 3,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Calves raises till failure x 2',
      },
      {
        id: 'd3-m4',
        exerciseId: 'walking_lunges',
        order: 4,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Walking lunges till failure x 2',
      },
    ],
  },
  4: {
    dayNumber: 4,
    name: 'Rest Day',
    subtitle: 'Recovery & Growth',
    targetMuscles: 'Full Body Rest & Muscle Recovery',
    type: 'REST',
    includesAbs: false,
    warmupExercises: [],
    mainExercises: [],
  },
  5: {
    dayNumber: 5,
    name: 'Upper Day',
    subtitle: 'Chest, Back, Arms & Shoulders',
    targetMuscles: 'Chest, Biceps, Triceps, Back & Full Shoulders',
    type: 'WORKOUT',
    includesAbs: true,
    warmupExercises: [
      {
        id: 'd5-w1',
        exerciseId: 'knee_pushups',
        order: 1,
        sets: 2,
        repType: 'FIXED',
        fixedReps: 10,
        isWarmup: true,
        notes: 'Warm-ups: Knee push-ups 10 x 2',
      },
    ],
    mainExercises: [
      {
        id: 'd5-m1',
        exerciseId: 'regular_pushups',
        order: 1,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Regular push-ups till failure x 2',
      },
      {
        id: 'd5-m2',
        exerciseId: 'table_pullups',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Table pull-ups till failure x 2',
        requiresEquipment: ['table'],
      },
      {
        id: 'd5-m3',
        exerciseId: 'lateral_raises',
        order: 3,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Lateral raises till failure x 2',
      },
      {
        id: 'd5-m4',
        exerciseId: 'school_bag_bicep_curls',
        order: 4,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'School bag bicep curls till failure x 2',
        requiresEquipment: ['school_bag'],
      },
      {
        id: 'd5-m5',
        exerciseId: 'chair_dips',
        order: 5,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Chair dips till failure x 2',
        requiresEquipment: ['chair'],
      },
      {
        id: 'd5-m6',
        exerciseId: 'incline_pushups',
        order: 6,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Incline push-ups till failure x 2',
        requiresEquipment: ['chair'],
      },
    ],
  },
  6: {
    dayNumber: 6,
    name: 'Leg Day',
    subtitle: 'Glutes, Quads & Hamstrings',
    targetMuscles: 'Glutes, Quads, Hamstrings & Calves',
    type: 'WORKOUT',
    includesAbs: true,
    warmupExercises: [
      {
        id: 'd6-w1',
        exerciseId: 'lunges',
        order: 1,
        sets: 2,
        repType: 'FIXED',
        fixedReps: 5,
        isWarmup: true,
        notes: 'Warm-ups: Lunges 5 x 2',
      },
    ],
    mainExercises: [
      {
        id: 'd6-m1',
        exerciseId: 'squats',
        order: 1,
        sets: 3,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Squats till failure x 3',
      },
      {
        id: 'd6-m2',
        exerciseId: 'split_squats',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Split squats till failure x 2',
      },
      {
        id: 'd6-m3',
        exerciseId: 'calves_raises',
        order: 3,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Calves raises till failure x 2',
      },
      {
        id: 'd6-m4',
        exerciseId: 'walking_lunges',
        order: 4,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Walking lunges till failure x 2',
      },
    ],
  },
  7: {
    dayNumber: 7,
    name: 'Rest Day',
    subtitle: 'Recovery & Growth',
    targetMuscles: 'Full Body Rest & Active Recovery',
    type: 'REST',
    includesAbs: false,
    warmupExercises: [],
    mainExercises: [],
  },
};

/**
 * Returns the effective program exercises for a given day,
 * applying equipment rules (e.g. Pull-up bar replaces first 3 movements on Day 2).
 */
export function getProgramExercisesForDay(
  dayNumber: number,
  equipment: EquipmentId[]
): {
  warmups: ProgramExercise[];
  main: ProgramExercise[];
  abs: ProgramExercise[];
} {
  const day = WORKOUT_DAYS[dayNumber];
  if (!day || day.type === 'REST') {
    return { warmups: [], main: [], abs: [] };
  }

  const warmups = [...day.warmupExercises];
  let main = [...day.mainExercises];

  // DAY 2 Pull-up bar variation from PDF:
  // "if pull-up bar available..... PULL-UPS TF x 2, CHIN-UPS TF x 2 (In place of the first 3 movements)"
  if (dayNumber === 2 && equipment.includes('pull_up_bar')) {
    const pullUpVariations: ProgramExercise[] = [
      {
        id: 'd2-var-1',
        exerciseId: 'pull_ups',
        order: 1,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Pull-ups till failure x 2 (Pull-up bar variation)',
        requiresEquipment: ['pull_up_bar'],
      },
      {
        id: 'd2-var-2',
        exerciseId: 'chin_ups',
        order: 2,
        sets: 2,
        repType: 'FAILURE',
        isWarmup: false,
        notes: 'Chin-ups till failure x 2 (Pull-up bar variation)',
        requiresEquipment: ['pull_up_bar'],
      },
    ];

    // Replace the first 3 movements (towel back extension, superman pullback, table pull-ups)
    const remainingMovements = main.slice(3); // keeps school bag bicep curls and lateral raises
    main = [...pullUpVariations, ...remainingMovements];
  }

  const abs = day.includesAbs ? [...ABS_EXERCISES] : [];

  return { warmups, main, abs };
}

/**
 * Generates the full, flattened list of discrete workout sets for an active workout session.
 */
export function generateWorkoutSteps(
  dayNumber: number,
  equipment: EquipmentId[]
): FlattenedWorkoutStep[] {
  const { warmups, main, abs } = getProgramExercisesForDay(dayNumber, equipment);
  const steps: FlattenedWorkoutStep[] = [];

  const addExerciseSteps = (
    exercises: ProgramExercise[],
    isWarmup: boolean,
    isAbs: boolean
  ) => {
    exercises.forEach((ex) => {
      const exerciseMeta = EXERCISES[ex.exerciseId];
      const name = exerciseMeta ? exerciseMeta.name : ex.exerciseId;

      for (let s = 1; s <= ex.sets; s++) {
        steps.push({
          programExerciseId: ex.id,
          exerciseId: ex.exerciseId,
          exerciseName: name,
          setNumber: s,
          totalSets: ex.sets,
          repType: ex.repType,
          fixedReps: ex.fixedReps,
          isWarmup,
          isAbs,
        });
      }
    });
  };

  addExerciseSteps(warmups, true, false);
  addExerciseSteps(main, false, false);
  addExerciseSteps(abs, false, true);

  return steps;
}

export function getNextDayNumber(currentDay: number): number {
  return currentDay >= 7 ? 1 : currentDay + 1;
}

