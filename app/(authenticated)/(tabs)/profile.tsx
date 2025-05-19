import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={48} color="#ccc" />
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          
          {/* Employment Status Badge */}
          <View style={[styles.statusBadge, 
            user.employmentStatus.status === 'employed' ? styles.employedBadge : 
            user.employmentStatus.status === 'unemployed' ? styles.unemployedBadge :
            user.employmentStatus.status === 'student' ? styles.studentBadge :
            styles.freelancerBadge
          ]}>
            <Text style={styles.statusText}>
              {user.employmentStatus.status.charAt(0).toUpperCase() + user.employmentStatus.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Employment Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Status</Text>
          
          <View style={styles.statusDetail}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <Text style={styles.statusValue}>
              {user.employmentStatus.status.charAt(0).toUpperCase() + user.employmentStatus.status.slice(1)}
            </Text>
          </View>
          
          {user.employmentStatus.details && (
            <View style={styles.statusDetail}>
              <Text style={styles.statusLabel}>Details:</Text>
              <Text style={styles.statusValue}>{user.employmentStatus.details}</Text>
            </View>
          )}
          
          {user.employmentStatus.currentEmployer && (
            <View style={styles.statusDetail}>
              <Text style={styles.statusLabel}>Current Employer:</Text>
              <Text style={styles.statusValue}>{user.employmentStatus.currentEmployer}</Text>
            </View>
          )}
          
          {user.employmentStatus.position && (
            <View style={styles.statusDetail}>
              <Text style={styles.statusLabel}>Position:</Text>
              <Text style={styles.statusValue}>{user.employmentStatus.position}</Text>
            </View>
          )}
          
          {user.employmentStatus.employmentSince && (
            <View style={styles.statusDetail}>
              <Text style={styles.statusLabel}>Since:</Text>
              <Text style={styles.statusValue}>{formatDate(user.employmentStatus.employmentSince)}</Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={() => Linking.openURL(`mailto:${user.email}`)}
          >
            <Ionicons name="mail-outline" size={22} color="#008D97" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          {user.phoneNumber && (
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${user.phoneNumber}`)}
            >
              <Ionicons name="call-outline" size={22} color="#008D97" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phoneNumber}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          )}

          {user.address && (
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(user.address || '')}`)}
            >
              <Ionicons name="location-outline" size={22} color="#008D97" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          )}
          
          {user.linkedIn && (
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(user.linkedIn || '')}
            >
              <FontAwesome name="linkedin-square" size={22} color="#0077B5" style={styles.infoIcon} />
              <View>
                <Text style={styles.infoLabel}>LinkedIn</Text>
                <Text style={styles.infoValue}>View Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          
          <View style={styles.skillsContainer}>
            {user.skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <View style={styles.skillLevelContainer}>
                  <View 
                    style={[
                      styles.skillLevel, 
                      { 
                        width: skill.level === 'beginner' ? '25%' : 
                               skill.level === 'intermediate' ? '50%' : 
                               skill.level === 'advanced' ? '75%' : '100%' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.skillLevelText}>
                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          
          {user.education.map((edu, index) => (
            <View key={index} style={[styles.educationItem, index < user.education.length - 1 && styles.withBottomBorder]}>
              <View style={styles.educationHeader}>
                <Text style={styles.degreeText}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.graduationYear}>{edu.graduationYear}</Text>
              </View>
              <Text style={styles.institutionText}>{edu.institution}</Text>
            </View>
          ))}
        </View>
        
        {/* Job Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Preferences</Text>
          
          {user.jobPreferences.desiredRole && (
            <View style={styles.preferenceItem}>
              <MaterialCommunityIcons name="briefcase-outline" size={20} color="#008D97" style={styles.preferenceIcon} />
              <Text style={styles.preferenceLabel}>Desired Role:</Text>
              <Text style={styles.preferenceValue}>{user.jobPreferences.desiredRole}</Text>
            </View>
          )}
          
          {user.jobPreferences.desiredSalary && (
            <View style={styles.preferenceItem}>
              <MaterialCommunityIcons name="cash" size={20} color="#008D97" style={styles.preferenceIcon} />
              <Text style={styles.preferenceLabel}>Desired Salary:</Text>
              <Text style={styles.preferenceValue}>{user.jobPreferences.desiredSalary}</Text>
            </View>
          )}
          
          {user.jobPreferences.desiredLocation && (
            <View style={styles.preferenceItem}>
              <Ionicons name="location-outline" size={20} color="#008D97" style={styles.preferenceIcon} />
              <Text style={styles.preferenceLabel}>Preferred Location:</Text>
              <Text style={styles.preferenceValue}>{user.jobPreferences.desiredLocation}</Text>
            </View>
          )}
          
          {user.jobPreferences.workType && (
            <View style={styles.preferenceItem}>
              <MaterialCommunityIcons name="office-building-outline" size={20} color="#008D97" style={styles.preferenceIcon} />
              <Text style={styles.preferenceLabel}>Work Type:</Text>
              <Text style={styles.preferenceValue}>
                {user.jobPreferences.workType.charAt(0).toUpperCase() + user.jobPreferences.workType.slice(1)}
              </Text>
            </View>
          )}
          
          {user.jobPreferences.availableFrom && (
            <View style={styles.preferenceItem}>
              <Ionicons name="calendar-outline" size={20} color="#008D97" style={styles.preferenceIcon} />
              <Text style={styles.preferenceLabel}>Available From:</Text>
              <Text style={styles.preferenceValue}>{formatDate(user.jobPreferences.availableFrom)}</Text>
            </View>
          )}
        </View>
        
        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          
          {user.languages.map((language, index) => (
            <View key={index} style={[styles.languageItem, index < user.languages.length - 1 && styles.withBottomBorder]}>
              <Text style={styles.languageName}>{language.name}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>
                  {language.level === 'native' ? 'Native' : language.level}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="person-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/(authenticated)/(tabs)/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="help-circle-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#008D97',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  employedBadge: {
    backgroundColor: '#DCFCE7',
  },
  unemployedBadge: {
    backgroundColor: '#FFE2E5',
  },
  studentBadge: {
    backgroundColor: '#E0F2FE',
  },
  freelancerBadge: {
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statusDetail: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillItem: {
    marginBottom: 14,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  skillLevelContainer: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  skillLevel: {
    height: '100%',
    backgroundColor: '#008D97',
    borderRadius: 4,
  },
  skillLevelText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  educationItem: {
    paddingVertical: 12,
  },
  withBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  degreeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  graduationYear: {
    fontSize: 14,
    color: '#666',
  },
  institutionText: {
    fontSize: 14,
    color: '#666',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceIcon: {
    marginRight: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
    width: 140,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  levelBadge: {
    backgroundColor: '#E9F5F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#008D97',
    fontSize: 12,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 14,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
}); 