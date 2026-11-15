import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ResourceCategoryCard from '@/components/Resources/ResourceCategoryCard';
import ResourceRefreshNotice from '@/components/Resources/ResourceRefreshNotice';
import ResourceSearchBar from '@/components/Resources/ResourceSearchBar';
import ResourceStatus from '@/components/Resources/ResourceStatus';
import { useResources } from '@/context/ResourcesContext';
import colors from '@/styles/colors';
import styles from '@/styles/resourceStyles';
import { filterCategoryResources } from '@/utils/resourceCatalog';

export default function ResourcesScreen() {
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const { resources, categories, loading, refreshing, error, refresh } =
    useResources();
  const [search, setSearch] = useState('');
  const columns = width < 360 || fontScale > 1.3 ? 1 : 2;
  const visibleCategories = useMemo(
    () =>
      categories
        .map(category => ({
          category,
          count: filterCategoryResources(category, search).length,
        }))
        .filter(item => item.count > 0),
    [categories, search],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        key={columns}
        numColumns={columns}
        data={visibleCategories}
        keyExtractor={item => item.category.id}
        style={styles.catalog}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={columns === 2 ? styles.categoryRow : undefined}
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
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                Resources
              </Text>
              <Text style={styles.subtitle}>
                Find support that fits your needs. Choose a category to get
                started.
              </Text>
            </View>
            <ResourceSearchBar value={search} onChangeText={setSearch} />
            <ResourceRefreshNotice />
            <View style={styles.sectionHeader}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>
                {search.trim() ? 'Matching categories' : 'Browse by type'}
              </Text>
              {!loading && !error ? (
                <Text style={styles.sectionCount}>
                  {search.trim()
                    ? `${visibleCategories.length} ${visibleCategories.length === 1 ? 'type' : 'types'}`
                    : `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'}`}
                </Text>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={
              columns === 2 ? styles.categoryCell : styles.categorySingleCell
            }
          >
            <ResourceCategoryCard
              category={item.category}
              count={item.count}
              onPress={() =>
                router.push({
                  pathname: '/(app)/(tabs)/tools/resources/category',
                  params: { category: item.category.id, search: search.trim() },
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <ResourceStatus
            loading={loading}
            error={resources.length === 0 ? error : null}
            title={search.trim() ? 'No matches found' : undefined}
            description={
              search.trim()
                ? 'Try another service, resource name, or location.'
                : undefined
            }
            actionLabel={
              error && resources.length === 0
                ? 'Try again'
                : search.trim()
                  ? 'Clear search'
                  : undefined
            }
            onAction={
              error && resources.length === 0
                ? () => void refresh()
                : () => setSearch('')
            }
          />
        }
      />
    </SafeAreaView>
  );
}
