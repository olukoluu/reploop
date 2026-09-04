import { StreakInfo } from '../../types/streak';
import { WorkoutSession } from '../../types/session';
import { WORKOUT_DAYS } from '../../data/program';

export class StreakService {
  /**
   * Calculates the current and longest streak from completed workout sessions.
   * Rest days prescribed by the 7-day program do NOT break the streak.
   */
  static calculateStreak(
    completedSessions: WorkoutSession[],
    todayDate: Date = new Date()
  ): StreakInfo {
    if (!completedSessions || completedSessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        lastCompletedDayNumber: null,
        totalWorkoutsCompleted: 0,
      };
    }

    // Sort completed sessions oldest to newest
    const sorted = [...completedSessions]
      .filter((s) => s.status === 'COMPLETED')
      .sort(
        (a, b) =>
          new Date(a.completedAt || a.startedAt).getTime() -
          new Date(b.completedAt || b.startedAt).getTime()
      );

    if (sorted.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        lastCompletedDayNumber: null,
        totalWorkoutsCompleted: 0,
      };
    }

    const totalWorkouts = sorted.length;
    let currentStreak = 0;
    let longestStreak = 0;

    // Track completed days with their dates and day numbers
    type CycleEntry = {
      dateStr: string;
      date: Date;
      dayNumber: number;
      isRest: boolean;
    };

    const entries: CycleEntry[] = [];
    for (const session of sorted) {
      const sessionDate = new Date(session.completedAt || session.startedAt);
      const dateStr = sessionDate.toISOString().split('T')[0];
      const dayDef = WORKOUT_DAYS[session.dayNumber];

      entries.push({
        dateStr,
        date: sessionDate,
        dayNumber: session.dayNumber,
        isRest: dayDef ? dayDef.type === 'REST' : false,
      });
    }

    // Calculate streak over entries
    let tempStreak = 0;
    let prevEntry: CycleEntry | null = null;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (!prevEntry) {
        tempStreak = 1;
      } else {
        const diffMs = entry.date.getTime() - prevEntry.date.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        // Check if sequential cycle progression was followed
        const expectedNextDay = prevEntry.dayNumber >= 7 ? 1 : prevEntry.dayNumber + 1;
        const isSequential =
          entry.dayNumber === expectedNextDay ||
          // Or if adjacent workout with rest days accounted for
          (prevEntry.dayNumber === 3 && entry.dayNumber === 5 && diffDays <= 3) || // Day 4 was rest
          (prevEntry.dayNumber === 6 && entry.dayNumber === 1 && diffDays <= 3); // Day 7 was rest

        // Allow up to 3 days between non-rest workouts (e.g. resting over weekend or 1 rest day)
        if (diffDays <= 3 || isSequential) {
          tempStreak += 1;
        } else {
          tempStreak = 1;
        }
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevEntry = entry;
    }

    // Check if the current streak is still active relative to todayDate
    const lastSession = sorted[sorted.length - 1];
    const lastDate = new Date(lastSession.completedAt || lastSession.startedAt);
    const msSinceLast = todayDate.getTime() - lastDate.getTime();
    const daysSinceLast = Math.floor(msSinceLast / (1000 * 60 * 60 * 24));

    // If more than 3 days have passed since the last workout, the active streak resets
    if (daysSinceLast > 3) {
      currentStreak = 0;
    } else {
      currentStreak = tempStreak;
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastCompletedDate: lastSession.completedAt || lastSession.startedAt,
      lastCompletedDayNumber: lastSession.dayNumber,
      totalWorkoutsCompleted: totalWorkouts,
    };
  }
}

