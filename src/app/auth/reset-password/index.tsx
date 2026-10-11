import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import EyeIconOpen from '~/assets/AiOutlineEye.svg';
import EyeIcon from '~/assets/AiOutlineEyeInvisible.svg';
import BackArrowIcon from '~/assets/Vector.svg';
import {
  shared,
  resetPasswordStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

// Replace with Keyo's code
async function updatePassword(newPassword: string): Promise<void> {
  void newPassword;
  throw new Error('Password update is not implemented yet.');
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFilled =
    newPassword.trim().length > 0 && confirmPassword.trim().length > 0;

  async function handleUpdate() {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      router.replace('/auth/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={shared.backButton} onPress={() => router.back()}>
        <BackArrowIcon style={shared.backArrowIcon} />
      </Pressable>

      <View style={shared.stepContent}>
        <Text style={shared.title}>Reset Password</Text>
        <View style={shared.divider} />
        <Text style={shared.subtitle}>Choose a new password</Text>

        <View style={shared.field}>
          <Text style={shared.label}>New password</Text>
          <View style={shared.passwordWrapper}>
            <TextInput
              style={[
                shared.input,
                shared.passwordInput,
                newPasswordFocused && shared.inputFocused,
              ]}
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
            />
            <Pressable
              style={shared.eyeButton}
              onPress={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <EyeIconOpen style={shared.eyeIcon} />
              ) : (
                <EyeIcon style={shared.eyeIcon} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={shared.field}>
          <Text style={shared.label}>Confirm password</Text>
          <TextInput
            style={[
              shared.input,
              confirmPasswordFocused && shared.inputFocused,
            ]}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
          />
        </View>

        {error ? <Text style={shared.error}>{error}</Text> : null}

        <Button
          text={loading ? 'Updating...' : 'Update Password'}
          disabled={!isFilled || loading}
          onPress={handleUpdate}
          containerStyle={{ width: '100%' }}
          buttonStyle={submitButtonStyle(isFilled)}
          titleStyle={submitButtonTitleStyle(isFilled)}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
