import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import { signOut } from '../../../../../api/supabase/auth';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        title="Sign Out"
        onPress={async () => {
          await signOut();
        }}
      />
      <Logo />
      <Text>Main Support</Text>
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
});
