import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from '@expo-google-fonts/montserrat/useFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import colors from '@/styles/colors';
import { fontAssets } from '@/styles/typography';
import supabase from '../../api/supabase/client';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [fontsLoaded, fontError] = useFonts(fontAssets);

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

    // The welcome screen stays public so auth Back and Safe Exit can reach it.
    if (!session && segments[0] === '(app)') {
      router.replace('/auth/login');
    } else if (session && inAuthGroup && !onUpdatePassword) {
      router.replace('/(app)/(tabs)/home');
    }
  }, [session, initialized, segments]);

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: colors.white } }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
