import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import colors from '@/styles/colors';
import EyeIconOpen from '~/assets/AiOutlineEye.svg';
import EyeIcon from '~/assets/AiOutlineEyeInvisible.svg';
import BTSADVLogo from '~/assets/btsdav-logo.png';

// TODO: replace with Keyo's reusable Supabase auth function
async function signIn(email: string, password: string): Promise<void> {
  void email;
  void password;
  throw new Error('Sign in is not implemented yet.');
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFilled = email.trim().length > 0 && password.trim().length > 0;

  async function handleSignIn() {
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace('/support');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={BTSADVLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.signInText}>Sign In</Text>
      <View style={styles.divider} />

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
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.forgotPasswordRow}>
        <Link href="/auth/forgot-password">
          <Text>Forgot Password</Text>
        </Link>
      </View>

      <View style={styles.field}>
        <Button
          text={loading ? 'Logging In...' : 'Log In'}
          disabled={loading}
          onPress={handleSignIn}
          buttonStyle={{
            width: 318,
            height: 48,
            backgroundColor: isFilled
              ? colors.primary
              : colors.buttonBackground,
          }}
          titleStyle={{ color: isFilled ? colors.white : colors.text }}
        />
      </View>

      <Text style={styles.signUpRow}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup">
          <Text style={styles.signUpLink}>Sign Up</Text>
        </Link>
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 115,
    paddingBottom: 241,
    paddingHorizontal: 24,
    gap: 12,
  },
  logo: {
    width: 274,
    height: 81,
    flexShrink: 0,
    alignSelf: 'center',
    marginBottom: 5,
  },
  signInText: {
    width: 318,
    alignSelf: 'center',
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: 400,
    marginBottom: 9,
  },
  divider: {
    width: 318,
    height: 1,
    alignSelf: 'center',
    backgroundColor: colors.border,
    marginBottom: 9,
  },
  field: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    width: 318,
    marginBottom: 4,
  },
  input: {
    width: 318,
    height: 40,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 10,
  },
  passwordWrapper: {
    width: 318,
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    height: 40,
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  error: {
    color: 'red',
  },
  forgotPasswordRow: {
    width: 318,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  signUpRow: {
    alignSelf: 'center',
  },
  signUpLink: {
    color: colors.primary,
  },
});
