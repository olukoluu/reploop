import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { Card } from '../../src/components/ui/Card';
import { ExerciseMediaView } from '../../src/components/exercise/ExerciseMediaView';
import { RestTimerView } from '../../src/components/workout/RestTimerView';
import { useWorkout } from '../../src/context/WorkoutContext';
import { EXERCISES } from '../../src/data/exercises';
import { useRestTimer } from '../../src/hooks/useRestTimer';

export default function ActiveWorkoutScreen() {
  const {
    settings,
    activeSession,
    logSet,
    cancelWorkout,
    finishWorkout,
    progressions,
  } = useWorkout();

  const [enteredReps, setEnteredReps] = useState<number>(15);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // If there is no active session, go back home
  useEffect(() => {
    if (!activeSession) {
      router.replace('/(tabs)');
    }
  }, [activeSession]);

  const currentStep = activeSession?.steps[activeSession.currentStepIndex];
  const currentExercise = currentStep ? EXERCISES[currentStep.exerciseId] : null;

  // Previous performance for this exercise
  const previousPerformance = useMemo(() => {
    if (!currentStep) return null;
    const prog = progressions[currentStep.exerciseId];
    if (!prog || prog.history.length === 0) return null;
    return prog;
  }, [currentStep, progressions]);

  // Set default reps on step change
  useEffect(() => {
    if (currentStep) {
      if (currentStep.isWarmup && currentStep.fixedReps) {
        setEnteredReps(currentStep.fixedReps);
      } else if (previousPerformance && previousPerformance.allTimeBest > 0) {
        setEnteredReps(previousPerformance.allTimeBest);
      } else {
        setEnteredReps(15);
      }
    }
  }, [currentStep?.programExerciseId, currentStep?.setNumber]);

  const defaultRest = settings?.restDurationSeconds || 120;

  // Rest Timer hook
  const restTimer = useRestTimer({
    initialSeconds: defaultRest,
    onComplete: () => {
      setShowRestTimer(false);
    },
  });

  const handleLogSet = async () => {
    if (!activeSession || !currentStep) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const { isWorkoutComplete } = await logSet(enteredReps);

    if (isWorkoutComplete) {
      setIsFinishing(true);
      try {
        const summary = await finishWorkout();
        router.replace({
          pathname: '/workout/summary',
          params: { summaryData: JSON.stringify(summary) },
        });
      } catch (err) {
        console.error('Failed to finish workout:', err);
        setIsFinishing(false);
      }
    } else {
      // Transition into rest timer
      setShowRestTimer(true);
      restTimer.start(defaultRest);
    }
  };

  const handleSkipRest = () => {
    restTimer.skip();
    setShowRestTimer(false);
  };

  const handleQuitWorkout = () => {
    Alert.alert(
      'Leave Workout?',
      'Your logged sets for this session will be discarded.',
      [
        { text: 'Keep Training', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            await cancelWorkout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const incrementReps = (delta: number) => {
    setEnteredReps((prev) => Math.max(0, Math.min(200, prev + delta)));
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  if (!activeSession || !currentStep || !currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If rest timer is active between sets, render RestTimerView
  if (showRestTimer) {
    return (
      <SafeAreaView style={styles.container}>
        <RestTimerView
          formattedTime={restTimer.formattedTime}
          isPaused={restTimer.isPaused}
          progress={restTimer.progress}
          onPauseResume={() =>
            restTimer.isPaused ? restTimer.resume() : restTimer.pause()
          }
          onAdd30={() => restTimer.addTime(30)}
          onSubtract30={() => restTimer.subtractTime(30)}
          onSkip={handleSkipRest}
          nextExerciseName={currentStep?.exerciseName}
          nextSetNumber={currentStep?.setNumber}
          nextTotalSets={currentStep?.totalSets}
          isWarmup={currentStep?.isWarmup}
        />
      </SafeAreaView>
    );
  }

  const stepProgressPct =
    ((activeSession.currentStepIndex + 1) / activeSession.steps.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleQuitWorkout}
          style={styles.quitBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.sessionTitle}>{activeSession.dayName.toUpperCase()}</Text>
          <Text style={styles.stepProgressText}>
            Step {activeSession.currentStepIndex + 1} of {activeSession.steps.length}
          </Text>
        </View>

        <View style={styles.quitBtnPlaceholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${stepProgressPct}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Exercise Identification */}
        <View style={styles.exerciseHeader}>
          <View style={styles.badgeRow}>
            {currentStep.isWarmup && <Badge label="WARM-UP" variant="default" />}
            {currentStep.isAbs && <Badge label="ABS MODULE" variant="accent" />}
            <Badge
              label={`SET ${currentStep.setNumber} OF ${currentStep.totalSets}`}
              variant="outline"
            />
          </View>

          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.muscleTargets}>
            {currentExercise.targetMuscles.join(' · ')}
          </Text>
        </View>

        {/* Visual Demonstration Component */}
        <ExerciseMediaView exercise={currentExercise} style={styles.mediaPlaceholder} />

        {/* Previous Performance Banner */}
        {previousPerformance && (
          <Card style={styles.prevPerfCard}>
            <View style={styles.prevLeft}>
              <Ionicons name="trophy-outline" size={20} color={Colors.light.accent} />
              <View>
                <Text style={styles.prevCaption}>PREVIOUS BEST</Text>
                <Text style={styles.prevVal}>{previousPerformance.allTimeBest} reps</Text>
              </View>
            </View>
            <Text style={styles.prevNote}>Train till failure & beat this</Text>
          </Card>
        )}

        {/* Interactive Rep Logging Section */}
        <Card style={styles.logCard}>
          <Text style={styles.logQuestion}>
            {currentStep.isWarmup
              ? `Warm-up target: ${currentStep.fixedReps} reps`
              : 'How many reps did you complete?'}
          </Text>

          {/* Large Rep Display & Precision Stepper */}
          <View style={styles.repControlRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => incrementReps(-5)}
              style={styles.stepperQuickBtn}
            >
              <Text style={styles.stepperQuickText}>-5</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => incrementReps(-1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="remove" size={28} color={Colors.light.text} />
            </TouchableOpacity>

            <View style={styles.repNumberBox}>
              <Text style={styles.repNumberText}>{enteredReps}</Text>
              <Text style={styles.repLabel}>REPS COMPLETED</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => incrementReps(1)}
              style={styles.stepperBtn}
            >
              <Ionicons name="add" size={28} color={Colors.light.text} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => incrementReps(5)}
              style={styles.stepperQuickBtn}
            >
              <Text style={styles.stepperQuickText}>+5</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Rep Preset Chips */}
          <View style={styles.presetChipsRow}>
            {[10, 15, 20, 25, 30].map((preset) => (
              <TouchableOpacity
                key={preset}
                activeOpacity={0.7}
                onPress={() => {
                  setEnteredReps(preset);
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                }}
                style={[
                  styles.presetChip,
                  enteredReps === preset && styles.presetChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    enteredReps === preset && styles.presetChipTextSelected,
                  ]}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Exercise Form & Instructions Accordion */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instTitle}>FORM & EXECUTION</Text>
          {currentExercise.instructions.map((inst, i) => (
            <Text key={i} style={styles.instItem}>
              {i + 1}. {inst}
            </Text>
          ))}
          {currentExercise.formTips.length > 0 && (
            <View style={styles.tipsBox}>
              <Text style={styles.tipsHeading}>COACH TIP</Text>
              {currentExercise.formTips.map((tip, i) => (
                <Text key={i} style={styles.tipText}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Log Set Primary Button */}
      <View style={styles.footer}>
        <Button
          title={
            activeSession.currentStepIndex + 1 === activeSession.steps.length
              ? 'Complete Workout'
              : 'Log Set & Rest'
          }
          variant="primary"
          size="lg"
          loading={isFinishing}
          onPress={handleLogSet}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  topBarCenter: {
    alignItems: 'center',
  },
  sessionTitle: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  stepProgressText: {
    ...Typography.footnote,
    color: Colors.light.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  quitBtn: {
    padding: 4,
  },
  quitBtnPlaceholder: {
    width: 32,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: Colors.light.border,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.accent,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  exerciseHeader: {
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  exerciseName: {
    ...Typography.display,
    color: Colors.light.text,
  },
  muscleTargets: {
    ...Typography.subhead,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  mediaPlaceholder: {
    marginBottom: Spacing.md,
  },
  prevPerfCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.accentLight,
    borderColor: Colors.light.accent,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  prevLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  prevCaption: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.light.accent,
    fontWeight: '800',
  },
  prevVal: {
    ...Typography.headline,
    color: Colors.light.text,
    fontWeight: '800',
  },
  prevNote: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  logCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logQuestion: {
    ...Typography.headline,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  repControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepperQuickBtn: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQuickText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  stepperBtn: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repNumberBox: {
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  repNumberText: {
    ...Typography.heroNumber,
    color: Colors.light.text,
    lineHeight: 64,
  },
  repLabel: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    fontSize: 9,
    letterSpacing: 1,
  },
  presetChipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    justifyContent: 'center',
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  presetChipSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  presetChipText: {
    ...Typography.footnote,
    fontWeight: '700',
    color: Colors.light.text,
  },
  presetChipTextSelected: {
    color: Colors.light.textInverse,
  },
  instructionsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  instTitle: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  instItem: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    paddingVertical: 3,
    lineHeight: 19,
  },
  tipsBox: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  tipsHeading: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontSize: 10,
    marginBottom: 2,
  },
  tipText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});

