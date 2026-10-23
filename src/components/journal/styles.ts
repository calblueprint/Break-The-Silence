import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { fontFamilies, typography } from '@/styles/typography';

const screenContainerBase = {
  flex: 1,
  backgroundColor: colors.white,
} as const;

// Top bar with a bottom border (New Entry and entry detail)
const headerBarContainerBase = {
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
} as const;

// "Cancel" / "‹ Journal" header text
const headerTextBase = {
  ...typography.montserratBody,
  fontSize: 17,
  color: colors.text,
} as const;

const scrollContentContainerBase = {
  padding: 20,
  rowGap: 14,
} as const;

const dateChipContainerBase = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  columnGap: 6,
  backgroundColor: colors.inputBackground,
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 6,
} as const;

const dateTextBase = {
  ...typography.p3,
  color: colors.text,
} as const;

const dividerBase = {
  height: 1,
  backgroundColor: colors.border,
} as const;

const entryTitleTextBase = {
  ...typography.h3,
  color: colors.primary,
} as const;

const toolbarRowContainerBase = {
  flexDirection: 'row',
  paddingHorizontal: 20,
  borderTopWidth: 1,
  borderTopColor: colors.border,
} as const;

// Journal list screen
export const journalListStyles = StyleSheet.create({
  container: {
    ...screenContainerBase,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleText: {
    ...typography.h2,
    color: colors.black,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
  },
  searchIcon: {
    width: 16,
    aspectRatio: 1,
  },
  searchInput: {
    ...typography.montserratBody,
    fontSize: 16,
    flex: 1,
    height: '100%',
    color: colors.text,
  },
  listContentContainer: {
    rowGap: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionHeaderText: {
    ...typography.p3,
    fontFamily: fontFamilies.montserratBold,
    color: colors.primary,
    letterSpacing: 0.5,
    paddingTop: 8,
  },
  noResultsText: {
    ...typography.p2,
    color: colors.textMuted,
    textAlign: 'center',
    paddingTop: 40,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
    rowGap: 12,
  },
  emptyTitleText: {
    ...typography.h4,
    color: colors.black,
  },
  emptyMessageText: {
    ...typography.p2,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyButtonContainer: {
    width: '100%',
  },
});

// New Entry screen
export const newEntryStyles = StyleSheet.create({
  container: screenContainerBase,
  flexContainer: {
    flex: 1,
  },
  headerContainer: {
    ...headerBarContainerBase,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cancelText: headerTextBase,
  saveText: {
    ...headerTextBase,
    fontFamily: fontFamilies.montserratBold,
    color: colors.black,
  },
  saveDisabledText: {
    color: colors.textMuted,
  },
  scrollContentContainer: scrollContentContainerBase,
  dateChipContainer: dateChipContainerBase,
  dateText: dateTextBase,
  titleInput: {
    ...entryTitleTextBase,
    padding: 0,
  },
  divider: dividerBase,
  contentInput: {
    ...typography.p2,
    color: colors.text,
    minHeight: 160,
    padding: 0,
    textAlignVertical: 'top',
  },
  // Placeholder only; typed text stays upright
  contentPlaceholderText: {
    fontFamily: fontFamilies.montserratItalic,
  },
  toolbarContainer: {
    ...toolbarRowContainerBase,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  safeExitButtonContainer: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: colors.safeExit,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Entry detail screen
export const entryDetailStyles = StyleSheet.create({
  container: screenContainerBase,
  headerContainer: {
    ...headerBarContainerBase,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: headerTextBase,
  scrollContentContainer: scrollContentContainerBase,
  dateChipContainer: dateChipContainerBase,
  dateText: dateTextBase,
  titleText: entryTitleTextBase,
  divider: dividerBase,
  bodyText: {
    ...typography.p1,
    color: colors.text,
    lineHeight: 22,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    ...typography.p1,
    color: colors.textMuted,
  },
});

// Entry card in the list
export const entryCardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    rowGap: 6,
  },
  cardPressedContainer: {
    backgroundColor: colors.inputBackground,
  },
  dateText: {
    ...typography.p3,
    color: colors.textMuted,
  },
  titleText: {
    ...typography.h4,
    fontSize: 17,
    color: colors.black,
  },
  previewText: {
    ...typography.p2,
    color: colors.text,
  },
});

// Save / Discard confirmation popup
export const confirmModalStyles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    rowGap: 12,
  },
  titleText: {
    ...typography.h4,
    color: colors.black,
  },
  messageText: {
    ...typography.p1,
    color: colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 8,
  },
  buttonText: {
    ...typography.p2,
  },
  secondaryButton: {
    backgroundColor: colors.inputBackground,
  },
  secondaryButtonText: {
    color: colors.text,
  },
});
