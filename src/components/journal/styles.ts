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
  gap: 10,
  height: 36,
  backgroundColor: colors.slate100,
  borderRadius: 18,
  paddingHorizontal: 12,
  paddingVertical: 8,
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
  subtitleText: {
    ...typography.p2,
    lineHeight: 20,
    color: colors.slate500,
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
  selectButtonContainer: {
    height: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.slate100,
  },
  selectButtonText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.actionPrimary,
  },
  activeFilterChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    height: 32,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surfaceAccentSubtle,
  },
  activeFilterChipText: {
    ...typography.p2,
    lineHeight: 20,
    color: colors.actionPrimary,
  },
  listContentContainer: {
    // Keeps the last entry scrollable past the New entry button
    paddingBottom: 96,
  },
  sectionHeaderText: {
    ...typography.h4,
    fontFamily: fontFamilies.montserratSemiBold,
    lineHeight: 26,
    color: colors.black,
    paddingTop: 20,
    paddingBottom: 12,
  },
  newEntryButtonContainer: {
    position: 'absolute',
    right: 20,
    // Sits just above the floating tab dock
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 18,
    borderRadius: 24,
    backgroundColor: colors.actionPrimary,
    shadowColor: colors.safeExitShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 6,
  },
  newEntryButtonPressedContainer: {
    opacity: 0.85,
  },
  // Replaces the tab dock while selecting entries
  deleteBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    shadowColor: colors.safeExitShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  deleteButtonContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.actionDanger,
  },
  deleteButtonDisabledContainer: {
    backgroundColor: colors.slate200,
  },
  deleteButtonText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
  },
  deleteButtonDisabledText: {
    color: colors.slate500,
  },
  newEntryButtonText: {
    ...typography.entryLink,
    color: colors.white,
  },
  noEntriesCardContainer: {
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceCard,
  },
  noEntriesTitleText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  noEntriesMessageText: {
    ...typography.p2,
    lineHeight: 20,
    color: colors.black,
  },
  noEntriesLinkText: {
    ...typography.p2,
    lineHeight: 20,
    color: colors.actionPrimary,
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
  // First-time screen when the diary has no entries
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: 64,
  },
  welcomeIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    marginBottom: 24,
  },
  welcomeTitleText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.black,
    marginBottom: 16,
  },
  welcomeMessageText: {
    ...typography.p2,
    lineHeight: 20,
    color: colors.slate600,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  welcomeButtonContainer: {
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.actionPrimary,
    marginBottom: 32,
  },
  welcomeButtonText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
  },
  welcomeLabelText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: colors.actionPrimary,
    marginBottom: 4,
  },
  welcomePromptText: {
    ...typography.p1,
    lineHeight: 22,
    color: colors.black,
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
  // Cancel, Save, and Delete sit together on the left so the Safe Exit pill
  // in the top right never covers them
  headerContainer: {
    ...headerBarContainerBase,
    columnGap: 20,
    paddingHorizontal: 20,
    // Tall enough that the bottom border sits below the Safe Exit button
    minHeight: 56,
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
    fontFamily: fontFamilies.montserratSemiBold,
    color: colors.actionPrimary,
    padding: 0,
  },
  contentInput: {
    ...typography.p1,
    lineHeight: 26,
    color: colors.black,
    padding: 0,
    textAlignVertical: 'top',
  },
  // Gives a new entry a bigger area to tap into; with photos, they sit
  // right under the text instead
  contentInputTall: {
    minHeight: 160,
  },
  // Placeholder only; typed text stays upright
  contentPlaceholderText: {
    fontFamily: fontFamilies.montserratItalic,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 52,
  },
  toolbarButtonContainer: {
    padding: 4,
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
    // Tall enough to fit the Safe Exit button
    minHeight: 56,
    borderBottomWidth: 0,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  backText: {
    ...headerTextBase,
    color: colors.black,
  },
  // Floats over the entry at the bottom right
  editButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 18,
    borderRadius: 24,
    backgroundColor: colors.actionPrimary,
    shadowColor: colors.safeExitShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonPressedContainer: {
    opacity: 0.85,
  },
  editButtonText: {
    ...typography.entryLink,
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
    lineHeight: 20,
    color: colors.slate500,
  },
  titleText: {
    ...entryTitleTextBase,
    fontFamily: fontFamilies.montserratSemiBold,
    color: colors.actionPrimary,
    paddingTop: 6,
  },
  bodyText: {
    ...typography.p1,
    color: colors.black,
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
    backgroundColor: colors.surfaceCard,
    paddingTop: 12,
    paddingLeft: 16,
    rowGap: 12,
  },
  cardFirstContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardLastContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 13,
  },
  cardPressedContainer: {
    backgroundColor: colors.slate100,
  },
  cardRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  cardContentContainer: {
    flex: 1,
    paddingRight: 16,
    rowGap: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.slate400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderWidth: 0,
    backgroundColor: colors.actionPrimary,
  },
  titleRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  photoCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  photoCountText: {
    ...typography.p3,
    lineHeight: 16,
    color: colors.actionPrimary,
  },
  divider: dividerBase,
  titleText: {
    flex: 1,
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
  detailsRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  dateText: {
    ...typography.p3,
    lineHeight: 16,
    color: colors.actionPrimary,
  },
  previewText: {
    ...typography.p3,
    flex: 1,
    lineHeight: 16,
    color: colors.textMuted,
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
  overlaySheetContainer: {
    justifyContent: 'flex-end',
    padding: 0,
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

// Photo thumbnails on the entry detail screen and entry form
export const photoGridStyles = StyleSheet.create({
  sectionContainer: {
    paddingTop: 12,
    rowGap: 12,
  },
  labelText: {
    ...typography.p3,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: colors.slate500,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sits over the photo's top right corner
  removeButtonContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.slate600,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Bottom sheet calendar for changing an entry's date or filtering the list
export const calendarSheetStyles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.slate300,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  titleText: {
    ...typography.h4,
    fontFamily: fontFamilies.montserratSemiBold,
    lineHeight: 26,
    color: colors.black,
  },
  cancelText: {
    ...typography.montserratBody,
    fontSize: 16,
    color: colors.actionPrimary,
  },
  monthRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  monthText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.black,
  },
  calendarContainer: {
    alignSelf: 'stretch',
    rowGap: 4,
  },
  weekRowContainer: {
    flexDirection: 'row',
  },
  weekdayText: {
    ...typography.p3,
    flex: 1,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.slate500,
    paddingBottom: 4,
  },
  dayCellContainer: {
    flex: 1,
    alignItems: 'center',
    rowGap: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTodayCircle: {
    borderWidth: 1,
    borderColor: colors.slate300,
  },
  dayPickedCircle: {
    borderWidth: 0,
    backgroundColor: colors.actionPrimary,
  },
  dayText: {
    ...typography.montserratBody,
    fontSize: 15,
    color: colors.black,
  },
  dayWithEntriesText: {
    fontFamily: fontFamilies.montserratSemiBold,
  },
  dayFutureText: {
    color: colors.slate300,
  },
  dayPickedText: {
    fontFamily: fontFamilies.montserratSemiBold,
    color: colors.white,
  },
  // Always takes up space so rows line up whether or not a day has entries
  entryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  entryDotVisible: {
    backgroundColor: colors.actionPrimary,
  },
  buttonsContainer: {
    alignSelf: 'stretch',
    rowGap: 12,
    paddingTop: 8,
  },
  buttonContainer: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonContainer: {
    backgroundColor: colors.actionPrimary,
  },
  disabledButtonContainer: {
    backgroundColor: colors.slate200,
  },
  secondaryButtonContainer: {
    backgroundColor: colors.slate200,
  },
  buttonText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
  primaryButtonText: {
    color: colors.white,
  },
  disabledButtonText: {
    fontFamily: fontFamilies.montserrat,
    color: colors.slate500,
  },
});

// "Changes saved!" style message above the tab bar
export const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceInverse,
    borderRadius: 12,
    // Lets taps reach whatever is underneath, except the action button
    pointerEvents: 'box-none',
    shadowColor: colors.safeExitShadow,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  // Sits 20px above the floating Edit / New entry button
  raisedContainer: {
    bottom: 88,
  },
  messageText: {
    flex: 1,
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
  },
  actionText: {
    fontFamily: fontFamilies.montserratSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.accentOnInverse,
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
  destructiveButton: {
    backgroundColor: colors.actionDanger,
  },
  destructiveButtonText: {
    fontFamily: fontFamilies.montserratSemiBold,
    color: colors.white,
  },
});
