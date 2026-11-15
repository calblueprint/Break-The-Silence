import type { GuideCatalogEntry } from '@/data/guideCatalogTypes';
import type { ResourceBlock } from '@/data/guidesTypes';
import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GuideContentSection from '@/components/GuideComponents/GuideContentSection';
import { guideCatalogEntries } from '@/data/guideCatalogData';
import mockGuides from '@/data/mockGuides';
import colors from '@/styles/colors';
import detailStyles from '@/styles/guideDetailStyles';

type HelpfulResponse = 'yes' | 'not-really' | 'feedback' | null;

function GuideHeroImage({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (!imageUrl || loadFailed) {
    return (
      <View
        accessibilityLabel={`Image placeholder for ${title}`}
        style={detailStyles.detailImage}
      />
    );
  }

  return (
    <Image
      accessibilityLabel={title}
      source={{ uri: imageUrl }}
      resizeMode="cover"
      style={detailStyles.detailImage}
      onError={event => {
        console.error(
          `Failed to load guide image for ${title}: ${event.nativeEvent.error}`,
        );
        setLoadFailed(true);
      }}
    />
  );
}

export default function GuidePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const currentGuideEntry = guideCatalogEntries.find(
    item => item.id === slug || item.legacySlug === slug,
  );
  const detailedGuide = mockGuides.find(item => item.slug === slug);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [helpfulResponse, setHelpfulResponse] = useState<HelpfulResponse>(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setIsBookmarked(currentGuideEntry?.isBookmarked ?? false);
    setHelpfulResponse(null);
    setHelpfulFeedback('');
    setFeedbackSubmitted(false);
  }, [currentGuideEntry?.id]);

  function goBackToGuides() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)/tools/guides');
    }
  }

  function openGuide(guide: GuideCatalogEntry) {
    router.replace({
      pathname: '/(app)/(tabs)/tools/guides/[slug]',
      params: { slug: guide.legacySlug ?? guide.id },
    });
  }

  if (!currentGuideEntry) {
    return (
      <SafeAreaView style={detailStyles.detailScreen}>
        <Text>Guide not found.</Text>
      </SafeAreaView>
    );
  }

  const guidesInCategory = guideCatalogEntries.filter(
    guide => guide.category === currentGuideEntry.category,
  );
  const currentIndex = guidesInCategory.findIndex(
    guide => guide.id === currentGuideEntry.id,
  );
  const previousGuide =
    currentIndex > 0 ? guidesInCategory[currentIndex - 1] : null;
  const nextGuide =
    currentIndex >= 0 && currentIndex < guidesInCategory.length - 1
      ? guidesInCategory[currentIndex + 1]
      : null;
  const guideContentSections = (detailedGuide?.sections ?? [])
    .map(section => ({
      ...section,
      blocks: section.blocks.filter(block => block.type !== 'resource'),
    }))
    .filter(section => section.description || section.blocks.length > 0);
  const helpfulResources: ResourceBlock[] = (
    detailedGuide?.sections ?? []
  ).flatMap(section =>
    section.blocks.filter(
      (block): block is ResourceBlock => block.type === 'resource',
    ),
  );
  const helpfulOptions: { value: HelpfulResponse; label: string }[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'not-really', label: 'Not really' },
    { value: 'feedback', label: 'Write feedback' },
  ];

  return (
    <SafeAreaView edges={['top']} style={detailStyles.detailScreen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={detailStyles.detailContent}>
        <Pressable
          accessibilityRole="button"
          onPress={goBackToGuides}
          style={detailStyles.detailHeader}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={detailStyles.detailHeaderLabel}>Guides</Text>
        </Pressable>
        <GuideHeroImage
          key={currentGuideEntry.id}
          imageUrl={currentGuideEntry.imageUrl}
          title={currentGuideEntry.title}
        />
        <Text style={detailStyles.detailCategory}>
          {currentGuideEntry.category.toUpperCase()} · GUIDE{' '}
          {currentGuideEntry.orderInCategory} OF{' '}
          {currentGuideEntry.categoryGuideCount}
        </Text>
        <Text style={detailStyles.detailTitle}>{currentGuideEntry.title}</Text>
        <View style={detailStyles.detailReadRow}>
          <Text style={detailStyles.detailReadTime}>
            {currentGuideEntry.readTimeMinutes}{' '}
            {currentGuideEntry.readTimeMinutes === 1 ? 'minute' : 'minutes'}{' '}
            read
          </Text>
          <Text style={detailStyles.detailReadTime}>·</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isBookmarked ? 'Remove bookmark' : 'Bookmark guide'
            }
            accessibilityState={{ selected: isBookmarked }}
            onPress={() => setIsBookmarked(value => !value)}
            style={[
              detailStyles.bookmarkButton,
              isBookmarked && detailStyles.bookmarkButtonSelected,
            ]}
          >
            <MaterialCommunityIcons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={colors.primary}
            />
            <Text style={detailStyles.bookmarkLabel}>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </Pressable>
        </View>
        {currentGuideEntry.summary ? (
          <Text style={detailStyles.detailSummary}>
            {currentGuideEntry.summary}
          </Text>
        ) : null}
        {guideContentSections.map(section => (
          <GuideContentSection key={section.id} contentSection={section} />
        ))}
        {!detailedGuide && currentGuideEntry.body ? (
          <View style={detailStyles.detailBody}>
            <Text style={detailStyles.detailBodyText}>
              {currentGuideEntry.body}
            </Text>
          </View>
        ) : null}
        {helpfulResources.length > 0 ? (
          <GuideContentSection
            contentSection={{
              id: 'helpful-resources',
              title: 'Helpful Resources',
              blocks: helpfulResources,
            }}
          />
        ) : null}
        <View style={detailStyles.helpfulSection}>
          <Text style={detailStyles.helpfulQuestion}>
            Was this guide helpful?
          </Text>
          <View style={detailStyles.helpfulOptions}>
            {helpfulOptions.map(option => {
              const isSelected = helpfulResponse === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setHelpfulResponse(option.value);
                    setFeedbackSubmitted(false);
                  }}
                  style={[
                    detailStyles.helpfulOption,
                    isSelected && detailStyles.helpfulOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      detailStyles.helpfulOptionLabel,
                      isSelected && detailStyles.helpfulOptionSelectedLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {helpfulResponse !== null ? (
            <View style={detailStyles.feedbackForm}>
              <TextInput
                accessibilityLabel="Write feedback"
                multiline
                onChangeText={value => {
                  setHelpfulFeedback(value);
                  setFeedbackSubmitted(false);
                }}
                placeholder="Please write any feedback here"
                placeholderTextColor={colors.textMuted}
                style={detailStyles.feedbackInput}
                textAlignVertical="top"
                value={helpfulFeedback}
              />
              <View style={detailStyles.feedbackFormActions}>
                {feedbackSubmitted ? (
                  <Text style={detailStyles.feedbackSubmitted}>
                    Thank you for your feedback.
                  </Text>
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  disabled={!helpfulFeedback.trim()}
                  onPress={() => setFeedbackSubmitted(true)}
                  style={[
                    detailStyles.feedbackSubmitButton,
                    !helpfulFeedback.trim() &&
                      detailStyles.feedbackSubmitDisabled,
                  ]}
                >
                  <Text style={detailStyles.feedbackSubmitLabel}>Submit</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
        <View style={detailStyles.detailDots}>
          {guidesInCategory.map((guide, index) => (
            <View
              key={guide.id}
              style={[
                detailStyles.detailDot,
                index === currentIndex && detailStyles.detailDotActive,
              ]}
            />
          ))}
        </View>
        <View style={detailStyles.detailNavigation}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              previousGuide
                ? `Previous guide: ${previousGuide.title}`
                : 'No previous guide'
            }
            disabled={!previousGuide}
            onPress={() => previousGuide && openGuide(previousGuide)}
            style={[
              detailStyles.detailNavigationButton,
              !previousGuide && detailStyles.detailNavigationDisabled,
            ]}
          >
            <Text style={detailStyles.detailNavigationDirection}>
              ‹ Previous
            </Text>
            <Text style={detailStyles.detailNavigationTitle} numberOfLines={1}>
              {previousGuide?.title ?? 'First guide'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              nextGuide
                ? `Next guide: ${nextGuide.title}`
                : `Finish ${currentGuideEntry.category} guides`
            }
            onPress={() => {
              if (nextGuide) {
                openGuide(nextGuide);
              } else {
                router.push({
                  pathname: '/(app)/(tabs)/tools/guides/completed',
                  params: { category: currentGuideEntry.category },
                });
              }
            }}
            style={[
              detailStyles.detailNavigationButton,
              detailStyles.detailNavigationNext,
            ]}
          >
            <Text
              style={[
                detailStyles.detailNavigationDirection,
                detailStyles.detailNavigationNextDirection,
              ]}
            >
              {nextGuide ? 'Next guide ›' : 'Finish guides'}
            </Text>
            <Text
              style={[
                detailStyles.detailNavigationTitle,
                detailStyles.detailNavigationNextTitle,
              ]}
              numberOfLines={1}
            >
              {nextGuide?.title ?? 'See what to read next'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
