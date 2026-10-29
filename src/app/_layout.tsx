import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat/400Regular_Italic';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { useFonts } from '@expo-google-fonts/montserrat/useFonts';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import supabase from '../../api/supabase/client';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: Montserrat_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-Italic': Montserrat_400Regular_Italic,
    'Nunito Sans': NunitoSans_400Regular,
  });

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
      router.replace('/(app)/(tabs)/home');
    }
  }, [session, initialized, segments]);

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
