import { Stack } from 'expo-router';

function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SignUpLayout;
