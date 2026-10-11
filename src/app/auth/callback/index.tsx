import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import supabase from '../../../../api/supabase/client';

export default function AuthCallbackPage() {
  const params = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const handled = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

        router.replace('/(app)/(tabs)/support');
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
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <>
          <ActivityIndicator />
          <Text style={styles.message}>Confirming your email...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
