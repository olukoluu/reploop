import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Colors} from '../src/constants/theme';
import { WorkoutProvider } from '../src/context/WorkoutContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: Colors.light.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen
            name="workout/active"
            options={{
              headerShown: false,
              gestureEnabled: false,
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen
            name="workout/summary"
            options={{
              headerShown: false,
              gestureEnabled: false,
              presentation: 'fullScreenModal',
            }}
          />
        </Stack>
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}

