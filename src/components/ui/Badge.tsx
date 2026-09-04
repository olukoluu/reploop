import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'accent' | 'success' | 'outline' | 'rest';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'accent':
        return { bg: Colors.light.accentLight, text: Colors.light.accent, border: Colors.light.accentLight };
      case 'success':
        return { bg: Colors.light.successLight, text: Colors.light.success, border: Colors.light.successLight };
      case 'rest':
        return { bg: Colors.light.restLight, text: Colors.light.rest, border: Colors.light.restLight };
      case 'outline':
        return { bg: 'transparent', text: Colors.light.textSecondary, border: Colors.light.border };
      case 'default':
      default:
        return { bg: Colors.light.surfaceSubtle, text: Colors.light.textSecondary, border: Colors.light.border };
    }
  };

  const { bg, text, border } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      <Text style={[styles.text, { color: text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
});

