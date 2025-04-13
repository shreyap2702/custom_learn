import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

interface Video {
  url: string;
  title: string;
  description: string;
}

interface LearningPlan {
  videos: Video[];
  keyPoints: string[];
  summary: string;
}

export default function LearningResources() {
  const params = useLocalSearchParams<{ content: string }>();
  const learningPlan: LearningPlan = params.content ? JSON.parse(params.content) : {
    videos: [],
    keyPoints: [],
    summary: ''
  };

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Resources to Learn</Text>
        
        {/* Videos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Videos</Text>
          {learningPlan.videos.map((video, index) => {
            const thumbnailUrl = getYouTubeThumbnail(video.url);
            return (
              <View key={index} style={styles.videoCard}>
                {thumbnailUrl && (
                  <Image
                    source={{ uri: thumbnailUrl }}
                    style={styles.thumbnail}
                  />
                )}
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoDescription} numberOfLines={2}>
                    {video.description}
                  </Text>
                  <TouchableOpacity 
                    style={styles.watchButton}
                    onPress={() => Linking.openURL(video.url)}
                  >
                    <Text style={styles.watchButtonText}>Watch Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Key Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Points to Master</Text>
          {learningPlan.keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPointCard}>
              <Text style={styles.keyPointNumber}>{index + 1}</Text>
              <Text style={styles.keyPointText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={[styles.section, styles.summarySection]}>
          <Text style={styles.sectionTitle}>Learning Path Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{learningPlan.summary}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 32,
    lineHeight: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 20,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  watchButton: {
    backgroundColor: '#7257FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  keyPointCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  keyPointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7257FF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginRight: 12,
  },
  keyPointText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  summarySection: {
    marginBottom: 0,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
}); 