import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ConfirmModal from '@/components/journal/ConfirmModal';
import { newEntryStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import colors from '@/styles/colors';
import { formatShortDate, formatTime } from '@/utils/journalDates';
import CalendarIcon from '~/assets/CgCalendarDates.svg';

export default function NewEntry() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [now] = useState(() => new Date());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<'save' | 'discard' | null>(null);

  const canSave = content.trim().length > 0;
  const hasChanges = title.trim().length > 0 || canSave;

  const leave = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journal');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setModal('discard');
    } else {
      leave();
    }
  };

  const handleConfirmSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await addEntry({ title: title.trim(), content: content.trim() });
      setModal(null);
      leave();
    } catch {
      // Keep the draft on screen so nothing is lost
      setModal(null);
      Alert.alert(
        'Could not save entry',
        'Please check your connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDiscard = () => {
    setModal(null);
    leave();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleCancel} hitSlop={12}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => setModal('save')}
          disabled={!canSave}
          hitSlop={12}
        >
          <Text style={[styles.saveText, !canSave && styles.saveDisabledText]}>
            Save
          </Text>
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
          <View style={styles.dateChipContainer}>
            <CalendarIcon width={14} height={14} color={colors.primary} />
            <Text style={styles.dateText}>
              {formatShortDate(now)} {formatTime(now)}
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

        <View style={styles.toolbarContainer}>
          {/* Safe Exit: the keyboard hides the tab bar's button while typing */}
          <Pressable
            onPress={() => router.replace('/')}
            hitSlop={8}
            style={styles.safeExitButtonContainer}
            accessibilityLabel="Safe exit"
          >
            <Feather name="x" size={22} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={modal === 'save'}
        title="Save this entry?"
        message="Your entry will be saved here."
        confirmText="Confirm"
        onConfirm={handleConfirmSave}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        visible={modal === 'discard'}
        title="Discard this entry?"
        message="What you have written won't be saved."
        confirmText="Discard"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setModal(null)}
      />
    </SafeAreaView>
  );
}
