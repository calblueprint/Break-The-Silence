import { Pressable, Text, View } from 'react-native';
import { useResources } from '@/context/ResourcesContext';
import styles from '@/styles/resourceStyles';

export default function ResourceRefreshNotice() {
  const { error, resources, refreshing, refresh } = useResources();
  if (!error || resources.length === 0) return null;

  return (
    <View style={styles.refreshNotice}>
      <Text accessibilityRole="alert" style={styles.refreshNoticeText}>
        Couldn’t refresh. Showing the last loaded resources.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => void refresh()}
        disabled={refreshing}
        style={styles.retryButton}
      >
        <Text style={styles.textButtonLabel}>Try again</Text>
      </Pressable>
    </View>
  );
}
