import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/utils/i18n';

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Helper function to get random user profile picture
const getRandomUserProfilePicture = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    return data.results[0].picture.large;
  } catch (error) {
    console.error('Error fetching random user picture:', error);
    return 'https://randomuser.me/api/portraits/lego/1.jpg'; // Fallback image
  }
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user?.profilePicture) {
        const randomPicture = await getRandomUserProfilePicture();
        setProfilePicture(randomPicture);
      }
    };
    fetchProfilePicture();
  }, [user?.profilePicture]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={48} color="#ccc" />
          <Text style={styles.errorText}>{t('userNotFound')}</Text>
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
            source={{ uri: profilePicture }}
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
        <CollapsibleSection title={t('employmentStatus')} initiallyExpanded>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('currentStatus')}</Text>
            <Text style={styles.sectionText}>{user.employmentStatus.status}</Text>
            {user.employmentStatus.details && (
              <Text style={styles.sectionText}>{user.employmentStatus.details}</Text>
            )}
            {user.employmentStatus.currentEmployer && (
              <>
                <Text style={styles.sectionTitle}>{t('currentEmployer')}</Text>
                <Text style={styles.sectionText}>{user.employmentStatus.currentEmployer}</Text>
              </>
            )}
            {user.employmentStatus.position && (
              <>
                <Text style={styles.sectionTitle}>{t('position')}</Text>
                <Text style={styles.sectionText}>{user.employmentStatus.position}</Text>
              </>
            )}
            {user.employmentStatus.employmentSince && (
              <>
                <Text style={styles.sectionTitle}>{t('since')}</Text>
                <Text style={styles.sectionText}>
                  {formatDate(user.employmentStatus.employmentSince)}
                </Text>
              </>
            )}
          </View>
        </CollapsibleSection>

        {/* Contact Information */}
        <CollapsibleSection title={t('contactInfo')}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('email')}</Text>
            <Text style={styles.sectionText}>{user.email}</Text>
            {user.phoneNumber && (
              <>
                <Text style={styles.sectionTitle}>{t('phone')}</Text>
                <Text style={styles.sectionText}>{user.phoneNumber}</Text>
              </>
            )}
            {user.address && (
              <>
                <Text style={styles.sectionTitle}>{t('address')}</Text>
                <Text style={styles.sectionText}>{user.address}</Text>
              </>
            )}
          </View>
        </CollapsibleSection>
        
        {/* Skills */}
        <CollapsibleSection title={t('skills')}>
          <View style={styles.skillsContainer}>
            {user.skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{skill.level}</Text>
              </View>
            ))}
          </View>
        </CollapsibleSection>
        
        {/* Education */}
        <CollapsibleSection title={t('education')}>
          <View style={styles.educationContainer}>
            {user.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.educationInstitution}>{edu.institution}</Text>
                <Text style={styles.educationDegree}>{edu.degree} in {edu.field}</Text>
                <Text style={styles.educationYear}>{edu.graduationYear}</Text>
              </View>
            ))}
          </View>
        </CollapsibleSection>
        
        {/* Job Preferences */}
        <CollapsibleSection title={t('jobPreferences')}>
          <View style={styles.preferenceContainer}>
            {user.jobPreferences.desiredRole && (
              <>
                <Text style={styles.preferenceTitle}>{t('desiredRole')}</Text>
                <Text style={styles.preferenceText}>{user.jobPreferences.desiredRole}</Text>
              </>
            )}
            
            {user.jobPreferences.desiredSalary && (
              <>
                <Text style={styles.preferenceTitle}>{t('desiredSalary')}</Text>
                <Text style={styles.preferenceText}>{user.jobPreferences.desiredSalary}</Text>
              </>
            )}
            
            {user.jobPreferences.desiredLocation && (
              <>
                <Text style={styles.preferenceTitle}>{t('preferredLocation')}</Text>
                <Text style={styles.preferenceText}>{user.jobPreferences.desiredLocation}</Text>
              </>
            )}
            
            {user.jobPreferences.workType && (
              <>
                <Text style={styles.preferenceTitle}>{t('workType')}</Text>
                <Text style={styles.preferenceText}>{user.jobPreferences.workType}</Text>
              </>
            )}
            
            {user.jobPreferences.availableFrom && (
              <>
                <Text style={styles.preferenceTitle}>{t('availableFrom')}</Text>
                <Text style={styles.preferenceText}>{formatDate(user.jobPreferences.availableFrom)}</Text>
              </>
            )}
          </View>
        </CollapsibleSection>
        
        {/* Languages */}
        <CollapsibleSection title={t('languages')}>
          <View style={styles.languageContainer}>
            {user.languages.map((lang, index) => (
              <View key={index} style={styles.languageItem}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.languageLevel}>{lang.level}</Text>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* Favorited Jobs */}
        <CollapsibleSection title={t('favoritedJobs')}>
          <View style={styles.jobContainer}>
            {user.favoritedJobs.length > 0 ? (
              user.favoritedJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobItem}
                  onPress={() => router.push(`/job/${job.id}`)}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobDate}>{formatDate(job.dateAdded)}</Text>
                  </View>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                  <Text style={styles.jobLocation}>{job.location}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('noFavoritedJobs')}</Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/jobs')}>
                  <Text style={styles.browseButtonText}>{t('browseJobs')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CollapsibleSection>

        {/* Account Settings */}
        <CollapsibleSection title={t('accountSettings')}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="person-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>{t('editProfile')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => router.push('/(authenticated)/(tabs)/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>{t('appSettings')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>{t('notificationSettings')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>{t('privacySettings')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Ionicons name="help-circle-outline" size={22} color="#008D97" style={styles.settingIcon} />
            <Text style={styles.settingText}>{t('helpAndSupport')}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </CollapsibleSection>
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
    padding: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
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
  skillLevel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  educationContainer: {
    marginTop: 8,
  },
  educationItem: {
    marginBottom: 15,
  },
  educationInstitution: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  educationDegree: {
    fontSize: 14,
    color: '#666',
  },
  educationYear: {
    fontSize: 14,
    color: '#999',
  },
  preferenceContainer: {
    marginTop: 8,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  preferenceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  languageContainer: {
    marginTop: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  languageLevel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  jobContainer: {
    marginTop: 8,
  },
  jobItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  jobDate: {
    fontSize: 14,
    color: '#666',
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 14,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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