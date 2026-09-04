import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession } from '../../types/session';
import { STORAGE_KEYS } from './storage-keys';

export class WorkoutRepository {
  /**
   * Saves or updates the currently active workout session.
   * If the app closes or crashes, this session can be restored.
   */
  static async saveActiveSession(session: WorkoutSession): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save active session:', error);
    }
  }

  /**
   * Retrieves the active workout session, if any exists.
   */
  static async getActiveSession(): Promise<WorkoutSession | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load active session:', error);
      return null;
    }
  }

  /**
   * Clears the active workout session upon completion or cancellation.
   */
  static async clearActiveSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Failed to clear active session:', error);
    }
  }

  /**
   * Saves a completed workout session into the history list and clears active session.
   */
  static async completeSession(session: WorkoutSession): Promise<void> {
    try {
      const completedList = await this.getCompletedSessions();
      const updatedList = [session, ...completedList];
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_SESSIONS,
        JSON.stringify(updatedList)
      );
      await this.clearActiveSession();
    } catch (error) {
      console.error('Failed to save completed session:', error);
      throw error;
    }
  }

  /**
   * Gets all historical completed sessions, sorted newest first.
   */
  static async getCompletedSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load completed sessions:', error);
      return [];
    }
  }

  /**
   * Gets a specific completed session by its ID.
   */
  static async getSessionById(sessionId: string): Promise<WorkoutSession | null> {
    const sessions = await this.getCompletedSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  }

  /**
   * Clears all session data (for debug/reset purposes).
   */
  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACTIVE_SESSION,
      STORAGE_KEYS.COMPLETED_SESSIONS,
    ]);
  }
}

