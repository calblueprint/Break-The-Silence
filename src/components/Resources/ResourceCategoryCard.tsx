import type { ResourceCategory } from '@/utils/resourceCatalog';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/resourceStyles';
import { getCategoryPresentation } from '@/utils/resourceCatalog';

export default function ResourceCategoryCard({
  category,
  count,
  onPress,
}: {
  category: ResourceCategory;
  count: number;
  onPress: () => void;
}) {
  const presentation = getCategoryPresentation(category.name);
  const { fontScale } = useWindowDimensions();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${count} ${count === 1 ? 'resource' : 'resources'}`}
      accessibilityHint="Opens the resources in this category"
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
        fontScale > 1.3 && styles.categoryCardLargeText,
        pressed && styles.pressedCard,
      ]}
    >
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
      <View style={styles.categoryDetails}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>
          {presentation.description}
        </Text>
        <Text style={styles.categoryCount}>
          {count} {count === 1 ? 'resource' : 'resources'}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.primary} />
    </Pressable>
  );
}
