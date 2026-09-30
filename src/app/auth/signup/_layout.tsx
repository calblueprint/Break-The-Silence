import { Stack } from 'expo-router';

function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen name="Sign Up Page" options={{ headerShown: false }} />
    </Stack>
  );
}

export default SignUpLayout;