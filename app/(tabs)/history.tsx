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
import { useWorkout } from '../../src/context/WorkoutContext';
import { WorkoutSession } from '../../src/types/session';

export default function HistoryScreen() {
  const { completedSessions } = useWorkout();
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>HISTORY</Text>
          <Text style={styles.subtitle}>Log of completed training sessions</Text>
        </View>

        {completedSessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={Colors.light.textTertiary} />
            <Text style={styles.emptyTitle}>No Completed Workouts Yet</Text>
            <Text style={styles.emptySub}>
              Start your first session on the Today tab to start building your training history.
            </Text>
          </Card>
        ) : (
          completedSessions.map((session) => {
            const completedDate = new Date(session.completedAt || session.startedAt);
            const dateStr = completedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = completedDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            // Group sets by exercise
            const exerciseMap: Record<string, { name: string; reps: number[] }> = {};
            for (const set of session.sets) {
              if (!exerciseMap[set.exerciseId]) {
                exerciseMap[set.exerciseId] = { name: set.exerciseName, reps: [] };
              }
              exerciseMap[set.exerciseId].reps.push(set.reps);
            }

            const exerciseNames = Object.values(exerciseMap).map((e) => e.name);

            return (
              <Card
                key={session.id}
                style={styles.sessionCard}
                onPress={() => setSelectedSession(session)}
              >
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.sessionDate}>{dateStr}</Text>
                    <Text style={styles.sessionDayName}>{session.dayName.toUpperCase()}</Text>
                  </View>
                  <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.durationText}>{formatDuration(session.durationSeconds)}</Text>
                  </View>
                </View>

                <Text style={styles.exerciseSummaryText} numberOfLines={2}>
                  {exerciseNames.join(' · ')}
                </Text>

                <View style={styles.cardBottom}>
                  <Text style={styles.setCountText}>
                    {session.sets.length} total sets logged
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.light.textTertiary} />
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Full Workout Record Inspection Modal */}
      {selectedSession && (
        <Modal
          animationType="slide"
          presentationStyle="pageSheet"
          visible={!!selectedSession}
          onRequestClose={() => setSelectedSession(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedSession.dayName}</Text>
                <Text style={styles.modalSub}>
                  {new Date(selectedSession.completedAt || selectedSession.startedAt).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedSession(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalMetaRow}>
                <Card style={styles.modalMetaCard}>
                  <Text style={styles.metaLabel}>DURATION</Text>
                  <Text style={styles.metaVal}>
                    {formatDuration(selectedSession.durationSeconds)}
                  </Text>
                </Card>
                <Card style={styles.modalMetaCard}>
                  <Text style={styles.metaLabel}>SETS LOGGED</Text>
                  <Text style={styles.metaVal}>{selectedSession.sets.length}</Text>
                </Card>
                <Card style={styles.modalMetaCard}>
                  <Text style={styles.metaLabel}>TOTAL REPS</Text>
                  <Text style={styles.metaVal}>
                    {selectedSession.sets.reduce((sum, s) => sum + s.reps, 0)}
                  </Text>
                </Card>
              </View>

              <Text style={styles.modalSectionHeading}>EXERCISE PERFORMANCE</Text>

              {/* Grouped by Exercise */}
              {(() => {
                const grouped: Record<string, { name: string; sets: typeof selectedSession.sets }> = {};
                for (const set of selectedSession.sets) {
                  if (!grouped[set.exerciseId]) {
                    grouped[set.exerciseId] = { name: set.exerciseName, sets: [] };
                  }
                  grouped[set.exerciseId].sets.push(set);
                }

                return Object.entries(grouped).map(([exId, group]) => (
                  <Card key={exId} style={styles.exerciseDetailCard}>
                    <Text style={styles.detailExName}>{group.name}</Text>
                    <View style={styles.setsList}>
                      {group.sets.map((s) => (
                        <View key={s.id} style={styles.setRow}>
                          <Text style={styles.setRowLabel}>
                            {s.isWarmup ? 'Warm-up Set' : `Set ${s.setNumber}`}
                          </Text>
                          <Text style={styles.setRowReps}>{s.reps} reps</Text>
                        </View>
                      ))}
                    </View>
                  </Card>
                ));
              })()}
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
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.headline,
    color: Colors.light.text,
    marginTop: Spacing.md,
  },
  emptySub: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  sessionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  sessionDate: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
  },
  sessionDayName: {
    ...Typography.headline,
    color: Colors.light.text,
    marginTop: 2,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  durationText: {
    ...Typography.footnote,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  exerciseSummaryText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.sm,
  },
  setCountText: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
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
  modalMetaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  modalMetaCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  metaLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
  metaVal: {
    ...Typography.headline,
    color: Colors.light.text,
    marginTop: 2,
  },
  modalSectionHeading: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  exerciseDetailCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  detailExName: {
    ...Typography.headline,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  setsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.xs,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  setRowLabel: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  setRowReps: {
    ...Typography.headline,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
});

