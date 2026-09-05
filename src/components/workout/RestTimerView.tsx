import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Button } from '../ui/Button';

interface RestTimerViewProps {
  formattedTime: string;
  isPaused: boolean;
  progress: number;
  onPauseResume: () => void;
  onAdd30: () => void;
  onSubtract30: () => void;
  onSkip: () => void;
  nextExerciseName?: string;
  nextSetNumber?: number;
  nextTotalSets?: number;
  isWarmup?: boolean;
}

export const RestTimerView: React.FC<RestTimerViewProps> = ({
  formattedTime,
  isPaused,
  progress,
  onPauseResume,
  onAdd30,
  onSubtract30,
  onSkip,
  nextExerciseName,
  nextSetNumber,
  nextTotalSets,
  isWarmup,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.recoveryLabel}>RECOVER & BREATHE</Text>
        <Text style={styles.restGuideline}>PDF Rule: Rest 2–4 mins between sets</Text>
      </View>

      {/* Main Timer Display */}
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        {isPaused && (
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedBadgeText}>PAUSED</Text>
          </View>
        )}
      </View>

      {/* Progress Line */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${Math.min(100, progress * 100)}%` }]} />
      </View>

      {/* Timer Adjustment Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSubtract30}
          style={styles.timeAdjustBtn}
        >
          <Text style={styles.timeAdjustText}>-30s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPauseResume}
          style={styles.pauseResumeBtn}
        >
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={24}
            color={Colors.light.text}
          />
          <Text style={styles.pauseResumeText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAdd30}
          style={styles.timeAdjustBtn}
        >
          <Text style={styles.timeAdjustText}>+30s</Text>
        </TouchableOpacity>
      </View>

      {/* Next Up Card */}
      {nextExerciseName && (
        <View style={styles.nextUpCard}>
          <Text style={styles.nextUpLabel}>UP NEXT</Text>
          <Text style={styles.nextUpName}>{nextExerciseName}</Text>
          {isWarmup ? (
            <Text style={styles.nextUpSet}>
              {nextTotalSets && nextTotalSets > 1
                ? `Warm-up Set ${nextSetNumber} of ${nextTotalSets}`
                : 'Warm-up Set'}
            </Text>
          ) : (
            nextSetNumber != null && nextTotalSets != null && (
              <Text style={styles.nextUpSet}>
                Set {nextSetNumber} of {nextTotalSets}
              </Text>
            )
          )}
        </View>
      )}

      {/* Skip Button */}
      <View style={styles.bottomArea}>
        <Button
          title="Skip Rest"
          onPress={onSkip}
          variant="outline"
          size="lg"
          style={styles.skipButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: Colors.light.background,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  recoveryLabel: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontSize: 13,
    letterSpacing: 1.5,
  },
  restGuideline: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  timerText: {
    ...Typography.timerNumber,
    color: Colors.light.text,
    fontVariant: ['tabular-nums'],
  },
  pausedBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.light.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pausedBadgeText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontSize: 10,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.light.surfaceHighlight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.accent,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  timeAdjustBtn: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  timeAdjustText: {
    ...Typography.callout,
    fontWeight: '700',
    color: Colors.light.text,
  },
  pauseResumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  pauseResumeText: {
    ...Typography.callout,
    fontWeight: '700',
    color: Colors.light.text,
  },
  nextUpCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  nextUpLabel: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    marginBottom: 4,
  },
  nextUpName: {
    ...Typography.headline,
    color: Colors.light.text,
    textAlign: 'center',
  },
  nextUpSet: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  bottomArea: {
    marginBottom: Spacing.md,
  },
  skipButton: {
    borderColor: Colors.light.border,
  },
});

