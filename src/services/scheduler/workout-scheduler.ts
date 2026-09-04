import { WORKOUT_DAYS } from '../../data/program';
import { WorkoutDay } from '../../types/program';
import { SettingsRepository } from '../storage/settings-repository';

export class WorkoutScheduler {
  /**
   * Retrieves today's scheduled workout day definition based on the user's sequential cycle position.
   */
  static async getCurrentWorkoutDay(): Promise<WorkoutDay> {
    const settings = await SettingsRepository.getSettings();
    const dayNumber = settings.currentCycleDay || 1;
    return WORKOUT_DAYS[dayNumber] || WORKOUT_DAYS[1];
  }

  /**
   * Advances the user to the next day in the 7-day sequential program.
   */
  static async advanceToNextDay(): Promise<WorkoutDay> {
    const nextDayNumber = await SettingsRepository.advanceCycleDay();
    return WORKOUT_DAYS[nextDayNumber] || WORKOUT_DAYS[1];
  }

  /**
   * Manually sets the active cycle day (e.g. from settings or starting day selection).
   */
  static async setDay(dayNumber: number): Promise<WorkoutDay> {
    await SettingsRepository.setCycleDay(dayNumber);
    return WORKOUT_DAYS[dayNumber] || WORKOUT_DAYS[1];
  }

  /**
   * Gets the upcoming workout day info (useful on rest days to preview tomorrow's workout).
   */
  static getNextWorkoutDayInfo(currentDayNumber: number): WorkoutDay {
    const nextDay = currentDayNumber >= 7 ? 1 : currentDayNumber + 1;
    return WORKOUT_DAYS[nextDay] || WORKOUT_DAYS[1];
  }
}

