import { EXERCISES } from '../src/data/exercises';
import {
  EXERCISE_MEDIA_REGISTRY,
  getExerciseMedia,
  hasDemonstrationVideo,
} from '../src/data/exercise-media';

describe('Exercise Demonstration Media System', () => {
  const allExerciseIds = Object.keys(EXERCISES);

  test('exactly 22 unique exercises are defined in exercises.ts', () => {
    expect(allExerciseIds).toHaveLength(22);
  });

  test('1. Every exercise in exercises.ts can be resolved by the media layer', () => {
    for (const id of allExerciseIds) {
      const media = getExerciseMedia(id);
      expect(media).toBeDefined();
    }
  });

  test('2. All 22 exercises have a registered local demonstration video asset', () => {
    for (const id of allExerciseIds) {
      const media = getExerciseMedia(id);
      expect(media).toBeDefined();
      expect(media?.video).toBeDefined();
      expect(hasDemonstrationVideo(id)).toBe(true);
    }
  });

  test('3. Missing media or unknown ID does not throw exceptions and returns fallback safely', () => {
    expect(getExerciseMedia('nonexistent_exercise_id')).toBeUndefined();
    expect(hasDemonstrationVideo('nonexistent_exercise_id')).toBe(false);
  });

  test('4. Existing exercise metadata remains available as fallback for all 22 exercises', () => {
    for (const id of allExerciseIds) {
      const exercise = EXERCISES[id];
      expect(exercise).toBeDefined();
      expect(exercise.id).toBe(id);
      expect(exercise.name).toBeTruthy();
      expect(exercise.targetMuscles.length).toBeGreaterThan(0);
      expect(exercise.instructions.length).toBeGreaterThan(0);
      expect(exercise.formTips.length).toBeGreaterThan(0);
    }
  });

  test('5. Media lookup uses exact exercise ID keys matching all 22 exercises', () => {
    const registryKeys = Object.keys(EXERCISE_MEDIA_REGISTRY);
    expect(registryKeys).toHaveLength(22);

    for (const id of allExerciseIds) {
      expect(registryKeys).toContain(id);
      const media = getExerciseMedia(id);
      expect(media).toBe(EXERCISE_MEDIA_REGISTRY[id]);
    }
  });

  test('6. No invalid or broken media references are registered', () => {
    for (const id of allExerciseIds) {
      const media = getExerciseMedia(id);
      expect(media?.video).toBeDefined();
      expect(typeof media?.video === 'number' || typeof media?.video === 'object').toBe(true);
    }
  });
});
