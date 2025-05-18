import { MaterialIcons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.errorBox}>
          <View style={styles.errorEmoji}>
            <ThemedText style={styles.emoji}>🤔</ThemedText>
          </View>
          
          <ThemedText type="title" style={styles.title}>Oops! Page Not Found</ThemedText>
          
          <View style={styles.emojiRow}>
            <ThemedText style={styles.smallEmoji}>🧭</ThemedText>
            <ThemedText style={styles.smallEmoji}>🔍</ThemedText>
            <ThemedText style={styles.smallEmoji}>📱</ThemedText>
          </View>
          
          <ThemedText style={styles.message}>
            We can't seem to find the page you're looking for
          </ThemedText>
          
          <Link href="/search" asChild>
            <ThemedView style={styles.button}>
              <MaterialIcons name="home" size={20} color="white" />
              <ThemedText style={styles.buttonText}>Go back to search</ThemedText>
            </ThemedView>
          </Link>
          
          <ThemedText style={styles.errorCode}>Error 404</ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F8FA',
  },
  errorBox: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  errorEmoji: {
    marginBottom: 16,
  },
  emoji: {
    fontSize: 72,
  },
  emojiRow: {
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'center',
  },
  smallEmoji: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008D97', // Teal green
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorCode: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
