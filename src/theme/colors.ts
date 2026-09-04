export const colors = {
  // Brand colors
  primary: '#FF5A00', // REPLOOP Orange
  primaryDark: '#E64D00', // Secondary pressed/active orange
  accent: '#FF5A00',
  accentLight: '#FFF3EC',
  accentMuted: '#FF8A50',

  // Neutrals
  background: '#F8F8F6', // Primary application background (60%)
  surface: '#FFFFFF', // Surfaces, cards, inputs (30%)
  surfaceSubtle: '#F1F1EE', // Subdued background surfaces
  surfaceHighlight: '#E8E8E4',

  // Typography colors
  text: '#111111', // Primary text
  textSecondary: '#6B6B6B', // Secondary text
  textMuted: '#969696', // Muted/tertiary text
  textInverse: '#FFFFFF',

  // Structural borders & dividers
  border: '#E6E6E3',
  borderFocus: '#FF5A00',
  divider: '#EEEEEB',

  // Semantic
  success: '#22A06B',
  successLight: '#E8F6F0',
  error: '#D64545',
  errorLight: '#FDF0F0',
  warning: '#D98B00',
  warningLight: '#FDF6E8',

  // Recovery / Rest
  rest: '#6B6B6B',
  restLight: '#F1F1EE',
} as const;

export type ColorsType = typeof colors;

