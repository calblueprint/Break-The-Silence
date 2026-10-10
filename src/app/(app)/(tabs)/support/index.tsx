import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import { signOut } from '../../../../../api/supabase/auth';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Support() {
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
      <Text>Support</Text>

      <Link href="/support/guides">
        Guides
      </Link>

      <Link href="/support/resources">
        Resources
      </Link>

      <Link href="/support/support-line">
        Support Line
      </Link>
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
