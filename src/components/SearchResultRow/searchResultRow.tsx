import type { Href } from 'expo-router';
import type { SearchResultItem } from '../../data/searchData';
import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import styles from './styles';

export default function SearchResultRow({
  item,
  matchedContent,
}: {
  item: SearchResultItem;
  matchedContent: string;
}) {
  return (
    <Link href={item.route as Href} asChild>
      <TouchableOpacity style={styles['result-row']} accessibilityRole="button">
        <View style={styles['result-text']}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles['matched-content']} numberOfLines={1}>
            <Text style={styles['red-text']}>Matching: </Text>
            {matchedContent}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
