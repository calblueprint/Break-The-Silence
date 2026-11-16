import type { GuideCatalogEntry } from '@/data/guideCatalogTypes';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGuideBookmarks } from '@/context/GuideBookmarksContext';
import colors from '@/styles/colors';
import styles from '@/styles/guideCatalogStyles';

function HighlightedText({
  text,
  query,
  style,
  numberOfLines,
  ellipsizeMode,
  adjustsFontSizeToFit,
  minimumFontScale,
}: {
  text: string;
  query: string;
  style: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
}) {
  const normalizedQuery = query.toLocaleLowerCase();
  if (!normalizedQuery) {
    return (
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        minimumFontScale={minimumFontScale}
        style={style}
      >
        {text}
      </Text>
    );
  }

  const normalizedText = text.toLocaleLowerCase();
  const highlightedParts: ReactNode[] = [];
  let cursor = 0;
  let start = normalizedText.indexOf(normalizedQuery, cursor);

  while (start !== -1) {
    if (start > cursor) {
      highlightedParts.push(text.slice(cursor, start));
    }

    const end = start + normalizedQuery.length;
    highlightedParts.push(
      <Text key={`highlight-${start}`} style={styles.searchHighlight}>
        {text.slice(start, end)}
      </Text>,
    );
    cursor = end;
    start = normalizedText.indexOf(normalizedQuery, cursor);
  }

  if (highlightedParts.length === 0) {
    return (
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        minimumFontScale={minimumFontScale}
        style={style}
      >
        {text}
      </Text>
    );
  }

  if (cursor < text.length) {
    highlightedParts.push(text.slice(cursor));
  }

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={style}
    >
      {highlightedParts}
    </Text>
  );
}

function getSearchSnippet(
  text: string,
  matchIndex: number,
  queryLength: number,
) {
  const start = Math.max(0, matchIndex - 28);
  const end = Math.min(text.length, matchIndex + queryLength + 48);
  const snippet = text.slice(start, end).trim();
  return `${start > 0 ? '…' : ''}${snippet}${end < text.length ? '…' : ''}`;
}

function getCardDescription(guide: GuideCatalogEntry, query: string) {
  if (!query) return guide.summary;

  const normalizedQuery = query.toLocaleLowerCase();
  const summaryMatch = guide.summary
    .toLocaleLowerCase()
    .indexOf(normalizedQuery);
  if (summaryMatch !== -1) {
    return getSearchSnippet(guide.summary, summaryMatch, query.length);
  }

  const bodyMatch = guide.body.toLocaleLowerCase().indexOf(normalizedQuery);
  if (bodyMatch !== -1) {
    return getSearchSnippet(guide.body, bodyMatch, query.length);
  }

  return (
    guide.tags.find(tag => tag.toLocaleLowerCase().includes(normalizedQuery)) ??
    guide.summary
  );
}

export default function GuideCard({
  guide,
  onPress,
  width,
  grid = false,
  searchQuery = '',
}: {
  guide: GuideCatalogEntry;
  onPress: () => void;
  width: number;
  grid?: boolean;
  searchQuery?: string;
}) {
  const { isBookmarked, toggleBookmark, loading } = useGuideBookmarks();
  const bookmarked = isBookmarked(guide.id);
  const description = searchQuery ? getCardDescription(guide, searchQuery) : '';

  return (
    <View
      style={[
        styles.guideCard,
        Boolean(searchQuery) && styles.guideCardSearch,
        grid && styles.categoryGuideGridCard,
        { width, minWidth: width, maxWidth: width },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open guide: ${guide.title}, ${
          bookmarked ? 'bookmarked' : 'not bookmarked'
        }`}
        onPress={onPress}
        style={styles.guideCardContent}
      >
        <View style={styles.guideIllustration} />
        <HighlightedText
          text={guide.category}
          query={searchQuery}
          style={styles.guideCategory}
        />
        <HighlightedText
          text={guide.title}
          query={searchQuery}
          style={styles.guideTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        />
        {description ? (
          <HighlightedText
            text={description}
            query={searchQuery}
            style={styles.guideDescription}
            numberOfLines={2}
          />
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${bookmarked ? 'Remove bookmark' : 'Bookmark guide'}: ${guide.title}`}
        accessibilityState={{ selected: bookmarked }}
        disabled={loading}
        onPress={() => toggleBookmark(guide.id)}
        style={styles.guideBookmarkButton}
      >
        <MaterialCommunityIcons
          name={bookmarked ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={colors.primary}
        />
      </Pressable>
    </View>
  );
}
