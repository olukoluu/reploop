import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WORKOUT_DAYS } from '../../data/program';
import { SettingsRepository } from '../storage/settings-repository';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
  shouldShowBanner: true,
  shouldShowList: true,
  shouldPlaySound: true,
  shouldSetBadge: false,
}),
});

export class NotificationService {
  /**
   * Requests permission to schedule notifications.
   * Returns true if granted, false otherwise.
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const isGranted = finalStatus === 'granted';
      await SettingsRepository.saveSettings({ notificationsEnabled: isGranted });
      return isGranted;
    } catch (error) {
      console.warn('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedules a daily workout notification based on the user's preferred time and current cycle day.
   */
  static async scheduleWorkoutReminder(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      const settings = await SettingsRepository.getSettings();
      if (!settings.notificationsEnabled) return;

      // Cancel any existing scheduled notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      const currentDay = WORKOUT_DAYS[settings.currentCycleDay] || WORKOUT_DAYS[1];

      // If today is a rest day, do not schedule an aggressive workout alarm
      if (currentDay.type === 'REST') {
        // Optionally schedule rest recovery tip or simply skip
        return;
      }

      const { hour, minute } = settings.reminderTime;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏋️ ${currentDay.name.toUpperCase()}`,
          body: `Your ${currentDay.subtitle} session is ready. Train. Track. Repeat.`,
          sound: true,
          data: { dayNumber: settings.currentCycleDay },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        } as Notifications.NotificationTriggerInput,
      });
    } catch (error) {
      console.warn('Failed to schedule workout reminder:', error);
    }
  }

  /**
   * Cancels all scheduled workout reminders.
   */
  static async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('Failed to cancel notifications:', error);
    }
  }
}
