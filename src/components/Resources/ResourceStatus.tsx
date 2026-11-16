import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/resourceStyles';

export default function ResourceStatus({
  loading = false,
  error,
  title = 'No resources yet',
  description = 'Check back soon for services and support.',
  actionLabel,
  onAction,
}: {
  loading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      {loading ? (
        <>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.emptyDescription}>Loading resources…</Text>
        </>
      ) : (
        <>
          <View style={styles.emptyIcon}>
            <Feather
              name={error ? 'wifi-off' : 'search'}
              size={26}
              color={colors.primary}
            />
          </View>
          <Text
            accessibilityRole={error ? 'alert' : 'header'}
            style={styles.emptyTitle}
          >
            {error ? 'Unable to load resources' : title}
          </Text>
          <Text style={styles.emptyDescription}>{error ?? description}</Text>
          {actionLabel && onAction ? (
            <Pressable
              accessibilityRole="button"
              onPress={onAction}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressedCard,
              ]}
            >
              <Text style={styles.primaryButtonLabel}>{actionLabel}</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
}
