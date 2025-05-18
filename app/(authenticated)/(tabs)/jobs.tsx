import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Export mock jobs data for use in other screens
export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Full Stack Developer',
    company: 'TechCorp',
    location: 'Gent, Belgium',
    type: 'Full-time',
    salary: '€3,500 - €4,500/month',
    posted: '2023-06-01',
    description: 'Looking for an experienced Full Stack Developer to join our team. Skills required: React, Node.js, TypeScript, and PostgreSQL.',
    requirements: ['3+ years of experience', 'Bachelor degree in CS or similar', 'Fluent in English'],
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'Antwerp, Belgium',
    type: 'Full-time',
    salary: '€3,200 - €4,200/month',
    posted: '2023-06-05',
    description: 'Join our design team to create amazing user experiences for our clients. Experience with Figma and Adobe Creative Suite required.',
    requirements: ['2+ years of experience', 'Strong portfolio', 'Knowledge of design principles'],
    tags: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudSolutions',
    location: 'Brussels, Belgium',
    type: 'Full-time',
    salary: '€4,000 - €5,000/month',
    posted: '2023-06-02',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure.',
    requirements: ['Experience with AWS or Azure', 'Knowledge of CI/CD', 'Linux administration'],
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataInsights',
    location: 'Leuven, Belgium',
    type: 'Full-time',
    salary: '€3,800 - €4,800/month',
    posted: '2023-06-04',
    description: 'Looking for a Data Scientist to join our analytics team. You will work on creating models and deriving insights from our data.',
    requirements: ['Masters in Statistics or similar', 'Python and R proficiency', 'Experience with ML frameworks'],
    tags: ['Python', 'R', 'Machine Learning', 'Data Analysis'],
  },
  {
    id: '5',
    title: 'Mobile Developer',
    company: 'AppMakers',
    location: 'Gent, Belgium',
    type: 'Full-time',
    salary: '€3,400 - €4,400/month',
    posted: '2023-06-03',
    description: 'Join our mobile team to develop cross-platform mobile applications using React Native.',
    requirements: ['2+ years of mobile development', 'Experience with React Native', 'Knowledge of iOS and Android'],
    tags: ['React Native', 'JavaScript', 'Mobile Development'],
  },
  {
    id: '6',
    title: 'Frontend Developer',
    company: 'WebWizards',
    location: 'Antwerp, Belgium',
    type: 'Part-time',
    salary: '€2,000 - €2,500/month',
    posted: '2023-06-06',
    description: 'Looking for a part-time Frontend Developer to help us build responsive and accessible web applications.',
    requirements: ['HTML, CSS, JavaScript proficiency', 'Experience with React', 'Eye for design'],
    tags: ['React', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: '7',
    title: 'Product Manager',
    company: 'ProductHub',
    location: 'Brussels, Belgium',
    type: 'Full-time',
    salary: '€4,200 - €5,200/month',
    posted: '2023-06-07',
    description: 'We are looking for a Product Manager to lead our product development efforts and define our product roadmap.',
    requirements: ['3+ years in product management', 'Technical background', 'Strong communication skills'],
    tags: ['Product Management', 'Agile', 'Scrum'],
  },
  {
    id: '8',
    title: 'QA Tester',
    company: 'QualityFirst',
    location: 'Leuven, Belgium',
    type: 'Full-time',
    salary: '€3,000 - €3,800/month',
    posted: '2023-06-08',
    description: 'Join our QA team to ensure the quality of our applications. You will be responsible for writing test cases and executing them.',
    requirements: ['Experience with testing methodologies', 'Knowledge of testing tools', 'Attention to detail'],
    tags: ['QA', 'Testing', 'Selenium', 'Test Automation'],
  },
  {
    id: '9',
    title: 'Backend Developer',
    company: 'ServerSide',
    location: 'Gent, Belgium',
    type: 'Full-time',
    salary: '€3,500 - €4,500/month',
    posted: '2023-06-09',
    description: 'Looking for a Backend Developer to join our team. You will be working with Java and Spring Boot to build RESTful APIs.',
    requirements: ['3+ years of experience with Java', 'Knowledge of Spring Boot', 'SQL proficiency'],
    tags: ['Java', 'Spring Boot', 'SQL', 'API Development'],
  },
  {
    id: '10',
    title: 'System Administrator',
    company: 'TechOps',
    location: 'Brussels, Belgium',
    type: 'Full-time',
    salary: '€3,200 - €4,200/month',
    posted: '2023-06-10',
    description: 'Join our IT team to help us maintain and improve our systems infrastructure. Experience with Linux and networking required.',
    requirements: ['Linux administration', 'Networking knowledge', 'Security best practices'],
    tags: ['Linux', 'Networking', 'System Administration'],
  },
];

export default function JobsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const router = useRouter();

  // Filter jobs based on search query and location
  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchesQuery = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = 
        !locationFilter || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesQuery && matchesLocation;
    });
  }, [searchQuery, locationFilter]);

  // Navigate to job detail
  const handleJobPress = (id: string) => {
    router.push({
      pathname: "/(authenticated)/job-detail",
      params: { id }
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days ago for posted date
  const getDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = today.getTime() - postedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Yesterday';
    } else {
      return `${differenceInDays} days ago`;
    }
  };

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setLocationFilter('');
    Keyboard.dismiss();
  }, []);

  // Render a job item
  const renderJobItem = useCallback(({ item }: { item: typeof MOCK_JOBS[0] }) => {
    return (
      <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item.id)}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.jobTypeContainer}>
            <Text style={styles.jobType}>{item.type}</Text>
          </View>
        </View>
        
        <View style={styles.companyRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.companyText}>{item.company}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <Text style={styles.jobDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.tagContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{item.tags.length - 3}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.jobFooter}>
          <Text style={styles.salaryText}>{item.salary}</Text>
          <Text style={styles.postedText}>{getDaysAgo(item.posted)}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {/* Search and Filter Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search jobs, skills, companies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </View>
            
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterVisible(!filterVisible)}>
              <Ionicons name="filter" size={22} color="#008D97" />
            </TouchableOpacity>
          </View>
          
          {/* Filters */}
          {filterVisible && (
            <View style={styles.filtersContainer}>
              <View style={styles.filterRow}>
                <Ionicons name="location-outline" size={20} color="#666" style={styles.filterIcon} />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Filter by location"
                  value={locationFilter}
                  onChangeText={setLocationFilter}
                  returnKeyType="search"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Results count */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              Found {filteredJobs.length} jobs {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
            {locationFilter && (
              <Text style={styles.locationFilterText}>in {locationFilter}</Text>
            )}
          </View>
          
          {/* Job list */}
          <FlatList
            data={filteredJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.jobsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No jobs found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
              </View>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    marginLeft: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#008D97',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationFilterText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  jobsList: {
    paddingBottom: 16,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  jobTypeContainer: {
    backgroundColor: '#E9F5F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  jobType: {
    fontSize: 12,
    color: '#008D97',
    fontWeight: '600',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0F4F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4A6572',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  salaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008D97',
  },
  postedText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
}); 