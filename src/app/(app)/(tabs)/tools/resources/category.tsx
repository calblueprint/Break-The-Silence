import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ResourceCard from '@/components/Resources/ResourceCard';
import ResourceRefreshNotice from '@/components/Resources/ResourceRefreshNotice';
import ResourceSearchBar from '@/components/Resources/ResourceSearchBar';
import ResourceStatus from '@/components/Resources/ResourceStatus';
import { useResources } from '@/context/ResourcesContext';
import colors from '@/styles/colors';
import guideDetailStyles from '@/styles/guideDetailStyles';
import styles from '@/styles/resourceStyles';
import {
  filterCategoryResources,
  getCategoryPresentation,
} from '@/utils/resourceCatalog';

export default function ResourceCategoryScreen() {
  const router = useRouter();
  const { category: categoryParam, search: searchParam } =
    useLocalSearchParams<{ category?: string; search?: string }>();
  const { resources, categories, loading, refreshing, error, refresh } =
    useResources();
  const category = categories.find(item => item.id === categoryParam);
  const [search, setSearch] = useState(searchParam ?? '');
  const presentation = getCategoryPresentation(category?.name ?? '');
  const visibleResources = useMemo(
    () => (category ? filterCategoryResources(category, search) : []),
    [category, search],
  );

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)/tools/resources');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        data={visibleResources}
        keyExtractor={item => item.id}
        style={styles.catalog}
        contentContainerStyle={guideDetailStyles.detailContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing && !loading}
            onRefresh={() => void refresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to resource categories"
              onPress={goBack}
              style={guideDetailStyles.detailHeader}
            >
              <Feather name="arrow-left" size={20} color={colors.primary} />
              <Text style={guideDetailStyles.detailHeaderLabel}>Resources</Text>
            </Pressable>
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: presentation.background },
                ]}
              >
                <Feather
                  name={presentation.icon}
                  size={26}
                  color={presentation.color}
                />
              </View>
              <Text accessibilityRole="header" style={styles.categoryTitle}>
                {category?.name ?? 'Resources'}
              </Text>
              {category ? (
                <Text style={styles.subtitle}>{presentation.description}</Text>
              ) : null}
            </View>
            <ResourceSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search resources in this category…"
            />
            <ResourceRefreshNotice />
            <View style={styles.sectionHeader}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>
                {search.trim() ? 'Search results' : 'All resources'}
              </Text>
              {category ? (
                <Text style={styles.sectionCount}>
                  {visibleResources.length}{' '}
                  {visibleResources.length === 1 ? 'resource' : 'resources'}
                </Text>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item }) => <ResourceCard resource={item} />}
        ListEmptyComponent={
          <ResourceStatus
            loading={loading || (refreshing && resources.length === 0)}
            error={resources.length === 0 ? error : null}
            title={
              !category
                ? 'Category unavailable'
                : search.trim()
                  ? 'No matches found'
                  : 'No resources yet'
            }
            description={
              !category
                ? 'Explore the other categories to find support.'
                : search.trim()
                  ? 'Try another resource name, service, or location.'
                  : undefined
            }
            actionLabel={
              error && resources.length === 0
                ? 'Try again'
                : !category
                  ? 'Browse categories'
                  : search.trim()
                    ? 'Clear search'
                    : undefined
            }
            onAction={
              error && resources.length === 0
                ? () => void refresh()
                : !category
                  ? goBack
                  : () => setSearch('')
            }
          />
        }
      />
    </SafeAreaView>
  );
}
