import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { neutral } from '@/constants/Colors';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

export function CollapsibleSection({ title, children, initiallyExpanded = false }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={neutral.slateGray}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: neutral.charcoal,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
}); 