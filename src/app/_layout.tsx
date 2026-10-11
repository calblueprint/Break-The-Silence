import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import supabase from '../../api/supabase/client';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && (await AsyncStorage.getItem('recovering'))) {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('recovering');
        setSession(null);
      } else {
        setSession(session);
      }
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';
    const onUpdatePassword =
      inAuthGroup && (segments as string[])[1] === 'update-password';

    if (!session && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (session && inAuthGroup && !onUpdatePassword) {
      router.replace('/(app)/(tabs)/support');
    }
  }, [session, initialized, segments]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
