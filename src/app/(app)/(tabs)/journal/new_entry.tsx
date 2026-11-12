import { useState } from 'react';
import { useRouter } from 'expo-router';
import EntryForm from '@/components/journal/EntryForm';
import { useJournal } from '@/context/JournalContext';

export default function NewEntry() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [now] = useState(() => new Date());

  const leave = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journal');
    }
  };

  return (
    <EntryForm
      date={now}
      saveConfirm={{
        title: 'Save this entry?',
        message: 'Your entry will be saved here.',
        confirmText: 'Confirm',
      }}
      discardConfirm={{
        title: 'Discard this entry?',
        message: "What you have written won't be saved.",
        confirmText: 'Discard',
      }}
      onSave={async values => {
        await addEntry(values);
      }}
      onLeave={leave}
    />
  );
}
