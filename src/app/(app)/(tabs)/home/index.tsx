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
import Card from '../../../../components/Card/card';
import { searchableItemsList } from '../../../../data/searchData';
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
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 24 }}>Good morning, Melissa</Text>
      <View style={styles['search-group']}>
        <View
          style={[
            styles['search-bar'],
            hasSearchResults && styles['search-bar-with-results'],
          ]}
        >
          <Ionicons name="search" size={22} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="What would you like to find?"
            placeholderTextColor="#94A3B8"
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
              <Ionicons name="close-circle" size={22} color="#94A3B8" />
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
                ? item.keywords.filter(keyword =>
                    keyword.toLowerCase().includes(normalizedSearchTerm),
                  )
                : item.keywords;
              const matchedContent = matchingKeywords.length
                ? matchingKeywords.join(', ')
                : 'Matches the title';

              return (
                <Card
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
        <Text style={styles['header-2']}>Recent Searches</Text>
        <View style={styles['indented-text']}>
          <Link style={styles['linked-text']} href="support">
            Guides - Financial Literacy
          </Link>
          <Link style={styles['linked-text']} href="documents">
            My Documents
          </Link>
          <Link style={styles['linked-text']} href="support">
            Resources near me
          </Link>
          <Link style={styles['linked-text']} href="documents">
            Survivor Toolkit
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
