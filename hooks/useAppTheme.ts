import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../constants/Colors';

export type ThemeColors = typeof lightTheme;

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme = isDark ? darkTheme : lightTheme;
  
  return {
    theme,
    isDark,
    // Helper function to get correct color for either mode
    getColor: (light: string, dark: string) => (isDark ? dark : light),
    // Function to apply alpha transparency to a hex color
    applyAlpha: (hexColor: string, alpha: number) => {
      // Validate the alpha value
      const validAlpha = Math.max(0, Math.min(1, alpha));
      // Convert alpha to hex
      const alphaHex = Math.round(validAlpha * 255).toString(16).padStart(2, '0');
      // Remove # if present and return hex with alpha
      return `${hexColor.replace('#', '')}${alphaHex}`;
    }
  };
} 