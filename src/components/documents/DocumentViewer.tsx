import React, {
  ComponentProps,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';
import DocumentNameEditor from '@/components/documents/DocumentNameEditor';
import SafeExitButton from '@/components/SafeExitButton';
import colors from '@/styles/colors';

interface ActionButtonProps {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
  iconColor: string;
  bgColor: string;
  onPress?: () => void;
  disabled?: boolean;
}

interface DocumentViewerProps {
  visible: boolean;
  fileUrl: string | null;
  mimeType?: string;
  fileName?: string;
  isSensitive?: boolean;
  onClose: () => void;
  onExit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => Promise<void>;
  isDeleting?: boolean;
}

export default function DocumentViewer({
  visible,
  fileUrl,
  mimeType,
  fileName = 'Document',
  isSensitive = true,
  onClose,
  onExit,
  onShare,
  onDelete,
  onRename,
  isDeleting = false,
}: DocumentViewerProps) {
  const insets = useSafeAreaInsets();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const editorVersion = useRef(0);

  useEffect(() => {
    setIsRevealed(false);
    setIsRenaming(false);
    editorVersion.current += 1;
  }, [visible, fileUrl]);

  if (!visible || !fileUrl) return null;

  const isImage = mimeType?.startsWith('image/');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="black" />
            <Text style={styles.headerText}>Evidence</Text>
          </Pressable>

          <SafeExitButton
            onExit={() => {
              setIsRevealed(false);
              (onExit ?? onClose)();
            }}
          />
        </View>

        <ScrollView
          ref={scroll}
          testID="document-viewer-scroll"
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <View style={styles.fileInfoContainer}>
            <Text style={styles.fileName}>{fileName}</Text>
            <Text style={styles.fileDate}>Added today</Text>
            {isRenaming && onRename && (
              <DocumentNameEditor
                name={fileName}
                onCancel={() => setIsRenaming(false)}
                onSave={async name => {
                  const version = editorVersion.current;
                  await onRename(name);
                  if (version === editorVersion.current) setIsRenaming(false);
                }}
              />
            )}
          </View>

          <View style={styles.contentContainer}>
            {isImage ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: fileUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />

                {isSensitive && !isRevealed && (
                  <BlurView
                    intensity={80}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                  />
                )}

                {isSensitive && (
                  <View
                    pointerEvents="box-none"
                    style={styles.revealButtonContainer}
                  >
                    <Pressable
                      style={styles.revealButton}
                      onPress={() => setIsRevealed(!isRevealed)}
                    >
                      <Ionicons
                        name={isRevealed ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="white"
                      />
                      <Text style={styles.revealText}>
                        {isRevealed ? 'Hide' : 'Tap to view'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <Feather name="file-text" size={64} color={colors.textMuted} />
                <Text style={styles.placeholderText}>Document Viewer</Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <ActionButton
              icon="share-2"
              label="Share"
              iconColor={colors.primary}
              bgColor="#F3E8FF"
              onPress={onShare}
            />
            <ActionButton
              icon="folder"
              label="Move"
              iconColor="#666"
              bgColor="#F5F5F5"
            />
            <ActionButton
              icon="edit-2"
              label="Rename"
              iconColor={colors.primary}
              bgColor="#F3E8FF"
              onPress={
                onRename
                  ? () => {
                      setIsRenaming(true);
                      scroll.current?.scrollTo({ y: 0, animated: true });
                    }
                  : undefined
              }
              disabled={isDeleting || isRenaming}
            />
            <ActionButton
              icon="trash-2"
              label={isDeleting ? 'Deleting…' : 'Delete'}
              iconColor={colors.error}
              bgColor="#FEE2E2"
              onPress={onDelete}
              disabled={isDeleting || isRenaming}
            />
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Date it happened</Text>
            <Text style={styles.metaValue}>Nov 4, 2026</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const ActionButton = ({
  icon,
  label,
  iconColor,
  bgColor,
  onPress,
  disabled = false,
}: ActionButtonProps) => (
  <View style={styles.actionButtonWrapper}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.actionButton}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <View style={[styles.actionIconBg, { backgroundColor: bgColor }]}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.actionLabel, { color: iconColor }]}>{label}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  fileInfoContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  fileDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  revealButtonContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 38, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
  },
  revealText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Nunito Sans',
  },
  actionButtonWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  metaValue: {
    fontSize: 14,
    color: '#888',
  },
});
