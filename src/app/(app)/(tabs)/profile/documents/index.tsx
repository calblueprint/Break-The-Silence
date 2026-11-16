import type { ComponentProps } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import DocumentNameEditor from '@/components/documents/DocumentNameEditor';
import DocumentViewer from '@/components/documents/DocumentViewer';
import SafeExitButton from '@/components/SafeExitButton';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import colors from '@/styles/colors';
import guideDetailStyles from '@/styles/guideDetailStyles';
import {
  getDocumentDisplayName,
  isSensitiveDocument,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
} from '@/utils/documentFiles';
import { getDocumentUploadError } from '@/utils/documentUploadErrors';
import {
  deleteFileFromSupabase,
  fetchUploadedFiles,
  getSecureFileUrl,
  removeSharedFile,
  renameDocument,
  uploadFileToSupabase,
} from '../../../../../../api/supabase/storage/documents';

interface UploadedFile {
  id: string | null;
  name: string;
  displayName?: string;
  fullPath: string;
  metadata?: {
    mimetype?: string;
    size?: number;
  };
  isShared?: boolean;
}

export default function MyDocumentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMounted = useIsMountedRef();
  const exitRequested = useRef(false);
  const deletionInProgress = useRef(false);
  const renameInProgress = useRef(false);
  const currentFullPathRef = useRef<string | null>(null);
  const isActive = useCallback(
    () => isMounted.current && !exitRequested.current,
    [isMounted],
  );

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentViewUrl, setCurrentViewUrl] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string | undefined>(
    undefined,
  );
  const [currentFileName, setCurrentFileName] = useState<string>('Document');
  const [currentFullPath, setCurrentFullPath] = useState<string | null>(null);

  const [selectedUploads, setSelectedUploads] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [isSensitiveUpload, setIsSensitiveUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUploadIndex, setEditingUploadIndex] = useState<number | null>(
    null,
  );

  const closeViewer = useCallback(() => {
    currentFullPathRef.current = null;
    setViewerVisible(false);
    setCurrentViewUrl(null);
    setCurrentMimeType(undefined);
    setCurrentFileName('Document');
    setCurrentFullPath(null);
  }, []);

  const closeUploadModal = useCallback(() => {
    setUploadModalVisible(false);
    setSelectedUploads([]);
    setIsSensitiveUpload(false);
    setEditingUploadIndex(null);
  }, []);

  const handleSafeExit = () => {
    // Close native modals before navigation, and ignore pending async results.
    exitRequested.current = true;
    closeUploadModal();
    closeViewer();
    setFiles([]);
    setLoading(false);
  };

  const loadFiles = useCallback(async () => {
    try {
      const data = await fetchUploadedFiles();
      if (isActive()) setFiles((data as UploadedFile[]) || []);
    } catch (error) {
      if (isActive()) console.error(error);
    }
  }, [isActive]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled || !isActive()) return;

      setSelectedUploads(result.assets);
      setIsSensitiveUpload(true);
      setUploadModalVisible(true);
    } catch (error) {
      if (!isActive()) return;
      console.error(error);
      Alert.alert('Error', 'Failed to select files.');
    }
  };

  const confirmAndUploadFiles = async () => {
    if (
      !isActive() ||
      loading ||
      editingUploadIndex !== null ||
      selectedUploads.length === 0
    )
      return;
    setLoading(true);
    const uploadErrors = new Set<string>();
    let uploadedCount = 0;

    for (const file of selectedUploads) {
      if (!isActive()) return;
      if (file.size && file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
        uploadErrors.add('Files must be 10 MB or smaller.');
        continue;
      }

      const finalFileName = isSensitiveUpload
        ? `SENSITIVE_${file.name}`
        : file.name;
      try {
        await uploadFileToSupabase(
          file.uri,
          finalFileName,
          file.mimeType ?? 'application/octet-stream',
        );
        uploadedCount += 1;
      } catch (err) {
        if (!isActive()) return;
        uploadErrors.add(getDocumentUploadError(err).userMessage);
      }
    }

    if (!isActive()) return;
    setLoading(false);
    closeUploadModal();

    if (uploadErrors.size === 0) {
      Alert.alert('Success', 'All files uploaded securely!');
    } else {
      Alert.alert(
        uploadedCount > 0 ? 'Some files were not uploaded' : 'Upload failed',
        [...uploadErrors].join('\n\n'),
      );
    }

    await loadFiles();
  };

  const handleOpenFile = async (file: UploadedFile) => {
    if (!isActive()) return;
    try {
      setLoading(true);
      const secureUrl = await getSecureFileUrl(file.fullPath);
      if (!isActive()) return;
      setCurrentViewUrl(secureUrl);
      setCurrentMimeType(file.metadata?.mimetype);
      setCurrentFileName(getDocumentDisplayName(file));
      currentFullPathRef.current = file.fullPath;
      setCurrentFullPath(file.fullPath);
      setViewerVisible(true);
    } catch (error) {
      if (!isActive()) return;
      console.error(error);
      Alert.alert('Error', 'Could not open file.');
    } finally {
      if (isActive()) setLoading(false);
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    if (!isActive() || deletionInProgress.current || renameInProgress.current)
      return;
    deletionInProgress.current = true;
    setIsDeleting(true);
    try {
      setLoading(true);
      if (file.isShared) {
        if (!file.id) throw new Error('Shared document is unavailable.');
        await removeSharedFile(file.id);
      } else {
        await deleteFileFromSupabase(file.fullPath);
      }
      if (!isActive()) return;
      if (currentFullPathRef.current === file.fullPath) closeViewer();
      await loadFiles();
    } catch (error) {
      if (!isActive()) return;
      const { code, status } = getDocumentUploadError(error);
      console.warn('Document deletion failed', { code, status });
      Alert.alert('Error', 'Failed to delete file.');
    } finally {
      deletionInProgress.current = false;
      if (isActive()) {
        setIsDeleting(false);
        setLoading(false);
      }
    }
  };

  const handleRenameFile = async (file: UploadedFile, name: string) => {
    if (!isActive()) return;
    if (deletionInProgress.current || renameInProgress.current) {
      throw new Error('Wait for the current change to finish.');
    }
    if (file.isShared || !file.id) {
      throw new Error('Only the owner can rename this document.');
    }
    renameInProgress.current = true;
    try {
      const displayName = await renameDocument(file.fullPath, file.id, name);
      if (!isActive()) return;
      setFiles(previous =>
        previous.map(item =>
          item.fullPath === file.fullPath ? { ...item, displayName } : item,
        ),
      );
      if (currentFullPathRef.current === file.fullPath) {
        setCurrentFileName(displayName);
      }
    } finally {
      renameInProgress.current = false;
    }
  };

  const handleShareFile = () => {
    if (!isActive()) return;
    Alert.alert('Feature in progress');
  };

  const confirmDelete = (file: UploadedFile) => {
    if (!isActive() || deletionInProgress.current || renameInProgress.current)
      return;
    Alert.alert(
      file.isShared ? 'Remove Shared Document' : 'Delete Document',
      file.isShared
        ? 'Remove this shared document from your list? The owner’s file will be kept.'
        : 'Are you sure you want to permanently delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: file.isShared ? 'Remove' : 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteFile(file),
        },
      ],
    );
  };

  const openFileOptions = (file: UploadedFile) => {
    Alert.alert('File Options', getDocumentDisplayName(file), [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: handleShareFile },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => confirmDelete(file),
      },
    ]);
  };

  const currentFile = files.find(file => file.fullPath === currentFullPath);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={guideDetailStyles.detailHeader}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={guideDetailStyles.detailHeaderLabel}>Profile</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Documents</Text>
        <Text style={styles.subtitle}>Private unless you choose to share</Text>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={colors.navInactive} />
          <TextInput
            placeholder="Search documents"
            style={styles.searchInput}
            placeholderTextColor={colors.navInactive}
          />
        </View>

        <Text style={styles.sectionTitle}>Folders</Text>
        <View style={styles.cardWrapper}>
          <FolderRow
            icon="lock"
            name="Confidential"
            details="1 subfolder • 3 files"
          />
          <View style={styles.divider} />
          <FolderRow icon="folder" name="Everyday" details="4 files" />
          <View style={styles.divider} />
          <FolderRow
            icon="camera"
            name="Evidence"
            details="3 subfolders • 5 files"
          />
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recently added</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        <View style={styles.cardWrapper}>
          {files.length === 0 ? (
            <Text style={styles.emptyText}>No files uploaded yet.</Text>
          ) : (
            files.map((file, index) => (
              <View key={file.id ?? file.name}>
                <View style={styles.fileRow}>
                  <Pressable
                    style={styles.fileOpenButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Open document ${getDocumentDisplayName(file)}`}
                    onPress={() => handleOpenFile(file)}
                  >
                    <View
                      style={[
                        styles.fileIconBox,
                        isSensitiveDocument(file.name) &&
                          styles.sensitiveIconBox,
                      ]}
                    >
                      <Ionicons
                        name={
                          isSensitiveDocument(file.name)
                            ? 'eye-off-outline'
                            : file.metadata?.mimetype?.startsWith('image/')
                              ? 'image-outline'
                              : 'document-text-outline'
                        }
                        size={20}
                        color={
                          isSensitiveDocument(file.name)
                            ? 'white'
                            : colors.primary
                        }
                      />
                    </View>
                    <View style={styles.fileRowText}>
                      <Text numberOfLines={1} style={styles.fileRowTitle}>
                        {getDocumentDisplayName(file)}
                      </Text>
                      <Text style={styles.fileRowDetails}>
                        {file.metadata?.mimetype
                          ?.split('/')[1]
                          ?.toUpperCase() ?? 'FILE'}{' '}
                        • {((file.metadata?.size ?? 0) / 1024).toFixed(0)} KB
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Options for ${getDocumentDisplayName(file)}`}
                    onPress={() => openFileOptions(file)}
                    style={{ padding: 8 }}
                  >
                    <Feather name="more-horizontal" size={20} color="#666" />
                  </Pressable>
                </View>
                {index < files.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        style={styles.floatingUploadBtn}
        accessibilityRole="button"
        accessibilityLabel="Upload files"
        onPress={handleSelectFiles}
        disabled={loading}
      >
        <Feather name="upload" size={20} color="white" />
        <Text style={styles.uploadText}>Upload files</Text>
      </Pressable>

      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          if (!loading) closeUploadModal();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.modalContainer,
            { paddingTop: Math.max(insets.top, 20) },
          ]}
        >
          <View style={styles.modalSafeExitRow}>
            <SafeExitButton onExit={handleSafeExit} />
          </View>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Save {selectedUploads.length} files
            </Text>
            <Pressable onPress={closeUploadModal} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.cardWrapper}>
              {selectedUploads.map((file, index) => (
                <View key={index}>
                  <View style={styles.fileRow}>
                    <View style={styles.sensitiveIconBox}>
                      <Ionicons
                        name="eye-off-outline"
                        size={20}
                        color="white"
                      />
                    </View>
                    <View style={styles.fileRowText}>
                      <Text numberOfLines={1} style={styles.fileRowTitle}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileRowDetails}>
                        {file.mimeType?.split('/')[1]?.toUpperCase() ?? 'FILE'}{' '}
                        • {((file.size ?? 0) / 1024).toFixed(0)} KB
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Rename ${file.name}`}
                      style={{ padding: 12 }}
                      disabled={loading || editingUploadIndex !== null}
                      onPress={() => setEditingUploadIndex(index)}
                    >
                      <Feather name="edit-2" size={18} color={colors.primary} />
                    </Pressable>
                  </View>
                  {editingUploadIndex === index && (
                    <DocumentNameEditor
                      name={file.name}
                      onCancel={() => setEditingUploadIndex(null)}
                      onSave={name => {
                        if (!isActive()) return;
                        setSelectedUploads(previous =>
                          previous.map((asset, assetIndex) =>
                            assetIndex === index ? { ...asset, name } : asset,
                          ),
                        );
                        setEditingUploadIndex(null);
                      }}
                    />
                  )}
                  {index < selectedUploads.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>

            <View style={styles.toggleCard}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Blur these photos</Text>
                <Text style={styles.toggleSubtitle}>
                  You tap to view each one
                </Text>
              </View>
              <Switch
                value={isSensitiveUpload}
                onValueChange={setIsSensitiveUpload}
                trackColor={{ false: '#E2E8F0', true: colors.primary }}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save selected files"
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={confirmAndUploadFiles}
              disabled={
                loading ||
                editingUploadIndex !== null ||
                selectedUploads.length === 0
              }
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save {selectedUploads.length} files
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <StatusBar style="dark" />
      <DocumentViewer
        visible={viewerVisible}
        fileUrl={currentViewUrl}
        mimeType={currentMimeType}
        fileName={currentFileName}
        isSensitive={currentFile ? isSensitiveDocument(currentFile.name) : true}

        onShare={handleShareFile}
        onDelete={currentFile ? () => confirmDelete(currentFile) : undefined}
        onRename={
          currentFile && !currentFile.isShared
            ? name => handleRenameFile(currentFile, name)
            : undefined
        }
        isDeleting={isDeleting}
        onExit={handleSafeExit}
        onClose={closeViewer}
      />
    </View>
  );
}

interface FolderRowProps {
  icon: ComponentProps<typeof Feather>['name'];
  name: string;
  details: string;
}

const FolderRow = ({ icon, name, details }: FolderRowProps) => (
  <Pressable style={styles.fileRow}>
    <View style={styles.fileIconBox}>
      <Feather name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.fileRowText}>
      <Text style={styles.fileRowTitle}>{name}</Text>
      <Text style={styles.fileRowDetails}>{details}</Text>
    </View>
    <Feather name="chevron-right" size={20} color={colors.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    marginTop: 4,
    fontFamily: 'Nunito Sans',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: { marginLeft: 10, fontSize: 16, flex: 1, color: colors.text },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  cardWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  fileRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  fileOpenButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sensitiveIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#475569',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileRowText: { flex: 1 },
  fileRowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito Sans',
  },
  fileRowDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontFamily: 'Nunito Sans',
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 12,
    fontFamily: 'Nunito Sans',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    paddingVertical: 10,
    fontFamily: 'Nunito Sans',
  },
  floatingUploadBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 145,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  uploadText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
  },

  modalContainer: { flex: 1, backgroundColor: colors.white },
  modalSafeExitRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  cancelText: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  modalScroll: { padding: 20 },
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 40,
  },
  toggleTextContainer: { flex: 1 },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: { fontSize: 13, color: colors.textMuted },
  modalFooter: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
