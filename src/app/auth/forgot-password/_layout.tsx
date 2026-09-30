import { Stack } from 'expo-router';

function ForgotPasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="Forgot Password" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ForgotPasswordLayout;