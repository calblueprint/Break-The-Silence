import * as Linking from 'expo-linking';
import supabase from './client';

export const signUp = async (email: string, password: string) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.',
    );
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const sendPasswordReset = async (email: string) => {
  const resetUrl = Linking.createURL('/auth/update-password');

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetUrl,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const verifySignupCode = async (email: string, otpCode: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: otpCode,
    type: 'signup',
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
