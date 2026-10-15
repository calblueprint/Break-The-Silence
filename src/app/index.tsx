import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import { authLandingStyles as styles } from './auth/styles';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.tagline}>
        Break the Silence Against Domestic Violence
      </Text>
      <Pressable onPress={() => router.push('/auth/login')}>
        <Text style={styles.enterApp}>Enter App</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}
