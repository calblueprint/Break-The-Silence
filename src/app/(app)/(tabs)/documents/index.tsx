import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import DocumentViewer from '@/components/documents/DocumentViewer';
import Logo from '@/components/Logo';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';
import {
  deleteFileFromSupabase,
  fetchUploadedFiles,
  getSecureFileUrl,
  removeSharedFile,
  shareFileWithUser,
  uploadFileToSupabase,
} from '../../../../../api/supabase/storage/documents';

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

export default function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentViewUrl, setCurrentViewUrl] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [isSensitiveUpload, setIsSensitiveUpload] = useState(false);

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

  const handleSelectAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setLoading(true);
      const file = result.assets[0];

      const MAX_FILE_SIZE_MB = 10;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

      if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
        Alert.alert(
          'File is too large',
          `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
        );
        return;
      }

      const finalFileName = isSensitiveUpload
        ? `SENSITIVE_${file.name}`
        : file.name;

      await uploadFileToSupabase(
        file.uri,
        finalFileName,
        file.mimeType ?? 'application/octet-stream',
      );

      setIsSensitiveUpload(false);

      Alert.alert('Success', 'File uploaded to Supabase!');
      await loadFiles();
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (file: UploadedFile) => {
    try {
      setLoading(true);
      const secureUrl = await getSecureFileUrl(file.fullPath);
      setCurrentViewUrl(secureUrl);
      setCurrentMimeType(file.metadata?.mimetype);
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
              Alert.alert('Error', 'Could not share file. Verify the User ID.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      setLoading(true);
      await removeSharedFile(shareId);
      loadFiles();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not remove shared file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.titleText}>Documents</Text>

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
      >
        <Text style={{ ...typography.p2, marginRight: 10, color: colors.text }}>
          Tag next upload as sensitive
        </Text>
        <Switch
          value={isSensitiveUpload}
          onValueChange={setIsSensitiveUpload}
          trackColor={{ false: '#767577', true: colors.primary }}
        />
      </View>

      <Pressable
        style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
        onPress={handleSelectAndUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Select & Upload File</Text>
        )}
      </Pressable>

      <FlatList
        data={files}
        keyExtractor={item => item.id ?? item.name}
        style={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.fileCard}>
            <Text numberOfLines={1} style={styles.fileName}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              {item.metadata?.mimetype} •{' '}
              {item.isShared
                ? 'Shared'
                : `${((item.metadata?.size ?? 0) / 1024).toFixed(0)} KB`}
            </Text>
            <View style={styles.actionRow}>
              <Pressable onPress={() => handleOpenFile(item)}>
                <Text style={styles.openText}>Open</Text>
              </Pressable>

              {!item.isShared ? (
                <>
                  <Pressable onPress={() => handleShareFile(item.fullPath)}>
                    <Text style={[styles.openText, { color: '#007AFF' }]}>
                      Share
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteFile(item.fullPath)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable onPress={() => handleRemoveShare(item.id!)}>
                  <Text style={styles.deleteText}>Remove</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No files uploaded yet.</Text>
        }
      />
      <StatusBar style="auto" />
      <DocumentViewer
        visible={viewerVisible}
        fileUrl={currentViewUrl}
        mimeType={currentMimeType}
        onClose={() => {
          setViewerVisible(false);
          setCurrentViewUrl(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  titleText: {
    ...typography.h3,
    color: colors.text,
    marginVertical: 15,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.entryLink,
    color: colors.white,
  },
  listContainer: {
    width: '100%',
  },
  fileCard: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileName: {
    ...typography.p1,
    color: colors.text,
    marginBottom: 4,
  },
  fileMeta: {
    ...typography.p3,
    color: colors.textMuted,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
  },
  openText: {
    ...typography.p2,
    color: colors.primary,
  },
  deleteText: {
    ...typography.p2,
    color: colors.error,
  },
  emptyText: {
    ...typography.p2,
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
  },
});
