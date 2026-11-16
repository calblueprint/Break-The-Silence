import type { ReactNode } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeExitButton from '@/components/SafeExitButton';
import { popupModalStyles as styles } from './styles';

interface PopupModalProps {
  visible: boolean;
  // Centered dialog, or a sheet that slides up from the bottom
  variant?: 'dialog' | 'sheet';
  onRequestClose: () => void;
  children: ReactNode;
}

// A Modal covers the Safe Exit button in the tabs layout, so popups show their
// own copy in the same spot to keep it reachable at all times
export default function PopupModal({
  visible,
  variant = 'dialog',
  onRequestClose,
  children,
}: PopupModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType={variant === 'sheet' ? 'slide' : 'fade'}
      onRequestClose={onRequestClose}
    >
      <View
        style={[
          styles.overlayContainer,
          variant === 'sheet' && styles.overlaySheetContainer,
        ]}
      >
        {children}
      </View>
      <SafeExitButton
        style={[styles.safeExitButton, { top: insets.top + 4 }]}
      />
    </Modal>
  );
}
