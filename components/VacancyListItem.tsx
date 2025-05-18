import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VacancySearchResult } from '../services/types/api.types';

interface VacancyListItemProps {
  vacancy: VacancySearchResult;
  onPress?: () => void;
}

const VacancyListItem: React.FC<VacancyListItemProps> = ({ vacancy, onPress }) => {
  const defaultOnPress = () => {
    router.push({
      pathname: '/vacancy/[id]' as any,
      params: { id: vacancy.id }
    });
  };

  const handlePress = onPress || defaultOnPress;

  // Format the publication date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Placeholder image if company logo is not available
  const placeholderImage = 'https://via.placeholder.com/60x60?text=VDAB';

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: vacancy.company.logoUrl || placeholderImage }}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{vacancy.title}</Text>
        <Text style={styles.company}>{vacancy.company.name}</Text>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.location}>
            {vacancy.location.postalCode} {vacancy.location.city}
          </Text>
        </View>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.date}>{formatDate(vacancy.publicationDate)}</Text>
        {vacancy.expired && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredText}>Expired</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#008D97', // Main teal brand color
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333', // Charcoal from neutral palette
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#4F4F4F', // Slate Gray from neutral palette
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    color: '#4F4F4F', // Slate Gray from neutral palette
    marginLeft: 4,
  },
  metaContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  expiredBadge: {
    backgroundColor: '#E95E1F', // Orange from accent palette
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default VacancyListItem; 