import { EquipmentId } from './equipment';
import { RepType } from './program';

export interface SetLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  totalSets: number;
  repType: RepType;
  targetReps?: number;
  reps: number;
  isWarmup: boolean;
  completedAt: string;
}

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface FlattenedWorkoutStep {
  programExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  totalSets: number;
  repType: RepType;
  fixedReps?: number;
  isWarmup: boolean;
  isAbs: boolean;
}

export interface WorkoutSession {
  id: string;
  dayNumber: number;
  dayName: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  status: SessionStatus;
  currentStepIndex: number;
  steps: FlattenedWorkoutStep[];
  sets: SetLog[];
  activeRestTimer?: {
    totalSeconds: number;
    remainingSeconds: number;
    startedAt: string;
    isPaused: boolean;
    nextStepIndex: number;
  };
}

