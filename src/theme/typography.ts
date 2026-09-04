import { TextStyle } from 'react-native';

export const typography = {
  // Display typography (Major screen & day titles, brand header)
  display: {
    fontSize: 30,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  displayLarge: {
    fontSize: 34,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1,
    lineHeight: 40,
  },

  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
    lineHeight: 28,
  },

  // Body typography
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },

  // Label & metadata
  label: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.8,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  subhead: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 19,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 17,
  },

  // Metric typography (reps, streak, timers, PRs)
  metricHero: {
    fontSize: 54,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1.5,
    lineHeight: 62,
  },
  metricLarge: {
    fontSize: 36,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  metricMedium: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  timerDisplay: {
    fontSize: 60,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -2,
    lineHeight: 68,
  },

  // Legacy mappings for backwards-compatibility
  heroNumber: {
    fontSize: 54,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1.5,
  },
  timerNumber: {
    fontSize: 60,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -2,
  },
  title1: {
    fontSize: 30,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  title3: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
  callout: {
    fontSize: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  caption: {
    fontSize: 11,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
} as const;

export type TypographyType = typeof typography;

