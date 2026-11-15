import type { ResourceCategory } from '@/utils/resourceCatalog';
import { Pressable, Text, View } from 'react-native';
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${count} ${count === 1 ? 'resource' : 'resources'}`}
      accessibilityHint="Opens the resources in this category"
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryCard,
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
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryDescription}>{presentation.description}</Text>
      <View style={styles.categoryFooter}>
        <Text style={styles.categoryCount}>
          {count} {count === 1 ? 'resource' : 'resources'}
        </Text>
        <Feather name="arrow-right" size={18} color={colors.primary} />
      </View>
    </Pressable>
  );
}
