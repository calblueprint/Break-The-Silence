import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './client';

export const PENDING_SIGNUP_EMAIL_KEY = 'pending-signup-email';

export const signUp = async (email: string, password: string) => {
  const emailRedirectTo = Linking.createURL('/auth/callback');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session) {
    await AsyncStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY).catch(
      () => undefined,
    );
  } else {
    await AsyncStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, email).catch(
      () => undefined,
    );
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

export const resendSignupConfirmation = async (email: string) => {
  const emailRedirectTo = Linking.createURL('/auth/callback');

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo,
    },
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
