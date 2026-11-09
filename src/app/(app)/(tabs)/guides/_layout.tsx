import { Stack } from 'expo-router';

export default function GuidesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[slug]" options={{ headerShown: false }} />
    </Stack>
  );
}
