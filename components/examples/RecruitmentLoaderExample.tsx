import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { accent, primary } from '../../constants/Colors';
import { RecruitmentLoader } from '../RecruitmentLoader';
import ThemedCard from '../ThemedCard';
import { ThemedText } from '../ThemedText';

export const RecruitmentLoaderExample = () => {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [customText, setCustomText] = useState('Matching in progress...');
  
  const toggleSize = () => {
    if (size === 'small') setSize('medium');
    else if (size === 'medium') setSize('large');
    else setSize('small');
  };
  
  const toggleText = () => {
    const texts = [
      'Matching in progress...',
      'Finding the perfect match...',
      'Analyzing skills...',
      'Looking for opportunities...'
    ];
    
    const currentIndex = texts.indexOf(customText);
    const nextIndex = (currentIndex + 1) % texts.length;
    setCustomText(texts[nextIndex]);
  };
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>Recruitment Loader</ThemedText>
      
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.subheader}>Standard Loader</ThemedText>
        <View style={styles.loaderContainer}>
          <RecruitmentLoader size="medium" />
        </View>
      </ThemedCard>
      
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.subheader}>Customizable Loader</ThemedText>
        <View style={styles.loaderContainer}>
          <RecruitmentLoader 
            size={size} 
            text={customText}
          />
        </View>
        
        <View style={styles.controls}>
          <Button
            title={`Size: ${size}`}
            onPress={toggleSize}
            color={primary.tealGreen}
          />
          
          <Button
            title="Change Text"
            onPress={toggleText}
            color={accent.orange}
          />
        </View>
      </ThemedCard>
      
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.subheader}>No Text Loader</ThemedText>
        <View style={styles.smallLoaderContainer}>
          <RecruitmentLoader size="small" showText={false} />
        </View>
      </ThemedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  loaderContainer: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLoaderContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
}); 