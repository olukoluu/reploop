import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

export const Colors = {
  light: {
    background: colors.background,
    surface: colors.surface,
    surfaceSubtle: colors.surfaceSubtle,
    surfaceHighlight: colors.surfaceHighlight,
    border: colors.border,
    borderFocus: colors.borderFocus,
    text: colors.text,
    textSecondary: colors.textSecondary,
    textTertiary: colors.textMuted,
    textMuted: colors.textMuted,
    textInverse: colors.textInverse,
    accent: colors.primary,
    accentDark: colors.primaryDark,
    accentLight: colors.accentLight,
    accentMuted: colors.accentMuted,
    success: colors.success,
    successLight: colors.successLight,
    error: colors.error,
    errorLight: colors.errorLight,
    warning: colors.warning,
    warningLight: colors.warningLight,
    rest: colors.rest,
    restLight: colors.restLight,
    card: colors.surface,
    cardBorder: colors.border,
    divider: colors.divider,
  },
  dark: {
    background: '#09090B',
    surface: '#141418',
    surfaceSubtle: '#1C1C22',
    surfaceHighlight: '#26262E',
    border: '#27272F',
    borderFocus: '#FFFFFF',
    text: '#F8F8FA',
    textSecondary: '#A0A0AA',
    textTertiary: '#71717A',
    textMuted: '#52525B',
    textInverse: '#09090B',
    accent: colors.primary,
    accentDark: colors.primaryDark,
    accentLight: '#2C150A',
    accentMuted: colors.accentMuted,
    success: colors.success,
    successLight: '#06281E',
    error: colors.error,
    errorLight: '#2A0E0E',
    warning: colors.warning,
    warningLight: '#2B1E05',
    rest: '#94A3B8',
    restLight: '#18202F',
    card: '#141418',
    cardBorder: '#27272F',
    divider: '#27272F',
  },
};

export const Spacing = spacing;
export const Typography = typography;
export const BorderRadius = radii;
export const Shadows = shadows;

export * from '../theme';
