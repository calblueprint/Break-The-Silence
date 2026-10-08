import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import Logo from '@/components/Logo';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo />
      <Text>Profile</Text>
      <Button
        text="Change Password"
        disabled={false}
        onPress={() => router.push('/auth/reset-password')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
