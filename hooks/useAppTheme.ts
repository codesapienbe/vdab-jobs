import { darkTheme, lightTheme } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

export type ThemeColors = typeof lightTheme;

export function useAppTheme() {
  // Get the color scheme from our custom hook that already has fallback to 'light'
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Select the appropriate theme
  const theme = isDark ? darkTheme : lightTheme;
  
  return {
    theme,
    isDark,
    // Helper function to get correct color for either mode
    getColor: (light: string, dark: string) => (isDark ? dark : light),
    // Function to apply alpha transparency to a hex color
    applyAlpha: (hexColor: string, alpha: number) => {
      // Default to empty string if hexColor is undefined
      if (!hexColor) return '';
      
      // Validate the alpha value
      const validAlpha = Math.max(0, Math.min(1, alpha || 0));
      // Convert alpha to hex
      const alphaHex = Math.round(validAlpha * 255).toString(16).padStart(2, '0');
      // Remove # if present and return hex with alpha
      return `${hexColor.replace('#', '')}${alphaHex}`;
    }
  };
} 