import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Initial route is set to index which redirects to login
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client for React Query with defensive configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => {
        // Handle potential undefined attemptIndex
        const attempt = attemptIndex || 0;
        return Math.min(1000 * Math.pow(2, attempt), 30000);
      },
    },
  },
});

// Auth guard component
function AuthRoot() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  // Our modified hook now has a default fallback to 'light'
  const colorScheme = useColorScheme();
  
  // Load fonts
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Ensure we always have a valid theme value
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NavigationThemeProvider value={theme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(authenticated)" />
              <Stack.Screen name="search" />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="auto" />
          </NavigationThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
