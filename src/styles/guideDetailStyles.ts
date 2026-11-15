import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { montserratBold, typography } from '@/styles/typography';

export default StyleSheet.create({
  detailScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  detailContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 8,
  },
  detailImage: {
    width: '100%',
    height: 170,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#E9E9E9',
  },
  detailHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailHeaderLabel: {
    ...typography.p1,
    color: colors.primary,
  },
  detailCategory: {
    ...montserratBold,
    fontSize: 12,
    marginTop: 4,
    color: colors.primary,
  },
  detailTitle: {
    ...typography.h2,
    marginTop: 8,
    marginBottom: 6,
    color: colors.black,
  },
  detailReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  detailReadTime: {
    ...typography.p3,
    color: colors.textMuted,
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  bookmarkButtonSelected: {
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  bookmarkLabel: {
    ...typography.p3,
    color: colors.primary,
  },
  detailSummary: {
    ...typography.p1,
    marginBottom: 20,
    lineHeight: 24,
    color: colors.text,
  },
  detailBody: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  detailBodyText: {
    ...typography.p1,
    lineHeight: 24,
    color: colors.text,
  },
  helpfulSection: {
    marginTop: 20,
  },
  helpfulQuestion: {
    ...montserratBold,
    fontSize: 16,
    marginBottom: 10,
    color: colors.text,
  },
  helpfulOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  helpfulOption: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
  },
  helpfulOptionSelected: {
    backgroundColor: colors.primary,
  },
  helpfulOptionLabel: {
    ...typography.p2,
    color: colors.primary,
  },
  helpfulOptionSelectedLabel: {
    color: colors.white,
  },
  feedbackForm: {
    gap: 10,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F6F7F9',
  },
  feedbackInput: {
    ...typography.p2,
    minHeight: 88,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    color: colors.text,
    backgroundColor: colors.white,
  },
  feedbackFormActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  feedbackSubmitted: {
    ...typography.p3,
    flex: 1,
    color: colors.primary,
  },
  feedbackSubmitButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
  feedbackSubmitDisabled: {
    opacity: 0.5,
  },
  feedbackSubmitLabel: {
    ...typography.p2,
    color: colors.white,
  },
  detailDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 16,
  },
  detailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  detailDotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  detailNavigation: {
    flexDirection: 'row',
    gap: 10,
  },
  detailNavigationButton: {
    flex: 1,
    minHeight: 70,
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.neutralLight,
  },
  detailNavigationNext: {
    backgroundColor: colors.primary,
  },
  detailNavigationDisabled: {
    opacity: 0.45,
  },
  detailNavigationDirection: {
    ...typography.p3,
    color: colors.textMuted,
  },
  detailNavigationNextDirection: {
    color: colors.white,
  },
  detailNavigationTitle: {
    ...montserratBold,
    fontSize: 12,
    color: colors.text,
  },
  detailNavigationNextTitle: {
    color: colors.white,
  },
});
