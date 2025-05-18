import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.usernameText}>@{user.username}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Contact Information</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phoneNumber || 'Not provided'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user.address || 'Not provided'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Account Information</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>User ID</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Account Type</Text>
                <Text style={styles.infoValue}>Job Seeker</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>June 2023</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Job Preferences</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Job Type</Text>
                <Text style={styles.infoValue}>Full-time, Part-time</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Preferred Location</Text>
                <Text style={styles.infoValue}>Gent, Belgium</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={20} color="#666" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Industry</Text>
                <Text style={styles.infoValue}>Information Technology</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#008D97',
    marginBottom: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008D97',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
}); 