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
  signupStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

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
      <Pressable style={shared.backButton} onPress={() => router.back()}>
        <BackArrowIcon style={shared.backArrowIcon} />
      </Pressable>

      <Text style={shared.title}>Create an Account</Text>
      <Text style={styles.subtitle}>
        We need a couple more details from you
      </Text>
      <Text style={styles.securedText}>Your information is secured.</Text>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={shared.label}>First name</Text>
          <TextInput
            style={[styles.input, firstNameFocused && shared.inputFocused]}
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={shared.label}>Last name</Text>
          <TextInput
            style={[styles.input, lastNameFocused && shared.inputFocused]}
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setLastNameFocused(true)}
            onBlur={() => setLastNameFocused(false)}
          />
        </View>
      </View>

      <View style={shared.field}>
        <Text style={shared.label}>Password</Text>
        <View style={shared.passwordWrapper}>
          <TextInput
            style={[
              styles.input,
              shared.passwordInput,
              passwordFocused && shared.inputFocused,
            ]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
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
          style={[styles.input, confirmPasswordFocused && shared.inputFocused]}
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
        />
      </View>

      <View style={shared.field}>
        <Text style={shared.label}>Email</Text>
        <TextInput
          style={[styles.input, emailFocused && shared.inputFocused]}
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
        text={loading ? 'Creating account...' : 'Create an account'}
        disabled={loading}
        onPress={handleSignUp}
        containerStyle={{ width: '100%' }}
        buttonStyle={submitButtonStyle(isFilled)}
        titleStyle={submitButtonTitleStyle(isFilled)}
      />

      <StatusBar style="auto" />
    </View>
  );
}
