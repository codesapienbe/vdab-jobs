import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
interface Assignment {
  id: string;
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  dueDate?: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  type: 'job' | 'solicitation' | 'task' | 'training';
  description: string;
  hourlyRate?: string;
  priority?: 'high' | 'medium' | 'low';
  contactPerson?: {
    name: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
}

// Mock assignments data
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Front-end Developer',
    company: 'TechCorp',
    location: 'Brussels, BE',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    status: 'active',
    type: 'job',
    description: 'Working on the company\'s e-commerce platform using React and TypeScript.',
    hourlyRate: '€55',
    contactPerson: {
      name: 'Sarah Johnson',
      phone: '+32 123 456 789',
      email: 'sarah@techcorp.be',
    },
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'DataSystems',
    location: 'Antwerp, BE',
    startDate: '2025-03-01',
    status: 'upcoming',
    type: 'solicitation',
    description: 'Developing APIs and backend services for a financial application using Java and Spring Boot.',
    hourlyRate: '€60',
    contactPerson: {
      name: 'Mark Verstraete',
      phone: '+32 987 654 321',
      email: 'mark@datasystems.be',
    },
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Gent, BE',
    startDate: '2024-05-10',
    endDate: '2024-11-10',
    status: 'completed',
    type: 'job',
    description: 'Developed a customer portal using Angular frontend and Node.js backend.',
    hourlyRate: '€50',
    contactPerson: {
      name: 'Lisa Martens',
      email: 'lisa@websolutions.be',
    },
  },
  {
    id: '4',
    title: 'Complete UI/UX Training Course',
    startDate: '2025-02-15',
    dueDate: '2025-02-28',
    status: 'upcoming',
    type: 'training',
    description: 'Complete the UI/UX design principles and tools online course. Follow all modules and submit the final assignment.',
    priority: 'medium',
    notes: 'Course materials available at training.vdab.be/courses/uiux-2025',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Leuven, BE',
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    status: 'completed',
    type: 'job',
    description: 'Implemented CI/CD pipelines and managed cloud infrastructure on AWS.',
    hourlyRate: '€65',
    contactPerson: {
      name: 'Eva Peeters',
      email: 'eva@cloudtech.be',
    },
  },
  {
    id: '6',
    title: 'Update CV and Portfolio',
    startDate: '2024-08-15',
    dueDate: '2024-08-20',
    status: 'completed',
    type: 'task',
    description: 'Update CV with recent experience and refresh portfolio with latest projects.',
    priority: 'high',
    notes: 'Remember to add CloudTech project and React certification',
  },
  {
    id: '7',
    title: 'Mobile Developer',
    company: 'AppFactory',
    location: 'Antwerp, BE',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    status: 'active',
    type: 'job',
    description: 'Developing an iOS and Android app using React Native for a retail client.',
    hourlyRate: '€55',
    contactPerson: {
      name: 'Johan Claes',
      phone: '+32 789 123 456',
      email: 'johan@appfactory.be',
    },
  },
  {
    id: '8',
    title: 'Complete Career Assessment',
    startDate: '2025-04-01',
    dueDate: '2025-04-10',
    status: 'upcoming',
    type: 'task',
    description: 'Complete the career assessment questionnaire and schedule a follow-up meeting with career coach.',
    priority: 'medium',
    notes: 'Assessment link will be sent via email on April 1st',
  },
  {
    id: '9',
    title: 'Java Developer',
    company: 'FinTech Solutions',
    location: 'Brussels, BE',
    startDate: '2025-05-01',
    status: 'upcoming',
    type: 'solicitation',
    description: 'Opportunity to work on a banking system modernization project. Interview scheduled.',
    hourlyRate: '€65',
    contactPerson: {
      name: 'Luc Vermeeren',
      email: 'luc@fintechsolutions.be',
    },
  },
  {
    id: '10',
    title: 'Prepare for Kubernetes Certification',
    startDate: '2025-03-10',
    dueDate: '2025-03-31',
    status: 'upcoming',
    type: 'training',
    description: 'Study and prepare for the Kubernetes Administrator certification exam.',
    priority: 'high',
    notes: 'Study materials available at training.vdab.be/courses/kubernetes-2025. Exam voucher will be provided upon completion of the preparation course.',
  },
];

export default function AssignmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  // Filter assignments based on active tab
  const filteredAssignments = useMemo(() => {
    if (activeTab === 'all') {
      return MOCK_ASSIGNMENTS;
    }
    return MOCK_ASSIGNMENTS.filter(assignment => assignment.status === activeTab);
  }, [activeTab]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle assignment press
  const handleAssignmentPress = (assignment: Assignment) => {
    // Different alert content for tasks and training vs jobs and solicitations
    if (assignment.type === 'task' || assignment.type === 'training') {
      Alert.alert(
        assignment.title,
        `${assignment.description}\n\nDue date: ${assignment.dueDate ? formatDate(assignment.dueDate) : 'Not specified'}\nPriority: ${assignment.priority || 'Not specified'}\n\n${assignment.notes || ''}`,
        [
          { text: 'Close', style: 'cancel' },
          { 
            text: 'Mark Complete', 
            onPress: () => {
              Alert.alert('Success', `${assignment.title} marked as completed.`);
            }
          },
        ]
      );
    } else {
      Alert.alert(
        `${assignment.title} at ${assignment.company}`,
        `${assignment.description}\n\nLocation: ${assignment.location}\nPeriod: ${formatDate(assignment.startDate)} - ${assignment.endDate ? formatDate(assignment.endDate) : 'Ongoing'}\nRate: ${assignment.hourlyRate || 'Not specified'}\n\nContact: ${assignment.contactPerson?.name || 'Not specified'}`,
        [
          { text: 'Close', style: 'cancel' },
          { 
            text: 'Contact', 
            onPress: () => {
              if (assignment.contactPerson?.email) {
                Alert.alert('Contact', `Email: ${assignment.contactPerson.email}\nPhone: ${assignment.contactPerson.phone || 'Not provided'}`);
              } else {
                Alert.alert('Contact', 'No contact information available.');
              }
            }
          },
        ]
      );
    }
  };

  // Get status badge color
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'active': return '#4CAF50'; // Green
      case 'upcoming': return '#2196F3'; // Blue
      case 'completed': return '#757575'; // Gray
      case 'cancelled': return '#F44336'; // Red
      default: return '#757575';
    }
  };

  // Get type icon and label
  const getTypeInfo = (type: Assignment['type']) => {
    switch (type) {
      case 'job':
        return { icon: 'briefcase', label: 'Job', color: '#008D97' };
      case 'solicitation':
        return { icon: 'mail', label: 'Solicitation', color: '#FF9800' };
      case 'task':
        return { icon: 'list-check', label: 'Task', color: '#9C27B0' };
      case 'training':
        return { icon: 'school', label: 'Training', color: '#3F51B5' };
      default:
        return { icon: 'briefcase', label: 'Assignment', color: '#008D97' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: Assignment['priority']) => {
    switch (priority) {
      case 'high': return '#E53935'; // Red
      case 'medium': return '#FB8C00'; // Orange
      case 'low': return '#43A047'; // Green
      default: return '#757575'; // Grey
    }
  };

  // Render an assignment item
  const renderAssignmentItem = useCallback(({ item }: { item: Assignment }) => {
    const typeInfo = getTypeInfo(item.type);
    
    // Different layout for tasks and training
    if (item.type === 'task' || item.type === 'training') {
      return (
        <TouchableOpacity 
          style={styles.assignmentCard} 
          onPress={() => handleAssignmentPress(item)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <View style={[styles.typeBadge, { backgroundColor: typeInfo.color }]}>
                <Text style={styles.typeText}>{typeInfo.label}</Text>
              </View>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
          
          {item.dueDate && (
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>
                Due by: {formatDate(item.dueDate)}
              </Text>
            </View>
          )}
          
          {item.priority && (
            <View style={styles.priorityRow}>
              <Ionicons name="flag-outline" size={16} color="#666" />
              <View style={styles.priorityContainer}>
                <Text style={styles.priorityLabel}>Priority:</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                  <Text style={styles.priorityText}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {item.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="information-circle-outline" size={16} color="#666" />
              <Text style={styles.notesText} numberOfLines={1}>{item.notes}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    // Default layout for jobs and solicitations
    return (
      <TouchableOpacity 
        style={styles.assignmentCard} 
        onPress={() => handleAssignmentPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.color }]}>
              <Text style={styles.typeText}>{typeInfo.label}</Text>
            </View>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {item.company && (
          <View style={styles.companyRow}>
            <Ionicons name="business-outline" size={16} color="#666" />
            <Text style={styles.companyText}>{item.company}</Text>
          </View>
        )}
        
        {item.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>
            {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Ongoing'}
          </Text>
        </View>
        
        {item.hourlyRate && (
          <View style={styles.rateRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.rateText}>{item.hourlyRate}/hour</Text>
          </View>
        )}
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        {item.contactPerson && (
          <View style={styles.contactRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.contactText}>Contact: {item.contactPerson.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Assignments List */}
        <FlatList
          data={filteredAssignments}
          renderItem={renderAssignmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No assignments found</Text>
              <Text style={styles.emptySubtext}>You don't have any {activeTab !== 'all' ? activeTab : ''} assignments at the moment.</Text>
            </View>
          )}
        />
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#008D97',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#008D97',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  assignmentCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  typeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  companyText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 8,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008D97',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginVertical: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
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
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  priorityBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
}); 