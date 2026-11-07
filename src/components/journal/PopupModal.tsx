import type { ReactNode } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeExitButton from '@/components/SafeExitButton';
import { popupModalStyles as styles } from './styles';

interface PopupModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

// A Modal covers the Safe Exit button in the tabs layout, so popups show their
// own copy in the same spot to keep it reachable at all times
export default function PopupModal({
  visible,
  onRequestClose,
  children,
}: PopupModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlayContainer}>{children}</View>
      <SafeExitButton
        style={[styles.safeExitButton, { top: insets.top + 4 }]}
      />
    </Modal>
  );
}
