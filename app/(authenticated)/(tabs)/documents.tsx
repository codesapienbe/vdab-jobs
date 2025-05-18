import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Document types
type DocumentType = 'pdf' | 'markdown' | 'csv' | 'text' | 'image' | 'other';

// Document interface
interface Document {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  size: number;
  dateAdded: string;
  dateModified: string;
  path?: string; // Local path (simulated)
  content?: string; // For demo purposes
  tags?: string[];
}

// Helper function to get file size string
const getFileSizeString = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper function to get date string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to get icon for file type
const getDocumentIcon = (type: DocumentType, size: number = 24, color: string = '#666') => {
  switch (type) {
    case 'pdf':
      return <AntDesign name="pdffile1" size={size} color={color} />;
    case 'markdown':
      return <MaterialCommunityIcons name="language-markdown" size={size} color={color} />;
    case 'csv':
      return <MaterialIcons name="grid-on" size={size} color={color} />;
    case 'text':
      return <MaterialIcons name="text-snippet" size={size} color={color} />;
    case 'image':
      return <MaterialIcons name="image" size={size} color={color} />;
    default:
      return <MaterialIcons name="insert-drive-file" size={size} color={color} />;
  }
};

// Helper to get readable document type name
const getDocumentTypeName = (type: DocumentType): string => {
  switch (type) {
    case 'pdf':
      return 'PDF Document';
    case 'markdown':
      return 'Markdown';
    case 'csv':
      return 'Spreadsheet';
    case 'text':
      return 'Text Document';
    case 'image':
      return 'Image';
    default:
      return 'Document';
  }
};

// Helper to get background color style for document type
const getTypeColor = (type: DocumentType) => {
  switch (type) {
    case 'pdf':
      return styles.pdfIconBg;
    case 'markdown':
      return styles.markdownIconBg;
    case 'csv':
      return styles.csvIconBg;
    case 'text':
      return styles.textIconBg;
    case 'image':
      return styles.imageIconBg;
    default:
      return styles.otherIconBg;
  }
};

// Mock documents data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Resume_2025.pdf',
    description: 'My current professional resume',
    type: 'pdf',
    size: 2457600, // 2.3 MB
    dateAdded: '2025-01-05',
    dateModified: '2025-01-15',
    tags: ['personal', 'career'],
    content: `<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f5;"><div style="background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);max-width:80%;"><h1 style="color:#008D97;">Sample Resume</h1><p>This is a sample PDF document viewer. In a real app, this would display the actual PDF content.</p><div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:4px;"><p><strong>Name:</strong> John Doe</p><p><strong>Position:</strong> Full Stack Developer</p><p><strong>Skills:</strong> React, Node.js, TypeScript</p></div></div></body></html>`,
  },
  {
    id: '2',
    name: 'project_notes.md',
    description: 'Notes on current project architecture',
    type: 'markdown',
    size: 15360, // 15 KB
    dateAdded: '2025-02-10',
    dateModified: '2025-02-12',
    tags: ['work', 'notes'],
    content: `# Project Architecture Notes

## Frontend
- React with TypeScript
- State management with Redux
- Styled with Tailwind CSS

## Backend
- Node.js with Express
- PostgreSQL database
- GraphQL API

## Infrastructure
- Docker containers
- Kubernetes orchestration
- CI/CD with GitHub Actions

## TODO
- [ ] Implement user authentication
- [ ] Set up logging
- [ ] Create automated tests
`,
  },
  {
    id: '3',
    name: 'job_applications.csv',
    description: 'Tracking sheet for job applications',
    type: 'csv',
    size: 5120, // 5 KB
    dateAdded: '2025-02-20',
    dateModified: '2025-02-25',
    tags: ['career', 'personal'],
    content: `Company,Position,Date Applied,Status,Notes
TechCorp,Full Stack Developer,2025-01-15,Interview,Scheduled for March 10
DataSystems,Backend Developer,2025-02-01,Applied,Waiting for response
WebSolutions,Frontend Developer,2025-02-10,Rejected,Position filled
CloudTech,DevOps Engineer,2025-02-20,Phone Screen,Call scheduled for March 5
`,
  },
  {
    id: '4',
    name: 'meeting_minutes.txt',
    description: 'Team meeting notes from Feb 28',
    type: 'text',
    size: 3072, // 3 KB
    dateAdded: '2025-02-28',
    dateModified: '2025-02-28',
    tags: ['work', 'meetings'],
  },
  {
    id: '5',
    name: 'profile_picture.jpg',
    description: 'Professional headshot for LinkedIn',
    type: 'image',
    size: 1048576, // 1 MB
    dateAdded: '2025-01-20',
    dateModified: '2025-01-20',
    tags: ['personal'],
  },
];

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentType | 'all'>('all');
  
  // Filter documents based on search query and selected category
  const filteredDocuments = documents.filter(doc => {
    const matchesQuery = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  // Calculate document counts by type
  const documentCounts = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length };
    documents.forEach(doc => {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
    });
    return counts;
  }, [documents]);
  
  // Handle document selection for viewing
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };
  
  // Handle document edit
  const handleEditDocument = (document: Document) => {
    setCurrentDocument(document);
    setDocumentName(document.name);
    setDocumentDescription(document.description);
    setDocumentTags(document.tags?.join(', ') || '');
    setEditModalVisible(true);
  };
  
  // Save edited document
  const saveDocument = () => {
    if (!currentDocument) return;
    
    // Validation
    if (!documentName.trim()) {
      Alert.alert('Error', 'Document name cannot be empty');
      return;
    }
    
    const updatedDocument = {
      ...currentDocument,
      name: documentName,
      description: documentDescription,
      dateModified: new Date().toISOString().split('T')[0],
      tags: documentTags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    
    setDocuments(docs => 
      docs.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
    );
    
    setEditModalVisible(false);
    Alert.alert('Success', 'Document updated successfully');
  };
  
  // Handle document deletion
  const handleDeleteDocument = (document: Document) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${document.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDocuments(docs => docs.filter(doc => doc.id !== document.id));
            Alert.alert('Success', 'Document deleted successfully');
          }
        },
      ]
    );
  };
  
  // Handle document sharing
  const handleShareDocument = async (document: Document) => {
    try {
      setLoading(true);
      // In a real app, you'd have the actual file path
      // For demo, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      Alert.alert('Shared', `${document.name} was shared successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to share document');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle document upload/addition
  const handleAddDocument = async () => {
    try {
      setLoading(true);
      
      // Use expo-document-picker to select a file
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow any file type
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        console.log('Document picking canceled');
        return;
      }
      
      const file = result.assets[0];
      
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Determine file type
      let fileType: DocumentType = 'other';
      if (fileExtension === 'pdf') fileType = 'pdf';
      else if (['md', 'markdown'].includes(fileExtension)) fileType = 'markdown';
      else if (fileExtension === 'csv') fileType = 'csv';
      else if (['txt', 'text'].includes(fileExtension)) fileType = 'text';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) fileType = 'image';
      
      // Create new document object
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        description: 'New document',
        type: fileType,
        size: file.size || 0,
        dateAdded: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        path: file.uri,
        tags: [],
      };
      
      // Add to documents list
      setDocuments(prev => [newDocument, ...prev]);
      
      // Open edit modal to add details
      handleEditDocument(newDocument);
      
      Alert.alert('Success', 'Document added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add document');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Render document item
  const renderDocumentItem = useCallback(({ item }: { item: Document }) => {
    return (
      <View style={styles.documentCard}>
        <TouchableOpacity 
          style={styles.documentInfo}
          onPress={() => handleViewDocument(item)}
        >
          <View style={[styles.documentIconContainer, getTypeColor(item.type)]}>
            {getDocumentIcon(item.type, 28, '#fff')}
          </View>
          
          <View style={styles.documentDetails}>
            <View style={styles.documentHeaderRow}>
              <Text style={styles.documentName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.documentTypeLabel}>{getDocumentTypeName(item.type)}</Text>
            </View>
            
            <Text style={styles.documentDescription} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.documentMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#888" style={styles.metaIcon} />
                <Text style={styles.metaText}>{formatDate(item.dateModified)}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="file-copy" size={12} color="#888" style={styles.metaIcon} />
                <Text style={styles.metaText}>{getFileSizeString(item.size)}</Text>
              </View>
            </View>
            
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDocument(item)}
          >
            <Feather name="eye" size={18} color="#007AFF" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditDocument(item)}
          >
            <Feather name="edit-2" size={18} color="#FF9500" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShareDocument(item)}
          >
            <Feather name="share-2" size={18} color="#34C759" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteDocument(item)}
          >
            <Feather name="trash-2" size={18} color="#FF3B30" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);
  
  // Render document content based on type
  const renderDocumentContent = () => {
    if (!selectedDocument) return null;
    
    switch (selectedDocument.type) {
      case 'pdf':
        // In a real app, you'd use a PDF viewer
        return (
          <View style={styles.documentViewerContent}>
            <WebView
              style={styles.webView}
              source={{ html: selectedDocument.content || '<html><body><h1>PDF Viewer</h1><p>No content available.</p></body></html>' }}
            />
            
            <View style={styles.documentViewerFooter}>
              <View style={styles.documentMetaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Modified: {formatDate(selectedDocument.dateModified)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="file-copy" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Size: {getFileSizeString(selectedDocument.size)}</Text>
                </View>
              </View>
              
              <View style={styles.documentViewerActions}>
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="download-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="print-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Print</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewerActionButton}
                  onPress={() => selectedDocument && handleShareDocument(selectedDocument)}
                >
                  <Ionicons name="share-social-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 'markdown':
        // Simple markdown rendering (in a real app, use a proper markdown renderer)
        return (
          <View style={styles.documentViewerContent}>
            <WebView
              style={styles.webView}
              source={{ 
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; line-height: 1.6; }
                        h1, h2, h3 { color: #333; }
                        code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
                        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
                        ul, ol { padding-left: 25px; }
                        blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 15px; color: #666; }
                      </style>
                    </head>
                    <body>
                      <div id="content">${selectedDocument.content?.replace(/\n/g, '<br>') || 'No content available.'}</div>
                    </body>
                  </html>
                `
              }}
            />
            
            <View style={styles.documentViewerFooter}>
              <View style={styles.documentMetaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Modified: {formatDate(selectedDocument.dateModified)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="file-copy" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Size: {getFileSizeString(selectedDocument.size)}</Text>
                </View>
              </View>
              
              <View style={styles.documentViewerActions}>
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="download-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="create-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewerActionButton}
                  onPress={() => selectedDocument && handleShareDocument(selectedDocument)}
                >
                  <Ionicons name="share-social-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 'csv':
        // Simple CSV rendering (in a real app, use a proper table component)
        if (!selectedDocument.content) {
          return <Text style={styles.noContent}>No CSV content available.</Text>;
        }
        
        const rows = selectedDocument.content.trim().split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1);
        
        return (
          <View style={styles.documentViewerContent}>
            <WebView
              style={styles.webView}
              source={{ 
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 10px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; position: sticky; top: 0; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                      </style>
                    </head>
                    <body>
                      <table>
                        <thead>
                          <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                          </tr>
                        </thead>
                        <tbody>
                          ${data.map(row => 
                            `<tr>${row.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
                          ).join('')}
                        </tbody>
                      </table>
                    </body>
                  </html>
                `
              }}
            />
            
            <View style={styles.documentViewerFooter}>
              <View style={styles.documentMetaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Modified: {formatDate(selectedDocument.dateModified)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="file-copy" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Size: {getFileSizeString(selectedDocument.size)}</Text>
                </View>
              </View>
              
              <View style={styles.documentViewerActions}>
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="download-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.viewerActionButton}>
                  <Ionicons name="analytics-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Analyze</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.viewerActionButton}
                  onPress={() => selectedDocument && handleShareDocument(selectedDocument)}
                >
                  <Ionicons name="share-social-outline" size={22} color="#008D97" />
                  <Text style={styles.viewerActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      default:
        return (
          <View style={styles.documentViewerContent}>
            <View style={styles.previewContainer}>
              <View style={styles.previewIcon}>
                {getDocumentIcon(selectedDocument.type, 64, '#008D97')}
              </View>
              <Text style={styles.previewText}>
                Preview not available for this document type.
              </Text>
              <TouchableOpacity style={styles.previewDownloadButton}>
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.previewDownloadText}>Download File</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.documentViewerFooter}>
              <View style={styles.documentMetaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Modified: {formatDate(selectedDocument.dateModified)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="file-copy" size={14} color="#666" style={styles.metaIcon} />
                  <Text style={styles.metaText}>Size: {getFileSizeString(selectedDocument.size)}</Text>
                </View>
              </View>
            </View>
          </View>
        );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Documents</Text>
            <Text style={styles.headerSubtitle}>{documents.length} total documents</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddDocument}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Search and Filter Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents by name, description or tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'all' && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Ionicons 
              name="layers-outline" 
              size={16} 
              color={selectedCategory === 'all' ? '#fff' : '#666'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'all' && styles.categoryTextActive
              ]}
            >
              All ({documentCounts.all || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'pdf' && styles.pdfButtonActive
            ]}
            onPress={() => setSelectedCategory('pdf')}
          >
            <AntDesign 
              name="pdffile1" 
              size={16} 
              color={selectedCategory === 'pdf' ? '#fff' : '#E53935'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'pdf' && styles.categoryTextActive
              ]}
            >
              PDFs ({documentCounts.pdf || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'markdown' && styles.markdownButtonActive
            ]}
            onPress={() => setSelectedCategory('markdown')}
          >
            <MaterialCommunityIcons 
              name="language-markdown" 
              size={16} 
              color={selectedCategory === 'markdown' ? '#fff' : '#0288D1'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'markdown' && styles.categoryTextActive
              ]}
            >
              Markdown ({documentCounts.markdown || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'csv' && styles.csvButtonActive
            ]}
            onPress={() => setSelectedCategory('csv')}
          >
            <MaterialIcons 
              name="grid-on" 
              size={16} 
              color={selectedCategory === 'csv' ? '#fff' : '#388E3C'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'csv' && styles.categoryTextActive
              ]}
            >
              Spreadsheets ({documentCounts.csv || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'text' && styles.textButtonActive
            ]}
            onPress={() => setSelectedCategory('text')}
          >
            <MaterialIcons 
              name="text-snippet" 
              size={16} 
              color={selectedCategory === 'text' ? '#fff' : '#616161'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'text' && styles.categoryTextActive
              ]}
            >
              Text ({documentCounts.text || 0})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              selectedCategory === 'image' && styles.imageButtonActive
            ]}
            onPress={() => setSelectedCategory('image')}
          >
            <MaterialIcons 
              name="image" 
              size={16} 
              color={selectedCategory === 'image' ? '#fff' : '#7B1FA2'} 
            />
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === 'image' && styles.categoryTextActive
              ]}
            >
              Images ({documentCounts.image || 0})
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            Found {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
            {selectedCategory !== 'all' ? ` in ${getDocumentTypeName(selectedCategory as DocumentType).toLowerCase()}` : ''}
          </Text>
        </View>
        
        {/* Documents list */}
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.documentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || selectedCategory !== 'all'
                  ? "Try adjusting your search or category filters"
                  : "Add documents by tapping the Upload button"}
              </Text>
            </View>
          )}
        />
        
        {/* Document viewer modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="arrow-back" size={24} color="#008D97" />
              </TouchableOpacity>
              
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedDocument?.name}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDocument?.description}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => selectedDocument && handleShareDocument(selectedDocument)}
              >
                <Ionicons name="share-outline" size={24} color="#008D97" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.documentViewer}>
              {renderDocumentContent()}
            </View>
          </SafeAreaView>
        </Modal>
        
        {/* Edit document modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.editModalContainer}>
            <View style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>
                {currentDocument?.id.includes('temp') ? 'Add Document' : 'Edit Document'}
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={documentName}
                  onChangeText={setDocumentName}
                  placeholder="Document name"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={documentDescription}
                  onChangeText={setDocumentDescription}
                  placeholder="Document description"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.formInput}
                  value={documentTags}
                  onChangeText={setDocumentTags}
                  placeholder="work, personal, important"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveDocument}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    width: 100,
    height: 48,
    backgroundColor: '#008D97',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F7F9',
  },
  categoryButtonActive: {
    backgroundColor: '#008D97',
  },
  pdfButtonActive: {
    backgroundColor: '#E53935',
  },
  markdownButtonActive: {
    backgroundColor: '#0288D1',
  },
  csvButtonActive: {
    backgroundColor: '#388E3C',
  },
  textButtonActive: {
    backgroundColor: '#616161',
  },
  imageButtonActive: {
    backgroundColor: '#7B1FA2',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  documentsList: {
    paddingBottom: 16,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  documentInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 4,
  },
  documentDetails: {
    flex: 1,
  },
  documentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  documentTypeLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  documentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  documentMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  documentSize: {
    fontSize: 12,
    color: '#888',
    marginRight: 16,
  },
  documentDate: {
    fontSize: 12,
    color: '#888',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F4F8',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#4A6572',
  },
  documentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    marginRight: 16,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    marginLeft: 16,
  },
  documentViewer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  webView: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewIcon: {
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noContent: {
    padding: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  editModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#008D97',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pdfIconBg: {
    backgroundColor: '#E53935',
  },
  markdownIconBg: {
    backgroundColor: '#0288D1',
  },
  csvIconBg: {
    backgroundColor: '#388E3C',
  },
  textIconBg: {
    backgroundColor: '#616161',
  },
  imageIconBg: {
    backgroundColor: '#7B1FA2',
  },
  otherIconBg: {
    backgroundColor: '#FFA000',
  },
  documentViewerContent: {
    flex: 1,
  },
  documentViewerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  documentMetaInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  documentViewerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  viewerActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  previewDownloadButton: {
    backgroundColor: '#008D97',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewDownloadText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
}); 