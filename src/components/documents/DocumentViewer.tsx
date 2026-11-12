import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeExitButton from '@/components/SafeExitButton';
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

  const insets = useSafeAreaInsets();

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (fileUrl && fileUrl.includes('SENSITIVE_')) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [fileUrl]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeExitButton
          style={{
            position: 'absolute',
            top: insets.top + 4,
            right: 16,
            zIndex: 999,
          }}
        />

        <Pressable
          onPress={onClose}
          style={[styles.closeButton, { top: insets.top + 4 }]}
        >
          <Text style={styles.closeText}>Close</Text>
        </Pressable>

        {showWarning && (
          <View style={styles.warningOverlay}>
            <Text style={styles.warningTitle}>Sensitive Content</Text>
            <Text style={styles.warningText}>
              This document has been tagged as sensitive.
            </Text>
            <Pressable
              onPress={() => setShowWarning(false)}
              style={styles.consentButton}
            >
              <Text style={styles.consentButtonText}>Show Image</Text>
            </Pressable>
          </View>
        )}

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
    top: 65,
    left: 20,
    zIndex: 999,
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
  warningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  warningTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warningText: {
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  consentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  consentButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
