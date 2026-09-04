import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'subtle' | 'accent' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'subtle':
        return {
          backgroundColor: Colors.light.surfaceSubtle,
          borderColor: Colors.light.border,
        };
      case 'accent':
        return {
          backgroundColor: Colors.light.accentLight,
          borderColor: Colors.light.accent,
        };
      case 'highlight':
        return {
          backgroundColor: Colors.light.surfaceHighlight,
          borderColor: Colors.light.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: Colors.light.surface,
          borderColor: Colors.light.border,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.base, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.subtle,
  },
});
