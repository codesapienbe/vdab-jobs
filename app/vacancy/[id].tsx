import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import VacancyListItem from '../../components/VacancyListItem';
import { useSimilarVacancies, useVacancyDetails } from '../../hooks/useVacancies';

export default function VacancyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: vacancy, isLoading, error } = useVacancyDetails(id);
  const { data: similarVacancies } = useSimilarVacancies(id, 5);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3375BB" />
      </View>
    );
  }

  if (error || !vacancy) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error ? `Error: ${error.message}` : 'Vacancy not found'}
        </Text>
      </View>
    );
  }

  // Format the publication date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handle apply button press
  const handleApply = () => {
    if (vacancy.applicationUrl) {
      Linking.openURL(vacancy.applicationUrl);
    } else if (vacancy.applicationEmail) {
      Linking.openURL(`mailto:${vacancy.applicationEmail}`);
    } else if (vacancy.applicationPhone) {
      Linking.openURL(`tel:${vacancy.applicationPhone}`);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vacancy Details',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Vacancy header */}
        <View style={styles.header}>
          <View style={styles.companyContainer}>
            <Image
              source={{ uri: vacancy.company.logoUrl || 'https://via.placeholder.com/80x80?text=VDAB' }}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.title}>{vacancy.title}</Text>
              <Text style={styles.company}>{vacancy.company.name}</Text>
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={16} color="#666" />
                <Text style={styles.location}>
                  {vacancy.location.postalCode} {vacancy.location.city}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.date}>
            Published: {formatDate(vacancy.publicationDate)}
          </Text>
        </View>

        {/* Vacancy details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{vacancy.description}</Text>
        </View>

        {/* Requirements */}
        {vacancy.requirements && vacancy.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {vacancy.requirements.map((requirement, index) => (
              <View key={index} style={styles.listItem}>
                <MaterialIcons name="check-circle" size={18} color="#3375BB" />
                <Text style={styles.listItemText}>{requirement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Contract details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Details</Text>
          <View style={styles.detailsGrid}>
            {vacancy.contractType && (
              <View style={styles.detailItem}>
                <MaterialIcons name="work" size={18} color="#3375BB" />
                <Text style={styles.detailText}>{vacancy.contractType}</Text>
              </View>
            )}
            {vacancy.workRegime && (
              <View style={styles.detailItem}>
                <MaterialIcons name="schedule" size={18} color="#3375BB" />
                <Text style={styles.detailText}>{vacancy.workRegime}</Text>
              </View>
            )}
            {vacancy.experienceLevel && (
              <View style={styles.detailItem}>
                <MaterialIcons name="trending-up" size={18} color="#3375BB" />
                <Text style={styles.detailText}>{vacancy.experienceLevel}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Similar vacancies */}
        {similarVacancies && similarVacancies.items && similarVacancies.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Vacancies</Text>
            {similarVacancies.items.map((item) => (
              <VacancyListItem key={item.id} vacancy={item} />
            ))}
          </View>
        )}

        {/* Application info */}
        {(vacancy.applicationUrl || vacancy.applicationEmail || vacancy.applicationPhone) && (
          <View style={styles.applyContainer}>
            <Text style={styles.applyButton} onPress={handleApply}>
              Apply Now
            </Text>
            {vacancy.applicationDeadline && (
              <Text style={styles.deadlineText}>
                Apply before: {formatDate(vacancy.applicationDeadline)}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  companyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  companyInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  applyContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  applyButton: {
    backgroundColor: '#3375BB',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  deadlineText: {
    fontSize: 14,
    color: '#E74C3C',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
}); 