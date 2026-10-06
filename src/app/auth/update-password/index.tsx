import { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '@/components/Logo';
import { signOut, updatePassword } from '../../../../api/supabase/auth';
import supabase from '../../../../api/supabase/client';

export default function UpdatePassword() {
  const params = useLocalSearchParams<{
    code?: string;
    error_description?: string;
  }>();
  const handled = useRef(false);
  const [ready, setReady] = useState(false);
  const [, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.error_description) {
      setLinkError(params.error_description);
      return;
    }
    if (!params.code || handled.current) return;
    handled.current = true;

    supabase.auth
      .exchangeCodeForSession(params.code)
      .then(async ({ error }) => {
        if (error) {
          setLinkError(error.message);
        } else {
          await AsyncStorage.setItem('recovering', 'true');
          setReady(true);
        }
      });
  }, [params.code, params.error_description]);

  if (!ready) {
    return (
      <View style={styles.container}>
        <Text>Verifying link...</Text>
      </View>
    );
  }

  const handleUpdatePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      await signOut();
      await AsyncStorage.removeItem('recovering');
      Alert.alert('Success', 'Password updated! Please log in.');
      router.replace('/auth/login');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <View style={styles.container}>
        <Text>Verifying link...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Logo />
      <Text>Enter New Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        title={loading ? 'Updating...' : 'Save Password'}
        onPress={handleUpdatePassword}
      />
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
