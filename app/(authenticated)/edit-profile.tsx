import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecruitmentLoader } from '@/components/RecruitmentLoader';
import { accent, neutral, primary } from '@/constants/Colors';
import { User, useAuth } from '@/contexts/AuthContext';

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format date for input (YYYY-MM-DD)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

interface SkillItem {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface LanguageItem {
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
}

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<User | null>(null);
  const [newSkill, setNewSkill] = useState<SkillItem>({ name: '', level: 'beginner' });
  const [newEducation, setNewEducation] = useState<EducationItem>({ 
    institution: '', 
    degree: '', 
    field: '', 
    graduationYear: '' 
  });
  const [newLanguage, setNewLanguage] = useState<LanguageItem>({ name: '', level: 'A1' });
  
  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);
  
  if (!user || !formData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <RecruitmentLoader size="large" text="Loading profile data..." />
      </SafeAreaView>
    );
  }
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  // Handle nested field changes
  const handleNestedChange = (parent: keyof User, field: string, value: any) => {
    setFormData(prev => {
      if (!prev) return null;

      // Create a new object based on the parent type
      if (parent === 'employmentStatus') {
        return {
          ...prev,
          employmentStatus: {
            ...prev.employmentStatus,
            [field]: value
          }
        };
      } else if (parent === 'jobPreferences') {
        return {
          ...prev,
          jobPreferences: {
            ...prev.jobPreferences,
            [field]: value
          }
        };
      }
      
      // Fallback for any other types (shouldn't happen)
      return prev;
    });
  };
  
  // Add new skill
  const addSkill = () => {
    if (!newSkill.name.trim()) {
      Alert.alert('Error', 'Skill name cannot be empty');
      return;
    }
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skills: [...prev.skills, { ...newSkill }]
      };
    });
    
    setNewSkill({ name: '', level: 'beginner' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Delete skill
  const deleteSkill = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return {
        ...prev,
        skills: updatedSkills
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };
  
  // Add new education
  const addEducation = () => {
    if (!newEducation.institution.trim() || !newEducation.degree.trim() || 
        !newEducation.field.trim() || !newEducation.graduationYear.trim()) {
      Alert.alert('Error', 'All education fields are required');
      return;
    }
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        education: [...prev.education, { ...newEducation }]
      };
    });
    
    setNewEducation({ institution: '', degree: '', field: '', graduationYear: '' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Delete education
  const deleteEducation = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedEducation = [...prev.education];
      updatedEducation.splice(index, 1);
      return {
        ...prev,
        education: updatedEducation
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };
  
  // Add new language
  const addLanguage = () => {
    if (!newLanguage.name.trim()) {
      Alert.alert('Error', 'Language name cannot be empty');
      return;
    }
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        languages: [...prev.languages, { ...newLanguage }]
      };
    });
    
    setNewLanguage({ name: '', level: 'A1' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Delete language
  const deleteLanguage = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedLanguages = [...prev.languages];
      updatedLanguages.splice(index, 1);
      return {
        ...prev,
        languages: updatedLanguages
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) return;
      
      // In a real app, you would upload this file to a server
      // For now, we'll just use the URI
      const fileUri = result.assets[0].uri;
      
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profilePicture: fileUri
        };
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  // Save profile data
  const saveProfile = () => {
    if (!formData) return;
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    // In a real app, you would send this data to your API
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Success', 
        'Profile updated successfully',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    }, 1500);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {isSaving ? (
          <View style={styles.savingOverlay}>
            <RecruitmentLoader size="large" text="Saving your profile..." />
          </View>
        ) : null}
        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={primary.tealGreen} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <Image
              source={{ uri: formData.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleProfilePictureUpload}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                placeholder="Enter your username"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.textInput}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>LinkedIn</Text>
              <TextInput
                style={styles.textInput}
                value={formData.linkedIn}
                onChangeText={(value) => handleInputChange('linkedIn', value)}
                placeholder="Enter your LinkedIn profile URL"
                keyboardType="url"
              />
            </View>
          </View>
          
          {/* Employment Status Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment Status</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.employmentStatus.status}
                  onValueChange={(value) => handleNestedChange('employmentStatus', 'status', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Employed" value="employed" />
                  <Picker.Item label="Unemployed" value="unemployed" />
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Freelancer" value="freelancer" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Details</Text>
              <TextInput
                style={styles.textInput}
                value={formData.employmentStatus.details}
                onChangeText={(value) => handleNestedChange('employmentStatus', 'details', value)}
                placeholder="Additional details about your employment status"
              />
            </View>
            
            {formData.employmentStatus.status === 'employed' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current Employer</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.employmentStatus.currentEmployer}
                    onChangeText={(value) => handleNestedChange('employmentStatus', 'currentEmployer', value)}
                    placeholder="Enter your current employer"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Position</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.employmentStatus.position}
                    onChangeText={(value) => handleNestedChange('employmentStatus', 'position', value)}
                    placeholder="Enter your position"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Employed Since</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.employmentStatus.employmentSince ? formatDateForInput(formData.employmentStatus.employmentSince) : ''}
                    onChangeText={(value) => handleNestedChange('employmentStatus', 'employmentSince', value)}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </>
            )}
          </View>
          
          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            
            {/* Current Skills List */}
            {formData.skills.map((skill, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{skill.name}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSkill(index)}
                >
                  <Ionicons name="trash-outline" size={18} color={accent.errorRed} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Add New Skill */}
            <View style={styles.addItemContainer}>
              <View style={styles.addItemInputRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1, marginRight: 8 }]}
                  value={newSkill.name}
                  onChangeText={(value) => setNewSkill({ ...newSkill, name: value })}
                  placeholder="Skill name"
                />
                <View style={[styles.pickerContainer, { width: 150 }]}>
                  <Picker
                    selectedValue={newSkill.level}
                    onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Beginner" value="beginner" />
                    <Picker.Item label="Intermediate" value="intermediate" />
                    <Picker.Item label="Advanced" value="advanced" />
                    <Picker.Item label="Expert" value="expert" />
                  </Picker>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addSkill}
              >
                <Text style={styles.addButtonText}>Add Skill</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Education Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            
            {/* Current Education List */}
            {formData.education.map((education, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    {education.degree} in {education.field}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    {education.institution}, {education.graduationYear}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteEducation(index)}
                >
                  <Ionicons name="trash-outline" size={18} color={accent.errorRed} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Add New Education */}
            <View style={styles.addItemContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Institution</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.institution}
                  onChangeText={(value) => setNewEducation({ ...newEducation, institution: value })}
                  placeholder="Enter institution name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Degree</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.degree}
                  onChangeText={(value) => setNewEducation({ ...newEducation, degree: value })}
                  placeholder="Enter degree (e.g., Bachelor, Master)"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Field of Study</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.field}
                  onChangeText={(value) => setNewEducation({ ...newEducation, field: value })}
                  placeholder="Enter field of study"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Graduation Year</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEducation.graduationYear}
                  onChangeText={(value) => setNewEducation({ ...newEducation, graduationYear: value })}
                  placeholder="Enter graduation year"
                  keyboardType="number-pad"
                />
              </View>
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={addEducation}
              >
                <Text style={styles.addButtonText}>Add Education</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Job Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Preferences</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Desired Role</Text>
              <TextInput
                style={styles.textInput}
                value={formData.jobPreferences.desiredRole}
                onChangeText={(value) => handleNestedChange('jobPreferences', 'desiredRole', value)}
                placeholder="Enter your desired role"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Desired Salary</Text>
              <TextInput
                style={styles.textInput}
                value={formData.jobPreferences.desiredSalary}
                onChangeText={(value) => handleNestedChange('jobPreferences', 'desiredSalary', value)}
                placeholder="Enter your desired salary range"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Location</Text>
              <TextInput
                style={styles.textInput}
                value={formData.jobPreferences.desiredLocation}
                onChangeText={(value) => handleNestedChange('jobPreferences', 'desiredLocation', value)}
                placeholder="Enter your preferred location"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.jobPreferences.workType}
                  onValueChange={(value) => handleNestedChange('jobPreferences', 'workType', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Full-time" value="full-time" />
                  <Picker.Item label="Part-time" value="part-time" />
                  <Picker.Item label="Freelance" value="freelance" />
                  <Picker.Item label="Remote" value="remote" />
                  <Picker.Item label="Hybrid" value="hybrid" />
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available From</Text>
              <TextInput
                style={styles.textInput}
                value={formData.jobPreferences.availableFrom ? formatDateForInput(formData.jobPreferences.availableFrom) : ''}
                onChangeText={(value) => handleNestedChange('jobPreferences', 'availableFrom', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          
          {/* Languages Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            
            {/* Current Languages List */}
            {formData.languages.map((language, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{language.name}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {language.level === 'native' ? 'Native' : language.level}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteLanguage(index)}
                >
                  <Ionicons name="trash-outline" size={18} color={accent.errorRed} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Add New Language */}
            <View style={styles.addItemContainer}>
              <View style={styles.addItemInputRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1, marginRight: 8 }]}
                  value={newLanguage.name}
                  onChangeText={(value) => setNewLanguage({ ...newLanguage, name: value })}
                  placeholder="Language name"
                />
                <View style={[styles.pickerContainer, { width: 100 }]}>
                  <Picker
                    selectedValue={newLanguage.level}
                    onValueChange={(value) => setNewLanguage({ ...newLanguage, level: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="A1" value="A1" />
                    <Picker.Item label="A2" value="A2" />
                    <Picker.Item label="B1" value="B1" />
                    <Picker.Item label="B2" value="B2" />
                    <Picker.Item label="C1" value="C1" />
                    <Picker.Item label="C2" value="C2" />
                    <Picker.Item label="Native" value="native" />
                  </Picker>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addLanguage}
              >
                <Text style={styles.addButtonText}>Add Language</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: neutral.cloudGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: neutral.charcoal,
  },
  backButton: {
    padding: 4,
  },
  saveButton: {
    backgroundColor: primary.tealGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: primary.white,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: primary.tealGreen,
  },
  changePhotoButton: {
    backgroundColor: primary.brightBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: primary.white,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
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
    color: neutral.charcoal,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: neutral.slateGray,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: neutral.cloudGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: neutral.cloudGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: neutral.charcoal,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: neutral.slateGray,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  addItemContainer: {
    marginTop: 8,
  },
  addItemInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: primary.tealGreen,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: primary.white,
    fontWeight: '600',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
}); 