import { useColorScheme as reactNativeUseColorScheme } from 'react-native';

/**
 * A wrapper around React Native's useColorScheme that provides a fallback value
 * and handles potential undefined return values.
 */
export function useColorScheme() {
  // Get the system color scheme
  const colorScheme = reactNativeUseColorScheme();
  
  // Return the color scheme or default to 'light' if it's undefined
  return colorScheme || 'light';
}
