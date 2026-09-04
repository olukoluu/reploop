export interface ExerciseSetHistory {
  date: string;
  sessionId: string;
  reps: number[];
  bestRep: number;
  totalReps: number;
}

export interface ExerciseProgression {
  exerciseId: string;
  exerciseName: string;
  allTimeBest: number;
  previousBest: number;
  lastSessionReps: number[];
  lastCompletedDate: string;
  history: ExerciseSetHistory[];
}

export interface PersonalBestRecord {
  exerciseId: string;
  exerciseName: string;
  previousBest: number;
  newBest: number;
  achievedAt: string;
}

export interface WorkoutSummary {
  sessionId: string;
  dayNumber: number;
  dayName: string;
  durationSeconds: number;
  startedAt: string;
  completedAt: string;
  totalSets: number;
  totalReps: number;
  exercisesCompleted: {
    exerciseId: string;
    exerciseName: string;
    sets: number[];
    isNewPR: boolean;
    previousBest?: number;
    currentBest: number;
  }[];
  newPersonalBests: PersonalBestRecord[];
}

