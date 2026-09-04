import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { useWorkout } from '../../src/context/WorkoutContext';
import { EXERCISES } from '../../src/data/exercises';
import { ExerciseProgression } from '../../src/types/progression';

export default function ProgressScreen() {
  const { streak, progressions } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseProgression | null>(null);

  // Total PRs achieved across all exercises
  const totalPRCount = Object.values(progressions).filter(
    (p) => p.history.length > 1 && p.allTimeBest > p.previousBest
  ).length;

  const exerciseList = Object.values(EXERCISES);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>YOUR PROGRESS</Text>
          <Text style={styles.subtitle}>Consistency and progressive overload</Text>
        </View>

        {/* 3 Metric Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{streak.totalWorkoutsCompleted}</Text>
            <Text style={styles.statLabel}>WORKOUTS</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalPRCount}</Text>
            <Text style={styles.statLabel}>PRs SET</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.light.accent }]}>
              {streak.currentStreak}
            </Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </Card>
        </View>

        {/* Exercises Progression List */}
        <Text style={styles.sectionTitle}>EXERCISE TRACKING</Text>

        {exerciseList.map((exercise) => {
          const prog = progressions[exercise.id];
          const hasLogged = !!prog && prog.history.length > 0;
          const bestRep = prog?.allTimeBest || 0;
          const prevBest = prog?.previousBest || 0;
          const diff = prevBest > 0 ? bestRep - prevBest : 0;

          return (
            <Card
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => {
                if (hasLogged && prog) {
                  setSelectedExercise(prog);
                }
              }}
            >
              <View style={styles.exerciseLeft}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.targetMuscles}>{exercise.targetMuscles.join(' · ')}</Text>
              </View>

              <View style={styles.exerciseRight}>
                {hasLogged ? (
                  <View style={styles.repsDisplay}>
                    <Text style={styles.repsNumber}>{bestRep} reps</Text>
                    {diff > 0 ? (
                      <Text style={styles.prDiffText}>↑ {diff} PR</Text>
                    ) : (
                      <Text style={styles.repsSub}>Best Set</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>No logs yet</Text>
                )}
                {hasLogged && (
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.light.textTertiary}
                    style={{ marginLeft: Spacing.sm }}
                  />
                )}
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Drill-down Detail Modal */}
      {selectedExercise && (
        <Modal
          animationType="slide"
          presentationStyle="pageSheet"
          visible={!!selectedExercise}
          onRequestClose={() => setSelectedExercise(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedExercise.exerciseName}</Text>
                <Text style={styles.modalSub}>Progression & History</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedExercise(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {/* Best & Previous Cards */}
              <View style={styles.modalStatsRow}>
                <Card style={styles.modalStatCard}>
                  <Text style={styles.modalStatCaption}>ALL-TIME BEST</Text>
                  <Text style={styles.modalStatBig}>{selectedExercise.allTimeBest} reps</Text>
                </Card>
                <Card style={styles.modalStatCard}>
                  <Text style={styles.modalStatCaption}>PREVIOUS BEST</Text>
                  <Text style={styles.modalStatBig}>
                    {selectedExercise.previousBest > 0
                      ? `${selectedExercise.previousBest} reps`
                      : '—'}
                  </Text>
                </Card>
              </View>

              {/* Progression Bar Visuals */}
              <Text style={styles.modalSectionTitle}>SESSION PROGRESSION</Text>
              <Card style={styles.chartCard}>
                {selectedExercise.history.map((hist, idx) => {
                  const maxBest = Math.max(
                    1,
                    ...selectedExercise.history.map((h) => h.bestRep)
                  );
                  const barWidthPct = Math.round((hist.bestRep / maxBest) * 100);
                  const dateFormatted = new Date(hist.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <View key={hist.sessionId + idx} style={styles.chartRow}>
                      <Text style={styles.chartDate}>{dateFormatted}</Text>
                      <View style={styles.barContainer}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${barWidthPct}%`,
                              backgroundColor:
                                hist.bestRep === selectedExercise.allTimeBest
                                  ? Colors.light.accent
                                  : '#111113',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barValue}>{hist.bestRep}r</Text>
                    </View>
                  );
                })}
              </Card>

              {/* Set by Set Breakdown */}
              <Text style={styles.modalSectionTitle}>LOGGED SESSIONS</Text>
              {[...selectedExercise.history].reverse().map((h, i) => (
                <Card key={h.sessionId + i} style={styles.historySetCard}>
                  <View style={styles.historySetTop}>
                    <Text style={styles.historySetDate}>
                      {new Date(h.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    <Badge label={`${h.totalReps} total reps`} variant="default" />
                  </View>
                  <Text style={styles.historySetDetail}>
                    Sets: {h.reps.join(' reps, ')} reps
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
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
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title1,
    color: Colors.light.text,
  },
  subtitle: {
    ...Typography.subhead,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.title1,
    fontWeight: '800',
    color: Colors.light.text,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  exerciseLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  exerciseName: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  targetMuscles: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  exerciseRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repsDisplay: {
    alignItems: 'flex-end',
  },
  repsNumber: {
    ...Typography.headline,
    fontWeight: '700',
    color: Colors.light.text,
  },
  prDiffText: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontWeight: '800',
    fontSize: 11,
    marginTop: 2,
  },
  repsSub: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    fontSize: 10,
  },
  noDataText: {
    ...Typography.footnote,
    color: Colors.light.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    ...Typography.title2,
    color: Colors.light.text,
  },
  modalSub: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: Spacing.xl,
  },
  modalStatsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalStatCard: {
    flex: 1,
    padding: Spacing.lg,
  },
  modalStatCaption: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    marginBottom: 4,
  },
  modalStatBig: {
    ...Typography.title2,
    fontWeight: '800',
    color: Colors.light.text,
  },
  modalSectionTitle: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chartCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartDate: {
    ...Typography.footnote,
    width: 60,
    color: Colors.light.textSecondary,
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.light.surfaceSubtle,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: Spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barValue: {
    ...Typography.footnote,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
    color: Colors.light.text,
  },
  historySetCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  historySetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historySetDate: {
    ...Typography.headline,
    fontSize: 14,
    color: Colors.light.text,
  },
  historySetDetail: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
  },
});

