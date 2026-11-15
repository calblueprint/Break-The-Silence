import { Stack } from 'expo-router';
import { GuideBookmarksProvider } from '@/context/GuideBookmarksContext';

export default function GuidesLayout() {
  return (
    <GuideBookmarksProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="completed" options={{ headerShown: false }} />
      </Stack>
    </GuideBookmarksProvider>
  );
}
