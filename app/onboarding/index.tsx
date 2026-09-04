import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';

export default function OnboardingWelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>CALISTHENICS & PROGRESSION</Text>
        </View>

        <Text style={styles.brandTitle}>REPLOOP</Text>

        <View style={styles.taglineBlock}>
          <Text style={styles.tagline}>Train.</Text>
          <Text style={styles.tagline}>Track.</Text>
          <Text style={[styles.tagline, styles.accentTagline]}>Repeat.</Text>
        </View>

        <Text style={styles.description}>
          A structured 7-day home workout routine focused on training to failure, tracking real performance, and progressive overload.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          variant="primary"
          size="lg"
          onPress={() => router.push('/onboarding/equipment')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.light.accentLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.light.accent,
    fontWeight: '700',
  },
  brandTitle: {
    ...Typography.title3,
    color: Colors.light.textSecondary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  taglineBlock: {
    marginBottom: Spacing.xl,
  },
  tagline: {
    ...Typography.heroNumber,
    color: Colors.light.text,
    lineHeight: 64,
  },
  accentTagline: {
    color: Colors.light.accent,
  },
  description: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    maxWidth: '90%',
    lineHeight: 24,
  },
  footer: {
    paddingVertical: Spacing.xl,
  },
});

