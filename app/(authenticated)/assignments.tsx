import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy assignments data
const ASSIGNMENTS = [
  {
    id: '1',
    title: 'Resume Review',
    status: 'completed',
    dueDate: '2023-06-10',
    description: 'Submit your resume for professional review',
  },
  {
    id: '2',
    title: 'Job Interview Preparation',
    status: 'inProgress',
    dueDate: '2023-07-15',
    description: 'Complete the interview preparation course',
  },
  {
    id: '3',
    title: 'Skills Assessment',
    status: 'pending',
    dueDate: '2023-07-20',
    description: 'Take the online skills assessment test',
  },
  {
    id: '4',
    title: 'Career Counseling Session',
    status: 'scheduled',
    dueDate: '2023-07-25',
    description: 'Join the video call with your career counselor',
  },
  {
    id: '5',
    title: 'Networking Event',
    status: 'pending',
    dueDate: '2023-08-05',
    description: 'Register for the upcoming industry networking event',
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'completed':
        return { color: '#28A745', icon: 'checkmark-circle' as const, text: 'Completed' };
      case 'inProgress':
        return { color: '#007BFF', icon: 'time' as const, text: 'In Progress' };
      case 'pending':
        return { color: '#FFC107', icon: 'hourglass' as const, text: 'Pending' };
      case 'scheduled':
        return { color: '#6C757D', icon: 'calendar' as const, text: 'Scheduled' };
      default:
        return { color: '#6C757D', icon: 'help-circle' as const, text: 'Unknown' };
    }
  };

  const { color, icon, text } = getStatusDetails();

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={14} color={color} style={styles.statusIcon} />
      <Text style={[styles.statusText, { color }]}>{text}</Text>
    </View>
  );
};

export default function AssignmentsScreen() {
  const renderAssignmentItem = ({ item }: { item: typeof ASSIGNMENTS[0] }) => {
    return (
      <TouchableOpacity style={styles.assignmentCard}>
        <View style={styles.assignmentHeader}>
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        
        <Text style={styles.assignmentDescription}>{item.description}</Text>
        
        <View style={styles.assignmentFooter}>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dueDate}>Due: {formatDate(item.dueDate)}</Text>
          </View>
          
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#008D97" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Format date as "MMM DD, YYYY"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={ASSIGNMENTS}
        renderItem={renderAssignmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No assignments found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  listContent: {
    padding: 16,
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#008D97',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 