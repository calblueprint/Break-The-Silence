import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import PhotoGrid from '@/components/journal/PhotoGrid';
import { entryDetailStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import { getMockPhotoCount } from '@/data/mockJournalPhotos';
import colors from '@/styles/colors';
import { formatFullDate, formatTime } from '@/utils/journalDates';

export default function JournalEntryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, loading } = useJournal();
  const entry = getEntry(id);
  const photoCount = entry ? getMockPhotoCount(entry.id) : 0;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/journal');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={goBack}
          hitSlop={12}
          style={styles.backButtonContainer}
          accessibilityLabel="Back to diary"
        >
          <Feather name="arrow-left" size={24} color={colors.black} />
          <Text style={styles.backText}>Diary</Text>
        </Pressable>
      </View>

      {entry ? (
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.dateRowContainer}>
            <Text style={styles.dateText}>
              {formatFullDate(new Date(entry.createdAt))}
            </Text>
            <Text style={styles.dateText}>
              {formatTime(new Date(entry.createdAt))}
            </Text>
          </View>
          <Text style={styles.titleText}>{entry.title || 'Untitled'}</Text>
          <Text style={styles.bodyText}>{entry.content}</Text>
          {photoCount > 0 ? <PhotoGrid count={photoCount} /> : null}
        </ScrollView>
      ) : loading ? (
        <View style={styles.notFoundContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            This entry could not be found.
          </Text>
        </View>
      )}

      {entry ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/journal/edit/[id]',
              params: { id },
            })
          }
          style={({ pressed }) => [
            styles.editButtonContainer,
            pressed && styles.editButtonPressedContainer,
          ]}
          accessibilityLabel="Edit entry"
          accessibilityRole="button"
        >
          <Feather name="edit-2" size={20} color={colors.white} />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
