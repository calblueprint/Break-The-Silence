import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { entryDetailStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import colors from '@/styles/colors';
import { formatFullDate, formatTime } from '@/utils/journalDates';
import EditIcon from '~/assets/Icon.png';

export default function JournalEntryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, loading } = useJournal();
  const entry = getEntry(id);

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
          accessibilityLabel="Back to journal"
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
          <Text style={styles.backText}>Journal</Text>
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
          <View style={styles.divider} />
          <Text style={styles.bodyText}>{entry.content}</Text>
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
          style={styles.editButtonContainer}
          accessibilityLabel="Edit entry"
        >
          <Image source={EditIcon} style={styles.editIcon} />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
