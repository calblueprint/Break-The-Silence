import { StyleSheet } from 'react-native';
import colors from './colors';

export const toolkitListStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  pageTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  tableTitle: {
    marginBottom: 10,
    textAlign: 'center',
  },
  guideList: {
    width: '100%',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  number: {
    marginRight: 5,
  },
  guideLink: {
    color: colors.primary,
  },
  footer: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  footerTitle: {
    marginBottom: 6,
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '700',
  },
  footerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  footerText: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 11,
  },
  infinity: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
});

export const guidePageStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  guideTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.white,
    alignItems: 'stretch',
  },
  guideDescription: {
    marginBottom: 24,
    textAlign: 'left',
  },
  sections: {
    width: '100%',
  },
  bottomBackButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  bottomBackLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const guideSectionStyles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 12,
  },
  blockTitle: {
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  marker: {
    minWidth: 28,
  },
  listText: {
    flex: 1,
  },
  callout: {
    padding: 12,
    borderRadius: 12,
  },
  calloutInfo: {
    backgroundColor: colors.primaryLight,
  },
  calloutWarning: {
    backgroundColor: colors.warningLight,
  },
  calloutSuccess: {
    backgroundColor: colors.successLight,
  },
  calloutNeutral: {
    backgroundColor: colors.neutralLight,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  comparisonColumn: {
    marginBottom: 10,
  },
  comparisonItem: {
    marginBottom: 4,
  },
  image: {
    borderRadius: 12,
  },
  imageFallback: {
    minHeight: 72,
    justifyContent: 'center',
    gap: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  imageFallbackTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
