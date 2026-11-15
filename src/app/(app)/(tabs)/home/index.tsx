import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import styles from '@/styles/homeStyles';
import SearchResultRow from '../../../../components/SearchResultRow/searchResultRow';
import { searchableItemsList } from '../../../../data/searchData';

// TODO: use the signed-in user's name once the profile provides it
const PLACEHOLDER_NAME = 'Melissa';

interface QuickLinkItem {
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  // No href means the link is a placeholder and does nothing yet
  href?: Href;
}

const QUICK_LINKS: QuickLinkItem[] = [
  { label: 'Hotline', icon: 'smartphone', href: '/support/support-line' },
  // TODO: add the href once the Safety Plan page exists
  { label: 'Safety Plan', icon: 'shield' },
  { label: 'My Documents', icon: 'file', href: '/documents' },
  { label: 'Diary', icon: 'book', href: '/journal' },
];

// Placeholder content for now: the cards don't open anything yet
const RECOMMENDED = [
  { category: 'Finances', title: 'Opening a bank account of your own' },
  { category: 'Safety', title: 'Making a safety plan that fits your life' },
  { category: 'Support', title: 'What to expect when you call a hotline' },
  { category: 'Support', title: 'How to talk to a friend you trust' },
];

function QuickLink({ label, icon, href }: QuickLinkItem) {
  const item = (
    <Pressable
      style={styles['quick-link']}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles['quick-link-circle']}>
        <Feather name={icon} size={24} color={colors.primaryDark} />
      </View>
      <Text style={styles['quick-link-label']}>{label}</Text>
    </Pressable>
  );

  return href ? (
    <Link href={href} asChild>
      {item}
    </Link>
  ) : (
    item
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredSearchableItems = searchableItemsList.filter(
    item =>
      normalizedSearchTerm &&
      (item.title.toLowerCase().includes(normalizedSearchTerm) ||
        item.keywords.some(keyword =>
          keyword.toLowerCase().includes(normalizedSearchTerm),
        )),
  );
  const hasSearchResults = filteredSearchableItems.length > 0;

  return (
    <SafeAreaView style={styles['home-base']} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles['top-section']}>
          <View style={styles.greeting}>
            <Text style={styles['greeting-text']}>Good morning,</Text>
            <Text style={styles['greeting-name']}>{PLACEHOLDER_NAME}</Text>
          </View>
          <View style={styles['search-group']}>
            <View
              style={[
                styles['search-bar'],
                hasSearchResults && styles['search-bar-with-results'],
              ]}
            >
              <Ionicons name="search" size={20} color={colors.slate400} />
              <TextInput
                style={styles.input}
                placeholder="What would you like to find?"
                placeholderTextColor={colors.slate600}
                onChangeText={text => setSearchTerm(text)}
                value={searchTerm}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Search home destinations"
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity
                  accessibilityLabel="Clear search"
                  onPress={() => setSearchTerm('')}
                >
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={colors.slate400}
                  />
                </TouchableOpacity>
              )}
            </View>
            {hasSearchResults && (
              <ScrollView
                style={styles['results-with-items']}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {filteredSearchableItems.map(item => {
                  const matchingKeywords = normalizedSearchTerm
                    ? item.keywords.filter((keyword: string) =>
                        keyword.toLowerCase().includes(normalizedSearchTerm),
                      )
                    : item.keywords;
                  const matchedContent = matchingKeywords.length
                    ? matchingKeywords.join(', ')
                    : 'Matches the title';

                  return (
                    <SearchResultRow
                      key={item.route}
                      item={item}
                      matchedContent={matchedContent}
                    />
                  );
                })}
              </ScrollView>
            )}
            {normalizedSearchTerm.length > 0 && !hasSearchResults && (
              <Text style={styles['no-results']}>No matching results</Text>
            )}
          </View>
        </View>

        <View style={styles['content-section']}>
          <View style={styles['primary-section']}>
            <View style={styles['check-in-card']}>
              <View style={styles['check-in-text']}>
                <Text style={styles.eyebrow}>2-minute private check in</Text>
                <View style={styles['check-in-title-group']}>
                  <Text style={styles['section-title']}>
                    What happened today?
                  </Text>
                  <Text style={styles['body-text']}>
                    Answer a few questions, skip any you like.
                  </Text>
                </View>
              </View>
              {/* Placeholder: the check-in flow doesn't exist yet */}
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles['primary-button'],
                  pressed && styles['primary-button-pressed'],
                ]}
              >
                <Text style={styles['primary-button-text']}>
                  Start Check-In
                </Text>
              </Pressable>
            </View>

            <View style={styles['quick-links-section']}>
              <Text style={styles['section-title']}>Quick Links</Text>
              <View style={styles['quick-links-row']}>
                {QUICK_LINKS.map(link => (
                  <QuickLink key={link.label} {...link} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles['recommended-section']}>
            <View style={styles['section-header']}>
              <Text style={styles['section-title']}>Recommended for you</Text>
              {/* Placeholder: there is no "all" page yet */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="See all recommended"
                hitSlop={8}
              >
                <Text style={styles['see-all']}>See all</Text>
              </Pressable>
            </View>
            <View style={styles['recommended-list']}>
              {RECOMMENDED.map(card => (
                <View key={card.title} style={styles['recommended-card']}>
                  <Text style={styles.eyebrow}>{card.category}</Text>
                  <Text style={styles['recommended-title']}>{card.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
