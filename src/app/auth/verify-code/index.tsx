import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifySignupCode } from '../../../../api/supabase/auth';

export default function VerifyCodePage() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    setLoading(true);

    try {
      await verifySignupCode(email, code.trim());

      Alert.alert('Success!', 'Your email has been verified.');

      router.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Verification Failed', error.message);
      } else {
        Alert.alert('Verification Failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>Sent to: {email}</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="6-digit code"
        keyboardType="number-pad"
        style={styles.input}
        autoCapitalize="none"
      />

      <Button
        title={loading ? 'Verifying...' : 'Verify'}
        onPress={handleVerify}
        disabled={loading}
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
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 20,
    color: 'gray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
    letterSpacing: 5,
  },
});
