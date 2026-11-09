import { Stack } from 'expo-router';
import colors from '@/styles/colors';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
