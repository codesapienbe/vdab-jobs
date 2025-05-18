import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy documents data
const INITIAL_DOCUMENTS = [
  {
    id: '1',
    name: 'Resume.pdf',
    type: 'application/pdf',
    size: 1456000,
    date: '2023-05-15',
  },
  {
    id: '2',
    name: 'ID Card.jpg',
    type: 'image/jpeg',
    size: 2345000,
    date: '2023-05-10',
  },
  {
    id: '3',
    name: 'Certificate.pdf',
    type: 'application/pdf',
    size: 987000,
    date: '2023-04-20',
  },
];

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);

  // Pick a document from the device
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        return;
      }

      // Add the selected document to the list
      const newDocument = {
        id: Date.now().toString(),
        name: asset.name,
        type: asset.mimeType || 'application/octet-stream',
        size: asset.size || 0,
        date: new Date().toISOString().split('T')[0],
      };

      setDocuments([newDocument, ...documents]);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
      console.error('Document picking error:', error);
    }
  };

  // Remove a document from the list
  const removeDocument = (id: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter((doc) => doc.id !== id));
          },
        },
      ]
    );
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <Ionicons name="document-text" size={28} color="#F40F02" />;
    } else if (fileType.includes('image')) {
      return <Ionicons name="image" size={28} color="#31A8FF" />;
    } else if (fileType.includes('word') || fileType.includes('msword')) {
      return <Ionicons name="document-text" size={28} color="#2B579A" />;
    } else {
      return <Ionicons name="document" size={28} color="#888" />;
    }
  };

  // Render a document item
  const renderDocumentItem = ({ item }: { item: typeof documents[0] }) => {
    return (
      <View style={styles.documentItem}>
        <View style={styles.documentIcon}>{getFileIcon(item.type)}</View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.documentDetails}>
            <Text style={styles.documentSize}>{formatFileSize(item.size)}</Text>
            <Text style={styles.documentDate}>{item.date}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeDocument(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Documents</Text>
          <Text style={styles.subtitle}>
            Upload and manage your important documents
          </Text>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>

        <View style={styles.documentsContainer}>
          <Text style={styles.sectionTitle}>Uploaded Documents</Text>
          
          <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.documentsList}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="document" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No documents uploaded yet</Text>
                <Text style={styles.emptySubtext}>
                  Your uploaded documents will appear here
                </Text>
              </View>
            )}
          />
        </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#008D97',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  documentsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  documentsList: {
    flexGrow: 1,
  },
  documentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  documentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentSize: {
    fontSize: 14,
    color: '#888',
    marginRight: 12,
  },
  documentDate: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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