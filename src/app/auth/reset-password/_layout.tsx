import { Stack } from 'expo-router';

function ResetPasswordLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ResetPasswordLayout;
