import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import colors from '@/styles/colors';
import {
  getDocumentNameParts,
  MAX_DOCUMENT_NAME_LENGTH,
  validateDocumentName,
} from '@/utils/documentFiles';

interface Props {
  name: string;
  onSave: (name: string) => Promise<void> | void;
  onCancel: () => void;
}

export default function DocumentNameEditor({ name, onSave, onCancel }: Props) {
  const { baseName, extension } = getDocumentNameParts(name);
  const [draft, setDraft] = useState(baseName);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);
  const isMounted = useIsMountedRef();

  const save = async () => {
    if (saving.current) return;
    saving.current = true;
    setIsSaving(true);
    setError('');
    try {
      if (!draft.trim() || /^\.+$/.test(draft.trim())) {
        throw new Error('Enter a name for this document.');
      }
      const newName = validateDocumentName(`${draft.trim()}${extension}`);
      await onSave(newName);
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error ? err.message : 'Could not save the name.',
        );
      }
    } finally {
      saving.current = false;
      if (isMounted.current) setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rename document</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel="Document name"
          style={styles.input}
          value={draft}
          onChangeText={value => {
            setDraft(value);
            setError('');
          }}
          autoFocus
          selectTextOnFocus
          autoCapitalize="sentences"
          autoCorrect={false}
          maxLength={MAX_DOCUMENT_NAME_LENGTH - extension.length}
          editable={!isSaving}
          returnKeyType="done"
          onSubmitEditing={() => void save()}
        />
        {!!extension && <Text style={styles.extension}>{extension}</Text>}
      </View>
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel rename"
          style={styles.button}
          onPress={onCancel}
          disabled={isSaving}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save name"
          style={[styles.button, styles.save, isSaving && styles.disabled]}
          onPress={() => void save()}
          disabled={isSaving}
        >
          <Text style={styles.saveText}>
            {isSaving ? 'Saving…' : 'Save name'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, gap: 10 },
  label: { fontFamily: 'Nunito Sans', fontSize: 16, color: colors.text },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: colors.text,
  },
  extension: { paddingRight: 12, fontSize: 16, color: colors.textMuted },
  error: { color: colors.error, fontSize: 14 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  cancel: { color: colors.primary, fontSize: 16 },
  save: { backgroundColor: colors.primary },
  saveText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.7 },
});
