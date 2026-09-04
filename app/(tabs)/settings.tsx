import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { useWorkout } from '../../src/context/WorkoutContext';
import { AVAILABLE_EQUIPMENT } from '../../src/data/equipment';
import { WORKOUT_DAYS } from '../../src/data/program';
import { EquipmentId } from '../../src/types/equipment';
import { SettingsRepository } from '../../src/services/storage/settings-repository';
import { WorkoutRepository } from '../../src/services/storage/workout-repository';

export default function SettingsScreen() {
  const { settings, updateEquipment, updateReminderTime, setCurrentCycleDay, refreshData } =
    useWorkout();

  const selectedEquipment = settings?.selectedEquipment || [];
  const currentCycleDay = settings?.currentCycleDay || 1;

  const toggleEquipment = async (id: EquipmentId) => {
    const next = selectedEquipment.includes(id)
      ? selectedEquipment.filter((item) => item !== id)
      : [...selectedEquipment, id];
    await updateEquipment(next);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Workout Data',
      'Are you sure you want to reset your workouts, history, and onboarding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await SettingsRepository.clearAll();
            await WorkoutRepository.clearAll();
            await refreshData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>SETTINGS</Text>
          <Text style={styles.subtitle}>Preferences & routine settings</Text>
        </View>

        {/* 7-Day Cycle Position */}
        <Text style={styles.sectionTitle}>CURRENT CYCLE POSITION</Text>
        <Card style={styles.cycleCard}>
          <Text style={styles.cardDesc}>
            Today is active as <Text style={{ fontWeight: '700' }}>Day {currentCycleDay}: {WORKOUT_DAYS[currentCycleDay]?.name}</Text>. You can manually adjust your position in the 7-day routine here.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cycleRow}>
            {Object.values(WORKOUT_DAYS).map((d) => {
              const isSelected = currentCycleDay === d.dayNumber;
              return (
                <TouchableOpacity
                  key={d.dayNumber}
                  activeOpacity={0.7}
                  onPress={() => setCurrentCycleDay(d.dayNumber)}
                  style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                >
                  <Text style={[styles.dayPillNum, isSelected && styles.dayPillNumSelected]}>
                    Day {d.dayNumber}
                  </Text>
                  <Text style={[styles.dayPillName, isSelected && styles.dayPillNameSelected]}>
                    {d.name.replace(' Day', '')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        {/* Equipment Configuration */}
        <Text style={styles.sectionTitle}>EQUIPMENT & VARIATIONS</Text>
        <Card style={styles.equipmentCard}>
          {AVAILABLE_EQUIPMENT.map((item, idx) => {
            const isSelected = selectedEquipment.includes(item.id);
            const iconName = item.iconName as keyof typeof Ionicons.glyphMap;

            return (
              <View
                key={item.id}
                style={[
                  styles.eqRow,
                  idx !== AVAILABLE_EQUIPMENT.length - 1 && styles.eqRowBorder,
                ]}
              >
                <View style={styles.eqLeft}>
                  <Ionicons name={iconName} size={20} color={Colors.light.text} />
                  <View style={styles.eqTextWrap}>
                    <Text style={styles.eqName}>{item.name}</Text>
                    <Text style={styles.eqDesc}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={isSelected}
                  onValueChange={() => toggleEquipment(item.id)}
                  trackColor={{ false: Colors.light.border, true: Colors.light.accent }}
                  thumbColor={Colors.light.surface}
                />
              </View>
            );
          })}
        </Card>

        {/* Rest Timer Preference (PDF Rule: 2-4 minutes) */}
        <Text style={styles.sectionTitle}>DEFAULT REST DURATION (2–4 MINS)</Text>
        <Card style={styles.restSettingCard}>
          <Text style={styles.cardDesc}>
            Coach Awwal prescribes resting 2 to 4 minutes between sets for maximum muscle fiber recovery.
          </Text>
          <View style={styles.restPresetRow}>
            {[
              { label: '2:00', sec: 120 },
              { label: '2:30', sec: 150 },
              { label: '3:00', sec: 180 },
              { label: '4:00', sec: 240 },
            ].map((preset) => {
              const isSelected = (settings?.restDurationSeconds || 120) === preset.sec;
              return (
                <TouchableOpacity
                  key={preset.sec}
                  activeOpacity={0.7}
                  onPress={async () => {
                    await SettingsRepository.saveSettings({ restDurationSeconds: preset.sec });
                    await refreshData();
                  }}
                  style={[styles.restPresetBtn, isSelected && styles.restPresetBtnSelected]}
                >
                  <Text
                    style={[
                      styles.restPresetText,
                      isSelected && styles.restPresetTextSelected,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* PDF Rules Reference */}
        <Text style={styles.sectionTitle}>COACH AWWAL PDF RULES</Text>
        <Card style={styles.rulesCard}>
          <Text style={styles.ruleItem}>1. Work every set till FAILURE!</Text>
          <Text style={styles.ruleItem}>2. Rest 2–4 mins between sets.</Text>
          <Text style={styles.ruleItem}>3. Control the movement, use proper form.</Text>
          <Text style={styles.ruleItem}>4. Do not rush the workout.</Text>
          <Text style={styles.ruleItem}>5. Do your warm-ups before each workout.</Text>
          <Text style={styles.ruleItem}>6. Do not eat heavy right before training.</Text>
          <Text style={styles.ruleItem}>7. No phones in between sets.</Text>
          <Text style={styles.ruleItem}>8. Stay hydrated!</Text>
        </Card>

        {/* Reset App */}
        <View style={styles.resetWrap}>
          <Button
            title="Reset All Data"
            variant="ghost"
            textStyle={{ color: Colors.light.error }}
            onPress={handleResetData}
          />
        </View>
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
  sectionTitle: {
    ...Typography.caption,
    color: Colors.light.textTertiary,
    letterSpacing: 1.2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cycleCard: {
    padding: Spacing.lg,
  },
  cardDesc: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  cycleRow: {
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  dayPill: {
    backgroundColor: Colors.light.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dayPillSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  dayPillNum: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontSize: 10,
  },
  dayPillNumSelected: {
    color: Colors.light.textInverse,
  },
  dayPillName: {
    ...Typography.headline,
    fontSize: 13,
    color: Colors.light.text,
    marginTop: 2,
  },
  dayPillNameSelected: {
    color: Colors.light.textInverse,
  },
  equipmentCard: {
    padding: Spacing.lg,
  },
  restSettingCard: {
    padding: Spacing.lg,
  },
  restPresetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  restPresetBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  restPresetBtnSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  restPresetText: {
    ...Typography.headline,
    fontSize: 14,
    color: Colors.light.text,
  },
  restPresetTextSelected: {
    color: Colors.light.textInverse,
  },
  eqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  eqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  eqLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
    gap: Spacing.md,
  },
  eqTextWrap: {
    flex: 1,
  },
  eqName: {
    ...Typography.headline,
    fontSize: 15,
    color: Colors.light.text,
  },
  eqDesc: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
  },
  ruleItem: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    paddingVertical: 4,
    lineHeight: 20,
  },
  resetWrap: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
});

