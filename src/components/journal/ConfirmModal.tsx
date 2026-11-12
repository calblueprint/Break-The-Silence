import { Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import PopupModal from './PopupModal';
import { confirmModalStyles as styles } from './styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  // Disables both buttons while the confirmed action is running
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Save this entry? / Discard / Delete style dialog
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <PopupModal
      visible={visible}
      onRequestClose={() => {
        if (!busy) onCancel();
      }}
    >
      <View style={styles.dialogContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
        <Button
          disabled={busy}
          text={confirmText}
          onPress={onConfirm}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        <Button
          disabled={busy}
          text="Go Back"
          onPress={onCancel}
          containerStyle={styles.buttonContainer}
          buttonStyle={[styles.button, styles.secondaryButton]}
          titleStyle={[styles.buttonText, styles.secondaryButtonText]}
        />
      </View>
    </PopupModal>
  );
}
