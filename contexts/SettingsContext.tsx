import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define the Settings type
interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: number;
  currency: string;
}

// Define the SettingsContext type
interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  updateFontSize: (fontSize: number) => Promise<void>;
  updateCurrency: (currency: string) => Promise<void>;
  resetSettings: () => Promise<void>;
  resetCache: () => Promise<void>;
  getEffectiveTheme: () => 'light' | 'dark';
}

// Default settings
const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  fontSize: 16,
  currency: 'EUR',
};

// Create the context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateTheme: () => Promise.resolve(),
  updateLanguage: () => Promise.resolve(),
  updateFontSize: () => Promise.resolve(),
  updateCurrency: () => Promise.resolve(),
  resetSettings: () => Promise.resolve(),
  resetCache: () => Promise.resolve(),
  getEffectiveTheme: () => 'light',
});

// Storage keys
const SETTINGS_STORAGE_KEY = 'app_settings';
const CACHE_DATA_KEY = 'app_cache';

// Create the SettingsProvider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const deviceColorScheme = useColorScheme();

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          
          // Handle possible legacy string font size values
          if (parsedSettings.fontSize && typeof parsedSettings.fontSize === 'string') {
            // Convert 'small', 'medium', 'large' to numbers
            switch (parsedSettings.fontSize) {
              case 'small':
                parsedSettings.fontSize = 12;
                break;
              case 'medium':
                parsedSettings.fontSize = 16;
                break;
              case 'large':
                parsedSettings.fontSize = 20;
                break;
              default:
                parsedSettings.fontSize = 16; // Default to medium size
            }
          }
          
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage
  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Update theme
  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    const newSettings = { ...settings, theme };
    await saveSettings(newSettings);
  };

  // Update language
  const updateLanguage = async (language: string) => {
    const newSettings = { ...settings, language };
    await saveSettings(newSettings);
  };

  // Update font size
  const updateFontSize = async (fontSize: number) => {
    const newSettings = { ...settings, fontSize };
    await saveSettings(newSettings);
  };

  // Update currency
  const updateCurrency = async (currency: string) => {
    const newSettings = { ...settings, currency };
    await saveSettings(newSettings);
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    await saveSettings(defaultSettings);
  };

  // Reset application cache
  const resetCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_DATA_KEY);
    } catch (error) {
      console.error('Failed to reset cache:', error);
    }
  };

  // Get the effective theme based on system or user preference
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'system') {
      return deviceColorScheme === 'dark' ? 'dark' : 'light';
    }
    return settings.theme;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateTheme,
        updateLanguage,
        updateFontSize,
        updateCurrency,
        resetSettings,
        resetCache,
        getEffectiveTheme,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the SettingsContext
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 