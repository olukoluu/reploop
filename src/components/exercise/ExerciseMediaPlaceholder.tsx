import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Exercise } from '../../types/exercise';

interface ExerciseMediaPlaceholderProps {
  exercise: Exercise;
  style?: ViewStyle;
}

export const ExerciseMediaPlaceholder: React.FC<ExerciseMediaPlaceholderProps> = ({
  exercise,
  style,
}) => {
  const iconName = (exercise.media?.placeholderIcon || 'fitness-outline') as keyof typeof Ionicons.glyphMap;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={40} color={Colors.light.accent} />
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.dot} />
        <Text style={styles.formTag}>PROPER FORM & MOVEMENT</Text>
      </View>
      <Text style={styles.musclesText}>
        Target: {exercise.targetMuscles.join(' · ')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    backgroundColor: '#16161A',
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#26262E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#383842',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accent,
    marginRight: 6,
  },
  formTag: {
    ...Typography.caption,
    color: '#A0A0AA',
    fontSize: 10,
  },
  musclesText: {
    ...Typography.subhead,
    color: '#F8F8FA',
    fontWeight: '600',
  },
});

