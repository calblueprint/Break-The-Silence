import type { GuideCategory } from '@/data/guideCatalogTypes';
import { Pressable, ScrollView, Text } from 'react-native';
import { guideCategories } from '@/data/guideCatalogTypes';
import styles from '@/styles/guideCatalogStyles';

export type GuideFilter = 'All' | 'Bookmarked' | GuideCategory;

export default function CategoryChips({
  selected,
  onSelect,
}: {
  selected: GuideFilter;
  onSelect: (category: GuideFilter) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipList}
    >
      {(['All', 'Bookmarked', ...guideCategories] as GuideFilter[]).map(
        category => {
          const isSelected = selected === category;
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(category)}
              style={[styles.chip, isSelected && styles.selectedChip]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.selectedChipLabel,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        },
      )}
    </ScrollView>
  );
}
