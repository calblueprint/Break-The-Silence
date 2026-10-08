import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/styles/colors';
import EyeIconOpen from '~/assets/AiOutlineEye.svg';
import EyeIcon from '~/assets/AiOutlineEyeInvisible.svg';
import BackArrowIcon from '~/assets/Vector.svg';

// Replace with Keyo's auth function
async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<void> {
  void email;
  void password;
  void firstName;
  void lastName;
  throw new Error('Sign up is not implemented yet.');
}

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFilled =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    email.trim().length > 0;

  async function handleSignUp() {
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, firstName, lastName);
      router.replace('/support');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create account. Please try again.',
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

      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>
        We need a couple more details from you
      </Text>
      <Text style={styles.securedText}>Your information is secured.</Text>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={[styles.input, firstNameFocused && styles.inputFocused]}
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={[styles.input, lastNameFocused && styles.inputFocused]}
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setLastNameFocused(true)}
            onBlur={() => setLastNameFocused(false)}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              passwordFocused && styles.inputFocused,
            ]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
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
          style={[styles.input, confirmPasswordFocused && styles.inputFocused]}
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
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
        disabled={loading}
        onPress={handleSignUp}
      >
        <Text
          style={[
            styles.submitButtonText,
            { color: isFilled ? colors.white : colors.text },
          ]}
        >
          {loading ? 'Creating account...' : 'Create an account'}
        </Text>
      </Pressable>

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
    paddingHorizontal: 24,
    paddingBottom: 48,
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
  title: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: 700,
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    fontWeight: 400,
    color: colors.text,
  },
  securedText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    fontWeight: 400,
    lineHeight: 17,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  halfField: {
    flex: 1,
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
    height: 40,
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
    backgroundColor: colors.darkGreen,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 600,
  },
});
