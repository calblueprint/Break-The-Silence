import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import { photoGridStyles as styles } from './styles';

interface PhotoGridProps {
  count: number;
  // Shows an ✕ on each photo when set
  onRemove?: (index: number) => void;
}

// "PHOTOS (2)" and a row of thumbnails. Thumbnails are gray placeholders until
// entries store real photos.
export default function PhotoGrid({ count, onRemove }: PhotoGridProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.labelText}>PHOTOS ({count})</Text>
      <View style={styles.rowContainer}>
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={styles.photoPlaceholder}>
            <Feather name="image" size={20} color={colors.slate400} />
            {onRemove ? (
              <Pressable
                onPress={() => onRemove(i)}
                hitSlop={8}
                style={styles.removeButtonContainer}
                accessibilityLabel={`Remove photo ${i + 1}`}
                accessibilityRole="button"
              >
                <Feather name="x" size={12} color={colors.white} />
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
