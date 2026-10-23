import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import colors from '@/styles/colors';
import { typography } from '@/styles/typography';
import {
  deleteFileFromSupabase,
  fetchUploadedFiles,
  getFilePublicUrl,
  uploadFileToSupabase,
} from '../../../../../api/supabase/storage/documents';

interface UploadedFile {
  id: string | null;
  name: string;
  metadata?: {
    mimetype?: string;
    size?: number;
  };
}

export default function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
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

  const handleSelectAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setLoading(true);
      const file = result.assets[0];

      await uploadFileToSupabase(
        file.uri,
        file.name,
        file.mimeType ?? 'application/octet-stream',
      );

      Alert.alert('Success', 'File uploaded to Supabase!');
      await loadFiles();
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = (fileName: string) => {
    const url = getFilePublicUrl(fileName);
    Linking.openURL(url);
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      setLoading(true);
      await deleteFileFromSupabase(fileName);
      await loadFiles();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.titleText}>Documents</Text>

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
            <Text style={styles.fileMeta}>
              {item.metadata?.mimetype} •{' '}
              {item.metadata?.size ? (item.metadata.size / 1024).toFixed(2) : 0}{' '}
              KB
            </Text>
            <View style={styles.actionRow}>
              <Pressable onPress={() => handleOpenFile(item.name)}>
                <Text style={styles.openText}>Open</Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteFile(item.name)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No files uploaded yet.</Text>
        }
      />
      <StatusBar style="auto" />
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
