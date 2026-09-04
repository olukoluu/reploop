import AsyncStorage from '@react-native-async-storage/async-storage';
import { EquipmentId } from '../../types/equipment';
import { UserSettings } from '../../types/settings';
import { STORAGE_KEYS } from './storage-keys';

const DEFAULT_SETTINGS: UserSettings = {
  isOnboarded: false,
  selectedEquipment: ['chair', 'table', 'towel', 'school_bag'],
  reminderTime: {
    hour: 7,
    minute: 0,
  },
  notificationsEnabled: false,
  currentCycleDay: 1,
  restDurationSeconds: 120, // Default 2 minutes
  hapticsEnabled: true,
};

export class SettingsRepository {
  static async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const current = await this.getSettings();
      const updated: UserSettings = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to save user settings:', error);
      throw error;
    }
  }

  static async setOnboarded(
    selectedEquipment: EquipmentId[],
    reminderTime: { hour: number; minute: number },
    startDay: number
  ): Promise<UserSettings> {
    return this.saveSettings({
      isOnboarded: true,
      selectedEquipment,
      reminderTime,
      currentCycleDay: startDay,
    });
  }

  static async advanceCycleDay(): Promise<number> {
    const settings = await this.getSettings();
    const nextDay = settings.currentCycleDay >= 7 ? 1 : settings.currentCycleDay + 1;
    await this.saveSettings({ currentCycleDay: nextDay });
    return nextDay;
  }

  static async setCycleDay(dayNumber: number): Promise<void> {
    const validDay = Math.min(Math.max(1, dayNumber), 7);
    await this.saveSettings({ currentCycleDay: validDay });
  }

  static async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
  }
}

