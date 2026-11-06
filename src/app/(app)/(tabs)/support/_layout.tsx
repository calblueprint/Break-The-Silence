import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Support' }} />
      <Stack.Screen name="resources/index" options={{ title: 'Resources' }} />
      <Stack.Screen
        name="support-line/index"
        options={{ title: 'Support Line' }}
      />
    </Stack>
  );
}
