import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import BackArrowIcon from '~/assets/Vector.svg';
import { sendPasswordReset } from '../../../../api/supabase/auth';
import {
  shared,
  forgotPasswordStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

type Step = 'form' | 'confirm' | 'sent';

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
      await sendPasswordReset(email.trim());
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
      <Pressable style={shared.backButton} onPress={handleBack}>
        <BackArrowIcon style={shared.backArrowIcon} />
      </Pressable>

      <View style={styles.centerContent}>
        {step === 'form' && (
          <View style={shared.stepContent}>
            <Text style={shared.title}>Forgot Password</Text>
            <View style={shared.divider} />
            <Text style={shared.subtitle}>
              Enter the email you used to sign up with to receive a link to
              reset your password
            </Text>

            <View style={shared.field}>
              <TextInput
                style={[shared.input, emailFocused && shared.inputFocused]}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {error ? <Text style={shared.error}>{error}</Text> : null}

            <Button
              text="Confirm"
              disabled={!isFilled}
              onPress={handleContinue}
              containerStyle={{ width: '100%' }}
              buttonStyle={submitButtonStyle(isFilled)}
              titleStyle={submitButtonTitleStyle(isFilled)}
            />
          </View>
        )}

        {step === 'confirm' && (
          <View style={shared.stepContent}>
            <Text style={shared.title}>Confirm your email</Text>
            <View style={shared.divider} />
            <Text style={shared.subtitle}>
              Is this the right email for you?
            </Text>

            <Text style={styles.emailText}>{email}</Text>

            {error ? <Text style={shared.error}>{error}</Text> : null}

            <Button
              text={loading ? 'Sending...' : 'Confirm'}
              disabled={loading}
              onPress={handleConfirm}
              containerStyle={{ width: '100%' }}
              buttonStyle={submitButtonStyle(true)}
              titleStyle={submitButtonTitleStyle(true)}
            />
          </View>
        )}

        {step === 'sent' && (
          <View style={shared.stepContent}>
            <Text style={shared.title}>Email sent!</Text>
            <View style={shared.divider} />
            <Text style={shared.subtitle}>
              Please check your inbox to find an email to reset your password
            </Text>

            <Button
              text="Back to Sign In"
              disabled={false}
              onPress={() => router.replace('/auth/login')}
              containerStyle={{ width: '100%' }}
              buttonStyle={submitButtonStyle(true)}
              titleStyle={submitButtonTitleStyle(true)}
            />
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
