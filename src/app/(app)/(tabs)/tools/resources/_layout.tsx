import { Stack } from 'expo-router';
import { ResourcesProvider } from '@/context/ResourcesContext';

export default function ResourcesLayout() {
  return (
    <ResourcesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="category" />
      </Stack>
    </ResourcesProvider>
  );
}
