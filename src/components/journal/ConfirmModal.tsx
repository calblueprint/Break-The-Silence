import { Modal, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import { confirmModalStyles as styles } from './styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Save this entry? / Discard style dialog
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlayContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>
          <Button
            disabled={false}
            text={confirmText}
            onPress={onConfirm}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
          <Button
            disabled={false}
            text="Go Back"
            onPress={onCancel}
            containerStyle={styles.buttonContainer}
            buttonStyle={[styles.button, styles.secondaryButton]}
            titleStyle={[styles.buttonText, styles.secondaryButtonText]}
          />
        </View>
      </View>
    </Modal>
  );
}
