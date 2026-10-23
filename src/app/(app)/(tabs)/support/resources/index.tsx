import type { ResourceWithDetails } from '~/api/supabase/queries/resources';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Logo from '@/components/Logo';
import { getResources } from '~/api/supabase/queries/resources';

// TODO: swap for an alias import (e.g. '@/api/supabase/queries/resources') if your tsconfig maps one.

/** Join the parts that exist, e.g. "123 Main St, Oakland, CA 94601". */
function formatAddress(parts: {
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
}) {
  const cityState = [parts.city, parts.state].filter(Boolean).join(', ');
  const cityStateZip = [cityState, parts.zip_code].filter(Boolean).join(' ');
  return [parts.street_address, cityStateZip].filter(Boolean).join(', ');
}

function openLink(url: string) {
  Linking.openURL(url).catch(() => {
    // Nothing useful to show for now; final handling comes with the designs.
  });
}

function withProtocol(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function ResourceCard({ resource }: { resource: ResourceWithDetails }) {
  const address = formatAddress(resource);
  const serviceAreas = resource.resource_service_area
    .map(area => formatAddress(area))
    .filter(Boolean);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{resource.name}</Text>

      {resource.resource_category_map.length > 0 && (
        <Text style={styles.categories}>
          {resource.resource_category_map.map(c => c.category).join(' · ')}
        </Text>
      )}

      {!!resource.description && (
        <Text style={styles.body}>{resource.description}</Text>
      )}
      {!!address && <Text style={styles.body}>{address}</Text>}

      {!!resource.website && (
        <Text
          style={styles.link}
          onPress={() => openLink(withProtocol(resource.website!))}
        >
          {resource.website}
        </Text>
      )}

      {serviceAreas.length > 0 && (
        <Text style={styles.body}>Serves: {serviceAreas.join('; ')}</Text>
      )}

      {resource.resource_contact.map(contact => (
        <View key={contact.id} style={styles.contact}>
          {!!contact.name && (
            <Text style={styles.contactName}>{contact.name}</Text>
          )}
          {!!contact.phone_number && (
            <Text
              style={styles.link}
              onPress={() => openLink(`tel:${contact.phone_number}`)}
            >
              {contact.phone_number}
            </Text>
          )}
          {!!contact.email_address && (
            <Text
              style={styles.link}
              onPress={() => openLink(`mailto:${contact.email_address}`)}
            >
              {contact.email_address}
            </Text>
          )}
          {!!contact.street_address && (
            <Text style={styles.body}>{contact.street_address}</Text>
          )}
        </View>
      ))}

      {!!resource.verified_at && (
        <Text style={styles.meta}>
          Verified {new Date(resource.verified_at).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState<ResourceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setResources(await getResources());
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong loading resources.',
      );
    }
  }, []);

  // Reload every time the tab comes into focus, so edits made in Retool show up.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ResourceCard resource={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Logo />
            <Text style={styles.title}>Resources</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.status} />
          ) : error ? (
            <Text style={[styles.status, styles.error]}>{error}</Text>
          ) : (
            <Text style={styles.status}>No resources available yet.</Text>
          )
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  categories: {
    fontSize: 12,
    color: '#666',
  },
  body: {
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    color: '#0a58ca',
  },
  contact: {
    marginTop: 4,
    gap: 2,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  status: {
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    color: '#b00020',
  },
});
