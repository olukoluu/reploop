import { ImageSourcePropType } from 'react-native';

export interface ExerciseMediaAsset {
  /**
   * Statically required local video asset (e.g. require('../../assets/exercises/squats/demonstration.mp4'))
   * undefined when no local demonstration video exists for this exercise.
   */
  video?: number | { uri: string };

  /**
   * Statically required local thumbnail image asset (e.g. require('../../assets/exercises/squats/thumbnail.jpg'))
   * undefined when no thumbnail is available.
   */
  thumbnail?: ImageSourcePropType;
}

/**
 * Centralized registry mapping exercise IDs to local media assets.
 * 
 * IMPORTANT:
 * - Only statically required files that actually exist on disk are registered.
 * - React Native bundler requires static analyzability; dynamic require() is not allowed.
 * - When an asset is absent, the entry remains undefined and the UI gracefully renders
 *   the instructional coaching fallback.
 */
export const EXERCISE_MEDIA_REGISTRY: Record<string, ExerciseMediaAsset> = {
  diamond_pushups: {
    video: require('../../assets/exercises/diamond_pushups/demonstration.mp4'),
  },
  regular_pushups: {
    video: require('../../assets/exercises/regular_pushups/demonstration.mp4'),
  },
  chair_dips: {
    video: require('../../assets/exercises/chair_dips/demonstration.mp4'),
  },
  wide_arm_pushups: {
    video: require('../../assets/exercises/wide_arm_pushups/demonstration.mp4'),
  },
  incline_pushups: {
    video: require('../../assets/exercises/incline_pushups/demonstration.mp4'),
  },
  lateral_raises: {
    video: require('../../assets/exercises/lateral_raises/demonstration.mp4'),
  },
  towel_back_extension: {
    video: require('../../assets/exercises/towel_back_extension/demonstration.mp4'),
  },
  superman_pullback: {
    video: require('../../assets/exercises/superman_pullback/demonstration.mp4'),
  },
  table_pullups: {
    video: require('../../assets/exercises/table_pullups/demonstration.mp4'),
  },
  school_bag_bicep_curls: {
    video: require('../../assets/exercises/school_bag_bicep_curls/demonstration.mp4'),
  },
  pull_ups: {
    video: require('../../assets/exercises/pull_ups/demonstration.mp4'),
  },
  chin_ups: {
    video: require('../../assets/exercises/chin_ups/demonstration.mp4'),
  },
  lunges: {
    video: require('../../assets/exercises/lunges/demonstration.mp4'),
  },
  squats: {
    video: require('../../assets/exercises/squats/demonstration.mp4'),
  },
  split_squats: {
    video: require('../../assets/exercises/split_squats/demonstration.mp4'),
  },
  calves_raises: {
    video: require('../../assets/exercises/calves_raises/demonstration.mp4'),
  },
  walking_lunges: {
    video: require('../../assets/exercises/walking_lunges/demonstration.mp4'),
  },
  knee_pushups: {
    video: require('../../assets/exercises/knee_pushups/demonstration.mp4'),
  },
  abs_crunches: {
    video: require('../../assets/exercises/abs_crunches/demonstration.mp4'),
  },
  russian_twist: {
    video: require('../../assets/exercises/russian_twist/demonstration.mp4'),
  },
  leg_raises: {
    video: require('../../assets/exercises/leg_raises/demonstration.mp4'),
  },
  knee_tucks: {
    video: require('../../assets/exercises/knee_tucks/demonstration.mp4'),
  },
};

/**
 * Retrieve local media asset for a given exercise ID.
 * Returns undefined if no media is registered for the exercise.
 */
export function getExerciseMedia(exerciseId: string): ExerciseMediaAsset | undefined {
  return EXERCISE_MEDIA_REGISTRY[exerciseId];
}

/**
 * Check whether an exercise currently has a local demonstration video available.
 */
export function hasDemonstrationVideo(exerciseId: string): boolean {
  const media = EXERCISE_MEDIA_REGISTRY[exerciseId];
  return Boolean(media?.video);
}
