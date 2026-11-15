import type { ResourceWithDetails } from '~/api/supabase/queries/resources';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/resourceStyles';
import { formatResourceAddress } from '@/utils/resourceCatalog';

export default function ResourceCard({
  resource,
}: {
  resource: ResourceWithDetails;
}) {
  const [linkError, setLinkError] = useState<string | null>(null);
  const address = formatResourceAddress(resource);
  const serviceAreas = resource.resource_service_area
    .map(formatResourceAddress)
    .filter(Boolean);
  const categories = [
    ...new Set(
      resource.resource_category_map
        .map(item => item.category.trim())
        .filter(Boolean),
    ),
  ];
  const verifiedDate = resource.verified_at
    ? new Date(resource.verified_at)
    : null;

  async function openLink(url: string) {
    setLinkError(null);
    try {
      await Linking.openURL(url);
    } catch {
      setLinkError(
        'This link couldn’t be opened. Please use the contact details shown here.',
      );
    }
  }

  async function openWebsite() {
    const website = resource.website?.trim();
    if (!website) return;
    const url = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol))
        throw new Error('Invalid website');
      await openLink(parsed.href);
    } catch {
      setLinkError(
        'This website couldn’t be opened. Please use the other contact details shown here.',
      );
    }
  }

  return (
    <View style={styles.resourceCard}>
      {categories.length > 0 ? (
        <View style={styles.tags}>
          {categories.map(category => (
            <View key={category} style={styles.tag}>
              <Text style={styles.tagLabel}>{category}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text accessibilityRole="header" style={styles.resourceName}>
        {resource.name}
      </Text>
      {resource.description ? (
        <Text style={styles.body}>{resource.description}</Text>
      ) : null}
      {address ? (
        <View style={styles.detailRow}>
          <Feather
            name="map-pin"
            size={16}
            color={colors.textMuted}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>{address}</Text>
        </View>
      ) : null}
      {serviceAreas.length > 0 ? (
        <View style={styles.detailRow}>
          <Feather
            name="map"
            size={16}
            color={colors.textMuted}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            Serves: {serviceAreas.join('; ')}
          </Text>
        </View>
      ) : null}
      {resource.website ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Visit ${resource.name} website`}
          onPress={() => void openWebsite()}
          style={({ pressed }) => [
            styles.websiteButton,
            pressed && styles.pressedCard,
          ]}
        >
          <View style={styles.websiteDetails}>
            <Text style={styles.textButtonLabel}>Visit website</Text>
            <Text numberOfLines={1} style={styles.websiteAddress}>
              {resource.website}
            </Text>
          </View>
          <Feather name="external-link" size={18} color={colors.primary} />
        </Pressable>
      ) : null}
      {resource.resource_contact.map(contact => {
        if (
          !contact.name &&
          !contact.phone_number &&
          !contact.email_address &&
          !contact.street_address
        )
          return null;
        return (
          <View key={contact.id} style={styles.contact}>
            <Text style={styles.contactName}>{contact.name || 'Contact'}</Text>
            {contact.phone_number ? (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Call ${contact.name || resource.name} at ${contact.phone_number}`}
                onPress={() =>
                  void openLink(`tel:${contact.phone_number!.trim()}`)
                }
                style={styles.contactLink}
              >
                <Feather name="phone" size={16} color={colors.primary} />
                <Text style={styles.contactLinkLabel}>
                  {contact.phone_number}
                </Text>
              </Pressable>
            ) : null}
            {contact.email_address ? (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Email ${contact.name || resource.name} at ${contact.email_address}`}
                onPress={() =>
                  void openLink(`mailto:${contact.email_address!.trim()}`)
                }
                style={styles.contactLink}
              >
                <Feather name="mail" size={16} color={colors.primary} />
                <Text style={styles.contactLinkLabel}>
                  {contact.email_address}
                </Text>
              </Pressable>
            ) : null}
            {contact.street_address ? (
              <Text style={styles.detailText}>{contact.street_address}</Text>
            ) : null}
          </View>
        );
      })}
      {verifiedDate && !Number.isNaN(verifiedDate.getTime()) ? (
        <View style={styles.verifiedRow}>
          <Feather name="check-circle" size={13} color={colors.textMuted} />
          <Text style={styles.verifiedText}>
            Verified {verifiedDate.toLocaleDateString()}
          </Text>
        </View>
      ) : null}
      {linkError ? (
        <Text accessibilityRole="alert" style={styles.linkError}>
          {linkError}
        </Text>
      ) : null}
    </View>
  );
}
