import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.light.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="reminder" />
      <Stack.Screen name="start-day" />
    </Stack>
  );
}

