import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, Image, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import { addTopicToUser, addUser, logDataStorage, readUsersData } from '../../utils/data';

// We'll manage the current user ID dynamically
let currentUserId = '';

interface Video {
  url: string;
  title: string;
  description: string;
}

interface GeneratedContent {
  videos: Video[];
  keyPoints: string[];
  summary: string;
}

const API_KEY = 'AIzaSyDr0DWkt0RTWxbWRMxOxFxI7e7sAxgR9Wk';
const MODEL_NAME = 'gemini-1.5-pro-002';

function extractAndParseJSON(text: string) {
  try {
    // Remove code block markers if present
    const cleanedText = text.replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

async function getLearningPlan(prompt: string) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error('API Error:', data.error);
      throw new Error(data.error.message || 'API Error');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid API response structure');
    }

    const rawContent = data.candidates[0].content.parts[0].text.trim();
    console.log('Raw content from Gemini:\n', rawContent);

    if (!rawContent.startsWith('```json')) {
      console.warn("Response not in expected JSON block format");
    }

    const parsedContent = extractAndParseJSON(rawContent);
    if (!parsedContent) {
      throw new Error('Failed to parse response content');
    }

    // Ensure the response has the required structure
    return {
      videos: Array.isArray(parsedContent.videos) ? parsedContent.videos : [],
      keyPoints: Array.isArray(parsedContent.keyPoints) ? parsedContent.keyPoints : [],
      summary: parsedContent.summary || ''
    };
  } catch (error) {
    console.error('getLearningPlan error:', error);
    throw error;
  }
}

export default function NewTopic() {
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState('');
  const [level, setLevel] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    videos: [],
    keyPoints: [],
    summary: ''
  });
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  // Initialize user on component mount
  useEffect(() => {
    async function initializeUser() {
      try {
        const users = await readUsersData();
        if (users.length === 0) {
          // Create a default user if none exists
          const defaultUser = await addUser({
            name: 'Default User',
            institution: 'Default Institution',
            email: 'default@example.com',
            password: 'defaultpass'
          });
          currentUserId = defaultUser.id;
        } else {
          // Use the first user's ID
          currentUserId = users[0].id;
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        Alert.alert('Error', 'Failed to initialize user data');
      }
    }
    initializeUser();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    if (!topic || !time || !level) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!currentUserId) {
      Alert.alert('Error', 'User data not initialized');
      return;
    }

    try {
      setLoading(true);
      const prompt = `You are a learning plan generator. Create a structured learning plan for ${topic}.
Level: ${level}
Time frame: ${time}

Return the response in this exact JSON format, with no additional text or explanation:
{
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=example1",
      "title": "Video Title 1",
      "description": "Brief description of video 1"
    },
    {
      "url": "https://www.youtube.com/watch?v=example2",
      "title": "Video Title 2",
      "description": "Brief description of video 2"
    }
  ],
  "keyPoints": [
    "Key point 1 about ${topic}",
    "Key point 2 about ${topic}",
    "Key point 3 about ${topic}"
  ],
  "summary": "Brief summary of how to learn ${topic} in ${time} for a ${level} level learner"
}`;

      const parsedContent = await getLearningPlan(prompt);

      // Set default values if any required field is missing
      const validContent = {
        videos: Array.isArray(parsedContent.videos) ? parsedContent.videos.slice(0, 2) : [],
        keyPoints: Array.isArray(parsedContent.keyPoints) ? parsedContent.keyPoints.slice(0, 3) : [],
        summary: parsedContent.summary || `Learning plan for ${topic}`
      };

      // Save the topic to the database
      const newTopic = {
        id: Date.now().toString(),
        title: topic,
        isBeginner: level.toLowerCase().includes('beginner'),
        isPreparingExam: false,
        expectedDate: time,
        createdAt: new Date().toISOString(),
        resources: {
          youtubeLinks: validContent.videos.map(v => v.url),
          blogLinks: [],
          keyPoints: validContent.keyPoints
        },
        progress: {
          completedResources: [],
          notes: [],
          lastAccessed: new Date().toISOString()
        }
      };

      await addTopicToUser(currentUserId, newTopic);

      // Navigate to the learning screen with the content
      router.push({
        pathname: '/(tabs)/topics/learning',
        params: { content: JSON.stringify(validContent) }
      });
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>What do you want to learn?</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Topic</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter topic"
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={styles.label}>Time to Complete</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2 weeks, 1 month"
            value={time}
            onChangeText={setTime}
          />

          <Text style={styles.label}>Level</Text>
          <View style={styles.levelContainer}>
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelButton,
                  level === lvl && styles.levelButtonSelected,
                ]}
                onPress={() => setLevel(lvl)}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    level === lvl && styles.levelButtonTextSelected,
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Generating...' : 'Generate Learning Plan'}
            </Text>
          </TouchableOpacity>
        </View>

        {showContent && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Your Learning Plan</Text>
            
            {/* Videos Section */}
            <View style={styles.videosContainer}>
              <Text style={styles.sectionTitle}>Recommended Videos</Text>
              {generatedContent.videos.map((video, index) => {
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
            <View style={styles.keyPointsContainer}>
              <Text style={styles.sectionTitle}>Key Points</Text>
              {generatedContent.keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPointItem}>
                  <Text style={styles.keyPointText}>• {point}</Text>
                </View>
              ))}
            </View>

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.summaryText}>{generatedContent.summary}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    lineHeight: 36,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7257FF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
    fontFamily: 'Inter-Bold',
  },
  videosContainer: {
    marginBottom: 24,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  watchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  keyPointsContainer: {
    marginBottom: 24,
  },
  keyPointItem: {
    marginBottom: 8,
  },
  keyPointText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  contentContainer: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  levelButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  levelButtonSelected: {
    backgroundColor: '#7257FF',
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  levelButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#7257FF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#7257FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
}); 