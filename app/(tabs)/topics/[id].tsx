import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TopicDetail() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Topic Detail Page - {id}</Text>
    </View>
  );
} 