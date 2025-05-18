/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Primary Palette (Brand Inspired)
export const primary = {
  tealGreen: '#008D97', // Main brand color
  mediumTealStart: '#00A3A3', // Gradient start
  mediumTealEnd: '#007B8D', // Gradient end
  brightBlue: '#007BFF', // Button highlight
  white: '#FFFFFF',
  lightGray: '#F5F8FA', // Backgrounds
};

// Neutral/Secondary Palette
export const neutral = {
  charcoal: '#333333', // Main text
  slateGray: '#4F4F4F',
  cloudGray: '#E9ECEF',
  paleBlueGray: '#D6EAF8',
};

// Accent Palette
export const accent = {
  orange: '#E95E1F', // Highlight (In de kijker)
  lightCyan: '#E0F7FA',
  pastelBlue: '#B3E5FC',
  successGreen: '#28A745',
  errorRed: '#DC3545', // Added for error states
  warningYellow: '#FFC107', // Added for warning states
};

// Semantic colors (for specific UI elements)
export const semantic = {
  text: neutral.charcoal,
  textSecondary: neutral.slateGray,
  background: primary.lightGray,
  card: primary.white,
  border: neutral.cloudGray,
  notification: accent.orange,
  success: accent.successGreen,
  error: accent.errorRed,
  warning: accent.warningYellow,
  link: primary.brightBlue,
  highlight: accent.orange,
};

// Theme object for light mode
export const lightTheme = {
  ...primary,
  ...neutral,
  ...accent,
  ...semantic,
};

// Theme object for dark mode (adjust colors for dark mode)
export const darkTheme = {
  ...primary,
  ...neutral,
  ...accent,
  background: '#1A1A1A',
  card: '#2A2A2A',
  text: primary.white,
  textSecondary: neutral.cloudGray,
  border: '#3A3A3A',
};

export default {
  light: lightTheme,
  dark: darkTheme,
};
