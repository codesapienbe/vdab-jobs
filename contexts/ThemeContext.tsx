import React, { createContext, useContext } from 'react';
import { ThemeColors, useAppTheme } from '../hooks/useAppTheme';

// Define the context type
interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  getColor: (light: string, dark: string) => string;
  applyAlpha: (hexColor: string, alpha: number) => string;
}

// Create a context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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