import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TopicLearning() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Topic Learning</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* YouTube Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YouTube Resources</Text>
          <View style={styles.card}>
            <Text style={styles.linkText}>Introduction to Topic</Text>
            <Text style={styles.subtitle}>By Learning Channel</Text>
          </View>
        </View>

        {/* Blog Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blog Resources</Text>
          <View style={styles.card}>
            <Text style={styles.linkText}>Comprehensive Guide</Text>
            <Text style={styles.subtitle}>medium.com</Text>
          </View>
        </View>

        {/* Key Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Points</Text>
          <View style={styles.card}>
            <Text style={styles.pointText}>• Understanding basic concepts</Text>
            <Text style={styles.pointText}>• Practice exercises</Text>
            <Text style={styles.pointText}>• Advanced techniques</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  pointText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
}); 