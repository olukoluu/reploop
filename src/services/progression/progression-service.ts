import { EXERCISES } from '../../data/exercises';
import {
  ExerciseProgression,
  ExerciseSetHistory,
  PersonalBestRecord,
  WorkoutSummary,
} from '../../types/progression';
import { WorkoutSession } from '../../types/session';

export class ProgressionService {
  /**
   * Calculates overall progression for all exercises across all past completed sessions.
   */
  static calculateAllProgressions(
    sessions: WorkoutSession[]
  ): Record<string, ExerciseProgression> {
    const progressions: Record<string, ExerciseProgression> = {};

    // Sort chronologically ascending (oldest first) to accurately trace PR evolution
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    );

    for (const session of sortedSessions) {
      // Group sets in this session by exerciseId
      const exerciseSets: Record<string, number[]> = {};

      for (const set of session.sets) {
        if (!exerciseSets[set.exerciseId]) {
          exerciseSets[set.exerciseId] = [];
        }
        exerciseSets[set.exerciseId].push(set.reps);
      }

      for (const [exerciseId, reps] of Object.entries(exerciseSets)) {
        const exerciseMeta = EXERCISES[exerciseId];
        const exerciseName = exerciseMeta ? exerciseMeta.name : exerciseId;
        const currentBestInSession = Math.max(0, ...reps);
        const totalRepsInSession = reps.reduce((sum, r) => sum + r, 0);

        const historyItem: ExerciseSetHistory = {
          date: session.completedAt || session.startedAt,
          sessionId: session.id,
          reps,
          bestRep: currentBestInSession,
          totalReps: totalRepsInSession,
        };

        if (!progressions[exerciseId]) {
          progressions[exerciseId] = {
            exerciseId,
            exerciseName,
            allTimeBest: currentBestInSession,
            previousBest: 0,
            lastSessionReps: reps,
            lastCompletedDate: session.completedAt || session.startedAt,
            history: [historyItem],
          };
        } else {
          const prog = progressions[exerciseId];
          const oldAllTimeBest = prog.allTimeBest;
          const newAllTimeBest = Math.max(oldAllTimeBest, currentBestInSession);

          prog.previousBest = oldAllTimeBest;
          prog.allTimeBest = newAllTimeBest;
          prog.lastSessionReps = reps;
          prog.lastCompletedDate = session.completedAt || session.startedAt;
          prog.history.push(historyItem);
        }
      }
    }

    return progressions;
  }

  /**
   * Generates a detailed WorkoutSummary for a newly completed session,
   * comparing against historical sessions prior to this one.
   */
  static generateSummary(
    session: WorkoutSession,
    previousSessions: WorkoutSession[]
  ): WorkoutSummary {
    const priorProgressions = this.calculateAllProgressions(
      previousSessions.filter((s) => s.id !== session.id)
    );

    let totalReps = 0;
    const exerciseMap: Record<string, { name: string; sets: number[] }> = {};

    for (const set of session.sets) {
      totalReps += set.reps;
      if (!exerciseMap[set.exerciseId]) {
        exerciseMap[set.exerciseId] = {
          name: set.exerciseName,
          sets: [],
        };
      }
      exerciseMap[set.exerciseId].sets.push(set.reps);
    }

    const newPersonalBests: PersonalBestRecord[] = [];
    const exerciseSummaries = Object.entries(exerciseMap).map(
      ([exerciseId, data]) => {
        const currentBest = Math.max(0, ...data.sets);
        const priorProg = priorProgressions[exerciseId];
        const previousBest = priorProg ? priorProg.allTimeBest : 0;
        const isNewPR = previousBest > 0 && currentBest > previousBest;

        if (isNewPR) {
          newPersonalBests.push({
            exerciseId,
            exerciseName: data.name,
            previousBest,
            newBest: currentBest,
            achievedAt: session.completedAt || session.startedAt,
          });
        }

        return {
          exerciseId,
          exerciseName: data.name,
          sets: data.sets,
          isNewPR,
          previousBest: priorProg ? previousBest : undefined,
          currentBest,
        };
      }
    );

    return {
      sessionId: session.id,
      dayNumber: session.dayNumber,
      dayName: session.dayName,
      durationSeconds: session.durationSeconds,
      startedAt: session.startedAt,
      completedAt: session.completedAt || new Date().toISOString(),
      totalSets: session.sets.length,
      totalReps,
      exercisesCompleted: exerciseSummaries,
      newPersonalBests,
    };
  }

  /**
   * Returns the previous reps recorded for an exercise from the most recent session.
   */
  static getPreviousPerformance(
    exerciseId: string,
    sessions: WorkoutSession[]
  ): { lastReps: number[]; bestRep: number } | null {
    const progs = this.calculateAllProgressions(sessions);
    const prog = progs[exerciseId];
    if (!prog) return null;
    return {
      lastReps: prog.lastSessionReps,
      bestRep: prog.allTimeBest,
    };
  }
}

