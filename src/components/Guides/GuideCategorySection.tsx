import type {
  GuideCatalogEntry,
  GuideCategory,
} from '@/data/guideCatalogTypes';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import GuideCard from '@/components/Guides/GuideCard';
import styles from '@/styles/guideCatalogStyles';

export default function GuideCategorySection({
  category,
  guides,
  onSeeAll,
  onGuidePress,
  grid = false,
  searchQuery = '',
}: {
  category: GuideCategory;
  guides: GuideCatalogEntry[];
  onSeeAll: (category: GuideCategory) => void;
  onGuidePress: (guide: GuideCatalogEntry) => void;
  grid?: boolean;
  searchQuery?: string;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(screenWidth * 0.44, (screenWidth - 44) / 2);

  return (
    <View style={styles.categorySection}>
      <View style={styles.categorySectionHeader}>
        <Text style={styles.categorySectionTitle}>{category}</Text>
        {!grid ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSeeAll(category)}
            hitSlop={8}
          >
            <Text style={styles.categorySeeAllLink}>See all</Text>
          </Pressable>
        ) : null}
      </View>
      {grid ? (
        <View style={styles.categoryGuideGrid}>
          {guides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onPress={() => onGuidePress(guide)}
              width={cardWidth}
              grid
              searchQuery={searchQuery}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalGuideRow}
        >
          {guides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onPress={() => onGuidePress(guide)}
              width={cardWidth}
              searchQuery={searchQuery}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
