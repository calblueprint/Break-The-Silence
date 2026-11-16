import { Pressable, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/guideCatalogStyles';

export default function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={16} color={colors.navInactive} />
      <TextInput
        accessibilityLabel="Search through guides"
        placeholder="Search through guides..."
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={8}
        onPress={() => onChangeText('')}
        style={styles.searchClearButton}
      >
        <Feather name="x" size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}
