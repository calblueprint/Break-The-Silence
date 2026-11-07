import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchResultRow from '../../../../components/SearchResultRow/searchResultRow';
import { searchableItemsList } from '../../../../data/searchData';
import colors from '../../../../styles/colors';
import styles from '../../../../styles/homeStyles';

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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 24 }}>Welcome!</Text>
      <View style={styles['search-group']}>
        <View
          style={[
            styles['search-bar'],
            hasSearchResults && styles['search-bar-with-results'],
          ]}
        >
          <Ionicons name="search" size={22} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="What would you like to find?"
            placeholderTextColor={colors.textMuted}
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
                color={colors.textMuted}
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
      <View>
        <Text style={styles['header-2']}>Quick Links</Text>
        <View style={styles['indented-text']}>
          <Link style={styles['linked-text']} href="support/resources">
            Help Near Me
          </Link>
          <Link style={styles['linked-text']} href="support/support-line">
            Talk to Someone
          </Link>
          <Link style={styles['linked-text']} href="journal">
            I Want to Write Something Down
          </Link>
        </View>
      </View>
      <View>
        <Text style={styles['header-2']}>Recommended for you</Text>
        <View style={styles['recommended-boxes-container']}>
          <View style={styles['recommended-boxes']}></View>
          <View style={styles['recommended-boxes']}></View>
        </View>
      </View>
      <View>
        <Text style={styles['header-2']}>Survivor ToolKit Assessment</Text>
        <View style={styles['assessment-box']}></View>
      </View>
    </ScrollView>
  );
}
