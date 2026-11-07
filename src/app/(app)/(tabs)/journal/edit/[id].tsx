import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import EntryForm from '@/components/journal/EntryForm';
import { entryDetailStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import useIsMountedRef from '@/hooks/useIsMountedRef';
import colors from '@/styles/colors';

export default function EditEntry() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, updateEntry, deleteEntry, loading, showToast } =
    useJournal();
  const entry = getEntry(id);
  const [deleting, setDeleting] = useState(false);
  const isMounted = useIsMountedRef();

  const goToList = () => router.dismissTo('/journal');

  const leave = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/journal/[id]', params: { id } });
    }
  };

  // The form reads its initial values once, so wait for the entry to load
  if (!entry) {
    // Stays on the spinner after a delete so goToList is the only navigation
    if (!loading && !deleting) return <Redirect href="/journal" />;
    return (
      <View style={styles.notFoundContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <EntryForm
      date={new Date(entry.createdAt)}
      initialValues={{ title: entry.title, content: entry.content }}
      saveConfirm={{
        title: 'Edit this entry?',
        message: 'Your changes will be saved immediately.',
        confirmText: 'Save Changes',
      }}
      discardConfirm={{
        title: 'Discard your changes?',
        message: 'Your saved entry will stay as it was.',
        confirmText: 'Discard Changes',
      }}
      onSave={async values => {
        await updateEntry(id, values);
        showToast('Changes saved!');
      }}
      onLeave={leave}
      onCancel={goToList}
      onDelete={async () => {
        setDeleting(true);
        try {
          await deleteEntry(id);
        } catch (error) {
          if (isMounted.current) setDeleting(false);
          throw error;
        }
        // Safe Exit may have been pressed during the delete; don't navigate
        if (isMounted.current) goToList();
      }}
    />
  );
}
