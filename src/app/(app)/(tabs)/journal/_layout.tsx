import { Stack } from 'expo-router';
import { JournalProvider } from '@/context/JournalContext';

export default function JournalLayout() {
  return (
    <JournalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="new_entry" />
        <Stack.Screen name="[id]" />
      </Stack>
    </JournalProvider>
  );
}
