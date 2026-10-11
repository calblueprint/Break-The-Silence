import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import { signUp } from '../../../../api/supabase/auth';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { session } = await signUp(email.trim(), password);

      if (!session) {
        setMessage(
          'Check your email and open the confirmation link on this device to finish signing up.',
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sign Up Failed', error.message);
      } else {
        Alert.alert('Sign Up Failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text>Sign Up Page</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      ></TextInput>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
      ></TextInput>
      <Button
        title={loading ? 'Signing up...' : 'Sign Up'}
        onPress={handleSignUp}
        disabled={loading}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button
        title="Already have an account? Log In"
        onPress={() => router.push('/auth/login')}
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
  },
  message: {
    marginTop: 12,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});
