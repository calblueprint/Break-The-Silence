import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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
      <Feather name="x" size={26} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 44,
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: colors.safeExit,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.safeExit,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
