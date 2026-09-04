import { EquipmentId } from './equipment';

export interface UserSettings {
  isOnboarded: boolean;
  selectedEquipment: EquipmentId[];
  reminderTime: {
    hour: number;
    minute: number;
  };
  notificationsEnabled: boolean;
  currentCycleDay: number; // 1 - 7
  restDurationSeconds: number; // Default 120, allowed 120-240
  hapticsEnabled: boolean;
}

