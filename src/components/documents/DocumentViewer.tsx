import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';

interface DocumentViewerProps {
  visible: boolean;
  fileUrl: string | null;
  mimeType?: string;
  onClose: () => void;
}

export default function DocumentViewer({
  visible,
  fileUrl,
  mimeType,
  onClose,
}: DocumentViewerProps) {
  const isImage = mimeType?.startsWith('image/');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>

        {fileUrl && isImage ? (
          <Image
            style={styles.image}
            source={{ uri: fileUrl }}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.errorText}>
            Preview not available for this file type.
          </Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  closeText: {
    ...typography.entryLink,
    color: colors.white,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  errorText: {
    ...typography.p1,
    color: colors.white,
  },
});
