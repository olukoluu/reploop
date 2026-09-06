import { NotificationService, NOTIFICATION_CHANNEL_ID } from "../src/services/notifications/notification-service";
import { SettingsRepository } from "../src/services/storage/settings-repository";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Mock react-native
jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    select: jest.fn((dict: any) => dict.android || dict.default),
  },
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (key: string) => store[key] || null),
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

// Mock expo-notifications
jest.mock("expo-notifications", () => {
  let scheduled: any[] = [];
  let channels: Record<string, any> = {};

  return {
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn(async (id: string, config: any) => {
      channels[id] = config;
      return { id, ...config };
    }),
    getNotificationChannelAsync: jest.fn(async (id: string) => channels[id] || null),
    getPermissionsAsync: jest.fn(async () => ({ status: "undetermined" })),
    requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
    scheduleNotificationAsync: jest.fn(async (req: any) => {
      const id = `notif_${Date.now()}_${Math.random()}`;
      scheduled.push({ identifier: id, ...req });
      return id;
    }),
    getAllScheduledNotificationsAsync: jest.fn(async () => [...scheduled]),
    cancelAllScheduledNotificationsAsync: jest.fn(async () => {
      scheduled = [];
    }),
    SchedulableTriggerInputTypes: {
      DAILY: "daily",
      TIME_INTERVAL: "timeInterval",
      CALENDAR: "calendar",
      DATE: "date",
    },
    AndroidImportance: {
      MAX: 7,
      HIGH: 6,
      DEFAULT: 5,
    },
    AndroidNotificationPriority: {
      MAX: "max",
      HIGH: "high",
    },
  };
});

describe("NotificationService Unit Tests", () => {
  beforeEach(async () => {
    await SettingsRepository.clearAll();
    await Notifications.cancelAllScheduledNotificationsAsync();
    jest.clearAllMocks();
  });

  test("Configures Android Notification Channel with MAX importance and channel ID", async () => {
    // Force Android platform for test
    const origPlatform = Platform.OS;
    Object.defineProperty(Platform, "OS", { value: "android", configurable: true });

    await NotificationService.setupNotificationChannel();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      NOTIFICATION_CHANNEL_ID,
      expect.objectContaining({
        name: "Daily Workout Reminders",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        enableVibrate: true,
      })
    );

    Object.defineProperty(Platform, "OS", { value: origPlatform, configurable: true });
  });

  test("Requests permission and saves granted state to user settings", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "undetermined" });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "granted" });

    const isGranted = await NotificationService.requestPermissions();
    expect(isGranted).toBe(true);

    const settings = await SettingsRepository.getSettings();
    expect(settings.notificationsEnabled).toBe(true);
  });

  test("Reflects denied permission safely without enabling notifications", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "undetermined" });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: "denied" });

    const isGranted = await NotificationService.requestPermissions();
    expect(isGranted).toBe(false);

    const settings = await SettingsRepository.getSettings();
    expect(settings.notificationsEnabled).toBe(false);
  });

  test("Schedules daily workout reminder with valid DailyTriggerInput containing hour, minute, and channelId", async () => {
    await SettingsRepository.saveSettings({
      notificationsEnabled: true,
      reminderTime: { hour: 8, minute: 30 },
      currentCycleDay: 1, // Push Day
    });

    const notifId = await NotificationService.scheduleWorkoutReminder();
    expect(notifId).toBeTruthy();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: expect.stringContaining("PUSH DAY"),
          sound: "default",
        }),
        trigger: expect.objectContaining({
          type: "daily",
          hour: 8,
          minute: 30,
          channelId: NOTIFICATION_CHANNEL_ID,
        }),
      })
    );

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    expect(scheduled.length).toBe(1);
  });

  test("Schedules rest day reminder properly so daily trigger stays active on Day 4 & Day 7", async () => {
    await SettingsRepository.saveSettings({
      notificationsEnabled: true,
      reminderTime: { hour: 19, minute: 0 },
      currentCycleDay: 4, // Rest Day
    });

    const notifId = await NotificationService.scheduleWorkoutReminder();
    expect(notifId).toBeTruthy();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: expect.stringContaining("REST & RECOVERY"),
        }),
        trigger: expect.objectContaining({
          type: "daily",
          hour: 19,
          minute: 0,
          channelId: NOTIFICATION_CHANNEL_ID,
        }),
      })
    );
  });

  test("Cancels all scheduled notifications when notifications are disabled", async () => {
    await SettingsRepository.saveSettings({
      notificationsEnabled: false,
    });

    const result = await NotificationService.scheduleWorkoutReminder();
    expect(result).toBeNull();
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    expect(scheduled.length).toBe(0);
  });

  test("Diagnostic test notification helper schedules immediate interval trigger", async () => {
    const notifId = await NotificationService.scheduleTestNotification(30);
    expect(notifId).toBeTruthy();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: "REPLOOP TEST",
        }),
        trigger: expect.objectContaining({
          type: "timeInterval",
          seconds: 30,
          repeats: false,
          channelId: NOTIFICATION_CHANNEL_ID,
        }),
      })
    );
  });
});

