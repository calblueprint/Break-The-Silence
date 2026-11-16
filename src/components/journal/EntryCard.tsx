import type { JournalEntry } from '@/types/journal';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getMockPhotoCount } from '@/data/mockJournalPhotos';
import colors from '@/styles/colors';
import { formatShortDate } from '@/utils/journalDates';
import CameraIcon from '~/assets/Glyph.svg';
import { entryCardStyles as styles } from './styles';

interface EntryCardProps {
  entry: JournalEntry;
  // Position in the month's box, for its rounded corners and dividers
  isFirst: boolean;
  isLast: boolean;
  // Shows a checkbox while the list is in Select mode
  selecting?: boolean;
  selected?: boolean;
  onPress: () => void;
}

// One row in a month's box of entries
export default function EntryCard({
  entry,
  isFirst,
  isLast,
  selecting = false,
  selected = false,
  onPress,
}: EntryCardProps) {
  const photoCount = getMockPhotoCount(entry.id);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        isFirst && styles.cardFirstContainer,
        isLast && styles.cardLastContainer,
        pressed && styles.cardPressedContainer,
      ]}
      accessibilityRole={selecting ? 'checkbox' : 'button'}
      accessibilityState={selecting ? { checked: selected } : undefined}
    >
      <View style={styles.cardRowContainer}>
        {selecting ? (
          <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
            {selected ? (
              <Feather name="check" size={14} color={colors.white} />
            ) : null}
          </View>
        ) : null}
        <View style={styles.cardContentContainer}>
          <View style={styles.titleRowContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {entry.title || 'Untitled'}
            </Text>
            {photoCount > 0 ? (
              <View
                style={styles.photoCountContainer}
                accessibilityLabel={`${photoCount} photo${photoCount === 1 ? '' : 's'}`}
              >
                <CameraIcon width={16} height={16} />
                <Text style={styles.photoCountText}>{photoCount}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.detailsRowContainer}>
            <Text style={styles.dateText}>
              {formatShortDate(new Date(entry.createdAt))}
            </Text>
            <Text style={styles.previewText} numberOfLines={1}>
              {entry.content}
            </Text>
          </View>
        </View>
      </View>
      {isLast ? null : <View style={styles.divider} />}
    </Pressable>
  );
}
