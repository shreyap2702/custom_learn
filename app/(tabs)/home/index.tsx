import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Temporary data for topics
const topics = [
  { id: '1', title: 'Topic 1', summary: 'Summary for Topic 1' },
  { id: '2', title: 'Topic 2', summary: 'Summary for Topic 1' },
];

export default function Home() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNewTopic = () => {
    router.push('/(tabs)/topics/new');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What, are you{'\n'}learning today?</Text>

      <View style={styles.newTopicSection}>
        <Text style={styles.sectionTitle}>Start learning something new</Text>
        <TouchableOpacity style={styles.button} onPress={handleNewTopic}>
          <Text style={styles.buttonText}>Go to learn new topic</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, styles.ongoingTitle]}>Your Ongoing Learnings</Text>

      <ScrollView style={styles.topicList}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => router.push(`/topics/${topic.id}`)}
          >
            <View style={styles.topicContent}>
              <View>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicSummary}>{topic.summary}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  ongoingTitle: {
    marginTop: 40,
  },
  topicList: {
    flex: 1,
  },
  topicCard: {
    borderWidth: 1,
    borderColor: '#E6E9EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  topicContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  topicSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  newTopicSection: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#7257FF',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
}); 