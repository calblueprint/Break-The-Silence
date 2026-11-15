import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { montserratBold, typography } from '@/styles/typography';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroIllustration: {
    width: '78%',
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 74,
    backgroundColor: '#DFF4E6',
  },
  heroOrbit: {
    width: 116,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 58,
    backgroundColor: '#C8EBD6',
  },
  heroShield: {
    width: 110,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeart: {
    position: 'absolute',
    top: 40,
  },
  title: {
    ...montserratBold,
    fontSize: 23,
    textAlign: 'center',
    color: colors.black,
  },
  subtitle: {
    ...typography.p1,
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 14,
    lineHeight: 23,
    textAlign: 'center',
    color: colors.textMuted,
  },
  upNextTitle: {
    ...montserratBold,
    marginBottom: 12,
    fontSize: 20,
    color: colors.black,
  },
  collectionList: {
    gap: 16,
    paddingRight: 20,
  },
  collectionCard: {
    width: 226,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#F6F7F9',
  },
  collectionArtwork: {
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionDetails: {
    minHeight: 82,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  collectionCount: {
    ...typography.p3,
    color: colors.primary,
  },
  collectionTitle: {
    ...montserratBold,
    fontSize: 16,
    color: colors.black,
  },
  backButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: colors.neutralLight,
  },
  backButtonLabel: {
    ...typography.p1,
    color: colors.text,
  },
  feedbackPrompt: {
    alignItems: 'center',
    gap: 4,
    marginTop: 18,
  },
  feedbackPromptLabel: {
    ...typography.p3,
    color: colors.text,
  },
  shareFeedback: {
    ...typography.p3,
    fontWeight: '700',
    color: colors.primary,
  },
});
