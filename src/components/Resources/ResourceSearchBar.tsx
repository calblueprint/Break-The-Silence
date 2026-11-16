import { Pressable, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/resourceStyles';

export default function ResourceSearchBar({
  value,
  onChangeText,
  placeholder = 'Search categories or resources…',
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={18} color={colors.textMuted} />
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          style={styles.searchClearButton}
        >
          <Feather name="x" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
