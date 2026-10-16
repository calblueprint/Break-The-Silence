import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const searchableItemsList = [
  {
    title: 'Support Line',
    keywords: ['support', 'talk', 'help', 'someone', 'message'],
    route: '/support/support-line',
  },
  {
    title: 'Resources',
    keywords: ['resources', 'help', 'services', 'legal', 'shelter'],
    route: '/support/resources',
  },
  {
    title: 'Guides',
    keywords: ['guides', 'toolkit', 'information', 'learn', 'support'],
    route: '/support/guides',
  },
  {
    title: 'Diary',
    keywords: ['diary', 'journal', 'write', 'entry'],
    route: '/journal',
  },
  {
    title: 'Documents',
    keywords: ['documents', 'files', 'upload'],
    route: '/documents',
  },
  {
    title: 'Profile',
    keywords: ['profile', 'account', 'settings'],
    route: '/profile',
  },
];

export default function App() {
  const [searchableItems] = useState(searchableItemsList);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredSearchableItems = searchTerm.trim().toLowerCase()
    ? searchableItems.filter(item =>
        item.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        ),
      )
    : [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 24 }}>Good morning, Melissa</Text>
      <StatusBar style="light" />
      <View style={styles['search-bar']}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.trim() !== '' && (
          <ScrollView
            style={styles['search-results']}
            keyboardShouldPersistTaps="handled"
          >
            {filteredSearchableItems.map(item => (
              <TouchableOpacity
                style={styles.card}
                key={item.route}
                onPress={() => {
                  console.log('got o route here!');
                }}
              >
                <Link href={item.route}>{item.title}</Link>
                <Text>{item.route}</Text>
              </TouchableOpacity>
            ))}
            {filteredSearchableItems.length === 0 && (
              <Text> No results found</Text>
            )}
          </ScrollView>
        )}
      </View>
      <View>
        <Text style={styles.header2}>Recent Searches</Text>
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
        </View>
      </View>
      <View>
        <Text style={styles.header2}>Recommended for you</Text>
        <View style={styles['recommended-boxes-container']}>
          <View style={styles['recommended-boxes']}></View>
          <View style={styles['recommended-boxes']}></View>
        </View>
      </View>
      <View>
        <Text style={styles.header2}>Survivor ToolKit Assessment</Text>
        <View style={styles['assessment-box']}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'stretch',
    padding: '5%',
  },
  'search-bar': {
    width: '100%',
    height: 95,
    padding: 20,
    // backgroundColor: 'pink',
    zIndex: 1,
    elevation: 1,
  },
  'linked-text': {
    color: 'blue',
    fontSize: 16,
  },
  'indented-text': {
    marginLeft: '5%',
  },
  'recommended-boxes-container': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  'recommended-boxes': {
    width: 150,
    aspectRatio: 1,
    backgroundColor: 'gray',
  },
  'assessment-box': {
    backgroundColor: 'gray',
    width: '100%',
    height: 180,
  },
  header2: {
    fontSize: 22,
    fontWeight: 600,
  },
  'search-results': {
    position: 'absolute',
    top: 75,
    left: 20,
    right: 20,
    maxHeight: 200,
    // backgroundColor: 'white',
    zIndex: 2,
    elevation: 2,
  },
  input: {
    height: 45,
    borderColor: '#007BFF',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    // backgroundColor: '#F8F9FA',
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    // backgroundColor:'blue'
  },
});
