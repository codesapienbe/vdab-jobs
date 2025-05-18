import React, { createContext, useContext } from 'react';
import { useAppTheme } from '../hooks/useAppTheme';

// Define the context type
interface ThemeContextType {
  theme: any; // Use a more flexible type to accommodate both theme objects
  isDark: boolean;
  getColor: (light: string, dark: string) => string;
  applyAlpha: (hexColor: string, alpha: number) => string;
}

// Create a context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider = (props: { children: React.ReactNode }) => {
  // Handle case where props might be undefined
  if (!props) return null;
  
  const { children } = props;
  const themeValues = useAppTheme();
  
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 