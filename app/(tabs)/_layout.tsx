import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E6E9EB',
          paddingVertical: 16,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#7257FF',
        }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#7257FF',
          href: null,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="trending-up-outline" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#7257FF',
        }}
      />
    </Tabs>
  );
} 