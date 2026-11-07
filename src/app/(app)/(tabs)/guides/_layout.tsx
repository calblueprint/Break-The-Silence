import { Stack } from 'expo-router';

export default function GuidesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Toolkit' }} />
      <Stack.Screen name="[slug]" options={{ title: 'Guide' }} />
    </Stack>
  );
}
