import type { ToastOptions } from '@/context/JournalContext';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import GreenTickIcon from '~/assets/greentick.svg';
import { toastStyles as styles } from './styles';

interface ToastProps extends ToastOptions {
  message: string;
  // Sits above the floating New entry / Edit button instead of the tab dock
  raised: boolean;
}

// Short confirmation that floats above the tab bar, like "Changes saved!"
export default function Toast({
  message,
  icon = 'check',
  actionText,
  onAction,
  raised,
}: ToastProps) {
  return (
    <View
      style={[styles.container, raised && styles.raisedContainer]}
      accessibilityLiveRegion="polite"
    >
      {icon === 'trash' ? (
        <Feather name="trash-2" size={20} color={colors.white} />
      ) : (
        <GreenTickIcon width={20} height={20} />
      )}
      <Text style={styles.messageText}>{message}</Text>
      {actionText && onAction ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
