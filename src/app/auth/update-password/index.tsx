import { useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button/Button';
import Logo from '@/components/Logo';
import { signOut, updatePassword } from '../../../../api/supabase/auth';
import supabase from '../../../../api/supabase/client';
import {
  shared,
  updatePasswordStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

export default function UpdatePassword() {
  const params = useLocalSearchParams<{
    code?: string;
    error_description?: string;
  }>();
  const handled = useRef(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
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
        {linkError ? (
          <Text style={styles.linkError}>{linkError}</Text>
        ) : (
          <Text style={styles.message}>Verifying Link...</Text>
        )}
      </View>
    );
  }

  const handleUpdatePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character.',
      );
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

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Enter New Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        text={loading ? 'Updating...' : 'Save Password'}
        disabled={!password || loading}
        onPress={handleUpdatePassword}
        containerStyle={shared.fullWidth}
        buttonStyle={submitButtonStyle(Boolean(password))}
        titleStyle={submitButtonTitleStyle(Boolean(password))}
      />
    </View>
  );
}
