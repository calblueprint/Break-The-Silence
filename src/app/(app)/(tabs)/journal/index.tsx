import type { JournalEntry } from '@/types/journal';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import CalendarSheet from '@/components/journal/CalendarSheet';
import ConfirmModal from '@/components/journal/ConfirmModal';
import EntryCard from '@/components/journal/EntryCard';
import { journalListStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import colors from '@/styles/colors';
import {
  formatMediumDate,
  formatMonthYear,
  isSameDay,
} from '@/utils/journalDates';
import CalendarIcon from '~/assets/calendar.svg';
import FilterIcon from '~/assets/filter.png';
import SearchIcon from '~/assets/SearchIcon.png';

interface MonthSection {
  title: string;
  data: JournalEntry[];
}

// Entries are always sorted by date, so consecutive entries share a month
function groupByMonth(entries: JournalEntry[]): MonthSection[] {
  const sections: MonthSection[] = [];
  for (const entry of entries) {
    const title = formatMonthYear(new Date(entry.createdAt));
    const last = sections[sections.length - 1];
    if (last && last.title === title) {
      last.data.push(entry);
    } else {
      sections.push({ title, data: [entry] });
    }
  }
  return sections;
}

export default function Journal() {
  const router = useRouter();
  const {
    entries,
    loading,
    error,
    refresh,
    deleteEntry,
    restoreEntries,
    showToast,
  } = useJournal();
  const [search, setSearch] = useState('');
  // Shows only entries from this day; null shows all entries
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  // Select mode: tapping entries checks them instead of opening them
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sections = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = entries.filter(
      entry =>
        (!filterDate || isSameDay(new Date(entry.createdAt), filterDate)) &&
        (entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)),
    );
    return groupByMonth(filtered);
  }, [entries, search, filterDate]);

  const goToNewEntry = () => router.push('/journal/new_entry');

  const toggleSelecting = () => {
    setSelecting(prev => !prev);
    setSelectedIds(new Set());
  };

  const toggleSelected = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const handleConfirmDelete = async () => {
    setDeleting(true);
    // Kept so Undo can re-create them
    const toDelete = entries.filter(entry => selectedIds.has(entry.id));
    const results = await Promise.allSettled(
      toDelete.map(entry => deleteEntry(entry.id)),
    );
    const deleted = toDelete.filter(
      (_, i) => results[i].status === 'fulfilled',
    );
    const failedIds = toDelete
      .filter((_, i) => results[i].status === 'rejected')
      .map(entry => entry.id);
    setDeleting(false);
    setConfirmDeleteVisible(false);
    if (deleted.length > 0) {
      showToast(
        deleted.length === 1
          ? 'Entry deleted'
          : `${deleted.length} entries deleted`,
        {
          icon: 'trash',
          actionText: 'Undo',
          onAction: () => {
            restoreEntries(deleted).catch(() =>
              Alert.alert(
                'Could not restore some entries',
                'Please check your connection and try again.',
              ),
            );
          },
        },
      );
    }
    if (failedIds.length > 0) {
      // Keeps the ones that failed checked so the user can try again
      setSelectedIds(new Set(failedIds));
      Alert.alert(
        'Could not delete some entries',
        'Please check your connection and try again.',
      );
    } else {
      setSelecting(false);
      setSelectedIds(new Set());
    }
  };

  const selectedCount = selectedIds.size;
  const deleteLabel =
    selectedCount === 1 ? 'Delete 1 entry' : `Delete ${selectedCount} entries`;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // The delete bar takes the tab dock's place while selecting
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: selecting ? { display: 'none' } : undefined,
    });
  }, [navigation, selecting]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.titleText}>Diary</Text>
          <Text style={styles.subtitleText}>Stored privately in this app</Text>
        </View>
      </View>

      {entries.length === 0 && loading ? (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : entries.length === 0 && error ? (
        <View style={styles.emptyStateContainer}>
          <Feather name="alert-circle" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitleText}>Could not load entries</Text>
          <Text style={styles.emptyMessageText}>
            Please check your connection and try again.
          </Text>
          <Button
            disabled={false}
            text="Try again"
            onPress={refresh}
            containerStyle={styles.emptyButtonContainer}
          />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeIconCircle}>
            <Feather name="book" size={40} color={colors.actionPrimary} />
          </View>
          <Text style={styles.welcomeTitleText}>Your private diary</Text>
          <Text style={styles.welcomeMessageText}>
            Write about your day, life, feelings, or anything that happened.
            Only you can see what you&apos;ve written.
          </Text>
          <Pressable
            onPress={goToNewEntry}
            style={({ pressed }) => [
              styles.welcomeButtonContainer,
              pressed && styles.newEntryButtonPressedContainer,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.welcomeButtonText}>Write your first entry</Text>
          </Pressable>
          <Text style={styles.welcomeLabelText}>A PLACE TO BEGIN</Text>
          <Text style={styles.welcomePromptText}>
            What&apos;s on your mind today?
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.searchRowContainer}>
            <View style={styles.searchBarContainer}>
              <Image source={SearchIcon} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search through diary..."
                placeholderTextColor={colors.slate500}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
            <Pressable
              onPress={() => setFilterVisible(true)}
              hitSlop={8}
              style={[
                styles.filterButtonContainer,
                filterDate && styles.filterButtonActiveContainer,
              ]}
              accessibilityLabel={
                filterDate
                  ? `Filtering by ${formatMediumDate(filterDate)}. Change filter`
                  : 'Filter by date'
              }
            >
              <Image source={FilterIcon} style={styles.filterIcon} />
            </Pressable>
            <Pressable
              onPress={toggleSelecting}
              hitSlop={8}
              style={styles.selectButtonContainer}
              accessibilityRole="button"
              accessibilityLabel={
                selecting
                  ? 'Stop selecting entries'
                  : 'Select entries to delete'
              }
            >
              <Text style={styles.selectButtonText}>
                {selecting ? 'Cancel' : 'Select'}
              </Text>
            </Pressable>
          </View>
          {filterDate ? (
            <Pressable
              onPress={() => setFilterDate(null)}
              hitSlop={8}
              style={styles.activeFilterChipContainer}
              accessibilityLabel={`Clear ${formatMediumDate(filterDate)} filter and show all entries`}
            >
              <CalendarIcon width={16} height={16} />
              <Text style={styles.activeFilterChipText}>
                {formatMediumDate(filterDate)}
              </Text>
              <Feather name="x" size={14} color={colors.actionPrimary} />
            </Pressable>
          ) : null}
          <SectionList
            sections={sections}
            keyExtractor={entry => entry.id}
            contentContainerStyle={styles.listContentContainer}
            keyboardShouldPersistTaps="handled"
            stickySectionHeadersEnabled={false}
            refreshing={loading}
            onRefresh={refresh}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            )}
            renderItem={({ item, index, section }) => (
              <EntryCard
                entry={item}
                isFirst={index === 0}
                isLast={index === section.data.length - 1}
                selecting={selecting}
                selected={selectedIds.has(item.id)}
                onPress={() =>
                  selecting
                    ? toggleSelected(item.id)
                    : router.push({
                        pathname: '/journal/[id]',
                        params: { id: item.id },
                      })
                }
              />
            )}
            ListEmptyComponent={
              filterDate && !search.trim() ? (
                <View style={styles.noEntriesCardContainer}>
                  <Text style={styles.noEntriesTitleText}>
                    No entries on this date
                  </Text>
                  <Text style={styles.noEntriesMessageText}>
                    You didn&apos;t write anything on{' '}
                    {formatMediumDate(filterDate)}.
                  </Text>
                  <Pressable onPress={() => setFilterDate(null)} hitSlop={8}>
                    <Text style={styles.noEntriesLinkText}>Clear filter</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.noResultsText}>
                  No entries match &quot;{search.trim()}&quot;
                  {filterDate ? ` on ${formatMediumDate(filterDate)}` : ''}
                </Text>
              )
            }
          />
          <CalendarSheet
            visible={filterVisible}
            title="Filter by date"
            selectedDate={filterDate}
            getConfirmText={day => `Show ${formatMediumDate(day)}`}
            onConfirm={day => {
              setFilterDate(day);
              setFilterVisible(false);
            }}
            onCancel={() => setFilterVisible(false)}
            onClear={
              filterDate
                ? () => {
                    setFilterDate(null);
                    setFilterVisible(false);
                  }
                : undefined
            }
          />
          {selecting ? (
            <View
              style={[
                styles.deleteBarContainer,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <Pressable
                onPress={() => setConfirmDeleteVisible(true)}
                disabled={selectedCount === 0}
                style={({ pressed }) => [
                  styles.deleteButtonContainer,
                  selectedCount === 0 && styles.deleteButtonDisabledContainer,
                  pressed && styles.newEntryButtonPressedContainer,
                ]}
                accessibilityRole="button"
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color={selectedCount === 0 ? colors.slate500 : colors.white}
                />
                <Text
                  style={[
                    styles.deleteButtonText,
                    selectedCount === 0 && styles.deleteButtonDisabledText,
                  ]}
                >
                  {selectedCount === 0 ? 'Delete' : deleteLabel}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={goToNewEntry}
              style={({ pressed }) => [
                styles.newEntryButtonContainer,
                pressed && styles.newEntryButtonPressedContainer,
              ]}
              accessibilityLabel="New journal entry"
              accessibilityRole="button"
            >
              <Feather name="edit-2" size={20} color={colors.white} />
              <Text style={styles.newEntryButtonText}>New entry</Text>
            </Pressable>
          )}
          <ConfirmModal
            visible={confirmDeleteVisible}
            title={
              selectedCount === 1
                ? 'Delete this entry?'
                : `Delete ${selectedCount} entries?`
            }
            message={
              selectedCount === 1
                ? "This entry and its photos will be deleted for good. You can't get it back."
                : "These entries and their photos will be deleted for good. You can't get them back."
            }
            confirmText={
              deleting
                ? 'Deleting...'
                : selectedCount === 1
                  ? 'Delete entry'
                  : deleteLabel
            }
            busy={deleting}
            destructive
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmDeleteVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}
