import { EquipmentId } from './equipment';

export type RepType = 'FAILURE' | 'FIXED';

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  order: number;
  sets: number;
  repType: RepType;
  fixedReps?: number;
  isWarmup: boolean;
  notes?: string;
  replacesExerciseIds?: string[];
  requiresEquipment?: EquipmentId[];
}

export type WorkoutDayType = 'WORKOUT' | 'REST';

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  subtitle: string;
  targetMuscles: string;
  type: WorkoutDayType;
  warmupExercises: ProgramExercise[];
  mainExercises: ProgramExercise[];
  includesAbs: boolean;
  pullUpBarReplacementCount?: number;
}

