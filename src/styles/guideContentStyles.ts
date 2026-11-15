import { StyleSheet } from 'react-native';
import colors from './colors';
import { montserratBold, typography } from './typography';

export const guideTableOfContentsStyles = StyleSheet.create({
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
  guideRowButton: {
    width: '100%',
    height: 78,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 8,
    backgroundColor: colors.inputBackground,
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  guideCategoryLabel: {
    ...typography.p2,
    fontSize: 12,
    color: colors.primary,
  },
  guideTitleLabel: {
    ...montserratBold,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  number: {
    marginRight: 5,
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

export const guideArticlePageStyles = StyleSheet.create({
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
  guideRowButton: {
    minHeight: 48,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  bottomBackLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const guideContentSectionStyles = StyleSheet.create({
  websitePromptOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.overlay,
  },
  websitePromptDialog: {
    width: '100%',
    maxWidth: 360,
    gap: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  websitePromptTitle: {
    ...typography.h4,
    color: colors.black,
  },
  websitePromptMessage: {
    ...typography.p2,
    color: colors.text,
  },
  websitePromptActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  websitePromptButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  websiteCancelButton: {
    backgroundColor: colors.inputBackground,
  },
  websiteContinueButton: {
    backgroundColor: colors.primary,
  },
  websiteCancelLabel: {
    ...typography.p1,
    color: colors.text,
  },
  websiteContinueLabel: {
    ...typography.p1,
    color: colors.white,
  },
  contentSection: {
    width: '100%',
    marginBottom: 12,
  },
  contentSectionBlocks: {
    gap: 12,
  },
  resourceCard: {
    gap: 4,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#F6F7F9',
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceDetails: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  resourceTitle: {
    ...typography.p2,
    color: colors.text,
    fontWeight: '700',
  },
  resourceDescription: {
    ...typography.p3,
    color: colors.textMuted,
  },
  resourceUrl: {
    ...typography.p3,
    width: '100%',
    color: colors.primary,
  },
  resourceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  resourceAction: {
    minWidth: 34,
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  resourceActionLabel: {
    ...typography.p3,
    color: colors.white,
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
  guideButton: {
    minHeight: 48,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
});
