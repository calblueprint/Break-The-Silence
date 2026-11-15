import type { ContinueReadingGuide } from '@/data/guideCatalogTypes';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/guideCatalogStyles';

export default function ContinueReadingCard({
  guide,
}: {
  guide: ContinueReadingGuide;
}) {
  return (
    <View style={styles.continueCard}>
      <View style={styles.continueIllustration} />
      <View style={styles.continueDetails}>
        <Text style={styles.continueTitle}>{guide.title}</Text>
        <Text style={styles.continueSubtitle} numberOfLines={1}>
          {guide.category}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${guide.progress * 100}%` }]}
          />
        </View>
      </View>
      <View style={styles.continueButton}>
        <Feather name="arrow-right" size={17} color={colors.primary} />
      </View>
    </View>
  );
}
