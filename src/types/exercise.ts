export type MuscleGroup =
  | 'chest'
  | 'triceps'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'back'
  | 'biceps'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'abs';

export interface ExerciseMedia {
  type: 'placeholder' | 'local_image' | 'video';
  uri?: string;
  placeholderIcon?: string;
  accentGradient?: [string, string];
}

export interface Exercise {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  targetMuscles: string[];
  muscleGroups: MuscleGroup[];
  instructions: string[];
  formTips: string[];
  equipmentNeeded?: string[];
  media?: ExerciseMedia;
}

