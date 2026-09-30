import { Stack } from 'expo-router';

function ResetPasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="Reset Password" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ResetPasswordLayout;
