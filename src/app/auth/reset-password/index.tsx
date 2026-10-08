import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/styles/colors';
import EyeIconOpen from '~/assets/AiOutlineEye.svg';
import EyeIcon from '~/assets/AiOutlineEyeInvisible.svg';
import BackArrowIcon from '~/assets/Vector.svg';

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
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <BackArrowIcon style={styles.backArrowIcon} />
      </Pressable>

      <View style={styles.stepContent}>
        <Text style={styles.title}>Reset Password</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Choose a new password</Text>

        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                newPasswordFocused && styles.inputFocused,
              ]}
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? (
                <EyeIconOpen style={styles.eyeIcon} />
              ) : (
                <EyeIcon style={styles.eyeIcon} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={[
              styles.input,
              confirmPasswordFocused && styles.inputFocused,
            ]}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
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
          disabled={!isFilled || loading}
          onPress={handleUpdate}
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: isFilled ? colors.white : colors.text },
            ]}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Text>
        </Pressable>
      </View>

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
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: colors.text,
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
  passwordWrapper: {
    width: '100%',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    height: 44,
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
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
