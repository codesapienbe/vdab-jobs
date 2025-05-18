import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonPlaceholderProps {
  style?: ViewStyle;
}

export default function SkeletonPlaceholder({ style }: SkeletonPlaceholderProps) {
  const [fadeAnim] = React.useState(new Animated.Value(0.3));

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        style,
        {
          opacity: fadeAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#EAEAEA',
    height: 100,
    borderRadius: 8,
  },
}); 