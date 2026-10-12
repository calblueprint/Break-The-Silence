import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Support' }} />
      <Stack.Screen name="resources" options={{ title: 'Resources' }} />
      <Stack.Screen name="guides" options={{ title: 'Guides' }} />
      <Stack.Screen name="support-line" options={{ title: 'Support Line' }} />
    </Stack>
  );
}
