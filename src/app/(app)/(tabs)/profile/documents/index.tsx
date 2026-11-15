import { ComponentProps, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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
import DocumentViewer from '@/components/documents/DocumentViewer';
import colors from '@/styles/colors';
import {
  deleteFileFromSupabase,
  fetchUploadedFiles,
  getSecureFileUrl,
  shareFileWithUser,
  uploadFileToSupabase,
} from '../../../../../../api/supabase/storage/documents';

interface UploadedFile {
  id: string | null;
  name: string;
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

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await fetchUploadedFiles();
      setFiles((data as UploadedFile[]) || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) return;

      setSelectedUploads(result.assets);
      setIsSensitiveUpload(true);
      setUploadModalVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to select files.');
    }
  };

  const confirmAndUploadFiles = async () => {
    setLoading(true);
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    let hasError = false;

    for (const file of selectedUploads) {
      if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
        Alert.alert('File too large', `${file.name} exceeds 10MB.`);
        hasError = true;
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
      } catch (err) {
        console.error('Failed to upload', file.name, err);
        hasError = true;
      }
    }

    setLoading(false);
    setUploadModalVisible(false);
    setSelectedUploads([]);

    if (!hasError) {
      Alert.alert('Success', 'All files uploaded securely!');
    } else {
      Alert.alert(
        'Notice',
        'Some files uploaded, but there were errors. Check console.',
      );
    }

    await loadFiles();
  };

  const handleOpenFile = async (file: UploadedFile) => {
    try {
      setLoading(true);
      const secureUrl = await getSecureFileUrl(file.fullPath);
      setCurrentViewUrl(secureUrl);
      setCurrentMimeType(file.metadata?.mimetype);
      setCurrentFileName(file.name);
      setCurrentFullPath(file.fullPath);
      setViewerVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not open file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fullPath: string) => {
    try {
      setLoading(true);
      await deleteFileFromSupabase(fullPath);
      await loadFiles();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete file.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareFile = (fullPath: string) => {
    Alert.prompt(
      'Share Document',
      "Enter the recipient's exact Supabase User ID:",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: async (recipientId?: string) => {
            if (!recipientId) return;
            try {
              setLoading(true);
              await shareFileWithUser(fullPath, recipientId);
              Alert.alert('Success', 'File shared securely!');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not share file.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const confirmDelete = (filePath: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteFile(filePath),
        },
      ],
    );
  };

  const openFileOptions = (file: UploadedFile) => {
    Alert.alert('File Options', file.name, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => handleShareFile(file.fullPath) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => confirmDelete(file.fullPath),
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
          <Text style={styles.headerText}>Profile</Text>
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
                <Pressable
                  style={styles.fileRow}
                  onPress={() => handleOpenFile(file)}
                >
                  <View
                    style={[
                      styles.fileIconBox,
                      file.name.startsWith('SENSITIVE_') &&
                        styles.sensitiveIconBox,
                    ]}
                  >
                    <Ionicons
                      name={
                        file.name.startsWith('SENSITIVE_')
                          ? 'eye-off-outline'
                          : file.metadata?.mimetype?.startsWith('image/')
                            ? 'image-outline'
                            : 'document-text-outline'
                      }
                      size={20}
                      color={
                        file.name.startsWith('SENSITIVE_')
                          ? 'white'
                          : colors.primary
                      }
                    />
                  </View>
                  <View style={styles.fileRowText}>
                    <Text numberOfLines={1} style={styles.fileRowTitle}>
                      {file.name.replace('SENSITIVE_', '')}
                    </Text>
                    <Text style={styles.fileRowDetails}>
                      {file.metadata?.mimetype?.split('/')[1]?.toUpperCase() ??
                        'FILE'}{' '}
                      • {((file.metadata?.size ?? 0) / 1024).toFixed(0)} KB
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => openFileOptions(file)}
                    style={{ padding: 8 }}
                  >
                    <Feather name="more-horizontal" size={20} color="#666" />
                  </Pressable>
                </Pressable>
                {index < files.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.floatingUploadBtn} onPress={handleSelectFiles}>
        <Feather name="upload" size={20} color="white" />
        <Text style={styles.uploadText}>Upload files</Text>
      </Pressable>

      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { paddingTop: 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Save {selectedUploads.length} files
            </Text>
            <Pressable
              onPress={() => {
                setUploadModalVisible(false);
                setSelectedUploads([]);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll}>
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
                    <Feather name="edit-2" size={18} color={colors.textMuted} />
                  </View>
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
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={confirmAndUploadFiles}
              disabled={loading}
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
        </View>
      </Modal>

      <StatusBar style="dark" />
      <DocumentViewer
        visible={viewerVisible}
        fileUrl={currentViewUrl}
        mimeType={currentMimeType}
        fileName={currentFileName}
        isSensitive={currentFileName.includes('SENSITIVE_')}

        onShare={() => currentFullPath && handleShareFile(currentFullPath)}

        onClose={() => {
          setViewerVisible(false);
          setCurrentViewUrl(null);
          setCurrentFullPath(null);
        }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito Sans',
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
    bottom: 109,
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
