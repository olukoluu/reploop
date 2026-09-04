import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { WorkoutSummary } from '../../src/types/progression';
import { useWorkout } from '../../src/context/WorkoutContext';

export default function WorkoutSummaryScreen() {
  const params = useLocalSearchParams<{ summaryData?: string }>();
  const { streak } = useWorkout();

  const summary: WorkoutSummary | null = useMemo(() => {
    if (!params.summaryData) return null;
    try {
      return JSON.parse(params.summaryData);
    } catch {
      return null;
    }
  }, [params.summaryData]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.celebrationArea}>
          <View style={styles.trophyCircle}>
            <Ionicons name="checkmark-sharp" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.completedCaption}>WORKOUT COMPLETE</Text>
          <Text style={styles.sessionTitle}>{summary?.dayName.toUpperCase()}</Text>
        </View>

        {/* Top Summary Metric Row */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>DURATION</Text>
            <Text style={styles.metricVal}>
              {summary ? formatDuration(summary.durationSeconds) : '0:00'}
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>TOTAL REPS</Text>
            <Text style={styles.metricVal}>{summary?.totalReps || 0}</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>STREAK</Text>
            <Text style={[styles.metricVal, { color: Colors.light.accent }]}>
              🔥 {streak.currentStreak}
            </Text>
          </Card>
        </View>

        {/* PR Celebrations if any */}
        {summary && summary.newPersonalBests.length > 0 && (
          <Card style={styles.prCelebrationCard}>
            <View style={styles.prHeader}>
              <Ionicons name="flame" size={20} color={Colors.light.accent} />
              <Text style={styles.prHeaderTitle}>NEW PERSONAL BESTS SET!</Text>
            </View>
            {summary.newPersonalBests.map((pr) => (
              <View key={pr.exerciseId} style={styles.prItem}>
                <Text style={styles.prExerciseName}>{pr.exerciseName}</Text>
                <Text style={styles.prNumbers}>
                  {pr.previousBest} → <Text style={{ fontWeight: '800', color: Colors.light.accent }}>{pr.newBest} reps</Text>
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Performance by Exercise */}
        <Text style={styles.sectionHeading}>TODAY'S PERFORMANCE</Text>
        {summary?.exercisesCompleted.map((ex) => (
          <Card key={ex.exerciseId} style={styles.exercisePerfCard}>
            <View style={styles.exTopRow}>
              <Text style={styles.exName}>{ex.exerciseName}</Text>
              {ex.isNewPR && <Badge label="NEW PR" variant="accent" />}
            </View>

            <View style={styles.setsFlow}>
              {ex.sets.map((rep, idx) => (
                <View key={idx} style={styles.setChip}>
                  <Text style={styles.setChipNum}>Set {idx + 1}</Text>
                  <Text style={styles.setChipReps}>{rep} reps</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Done Button */}
      <View style={styles.footer}>
        <Button
          title="Done"
          variant="primary"
          size="lg"
          onPress={handleDone}
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  celebrationArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  completedCaption: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    letterSpacing: 1.5,
  },
  sessionTitle: {
    ...Typography.display,
    color: Colors.light.text,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.light.textTertiary,
  },
  metricVal: {
    ...Typography.headline,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 2,
  },
  prCelebrationCard: {
    backgroundColor: Colors.light.accentLight,
    borderColor: Colors.light.accent,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  prHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  prHeaderTitle: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontWeight: '800',
  },
  prItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  prExerciseName: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
  },
  prNumbers: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  sectionHeading: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  exercisePerfCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  exTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exName: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  setsFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  setChip: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  setChipNum: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.light.textTertiary,
  },
  setChipReps: {
    ...Typography.headline,
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});

