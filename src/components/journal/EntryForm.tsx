import type { NewJournalEntry } from '@/types/journal';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ConfirmModal from '@/components/journal/ConfirmModal';
import { entryFormStyles as styles } from '@/components/journal/styles';
import useConfirmBeforeBack from '@/hooks/useConfirmBeforeBack';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import colors from '@/styles/colors';
import { formatShortDate, formatTime } from '@/utils/journalDates';
import CalendarIcon from '~/assets/CgCalendarDates.svg';

interface ConfirmCopy {
  title: string;
  message: string;
  confirmText: string;
}

interface EntryFormProps {
  date: Date;
  // Prefilled values when editing; blank when creating
  initialValues?: NewJournalEntry;
  saveConfirm: ConfirmCopy;
  discardConfirm: ConfirmCopy;
  // Should throw if saving fails so the form can show an error
  onSave: (values: NewJournalEntry) => Promise<void>;
  onLeave: () => void;
  // Where Cancel goes; same as onLeave unless set
  onCancel?: () => void;
  // Shows the trash icon. Should throw if deleting fails, and leave the screen
  // itself since the form goes away along with the entry.
  onDelete?: () => Promise<void>;
}

// Shared by the New Entry and Edit Entry screens
export default function EntryForm({
  date,
  initialValues = { title: '', content: '' },
  saveConfirm,
  discardConfirm,
  onSave,
  onLeave,
  onCancel = onLeave,
  onDelete,
}: EntryFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [saving, setSaving] = useState(false);
  // State updates wait for a render, so a fast double tap needs a ref to stop it
  const saveInProgress = useRef(false);
  const isMounted = useIsMountedRef();
  const [modal, setModal] = useState<
    'save' | 'discard' | 'cancel' | 'delete' | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const deleteInProgress = useRef(false);

  const hasChanges =
    title.trim() !== initialValues.title.trim() ||
    content.trim() !== initialValues.content.trim();
  const canSave = content.trim().length > 0 && hasChanges;

  const confirmDiscard = useCallback(() => setModal('discard'), []);
  const allowLeaving = useConfirmBeforeBack(hasChanges, confirmDiscard);

  const handleCancel = () => {
    if (hasChanges) {
      setModal('cancel');
    } else {
      onCancel();
    }
  };

  const handleConfirmSave = async () => {
    if (saveInProgress.current) return;
    saveInProgress.current = true;
    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim() });
      // Safe Exit may have been pressed during the save; don't navigate back
      if (!isMounted.current) return;
      setModal(null);
      allowLeaving();
      onLeave();
    } catch {
      if (!isMounted.current) return;
      // Keep the draft on screen so nothing is lost
      setModal(null);
      Alert.alert(
        'Could not save entry',
        'Please check your connection and try again.',
      );
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };

  const handleConfirmDiscard = () => {
    const leave = modal === 'cancel' ? onCancel : onLeave;
    setModal(null);
    allowLeaving();
    leave();
  };

  const handleConfirmDelete = async () => {
    if (!onDelete || deleteInProgress.current) return;
    deleteInProgress.current = true;
    setDeleting(true);
    try {
      await onDelete();
    } catch {
      deleteInProgress.current = false;
      if (!isMounted.current) return;
      setDeleting(false);
      setModal(null);
      Alert.alert(
        'Could not delete entry',
        'Please check your connection and try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View
        style={[
          styles.headerContainer,
          onDelete && styles.headerGroupedContainer,
        ]}
      >
        <Pressable onPress={handleCancel} hitSlop={12}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => setModal('save')}
          disabled={!canSave}
          hitSlop={12}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
        {onDelete ? (
          <Pressable
            onPress={() => setModal('delete')}
            hitSlop={12}
            accessibilityLabel="Delete entry"
          >
            <Feather name="trash-2" size={22} color={colors.black} />
          </Pressable>
        ) : null}
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flexContainer}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.dateChipContainer}>
            <CalendarIcon width={14} height={14} color={colors.primary} />
            <Text style={styles.dateText}>
              {formatShortDate(date)} {formatTime(date)}
            </Text>
          </View>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Title (optional)"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
          <View style={styles.divider} />
          <TextInput
            style={[
              styles.contentInput,
              content.length === 0 && styles.contentPlaceholderText,
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textMuted}
            multiline
            scrollEnabled={false}
            autoFocus
          />
        </ScrollView>

        {/* Empty for now; the camera button for photos goes here */}
        <View style={styles.toolbarContainer} />
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={modal === 'save'}
        {...saveConfirm}
        confirmText={saving ? 'Saving...' : saveConfirm.confirmText}
        busy={saving}
        onConfirm={handleConfirmSave}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        visible={modal === 'discard' || modal === 'cancel'}
        {...discardConfirm}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        visible={modal === 'delete'}
        title="Delete this entry?"
        message="This entry will be permanently deleted."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModal(null)}
      />
    </SafeAreaView>
  );
}
