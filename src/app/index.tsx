import { StyleSheet, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Logo from '@/components/Logo';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo />

      <Text>Break the Silence Against Domestic Violence</Text>

      <Pressable onPress={() => router.push('/support')}>
        <Text style={styles.enterApp}>Enter App</Text>
      </Pressable>

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
  },
  enterApp: {
    padding: 20,
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 18
  },
});
