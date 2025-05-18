import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthenticatedLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#008D97" />
          </TouchableOpacity>
        ),
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerBackTitle: '',
        headerTintColor: '#008D97',
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="job-detail"
        options={{
          headerShown: true,
          headerTitle: 'Job Details',
          presentation: 'card',
          headerBackTitle: '',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    color: '#008D97',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginRight: 16,
  },
}); 