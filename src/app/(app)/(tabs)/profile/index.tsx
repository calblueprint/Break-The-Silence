import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import Logo from '@/components/Logo';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';
import { signOut } from '../../../../../api/supabase/auth';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.titleText}>Profile</Text>

      <Button
        text="Documents (POC)"
        disabled={false}
        onPress={() => router.push('/documents')}
      />

      <Button
        text="Sign Out"
        disabled={false}
        onPress={async () => {
          await signOut();
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  titleText: {
    ...typography.h3,
    color: colors.text,
  },
});
