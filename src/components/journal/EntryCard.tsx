import type { JournalEntry } from '@/types/journal';
import { Pressable, Text } from 'react-native';
import { formatEntryDate } from '@/utils/journalDates';
import { entryCardStyles as styles } from './styles';

interface EntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

export default function EntryCard({ entry, onPress }: EntryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressedContainer,
      ]}
    >
      <Text style={styles.dateText}>
        {formatEntryDate(new Date(entry.createdAt))}
      </Text>
      <Text style={styles.titleText} numberOfLines={1}>
        {entry.title || 'Untitled'}
      </Text>
      <Text style={styles.previewText} numberOfLines={2}>
        {entry.content}
      </Text>
    </Pressable>
  );
}
