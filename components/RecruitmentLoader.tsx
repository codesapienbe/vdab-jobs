import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Colors, { accent, primary } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface RecruitmentLoaderProps {
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  text?: string;
}

export const RecruitmentLoader = ({ 
  style, 
  size = 'medium', 
  showText = true,
  text = 'Matching in progress...'
}: RecruitmentLoaderProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Determine dimensions based on size prop
  const getDimension = () => {
    switch(size) {
      case 'small': return 120;
      case 'large': return 200;
      default: return 160;
    }
  };
  
  const dimension = getDimension();
  
  // Animated values for our elements
  const profileScale = useSharedValue(0.6);
  const profileOpacity = useSharedValue(0);
  const connectionScale = useSharedValue(0);
  const connectionOpacity = useSharedValue(0);
  const jobScale = useSharedValue(0.6);
  const jobOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);
  
  // Skill bubbles animations
  const skill1Opacity = useSharedValue(0);
  const skill1Position = useSharedValue(0);
  const skill2Opacity = useSharedValue(0);
  const skill2Position = useSharedValue(0);
  const skill3Opacity = useSharedValue(0);
  const skill3Position = useSharedValue(0);
  
  // Success sparkle animations
  const sparkle1Scale = useSharedValue(0);
  const sparkle1Opacity = useSharedValue(0);
  const sparkle2Scale = useSharedValue(0);
  const sparkle2Opacity = useSharedValue(0);
  const sparkle3Scale = useSharedValue(0);
  const sparkle3Opacity = useSharedValue(0);
  
  // Profile animation
  const profileStyle = useAnimatedStyle(() => ({
    transform: [{ scale: profileScale.value }],
    opacity: profileOpacity.value,
  }));
  
  // Connection animation style
  const connectionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: connectionScale.value }],
    opacity: connectionOpacity.value,
  }));
  
  // Job animation style
  const jobStyle = useAnimatedStyle(() => ({
    transform: [{ scale: jobScale.value }],
    opacity: jobOpacity.value,
  }));
  
  // Pulse animation style
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  
  // Skill bubbles styles
  const skill1Style = useAnimatedStyle(() => ({
    opacity: skill1Opacity.value,
    transform: [
      { translateY: skill1Position.value },
      { translateX: -10 }
    ],
  }));
  
  const skill2Style = useAnimatedStyle(() => ({
    opacity: skill2Opacity.value,
    transform: [
      { translateY: skill2Position.value },
    ],
  }));
  
  const skill3Style = useAnimatedStyle(() => ({
    opacity: skill3Opacity.value,
    transform: [
      { translateY: skill3Position.value },
      { translateX: 10 }
    ],
  }));
  
  // Sparkle animations
  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1Opacity.value,
    transform: [{ scale: sparkle1Scale.value }],
  }));
  
  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2Opacity.value,
    transform: [{ scale: sparkle2Scale.value }],
  }));
  
  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3Opacity.value,
    transform: [{ scale: sparkle3Scale.value }],
  }));
  
  useEffect(() => {
    // Profile animation
    profileOpacity.value = withTiming(1, { duration: 600 });
    profileScale.value = withSequence(
      withTiming(0.8, { duration: 600 }),
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    
    // Connection animation (appears after profile)
    connectionOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    connectionScale.value = withDelay(600, withTiming(1, { duration: 400 }));
    
    // Job animation (appears after connection)
    jobOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    jobScale.value = withSequence(
      withDelay(1000, withTiming(0.8, { duration: 600 })),
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    
    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withDelay(1200, withTiming(1.15, { duration: 1200, easing: Easing.out(Easing.ease) })),
        withTiming(1, { duration: 1200, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
    
    pulseOpacity.value = withRepeat(
      withSequence(
        withDelay(1200, withTiming(0.4, { duration: 1200 })),
        withTiming(0.1, { duration: 1200 })
      ),
      -1,
      true
    );
    
    // Skill bubbles animations
    const startSkillAnimations = () => {
      // First skill
      skill1Opacity.value = withTiming(1, { duration: 400 });
      skill1Position.value = withSequence(
        withTiming(-20, { duration: 1500, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: 500 }),
      );
      
      // Second skill (delayed)
      skill2Opacity.value = withDelay(300, withTiming(1, { duration: 400 }));
      skill2Position.value = withSequence(
        withDelay(300, withTiming(-20, { duration: 1500, easing: Easing.out(Easing.cubic) })),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: 200 }),
      );
      
      // Third skill (more delayed)
      skill3Opacity.value = withDelay(600, withTiming(1, { duration: 400 }));
      skill3Position.value = withSequence(
        withDelay(600, withTiming(-20, { duration: 1500, easing: Easing.out(Easing.cubic) })),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: 0 }),
      );
      
      // After skills reach top, fade them out
      skill1Opacity.value = withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 400 })
      );
      
      skill2Opacity.value = withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0, { duration: 400 })
      );
      
      skill3Opacity.value = withSequence(
        withTiming(1, { duration: 2100 }),
        withTiming(0, { duration: 400 })
      );
    };
    
    // Sparkle animations
    const startSparkleAnimations = () => {
      // First sparkle
      sparkle1Opacity.value = withSequence(
        withDelay(2500, withTiming(1, { duration: 200 })),
        withTiming(0, { duration: 800 })
      );
      sparkle1Scale.value = withSequence(
        withDelay(2500, withTiming(1, { duration: 200 })),
        withTiming(1.5, { duration: 800 })
      );
      
      // Second sparkle
      sparkle2Opacity.value = withSequence(
        withDelay(2700, withTiming(1, { duration: 200 })),
        withTiming(0, { duration: 800 })
      );
      sparkle2Scale.value = withSequence(
        withDelay(2700, withTiming(1, { duration: 200 })),
        withTiming(1.5, { duration: 800 })
      );
      
      // Third sparkle
      sparkle3Opacity.value = withSequence(
        withDelay(2900, withTiming(1, { duration: 200 })),
        withTiming(0, { duration: 800 })
      );
      sparkle3Scale.value = withSequence(
        withDelay(2900, withTiming(1, { duration: 200 })),
        withTiming(1.5, { duration: 800 })
      );
    };
    
    // Start animations and repeat them
    const animationLoop = () => {
      startSkillAnimations();
      startSparkleAnimations();
      
      // Schedule the next animation loop
      setTimeout(animationLoop, 4000);
    };
    
    // Start the first animation loop after a delay
    const initialTimeout = setTimeout(animationLoop, 1200);
    
    return () => {
      // Cleanup animations and timeouts
      clearTimeout(initialTimeout);
      cancelAnimation(profileScale);
      cancelAnimation(profileOpacity);
      cancelAnimation(connectionScale);
      cancelAnimation(connectionOpacity);
      cancelAnimation(jobScale);
      cancelAnimation(jobOpacity);
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      cancelAnimation(skill1Opacity);
      cancelAnimation(skill1Position);
      cancelAnimation(skill2Opacity);
      cancelAnimation(skill2Position);
      cancelAnimation(skill3Opacity);
      cancelAnimation(skill3Position);
      cancelAnimation(sparkle1Scale);
      cancelAnimation(sparkle1Opacity);
      cancelAnimation(sparkle2Scale);
      cancelAnimation(sparkle2Opacity);
      cancelAnimation(sparkle3Scale);
      cancelAnimation(sparkle3Opacity);
    };
  }, []);
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.loaderContainer, { width: dimension, height: dimension }]}>
        {/* Pulse background */}
        <Animated.View style={[styles.pulse, pulseStyle, { borderColor: colors.tealGreen }]} />
        
        {/* Profile icon */}
        <Animated.View style={[styles.iconBase, styles.profileIcon, profileStyle]}>
          <View style={styles.profileHead} />
          <View style={styles.profileBody} />
        </Animated.View>
        
        {/* Skill bubbles flowing from profile to job */}
        <Animated.View style={[styles.skillBubble, styles.skill1, skill1Style]}>
          <ThemedText style={styles.skillText}>JS</ThemedText>
        </Animated.View>
        <Animated.View style={[styles.skillBubble, styles.skill2, skill2Style]}>
          <ThemedText style={styles.skillText}>UX</ThemedText>
        </Animated.View>
        <Animated.View style={[styles.skillBubble, styles.skill3, skill3Style]}>
          <ThemedText style={styles.skillText}>API</ThemedText>
        </Animated.View>
        
        {/* Connection line with gradient */}
        <Animated.View style={[styles.connectionContainer, connectionStyle]}>
          <LinearGradient
            colors={[primary.mediumTealStart, primary.brightBlue]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.connectionGradient}
          />
        </Animated.View>
        
        {/* Job icon */}
        <Animated.View style={[styles.iconBase, styles.jobIcon, jobStyle]}>
          <View style={styles.briefcase} />
          <View style={styles.briefcaseHandle} />
        </Animated.View>
        
        {/* Matching success sparkles */}
        <Animated.View style={[styles.sparkle, styles.sparkle1, sparkle1Style]} />
        <Animated.View style={[styles.sparkle, styles.sparkle2, sparkle2Style]} />
        <Animated.View style={[styles.sparkle, styles.sparkle3, sparkle3Style]} />
      </View>
      
      {showText && (
        <ThemedText style={styles.loadingText}>{text}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 2,
    opacity: 0.3,
  },
  iconBase: {
    width: 40,
    height: 40,
    backgroundColor: primary.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileIcon: {
    position: 'absolute',
    left: '25%',
    backgroundColor: primary.mediumTealStart,
  },
  profileHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: primary.white,
    marginBottom: 3,
  },
  profileBody: {
    width: 18,
    height: 10,
    borderRadius: 5,
    backgroundColor: primary.white,
  },
  connectionContainer: {
    position: 'absolute',
    width: '30%',
    height: 4,
  },
  connectionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  jobIcon: {
    position: 'absolute',
    right: '25%',
    backgroundColor: accent.orange,
  },
  briefcase: {
    width: 18,
    height: 12,
    borderRadius: 2,
    backgroundColor: primary.white,
  },
  briefcaseHandle: {
    position: 'absolute',
    top: 8,
    width: 10,
    height: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: primary.white,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  skillBubble: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: accent.lightCyan,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skill1: {
    top: '50%',
    left: '36%',
  },
  skill2: {
    top: '50%',
    left: '50%',
  },
  skill3: {
    top: '50%',
    left: '64%',
  },
  skillText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: primary.tealGreen,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: accent.warningYellow,
    borderRadius: 4,
  },
  sparkle1: {
    top: '40%',
    left: '50%',
  },
  sparkle2: {
    top: '55%',
    left: '45%',
  },
  sparkle3: {
    top: '45%',
    left: '55%',
  },
}); 