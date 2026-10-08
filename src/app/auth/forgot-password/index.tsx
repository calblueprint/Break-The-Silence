import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/styles/colors';
import BackArrowIcon from '~/assets/Vector.svg';

type Step = 'form' | 'confirm' | 'sent';

// TODO: replace with Keyo's reusable Supabase auth function
async function requestPasswordReset(email: string): Promise<void> {
  void email;
  throw new Error('Password reset request is not implemented yet.');
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFilled = email.trim().length > 0;

  function handleBack() {
    if (step === 'confirm') {
      setStep('form');
    } else {
      router.back();
    }
  }

  function handleContinue() {
    setError(null);
    setStep('confirm');
  }

  async function handleConfirm() {
    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setStep('sent');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send reset email. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <BackArrowIcon style={styles.backArrowIcon} />
      </Pressable>

      {step === 'form' && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>Forgot Password</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            Enter the email you used to sign up with to receive a link to reset
            your password
          </Text>

          <View style={styles.field}>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[
              styles.submitButton,
              {
                backgroundColor: isFilled
                  ? colors.darkGreen
                  : colors.buttonBackground,
              },
            ]}
            disabled={!isFilled}
            onPress={handleContinue}
          >
            <Text
              style={[
                styles.submitButtonText,
                { color: isFilled ? colors.white : colors.text },
              ]}
            >
              Confirm
            </Text>
          </Pressable>
        </View>
      )}

      {step === 'confirm' && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>Confirm your email</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Is this the right email for you?</Text>

          <Text style={styles.emailText}>{email}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.darkGreen }]}
            disabled={loading}
            onPress={handleConfirm}
          >
            <Text style={[styles.submitButtonText, { color: colors.white }]}>
              {loading ? 'Sending...' : 'Confirm'}
            </Text>
          </Pressable>
        </View>
      )}

      {step === 'sent' && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>Email sent!</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            Please check your inbox to find an email to reset your password
          </Text>

          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.darkGreen }]}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={[styles.submitButtonText, { color: colors.white }]}>
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 41,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  backArrowIcon: {
    width: 21.001,
    height: 13.502,
  },
  stepContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 27,
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: 700,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: colors.textMuted,
  },
  field: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 10,
  },
  inputFocused: {
    borderColor: colors.inputFocusBorder,
    backgroundColor: colors.white,
  },
  emailText: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: 700,
    color: colors.darkGreen,
  },
  error: {
    color: 'red',
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 600,
  },
});
