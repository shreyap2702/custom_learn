import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleNewTopic = () => {
    router.push('/(tabs)/topics/new');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.title}>What are you{'\n'}learning today?</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/study_graphic.jpeg')}
            style={styles.studyImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.actionSection}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Ready to Learn?</Text>
              <Text style={styles.cardText}>
                Explore new topics and enhance your knowledge with our personalized learning paths.
              </Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleNewTopic}
              >
                <Text style={styles.buttonText}>Go to learn new topic</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 44,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#F8F9FF',
    borderRadius: 20,
    padding: 16,
  },
  studyImage: {
    width: '100%',
    height: 220,
  },
  actionSection: {
    width: '100%',
  },
  card: {
    backgroundColor: '#F8F9FF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8ECFF',
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#7257FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#7257FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 