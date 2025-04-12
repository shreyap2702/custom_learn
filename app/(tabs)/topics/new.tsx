import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import { addTopicToUser, addUser, logDataStorage } from '../../utils/data';

// Temporary - In a real app, you would get this from your auth context
const CURRENT_USER_ID = '1'; // Replace this with actual user ID from your auth system

export default function NewTopic() {
  const [topic, setTopic] = useState('');
  const [isBeginner, setIsBeginner] = useState('');
  const [isPreparingExam, setIsPreparingExam] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!topic || !isBeginner || !isPreparingExam || !expectedDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // First, create a temporary user if one doesn't exist
      try {
        await addUser({
          name: "Temporary User",
          institution: "Test Institution",
          email: "temp@example.com",
          password: "temppass123"
        });
      } catch (error) {
        console.log('User might already exist:', error);
      }

      // Add topic to user's topics
      const newTopic = await addTopicToUser(CURRENT_USER_ID, {
        title: topic,
        isBeginner: isBeginner === 'Yes',
        isPreparingExam: isPreparingExam === 'Yes',
        expectedDate: expectedDate,
      });

      console.log('New topic created:', newTopic);
      
      // Log the current data storage
      await logDataStorage();
      
      // Navigate to learning screen
      router.push('/(tabs)/topics/learning');
    } catch (error) {
      console.error('Error creating topic:', error);
      Alert.alert('Error', 'Failed to create topic. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Current Learning</Text>
      </View>

      <Text style={styles.title}>Tell us about, what do{'\n'}you want to learn?</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Topic Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Topic"
            value={topic}
            onChangeText={setTopic}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Are you a beginner?</Text>
          <TextInput
            style={styles.input}
            placeholder="Yes or No"
            value={isBeginner}
            onChangeText={setIsBeginner}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preparing for exam?</Text>
          <TextInput
            style={styles.input}
            placeholder="Yes or No"
            value={isPreparingExam}
            onChangeText={setIsPreparingExam}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected date to complete.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter date"
            value={expectedDate}
            onChangeText={setExpectedDate}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add new topic</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  form: {
    paddingHorizontal: 20,
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
  },
  button: {
    backgroundColor: '#EBE8FD',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#7257FF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
}); 