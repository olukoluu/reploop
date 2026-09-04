import { Redirect } from 'expo-router';
import { useWorkout } from '../src/context/WorkoutContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../src/constants/theme';

export default function Index() {
  const { settings, isLoading } = useWorkout();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
      </View>
    );
  }

  if (settings && settings.isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

