import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/styles/colors';

interface SafeExitButtonProps {
  style?: StyleProp<ViewStyle>;
}

// Leaves the app's private screens immediately
export default function SafeExitButton({ style }: SafeExitButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.replace('/')}
      hitSlop={8}
      style={[styles.buttonContainer, style]}
      accessibilityLabel="Safe exit"
    >
      <Text style={styles.text}>SAFE EXIT</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.safeExit,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.overlay,
    shadowOffset: { width: 0, height: 2.686 },
    shadowOpacity: 1,
    shadowRadius: 10.743,
    elevation: 6,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
  },
});
