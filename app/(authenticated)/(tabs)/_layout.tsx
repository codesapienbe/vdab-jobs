import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { primary } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerBackground: () => (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        ),
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.push('/(authenticated)/chat')}
            style={styles.chatButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={primary.tealGreen} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity 
            onPress={logout} 
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={primary.tealGreen} />
          </TouchableOpacity>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: primary.tealGreen,
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          headerTitle: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="person" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Job Search',
          headerTitle: 'Job Search',
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="briefcase" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'My Assignments',
          headerTitle: 'My Assignments',
          tabBarLabel: 'Assignments',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="clipboard" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Document Upload',
          headerTitle: 'Document Upload',
          tabBarLabel: 'Documents',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name="document-attach" 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'App Settings',
          headerTitle: 'App Settings',
          href: null, // This will hide the tab from the tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(233, 236, 239, 0.3)',
  },
  headerTitle: {
    color: primary.tealGreen,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  chatButton: {
    marginLeft: 16,
    backgroundColor: 'rgba(0, 141, 151, 0.08)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 141, 151, 0.1)',
  },
  logoutButton: {
    marginRight: 16,
    backgroundColor: 'rgba(0, 141, 151, 0.08)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 141, 151, 0.1)',
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 236, 239, 0.3)',
    height: Platform.OS === 'ios' ? 88 : 60,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
}); 