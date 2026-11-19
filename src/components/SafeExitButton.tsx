import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/styles/safeExitButtonStyles';

interface SafeExitButtonProps {
  style?: StyleProp<ViewStyle>;
  onExit?: () => void;
}

// Leaves the app's private screens immediately
export default function SafeExitButton({ style, onExit }: SafeExitButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        onExit?.();
        router.replace('/');
      }}
      hitSlop={8}
      style={[styles.buttonContainer, style]}
      accessibilityLabel="Safe exit"
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>SAFE EXIT</Text>
    </Pressable>
  );
}
