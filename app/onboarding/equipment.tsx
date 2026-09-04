import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Header } from '../../src/components/ui/Header';
import { AVAILABLE_EQUIPMENT } from '../../src/data/equipment';
import { EquipmentId } from '../../src/types/equipment';

export default function OnboardingEquipmentScreen() {
  // Default common household items selected
  const [selected, setSelected] = useState<EquipmentId[]>([
    'chair',
    'table',
    'towel',
    'school_bag',
  ]);

  const toggleEquipment = (id: EquipmentId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Navigate to reminder screen passing equipment params
    router.push({
      pathname: '/onboarding/reminder',
      params: { equipment: JSON.stringify(selected) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Equipment"
        subtitle="What gear or household items do you have?"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.tipText}>
          The routine uses simple household items. If you have a pull-up bar, we'll automatically unlock full vertical pull movements!
        </Text>

        {AVAILABLE_EQUIPMENT.map((item) => {
          const isSelected = selected.includes(item.id);
          const iconName = item.iconName as keyof typeof Ionicons.glyphMap;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleEquipment(item.id)}
              style={[
                styles.itemCard,
                isSelected && styles.itemCardSelected,
              ]}
            >
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isSelected ? Colors.light.accent : Colors.light.textSecondary}
                />
              </View>

              <View style={styles.itemTextContainer}>
                <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                  {item.name}
                </Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>

              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  tipText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemCardSelected: {
    borderColor: Colors.light.accent,
    backgroundColor: Colors.light.accentLight,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconCircleSelected: {
    backgroundColor: Colors.light.accentLight,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...Typography.headline,
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemNameSelected: {
    color: Colors.light.text,
  },
  itemDescription: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
});

