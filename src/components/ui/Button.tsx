import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore if haptics unsupported
    }
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
      case 'accent':
        return {
          backgroundColor: Colors.light.accent,
          borderColor: Colors.light.accent,
        };
      case 'secondary':
        return {
          backgroundColor: Colors.light.surface,
          borderColor: Colors.light.border,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: Colors.light.border,
          borderWidth: 1.5,
        };
      case 'danger':
        return {
          backgroundColor: Colors.light.error,
          borderColor: Colors.light.error,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'accent':
      case 'danger':
        return Colors.light.textInverse;
      case 'secondary':
      case 'outline':
        return Colors.light.text;
      case 'ghost':
        return Colors.light.textSecondary;
      default:
        return Colors.light.textInverse;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.sm, paddingHorizontal: 14, borderRadius: BorderRadius.md };
      case 'md':
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg };
      case 'lg':
      default:
        return { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'sm' && styles.textSm,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    ...Typography.headline,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  textSm: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
});
