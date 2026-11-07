import { Text, View } from 'react-native';
import { toastStyles as styles } from './styles';

interface ToastProps {
  message: string;
}

// Short confirmation that floats above the tab bar, like "Changes saved!"
export default function Toast({ message }: ToastProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}
