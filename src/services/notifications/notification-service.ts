import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WORKOUT_DAYS } from '../../data/program';
import { SettingsRepository } from '../storage/settings-repository';

export const NOTIFICATION_CHANNEL_ID = 'workout-reminders';

// Configure notification presentation handler
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
   * Sets up the Android notification channel with MAX importance so that
   * reminders reliably present heads-up alerts and play sounds.
   */
  static async setupNotificationChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      console.log('[NOTIFICATION DEBUG] Setting up Android notification channel:', NOTIFICATION_CHANNEL_ID);
      await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
        name: 'Daily Workout Reminders',
        description: 'Reminders for your scheduled daily workouts and recovery sessions',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E53935',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
      console.log('[NOTIFICATION DEBUG] Android notification channel setup complete.');
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to set up notification channel:', error);
    }
  }

  /**
   * Requests permission to schedule notifications.
   * Returns true if granted, false otherwise.
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('[NOTIFICATION DEBUG] Platform is web, notifications not supported.');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('[NOTIFICATION DEBUG] Existing notification permission status:', existingStatus);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      console.log('[NOTIFICATION DEBUG] Final notification permission status:', finalStatus);
      const isGranted = finalStatus === 'granted';

      await SettingsRepository.saveSettings({ notificationsEnabled: isGranted });

      if (isGranted) {
        await this.setupNotificationChannel();
        await this.scheduleWorkoutReminder();
      }

      return isGranted;
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedules a daily workout notification based on the user's preferred time and current cycle day.
   */
  static async scheduleWorkoutReminder(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const settings = await SettingsRepository.getSettings();
      console.log('[NOTIFICATION DEBUG] Scheduling reminder with settings:', {
        notificationsEnabled: settings.notificationsEnabled,
        reminderTime: settings.reminderTime,
        currentCycleDay: settings.currentCycleDay,
      });

      if (!settings.notificationsEnabled) {
        console.log('[NOTIFICATION DEBUG] Notifications disabled by user; cancelling all reminders.');
        await this.cancelAll();
        return null;
      }

      // Ensure notification channel is configured on Android
      await this.setupNotificationChannel();

      // Cancel any existing scheduled notifications first to prevent duplicates
      const beforeList = await Notifications.getAllScheduledNotificationsAsync();
      console.log('[NOTIFICATION DEBUG] Existing scheduled notifications before cancel:', beforeList.length);
      await Notifications.cancelAllScheduledNotificationsAsync();

      const currentDay = WORKOUT_DAYS[settings.currentCycleDay] || WORKOUT_DAYS[1];
      const { hour, minute } = settings.reminderTime;

      const isRestDay = currentDay.type === 'REST';
      const title = isRestDay
        ? '🧘 REST & RECOVERY DAY'
        : `🏋️ ${currentDay.name.toUpperCase()}`;
      const body = isRestDay
        ? 'Today is a scheduled rest day. Hydrate, recover, and prepare for your next workout.'
        : `Your ${currentDay.subtitle} session is ready. Train. Track. Repeat.`;

      console.log('[NOTIFICATION DEBUG] Scheduling daily notification with trigger:', {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: NOTIFICATION_CHANNEL_ID,
        title,
      });

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: {
            dayNumber: settings.currentCycleDay,
            isRestDay,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });

      console.log('[NOTIFICATION DEBUG] Notification scheduled successfully. ID:', notificationId);

      // Verify scheduled list
      const scheduledList = await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        '[NOTIFICATION DEBUG] Verified scheduled notifications in system:',
        scheduledList.map((n) => ({
          id: n.identifier,
          trigger: n.trigger,
          content: n.content.title,
        }))
      );

      return notificationId;
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to schedule workout reminder:', error);
      return null;
    }
  }

  /**
   * Schedules a one-off diagnostic test notification (e.g., 30 seconds from now)
   * to verify immediate delivery on device.
   */
  static async scheduleTestNotification(seconds: number = 30): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      await this.setupNotificationChannel();
      console.log(`[NOTIFICATION DEBUG] Scheduling test notification for ${seconds}s in future...`);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'REPLOOP TEST',
          body: `Notification delivery test (${seconds}s timer). Train. Track. Repeat.`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: { isTest: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          repeats: false,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });

      console.log('[NOTIFICATION DEBUG] Test notification scheduled. ID:', notificationId);
      const scheduledList = await Notifications.getAllScheduledNotificationsAsync();
      console.log('[NOTIFICATION DEBUG] Active scheduled notifications count:', scheduledList.length);
      return notificationId;
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to schedule test notification:', error);
      return null;
    }
  }

  /**
   * Retrieves all currently scheduled notifications.
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    if (Platform.OS === 'web') return [];
    try {
      const list = await Notifications.getAllScheduledNotificationsAsync();
      console.log('[NOTIFICATION DEBUG] Current scheduled notifications count:', list.length);
      return list;
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to get scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Cancels all scheduled workout reminders.
   */
  static async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      console.log('[NOTIFICATION DEBUG] Cancelling all scheduled notifications.');
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[NOTIFICATION DEBUG] All scheduled notifications cancelled.');
    } catch (error) {
      console.warn('[NOTIFICATION DEBUG] Failed to cancel notifications:', error);
    }
  }
}
