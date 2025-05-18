import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { neutral, primary } from '../constants/Colors';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'accent' | 'highlight';

interface ThemedCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
  borderLeft?: boolean;
  borderColor?: string;
}

const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  title,
  variant = 'default',
  style,
  onPress,
  borderLeft = true,
  borderColor,
}) => {
  // Get card style based on variant
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
    };
    
    // Apply styles based on variant
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...styles.elevated,
        };
      case 'outlined':
        return {
          ...baseStyle,
          ...styles.outlined,
        };
      case 'accent':
        return {
          ...baseStyle,
          ...styles.accent,
        };
      case 'highlight':
        return {
          ...baseStyle,
          ...styles.highlight,
        };
      default:
        return baseStyle;
    }
  };
  
  // Apply border left if needed
  const getBorderLeftStyle = (): ViewStyle => {
    if (!borderLeft) return {};
    
    return {
      borderLeftWidth: 4,
      borderLeftColor: borderColor || primary.tealGreen,
    };
  };
  
  // Combine all styles
  const cardStyle = {
    ...getCardStyle(),
    ...getBorderLeftStyle(),
    ...style,
  };
  
  // Card content
  const CardContent = () => (
    <View style={cardStyle}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
  
  // Return either a touchable or regular card
  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <CardContent />
    </TouchableOpacity>
  ) : (
    <CardContent />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: primary.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: neutral.cloudGray,
  },
  accent: {
    backgroundColor: neutral.paleBlueGray,
  },
  highlight: {
    backgroundColor: primary.white,
    borderWidth: 1,
    borderColor: primary.tealGreen,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: neutral.charcoal,
    marginBottom: 8,
  },
});

export default ThemedCard; 