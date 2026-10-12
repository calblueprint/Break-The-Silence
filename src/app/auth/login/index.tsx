import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button/Button';
import EyeIconOpen from '~/assets/AiOutlineEye.svg';
import EyeIcon from '~/assets/AiOutlineEyeInvisible.svg';
import BTSADVLogo from '~/assets/btsdav-logo.png';
import { signIn } from '../../../../api/supabase/auth';
import {
  LOGIN_FIELD_WIDTH,
  shared,
  loginStyles as styles,
  submitButtonStyle,
  submitButtonTitleStyle,
} from '../styles';

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
              shared.passwordInput,
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
              <EyeIconOpen style={shared.eyeIcon} />
            ) : (
              <EyeIcon style={shared.eyeIcon} />
            )}
          </Pressable>
        </View>
      </View>
      {error ? <Text style={shared.error}>{error}</Text> : null}

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
          buttonStyle={submitButtonStyle(isFilled, {
            width: LOGIN_FIELD_WIDTH,
          })}
          titleStyle={submitButtonTitleStyle(isFilled)}
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
