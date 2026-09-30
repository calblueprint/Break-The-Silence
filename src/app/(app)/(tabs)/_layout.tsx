import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

// This is where the navigation should be!

function StackLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default StackLayout;
