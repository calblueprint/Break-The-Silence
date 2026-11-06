import { ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import mockGuides from '@/data/mockGuides';
import { toolkitListStyles as styles } from '@/styles/guidesStyles';
import { typography } from '@/styles/typography';

export default function App() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, styles.pageTitle]}>Survivor Tool Kit</Text>
        <Text style={[typography.h3, styles.tableTitle]}>
          Table of Contents
        </Text>
        <View style={styles.guideList}>
          {mockGuides.map((guide, index) => (
            <View key={guide.id} style={styles.guideRow}>
              <Text style={[typography.p1, styles.number]}>{index + 1}.</Text>
              <Link
                href={{
                  pathname: '/(app)/(tabs)/guides/[slug]',
                  params: { slug: guide.slug },
                }}
                style={[typography.p1Link, styles.guideLink]}
              >
                {guide.title}
              </Link>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Need support?</Text>
        <View style={styles.footerDetails}>
          <Text style={styles.footerText}>Support line: 855-BTS-1777</Text>
          <Text accessibilityLabel="Infinity symbol" style={styles.infinity}>
            ∞
          </Text>
          <Text style={styles.footerText}>BTSADV.ORG/TOOLKIT</Text>
        </View>
      </View>
    </View>
  );
}
