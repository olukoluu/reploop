import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSettings } from '../types/settings';
import { StreakInfo } from '../types/streak';
import { WorkoutSession, SetLog, FlattenedWorkoutStep } from '../types/session';
import { WorkoutSummary, ExerciseProgression } from '../types/progression';
import { EquipmentId } from '../types/equipment';
import { SettingsRepository } from '../services/storage/settings-repository';
import { WorkoutRepository } from '../services/storage/workout-repository';
import { StreakService } from '../services/streak/streak-service';
import { ProgressionService } from '../services/progression/progression-service';
import { NotificationService } from '../services/notifications/notification-service';
import { WORKOUT_DAYS, generateWorkoutSteps } from '../data/program';

interface WorkoutContextType {
  settings: UserSettings | null;
  streak: StreakInfo;
  completedSessions: WorkoutSession[];
  progressions: Record<string, ExerciseProgression>;
  activeSession: WorkoutSession | null;
  isLoading: boolean;
  
  // Actions
  completeOnboarding: (
    equipment: EquipmentId[],
    reminderTime: { hour: number; minute: number },
    startDay: number
  ) => Promise<void>;
  updateEquipment: (equipment: EquipmentId[]) => Promise<void>;
  updateReminderTime: (time: { hour: number; minute: number }) => Promise<void>;
  setCurrentCycleDay: (dayNumber: number) => Promise<void>;
  
  // Active Workout Session Actions
  startWorkout: (dayNumber?: number) => Promise<WorkoutSession>;
  logSet: (reps: number) => Promise<{ isWorkoutComplete: boolean; loggedSet: SetLog }>;
  cancelWorkout: () => Promise<void>;
  finishWorkout: () => Promise<WorkoutSummary>;
  
  // Refreshers
  refreshData: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    lastCompletedDayNumber: null,
    totalWorkoutsCompleted: 0,
  });
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>([]);
  const [progressions, setProgressions] = useState<Record<string, ExerciseProgression>>({});
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [savedSettings, active, completed] = await Promise.all([
        SettingsRepository.getSettings(),
        WorkoutRepository.getActiveSession(),
        WorkoutRepository.getCompletedSessions(),
      ]);

      setSettings(savedSettings);
      setActiveSession(active);
      setCompletedSessions(completed);

      const calculatedStreak = StreakService.calculateStreak(completed);
      setStreak(calculatedStreak);

      const progs = ProgressionService.calculateAllProgressions(completed);
      setProgressions(progs);
    } catch (error) {
      console.error('Failed to refresh workout context data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    NotificationService.setupNotificationChannel();
    refreshData();
  }, [refreshData]);

  const completeOnboarding = async (
    equipment: EquipmentId[],
    reminderTime: { hour: number; minute: number },
    startDay: number
  ) => {
    const updated = await SettingsRepository.setOnboarded(equipment, reminderTime, startDay);
    setSettings(updated);
    await NotificationService.scheduleWorkoutReminder();
    await refreshData();
  };

  const updateEquipment = async (equipment: EquipmentId[]) => {
    const updated = await SettingsRepository.saveSettings({ selectedEquipment: equipment });
    setSettings(updated);
  };

  const updateReminderTime = async (time: { hour: number; minute: number }) => {
    const updated = await SettingsRepository.saveSettings({ reminderTime: time });
    setSettings(updated);
    await NotificationService.scheduleWorkoutReminder();
  };

  const setCurrentCycleDay = async (dayNumber: number) => {
    await SettingsRepository.setCycleDay(dayNumber);
    const updated = await SettingsRepository.getSettings();
    setSettings(updated);
    await NotificationService.scheduleWorkoutReminder();
  };

  const startWorkout = async (dayNumberOverride?: number): Promise<WorkoutSession> => {
    const currentSettings = settings || (await SettingsRepository.getSettings());
    const dayNumber = dayNumberOverride ?? currentSettings.currentCycleDay ?? 1;
    const dayDef = WORKOUT_DAYS[dayNumber] || WORKOUT_DAYS[1];

    const steps = generateWorkoutSteps(dayNumber, currentSettings.selectedEquipment);

    const newSession: WorkoutSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      dayNumber,
      dayName: dayDef.name,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'IN_PROGRESS',
      currentStepIndex: 0,
      steps,
      sets: [],
    };

    await WorkoutRepository.saveActiveSession(newSession);
    setActiveSession(newSession);
    return newSession;
  };

  const logSet = async (
    reps: number
  ): Promise<{ isWorkoutComplete: boolean; loggedSet: SetLog }> => {
    if (!activeSession) {
      throw new Error('No active workout session found.');
    }

    const currentStep = activeSession.steps[activeSession.currentStepIndex];
    if (!currentStep) {
      throw new Error('Current workout step is out of bounds.');
    }

    const newSetLog: SetLog = {
      id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId: activeSession.id,
      exerciseId: currentStep.exerciseId,
      exerciseName: currentStep.exerciseName,
      setNumber: currentStep.setNumber,
      totalSets: currentStep.totalSets,
      repType: currentStep.repType,
      targetReps: currentStep.fixedReps,
      reps,
      isWarmup: currentStep.isWarmup,
      completedAt: new Date().toISOString(),
    };

    const nextStepIndex = activeSession.currentStepIndex + 1;
    const isWorkoutComplete = nextStepIndex >= activeSession.steps.length;

    const updatedSession: WorkoutSession = {
      ...activeSession,
      currentStepIndex: nextStepIndex,
      sets: [...activeSession.sets, newSetLog],
    };

    await WorkoutRepository.saveActiveSession(updatedSession);
    setActiveSession(updatedSession);

    return { isWorkoutComplete, loggedSet: newSetLog };
  };

  const cancelWorkout = async () => {
    await WorkoutRepository.clearActiveSession();
    setActiveSession(null);
  };

  const finishWorkout = async (): Promise<WorkoutSummary> => {
    if (!activeSession) {
      throw new Error('No active session to finish.');
    }

    const completedAt = new Date().toISOString();
    const durationSeconds = Math.round(
      (new Date(completedAt).getTime() - new Date(activeSession.startedAt).getTime()) / 1000
    );

    const completedSession: WorkoutSession = {
      ...activeSession,
      completedAt,
      durationSeconds,
      status: 'COMPLETED',
    };

    // Save completed session to history and clear active
    await WorkoutRepository.completeSession(completedSession);

    // Generate summary and PRs
    const summary = ProgressionService.generateSummary(
      completedSession,
      completedSessions
    );

    // Advance cycle day in settings
    await SettingsRepository.advanceCycleDay();

    // Refresh context data
    await refreshData();
    setActiveSession(null);

    // Reschedule reminder for new current day
    await NotificationService.scheduleWorkoutReminder();

    return summary;
  };

  return (
    <WorkoutContext.Provider
      value={{
        settings,
        streak,
        completedSessions,
        progressions,
        activeSession,
        isLoading,
        completeOnboarding,
        updateEquipment,
        updateReminderTime,
        setCurrentCycleDay,
        startWorkout,
        logSet,
        cancelWorkout,
        finishWorkout,
        refreshData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

