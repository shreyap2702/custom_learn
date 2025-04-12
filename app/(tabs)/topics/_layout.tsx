import { Stack } from 'expo-router';

export default function TopicsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 