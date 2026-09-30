import { Stack } from 'expo-router';

function ForgotPasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ForgotPasswordLayout;
