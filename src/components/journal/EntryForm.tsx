import type { NewJournalEntry } from '@/types/journal';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
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
import CalendarSheet from '@/components/journal/CalendarSheet';
import ConfirmModal from '@/components/journal/ConfirmModal';
import PhotoGrid from '@/components/journal/PhotoGrid';
import { entryFormStyles as styles } from '@/components/journal/styles';
import useConfirmBeforeBack from '@/hooks/useConfirmBeforeBack';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';
import colors from '@/styles/colors';
import {
  formatMediumDate,
  formatShortDate,
  formatTime,
  isSameDay,
} from '@/utils/journalDates';
import CalendarIcon from '~/assets/calendar.svg';
import DropdownIcon from '~/assets/dropdown.svg';

interface ConfirmCopy {
  title: string;
  message: string;
  confirmText: string;
}

interface EntryFormProps {
  date: Date;
  // Prefilled values when editing; blank when creating
  initialValues?: NewJournalEntry;
  // Fake photo count for previewing the layout until entries store photos
  initialPhotoCount?: number;
  saveConfirm: ConfirmCopy;
  discardConfirm: ConfirmCopy;
  // Should throw if saving fails so the form can show an error
  onSave: (values: NewJournalEntry) => Promise<void>;
  onLeave: () => void;
  // Where Cancel goes; same as onLeave unless set
  onCancel?: () => void;
  // Makes the trash icon delete the saved entry instead of discarding the
  // draft. Should throw if deleting fails, and leave the screen itself since
  // the form goes away along with the entry.
  onDelete?: () => Promise<void>;
}

// Shared by the New Entry and Edit Entry screens
export default function EntryForm({
  date,
  initialValues = { title: '', content: '' },
  initialPhotoCount = 0,
  saveConfirm,
  discardConfirm,
  onSave,
  onLeave,
  onCancel = onLeave,
  onDelete,
}: EntryFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [entryDate, setEntryDate] = useState(date);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const keyboardVisible = useKeyboardVisible();
  // Also tracks focus, since a hardware keyboard (like the simulator's) never
  // shows the on-screen one
  const [inputFocused, setInputFocused] = useState(!initialValues.content);
  const typing = keyboardVisible || inputFocused;
  // Removing a fake photo only hides it here; nothing is saved
  const [photoCount, setPhotoCount] = useState(initialPhotoCount);
  const [saving, setSaving] = useState(false);
  // State updates wait for a render, so a fast double tap needs a ref to stop it
  const saveInProgress = useRef(false);
  const isMounted = useIsMountedRef();
  const [modal, setModal] = useState<
    'save' | 'discard' | 'cancel' | 'delete' | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const deleteInProgress = useRef(false);

  const dateChanged = !isSameDay(entryDate, date);
  const hasChanges =
    title.trim() !== initialValues.title.trim() ||
    content.trim() !== initialValues.content.trim() ||
    dateChanged;
  const canSave = content.trim().length > 0 && hasChanges;

  const confirmDiscard = useCallback(() => setModal('discard'), []);
  const allowLeaving = useConfirmBeforeBack(hasChanges, confirmDiscard);

  // Read when the press starts: on web, pressing anywhere takes focus out of
  // the text field before the press finishes
  const wasTypingOnPress = useRef(false);

  // While typing, Cancel just stops typing and keeps the text on screen
  const handleCancel = () => {
    if (wasTypingOnPress.current) {
      Keyboard.dismiss();
    } else if (hasChanges) {
      setModal('cancel');
    } else {
      onCancel();
    }
  };

  // Edit Entry: delete the saved entry. New Entry: throw away the draft.
  const handleTrash = () => {
    if (onDelete) {
      setModal('delete');
    } else if (hasChanges) {
      setModal('discard');
    } else {
      onLeave();
    }
  };

  const handleConfirmSave = async () => {
    if (saveInProgress.current) return;
    saveInProgress.current = true;
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        // Only sent when changed, so a new entry otherwise gets the save time
        ...(dateChanged && { createdAt: entryDate.toISOString() }),
      });
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
      <View style={styles.headerContainer}>
        <Pressable
          onPressIn={() => {
            wasTypingOnPress.current = typing;
          }}
          onPress={handleCancel}
          hitSlop={12}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => setModal('save')}
          disabled={!canSave}
          hitSlop={12}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
        <Pressable
          onPress={handleTrash}
          hitSlop={12}
          accessibilityLabel={onDelete ? 'Delete entry' : 'Discard entry'}
        >
          <Feather name="trash-2" size={22} color={colors.black} />
        </Pressable>
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
          {/* Hidden while typing; closing the keyboard brings it back */}
          {typing ? null : (
            <Pressable
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateChipContainer}
              accessibilityRole="button"
              accessibilityLabel={`Entry date ${formatMediumDate(entryDate)}. Change date`}
            >
              <CalendarIcon width={16} height={16} />
              <Text style={styles.dateText}>
                {formatShortDate(entryDate)} {formatTime(entryDate)}
              </Text>
              <DropdownIcon width={12} height={12} />
            </Pressable>
          )}

          <TextInput
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Title (optional)"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
          <TextInput
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={[
              styles.contentInput,
              photoCount === 0 && styles.contentInputTall,
              content.length === 0 && styles.contentPlaceholderText,
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textMuted}
            multiline
            scrollEnabled={false}
            // A new entry starts typing right away; editing starts by showing
            // the whole entry
            autoFocus={!initialValues.content}
          />
          {photoCount > 0 && !typing ? (
            <PhotoGrid
              count={photoCount}
              onRemove={() => setPhotoCount(count => count - 1)}
            />
          ) : null}
        </ScrollView>

        <View style={styles.toolbarContainer}>
          {/* Placeholder until photo and document uploads are built */}
          <Pressable
            onPress={() =>
              Alert.alert(
                'Coming soon',
                'Adding photos and documents is not available yet.',
              )
            }
            hitSlop={8}
            style={styles.toolbarButtonContainer}
            accessibilityLabel="Add photos or documents"
            accessibilityRole="button"
          >
            <Feather name="camera" size={28} color={colors.black} />
          </Pressable>
          {typing ? (
            <Pressable
              onPress={Keyboard.dismiss}
              hitSlop={8}
              style={styles.toolbarButtonContainer}
              accessibilityLabel="Hide keyboard"
              accessibilityRole="button"
            >
              <Feather name="chevron-down" size={24} color={colors.black} />
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      <CalendarSheet
        visible={datePickerVisible}
        title="Change date"
        selectedDate={entryDate}
        getConfirmText={day => `Use ${formatMediumDate(day)}`}
        onConfirm={day => {
          // Keeps the original time of day
          const next = new Date(date);
          next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
          setEntryDate(next);
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
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
