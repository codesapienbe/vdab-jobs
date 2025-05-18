import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonPlaceholder from '../../components/SkeletonPlaceholder';
import VacancyListItem from '../../components/VacancyListItem';
import { useJobDomains } from '../../hooks/useJobDomains';
import { useInfiniteVacancies } from '../../hooks/useVacancies';
import { JobDomain, VacancySearchParams, VacancySearchResult } from '../../services/types/api.types';

export default function SearchScreen() {
  // Search state
  const [searchText, setSearchText] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<VacancySearchParams>({
    page: 1,
    limit: 15,
    postalCode: '9000', // Priority: 9000 as per requirements
    distance: 25,
    sort: 'relevance',
  });

  // Fetch job domains for filters
  const { data: jobDomains, isLoading: loadingDomains } = useJobDomains();

  // Fetch vacancies using infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isError,
    error,
  } = useInfiniteVacancies(searchParams);

  // Handler for search button
  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    setSearchParams((prev) => ({
      ...prev,
      q: searchText,
      page: 1, // Reset to first page on new search
    }));
  }, [searchText]);

  // Handler for filter changes
  const handleFilterChange = useCallback(
    (key: keyof VacancySearchParams, value: any) => {
      setSearchParams((prev) => ({
        ...prev,
        [key]: value,
        page: 1, // Reset to first page on filter change
      }));
    },
    []
  );

  // Handler for end reached (pagination)
  const handleEndReached = useCallback(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Flatten the data for FlatList
  const flattenedData = React.useMemo(() => {
    return data?.pages?.flatMap((page) => page.items) || [];
  }, [data]);

  // Render a vacancy item
  const renderVacancyItem = useCallback(
    ({ item }: { item: VacancySearchResult }) => <VacancyListItem vacancy={item} />,
    []
  );

  // Render loading skeletons
  const renderSkeletons = () => (
    <View style={styles.skeletonsContainer}>
      {[...Array(5)].map((_, index) => (
        <SkeletonPlaceholder key={index} style={styles.skeleton} />
      ))}
    </View>
  );

  // Render no results message
  const renderEmptyComponent = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="search-off" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No vacancies found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
      </View>
    );
  };

  // Render error message
  const renderErrorComponent = () => {
    if (!isError) return null;
    
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#E74C3C" />
        <Text style={styles.errorText}>Error loading vacancies</Text>
        <Text style={styles.errorSubtext}>{error?.message || 'An unknown error occurred'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render filter section
  const renderFilters = () => {
    if (!filtersVisible) return null;
    
    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Location:</Text>
          <View style={styles.filterInputContainer}>
            <TextInput
              style={styles.filterInput}
              placeholder="Postal Code"
              value={searchParams.postalCode}
              onChangeText={(value) => handleFilterChange('postalCode', value)}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Distance:</Text>
          <View style={styles.filterInputContainer}>
            <Picker
              selectedValue={searchParams.distance}
              style={styles.picker}
              onValueChange={(value) => handleFilterChange('distance', value)}
            >
              <Picker.Item label="5 km" value={5} />
              <Picker.Item label="10 km" value={10} />
              <Picker.Item label="25 km" value={25} />
              <Picker.Item label="50 km" value={50} />
              <Picker.Item label="100 km" value={100} />
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.filterInputContainer}>
            <Picker
              selectedValue={searchParams.sort}
              style={styles.picker}
              onValueChange={(value) => handleFilterChange('sort', value)}
            >
              <Picker.Item label="Relevance" value="relevance" />
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Distance" value="distance" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Job Domain:</Text>
          <View style={styles.filterInputContainer}>
            <Picker
              selectedValue={searchParams.jobDomainId}
              style={styles.picker}
              onValueChange={(value) => handleFilterChange('jobDomainId', value)}
              enabled={!loadingDomains}
            >
              <Picker.Item label="All Domains" value="" />
              {jobDomains?.map((domain: JobDomain) => (
                <Picker.Item key={domain.id} label={domain.name} value={domain.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for jobs..."
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <MaterialIcons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltersVisible(!filtersVisible)}
        >
          <MaterialIcons name="tune" size={24} color="#3375BB" />
        </TouchableOpacity>
      </View>

      {renderFilters()}

      {isError ? (
        renderErrorComponent()
      ) : (
        <FlatList
          data={flattenedData}
          renderItem={renderVacancyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={() => (
            <Text style={styles.resultsText}>
              {data?.pages[0]?.total
                ? `Found ${data.pages[0].total} vacancies`
                : 'Search for job vacancies'}
            </Text>
          )}
          ListFooterComponent={() => 
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.loader} size="large" color="#3375BB" />
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching || false}
              onRefresh={refetch}
              colors={["#3375BB"]}
            />
          }
        />
      )}

      {isLoading && !isRefetching && renderSkeletons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#008D97', // Teal Green from primary palette
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    marginLeft: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E9ECEF', // Cloud Gray from neutral palette
  },
  filtersContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    width: 100,
    fontSize: 15,
    color: '#555',
  },
  filterInputContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E9ECEF', // Cloud Gray from neutral palette
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F5F8FA', // Light Gray from primary palette
  },
  filterInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    minHeight: '100%',
  },
  resultsText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 60,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC3545', // Error Red from accent palette
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF', // Bright Blue from primary palette
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skeletonsContainer: {
    padding: 16,
  },
  skeleton: {
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
}); 