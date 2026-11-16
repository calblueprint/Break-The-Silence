import type { GuideCategory } from '@/data/guideCatalogTypes';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { guideCatalogEntries } from '@/data/guideCatalogData';
import { guideCategories } from '@/data/guideCatalogTypes';
import colors from '@/styles/colors';
import styles from '@/styles/guideCompletionStyles';

const collectionArtwork = {
  'After the Abuse': {
    icon: 'heart-multiple',
    backgroundColor: '#FCE4D6',
  },
  'Am I at Risk?': {
    icon: 'shield-alert',
    backgroundColor: '#E1F3E8',
  },
  'Addiction & Rehab': {
    icon: 'leaf',
    backgroundColor: '#EDE5F7',
  },
  Protections: {
    icon: 'briefcase',
    backgroundColor: '#FCE4D6',
  },
  'Workplace & School': {
    icon: 'school',
    backgroundColor: '#EDE5F7',
  },
  'Support & Healing': {
    icon: 'account-group',
    backgroundColor: '#E1F3E8',
  },
} as const;

function getRandomCollections(category: GuideCategory): GuideCategory[] {
  const collections = guideCategories.filter(item => item !== category);
  for (let index = collections.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [collections[index], collections[swapIndex]] = [
      collections[swapIndex],
      collections[index],
    ];
  }
  return collections.slice(0, 2);
}

export default function GuideCompletionScreen() {
  const router = useRouter();
  const { category: categoryParam } = useLocalSearchParams<{
    category?: string;
  }>();
  const completedCategory =
    guideCategories.find(category => category === categoryParam) ??
    guideCategories[0];
  const suggestedCategories = useMemo(
    () => getRandomCollections(completedCategory),
    [completedCategory],
  );
  const completedCount = guideCatalogEntries.filter(
    guide => guide.category === completedCategory,
  ).length;

  function openCollection(category: GuideCategory) {
    router.replace({
      pathname: '/(app)/(tabs)/tools/guides',
      params: { category },
    });
  }

  function backToAllGuides() {
    router.replace({
      pathname: '/(app)/(tabs)/tools/guides',
      params: { category: 'All' },
    });
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroIllustration}>
          <View style={styles.heroOrbit}>
            <View style={styles.heroShield}>
              <MaterialCommunityIcons
                name="shield"
                size={108}
                color={colors.primary}
              />
              <Feather
                name="heart"
                size={32}
                color={colors.white}
                style={styles.heroHeart}
              />
            </View>
          </View>
        </View>

        <Text style={styles.title}>You finished {completedCategory}</Text>
        <Text style={styles.subtitle}>
          You read all {completedCount} guides. You can come back to any of them
          anytime.
        </Text>

        <Text style={styles.upNextTitle}>Up Next</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionList}
        >
          {suggestedCategories.map(category => {
            const artwork = collectionArtwork[category];
            const guideCount = guideCatalogEntries.filter(
              guide => guide.category === category,
            ).length;

            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityLabel={`${category}, ${guideCount} guides`}
                onPress={() => openCollection(category)}
                style={styles.collectionCard}
              >
                <View
                  style={[
                    styles.collectionArtwork,
                    { backgroundColor: artwork.backgroundColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={artwork.icon}
                    size={76}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.collectionDetails}>
                  <Text style={styles.collectionCount}>
                    {guideCount} guides
                  </Text>
                  <Text numberOfLines={2} style={styles.collectionTitle}>
                    {category}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          onPress={backToAllGuides}
          style={styles.backButton}
        >
          <Text style={styles.backButtonLabel}>Back to all guides</Text>
        </Pressable>
        <View style={styles.feedbackPrompt}>
          <Text style={styles.feedbackPromptLabel}>
            Have thoughts on these guides?
          </Text>
          <Text style={styles.shareFeedback}>Share feedback</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
