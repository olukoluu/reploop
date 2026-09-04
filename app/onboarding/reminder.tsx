import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Header } from '../../src/components/ui/Header';
import { NotificationService } from '../../src/services/notifications/notification-service';

const TIME_OPTIONS = [
  { label: '6:00 AM', hour: 6, minute: 0, desc: 'Early Morning' },
  { label: '7:00 AM', hour: 7, minute: 0, desc: 'Morning Routine' },
  { label: '8:30 AM', hour: 8, minute: 30, desc: 'Before Work' },
  { label: '12:30 PM', hour: 12, minute: 30, desc: 'Lunch Break' },
  { label: '5:30 PM', hour: 17, minute: 30, desc: 'After Work' },
  { label: '7:00 PM', hour: 19, minute: 0, desc: 'Evening Session' },
];

export default function OnboardingReminderScreen() {
  const params = useLocalSearchParams<{ equipment?: string }>();
  const [selectedTime, setSelectedTime] = useState({ hour: 7, minute: 0 });

  const handleContinue = async () => {
    // Gracefully ask for notification permissions on user interaction
    if (Platform.OS !== 'web') {
      await NotificationService.requestPermissions();
    }

    router.push({
      pathname: '/onboarding/start-day',
      params: {
        equipment: params.equipment,
        reminderHour: selectedTime.hour.toString(),
        reminderMinute: selectedTime.minute.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Workout Reminder"
        subtitle="When should we notify you to train?"
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Text style={styles.helperText}>
          Consistency is the only "hack". Setting a predictable daily time helps build the habit.
        </Text>

        <View style={styles.grid}>
          {TIME_OPTIONS.map((opt) => {
            const isSelected =
              selectedTime.hour === opt.hour && selectedTime.minute === opt.minute;

            return (
              <TouchableOpacity
                key={`${opt.hour}:${opt.minute}`}
                activeOpacity={0.7}
                onPress={() => setSelectedTime({ hour: opt.hour, minute: opt.minute })}
                style={[styles.timeCard, isSelected && styles.timeCardSelected]}
              >
                <Ionicons
                  name={opt.hour < 12 ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={isSelected ? Colors.light.accent : Colors.light.textSecondary}
                  style={styles.timeIcon}
                />
                <Text style={[styles.timeLabel, isSelected && styles.timeLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.timeDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          variant="primary"
          size="lg"
          onPress={handleContinue}
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  helperText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  timeCard: {
    width: '47.5%',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  timeCardSelected: {
    borderColor: Colors.light.accent,
    backgroundColor: Colors.light.accentLight,
  },
  timeIcon: {
    marginBottom: Spacing.xs,
  },
  timeLabel: {
    ...Typography.headline,
    color: Colors.light.text,
    marginBottom: 2,
  },
  timeLabelSelected: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  timeDesc: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});

