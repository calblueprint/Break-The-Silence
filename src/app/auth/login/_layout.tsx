import { Stack } from 'expo-router';

function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login Page" options={{ headerShown: false }} />
    </Stack>
  );
}

export default LoginLayout;
