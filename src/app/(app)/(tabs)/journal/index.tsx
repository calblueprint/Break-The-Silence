import type { JournalEntry } from '@/types/journal';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/Button/Button';
import EntryCard from '@/components/journal/EntryCard';
import FilterModal, {
  SortOrder,
  YearGroup,
} from '@/components/journal/FilterModal';
import { journalListStyles as styles } from '@/components/journal/styles';
import { useJournal } from '@/context/JournalContext';
import colors from '@/styles/colors';
import { formatMonthYear } from '@/utils/journalDates';
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

// Entries are sorted newest first, so years and months come out newest first
function groupByYear(entries: JournalEntry[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const year = String(date.getFullYear());
    const month = formatMonthYear(date);
    const last = groups[groups.length - 1];
    if (!last || last.year !== year) {
      groups.push({ year, months: [month] });
    } else if (last.months[last.months.length - 1] !== month) {
      last.months.push(month);
    }
  }
  return groups;
}

export default function Journal() {
  const router = useRouter();
  const { entries, loading, error, refresh } = useJournal();
  const [search, setSearch] = useState('');
  // A year like "2026" or a month like "October 2026"; null shows all entries
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterVisible, setFilterVisible] = useState(false);

  // Only years and months that have entries
  const yearGroups = useMemo(() => groupByYear(entries), [entries]);

  // Falls back to all entries if the selected period's last entry was deleted
  const activePeriod =
    selectedPeriod &&
    yearGroups.some(
      group =>
        group.year === selectedPeriod || group.months.includes(selectedPeriod),
    )
      ? selectedPeriod
      : null;

  const sections = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = entries.filter(entry => {
      const date = new Date(entry.createdAt);
      return (
        (!activePeriod ||
          String(date.getFullYear()) === activePeriod ||
          formatMonthYear(date) === activePeriod) &&
        (entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query))
      );
    });
    // Entries from context are newest first
    return groupByMonth(
      sortOrder === 'oldest' ? [...filtered].reverse() : filtered,
    );
  }, [entries, search, activePeriod, sortOrder]);

  const goToNewEntry = () => router.push('/journal/new_entry');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>Journal</Text>
        <Pressable
          onPress={goToNewEntry}
          hitSlop={12}
          accessibilityLabel="New journal entry"
        >
          <Feather name="plus" size={30} color={colors.primary} />
        </Pressable>
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
        <View style={styles.emptyStateContainer}>
          <Feather name="book-open" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitleText}>No entries yet</Text>
          <Text style={styles.emptyMessageText}>
            This is your private space to write about how you are feeling or
            what happened today.
          </Text>
          <Button
            disabled={false}
            text="Write your first entry"
            onPress={goToNewEntry}
            containerStyle={styles.emptyButtonContainer}
          />
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
                placeholder="Search through journal..."
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
            <Pressable
              onPress={() => setFilterVisible(true)}
              hitSlop={8}
              style={[
                styles.filterButtonContainer,
                (activePeriod || sortOrder === 'oldest') &&
                  styles.filterButtonActiveContainer,
              ]}
              accessibilityLabel="Filter and sort entries"
            >
              <Image source={FilterIcon} style={styles.filterIcon} />
            </Pressable>
          </View>
          {activePeriod ? (
            <Pressable
              onPress={() => setSelectedPeriod(null)}
              hitSlop={8}
              style={styles.activeFilterChipContainer}
              accessibilityLabel={`Clear ${activePeriod} filter and show all entries`}
            >
              <Text style={styles.activeFilterChipText}>{activePeriod}</Text>
              <Feather name="x" size={14} color={colors.primary} />
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
              <Text style={styles.sectionHeaderText}>
                {section.title.toUpperCase()}
              </Text>
            )}
            renderItem={({ item }) => (
              <EntryCard
                entry={item}
                onPress={() =>
                  router.push({
                    pathname: '/journal/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>
                No entries match &quot;{search.trim()}&quot;
                {activePeriod ? ` in ${activePeriod}` : ''}
              </Text>
            }
          />
          <FilterModal
            visible={filterVisible}
            yearGroups={yearGroups}
            selectedPeriod={activePeriod}
            sortOrder={sortOrder}
            onSelectPeriod={setSelectedPeriod}
            onSelectSortOrder={setSortOrder}
            onClose={() => setFilterVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}
