import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import BackArrowIcon from '~/assets/Vector.svg';
import {
  resendSignupCode,
  verifySignupCode,
} from '../../../../api/supabase/auth';
import {
  shared,
  verifyCodeStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

type VerificationError = {
  title: string;
  message: string;
};

export default function VerifyCodePage() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const signupEmail = typeof email === 'string' ? email.trim() : '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationError, setVerificationError] =
    useState<VerificationError | null>(null);
  const displayError =
    verificationError ??
    (!signupEmail
      ? {
          title: 'Missing Email',
          message: 'Please return to sign in and try again.',
        }
      : null);

  const handleVerify = async () => {
    if (!signupEmail) {
      Alert.alert('Missing Email', 'Please return to sign up and try again.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert(
        'Invalid Code',
        'Please enter the 6-digit verification code.',
      );
      return;
    }

    setLoading(true);

    try {
      await verifySignupCode(signupEmail, code);

      Alert.alert('Success!', 'Your email has been verified.');

      router.replace('/(app)/(tabs)/home');
    } catch (error) {
      setVerificationError({
        title: 'Verification Failed',
        message:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!signupEmail) {
      Alert.alert('Missing Email', 'Please return to sign up and try again.');
      return;
    }

    setResending(true);

    try {
      await resendSignupCode(signupEmail);
      Alert.alert(
        'Code Sent',
        `A new verification code was sent to ${signupEmail}.`,
      );
    } catch (error) {
      setVerificationError({
        title: 'Unable to Resend Code',
        message:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={shared.backButton} onPress={() => router.back()}>
        <BackArrowIcon style={shared.backArrowIcon} />
      </Pressable>

      <View style={styles.centerContent}>
        {displayError ? (
          <View style={shared.stepContent}>
            <Text style={shared.title}>{displayError.title}</Text>
            <View style={shared.divider} />
            <Text style={shared.subtitle}>{displayError.message}</Text>

            <Button
              text="Back to Sign In"
              disabled={false}
              onPress={() => router.replace('/auth/login')}
              containerStyle={styles.failureButton}
              buttonStyle={submitButtonStyle(true)}
              titleStyle={submitButtonTitleStyle(true)}
            />
          </View>
        ) : (
          <View style={shared.stepContent}>
            <Text style={shared.title}>Enter Verification Code</Text>
            <View style={shared.divider} />
            <Text style={shared.subtitle}>
              {signupEmail
                ? `Sent to: ${signupEmail}`
                : 'Signup email unavailable'}
            </Text>

            <TextInput
              value={code}
              onChangeText={value =>
                setCode(value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleVerify}
              style={[shared.input, styles.codeInput]}
              autoCapitalize="none"
            />

            <Button
              text={loading ? 'Verifying...' : 'Verify'}
              onPress={handleVerify}
              disabled={
                loading || resending || code.length !== 6 || !signupEmail
              }
              containerStyle={shared.fullWidth}
              buttonStyle={submitButtonStyle(code.length === 6)}
              titleStyle={submitButtonTitleStyle(code.length === 6)}
            />

            <Button
              text={resending ? 'Resending...' : 'Resend Code'}
              onPress={handleResend}
              disabled={loading || resending || !signupEmail}
              containerStyle={shared.fullWidth}
              buttonStyle={submitButtonStyle(Boolean(signupEmail))}
              titleStyle={submitButtonTitleStyle(Boolean(signupEmail))}
            />
          </View>
        )}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
