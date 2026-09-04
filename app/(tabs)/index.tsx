import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { useWorkout } from '../../src/context/WorkoutContext';
import { WORKOUT_DAYS, getProgramExercisesForDay } from '../../src/data/program';
import { WorkoutScheduler } from '../../src/services/scheduler/workout-scheduler';

export default function HomeScreen() {
  const { settings, streak, progressions, startWorkout, setCurrentCycleDay, activeSession } =
    useWorkout();

  const currentDayNumber = settings?.currentCycleDay || 1;
  const currentDayDef = WORKOUT_DAYS[currentDayNumber] || WORKOUT_DAYS[1];
  const isRestDay = currentDayDef.type === 'REST';

  const dayProgram = useMemo(() => {
    return getProgramExercisesForDay(
      currentDayNumber,
      settings?.selectedEquipment || ['chair', 'table', 'towel', 'school_bag']
    );
  }, [currentDayNumber, settings?.selectedEquipment]);

  const totalExerciseCount = dayProgram.main.length + (dayProgram.abs.length > 0 ? 1 : 0);

  // Formatted date string
  const todayFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Top highlight progression (e.g. Push-ups)
  const highlightProgression = useMemo(() => {
    const keys = Object.keys(progressions);
    if (keys.length === 0) return null;
    const first = progressions[keys[0]];
    const diff =
      first.previousBest > 0 ? first.allTimeBest - first.previousBest : 0;
    return {
      name: first.exerciseName,
      best: first.allTimeBest,
      diff,
    };
  }, [progressions]);

  const handleStartWorkout = async () => {
    await startWorkout(currentDayNumber);
    router.push('/workout/active');
  };

  const handleResumeWorkout = () => {
    router.push('/workout/active');
  };

  const handleAdvanceRestDay = async () => {
    const nextDay = WorkoutScheduler.getNextWorkoutDayInfo(currentDayNumber);
    await setCurrentCycleDay(nextDay.dayNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Date & Greeting */}
        <View style={styles.topHeader}>
          <Text style={styles.dateLabel}>{todayFormatted}</Text>
          <Text style={styles.greetingLabel}>{greeting}</Text>
        </View>

        {/* Active Session Recovery Banner */}
        {activeSession && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleResumeWorkout}
            style={styles.resumeBanner}
          >
            <View style={styles.resumeLeft}>
              <View style={styles.pulseDot} />
              <View>
                <Text style={styles.resumeTitle}>WORKOUT IN PROGRESS</Text>
                <Text style={styles.resumeSubtitle}>
                  {activeSession.dayName} · Set {activeSession.currentStepIndex + 1} of{' '}
                  {activeSession.steps.length}
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Main Today's Card */}
        {isRestDay ? (
          <Card style={styles.restCard}>
            <View style={styles.restHeader}>
              <Badge label="RECOVERY DAY" variant="rest" />
              <Text style={styles.dayIndexText}>DAY {currentDayNumber} OF 7</Text>
            </View>

            <Text style={styles.restTitle}>REST & RECOVER</Text>
            <Text style={styles.restDescription}>
              Recovery is part of the program. Muscles grow and repair during rest. Stay hydrated and eat high quality protein.
            </Text>

            <View style={styles.nextWorkoutPreview}>
              <Text style={styles.nextPreviewLabel}>YOUR NEXT WORKOUT</Text>
              <Text style={styles.nextWorkoutTitle}>
                {WorkoutScheduler.getNextWorkoutDayInfo(currentDayNumber).name}
              </Text>
              <Text style={styles.nextWorkoutSub}>
                {WorkoutScheduler.getNextWorkoutDayInfo(currentDayNumber).subtitle}
              </Text>
            </View>

            <Button
              title="Complete Rest & Advance"
              variant="outline"
              size="md"
              onPress={handleAdvanceRestDay}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        ) : (
          <Card style={styles.workoutCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionCaption}>TODAY'S WORKOUT</Text>
              <Text style={styles.dayIndexText}>DAY {currentDayNumber} OF 7</Text>
            </View>

            <Text style={styles.workoutName}>{currentDayDef.name.toUpperCase()}</Text>
            <Text style={styles.workoutTarget}>{currentDayDef.targetMuscles}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="fitness-outline" size={16} color={Colors.light.textSecondary} />
                <Text style={styles.metaText}>{totalExerciseCount} exercises</Text>
              </View>
              {currentDayDef.includesAbs && (
                <View style={styles.metaItem}>
                  <Ionicons name="flash-outline" size={16} color={Colors.light.accent} />
                  <Text style={[styles.metaText, { color: Colors.light.accent }]}>+ Abs Routine</Text>
                </View>
              )}
            </View>

            <Button
              title="Start Workout"
              variant="primary"
              size="lg"
              onPress={handleStartWorkout}
              style={styles.startBtn}
            />
          </Card>
        )}

        {/* Stats Row: Streak, Weekly Consistency & Total Completed */}
        <View style={styles.statsRow}>
          <Card style={styles.statMiniCard}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
            <Text style={styles.streakLabel}>STREAK</Text>
          </Card>

          <Card style={styles.statMiniCard}>
            <Ionicons name="repeat-outline" size={20} color={Colors.light.accent} style={{ marginTop: 2 }} />
            <Text style={styles.streakNumber}>
              {Math.min(5, Math.max(0, currentDayNumber > 3 ? (currentDayNumber > 6 ? 5 : currentDayNumber - 2) : currentDayNumber - 1))}/5
            </Text>
            <Text style={styles.streakLabel}>THIS CYCLE</Text>
          </Card>

          <Card style={styles.statMiniCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.light.text} style={{ marginTop: 2 }} />
            <Text style={styles.streakNumber}>{streak.totalWorkoutsCompleted}</Text>
            <Text style={styles.streakLabel}>TOTAL</Text>
          </Card>
        </View>

        {/* Highlight Progress Section */}
        {highlightProgression && (
          <Card style={styles.progressCard} onPress={() => router.push('/(tabs)/progress')}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionCaption}>YOUR PROGRESSION</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.light.textTertiary} />
            </View>
            <View style={styles.progressBody}>
              <View>
                <Text style={styles.progressExerciseName}>
                  {highlightProgression.name}
                </Text>
                <Text style={styles.progressReps}>
                  {highlightProgression.best} reps
                </Text>
              </View>
              {highlightProgression.diff > 0 && (
                <Badge
                  label={`+${highlightProgression.diff} PR`}
                  variant="accent"
                />
              )}
            </View>
          </Card>
        )}

        {/* PDF Rules Quick Card */}
        <Card style={styles.rulesCard}>
          <Text style={styles.sectionCaption}>CORE TRAINING PRINCIPLES</Text>
          <Text style={styles.ruleItem}>• Work every set till failure (TF)</Text>
          <Text style={styles.ruleItem}>• Rest 2–4 mins between sets</Text>
          <Text style={styles.ruleItem}>• Consistency is the only hack</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  topHeader: {
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greetingLabel: {
    ...Typography.title1,
    color: Colors.light.text,
    marginTop: 2,
  },
  resumeBanner: {
    backgroundColor: Colors.light.text,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  resumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.accent,
  },
  resumeTitle: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontWeight: '800',
  },
  resumeSubtitle: {
    ...Typography.subhead,
    color: Colors.light.surface,
    marginTop: 2,
  },
  workoutCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionCaption: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    letterSpacing: 1.2,
  },
  dayIndexText: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
  },
  workoutName: {
    ...Typography.title1,
    color: Colors.light.text,
    letterSpacing: -0.5,
    marginTop: Spacing.xs,
  },
  workoutTarget: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  startBtn: {
    // Primary REPLOOP Orange is handled by Button variant="primary"
  },
  restCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  restHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  restTitle: {
    ...Typography.title2,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  restDescription: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  nextWorkoutPreview: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  nextPreviewLabel: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    marginBottom: 4,
  },
  nextWorkoutTitle: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  nextWorkoutSub: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statMiniCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  streakCard: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  workoutsCountCard: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  streakIconWrap: {
    marginBottom: 4,
  },
  streakFlame: {
    fontSize: 24,
  },
  streakNumber: {
    ...Typography.title1,
    color: Colors.light.text,
    fontWeight: '800',
  },
  streakLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  progressCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressExerciseName: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  progressReps: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderColor: Colors.light.border,
    padding: Spacing.lg,
  },
  ruleItem: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
});

