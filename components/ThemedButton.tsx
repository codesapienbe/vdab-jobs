import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'success' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ThemedButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme, isDark } = useAppTheme();
  
  // Get button style based on variant
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      ...(fullWidth && styles.fullWidth),
    };
    
    // Adjust styles based on variant
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.tealGreen,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.brightBlue,
        };
      case 'tertiary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.tealGreen,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: theme.successGreen,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: theme.errorRed,
        };
      default:
        return baseStyle;
    }
  };
  
  // Get text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'tertiary':
        return theme.tealGreen;
      case 'outline':
        return theme.tealGreen;
      default:
        return theme.white;
    }
  };
  
  // Combine all styles
  const buttonStyle = {
    ...getButtonStyle(),
    ...(disabled && styles.disabled),
    ...style,
  };
  
  const textColor = getTextColor();
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, sizeTextStyles[size], { color: textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Size variations
const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
};

// Text size variations
const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: 14,
  },
  large: {
    fontSize: 16,
  },
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

export default ThemedButton; 