import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import GuideSectionView from '@/components/GuideComponents/guideSection';
import mockGuides from '@/data/mockGuides';
import colors from '@/styles/colors';
import { guidePageStyles as styles } from '@/styles/guidesStyles';
import { typography } from '@/styles/typography';

export default function GuidePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const guide = mockGuides.find(item => item.slug === slug);

  function goBackToGuides() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)/guides');
    }
  }

  if (!guide) {
    return <Text>Guide not found.</Text>;
  }

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h3, styles.guideTitle]}>{guide.title}</Text>
        {guide.description ? (
          <Text style={[typography.p2, styles.guideDescription]}>
            {guide.description}
          </Text>
        ) : null}
        <View style={styles.sections}>
          {guide.sections.map(section => (
            <GuideSectionView key={section.id} guideSection={section} />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={goBackToGuides}
          style={styles.bottomBackButton}
        >
          <Feather name="arrow-left" size={18} color={colors.white} />
          <Text style={styles.bottomBackLabel}>Back to Toolkit</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
