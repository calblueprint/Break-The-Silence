import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
//import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/styles/colors';

export default function ProfileScreen() {
  const router = useRouter();
  //const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: 80 }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <Pressable style={styles.userInfoContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>User</Text>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </Pressable>

        <View style={styles.cardsContainer}>
          <Pressable
            style={styles.featureCard}
            onPress={() => router.push('/(app)/(tabs)/profile/documents')}
          >
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>My Documents</Text>
              <Text style={styles.featureCardSubtitle}>
                14 files stored, privately in this app
              </Text>
            </View>
            <View style={styles.featureCardIcon}>
              <Feather name="arrow-right" size={20} color={colors.white} />
            </View>
          </Pressable>

          <Pressable style={styles.featureCard}>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>Trusted contacts</Text>
              <Text style={styles.featureCardSubtitle}>
                2 people can receive what you share
              </Text>
            </View>
            <View style={styles.featureCardIcon}>
              <Feather name="arrow-right" size={20} color={colors.white} />
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Saved for you</Text>
        <View style={styles.listContainer}>
          <Pressable style={styles.listItem}>
            <Text style={styles.listItemText}>Saved Guides</Text>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.listItem}>
            <Text style={styles.listItemText}>Check-In Assessment Results</Text>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={[styles.listContainer, { marginBottom: 100 }]}>
          <Pressable style={styles.listItem}>
            <Text style={styles.listItemText}>Settings</Text>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.listItem}>
            <Text style={styles.listItemText}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color={colors.textMuted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.listItem}>
            <Text style={styles.listItemText}>Log out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Montserrat',
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat',
  },
  editProfileText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    fontFamily: 'Nunito Sans',
  },
  cardsContainer: {
    marginBottom: 23,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: 16,
    borderRadius: 16,
  },
  featureCardText: {
    flex: 1,
    paddingRight: 16,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Nunito Sans',
  },
  featureCardSubtitle: {
    fontSize: 13,
    color: colors.text,
    fontFamily: 'Nunito Sans',
  },
  featureCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  listContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 23,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8.5,
  },
  listItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    fontFamily: 'Nunito Sans',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
});
