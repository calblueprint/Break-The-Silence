import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { fontFamilies, typography } from '@/styles/typography';

export default StyleSheet.create({
  'home-base': {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    backgroundColor: colors.white,
    alignItems: 'stretch',
    padding: '5%',
    gap: 33,
  },
  'top-section': {
    gap: 20,
  },
  'content-section': {
    gap: 20,
  },
  // Check-in card and Quick Links sit closer together than the other sections
  'primary-section': {
    gap: 12,
  },

  // Greeting. The right padding keeps the text clear of the floating Safe Exit
  // button, which the tabs layout draws over the top-right of every screen.
  greeting: {
    paddingRight: 56,
  },
  'greeting-text': {
    fontFamily: fontFamilies.montserrat,
    fontSize: 17,
    lineHeight: 26,
    color: colors.black,
  },
  'greeting-name': {
    fontFamily: fontFamilies.montserratBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.black,
  },

  // Search
  'search-group': {
    width: '100%',
  },
  'search-bar': {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
  },
  'search-bar-with-results': {
    borderBottomColor: colors.border,
    borderWidth: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
  },
  input: {
    ...typography.p2,
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.text,
  },
  'results-with-items': {
    maxHeight: 204,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  'no-results': {
    paddingHorizontal: 18,
    paddingVertical: 20,
    color: colors.textMuted,
  },

  // Shared text styles
  'section-title': {
    ...typography.h4,
    lineHeight: 26,
    color: colors.black,
  },
  eyebrow: {
    ...typography.p3,
    lineHeight: 16,
    color: colors.primary,
  },
  'body-text': {
    ...typography.p2,
    lineHeight: 20,
    color: colors.slate600,
  },

  // Assessment check-in card
  'check-in-card': {
    padding: 16,
    gap: 20,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  'check-in-text': {
    gap: 15,
  },
  'check-in-title-group': {
    gap: 7,
  },
  'primary-button': {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  'primary-button-pressed': {
    opacity: 0.85,
  },
  'primary-button-text': {
    fontFamily: fontFamilies.montserratBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
  },

  // Quick links
  'quick-links-section': {
    gap: 8,
  },
  'quick-links-row': {
    flexDirection: 'row',
    paddingTop: 8,
  },
  'quick-link': {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  'quick-link-circle': {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  'quick-link-label': {
    ...typography.p3,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.slate600,
  },

  // Recommended for you
  'recommended-section': {
    gap: 8,
  },
  'section-header': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  'see-all': {
    ...typography.montserratBody,
    lineHeight: 20,
    color: colors.primary,
  },
  'recommended-list': {
    gap: 12,
  },
  'recommended-card': {
    gap: 19,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 16,
    backgroundColor: colors.slate100,
  },
  'recommended-title': {
    fontFamily: fontFamilies.montserratBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
});
