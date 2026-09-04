import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Header } from '../../src/components/ui/Header';
import { WORKOUT_DAYS } from '../../src/data/program';
import { useWorkout } from '../../src/context/WorkoutContext';
import { EquipmentId } from '../../src/types/equipment';

export default function OnboardingStartDayScreen() {
  const params = useLocalSearchParams<{
    equipment?: string;
    reminderHour?: string;
    reminderMinute?: string;
  }>();

  const { completeOnboarding } = useWorkout();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const equipment: EquipmentId[] = params.equipment
        ? JSON.parse(params.equipment)
        : ['chair', 'table', 'towel', 'school_bag'];

      const reminderTime = {
        hour: params.reminderHour ? parseInt(params.reminderHour, 10) : 7,
        minute: params.reminderMinute ? parseInt(params.reminderMinute, 10) : 0,
      };

      await completeOnboarding(equipment, reminderTime, selectedDay);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Starting Day"
        subtitle="Where are you in the 7-day cycle today?"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.helperText}>
          Select which day of the routine you want to do today. The app will sequence through the cycle automatically from here.
        </Text>

        {Object.values(WORKOUT_DAYS).map((day) => {
          const isSelected = selectedDay === day.dayNumber;
          const isRest = day.type === 'REST';

          return (
            <TouchableOpacity
              key={day.dayNumber}
              activeOpacity={0.7}
              onPress={() => setSelectedDay(day.dayNumber)}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                isRest && styles.dayCardRest,
              ]}
            >
              <View style={[styles.dayBadge, isSelected && styles.dayBadgeSelected]}>
                <Text style={[styles.dayBadgeText, isSelected && styles.dayBadgeTextSelected]}>
                  {day.dayNumber}
                </Text>
              </View>

              <View style={styles.dayInfo}>
                <View style={styles.dayTitleRow}>
                  <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                    {day.name}
                  </Text>
                  {isRest && (
                    <View style={styles.restPill}>
                      <Text style={styles.restPillText}>REST</Text>
                    </View>
                  )}
                  {day.includesAbs && (
                    <View style={styles.absPill}>
                      <Text style={styles.absPillText}>+ ABS</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.daySubtitle}>{day.subtitle}</Text>
              </View>

              <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Start REPLOOP"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          onPress={handleFinish}
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
    paddingBottom: Spacing.xl,
  },
  helperText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dayCardSelected: {
    borderColor: Colors.light.accent,
    backgroundColor: Colors.light.accentLight,
  },
  dayCardRest: {
    backgroundColor: Colors.light.surfaceSubtle,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  dayBadgeSelected: {
    backgroundColor: Colors.light.accent,
  },
  dayBadgeText: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  dayBadgeTextSelected: {
    color: Colors.light.textInverse,
  },
  dayInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dayName: {
    ...Typography.headline,
    color: Colors.light.text,
  },
  dayNameSelected: {
    color: Colors.light.text,
  },
  daySubtitle: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
  },
  restPill: {
    backgroundColor: Colors.light.restLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  restPillText: {
    ...Typography.caption,
    color: Colors.light.rest,
    fontSize: 9,
  },
  absPill: {
    backgroundColor: Colors.light.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  absPillText: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontSize: 9,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.light.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.accent,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});

