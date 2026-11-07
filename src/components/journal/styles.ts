import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { fontFamilies, typography } from '@/styles/typography';

const screenContainerBase = {
  flex: 1,
  backgroundColor: colors.white,
} as const;

// Top bar with a bottom border (entry form and entry detail)
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
    // Leaves room for the floating Safe Exit button in the top right
    paddingRight: 56,
  },
  titleText: {
    ...typography.h2,
    color: colors.black,
  },
  searchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  searchBarContainer: {
    flex: 1,
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
  filterButtonContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
  },
  // Shows a filter or non-default sort is on even when the popup is closed
  filterButtonActiveContainer: {
    backgroundColor: colors.primaryLight,
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  activeFilterChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: 6,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  activeFilterChipText: {
    ...typography.p3,
    color: colors.primary,
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

// Entry form (New Entry and Edit Entry screens)
export const entryFormStyles = StyleSheet.create({
  container: screenContainerBase,
  flexContainer: {
    flex: 1,
  },
  headerContainer: {
    ...headerBarContainerBase,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // Leaves room for the floating Safe Exit button in the top right
    paddingRight: 72,
    // Tall enough that the bottom border sits below the Safe Exit button
    minHeight: 56,
  },
  // Keeps the actions together when the Discard button is showing
  headerGroupedContainer: {
    justifyContent: 'flex-start',
    columnGap: 20,
  },
  cancelText: headerTextBase,
  saveText: {
    ...headerTextBase,
    fontFamily: fontFamilies.montserratBold,
    color: colors.black,
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
    minHeight: 52,
  },
});

// Entry detail screen
export const entryDetailStyles = StyleSheet.create({
  container: screenContainerBase,
  headerContainer: {
    ...headerBarContainerBase,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // Leaves room for the floating Safe Exit button in the top right
    paddingRight: 72,
    // Tall enough that the bottom border sits below the Safe Exit button
    minHeight: 56,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  backText: headerTextBase,
  // Floats over the entry at the bottom right
  editButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  editIcon: {
    width: 19,
    height: 19,
  },
  editButtonText: {
    ...typography.montserratBody,
    fontWeight: '600',
    fontSize: 16,
    color: colors.white,
  },
  scrollContentContainer: {
    ...scrollContentContainerBase,
    // Lets the end of a long entry scroll clear of the Edit button
    paddingBottom: 88,
  },
  dateRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    ...typography.p2,
    color: colors.textMuted,
  },
  titleText: entryTitleTextBase,
  divider: dividerBase,
  bodyText: {
    ...typography.p1,
    color: colors.text,
    lineHeight: 26,
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

// Dimmed background and Safe Exit button shared by every popup
export const popupModalStyles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // Matches the Safe Exit button's position in the tabs layout
  safeExitButton: {
    position: 'absolute',
    right: 16,
  },
});

// Filter and sort popup on the journal list
export const filterModalStyles = StyleSheet.create({
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    rowGap: 8,
  },
  titleText: {
    ...typography.h4,
    color: colors.black,
  },
  sectionLabelText: {
    ...typography.p3,
    fontFamily: fontFamilies.montserratBold,
    color: colors.primary,
    letterSpacing: 0.5,
    paddingTop: 8,
  },
  monthList: {
    maxHeight: 220,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  optionIndented: {
    paddingLeft: 16,
  },
  optionText: {
    ...typography.p1,
    color: colors.text,
  },
  optionSelectedText: {
    color: colors.primary,
  },
  doneButtonContainer: {
    width: '100%',
    marginTop: 8,
  },
});

// "Changes saved!" style message above the tab bar
export const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 16,
    width: 289,
    backgroundColor: colors.toastBackground,
    borderRadius: 10,
    padding: 12,
    // Lets taps reach whatever is underneath
    pointerEvents: 'none',
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  messageText: {
    ...typography.p2,
    color: colors.white,
  },
});

// Save / Discard / Delete confirmation popup
export const confirmModalStyles = StyleSheet.create({
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    rowGap: 8,
  },
  titleText: {
    ...typography.h4,
    color: colors.black,
    marginBottom: 12,
  },
  messageText: {
    ...typography.p2,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
  // Clips the corners too, since a disabled Button resets its own radius
  buttonContainer: {
    width: '100%',
    borderRadius: 12,
  },
  button: {
    minHeight: 48,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.montserratBody,
  },
  secondaryButton: {
    backgroundColor: colors.inputBackground,
  },
  secondaryButtonText: {
    color: colors.black,
  },
});
