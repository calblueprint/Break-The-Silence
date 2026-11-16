import type { GuideFilter } from '@/components/Guides/CategoryChips';
import type {
  GuideCatalogEntry,
  GuideCategory,
} from '@/data/guideCatalogTypes';
import type { ScrollViewInstance } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CategoryChips from '@/components/Guides/CategoryChips';
import ContinueReadingCard from '@/components/Guides/ContinueReadingCard';
import GuideCategorySection from '@/components/Guides/GuideCategorySection';
import SearchBar from '@/components/Guides/SearchBar';
import { useGuideBookmarks } from '@/context/GuideBookmarksContext';
import {
  continueReadingGuide,
  guideCatalogEntries,
} from '@/data/guideCatalogData';
import { guideCategories } from '@/data/guideCatalogTypes';
import styles from '@/styles/guideCatalogStyles';

function getGuideFilter(value: string | undefined): GuideFilter {
  if (value === 'All' || value === 'Bookmarked') return value;
  return guideCategories.find(category => category === value) ?? 'All';
}

export default function GuidesScreen() {
  const router = useRouter();
  const {
    isBookmarked,
    loading: bookmarksLoading,
    error: bookmarkError,
  } = useGuideBookmarks();
  const { category: categoryParam } = useLocalSearchParams<{
    category?: string;
  }>();
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const [selectedCategory, setSelectedCategory] = useState<GuideFilter>('All');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    setSelectedCategory(getGuideFilter(categoryParam));
  }, [categoryParam]);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(searchText.trim()),
      250,
    );
    return () => clearTimeout(timeout);
  }, [searchText]);

  const visibleSections = useMemo(() => {
    const query = debouncedSearch.toLocaleLowerCase();
    const categories =
      selectedCategory === 'All' || selectedCategory === 'Bookmarked'
        ? guideCategories
        : [selectedCategory];
    return categories
      .map(category => ({
        category,
        guides: guideCatalogEntries.filter(guide => {
          if (guide.category !== category) return false;
          if (selectedCategory === 'Bookmarked' && !isBookmarked(guide.id)) {
            return false;
          }
          if (!query) return true;
          const searchableContent = [
            guide.title,
            guide.category,
            guide.summary,
            guide.body,
            ...guide.tags,
          ]
            .join(' ')
            .toLocaleLowerCase();
          return searchableContent.includes(query);
        }),
      }))
      .filter(section => section.guides.length > 0);
  }, [debouncedSearch, selectedCategory, isBookmarked]);

  function handleSeeAll(category: GuideCategory) {
    setSelectedCategory(category);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  function handleGuidePress(guide: GuideCatalogEntry) {
    router.push({
      pathname: '/(app)/(tabs)/tools/guides/[slug]',
      params: { slug: guide.legacySlug ?? guide.id },
    });
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Guides</Text>
        </View>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <CategoryChips
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {bookmarkError ? (
          <Text accessibilityRole="alert" style={styles.emptyStateText}>
            {bookmarkError}
          </Text>
        ) : null}
        {selectedCategory === 'All' && !debouncedSearch ? (
          <ContinueReadingCard guide={continueReadingGuide} />
        ) : null}
        {visibleSections.length > 0 ? (
          visibleSections.map(section => (
            <GuideCategorySection
              key={section.category}
              category={section.category}
              guides={section.guides}
              onSeeAll={handleSeeAll}
              onGuidePress={handleGuidePress}
              grid={selectedCategory !== 'All' || Boolean(debouncedSearch)}
              searchQuery={debouncedSearch}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {selectedCategory === 'Bookmarked' &&
              bookmarksLoading &&
              !bookmarkError
                ? 'Loading bookmarks…'
                : 'No guides found'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
