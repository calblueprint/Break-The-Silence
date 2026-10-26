import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button/Button';
import {
  PENDING_SIGNUP_EMAIL_KEY,
  resendSignupConfirmation,
} from '../../../../api/supabase/auth';
import supabase from '../../../../api/supabase/client';
import { callbackStyles as styles, submitButtonTitleStyle } from '../styles';

export default function AuthCallbackPage() {
  const params = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const handled = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(PENDING_SIGNUP_EMAIL_KEY)
      .then(storedEmail => {
        if (mounted && storedEmail) {
          setEmail(storedEmail);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) {
          setLoadingEmail(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleResend = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setResending(true);
    setResendError(null);
    setResendMessage(null);

    try {
      await resendSignupConfirmation(trimmedEmail);
      setResendMessage('Confirmation email sent. Check your inbox.');
    } catch (error) {
      setResendError(
        error instanceof Error
          ? error.message
          : 'Unable to resend the confirmation email.',
      );
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (handled.current) return;

    if (params.error || params.error_description) {
      handled.current = true;
      setErrorMessage(
        params.error_description ??
          params.error ??
          'Email confirmation failed.',
      );
      return;
    }

    if (!params.code) return;

    handled.current = true;
    const confirmEmail = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          params.code!,
        );

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        await AsyncStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY).catch(
          () => undefined,
        );
        router.replace('/(app)/(tabs)/home');
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Email confirmation failed.',
        );
      }
    };

    void confirmEmail();
  }, [params.code, params.error, params.error_description]);

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <View style={styles.errorContent}>
          <Text style={styles.error}>{errorMessage}</Text>
          {loadingEmail ? (
            <ActivityIndicator />
          ) : email ? (
            <Text style={styles.message}>
              Resend a new confirmation link to {email}.
            </Text>
          ) : (
            <>
              <Text style={styles.message}>
                Enter your email to receive a new confirmation link.
              </Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </>
          )}
          {resendError ? <Text style={styles.error}>{resendError}</Text> : null}
          {resendMessage ? (
            <Text style={styles.success}>{resendMessage}</Text>
          ) : null}
          <Button
            text={resending ? 'Sending...' : 'Resend confirmation email'}
            disabled={loadingEmail || !email.trim() || resending}
            onPress={handleResend}
            containerStyle={styles.button}
            titleStyle={submitButtonTitleStyle(true)}
          />
        </View>
      ) : (
        <>
          <ActivityIndicator />
          <Text style={styles.message}>Confirming your email...</Text>
        </>
      )}
    </View>
  );
}
