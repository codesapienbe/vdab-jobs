import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';

import { primary } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthenticatedLayout() {
  const colorScheme = useColorScheme();
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#008D97" />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: '',
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
      <Stack.Screen
        name="chat"
        options={{
          title: 'Chat',
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // The save function will be called from the edit profile screen
                const event = new Event('saveProfile');
                window.dispatchEvent(event);
              }}
              style={{
                backgroundColor: primary.tealGreen,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          ),
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